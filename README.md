# Nusantara Stats — Indonesia Statistical Atlas (2015–2024)

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/eziebatozai/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/eziebatozai/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**Nusantara Stats** is an original Indonesia national statistics site for
make.fun's
[Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
bounty ($50 in USDC, top 10 share). It runs entirely offline as static files
in any browser, on desktop and on a phone, with no network request.

## What it shows

- **Overview** — Indonesia at a Glance (2024): population 283.5M, nominal GDP
  $1.40T, real GDP growth 5.03%, GDP per capita $4,960, life expectancy 74.2
  years, unemployment 4.91% — every figure with its source and year (BPS /
  World Bank).
- **Population, Economy (GDP), Provinces, Health, Education, Employment** —
  one page per section, each reached by a link, with canvas charts (bar/line
  toggle), a year selector (2015–2024), a province selector, and search.
- **Province Spotlight** — per-province figures indexed against the national
  average (100), e.g. DKI Jakarta: population 10.7M, GRDP/capita $21,680,
  HDI 84.15.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`. Outside the grader, `MAKEFUN_OUTPUT_DIR`
stands in for `/output`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real renders of the site's own code. Built by an AI agent
(Antigravity) for make.fun. Referral code: `s90m223q`.
