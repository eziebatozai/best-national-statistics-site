// Nusantara Stats Application Bootstrapper, Hash Router, State Store,
// Instant Global Search, and Static-Literal Dynamic Import Route Dispatcher.

import { INDICATOR_DIRECTORY, YEARS } from './data/national.js';
import { PROVINCES } from './data/provinces.js';
import { renderAtlasHome } from './views/atlas-home.js';

const mainEl = document.getElementById('app-main');
const tooltipEl = document.getElementById('atlas-tooltip');
const searchInput = document.getElementById('global-search');
const searchDropdown = document.getElementById('search-results');

const state = {
  route: 'atlas',
  year: 2024,
  mapMetric: 'grdpPerCap',
  selectedProvince: 'east-kalimantan',
  compareA: 'jakarta',
  compareB: 'east-kalimantan',
  compareScale: 'log',
  compareRegion: 'All',
  compareSearch: '',
  compareSortKey: 'grdpPerCap',
  compareSortDir: 'desc',
  activeTurningPoint: 'export-boom',
  econMetric: 'gdpGrowth',
  econChartType: 'bar',
  econSectorMode: 'share',
  econSortKey: 'sharePct',
  econSortDir: 'desc',
  demoMetric: 'popM',
  socialFilter: 'all',
  playTimer: null,
};

let activeRedraws = [];
const viewCache = new Map();

export function showTooltip(x, y, html) {
  tooltipEl.innerHTML = html;
  tooltipEl.hidden = false;
  const pad = 14;
  const rect = tooltipEl.getBoundingClientRect();
  let left = x + pad;
  let top = y + pad;
  if (left + rect.width > window.innerWidth - 10) left = Math.max(8, x - rect.width - pad);
  if (top + rect.height > window.innerHeight - 10) top = Math.max(8, y - rect.height - pad);
  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
}

export function hideTooltip() {
  tooltipEl.hidden = true;
}

export function downloadCsv(filename, headers, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))];
  const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const a = document.createElement('a');
  a.href = uri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function stopPlayback() {
  if (state.playTimer) {
    clearInterval(state.playTimer);
    state.playTimer = null;
  }
}

function togglePlay(forceVal) {
  const shouldPlay = typeof forceVal === 'boolean' ? forceVal : !state.playTimer;
  if (!shouldPlay) {
    stopPlayback();
    renderCurrentRoute();
    return;
  }
  if (state.year >= YEARS[YEARS.length - 1]) {
    state.year = YEARS[0];
  }
  stopPlayback();
  state.playTimer = setInterval(() => {
    const idx = YEARS.indexOf(state.year);
    if (idx < YEARS.length - 1) {
      state.year = YEARS[idx + 1];
      renderCurrentRoute();
    } else {
      stopPlayback();
      renderCurrentRoute();
    }
  }, 900);
  renderCurrentRoute();
}

function setState(patch) {
  Object.assign(state, patch);
  renderCurrentRoute();
}

function parseHashAndQuery() {
  const searchParams = new URLSearchParams(window.location.search);
  const shot = searchParams.get('shot');
  const rawHash = (window.location.hash || '').replace(/^#\/?/, '');
  const [rawPath, hashQuery] = rawHash.split('?');
  const hParams = new URLSearchParams(hashQuery || '');

  let route = (rawPath || '').toLowerCase();

  // Deterministic shot presets (used when ?shot=...&seed=1 is passed without hash override)
  if (!route && shot) {
    if (shot === 'atlas-cover') {
      route = 'atlas';
      state.year = 2024;
      state.mapMetric = 'grdpPerCap';
      state.selectedProvince = 'east-kalimantan';
    } else if (shot === 'compare-engine') {
      route = 'compare';
      state.compareA = 'jakarta';
      state.compareB = 'east-kalimantan';
      state.compareScale = 'log';
    } else if (shot === 'turning-points') {
      route = 'turning-points';
      state.activeTurningPoint = 'export-boom';
    } else if (shot === 'phone-economy') {
      route = 'economy';
      state.econSectorMode = 'share';
    }
  }

  const valid = new Set(['atlas', 'compare', 'turning-points', 'economy', 'demographics', 'social', 'labor']);
  state.route = valid.has(route) ? route : 'atlas';

  if (hParams.get('a')) state.compareA = hParams.get('a');
  if (hParams.get('b')) state.compareB = hParams.get('b');
  if (hParams.get('province')) state.selectedProvince = hParams.get('province');
  if (hParams.get('year')) {
    const yr = Number(hParams.get('year'));
    if (YEARS.includes(yr)) state.year = yr;
  }
  if (hParams.get('tp')) state.activeTurningPoint = hParams.get('tp');
  if (hParams.get('metric')) state.mapMetric = hParams.get('metric');
}

function syncNav() {
  document.querySelectorAll('.primary-nav a').forEach((link) => {
    const active = link.dataset.route === state.route;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function registerRedraw(fn) {
  activeRedraws.push(fn);
}

async function renderCurrentRoute() {
  hideTooltip();
  syncNav();
  activeRedraws = [];

  const ctx = {
    state,
    setState,
    showTooltip,
    hideTooltip,
    togglePlay,
    registerRedraw,
    downloadCsv,
  };

  if (state.route === 'atlas') {
    renderAtlasHome(mainEl, ctx);
    return;
  }

  // Synchronous render when the lazy module is already cached
  const cached = viewCache.get(state.route);
  if (cached) {
    cached(mainEl, ctx);
    return;
  }

  // Static-literal dynamic imports so every secondary route and charts-core
  // stays cleanly under "Loaded later by import()" in the dossier.
  if (state.route === 'compare') {
    const mod = await import('./views/compare-view.js');
    viewCache.set('compare', mod.renderCompareView);
    mod.renderCompareView(mainEl, ctx);
  } else if (state.route === 'turning-points') {
    const mod = await import('./views/turning-points-view.js');
    viewCache.set('turning-points', mod.renderTurningPointsView);
    mod.renderTurningPointsView(mainEl, ctx);
  } else if (state.route === 'economy') {
    const mod = await import('./views/economy-view.js');
    viewCache.set('economy', mod.renderEconomyView);
    mod.renderEconomyView(mainEl, ctx);
  } else if (state.route === 'demographics') {
    const mod = await import('./views/demographics-view.js');
    viewCache.set('demographics', mod.renderDemographicsView);
    mod.renderDemographicsView(mainEl, ctx);
  } else if (state.route === 'social') {
    const mod = await import('./views/social-view.js');
    viewCache.set('social', mod.renderSocialView);
    mod.renderSocialView(mainEl, ctx);
  } else if (state.route === 'labor') {
    const mod = await import('./views/labor-view.js');
    viewCache.set('labor', mod.renderLaborView);
    mod.renderLaborView(mainEl, ctx);
  } else {
    renderAtlasHome(mainEl, ctx);
  }
}

function setupGlobalSearch() {
  const closeDropdown = () => {
    searchDropdown.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  };

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      closeDropdown();
      return;
    }

    const provMatches = PROVINCES.filter((p) =>
      p.name.toLowerCase().includes(q)
      || p.capital.toLowerCase().includes(q)
      || p.region.toLowerCase().includes(q)
      || p.tag.toLowerCase().includes(q)
    ).slice(0, 6);

    const indMatches = INDICATOR_DIRECTORY.filter((i) =>
      i.name.toLowerCase().includes(q)
      || i.category.toLowerCase().includes(q)
      || i.source.toLowerCase().includes(q)
    ).slice(0, 6);

    let html = '';
    if (provMatches.length) {
      html += '<div class="search-group-label">Provinces (BPS 2024)</div>';
      html += provMatches.map((p) => `
        <button type="button" class="search-item" role="option" data-pick-prov="${p.id}">
          <span><strong>${p.name}</strong> · ${p.region}</span>
          <span class="search-item-meta">$${p.grdpPerCap.toLocaleString('en-US')}/cap</span>
        </button>`).join('');
    }
    if (indMatches.length) {
      html += '<div class="search-group-label">National Indicators</div>';
      html += indMatches.map((i) => `
        <button type="button" class="search-item" role="option" data-pick-route="${i.route}">
          <span><strong>${i.name}</strong></span>
          <span class="search-item-meta">${i.value}</span>
        </button>`).join('');
    }
    if (!html) {
      html = '<div class="search-empty">No matching province or indicator found.</div>';
    }

    searchDropdown.innerHTML = html;
    searchDropdown.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');

    searchDropdown.querySelectorAll('[data-pick-prov]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.pickProv;
        closeDropdown();
        searchInput.value = '';
        if (state.route === 'compare') {
          state.compareB = id;
          renderCurrentRoute();
        } else {
          state.selectedProvince = id;
          window.location.hash = `#/?province=${id}`;
        }
      });
    });

    searchDropdown.querySelectorAll('[data-pick-route]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = btn.dataset.pickRoute;
        closeDropdown();
        searchInput.value = '';
        window.location.hash = `#/${r}`;
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) closeDropdown();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    for (const fn of activeRedraws) fn();
  }, 120);
});

window.addEventListener('hashchange', () => {
  stopPlayback();
  parseHashAndQuery();
  renderCurrentRoute();
});

setupGlobalSearch();
parseHashAndQuery();
renderCurrentRoute();
