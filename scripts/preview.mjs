import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.md':'text/markdown; charset=utf-8', '.sql':'text/plain; charset=utf-8' };
createServer((req, res) => {
  try {
    const raw = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = raw === '/' ? '/index.html' : raw;
    const file = normalize(join(root, name));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const data = readFileSync(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404); res.end('Introuvable'); }
}).listen(4173, '127.0.0.1', () => process.stdout.write('Local: http://127.0.0.1:4173/\n'));
