import { build } from 'esbuild';
import { mkdir, readFile, writeFile, readdir, unlink, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { publicConfig } from './config.mjs';

// Local values are never committed. Only the publishable browser configuration is bundled.
const env = { ...process.env };
try {
  for (const line of (await readFile('.env.local', 'utf8')).split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const config = publicConfig(env);
await mkdir('docs/assets', { recursive: true });
// Clean only generated files directly inside the fixed assets directory.
for (const file of await readdir('docs/assets')) {
  if (/^(app-[a-f0-9]+\.(js|css)|santa-sleigh\.gif|brand-mark\.svg)$/.test(file)) await unlink(`docs/assets/${file}`);
}
const result = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, sourcemap: false,
  write: false, outdir: 'docs/assets', target: 'es2020', legalComments: 'none', charset: 'utf8',
  define: { __PUBLIC_CONFIG__: JSON.stringify(config) }, drop: ['debugger'], metafile: true });
const assets = {};
for (const output of result.outputFiles) {
  const type = output.path.endsWith('.css') ? 'css' : 'js';
  const hash = createHash('sha256').update(output.contents).digest('hex').slice(0, 12);
  const name = `app-${hash}.${type}`;
  await writeFile(`docs/assets/${name}`, output.contents);
  assets[type] = `assets/${name}`;
}
const connect = config.url ? ` 'self' ${config.url}` : " 'self'";
const csp = `default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src${connect}; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests`;
let html = await readFile('src/index.html', 'utf8');
html = html.replace('<!--SECURITY_POLICY-->', `<meta http-equiv="Content-Security-Policy" content="${csp}">`)
  .replace('<!--STYLES-->', `<link rel="stylesheet" href="${assets.css}">`)
  .replace('<!--SCRIPT-->', `<script type="module" src="${assets.js}"></script>`);
await writeFile('docs/index.html', html);
await writeFile('docs/404.html', html);
await copyFile('public/brand-mark.svg', 'docs/assets/brand-mark.svg');
await writeFile('docs/robots.txt', 'User-agent: *\nDisallow: /\n');
await writeFile('docs/.nojekyll', '');
console.log('Triviadviento preparado en docs/ · sin demos ni mapas de código fuente.');
