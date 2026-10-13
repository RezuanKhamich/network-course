import { newToken, tokenHash } from './tokens.js';

export function sessionStore(config){
  const cookieOpts = { httpOnly: true, secure: config.cookieSecure, sameSite: 'lax', path: '/' };
  return {
    async create(db, req, reply, userId){
      const token = newToken();
      const expires = new Date(Date.now() + config.sessionTtlMs);
      await db.query(
        'INSERT INTO sessions (token_hash, user_id, expires_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [tokenHash(token), userId, expires, req.ip, (req.headers['user-agent'] || '').slice(0, 300)]
      );
      reply.setCookie(config.cookieName, token, { ...cookieOpts, expires });
      return tokenHash(token);
    },
    async lookup(db, req){
      const token = req.cookies[config.cookieName];
      if (!token) return null;
      const { rows } = await db.query(
        `UPDATE sessions SET last_seen_at = now() WHERE token_hash = $1 AND expires_at > now()
         RETURNING user_id, token_hash`,
        [tokenHash(token)]
      );
      return rows[0] ? { userId: Number(rows[0].user_id), tokenHash: rows[0].token_hash } : null;
    },
    async destroy(db, req, reply){
      const token = req.cookies[config.cookieName];
      if (token) await db.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash(token)]);
      reply.clearCookie(config.cookieName, cookieOpts);
    },
    async destroyOthers(db, userId, keepHash){
      await db.query('DELETE FROM sessions WHERE user_id = $1 AND token_hash IS DISTINCT FROM $2', [userId, keepHash]);
    },
    clear(reply){ reply.clearCookie(config.cookieName, cookieOpts); }
  };
}
