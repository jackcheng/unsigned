/* UNSIGNED — procedural watch illustrator.
   Every watch in the game is drawn from a small config object, so that the
   same renderer can serve inspection, wrist portraits, the lineage board,
   and (in Act II) the design bench. Units: 1 mm = 2.5 svg units. */
(function () {
'use strict';
const W = {};
let UID = 0;

const rad = d => d * Math.PI / 180;
const P = (r, deg) => [r * Math.sin(rad(deg)), -r * Math.cos(rad(deg))];
const r2 = v => Math.round(v * 100) / 100;
const pt = a => r2(a[0]) + ',' + r2(a[1]);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function rng(seed) { let s = (seed >>> 0) || 7; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function merge(a, b) {
  const o = Array.isArray(a) ? a.slice() : Object.assign({}, a);
  for (const k in b) {
    const v = b[k];
    o[k] = (v && typeof v === 'object' && !Array.isArray(v) && a && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) ? merge(a[k], v) : v;
  }
  return o;
}
W.merge = merge;

const FONT = {
  sans: "Jost,'Futura','Avenir Next','Helvetica Neue',Arial,sans-serif",
  serif: "'Cormorant Garamond','EB Garamond',Georgia,serif",
  text: "'EB Garamond',Georgia,serif",
  script: "'La Belle Aurore','Caveat',cursive",
  hand: "'Caveat','La Belle Aurore',cursive",
  mono: "'DejaVu Sans Mono',Menlo,Consolas,monospace"
};
W.FONT = FONT;

// [highlight, light, mid, dark, edge]
const METAL = {
  steel:    ['#f7f9fb', '#d3d9df', '#98a1aa', '#5b636c', '#2e3339'],
  polished: ['#ffffff', '#e2e7ec', '#a9b2bb', '#606a74', '#2e3339'],
  gold:     ['#fff4cf', '#ecc76d', '#b88a30', '#7a5716', '#4a340b'],
  rose:     ['#ffe6d6', '#e3aa8a', '#b0765a', '#754631', '#472a1c'],
  pvd:      ['#74797f', '#43474c', '#26292d', '#141618', '#050505'],
  chrome:   ['#fbfaf2', '#d9d8cc', '#9c9b8e', '#66655a', '#3a3a32'],
  silver:   ['#f5f3ea', '#d2cfc2', '#9a978a', '#625f55', '#38362f'],
  titanium: ['#c9cbcd', '#a0a3a6', '#6f7377', '#484b4f', '#26282a'],
  brass:    ['#f7e9b0', '#d6b660', '#a5842f', '#6b5216', '#40300a'],
  resin:    ['#55585c', '#34373a', '#1d1f21', '#0e0f10', '#000000']
};
W.METAL = METAL;

const LUME = {
  radium:   { c: '#a9844c', glow: 0.04 },
  tritium:  { c: '#e6d3a1', glow: 0.13 },
  pumpkin:  { c: '#dcab62', glow: 0.09 },
  luminova: { c: '#eef2e0', glow: 1 },
  fresh:    { c: '#d9efc2', glow: 1 },
  white:    { c: '#f3f0e6', glow: 0 },
  none: null
};
const HANDCOL = {
  steel: '#eceff2', blued: '#2b4a9a', gold: '#e3bd62', black: '#141414', white: '#f5f3ec',
  orange: '#f26a1b', red: '#c8281e', yellow: '#f2c21b', rose: '#dca080'
};

const DEF = {
  mm: 38, shape: 'round', metal: 'steel', lugs: 'straight', lugW: 0,
  bezel: { type: 'smooth' },
  crown: { pos: 3, size: 1 },
  dial: { color: '#f2eee3', finish: 'matte', track: 'ticks', indices: 'baton', ink: '#1c1c1c' },
  hands: { style: 'baton', color: 'black', seconds: 'center' },
  strap: { type: 'leather', color: '#3b2a20' },
  time: [10, 9, 36], bph: 18000
};

function geom(c) {
  const R = c.mm * 2.5, b = c.bezel || {}, t = b.type || 'smooth';
  const wide = { dive: 0.2, gmt: 0.2, tachy: 0.19, '12h': 0.2, '24h': 0.17, sliderule: 0.1, count: 0.2 };
  let bw = b.w != null ? b.w : (wide[t] != null ? wide[t] : (t === 'thin' ? 0.05 : t === 'none' ? 0.02 : t === 'fluted' ? 0.13 : t === 'octa' ? 0.2 : 0.085));
  const g = { R, bw };
  g.sw = (c.lugW || Math.round(c.mm * 0.52)) * 2.5;   // strap half-width in svg units
  g.dialShape = (c.shape === 'rect' || c.shape === 'square' || c.shape === 'tv') ? c.shape : 'round';
  if (g.dialShape === 'round') {
    const base = c.shape === 'cushion' ? 0.9 : c.shape === 'tonneau' ? 0.86 : c.shape === 'octagon' ? 0.93 : 0.955;
    g.Rb = R * base; g.Rbi = g.Rb - R * bw; g.Rd = g.Rbi - 2.5;
    g.hw = g.hh = g.Rd;
  } else if (g.dialShape === 'rect') {
    g.cw = R * 0.74; g.ch = R * 1.02; g.hw = g.cw - R * 0.2; g.hh = g.ch - R * 0.16; g.Rd = g.hw; g.sw = g.cw - R * 0.2;
  } else if (g.dialShape === 'square') {
    g.cw = g.ch = R * 0.92; g.hw = g.hh = R * 0.92 - R * (bw + 0.1); g.Rd = g.hw;
  } else { // tv / digital
    g.cw = R * 0.98; g.ch = R * 0.92; g.hw = R * 0.62; g.hh = R * 0.36; g.Rd = g.hw;
  }
  g.E = function (a, t) {
    if (g.dialShape === 'round') return P(g.Rd * t, a);
    const sx = Math.sin(rad(a)), sy = -Math.cos(rad(a));
    const k = Math.min(Math.abs(sx) < 1e-6 ? 1e9 : g.hw / Math.abs(sx), Math.abs(sy) < 1e-6 ? 1e9 : g.hh / Math.abs(sy));
    return [sx * k * t, sy * k * t];
  };
  return g;
}

function superellipse(a, b, n, steps) {
  steps = steps || 64; let d = '';
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th);
    const x = a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), y = b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
    d += (i ? 'L' : 'M') + r2(x) + ',' + r2(y);
  }
  return d + 'Z';
}
function rrect(hw, hh, r) {
  r = Math.min(r, hw, hh);
  return `M${r2(-hw + r)},${r2(-hh)}H${r2(hw - r)}Q${r2(hw)},${r2(-hh)} ${r2(hw)},${r2(-hh + r)}V${r2(hh - r)}Q${r2(hw)},${r2(hh)} ${r2(hw - r)},${r2(hh)}H${r2(-hw + r)}Q${r2(-hw)},${r2(hh)} ${r2(-hw)},${r2(hh - r)}V${r2(-hh + r)}Q${r2(-hw)},${r2(-hh)} ${r2(-hw + r)},${r2(-hh)}Z`;
}
function circ(r) { return `M${r2(-r)},0A${r2(r)},${r2(r)} 0 1 0 ${r2(r)},0A${r2(r)},${r2(r)} 0 1 0 ${r2(-r)},0Z`; }
function poly(n, r, rot) { let d = ''; for (let i = 0; i < n; i++) d += (i ? 'L' : 'M') + pt(P(r, rot + i * 360 / n)); return d + 'Z'; }

function casePath(c, g, k) {
  k = k || 1; const R = g.R * k;
  switch (c.shape) {
    case 'cushion': return superellipse(R * 0.99, R * 0.99, 3.6);
    case 'tonneau': return superellipse(R * 0.99, R * 1.16, 2.7);
    case 'octagon': return superellipse(R * 0.97, R * 1.1, 3.2);
    case 'rect': return rrect(g.cw * k, g.ch * k, R * 0.1);
    case 'square': return rrect(g.cw * k, g.ch * k, R * 0.2);
    case 'tv': return rrect(g.cw * k, g.ch * k, R * 0.34);
    default: return circ(R);
  }
}
function dialPath(c, g) {
  if (g.dialShape === 'round') return circ(g.Rd);
  if (g.dialShape === 'rect') return rrect(g.hw, g.hh, g.R * 0.03);
  if (g.dialShape === 'square') return rrect(g.hw, g.hh, g.R * 0.1);
  return rrect(g.hw, g.hh, g.R * 0.06);
}

/* ---------- defs ---------- */
function defs(id, c, g, M) {
  const R = g.R;
  let s = '<defs>';
  s += `<linearGradient id="${id}m" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="${M[0]}"/><stop offset="0.3" stop-color="${M[1]}"/><stop offset="0.62" stop-color="${M[2]}"/><stop offset="1" stop-color="${M[3]}"/></linearGradient>`;
  s += `<linearGradient id="${id}b" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="${M[3]}"/><stop offset="0.4" stop-color="${M[1]}"/><stop offset="0.6" stop-color="${M[0]}"/><stop offset="1" stop-color="${M[2]}"/></linearGradient>`;
  s += `<linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${M[3]}"/><stop offset="0.25" stop-color="${M[1]}"/><stop offset="0.5" stop-color="${M[0]}"/><stop offset="0.75" stop-color="${M[1]}"/><stop offset="1" stop-color="${M[3]}"/></linearGradient>`;
  s += `<radialGradient id="${id}ds" cx="0.38" cy="0.3" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.13"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>`;
  s += `<radialGradient id="${id}gl" cx="0.3" cy="0.22" r="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="${id}bl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b7fd6"/><stop offset="0.5" stop-color="#263f8f"/><stop offset="1" stop-color="#16265e"/></linearGradient>`;
  s += `<filter id="${id}sh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="1.2" dy="2.2" stdDeviation="1.3" flood-color="#000" flood-opacity="0.38"/></filter>`;
  s += `<filter id="${id}bz" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${r2(R * 0.07)}"/></filter>`;
  s += `<filter id="${id}gw" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  s += `<clipPath id="${id}dc"><path d="${dialPath(c, g)}"/></clipPath>`;
  s += `<path id="${id}arc" d="M${pt(P(g.Rd * 0.935, 232))}A${r2(g.Rd * 0.935)},${r2(g.Rd * 0.935)} 0 0 0 ${pt(P(g.Rd * 0.935, 128))}" fill="none"/>`;
  s += `<path id="${id}arcT" d="M${pt(P(g.Rd * 0.6, -70))}A${r2(g.Rd * 0.6)},${r2(g.Rd * 0.6)} 0 0 1 ${pt(P(g.Rd * 0.6, 70))}" fill="none"/>`;
  s += '</defs>';
  return s;
}

/* ---------- strap ---------- */
function strap(c, g, id, o) {
  const st = c.strap; if (!st || st.type === 'none') return '';
  const R = g.R, sw = g.sw, y0 = R * 0.72, y1 = 300, tp = st.taper != null ? st.taper : 0.86;
  const col = st.color || '#3b2a20';
  let s = '', one = '';
  const shape = `M${r2(-sw)},${r2(y0)}L${r2(-sw * tp)},${y1}L${r2(sw * tp)},${y1}L${r2(sw)},${r2(y0)}Z`;
  const cid = id + 'sc';
  s += `<defs><clipPath id="${cid}"><path d="${shape}"/></clipPath><linearGradient id="${id}sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.4"/><stop offset="0.18" stop-color="#000" stop-opacity="0"/><stop offset="0.82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></linearGradient></defs>`;
  const type = st.type;
  if (type === 'bracelet' || type === 'integrated') {
    const kind = st.kind || (type === 'integrated' ? 'integrated' : 'oyster');
    const M = METAL[st.metal || c.metal] || METAL.steel;
    one += `<path d="${shape}" fill="${M[2]}"/>`;
    const lh = kind === 'jubilee' || kind === 'rice' ? 9 : kind === 'integrated' ? 15 : 14;
    for (let y = y0 - 4, i = 0; y < y1; y += lh, i++) {
      const w = sw * (1 - (1 - tp) * ((y - y0) / (y1 - y0)));
      if (kind === 'oyster') {
        const cw = w * 0.42;
        one += `<rect x="${r2(-w)}" y="${r2(y)}" width="${r2(w - cw)}" height="${lh - 1.2}" rx="1.5" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.5"/>`;
        one += `<rect x="${r2(cw)}" y="${r2(y)}" width="${r2(w - cw)}" height="${lh - 1.2}" rx="1.5" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.5"/>`;
        one += `<rect x="${r2(-cw)}" y="${r2(y + lh / 2)}" width="${r2(cw * 2)}" height="${lh - 1.2}" rx="1.5" fill="${st.center === 'polished' ? M[0] : 'url(#' + id + 'h)'}" stroke="${M[4]}" stroke-width="0.5"/>`;
      } else if (kind === 'jubilee' || kind === 'rice') {
        const cw = w * 0.5, n = kind === 'rice' ? 5 : 3;
        one += `<rect x="${r2(-w)}" y="${r2(y)}" width="${r2(w - cw)}" height="${lh - 1}" rx="2" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.4"/>`;
        one += `<rect x="${r2(cw)}" y="${r2(y)}" width="${r2(w - cw)}" height="${lh - 1}" rx="2" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.4"/>`;
        for (let k = 0; k < n; k++) one += `<rect x="${r2(-cw + k * (cw * 2 / n) + 0.4)}" y="${r2(y + (k % 2 ? lh / 2 : 0))}" width="${r2(cw * 2 / n - 0.8)}" height="${lh - 1}" rx="${kind === 'rice' ? 4 : 2.5}" fill="${M[0]}" stroke="${M[3]}" stroke-width="0.4"/>`;
      } else if (kind === 'integrated') {
        one += `<rect x="${r2(-w)}" y="${r2(y)}" width="${r2(w * 2)}" height="${lh - 4.5}" rx="1.2" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.5"/>`;
        one += `<rect x="${r2(-w * 0.55)}" y="${r2(y + lh - 5)}" width="${r2(w * 0.38)}" height="5.5" fill="${M[0]}" stroke="${M[3]}" stroke-width="0.4"/><rect x="${r2(w * 0.17)}" y="${r2(y + lh - 5)}" width="${r2(w * 0.38)}" height="5.5" fill="${M[0]}" stroke="${M[3]}" stroke-width="0.4"/>`;
      } else if (kind === 'mesh') {
        one += `<line x1="${r2(-w)}" x2="${r2(w)}" y1="${r2(y)}" y2="${r2(y)}" stroke="${M[4]}" stroke-width="0.6" opacity="0.6"/>`;
      } else { // h-link / flat
        one += `<rect x="${r2(-w)}" y="${r2(y)}" width="${r2(w * 2)}" height="${lh - 1.4}" rx="1.5" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.5"/>`;
      }
    }
    if (kind === 'mesh') {
      one = `<path d="${shape}" fill="url(#${id}h)"/>`;
      for (let x = -sw - 300; x < sw + 300; x += 5) one += `<line x1="${x}" y1="${r2(y0)}" x2="${x + 240}" y2="${r2(y0 + 240)}" stroke="${M[4]}" stroke-width="0.7" opacity="0.5"/><line x1="${x + 240}" y1="${r2(y0)}" x2="${x}" y2="${r2(y0 + 240)}" stroke="${M[4]}" stroke-width="0.7" opacity="0.5"/>`;
    }
  } else {
    one += `<path d="${shape}" fill="${col}"/>`;
    if (type === 'nato' || type === 'canvas') {
      (st.stripes || []).forEach(sp => { one += `<rect x="${r2(sw * sp[1])}" y="${r2(y0 - 2)}" width="${r2(sw * sp[2])}" height="${y1}" fill="${sp[0]}"/>`; });
      for (let y = y0; y < y1; y += 3) one += `<line x1="${r2(-sw)}" x2="${r2(sw)}" y1="${r2(y)}" y2="${r2(y)}" stroke="#000" stroke-width="0.7" opacity="0.16"/>`;
      one += `<rect x="${r2(-sw)}" y="${r2(R + 46)}" width="${r2(sw * 2)}" height="7" rx="1" fill="url(#${id}h)" stroke="#333" stroke-width="0.5" opacity="${type === 'nato' ? 1 : 0}"/>`;
    } else if (type === 'rubber') {
      for (let y = y0 + 6, i = 0; y < y1; y += 9, i++) for (let x = -sw + 7 + (i % 2 ? 4.5 : 0); x < sw - 5; x += 9) one += `<rect x="${r2(x)}" y="${r2(y)}" width="3.6" height="3.6" transform="rotate(45 ${r2(x + 1.8)} ${r2(y + 1.8)})" fill="#000" opacity="0.5"/>`;
    } else { // leather
      const sc = st.stitch || 'rgba(255,255,255,0.35)';
      one += `<line x1="${r2(-sw + 4.5)}" y1="${r2(y0)}" x2="${r2(-sw * tp + 4.5)}" y2="${y1}" stroke="${sc}" stroke-width="1" stroke-dasharray="4 3.2"/><line x1="${r2(sw - 4.5)}" y1="${r2(y0)}" x2="${r2(sw * tp - 4.5)}" y2="${y1}" stroke="${sc}" stroke-width="1" stroke-dasharray="4 3.2"/>`;
      if (st.grain) { const rnd = rng(st.grain); for (let i = 0; i < 70; i++) { const x = (rnd() * 2 - 1) * sw, y = y0 + rnd() * 200; one += `<path d="M${r2(x)},${r2(y)}q${r2(rnd() * 6 - 3)},${r2(rnd() * 4)} ${r2(rnd() * 8 - 4)},${r2(rnd() * 8)}" stroke="#000" stroke-width="0.5" opacity="0.22" fill="none"/>`; } }
    }
    one += `<path d="${shape}" fill="url(#${id}sg)"/>`;
  }
  const grp = `<g clip-path="url(#${cid})">${one}</g>`;
  s += `<g class="w-strap">${grp}<g transform="scale(1,-1)">${grp}</g></g>`;
  return s;
}

/* ---------- lugs, crown, case ---------- */
function lugs(c, g, id, M) {
  const R = g.R, sw = g.sw, type = c.lugs;
  if (type === 'none' || c.shape === 'tonneau' || c.shape === 'octagon' || c.shape === 'tv') return '';
  let one = '';
  if (c.shape === 'rect') { // brancards
    const x0 = g.cw - R * 0.2, x1 = g.cw, y = g.ch + R * 0.2;
    one = `<path d="M${r2(x0)},${r2(-y)}Q${r2((x0 + x1) / 2)},${r2(-y - 5)} ${r2(x1)},${r2(-y)}L${r2(x1)},${r2(-g.ch + 10)}L${r2(x0)},${r2(-g.ch + 10)}Z" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.8" stroke-linejoin="round"/>`;
  } else if (type === 'wire') {
    const y = R + R * 0.24;
    const s = `<path d="M${r2(-sw - 3)},${r2(-R * 0.82)}L${r2(-sw - 3)},${r2(-y)}L${r2(sw + 3)},${r2(-y)}L${r2(sw + 3)},${r2(-R * 0.82)}" fill="none" stroke="${M[3]}" stroke-width="5.4" stroke-linejoin="round"/><path d="M${r2(-sw - 3)},${r2(-R * 0.82)}L${r2(-sw - 3)},${r2(-y)}L${r2(sw + 3)},${r2(-y)}L${r2(sw + 3)},${r2(-R * 0.82)}" fill="none" stroke="${M[1]}" stroke-width="2.6" stroke-linejoin="round"/>`;
    return `<g class="w-lugs">${s}<g transform="scale(1,-1)">${s}</g></g>`;
  } else {
    const thin = type === 'thin', ltT = R * (thin ? 0.09 : type === 'bold' ? 0.17 : 0.135), ltB = R * (thin ? 0.19 : type === 'bold' ? 0.32 : 0.27), yE = R + R * (c.lugLen || (thin ? 0.23 : 0.25));
    const base = c.shape === 'cushion' || c.shape === 'square' ? R * 0.99 : R;
    const xb = Math.min(sw + ltB, base * 0.97), yb = -Math.sqrt(Math.max(0, base * base - xb * xb)) + 2, xt = sw + ltT;
    one = `<path d="M${r2(sw)},${r2(-R * 0.55)}L${r2(sw)},${r2(-yE + 3)}Q${r2(sw)},${r2(-yE)} ${r2(sw + 3)},${r2(-yE)}L${r2(xt - 3)},${r2(-yE)}Q${r2(xt)},${r2(-yE)} ${r2(xt + 0.5)},${r2(-yE + 4)}Q${r2(xt + R * 0.035)},${r2(yb - R * 0.17)} ${r2(xb)},${r2(yb)}L${r2(xb)},${r2(-R * 0.5)}Z" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.8" stroke-linejoin="round"/>`;
    one += `<path d="M${r2(sw + 2)},${r2(-R * 0.92)}L${r2(sw + 2)},${r2(-yE + 3)}" stroke="${M[0]}" stroke-width="1" opacity="0.7"/>`;
  }
  let s = '<g class="w-lugs">';
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(m => { s += `<g transform="scale(${m[0]},${m[1]})">${one}</g>`; });
  // spring bars
  if (c.shape !== 'rect' && type !== 'wire' && !c.strap) s += `<rect x="${r2(-sw)}" y="${r2(-R - R * 0.2)}" width="${r2(sw * 2)}" height="3" fill="${M[3]}"/><rect x="${r2(-sw)}" y="${r2(R + R * 0.2 - 3)}" width="${r2(sw * 2)}" height="3" fill="${M[3]}"/>`;
  return s + '</g>';
}

function crownAt(pos) { return ({ 3: 90, 4: 120, 2: 60, 9: 270, 12: 0, 10: 300, 8: 240 })[pos] != null ? ({ 3: 90, 4: 120, 2: 60, 9: 270, 12: 0, 10: 300, 8: 240 })[pos] : 90; }
function crowns(c, g, id, M) {
  const R = g.R, cr = c.crown || {}; let s = '<g class="w-crowns">';
  const edge = a => { // distance from centre to case edge along clock-angle a
    if (c.shape === 'rect' || c.shape === 'square' || c.shape === 'tv') { const sx = Math.abs(Math.sin(rad(a))), sy = Math.abs(Math.cos(rad(a))); return Math.min(sx < 1e-6 ? 1e9 : g.cw / sx, sy < 1e-6 ? 1e9 : g.ch / sy); }
    const se = (A, B, n) => { const sx = Math.abs(Math.sin(rad(a))), sy = Math.abs(Math.cos(rad(a))); return Math.pow(Math.pow(sx / A, n) + Math.pow(sy / B, n), -1 / n); };
    if (c.shape === 'tonneau') return se(R * 0.99, R * 1.16, 2.7); if (c.shape === 'octagon') return se(R * 0.97, R * 1.1, 3.2);
    if (c.shape === 'cushion') return se(R * 0.99, R * 0.99, 3.6);
    return R;
  };
  const one = (pos, size, kind) => {
    const a = crownAt(pos), e = edge(a) - 2.5, sz = size || 1;
    const len = (kind === 'onion' ? 15 : kind === 'pusher' ? 9 : 10.5) * sz, h = (kind === 'onion' ? 19 : kind === 'pusher' ? 9.5 : 17) * sz;
    let d = '';
    if (kind === 'pusher') {
      d += `<rect x="${r2(-3)}" y="${r2(-e - 6)}" width="6" height="8" fill="${M[3]}"/>`;
      d += `<rect x="${r2(-h / 2)}" y="${r2(-e - len - 4.5)}" width="${r2(h)}" height="${r2(len - 2)}" rx="2" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.7"/>`;
    } else if (kind === 'onion') {
      d += `<rect x="-3.5" y="${r2(-e - 5)}" width="7" height="7" fill="${M[3]}"/>`;
      d += `<ellipse cx="0" cy="${r2(-e - 4 - len / 2)}" rx="${r2(h / 2)}" ry="${r2(len / 2)}" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.7"/>`;
      for (let i = -3; i <= 3; i++) d += `<path d="M${r2(i * h / 8)},${r2(-e - 4)}Q${r2(i * h / 5.6)},${r2(-e - 4 - len / 2)} ${r2(i * h / 8)},${r2(-e - 4 - len)}" stroke="${M[4]}" stroke-width="0.6" fill="none" opacity="0.7"/>`;
    } else {
      d += `<rect x="-4" y="${r2(-e - 3)}" width="8" height="5" fill="${M[3]}"/>`;
      d += `<rect x="${r2(-h / 2)}" y="${r2(-e - len - 1)}" width="${r2(h)}" height="${r2(len)}" rx="2.2" fill="url(#${id}h)" stroke="${M[4]}" stroke-width="0.7"/>`;
      const n = Math.round(h / 2.1);
      for (let i = 1; i < n; i++) d += `<line x1="${r2(-h / 2 + i * h / n)}" x2="${r2(-h / 2 + i * h / n)}" y1="${r2(-e - len - 0.2)}" y2="${r2(-e - 1.8)}" stroke="${M[4]}" stroke-width="0.55" opacity="0.75"/>`;
      if (kind === 'cross') d += `<path d="M${r2(-h / 2 + 1)},${r2(-e - len)}L${r2(h / 2 - 1)},${r2(-e - 2)}M${r2(h / 2 - 1)},${r2(-e - len)}L${r2(-h / 2 + 1)},${r2(-e - 2)}" stroke="${M[4]}" stroke-width="0.7" opacity="0.8"/>`;
    }
    if (c.crown && c.crown.bow && pos === 12) d += `<ellipse cx="0" cy="${r2(-e - len - 13)}" rx="13" ry="11" fill="none" stroke="${M[2]}" stroke-width="4"/><ellipse cx="0" cy="${r2(-e - len - 13)}" rx="13" ry="11" fill="none" stroke="${M[0]}" stroke-width="1.2"/>`;
    return `<g class="w-crown" transform="rotate(${a})">${d}</g>`;
  };
  if (cr.guards) { const a = crownAt(cr.pos || 3); s += `<g transform="rotate(${a})"><path d="M-17,${r2(-R + 6)}L-13,${r2(-R - 9)}Q-11,${r2(-R - 11)} -9,${r2(-R - 8)}L-8,${r2(-R + 4)}ZM17,${r2(-R + 6)}L13,${r2(-R - 9)}Q11,${r2(-R - 11)} 9,${r2(-R - 8)}L8,${r2(-R + 4)}Z" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.7"/></g>`; }
  const ps = Array.isArray(cr.pos) ? cr.pos : [cr.pos == null ? 3 : cr.pos];
  if (cr.pos !== 0) ps.forEach(p => { s += one(p, cr.size, cr.kind); });
  if (c.pushers) { const side = c.pushers === 'left' ? [300, 240] : null; (c.pushers === 'left' ? [10, 8] : c.pushers === 'mono' ? [2] : [2, 4]).forEach(p => { s += one(p, 1, 'pusher'); }); }
  return s + '</g>';
}

function caseBody(c, g, id, M) {
  const R = g.R; let s = '<g class="w-case">';
  s += `<path d="${casePath(c, g)}" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="1"/>`;
  if (c.shape === 'tonneau' || c.shape === 'cushion' || c.shape === 'octagon') {
    // radial brushing
    const rnd = rng(11); let b = '';
    for (let i = 0; i < 90; i++) { const a = i * 4 + rnd() * 2, p1 = P(R * 0.8, a), p2 = P(R * 1.2, a); b += `M${pt(p1)}L${pt(p2)}`; }
    s += `<clipPath id="${id}cc"><path d="${casePath(c, g)}"/></clipPath><path d="${b}" stroke="${M[4]}" stroke-width="0.5" opacity="0.22" clip-path="url(#${id}cc)"/>`;
  }
  if (c.shape === 'rect' && c.gadroons) for (let i = 0; i < 3; i++) s += `<line x1="${r2(-g.cw + 6)}" x2="${r2(g.cw - 6)}" y1="${r2(-g.ch + 5 + i * 4)}" y2="${r2(-g.ch + 5 + i * 4)}" stroke="${M[4]}" stroke-width="1.1" opacity="0.6"/><line x1="${r2(-g.cw + 6)}" x2="${r2(g.cw - 6)}" y1="${r2(g.ch - 5 - i * 4)}" y2="${r2(g.ch - 5 - i * 4)}" stroke="${M[4]}" stroke-width="1.1" opacity="0.6"/>`;
  if (c.ears) s = `<g class="w-case"><path d="M${r2(-R * 1.1)},${r2(-R * 0.34)}h${r2(R * 0.2)}v${r2(R * 0.68)}h${r2(-R * 0.2)}q-6,0 -6,-6v${r2(-R * 0.68 + 12)}q0,-6 6,-6zM${r2(R * 1.1)},${r2(-R * 0.34)}h${r2(-R * 0.2)}v${r2(R * 0.68)}h${r2(R * 0.2)}q6,0 6,-6v${r2(-R * 0.68 + 12)}q0,-6 -6,-6z" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.8"/>` + s.slice(18);
  return s + '</g>';
}

/* ---------- bezel ---------- */
function bezel(c, g, id, M) {
  const R = g.R, b = c.bezel || {}, t = b.type || 'smooth';
  if (g.dialShape !== 'round') {
    let s = '<g class="w-bezel">';
    if (c.shape === 'square') {
      const k = 1 - 0.035;
      s += `<path d="${rrect(g.cw * k, g.ch * k, R * 0.18)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.7"/>`;
      if (t === 'screws') for (let i = 0; i < 8; i++) { const a = i * 45 + 22.5, e = Math.min(g.cw * 0.9 / Math.abs(Math.sin(rad(a)) || 1e-9), g.ch * 0.9 / Math.abs(Math.cos(rad(a)) || 1e-9)), p = [Math.sin(rad(a)) * e, -Math.cos(rad(a)) * e]; s += screw(p[0], p[1], 3.2, M, i * 37); }
    }
    s += `<path d="${rrect(g.hw + 2.5, g.hh + 2.5, R * (c.shape === 'square' ? 0.11 : 0.05))}" fill="#0c0c0c" opacity="0.75"/>`;
    return s + '</g>';
  }
  const Rb = g.Rb, Rbi = g.Rbi;
  let s = '<g class="w-bezel">';
  const ins = b.color || '#101114', ink = b.ink || '#e9e6dc';
  if (t === 'octa') {
    s += `<path d="${poly(8, Rb * 1.02, 22.5)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="1" stroke-linejoin="round"/>`;
    const rnd = rng(5); let br = '';
    for (let i = 0; i < 70; i++) { const y = -Rb + i * (2 * Rb / 70); br += `M${r2(-Rb)},${r2(y)}H${r2(Rb)}`; }
    s += `<clipPath id="${id}oc"><path d="${poly(8, Rb * 1.02, 22.5)}"/></clipPath><path d="${br}" stroke="${M[4]}" stroke-width="0.4" opacity="0.25" clip-path="url(#${id}oc)"/>`;
    for (let i = 0; i < 8; i++) { const p = P((Rb + Rbi) / 2 + 1, i * 45); s += `<path d="${poly(6, 4.2, i * 45)}" transform="translate(${pt(p)})" fill="${M[0]}" stroke="${M[4]}" stroke-width="0.6"/><line x1="${r2(p[0] - 3)}" y1="${r2(p[1])}" x2="${r2(p[0] + 3)}" y2="${r2(p[1])}" stroke="${M[4]}" stroke-width="0.8" transform="rotate(${i * 45} ${pt(p).replace(',', ' ')})"/>`; }
  } else if (t === 'dive' || t === 'gmt' || t === 'tachy' || t === '12h' || t === 'count') {
    // knurled outer ring + insert
    s += `<circle r="${r2(Rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/>`;
    s += `<circle r="${r2(Rb - 1.6)}" fill="none" stroke="${M[4]}" stroke-width="3.2" stroke-dasharray="${t === 'tachy' ? '0 1' : '1.6 2.2'}" opacity="0.65"/>`;
    const ro = Rb - 4.2, ri = Rbi + 1.2, rm = (ro + ri) / 2, wd = ro - ri;
    s += `<g class="w-bezel-rot">`;
    if (t === 'gmt' && b.color2) {
      s += `<circle r="${r2(rm)}" fill="none" stroke="${b.color2}" stroke-width="${r2(wd)}"/>`;
      s += `<path d="M${pt(P(rm, 90))}A${r2(rm)},${r2(rm)} 0 0 1 ${pt(P(rm, 270))}" fill="none" stroke="${ins}" stroke-width="${r2(wd)}"/>`;
    } else s += `<circle r="${r2(rm)}" fill="none" stroke="${ins}" stroke-width="${r2(wd)}"/>`;
    if (b.faded) s += `<circle r="${r2(rm)}" fill="none" stroke="#b9b3a6" stroke-width="${r2(wd)}" opacity="${b.faded}"/>`;
    const fs = wd * 0.62, tx = (a, txt, sz) => { const p = P(rm, a); return `<text x="${r2(p[0])}" y="${r2(p[1])}" transform="rotate(${a} ${r2(p[0])} ${r2(p[1])})" font-family="${FONT.sans}" font-weight="${b.bold ? 600 : 500}" font-size="${r2(sz || fs)}" fill="${ink}" text-anchor="middle" dominant-baseline="central">${txt}</text>`; };
    const bar = (a, len, w) => { const p1 = P(rm - len / 2, a), p2 = P(rm + len / 2, a); return `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${ink}" stroke-width="${w}"/>`; };
    if (t === 'dive' || t === 'count') {
      const p = P(rm, 0), h = wd * 0.72;
      s += `<path d="M${r2(-h * 0.62)},${r2(p[1] - h / 2)}L${r2(h * 0.62)},${r2(p[1] - h / 2)}L0,${r2(p[1] + h / 2)}Z" fill="${ink}"/>`;
      if (b.pip !== false) s += `<circle cx="0" cy="${r2(p[1] - h * 0.08)}" r="${r2(h * 0.22)}" fill="${(LUME[b.lume || 'tritium'] || LUME.tritium).c}" class="w-lume"/>`;
      for (let m = 1; m < 60; m++) {
        const a = m * 6;
        if (m % 10 === 0) s += tx(a, m);
        else if (m % 5 === 0) s += bar(a, wd * 0.6, 2.6);
        else if (m < 15 && b.hash !== false) s += bar(a, wd * 0.32, 1);
      }
    } else if (t === 'gmt') {
      const p = P(rm, 0), h = wd * 0.66;
      s += `<path d="M${r2(-h * 0.6)},${r2(p[1] - h / 2)}L${r2(h * 0.6)},${r2(p[1] - h / 2)}L0,${r2(p[1] + h / 2)}Z" fill="${ink}"/>`;
      for (let hr = 1; hr < 24; hr++) { const a = hr * 15; s += hr % 2 === 0 ? tx(a, hr) : (b.dots ? `<circle cx="${r2(P(rm, a)[0])}" cy="${r2(P(rm, a)[1])}" r="1.6" fill="${ink}"/>` : bar(a, wd * 0.36, 1.6)); }
    } else if (t === '12h') {
      for (let hr = 1; hr <= 12; hr++) s += tx(hr * 30, hr);
      for (let m = 0; m < 60; m++) if (m % 5) s += bar(m * 6, wd * 0.2, 0.7);
    } else if (t === 'tachy') {
      const vals = [500, 400, 300, 250, 200, 180, 160, 150, 140, 130, 120, 110, 100, 95, 90, 85, 80, 75, 70, 65, 60];
      vals.forEach(v => { const a = (3600 / v) * 6 % 360; const big = [500, 400, 300, 250, 200, 160, 140, 120, 100, 90, 80, 70, 60].indexOf(v) >= 0; if (big) { s += tx(a + (v === 60 ? 0 : 0), v, wd * 0.42); } const p1 = P(ri + 1, a), p2 = P(ri + wd * 0.2, a); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${ink}" stroke-width="0.8"/>`; });
      // label
      const lp = P(rm, 20); s += `<text font-family="${FONT.sans}" font-size="${r2(wd * 0.3)}" fill="${ink}" letter-spacing="0.6" text-anchor="middle" dominant-baseline="central" x="${r2(lp[0])}" y="${r2(lp[1])}" transform="rotate(20 ${r2(lp[0])} ${r2(lp[1])})"></text>`;
    }
    s += `</g>`;
  } else if (t === '24h') { // engraved steel 24h bezel (Airman)
    s += `<circle r="${r2(Rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/><circle r="${r2(Rb - 1.4)}" fill="none" stroke="${M[4]}" stroke-width="2.6" stroke-dasharray="1.5 2" opacity="0.55"/>`;
    const rm = (Rb - 3 + Rbi) / 2, wd = Rb - 3 - Rbi;
    s += `<g class="w-bezel-rot">`;
    for (let hr = 1; hr <= 24; hr++) { const a = hr * 15, p = P(rm, a); if (hr % 2 === 0) s += `<text x="${r2(p[0])}" y="${r2(p[1])}" transform="rotate(${a} ${r2(p[0])} ${r2(p[1])})" font-family="${FONT.sans}" font-weight="500" font-size="${r2(wd * 0.6)}" fill="${M[4]}" text-anchor="middle" dominant-baseline="central">${hr}</text>`; else s += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="1.3" fill="${M[4]}"/>`; }
    s += `</g>`;
  } else if (t === 'fluted') {
    s += `<circle r="${r2(Rb)}" fill="${M[2]}" stroke="${M[4]}" stroke-width="0.8"/>`;
    let f = ''; const n = 60;
    for (let i = 0; i < n; i++) { const a0 = i * 360 / n, a1 = a0 + 180 / n, a2 = a0 + 360 / n; f += `<path d="M${pt(P(Rb - 0.6, a0))}L${pt(P(Rbi + 1, a1))}L${pt(P(Rb - 0.6, a1))}Z" fill="${M[0]}"/><path d="M${pt(P(Rb - 0.6, a1))}L${pt(P(Rbi + 1, a1))}L${pt(P(Rb - 0.6, a2))}Z" fill="${M[3]}"/>`; }
    s += f + `<circle r="${r2(Rbi + 1)}" fill="${M[1]}" stroke="${M[4]}" stroke-width="0.5"/>`;
  } else if (t === 'coin' || t === 'sliderule') {
    s += `<circle r="${r2(Rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/>`;
    s += `<circle r="${r2(Rb - 2.4)}" fill="none" stroke="${M[4]}" stroke-width="4.4" stroke-dasharray="${t === 'sliderule' ? '2.6 2.4' : '1 1.5'}" opacity="0.6"/>`;
  } else if (t === 'stepped') {
    s += `<circle r="${r2(Rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/><circle r="${r2((Rb + Rbi) / 2)}" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.6"/>`;
  } else if (t !== 'none') {
    s += `<circle r="${r2(Rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/>`;
    s += `<circle r="${r2(Rb - 1.5)}" fill="none" stroke="${M[0]}" stroke-width="1" opacity="0.6"/>`;
  }
  // rehaut
  s += `<circle r="${r2(g.Rd + 2.6)}" fill="#0b0b0c" opacity="0.8"/>`;
  return s + '</g>';
}
function screw(x, y, r, M, rot) { return `<g transform="translate(${r2(x)},${r2(y)}) rotate(${rot || 0})"><circle r="${r}" fill="${M[1]}" stroke="${M[4]}" stroke-width="0.6"/><line x1="${-r + 0.6}" x2="${r - 0.6}" y1="0" y2="0" stroke="${M[4]}" stroke-width="0.9"/></g>`; }

/* ---------- dial ---------- */
function dial(c, g, id, M, out) {
  const d = c.dial, Rd = g.Rd, E = g.E, R = g.R, round = g.dialShape === 'round';
  const ink = d.ink || '#1c1c1c';
  const lume = LUME[d.lume] || null, lc = d.lumeColor || (lume ? lume.c : null), lg = d.glow != null ? d.glow : (lume ? lume.glow : 0);
  const AM = d.applied ? (METAL[d.applied] || METAL.steel) : null;
  let s = `<g class="w-dial" clip-path="url(#${id}dc)">`, glow = '';
  const dp = dialPath(c, g);
  s += `<path d="${dp}" fill="${d.color}"/>`;
  const fin = d.finish;
  if (fin === 'sunburst') {
    let w = ''; for (let i = 0; i < 6; i++) { const a = i * 60 + 18; w += `<path d="M0,0L${pt(P(Rd * 1.5, a - 9))}L${pt(P(Rd * 1.5, a + 9))}Z" fill="#fff" opacity="${i % 2 ? 0.2 : 0.11}"/>`; }
    s += `<g filter="url(#${id}bz)">${w}</g>`;
  } else if (fin === 'tapisserie') {
    let w = ''; const st = Rd / 9.5;
    for (let x = -Rd; x < Rd; x += st) w += `M${r2(x)},${r2(-Rd)}V${r2(Rd)}M${r2(-Rd)},${r2(x)}H${r2(Rd)}`;
    s += `<path d="${w}" stroke="#000" stroke-width="1.5" opacity="0.32"/><path d="${w}" stroke="#fff" stroke-width="0.5" opacity="0.14" transform="translate(1,1)"/>`;
  } else if (fin === 'linen') {
    let w = ''; for (let x = -Rd; x < Rd; x += 2.4) w += `M${r2(x)},${r2(-Rd)}V${r2(Rd)}M${r2(-Rd)},${r2(x)}H${r2(Rd)}`;
    s += `<path d="${w}" stroke="#000" stroke-width="0.5" opacity="0.14"/>`;
  } else if (fin === 'sector') {
    s += `<circle r="${r2(Rd * 0.62)}" fill="none" stroke="${ink}" stroke-width="0.9"/><circle r="${r2(Rd * 0.86)}" fill="none" stroke="${ink}" stroke-width="0.9"/>`;
    for (let i = 0; i < 12; i++) { const p1 = P(Rd * 0.62, i * 30), p2 = P(Rd * 0.86, i * 30); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${ink}" stroke-width="0.9"/>`; }
    if (d.color2) s += `<circle r="${r2(Rd * 0.74)}" fill="none" stroke="${d.color2}" stroke-width="${r2(Rd * 0.24)}" opacity="0.5"/>`;
  } else if (fin === 'tropical') {
    const rnd = rng(d.seed || 3); let w = '';
    for (let i = 0; i < 9; i++) { const p = P(Rd * (0.2 + rnd() * 0.75), rnd() * 360); w += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(Rd * (0.2 + rnd() * 0.3))}" fill="${i % 2 ? '#7a4a22' : '#3a2412'}" opacity="0.3"/>`; }
    s += `<g filter="url(#${id}bz)">${w}</g>`;
  } else if (fin === 'enamel') {
    s += `<ellipse cx="${r2(-Rd * 0.3)}" cy="${r2(-Rd * 0.42)}" rx="${r2(Rd * 0.5)}" ry="${r2(Rd * 0.26)}" fill="#fff" opacity="0.35" filter="url(#${id}bz)"/>`;
  } else if (fin === 'guilloche') {
    let w = ''; for (let i = 0; i < 36; i++) { w += `<circle cx="${pt(P(Rd * 0.28, i * 10)).split(',')[0]}" cy="${pt(P(Rd * 0.28, i * 10)).split(',')[1]}" r="${r2(Rd * 0.3)}"/>`; }
    s += `<g fill="none" stroke="#000" stroke-width="0.45" opacity="0.2">${w}</g>`;
  }
  if (d.ring) s += `<circle r="${r2(Rd * (d.ring.r || 0.86))}" fill="none" stroke="${d.ring.c}" stroke-width="${r2(Rd * (d.ring.w || 0.26))}"/>`;
  s += `<path d="${dp}" fill="url(#${id}ds)"/>`;

  // which hour positions are occupied
  const skip = {};
  (d.sub || []).forEach(sb => { if (sb.pos) skip[sb.pos === 12 ? 12 : sb.pos] = 1; });
  if (d.date && Number.isInteger(d.date.pos)) skip[d.date.pos] = 1;

  /* minute track */
  const tr = d.track, tin = d.trackInk || ink, to = d.trackAt != null ? d.trackAt : 0.985;
  const tick = (a, t1, t2, w, col) => { const p1 = E(a, t1), p2 = E(a, t2); return `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${col || tin}" stroke-width="${w}"/>`; };
  if (tr === 'ticks' || tr === 'fine' || tr === 'railroad' || tr === 'chapter') {
    let w = '';
    if (tr === 'railroad' || tr === 'chapter') {
      if (round) w += `<circle r="${r2(Rd * to)}" fill="none" stroke="${tin}" stroke-width="0.8"/><circle r="${r2(Rd * (to - 0.065))}" fill="none" stroke="${tin}" stroke-width="0.8"/>`;
      else w += `<path d="${rrect(g.hw * to, g.hh * to, 2)}" fill="none" stroke="${tin}" stroke-width="0.8"/><path d="${rrect(g.hw * (to - 0.09), g.hh * (to - 0.07), 2)}" fill="none" stroke="${tin}" stroke-width="0.8"/>`;
      for (let m = 0; m < 60; m++) w += tick(m * 6, to - (round ? 0.065 : 0.08), to, m % 5 ? 0.8 : 2);
    } else {
      for (let m = 0; m < 60; m++) w += tick(m * 6, to - (m % 5 ? 0.045 : 0.08), to, m % 5 ? 0.8 : 1.5);
      if (tr === 'fine' && round) for (let m = 0; m < 300; m++) if (m % 5) w += tick(m * 1.2, to - 0.025, to, 0.45);
    }
    s += `<g class="w-track">${w}</g>`;
  } else if (tr === 'dots') {
    for (let m = 0; m < 60; m++) { const p = E(m * 6, to - 0.03); s += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${m % 5 ? 0.9 : 1.7}" fill="${tin}"/>`; }
  }

  /* indices */
  const it = d.indices, nf = FONT[d.numFont || 'sans'], nw = d.numWeight || 500;
  const num = (a, txt, t, sz, col, rot, extra) => { const p = E(a, t); return `<text x="${r2(p[0])}" y="${r2(p[1])}" ${rot != null ? `transform="rotate(${rot} ${r2(p[0])} ${r2(p[1])})"` : ''} font-family="${nf}" font-weight="${nw}" ${d.numItalic ? 'font-style="italic"' : ''} font-size="${r2(sz)}" fill="${col || ink}" text-anchor="middle" dominant-baseline="central" ${extra || ''}>${txt}</text>`; };
  const lumeEl = (shape) => { if (lc) { s += shape.replace('#L#', lc).replace('<', '<').replace('class="', 'class="w-lume '); if (lg > 0) glow += shape.replace('#L#', '#a8ff8e').replace(/<(\w+) /, `<$1 opacity="${lg}" `); } };
  const barIdx = (a, t1, t2, w, opts) => {
    opts = opts || {}; const p1 = E(a, t1), p2 = E(a, t2), mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const tf = `transform="translate(${r2(mx)},${r2(my)}) rotate(${a})"`;
    if (AM) {
      s += `<rect x="${r2(-w / 2)}" y="${r2(-len / 2)}" width="${r2(w)}" height="${r2(len)}" ${tf} fill="${AM[1]}" stroke="${AM[4]}" stroke-width="0.5"/><rect x="${r2(-w / 2)}" y="${r2(-len / 2)}" width="${r2(w / 2)}" height="${r2(len)}" ${tf} fill="${AM[0]}"/>`;
      if (lc && !opts.nolume) lumeEl(`<rect class="" x="${r2(-w / 2 + 1.1)}" y="${r2(-len / 2 + 1.1)}" width="${r2(w - 2.2)}" height="${r2(len - 2.2)}" ${tf} fill="#L#"/>`);
    } else if (lc && !opts.nolume) lumeEl(`<rect class="" x="${r2(-w / 2)}" y="${r2(-len / 2)}" width="${r2(w)}" height="${r2(len)}" ${tf} fill="#L#"/>`);
    else s += `<rect x="${r2(-w / 2)}" y="${r2(-len / 2)}" width="${r2(w)}" height="${r2(len)}" ${tf} fill="${ink}"/>`;
  };
  const dotIdx = (a, t, r) => { const p = E(a, t); if (AM) s += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(r + 1.2)}" fill="${AM[1]}" stroke="${AM[4]}" stroke-width="0.4"/>`; if (lc) lumeEl(`<circle class="" cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(r)}" fill="#L#"/>`); else s += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(r)}" fill="${ink}"/>`; };
  const triIdx = (a, t1, t2, w, inward) => { const b = E(a, inward ? t2 : t1), tip = E(a, inward ? t1 : t2); const nx = Math.cos(rad(a)) * w / 2, ny = Math.sin(rad(a)) * w / 2; const dd = `M${r2(b[0] - nx)},${r2(b[1] - ny)}L${r2(b[0] + nx)},${r2(b[1] + ny)}L${r2(tip[0])},${r2(tip[1])}Z`; if (AM) { s += `<path d="${dd}" fill="${AM[1]}" stroke="${AM[4]}" stroke-width="0.5" stroke-linejoin="round"/>`; if (lc) lumeEl(`<path class="" d="${dd}" fill="#L#" transform="translate(${r2((b[0] + tip[0]) / 2 * 0.0)},0) scale(1)" opacity="0.0"/>`); } else if (lc) lumeEl(`<path class="" d="${dd}" fill="#L#"/>`); else s += `<path d="${dd}" fill="${ink}"/>`; };
  const ROM = ['', 'I', 'II', 'III', d.iv ? 'IV' : 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const ns = Rd * (d.numSize || 0.2), nt = d.numAt || 0.72;
  const pip = (a) => { if (d.pips) { const p = E(a, 0.9); if (lc) lumeEl(`<circle class="" cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(Rd * 0.028)}" fill="#L#"/>`); } };
  for (let i = 1; i <= 12; i++) {
    const a = i * 30; if (skip[i]) { continue; }
    switch (it) {
      case 'baton': barIdx(a, d.idxIn || 0.74, d.idxOut || 0.92, Rd * (d.idxW || 0.05)); if (i === 12 && d.double !== false) { /* double at 12 */ const off = Rd * 0.035; s += ''; } break;
      case 'stick': s += tick(a, 0.76, 0.93, 1.6, ink); break;
      case 'dot': dotIdx(a, 0.84, Rd * (d.idxW || 0.045)); break;
      case 'dagger': triIdx(a, d.idxIn || 0.66, 0.92, Rd * 0.085, true); break;
      case 'sub':
        if (i === 12) triIdx(a, 0.7, 0.93, Rd * 0.2, true);
        else if (i % 3 === 0) barIdx(a, 0.72, 0.93, Rd * 0.085);
        else dotIdx(a, 0.83, Rd * 0.068);
        break;
      case 'arabic': {
        const only = d.nums; if (!only || only.indexOf(i) >= 0) { s += num(a, i, nt, ns, d.numInk); pip(a); if (d.numLume && lc && lg > 0) glow += num(a, i, nt, ns, '#a8ff8e', null, `opacity="${lg}"`); }
        else if (d.rest === 'dot') dotIdx(a, 0.84, Rd * 0.04); else if (d.rest === 'dagger') triIdx(a, 0.68, 0.92, Rd * 0.08, true); else barIdx(a, 0.74, 0.92, Rd * (d.idxW || 0.045));
        break;
      }
      case 'breguet': s += num(a, i, nt, ns * 1.1, d.numInk); break;
      case 'roman': { const only = d.nums; if (!only || only.indexOf(i) >= 0) s += num(a, ROM[i], nt, ns, d.numInk, a, 'letter-spacing="-0.5"'); else barIdx(a, 0.74, 0.92, Rd * 0.04); break; }
      case 'explorer':
        if (i === 12) triIdx(a, 0.68, 0.93, Rd * 0.2, true);
        else if (i % 3 === 0) { s += num(a, i, 0.74, ns * 1.15, lc || ink); if (lc && lg > 0) glow += num(a, i, 0.74, ns * 1.15, '#a8ff8e', null, `opacity="${lg}"`); }
        else barIdx(a, 0.72, 0.93, Rd * 0.06);
        break;
      case 'california':
        if (i === 12) triIdx(a, 0.66, 0.92, Rd * 0.2, true);
        else if (i % 3 === 0) barIdx(a, 0.68, 0.92, Rd * 0.07);
        else if (i > 9 || i < 3) s += num(a, ROM[i].replace('IIII', 'IV'), 0.74, ns * 1.05, lc || ink, a);
        else s += num(a, i, 0.74, ns * 1.1, lc || ink);
        break;
      case 'flieger-a':
        if (i === 12) { triIdx(a, 0.66, 0.9, Rd * 0.2, true); [-1, 1].forEach(k => { const p = E(a + k * 9, 0.86); lumeEl(`<circle class="" cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(Rd * 0.03)}" fill="#L#"/>`); }); }
        else { s += num(a, i, 0.7, ns * 1.05, lc || ink); if (lc && lg > 0) glow += num(a, i, 0.7, ns * 1.05, '#a8ff8e', null, `opacity="${lg}"`); }
        break;
      case 'flieger-b':
        if (i === 12) triIdx(a, 0.76, 0.94, Rd * 0.14, true); else s += num(a, i * 5, 0.8, ns * 0.86, lc || ink);
        s += num(a, i, 0.46, ns * 0.6, lc || ink);
        break;
      case 'trench': { const col = i === 12 && d.red12 ? '#b3261e' : (lc || ink); s += num(a, i, nt, ns * 1.15, col, null, `stroke="${ink}" stroke-width="0.7" paint-order="stroke"`); if (lc && lg > 0) glow += num(a, i, nt, ns * 1.15, '#a8ff8e', null, `opacity="${lg}"`); break; }
      case 'www': s += num(a, i, 0.7, ns, d.numInk || ink); pip(a); break;
      case 'none': case '24h': break;
      default: barIdx(a, 0.74, 0.92, Rd * 0.05);
    }
    if (it === 'baton' && i === 12 && d.double !== false && !AM) { /* nothing */ }
  }
  if (it === '24h') {
    for (let h = 1; h <= 24; h++) { const a = h * 15; if (h % 2 === 0) s += num(a, h, 0.76, ns * 0.78, d.numInk); else s += tick(a, 0.7, 0.82, 1.6, ink); pip(a); }
  }
  if (it === 'flieger-b') s += `<circle r="${r2(Rd * 0.6)}" fill="none" stroke="${lc || ink}" stroke-width="1"/>`;
  if (d.crosshair) s += `<line x1="${r2(-Rd * 0.68)}" x2="${r2(Rd * 0.68)}" y1="0" y2="0" stroke="${ink}" stroke-width="0.5" opacity="0.7"/><line y1="${r2(-Rd * 0.68)}" y2="${r2(Rd * 0.68)}" x1="0" x2="0" stroke="${ink}" stroke-width="0.5" opacity="0.7"/>`;
  if (d.inner) { // internal rotating bezel ring (compressor)
    const ri = Rd * 0.98, w = Rd * 0.15, rm = ri - w / 2;
    s += `<g class="w-bezel-rot"><circle r="${r2(rm)}" fill="none" stroke="${d.inner.color || '#0e0e10'}" stroke-width="${r2(w)}"/>`;
    const ic = d.inner.ink || '#e9e6dc';
    for (let m = 0; m < 60; m++) { const a = m * 6; if (m === 0) { const p = P(rm, 0); s += `<path d="M${r2(-w * 0.34)},${r2(p[1] - w * 0.32)}L${r2(w * 0.34)},${r2(p[1] - w * 0.32)}L0,${r2(p[1] + w * 0.34)}Z" fill="${d.inner.tri || '#d0342c'}"/>`; } else if (m % 10 === 0) { const p = P(rm, a); s += `<text x="${r2(p[0])}" y="${r2(p[1])}" transform="rotate(${a} ${r2(p[0])} ${r2(p[1])})" font-family="${FONT.sans}" font-weight="500" font-size="${r2(w * 0.62)}" fill="${ic}" text-anchor="middle" dominant-baseline="central">${m}</text>`; } else { const p1 = P(rm - w * (m % 5 ? 0.14 : 0.3), a), p2 = P(rm + w * (m % 5 ? 0.14 : 0.3), a); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${ic}" stroke-width="${m % 5 ? 0.8 : 1.8}"/>`; } }
    s += `</g><circle r="${r2(ri - w)}" fill="none" stroke="#000" stroke-width="1" opacity="0.6"/>`;
  }
  if (d.sliderule) { // navitimer-style scale ring
    const ri = Rd * 0.99, w = Rd * 0.13; s += `<circle r="${r2(ri - w / 2)}" fill="none" stroke="${d.sliderule}" stroke-width="${r2(w)}"/>`;
    for (let i = 0; i < 120; i++) { const p1 = P(ri - w, i * 3), p2 = P(ri - w * (i % 5 ? 0.72 : 0.5), i * 3); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="#111" stroke-width="0.5"/>`; }
    for (let i = 0; i < 12; i++) { const p = P(ri - w * 0.32, i * 30 + 15); s += `<text x="${r2(p[0])}" y="${r2(p[1])}" transform="rotate(${i * 30 + 15} ${r2(p[0])} ${r2(p[1])})" font-family="${FONT.sans}" font-size="${r2(w * 0.5)}" fill="#111" text-anchor="middle" dominant-baseline="central">${[10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 70, 90][i]}</text>`; }
  }

  /* sub-dials */
  let subHands = '';
  (d.sub || []).forEach((sb, k) => {
    const a = (sb.pos || 6) * 30, cp = E(a, sb.at != null ? sb.at : 0.5), rs = Rd * (sb.r || 0.26), col = sb.color || null, sink = sb.ink || ink;
    s += `<g transform="translate(${r2(cp[0])},${r2(cp[1])})">`;
    s += `<circle r="${r2(rs)}" fill="${col || d.color}"/>`;
    if (sb.azur !== false) { for (let q = 1; q <= 7; q++) s += `<circle r="${r2(rs * q / 8)}" fill="none" stroke="${col && /^#f|^#e|^#d/.test(col) ? '#000' : (/^#f|^#e|^#d/.test(d.color) && !col ? '#000' : '#fff')}" stroke-width="0.4" opacity="0.16"/>`; }
    if (!col) s += `<circle r="${r2(rs)}" fill="none" stroke="${sink}" stroke-width="0.5" opacity="0.5"/>`;
    const n = sb.type === '12h' ? 12 : sb.type === '30min' ? 30 : sb.type === '24h' ? 24 : 60;
    const step = n === 60 ? 5 : n === 30 ? 1 : 1, cnt = sb.plain ? 0 : (n === 60 ? 12 : n);
    if (sb.plain) s += `<circle r="${r2(rs * 0.9)}" fill="none" stroke="${sink}" stroke-width="0.5" opacity="0.35"/>`;
    for (let q = 0; q < cnt; q++) { const big = n === 60 ? q % 3 === 0 : n === 30 ? q % 5 === 0 : q % 3 === 0; const p1 = P(rs * (big ? 0.76 : 0.85), q * 360 / cnt), p2 = P(rs * 0.96, q * 360 / cnt); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${sink}" stroke-width="${big ? 1.1 : 0.6}"/>`; }
    if (sb.nums !== false && !sb.plain) { const lab = n === 60 ? ['60', '20', '40'] : n === 30 ? ['30', '10', '20'] : n === 12 ? ['12', '4', '8'] : ['24', '8', '16']; lab.forEach((t, q) => { const p = P(rs * 0.56, q * 120); s += `<text x="${r2(p[0])}" y="${r2(p[1])}" font-family="${FONT.sans}" font-size="${r2(rs * 0.3)}" fill="${sink}" text-anchor="middle" dominant-baseline="central">${t}</text>`; }); }
    s += `</g>`;
    const cls = sb.type === 'seconds' || !sb.type ? 'w-ss' : 'w-sx';
    const ang = sb.type === 'seconds' || !sb.type ? 'S' : (sb.rot || 0);
    subHands += `<g transform="translate(${r2(cp[0])},${r2(cp[1])})"><g class="${cls}" transform="rotate(${ang === 'S' ? (c.time[2] || 0) * 6 : ang})"><path d="M-0.9,${r2(rs * 0.25)}L-0.6,${r2(-rs * 0.82)}L0.6,${r2(-rs * 0.82)}L0.9,${r2(rs * 0.25)}Z" fill="${sb.hand || HANDCOL[c.hands.color] || c.hands.color}" ${c.hands.color === 'blued' && !sb.hand ? `fill="url(#${id}bl)"` : ''}/></g><circle r="${r2(Math.max(1.6, rs * 0.09))}" fill="${sb.hand || HANDCOL[c.hands.color] || c.hands.color}"/></g>`;
  });

  /* date */
  if (d.date) {
    const dt = d.date, a = dt.pos * 30, cp = E(a, dt.at || 0.7), wd = Rd * (dt.day ? 0.36 : 0.19), hd = Rd * 0.135;
    const cx = dt.day ? cp[0] - wd * 0.2 : cp[0];
    s += `<g transform="translate(${r2(cx)},${r2(cp[1])})"><rect x="${r2(-wd / 2 - 1)}" y="${r2(-hd / 2 - 1)}" width="${r2(wd + 2)}" height="${r2(hd + 2)}" rx="1" fill="${dt.frame ? (AM ? AM[1] : '#ccc') : '#000'}" opacity="${dt.frame ? 1 : 0.5}"/><rect x="${r2(-wd / 2)}" y="${r2(-hd / 2)}" width="${r2(wd)}" height="${r2(hd)}" fill="${dt.bg || '#f4f1e8'}"/>`;
    s += `<text x="${dt.day ? r2(wd * 0.26) : 0}" y="0.4" font-family="${FONT.sans}" font-weight="500" font-size="${r2(hd * 0.86)}" fill="${dt.ink || '#111'}" text-anchor="middle" dominant-baseline="central">${dt.n || 28}</text>`;
    if (dt.day) s += `<text x="${r2(-wd * 0.2)}" y="0.4" font-family="${FONT.sans}" font-weight="500" font-size="${r2(hd * 0.66)}" fill="${dt.ink || '#111'}" text-anchor="middle" dominant-baseline="central">${dt.day}</text><line x1="${r2(wd * 0.06)}" x2="${r2(wd * 0.06)}" y1="${r2(-hd / 2)}" y2="${r2(hd / 2)}" stroke="#999" stroke-width="0.5"/>`;
    s += `</g>`;
  }

  /* text */
  (d.text || []).forEach(t => {
    const fam = FONT[t.f || 'sans'], y = (g.dialShape === 'round' ? Rd : g.hh) * t.y;
    s += `<text x="${r2((t.x || 0) * Rd)}" y="${r2(y)}" font-family="${fam}" font-size="${t.s || 7}" font-weight="${t.w || 500}" ${t.i ? 'font-style="italic"' : ''} letter-spacing="${t.ls != null ? t.ls : 0.8}" fill="${t.c || ink}" text-anchor="middle" dominant-baseline="central" ${t.o != null ? `opacity="${t.o}"` : ''} ${t.sk ? `transform="skewX(${t.sk})"` : ''}>${esc(t.t)}</text>`;
  });
  if (d.logo) s += logo(d.logo, Rd, ink, d.logoY);
  if (d.arc) s += `<text font-family="${FONT.sans}" font-size="${r2(d.arcSize || Rd * 0.048)}" font-weight="500" letter-spacing="0.9" fill="${d.arcInk || ink}" text-anchor="middle"><textPath href="#${id}arc" startOffset="50%">${esc(d.arc)}</textPath></text>`;

  /* patina & damage */
  const w = c.wear || {};
  if (w.spots) { const rnd = rng(w.seed || 21); let q = ''; for (let i = 0; i < w.spots; i++) { const p = E(rnd() * 360, 0.15 + rnd() * 0.82); q += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(0.5 + rnd() * 1.6)}" fill="${w.spotColor || '#6b4a22'}" opacity="${r2(0.25 + rnd() * 0.4)}"/>`; } s += q; }
  if (w.cracks) { const rnd = rng(w.seed || 9); for (let i = 0; i < w.cracks; i++) { let a = rnd() * 360, t = 0.2 + rnd() * 0.3, p = E(a, t), q = `M${pt(p)}`; for (let k = 0; k < 5; k++) { a += rnd() * 16 - 8; t += 0.14; p = E(a, Math.min(t, 1)); q += `L${pt(p)}`; } s += `<path d="${q}" fill="none" stroke="#3a3328" stroke-width="0.45" opacity="0.7"/>`; } }
  if (w.moist) s += `<circle r="${r2(Rd * 0.93)}" fill="none" stroke="#5a4020" stroke-width="${r2(Rd * 0.14)}" opacity="${w.moist}" filter="url(#${id}bz)"/>`;
  if (w.burn) s += `<circle r="${r2(Rd * 0.5)}" fill="none" stroke="#5a3a14" stroke-width="${r2(Rd * 0.2)}" opacity="${w.burn}" filter="url(#${id}bz)"/>`;

  s += '</g>';
  out.subHands = subHands; out.glow = glow;
  return s;
}

function logo(kind, Rd, ink, y) {
  const yy = (y != null ? y : -0.34) * Rd;
  if (kind === 'broadarrow') return `<path d="M0,${r2(yy - 5.5)}V${r2(yy + 5)}M0,${r2(yy - 5.5)}L-4.4,${r2(yy + 1.5)}M0,${r2(yy - 5.5)}L4.4,${r2(yy + 1.5)}" stroke="${ink}" stroke-width="1.5" fill="none" stroke-linecap="square"/>`;
  if (kind === 'spiral') { let d = ''; for (let i = 0; i <= 60; i++) { const a = i * 18, r = 0.4 + i * 0.075; const p = P(r, a); d += (i ? 'L' : 'M') + r2(p[0]) + ',' + r2(p[1] + yy); } return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="0.7"/>`; }
  if (kind === 'star') return `<path d="${poly(5, 4.5, 0)}" transform="translate(0,${r2(yy)})" fill="${ink}"/>`;
  if (kind === 'circleT') return `<g transform="translate(0,${r2(yy)})"><circle r="4.6" fill="none" stroke="${ink}" stroke-width="0.9"/><text font-family="${FONT.sans}" font-size="7" font-weight="600" fill="${ink}" text-anchor="middle" dominant-baseline="central" y="0.5">T</text></g>`;
  return '';
}

/* ---------- hands ---------- */
function handShape(style, L, w, which) {
  // returns {d, lume, ring} pointing to -y
  const t = L * 0.16; // tail
  switch (style) {
    case 'sword': return { d: `M${-w * 0.4},${t}L${-w},${-L * 0.6}L0,${-L}L${w},${-L * 0.6}L${w * 0.4},${t}Z`, lume: `M${-w * 0.5},${-L * 0.22}L${-w * 0.62},${-L * 0.6}L0,${-L * 0.86}L${w * 0.62},${-L * 0.6}L${w * 0.5},${-L * 0.22}Z` };
    case 'dauphine': return { d: `M0,${t}L${-w * 1.15},0L0,${-L}L${w * 1.15},0Z`, facet: `M0,${t}L${w * 1.15},0L0,${-L}Z` };
    case 'leaf': return { d: `M0,${t * 0.9}C${-w * 1.25},${-L * 0.2} ${-w * 1.05},${-L * 0.66} 0,${-L}C${w * 1.05},${-L * 0.66} ${w * 1.25},${-L * 0.2} 0,${t * 0.9}Z` };
    case 'breguet': return { d: `M${-w * 0.42},${t}L${-w * 0.42},${-L * 0.62}L${w * 0.42},${-L * 0.62}L${w * 0.42},${t}ZM${-w * 0.5},${-L * 0.84}L0,${-L}L${w * 0.5},${-L * 0.84}Z`, ring: [0, -L * 0.73, L * 0.105, w * 0.7] };
    case 'spade': return { d: `M${-w * 0.42},${t}L${-w * 0.42},${-L * 0.66}C${-w * 3},${-L * 0.66} ${-w * 2},${-L * 0.88} 0,${-L}C${w * 2},${-L * 0.88} ${w * 3},${-L * 0.66} ${w * 0.42},${-L * 0.66}L${w * 0.42},${t}Z` };
    case 'cathedral': if (which === 'h') return { d: `M${-w * 0.5},${t}L${-w * 0.5},${-L * 0.38}C${-w * 2.6},${-L * 0.42} ${-w * 2.4},${-L * 0.8} 0,${-L}C${w * 2.4},${-L * 0.8} ${w * 2.6},${-L * 0.42} ${w * 0.5},${-L * 0.38}L${w * 0.5},${t}Z`, lume: `M0,${-L * 0.44}C${-w * 1.6},${-L * 0.5} ${-w * 1.5},${-L * 0.74} 0,${-L * 0.9}C${w * 1.5},${-L * 0.74} ${w * 1.6},${-L * 0.5} 0,${-L * 0.44}Z` };
      return { d: `M${-w * 0.5},${t}L${-w * 0.5},${-L * 0.3}L${-w * 1.05},${-L * 0.36}L${-w * 0.9},${-L * 0.8}L0,${-L}L${w * 0.9},${-L * 0.8}L${w * 1.05},${-L * 0.36}L${w * 0.5},${-L * 0.3}L${w * 0.5},${t}Z`, lume: `M${-w * 0.55},${-L * 0.4}L${-w * 0.45},${-L * 0.78}L0,${-L * 0.9}L${w * 0.45},${-L * 0.78}L${w * 0.55},${-L * 0.4}Z` };
    case 'mercedes': if (which === 'h') return { d: `M${-w * 0.5},${t}L${-w * 0.5},${-L * 0.48}L${w * 0.5},${-L * 0.48}L${w * 0.5},${t}ZM${-w * 0.55},${-L * 0.82}L0,${-L}L${w * 0.55},${-L * 0.82}Z`, disc: [0, -L * 0.66, L * 0.19], lume: `M${-w * 0.3},${-L * 0.12}L${-w * 0.3},${-L * 0.44}L${w * 0.3},${-L * 0.44}L${w * 0.3},${-L * 0.12}Z` };
      return { d: `M${-w * 0.62},${t}L${-w * 0.62},${-L * 0.88}L0,${-L}L${w * 0.62},${-L * 0.88}L${w * 0.62},${t}Z`, lume: `M${-w * 0.36},${-L * 0.2}L${-w * 0.36},${-L * 0.86}L0,${-L * 0.94}L${w * 0.36},${-L * 0.86}L${w * 0.36},${-L * 0.2}Z` };
    case 'syringe': return { d: `M${-w * 0.3},${t}L${-w * 0.3},${-L * 0.3}L${-w * 0.85},${-L * 0.32}L${-w * 0.85},${-L * 0.78}L${-w * 0.16},${-L * 0.8}L0,${-L}L${w * 0.16},${-L * 0.8}L${w * 0.85},${-L * 0.78}L${w * 0.85},${-L * 0.32}L${w * 0.3},${-L * 0.3}L${w * 0.3},${t}Z`, lume: `M${-w * 0.5},${-L * 0.36}L${-w * 0.5},${-L * 0.75}L${w * 0.5},${-L * 0.75}L${w * 0.5},${-L * 0.36}Z` };
    case 'alpha': return { d: `M${-w * 0.3},${t}L${-w * 0.3},${-L * 0.06}L${-w * 1.5},${-L * 0.13}L0,${-L}L${w * 1.5},${-L * 0.13}L${w * 0.3},${-L * 0.06}L${w * 0.3},${t}Z`, lume: `M${-w * 0.7},${-L * 0.22}L0,${-L * 0.8}L${w * 0.7},${-L * 0.22}Z` };
    case 'arrow': if (which === 'h') return { d: `M${-w * 0.45},${t}L${-w * 0.45},${-L * 0.5}L${-w * 2.5},${-L * 0.46}L0,${-L}L${w * 2.5},${-L * 0.46}L${w * 0.45},${-L * 0.5}L${w * 0.45},${t}Z`, lume: `M${-w * 1.5},${-L * 0.52}L0,${-L * 0.86}L${w * 1.5},${-L * 0.52}Z` };
      return { d: `M${-w * 0.4},${t}L${-w * 0.85},${-L * 0.6}L0,${-L}L${w * 0.85},${-L * 0.6}L${w * 0.4},${t}Z`, lume: `M${-w * 0.45},${-L * 0.25}L${-w * 0.5},${-L * 0.6}L0,${-L * 0.86}L${w * 0.5},${-L * 0.6}L${w * 0.45},${-L * 0.25}Z` };
    case 'plongeur': if (which === 'h') return { d: `M${-w * 0.5},${t}L${-w * 0.5},${-L * 0.75}L0,${-L * 0.86}L${w * 0.5},${-L * 0.75}L${w * 0.5},${t}Z`, lume: `M${-w * 0.25},${-L * 0.3}L${-w * 0.25},${-L * 0.72}L${w * 0.25},${-L * 0.72}L${w * 0.25},${-L * 0.3}Z` };
      return { d: `M${-w * 0.7},${t}L${-w * 1.5},${-L * 0.2}L${-w * 1.5},${-L * 0.88}L0,${-L}L${w * 1.5},${-L * 0.88}L${w * 1.5},${-L * 0.2}L${w * 0.7},${t}Z`, lume: `M${-w * 0.9},${-L * 0.26}L${-w * 0.9},${-L * 0.85}L${w * 0.9},${-L * 0.85}L${w * 0.9},${-L * 0.26}Z` };
    case 'snowflake': if (which === 'h') return { d: `M${-w * 0.5},${t}L${-w * 0.5},${-L * 0.52}L${-w * 1.9},${-L * 0.7}L0,${-L}L${w * 1.9},${-L * 0.7}L${w * 0.5},${-L * 0.52}L${w * 0.5},${t}Z`, lume: `M0,${-L * 0.52}L${-w * 1.2},${-L * 0.71}L0,${-L * 0.9}L${w * 1.2},${-L * 0.71}Z` };
      return { d: `M${-w * 0.6},${t}L${-w * 0.6},${-L * 0.9}L0,${-L}L${w * 0.6},${-L * 0.9}L${w * 0.6},${t}Z`, lume: `M${-w * 0.34},${-L * 0.22}L${-w * 0.34},${-L * 0.88}L${w * 0.34},${-L * 0.88}L${w * 0.34},${-L * 0.22}Z` };
    case 'stick': return { d: `M${-w * 0.32},${t}L${-w * 0.32},${-L}L${w * 0.32},${-L}L${w * 0.32},${t}Z` };
    case 'pencil': return { d: `M${-w * 0.62},${t}L${-w * 0.62},${-L * 0.9}L0,${-L}L${w * 0.62},${-L * 0.9}L${w * 0.62},${t}Z`, lume: `M${-w * 0.34},${-L * 0.3}L${-w * 0.34},${-L * 0.88}L${w * 0.34},${-L * 0.88}L${w * 0.34},${-L * 0.3}Z` };
    default: /* baton */ return { d: `M${-w * 0.6},${t}L${-w * 0.6},${-L}L${w * 0.6},${-L}L${w * 0.6},${t}Z`, lume: `M${-w * 0.3},${-L * 0.3}L${-w * 0.3},${-L * 0.92}L${w * 0.3},${-L * 0.92}L${w * 0.3},${-L * 0.3}Z` };
  }
}

function angles(c) {
  const t = c.time || [10, 9, 36], h = t[0], m = t[1], s = t[2] || 0;
  return { h: c.h24 ? ((h + m / 60) / 24) * 360 : ((h % 12) + m / 60 + s / 3600) * 30, m: (m + s / 60) * 6, s: s * 6 };
}

function hands(c, g, id, out) {
  const hd = c.hands, Rd = g.dialShape === 'round' ? g.Rd : Math.min(g.hw, g.hh), A = angles(c);
  const col = HANDCOL[hd.color] || hd.color, fill = hd.color === 'blued' ? `url(#${id}bl)` : col;
  const lume = LUME[hd.lume] || null, lc = lume ? lume.c : null, lg = hd.glow != null ? hd.glow : (lume ? lume.glow : 0);
  const inner = c.dial.inner || c.dial.sliderule ? 0.86 : 1;
  const Lh = Rd * (hd.hLen || 0.52) * (inner < 1 ? 0.95 : 1), Lm = Rd * (hd.mLen || 0.8) * inner, w = Rd * (hd.w || 0.05);
  let s = `<g class="w-hands" filter="url(#${id}sh)">`, glow = '';
  s += out.subHands || '';
  const mk = (cls, ang, shp, f, st) => {
    let q = `<g class="${cls}" transform="rotate(${r2(ang)})">`;
    q += `<path d="${shp.d}" fill="${f}" stroke="${st || 'rgba(0,0,0,0.35)'}" stroke-width="0.45" stroke-linejoin="round"/>`;
    if (shp.facet) q += `<path d="${shp.facet}" fill="#000" opacity="0.22"/>`;
    if (shp.ring) q += `<circle cx="${shp.ring[0]}" cy="${r2(shp.ring[1])}" r="${r2(shp.ring[2])}" fill="none" stroke="${f}" stroke-width="${r2(shp.ring[3])}"/>`;
    if (shp.disc) { q += `<circle cx="0" cy="${r2(shp.disc[1])}" r="${r2(shp.disc[2])}" fill="${f}" stroke="rgba(0,0,0,0.35)" stroke-width="0.45"/>`; if (lc) { q += `<circle class="w-lume" cx="0" cy="${r2(shp.disc[1])}" r="${r2(shp.disc[2] * 0.76)}" fill="${lc}"/>`; [0, 120, 240].forEach(a => { const p = P(shp.disc[2] * 0.8, a); q += `<line x1="0" y1="${r2(shp.disc[1])}" x2="${r2(p[0])}" y2="${r2(shp.disc[1] + p[1])}" stroke="${f}" stroke-width="1.1"/>`; }); } }
    if (shp.lume && lc) q += `<path class="w-lume" d="${shp.lume}" fill="${lc}"/>`;
    q += '</g>';
    if (lc && lg > 0 && (shp.lume || shp.disc)) glow += `<g class="${cls}" transform="rotate(${r2(ang)})" opacity="${lg}">${shp.lume ? `<path d="${shp.lume}" fill="#a8ff8e"/>` : ''}${shp.disc ? `<circle cx="0" cy="${r2(shp.disc[1])}" r="${r2(shp.disc[2] * 0.76)}" fill="#a8ff8e"/>` : ''}</g>`;
    return q;
  };
  if (hd.gmt) {
    const gc = HANDCOL[hd.gmt.color] || hd.gmt.color || '#c8281e', L = Rd * 0.9 * inner, ga = hd.gmt.at != null ? hd.gmt.at * 15 : A.h / 2;
    s += `<g class="w-g" transform="rotate(${r2(ga)})"><path d="M-0.9,${r2(L * 0.12)}L-0.9,${r2(-L * 0.8)}L${r2(-L * 0.075)},${r2(-L * 0.8)}L0,${r2(-L)}L${r2(L * 0.075)},${r2(-L * 0.8)}L0.9,${r2(-L * 0.8)}L0.9,${r2(L * 0.12)}Z" fill="${gc}" stroke="rgba(0,0,0,0.3)" stroke-width="0.4"/>${lc ? `<path class="w-lume" d="M${r2(-L * 0.04)},${r2(-L * 0.83)}L0,${r2(-L * 0.95)}L${r2(L * 0.04)},${r2(-L * 0.83)}Z" fill="${lc}"/>` : ''}</g>`;
  }
  if (c.display) { return ''; }
  s += mk('w-h', A.h, handShape(hd.style, Lh, w * (hd.style === 'dauphine' || hd.style === 'leaf' ? 1.15 : 1.25), 'h'), fill);
  s += mk('w-m', A.m, handShape(hd.mStyle || hd.style, Lm, w, 'm'), hd.mColor ? (HANDCOL[hd.mColor] || hd.mColor) : fill);
  const sc = HANDCOL[hd.secColor] || hd.secColor || col, Ls = Rd * 0.88 * inner;
  if (hd.seconds === 'center' || hd.chrono) {
    const cls = hd.chrono ? 'w-cs' : 'w-s', ang = hd.chrono ? (hd.chronoAt || 0) : A.s;
    let q = `<g class="${cls}" transform="rotate(${r2(ang)})"><path d="M-0.7,${r2(Ls * 0.24)}L-0.45,${r2(-Ls)}L0.45,${r2(-Ls)}L0.7,${r2(Ls * 0.24)}Z" fill="${sc}"/>`;
    if (hd.secStyle === 'lollipop') { q += `<circle cx="0" cy="${r2(-Ls * 0.7)}" r="${r2(Rd * 0.04)}" fill="${sc}"/>`; if (lc) q += `<circle class="w-lume" cx="0" cy="${r2(-Ls * 0.7)}" r="${r2(Rd * 0.028)}" fill="${lc}"/>`; if (lc && lg > 0) glow += `<g class="${cls}" transform="rotate(${r2(ang)})" opacity="${lg}"><circle cx="0" cy="${r2(-Ls * 0.7)}" r="${r2(Rd * 0.028)}" fill="#a8ff8e"/></g>`; }
    else if (hd.secStyle === 'arrow') q += `<path d="M${r2(-Rd * 0.04)},${r2(-Ls * 0.72)}L0,${r2(-Ls * 0.9)}L${r2(Rd * 0.04)},${r2(-Ls * 0.72)}Z" fill="${sc}"/>`;
    else q += `<circle cx="0" cy="${r2(Ls * 0.2)}" r="${r2(Rd * 0.022)}" fill="${sc}"/>`;
    s += q + '</g>';
  }
  s += `<circle r="${r2(Rd * 0.042)}" fill="${hd.cap || (hd.color === 'blued' ? '#c9ced4' : col)}" stroke="rgba(0,0,0,0.4)" stroke-width="0.4"/><circle r="${r2(Rd * 0.014)}" fill="rgba(0,0,0,0.45)"/>`;
  out.handGlow = glow;
  return s + '</g>';
}

/* ---------- digital displays ---------- */
function display(c, g, id) {
  const d = c.display, hw = g.hw, hh = g.hh; let s = '';
  if (d.type === 'led') {
    s += `<path d="${rrect(hw, hh, 5)}" fill="#1a0306"/><path d="${rrect(hw, hh, 5)}" fill="url(#${id}ds)"/>`;
    s += `<text x="0" y="1" font-family="${FONT.mono}" font-weight="700" font-size="${r2(hh * 1.05)}" fill="#ff2a1a" text-anchor="middle" dominant-baseline="central" letter-spacing="2" filter="url(#${id}gw)" class="w-led">${esc(d.text || '10:09')}</text>`;
  } else {
    s += `<path d="${rrect(hw, hh, 4)}" fill="${d.bg || '#aab19c'}"/>`;
    s += `<text x="${r2(hw * 0.04)}" y="${r2(hh * 0.14)}" font-family="${FONT.mono}" font-weight="700" font-size="${r2(Math.min(hh * 1.02, hw * 2.9 / Math.max(4, (d.text || '10:09').length)))}" fill="#1b1f1a" text-anchor="middle" dominant-baseline="central" letter-spacing="1" opacity="0.9">${esc(d.text || '10:09')}</text>`;
    if (d.top) s += `<text x="0" y="${r2(-hh * 0.66)}" font-family="${FONT.sans}" font-weight="600" font-size="${r2(hh * 0.3)}" fill="#1b1f1a" text-anchor="middle" dominant-baseline="central" letter-spacing="1">${esc(d.top)}</text>`;
    s += `<path d="${rrect(hw, hh, 4)}" fill="url(#${id}ds)"/>`;
  }
  (d.labels || []).forEach(t => { s += `<text x="${r2(t.x * g.R)}" y="${r2(t.y * g.R)}" font-family="${FONT.sans}" font-weight="${t.w || 600}" font-size="${t.s || 6}" fill="${t.c || '#ddd'}" text-anchor="middle" dominant-baseline="central" letter-spacing="${t.ls || 0.8}">${esc(t.t)}</text>`; });
  return s;
}

/* ---------- crystal ---------- */
function crystal(c, g, id) {
  const Rd = g.Rd, R = g.R; let s = '<g class="w-crystal" pointer-events="none">';
  if (g.dialShape === 'round') {
    const k = c.crystal === 'flat' ? 0.6 : 1;
    s += `<circle r="${r2(Rd + 1)}" fill="url(#${id}gl)" opacity="${k}"/>`;
    s += `<path d="M${pt(P(Rd * 0.93, -72))}A${r2(Rd * 0.93)},${r2(Rd * 0.93)} 0 0 1 ${pt(P(Rd * 0.93, -8))}A${r2(Rd * 1.25)},${r2(Rd * 1.25)} 0 0 0 ${pt(P(Rd * 0.93, -72))}Z" fill="#fff" opacity="${0.13 * k}"/>`;
    if (c.crystal !== 'flat') s += `<circle r="${r2(Rd - 1)}" fill="none" stroke="#fff" stroke-width="2.2" opacity="0.09"/>`;
    if (c.dial.date && c.dial.date.cyclops) { const p = g.E(c.dial.date.pos * 30, c.dial.date.at || 0.7); s += `<rect x="${r2(p[0] - Rd * 0.15)}" y="${r2(p[1] - Rd * 0.11)}" width="${r2(Rd * 0.3)}" height="${r2(Rd * 0.22)}" rx="${r2(Rd * 0.06)}" fill="#fff" opacity="0.14" stroke="#fff" stroke-opacity="0.35" stroke-width="0.6"/>`; }
  } else {
    s += `<path d="${dialPath(c, g)}" fill="url(#${id}gl)"/>`;
    s += `<path d="M${r2(-g.hw)},${r2(-g.hh)}L${r2(g.hw * 0.2)},${r2(-g.hh)}L${r2(-g.hw)},${r2(g.hh * 0.3)}Z" fill="#fff" opacity="0.08"/>`;
  }
  const w = c.wear || {};
  if (w.scratches) { const rnd = rng(w.seed2 || 5); for (let i = 0; i < w.scratches; i++) { const a = rnd() * 360, p = g.E(a, rnd() * 0.8), l = 6 + rnd() * 22, d = rnd() * 180; s += `<line x1="${r2(p[0])}" y1="${r2(p[1])}" x2="${r2(p[0] + Math.cos(rad(d)) * l)}" y2="${r2(p[1] + Math.sin(rad(d)) * l)}" stroke="#fff" stroke-width="0.5" opacity="${r2(0.14 + rnd() * 0.2)}" clip-path="url(#${id}dc)"/>`; } }
  return s + '</g>';
}

/* ---------- case back, inside, movement ---------- */
function backPlate(c, g, id, M) {
  const R = g.R, b = c.back || {}, rb = R * 0.9; let s = '<g class="w-back">';
  s += `<circle r="${r2(rb)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="0.8"/>`;
  let rings = ''; for (let r = rb * 0.2; r < rb; r += 2.2) rings += `<circle r="${r2(r)}"/>`;
  s += `<g fill="none" stroke="${M[4]}" stroke-width="0.35" opacity="0.2">${rings}</g>`;
  if (b.type !== 'snap') for (let i = 0; i < 6; i++) { const p = P(rb * 0.9, i * 60 + 30); s += `<rect x="-4" y="-2.6" width="8" height="5.2" rx="1" transform="translate(${pt(p)}) rotate(${i * 60 + 30})" fill="${M[3]}" stroke="${M[4]}" stroke-width="0.5"/>`; }
  s += `<circle r="${r2(rb * 0.78)}" fill="none" stroke="${M[4]}" stroke-width="0.6" opacity="0.5"/>`;
  if (b.arcTop) s += `<path id="${id}bt" d="M${pt(P(rb * 0.62, -100))}A${r2(rb * 0.62)},${r2(rb * 0.62)} 0 0 1 ${pt(P(rb * 0.62, 100))}" fill="none"/><text font-family="${FONT.sans}" font-size="${b.arcSize || 8}" font-weight="500" letter-spacing="1.6" fill="${M[4]}" text-anchor="middle" opacity="0.85"><textPath href="#${id}bt" startOffset="50%">${esc(b.arcTop)}</textPath></text>`;
  if (b.arcBottom) s += `<path id="${id}bb" d="M${pt(P(rb * 0.7, 260))}A${r2(rb * 0.7)},${r2(rb * 0.7)} 0 0 0 ${pt(P(rb * 0.7, 100))}" fill="none"/><text font-family="${FONT.sans}" font-size="${b.arcSize || 8}" font-weight="500" letter-spacing="1.6" fill="${M[4]}" text-anchor="middle" opacity="0.85"><textPath href="#${id}bb" startOffset="50%">${esc(b.arcBottom)}</textPath></text>`;
  (b.lines || []).forEach(t => { s += `<text x="${r2((t.x || 0) * rb)}" y="${r2(t.y * rb)}" font-family="${FONT[t.f || 'sans']}" font-size="${t.s || 9}" font-weight="${t.w || 500}" letter-spacing="${t.ls != null ? t.ls : 1.2}" fill="${t.c || M[4]}" text-anchor="middle" dominant-baseline="central" opacity="${t.o || 0.85}" ${t.rot ? `transform="rotate(${t.rot} ${r2((t.x || 0) * rb)} ${r2(t.y * rb)})"` : ''}>${esc(t.t)}</text>`; });
  if (b.logo) s += logo(b.logo, rb, M[4], b.logoY != null ? b.logoY : -0.3);
  const w = c.wear || {};
  if (w.backScratches) { const rnd = rng(31); for (let i = 0; i < w.backScratches; i++) { const p = P(rnd() * rb * 0.85, rnd() * 360), l = 8 + rnd() * 30, d = rnd() * 180; s += `<line x1="${r2(p[0])}" y1="${r2(p[1])}" x2="${r2(p[0] + Math.cos(rad(d)) * l)}" y2="${r2(p[1] + Math.sin(rad(d)) * l)}" stroke="${rnd() > 0.5 ? M[0] : M[4]}" stroke-width="0.5" opacity="0.35"/>`; } }
  return s + '</g>';
}

function insideBack(c, g, id, M) {
  const R = g.R, b = c.inside || {}, rb = R * 0.9; let s = '<g class="w-inside">';
  s += `<circle r="${r2(rb)}" fill="${M[2]}" stroke="${M[4]}" stroke-width="1"/><circle r="${r2(rb * 0.93)}" fill="url(#${id}m)" stroke="${M[4]}" stroke-width="0.6"/>`;
  // perlage
  let pl = ''; const rnd = rng(77);
  for (let r = rb * 0.12; r < rb * 0.9; r += 7) { const n = Math.floor(2 * Math.PI * r / 7); for (let i = 0; i < n; i++) { const p = P(r, i * 360 / n + r); pl += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="4.2"/>`; } }
  s += `<g fill="none" stroke="${M[4]}" stroke-width="0.4" opacity="0.16">${pl}</g>`;
  (b.stamps || []).forEach(t => { s += `<text x="${r2((t.x || 0) * rb)}" y="${r2(t.y * rb)}" font-family="${FONT[t.f || 'sans']}" font-size="${t.s || 8}" font-weight="500" letter-spacing="${t.ls != null ? t.ls : 1.3}" fill="${M[4]}" text-anchor="middle" dominant-baseline="central" opacity="0.8">${esc(t.t)}</text>`; });
  if (b.logo === 'helmet') { const y = (b.logoY || -0.3) * rb; s += `<g transform="translate(0,${r2(y)})" fill="none" stroke="${M[4]}" stroke-width="1" opacity="0.8"><circle r="9"/><circle r="4.2"/><circle cx="-8" cy="0" r="2.2"/><circle cx="8" cy="0" r="2.2"/><path d="M-11,9Q0,15 11,9L13,14H-13Z"/></g>`; }
  (b.marks || []).forEach(t => { s += `<text x="${r2(t.x * rb)}" y="${r2(t.y * rb)}" font-family="${FONT.hand}" font-size="${t.s || 8.5}" fill="${t.c || M[4]}" opacity="${t.o || 0.72}" transform="rotate(${t.rot || 0} ${r2(t.x * rb)} ${r2(t.y * rb)})" text-anchor="${t.anchor || 'start'}" class="${t.cls || ''}">${esc(t.t)}</text>`; });
  return s + '</g>';
}

const MOVCOL = {
  rhodium: ['#f4f5f6', '#d5d8db', '#a4a9ae', '#6b7076', '#33373b'],
  gilt: ['#fbeebc', '#e0c06a', '#b08f3a', '#77601f', '#42340d'],
  rose: ['#fde5d6', '#e6b294', '#b88262', '#7c513a', '#4a2e20'],
  nickel: ['#eef0ea', '#cfd2c8', '#a0a396', '#696c60', '#383a33'],
  plain: ['#e6e8ea', '#c4c8cc', '#979ca1', '#62676c', '#2f3236']
};
function gearTeeth(r, n, depth) { let d = ''; for (let i = 0; i < n; i++) { const a0 = i * 360 / n, a1 = a0 + 180 / n; d += (i ? 'L' : 'M') + pt(P(r, a0)) + 'L' + pt(P(r, a1 - 360 / n * 0.12)) + 'L' + pt(P(r - depth, a1)) + 'L' + pt(P(r - depth, a1 + 180 / n - 360 / n * 0.12)); } return d + 'Z'; }
function jewel(x, y, r, chaton) { return `<g transform="translate(${r2(x)},${r2(y)})">${chaton ? `<circle r="${r2(r * 1.7)}" fill="#e3bd62" stroke="#7a5716" stroke-width="0.5"/>` : `<circle r="${r2(r * 1.35)}" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="0.6"/>`}<circle r="${r2(r)}" fill="#c2184b"/><circle r="${r2(r * 0.42)}" fill="#3a0616"/><circle cx="${r2(-r * 0.3)}" cy="${r2(-r * 0.35)}" r="${r2(r * 0.25)}" fill="#ffd0dc" opacity="0.8"/></g>`; }
function mscrew(x, y, r, rot, blue) { return `<g transform="translate(${r2(x)},${r2(y)}) rotate(${rot || 0})"><circle r="${r}" fill="${blue ? '#2b4a9a' : '#dfe3e7'}" stroke="rgba(0,0,0,0.55)" stroke-width="0.6"/><line x1="${r2(-r + 0.7)}" x2="${r2(r - 0.7)}" y1="0" y2="0" stroke="rgba(0,0,0,0.7)" stroke-width="0.9"/></g>`; }

function movement(c, g, id, M) {
  const R = g.R, mv = c.mov || {}, Rm = R * 0.84, C = MOVCOL[mv.finish || 'rhodium'] || MOVCOL.rhodium;
  const u = v => r2(v * Rm);
  let s = '<g class="w-mov">';
  s += `<defs><linearGradient id="${id}mv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C[0]}"/><stop offset="0.45" stop-color="${C[1]}"/><stop offset="1" stop-color="${C[2]}"/></linearGradient>
  <pattern id="${id}gs" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(${mv.stripeAngle != null ? mv.stripeAngle : 28})"><rect width="13" height="13" fill="${C[1]}"/><rect width="6.5" height="13" fill="${C[0]}" opacity="0.75"/><rect x="6.5" width="1" height="13" fill="${C[3]}" opacity="0.25"/></pattern>
  <clipPath id="${id}mc"><circle r="${r2(Rm)}"/></clipPath></defs>`;
  // case ring & threads
  s += `<circle r="${r2(R * 0.97)}" fill="url(#${id}b)" stroke="${M[4]}" stroke-width="1"/><circle r="${r2(R * 0.915)}" fill="none" stroke="${M[4]}" stroke-width="5" stroke-dasharray="0.7 1.3" opacity="0.45"/><circle r="${r2(Rm + 2.5)}" fill="#141516"/>`;
  s += `<g clip-path="url(#${id}mc)">`;
  // main plate with perlage
  s += `<circle r="${r2(Rm)}" fill="${C[2]}"/>`;
  let pl = ''; for (let r = Rm * 0.1; r < Rm; r += 6.5) { const n = Math.floor(2 * Math.PI * r / 6.5); for (let i = 0; i < n; i++) { const p = P(r, i * 360 / n + r * 3); pl += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="4"/>`; } }
  s += `<g fill="${C[1]}" fill-opacity="0.25" stroke="${C[4]}" stroke-width="0.35" stroke-opacity="0.3">${pl}</g>`;

  if (mv.type === 'quartz') {
    // circuit plate, coil, battery
    s += `<path d="M${u(-0.98)},${u(-0.2)}Q${u(-0.6)},${u(-0.98)} ${u(0.3)},${u(-0.96)}L${u(0.5)},${u(-0.3)}L${u(0.1)},${u(0.1)}L${u(-0.5)},${u(0.05)}Z" fill="#b9a26a" stroke="#5c4c22" stroke-width="0.7"/>`;
    s += `<path d="M${u(-0.6)},${u(-0.5)}h${u(0.5)}v${u(0.16)}h${u(-0.3)}M${u(-0.2)},${u(-0.7)}v${u(0.3)}M${u(0.1)},${u(-0.6)}h${u(0.2)}v${u(0.3)}" fill="none" stroke="#d9c58a" stroke-width="1.4"/>`;
    s += `<rect x="${u(-0.42)}" y="${u(-0.34)}" width="${u(0.22)}" height="${u(0.22)}" rx="1.5" fill="#15161a" stroke="#000" stroke-width="0.5"/><text x="${u(-0.31)}" y="${u(-0.23)}" font-family="${FONT.mono}" font-size="4" fill="#888" text-anchor="middle" dominant-baseline="central">IC</text>`;
    // quartz crystal can
    s += `<rect x="${u(-0.05)}" y="${u(-0.86)}" width="${u(0.14)}" height="${u(0.36)}" rx="${u(0.07)}" fill="url(#${id}h)" stroke="#444" stroke-width="0.6" class="w-xtal"/>`;
    // trimmer
    s += `<g transform="translate(${u(-0.66)},${u(-0.3)})"><circle r="${u(0.085)}" fill="#d8b24a" stroke="#6b5216" stroke-width="0.6"/><line x1="${u(-0.06)}" x2="${u(0.06)}" y1="0" y2="0" stroke="#4a380e" stroke-width="1.3" transform="rotate(35)"/></g>`;
    // coil
    s += `<g transform="translate(${u(0.52)},${u(0.2)}) rotate(62)"><rect x="${u(-0.34)}" y="${u(-0.1)}" width="${u(0.68)}" height="${u(0.2)}" rx="${u(0.08)}" fill="#b5561f" stroke="#5a260a" stroke-width="0.6"/>`;
    for (let i = 0; i < 26; i++) s += `<line x1="${u(-0.31 + i * 0.024)}" x2="${u(-0.31 + i * 0.024)}" y1="${u(-0.095)}" y2="${u(0.095)}" stroke="#e08a4a" stroke-width="0.5" opacity="0.8"/>`;
    s += `</g>`;
    // stepper & train bridge
    s += `<path d="M${u(0.05)},${u(0.2)}Q${u(0.35)},${u(0.5)} ${u(0.2)},${u(0.9)}L${u(-0.1)},${u(0.75)}Q${u(-0.05)},${u(0.4)} ${u(-0.2)},${u(0.25)}Z" fill="url(#${id}mv)" stroke="${C[4]}" stroke-width="0.7"/>`;
    s += jewel(u(0.06), u(0.38), u(0.035)) + jewel(u(0.08), u(0.62), u(0.03)) + mscrew(u(0.14), u(0.8), u(0.04), 30);
    // battery
    s += `<g class="w-batt" transform="translate(${u(-0.42)},${u(0.5)})"><circle r="${u(0.36)}" fill="url(#${id}b)" stroke="#333" stroke-width="0.8"/><circle r="${u(0.3)}" fill="none" stroke="#555" stroke-width="0.5" opacity="0.6"/><text y="${u(-0.08)}" font-family="${FONT.sans}" font-size="${u(0.14)}" font-weight="600" fill="#333" text-anchor="middle" dominant-baseline="central">+</text><text y="${u(0.1)}" font-family="${FONT.sans}" font-size="${u(0.075)}" fill="#333" text-anchor="middle" dominant-baseline="central" letter-spacing="0.8">${esc(mv.cell || 'SILVER OXIDE')}</text></g>`;
    s += `<path d="M${u(-0.75)},${u(0.3)}L${u(-0.42)},${u(0.42)}L${u(-0.4)},${u(0.5)}L${u(-0.8)},${u(0.4)}Z" fill="#d9c58a" stroke="#6b5216" stroke-width="0.5"/>` + mscrew(u(-0.76), u(0.34), u(0.035), 70);
  } else {
    const hasRotor = mv.type === 'auto' || mv.rotor;
    // barrel bridge (upper left)
    s += `<path class="w-bridge" d="M${u(-1.05)},${u(0.12)}L${u(-1.05)},${u(-1.05)}L${u(0.34)},${u(-1.05)}Q${u(0.3)},${u(-0.62)} ${u(0.02)},${u(-0.5)}Q${u(0.2)},${u(-0.2)} ${u(-0.02)},${u(0.02)}Q${u(-0.3)},${u(0.24)} ${u(-0.56)},${u(0.1)}Q${u(-0.8)},${u(0.02)} ${u(-1.05)},${u(0.12)}Z" fill="url(#${id}gs)" stroke="${C[4]}" stroke-width="0.8"/>`;
    s += `<path d="M${u(0.34)},${u(-1.05)}Q${u(0.3)},${u(-0.62)} ${u(0.02)},${u(-0.5)}Q${u(0.2)},${u(-0.2)} ${u(-0.02)},${u(0.02)}Q${u(-0.3)},${u(0.24)} ${u(-0.56)},${u(0.1)}Q${u(-0.8)},${u(0.02)} ${u(-1.05)},${u(0.12)}" fill="none" stroke="${C[0]}" stroke-width="1.6" opacity="0.9"/>`;
    // ratchet wheel + crown wheel
    s += `<g transform="translate(${u(-0.3)},${u(-0.4)})"><path d="${gearTeeth(u(0.3), 42, u(0.03))}" fill="${C[1]}" stroke="${C[4]}" stroke-width="0.5"/><circle r="${u(0.24)}" fill="url(#${id}mv)" stroke="${C[4]}" stroke-width="0.4"/>`;
    for (let i = 0; i < 18; i++) s += `<path d="M0,0Q${pt(P(u(0.14), i * 20 + 30))} ${pt(P(u(0.24), i * 20))}" stroke="${C[3]}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
    s += `<circle r="${u(0.07)}" fill="${C[0]}" stroke="${C[4]}" stroke-width="0.5"/>${mscrew(0, 0, u(0.045), 20, mv.blue)}</g>`;
    s += `<g transform="translate(${u(-0.7)},${u(-0.08)})"><path d="${gearTeeth(u(0.15), 22, u(0.028))}" fill="${C[1]}" stroke="${C[4]}" stroke-width="0.5"/><circle r="${u(0.1)}" fill="url(#${id}mv)"/>${mscrew(0, 0, u(0.05), -40, mv.blue)}</g>`;
    // click
    s += `<path d="M${u(-0.56)},${u(-0.66)}q${u(-0.14)},${u(-0.02)} ${u(-0.2)},${u(0.1)}" fill="none" stroke="${C[4]}" stroke-width="2.2" stroke-linecap="round"/>` + mscrew(u(-0.75), u(-0.56), u(0.032), 10, mv.blue);
    // train bridge (lower)
    s += `<path class="w-bridge" d="M${u(-0.9)},${u(0.3)}Q${u(-0.6)},${u(0.22)} ${u(-0.4)},${u(0.32)}Q${u(-0.1)},${u(0.42)} ${u(0.04)},${u(0.2)}Q${u(0.24)},${u(0.34)} ${u(0.2)},${u(0.6)}Q${u(0.26)},${u(0.86)} ${u(0.05)},${u(1.05)}L${u(-0.75)},${u(1.05)}Q${u(-1.0)},${u(0.7)} ${u(-0.9)},${u(0.3)}Z" fill="url(#${id}gs)" stroke="${C[4]}" stroke-width="0.8"/>`;
    s += `<path d="M${u(-0.9)},${u(0.3)}Q${u(-0.6)},${u(0.22)} ${u(-0.4)},${u(0.32)}Q${u(-0.1)},${u(0.42)} ${u(0.04)},${u(0.2)}Q${u(0.24)},${u(0.34)} ${u(0.2)},${u(0.6)}Q${u(0.26)},${u(0.86)} ${u(0.05)},${u(1.05)}" fill="none" stroke="${C[0]}" stroke-width="1.6" opacity="0.9"/>`;
    const ch = !!mv.chatons;
    s += jewel(0, 0, u(0.045), ch) + jewel(u(-0.36), u(0.5), u(0.04), ch) + jewel(u(-0.08), u(0.68), u(0.036), ch) + jewel(u(0.1), u(0.44), u(0.032), ch);
    s += mscrew(u(-0.72), u(0.5), u(0.042), 60, mv.blue) + mscrew(u(-0.3), u(0.86), u(0.042), -20, mv.blue) + mscrew(u(-0.86), u(-0.36), u(0.042), 100, mv.blue) + mscrew(u(0.12), u(-0.86), u(0.042), 15, mv.blue) + mscrew(u(-0.1), u(-0.06), u(0.036), 75, mv.blue);
    // escape wheel glimpse
    s += `<g transform="translate(${u(0.36)},${u(0.62)})"><path d="${gearTeeth(u(0.11), 15, u(0.035))}" fill="#d8dadd" stroke="#444" stroke-width="0.4"/><circle r="${u(0.03)}" fill="#666"/></g>`;
    s += `<path d="M${u(0.22)},${u(0.9)}Q${u(0.5)},${u(0.86)} ${u(0.52)},${u(0.6)}L${u(0.4)},${u(0.56)}Q${u(0.36)},${u(0.72)} ${u(0.2)},${u(0.74)}Z" fill="url(#${id}mv)" stroke="${C[4]}" stroke-width="0.7"/>` + jewel(u(0.36), u(0.62), u(0.03), ch) + mscrew(u(0.3), u(0.84), u(0.034), 5, mv.blue);
    if (mv.type === 'chrono') {
      // column wheel, levers, chrono wheels
      s += `<g transform="translate(${u(0.1)},${u(-0.3)})"><path d="${gearTeeth(u(0.2), 60, u(0.012))}" fill="#e3e5e8" stroke="#555" stroke-width="0.35"/><circle r="${u(0.04)}" fill="#888"/></g>`;
      s += `<g transform="translate(${u(-0.5)},${u(0.16)})"><path d="${gearTeeth(u(0.12), 40, u(0.012))}" fill="#e3e5e8" stroke="#555" stroke-width="0.35"/><circle r="${u(0.03)}" fill="#888"/></g>`;
      if (mv.cam) s += `<g class="w-colwheel" transform="translate(${u(-0.02)},${u(-0.74)})"><path d="M${u(-0.13)},${u(-0.04)}Q${u(-0.1)},${u(-0.12)} ${u(0.02)},${u(-0.1)}Q${u(0.14)},${u(-0.08)} ${u(0.13)},${u(0.02)}Q${u(0.1)},${u(0.1)} ${u(0)},${u(0.06)}Q${u(-0.1)},${u(0.1)} ${u(-0.13)},${u(-0.04)}Z" fill="#d7dadd" stroke="#333" stroke-width="0.6"/>` + mscrew(0, 0, u(0.035), 30, false) + `</g>`;
      else {
      s += `<g class="w-colwheel" transform="translate(${u(-0.02)},${u(-0.74)})"><circle r="${u(0.1)}" fill="#cfd3d7" stroke="#333" stroke-width="0.6"/>`;
      for (let i = 0; i < 6; i++) { const p = P(u(0.075), i * 60); s += `<rect x="-2" y="-2.6" width="4" height="5.2" transform="translate(${pt(p)}) rotate(${i * 60})" fill="#f2f4f6" stroke="#333" stroke-width="0.5"/>`; }
      s += mscrew(0, 0, u(0.035), 30, true) + `</g>`;
      }
      s += `<path d="M${u(-0.02)},${u(-0.62)}Q${u(0.3)},${u(-0.5)} ${u(0.3)},${u(-0.1)}M${u(-0.14)},${u(-0.7)}Q${u(-0.5)},${u(-0.5)} ${u(-0.56)},${u(0.02)}M${u(0.1)},${u(-0.1)}Q${u(-0.2)},${u(0.2)} ${u(-0.38)},${u(0.14)}" fill="none" stroke="#e9ebee" stroke-width="3.6" stroke-linecap="round"/><path d="M${u(-0.02)},${u(-0.62)}Q${u(0.3)},${u(-0.5)} ${u(0.3)},${u(-0.1)}M${u(-0.14)},${u(-0.7)}Q${u(-0.5)},${u(-0.5)} ${u(-0.56)},${u(0.02)}M${u(0.1)},${u(-0.1)}Q${u(-0.2)},${u(0.2)} ${u(-0.38)},${u(0.14)}" fill="none" stroke="#555" stroke-width="0.5" stroke-linecap="round"/>`;
    }
    // balance (right)
    const bx = u(0.46), by = u(-0.06), br = u(0.36), hz = (c.bph || 18000) / 7200;
    s += `<g transform="translate(${bx},${by})"><circle r="${r2(br * 1.08)}" fill="#0f1011" opacity="0.55"/>`;
    // hairspring
    let sp = ''; const turns = 7; for (let i = 0; i <= turns * 24; i++) { const a = i * 15, r = br * (0.07 + 0.42 * i / (turns * 24)); const p = P(r, a); sp += (i ? 'L' : 'M') + pt(p); }
    s += `<g class="w-bal" data-hz="${hz}"><path class="w-spring" d="${sp}" fill="none" stroke="${mv.spring || '#3a55a8'}" stroke-width="0.55"/>`;
    s += `<circle r="${r2(br * 0.92)}" fill="none" stroke="${mv.balColor || '#d9b54a'}" stroke-width="${r2(br * 0.11)}"/><circle r="${r2(br * 0.92)}" fill="none" stroke="#7a5a12" stroke-width="0.5" opacity="0.6"/>`;
    s += `<path d="M${r2(-br * 0.9)},0H${r2(br * 0.9)}" stroke="${mv.balColor || '#d9b54a'}" stroke-width="${r2(br * 0.1)}"/>${mv.threeArm ? `<path d="M0,0V${r2(-br * 0.9)}" stroke="${mv.balColor || '#d9b54a'}" stroke-width="${r2(br * 0.1)}"/>` : ''}`;
    if (mv.balScrews !== false) for (let i = 0; i < 14; i++) { const p = P(br * 1.0, i * 360 / 14 + 6); s += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(br * 0.055)}" fill="#e9c75f" stroke="#6b5216" stroke-width="0.35"/>`; }
    s += `<circle r="${r2(br * 0.1)}" fill="#c9ccd0" stroke="#444" stroke-width="0.4"/></g>`;
    // balance cock
    s += `<path class="w-cock" d="M${r2(br * 1.9)},${r2(-br * 0.95)}L${r2(br * 1.9)},${r2(br * 0.5)}Q${r2(br * 1.2)},${r2(br * 0.52)} ${r2(br * 0.5)},${r2(br * 0.2)}Q${r2(br * 0.1)},${r2(br * 0.28)} ${r2(-br * 0.22)},${r2(br * 0.04)}Q${r2(-br * 0.3)},${r2(-br * 0.2)} ${r2(br * 0.02)},${r2(-br * 0.26)}Q${r2(br * 0.6)},${r2(-br * 0.3)} ${r2(br * 1.0)},${r2(-br * 0.95)}Z" fill="url(#${id}gs)" stroke="${C[4]}" stroke-width="0.8"/>`;
    // regulator
    const reg = mv.reg != null ? mv.reg : 0; // degrees offset of index
    s += `<path d="M${pt(P(br * 0.74, 200))}A${r2(br * 0.74)},${r2(br * 0.74)} 0 0 1 ${pt(P(br * 0.74, 250))}" fill="none" stroke="${C[4]}" stroke-width="0.5" opacity="0.0"/>`;
    for (let i = -3; i <= 3; i++) { const a = 55 + i * 7, p1 = P(br * 1.34, a), p2 = P(br * (i === 0 ? 1.5 : 1.44), a); s += `<line x1="${r2(p1[0])}" y1="${r2(p1[1])}" x2="${r2(p2[0])}" y2="${r2(p2[1])}" stroke="${C[4]}" stroke-width="0.7" opacity="0.8"/>`; }
    const pa = P(br * 1.62, 34), pr = P(br * 1.62, 76);
    s += `<text x="${r2(pa[0])}" y="${r2(pa[1])}" font-family="${FONT.sans}" font-size="6.5" font-weight="600" fill="${C[4]}" text-anchor="middle" dominant-baseline="central" opacity="0.85">A</text><text x="${r2(pr[0])}" y="${r2(pr[1])}" font-family="${FONT.sans}" font-size="6.5" font-weight="600" fill="${C[4]}" text-anchor="middle" dominant-baseline="central" opacity="0.85">R</text>`;
    s += `<g class="w-reg" transform="rotate(${r2(55 + reg)})"><path d="M-1.6,${r2(br * 0.2)}L-1.1,${r2(-br * 1.4)}L0,${r2(-br * 1.5)}L1.1,${r2(-br * 1.4)}L1.6,${r2(br * 0.2)}Z" fill="#eef0f2" stroke="#333" stroke-width="0.5"/><circle r="${r2(br * 0.19)}" fill="#eef0f2" stroke="#333" stroke-width="0.5"/></g>`;
    if (mv.swan) s += `<path d="M${pt(P(br * 1.36, 20))}Q${pt(P(br * 2.1, 30))} ${pt(P(br * 1.56, 52))}" fill="none" stroke="#eef0f2" stroke-width="2.2" stroke-linecap="round"/><path d="M${pt(P(br * 1.36, 20))}Q${pt(P(br * 2.1, 30))} ${pt(P(br * 1.56, 52))}" fill="none" stroke="#333" stroke-width="0.4"/>` + mscrew(P(br * 1.36, 20)[0], P(br * 1.36, 20)[1], br * 0.07, 40, true);
    s += jewel(0, 0, br * 0.11, true) + mscrew(br * 1.55, -br * 0.4, u(0.045), 50, mv.blue) + `</g>`;
    // engravings
    (mv.text || []).forEach(t => { s += `<text x="${u(t.x)}" y="${u(t.y)}" font-family="${FONT[t.f || 'sans']}" font-size="${t.s || 6.5}" font-weight="${t.w || 500}" ${t.i ? 'font-style="italic"' : ''} letter-spacing="${t.ls != null ? t.ls : 1}" fill="${t.c || C[4]}" text-anchor="middle" dominant-baseline="central" opacity="${t.o || 0.82}" transform="rotate(${t.rot || 0} ${u(t.x)} ${u(t.y)})">${esc(t.t)}</text>`; });
    if (hasRotor) {
      s += `<g class="w-rotor" transform="rotate(${mv.rotorAt || 200})"><path d="M${u(-0.99)},0A${u(0.99)},${u(0.99)} 0 0 1 ${u(0.99)},0L${u(0.72)},0A${u(0.72)},${u(0.72)} 0 0 0 ${u(-0.72)},0Z" fill="url(#${id}mv)" stroke="${C[4]}" stroke-width="0.8"/><path d="M${u(-0.72)},0A${u(0.72)},${u(0.72)} 0 0 1 ${u(0.72)},0L${u(0.2)},0Q0,${u(-0.26)} ${u(-0.2)},0Z" fill="url(#${id}gs)" stroke="${C[4]}" stroke-width="0.7" opacity="0.96"/><circle r="${u(0.13)}" fill="${C[1]}" stroke="${C[4]}" stroke-width="0.7"/>${mscrew(0, 0, u(0.06), 30)}${mv.rotorText ? `<path id="${id}rt" d="M${u(-0.85)},0A${u(0.85)},${u(0.85)} 0 0 1 ${u(0.85)},0" fill="none"/><text font-family="${FONT.sans}" font-size="6.2" font-weight="500" letter-spacing="1.4" fill="${C[4]}" text-anchor="middle" opacity="0.85"><textPath href="#${id}rt" startOffset="50%">${esc(mv.rotorText)}</textPath></text>` : ''}</g>`;
    }
  }
  s += `</g>`;
  return s + '</g>';
}

/* ---------- main entry ---------- */
W.svg = function (cfg, o) {
  o = o || {};
  const c = merge(DEF, cfg || {}); if (cfg && cfg.strap === null) c.strap = null;
  const id = 'w' + (++UID), g = geom(c), R = g.R, M = METAL[c.metal] || METAL.steel, view = o.view || 'dial';
  let body = '', out = {};
  const mirror = view !== 'dial';
  let under = strap(c, g, id, o) + lugs(c, g, id, M) + crowns(c, g, id, M);
  if (mirror) under = `<g transform="scale(-1,1)">${under}</g>`;
  if (o.wrist) {
    const wr = o.wrist, ah = Math.max(R * 1.3, 122);
    const st = strap(c, g, id, o);
    body += `<defs><linearGradient id="${id}sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.34"/><stop offset="0.22" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></linearGradient><clipPath id="${id}ac"><rect x="-400" y="${r2(-ah - 3)}" width="800" height="${r2(ah * 2 + 6)}"/></clipPath></defs>`;
    body += `<rect x="-400" y="${r2(-ah)}" width="800" height="${r2(ah * 2)}" fill="${wr.skin || '#c99a7c'}"/><rect x="-400" y="${r2(-ah)}" width="800" height="${r2(ah * 2)}" fill="url(#${id}sk)"/>`;
    body += `<path d="M${r2(R * 1.9)},${r2(-ah)}q${r2(R * 0.5)},${r2(-ah * 0.25)} ${r2(R * 2)},${r2(-ah * 0.3)}v${r2(ah * 2.6)}q${r2(-R * 1.5)},${r2(-ah * 0.05)} ${r2(-R * 2)},${r2(-ah * 0.3)}z" fill="${wr.skin || '#c99a7c'}"/>`;
    if (!c.none) body += `<g clip-path="url(#${id}ac)">${st}</g>`;
    const sx = -R * (wr.sleeveAt || 1.5);
    if (wr.sleeve) {
      body += `<rect x="-500" y="${r2(-ah * 1.22)}" width="${r2(500 + sx)}" height="${r2(ah * 2.44)}" fill="${wr.sleeve}"/><rect x="-500" y="${r2(-ah * 1.22)}" width="${r2(500 + sx)}" height="${r2(ah * 2.44)}" fill="url(#${id}sk)"/>`;
      if (wr.cuff) body += `<rect x="${r2(sx - 4)}" y="${r2(-ah * 1.12)}" width="${r2(R * 0.3)}" height="${r2(ah * 2.24)}" rx="3" fill="${wr.cuff}"/><rect x="${r2(sx - 4)}" y="${r2(-ah * 1.12)}" width="${r2(R * 0.3)}" height="${r2(ah * 2.24)}" rx="3" fill="url(#${id}sk)"/>`;
      if (wr.knit) for (let y = -ah * 1.2; y < ah * 1.2; y += 6) body += `<line x1="-500" x2="${r2(sx)}" y1="${r2(y)}" y2="${r2(y)}" stroke="#000" stroke-width="1" opacity="0.14"/>`;
    }
    if (!c.none) { body += `<ellipse cx="2" cy="6" rx="${r2(R * 1.06)}" ry="${r2(R * 1.02)}" fill="#000" opacity="0.28" filter="url(#${id}bz)"/>`;
    body += lugs(c, g, id, M) + crowns(c, g, id, M); }
  } else body += under;
  let glow = '';
  if (c.none) { /* bare wrist: nothing to draw */ }
  else if (view === 'dial') {
    body += caseBody(c, g, id, M) + bezel(c, g, id, M);
    if (c.display) body += `<g class="w-dial">${display(c, g, id)}</g>`;
    else { body += dial(c, g, id, M, out); if (!c.noHands) body += hands(c, g, id, out); glow = (out.glow || '') + (out.handGlow || ''); }
    body += crystal(c, g, id);
    body += `<g class="w-uv" pointer-events="none"><rect x="-400" y="-400" width="800" height="800" fill="#020503" opacity="0.9"/><g filter="url(#${id}gw)">${glow}</g></g>`;
  } else {
    body += caseBody(c, g, id, M);
    if (view === 'back') body += backPlate(c, g, id, M);
    else if (view === 'inside') body += insideBack(c, g, id, M);
    else body += movement(c, g, id, M);
  }
  let vb;
  if (o.vb) vb = o.vb;
  else if (o.wrist) vb = '-170 -170 340 340';
  else if (o.crop === 'head') { const k = R * 1.34; vb = `${r2(-k)} ${r2(-k)} ${r2(k * 2)} ${r2(k * 2)}`; }
  else if (o.crop === 'tight') { const k = R * 1.16; vb = `${r2(-k)} ${r2(-k)} ${r2(k * 2)} ${r2(k * 2)}`; }
  else vb = '-160 -235 320 470';
  const live = o.live ? ` data-live="1"` : '';
  const inner = o.wrist ? `<g transform="rotate(${o.wrist.rot != null ? o.wrist.rot : -18})">${body}</g>` : body;
  return `<svg class="watch${o.cls ? ' ' + o.cls : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" data-bph="${c.bph}" data-quartz="${c.quartz ? 1 : 0}" data-h24="${c.h24 ? 1 : 0}" data-off="${o.off || 0}"${live} data-r="${R}">${defs(id, c, g, M)}${inner}</svg>`;
};

/* geometry helper for hotspots: returns case radius in svg units */
W.radius = cfg => (cfg.mm || DEF.mm) * 2.5;

/* ---------- animation ---------- */
W.clock = { offset: 0 };            // ms offset applied to "now"
function setT(e, t) { if (e._t !== t) { e._t = t; e.setAttribute('transform', t); } }
W.setHands = function (svg, h, m, s) {
  const h24 = svg.dataset.h24 === '1';
  const ah = h24 ? ((h + m / 60) / 24) * 360 : ((h % 12) + m / 60 + s / 3600) * 30, am = (m + s / 60) * 6, as = s * 6;
  const th = `rotate(${Math.round(ah * 5) / 5})`, tm = `rotate(${Math.round(am * 5) / 5})`, ts = `rotate(${r2(as)})`;
  if (svg._th !== th) { svg._th = th; svg.querySelectorAll('.w-h').forEach(e => setT(e, th)); }
  if (svg._tm !== tm) { svg._tm = tm; svg.querySelectorAll('.w-m').forEach(e => setT(e, tm)); }
  if (svg._ts !== ts) { svg._ts = ts; svg.querySelectorAll('.w-s,.w-ss').forEach(e => setT(e, ts)); }
};
let running = false, tickN = 0;
function frame() {
  tickN++;
  const now = Date.now() + W.clock.offset;
  const live = document.querySelectorAll('svg.watch[data-live="1"]');
  for (let i = 0; i < live.length; i++) {
    const svg = live[i]; if (svg.dataset.run === '0') continue;
    const d = new Date(now + (+svg.dataset.off || 0) * 60000);
    const bps = svg.dataset.quartz === '1' ? 1 : (+svg.dataset.bph || 18000) / 3600;
    const secs = d.getSeconds() + d.getMilliseconds() / 1000;
    W.setHands(svg, d.getHours(), d.getMinutes(), Math.floor(secs * bps) / bps);
  }
  if (tickN % 2 === 0) {
    const bal = document.querySelectorAll('.w-bal');
    const t = performance.now() / 1000;
    for (let i = 0; i < bal.length; i++) {
      const e = bal[i], svg = e.ownerSVGElement, amp = svg && svg.dataset.amp != null ? +svg.dataset.amp : 1;
      const hz = Math.min(+e.dataset.hz || 2.5, 3.2);
      setT(e, `rotate(${Math.round(135 * amp * Math.sin(t * hz * Math.PI * 2))})`);
    }
  }
  requestAnimationFrame(frame);
}
W.start = function () { if (!running) { running = true; requestAnimationFrame(frame); } };

window.Watch = W;
})();
