export function loadConfig(env = process.env){
  const production = env.NODE_ENV === 'production';
  const required = name => {
    const v = env[name];
    if (!v) throw new Error(`Не задана переменная окружения ${name}`);
    return v;
  };
  const appOrigin = new URL(required('APP_ORIGIN')).origin;
  const cookieSecure = env.COOKIE_SECURE ? env.COOKIE_SECURE === 'true' : production;
  // MAIL_TRANSPORT=log — временный режим без почты (сервер без домена): письма пишутся в журнал
  if (production && !env.SMTP_URL && env.MAIL_TRANSPORT !== 'log') throw new Error('В продакшене нужен SMTP_URL (или MAIL_TRANSPORT=log)');
  return {
    production,
    databaseUrl: required('DATABASE_URL'),
    appOrigin,
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT || 3000),
    // адрес прокси, которому верим в X-Forwarded-For; 'true' доверяло бы любой цепочке — и IP можно было бы подделать
    trustProxy: !env.TRUST_PROXY || env.TRUST_PROXY === 'false' ? false : env.TRUST_PROXY === 'true' ? true : env.TRUST_PROXY,
    smtpUrl: env.SMTP_URL || null,
    mailFrom: env.MAIL_FROM || 'no-reply@localhost',
    pwnedCheck: env.PWNED_CHECK !== 'off',
    cookieSecure,
    // __Host- запрещает браузеру принимать cookie с Domain и без Secure
    cookieName: cookieSecure ? '__Host-sid' : 'sid',
    sessionTtlMs: 30 * 864e5,
    verifyTtlMs: 24 * 3600e3,
    resetTtlMs: 3600e3
  };
}
