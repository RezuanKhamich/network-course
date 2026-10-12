# Курс «Информационная безопасность для разработчиков»: структура

Источник программы: [roadmap.sh/cyber-security](https://roadmap.sh/cyber-security). Все 289 уникальных тем роадмапа распределены по урокам. Машиночитаемая версия с привязкой «урок → темы» лежит в [structure.json](structure.json); проверка покрытия выполнена скриптом: неохваченных тем нет.

## Принципы

- **Аудитория** — разработчики и начинающие специалисты ИБ. Программирование знают, безопасность — нет. Поэтому упор на то, что разработчик встречает в работе: пароли, TLS, OWASP, логи, облако, инциденты.
- **Защитная подача.** Каждая атака разбирается в формате «как работает → как заметить → как защититься». Наступательные темы (пентест, эксплойты, LOLBAS) даются для понимания и только в рамках легальных лабораторий.
- **Без дублей с курсом «Сети».** Модуль 2 даёт сети глазами защитника и отсылает к курсу «Сети для разработчиков» за подробностями.
- **Формат как у существующих курсов:** 14 модулей (0–13), 69 уроков; в каждом уроке теория 1,5–2,5 тыс. символов HTML и 2 вопроса самопроверки; 12 вопросов в тесте модуля; финальный экзамен из общего банка; глоссарий около 150 терминов.
- **Порядок роадмапа сохранён по смыслу:** IT-фундамент → сети → безопасность (концепции, криптография, атаки, защита, мониторинг, реагирование) → облако. Блоки «Certifications» и «CTFs» вынесены во вводный модуль, «Programming Skills» — в модуль 1.

## Сводка

| № | Модуль | Уроков | Блок roadmap.sh |
|---|---|---|---|
| 0 | Введение в безопасность | 5 | Security Skills (core concepts), Certifications, CTFs |
| 1 | IT-фундамент и операционные системы | 7 | Fundamental IT Skills, Operating Systems, Programming Skills |
| 2 | Сети глазами защитника | 5 | Networking Knowledge |
| 3 | Аутентификация и управление доступом | 5 | Authentication Methodologies, Hardening (ACL, GPO) |
| 4 | Криптография на практике | 5 | Basics of Cryptography, Secure vs Unsecure Protocols |
| 5 | Социальная инженерия | 4 | Attack Types (social) |
| 6 | Сетевые и беспроводные атаки | 6 | Common Attacks (network, wireless) |
| 7 | Атаки на приложения и вредоносное ПО | 6 | Common Attacks (web, memory), Malware |
| 8 | Защита инфраструктуры | 6 | Hardening Concepts, Common Tools |
| 9 | Мониторинг и обнаружение | 5 | Logs, SIEM/SOAR, Threat Intel, Tools for Incident Response |
| 10 | Реагирование на инциденты и форензика | 4 | Incident Response Process, Understand Audience, Forensics |
| 11 | Взгляд атакующего | 5 | Frameworks (Kill Chain, ATT&CK), Hacking Tools, LOLBAS |
| 12 | Управление ИБ: стандарты и комплаенс | 2 | Understand Common Standards, Audience (Compliance, Management) |
| 13 | Безопасность в облаке | 4 | Cloud Skills and Knowledge |

## Уроки и темы роадмапа

### Модуль 0. Введение в безопасность

_CIA-триада, риск, глубокая защита, профессия и этика_

| Урок | Темы roadmap.sh |
|---|---|
| 0.1 Зачем разработчику ИБ: триада CIA | `security-skills-and-knowledge`, `understand-cia-triad` |
| 0.2 Риск, угроза, уязвимость | `understand-the-definition-of-risk`, `known-vs-unknown`, `zero-day`, `apt` |
| 0.3 Глубокая защита, изоляция и Zero Trust | `understand-concept-of-defense-in-depth`, `understand-concept-of-isolation`, `core-concepts-of-zero-trust` |
| 0.4 Профессия: синие, красные, фиолетовые команды и сертификации | `blue--red--purple-teams`, `comptia-a`, `comptia-linux`, `comptia-network`, `ccna`, `comptia-security`, `ceh`, `cisa`, `cism`, `gsec`, `gpen`, `gwapt`, `giac`, `oscp`, `crest`, `cissp` |
| 0.5 Этика, закон и где тренироваться легально | `penetration-testing-rules-of-engagement`, `hackthebox`, `tryhackme`, `vulnhub`, `picoctf`, `pwncollege`, `sans-holiday-hack-challenge` |

### Модуль 1. IT-фундамент и операционные системы

_Железо, ОС, права, CLI, виртуализация и лаборатория_

| Урок | Темы roadmap.sh |
|---|---|
| 1.1 Железо, интерфейсы и беспроводные соединения | `fundamental-it-skills`, `computer-hardware-components`, `connection-types-and-their-function`, `nfc`, `bluetooth`, `wifi`, `infrared` |
| 1.2 Windows, Linux, macOS: установка и различия | `operating-systems`, `windows`, `linux`, `macos`, `installation-and-configuration`, `different-versions-and-differences`, `installing-software-and-applications` |
| 1.3 Командная строка, файлы и диагностика | `navigating-using-gui-and-cli`, `performing-crud-on-files`, `common-commands`, `troubleshooting`, `os-independent-troubleshooting`, `grep`, `head`, `tail`, `cat` |
| 1.4 Права доступа в ОС | `understand-permissions` |
| 1.5 Офисные пакеты и облачные аккаунты как поверхность атаки | `understand-basics-of-popular-suites`, `ms-office-suite`, `google-suite` |
| 1.6 Виртуализация: собираем свою лабораторию | `hypervisor`, `hostos`, `guestos`, `vm`, `vmware`, `virtualbox`, `esxi`, `proxmox` |
| 1.7 Программирование и скрипты для безопасника | `programming-skills`, `python`, `go`, `javascript`, `c`, `bash`, `power-shell` |

### Модуль 2. Сети глазами защитника

_Адресация, устройства, протоколы, порты и инструменты диагностики_

| Урок | Темы roadmap.sh |
|---|---|
| 2.1 Модель OSI, IP-адресация и подсети | `networking-knowledge`, `basics-of-computer-networking`, `understand-the-osi-model`, `basics-of-subnetting`, `public-vs-private-ip-addresses`, `ip`, `cidr`, `subnet-mask`, `default-gateway`, `localhost`, `loopback` |
| 2.2 Устройства, топологии и сегменты сети | `router`, `switch`, `vpn`, `lan`, `wan`, `man`, `wlan`, `star`, `ring`, `mesh`, `bus`, `vlan`, `dmz`, `nat`, `arp` |
| 2.3 Сетевые службы и хранилища | `dhcp`, `dns`, `ntp`, `ipam`, `basics-of-nas-and-san` |
| 2.4 Протоколы и порты, которые нужно знать | `common-protocols-and-their-uses`, `common-ports-and-their-uses`, `ssh`, `rdp`, `ftp`, `sftp`, `http--https`, `ssl--tls`, `ssl-and-tls-basics`, `understand-handshakes` |
| 2.5 Инструменты: ping, nmap, tcpdump, Wireshark | `ping`, `tracert`, `ipconfig`, `nslookup`, `dig`, `netstat`, `route`, `nmap`, `tcpdump`, `iptables`, `packet-sniffers`, `port-scanners`, `protocol-analyzers`, `wireshark`, `hping`, `curl` |

### Модуль 3. Аутентификация и управление доступом

_Кто вы и что вам можно: MFA, SSO, Kerberos, LDAP, привилегии_

| Урок | Темы roadmap.sh |
|---|---|
| 3.1 Аутентификация, авторизация и MFA | `authentication-vs-authorization`, `local-auth`, `mfa--2fa` |
| 3.2 Корпоративная аутентификация: Kerberos, LDAP, RADIUS, SSO | `kerberos`, `ldap`, `radius`, `sso`, `certificates` |
| 3.3 Атаки на учётные данные | `brute-force-vs-password-spray`, `pass-the-hash` |
| 3.4 ACL, групповые политики и минимальные привилегии | `acls`, `acl`, `group-policy`, `jump-server` |
| 3.5 Повышение привилегий | `privilege-escalation` |

### Модуль 4. Криптография на практике

_Хеши, соль, ключи, PKI, TLS и защищённые версии протоколов_

| Урок | Темы roadmap.sh |
|---|---|
| 4.1 Хеширование и соль: как правильно хранить пароли | `hashing`, `salting` |
| 4.2 Симметричное и асимметричное шифрование, обмен ключами | `private-vs-public-keys`, `key-exchange`, `obfuscation` |
| 4.3 PKI и сертификаты | `pki` |
| 4.4 SSL и TLS: что изменилось и почему | `ssl-vs-tls` |
| 4.5 Защищённые и незащищённые протоколы | `ftp-vs-sftp`, `ipsec`, `dnssec`, `ldaps`, `srtp`, `smime` |

### Модуль 5. Социальная инженерия

_Фишинг во всех вариантах, офлайн-приёмы и атаки через сайты_

| Урок | Темы roadmap.sh |
|---|---|
| 5.1 Как работает социальная инженерия | `social-engineering`, `reconnaissance`, `impersonation` |
| 5.2 Фишинг, вишинг, смишинг и уэйлинг | `phishing`, `whishing`, `smishing`, `whaling`, `spam-vs-spim` |
| 5.3 Тайпсквоттинг, watering hole и drive-by | `typo-squatting`, `watering-hole-attack`, `drive-by-attack` |
| 5.4 Физическая безопасность: tailgating, подглядывание, мусор | `shoulder-surfing`, `tailgating`, `dumpster-diving` |

### Модуль 6. Сетевые и беспроводные атаки

_MITM, спуфинг, DoS, атаки на Wi-Fi и VLAN_

| Урок | Темы roadmap.sh |
|---|---|
| 6.1 MITM, спуфинг и отравление DNS | `mitm`, `spoofing`, `dns-poisoning` |
| 6.2 Replay-атаки | `replay-attack` |
| 6.3 DoS и DDoS | `dos-vs-ddos` |
| 6.4 Wi-Fi: от WEP до WPA3 | `wpa-vs-wpa2-vs-wpa3-vs-wep`, `wps`, `eap-vs-peap` |
| 6.5 Evil twin, rogue AP и деаутентификация | `evil-twin`, `rogue-access-point`, `deauth-attack` |
| 6.6 Сегментация, периметр и VLAN hopping | `perimiter-vs-dmz-vs-segmentation`, `vlan-hopping` |

### Модуль 7. Атаки на приложения и вредоносное ПО

_OWASP Top 10, инъекции, CSRF, ошибки памяти, малварь_

| Урок | Темы roadmap.sh |
|---|---|
| 7.1 OWASP Top 10: карта рисков веба | `web-based-attacks-and-owasp10` |
| 7.2 SQL-инъекции | `sql-injection` |
| 7.3 XSS | `xss` |
| 7.4 CSRF и обход каталогов | `csrf`, `directory-traversal` |
| 7.5 Переполнение буфера и утечки памяти | `buffer-overflow`, `memory-leak` |
| 7.6 Как устроено вредоносное ПО | `learn-how-malware-works-and-types` |

### Модуль 8. Защита инфраструктуры

_Харденинг, патчи, межсетевые экраны, IDS/IPS, EDR, бэкапы_

| Урок | Темы roadmap.sh |
|---|---|
| 8.1 Харденинг ОС, патчи и закрытие портов | `operating-system-hardening`, `patching`, `port-blocking` |
| 8.2 Межсетевые экраны и NGFW | `firewall--nextgen-firewall`, `host-based-firewall` |
| 8.3 IDS и IPS, honeypots и sinkholes | `basics-of-ids-and-ips`, `nids`, `nips`, `hips`, `honeypots`, `sinkholes` |
| 8.4 Защита конечных точек: антивирус, EDR, DLP, песочницы | `endpoint-security`, `antivirus`, `antimalware`, `edr`, `dlp`, `sandboxing` |
| 8.5 Контроль доступа к сети: NAC и MAC-фильтрация | `nac-based`, `mac-based` |
| 8.6 Резервные копии и устойчивость | `understand-backups-and-resiliency` |

### Модуль 9. Мониторинг и обнаружение

_Логи, SIEM, ложные срабатывания, threat intel и проверка индикаторов_

| Урок | Темы roadmap.sh |
|---|---|
| 9.1 Какие логи собирать и где их искать | `event-logs`, `syslogs`, `netflow`, `firewall-logs`, `packet-captures` |
| 9.2 SIEM и SOAR | `siem`, `soar` |
| 9.3 Ложные и истинные срабатывания | `false-negative--false-positive`, `true-negative--true-positive` |
| 9.4 Threat intelligence, OSINT и охота на угрозы | `basics-of-threat-intel-osint`, `basics-and-concepts-of-threat-hunting` |
| 9.5 Проверка подозрительных файлов и ссылок | `virustotal`, `urlscan`, `anyrun`, `joe-sandbox`, `urlvoid`, `whois` |

### Модуль 10. Реагирование на инциденты и форензика

_Процесс IR от подготовки до разбора, ранбуки, сбор улик_

| Урок | Темы roadmap.sh |
|---|---|
| 10.1 Процесс реагирования: шесть этапов | `preparation`, `identification`, `containment`, `eradication`, `recovery`, `lessons-learned` |
| 10.2 Ранбуки и коммуникации во время инцидента | `understand-concept-of-runbooks`, `stakeholders`, `hr`, `legal` |
| 10.3 Основы цифровой криминалистики | `understand-basics-of-forensics`, `dd`, `memdump`, `ftk-imager`, `autopsy`, `winhex` |
| 10.4 Основы реверс-инжиниринга | `basics-of-reverse-engineering` |

### Модуль 11. Взгляд атакующего

_Kill Chain, ATT&CK, пентест, инструменты и управление уязвимостями_

| Урок | Темы roadmap.sh |
|---|---|
| 11.1 Модели атак: Kill Chain, ATT&CK, Diamond | `cyber-kill-chain`, `kill-chain`, `attck`, `diamond-model` |
| 11.2 Как проходит пентест | `understand-common-hacking-tools`, `kali-linux`, `parrotos` |
| 11.3 Фреймворки эксплуатации | `understand-common-exploit-frameworks` |
| 11.4 Living off the land: LOLBAS и GTFOBins | `lolbas`, `gtfobins`, `wadcoms` |
| 11.5 Управление уязвимостями | `basics-of-vulnerability-management` |

### Модуль 12. Управление ИБ: стандарты и комплаенс

_ISO 27001, NIST, CIS, CSF, RMF, аудит и работа с бизнесом_

| Урок | Темы roadmap.sh |
|---|---|
| 12.1 Стандарты и фреймворки | `iso`, `nist`, `cis`, `csf`, `rmf` |
| 12.2 Комплаенс, аудиторы и руководство | `roles-of-compliance-and-auditors`, `compliance`, `management` |

### Модуль 13. Безопасность в облаке

_Модели облака, разделённая ответственность, IaC, serverless и хранилища_

| Урок | Темы roadmap.sh |
|---|---|
| 13.1 Облако и on-premises: модели и типы | `cloud-skills-and-knowledge`, `understand-the-differences-between-cloud-and-on-premises`, `saas`, `paas`, `iaas`, `private`, `public`, `hybrid` |
| 13.2 Модель разделённой ответственности: AWS, GCP, Azure | `understand-the-concept-of-security-in-the-cloud`, `aws`, `gcp`, `azure` |
| 13.3 Деплой, инфраструктура как код и serverless | `understand-the-basics-and-general-flow-of-deploying-in-the-cloud`, `understand-the-concept-of-infrastructure-as-code`, `understand-the-concept-of-serverless` |
| 13.4 Облачные хранилища: S3, Drive, OneDrive и утечки | `s3`, `dropbox`, `box`, `onedrive`, `google-drive`, `icloud` |

## Интерактивные виджеты

> **Статус.** Готовы модули 0–8, 10, 12, 13 и виджеты cia, perm, brute, hash, certchain, firewall. Модули 9 «Мониторинг» и 11 «Взгляд атакующего», а также виджеты logtriage, ir, attck и cvss пока не сделаны: в курсе эти модули показаны как «скоро».

Виджеты работают только в браузере, без сети и без реального «боевого» кода. Симулятора фишингового письма и песочниц SQLi/XSS в курсе нет: эти темы разобраны на примерах кода в уроках. Встраиваются в урок через `<div data-widget="id"></div>` и собраны на странице «Инструменты».

| id | Урок | Что делает |
|---|---|---|
| `cia` | 0.1 | Пользователь раскладывает 8 инцидентов по C, I, A и получает разбор |
| `perm` | 1.4 | Калькулятор прав Linux: галочки rwx ↔ `chmod 750` ↔ `-rwxr-x---`, предупреждения про 777 и setuid |
| `hash` | 4.1 | SHA-256 через Web Crypto: одинаковые пароли дают одинаковый хеш, соль это ломает; сравнение скорости MD5/SHA-256/bcrypt/Argon2 |
| `brute` | 3.3 | Оценка времени перебора по длине, алфавиту и алгоритму хеширования; разница между brute force и password spraying |
| `certchain` | 4.3 | Цепочка сертификатов: лист → промежуточный → корневой; переключатели «истёк», «не то имя», «самоподписанный» показывают, какую ошибку выдаст браузер |
| `firewall` | 8.2 | Упорядоченный список правил и тестовый пакет: подсвечивается первое сработавшее правило, политика по умолчанию |
| `logtriage` | 9.1 | Фрагмент `auth.log` и журнала веб-сервера: найти строки перебора паролей и успешный вход после него |
| `ir` | 10.1 | Симулятор инцидента: выбрать действия по этапам (изолировать хост, сбросить пароли, снять дамп памяти…); неверный порядок даёт последствия (уничтожены улики, атакующий вернулся) |
| `attck` | 11.1 | Сопоставить события атаки тактикам MITRE ATT&CK и этапам Kill Chain |
| `cvss` | 11.5 | Упрощённый калькулятор CVSS v3.1 базовой оценки и приоритизация исправления |

## Сквозной сценарий «Разбор инцидента»

Аналог «Открываем сайт» и «Как агент работает»: один инцидент по шагам, каждый шаг ведёт в урок.

1. Разведка: OSINT по сотрудникам и домену — 9.4, 5.1
2. Тайпсквоттинг-домен и фишинговое письмо бухгалтеру — 5.2, 5.3
3. Вложение с макросом, запуск вредоноса — 7.6, 1.5
4. Кража учётных данных из памяти — 3.3
5. Повышение привилегий — 3.5
6. Горизонтальное перемещение через pass-the-hash и RDP — 3.3, 2.4
7. Living off the land: PowerShell и certutil вместо своих утилит — 11.4
8. Выгрузка данных в публичный S3-бакет — 13.4
9. Обнаружение: корреляционное правило в SIEM — 9.2, 9.1
10. Сдерживание: изоляция хоста, блокировка учёток — 10.1
11. Криминалистика: образ диска и дамп памяти — 10.3
12. Устранение, восстановление из бэкапа — 10.1, 8.6
13. Разбор: что поменять (MFA, EDR, сегментация, обучение) — 10.1, 0.3

## Шпаргалки

- Порты и протоколы: небезопасный → защищённый вариант (FTP → SFTP, HTTP → HTTPS, LDAP → LDAPS, Telnet → SSH)
- OWASP Top 10 (2021): категория, пример, главная защита
- Хеширование паролей: что использовать (Argon2id, bcrypt, scrypt) и что нет (MD5, SHA-1, «голый» SHA-256)
- Права Linux: восьмеричная и символьная запись, setuid/setgid/sticky
- Этапы реагирования на инциденты (NIST SP 800-61) и Kill Chain
- Тактики MITRE ATT&CK с примерами
- HTTP-заголовки безопасности: CSP, HSTS, X-Content-Type-Options, frame-ancestors, cookie-флаги
- Команды расследования: Linux (`last`, `ss`, `journalctl`, `find -mtime`) и Windows (`Get-WinEvent`, ключевые Event ID 4624/4625/4672/4688/7045)

## Достижения

В `assets/js/game.js` добавить `course-security` («Страж», золото): сдать все тесты курса. Условие `exam-all` и подписи «Двойной диплом» / «Начните оба курса» обобщить на любое число курсов.
