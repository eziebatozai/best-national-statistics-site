// Demographics & 38-Province Island Structure View (#/demographics):
// 15-cohort 2024 Age-Sex Population Pyramid, 6-Island Population vs. GDP shares (all 38 provinces),
// and switchable 10-year demographic transition chart.

import { ISLAND_REGIONS_2024, POPULATION_PYRAMID_2024 } from '../data/domains.js';
import { MACRO_SERIES, YEARS } from '../data/national.js';
import { drawGroupedHorizontalBars, drawPopulationPyramid, drawTimeSeries } from '../viz/charts-core.js';

const DEMO_METRICS = [
  { key: 'popM', label: 'Population (M)', fmt: (v) => `${v.toFixed(1)}M`, color: '#167874' },
  { key: 'urbanPct', label: 'Urban Share (%)', fmt: (v) => `${v.toFixed(1)}%`, color: '#3B82B6' },
  { key: 'fertility', label: 'Fertility (TFR)', fmt: (v) => v.toFixed(2), color: '#D94E28' },
  { key: 'medianAge', label: 'Median Age (yrs)', fmt: (v) => `${v.toFixed(1)}y`, color: '#D99B26' },
];

export function renderDemographicsView(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, registerRedraw, downloadCsv } = ctx;
  const dm = DEMO_METRICS.find((item) => item.key === state.demoMetric) || DEMO_METRICS[0];
  const latest = MACRO_SERIES[MACRO_SERIES.length - 1];

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Demographics &amp; Archipelagic Distribution</h1>
        <p class="page-subtitle">World’s fourth-largest population (283.5M) distributed across 38 provinces in six island groups (BPS &amp; World Bank 2024).</p>
      </div>
      <span class="eyebrow-pill">All 38 Provinces Accounted</span>
    </div>

    <section class="kpi-grid-4" aria-label="Demographic headline metrics">
      <article class="kpi-card">
        <div class="kpi-card-label">Total Population</div>
        <div class="kpi-card-value">${latest.popM.toFixed(1)}M</div>
        <div class="kpi-card-meta"><span>+${latest.popGrowth.toFixed(2)}% YoY</span><span>WB/BPS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Urban Share</div>
        <div class="kpi-card-value">${latest.urbanPct.toFixed(1)}%</div>
        <div class="kpi-card-meta"><span>+5.8 pp since 2015</span><span>World Bank 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Total Fertility Rate</div>
        <div class="kpi-card-value">${latest.fertility.toFixed(2)}</div>
        <div class="kpi-card-meta"><span>At replacement (2.1)</span><span>BPS/WB 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Median Age</div>
        <div class="kpi-card-value">${latest.medianAge.toFixed(1)} yrs</div>
        <div class="kpi-card-meta"><span>Demographic dividend</span><span>BPS/UN 2024</span></div>
      </article>
    </section>

    <section class="grid-2" aria-label="Population pyramid and island shares">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">2024 Age-Sex Population Pyramid (15 Cohorts)</h2>
            <p class="card-sub">Broad working-age cohorts (ages 15–54) underpin Indonesia’s demographic window.</p>
          </div>
        </div>
        <div class="chart-box tall"><canvas id="demo-pyramid-canvas"></canvas></div>
        <div class="source-note">Source: BPS Population Projection &amp; World Bank (2024). Hover any age band for male/female shares.</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Six Island Regions: Population vs. GDP Share (38 Provinces)</h2>
            <p class="card-sub">Java concentrates 56.1% of people &amp; 57.1% of GDP; Kalimantan punches above population weight (8.2% GDP).</p>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot" style="background:var(--teal)"></span>Population Share</span>
            <span class="legend-item"><span class="legend-dot" style="background:var(--vermilion)"></span>GDP Share</span>
          </div>
        </div>
        <div class="chart-box tall"><canvas id="demo-islands-canvas"></canvas></div>
        <div class="source-note">Source: BPS Regional Accounts &amp; Population Statistics across all 38 provinces (2024).</div>
      </article>
    </section>

    <section class="grid-2" aria-label="Decade demographic trend and island table">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Ten-Year Demographic Shift: ${dm.label}</h2>
            <p class="card-sub">Switch series to track population growth, urbanization, fertility, and median age (2015–2024).</p>
          </div>
        </div>
        <div class="pill-group" style="margin-bottom:8px">
          ${DEMO_METRICS.map((item) => `
            <button type="button" class="pill-btn light ${state.demoMetric === item.key ? 'active' : ''}" data-demo-metric="${item.key}">${item.label}</button>
          `).join('')}
        </div>
        <div class="chart-box"><canvas id="demo-trend-canvas"></canvas></div>
        <div class="source-note">Source: World Bank / BPS Annual Series (2015–2024).</div>
      </article>

      <article class="card">
        <div class="table-toolbar">
          <div>
            <h2 class="card-title">All 38 Provinces Grouped by Six Island Regions</h2>
            <p class="card-sub">Complete national coverage summing to 100% of population and GDP.</p>
          </div>
          <button type="button" id="btn-export-islands" class="btn-secondary">↓ CSV</button>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Island Region</th>
                <th class="num">Provinces</th>
                <th class="num">Pop Share</th>
                <th class="num">GDP Share</th>
                <th class="num">GDP / Pop Ratio</th>
              </tr>
            </thead>
            <tbody>
              ${ISLAND_REGIONS_2024.map((r) => `
                <tr>
                  <td><strong>${r.region}</strong></td>
                  <td class="num">${r.provinces}</td>
                  <td class="num">${r.popShare.toFixed(1)}%</td>
                  <td class="num">${r.gdpShare.toFixed(1)}%</td>
                  <td class="num">${(r.gdpShare / r.popShare).toFixed(2)}×</td>
                </tr>`).join('')}
              <tr style="background:var(--ivory);font-weight:700">
                <td>Indonesia Total</td>
                <td class="num">38</td>
                <td class="num">100.0%</td>
                <td class="num">100.0%</td>
                <td class="num">1.00×</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="source-note">Source: BPS (2024). Includes the four newer Papua autonomous provinces in Maluku &amp; Papua (8 provinces).</div>
      </article>
    </section>
  `;

  const drawCharts = () => {
    drawPopulationPyramid(root.querySelector('#demo-pyramid-canvas'), POPULATION_PYRAMID_2024, { showTooltip, hideTooltip });
    drawGroupedHorizontalBars(root.querySelector('#demo-islands-canvas'), {
      rows: ISLAND_REGIONS_2024.map((r) => ({ label: r.region, a: r.popShare, b: r.gdpShare, provinces: r.provinces })),
      labelA: 'Population Share',
      labelB: 'GDP Share',
    }, { showTooltip, hideTooltip });
    drawTimeSeries(root.querySelector('#demo-trend-canvas'), {
      labels: YEARS,
      values: MACRO_SERIES.map((r) => r[dm.key]),
      type: 'line',
      color: dm.color,
      format: dm.fmt,
      highlightIdx: YEARS.length - 1,
    }, { showTooltip, hideTooltip });
  };

  drawCharts();
  registerRedraw(drawCharts);

  root.querySelectorAll('[data-demo-metric]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ demoMetric: btn.dataset.demoMetric }));
  });
  root.querySelector('#btn-export-islands').addEventListener('click', () => {
    downloadCsv(
      'indonesia-six-island-regions-2024.csv',
      ['Region', 'Provinces_Count', 'Population_Share_Pct', 'GDP_Share_Pct', 'Source'],
      ISLAND_REGIONS_2024.map((r) => [r.region, r.provinces, r.popShare, r.gdpShare, r.source]),
    );
  });
}
