// Prototype local : aucune donnée réelle, aucun envoi, aucun effet causal estimé.
export const contactsTest = [
  { id: 'T-01', consentement: true, opposition: false, historique: 'success', canal: 'telephone' },
  { id: 'T-02', consentement: false, opposition: false, historique: 'success', canal: 'telephone' },
  { id: 'T-03', consentement: true, opposition: true, historique: 'failure', canal: 'telephone' },
  { id: 'T-04', consentement: true, opposition: false, historique: 'failure', canal: 'telephone' },
  { id: 'T-05', consentement: true, opposition: false, historique: 'nonexistent', canal: 'telephone' }
];

export function evaluerContact(contact) {
  const traces = ['Entrée : contact fictif de démonstration'];
  if (contact.opposition) {
    traces.push('Liste d’opposition : oui', 'Sortie : exclu, aucune action');
    return { decision: 'Exclu', raison: 'Opposition enregistrée', traces };
  }
  traces.push('Liste d’opposition : non');
  if (!contact.consentement) {
    traces.push('Consentement préalable : absent', 'Sortie : exclu, aucune action');
    return { decision: 'Exclu', raison: 'Consentement absent', traces };
  }
  traces.push('Consentement préalable : présent');
  if (contact.historique === 'success') {
    traces.push('Historique : succès précédent', 'Étape : examen humain de la pertinence et du contexte', 'Sortie : candidat à un pilote contrôlé');
    return { decision: 'Revue humaine', raison: 'Hypothèse à tester ; résultat historique non causal', traces };
  }
  traces.push('Historique : autre ou aucun', 'Étape : conserver pour comparaison dans un pilote conçu à l’avance', 'Sortie : aucune sollicitation déclenchée');
  return { decision: 'Comparaison', raison: 'Aucune priorité automatique déduite du taux global', traces };
}
