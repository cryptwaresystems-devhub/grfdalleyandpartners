import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
export function staticPreview(): Plugin {
  return { name: 'prerendered-static-preview', configurePreviewServer(server) {
    const dist = resolve(server.config.root, server.config.build.outDir);
    const manifest = JSON.parse(readFileSync(resolve(dist, 'prerender-manifest.json'), 'utf8')) as { paths: string[] };
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://preview.local');
      const path = url.pathname.replace(/\/+$/, '') || '/';
      if (/^\/api(?:\/|$)/.test(path)) { res.statusCode = 404; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ message: 'Use Vercel dev or staging to run serverless functions.' })); return; }
      const alias = path.replace(/^\/industry(?=\/|$)/, '/industries').replace(/^\/practice(?=\/|$)/, '/practices');
      if (alias !== path) { res.statusCode = 308; res.setHeader('Location', alias + url.search); res.end(); return; }
      if (/^\/assets\//.test(path) || ['/robots.txt', '/sitemap.xml', '/prerender-manifest.json'].includes(path)) { next(); return; }
      const known = manifest.paths.includes(path);
      const file = resolve(dist, known ? path === '/' ? 'index.html' : `${path.slice(1)}.html` : '404.html');
      if (!existsSync(file)) { next(); return; }
      res.statusCode = known ? 200 : 404; res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(readFileSync(file));
    });
  } };
}
