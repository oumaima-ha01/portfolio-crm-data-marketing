# Audit initial du fichier source — 24 octobre 2026

## Provenance

- Page officielle : https://archive.ics.uci.edu/dataset/222/bank+marketing
- Archive téléchargée : `bank_marketing_uci.zip`, SHA-256 `E0BF5F5DE5B846E2F18E9D90606637267D46DFA260E0F17BB12E605DB5EFBEB4`.
- Fichier retenu : `bank-additional/bank-additional-full.csv`, SHA-256 `74ADFC578BF77A7FF4BB1BA4A9F8709D9E3C6907342959C2C8416847E0AFB4D8`.
- Dictionnaire joint à l'archive : `bank-additional-names.txt`.
- Licence affichée par UCI : CC BY 4.0, avec attribution des auteurs.

## Contrôles effectués

Le CSV est séparé par des points-virgules. Lecture du fichier entier : **41 188 lignes** et **21 colonnes**, dont la cible `y`. Répartition de `y` : `yes` 4 640, `no` 36 548, soit environ **11,27 %** de souscriptions dans les observations. Ce taux est descriptif, sans correction de sélection.

La variable `poutcome` contient `success` 1 373, `failure` 4 252 et `nonexistent` 35 563 observations. `pdays = 999` apparaît 39 673 fois. La notice le présente comme une sentinelle pour l'absence de contact antérieur, mais le contrôle croisé avec `previous` montre **4 110 lignes où `pdays = 999` et `previous > 0`** ; 35 563 lignes ont `pdays = 999` et `previous = 0`, et les 1 515 autres ont un nombre de jours et `previous > 0`. La raison précise de cet écart n'est pas documentée. Le code `999` ne peut donc pas être lu isolément comme preuve de l'absence de tout historique. La requête `coherence_historique` reproduit ce contrôle. Les catégories `unknown` sont des valeurs manquantes codées, même si la page UCI affiche « Has Missing Values? No » au sens technique de cellules vides. Leur fréquence est calculée pour les six colonnes concernées dans `resultats.json`.

Le contrôle programmatique trouve **0 champ vide**, **0 valeur inattendue de `y`** et **12 lignes exactement identiques**. Ces lignes sont conservées : sans identifiant stable, une égalité sur les colonnes disponibles ne permet pas d'affirmer qu'il s'agit de doublons de personnes. Parmi les codes `unknown`, on relève notamment 8 597 valeurs de `default`, 1 731 d'`education` et 330 de `job` ; les six colonnes contrôlées figurent dans `resultats.json`.

## Variables et temporalité

| Groupe | Variables | Usage prévu |
|---|---|---|
| Profil déclaré | `age`, `job`, `marital`, `education`, `default`, `housing`, `loan` | Description et examen prudent ; pas de règle opérationnelle automatique fondée sur la démographie. |
| Historique de campagne | `pdays`, `previous`, `poutcome` | Associations historiques à tester ; traiter explicitement `999` et `nonexistent`. |
| Campagne courante | `contact`, `month`, `day_of_week`, `campaign`, `duration` | Analyse descriptive ; disponibilité avant contact à justifier variable par variable. `duration` exclue de toute priorité prospective. |
| Contexte économique | `emp.var.rate`, `cons.price.idx`, `cons.conf.idx`, `euribor3m`, `nr.employed` | Analyse de contexte et de dérive temporelle ; risque de confondre période et comportement. |
| Issue | `y` | Souscription observée, pas effet incrémental d'un appel. |

Le fichier ne contient pas d'identifiant stable, de consentement, d'adresse électronique, de coût de campagne ou de date complète par ligne. On ne peut donc pas importer directement ces observations dans un outil d'automatisation ou déduire un véritable parcours client individuel.

## Point de contrôle avant SQL

Valider pour chaque analyse : la population visée, le dénominateur, les valeurs spéciales, la disponibilité de la variable au moment de la décision et les confusions possibles avec la période. Cette vérification fait partie du travail CRM métier, au même titre que les requêtes.
