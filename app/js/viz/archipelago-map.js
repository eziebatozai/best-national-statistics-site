// Zero-dependency SVG cartographic renderer for the Indonesian Archipelago.
// Renders bathymetric backdrop, Equator, WIB/WITA/WIT meridians, island silhouettes,
// 24 choropleth province polygons, callout pins, legend, and interactive tooltips.

import { ISLAND_BACKDROPS, MAP_METRICS, PROVINCES } from '../data/provinces.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Five-step high-contrast sequential ramp on deep bathymetric navy (#0E2239)
const RAMP_NORMAL = ['#234463', '#1B6B7A', '#269B8C', '#D99B26', '#E55C32'];
const RAMP_INVERT = ['#E55C32', '#D99B26', '#269B8C', '#1B6B7A', '#234463'];

function el(tag, attrs = {}, text = null) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, String(v));
  }
  if (text !== null) node.textContent = text;
  return node;
}

function quantileBreaks(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const pick = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * (sorted.length - 1)))];
  return [pick(0.2), pick(0.42), pick(0.66), pick(0.84)];
}

function colorForValue(val, breaks, invert) {
  const ramp = invert ? RAMP_INVERT : RAMP_NORMAL;
  let idx = 0;
  for (let i = 0; i < breaks.length; i++) {
    if (val > breaks[i]) idx = i + 1;
  }
  return ramp[Math.min(ramp.length - 1, idx)];
}

export function renderArchipelagoMap(container, { metricKey, selectedId, onSelect, showTooltip, hideTooltip }) {
  const metric = MAP_METRICS.find((m) => m.key === metricKey) || MAP_METRICS[0];
  const values = PROVINCES.map((p) => p[metric.key]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const breaks = quantileBreaks(values);

  const svg = el('svg', {
    viewBox: '0 0 960 390',
    class: 'archipelago-svg',
    role: 'img',
    'aria-label': `Interactive choropleth map of Indonesia by ${metric.label} (BPS 2024)`,
  });

  // Defs: bathymetric ocean radial glow + subtle pattern
  const defs = el('defs');
  const rad = el('radialGradient', { id: 'bathymetry-grad', cx: '48%', cy: '46%', r: '62%' });
  rad.appendChild(el('stop', { offset: '0%', 'stop-color': '#163554' }));
  rad.appendChild(el('stop', { offset: '65%', 'stop-color': '#0E2239' }));
  rad.appendChild(el('stop', { offset: '100%', 'stop-color': '#081524' }));
  defs.appendChild(rad);
  svg.appendChild(defs);

  // Ocean canvas
  svg.appendChild(el('rect', { x: 0, y: 0, width: 960, height: 390, rx: 8, fill: 'url(#bathymetry-grad)' }));

  // Graticule lines (latitude & longitude)
  const grat = el('g', { stroke: 'rgba(154,194,224,0.10)', 'stroke-width': 0.8 });
  for (const x of [120, 220, 320, 520, 620, 720, 820, 920]) {
    grat.appendChild(el('line', { x1: x, y1: 12, x2: x, y2: 378 }));
  }
  for (const y of [55, 225, 310]) {
    grat.appendChild(el('line', { x1: 12, y1: y, x2: 948, y2: y }));
  }
  svg.appendChild(grat);

  // Time-zone meridians: WIB | WITA | WIT
  const tzGroup = el('g');
  for (const tzX of [426, 650]) {
    tzGroup.appendChild(el('line', {
      x1: tzX, y1: 14, x2: tzX, y2: 376,
      stroke: 'rgba(154,194,224,0.28)', 'stroke-width': 1, 'stroke-dasharray': '3 4',
    }));
  }
  const tzLabels = [
    { x: 245, label: 'WIB · UTC+7' },
    { x: 538, label: 'WITA · UTC+8' },
    { x: 785, label: 'WIT · UTC+9' },
  ];
  for (const tz of tzLabels) {
    tzGroup.appendChild(el('text', {
      x: tz.x, y: 18, 'text-anchor': 'middle',
      fill: 'rgba(167,201,228,0.68)', 'font-size': 9.5, 'font-weight': 700, 'letter-spacing': '0.09em',
    }, tz.label));
  }
  svg.appendChild(tzGroup);

  // Zero-degree Equator line (passes through Sumatra, Kalimantan, Sulawesi, N. Maluku)
  const eqGroup = el('g');
  eqGroup.appendChild(el('line', {
    x1: 12, y1: 140, x2: 948, y2: 140,
    stroke: '#D99B26', 'stroke-width': 1.15, 'stroke-dasharray': '6 4', opacity: 0.72,
  }));
  eqGroup.appendChild(el('rect', { x: 16, y: 129, width: 76, height: 15, rx: 3, fill: '#0A1B2E', opacity: 0.88 }));
  eqGroup.appendChild(el('text', {
    x: 21, y: 140, fill: '#F4C462', 'font-size': 9, 'font-weight': 700, 'letter-spacing': '0.06em',
  }, '0° EQUATOR'));
  svg.appendChild(eqGroup);

  // Muted surrounding landmass silhouettes
  const backdropG = el('g', { fill: '#173652', stroke: '#234C70', 'stroke-width': 0.9 });
  for (const d of ISLAND_BACKDROPS) {
    backdropG.appendChild(el('path', { d }));
  }
  svg.appendChild(backdropG);

  // Interactive 24 flagship province polygons
  const provG = el('g');
  for (const p of PROVINCES) {
    const fill = colorForValue(p[metric.key], breaks, metric.invert);
    const isSelected = p.id === selectedId;
    const path = el('path', {
      d: p.path,
      fill,
      class: isSelected ? 'prov-shape selected' : 'prov-shape',
      tabindex: '0',
      role: 'button',
      'data-province': p.id,
      'aria-label': `${p.name}: ${metric.label} ${metric.format(p[metric.key])}`,
    });

    const showTip = (evt) => {
      const html = `<strong>${p.name}</strong> <span class="tt-sub">(${p.region} · ${p.tz})</span><br>`
        + `${metric.label}: <span class="tt-val">${metric.format(p[metric.key])}</span><br>`
        + `<span class="tt-sub">HDI ${p.hdi.toFixed(2)} · Poverty ${p.poverty.toFixed(2)}% · Pop ${p.popM.toFixed(1)}M</span>`;
      showTooltip(evt.clientX, evt.clientY, html);
    };

    path.addEventListener('pointermove', showTip);
    path.addEventListener('pointerenter', showTip);
    path.addEventListener('pointerleave', hideTooltip);
    path.addEventListener('click', () => onSelect(p.id));
    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(p.id);
      }
    });
    provG.appendChild(path);
  }
  svg.appendChild(provG);

  // Editorial callout pins positioned cleanly in open ocean zones (zero overlap)
  const callouts = [
    { id: 'riau', bx: 146, by: 36, w: 126, label: 'Riau', sub: (p) => metric.key === 'grdpPerCap' ? '$10,300/cap' : metric.format(p[metric.key]) },
    { id: 'east-kalimantan', bx: 472, by: 34, w: 158, label: 'E. Kalimantan (IKN)', sub: (p) => metric.key === 'grdpPerCap' ? '$13,500/cap' : metric.format(p[metric.key]) },
    { id: 'jakarta', bx: 30, by: 326, w: 150, label: 'DKI Jakarta', sub: (p) => metric.key === 'grdpPerCap' ? '$21,680/cap · HDI 84.2' : metric.format(p[metric.key]) },
    { id: 'bali', bx: 326, by: 344, w: 132, label: 'Bali', sub: (p) => metric.key === 'grdpPerCap' ? '3.8% pov · HDI 78.6' : metric.format(p[metric.key]) },
    { id: 'highland-papua', bx: 696, by: 334, w: 154, label: 'Highland Papua', sub: (p) => metric.key === 'grdpPerCap' ? 'HDI 54.4 · $1,160/cap' : metric.format(p[metric.key]) },
  ];

  const pinG = el('g');
  for (const c of callouts) {
    const prov = PROVINCES.find((p) => p.id === c.id);
    if (!prov) continue;
    const isSel = prov.id === selectedId;
    const anchorX = c.bx + c.w / 2;
    const anchorY = c.by < prov.cy ? c.by + 30 : c.by;

    pinG.appendChild(el('line', {
      x1: prov.cx, y1: prov.cy, x2: anchorX, y2: anchorY,
      stroke: isSel ? '#F06A3E' : 'rgba(244,196,98,0.72)', 'stroke-width': isSel ? 1.5 : 1.05,
    }));
    pinG.appendChild(el('circle', {
      cx: prov.cx, cy: prov.cy, r: isSel ? 4.2 : 3.2,
      fill: isSel ? '#D94E28' : '#F4C462', stroke: '#091727', 'stroke-width': 1.2,
    }));

    const box = el('g', { style: 'cursor:pointer' });
    box.appendChild(el('rect', {
      x: c.bx, y: c.by, width: c.w, height: 30, rx: 5,
      fill: isSel ? 'rgba(217,78,40,0.92)' : 'rgba(9,23,39,0.88)',
      stroke: isSel ? '#FFFFFF' : 'rgba(217,155,38,0.55)', 'stroke-width': 1,
    }));
    box.appendChild(el('text', {
      x: c.bx + 7, y: c.by + 12, fill: '#FFFFFF', 'font-size': 9.8, 'font-weight': 700,
    }, c.label));
    box.appendChild(el('text', {
      x: c.bx + 7, y: c.by + 24, fill: isSel ? '#FFF4E6' : '#F4C462', 'font-size': 9.4, 'font-weight': 700,
    }, c.sub(prov)));
    box.addEventListener('click', () => onSelect(prov.id));
    pinG.appendChild(box);
  }
  svg.appendChild(pinG);

  // Inline SVG Legend Strip in open top-right Pacific Ocean
  const legG = el('g');
  const lx = 736;
  const ly = 32;
  legG.appendChild(el('rect', {
    x: lx, y: ly, width: 210, height: 64, rx: 6,
    fill: 'rgba(8,21,36,0.84)', stroke: 'rgba(154,194,224,0.26)', 'stroke-width': 1,
  }));
  legG.appendChild(el('text', {
    x: lx + 10, y: ly + 15, fill: '#E8F1FA', 'font-size': 9.5, 'font-weight': 700,
  }, `${metric.label} (${metric.unit}) · 24 Provinces`));

  const ramp = metric.invert ? RAMP_INVERT : RAMP_NORMAL;
  const swW = 36;
  ramp.forEach((col, i) => {
    legG.appendChild(el('rect', {
      x: lx + 10 + i * (swW + 2), y: ly + 22, width: swW, height: 9, rx: 2, fill: col,
    }));
  });

  legG.appendChild(el('text', {
    x: lx + 10, y: ly + 43, fill: '#A8C2DA', 'font-size': 8.8, 'font-weight': 600,
  }, metric.format(minVal)));
  legG.appendChild(el('text', {
    x: lx + 198, y: ly + 43, 'text-anchor': 'end', fill: '#F4C462', 'font-size': 8.8, 'font-weight': 700,
  }, metric.format(maxVal)));
  legG.appendChild(el('text', {
    x: lx + 10, y: ly + 56, fill: '#7FA0BE', 'font-size': 8.2,
  }, `Source: ${metric.source}`));
  svg.appendChild(legG);

  container.innerHTML = '';
  container.appendChild(svg);
}
