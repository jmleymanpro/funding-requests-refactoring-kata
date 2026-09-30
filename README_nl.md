# Funding Requests Refactoring Kata (Angular)

[🇬🇧 English](README.md) · [🇫🇷 Français](README_fr.md) · 🇳🇱 Nederlands

Een refactoring-kata in de geest van [Gilded Rose](https://github.com/emilybache/GildedRose-Refactoring-Kata), maar dan voor Angular: een **werkend** scherm voor het beheer van financieringsaanvragen, geschreven "op de oude manier" (Angular 17-stijl: overal RxJS, bedrijfsregels in de component, gedupliceerde state, geen enkele test).

Het doel is niet om het scherm van nul te herschrijven, maar om het **onder test te brengen**, er een **bedrijfsregel aan toe te voegen** zonder iets te breken, en het daarna te **moderniseren** met de huidige Angular-API's, met uitleg bij je keuzes.

> De code, de identifiers en de interface zijn in het Engels; dit document vermeldt de Engelse termen tussen haakjes waar nuttig.

## Vereisten

- Node.js 22 of recenter
- Angular 22 (geïnstalleerd via `npm install`, geen globale CLI nodig)

## Aan de slag

```bash
git clone <url-van-deze-repository>
cd funding-requests-refactoring-kata
npm install
npm start        # http://localhost:4200
npm test         # voert de tests uit (Vitest)
```

Er is geen backend nodig: `src/app/funding-requests/fake-backend.interceptor.ts` simuleert de REST-API met 400 ms netwerkvertraging.

## Wat het scherm doet

- Toont de financieringsaanvragen, filterbaar op titel (vrije tekst) en op instelling (keuzelijst).
- Toont voor elke aanvraag het **toegekende bedrag** (*grant*), berekend volgens de regels hieronder.
- Toont het **totaal** van de toegekende bedragen voor de weergegeven aanvragen.
- Biedt een bewerkingsformulier voor de geselecteerde aanvraag (titel, gevraagd budget, type, afwijking).

## Bedrijfsregels (niet breken)

Een **financieringsaanvraag** (`FundingRequest`) heeft een titel, een type (`RESEARCH`, `DEVELOPMENT`, `INFRA`), een gevraagd budget (`requestedBudget`), een uiterste indieningsdatum (`deadline`), een indieningsdatum (`submissionDate`), een afwijkingsvlag (`waiver`), en een **instelling** van het type `UNIVERSITY`, `SME` (kmo) of `NON_PROFIT` (vzw).

Het **toegekende bedrag** wordt als volgt berekend:

1. Een gevraagd budget onder € 10.000 komt niet in aanmerking: bedrag 0.
2. Basispercentage: 60 % van het gevraagde budget. Instelling `SME`: 70 %. Instelling `UNIVERSITY`: 80 %.
3. Plafond: € 250.000. Voor een `INFRA`-aanvraag bedraagt het plafond € 500.000.
4. Een `INFRA`-aanvraag ingediend door een `SME` verliest 10 procentpunten.
5. Een aanvraag die **na** de uiterste datum werd ingediend, komt niet in aanmerking (0), **behalve** een `RESEARCH`-aanvraag met afwijking: die blijft in aanmerking komen met 10 procentpunten minder.
6. Het bedrag wordt afgerond op de euro.

## De kata

Aanbevolen time-box: **2 uur**. Wat je niet hebt kunnen afwerken, noteer je in `NOTES.md`; dat maakt deel uit van de bespreking.

1. Maak een branch aan met je naam.
2. **Breng de berekeningsregels onder test voordat je de code aanraakt.** De methode is vrij; `src/app/funding-requests/grant.spec.ts` is een aanzet, geen verplichting.
3. **Nieuwe regel**: een aanvraag van het type `CONSORTIUM` heeft een percentage van 75 % en een plafond van € 400.000. Ze moet **minstens 2 partners** tellen (nieuw veld `partnerCount`), anders komt ze niet in aanmerking. De afwijking is niet van toepassing op een consortium.
4. **Moderniseer** het scherm met de huidige Angular-API's, in de volgorde die jij het meest zinvol vindt: beheer van subscriptions, signals / `computed` / `linkedSignal`, `httpResource` of `rxResource`, Signal Forms voor het formulier, change detection-strategie (tot zoneless als je zover geraakt), opsplitsen in componenten. Je hoeft niet alles te doen: kies, en leg uit waarom.
5. Beperkingen: wijzig `fake-backend.interceptor.ts` niet; het zichtbare gedrag van het scherm mag niet veranderen.
6. Atomaire commits met duidelijke berichten, en een `NOTES.md` (max. 10 regels): wat je hebt gewijzigd, wat je bewust in RxJS hebt gelaten of hebt laten liggen, en waarom.

## Projectstructuur

```
src/app/
├── app.config.ts                           # providers (zone.js, router, HttpClient + fake backend)
├── app.ts                                  # rootcomponent
└── funding-requests/
    ├── funding-request.model.ts            # types
    ├── funding-request.service.ts          # API-toegang (legacy)
    ├── funding-requests-page.component.ts  # het te refactoren scherm (legacy)
    ├── grant.spec.ts                       # testaanzet
    └── fake-backend.interceptor.ts         # NIET WIJZIGEN
```

## Licentie

MIT. Geïnspireerd op de Gilded Rose Refactoring Kata van Emily Bache.
