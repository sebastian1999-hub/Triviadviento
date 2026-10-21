import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { publicConfig } from '../scripts/config.mjs';

test('el build rechaza claves privadas y service_role', () => {
  const jwt = `ey.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')}.test`;
  assert.throws(() => publicConfig({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_ANON_KEY: jwt }));
  assert.throws(() => publicConfig({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_ANON_KEY: 'sb_secret_bad' }));
  assert.throws(() => publicConfig({ SUPABASE_URL: 'https://user:password@project.supabase.co', SUPABASE_ANON_KEY: 'sb_publishable_test' }));
});

test('la publicación no distribuye preguntas, demos ni sourcemaps', async () => {
  const html = await readFile('docs/index.html', 'utf8');
  assert.match(html, /Triviadviento/);
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /questions-demo|try-questions|id="demo"|config\.js/);
  const assets = await readdir('docs/assets');
  assert.equal(assets.filter(x => x.endsWith('.map')).length, 0);
  for (const file of assets.filter(x => x.endsWith('.js'))) {
    const js = await readFile(`docs/assets/${file}`, 'utf8');
    assert.doesNotMatch(js, /sourceMappingURL|previewCategories|correctAnswer|service_role|sb_secret_/);
  }
});
