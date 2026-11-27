// Province Versus Comparator View (#/compare):
// Head-to-head 6-Axis Radar, Butterfly Diverging Gap Chart, 24-Province GRDP-vs-HDI Scatter,
// BPS 2024 38-Province HDI Tier summary, and Searchable/Sortable 24-Province Table with CSV Export.

import { NATIONAL_BENCHMARKS } from '../data/national.js';
import { HDI_TIERS_38_2024, PROVINCES, REGION_COLORS, getProvinceById } from '../data/provinces.js';
import { drawBubbleScatter, drawButterflyChart, drawRadarChart } from '../viz/charts-core.js';

const PRESETS = [
  { label: 'Jakarta vs. Nusantara (IKN)', a: 'jakarta', b: 'east-kalimantan' },
  { label: 'Bali vs. NTT', a: 'bali', b: 'ntt' },
  { label: 'West Java vs. Highland Papua', a: 'west-java', b: 'highland-papua' },
];

const REGIONS = ['All', 'Java', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'];

function normalizeRadar(prov) {
  const nat = NATIONAL_BENCHMARKS;
  const clamp = (v) => Math.round(Math.max(30, Math.min(150, v)));
  return [
    clamp(100 + Math.log2(prov.grdpPerCap / nat.grdpPerCapitaUsd) * 24),
    clamp((prov.hdi / nat.hdi) * 100),
    clamp((prov.lifeExp / nat.lifeExpectancyYrs) * 100),
    clamp((prov.literacy / nat.literacyPct) * 100),
    clamp(((100 - prov.poverty) / (100 - nat.povertyMarPct)) * 100),
    clamp(((100 - prov.unemp) / (100 - nat.unemploymentPct)) * 100),
  ];
}

export function renderCompareView(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, registerRedraw, downloadCsv } = ctx;
  const provA = getProvinceById(state.compareA);
  const provB = getProvinceById(state.compareB);
  const nat = NATIONAL_BENCHMARKS;

  const filtered = PROVINCES.filter((p) => {
    const matchReg = state.compareRegion === 'All' || p.region === state.compareRegion;
    const q = state.compareSearch.trim().toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q) || p.region.toLowerCase().includes(q);
    return matchReg && matchQ;
  }).sort((x, y) => {
    const k = state.compareSortKey;
    const dir = state.compareSortDir === 'asc' ? 1 : -1;
    if (typeof x[k] === 'string') return x[k].localeCompare(y[k]) * dir;
    return (x[k] - y[k]) * dir;
  });

  const sortArrow = (k) => (state.compareSortKey === k ? (state.compareSortDir === 'asc' ? ' ▲' : ' ▼') : '');

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Province Versus Comparator</h1>
        <p class="page-subtitle">Benchmark any two flagship provinces against Indonesia’s national baseline across output, human development, poverty, and labor (BPS 2024).</p>
      </div>
      <span class="eyebrow-pill">${provA.shortName} vs. ${provB.shortName}</span>
    </div>

    <section class="compare-bar" aria-label="Province selection and presets">
      <div class="compare-selectors">
        <label class="select-group">
          <span class="swatch a" aria-hidden="true"></span>
          <span class="sr-only">Province A</span>
          <select id="sel-prov-a" class="atlas-select">
            ${PROVINCES.map((p) => `<option value="${p.id}" ${p.id === provA.id ? 'selected' : ''}>${p.name} (${p.region})</option>`).join('')}
          </select>
        </label>
        <button type="button" id="btn-swap-prov" class="btn-secondary" title="Swap Province A and Province B">⇄ Swap</button>
        <label class="select-group">
          <span class="swatch b" aria-hidden="true"></span>
          <span class="sr-only">Province B</span>
          <select id="sel-prov-b" class="atlas-select">
            ${PROVINCES.map((p) => `<option value="${p.id}" ${p.id === provB.id ? 'selected' : ''}>${p.name} (${p.region})</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="pill-group" role="group" aria-label="Analytical comparison presets">
        ${PRESETS.map((pr, idx) => `
          <button type="button" class="pill-btn light ${provA.id === pr.a && provB.id === pr.b ? 'active' : ''}" data-preset="${idx}">${pr.label}</button>
        `).join('')}
      </div>
    </section>

    <section class="grid-2" aria-label="Head-to-head charts">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Six-Axis Indexed Radar (Indonesia = 100)</h2>
            <p class="card-sub">Log-scaled GRDP/capita, HDI, life expectancy, literacy, low-poverty &amp; employment scores.</p>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot round" style="background:var(--vermilion)"></span>${provA.shortName}</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--gold)"></span>${provB.shortName}</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--ink)"></span>IDN Avg (100)</span>
          </div>
        </div>
        <div class="chart-box radar"><canvas id="radar-canvas"></canvas></div>
        <div class="source-note">Source: BPS Regional Accounts, IPM, SUSENAS &amp; SAKERNAS (2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Butterfly Diverging Gap — Raw Official Units</h2>
            <p class="card-sub">${provA.name} (${provA.tag}) vs. ${provB.name} (${provB.tag}).</p>
          </div>
          <span class="eyebrow-pill" style="font-size:10px">BPS 2024</span>
        </div>
        <div class="chart-box radar"><canvas id="butterfly-canvas"></canvas></div>
        <div class="source-note">National ref: $4,960 GRDP/cap · 75.02 HDI · 9.03% Mar poverty · 4.91% TPT · 74.2 yrs life exp.</div>
      </article>
    </section>

    <section class="card" style="margin-bottom:12px" aria-label="24-Province GRDP versus HDI Bubble Scatterplot">
      <div class="card-head">
        <div>
          <h2 class="card-title">Archipelagic Spread: GRDP per Capita vs. HDI (24 Flagship Provinces)</h2>
          <p class="card-sub">Bubble area encodes population · Color encodes island region · Click any province bubble to set as Province B.</p>
        </div>
        <div class="pill-group" role="group" aria-label="Horizontal axis scale">
          <button type="button" class="pill-btn light ${state.compareScale === 'log' ? 'active' : ''}" data-scale="log">Log Scale</button>
          <button type="button" class="pill-btn light ${state.compareScale === 'linear' ? 'active' : ''}" data-scale="linear">Linear Scale</button>
        </div>
      </div>
      <div class="chart-legend">
        ${Object.entries(REGION_COLORS).map(([reg, col]) => `
          <span class="legend-item"><span class="legend-dot round" style="background:${col}"></span>${reg}</span>
        `).join('')}
      </div>
      <div class="chart-box tall"><canvas id="scatter-canvas"></canvas></div>
      <div class="source-note">Source: BPS Regional Accounts &amp; IPM Report (2024). Halo rings mark ${provA.name} (vermilion) and ${provB.name} (gold).</div>
    </section>

    <section class="card" aria-label="Complete 24-Province Flagship Reference Table">
      <div class="tier-strip">
        <div>
          <strong>All ${HDI_TIERS_38_2024.totalProvinces} Provinces — BPS 2024 HDI Tiers (National ${HDI_TIERS_38_2024.nationalHdi}):</strong>
          <span style="color:var(--slate)"> ${HDI_TIERS_38_2024.note}</span>
        </div>
        <div class="tier-badges">
          ${HDI_TIERS_38_2024.tiers.map((t) => `<span class="tier-badge" style="border-left:4px solid ${t.tone}">${t.label}: ${t.count}</span>`).join('')}
        </div>
      </div>

      <div class="table-toolbar">
        <div class="pill-group" role="group" aria-label="Filter by island region">
          ${REGIONS.map((reg) => `<button type="button" class="pill-btn light ${state.compareRegion === reg ? 'active' : ''}" data-region="${reg}">${reg}</button>`).join('')}
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="prov-search" class="atlas-filter" type="search" value="${state.compareSearch}" placeholder="Search 24 provinces…" aria-label="Filter provinces table">
          <button type="button" id="btn-export-prov" class="btn-secondary">↓ Download CSV</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="name">Province${sortArrow('name')}</th>
              <th class="sortable" data-sort="region">Island Region${sortArrow('region')}</th>
              <th class="num sortable" data-sort="popM">Pop (M)${sortArrow('popM')}</th>
              <th class="num sortable" data-sort="grdpB">GRDP ($B)${sortArrow('grdpB')}</th>
              <th class="num sortable" data-sort="grdpPerCap">GRDP/Cap ($)${sortArrow('grdpPerCap')}</th>
              <th class="num sortable" data-sort="hdi">HDI${sortArrow('hdi')}</th>
              <th class="num sortable" data-sort="poverty">Poverty (%)${sortArrow('poverty')}</th>
              <th class="num sortable" data-sort="unemp">Unemp (%)${sortArrow('unemp')}</th>
              <th class="num sortable" data-sort="lifeExp">Life Exp${sortArrow('lifeExp')}</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((p) => {
              const cls = p.id === provA.id ? 'hl-a' : (p.id === provB.id ? 'hl-b' : '');
              return `
                <tr class="${cls}">
                  <td><strong>${p.name}</strong> <span style="color:var(--muted);font-size:11px">(${p.tz})</span></td>
                  <td>${p.region}</td>
                  <td class="num">${p.popM.toFixed(2)}</td>
                  <td class="num">$${p.grdpB.toFixed(1)}B</td>
                  <td class="num"><strong>$${p.grdpPerCap.toLocaleString('en-US')}</strong></td>
                  <td class="num">${p.hdi.toFixed(2)}</td>
                  <td class="num">${p.poverty.toFixed(2)}%</td>
                  <td class="num">${p.unemp.toFixed(2)}%</td>
                  <td class="num">${p.lifeExp.toFixed(1)}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="source-note">Source: BPS Regional Accounts, IPM, SUSENAS (Mar 2024 poverty), and SAKERNAS (2024). Flagship 24-province profile spanning all 6 island groups.</div>
    </section>
  `;

  const drawCharts = () => {
    drawRadarChart(root.querySelector('#radar-canvas'), {
      axes: [
        { label: 'GRDP/Cap' },
        { label: 'HDI' },
        { label: 'Life Exp.' },
        { label: 'Literacy' },
        { label: 'Low Poverty' },
        { label: 'Employment' },
      ],
      seriesA: { name: provA.name, values: normalizeRadar(provA) },
      seriesB: { name: provB.name, values: normalizeRadar(provB) },
    }, { showTooltip, hideTooltip });

    drawButterflyChart(root.querySelector('#butterfly-canvas'), {
      nameA: provA.shortName,
      nameB: provB.shortName,
      rows: [
        { label: 'GRDP / Capita', a: provA.grdpPerCap, b: provB.grdpPerCap, scaleMax: 22000, fmt: (v) => '$' + Math.round(v).toLocaleString('en-US'), natLabel: '$4,960' },
        { label: 'HDI (2024)', a: provA.hdi, b: provB.hdi, scaleMax: 86, fmt: (v) => v.toFixed(2), natLabel: '75.02' },
        { label: 'Poverty Rate', a: provA.poverty, b: provB.poverty, scaleMax: 34, fmt: (v) => v.toFixed(2) + '%', natLabel: '9.03% (Mar)' },
        { label: 'Unemployment', a: provA.unemp, b: provB.unemp, scaleMax: 8, fmt: (v) => v.toFixed(2) + '%', natLabel: '4.91%' },
        { label: 'Life Expectancy', a: provA.lifeExp, b: provB.lifeExp, scaleMax: 78, fmt: (v) => v.toFixed(1) + 'y', natLabel: '74.2 yrs' },
        { label: 'Population', a: provA.popM, b: provB.popM, scaleMax: 52, fmt: (v) => v.toFixed(1) + 'M', natLabel: '283.5M total' },
      ],
    }, { showTooltip, hideTooltip });

    drawBubbleScatter(root.querySelector('#scatter-canvas'), {
      provinces: PROVINCES,
      regionColors: REGION_COLORS,
      scale: state.compareScale,
      highlightA: provA.id,
      highlightB: provB.id,
    }, {
      showTooltip,
      hideTooltip,
      onSelect: (p) => {
        if (p.id !== state.compareA) setState({ compareB: p.id });
      },
    });
  };

  drawCharts();
  registerRedraw(drawCharts);

  root.querySelector('#sel-prov-a').addEventListener('change', (e) => setState({ compareA: e.target.value }));
  root.querySelector('#sel-prov-b').addEventListener('change', (e) => setState({ compareB: e.target.value }));
  root.querySelector('#btn-swap-prov').addEventListener('click', () => setState({ compareA: state.compareB, compareB: state.compareA }));

  root.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pr = PRESETS[Number(btn.dataset.preset)];
      setState({ compareA: pr.a, compareB: pr.b });
    });
  });

  root.querySelectorAll('[data-scale]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ compareScale: btn.dataset.scale }));
  });

  root.querySelectorAll('[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ compareRegion: btn.dataset.region }));
  });

  root.querySelector('#prov-search').addEventListener('input', (e) => {
    state.compareSearch = e.target.value;
    renderCompareView(root, ctx);
    const inp = root.querySelector('#prov-search');
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  });

  root.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      const dir = state.compareSortKey === k && state.compareSortDir === 'desc' ? 'asc' : 'desc';
      setState({ compareSortKey: k, compareSortDir: dir });
    });
  });

  root.querySelector('#btn-export-prov').addEventListener('click', () => {
    downloadCsv(
      'indonesia-24-provinces-bps-2024.csv',
      ['Province', 'Region', 'Capital', 'TimeZone', 'Population_M', 'GRDP_USD_B', 'GRDP_Per_Capita_USD', 'HDI_2024', 'Poverty_Mar2024_Pct', 'Literacy_Pct', 'Unemployment_Pct', 'Life_Expectancy_Yrs', 'Source'],
      filtered.map((p) => [p.name, p.region, p.capital, p.tz, p.popM, p.grdpB, p.grdpPerCap, p.hdi, p.poverty, p.literacy, p.unemp, p.lifeExp, p.source]),
    );
  });
}
