import { contactsTest, evaluerContact } from './prototype-logic.js';
const choix = document.querySelector('#contact');
for (const contact of contactsTest) {
  const option = document.createElement('option'); option.value = contact.id;
  option.textContent = `${contact.id} · ${contact.consentement ? 'accord' : 'sans accord'} · ${contact.historique}`;
  choix.append(option);
}
function afficher() {
  const contact = contactsTest.find(item => item.id === choix.value);
  const resultat = evaluerContact(contact);
  document.querySelector('#decision').textContent = resultat.decision;
  document.querySelector('#raison').textContent = resultat.raison;
  const liste = document.querySelector('#trace'); liste.replaceChildren();
  for (const texte of resultat.traces) { const li = document.createElement('li'); li.textContent = texte; liste.append(li); }
  document.querySelector('#attributs').textContent = `Consentement : ${contact.consentement ? 'oui' : 'non'} · Opposition : ${contact.opposition ? 'oui' : 'non'} · Historique : ${contact.historique}`;
}
choix.addEventListener('change', afficher);
afficher();
