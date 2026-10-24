import { cpSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });
for (const nom of ['index.html', 'styles.css', 'app.js', 'rapport.html', 'prototype.html', 'prototype.js', 'prototype-logic.js']) copyFileSync(join(root, 'site-src', nom), join(dist, nom));
copyFileSync(join(root, 'data', 'analyse', 'resultats.json'), join(dist, 'resultats.json'));
mkdirSync(join(dist, 'documents'), { recursive: true });
for (const nom of ['01_etude_metier.md','02_audit_source.md','03_premiers_resultats.md','04_dictionnaire_donnees.md']) copyFileSync(join(root, nom), join(dist, 'documents', nom));
mkdirSync(join(dist, 'sql'), { recursive: true });
copyFileSync(join(root, 'sql', 'analyses.sql'), join(dist, 'sql', 'analyses.sql'));
const donnees = JSON.parse(readFileSync(join(dist, 'resultats.json'), 'utf8'));
if (donnees.analyses.global[0].observations !== 41188) throw new Error('Le site ne contient pas les résultats attendus');
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
process.stdout.write(`Site prêt : ${dist}\n`);
