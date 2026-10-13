#!/usr/bin/env bash
# Первичная настройка VPS (Ubuntu 24.04 или 26.04 LTS) под сайт курсов. Запускать от root на сервере из папки репозитория.
#
# С доменом — HTTPS, сертификат Let's Encrypt, почта по SMTP:
#   DOMAIN=example.ru LE_EMAIL=you@example.ru DEPLOY_PUBKEY="ssh-ed25519 AAAA..." bash deploy/provision.sh
# Временно без домена — HTTP по IP, письма в журнал сервера (трафик не шифруется, только для просмотра):
#   PUBLIC_IP=203.0.113.10 bash deploy/provision.sh
#
# Скрипт можно запускать повторно, в том числе чтобы перейти с IP на домен: пользователи и база не пересоздаются.
set -euo pipefail

DOMAIN=${DOMAIN:-}
PUBLIC_IP=${PUBLIC_IP:-}
DEPLOY_PUBKEY=${DEPLOY_PUBKEY:-}
if [[ -n $DOMAIN ]]; then
  : "${LE_EMAIL:?Укажите LE_EMAIL — почта для уведомлений об истечении сертификата}"
  origin="https://$DOMAIN"
elif [[ -n $PUBLIC_IP ]]; then
  origin="http://$PUBLIC_IP"
else
  echo "Укажите DOMAIN (с LE_EMAIL) или PUBLIC_IP" >&2; exit 1
fi
export DOMAIN
[[ $EUID -eq 0 ]] || { echo "Запустите от root" >&2; exit 1; }

here=$(cd "$(dirname "$0")" && pwd)
export DEBIAN_FRONTEND=noninteractive
step(){ printf '\n\033[1m==> %s\033[0m\n' "$*"; }

step "Пакеты и автоматические обновления безопасности"
apt-get update
apt-get -y upgrade
apt-get install -y nginx postgresql certbot ufw unattended-upgrades rsync ca-certificates curl gnupg gettext-base
dpkg-reconfigure -f noninteractive unattended-upgrades

step "Node.js 22+ (если в системе старее — из репозитория NodeSource)"
node_major=$(node --version 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/') || true
if (( ${node_major:-0} < 22 )); then
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
  apt-get update
  apt-get install -y nodejs
fi
node --version

step "Файл подкачки: при 1 ГБ памяти npm ci во время деплоя может не уместиться"
if ! swapon --show --noheadings | grep -q .; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo 'vm.swappiness=10' > /etc/sysctl.d/90-devcourses-swap.conf
  sysctl -q -p /etc/sysctl.d/90-devcourses-swap.conf
fi

step "Пользователи: devcourses запускает API, deploy принимает выкладку из CI"
id devcourses &>/dev/null || useradd --system --home-dir /nonexistent --shell /usr/sbin/nologin devcourses
id deploy &>/dev/null || useradd --create-home --shell /bin/bash deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
if [[ -n $DEPLOY_PUBKEY ]]; then
  printf '%s\n' "$DEPLOY_PUBKEY" > /home/deploy/.ssh/authorized_keys
  chown deploy:deploy /home/deploy/.ssh/authorized_keys
  chmod 600 /home/deploy/.ssh/authorized_keys
fi
# deploy может только перезапустить API — больше никаких прав root
cat > /etc/sudoers.d/devcourses-deploy <<'EOF'
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart devcourses-api, /usr/bin/systemctl is-active devcourses-api
EOF
chmod 440 /etc/sudoers.d/devcourses-deploy
visudo -cf /etc/sudoers.d/devcourses-deploy
install -d -m 755 -o deploy -g deploy /srv/devcourses /srv/devcourses/web /srv/devcourses/server

step "PostgreSQL: роль и база devcourses, вход только через сокет по имени пользователя ОС"
runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = 'devcourses'" | grep -q 1 || runuser -u postgres -- createuser devcourses
runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname = 'devcourses'" | grep -q 1 || runuser -u postgres -- createdb --owner devcourses devcourses

step "Конфиг API"
install -d -m 750 -o root -g devcourses /etc/devcourses
env_file=/etc/devcourses/api.env
if [[ ! -f $env_file ]]; then
  sed "s/__DOMAIN__/${DOMAIN:-example.ru}/g" "$here/api.env.example" > "$env_file"
  if [[ -z $DOMAIN ]]; then
    # без домена: нет HTTPS — cookie без Secure, нет почты — письма в журнал
    sed -i -E '/^(SMTP_URL|MAIL_FROM)=/d' "$env_file"
    printf 'COOKIE_SECURE=false\nMAIL_TRANSPORT=log\n' >> "$env_file"
  fi
  chown root:devcourses "$env_file"
  chmod 640 "$env_file"
fi
sed -i "s#^APP_ORIGIN=.*#APP_ORIGIN=$origin#" "$env_file"
if [[ -n $DOMAIN ]]; then
  sed -i '/^COOKIE_SECURE=false$/d' "$env_file"
  grep -q '^MAIL_TRANSPORT=log' "$env_file" && echo "ВНИМАНИЕ: в $env_file всё ещё MAIL_TRANSPORT=log — замените на SMTP_URL и MAIL_FROM из deploy/api.env.example" >&2
fi

step "systemd: служба API и ежедневный бэкап"
install -m 644 "$here/systemd/devcourses-api.service" "$here/systemd/devcourses-backup.service" "$here/systemd/devcourses-backup.timer" /etc/systemd/system/
install -m 755 "$here/bin/devcourses-backup" /usr/local/bin/devcourses-backup
install -d -m 700 /var/backups/devcourses
systemctl daemon-reload
systemctl enable devcourses-api
systemctl enable --now devcourses-backup.timer

step "Межсетевой экран: открыты только SSH, HTTP и HTTPS"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

step "SSH: вход только по ключу"
if [[ -s /root/.ssh/authorized_keys ]]; then
  # Match-блок обязателен: образ Рег.ру (99-qemu.conf) разрешает root пароль своим Match User root,
  # и глобальная настройка его не перекрывает; наш блок читается первым и побеждает
  cat > /etc/ssh/sshd_config.d/10-devcourses.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
Match User root
    PasswordAuthentication no
    PermitRootLogin prohibit-password
EOF
  sshd -t
  # с сокет-активацией (Ubuntu 24.10+) служба не работает между подключениями и конфиг читается заново при каждом входе
  if systemctl is-active --quiet ssh; then systemctl reload ssh; fi
  if sshd -T -C user=root,host=check,addr=203.0.113.1 | grep -qx 'passwordauthentication yes'; then
    echo "ВНИМАНИЕ: root всё ещё может входить по паролю — проверьте /etc/ssh/sshd_config.d/" >&2
  fi
else
  echo "ВНИМАНИЕ: у root нет SSH-ключа (/root/.ssh/authorized_keys), вход по паролю оставлен. Добавьте ключ и запустите скрипт снова."
fi

step "nginx"
install -d /var/www/letsencrypt
install -m 644 "$here/nginx/security-headers.conf" /etc/nginx/snippets/devcourses-headers.conf
install -m 644 "$here/nginx/site.conf" /etc/nginx/snippets/devcourses-site.conf
rm -f /etc/nginx/sites-enabled/default
site=/etc/nginx/sites-available/devcourses.conf
if [[ -z $DOMAIN ]]; then
  install -m 644 "$here/nginx/ip-only.conf" "$site"
else
  domains=(-d "$DOMAIN")
  # www — только если для него есть DNS-запись, иначе Let's Encrypt откажет в сертификате
  if getent ahosts "www.$DOMAIN" >/dev/null; then domains+=(-d "www.$DOMAIN"); with_www=1; else with_www=0; echo "www.$DOMAIN не найден в DNS — сертификат только для $DOMAIN"; fi
  if [[ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
    # shellcheck disable=SC2016  # envsubst получает имя переменной буквально, остальные $ в шаблоне — переменные nginx
    envsubst '$DOMAIN' < "$here/nginx/http-only.conf.template" > "$site"
    ln -sf "$site" /etc/nginx/sites-enabled/devcourses.conf
    nginx -t && systemctl reload nginx
  fi
  # повторный запуск дополнит сертификат, если появился www, и не тронет действующий
  certbot certonly --webroot -w /var/www/letsencrypt --cert-name "$DOMAIN" "${domains[@]}" \
    --expand --keep-until-expiring --email "$LE_EMAIL" --agree-tos --no-eff-email --non-interactive \
    --deploy-hook "systemctl reload nginx"
  # shellcheck disable=SC2016
  envsubst '$DOMAIN' < "$here/nginx/devcourses.conf.template" > "$site"
  # shellcheck disable=SC2016
  if [[ $with_www == 1 ]]; then { echo; envsubst '$DOMAIN' < "$here/nginx/www-redirect.conf.template"; } >> "$site"; fi
fi
ln -sf "$site" /etc/nginx/sites-enabled/devcourses.conf
nginx -t && systemctl reload nginx
# api.env мог поменяться (APP_ORIGIN, COOKIE_SECURE) — перечитываем, если API уже работает
systemctl try-restart devcourses-api

step "Готово: $origin"
if [[ -n $DOMAIN ]]; then
  echo "Проверьте SMTP_URL в $env_file, затем запустите деплой из GitHub Actions (docs/deploy.md)."
else
  echo "Режим без домена: трафик не шифруется, письма — в journalctl -u devcourses-api. Выложите код и запустите службу."
fi
