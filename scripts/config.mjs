export function publicConfig(env) {
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_ANON_KEY?.trim();
  if (!url && !key) return {};
  if (!url || !key) throw new Error('Falta parte de la configuración pública de Supabase.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/') throw new Error('URL de Supabase no válida.');
  if (key.startsWith('sb_secret_')) throw new Error('Una clave secreta nunca puede publicarse en el navegador.');
  if (key.startsWith('ey')) {
    let claims;
    try { claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url')); } catch { throw new Error('Clave pública no válida.'); }
    if (claims.role !== 'anon') throw new Error('Solo se permiten claves públicas anon.');
  } else if (!key.startsWith('sb_publishable_')) throw new Error('Solo se permite una clave pública de Supabase.');
  return { url: parsed.origin, key };
}
