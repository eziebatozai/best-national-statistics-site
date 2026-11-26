// Page renderers and interactive controllers for Nusantara Stats.
// Covers Overview, Population, Economy, Provinces, Health, Education, and Employment.

import {
  MACRO_SERIES,
  NATIONAL_BENCHMARKS,
  POPULATION_PYRAMID_2024,
  ISLAND_REGIONS_2024,
  GDP_SECTORS_2024,
  PROVINCES,
  STUNTING_SERIES,
  HEALTH_INDICATORS,
  EDUCATION_ENROLLMENT_2024,
  EDUCATION_INDICATORS,
  EMPLOYMENT_SECTORS_2024,
  EMPLOYMENT_STRUCTURE_2024,
  INDICATOR_DIRECTORY,
  getMacroByYear,
  getProvinceById,
} from './data.js';
import {
  PALETTE,
  drawTimeChart,
  drawHorizontalBars,
  drawGroupedBars,
  drawDonut,
  drawPyramid,
  drawScatter,
  clearRegisteredCharts,
} from './charts.js';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function deltaHtml(current, previous, unit = '', decimals = 1, invertGood = false) {
  if (previous == null) return '<span class="kpi-delta neutral">Reference baseline</span>';
  const diff = current - previous;
  const sign = diff > 0 ? '+' : '';
  const dir = diff === 0 ? 'neutral' : ((diff > 0) !== invertGood ? 'up' : 'down');
  return `<span class="kpi-delta ${dir}">${sign}${diff.toFixed(decimals)}${unit} vs prior yr</span>`;
}

function exportTableCsv(filename, headers, rows) {
  const csvRows = [headers, ...rows].map((row) =>
    row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
  );
  const uri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.join('\n'))}`;
  const link = document.createElement('a');
  link.href = uri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function renderOverviewPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1) || null;
  const prov = getProvinceById(state.provinceId);
  const chartType = state.overviewChartType;
  const metric = state.overviewMetric;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">National Statistical Portal · Republic of Indonesia</div>
        <h1 class="page-title">Indonesia at a Glance (${cur.year})</h1>
        <p class="page-lead">Verified macroeconomic, demographic, provincial, and social indicators compiled from BPS and World Bank series. Switch the year or focus province to compare national and regional performance.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group" role="group" aria-label="Overview chart metric">
          <button class="seg-btn ${metric === 'gdpGrowth' ? 'active' : ''}" data-ov-metric="gdpGrowth" type="button">GDP Growth %</button>
          <button class="seg-btn ${metric === 'gdpUsdB' ? 'active' : ''}" data-ov-metric="gdpUsdB" type="button">Nominal GDP $B</button>
          <button class="seg-btn ${metric === 'popM' ? 'active' : ''}" data-ov-metric="popM" type="button">Population M</button>
        </div>
        <div class="seg-group" role="group" aria-label="Overview chart type">
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-ov-type="bar" type="button">Bar</button>
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-ov-type="line" type="button">Line</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid" aria-label="Headline national indicators">
      <article class="kpi-card">
        <div class="kpi-label">Population</div>
        <div class="kpi-value">${cur.popM.toFixed(1)}M</div>
        ${deltaHtml(cur.popM, prev?.popM, 'M', 1)}
        <div class="kpi-source">World Bank (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Nominal GDP</div>
        <div class="kpi-value">$${(cur.gdpUsdB / 1000).toFixed(2)}T</div>
        ${deltaHtml(cur.gdpUsdB, prev?.gdpUsdB, 'B', 0)}
        <div class="kpi-source">World Bank / BPS (${cur.year})</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Real GDP Growth</div>
        <div class="kpi-value">${cur.gdpGrowth.toFixed(2)}%</div>
        ${deltaHtml(cur.gdpGrowth, prev?.gdpGrowth, ' pp', 2)}
        <div class="kpi-source">BPS National Accounts (${cur.year})</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">GDP per Capita</div>
        <div class="kpi-value">$${cur.gdpPerCap.toLocaleString('en-US')}</div>
        ${deltaHtml(cur.gdpPerCap, prev?.gdpPerCap, '', 0)}
        <div class="kpi-source">World Bank / BPS (${cur.year})</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Life Expectancy</div>
        <div class="kpi-value">${cur.lifeExp.toFixed(1)} yrs</div>
        ${deltaHtml(cur.lifeExp, prev?.lifeExp, ' yrs', 1)}
        <div class="kpi-source">BPS (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Unemployment (TPT)</div>
        <div class="kpi-value">${cur.unempPct.toFixed(2)}%</div>
        ${deltaHtml(cur.unempPct, prev?.unempPct, ' pp', 2, true)}
        <div class="kpi-source">BPS SAKERNAS (${cur.year})</div>
      </article>
    </section>

    <section class="grid-2-wide">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'gdpGrowth' ? 'Annual Real GDP Growth (2015–2024)' : metric === 'gdpUsdB' ? 'Nominal GDP Trajectory (2015–2024)' : 'Population Trajectory (2015–2024)'}</h2>
            <p class="panel-sub">Active reference year ${cur.year} highlighted in terracotta; hover bars or points for exact values.</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="ov-main-chart" aria-label="Indonesia headline trajectory chart"></canvas></div>
        <div class="chart-foot">
          <span>Source: ${metric === 'popM' ? 'World Bank Open Data & BPS Census (2015–2024)' : 'BPS National Accounts & World Bank (2015–2024)'}</span>
          <span>Unit: ${metric === 'gdpGrowth' ? '% YoY' : metric === 'gdpUsdB' ? 'USD Billions' : 'Millions'}</span>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Province Spotlight: ${esc(prov.name)}</h2>
            <p class="panel-sub">${esc(prov.region)} · Capital: ${esc(prov.capital)} · Indexed vs. Indonesia average (100)</p>
          </div>
          <div class="panel-controls">
            <select id="ov-province-select" class="filter-select" aria-label="Select spotlight province">
              ${PROVINCES.map((p) => `<option value="${p.id}" ${p.id === prov.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="spotlight-grid">
          <div class="spot-metric">
            <div class="spot-label">Population</div>
            <div class="spot-val">${prov.popM.toFixed(1)}M</div>
            <div class="spot-note">${((prov.popM / NATIONAL_BENCHMARKS.populationM) * 100).toFixed(1)}% of nation</div>
          </div>
          <div class="spot-metric">
            <div class="spot-label">GRDP / Capita</div>
            <div class="spot-val">$${prov.grdpPerCap.toLocaleString('en-US')}</div>
            <div class="spot-note">Natl avg $${NATIONAL_BENCHMARKS.grdpPerCapitaUsd.toLocaleString('en-US')}</div>
          </div>
          <div class="spot-metric">
            <div class="spot-label">HDI Score</div>
            <div class="spot-val">${prov.hdi.toFixed(2)}</div>
            <div class="spot-note">Natl ${NATIONAL_BENCHMARKS.hdi.toFixed(2)} · Unemp ${prov.unemp.toFixed(2)}%</div>
          </div>
        </div>
        <div class="chart-stage compact"><canvas id="ov-prov-chart" aria-label="Province benchmark index chart"></canvas></div>
        <div class="chart-foot">
          <span>Source: ${esc(prov.source)}</span>
          <a href="#/provinces" style="color:var(--teal);font-weight:600;text-decoration:none;">Explore all 18 provinces →</a>
        </div>
      </article>
    </section>

    <section class="domain-grid" aria-label="Explore statistical domains">
      <a class="domain-card" href="#/population">
        <div class="domain-top"><span class="domain-name">Population &amp; Demographics</span><span class="domain-stat">283.5M</span></div>
        <p class="domain-desc">Age-sex pyramid, demographic dividend (69.3% working age), urbanization, and 6-island population share.</p>
        <div class="domain-foot"><span>World Bank / BPS (2024)</span><span>Open section →</span></div>
      </a>
      <a class="domain-card" href="#/economy">
        <div class="domain-top"><span class="domain-name">Economy &amp; GDP</span><span class="domain-stat">$1.40T</span></div>
        <p class="domain-desc">10-year real growth, CPI inflation, 9-sector GDP structure led by manufacturing (18.9%), and $31B trade surplus.</p>
        <div class="domain-foot"><span>BPS / World Bank (2024)</span><span>Open section →</span></div>
      </a>
      <a class="domain-card" href="#/provinces">
        <div class="domain-top"><span class="domain-name">Provinces &amp; Regions</span><span class="domain-stat">38 Provinces</span></div>
        <p class="domain-desc">Compare 18 major provinces across GRDP, HDI, literacy, life expectancy, and regional economic concentration.</p>
        <div class="domain-foot"><span>BPS Regional Accounts (2024)</span><span>Open section →</span></div>
      </a>
      <a class="domain-card" href="#/health">
        <div class="domain-top"><span class="domain-name">Health &amp; Well-being</span><span class="domain-stat">74.2 yrs</span></div>
        <p class="domain-desc">Life expectancy gains, JKN 98% health insurance coverage, child stunting decline, and clean water access.</p>
        <div class="domain-foot"><span>BPS / MoH / BPJS (2023–2024)</span><span>Open section →</span></div>
      </a>
      <a class="domain-card" href="#/education">
        <div class="domain-top"><span class="domain-name">Education &amp; HDI</span><span class="domain-stat">96.5% lit.</span></div>
        <p class="domain-desc">Primary-to-tertiary enrollment ladder, HDI progression to 75.02, and mean years of schooling across regions.</p>
        <div class="domain-foot"><span>BPS SUSENAS (2024)</span><span>Open section →</span></div>
      </a>
      <a class="domain-card" href="#/employment">
        <div class="domain-top"><span class="domain-name">Employment &amp; Labor</span><span class="domain-stat">4.91% TPT</span></div>
        <p class="domain-desc">152.1M labor force, post-2020 unemployment recovery, formal vs. informal split, and sector jobs breakdown.</p>
        <div class="domain-foot"><span>BPS SAKERNAS (Aug 2024)</span><span>Open section →</span></div>
      </a>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">National Indicator Reference Directory</h2>
          <p class="panel-sub">Filter all key figures by keyword or domain; click any row to open its detailed statistical section.</p>
        </div>
        <div class="panel-controls">
          <input id="ov-table-search" class="filter-input" type="search" placeholder="Filter indicators…" value="${esc(state.tableQuery)}">
          <select id="ov-cat-filter" class="filter-select" aria-label="Filter by domain">
            <option value="all">All domains</option>
            <option value="Population">Population</option>
            <option value="Economy">Economy</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Employment">Employment</option>
          </select>
        </div>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Domain</th>
              <th class="num">Latest Figure</th>
              <th class="num">Prior Year</th>
              <th class="num">Change</th>
              <th>Source &amp; Year</th>
            </tr>
          </thead>
          <tbody id="ov-indicator-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  // Wire controls
  root.querySelectorAll('[data-ov-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.overviewMetric = btn.dataset.ovMetric;
      actions.rerender();
    });
  });
  root.querySelectorAll('[data-ov-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.overviewChartType = btn.dataset.ovType;
      actions.rerender();
    });
  });
  root.querySelector('#ov-province-select')?.addEventListener('change', (e) => {
    actions.setProvince(e.target.value);
  });

  // Render charts
  const idx = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  const seriesCfg = metric === 'gdpGrowth'
    ? { values: MACRO_SERIES.map((d) => d.gdpGrowth), suffix: '%', prefix: '', forceZero: true }
    : metric === 'gdpUsdB'
      ? { values: MACRO_SERIES.map((d) => d.gdpUsdB), suffix: 'B', prefix: '$', forceZero: false }
      : { values: MACRO_SERIES.map((d) => d.popM), suffix: 'M', prefix: '', forceZero: false };

  drawTimeChart(root.querySelector('#ov-main-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    type: chartType,
    highlightIndex: idx,
    ...seriesCfg,
  });

  drawHorizontalBars(root.querySelector('#ov-prov-chart'), {
    items: [
      { key: 'grdpCap', label: 'GRDP / Capita', value: Math.round((prov.grdpPerCap / NATIONAL_BENCHMARKS.grdpPerCapitaUsd) * 100), note: `$${prov.grdpPerCap.toLocaleString('en-US')} vs $${NATIONAL_BENCHMARKS.grdpPerCapitaUsd.toLocaleString('en-US')}`, color: PALETTE.terra },
      { key: 'hdi', label: 'HDI Index', value: Number(((prov.hdi / NATIONAL_BENCHMARKS.hdi) * 100).toFixed(1)), note: `${prov.hdi.toFixed(2)} vs ${NATIONAL_BENCHMARKS.hdi}` },
      { key: 'lit', label: 'Adult Literacy', value: Number(((prov.literacy / NATIONAL_BENCHMARKS.literacyPct) * 100).toFixed(1)), note: `${prov.literacy}% vs ${NATIONAL_BENCHMARKS.literacyPct}%` },
      { key: 'life', label: 'Life Expectancy', value: Number(((prov.lifeExp / NATIONAL_BENCHMARKS.lifeExpectancyYrs) * 100).toFixed(1)), note: `${prov.lifeExp} yrs vs ${NATIONAL_BENCHMARKS.lifeExpectancyYrs} yrs` },
      { key: 'emp', label: 'Employment Rate', value: Number((((100 - prov.unemp) / (100 - NATIONAL_BENCHMARKS.unemploymentPct)) * 100).toFixed(1)), note: `${(100 - prov.unemp).toFixed(2)}% employed` },
    ],
    suffix: '',
  });

  // Table filter
  const searchEl = root.querySelector('#ov-table-search');
  const catEl = root.querySelector('#ov-cat-filter');
  const tbody = root.querySelector('#ov-indicator-tbody');

  function renderRows() {
    const q = searchEl.value.trim().toLowerCase();
    const cat = catEl.value;
    const filtered = INDICATOR_DIRECTORY.filter((item) => {
      const catOk = cat === 'all' || item.category === cat;
      const qOk = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.source.toLowerCase().includes(q);
      return catOk && qOk;
    });
    tbody.innerHTML = filtered.length
      ? filtered.map((item) => `
          <tr class="clickable" data-jump="${item.route}">
            <td><strong>${esc(item.name)}</strong></td>
            <td><span class="pill">${esc(item.category)}</span></td>
            <td class="num"><strong>${esc(item.value)}</strong></td>
            <td class="num">${esc(item.prev)}</td>
            <td class="num">${esc(item.change)}</td>
            <td class="source-cell">${esc(item.source)} (${esc(item.year)})</td>
          </tr>
        `).join('')
      : '<tr><td colspan="6" style="text-align:center;color:var(--ink-muted)">No indicators match your filter.</td></tr>';

    tbody.querySelectorAll('tr[data-jump]').forEach((tr) => {
      tr.addEventListener('click', () => {
        window.location.hash = `#/${tr.dataset.jump}`;
      });
    });
  }

  searchEl.addEventListener('input', () => {
    state.tableQuery = searchEl.value;
    renderRows();
  });
  catEl.addEventListener('change', renderRows);
  renderRows();
}

export function renderPopulationPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1);
  const chartType = state.popChartType;
  const metric = state.popMetric;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">Demographics &amp; Spatial Distribution</div>
        <h1 class="page-title">Population Statistics (${cur.year})</h1>
        <p class="page-lead">Indonesia is the world's fourth most populous nation with 283.5 million residents across 38 provinces and ~17,000 islands, currently in a prime working-age demographic window.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group">
          <button class="seg-btn ${metric === 'popM' ? 'active' : ''}" data-pop-m="popM" type="button">Total Population</button>
          <button class="seg-btn ${metric === 'urbanPct' ? 'active' : ''}" data-pop-m="urbanPct" type="button">Urban Share %</button>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-pop-t="line" type="button">Line</button>
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-pop-t="bar" type="button">Bar</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4">
      <article class="kpi-card">
        <div class="kpi-label">Total Population</div>
        <div class="kpi-value">${cur.popM.toFixed(1)}M</div>
        ${deltaHtml(cur.popM, prev?.popM, 'M', 1)}
        <div class="kpi-source">World Bank (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Urban Population Share</div>
        <div class="kpi-value">${cur.urbanPct.toFixed(1)}%</div>
        ${deltaHtml(cur.urbanPct, prev?.urbanPct, ' pp', 1)}
        <div class="kpi-source">World Bank (${cur.year})</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">Working-Age (15–64)</div>
        <div class="kpi-value">69.3%</div>
        <span class="kpi-delta up">Median age ${cur.medianAge.toFixed(1)} yrs</span>
        <div class="kpi-source">BPS Projection (2024)</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Total Fertility Rate</div>
        <div class="kpi-value">${cur.fertility.toFixed(2)}</div>
        ${deltaHtml(cur.fertility, prev?.fertility, ' births/w', 2, true)}
        <div class="kpi-source">World Bank / BPS (${cur.year})</div>
      </article>
    </section>

    <div class="insight-strip">
      <strong>Demographic Dividend:</strong> With 69.3% of residents aged 15–64 and fertility stabilizing near replacement level (2.10), Indonesia's dependency ratio remains historically favorable (~44 dependents per 100 working-age adults, BPS 2024).
    </div>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'popM' ? 'Population Growth (2015–2024)' : 'Urbanization Rate (2015–2024)'}</h2>
            <p class="panel-sub">${metric === 'popM' ? 'Millions of residents; 2020 reflects BPS Population Census benchmark.' : 'Percentage of total population residing in urban areas.'}</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="pop-trend-chart"></canvas></div>
        <div class="chart-foot"><span>Source: World Bank Open Data &amp; BPS Census (2015–2024)</span><span>Density: ~149 / km² (2024)</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Population Pyramid by Age &amp; Sex (2024)</h2>
            <p class="panel-sub">Share of total population (%) across 5-year cohorts showing broad working-age cohorts.</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="pop-pyramid-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS Population Projections (2024)</span><span>Sex ratio: ~102 males per 100 females</span></div>
      </article>
    </section>

    <section class="grid-2-wide">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Demographic Time Series (2015–2024)</h2>
            <p class="panel-sub">Annual national population, growth rate, urbanization, median age, and fertility.</p>
          </div>
          <button id="pop-export" class="btn-outline" type="button">Export CSV</button>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th class="num">Population (M)</th>
                <th class="num">Growth (%)</th>
                <th class="num">Urban (%)</th>
                <th class="num">Median Age</th>
                <th class="num">Fertility</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${[...MACRO_SERIES].reverse().map((r) => `
                <tr class="${r.year === cur.year ? 'selected-row' : ''}">
                  <td><strong>${r.year}</strong></td>
                  <td class="num">${r.popM.toFixed(1)}</td>
                  <td class="num">${r.popGrowth.toFixed(2)}%</td>
                  <td class="num">${r.urbanPct.toFixed(1)}%</td>
                  <td class="num">${r.medianAge.toFixed(1)} yrs</td>
                  <td class="num">${r.fertility.toFixed(2)}</td>
                  <td class="source-cell">World Bank / BPS (${r.year})</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Population by Island Region (2024)</h2>
            <p class="panel-sub">Java accounts for 56.1% of residents on 6.7% of Indonesia's land area.</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="pop-region-donut"></canvas></div>
        <div class="chart-foot"><span>Source: BPS Regional Population Projection (2024)</span><span>38 provinces</span></div>
      </article>
    </section>
  `;

  root.querySelectorAll('[data-pop-m]').forEach((b) => b.addEventListener('click', () => {
    state.popMetric = b.dataset.popM;
    actions.rerender();
  }));
  root.querySelectorAll('[data-pop-t]').forEach((b) => b.addEventListener('click', () => {
    state.popChartType = b.dataset.popT;
    actions.rerender();
  }));
  root.querySelector('#pop-export')?.addEventListener('click', () => {
    exportTableCsv(
      'indonesia-population-2015-2024.csv',
      ['Year', 'Population_Millions', 'Growth_Pct', 'Urban_Pct', 'Median_Age', 'Fertility_Rate', 'Source'],
      MACRO_SERIES.map((r) => [r.year, r.popM, r.popGrowth, r.urbanPct, r.medianAge, r.fertility, `World Bank / BPS (${r.year})`]),
    );
  });

  const hi = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  drawTimeChart(root.querySelector('#pop-trend-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    values: MACRO_SERIES.map((d) => d[metric]),
    type: chartType,
    highlightIndex: hi,
    suffix: metric === 'popM' ? 'M' : '%',
    forceZero: false,
  });

  drawPyramid(root.querySelector('#pop-pyramid-chart'), { rows: POPULATION_PYRAMID_2024 });

  drawDonut(root.querySelector('#pop-region-donut'), {
    items: ISLAND_REGIONS_2024.map((r) => ({ label: r.region, value: r.popShare, note: `${r.provinces} provinces` })),
    centerTop: '283.5M',
    centerBottom: 'BPS / WB 2024',
    suffix: '%',
  });
}

export function renderEconomyPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1);
  const surplus = cur.exportsB - cur.importsB;
  const prevSurplus = prev ? prev.exportsB - prev.importsB : null;
  const chartType = state.econChartType;
  const metric = state.econMetric;
  const sectorView = state.econSectorView;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">National Accounts, Prices &amp; External Trade</div>
        <h1 class="page-title">Economy &amp; GDP (${cur.year})</h1>
        <p class="page-lead">Southeast Asia's largest economy and a G20 member, anchored by resilient domestic consumption, downstream mineral processing, and a $31.0 billion merchandise trade surplus.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group">
          <button class="seg-btn ${metric === 'gdpGrowth' ? 'active' : ''}" data-ec-m="gdpGrowth" type="button">GDP Growth %</button>
          <button class="seg-btn ${metric === 'gdpUsdB' ? 'active' : ''}" data-ec-m="gdpUsdB" type="button">Nominal GDP $B</button>
          <button class="seg-btn ${metric === 'inflation' ? 'active' : ''}" data-ec-m="inflation" type="button">CPI Inflation %</button>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-ec-t="bar" type="button">Bar</button>
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-ec-t="line" type="button">Line</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4">
      <article class="kpi-card">
        <div class="kpi-label">Nominal GDP</div>
        <div class="kpi-value">$${(cur.gdpUsdB / 1000).toFixed(2)}T</div>
        ${deltaHtml(cur.gdpUsdB, prev?.gdpUsdB, 'B USD', 0)}
        <div class="kpi-source">World Bank / BPS (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Real GDP Growth</div>
        <div class="kpi-value">${cur.gdpGrowth.toFixed(2)}%</div>
        ${deltaHtml(cur.gdpGrowth, prev?.gdpGrowth, ' pp', 2)}
        <div class="kpi-source">BPS National Accounts (${cur.year})</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">CPI Inflation (YoY)</div>
        <div class="kpi-value">${cur.inflation.toFixed(2)}%</div>
        ${deltaHtml(cur.inflation, prev?.inflation, ' pp', 2, true)}
        <div class="kpi-source">BPS Consumer Prices (${cur.year})</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Trade Balance</div>
        <div class="kpi-value">${surplus >= 0 ? '+' : ''}$${surplus.toFixed(1)}B</div>
        ${deltaHtml(surplus, prevSurplus, 'B', 1)}
        <div class="kpi-source">BPS External Trade (${cur.year})</div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'gdpGrowth' ? 'Real GDP Growth Rate (2015–2024)' : metric === 'gdpUsdB' ? 'Nominal GDP in USD Billions (2015–2024)' : 'Year-End CPI Inflation Rate (2015–2024)'}</h2>
            <p class="panel-sub">Steady ~5% annual expansion outside the 2020 pandemic contraction (-2.07%).</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="ec-main-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS &amp; World Bank (2015–2024)</span><span>Selected year: ${cur.year}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">GDP by Economic Sector (2024)</h2>
            <p class="panel-sub">${sectorView === 'sharePct' ? 'Percentage contribution to nominal GDP' : 'Annual real sector growth (% YoY)'}</p>
          </div>
          <div class="seg-group">
            <button class="seg-btn ${sectorView === 'sharePct' ? 'active' : ''}" data-ec-s="sharePct" type="button">GDP Share %</button>
            <button class="seg-btn ${sectorView === 'growthPct' ? 'active' : ''}" data-ec-s="growthPct" type="button">YoY Growth %</button>
          </div>
        </div>
        <div class="chart-stage"><canvas id="ec-sector-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS National Accounts (2024)</span><span>Rp 22,139 trillion nominal GDP</span></div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Merchandise Exports vs. Imports (2019–2024)</h2>
            <p class="panel-sub">USD billions; five consecutive years of substantial trade surpluses since 2020.</p>
          </div>
          <div class="legend-row">
            <span class="legend-item"><span class="legend-dot" style="background:var(--teal)"></span>Exports ($B)</span>
            <span class="legend-item"><span class="legend-dot" style="background:var(--terra)"></span>Imports ($B)</span>
          </div>
        </div>
        <div class="chart-stage compact"><canvas id="ec-trade-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS External Trade Statistics (2019–2024)</span><span>2024 surplus: $31.0B</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Macroeconomic Series Table (2015–2024)</h2>
            <p class="panel-sub">Click Export CSV to save the full 10-year macroeconomic series.</p>
          </div>
          <button id="ec-export" class="btn-outline" type="button">Export CSV</button>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th class="num">GDP ($B)</th>
                <th class="num">Growth</th>
                <th class="num">GDP/Cap</th>
                <th class="num">CPI</th>
                <th class="num">Surplus ($B)</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${[...MACRO_SERIES].reverse().map((r) => `
                <tr class="${r.year === cur.year ? 'selected-row' : ''}">
                  <td><strong>${r.year}</strong></td>
                  <td class="num">$${r.gdpUsdB.toLocaleString('en-US')}</td>
                  <td class="num">${r.gdpGrowth.toFixed(2)}%</td>
                  <td class="num">$${r.gdpPerCap.toLocaleString('en-US')}</td>
                  <td class="num">${r.inflation.toFixed(2)}%</td>
                  <td class="num">${(r.exportsB - r.importsB >= 0 ? '+' : '') + (r.exportsB - r.importsB).toFixed(1)}</td>
                  <td class="source-cell">BPS / WB (${r.year})</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  root.querySelectorAll('[data-ec-m]').forEach((b) => b.addEventListener('click', () => {
    state.econMetric = b.dataset.ecM;
    actions.rerender();
  }));
  root.querySelectorAll('[data-ec-t]').forEach((b) => b.addEventListener('click', () => {
    state.econChartType = b.dataset.ecT;
    actions.rerender();
  }));
  root.querySelectorAll('[data-ec-s]').forEach((b) => b.addEventListener('click', () => {
    state.econSectorView = b.dataset.ecS;
    actions.rerender();
  }));
  root.querySelector('#ec-export')?.addEventListener('click', () => {
    exportTableCsv(
      'indonesia-economy-2015-2024.csv',
      ['Year', 'Nominal_GDP_USD_B', 'Real_Growth_Pct', 'GDP_Per_Capita_USD', 'CPI_Inflation_Pct', 'Exports_USD_B', 'Imports_USD_B', 'Source'],
      MACRO_SERIES.map((r) => [r.year, r.gdpUsdB, r.gdpGrowth, r.gdpPerCap, r.inflation, r.exportsB, r.importsB, `BPS / World Bank (${r.year})`]),
    );
  });

  const hi = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  drawTimeChart(root.querySelector('#ec-main-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    values: MACRO_SERIES.map((d) => d[metric]),
    type: chartType,
    highlightIndex: hi,
    prefix: metric === 'gdpUsdB' ? '$' : '',
    suffix: metric === 'gdpUsdB' ? 'B' : '%',
    forceZero: metric !== 'gdpUsdB',
    color: metric === 'inflation' ? PALETTE.ochre : PALETTE.teal,
  });

  drawHorizontalBars(root.querySelector('#ec-sector-chart'), {
    items: [...GDP_SECTORS_2024]
      .sort((a, b) => b[sectorView] - a[sectorView])
      .map((s) => ({
        key: s.sector,
        label: s.sector,
        value: s[sectorView],
        note: `Share ${s.sharePct}% · Growth ${s.growthPct}% (${s.source})`,
      })),
    suffix: '%',
    color: sectorView === 'sharePct' ? PALETTE.teal : PALETTE.terra,
  });

  const tradeYears = MACRO_SERIES.filter((d) => d.year >= 2019);
  drawGroupedBars(root.querySelector('#ec-trade-chart'), {
    labels: tradeYears.map((d) => String(d.year)),
    series: [
      { name: 'Exports', values: tradeYears.map((d) => d.exportsB), color: PALETTE.teal },
      { name: 'Imports', values: tradeYears.map((d) => d.importsB), color: PALETTE.terra },
    ],
    prefix: '$',
    suffix: 'B',
  });
}

export function renderProvincesPage(root, state, actions) {
  clearRegisteredCharts();
  const prov = getProvinceById(state.provinceId);
  const metric = state.provMetric;
  const chartMode = state.provChartMode;
  const regionFilter = state.provRegion;
  const regions = ['All Regions', ...ISLAND_REGIONS_2024.map((r) => r.region)];

  const metricMeta = {
    grdpPerCap: { label: 'GRDP per Capita (USD)', prefix: '$', suffix: '' },
    grdpB: { label: 'Total GRDP (USD Billions)', prefix: '$', suffix: 'B' },
    popM: { label: 'Population (Millions)', prefix: '', suffix: 'M' },
    hdi: { label: 'Human Development Index', prefix: '', suffix: '' },
    unemp: { label: 'Open Unemployment (%)', prefix: '', suffix: '%' },
    lifeExp: { label: 'Life Expectancy (Years)', prefix: '', suffix: ' yrs' },
  }[metric];

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">Subnational Atlas · 38 Provinces · 6 Island Regions</div>
        <h1 class="page-title">Provincial Statistics &amp; Regional Comparison (2024)</h1>
        <p class="page-lead">Compare Indonesia's major provinces across output, living standards, human development, and labor outcomes. Select any province in the dropdown or table below to update the spotlight.</p>
      </div>
      <div class="page-controls">
        <select id="prov-select" class="filter-select" aria-label="Focus province">
          ${PROVINCES.map((p) => `<option value="${p.id}" ${p.id === prov.id ? 'selected' : ''}>${esc(p.name)} (${esc(p.region)})</option>`).join('')}
        </select>
        <select id="prov-metric" class="filter-select" aria-label="Ranking metric">
          <option value="grdpPerCap" ${metric === 'grdpPerCap' ? 'selected' : ''}>GRDP per Capita ($)</option>
          <option value="grdpB" ${metric === 'grdpB' ? 'selected' : ''}>Total GRDP ($B)</option>
          <option value="popM" ${metric === 'popM' ? 'selected' : ''}>Population (M)</option>
          <option value="hdi" ${metric === 'hdi' ? 'selected' : ''}>HDI Score</option>
          <option value="unemp" ${metric === 'unemp' ? 'selected' : ''}>Unemployment (%)</option>
          <option value="lifeExp" ${metric === 'lifeExp' ? 'selected' : ''}>Life Expectancy</option>
        </select>
        <div class="seg-group">
          <button class="seg-btn ${chartMode === 'bar' ? 'active' : ''}" data-pr-mode="bar" type="button">Rank Bar</button>
          <button class="seg-btn ${chartMode === 'scatter' ? 'active' : ''}" data-pr-mode="scatter" type="button">GRDP vs HDI</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4" aria-label="Selected province profile">
      <article class="kpi-card accent-terra">
        <div class="kpi-label">${esc(prov.name)} · Population</div>
        <div class="kpi-value">${prov.popM.toFixed(1)}M</div>
        <span class="kpi-delta neutral">${esc(prov.region)} · Capital ${esc(prov.capital)}</span>
        <div class="kpi-source">${esc(prov.source)}</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Provincial GRDP</div>
        <div class="kpi-value">$${prov.grdpB.toFixed(1)}B</div>
        <span class="kpi-delta ${prov.grdpPerCap >= NATIONAL_BENCHMARKS.grdpPerCapitaUsd ? 'up' : 'neutral'}">$${prov.grdpPerCap.toLocaleString('en-US')} / capita</span>
        <div class="kpi-source">${esc(prov.source)}</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">Human Development (HDI)</div>
        <div class="kpi-value">${prov.hdi.toFixed(2)}</div>
        <span class="kpi-delta ${prov.hdi >= NATIONAL_BENCHMARKS.hdi ? 'up' : 'down'}">${(prov.hdi - NATIONAL_BENCHMARKS.hdi >= 0 ? '+' : '') + (prov.hdi - NATIONAL_BENCHMARKS.hdi).toFixed(2)} vs national</span>
        <div class="kpi-source">${esc(prov.source)}</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Unemployment &amp; Literacy</div>
        <div class="kpi-value">${prov.unemp.toFixed(2)}%</div>
        <span class="kpi-delta neutral">Literacy ${prov.literacy.toFixed(1)}% · Life exp ${prov.lifeExp.toFixed(1)}y</span>
        <div class="kpi-source">${esc(prov.source)}</div>
      </article>
    </section>

    <section class="grid-2-wide">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${chartMode === 'bar' ? `Provincial Ranking: ${metricMeta.label}` : 'Development Matrix: GRDP per Capita vs. HDI (2024)'}</h2>
            <p class="panel-sub">${chartMode === 'bar' ? `Top 10 filtered provinces; ${prov.name} highlighted in terracotta.` : 'Bubble size reflects population; selected province highlighted in terracotta.'}</p>
          </div>
        </div>
        <div class="chart-stage tall"><canvas id="prov-main-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS Regional Accounts &amp; HDI Report (2024)</span><span>Click any row below to switch province</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Island Share: GDP vs. Population (2024)</h2>
            <p class="panel-sub">Regional contribution (%) across Indonesia's six major island groups.</p>
          </div>
          <div class="legend-row">
            <span class="legend-item"><span class="legend-dot" style="background:var(--teal)"></span>GDP Share %</span>
            <span class="legend-item"><span class="legend-dot" style="background:var(--ochre)"></span>Population %</span>
          </div>
        </div>
        <div class="chart-stage tall"><canvas id="prov-region-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS Regional Economic Structure (2024)</span><span>All 38 provinces</span></div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Provincial Statistical Table (18 Major Provinces, 2024)</h2>
          <p class="panel-sub">Search by province or capital, filter by island region, click column headers to sort, or click a row to spotlight it.</p>
        </div>
        <div class="panel-controls">
          <input id="prov-search" class="filter-input" type="search" placeholder="Search province or capital…" value="${esc(state.provQuery)}">
          <select id="prov-region-filter" class="filter-select" aria-label="Filter by island region">
            ${regions.map((r) => `<option value="${esc(r)}" ${r === regionFilter ? 'selected' : ''}>${esc(r)}</option>`).join('')}
          </select>
          <button id="prov-export" class="btn-outline" type="button">Export CSV</button>
        </div>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="name">Province</th>
              <th>Island Region</th>
              <th class="num sortable" data-sort="popM">Pop (M)</th>
              <th class="num sortable" data-sort="grdpB">GRDP ($B)</th>
              <th class="num sortable" data-sort="grdpPerCap">GRDP/Cap</th>
              <th class="num sortable" data-sort="hdi">HDI</th>
              <th class="num sortable" data-sort="literacy">Literacy</th>
              <th class="num sortable" data-sort="unemp">Unemp</th>
              <th class="num sortable" data-sort="lifeExp">Life Exp</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody id="prov-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  root.querySelector('#prov-select')?.addEventListener('change', (e) => actions.setProvince(e.target.value));
  root.querySelector('#prov-metric')?.addEventListener('change', (e) => {
    state.provMetric = e.target.value;
    actions.rerender();
  });
  root.querySelectorAll('[data-pr-mode]').forEach((b) => b.addEventListener('click', () => {
    state.provChartMode = b.dataset.prMode;
    actions.rerender();
  }));

  const searchEl = root.querySelector('#prov-search');
  const regionEl = root.querySelector('#prov-region-filter');
  const tbody = root.querySelector('#prov-tbody');

  function getFiltered() {
    const q = searchEl.value.trim().toLowerCase();
    const reg = regionEl.value;
    const list = PROVINCES.filter((p) => {
      const rOk = reg === 'All Regions' || p.region === reg;
      const qOk = !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q) || p.region.toLowerCase().includes(q);
      return rOk && qOk;
    });
    const col = state.provSortCol;
    const dir = state.provSortDir;
    return list.sort((a, b) => {
      if (col === 'name') return dir * a.name.localeCompare(b.name);
      return dir * (a[col] - b[col]);
    });
  }

  function renderChartsAndRows() {
    const list = getFiltered();
    const maxVal = Math.max(...PROVINCES.map((p) => p.grdpPerCap));

    tbody.innerHTML = list.length
      ? list.map((p) => `
          <tr class="clickable ${p.id === prov.id ? 'selected-row' : ''}" data-pid="${p.id}">
            <td><strong>${esc(p.name)}</strong><div style="font-size:.72rem;color:var(--ink-soft)">${esc(p.capital)}</div></td>
            <td><span class="pill">${esc(p.region)}</span></td>
            <td class="num">${p.popM.toFixed(1)}</td>
            <td class="num">$${p.grdpB.toFixed(1)}</td>
            <td class="num"><span class="bar-cell"><span class="micro-bar"><span style="width:${Math.round((p.grdpPerCap / maxVal) * 100)}%"></span></span>$${p.grdpPerCap.toLocaleString('en-US')}</span></td>
            <td class="num">${p.hdi.toFixed(2)}</td>
            <td class="num">${p.literacy.toFixed(1)}%</td>
            <td class="num">${p.unemp.toFixed(2)}%</td>
            <td class="num">${p.lifeExp.toFixed(1)}</td>
            <td class="source-cell">${esc(p.source)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="10" style="text-align:center;color:var(--ink-muted)">No provinces match this search.</td></tr>';

    tbody.querySelectorAll('tr[data-pid]').forEach((tr) => {
      tr.addEventListener('click', () => actions.setProvince(tr.dataset.pid));
    });

    const chartCanvas = root.querySelector('#prov-main-chart');
    if (chartMode === 'bar') {
      const pool = list.length ? [...list] : [...PROVINCES];
      pool.sort((a, b) => b[metric] - a[metric]);
      let top = pool.slice(0, 10);
      if (!top.some((p) => p.id === prov.id) && pool.some((p) => p.id === prov.id)) {
        top = [...top.slice(0, 9), prov];
      }
      drawHorizontalBars(chartCanvas, {
        items: top.map((p) => ({
          key: p.id,
          label: p.name,
          value: p[metric],
          note: `${p.region} · ${p.source}`,
        })),
        highlightKey: prov.id,
        prefix: metricMeta.prefix,
        suffix: metricMeta.suffix,
      });
    } else {
      const pool = list.length ? list : PROVINCES;
      drawScatter(chartCanvas, {
        points: pool.map((p) => ({ key: p.id, label: p.name, x: p.grdpPerCap, y: p.hdi, size: p.popM })),
        xLabel: 'GRDP per Capita (USD, BPS 2024)',
        yLabel: 'HDI Score (BPS 2024)',
        highlightKey: prov.id,
      });
    }
  }

  root.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (state.provSortCol === col) {
        state.provSortDir *= -1;
      } else {
        state.provSortCol = col;
        state.provSortDir = col === 'name' ? 1 : -1;
      }
      renderChartsAndRows();
    });
  });

  searchEl.addEventListener('input', () => {
    state.provQuery = searchEl.value;
    renderChartsAndRows();
  });
  regionEl.addEventListener('change', () => {
    state.provRegion = regionEl.value;
    renderChartsAndRows();
  });
  root.querySelector('#prov-export')?.addEventListener('click', () => {
    const rows = getFiltered();
    exportTableCsv(
      'indonesia-provinces-2024.csv',
      ['Province', 'Capital', 'Region', 'Population_M', 'GRDP_USD_B', 'GRDP_Per_Capita_USD', 'HDI', 'Literacy_Pct', 'Unemployment_Pct', 'Life_Expectancy_Yrs', 'Source'],
      rows.map((p) => [p.name, p.capital, p.region, p.popM, p.grdpB, p.grdpPerCap, p.hdi, p.literacy, p.unemp, p.lifeExp, p.source]),
    );
  });

  drawGroupedBars(root.querySelector('#prov-region-chart'), {
    labels: ISLAND_REGIONS_2024.map((r) => r.region.replace(' & Nusa Tenggara', ' & NT').replace(' & Papua', '/Papua')),
    series: [
      { name: 'GDP Share', values: ISLAND_REGIONS_2024.map((r) => r.gdpShare), color: PALETTE.teal },
      { name: 'Population Share', values: ISLAND_REGIONS_2024.map((r) => r.popShare), color: PALETTE.ochre },
    ],
    suffix: '%',
  });

  renderChartsAndRows();
}

export function renderHealthPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1);
  const metric = state.healthMetric;
  const chartType = state.healthChartType;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">Public Health, Longevity &amp; Universal Coverage</div>
        <h1 class="page-title">Health &amp; Well-being (${cur.year})</h1>
        <p class="page-lead">Steady improvements in life expectancy, declining infant mortality, near-universal JKN health insurance coverage (98%), and a multi-year decline in child stunting prevalence.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group">
          <button class="seg-btn ${metric === 'lifeExp' ? 'active' : ''}" data-hl-m="lifeExp" type="button">Life Expectancy</button>
          <button class="seg-btn ${metric === 'infantMort' ? 'active' : ''}" data-hl-m="infantMort" type="button">Infant Mortality</button>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-hl-t="line" type="button">Line</button>
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-hl-t="bar" type="button">Bar</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4">
      <article class="kpi-card">
        <div class="kpi-label">Life Expectancy</div>
        <div class="kpi-value">${cur.lifeExp.toFixed(1)} yrs</div>
        ${deltaHtml(cur.lifeExp, prev?.lifeExp, ' yrs', 1)}
        <div class="kpi-source">BPS (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Child Stunting (&lt;5)</div>
        <div class="kpi-value">21.5%</div>
        <span class="kpi-delta up">-9.3 pp since 2018 (30.8%)</span>
        <div class="kpi-source">MoH SKI Survey (2023)</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">JKN Health Coverage</div>
        <div class="kpi-value">98.0%</div>
        <span class="kpi-delta up">~277M enrollees</span>
        <div class="kpi-source">BPJS Kesehatan (2024)</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">Infant Mortality</div>
        <div class="kpi-value">${cur.infantMort.toFixed(1)}</div>
        ${deltaHtml(cur.infantMort, prev?.infantMort, ' /1k', 1, true)}
        <div class="kpi-source">BPS / World Bank (${cur.year})</div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'lifeExp' ? 'Life Expectancy at Birth (2015–2024)' : 'Infant Mortality Rate (2015–2024)'}</h2>
            <p class="panel-sub">${metric === 'lifeExp' ? 'Average years expected at birth; +1.7 years gained since 2015.' : 'Deaths under age 1 per 1,000 live births; down 26% since 2015.'}</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="hl-trend-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS &amp; World Bank (2015–2024)</span><span>Active year: ${cur.year}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Under-5 Child Stunting Reduction (2018–2023)</h2>
            <p class="panel-sub">National survey prevalence (%) compared with the 14.0% strategic benchmark.</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="hl-stunting-chart"></canvas></div>
        <div class="chart-foot"><span>Source: Ministry of Health (Riskesdas 2018, SSGI 2021–22, SKI 2023)</span><span>Target: 14.0%</span></div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Health System Capacity &amp; Household Access Indicators</h2>
          <p class="panel-sub">Search health infrastructure, sanitation, water, and public coverage metrics.</p>
        </div>
        <input id="hl-search" class="filter-input" type="search" placeholder="Filter health metrics…">
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th class="num">Latest Figure</th>
              <th class="num">Previous</th>
              <th class="num">Change</th>
              <th>Context</th>
              <th>Source &amp; Year</th>
            </tr>
          </thead>
          <tbody id="hl-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-hl-m]').forEach((b) => b.addEventListener('click', () => {
    state.healthMetric = b.dataset.hlM;
    actions.rerender();
  }));
  root.querySelectorAll('[data-hl-t]').forEach((b) => b.addEventListener('click', () => {
    state.healthChartType = b.dataset.hlT;
    actions.rerender();
  }));

  const hi = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  drawTimeChart(root.querySelector('#hl-trend-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    values: MACRO_SERIES.map((d) => d[metric]),
    type: chartType,
    highlightIndex: hi,
    suffix: metric === 'lifeExp' ? 'y' : '',
    forceZero: false,
    color: metric === 'lifeExp' ? PALETTE.teal : PALETTE.terra,
  });

  drawTimeChart(root.querySelector('#hl-stunting-chart'), {
    labels: STUNTING_SERIES.map((d) => d.year),
    values: STUNTING_SERIES.map((d) => d.rate),
    type: 'bar',
    highlightIndex: STUNTING_SERIES.length - 1,
    suffix: '%',
    forceZero: true,
    color: PALETTE.teal,
    targetLine: { value: 14.0, label: 'National Target 14.0%' },
  });

  const searchEl = root.querySelector('#hl-search');
  const tbody = root.querySelector('#hl-tbody');
  function renderRows() {
    const q = searchEl.value.trim().toLowerCase();
    const list = HEALTH_INDICATORS.filter((r) => !q || r.metric.toLowerCase().includes(q) || r.note.toLowerCase().includes(q) || r.source.toLowerCase().includes(q));
    tbody.innerHTML = list.map((r) => `
      <tr>
        <td><strong>${esc(r.metric)}</strong></td>
        <td class="num"><strong>${esc(r.value)}</strong></td>
        <td class="num">${esc(r.prev)}</td>
        <td class="num"><span class="pill">${esc(r.change)}</span></td>
        <td>${esc(r.note)}</td>
        <td class="source-cell">${esc(r.source)} (${esc(r.year)})</td>
      </tr>
    `).join('');
  }
  searchEl.addEventListener('input', renderRows);
  renderRows();
}

export function renderEducationPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1);
  const metric = state.eduMetric;
  const chartType = state.eduChartType;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">Human Capital, Literacy &amp; Schooling</div>
        <h1 class="page-title">Education &amp; Human Development (${cur.year})</h1>
        <p class="page-lead">Near-universal primary enrollment (98.0%) and youth literacy (99.8%), backed by a constitutional 20% state budget mandate for education, with steady expansion in secondary and tertiary participation.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group">
          <button class="seg-btn ${metric === 'hdi' ? 'active' : ''}" data-ed-m="hdi" type="button">HDI Score</button>
          <button class="seg-btn ${metric === 'schoolingYrs' ? 'active' : ''}" data-ed-m="schoolingYrs" type="button">Mean Schooling Yrs</button>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-ed-t="line" type="button">Line</button>
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-ed-t="bar" type="button">Bar</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4">
      <article class="kpi-card">
        <div class="kpi-label">Adult Literacy (15+)</div>
        <div class="kpi-value">96.5%</div>
        <span class="kpi-delta up">Youth (15–24): 99.8%</span>
        <div class="kpi-source">BPS SUSENAS (2024)</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Human Development (HDI)</div>
        <div class="kpi-value">${cur.hdi.toFixed(2)}</div>
        ${deltaHtml(cur.hdi, prev?.hdi, ' pts', 2)}
        <div class="kpi-source">BPS (${cur.year})</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">Mean Schooling (25+)</div>
        <div class="kpi-value">${cur.schoolingYrs.toFixed(2)} yrs</div>
        ${deltaHtml(cur.schoolingYrs, prev?.schoolingYrs, ' yrs', 2)}
        <div class="kpi-source">BPS (${cur.year})</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Expected Schooling</div>
        <div class="kpi-value">13.21 yrs</div>
        <span class="kpi-delta up">20% of state budget</span>
        <div class="kpi-source">BPS / MoF (2024)</div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'hdi' ? 'Human Development Index (2015–2024)' : 'Mean Years of Schooling (2015–2024)'}</h2>
            <p class="panel-sub">${metric === 'hdi' ? 'Composite score of longevity, education, and decent living standards (0–100).' : 'Average completed schooling among adults aged 25 and over.'}</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="ed-trend-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS Human Development Index Series (2015–2024)</span><span>Selected year: ${cur.year}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Enrollment Ladder by Education Tier (2024)</h2>
            <p class="panel-sub">Net enrollment for K–12 tiers and gross enrollment for higher education (%).</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="ed-enroll-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS SUSENAS Education Module (2024)</span><span>Unit: % of age cohort</span></div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Education &amp; Human Capital Indicators</h2>
          <p class="panel-sub">Filter national literacy, attainment, schools, and financing benchmarks.</p>
        </div>
        <input id="ed-search" class="filter-input" type="search" placeholder="Filter education metrics…">
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th class="num">Latest Figure</th>
              <th class="num">Prior Year</th>
              <th class="num">Change</th>
              <th>Notes</th>
              <th>Source &amp; Year</th>
            </tr>
          </thead>
          <tbody id="ed-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-ed-m]').forEach((b) => b.addEventListener('click', () => {
    state.eduMetric = b.dataset.edM;
    actions.rerender();
  }));
  root.querySelectorAll('[data-ed-t]').forEach((b) => b.addEventListener('click', () => {
    state.eduChartType = b.dataset.edT;
    actions.rerender();
  }));

  const hi = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  drawTimeChart(root.querySelector('#ed-trend-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    values: MACRO_SERIES.map((d) => d[metric]),
    type: chartType,
    highlightIndex: hi,
    suffix: metric === 'schoolingYrs' ? 'y' : '',
    forceZero: false,
    color: PALETTE.teal,
  });

  drawHorizontalBars(root.querySelector('#ed-enroll-chart'), {
    items: EDUCATION_ENROLLMENT_2024.map((e, i) => ({
      key: e.level,
      label: e.level,
      value: e.rate,
      note: `${e.type} · ${e.source}`,
      color: i === 3 ? PALETTE.ochre : PALETTE.teal,
    })),
    suffix: '%',
  });

  const searchEl = root.querySelector('#ed-search');
  const tbody = root.querySelector('#ed-tbody');
  function renderRows() {
    const q = searchEl.value.trim().toLowerCase();
    const list = EDUCATION_INDICATORS.filter((r) => !q || r.metric.toLowerCase().includes(q) || r.note.toLowerCase().includes(q));
    tbody.innerHTML = list.map((r) => `
      <tr>
        <td><strong>${esc(r.metric)}</strong></td>
        <td class="num"><strong>${esc(r.value)}</strong></td>
        <td class="num">${esc(r.prev)}</td>
        <td class="num"><span class="pill">${esc(r.change)}</span></td>
        <td>${esc(r.note)}</td>
        <td class="source-cell">${esc(r.source)} (${esc(r.year)})</td>
      </tr>
    `).join('');
  }
  searchEl.addEventListener('input', renderRows);
  renderRows();
}

export function renderEmploymentPage(root, state, actions) {
  clearRegisteredCharts();
  const cur = getMacroByYear(state.year);
  const prev = MACRO_SERIES.find((d) => d.year === cur.year - 1);
  const metric = state.empMetric;
  const chartType = state.empChartType;

  root.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-kicker">National Labor Force Survey (SAKERNAS)</div>
        <h1 class="page-title">Employment &amp; Labor Market (${cur.year})</h1>
        <p class="page-lead">Open unemployment fell to 4.91% in August 2024—below pre-pandemic 2019 levels—as Indonesia's active labor force expanded to 152.1 million workers.</p>
      </div>
      <div class="page-controls">
        <div class="seg-group">
          <button class="seg-btn ${metric === 'unempPct' ? 'active' : ''}" data-em-m="unempPct" type="button">Unemployment %</button>
          <button class="seg-btn ${metric === 'tpakPct' ? 'active' : ''}" data-em-m="tpakPct" type="button">Participation %</button>
          <button class="seg-btn ${metric === 'laborM' ? 'active' : ''}" data-em-m="laborM" type="button">Labor Force M</button>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${chartType === 'line' ? 'active' : ''}" data-em-t="line" type="button">Line</button>
          <button class="seg-btn ${chartType === 'bar' ? 'active' : ''}" data-em-t="bar" type="button">Bar</button>
        </div>
      </div>
    </div>

    <section class="kpi-grid cols-4">
      <article class="kpi-card">
        <div class="kpi-label">Total Labor Force</div>
        <div class="kpi-value">${cur.laborM.toFixed(1)}M</div>
        ${deltaHtml(cur.laborM, prev?.laborM, 'M', 1)}
        <div class="kpi-source">BPS SAKERNAS (${cur.year})</div>
      </article>
      <article class="kpi-card accent-terra">
        <div class="kpi-label">Open Unemployment (TPT)</div>
        <div class="kpi-value">${cur.unempPct.toFixed(2)}%</div>
        ${deltaHtml(cur.unempPct, prev?.unempPct, ' pp', 2, true)}
        <div class="kpi-source">BPS SAKERNAS (Aug ${cur.year})</div>
      </article>
      <article class="kpi-card accent-ochre">
        <div class="kpi-label">Participation (TPAK)</div>
        <div class="kpi-value">${cur.tpakPct.toFixed(1)}%</div>
        <span class="kpi-delta neutral">Male 84.7% · Female 56.4%</span>
        <div class="kpi-source">BPS SAKERNAS (Aug 2024)</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-label">Formal Sector Share</div>
        <div class="kpi-value">${EMPLOYMENT_STRUCTURE_2024.formalPct.toFixed(1)}%</div>
        <span class="kpi-delta neutral">Avg net wage Rp ${EMPLOYMENT_STRUCTURE_2024.avgMonthlyWageIdrM}M (~$${EMPLOYMENT_STRUCTURE_2024.avgMonthlyWageUsd})</span>
        <div class="kpi-source">${EMPLOYMENT_STRUCTURE_2024.source}</div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${metric === 'unempPct' ? 'Open Unemployment Rate (2015–2024)' : metric === 'tpakPct' ? 'Labor Force Participation Rate (2015–2024)' : 'Total Active Labor Force (2015–2024)'}</h2>
            <p class="panel-sub">Annual August SAKERNAS benchmark showing sustained post-2020 job recovery.</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="em-trend-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS SAKERNAS (August rounds, 2015–2024)</span><span>Active year: ${cur.year}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Employed Workforce by Sector (Aug 2024)</h2>
            <p class="panel-sub">Share of 144.6 million employed workers across major industries (%).</p>
          </div>
        </div>
        <div class="chart-stage"><canvas id="em-sector-chart"></canvas></div>
        <div class="chart-foot"><span>Source: BPS SAKERNAS (Aug 2024)</span><span>144.6M employed · 7.47M unemployed</span></div>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Formal vs. Informal Employment Split (Aug 2024)</h2>
            <p class="panel-sub">Informal work remains concentrated in agriculture, micro-trade, and family enterprises.</p>
          </div>
        </div>
        <div class="chart-stage compact"><canvas id="em-formal-donut"></canvas></div>
        <div class="chart-foot"><span>Source: BPS SAKERNAS (Aug 2024)</span><span>Formal +1.1 pp YoY</span></div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Provincial Unemployment Snapshot (2024)</h2>
            <p class="panel-sub">Filter provinces by name or region; lowest rate in Bali (1.79%).</p>
          </div>
          <input id="em-prov-search" class="filter-input" type="search" placeholder="Filter province…">
        </div>
        <div class="table-scroll" style="max-height:265px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>Region</th>
                <th class="num">Unemp (TPT)</th>
                <th class="num">Pop (M)</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody id="em-prov-tbody"></tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  root.querySelectorAll('[data-em-m]').forEach((b) => b.addEventListener('click', () => {
    state.empMetric = b.dataset.emM;
    actions.rerender();
  }));
  root.querySelectorAll('[data-em-t]').forEach((b) => b.addEventListener('click', () => {
    state.empChartType = b.dataset.emT;
    actions.rerender();
  }));

  const hi = MACRO_SERIES.findIndex((d) => d.year === cur.year);
  drawTimeChart(root.querySelector('#em-trend-chart'), {
    labels: MACRO_SERIES.map((d) => d.year),
    values: MACRO_SERIES.map((d) => d[metric]),
    type: chartType,
    highlightIndex: hi,
    suffix: metric === 'laborM' ? 'M' : '%',
    forceZero: metric === 'unempPct',
    color: metric === 'unempPct' ? PALETTE.terra : PALETTE.teal,
  });

  drawHorizontalBars(root.querySelector('#em-sector-chart'), {
    items: EMPLOYMENT_SECTORS_2024.map((s) => ({
      key: s.sector,
      label: s.sector,
      value: s.sharePct,
      note: `${s.workersM}M workers · ${s.source}`,
    })),
    suffix: '%',
  });

  drawDonut(root.querySelector('#em-formal-donut'), {
    items: [
      { label: 'Informal Sector', value: EMPLOYMENT_STRUCTURE_2024.informalPct, note: '~83.8M workers', color: PALETTE.ochre },
      { label: 'Formal Sector', value: EMPLOYMENT_STRUCTURE_2024.formalPct, note: '~60.8M workers', color: PALETTE.teal },
    ],
    centerTop: '144.6M',
    centerBottom: 'Employed 2024',
    suffix: '%',
  });

  const searchEl = root.querySelector('#em-prov-search');
  const tbody = root.querySelector('#em-prov-tbody');
  function renderRows() {
    const q = searchEl.value.trim().toLowerCase();
    const list = [...PROVINCES]
      .sort((a, b) => a.unemp - b.unemp)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q));
    tbody.innerHTML = list.map((p) => `
      <tr class="clickable ${p.id === state.provinceId ? 'selected-row' : ''}" data-pid="${p.id}">
        <td><strong>${esc(p.name)}</strong></td>
        <td><span class="pill">${esc(p.region)}</span></td>
        <td class="num"><strong>${p.unemp.toFixed(2)}%</strong></td>
        <td class="num">${p.popM.toFixed(1)}</td>
        <td class="source-cell">${esc(p.source)}</td>
      </tr>
    `).join('');
    tbody.querySelectorAll('tr[data-pid]').forEach((tr) => {
      tr.addEventListener('click', () => {
        actions.setProvince(tr.dataset.pid);
        window.location.hash = '#/provinces';
      });
    });
  }
  searchEl.addEventListener('input', renderRows);
  renderRows();
}
