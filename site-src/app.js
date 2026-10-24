const formats = {
  entier: new Intl.NumberFormat('fr-FR'),
  taux: new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
};
const configurations = {
  historique: { cle: 'campagne_precedente', titre: 'Issue de la campagne précédente', noms: { nonexistent: 'Aucune', failure: 'Échec', success: 'Succès' }, ordre: ['nonexistent','failure','success'], lecture: 'Les observations après un succès antérieur présentent un taux de souscription élevé. Elles sont surtout concentrées dans la fin du fichier.', limite: 'Association historique. La différence entre périodes empêche d’en faire une règle de ciblage à elle seule.' },
  pression: { cle: 'pression_campagne_courante_descriptive', titre: 'Nombre de contacts dans la campagne courante', noms: { un: 'Un', deux: 'Deux', trois_a_cinq: 'Trois à cinq', six_ou_plus: 'Six ou plus' }, ordre: ['un','deux','trois_a_cinq','six_ou_plus'], lecture: 'Le taux observé est plus faible dans les groupes ayant davantage de contacts.', limite: 'Le nombre de contacts inclut le dernier appel et dépend du déroulement de la campagne : aucun effet causal n’est établi.' },
  canal: { cle: 'canal_descriptif', titre: 'Canal du dernier appel', noms: { cellular: 'Mobile', telephone: 'Téléphone fixe' }, ordre: ['cellular','telephone'], lecture: 'Le canal mobile présente un taux observé supérieur dans ce fichier.', limite: 'Les populations et périodes peuvent différer entre canaux. Ces taux ne mesurent pas l’effet du choix du canal.' }
};

function barre(valeur, maximum = 70) {
  const pourcentage = Math.max(1, Math.min(100, valeur / maximum * 100));
  const element = document.createElement('span');
  element.className = 'bar-fill';
  element.style.width = `${pourcentage}%`;
  return element;
}

function initialiser(donnees) {
  const global = donnees.analyses.global[0];
  document.querySelector('#global-summary').textContent = `${formats.entier.format(global.observations)} observations · ${formats.entier.format(global.souscriptions)} souscriptions · ${formats.taux.format(global.taux_pct)} % au total`;
  const hero = document.querySelector('#hero-bars');
  for (const item of donnees.analyses.contexte_par_quartile) {
    const rang = document.createElement('div'); rang.className = 'hero-row';
    rang.innerHTML = `<span>${item.quartile}</span><div class="track"></div><strong>${formats.taux.format(item.taux_pct)} %</strong>`;
    rang.querySelector('.track').append(barre(item.taux_pct, 30)); hero.append(rang);
  }

  function afficherVue(nom) {
    const config = configurations[nom];
    const lignes = [...donnees.analyses[config.cle]].sort((a,b) => config.ordre.indexOf(a.groupe) - config.ordre.indexOf(b.groupe));
    document.querySelector('#chart-title').textContent = config.titre;
    document.querySelector('#table-caption').textContent = `Effectifs et taux — ${config.titre.toLowerCase()}`;
    document.querySelector('#chart-reading').textContent = config.lecture;
    document.querySelector('#chart-caveat').textContent = config.limite;
    const graphique = document.querySelector('#chart'); graphique.replaceChildren();
    const tbody = document.querySelector('#results-body'); tbody.replaceChildren();
    for (const ligne of lignes) {
      const etiquette = config.noms[ligne.groupe];
      const rang = document.createElement('div'); rang.className = 'chart-row';
      const libelle = document.createElement('span'); libelle.textContent = etiquette;
      const piste = document.createElement('div'); piste.className = 'track'; piste.append(barre(ligne.taux_pct));
      const valeur = document.createElement('strong'); valeur.textContent = `${formats.taux.format(ligne.taux_pct)} %`;
      rang.append(libelle, piste, valeur); graphique.append(rang);
      const tr = document.createElement('tr');
      for (const valeurCellule of [etiquette, formats.entier.format(ligne.observations), formats.entier.format(ligne.souscriptions), `${formats.taux.format(ligne.taux_pct)} %`, `${formats.taux.format(ligne.ic95_bas_pct)}–${formats.taux.format(ligne.ic95_haut_pct)} %`]) {
        const td = document.createElement('td'); td.textContent = valeurCellule; tr.append(td);
      }
      tbody.append(tr);
    }
    for (const bouton of document.querySelectorAll('[data-view]')) {
      const actif = bouton.dataset.view === nom;
      bouton.classList.toggle('active', actif); bouton.setAttribute('aria-pressed', String(actif));
    }
  }
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => afficherVue(b.dataset.view)));
  afficherVue('historique');
}

fetch('resultats.json').then(reponse => {
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  return reponse.json();
}).then(initialiser).catch(() => {
  document.querySelector('#global-summary').textContent = 'Les résultats ne sont pas disponibles. Rechargez la page ou consultez le rapport méthodologique.';
  document.querySelector('#hero-bars').textContent = 'Graphique indisponible.';
  document.querySelector('#chart').textContent = 'Données indisponibles.';
});
