# Premiers résultats SQL — descriptifs

Calculs issus de `sql/analyses.sql`, exécutés par `npm run analyse` ou `node scripts/analyse.mjs` sur le fichier UCI officiel. Les résultats machine sont dans `data/analyse/resultats.json`. Tous les groupes ci-dessous se réconcilient avec 41 188 observations et 4 640 souscriptions.

| Historique de la campagne précédente | Observations | Souscriptions | Taux observé |
|---|---:|---:|---:|
| Aucune (`nonexistent`) | 35 563 | 3 141 | 8,83 % |
| Échec (`failure`) | 4 252 | 605 | 14,23 % |
| Succès (`success`) | 1 373 | 894 | 65,11 % |

**Lecture métier :** l'issue antérieure sépare fortement les taux observés. Toutefois, le groupe `success` est absent des deux premiers quarts du fichier et se concentre surtout dans le dernier. La période est donc une source majeure de confusion. Il serait prématuré d'en faire une règle de priorité. Cela ne démontre pas qu'un nouvel appel à ces personnes aurait un effet incrémental de 65,11 %.

| Nombre de contacts dans la campagne courante | Observations | Taux observé |
|---|---:|---:|
| Un | 17 642 | 13,04 % |
| Deux | 10 570 | 11,46 % |
| Trois à cinq | 9 591 | 9,83 % |
| Six ou plus | 3 385 | 5,49 % |

**Lecture métier :** ces chiffres justifient d'examiner la pression de contact. Ils ne prouvent pas qu'un contact supplémentaire fait baisser la conversion : les personnes difficiles à convertir peuvent justement être rappelées davantage et la variable inclut le contact courant.

Le canal du dernier contact présente 14,74 % pour `cellular` (26 144 observations) et 5,23 % pour `telephone` (15 044). Une différence de période, de population ou de stratégie de sélection peut expliquer une partie de l'écart. Aucun canal « gagnant » ne sera recommandé sur cette seule comparaison.

## Vérification selon l'ordre chronologique fourni par UCI

Chaque quartile compte 10 297 lignes. Les taux globaux sont **3,40 %, 5,95 %, 9,90 % et 25,81 %** de Q1 à Q4. Ces quarts ne sont pas des années : le fichier est déclaré ordonné par date, mais il ne donne pas de date complète pour chaque ligne.

`poutcome = success` n'apparaît qu'en Q3 (130 observations, 40,77 %) et Q4 (1 243 observations, 67,66 %). Même parmi les observations sans campagne précédente, le taux va de 3,40 % en Q1 à 21,08 % en Q4. Les comparaisons globales mélangent donc des contextes très différents. Les chiffres du tableau précédent restent exacts, mais ils ne constituent pas à eux seuls une recommandation de ciblage.

## Suites analytiques nécessaires

1. Examiner les valeurs `unknown` et la stabilité des écarts dans le temps.
2. Contrôler les croisements de variables avant toute règle de priorité.
3. Séparer description rétrospective et vérification hors échantillon.
4. Concevoir le dashboard pour afficher les effectifs avec chaque pourcentage et une note visible sur la causalité et l'éligibilité.
