// Zero-dependency high-DPI Canvas 2D charting library for Nusantara Stats.
// Tailored to the Editorial Cartographic palette with hover hit-testing and responsive sizing.

const COLORS = {
  ink: '#0B192C',
  slate: '#4A5B6B',
  muted: '#7B8A98',
  grid: '#E6E1D6',
  teal: '#167874',
  tealLight: 'rgba(22, 120, 116, 0.16)',
  vermilion: '#D94E28',
  vermilionSoft: 'rgba(217, 78, 40, 0.16)',
  gold: '#D99B26',
  goldSoft: 'rgba(217, 155, 38, 0.18)',
  band: 'rgba(217, 155, 38, 0.16)',
  bandBorder: 'rgba(217, 155, 38, 0.55)',
};

const FONT_SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function prepareCanvas(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.max(220, Math.floor(rect.width));
  const h = Math.max(150, Math.floor(rect.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  return { c, w, h };
}

function attachHover(canvas, hits, showTooltip, hideTooltip, onClick) {
  canvas.onpointermove = (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const found = hits.find((h) => mx >= h.x && mx <= h.x + h.w && my >= h.y && my <= h.y + h.h);
    if (found) {
      canvas.style.cursor = onClick ? 'pointer' : 'default';
      showTooltip(e.clientX, e.clientY, found.html);
    } else {
      canvas.style.cursor = 'default';
      hideTooltip();
    }
  };
  canvas.onpointerleave = () => hideTooltip();
  if (onClick) {
    canvas.onclick = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const found = hits.find((h) => mx >= h.x && mx <= h.x + h.w && my >= h.y && my <= h.y + h.h);
      if (found && found.data) onClick(found.data);
    };
  }
}

function drawBand(c, x0, x1, top, bottom) {
  c.save();
  c.fillStyle = COLORS.band;
  c.fillRect(x0, top, x1 - x0, bottom - top);
  c.strokeStyle = COLORS.bandBorder;
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(x0, top); c.lineTo(x0, bottom);
  c.moveTo(x1, top); c.lineTo(x1, bottom);
  c.stroke();
  c.restore();
}

export function drawTimeSeries(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { labels, values, type = 'bar', color = COLORS.teal, negColor = COLORS.vermilion, format = (v) => String(v), targetLine = null, targetLabel = '', band = null, highlightIdx = -1 } = cfg;
  const pad = { l: 44, r: 16, t: 20, b: 28 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  let minV = Math.min(0, ...values);
  let maxV = Math.max(...values);
  if (targetLine !== null) {
    minV = Math.min(minV, targetLine * 0.85);
    maxV = Math.max(maxV, targetLine * 1.1);
  }
  if (type === 'line' && Math.min(...values) > 0 && minV === 0) {
    minV = Math.min(...values) * 0.9;
  }
  const span = (maxV - minV) || 1;
  if (Math.min(...values) < 0) {
    minV -= span * 0.08;
  } else if (minV > 0) {
    minV = Math.max(0, minV - span * 0.08);
  }
  maxV += span * 0.14;
  const yOf = (v) => pad.t + ph - ((v - minV) / (maxV - minV)) * ph;

  // Optional shaded turning-point band
  if (band && band.startIdx >= 0) {
    const step = pw / labels.length;
    drawBand(c, pad.l + band.startIdx * step, pad.l + (band.endIdx + 1) * step, pad.t, pad.t + ph);
  }

  // Horizontal grid + Y labels
  c.font = `600 10px ${FONT_SANS}`;
  c.fillStyle = COLORS.muted;
  c.textAlign = 'right';
  c.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const val = minV + ((maxV - minV) * i) / 4;
    const y = yOf(val);
    c.strokeStyle = COLORS.grid;
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(pad.l, y); c.lineTo(w - pad.r, y); c.stroke();
    c.fillText(format(val), pad.l - 6, y);
  }

  // Zero line if negative values exist
  if (minV < 0 && maxV > 0) {
    const zy = yOf(0);
    c.strokeStyle = COLORS.slate;
    c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(pad.l, zy); c.lineTo(w - pad.r, zy); c.stroke();
  }

  // Target line
  if (targetLine !== null) {
    const ty = yOf(targetLine);
    c.save();
    c.setLineDash([5, 4]);
    c.strokeStyle = COLORS.vermilion;
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(pad.l, ty); c.lineTo(w - pad.r, ty); c.stroke();
    c.setLineDash([]);
    c.fillStyle = COLORS.vermilion;
    c.textAlign = 'right';
    c.textBaseline = 'bottom';
    c.font = `700 10px ${FONT_SANS}`;
    c.fillText(targetLabel || `Target ${format(targetLine)}`, w - pad.r - 2, ty - 3);
    c.restore();
  }

  const hits = [];
  const step = pw / labels.length;

  if (type === 'bar') {
    const bw = Math.max(10, Math.min(34, step * 0.62));
    const baseY = yOf(Math.max(minV, 0));
    values.forEach((v, i) => {
      const cx = pad.l + step * (i + 0.5);
      const y = yOf(v);
      const top = Math.min(y, baseY);
      const bh = Math.max(2, Math.abs(baseY - y));
      c.fillStyle = v < 0 ? negColor : (i === highlightIdx ? COLORS.vermilion : color);
      c.beginPath();
      c.roundRect(cx - bw / 2, top, bw, bh, 3);
      c.fill();

      c.fillStyle = v < 0 ? negColor : COLORS.ink;
      c.font = `700 9.5px ${FONT_SANS}`;
      c.textAlign = 'center';
      c.textBaseline = v < 0 ? 'top' : 'bottom';
      c.fillText(format(v), cx, v < 0 ? top + bh + 3 : top - 3);

      hits.push({ x: cx - step / 2, y: pad.t, w: step, h: ph, html: `<strong>${labels[i]}</strong><br><span class="tt-val">${format(v)}</span>` });
    });
  } else {
    const pts = values.map((v, i) => ({ x: pad.l + step * (i + 0.5), y: yOf(v), v, label: labels[i] }));
    // Area fill
    c.beginPath();
    c.moveTo(pts[0].x, pad.t + ph);
    pts.forEach((p) => c.lineTo(p.x, p.y));
    c.lineTo(pts[pts.length - 1].x, pad.t + ph);
    c.closePath();
    c.fillStyle = color === COLORS.vermilion ? COLORS.vermilionSoft : COLORS.tealLight;
    c.fill();

    // Line stroke
    c.beginPath();
    pts.forEach((p, i) => (i === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y)));
    c.strokeStyle = color;
    c.lineWidth = 2.4;
    c.stroke();

    pts.forEach((p, i) => {
      c.beginPath();
      c.arc(p.x, p.y, i === highlightIdx ? 4.8 : 3.4, 0, Math.PI * 2);
      c.fillStyle = i === highlightIdx ? COLORS.vermilion : '#fff';
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = i === highlightIdx ? COLORS.vermilion : color;
      c.stroke();

      if (i === 0 || i === pts.length - 1 || i === highlightIdx || pts.length <= 6) {
        c.fillStyle = COLORS.ink;
        c.font = `700 9.5px ${FONT_SANS}`;
        c.textAlign = 'center';
        c.textBaseline = 'bottom';
        c.fillText(format(p.v), p.x, p.y - 6);
      }
      hits.push({ x: p.x - step / 2, y: pad.t, w: step, h: ph, html: `<strong>${p.label}</strong><br><span class="tt-val">${format(p.v)}</span>` });
    });
  }

  // X axis labels
  c.fillStyle = COLORS.slate;
  c.font = `600 10px ${FONT_SANS}`;
  c.textAlign = 'center';
  c.textBaseline = 'top';
  labels.forEach((lbl, i) => {
    if (labels.length > 8 && w < 380 && i % 2 === 1 && i !== labels.length - 1) return;
    c.fillText(String(lbl), pad.l + step * (i + 0.5), pad.t + ph + 7);
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawDualMacro(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { labels, bars, lineA, lineB = null, band = null, leftFmt = (v) => v.toFixed(1), rightFmt = (v) => v.toFixed(1), sharedAxis = false } = cfg;
  const pad = { l: 42, r: sharedAxis ? 16 : 42, t: 16, b: 24 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const step = pw / labels.length;

  const allLeft = sharedAxis ? [...(bars ? bars.values : []), ...lineA.values, ...(lineB ? lineB.values : [])] : (bars ? bars.values : lineA.values);
  const rawLeftMin = Math.min(...allLeft);
  let lMin = Math.min(bars ? 0 : rawLeftMin, rawLeftMin);
  let lMax = Math.max(...allLeft);
  const lSpan = (lMax - lMin) || 1;
  if (rawLeftMin < 0) {
    lMin -= lSpan * 0.14;
  } else if (lMin > 0) {
    lMin = Math.max(0, lMin - lSpan * 0.05);
  }
  lMax += lSpan * 0.16;
  const yL = (v) => pad.t + ph - ((v - lMin) / (lMax - lMin)) * ph;

  const allRight = sharedAxis ? allLeft : [...lineA.values, ...(lineB ? lineB.values : [])];
  let rMin = Math.min(...allRight);
  let rMax = Math.max(...allRight);
  if (sharedAxis) { rMin = lMin; rMax = lMax; }
  else {
    const rSpan = (rMax - rMin) || 1;
    rMin -= rSpan * 0.12;
    rMax += rSpan * 0.16;
  }
  const yR = (v) => pad.t + ph - ((v - rMin) / (rMax - rMin)) * ph;

  if (band && band.startIdx >= 0) {
    drawBand(c, pad.l + band.startIdx * step, pad.l + (band.endIdx + 1) * step, pad.t, pad.t + ph);
  }

  // Grid lines & left ticks
  c.font = `600 9.5px ${FONT_SANS}`;
  for (let i = 0; i <= 3; i++) {
    const lv = lMin + ((lMax - lMin) * i) / 3;
    const y = yL(lv);
    c.strokeStyle = COLORS.grid;
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(pad.l, y); c.lineTo(w - pad.r, y); c.stroke();
    c.fillStyle = COLORS.muted;
    c.textAlign = 'right';
    c.textBaseline = 'middle';
    c.fillText(leftFmt(lv), pad.l - 5, y);

    if (!sharedAxis) {
      const rv = rMin + ((rMax - rMin) * i) / 3;
      c.textAlign = 'left';
      c.fillText(rightFmt(rv), w - pad.r + 5, y);
    }
  }

  if (lMin < 0 && lMax > 0) {
    const zy = yL(0);
    c.strokeStyle = COLORS.slate;
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(pad.l, zy); c.lineTo(w - pad.r, zy); c.stroke();
  }

  // Bars
  if (bars) {
    const bw = Math.max(8, Math.min(24, step * 0.56));
    const baseY = yL(Math.max(lMin, 0));
    bars.values.forEach((v, i) => {
      const cx = pad.l + step * (i + 0.5);
      const y = yL(v);
      const top = Math.min(y, baseY);
      const bh = Math.max(2, Math.abs(baseY - y));
      c.fillStyle = v < 0 ? (bars.negColor || COLORS.vermilion) : (bars.color || COLORS.teal);
      c.globalAlpha = 0.86;
      c.beginPath();
      c.roundRect(cx - bw / 2, top, bw, bh, 2.5);
      c.fill();
      c.globalAlpha = 1;
    });
  }

  // Line helper
  const drawLine = (series, yFn) => {
    c.beginPath();
    series.values.forEach((v, i) => {
      const x = pad.l + step * (i + 0.5);
      const y = yFn(v);
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    });
    c.strokeStyle = series.color;
    c.lineWidth = 2.2;
    c.stroke();

    series.values.forEach((v, i) => {
      const x = pad.l + step * (i + 0.5);
      const y = yFn(v);
      c.beginPath();
      c.arc(x, y, 3, 0, Math.PI * 2);
      c.fillStyle = '#fff';
      c.fill();
      c.lineWidth = 1.8;
      c.strokeStyle = series.color;
      c.stroke();
    });
  };

  drawLine(lineA, sharedAxis ? yL : yR);
  if (lineB) drawLine(lineB, sharedAxis ? yL : yR);

  // X labels & hits
  c.fillStyle = COLORS.slate;
  c.font = `600 9.5px ${FONT_SANS}`;
  c.textAlign = 'center';
  c.textBaseline = 'top';
  const hits = [];
  labels.forEach((lbl, i) => {
    const cx = pad.l + step * (i + 0.5);
    c.fillText(String(lbl).slice(-2) === '15' || i === labels.length - 1 || i % 2 === 0 ? String(lbl) : `'${String(lbl).slice(-2)}`, cx, pad.t + ph + 6);
    const lines = [`<strong>${lbl}</strong>`];
    if (bars) lines.push(`${bars.label}: <span class="tt-val">${leftFmt(bars.values[i])}</span>`);
    lines.push(`${lineA.label}: <span class="tt-val">${rightFmt(lineA.values[i])}</span>`);
    if (lineB) lines.push(`${lineB.label}: <span class="tt-val">${rightFmt(lineB.values[i])}</span>`);
    hits.push({ x: cx - step / 2, y: pad.t, w: step, h: ph, html: lines.join('<br>') });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawRadarChart(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { axes, seriesA, seriesB, maxVal = 150 } = cfg;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w * 0.36, h * 0.36);
  const n = axes.length;

  const pt = (axisIdx, val) => {
    const angle = -Math.PI / 2 + (axisIdx * 2 * Math.PI) / n;
    const r = (Math.min(maxVal, Math.max(10, val)) / maxVal) * radius;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, angle };
  };

  // Concentric scale rings (50, 100 national baseline, 150)
  for (const ring of [50, 100, 150]) {
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pt(i, ring);
      if (i === 0) c.moveTo(p.x, p.y); else c.lineTo(p.x, p.y);
    }
    c.closePath();
    c.save();
    if (ring === 100) {
      c.setLineDash([5, 4]);
      c.strokeStyle = COLORS.ink;
      c.lineWidth = 1.4;
    } else {
      c.strokeStyle = COLORS.grid;
      c.lineWidth = 1;
    }
    c.stroke();
    c.restore();

    const lp = pt(0, ring);
    c.fillStyle = ring === 100 ? COLORS.ink : COLORS.muted;
    c.font = `700 9px ${FONT_SANS}`;
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillText(ring === 100 ? '100 (IDN)' : String(ring), lp.x + 4, lp.y + 1);
  }

  // Spokes + Axis Labels
  axes.forEach((ax, i) => {
    const outer = pt(i, maxVal);
    c.strokeStyle = COLORS.grid;
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(outer.x, outer.y); c.stroke();

    const lblR = radius + 16;
    const lx = cx + Math.cos(outer.angle) * lblR;
    const ly = cy + Math.sin(outer.angle) * lblR;
    c.fillStyle = COLORS.ink;
    c.font = `700 10.5px ${FONT_SANS}`;
    c.textAlign = Math.abs(Math.cos(outer.angle)) < 0.2 ? 'center' : (Math.cos(outer.angle) > 0 ? 'left' : 'right');
    c.textBaseline = 'middle';
    c.fillText(ax.label, lx, ly);
  });

  const drawPoly = (series, fillCol, strokeCol) => {
    c.beginPath();
    series.values.forEach((v, i) => {
      const p = pt(i, v);
      if (i === 0) c.moveTo(p.x, p.y); else c.lineTo(p.x, p.y);
    });
    c.closePath();
    c.fillStyle = fillCol;
    c.fill();
    c.strokeStyle = strokeCol;
    c.lineWidth = 2.3;
    c.stroke();

    series.values.forEach((v, i) => {
      const p = pt(i, v);
      c.beginPath();
      c.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
      c.fillStyle = strokeCol;
      c.fill();
      c.strokeStyle = '#fff';
      c.lineWidth = 1.2;
      c.stroke();
    });
  };

  drawPoly(seriesB, 'rgba(217, 155, 38, 0.22)', COLORS.gold);
  drawPoly(seriesA, 'rgba(217, 78, 40, 0.22)', COLORS.vermilion);

  const hits = axes.map((ax, i) => {
    const p = pt(i, maxVal * 0.75);
    return {
      x: p.x - 32, y: p.y - 22, w: 64, h: 44,
      html: `<strong>${ax.label}</strong> <span class="tt-sub">(IDN = 100)</span><br>`
        + `${seriesA.name}: <span class="tt-val">${seriesA.values[i]}</span><br>`
        + `${seriesB.name}: <span class="tt-val">${seriesB.values[i]}</span>`,
    };
  });
  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawButterflyChart(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { rows, nameA, nameB } = cfg;
  const padT = 22;
  const padB = 8;
  const centerW = Math.min(126, w * 0.34);
  const sideW = (w - centerW - 24) / 2;
  const leftEdge = 12 + sideW;
  const rightEdge = leftEdge + centerW;
  const rowH = (h - padT - padB) / rows.length;

  // Column headers
  c.font = `700 10.5px ${FONT_SANS}`;
  c.textBaseline = 'middle';
  c.textAlign = 'right';
  c.fillStyle = COLORS.vermilion;
  c.fillText(nameA, leftEdge - 6, 11);
  c.textAlign = 'center';
  c.fillStyle = COLORS.slate;
  c.fillText('METRIC (BPS 2024)', leftEdge + centerW / 2, 11);
  c.textAlign = 'left';
  c.fillStyle = '#A67210';
  c.fillText(nameB, rightEdge + 6, 11);

  const hits = [];
  rows.forEach((row, i) => {
    const cy = padT + rowH * (i + 0.5);
    const barH = Math.min(18, rowH * 0.54);
    const maxV = Math.max(row.a, row.b, row.scaleMax || 1);
    const wA = Math.max(6, (row.a / maxV) * (sideW - 44));
    const wB = Math.max(6, (row.b / maxV) * (sideW - 44));

    // Track guides
    c.fillStyle = '#F2EFE8';
    c.fillRect(12, cy - barH / 2, sideW, barH);
    c.fillRect(rightEdge, cy - barH / 2, sideW, barH);

    // Left bar (Province A)
    c.fillStyle = COLORS.vermilion;
    c.beginPath();
    c.roundRect(leftEdge - wA, cy - barH / 2, wA, barH, [3, 0, 0, 3]);
    c.fill();

    // Right bar (Province B)
    c.fillStyle = COLORS.gold;
    c.beginPath();
    c.roundRect(rightEdge, cy - barH / 2, wB, barH, [0, 3, 3, 0]);
    c.fill();

    // Center label
    c.fillStyle = COLORS.ink;
    c.font = `700 10.5px ${FONT_SANS}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(row.label, leftEdge + centerW / 2, cy);

    // Value labels outside bars
    c.font = `700 10px ${FONT_SANS}`;
    c.fillStyle = COLORS.ink;
    c.textAlign = 'right';
    c.fillText(row.fmt(row.a), leftEdge - wA - 5, cy);
    c.textAlign = 'left';
    c.fillText(row.fmt(row.b), rightEdge + wB + 5, cy);

    hits.push({
      x: 8, y: cy - rowH / 2, w: w - 16, h: rowH,
      html: `<strong>${row.label}</strong><br>${nameA}: <span class="tt-val">${row.fmt(row.a)}</span><br>${nameB}: <span class="tt-val">${row.fmt(row.b)}</span><br><span class="tt-sub">National: ${row.natLabel}</span>`,
    });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawHorizontalBars(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { items, color = COLORS.teal, highlightTop = true, format = (v) => `${v.toFixed(1)}%` } = cfg;
  const labelW = Math.min(134, Math.max(96, Math.floor(w * 0.36)));
  const pad = { l: labelW, r: 52, t: 8, b: 10 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const rowH = ph / items.length;
  const maxV = Math.max(...items.map((d) => d.value), 1) * 1.04;

  const hits = [];
  items.forEach((item, i) => {
    const cy = pad.t + rowH * (i + 0.5);
    const bh = Math.min(20, Math.max(11, rowH * 0.62));
    const bw = Math.max(4, (item.value / maxV) * pw);

    c.fillStyle = '#EFECE4';
    c.beginPath();
    c.roundRect(pad.l, cy - bh / 2, pw, bh, 3);
    c.fill();

    c.fillStyle = (highlightTop && i === 0) ? COLORS.vermilion : (item.color || color);
    c.beginPath();
    c.roundRect(pad.l, cy - bh / 2, bw, bh, 3);
    c.fill();

    // Label
    c.fillStyle = COLORS.ink;
    c.font = `600 10.5px ${FONT_SANS}`;
    c.textAlign = 'right';
    c.textBaseline = 'middle';
    const maxChars = Math.max(12, Math.floor((labelW - 10) / 6.2));
    const text = item.label.length > maxChars ? `${item.label.slice(0, maxChars - 1)}…` : item.label;
    c.fillText(text, pad.l - 8, cy);

    // Value aligned cleanly in right gutter outside track
    c.fillStyle = COLORS.ink;
    c.font = `700 10.5px ${FONT_SANS}`;
    c.textAlign = 'right';
    c.fillText(format(item.value), w - 6, cy);

    hits.push({
      x: 4, y: cy - rowH / 2, w: w - 8, h: rowH,
      html: `<strong>${item.fullLabel || item.label}</strong><br><span class="tt-val">${format(item.value)}</span>${item.extra ? `<br><span class="tt-sub">${item.extra}</span>` : ''}`,
    });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawGroupedHorizontalBars(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { rows, labelA, labelB, colorA = COLORS.teal, colorB = COLORS.vermilion, format = (v) => `${v.toFixed(1)}%` } = cfg;
  const labelW = Math.min(130, Math.max(92, Math.floor(w * 0.34)));
  const pad = { l: labelW, r: 44, t: 10, b: 10 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const rowH = ph / rows.length;
  const maxV = Math.max(...rows.flatMap((r) => [r.a, r.b]), 1) * 1.06;

  const hits = [];
  rows.forEach((row, i) => {
    const top = pad.t + rowH * i + 4;
    const bh = Math.max(7, Math.min(12, (rowH - 12) / 2));
    const wA = Math.max(3, (row.a / maxV) * pw);
    const wB = Math.max(3, (row.b / maxV) * pw);

    c.fillStyle = colorA;
    c.beginPath(); c.roundRect(pad.l, top, wA, bh, 2); c.fill();
    c.fillStyle = colorB;
    c.beginPath(); c.roundRect(pad.l, top + bh + 3, wB, bh, 2); c.fill();

    c.fillStyle = COLORS.ink;
    c.font = `600 10.5px ${FONT_SANS}`;
    c.textAlign = 'right';
    c.textBaseline = 'middle';
    c.fillText(row.label, pad.l - 8, top + bh + 1);

    c.font = `700 9.5px ${FONT_SANS}`;
    c.textAlign = 'left';
    c.fillStyle = colorA;
    c.fillText(format(row.a), pad.l + wA + 5, top + bh / 2);
    c.fillStyle = colorB;
    c.fillText(format(row.b), pad.l + wB + 5, top + bh + 3 + bh / 2);

    hits.push({
      x: 4, y: pad.t + rowH * i, w: w - 8, h: rowH,
      html: `<strong>${row.label}</strong> (${row.provinces} provinces)<br>${labelA}: <span class="tt-val">${format(row.a)}</span><br>${labelB}: <span class="tt-val">${format(row.b)}</span>`,
    });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawPopulationPyramid(canvas, rows, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const ordered = [...rows].reverse();
  const pad = { t: 22, b: 18, side: 14 };
  const midW = 46;
  const halfW = (w - midW - pad.side * 2) / 2;
  const leftBase = pad.side + halfW;
  const rightBase = leftBase + midW;
  const rowH = (h - pad.t - pad.b) / ordered.length;
  const maxV = 4.6;

  c.font = `700 10.5px ${FONT_SANS}`;
  c.textBaseline = 'middle';
  c.textAlign = 'right'; c.fillStyle = COLORS.teal; c.fillText('Male (% of pop)', leftBase - 4, 11);
  c.textAlign = 'left'; c.fillStyle = COLORS.vermilion; c.fillText('Female (% of pop)', rightBase + 4, 11);

  const hits = [];
  ordered.forEach((r, i) => {
    const cy = pad.t + rowH * (i + 0.5);
    const bh = Math.max(7, rowH * 0.72);
    const mw = (r.male / maxV) * halfW;
    const fw = (r.female / maxV) * halfW;

    c.fillStyle = COLORS.teal;
    c.fillRect(leftBase - mw, cy - bh / 2, mw, bh);
    c.fillStyle = COLORS.vermilion;
    c.fillRect(rightBase, cy - bh / 2, fw, bh);

    c.fillStyle = COLORS.slate;
    c.font = `600 9.5px ${FONT_SANS}`;
    c.textAlign = 'center';
    c.fillText(r.group, leftBase + midW / 2, cy);

    hits.push({
      x: pad.side, y: cy - rowH / 2, w: w - pad.side * 2, h: rowH,
      html: `<strong>Age ${r.group} (2024)</strong><br>Male: <span class="tt-val">${r.male.toFixed(1)}%</span> · Female: <span class="tt-val">${r.female.toFixed(1)}%</span>`,
    });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawDonutChart(canvas, cfg, { showTooltip, hideTooltip }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { segments, centerTitle, centerSub } = cfg;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const cx = w * 0.34;
  const cy = h / 2;
  const outerR = Math.min(cx - 14, h * 0.42);
  const innerR = outerR * 0.60;

  let start = -Math.PI / 2;
  segments.forEach((seg) => {
    const sweep = (seg.value / total) * Math.PI * 2;
    c.beginPath();
    c.arc(cx, cy, outerR, start, start + sweep);
    c.arc(cx, cy, innerR, start + sweep, start, true);
    c.closePath();
    c.fillStyle = seg.color;
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 2;
    c.stroke();
    start += sweep;
  });

  c.fillStyle = COLORS.ink;
  c.font = `700 17px Georgia, serif`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(centerTitle, cx, cy - 6);
  c.fillStyle = COLORS.slate;
  c.font = `600 10px ${FONT_SANS}`;
  c.fillText(centerSub, cx, cy + 12);

  // Legend on right
  const lx = cx + outerR + 22;
  const startY = cy - (segments.length * 26) / 2 + 8;
  const hits = [];
  segments.forEach((seg, i) => {
    const y = startY + i * 28;
    c.fillStyle = seg.color;
    c.beginPath(); c.roundRect(lx, y - 6, 11, 11, 2); c.fill();
    c.fillStyle = COLORS.ink;
    c.font = `700 11.5px ${FONT_SANS}`;
    c.textAlign = 'left';
    c.fillText(`${seg.label}: ${seg.value.toFixed(1)}%`, lx + 17, y);
    if (seg.sub) {
      c.fillStyle = COLORS.muted;
      c.font = `500 10px ${FONT_SANS}`;
      c.fillText(seg.sub, lx + 17, y + 13);
    }
    hits.push({ x: lx, y: y - 10, w: w - lx - 6, h: 24, html: `<strong>${seg.label}</strong><br><span class="tt-val">${seg.value.toFixed(1)}%</span>${seg.sub ? `<br><span class="tt-sub">${seg.sub}</span>` : ''}` });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip);
}

export function drawBubbleScatter(canvas, cfg, { showTooltip, hideTooltip, onSelect }) {
  const { c, w, h } = prepareCanvas(canvas);
  const { provinces, regionColors, scale = 'log', highlightA, highlightB } = cfg;
  const pad = { l: 44, r: 22, t: 18, b: 32 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  const xMinRaw = 950;
  const xMaxRaw = 24000;
  const yMin = 52;
  const yMax = 87;

  const xOf = (val) => {
    if (scale === 'log') {
      const t = (Math.log10(val) - Math.log10(xMinRaw)) / (Math.log10(xMaxRaw) - Math.log10(xMinRaw));
      return pad.l + Math.max(0, Math.min(1, t)) * pw;
    }
    return pad.l + ((val - 0) / xMaxRaw) * pw;
  };
  const yOf = (val) => pad.t + ph - ((val - yMin) / (yMax - yMin)) * ph;

  // Grid & Y ticks (HDI)
  c.font = `600 10px ${FONT_SANS}`;
  for (const hdiTick of [55, 65, 75, 85]) {
    const y = yOf(hdiTick);
    c.strokeStyle = hdiTick === 75 ? 'rgba(11,25,44,0.22)' : COLORS.grid;
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(pad.l, y); c.lineTo(w - pad.r, y); c.stroke();
    c.fillStyle = COLORS.muted;
    c.textAlign = 'right'; c.textBaseline = 'middle';
    c.fillText(String(hdiTick), pad.l - 6, y);
  }

  // X ticks (GRDP per capita)
  const xTicks = scale === 'log' ? [1500, 3000, 5000, 10000, 20000] : [0, 5000, 10000, 15000, 20000];
  xTicks.forEach((v) => {
    const x = xOf(Math.max(v, scale === 'log' ? xMinRaw : 0));
    c.strokeStyle = COLORS.grid;
    c.beginPath(); c.moveTo(x, pad.t); c.lineTo(x, pad.t + ph); c.stroke();
    c.fillStyle = COLORS.muted;
    c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillText(v === 0 ? '$0' : `$${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`, x, pad.t + ph + 6);
  });

  // National average crosshairs ($4,960, HDI 75.02)
  c.save();
  c.setLineDash([4, 4]);
  c.strokeStyle = 'rgba(11,25,44,0.35)';
  c.beginPath(); c.moveTo(xOf(4960), pad.t); c.lineTo(xOf(4960), pad.t + ph); c.stroke();
  c.beginPath(); c.moveTo(pad.l, yOf(75.02)); c.lineTo(w - pad.r, yOf(75.02)); c.stroke();
  c.restore();

  c.fillStyle = COLORS.slate;
  c.font = `600 9.5px ${FONT_SANS}`;
  c.textAlign = 'left';
  c.textBaseline = 'bottom';
  c.fillText('IDN Avg: $4,960 · HDI 75.02', xOf(4960) + 5, pad.t + 12);

  // Axis captions
  c.fillStyle = COLORS.slate;
  c.font = `700 10px ${FONT_SANS}`;
  c.textAlign = 'center';
  c.textBaseline = 'bottom';
  c.fillText(`GRDP per Capita (USD, ${scale === 'log' ? 'Log' : 'Linear'} Scale)`, pad.l + pw / 2, h - 2);

  // Bubbles
  const hits = [];
  const labelIds = new Set(['jakarta', 'east-kalimantan', 'west-java', 'bali', 'riau', 'highland-papua', 'yogyakarta', highlightA, highlightB]);

  provinces.forEach((p) => {
    const x = xOf(p.grdpPerCap);
    const y = yOf(p.hdi);
    const r = Math.max(5.5, Math.min(20, Math.sqrt(p.popM) * 2.75));
    const isA = p.id === highlightA;
    const isB = p.id === highlightB;

    if (isA || isB) {
      c.beginPath();
      c.arc(x, y, r + 5, 0, Math.PI * 2);
      c.strokeStyle = isA ? COLORS.vermilion : COLORS.gold;
      c.lineWidth = 2.6;
      c.stroke();
    }

    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = regionColors[p.region] || COLORS.teal;
    c.globalAlpha = (isA || isB) ? 0.94 : 0.72;
    c.fill();
    c.globalAlpha = 1;
    c.strokeStyle = '#fff';
    c.lineWidth = 1.2;
    c.stroke();

    if (labelIds.has(p.id)) {
      c.fillStyle = COLORS.ink;
      c.font = `${isA || isB ? 700 : 600} 10px ${FONT_SANS}`;
      const padLbl = r + (isA || isB ? 9 : 5);
      if (p.id === 'west-java') {
        c.textAlign = 'center';
        c.textBaseline = 'bottom';
        c.fillText(p.shortName, x, y - r - 4);
      } else {
        const rightSide = x > pad.l + pw * 0.72;
        c.textAlign = rightSide ? 'right' : 'left';
        c.textBaseline = 'middle';
        c.fillText(p.shortName, rightSide ? x - padLbl : x + padLbl, y + (p.id === 'riau' ? 10 : 0));
      }
    }

    hits.push({
      x: x - r - 3, y: y - r - 3, w: (r + 3) * 2, h: (r + 3) * 2,
      data: p,
      html: `<strong>${p.name}</strong> <span class="tt-sub">(${p.region})</span><br>`
        + `GRDP/Cap: <span class="tt-val">$${p.grdpPerCap.toLocaleString('en-US')}</span> · HDI: <span class="tt-val">${p.hdi.toFixed(2)}</span><br>`
        + `<span class="tt-sub">Pop ${p.popM.toFixed(1)}M · Poverty ${p.poverty.toFixed(2)}% (Click to compare)</span>`,
    });
  });

  attachHover(canvas, hits, showTooltip, hideTooltip, onSelect);
}
