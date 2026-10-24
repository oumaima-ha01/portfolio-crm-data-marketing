# Étude métier et protocole d'analyse — version 1

## 1. Décision à éclairer

Une campagne dispose d'une capacité d'appels limitée. Le responsable CRM doit décider quels contacts éligibles traiter en priorité et quelle pression de contact surveiller. Le résultat observable dans ce jeu est la souscription (`y = yes`) après une campagne téléphonique. Le projet cherche des différences de conversion **associées** aux informations connues avant contact. Il ne mesure ni la rentabilité, ni l'effet incrémental des appels.

La recommandation finale aura la forme d'une **priorité à tester**, et non d'une liste de personnes à contacter automatiquement. En situation réelle, il faudrait vérifier l'éligibilité commerciale, la base légale, le consentement ou l'opposition, les coûts, la capacité des équipes et les règles internes.

## 2. Source et périmètre

Le fichier retenu est `bank-additional-full.csv` : 41 188 lignes, 20 entrées et une cible, ordonné dans le temps de mai 2008 à novembre 2010 selon [UCI](https://archive.ics.uci.edu/dataset/222/bank+marketing). L'étude reste un cas de télémarketing bancaire historique portugais. L'article de Moro et al. (2014) fournit un cadre scientifique, mais son corpus et sa période ne doivent pas être présentés comme strictement identiques à cette extraction publique.

**Unité d'analyse à contrôler lors de l'inspection du fichier :** une ligne représente un enregistrement de campagne et son issue. L'absence d'identifiant client empêche de reconstituer de façon sûre les personnes uniques, une chronologie individuelle ou une fréquence de fidélisation. On parlera d'**observations** et de **groupes d'observations**, pas d'une base clients dédupliquée.

## 3. Cadre CRM métier

La chaîne de décision est : population **autorisée et éligible** → règles de priorité → prise de contact → issue → apprentissage pour la campagne suivante. Le fichier renseigne surtout l'issue et certains attributs de campagne. Il ne renseigne pas l'éligibilité juridique, le coût d'un appel, la marge du dépôt, l'identité du conseiller ni la satisfaction des personnes contactées.

La variable `y` définit la **conversion observée**. L'indicateur principal par groupe sera `nombre de y=yes / nombre d'observations du groupe`, accompagné du dénominateur. Un segment à taux élevé mais très petit effectif ne sera pas présenté comme une priorité robuste. On comparera aussi la part des conversions captées par groupe et la pression de contact (`campaign`), en évitant d'en déduire un effet causal.

## 4. Hypothèses à examiner, sans présumer du résultat

1. L'issue d'une campagne précédente (`poutcome`) est associée à la conversion actuelle.
2. L'intensité de contact (`campaign`) est associée à des taux différents ; l'interprétation est délicate parce que le nombre final d'appels peut dépendre du déroulement même de la campagne.
3. Certains contextes de calendrier et d'environnement économique sont associés à des taux différents. Ils peuvent refléter des changements de population ou de conjoncture.
4. Une règle de priorisation fondée sur peu de variables disponibles avant l'appel pourrait être plus défendable qu'une règle reposant sur des variables connues seulement après.

## 5. Chronologie des variables et risque de fuite

La décision simulée est prise **avant un prochain appel**. `duration`, durée du dernier appel de la campagne courante, doit être exclue des règles de priorité : sa valeur n'est connue qu'après l'appel. UCI avertit explicitement de ce problème. `campaign` inclut le contact courant ; on ne l'utilisera pas tel quel comme prédicteur initial sans définir précisément le moment de décision. `month`, `day_of_week` et `contact` décrivent le dernier contact ; leur utilisation prospective dépend du calendrier et du canal déjà planifiés. `pdays`, `previous` et `poutcome` concernent une campagne antérieure, mais leurs valeurs spéciales doivent être contrôlées dans le fichier et son dictionnaire.

Une première vue descriptive peut montrer toutes ces variables avec leur temporalité. Une analyse de **priorisation avant contact** n'emploiera que celles réellement disponibles à ce moment. Le rapport distinguera ces deux vues. Dans cette variante, `pdays = 999` signifie « pas de contact précédent » ; ce n'est pas une durée de 999 jours.

## 6. Méthode prévue

1. Télécharger l'archive officielle et consigner version, source, empreinte du fichier et licence.
2. Lire le dictionnaire fourni avec l'archive et établir un dictionnaire exact pour la variante `bank-additional-full`.
3. Vérifier nombre de lignes, valeurs manquantes ou codées `unknown`, valeurs extrêmes, doublons exacts et distribution de `y`. Des doublons identiques ne prouvent pas à eux seuls des clients dupliqués.
4. Calculer taux et effectifs par variables métier, puis des croisements limités et justifiés. Définir les groupes avant de sélectionner les résultats à présenter.
5. Tester la stabilité des constats dans des sous-périodes ordonnées. L'absence de date complète ou d'identifiant peut limiter cette vérification.
6. Évaluer une règle simple de priorité hors échantillon, en séparant l'entraînement et la vérification dans l'ordre temporel si l'ordre des lignes le permet. Comparer à une référence non ciblée à capacité égale. Ne pas qualifier cet écart de gain causal ou financier.
7. Restituer les résultats avec effectifs, incertitudes, limites et une proposition de test opérationnel soumis aux règles d'éligibilité.

## 7. Garde-fous d'interprétation

- **Sélection historique :** le fichier ne montre que les observations présentes dans les campagnes passées. Il ne révèle pas les personnes jamais appelées.
- **Causalité :** une meilleure conversion parmi un groupe appelé ne prouve pas qu'un appel supplémentaire produirait cette conversion.
- **Identification :** aucun identifiant stable ne permet de calculer proprement rétention, churn ou valeur vie client.
- **Transposition :** pratiques portugaises de 2008–2010 et environnement français actuel diffèrent. Selon la [CNIL](https://www.cnil.fr/fr/prospection-commerciale-par-telephone-hors-automate-dappel-quelles-sont-les-regles), la prospection téléphonique B2C en France exige en principe le consentement préalable depuis août 2026, avec une exception liée à un contrat en cours. Le dataset ne contient aucune preuve de cette éligibilité.
- **Équité et pertinence :** les variables socio-démographiques ne doivent pas devenir automatiquement des critères opérationnels. Les écarts observés devront être discutés, et une règle réelle nécessiterait validation métier, juridique et éthique.

## 8. Critère de qualité du projet

Une conclusion sera publiée seulement si elle indique : population et période, variable et moment où elle est disponible, effectif, taux, comparaison, incertitude ou stabilité, puis limite. Un tableau de bord sans ces éléments ne suffit pas à soutenir une recommandation.

## 9. Appui scientifique et conséquence pratique

L'article associé au jeu, [Moro, Cortez et Rita (2014)](https://doi.org/10.1016/j.dss.2014.03.001), étudie la prédiction de souscription après télémarketing bancaire. Son apport pour ce portfolio est le **cadrage prédictif** : distinguer les informations utilisables avant l'appel de celles connues après. Le fichier public est décrit par ses auteurs comme presque identique au corpus de l'article, avec des attributs retirés pour préserver la confidentialité.

La recherche sur le [ciblage par effet incrémental](https://www.sciencedirect.com/science/article/pii/S037722172300721X) pose une question différente : quelles personnes changent de comportement **à cause** d'une sollicitation ? Cela nécessite un groupe témoin ou un dispositif causal approprié. Le fichier UCI ne contient pas de groupe non sollicité comparable. Notre analyse peut donc classer des probabilités de souscription **parmi les appels historiques**, mais pas estimer l'effet d'un appel ni le retour sur investissement de la campagne.

Cette distinction guidera la conclusion métier : proposer une règle à évaluer dans un pilote futur, avec population éligible, capacité de contact, groupe de comparaison et métriques définies à l'avance. Elle évite de transformer un taux descriptif en promesse de gain.
