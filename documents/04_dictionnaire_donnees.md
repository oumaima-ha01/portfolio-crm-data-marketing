# Dictionnaire de données — variante `bank-additional-full.csv`

Source : `bank-additional-names.txt` inclus dans l'[archive UCI](https://archive.ics.uci.edu/dataset/222/bank+marketing). Chaque ligne est une observation de campagne, sans identifiant client stable. Les 20 entrées ci-dessous et la cible `y` sont les colonnes du CSV, dans leur ordre d'origine.

| Colonne | Sens | Précaution analytique |
|---|---|---|
| `age` | Âge de la personne | Donnée démographique ; usage opérationnel à examiner. |
| `job` | Catégorie professionnelle | `unknown` possible. |
| `marital` | Situation matrimoniale | `divorced` englobe divorcé et veuf ; `unknown` possible. |
| `education` | Niveau d'études | Catégories du contexte portugais ; `unknown` possible. |
| `default` | Crédit en défaut | `unknown` possible ; donnée sensible pour la décision. |
| `housing` | Prêt immobilier | `unknown` possible. |
| `loan` | Prêt personnel | `unknown` possible. |
| `contact` | Canal du dernier contact | `cellular` ou `telephone` ; pas une preuve de supériorité causale du canal. |
| `month` | Mois du dernier contact | Aucun millésime individuel explicite. |
| `day_of_week` | Jour de semaine du dernier contact | Aucun jour du mois dans cette variante. |
| `duration` | Durée du dernier appel, secondes | Connue après l'appel ; exclue de la priorisation prospective. |
| `campaign` | Nombre de contacts dans la campagne courante, dernier inclus | Variable de déroulement, non disponible telle quelle avant le premier appel. |
| `pdays` | Jours depuis le dernier contact de campagne antérieure | `999` = pas de contact précédent ; valeur sentinelle. |
| `previous` | Nombre de contacts avant la campagne courante | Historique ; ne donne pas les dates de chaque contact. |
| `poutcome` | Issue de la campagne précédente | `failure`, `nonexistent`, `success`. |
| `emp.var.rate` | Variation trimestrielle de l'emploi | Indicateur agrégé lié à la période. |
| `cons.price.idx` | Indice mensuel des prix à la consommation | Indicateur agrégé lié à la période. |
| `cons.conf.idx` | Indice mensuel de confiance des consommateurs | Indicateur agrégé lié à la période. |
| `euribor3m` | Euribor à trois mois, quotidien | Indicateur agrégé lié à la période. |
| `nr.employed` | Nombre trimestriel de personnes employées | Indicateur agrégé lié à la période. |
| `y` | Souscription d'un dépôt à terme | `yes` ou `no` ; issue observée parmi les observations du fichier. |

## Ce que le fichier ne contient pas

Identifiant client stable, groupe témoin non sollicité, coût par appel, valeur économique de la souscription, consentement, coordonnées de contact et journaux d'emailing. On ne peut pas calculer une valeur vie client, un taux de fidélisation individuel ou un effet causal des sollicitations à partir de ce fichier seul.
