// Unified Health & Education Social Development Hub (#/social):
// Filterable view (All Social, Health Only, Education Only) with stunting vs. 14% target,
// life expectancy, 4-tier education enrollment ladder, HDI progression, and CSV tables.

import {
  EDUCATION_ENROLLMENT_2024,
  EDUCATION_INDICATORS,
  HEALTH_INDICATORS,
  STUNTING_SERIES,
  STUNTING_TARGET_PCT,
} from '../data/domains.js';
import { MACRO_SERIES, YEARS } from '../data/national.js';
import { drawHorizontalBars, drawTimeSeries } from '../viz/charts-core.js';

export function renderSocialView(root, ctx) {
  const { state, setState, showTooltip, hideTooltip, registerRedraw, downloadCsv } = ctx;
  const mode = state.socialFilter || 'all';
  const showHealth = mode === 'all' || mode === 'health';
  const showEdu = mode === 'all' || mode === 'education';

  root.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="page-title">Health &amp; Education Development Hub</h1>
        <p class="page-subtitle">Universal health coverage (98% JKN), child stunting reduction, four-tier enrollment ladder, and HDI progression (BPS, MoH, BPJS 2023–2024).</p>
      </div>
      <div class="pill-group" role="group" aria-label="Social domain filter">
        <button type="button" class="pill-btn light ${mode === 'all' ? 'active' : ''}" data-social-mode="all">All Social</button>
        <button type="button" class="pill-btn light ${mode === 'health' ? 'active' : ''}" data-social-mode="health">Health Only</button>
        <button type="button" class="pill-btn light ${mode === 'education' ? 'active' : ''}" data-social-mode="education">Education Only</button>
      </div>
    </div>

    <section class="kpi-grid-4" aria-label="Human development headline cards">
      <article class="kpi-card">
        <div class="kpi-card-label">Life Expectancy</div>
        <div class="kpi-card-value">74.2 yrs</div>
        <div class="kpi-card-meta"><span>+1.7 yrs since 2015</span><span>BPS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Under-5 Stunting</div>
        <div class="kpi-card-value">21.5%</div>
        <div class="kpi-card-meta"><span>-9.3 pp vs 2018 (30.8%)</span><span>MoH SKI 2023</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">JKN Coverage</div>
        <div class="kpi-card-value">98.0%</div>
        <div class="kpi-card-meta"><span>277M registered</span><span>BPJS 2024</span></div>
      </article>
      <article class="kpi-card">
        <div class="kpi-card-label">Human Dev. Index</div>
        <div class="kpi-card-value">75.02</div>
        <div class="kpi-card-meta"><span>High Tier · 96.5% lit.</span><span>BPS IPM 2024</span></div>
      </article>
    </section>

    ${showHealth ? `
      <section class="grid-2" aria-label="Health charts">
        <article class="card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Child Stunting Prevalence vs. 14.0% National Target</h2>
              <p class="card-sub">Steady decline from 30.8% (Riskesdas 2018) to 21.5% (SKI 2023).</p>
            </div>
          </div>
          <div class="chart-box compact"><canvas id="soc-stunting-canvas"></canvas></div>
          <div class="source-note">Source: Ministry of Health Riskesdas (2018), SSGBI (2019), SSGI (2021–2022), SKI (2023).</div>
        </article>

        <article class="card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Life Expectancy at Birth (2015–2024)</h2>
              <p class="card-sub">National weighted average rising from 72.5 to 74.2 years alongside 10,416 Puskesmas clinics.</p>
            </div>
          </div>
          <div class="chart-box compact"><canvas id="soc-life-canvas"></canvas></div>
          <div class="source-note">Source: BPS Demographic &amp; IPM Series (2015–2024).</div>
        </article>
      </section>
    ` : ''}

    ${showEdu ? `
      <section class="grid-2" aria-label="Education charts">
        <article class="card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Four-Tier Education Enrollment Ladder (2024)</h2>
              <p class="card-sub">Near-universal primary enrollment (98.0%) tapering to 32.0% gross tertiary participation.</p>
            </div>
          </div>
          <div class="chart-box compact"><canvas id="soc-enroll-canvas"></canvas></div>
          <div class="source-note">Source: BPS SUSENAS (2024). Primary/SMP/SMA = Net Enrollment; Tertiary = Gross Enrollment.</div>
        </article>

        <article class="card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Human Development Index (HDI) Progression (2015–2024)</h2>
              <p class="card-sub">Climbed +5.47 points from 69.55 to 75.02 with mean schooling reaching 8.85 years.</p>
            </div>
          </div>
          <div class="chart-box compact"><canvas id="soc-hdi-canvas"></canvas></div>
          <div class="source-note">Source: BPS Human Development Index Report (2015–2024).</div>
        </article>
      </section>
    ` : ''}

    <section class="card" aria-label="Health and Education Reference Indicators">
      <div class="table-toolbar">
        <div>
          <h2 class="card-title">${mode === 'health' ? 'Health System Indicators (10)' : mode === 'education' ? 'Education & Literacy Indicators (8)' : 'Health & Education Reference Table (18 Indicators)'}</h2>
          <p class="card-sub">Filter by keyword or download full CSV.</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="soc-search" class="atlas-filter" type="search" placeholder="Filter indicators…" aria-label="Filter health and education indicators">
          <button type="button" id="btn-export-social" class="btn-secondary">↓ Download CSV</button>
        </div>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Domain</th>
              <th class="num">Value</th>
              <th class="num">Prior</th>
              <th class="num">Change</th>
              <th>Source &amp; Year</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody id="soc-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  const combined = [
    ...(showHealth ? HEALTH_INDICATORS.map((r) => ({ ...r, domain: 'Health' })) : []),
    ...(showEdu ? EDUCATION_INDICATORS.map((r) => ({ ...r, domain: 'Education' })) : []),
  ];

  const renderRows = (q = '') => {
    const clean = q.trim().toLowerCase();
    const list = combined.filter((r) => !clean || r.metric.toLowerCase().includes(clean) || r.note.toLowerCase().includes(clean) || r.source.toLowerCase().includes(clean));
    root.querySelector('#soc-tbody').innerHTML = list.map((r) => `
      <tr>
        <td><strong>${r.metric}</strong></td>
        <td>${r.domain}</td>
        <td class="num"><strong>${r.value}</strong></td>
        <td class="num">${r.prev}</td>
        <td class="num">${r.change}</td>
        <td>${r.source} (${r.year})</td>
        <td style="color:var(--slate);font-size:11.5px">${r.note}</td>
      </tr>`).join('') || '<tr><td colspan="7" style="color:var(--muted)">No matching indicator.</td></tr>';
  };
  renderRows();

  const drawCharts = () => {
    if (showHealth) {
      drawTimeSeries(root.querySelector('#soc-stunting-canvas'), {
        labels: STUNTING_SERIES.map((s) => s.year),
        values: STUNTING_SERIES.map((s) => s.rate),
        type: 'bar',
        color: '#D99B26',
        format: (v) => `${v.toFixed(1)}%`,
        targetLine: STUNTING_TARGET_PCT,
        targetLabel: 'National Target: 14.0%',
        highlightIdx: STUNTING_SERIES.length - 1,
      }, { showTooltip, hideTooltip });

      drawTimeSeries(root.querySelector('#soc-life-canvas'), {
        labels: YEARS,
        values: MACRO_SERIES.map((r) => r.lifeExp),
        type: 'line',
        color: '#167874',
        format: (v) => `${v.toFixed(1)}y`,
        highlightIdx: YEARS.length - 1,
      }, { showTooltip, hideTooltip });
    }
    if (showEdu) {
      drawHorizontalBars(root.querySelector('#soc-enroll-canvas'), {
        items: EDUCATION_ENROLLMENT_2024.map((e) => ({
          label: e.short,
          fullLabel: e.level,
          value: e.rate,
          extra: `${e.type} · ${e.source}`,
        })),
        color: '#167874',
        highlightTop: false,
        format: (v) => `${v.toFixed(1)}%`,
      }, { showTooltip, hideTooltip });

      drawTimeSeries(root.querySelector('#soc-hdi-canvas'), {
        labels: YEARS,
        values: MACRO_SERIES.map((r) => r.hdi),
        type: 'line',
        color: '#167874',
        format: (v) => v.toFixed(2),
        highlightIdx: YEARS.length - 1,
      }, { showTooltip, hideTooltip });
    }
  };

  drawCharts();
  registerRedraw(drawCharts);

  root.querySelectorAll('[data-social-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setState({ socialFilter: btn.dataset.socialMode }));
  });
  root.querySelector('#soc-search').addEventListener('input', (e) => renderRows(e.target.value));
  root.querySelector('#btn-export-social').addEventListener('click', () => {
    downloadCsv(
      'indonesia-health-education-2024.csv',
      ['Indicator', 'Domain', 'Value', 'Prior', 'Change', 'Source', 'Year', 'Context'],
      combined.map((r) => [r.metric, r.domain, r.value, r.prev, r.change, r.source, r.year, r.note]),
    );
  });
}
