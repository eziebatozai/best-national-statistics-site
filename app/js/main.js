// Entry point, hash router, global search, and state coordination for Nusantara Stats.

import { SELECTABLE_YEARS, PROVINCES, INDICATOR_DIRECTORY } from './data.js';
import { redrawAllCharts } from './charts.js';
import {
  renderOverviewPage,
  renderPopulationPage,
  renderEconomyPage,
  renderProvincesPage,
  renderHealthPage,
  renderEducationPage,
  renderEmploymentPage,
} from './pages.js';

const ROUTES = {
  overview: { title: 'Overview', render: renderOverviewPage },
  population: { title: 'Population', render: renderPopulationPage },
  economy: { title: 'Economy (GDP)', render: renderEconomyPage },
  provinces: { title: 'Provinces', render: renderProvincesPage },
  health: { title: 'Health', render: renderHealthPage },
  education: { title: 'Education', render: renderEducationPage },
  employment: { title: 'Employment', render: renderEmploymentPage },
};

export const state = {
  route: 'overview',
  year: 2024,
  provinceId: 'jakarta',
  tableQuery: '',
  overviewMetric: 'gdpGrowth',
  overviewChartType: 'bar',
  popMetric: 'popM',
  popChartType: 'line',
  econMetric: 'gdpGrowth',
  econChartType: 'bar',
  econSectorView: 'sharePct',
  provMetric: 'grdpPerCap',
  provChartMode: 'bar',
  provRegion: 'All Regions',
  provQuery: '',
  provSortCol: 'grdpB',
  provSortDir: -1,
  healthMetric: 'lifeExp',
  healthChartType: 'line',
  eduMetric: 'hdi',
  eduChartType: 'line',
  empMetric: 'unempPct',
  empChartType: 'line',
};

function parseRoute() {
  const clean = (window.location.hash || '#/').replace(/^#\/?/, '').split('?')[0].toLowerCase();
  return ROUTES[clean] ? clean : 'overview';
}

function syncHeaderControls() {
  const yearSel = document.getElementById('global-year');
  const provSel = document.getElementById('global-province');
  if (yearSel) yearSel.value = String(state.year);
  if (provSel) provSel.value = state.provinceId;

  document.querySelectorAll('#nav-links a').forEach((link) => {
    const active = link.dataset.route === state.route;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderCurrentRoute() {
  state.route = parseRoute();
  syncHeaderControls();
  const root = document.getElementById('app');
  const routeSpec = ROUTES[state.route];
  document.title = `${routeSpec.title} — Nusantara Stats`;
  routeSpec.render(root, state, actions);
}

const actions = {
  rerender() {
    renderCurrentRoute();
  },
  setYear(year) {
    state.year = Number(year);
    renderCurrentRoute();
  },
  setProvince(provinceId) {
    state.provinceId = provinceId;
    renderCurrentRoute();
  },
};

function initHeaderSelects() {
  const yearSel = document.getElementById('global-year');
  const provSel = document.getElementById('global-province');

  yearSel.innerHTML = [...SELECTABLE_YEARS]
    .reverse()
    .map((y) => `<option value="${y}">${y}</option>`)
    .join('');
  yearSel.value = String(state.year);
  yearSel.addEventListener('change', (e) => actions.setYear(e.target.value));

  provSel.innerHTML = PROVINCES
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join('');
  provSel.value = state.provinceId;
  provSel.addEventListener('change', (e) => actions.setProvince(e.target.value));
}

function initGlobalSearch() {
  const input = document.getElementById('global-search');
  const clearBtn = document.getElementById('search-clear');
  const dropdown = document.getElementById('search-results');

  function buildMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const indMatches = INDICATOR_DIRECTORY.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.source.toLowerCase().includes(q),
    ).map((item) => ({
      kind: 'indicator',
      title: item.name,
      meta: `${item.category} · ${item.source} (${item.year})`,
      val: item.value,
      route: item.route,
    }));

    const provMatches = PROVINCES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q) || p.region.toLowerCase().includes(q),
    ).map((p) => ({
      kind: 'province',
      title: p.name,
      meta: `Province · ${p.region} · Capital ${p.capital}`,
      val: `$${p.grdpPerCap.toLocaleString('en-US')}/cap`,
      provinceId: p.id,
      route: 'provinces',
    }));

    return [...provMatches.slice(0, 5), ...indMatches.slice(0, 6)];
  }

  function updateDropdown() {
    const q = input.value;
    clearBtn.hidden = !q;
    if (!q.trim()) {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      return;
    }
    const matches = buildMatches(q);
    dropdown.hidden = false;
    if (!matches.length) {
      dropdown.innerHTML = '<div class="search-empty">No matching indicators or provinces found.</div>';
      return;
    }
    dropdown.innerHTML = matches.map((m, idx) => `
      <button class="search-item" type="button" data-idx="${idx}" role="option">
        <span>
          <span class="search-item-title">${m.title}</span>
          <span class="search-item-meta">${m.meta}</span>
        </span>
        <span class="search-item-val">${m.val}</span>
      </button>
    `).join('');

    dropdown.querySelectorAll('.search-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hit = matches[Number(btn.dataset.idx)];
        dropdown.hidden = true;
        if (hit.provinceId) state.provinceId = hit.provinceId;
        window.location.hash = `#/${hit.route === 'overview' ? '' : hit.route}`;
        if (state.route === hit.route) renderCurrentRoute();
      });
    });
  }

  input.addEventListener('input', updateDropdown);
  input.addEventListener('focus', updateDropdown);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.hidden = true;
    dropdown.hidden = true;
    input.focus();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) dropdown.hidden = true;
  });
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(redrawAllCharts, 90);
});

window.addEventListener('hashchange', renderCurrentRoute);

document.addEventListener('DOMContentLoaded', () => {
  initHeaderSelects();
  initGlobalSearch();
  renderCurrentRoute();
});
