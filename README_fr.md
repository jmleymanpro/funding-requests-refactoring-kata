# Funding Requests Refactoring Kata (Angular)

[🇬🇧 English](README.md) · 🇫🇷 Français · [🇳🇱 Nederlands](README_nl.md)

Un kata de refactoring dans l'esprit de [Gilded Rose](https://github.com/emilybache/GildedRose-Refactoring-Kata), mais pour Angular : un écran **fonctionnel** de gestion de demandes de financement, écrit « à l'ancienne » (style Angular 17 : RxJS partout, règles métier dans le composant, état dupliqué, aucun test).

Le but n'est pas de réécrire l'écran, mais de le **mettre sous tests**, d'y **ajouter une règle métier** sans rien casser, puis de le **moderniser** avec les API actuelles d'Angular en expliquant vos choix.

> Le code, les identifiants et l'interface sont en anglais ; ce document en reprend les termes entre parenthèses quand c'est utile.

## Prérequis

- Node.js 22 ou plus récent
- Angular 22 (installé par `npm install`, pas besoin du CLI global)

## Démarrage

```bash
git clone <url-de-ce-depot>
cd funding-requests-refactoring-kata
npm install
npm start        # http://localhost:4200
npm test         # lance les tests (Vitest)
```

Aucun backend n'est nécessaire : `src/app/funding-requests/fake-backend.interceptor.ts` simule l'API REST avec un délai réseau de 400 ms.

## Ce que fait l'écran

- Liste les demandes de financement, filtrables par titre (texte libre) et par institution (liste déroulante).
- Affiche pour chaque demande le **montant accordé** (*grant*), calculé selon les règles ci-dessous.
- Affiche le **total** des montants accordés pour les demandes affichées.
- Propose un formulaire d'édition de la demande sélectionnée (titre, budget demandé, type, dérogation).

## Règles métier (à ne pas casser)

Une **demande de financement** (`FundingRequest`) a : un titre, un type (`RESEARCH`, `DEVELOPMENT`, `INFRA`), un budget demandé (`requestedBudget`), une date limite (`deadline`), une date de dépôt (`submissionDate`), un indicateur de dérogation (`waiver`), et une **institution** de type `UNIVERSITY`, `SME` (PME) ou `NON_PROFIT` (ASBL).

Le **montant accordé** se calcule ainsi :

1. Un budget demandé inférieur à 10 000 € n'est pas éligible : montant 0.
2. Taux de base : 60 % du budget demandé. Institution `SME` : 70 %. Institution `UNIVERSITY` : 80 %.
3. Plafond : 250 000 €. Pour une demande `INFRA`, le plafond est de 500 000 €.
4. Une demande `INFRA` portée par une `SME` perd 10 points de taux.
5. Une demande déposée **après** sa date limite n'est pas éligible (0), **sauf** une demande `RESEARCH` avec dérogation : elle reste éligible avec 10 points de taux en moins.
6. Le montant est arrondi à l'euro.

## Le kata

Time-box conseillée : **2 heures**. Ce que vous n'avez pas eu le temps de faire se note dans `NOTES.md` et fait partie de la discussion.

1. Créez une branche à votre nom.
2. **Mettez les règles de calcul sous tests avant de toucher au code.** Méthode libre ; `src/app/funding-requests/grant.spec.ts` est une amorce, pas une contrainte.
3. **Nouvelle règle** : une demande de type `CONSORTIUM` a un taux de 75 % et un plafond de 400 000 €. Elle doit compter **au moins 2 partenaires** (nouveau champ `partnerCount`), sinon elle n'est pas éligible. La dérogation ne s'applique pas à un consortium.
4. **Modernisez** l'écran avec les API Angular actuelles, dans l'ordre que vous jugez pertinent : gestion des souscriptions, signals / `computed` / `linkedSignal`, `httpResource` ou `rxResource`, Signal Forms pour le formulaire, stratégie de détection de changement (jusqu'au zoneless si vous y arrivez), découpage en composants. Vous n'êtes pas obligé de tout faire : choisissez, et expliquez.
5. Contraintes : ne modifiez pas `fake-backend.interceptor.ts` ; le comportement visible de l'écran ne doit pas changer.
6. Commits atomiques, messages explicites, et un `NOTES.md` (10 lignes max) : ce que vous avez changé, ce que vous avez volontairement gardé en RxJS ou laissé de côté, et pourquoi.

## Structure du projet

```
src/app/
├── app.config.ts                           # providers (zone.js, router, HttpClient + faux backend)
├── app.ts                                  # composant racine
└── funding-requests/
    ├── funding-request.model.ts            # types
    ├── funding-request.service.ts          # accès API (legacy)
    ├── funding-requests-page.component.ts  # l'écran à refactorer (legacy)
    ├── grant.spec.ts                       # amorce de tests
    └── fake-backend.interceptor.ts         # NE PAS MODIFIER
```

## Licence

MIT. Inspiré du Gilded Rose Refactoring Kata d'Emily Bache.
