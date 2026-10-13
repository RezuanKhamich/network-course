import nodemailer from 'nodemailer';

export function createMailer(config, log){
  if (!config.smtpUrl){
    return {
      async send(msg){ log.info({ to: msg.to, subject: msg.subject }, `письмо (SMTP не настроен):\n${msg.text}`); }
    };
  }
  const transport = nodemailer.createTransport(config.smtpUrl);
  return {
    async send(msg){ await transport.sendMail({ from: config.mailFrom, ...msg }); }
  };
}

export const letters = {
  verify: link => ({
    subject: 'Подтвердите регистрацию',
    text: `Чтобы завершить регистрацию на сайте курсов, откройте ссылку (действует 24 часа):\n\n${link}\n\nЕсли вы не регистрировались, просто проигнорируйте это письмо.`
  }),
  alreadyRegistered: link => ({
    subject: 'Попытка повторной регистрации',
    text: `Кто-то пытался зарегистрироваться с вашим адресом, но аккаунт уже существует.\n\nЕсли это были вы и вы забыли пароль, восстановите его: ${link}\n\nЕсли нет, ничего делать не нужно.`
  }),
  reset: link => ({
    subject: 'Восстановление пароля',
    text: `Чтобы задать новый пароль, откройте ссылку (действует 1 час):\n\n${link}\n\nЕсли вы не запрашивали восстановление, проигнорируйте письмо: пароль не изменится.`
  }),
  passwordChanged: () => ({
    subject: 'Пароль изменён',
    text: 'Пароль от вашего аккаунта на сайте курсов только что изменён. Если это были не вы, восстановите доступ через «Забыли пароль?» на странице входа.'
  })
};
