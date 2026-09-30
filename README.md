# Funding Requests Refactoring Kata (Angular)

🇬🇧 English · [🇫🇷 Français](README_fr.md) · [🇳🇱 Nederlands](README_nl.md)

A refactoring kata in the spirit of [Gilded Rose](https://github.com/emilybache/GildedRose-Refactoring-Kata), but for Angular: a **working** screen for managing funding requests, written "the old way" (Angular 17 style: RxJS everywhere, business rules inside the component, duplicated state, no tests at all).

The goal is not to rewrite the screen from scratch, but to **put it under test**, **add a business rule** without breaking anything, then **modernise** it with current Angular APIs while explaining your choices.

## Prerequisites

- Node.js 22 or later
- Angular 22 (installed by `npm install`, no global CLI needed)

## Getting started

```bash
git clone <this-repository-url>
cd funding-requests-refactoring-kata
npm install
npm start        # http://localhost:4200
npm test         # runs the tests (Vitest)
```

No backend is needed: `src/app/funding-requests/fake-backend.interceptor.ts` simulates the REST API with 400 ms of network latency.

## What the screen does

- Lists funding requests, filterable by title (free text) and by institution (dropdown).
- Shows, for each request, the **granted amount**, computed according to the rules below.
- Shows the **total** of the grants for the requests currently displayed.
- Provides an edit form for the selected request (title, requested budget, type, waiver).

## Business rules (do not break them)

A **funding request** has a title, a type (`RESEARCH`, `DEVELOPMENT`, `INFRA`), a requested budget, a deadline, a submission date, a waiver flag, and an **institution** of type `UNIVERSITY`, `SME` or `NON_PROFIT`.

The **granted amount** is computed as follows:

1. A requested budget below €10,000 is not eligible: the grant is 0.
2. Base rate: 60% of the requested budget. `SME` institution: 70%. `UNIVERSITY` institution: 80%.
3. Cap: €250,000. For an `INFRA` request, the cap is €500,000.
4. An `INFRA` request submitted by an `SME` loses 10 rate points.
5. A request submitted **after** its deadline is not eligible (0), **except** a `RESEARCH` request with a waiver: it remains eligible with 10 rate points less.
6. The amount is rounded to the nearest euro.

## The kata

Suggested time-box: **2 hours**. Whatever you did not have time to do goes into `NOTES.md` and is part of the discussion.

1. Create a branch named after yourself.
2. **Put the grant rules under test before touching the code.** Any approach is fine; `src/app/funding-requests/grant.spec.ts` is a seed, not a constraint.
3. **New rule**: a `CONSORTIUM` request has a 75% rate and a €400,000 cap. It must have **at least 2 partners** (new field `partnerCount`), otherwise it is not eligible. The waiver does not apply to a consortium.
4. **Modernise** the screen with current Angular APIs, in the order you find most relevant: subscription management, signals / `computed` / `linkedSignal`, `httpResource` or `rxResource`, Signal Forms for the form, change detection strategy (up to zoneless if you get there), splitting into components. You do not have to do everything: choose, and explain why.
5. Constraints: do not modify `fake-backend.interceptor.ts`; the visible behaviour of the screen must not change.
6. Atomic commits with explicit messages, and a `NOTES.md` (10 lines max): what you changed, what you deliberately kept in RxJS or left aside, and why.

## Project structure

```
src/app/
├── app.config.ts                           # providers (zone.js, router, HttpClient + fake backend)
├── app.ts                                  # root component
└── funding-requests/
    ├── funding-request.model.ts            # types
    ├── funding-request.service.ts          # API access (legacy)
    ├── funding-requests-page.component.ts  # the screen to refactor (legacy)
    ├── grant.spec.ts                       # test seed
    └── fake-backend.interceptor.ts         # DO NOT MODIFY
```

## Licence

MIT. Inspired by Emily Bache's Gilded Rose Refactoring Kata.
