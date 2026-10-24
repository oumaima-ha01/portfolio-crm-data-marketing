import { contactsTest, evaluerContact } from '../site-src/prototype-logic.js';
const attendus = ['Revue humaine','Exclu','Exclu','Comparaison','Comparaison'];
for (const [i, contact] of contactsTest.entries()) {
  const resultat = evaluerContact(contact);
  if (resultat.decision !== attendus[i]) throw new Error(`Décision inattendue : ${contact.id}`);
}
if (contactsTest.some(c => 'email' in c || 'phone' in c || 'nom' in c)) throw new Error('Le prototype ne doit pas contenir de coordonnées');
process.stdout.write('Cinq scénarios fictifs vérifiés : OK\n');
