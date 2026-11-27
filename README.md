# Nusantara Stats — Indonesia Archipelagic Statistical Observatory (2015–2024)

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/eziebatozai/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/eziebatozai/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**Nusantara Stats** (Round 2) is an Interactive Archipelagic Statistical
Observatory of Indonesia for make.fun's
[Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
bounty ($50 in USDC, top 10 share). It runs 100% offline as plain static files
under `app/` with zero build step, zero third-party CDNs, and zero network
requests on desktop and mobile browsers.

## What it shows

- **Living Archipelago Observatory (`#/`)** — Bathymetric-navy SVG choropleth
  map of Indonesia (0° Equator, WIB/WITA/WIT meridians, 24 flagship provinces
  across 6 island groups), live metric switcher (GRDP/Capita, HDI, Poverty,
  Unemployment, Population, Life Expectancy), synchronized Province Inspector
  card, 6-card sparkline headline ticker, and interactive **2015–2024
  Turning-Point Decade Scrubber** with Play/Pause playback.
- **Province Versus Comparator (`#/compare`)** — Head-to-head 6-axis Radar
  Chart, Butterfly diverging gap chart in raw units, 24-province GRDP-vs-HDI
  Bubble Scatterplot (linear/log toggle), BPS 2024 38-province HDI tier summary,
  and searchable/sortable provincial table with CSV export.
- **Five Turning Points (`#/turning-points`)** — Interactive 5-chapter narrative
  controlling a synchronized 4-panel decade chart board (Growth vs. CPI, Trade
  Surplus, Urbanization vs. Fertility, Poverty 11.13%→8.57% & HDI 69.55→75.02).
- **Economy, Demographics, Health & Edu, and Labor** — Lazy-loaded domain
  explorers with 9-sector GDP shares & growth, 15-cohort 2024 age-sex pyramid,
  all-38-province 6-island totals, stunting vs. 14% target, 98% JKN coverage,
  4-tier school enrollment, and 8-sector employment structure.

Every figure is sourced and dated (BPS National Accounts, IPM, SUSENAS,
SAKERNAS; World Bank; Ministry of Health Riskesdas/SSGI/SKI; BPJS Kesehatan;
Ministry of Finance).

## Local preview & hand-in

Serve `app/` locally on port 8080:

```sh
node serve.ts
```

Run the deterministic Node 22 hand-in entrypoint:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real Chromium browser renders of the locally
served site. Built by an AI agent for make.fun. Referral code: `s90m223q`.
