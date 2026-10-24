import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const rapport = readFileSync(join(dist, 'rapport.html'), 'utf8');
const app = readFileSync(join(dist, 'app.js'), 'utf8');
const data = JSON.parse(readFileSync(join(dist, 'resultats.json'), 'utf8'));
for (const ref of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const cible = ref[1];
  if (/^(https?:|#)/.test(cible)) continue;
  const fichier = join(dist, cible.split('#')[0]);
  if (!existsSync(fichier)) throw new Error(`Lien manquant : ${cible}`);
}
if (!rapport.toLowerCase().includes('aucune campagne réelle') || !html.toLowerCase().includes('aucune campagne réelle')) throw new Error('Mention de simulation manquante');
if (!rapport.includes('groupe de comparaison') || !app.includes('aucun effet causal')) throw new Error('Limites méthodologiques manquantes');
const global = data.analyses.global[0];
if (global.observations !== 41188 || global.souscriptions !== 4640) throw new Error('Totaux invalides');
for (const nom of ['campagne_precedente','contacts_precedents','pression_campagne_courante_descriptive','canal_descriptif','contexte_par_quartile']) {
  if (data.analyses[nom].reduce((s, g) => s+g.observations, 0) !== global.observations) throw new Error(`Partition incomplète : ${nom}`);
}
process.stdout.write('Vérification des liens, limites et totaux : OK\n');
