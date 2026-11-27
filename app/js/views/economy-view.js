// Economy & Sectors View (#/economy):
// Mobile-first 2x2 KPI grid + 9-Sector GDP Composition/Growth bar chart above the fold,
// plus 10-year toggleable macro chart, trade balance, and sortable sector table with CSV export.

import { GDP_SECTORS_2024 } from '../data/domains.js';
import { MACRO_SERIES, NATIONAL_BENCHMARKS, YEARS } from '../data/national.js';
import { drawDualMacro, drawHorizontalBars, drawTimeSeries } from '../viz/charts-core.js';

const ECON_METRICS = [
  { key: 'gdpGrowth', label: 'Real Growth (%)', fmt: (v) => `${v.toFixed(2)}%`, color: '#167874', src: 'BPS National Accounts (2015–2024)' },
  { key: 'gdpUsdB', label: 'Nominal GDP ($B)', fmt: (v) => `$${Math.round(v)}B`, color: '#167874', src: 'World Bank / BPS (2015–2024)' },
  { key: 'inflation', label: 'CPI Inflation (%)', fmt: (v) => `${v.toFixed(2)}%`, color: '#D99B26', src: 'BPS Consumer Price Index (2015–2024)' },
  { key: 'povertyPct', label: 'Poverty Rate (%)', fmt: (v) => `${v.toFixed(2)}%`, color: '#D94E28', src: 'BPS SUSENAS Sep (2015–2024)' },
];

export function renderEconomyView(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, registerRedraw, downloadCsv } = ctx;
  const nat = NATIONAL_BENCHMARKS;
  const m = ECON_METRICS.find((item) => item.key === state.econMetric) || ECON_METRICS[0];
  const isShare = state.econSectorMode === 'share';

  const sortedSectors = [...GDP_SECTORS_2024].sort((a, b) => {
    const k = state.econSortKey;
    const dir = state.econSortDir === 'asc' ? 1 : -1;
    if (typeof a[k] === 'string') return a[k].localeCompare(b[k]) * dir;
    return (a[k] - b[k]) * dir;
  });

  const barOrdered = [...GDP_SECTORS_2024].sort((a, b) =>
    isShare ? (b.sharePct - a.sharePct) : (b.growthPct - a.growthPct)
  );

  const arrow = (k) => (state.econSortKey === k ? (state.econSortDir === 'asc' ? ' ▲' : ' ▼') : '');

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Indonesia Economy &amp; GDP Structure</h1>
        <p class="page-subtitle">National accounts, 9-sector output shares, price stability, and external trade surplus (2015–2024).</p>
      </div>
      <div class="pill-group" role="group" aria-label="Sector chart mode">
        <button type="button" class="pill-btn light ${isShare ? 'active' : ''}" data-sec-mode="share">Share of GDP</button>
        <button type="button" class="pill-btn light ${!isShare ? 'active' : ''}" data-sec-mode="growth">YoY Growth</button>
      </div>
    </div>

    <section class="kpi-grid-4" aria-label="Headline macroeconomic indicators">
      <article class="kpi-card">
        <div class="kpi-card-label">Nominal GDP</div>
        <div class="kpi-card-value">$1.40T</div>
        <div class="kpi-card-meta"><span>$4,960 / cap</span><span>WB/BPS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Real GDP Growth</div>
        <div class="kpi-card-value">${nat.gdpGrowthPct.toFixed(2)}%</div>
        <div class="kpi-card-meta"><span>vs 5.05% (2023)</span><span>BPS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">CPI Inflation</div>
        <div class="kpi-card-value">${nat.inflationPct.toFixed(2)}%</div>
        <div class="kpi-card-meta"><span>-1.04 pp YoY</span><span>BPS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Trade Surplus</div>
        <div class="kpi-card-value">+$${nat.tradeSurplusB.toFixed(1)}B</div>
        <div class="kpi-card-meta"><span>Exports $264.7B</span><span>BPS 2024</span></div>
      </article>
    </section>

    <section class="grid-2" aria-label="Primary economic charts">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">9-Sector GDP ${isShare ? 'Composition (% Share)' : 'Annual Growth (% YoY)'}</h2>
            <p class="card-sub">${isShare ? 'Manufacturing (18.9%), Trade (13.1%) & Agriculture (12.6%) lead real output.' : 'Transport (+8.69%), Info & Comm (+7.57%) & Construction (+7.02%) lead growth.'}</p>
          </div>
        </div>
        <div class="chart-box mobile-sector"><canvas id="econ-sectors-canvas"></canvas></div>
        <div class="source-note">Source: BPS National Accounts (2024). Hover any bar for full sector share &amp; growth.</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Ten-Year Macro Trajectory: ${m.label}</h2>
            <p class="card-sub">Switch indicator or toggle bar/line view across 2015–2024.</p>
          </div>
          <div class="pill-group" role="group" aria-label="Chart type">
            <button type="button" class="pill-btn light ${state.econChartType === 'bar' ? 'active' : ''}" data-chart-type="bar">Bar</button>
            <button type="button" class="pill-btn light ${state.econChartType === 'line' ? 'active' : ''}" data-chart-type="line">Line</button>
          </div>
        </div>
        <div class="pill-group" style="margin-bottom:8px" role="group" aria-label="Macro metric selector">
          ${ECON_METRICS.map((item) => `
            <button type="button" class="pill-btn light ${state.econMetric === item.key ? 'active' : ''}" data-econ-metric="${item.key}">${item.label}</button>
          `).join('')}
        </div>
        <div class="chart-box"><canvas id="econ-macro-canvas"></canvas></div>
        <div class="source-note">Source: ${m.src}.</div>
      </article>
    </section>

    <section class="grid-2" aria-label="Trade balance and poverty reduction">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Merchandise Exports, Imports &amp; Surplus (2015–2024)</h2>
            <p class="card-sub">Five consecutive annual trade surpluses since 2020, peaking at +$54.5B in 2022.</p>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot" style="background:var(--gold)"></span>Surplus</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--teal)"></span>Exports</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--ink)"></span>Imports</span>
          </div>
        </div>
        <div class="chart-box compact"><canvas id="econ-trade-canvas"></canvas></div>
        <div class="source-note">Source: BPS Foreign Trade Statistics (2015–2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Ten-Year National Poverty Reduction (SUSENAS Sep)</h2>
            <p class="card-sub">From 11.13% (28.51M) in 2015 to a historic single-digit low of 8.57% (24.06M) in Sep 2024.</p>
          </div>
        </div>
        <div class="chart-box compact"><canvas id="econ-poverty-canvas"></canvas></div>
        <div class="source-note">Source: BPS SUSENAS September Surveys (2015–2024).</div>
      </article>
    </section>

    <section class="card" aria-label="Nine-sector GDP reference table">
      <div class="table-toolbar">
        <div>
          <h2 class="card-title">GDP by Industrial Origin — 2024 Reference Table</h2>
          <p class="card-sub">Click any column header to sort · Export offline CSV.</p>
        </div>
        <button type="button" id="btn-export-econ" class="btn-secondary">↓ Download CSV</button>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="sector">Economic Sector${arrow('sector')}</th>
              <th class="num sortable" data-sort="sharePct">Share of GDP (%)${arrow('sharePct')}</th>
              <th class="num sortable" data-sort="growthPct">2024 YoY Growth (%)${arrow('growthPct')}</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            ${sortedSectors.map((s) => `
              <tr>
                <td><strong>${s.sector}</strong></td>
                <td class="num">${s.sharePct.toFixed(1)}%</td>
                <td class="num" style="color:var(--teal);font-weight:700">+${s.growthPct.toFixed(2)}%</td>
                <td>${s.source}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const drawCharts = () => {
    drawHorizontalBars(root.querySelector('#econ-sectors-canvas'), {
      items: barOrdered.map((s) => ({
        label: s.short,
        fullLabel: s.sector,
        value: isShare ? s.sharePct : s.growthPct,
        extra: isShare ? `2024 YoY Growth: +${s.growthPct.toFixed(2)}% · ${s.source}` : `GDP Share: ${s.sharePct.toFixed(1)}% · ${s.source}`,
      })),
      color: isShare ? '#167874' : '#D99B26',
      highlightTop: true,
      format: (v) => (isShare ? `${v.toFixed(1)}%` : `+${v.toFixed(2)}%`),
    }, { showTooltip, hideTooltip });

    drawTimeSeries(root.querySelector('#econ-macro-canvas'), {
      labels: YEARS,
      values: MACRO_SERIES.map((r) => r[m.key]),
      type: state.econChartType,
      color: m.color,
      format: m.fmt,
      highlightIdx: YEARS.length - 1,
    }, { showTooltip, hideTooltip });

    drawDualMacro(root.querySelector('#econ-trade-canvas'), {
      labels: YEARS,
      bars: { label: 'Trade Balance', values: MACRO_SERIES.map((r) => r.tradeBalB), color: '#D99B26', negColor: '#D94E28' },
      lineA: { label: 'Exports ($B)', values: MACRO_SERIES.map((r) => r.exportsB), color: '#167874' },
      lineB: { label: 'Imports ($B)', values: MACRO_SERIES.map((r) => r.importsB), color: '#0B192C' },
      sharedAxis: true,
      leftFmt: (v) => `$${Math.round(v)}B`,
      rightFmt: (v) => `$${v.toFixed(1)}B`,
    }, { showTooltip, hideTooltip });

    drawTimeSeries(root.querySelector('#econ-poverty-canvas'), {
      labels: YEARS,
      values: MACRO_SERIES.map((r) => r.povertyPct),
      type: 'line',
      color: '#D94E28',
      format: (v) => `${v.toFixed(2)}%`,
      highlightIdx: YEARS.length - 1,
    }, { showTooltip, hideTooltip });
  };

  drawCharts();
  registerRedraw(drawCharts);

  root.querySelectorAll('[data-sec-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ econSectorMode: btn.dataset.secMode }));
  });
  root.querySelectorAll('[data-econ-metric]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ econMetric: btn.dataset.econMetric }));
  });
  root.querySelectorAll('[data-chart-type]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ econChartType: btn.dataset.chartType }));
  });
  root.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      const dir = state.econSortKey === k && state.econSortDir === 'desc' ? 'asc' : 'desc';
      setState({ econSortKey: k, econSortDir: dir });
    });
  });
  root.querySelector('#btn-export-econ').addEventListener('click', () => {
    downloadCsv(
      'indonesia-gdp-sectors-2024.csv',
      ['Sector', 'Share_GDP_Pct', 'YoY_Growth_Pct', 'Source'],
      sortedSectors.map((s) => [s.sector, s.sharePct, s.growthPct, s.source]),
    );
  });
}
