import { hash, verify } from '@node-rs/argon2';
import { createHash } from 'node:crypto';

// argon2id с параметрами из рекомендаций OWASP: 19 МиБ памяти, 2 прохода
const OPTS = { algorithm: 2, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const hashPassword = password => hash(password, OPTS);
export const verifyPassword = (passwordHash, password) => verify(passwordHash, password);

// Хеш для несуществующего пользователя: вход по неизвестному email занимает столько же времени
let dummy;
export async function verifyAgainstDummy(password){
  dummy ??= await hashPassword('dummy-password-for-timing');
  await verify(dummy, password);
  return false;
}

// Have I Been Pwned, k-anonymity: в сеть уходят только первые 5 символов SHA-1.
// Сервис недоступен — не блокируем регистрацию.
export async function isPwned(password, log){
  const sha = createHash('sha1').update(password).digest('hex').toUpperCase();
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${sha.slice(0, 5)}`, {
      headers: { 'Add-Padding': 'true' },
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const suffix = sha.slice(5);
    return (await res.text()).split('\n').some(line => {
      const [s, count] = line.trim().split(':');
      return s === suffix && Number(count) > 0;
    });
  } catch (e){
    log?.warn({ err: e.message }, 'проверка HIBP недоступна');
    return false;
  }
}
