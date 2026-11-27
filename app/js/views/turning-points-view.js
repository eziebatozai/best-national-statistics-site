// Five Turning Points Editorial Narrative View (#/turning-points):
// Interactive 5-chapter stepper synchronizing a 2x2 four-panel 2015–2024 multi-indicator board.

import { MACRO_SERIES, TURNING_POINTS, YEARS } from '../data/national.js';
import { drawDualMacro } from '../viz/charts-core.js';

export function renderTurningPointsView(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, registerRedraw } = ctx;
  const active = TURNING_POINTS.find((tp) => tp.id === state.activeTurningPoint) || TURNING_POINTS[2];
  const band = {
    startIdx: YEARS.indexOf(active.startYear),
    endIdx: YEARS.indexOf(active.endYear),
  };

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Indonesia in Five Turning Points (2015–2024)</h1>
        <p class="page-subtitle">Select any milestone chapter to synchronize the highlighted period across growth, foreign trade, demographic transition, and poverty-HDI recovery.</p>
      </div>
      <span class="eyebrow-pill">Synchronized Decade Board</span>
    </div>

    <nav class="tp-stepper" aria-label="Five turning-point chapters">
      ${TURNING_POINTS.map((tp, idx) => `
        <button type="button" class="tp-step-btn ${tp.id === active.id ? 'active' : ''}" data-tp-id="${tp.id}">
          <div class="tp-step-year">0${idx + 1} · ${tp.startYear === tp.endYear ? tp.startYear : `${tp.startYear}–${String(tp.endYear).slice(-2)}`}</div>
          <div class="tp-step-title">${tp.shortLabel}</div>
        </button>`).join('')}
    </nav>

    <section class="tp-brief" aria-live="polite">
      <div class="tp-brief-text">
        <h2>${active.title} (${active.startYear === active.endYear ? active.startYear : `${active.startYear}–${active.endYear}`})</h2>
        <p>${active.summary}</p>
      </div>
      <div class="tp-brief-stat">
        <div class="tp-brief-badge">${active.badge}</div>
        <div class="tp-brief-source">${active.source}</div>
      </div>
    </section>

    <section class="grid-2 tp-grid" aria-label="Synchronized four-panel decade charts">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">1. Real GDP Growth vs. CPI Inflation</h2>
            <p class="card-sub">Steady 5% expansion, -2.07% shock (2020), 5.51% CPI (2022), 1.57% CPI (2024).</p>
          </div>
          <div class="chart-legend" style="margin:0">
            <span class="legend-item"><span class="legend-dot" style="background:var(--teal)"></span>GDP %</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--vermilion)"></span>CPI %</span>
          </div>
        </div>
        <div class="chart-box tp-panel"><canvas id="tp-chart-1"></canvas></div>
        <div class="source-note">Source: BPS National Accounts &amp; Consumer Price Index (2015–2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">2. Exports, Imports &amp; Trade Surplus ($B)</h2>
            <p class="card-sub">Downstreaming lifted exports to a record $291.9B &amp; +$54.5B surplus in 2022.</p>
          </div>
          <div class="chart-legend" style="margin:0">
            <span class="legend-item"><span class="legend-dot" style="background:var(--gold)"></span>Surplus</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--teal)"></span>Exp</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--ink)"></span>Imp</span>
          </div>
        </div>
        <div class="chart-box tp-panel"><canvas id="tp-chart-2"></canvas></div>
        <div class="source-note">Source: BPS Foreign Trade Statistics (2015–2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">3. Urbanization Share vs. Fertility Transition</h2>
            <p class="card-sub">Urban share climbed from 53.3% to 59.1% as fertility reached replacement (2.10).</p>
          </div>
          <div class="chart-legend" style="margin:0">
            <span class="legend-item"><span class="legend-dot" style="background:#3B82B6"></span>Urban %</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--vermilion)"></span>TFR</span>
          </div>
        </div>
        <div class="chart-box tp-panel"><canvas id="tp-chart-3"></canvas></div>
        <div class="source-note">Source: BPS &amp; World Bank Population Estimates (2015–2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">4. Poverty Low (8.57%), HDI (75.02) &amp; Unemp.</h2>
            <p class="card-sub">Poverty cut 2.56 pp over the decade while HDI rose +5.47 pts and TPT hit 4.91%.</p>
          </div>
          <div class="chart-legend" style="margin:0">
            <span class="legend-item"><span class="legend-dot" style="background:var(--vermilion)"></span>Poverty %</span>
            <span class="legend-item"><span class="legend-dot round" style="background:var(--teal)"></span>HDI</span>
          </div>
        </div>
        <div class="chart-box tp-panel"><canvas id="tp-chart-4"></canvas></div>
        <div class="source-note">Source: BPS SUSENAS Sep (2015–2024), BPS IPM &amp; SAKERNAS (2024).</div>
      </article>
    </section>
  `;

  const drawAll = () => {
    drawDualMacro(root.querySelector('#tp-chart-1'), {
      labels: YEARS,
      band,
      bars: { label: 'Real GDP Growth', values: MACRO_SERIES.map((r) => r.gdpGrowth), color: '#167874', negColor: '#D94E28' },
      lineA: { label: 'CPI Inflation', values: MACRO_SERIES.map((r) => r.inflation), color: '#D94E28' },
      sharedAxis: true,
      leftFmt: (v) => `${v.toFixed(1)}%`,
      rightFmt: (v) => `${v.toFixed(2)}%`,
    }, { showTooltip, hideTooltip });

    drawDualMacro(root.querySelector('#tp-chart-2'), {
      labels: YEARS,
      band,
      bars: { label: 'Trade Balance', values: MACRO_SERIES.map((r) => r.tradeBalB), color: '#D99B26', negColor: '#D94E28' },
      lineA: { label: 'Exports ($B)', values: MACRO_SERIES.map((r) => r.exportsB), color: '#167874' },
      lineB: { label: 'Imports ($B)', values: MACRO_SERIES.map((r) => r.importsB), color: '#0B192C' },
      sharedAxis: true,
      leftFmt: (v) => `$${Math.round(v)}B`,
      rightFmt: (v) => `$${v.toFixed(1)}B`,
    }, { showTooltip, hideTooltip });

    drawDualMacro(root.querySelector('#tp-chart-3'), {
      labels: YEARS,
      band,
      bars: { label: 'Urban Share', values: MACRO_SERIES.map((r) => r.urbanPct), color: '#3B82B6' },
      lineA: { label: 'Fertility Rate', values: MACRO_SERIES.map((r) => r.fertility), color: '#D94E28' },
      sharedAxis: false,
      leftFmt: (v) => `${v.toFixed(0)}%`,
      rightFmt: (v) => v.toFixed(2),
    }, { showTooltip, hideTooltip });

    drawDualMacro(root.querySelector('#tp-chart-4'), {
      labels: YEARS,
      band,
      bars: { label: 'Poverty Rate', values: MACRO_SERIES.map((r) => r.povertyPct), color: '#D94E28' },
      lineA: { label: 'HDI Score', values: MACRO_SERIES.map((r) => r.hdi), color: '#167874' },
      sharedAxis: false,
      leftFmt: (v) => `${v.toFixed(1)}%`,
      rightFmt: (v) => v.toFixed(1),
    }, { showTooltip, hideTooltip });
  };

  drawAll();
  registerRedraw(drawAll);

  root.querySelectorAll('[data-tp-id]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ activeTurningPoint: btn.dataset.tpId }));
  });
}
