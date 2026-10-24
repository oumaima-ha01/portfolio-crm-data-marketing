import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(racine, 'data', 'source', 'bank-additional', 'bank-additional-full.csv');

function lireCsv(texte) {
  const lignes = [];
  let ligne = [], cellule = '', guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === '"') {
      if (guillemets && texte[i + 1] === '"') { cellule += '"'; i++; }
      else guillemets = !guillemets;
    } else if (c === ';' && !guillemets) {
      ligne.push(cellule); cellule = '';
    } else if ((c === '\n' || c === '\r') && !guillemets) {
      if (c === '\r' && texte[i + 1] === '\n') i++;
      ligne.push(cellule); cellule = '';
      if (ligne.some(v => v !== '')) lignes.push(ligne);
      ligne = [];
    } else cellule += c;
  }
  if (guillemets) throw new Error('CSV : guillemets non fermés');
  if (cellule || ligne.length) { ligne.push(cellule); lignes.push(ligne); }
  const entetes = lignes.shift();
  for (const [i, ligne] of lignes.entries()) {
    if (ligne.length !== entetes.length) throw new Error(`CSV : ${ligne.length} champs ligne ${i + 2}`);
  }
  return { entetes, lignes };
}

const { entetes, lignes } = lireCsv(readFileSync(source, 'utf8'));
if (entetes.length !== 21 || lignes.length !== 41188) throw new Error('Schéma ou taille UCI inattendus');
const nombres = new Set(['age', 'duration', 'campaign', 'pdays', 'previous', 'emp.var.rate', 'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed']);
const db = new DatabaseSync(':memory:');
db.exec(`CREATE TABLE appels (id INTEGER PRIMARY KEY, ${entetes.map(n => `"${n}" ${nombres.has(n) ? 'REAL' : 'TEXT'}`).join(', ')});`);
const inserer = db.prepare(`INSERT INTO appels VALUES (${['id', ...entetes].map(() => '?').join(',')})`);
db.exec('BEGIN');
for (const [index, ligne] of lignes.entries()) inserer.run(index + 1, ...ligne.map((v, i) => nombres.has(entetes[i]) ? Number(v) : v));
db.exec('COMMIT');

const sql = readFileSync(join(racine, 'sql', 'analyses.sql'), 'utf8');
const blocs = [...sql.matchAll(/-- name: ([\w]+)\s*\n([\s\S]*?);(?=\s*(?:-- name:|$))/g)];
if (blocs.length !== 9) throw new Error('Nombre de requêtes inattendu');
const resultats = { source: 'UCI Bank Marketing / bank-additional-full.csv', lignes: lignes.length, analyses: {} };
for (const [, nom, requete] of blocs) resultats.analyses[nom] = db.prepare(requete).all();
function intervalleWilson(succes, effectif) {
  const z = 1.959963984540054;
  const p = succes / effectif;
  const denominateur = 1 + z*z/effectif;
  const centre = (p + z*z/(2*effectif)) / denominateur;
  const marge = z*Math.sqrt((p*(1-p) + z*z/(4*effectif))/effectif)/denominateur;
  return [Math.round((centre-marge)*10000)/100, Math.round((centre+marge)*10000)/100];
}
for (const groupes of Object.values(resultats.analyses)) {
  for (const groupe of groupes) {
    if (groupe.observations && groupe.souscriptions !== undefined) {
      const [bas, haut] = intervalleWilson(groupe.souscriptions, groupe.observations);
      groupe.ic95_bas_pct = bas; groupe.ic95_haut_pct = haut;
    }
  }
}
resultats.qualite = {
  lignes_vides_champs: lignes.filter(ligne => ligne.some(v => v === '')).length,
  valeurs_y_inattendues: lignes.filter(ligne => !['yes','no'].includes(ligne[20])).length,
  colonnes: entetes.length,
  // Les lignes identiques sont comptées sans être supprimées : aucun identifiant ne permet
  // de conclure qu'elles représentent une seule personne.
  lignes_identiques: lignes.length - new Set(lignes.map(ligne => JSON.stringify(ligne))).size
};
const global = resultats.analyses.global[0];
if (global.observations !== 41188 || global.souscriptions !== 4640) throw new Error('Contrôle des totaux échoué');
for (const nom of ['campagne_precedente', 'contacts_precedents', 'pression_campagne_courante_descriptive', 'canal_descriptif']) {
  const groupes = resultats.analyses[nom];
  if (groupes.reduce((s, g) => s + g.observations, 0) !== global.observations ||
      groupes.reduce((s, g) => s + g.souscriptions, 0) !== global.souscriptions) {
    throw new Error(`Réconciliation échouée : ${nom}`);
  }
}
for (const nom of ['campagne_precedente_par_quartile', 'contexte_par_quartile']) {
  const groupes = resultats.analyses[nom];
  if (groupes.reduce((s, g) => s + g.observations, 0) !== global.observations ||
      groupes.reduce((s, g) => s + g.souscriptions, 0) !== global.souscriptions) {
    throw new Error(`Réconciliation temporelle échouée : ${nom}`);
  }
}
const destination = join(racine, 'data', 'analyse');
mkdirSync(destination, { recursive: true });
writeFileSync(join(destination, 'resultats.json'), JSON.stringify(resultats, null, 2) + '\n');
process.stdout.write(JSON.stringify(resultats.analyses, null, 2) + '\n');
