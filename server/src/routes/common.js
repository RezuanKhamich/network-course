export const schemas = {
  email: { type: 'string', format: 'email', maxLength: 254 },
  password: { type: 'string', minLength: 10, maxLength: 128 },
  token: { type: 'string', pattern: '^[A-Za-z0-9_-]{43}$' }
};

export const normEmail = s => String(s || '').trim().toLowerCase();

export async function loadMe(db, userId){
  const { rows } = await db.query('SELECT id, email, created_at FROM users WHERE id = $1', [userId]);
  const u = rows[0];
  return u && { id: Number(u.id), email: u.email, createdAt: u.created_at };
}

// Не больше трёх писем на один адрес в час: регистрация и «забыли пароль» не превращаются в спам-рассылку.
// Счётчик в памяти: сервер запущен одним процессом.
const sent = new Map();
export function mailAllowed(email, now = Date.now()){
  const recent = (sent.get(email) || []).filter(t => now - t < 3600e3);
  if (recent.length >= 3){ sent.set(email, recent); return false; }
  recent.push(now); sent.set(email, recent);
  if (sent.size > 10000) for (const [k, v] of sent) if (v.every(t => now - t >= 3600e3)) sent.delete(k);
  return true;
}
export const resetMailThrottle = () => sent.clear();

export const isUniqueViolation = e => e && e.code === '23505';
