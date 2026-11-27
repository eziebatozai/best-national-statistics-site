// Labor & Employment View (#/labor):
// 152.1M workforce KPIs, 2015–2024 unemployment recovery, Formal vs. Informal donut,
// Gender participation comparison, and 8-sector jobs breakdown with CSV export.

import { EMPLOYMENT_SECTORS_2024, EMPLOYMENT_STRUCTURE_2024 } from '../data/domains.js';
import { MACRO_SERIES, YEARS } from '../data/national.js';
import { drawDonutChart, drawHorizontalBars, drawTimeSeries } from '../viz/charts-core.js';

export function renderLaborView(root, ctx) {
  const { showTooltip, hideTooltip, registerRedraw, downloadCsv } = ctx;
  const st = EMPLOYMENT_STRUCTURE_2024;
  const latest = MACRO_SERIES[MACRO_SERIES.length - 1];

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Labor Force &amp; Employment Structure</h1>
        <p class="page-subtitle">Post-pandemic unemployment recovery to a decade low (4.91%), formal/informal split, and sectoral employment (BPS SAKERNAS Aug 2024).</p>
      </div>
      <span class="eyebrow-pill">BPS SAKERNAS Aug 2024</span>
    </div>

    <section class="kpi-grid-4" aria-label="Headline labor indicators">
      <article class="kpi-card">
        <div class="kpi-card-label">Total Labor Force</div>
        <div class="kpi-card-value">${latest.laborM.toFixed(1)}M</div>
        <div class="kpi-card-meta"><span>${st.employedM}M employed</span><span>SAKERNAS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Open Unemployment</div>
        <div class="kpi-card-value">${latest.unempPct.toFixed(2)}%</div>
        <div class="kpi-card-meta"><span>Down from 7.07% (2020)</span><span>SAKERNAS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Participation (TPAK)</div>
        <div class="kpi-card-value">${latest.tpakPct.toFixed(1)}%</div>
        <div class="kpi-card-meta"><span>M 84.7% · F 56.4%</span><span>SAKERNAS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Avg. Monthly Wage</div>
        <div class="kpi-card-value">Rp ${st.avgMonthlyWageIdrM.toFixed(2)}M</div>
        <div class="kpi-card-meta"><span>~$${st.avgMonthlyWageUsd} / mo</span><span>SAKERNAS 2024</span></div>
      </article>
    </section>

    <section class="grid-2" aria-label="Unemployment and formality charts">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Open Unemployment Rate (TPT, 2015–2024)</h2>
            <p class="card-sub">Peaked at 7.07% during the 2020 pandemic shock before falling steadily to 4.91% in Aug 2024.</p>
          </div>
        </div>
        <div class="chart-box"><canvas id="labor-unemp-canvas"></canvas></div>
        <div class="source-note">Source: BPS SAKERNAS National Labor Force Survey (2015–2024).</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Formal vs. Informal Workforce &amp; Gender Participation</h2>
            <p class="card-sub">58.0% of Indonesia’s 144.6M employed workers operate in informal arrangements.</p>
          </div>
        </div>
        <div class="chart-box compact"><canvas id="labor-donut-canvas"></canvas></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          <div style="background:var(--ivory);padding:8px 10px;border-radius:8px;border:1px solid var(--stone)">
            <div style="font-size:10.5px;font-weight:700;color:var(--slate);text-transform:uppercase">Male Participation</div>
            <div class="stat-num" style="font-family:var(--font-serif);font-size:18px;font-weight:700;color:var(--teal)">${st.maleParticipationPct.toFixed(1)}%</div>
          </div>
          <div style="background:var(--ivory);padding:8px 10px;border-radius:8px;border:1px solid var(--stone)">
            <div style="font-size:10.5px;font-weight:700;color:var(--slate);text-transform:uppercase">Female Participation</div>
            <div class="stat-num" style="font-family:var(--font-serif);font-size:18px;font-weight:700;color:var(--vermilion)">${st.femaleParticipationPct.toFixed(1)}%</div>
          </div>
        </div>
        <div class="source-note">Source: ${st.source}.</div>
      </article>
    </section>

    <section class="grid-2" aria-label="Employment by sector">
      <article class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Employment Share Across Eight Major Sectors</h2>
            <p class="card-sub">Agriculture (28.2%, 40.8M) and Trade (19.0%, 27.5M) employ nearly half of all workers.</p>
          </div>
        </div>
        <div class="chart-box"><canvas id="labor-sectors-canvas"></canvas></div>
        <div class="source-note">Source: BPS SAKERNAS (Aug 2024).</div>
      </article>

      <article class="card">
        <div class="table-toolbar">
          <div>
            <h2 class="card-title">Workforce by Sector (Aug 2024)</h2>
            <p class="card-sub">144.6M employed · 7.47M unemployed.</p>
          </div>
          <button type="button" id="btn-export-labor" class="btn-secondary">↓ Download CSV</button>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th class="num">Workers (M)</th>
                <th class="num">Share (%)</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${EMPLOYMENT_SECTORS_2024.map((s) => `
                <tr>
                  <td><strong>${s.sector}</strong></td>
                  <td class="num">${s.workersM.toFixed(1)}M</td>
                  <td class="num">${s.sharePct.toFixed(1)}%</td>
                  <td>${s.source}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  const drawCharts = () => {
    drawTimeSeries(root.querySelector('#labor-unemp-canvas'), {
      labels: YEARS,
      values: MACRO_SERIES.map((r) => r.unempPct),
      type: 'bar',
      color: '#167874',
      format: (v) => `${v.toFixed(2)}%`,
      highlightIdx: YEARS.indexOf(2020),
    }, { showTooltip, hideTooltip });

    drawDonutChart(root.querySelector('#labor-donut-canvas'), {
      centerTitle: `${st.employedM}M`,
      centerSub: 'Employed (2024)',
      segments: [
        { label: 'Formal Sector', value: st.formalPct, color: '#167874', sub: '~60.7M salaried / formal' },
        { label: 'Informal Sector', value: st.informalPct, color: '#D99B26', sub: '~83.9M self-employed / casual' },
      ],
    }, { showTooltip, hideTooltip });

    drawHorizontalBars(root.querySelector('#labor-sectors-canvas'), {
      items: EMPLOYMENT_SECTORS_2024.map((s) => ({
        label: s.short,
        fullLabel: s.sector,
        value: s.sharePct,
        extra: `${s.workersM.toFixed(1)}M workers · ${s.source}`,
      })),
      color: '#167874',
      highlightTop: true,
      format: (v) => `${v.toFixed(1)}%`,
    }, { showTooltip, hideTooltip });
  };

  drawCharts();
  registerRedraw(drawCharts);

  root.querySelector('#btn-export-labor').addEventListener('click', () => {
    downloadCsv(
      'indonesia-employment-sectors-2024.csv',
      ['Sector', 'Workers_Millions', 'Share_Pct', 'Source'],
      EMPLOYMENT_SECTORS_2024.map((s) => [s.sector, s.workersM, s.sharePct, s.source]),
    );
  });
}
