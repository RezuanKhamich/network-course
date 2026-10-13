// Истёкшие сессии и токены, журнал входов старше 90 дней (в нём IP — персональные данные)
export async function cleanup(db){
  await db.query('DELETE FROM sessions WHERE expires_at < now()');
  await db.query(`DELETE FROM email_tokens WHERE expires_at < now() - interval '1 day'`);
  await db.query(`DELETE FROM auth_events WHERE created_at < now() - interval '90 days'`);
}
