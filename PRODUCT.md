# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Choix délégué par la consigne d'autonomie : HTML, CSS et JavaScript statiques, avec résultats calculés localement par Node.js et SQLite. Cette solution permet une page publiable et reproductible sans service de données privé.

## Users

Recruteurs et responsables CRM/Data Marketing évaluant la rigueur d'un projet personnel d'Oumaima Hannoun. La propriétaire utilise aussi la page pour présenter et expliquer son travail en entretien.

## Product Purpose

Présenter une étude de cas vérifiable sur les campagnes de télémarketing du jeu UCI Bank Marketing : question métier, méthode, résultats, limites et code reproductible. Le visiteur doit pouvoir comprendre la conclusion rapidement puis inspecter les preuves.

## Operating Context

Projet portfolio consulté dans un navigateur, parfois depuis un lien de candidature. Les données proviennent du fichier public UCI `bank-additional-full.csv`, les calculs du SQL versionné, et les résultats d'un JSON généré par le script local.

## Capabilities and Constraints

- Dashboard interactif avec filtres limités aux agrégats vérifiés, effectifs et taux visibles ensemble.
- Rapport méthodologique et sources accessibles depuis la page.
- Aucun contact réel, aucune campagne effectivement envoyée, aucune conclusion causale.
- Les quartiles reflètent l'ordre chronologique du fichier, pas des dates ou des années identifiables.
- Les résultats sont historiques et portugais ; la page ne prétend pas décrire une campagne française actuelle.

## Evidence on Hand

- `data/analyse/resultats.json` : agrégats issus du CSV officiel et de requêtes SQL exécutées.
- `01_etude_metier.md`, `02_audit_source.md`, `03_premiers_resultats.md`, `04_dictionnaire_donnees.md` : documentation de l'étude.
- `sql/analyses.sql` et `scripts/analyse.mjs` : méthode reproductible.

## Product Principles

- Chaque taux est accompagné de son effectif et de son périmètre.
- Les limitations qui changent une décision sont visibles près du résultat concerné.
- Le code, la source et les choix méthodologiques sont inspectables.
- La page met en avant la qualité du raisonnement avant la quantité d'outils.
