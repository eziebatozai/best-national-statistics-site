// Custom zero-dependency Canvas 2D charting module for Nusantara Stats.
// Supports high-DPI rendering, direct value labels, and hover tooltips.

export const PALETTE = {
  teal: '#0f5c5c',
  tealLight: '#3c8c88',
  tealTint: 'rgba(15, 92, 92, 0.14)',
  terra: '#c4552d',
  terraTint: 'rgba(196, 85, 45, 0.15)',
  ochre: '#c58f2a',
  slate: '#3c5563',
  sage: '#4e8a6b',
  plum: '#735372',
  grid: '#e6e0d4',
  axis: '#9ca7ad',
  text: '#16242c',
  muted: '#5c6c75',
};

const SERIES_COLORS = [PALETTE.teal, PALETTE.terra, PALETTE.ochre, PALETTE.slate, PALETTE.sage, PALETTE.plum];

const activeCharts = new Map();

function getTooltip() {
  return document.getElementById('chart-tooltip');
}

function hideTooltip() {
  const tip = getTooltip();
  if (tip) tip.hidden = true;
}

function showTooltip(clientX, clientY, html) {
  const tip = getTooltip();
  if (!tip) return;
  tip.innerHTML = html;
  tip.hidden = false;
  const pad = 12;
  const w = tip.offsetWidth || 180;
  const h = tip.offsetHeight || 48;
  const left = clientX + pad + w > window.innerWidth ? clientX - w - pad : clientX + pad;
  const top = clientY + pad + h > window.innerHeight ? clientY - h - pad : clientY + pad;
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${Math.max(8, top)}px`;
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(240, Math.round(rect.width || canvas.parentElement?.clientWidth || 520));
  const height = Math.max(180, Math.round(rect.height || canvas.parentElement?.clientHeight || 260));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function attachHover(canvas, hits) {
  canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = hits.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
    if (hit) {
      canvas.style.cursor = 'pointer';
      showTooltip(event.clientX, event.clientY, hit.tip);
    } else {
      canvas.style.cursor = 'default';
      hideTooltip();
    }
  };
  canvas.onmouseleave = () => {
    canvas.style.cursor = 'default';
    hideTooltip();
  };
}

function niceBounds(values, forceZero = false) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (forceZero) min = Math.min(0, min);
  if (min === max) {
    max = min + 1;
  }
  const pad = (max - min) * 0.12;
  const lo = min < 0 ? min - pad : (forceZero ? 0 : Math.max(0, min - pad));
  const hi = max + pad;
  return { lo, hi };
}

function fmtNum(val, suffix = '', prefix = '') {
  const abs = Math.abs(val);
  const str = abs >= 1000 ? Math.round(val).toLocaleString('en-US') : (Number.isInteger(val) ? String(val) : val.toFixed(1));
  return `${prefix}${str}${suffix}`;
}

export function drawTimeChart(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawTimeChart(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const {
    labels,
    values,
    type = 'line',
    color = PALETTE.teal,
    highlightIndex = -1,
    prefix = '',
    suffix = '',
    forceZero = true,
    targetLine = null,
  } = config;

  const pad = { top: 24, right: 18, bottom: 32, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const allVals = targetLine ? [...values, targetLine.value] : values;
  const { lo, hi } = niceBounds(allVals, forceZero || type === 'bar');
  const yOf = (v) => pad.top + ((hi - v) / (hi - lo)) * plotH;

  // Grid & Y labels
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const val = lo + ((hi - lo) * i) / ticks;
    const y = yOf(val);
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(fmtNum(val, suffix, prefix), pad.left - 7, y);
  }

  // Zero line if negative values exist
  if (lo < 0 && hi > 0) {
    const zy = yOf(0);
    ctx.strokeStyle = PALETTE.axis;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(pad.left, zy);
    ctx.lineTo(width - pad.right, zy);
    ctx.stroke();
  }

  const hits = [];
  const count = labels.length;
  const step = plotW / count;

  if (type === 'bar') {
    const zeroY = yOf(Math.max(0, lo));
    const barW = Math.min(36, Math.max(12, step * 0.62));
    values.forEach((v, i) => {
      const cx = pad.left + step * i + step / 2;
      const y = yOf(v);
      const top = Math.min(y, zeroY);
      const barH = Math.max(2, Math.abs(zeroY - y));
      const isHi = i === highlightIndex;
      ctx.fillStyle = v < 0 ? PALETTE.terra : (isHi ? PALETTE.terra : color);
      ctx.beginPath();
      ctx.roundRect(cx - barW / 2, top, barW, barH, [3, 3, 0, 0]);
      ctx.fill();

      // Direct value label when space permits
      if (count <= 10 && width > 340) {
        ctx.fillStyle = isHi ? PALETTE.terra : PALETTE.text;
        ctx.font = `${isHi ? '700' : '600'} 10.5px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = v < 0 ? 'top' : 'bottom';
        ctx.fillText(fmtNum(v, suffix, prefix), cx, v < 0 ? top + barH + 3 : top - 4);
      }
      hits.push({
        x: cx - step / 2,
        y: pad.top,
        w: step,
        h: plotH,
        tip: `<strong>${labels[i]}</strong><br>${fmtNum(v, suffix, prefix)}`,
      });
    });
  } else {
    const pts = values.map((v, i) => ({
      x: pad.left + (count === 1 ? plotW / 2 : (plotW * i) / (count - 1)),
      y: yOf(v),
      v,
    }));

    // Soft area fill
    ctx.fillStyle = color === PALETTE.terra ? PALETTE.terraTint : PALETTE.tealTint;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, yOf(Math.max(0, lo)));
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, yOf(Math.max(0, lo)));
    ctx.closePath();
    ctx.fill();

    // Main line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Points & callouts
    pts.forEach((p, i) => {
      const isHi = i === highlightIndex;
      ctx.fillStyle = isHi ? PALETTE.terra : '#ffffff';
      ctx.strokeStyle = isHi ? PALETTE.terra : color;
      ctx.lineWidth = isHi ? 2.5 : 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHi ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isHi || i === pts.length - 1 || i === 0 || (p.v < 0)) {
        const labelText = fmtNum(p.v, suffix, prefix);
        ctx.font = '700 10.5px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = i === 0 ? 'left' : (i === pts.length - 1 ? 'right' : 'center');
        ctx.textBaseline = p.v < 0 ? 'top' : 'bottom';
        const lx = i === 0 ? p.x + 2 : p.x;
        const ly = p.v < 0 ? p.y + 8 : p.y - 9;
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.lineJoin = 'round';
        ctx.strokeText(labelText, lx, ly);
        ctx.fillStyle = isHi ? PALETTE.terra : PALETTE.text;
        ctx.fillText(labelText, lx, ly);
        ctx.restore();
      }

      hits.push({
        x: p.x - Math.max(14, step / 2),
        y: pad.top,
        w: Math.max(28, step),
        h: plotH,
        tip: `<strong>${labels[i]}</strong><br>${fmtNum(p.v, suffix, prefix)}`,
      });
    });
  }

  // Optional target line (drawn above bars/line with crisp pill label)
  if (targetLine) {
    const ty = yOf(targetLine.value);
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = PALETTE.terra;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(pad.left, ty);
    ctx.lineTo(width - pad.right, ty);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '700 10.5px -apple-system, BlinkMacSystemFont, sans-serif';
    const tw = ctx.measureText(targetLine.label).width;
    const pillW = tw + 12;
    const pillH = 18;
    const pillX = pad.left + 8;
    const pillY = Math.max(pad.top + 2, ty - pillH - 4);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = 'rgba(196, 85, 45, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.terra;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetLine.label, pillX + 6, pillY + pillH / 2);
    ctx.restore();
  }

  // X labels
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const skip = width < 380 && count > 6 ? 2 : 1;
  labels.forEach((lbl, i) => {
    if (skip > 1 && i === count - 2 && (count - 1) % skip !== 0) return;
    if (i % skip !== 0 && i !== count - 1) return;
    const x = type === 'bar'
      ? pad.left + step * i + step / 2
      : pad.left + (count === 1 ? plotW / 2 : (plotW * i) / (count - 1));
    ctx.fillStyle = i === highlightIndex ? PALETTE.terra : PALETTE.muted;
    ctx.font = `${i === highlightIndex ? '700' : '400'} 11px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillText(String(lbl), x, height - pad.bottom + 8);
  });

  attachHover(canvas, hits);
}

function fitLabel(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text.length;
  while (cut > 3 && ctx.measureText(`${text.slice(0, cut)}…`).width > maxWidth) {
    cut--;
  }
  return `${text.slice(0, cut)}…`;
}

export function drawHorizontalBars(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawHorizontalBars(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const { items, prefix = '', suffix = '', highlightKey = null, color = PALETTE.teal } = config;

  const labelW = Math.min(148, Math.max(96, Math.round(width * 0.36)));
  const pad = { top: 8, right: 64, bottom: 10, left: labelW + 10 };
  const plotW = Math.max(76, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...items.map((d) => d.value), 1) * 1.08;
  const rowH = plotH / items.length;
  const barH = Math.min(19, Math.max(9, rowH * 0.58));

  const hits = [];
  items.forEach((item, i) => {
    const cy = pad.top + rowH * i + rowH / 2;
    const barW = Math.max(3, (item.value / maxVal) * plotW);
    const isHi = highlightKey && item.key === highlightKey;

    // Track
    ctx.fillStyle = '#efeae0';
    ctx.beginPath();
    ctx.roundRect(pad.left, cy - barH / 2, plotW, barH, 3);
    ctx.fill();

    // Fill
    ctx.fillStyle = isHi ? PALETTE.terra : (item.color || color);
    ctx.beginPath();
    ctx.roundRect(pad.left, cy - barH / 2, barW, barH, 3);
    ctx.fill();

    // Label (measured to fit strictly inside pad.left)
    ctx.fillStyle = isHi ? PALETTE.terra : PALETTE.text;
    ctx.font = `${isHi ? '700' : '500'} ${width < 380 ? '10.5px' : '11.5px'} -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const text = fitLabel(ctx, item.label, pad.left - 12);
    ctx.fillText(text, pad.left - 8, cy);

    // Value
    ctx.fillStyle = isHi ? PALETTE.terra : PALETTE.text;
    ctx.font = '700 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(fmtNum(item.value, suffix, prefix), pad.left + barW + 6, cy);

    hits.push({
      x: 0,
      y: pad.top + rowH * i,
      w: width,
      h: rowH,
      tip: `<strong>${item.label}</strong><br>${fmtNum(item.value, suffix, prefix)}${item.note ? `<br><span style="opacity:.8">${item.note}</span>` : ''}`,
    });
  });

  attachHover(canvas, hits);
}

export function drawGroupedBars(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawGroupedBars(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const { labels, series, suffix = '', prefix = '' } = config;

  const pad = { top: 20, right: 16, bottom: 36, left: 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const allVals = series.flatMap((s) => s.values);
  const maxVal = Math.max(...allVals, 1) * 1.15;
  const yOf = (v) => pad.top + ((maxVal - v) / maxVal) * plotH;

  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = (maxVal * i) / 4;
    const y = yOf(v);
    ctx.strokeStyle = PALETTE.grid;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(fmtNum(v, suffix, prefix), pad.left - 6, y);
  }

  const groupW = plotW / labels.length;
  const innerW = Math.min(groupW * 0.72, 64);
  const barW = Math.max(8, innerW / series.length - 3);
  const hits = [];

  labels.forEach((lbl, gi) => {
    const gx = pad.left + gi * groupW + (groupW - innerW) / 2;
    const tipLines = [`<strong>${lbl}</strong>`];
    series.forEach((s, si) => {
      const v = s.values[gi];
      const bx = gx + si * (barW + 3);
      const y = yOf(v);
      const h = Math.max(2, pad.top + plotH - y);
      ctx.fillStyle = s.color || SERIES_COLORS[si % SERIES_COLORS.length];
      ctx.beginPath();
      ctx.roundRect(bx, y, barW, h, [3, 3, 0, 0]);
      ctx.fill();
      tipLines.push(`${s.name}: ${fmtNum(v, suffix, prefix)}`);
    });

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '10.5px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const shortLbl = lbl.length > 13 && width < 480 ? `${lbl.slice(0, 11)}…` : lbl;
    ctx.fillText(shortLbl, pad.left + gi * groupW + groupW / 2, height - pad.bottom + 8);

    hits.push({
      x: pad.left + gi * groupW,
      y: pad.top,
      w: groupW,
      h: plotH,
      tip: tipLines.join('<br>'),
    });
  });

  attachHover(canvas, hits);
}

export function drawDonut(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawDonut(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const { items, centerTop = '', centerBottom = '', suffix = '%' } = config;

  const compact = width < 400;
  const cx = compact ? width * 0.32 : width * 0.28;
  const cy = height / 2;
  const radius = Math.min(cx - 14, height / 2 - 14, 92);
  const innerR = radius * 0.58;
  const total = items.reduce((acc, d) => acc + d.value, 0) || 1;

  let start = -Math.PI / 2;
  const slices = items.map((item, i) => {
    const angle = (item.value / total) * Math.PI * 2;
    const s = { ...item, start, end: start + angle, color: item.color || SERIES_COLORS[i % SERIES_COLORS.length] };
    start += angle;
    return s;
  });

  slices.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, s.start, s.end);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Cutout
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.text;
  ctx.font = '700 15px Georgia, serif';
  ctx.fillText(centerTop, cx, cy - 7);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '10.5px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(centerBottom, cx, cy + 10);

  // Legend on right
  const legX = cx + radius + 22;
  const rowH = Math.min(28, (height - 24) / slices.length);
  const startY = Math.max(16, (height - rowH * slices.length) / 2);
  const hits = [];

  slices.forEach((s, i) => {
    const y = startY + i * rowH + rowH / 2;
    ctx.fillStyle = s.color;
    ctx.fillRect(legX, y - 5, 10, 10);

    ctx.fillStyle = PALETTE.text;
    ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const maxChars = width < 380 ? 14 : 24;
    const lbl = s.label.length > maxChars ? `${s.label.slice(0, maxChars - 1)}…` : s.label;
    ctx.fillText(lbl, legX + 16, y);

    ctx.fillStyle = PALETTE.teal;
    ctx.font = '700 11.5px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(fmtNum(s.value, suffix), width - 10, y);

    hits.push({
      x: legX - 4,
      y: startY + i * rowH,
      w: width - legX,
      h: rowH,
      tip: `<strong>${s.label}</strong><br>${fmtNum(s.value, suffix)}${s.note ? `<br>${s.note}` : ''}`,
    });
  });

  attachHover(canvas, hits);
}

export function drawPyramid(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawPyramid(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const { rows } = config; // ascending age groups, draw oldest at top

  const ordered = [...rows].reverse();
  const pad = { top: 24, right: 16, bottom: 26, left: 16 };
  const centerGap = 46;
  const halfW = (width - pad.left - pad.right - centerGap) / 2;
  const plotH = height - pad.top - pad.bottom;
  const rowH = plotH / ordered.length;
  const maxShare = Math.max(...ordered.flatMap((r) => [r.male, r.female]), 4.5);
  const midL = pad.left + halfW;
  const midR = midL + centerGap;

  // Headers
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillStyle = PALETTE.teal;
  ctx.textAlign = 'right';
  ctx.fillText('Male (%)', midL - 4, 4);
  ctx.fillStyle = PALETTE.terra;
  ctx.textAlign = 'left';
  ctx.fillText('Female (%)', midR + 4, 4);

  const hits = [];
  ordered.forEach((row, i) => {
    const y = pad.top + i * rowH;
    const bh = Math.max(6, rowH - 3);
    const mw = (row.male / maxShare) * halfW;
    const fw = (row.female / maxShare) * halfW;

    ctx.fillStyle = PALETTE.teal;
    ctx.fillRect(midL - mw, y + 1.5, mw, bh);

    ctx.fillStyle = PALETTE.terra;
    ctx.fillRect(midR, y + 1.5, fw, bh);

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.group, midL + centerGap / 2, y + rowH / 2);

    hits.push({
      x: pad.left,
      y,
      w: width - pad.left - pad.right,
      h: rowH,
      tip: `<strong>Age ${row.group}</strong><br>Male: ${row.male.toFixed(1)}% · Female: ${row.female.toFixed(1)}%`,
    });
  });

  // Bottom scale
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(`${maxShare.toFixed(0)}%`, pad.left, height - 18);
  ctx.textAlign = 'right';
  ctx.fillText(`${maxShare.toFixed(0)}%`, width - pad.right, height - 18);

  attachHover(canvas, hits);
}

export function drawScatter(canvas, config) {
  if (!canvas) return;
  activeCharts.set(canvas, () => drawScatter(canvas, config));
  const { ctx, width, height } = setupCanvas(canvas);
  const { points, xLabel, yLabel, highlightKey } = config;

  const pad = { top: 20, right: 24, bottom: 38, left: 54 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = 0;
  const xMax = Math.max(...xs) * 1.08;
  const yMin = Math.floor(Math.min(...ys) - 1);
  const yMax = Math.ceil(Math.max(...ys) + 1);
  const xOf = (v) => pad.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => pad.top + ((yMax - v) / (yMax - yMin)) * plotH;

  // Grid
  ctx.font = '10.5px -apple-system, BlinkMacSystemFont, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const yv = yMin + ((yMax - yMin) * i) / 4;
    const y = yOf(yv);
    ctx.strokeStyle = PALETTE.grid;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = PALETTE.muted;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(yv.toFixed(1), pad.left - 7, y);

    const xv = xMin + ((xMax - xMin) * i) / 4;
    const x = xOf(xv);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`$${Math.round(xv / 1000)}k`, x, height - pad.bottom + 7);
  }

  // Axis captions
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(xLabel, pad.left + plotW / 2, height - 12);
  ctx.save();
  ctx.translate(14, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  const hits = [];
  points.forEach((p) => {
    const x = xOf(p.x);
    const y = yOf(p.y);
    const r = Math.max(5, Math.min(16, Math.sqrt(p.size) * 2.1));
    const isHi = p.key === highlightKey;

    ctx.fillStyle = isHi ? 'rgba(196, 85, 45, 0.85)' : 'rgba(15, 92, 92, 0.62)';
    ctx.strokeStyle = isHi ? '#8d3616' : PALETTE.teal;
    ctx.lineWidth = isHi ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isHi || p.size >= 30 || p.x >= 10000 || p.y >= 80) {
      ctx.fillStyle = isHi ? PALETTE.terra : PALETTE.text;
      ctx.font = `${isHi ? '700' : '600'} 10.5px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = x > width - 110 ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.label, x > width - 110 ? x - r - 4 : x + r + 4, y);
    }

    hits.push({
      x: x - r - 3,
      y: y - r - 3,
      w: (r + 3) * 2,
      h: (r + 3) * 2,
      tip: `<strong>${p.label}</strong><br>GRDP/cap: $${p.x.toLocaleString('en-US')}<br>HDI: ${p.y.toFixed(2)}<br>Population: ${p.size.toFixed(1)}M`,
    });
  });

  attachHover(canvas, hits);
}

export function clearRegisteredCharts() {
  activeCharts.clear();
  hideTooltip();
}

export function redrawAllCharts() {
  for (const [canvas, draw] of activeCharts.entries()) {
    if (document.body.contains(canvas)) {
      draw();
    } else {
      activeCharts.delete(canvas);
    }
  }
}
