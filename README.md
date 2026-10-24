# Projet portfolio — priorisation d'une campagne relationnelle

[Voir le dépôt public](https://github.com/oumaima-ha01/portfolio-crm-data-marketing)

**État : étude, analyses SQL, dashboard, rapport et prototype local réalisés.** La publication du site reste à finaliser.

## Question métier

Comment utiliser les informations disponibles **avant un appel** pour prioriser une campagne de proposition de dépôt à terme, sans confondre conversion observée, effet causal d'une sollicitation et autorisation de contacter une personne ?

Le cas s'appuie sur le fichier `bank-additional-full.csv` du [jeu Bank Marketing de l'UCI](https://archive.ics.uci.edu/dataset/222/bank+marketing) : 41 188 observations, 20 variables explicatives, campagnes téléphoniques d'une banque portugaise entre mai 2008 et novembre 2010. Le produit et le canal appartiennent à ce cas historique ; le projet ne prétend pas décrire une entreprise française actuelle.

## Ordre de réalisation

1. [Étude métier et protocole](01_etude_metier.md) : décision à éclairer, unité d'analyse, indicateurs, hypothèses, biais et critères de recommandation.
2. [Vérification du fichier source](02_audit_source.md), [dictionnaire des variables](04_dictionnaire_donnees.md), contrôle qualité et définition des variables connues au moment de la décision.
3. [Premiers résultats](03_premiers_resultats.md) produits par les [requêtes SQL](sql/analyses.sql), avec effectifs et taux. Compléter les analyses de stabilité.
4. [Tableau de bord](site-src/index.html) et [rapport consultable / imprimable](site-src/rapport.html) : constats, incertitudes, recommandations et limites.
5. [Prototype local d'activation](site-src/prototype.html) : cinq contacts fictifs, contrôle du consentement et de l'opposition, revue humaine ; aucun envoi. Aucun accès à une plateforme CRM tierce n'est nécessaire pour l'exécuter.

## Présentation envisagée

Une page portfolio donnera en premier la question, trois constats démontrés et la décision proposée. Le tableau de bord permettra d'explorer les résultats ; un rapport lié expliquera la méthode et les limites. Aucun indicateur ni bénéfice ne sera affiché avant calcul et vérification.

## Reproduire les premiers calculs

Avec Node.js 22 ou plus récent, le CSV officiel et son dictionnaire sont inclus dans `data/source/bank-additional/` sous [licence CC BY 4.0](https://archive.ics.uci.edu/dataset/222/bank+marketing). Aucun compte ni dépendance tierce n'est nécessaire. Exécuter dans cet ordre :

```text
node scripts/analyse.mjs
node scripts/build-site.mjs
node scripts/verify.mjs
node scripts/preview.mjs
```

Ouvrir ensuite `http://127.0.0.1:4173/`. Le premier script charge les observations dans SQLite intégré à Node.js, exécute le SQL versionné, vérifie les partitions et écrit `data/analyse/resultats.json`. Le build prépare `dist/`, que la vérification contrôle. L'archive UCI complète peut aussi être téléchargée depuis la page source et comparée aux empreintes publiées dans l'audit.

## Usage et limites

Il s'agit d'un projet personnel sur des appels portugais historiques. Aucun contact réel n'est importé dans un outil marketing, et aucun résultat ne représente un effet causal ou une campagne menée par Oumaima Hannoun. Les données publiées sont attribuées à Moro, Rita et Cortez conformément à la licence de l'UCI. Pour une réutilisation du code, conserver cette attribution et vérifier séparément les conditions des services de publication.

## Sources principales

- Moro, Rita et Cortez, [Bank Marketing, UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/222/bank+marketing), DOI 10.24432/C5K306, licence CC BY 4.0.
- Moro, Cortez et Rita, [*A Data-Driven Approach to Predict the Success of Bank Telemarketing*](https://repositorio.iscte-iul.pt/bitstream/10071/9499/5/dss_v3.pdf), *Decision Support Systems*, 2014. L'article traite un corpus apparenté mais non identique au fichier public retenu.
- [CNIL, règles de prospection commerciale par téléphone](https://www.cnil.fr/fr/prospection-commerciale-par-telephone-hors-automate-dappel-quelles-sont-les-regles), règles françaises consultées le 24 octobre 2026. Elles servent de contexte pour une éventuelle transposition, pas à qualifier rétroactivement les appels portugais de 2008–2010.
