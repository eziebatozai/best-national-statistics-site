// Cover View (Atlas): Headline KPI Sparkline Ticker + Bathymetric Archipelago Map
// + Synchronized Province Inspector + 2015–2024 Turning-Point Decade Scrubber.

import {
  INDICATOR_DIRECTORY,
  MACRO_SERIES,
  NATIONAL_BENCHMARKS,
  TURNING_POINTS,
  YEARS,
  getMacroByYear,
  getPrevMacroByYear,
  getSeriesRange,
  getTurningPointForYear,
} from '../data/national.js';
import { MAP_METRICS, PROVINCES, getProvinceById } from '../data/provinces.js';
import { renderArchipelagoMap } from '../viz/archipelago-map.js';

function sparklineSvg(key, activeYear, color = '#167874') {
  const { min, max } = getSeriesRange(key);
  const span = max - min || 1;
  const w = 64;
  const h = 24;
  const pts = MACRO_SERIES.map((row, i) => {
    const x = 3 + (i / (MACRO_SERIES.length - 1)) * (w - 6);
    const y = h - 4 - ((row[key] - min) / span) * (h - 8);
    return { x, y, year: row.year };
  });
  const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const active = pts.find((p) => p.year === Number(activeYear)) || pts[pts.length - 1];
  return `<svg class="kpi-spark" viewBox="0 0 ${w} ${h}" aria-hidden="true">`
    + `<polyline fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="${poly}"/>`
    + `<circle cx="${active.x.toFixed(1)}" cy="${active.y.toFixed(1)}" r="3.4" fill="#D94E28" stroke="#fff" stroke-width="1.2"/>`
    + `</svg>`;
}

function buildHeadlineCards(year) {
  const cur = getMacroByYear(year);
  const prev = getPrevMacroByYear(year);
  const delta = (fn, invert = false) => {
    if (!prev) return { text: '2015 base', neg: false };
    const diff = fn(cur) - fn(prev);
    const sign = diff > 0 ? '+' : '';
    const neg = invert ? diff > 0 : diff < 0;
    return { text: `${sign}${diff.toFixed(2)}`, neg };
  };

  const growthD = delta((r) => r.gdpGrowth);
  const povD = delta((r) => r.povertyPct, true);
  const popD = { text: `+${cur.popGrowth.toFixed(2)}% YoY`, neg: false };
  const gdpD = prev ? { text: `${cur.gdpUsdB >= prev.gdpUsdB ? '+' : ''}${((cur.gdpUsdB - prev.gdpUsdB) / prev.gdpUsdB * 100).toFixed(1)}%`, neg: cur.gdpUsdB < prev.gdpUsdB } : { text: '2015 base', neg: false };
  const capD = prev ? { text: `${cur.gdpPerCap >= prev.gdpPerCap ? '+' : ''}$${cur.gdpPerCap - prev.gdpPerCap}`, neg: cur.gdpPerCap < prev.gdpPerCap } : { text: '2015 base', neg: false };

  return [
    { label: 'Population', val: `${cur.popM.toFixed(1)}M`, delta: popD, src: `WB/BPS ${cur.year}`, key: 'popM', color: '#167874' },
    { label: 'Nominal GDP', val: cur.gdpUsdB >= 1000 ? `$${(cur.gdpUsdB / 1000).toFixed(2)}T` : `$${cur.gdpUsdB}B`, delta: gdpD, src: `WB/BPS ${cur.year}`, key: 'gdpUsdB', color: '#167874' },
    { label: 'Real GDP Growth', val: `${cur.gdpGrowth.toFixed(2)}%`, delta: { text: `${growthD.text} pp`, neg: cur.gdpGrowth < 0 || growthD.neg }, src: `BPS ${cur.year}`, key: 'gdpGrowth', color: '#D99B26' },
    { label: 'GDP / Capita', val: `$${cur.gdpPerCap.toLocaleString('en-US')}`, delta: capD, src: `WB/BPS ${cur.year}`, key: 'gdpPerCap', color: '#167874' },
    { label: 'Poverty Rate', val: `${cur.povertyPct.toFixed(2)}%`, delta: { text: `${povD.text} pp`, neg: povD.neg }, src: `SUSENAS ${cur.year}`, key: 'povertyPct', color: '#D94E28' },
    { label: 'HDI · Unemp.', val: `${cur.hdi.toFixed(2)}`, delta: { text: `TPT ${cur.unempPct.toFixed(2)}%`, neg: cur.unempPct > 6 }, src: `BPS ${cur.year}`, key: 'hdi', color: '#167874' },
  ];
}

function buildInspectorHtml(prov) {
  const nat = NATIONAL_BENCHMARKS;
  const rows = [
    { name: 'GRDP / Capita', val: `$${prov.grdpPerCap.toLocaleString('en-US')}`, idx: Math.round((prov.grdpPerCap / nat.grdpPerCapitaUsd) * 100), fill: 'accent', goodHigh: true },
    { name: 'Human Dev. Index', val: prov.hdi.toFixed(2), idx: Math.round((prov.hdi / nat.hdi) * 100), fill: '', goodHigh: true },
    { name: 'Poverty Rate (2024)', val: `${prov.poverty.toFixed(2)}%`, idx: Math.round((nat.povertyMarPct / prov.poverty) * 100), fill: 'gold', goodHigh: true, note: `${prov.poverty < nat.povertyMarPct ? 'Better' : 'Higher'} vs 9.03%` },
    { name: 'Open Unemployment', val: `${prov.unemp.toFixed(2)}%`, idx: Math.round((nat.unemploymentPct / prov.unemp) * 100), fill: '', goodHigh: true },
    { name: 'Life Expectancy', val: `${prov.lifeExp.toFixed(1)} yrs`, idx: Math.round((prov.lifeExp / nat.lifeExpectancyYrs) * 100), fill: '', goodHigh: true },
    { name: 'Population · GRDP', val: `${prov.popM.toFixed(1)}M · $${prov.grdpB.toFixed(1)}B`, idx: Math.round((prov.grdpB / 58) * 100), fill: 'gold', goodHigh: true, rawLabel: `${((prov.popM / nat.populationM) * 100).toFixed(1)}% pop` },
  ];

  const partner = prov.id === 'jakarta' ? 'east-kalimantan' : 'jakarta';
  const partnerName = prov.id === 'jakarta' ? 'East Kalimantan' : 'DKI Jakarta';

  return `
    <div>
      <div class="inspector-top">
        <div class="inspector-kicker">
          <span>${prov.region}</span>
          <span class="tz-tag">${prov.tz}</span>
        </div>
        <h3 class="inspector-name">${prov.name}</h3>
        <div class="inspector-sub">Capital: ${prov.capital} · Literacy ${prov.literacy.toFixed(1)}%</div>
        <span class="inspector-tag">${prov.tag}</span>
      </div>

      <div class="bench-list">
        ${rows.map((r) => {
          const clamped = Math.max(8, Math.min(100, r.idx / 2));
          const idxLabel = r.rawLabel ? r.rawLabel : `Idx ${r.idx}`;
          const cls = r.idx >= 100 ? 'good' : (r.idx < 80 ? 'warn' : '');
          return `
            <div class="bench-row">
              <div class="bench-head">
                <span class="bench-name">${r.name}</span>
                <span class="bench-val">${r.val}<span class="bench-idx ${cls}">${idxLabel}</span></span>
              </div>
              <div class="bench-track" title="Vertical mark = Indonesia national average (100)">
                <div class="bench-fill ${r.fill}" style="width:${clamped.toFixed(0)}%"></div>
                <span class="bench-nat-mark" style="left:50%"></span>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <div class="inspector-actions">
      <a class="btn-primary" href="#/compare?a=${prov.id}&b=${partner}">Compare vs. ${partnerName} →</a>
      <div class="inspector-source">National baseline = 100 mark · ${prov.source}</div>
    </div>`;
}

export function renderAtlasHome(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, togglePlay } = ctx;
  const tp = getTurningPointForYear(state.year);
  const prov = getProvinceById(state.selectedProvince);
  const cards = buildHeadlineCards(state.year);
  const milestoneYears = new Set(TURNING_POINTS.map((t) => t.focusYear));

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Indonesia Archipelagic Statistical Observatory</h1>
        <p class="page-subtitle">38 provinces · 6 island groups · 3 time zones — click any province or scrub 2015–2024 to inspect official BPS &amp; World Bank series.</p>
      </div>
      <span class="eyebrow-pill" id="atlas-year-badge">${state.year} · ${tp.shortLabel}</span>
    </div>

    <section class="kpi-ticker" aria-label="National headline indicators">
      ${cards.map((c) => `
        <article class="kpi-tile">
          <div class="kpi-top">
            <span class="kpi-label">${c.label}</span>
          </div>
          <div class="kpi-mid">
            <span class="kpi-val">${c.val}</span>
            ${sparklineSvg(c.key, state.year, c.color)}
          </div>
          <div class="kpi-foot">
            <span class="kpi-delta ${c.delta.neg ? 'neg' : ''}">${c.delta.text}</span>
            <span>${c.src}</span>
          </div>
        </article>`).join('')}
    </section>

    <section class="observatory-grid" aria-label="Interactive Archipelago Map and Province Inspector">
      <div class="map-panel">
        <div class="map-toolbar">
          <div class="map-heading">
            <h2>Living Archipelago Choropleth</h2>
            <span>24 Provinces · BPS 2024</span>
          </div>
          <div class="pill-group" role="group" aria-label="Map indicator selector">
            ${MAP_METRICS.map((m) => `
              <button type="button" class="pill-btn ${state.mapMetric === m.key ? 'active' : ''}" data-metric="${m.key}">${m.label}</button>
            `).join('')}
          </div>
        </div>
        <div class="map-stage" id="archipelago-stage"></div>
      </div>

      <aside class="inspector-card" id="province-inspector" aria-label="Selected province profile">
        ${buildInspectorHtml(prov)}
      </aside>
    </section>

    <section class="scrubber-bar" aria-label="2015 to 2024 Turning-Point Decade Scrubber">
      <div class="scrubber-top">
        <button type="button" id="scrubber-play" class="play-btn ${state.playTimer ? 'playing' : ''}" aria-pressed="${Boolean(state.playTimer)}">
          ${state.playTimer ? '❚❚ Pause' : '▶ Play 2015–24'}
        </button>
        <div class="year-track" role="group" aria-label="Reference year">
          ${YEARS.map((y) => `
            <button type="button" class="year-stop ${y === state.year ? 'active' : ''} ${milestoneYears.has(y) ? 'milestone' : ''}" data-year="${y}">${y}</button>
          `).join('')}
        </div>
      </div>
      <div class="scrubber-bottom">
        <div class="tp-chips" role="group" aria-label="Turning-point milestones">
          ${TURNING_POINTS.map((item) => `
            <button type="button" class="tp-chip ${item.id === tp.id ? 'active' : ''}" data-tp-year="${item.focusYear}">${item.shortLabel}</button>
          `).join('')}
        </div>
        <div class="scrubber-caption"><strong>${tp.title}:</strong> ${tp.takeaway}</div>
      </div>
    </section>

    <div class="section-head">
      <h2>Explore Statistical Domains</h2>
      <span class="card-sub">Every secondary domain module loads on demand</span>
    </div>

    <section class="domain-grid" aria-label="Statistical domain directory">
      <a class="domain-card" href="#/compare">
        <div>
          <span class="domain-kicker">Benchmarks</span>
          <h3>Province Versus Comparator</h3>
          <p>Head-to-head 6-axis Radar, Butterfly gap chart, 24-province bubble scatter, and CSV table.</p>
        </div>
        <span class="domain-stat">DKI Jakarta $21.7k vs. Highland Papua $1.2k →</span>
      </a>
      <a class="domain-card" href="#/turning-points">
        <div>
          <span class="domain-kicker">Decade Narrative</span>
          <h3>Five Turning Points (2015–2024)</h3>
          <p>Synchronized 4-panel macro, trade, demographic, and poverty narrative board.</p>
        </div>
        <span class="domain-stat">Exports $291.9B (2022) · Poverty 8.57% (2024) →</span>
      </a>
      <a class="domain-card" href="#/economy">
        <div>
          <span class="domain-kicker">National Accounts</span>
          <h3>Economy &amp; Sectors</h3>
          <p>9-sector GDP shares and growth, trade surplus, CPI inflation, and poverty series.</p>
        </div>
        <span class="domain-stat">$1.40T GDP · +5.03% Growth · 1.57% CPI →</span>
      </a>
      <a class="domain-card" href="#/demographics">
        <div>
          <span class="domain-kicker">Population &amp; Islands</span>
          <h3>Demographics &amp; 38 Provinces</h3>
          <p>15-cohort 2024 age-sex pyramid, 6-island population vs. GDP shares, urbanization.</p>
        </div>
        <span class="domain-stat">283.5M People · Java 56.1% Pop / 57.1% GDP →</span>
      </a>
      <a class="domain-card" href="#/social">
        <div>
          <span class="domain-kicker">Human Capital</span>
          <h3>Health &amp; Education Hub</h3>
          <p>Stunting vs. 14% target, 98% JKN coverage, 4-tier school enrollment, HDI 75.02.</p>
        </div>
        <span class="domain-stat">74.2 yrs Life Exp · 21.5% Stunting · 96.5% Literacy →</span>
      </a>
      <a class="domain-card" href="#/labor">
        <div>
          <span class="domain-kicker">Workforce</span>
          <h3>Labor &amp; Employment</h3>
          <p>152.1M labor force, decade-low 4.91% unemployment, formal/informal &amp; 8-sector jobs.</p>
        </div>
        <span class="domain-stat">4.91% TPT · 42% Formal · Rp 3.27M Avg Wage →</span>
      </a>
    </section>

    <section class="card" aria-label="National Indicator Quick Reference">
      <div class="table-toolbar">
        <div>
          <h2 class="card-title">National Indicator Quick-Reference (2024 Latest)</h2>
          <p class="card-sub">Filter all 18 flagship BPS, World Bank, MoH, and BPJS Kesehatan national benchmarks.</p>
        </div>
        <input id="dir-filter" class="atlas-filter" type="search" placeholder="Filter indicators…" aria-label="Filter national indicators">
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Domain</th>
              <th class="num">Latest Value</th>
              <th class="num">Prior</th>
              <th class="num">Change</th>
              <th>Source &amp; Year</th>
            </tr>
          </thead>
          <tbody id="dir-tbody">
            ${INDICATOR_DIRECTORY.map((ind) => `
              <tr>
                <td><a href="#/${ind.route}" style="color:var(--ink);font-weight:700;text-decoration:none">${ind.name}</a></td>
                <td>${ind.category}</td>
                <td class="num"><strong>${ind.value}</strong></td>
                <td class="num">${ind.prev}</td>
                <td class="num">${ind.change}</td>
                <td>${ind.source} (${ind.year})</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const stage = root.querySelector('#archipelago-stage');
  renderArchipelagoMap(stage, {
    metricKey: state.mapMetric,
    selectedId: state.selectedProvince,
    onSelect: (id) => setState({ selectedProvince: id }),
    showTooltip,
    hideTooltip,
  });

  root.querySelectorAll('[data-metric]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ mapMetric: btn.dataset.metric }));
  });

  root.querySelectorAll('[data-year]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.playTimer) togglePlay(false);
      setState({ year: Number(btn.dataset.year) });
    });
  });

  root.querySelectorAll('[data-tp-year]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.playTimer) togglePlay(false);
      setState({ year: Number(btn.dataset.tpYear) });
    });
  });

  root.querySelector('#scrubber-play').addEventListener('click', () => togglePlay());

  const dirInput = root.querySelector('#dir-filter');
  const dirBody = root.querySelector('#dir-tbody');
  dirInput.addEventListener('input', () => {
    const q = dirInput.value.trim().toLowerCase();
    const rows = INDICATOR_DIRECTORY.filter((i) => !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.source.toLowerCase().includes(q));
    dirBody.innerHTML = rows.map((ind) => `
      <tr>
        <td><a href="#/${ind.route}" style="color:var(--ink);font-weight:700;text-decoration:none">${ind.name}</a></td>
        <td>${ind.category}</td>
        <td class="num"><strong>${ind.value}</strong></td>
        <td class="num">${ind.prev}</td>
        <td class="num">${ind.change}</td>
        <td>${ind.source} (${ind.year})</td>
      </tr>`).join('') || '<tr><td colspan="6" style="color:var(--muted)">No matching indicator.</td></tr>';
  });
}
