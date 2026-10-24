-- Toutes les lignes sont des observations d'appels historiques, pas des clients uniques.
-- Les variables campagne courante ne servent ici qu'à une analyse descriptive.

-- name: global
SELECT COUNT(*) AS observations,
       SUM(CASE WHEN y = 'yes' THEN 1 ELSE 0 END) AS souscriptions,
       ROUND(100.0 * AVG(CASE WHEN y = 'yes' THEN 1.0 ELSE 0.0 END), 2) AS taux_pct
FROM appels;

-- name: campagne_precedente
SELECT poutcome AS groupe, COUNT(*) AS observations,
       SUM(CASE WHEN y = 'yes' THEN 1 ELSE 0 END) AS souscriptions,
       ROUND(100.0 * AVG(CASE WHEN y = 'yes' THEN 1.0 ELSE 0.0 END), 2) AS taux_pct
FROM appels GROUP BY poutcome ORDER BY observations DESC;

-- name: contacts_precedents
SELECT CASE WHEN previous = 0 THEN 'aucun'
            WHEN previous = 1 THEN 'un'
            WHEN previous BETWEEN 2 AND 3 THEN 'deux_ou_trois'
            ELSE 'quatre_ou_plus' END AS groupe,
       COUNT(*) AS observations,
       SUM(CASE WHEN y = 'yes' THEN 1 ELSE 0 END) AS souscriptions,
       ROUND(100.0 * AVG(CASE WHEN y = 'yes' THEN 1.0 ELSE 0.0 END), 2) AS taux_pct
FROM appels GROUP BY groupe ORDER BY MIN(previous);

-- name: pression_campagne_courante_descriptive
SELECT CASE WHEN campaign = 1 THEN 'un'
            WHEN campaign = 2 THEN 'deux'
            WHEN campaign BETWEEN 3 AND 5 THEN 'trois_a_cinq'
            ELSE 'six_ou_plus' END AS groupe,
       COUNT(*) AS observations,
       SUM(CASE WHEN y = 'yes' THEN 1 ELSE 0 END) AS souscriptions,
       ROUND(100.0 * AVG(CASE WHEN y = 'yes' THEN 1.0 ELSE 0.0 END), 2) AS taux_pct
FROM appels GROUP BY groupe ORDER BY MIN(campaign);

-- name: canal_descriptif
SELECT contact AS groupe, COUNT(*) AS observations,
       SUM(CASE WHEN y = 'yes' THEN 1 ELSE 0 END) AS souscriptions,
       ROUND(100.0 * AVG(CASE WHEN y = 'yes' THEN 1.0 ELSE 0.0 END), 2) AS taux_pct
FROM appels GROUP BY contact ORDER BY observations DESC;

-- name: valeurs_inconnues
SELECT SUM(job = 'unknown') AS job, SUM(marital = 'unknown') AS marital,
       SUM(education = 'unknown') AS education, SUM("default" = 'unknown') AS defaut_credit,
       SUM(housing = 'unknown') AS pret_immobilier, SUM(loan = 'unknown') AS pret_personnel
FROM appels;

-- name: campagne_precedente_par_quartile
-- L'ordre des lignes est chronologique selon UCI ; le quartile n'est pas une date.
WITH rangs AS (
  SELECT CASE WHEN id <= 10297 THEN 'Q1'
              WHEN id <= 20594 THEN 'Q2'
              WHEN id <= 30891 THEN 'Q3' ELSE 'Q4' END AS quartile,
         poutcome, y FROM appels
)
SELECT quartile, poutcome AS groupe, COUNT(*) AS observations,
       SUM(y = 'yes') AS souscriptions,
       ROUND(100.0 * AVG(y = 'yes'), 2) AS taux_pct
FROM rangs GROUP BY quartile, poutcome ORDER BY quartile, groupe;

-- name: contexte_par_quartile
WITH rangs AS (
  SELECT CASE WHEN id <= 10297 THEN 'Q1'
              WHEN id <= 20594 THEN 'Q2'
              WHEN id <= 30891 THEN 'Q3' ELSE 'Q4' END AS quartile,
         y FROM appels
)
SELECT quartile, COUNT(*) AS observations, SUM(y = 'yes') AS souscriptions,
       ROUND(100.0 * AVG(y = 'yes'), 2) AS taux_pct
FROM rangs GROUP BY quartile ORDER BY quartile;

-- name: coherence_historique
SELECT SUM(CASE WHEN pdays = 999 AND previous = 0 THEN 1 ELSE 0 END) AS sentinelle_sans_historique,
       SUM(CASE WHEN pdays = 999 AND previous > 0 THEN 1 ELSE 0 END) AS sentinelle_avec_historique,
       SUM(CASE WHEN pdays <> 999 AND previous = 0 THEN 1 ELSE 0 END) AS jours_sans_historique,
       SUM(CASE WHEN pdays <> 999 AND previous > 0 THEN 1 ELSE 0 END) AS jours_avec_historique
FROM appels;
