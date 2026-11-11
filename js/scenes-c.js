/* UNSIGNED — location backdrops, set C: Hong Kong street, case factory,
   La Chaux-de-Fonds in snow, the factory attic.
   Each Scenes.<name>(o) returns a 1600x900 SVG string (slice-fitted by the stage). */
(function () {
'use strict';
const S = (window.Scenes = window.Scenes || {});
const r1 = v => Math.round(v * 10) / 10;
const pts = a => a.map(p => r1(p[0]) + ',' + r1(p[1])).join(' ');
function rng(seed) { let s = (seed >>> 0) || 7; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">';
const SANS = 'Jost, sans-serif', SERIF = "'Cormorant Garamond', serif";
function mix(a, b, t) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const ch = sh => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t); return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1); }
const poly = (a, fill, extra) => `<polygon points="${pts(a)}" fill="${fill}" ${extra || ''}/>`;
const rect = (x, y, w, h, fill, extra) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" ${extra || ''}/>`;

/* =====================================================================
   HONG KONG — a street canyon at night, eye level, one-point perspective
   ===================================================================== */
S.hk = function (o) {
  o = o || {};
  const R = rng(1997), VX = 800, VY = 468, EYE = 150;
  const sOf = x => Math.abs(x - VX) / 800;
  const Y = (x, h) => VY - (h - EYE) * sOf(x);
  const NE = { red: '#f0463a', amber: '#f4b64e', cyan: '#48dccb', pink: '#ff6f9d', green: '#5fe394', cream: '#f1e9d6' };
  let s = OPEN + '<defs>';
  s += `<linearGradient id="hk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d10"/><stop offset="0.5" stop-color="#0f2325"/><stop offset="1" stop-color="#2c4a46"/></linearGradient>`;
  s += `<radialGradient id="hk-haze" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f3c98a" stop-opacity="0.75"/><stop offset="0.35" stop-color="#e58a72" stop-opacity="0.32"/><stop offset="1" stop-color="#e58a72" stop-opacity="0"/></radialGradient>`;
  Object.keys(NE).forEach(k => {
    s += `<radialGradient id="hk-g-${k}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${NE[k]}" stop-opacity="0.5"/><stop offset="0.55" stop-color="${NE[k]}" stop-opacity="0.14"/><stop offset="1" stop-color="${NE[k]}" stop-opacity="0"/></radialGradient>`;
    s += `<linearGradient id="hk-rf-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NE[k]}" stop-opacity="0.42"/><stop offset="1" stop-color="${NE[k]}" stop-opacity="0"/></linearGradient>`;
  });
  s += `<linearGradient id="hk-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4f49"/><stop offset="0.12" stop-color="#1b2b2b"/><stop offset="0.5" stop-color="#0e1719"/><stop offset="1" stop-color="#070c0e"/></linearGradient>`;
  s += `<linearGradient id="hk-win" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe2a2"/><stop offset="0.6" stop-color="#f0b658"/><stop offset="1" stop-color="#c9822f"/></linearGradient>`;
  s += `<linearGradient id="hk-shop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d590"/><stop offset="1" stop-color="#d98f3c"/></linearGradient>`;
  s += `<linearGradient id="hk-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04080a" stop-opacity="0.85"/><stop offset="1" stop-color="#04080a" stop-opacity="0"/></linearGradient>`;
  s += `<linearGradient id="hk-bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05090a" stop-opacity="0"/><stop offset="1" stop-color="#05090a" stop-opacity="0.8"/></linearGradient>`;
  s += '</defs>';

  /* sky wedge, haze and distant towers */
  s += rect(0, 0, 1600, 900, 'url(#hk-sky)');
  s += `<ellipse cx="${VX}" cy="${VY - 30}" rx="330" ry="300" fill="url(#hk-haze)"/>`;
  [[742, 250, 34], [778, 190, 26], [806, 296, 30], [838, 228, 22], [862, 330, 20], [722, 340, 22]].forEach((t, i) => {
    s += rect(t[0], t[1], t[2], VY - t[1], i % 2 ? '#3d5c58' : '#34514e', 'opacity="0.8"');
    for (let y = t[1] + 8; y < VY - 20; y += 9) for (let x = t[0] + 4; x < t[0] + t[2] - 4; x += 7) if (R() < 0.3) s += rect(x, y, 2.6, 3.4, R() < 0.8 ? '#f6d79a' : '#9be8dc', 'opacity="0.75"');
  });
  s += `<ellipse cx="${VX}" cy="${VY}" rx="210" ry="120" fill="url(#hk-haze)" opacity="0.8"/>`;

  /* street canyon walls, drawn far to near */
  const WIN = ['#f6d48a', '#f1b866', '#f6d48a', '#9be8dc', '#f1e9d6', '#f29a6a'];
  function building(xn, xf, floors, col, endCol) {
    const H = 330 + 280 * floors, left = xn < VX;
    let b = '';
    const yT = Y(xn, H), yB = Y(xn, 0);
    b += rect(left ? -20 : xn, yT, Math.max(0, left ? xn + 20 : 1620 - xn), yB - yT, endCol);
    b += poly([[xn, Y(xn, H)], [xf, Y(xf, H)], [xf, Y(xf, 0)], [xn, Y(xn, 0)]], col);
    const wd = Math.abs(xf - xn), sm = (sOf(xn) + sOf(xf)) / 2, n = Math.max(2, Math.round(wd / (22 + 74 * sm)));
    for (let f = 1; f <= floors; f++) {
      const h0 = 330 + 280 * (f - 1) + 62, h1 = h0 + 158;
      if (Math.max(Y(xn, h0), Y(xf, h0)) < -10) break;
      for (let c = 0; c < n; c++) {
        const xa = xn + (xf - xn) * (c + 0.2) / n, xb = xn + (xf - xn) * (c + 0.8) / n;
        const lit = R() < 0.3;
        b += poly([[xa, Y(xa, h1)], [xb, Y(xb, h1)], [xb, Y(xb, h0)], [xa, Y(xa, h0)]], lit ? WIN[Math.floor(R() * WIN.length)] : '#000', lit ? `opacity="${r1(0.55 + R() * 0.4)}"` : 'opacity="0.28"');
        if (!lit && R() < 0.35) b += poly([[xa, Y(xa, h0 + 4)], [xb, Y(xb, h0 + 4)], [xb, Y(xb, h0 - 34)], [xa, Y(xa, h0 - 34)]], '#9fb0ac', 'opacity="0.16"'); // air-con box
      }
      // floor slab line
      b += `<line x1="${r1(xn)}" y1="${r1(Y(xn, h0 - 62))}" x2="${r1(xf)}" y2="${r1(Y(xf, h0 - 62))}" stroke="#000" stroke-width="${r1(1 + sm * 2)}" opacity="0.25"/>`;
    }
    // ground floor: lit shop or shutter, then a fascia band
    const shop = R() < 0.62;
    b += poly([[xn, Y(xn, 262)], [xf, Y(xf, 262)], [xf, Y(xf, 14)], [xn, Y(xn, 14)]], shop ? 'url(#hk-shop)' : '#16282a', shop ? `opacity="${r1(0.55 + R() * 0.35)}"` : '');
    if (shop) for (let c = 1; c < Math.max(2, n); c++) { const x = xn + (xf - xn) * c / Math.max(2, n); b += `<line x1="${r1(x)}" y1="${r1(Y(x, 262))}" x2="${r1(x)}" y2="${r1(Y(x, 14))}" stroke="#2a1c10" stroke-width="${r1(1 + sm * 3)}" opacity="0.6"/>`; }
    const fc = ['#6f211c', '#1d514c', '#7d6128', '#101a1c'][Math.floor(R() * 4)];
    b += poly([[xn, Y(xn, 326)], [xf, Y(xf, 326)], [xf, Y(xf, 262)], [xn, Y(xn, 262)]], fc);
    return b;
  }
  const BL = [[-60, 170, 22, '#0a1214'], [170, 330, 18, '#0d181a'], [330, 450, 13, '#101e20'], [450, 540, 8, '#142528'], [540, 612, 15, '#182c2f'], [612, 662, 6, '#1d3437'], [662, 702, 10, '#223d3f'], [702, 732, 4, '#29484a']];
  const BR = [[1660, 1430, 20, '#0a1214'], [1430, 1280, 16, '#0d181a'], [1280, 1172, 11, '#101e20'], [1172, 1080, 17, '#142528'], [1080, 1002, 7, '#182c2f'], [1002, 948, 12, '#1d3437'], [948, 906, 5, '#223d3f'], [906, 872, 8, '#29484a']];
  for (let i = BL.length - 1; i >= 0; i--) {
    s += building(BL[i][0], BL[i][1], BL[i][2], BL[i][3], i ? BL[i - 1][3] : '#070d0f');
    s += building(BR[i][0], BR[i][1], BR[i][2], BR[i][3], i ? BR[i - 1][3] : '#070d0f');
  }

  /* hero details on the near walls */
  // left: a dried-goods shop, shutter half down, jars on shelves
  s += poly([[24, Y(24, 300)], [292, Y(292, 300)], [292, Y(292, 16)], [24, Y(24, 16)]], 'url(#hk-shop)');
  for (let k = 0; k < 3; k++) {
    const h = 70 + k * 62;
    s += `<line x1="24" y1="${r1(Y(24, h))}" x2="292" y2="${r1(Y(292, h))}" stroke="#7a4a1c" stroke-width="4" opacity="0.7"/>`;
    for (let x = 40; x < 285; x += 21) if (R() < 0.8) { const hh = 26 + R() * 22; s += poly([[x, Y(x, h + hh)], [x + 13, Y(x + 13, h + hh)], [x + 13, Y(x + 13, h + 3)], [x, Y(x, h + 3)]], ['#8a4a22', '#b56a2a', '#5c3a1e', '#c98a3a'][Math.floor(R() * 4)], 'opacity="0.85"'); }
  }
  s += poly([[24, Y(24, 300)], [292, Y(292, 300)], [292, Y(292, 232)], [24, Y(24, 232)]], '#5b6b68');
  for (let h = 240; h < 300; h += 10) s += `<line x1="24" y1="${r1(Y(24, h))}" x2="292" y2="${r1(Y(292, h))}" stroke="#2a3a38" stroke-width="2" opacity="0.7"/>`;
  s += poly([[10, Y(10, 352)], [300, Y(300, 352)], [300, Y(300, 300)], [10, Y(10, 300)]], '#7b241d');
  // right: the stair door and the lit first-floor shop
  s += poly([[1392, Y(1392, 300)], [1338, Y(1338, 300)], [1338, Y(1338, 0)], [1392, Y(1392, 0)]], '#0a1012');
  s += poly([[1386, Y(1386, 282)], [1344, Y(1344, 282)], [1344, Y(1344, 0)], [1386, Y(1386, 0)]], '#b9792e', 'opacity="0.85"');
  for (let k = 0; k < 7; k++) { const h = 14 + k * 30; s += poly([[1386, Y(1386, h + 16)], [1344 + k * 3, Y(1344 + k * 3, h + 16)], [1344 + k * 3, Y(1344 + k * 3, h)], [1386, Y(1386, h)]], '#3a2410', `opacity="${r1(0.5 + k * 0.06)}"`); }
  s += rect(1336, Y(1392, 300) - 20, 62, 17, '#0c1517') + `<text x="1367" y="${r1(Y(1392, 300) - 8)}" font-family="${SANS}" font-weight="600" font-size="10" letter-spacing="1.2" fill="${NE.amber}" text-anchor="middle">1/F  WATCHES</text>`;
  const wx0 = 1304, wx1 = 1548;
  s += `<ellipse cx="1420" cy="195" rx="230" ry="190" fill="url(#hk-g-amber)" opacity="0.8"/>`;
  s += poly([[wx0, Y(wx0, 668)], [wx1, Y(wx1, 668)], [wx1, Y(wx1, 372)], [wx0, Y(wx0, 372)]], '#0a1012');
  s += poly([[wx0 + 6, Y(wx0 + 6, 652)], [wx1 - 6, Y(wx1 - 6, 652)], [wx1 - 6, Y(wx1 - 6, 388)], [wx0 + 6, Y(wx0 + 6, 388)]], 'url(#hk-win)');
  // shelves of little clocks and trays seen through the glass
  [440, 520, 596].forEach(h => { s += `<line x1="${wx0 + 6}" y1="${r1(Y(wx0 + 6, h))}" x2="${wx1 - 6}" y2="${r1(Y(wx1 - 6, h))}" stroke="#6b3f14" stroke-width="3" opacity="0.75"/>`; });
  for (let x = wx0 + 22; x < wx1 - 20; x += 24) {
    const k = sOf(x);
    if (R() < 0.8) s += `<circle cx="${r1(x)}" cy="${r1(Y(x, 470))}" r="${r1(9 * k)}" fill="#3a2410" opacity="0.8"/><circle cx="${r1(x)}" cy="${r1(Y(x, 470))}" r="${r1(5.5 * k)}" fill="#f7e4b8" opacity="0.8"/>`;
    if (R() < 0.7) s += rect(x - 6 * k, Y(x, 550), 14 * k, 26 * k, '#4a2c12', 'opacity="0.75"');
    if (R() < 0.6) s += `<circle cx="${r1(x)}" cy="${r1(Y(x, 622))}" r="${r1(7 * k)}" fill="#5a3616" opacity="0.7"/>`;
  }
  // a wall clock and a bent head at the bench
  s += `<circle cx="1492" cy="${r1(Y(1492, 560))}" r="20" fill="#f7ecd0" stroke="#3a2410" stroke-width="4"/><path d="M1492,${r1(Y(1492, 560))}v-12M1492,${r1(Y(1492, 560))}l9,5" stroke="#3a2410" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M1344,${r1(Y(1344, 392))}q4,-56 26,-58q24,2 28,${r1(58 - (Y(1344, 392) - Y(1398, 392)))}z" fill="#2a180a" opacity="0.8"/><circle cx="1370" cy="${r1(Y(1370, 392) - 66)}" r="15" fill="#2a180a" opacity="0.8"/>`;
  [0.34, 0.67].forEach(u => { const x = wx0 + (wx1 - wx0) * u; s += `<line x1="${r1(x)}" y1="${r1(Y(x, 652))}" x2="${r1(x)}" y2="${r1(Y(x, 388))}" stroke="#0a1012" stroke-width="5"/>`; });

  /* road */
  s += poly([[-20, Y(-20, 0)], [VX, VY], [1620, Y(1620, 0)], [1620, 900], [-20, 900]], 'url(#hk-road)');
  s += poly([[VX, VY], [-20, Y(-20, 0)], [-20, VY + EYE * (820 / 620)]], '#22373a', 'opacity="0.75"') + poly([[VX, VY], [1620, Y(1620, 0)], [1620, VY + EYE * (820 / 620)]], '#22373a', 'opacity="0.75"');
  for (let z = 1; z < 9; z += 0.8) { const s0 = 1 / z * 2.6, s1 = 1 / (z + 0.36) * 2.6; [-285, 0, 285].forEach(X => { s += poly([[VX + (X - 5) * s0, VY + EYE * s0], [VX + (X + 5) * s0, VY + EYE * s0], [VX + (X + 5) * s1, VY + EYE * s1], [VX + (X - 5) * s1, VY + EYE * s1]], '#d9e2d8', 'opacity="0.22"'); }); }

  /* signs: [wallX, yTop, yBot, width, colour, kind, content]  (left wall: sign extends right; right wall: extends left) */
  const SG = [
    [684, 386, 420, 20, 'red', 'box', { g: 2 }], [922, 372, 410, 18, 'pink', 'box', { g: 2 }],
    [650, 344, 392, 44, 'cyan', 'box', { g: 2 }], [956, 352, 392, 46, 'green', 'box', { g: 2 }],
    [612, 292, 384, 30, 'amber', 'neon', { g: 4 }], [1000, 286, 352, 30, 'amber', 'box', { g: 3 }],
    [556, 276, 338, 80, 'red', 'box', { t: 'TAILOR' }], [1052, 196, 300, 36, 'red', 'neon', { g: 4 }],
    [512, 148, 256, 44, 'green', 'neon', { g: 4 }], [1166, 300, 342, 100, 'cyan', 'box', { t: 'CAMERA' }],
    [452, 196, 332, 54, 'pink', 'neon', { g: 4 }], [1164, 140, 290, 60, 'pink', 'neon', { g: 4 }],
    [352, 338, 392, 156, 'amber', 'box', { g: 4 }], [1292, 150, 352, 72, 'amber', 'watch', {}],
    [326, 140, 310, 74, 'cyan', 'neon', { t: 'HOTEL', v: 1 }], [1596, 372, 432, 214, 'red', 'box', { t: 'JEWELLERY' }],
    [186, 70, 300, 118, 'red', 'pawn', {}], [1600, -22, 108, 170, 'cyan', 'neon', { g: 3 }],
    [30, 64, 352, 108, 'red', 'neon', { g: 5 }]
  ];
  const STROKES = [[0.12, 0.14, 0.88, 0.14], [0.12, 0.5, 0.88, 0.5], [0.12, 0.88, 0.88, 0.88], [0.14, 0.12, 0.14, 0.88], [0.5, 0.1, 0.5, 0.9], [0.86, 0.12, 0.86, 0.88], [0.3, 0.3, 0.7, 0.3], [0.3, 0.7, 0.7, 0.7], [0.2, 0.9, 0.48, 0.52], [0.8, 0.9, 0.52, 0.52], [0.3, 0.14, 0.3, 0.5], [0.7, 0.5, 0.7, 0.88], [0.12, 0.32, 0.5, 0.32], [0.5, 0.68, 0.88, 0.68]];
  /* Sign cells are abstract neon ornaments (rings, diamonds, bars), deliberately not imitation writing. */
  function glyph(x, y, sz, col, sw) {
    const k = Math.floor(R() * 5), cx = x + sz / 2, cy = y + sz / 2, r = sz * 0.36; let d = '';
    if (k === 0) return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="none" stroke="${col}" stroke-width="${r1(sw)}"/>`;
    if (k === 1) d = `M${r1(cx)},${r1(cy - r)}L${r1(cx + r)},${r1(cy)}L${r1(cx)},${r1(cy + r)}L${r1(cx - r)},${r1(cy)}Z`;
    else if (k === 2) d = `M${r1(cx - r)},${r1(cy - r * 0.45)}H${r1(cx + r)}M${r1(cx - r)},${r1(cy + r * 0.45)}H${r1(cx + r)}`;
    else if (k === 3) d = `M${r1(cx - r)},${r1(cy + r * 0.5)}L${r1(cx)},${r1(cy - r * 0.5)}L${r1(cx + r)},${r1(cy + r * 0.5)}`;
    else d = `M${r1(cx - r)},${r1(cy)}H${r1(cx + r)}M${r1(cx)},${r1(cy - r)}V${r1(cy + r)}`;
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(sw)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  let glows = '', signs = '', refl = '';
  SG.forEach((g, i) => {
    const left = g[0] < VX, w = g[3], x0 = left ? g[0] : g[0] - w, y0 = g[1], y1 = g[2], h = y1 - y0, cn = g[4], col = NE[cn], kind = g[5], c = g[6];
    const cx = x0 + w / 2, cy = (y0 + y1) / 2, k = sOf(g[0]);
    glows += `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(w * 1.25 + 26)}" ry="${r1(h * 0.8 + 26)}" fill="url(#hk-g-${cn})"/>`;
    const gy = VY + EYE * k;
    refl += `<rect x="${r1(x0 + w * 0.15)}" y="${r1(gy + 4)}" width="${r1(w * 0.7)}" height="${r1(Math.min(330, h * 2.4 + 40))}" fill="url(#hk-rf-${cn})"/>`;
    let q = '';
    // bracket and stay
    const xa = left ? g[0] - 2 : g[0] + 2, xe = left ? x0 + w : x0;
    q += `<path d="M${r1(xa)},${r1(y0 - 2)}H${r1(xe)}M${r1(xa)},${r1(y0 - 2 - h * 0.22)}L${r1(xe)},${r1(y0 - 2)}M${r1(xa)},${r1(y1 + 1)}H${r1(xe)}" stroke="#05090a" stroke-width="${r1(1.2 + k * 2)}" fill="none"/>`;
    const dark = '#0a1315';
    if (kind === 'box') {
      q += rect(x0, y0, w, h, dark) + rect(x0 + 2, y0 + 2, w - 4, h - 4, col, `rx="${r1(1 + k * 2)}"`) + rect(x0 + 2, y0 + 2, w - 4, (h - 4) * 0.5, '#fff', 'opacity="0.13"');
      if (c.t) { const fs = Math.min(h * 0.56, (w - 14) / (c.t.length * 0.66)); q += `<text x="${r1(cx)}" y="${r1(cy + fs * 0.36)}" font-family="${SANS}" font-weight="600" font-size="${r1(fs)}" letter-spacing="${r1(fs * 0.08)}" fill="${dark}" text-anchor="middle">${c.t}</text>`; }
      else if (h >= w) { const n = c.g, sz = Math.min(w * 0.66, (h - 6) / n * 0.8); for (let j = 0; j < n; j++) q += glyph(cx - sz / 2, y0 + (h / n) * (j + 0.5) - sz / 2, sz, dark, Math.max(1.2, sz * 0.13)); }
      else { const n = c.g, sz = Math.min(h * 0.62, (w - 8) / n * 0.8); for (let j = 0; j < n; j++) q += glyph(x0 + (w / n) * (j + 0.5) - sz / 2, cy - sz / 2, sz, dark, Math.max(1.2, sz * 0.13)); }
    } else if (kind === 'neon') {
      q += rect(x0, y0, w, h, dark) + `<rect x="${r1(x0 + 3)}" y="${r1(y0 + 3)}" width="${r1(w - 6)}" height="${r1(h - 6)}" fill="none" stroke="${col}" stroke-width="${r1(1.2 + k * 2.4)}" rx="${r1(2 + k * 4)}"/>`;
      if (c.t && c.v) { const n = c.t.length, fs = Math.min(w * 0.62, (h - 12) / n * 0.92); for (let j = 0; j < n; j++) q += `<text x="${r1(cx)}" y="${r1(y0 + 8 + (h - 16) / n * (j + 0.5) + fs * 0.36)}" font-family="${SANS}" font-weight="600" font-size="${r1(fs)}" fill="${NE.cream}" text-anchor="middle">${c.t[j]}</text>`; }
      else { const n = c.g, vert = h >= w, sz = vert ? Math.min(w * 0.6, (h - 12) / n * 0.78) : Math.min(h * 0.6, (w - 12) / n * 0.78); for (let j = 0; j < n; j++) q += vert ? glyph(cx - sz / 2, y0 + 6 + ((h - 12) / n) * (j + 0.5) - sz / 2, sz, j % 2 ? NE.cream : col, Math.max(1.2, sz * 0.11)) : glyph(x0 + 6 + ((w - 12) / n) * (j + 0.5) - sz / 2, cy - sz / 2, sz, j % 2 ? NE.cream : col, Math.max(1.2, sz * 0.11)); }
    } else if (kind === 'pawn') {
      // the old pawnshop sign: a bat holding a coin, in red neon with a green heart
      const bw = w * 0.94, bh = Math.min(h * 0.5, bw * 1.1), cr = bw * 0.36, X = v => r1(cx + v * bw), Yb = v => r1(y0 + v * bh);
      const half = sg => `Q${X(-0.12 * sg)},${Yb(-0.04)} ${X(-0.3 * sg)},${Yb(0.06)}Q${X(-0.54 * sg)},${Yb(0.1)} ${X(-0.5 * sg)},${Yb(0.52)}Q${X(-0.36 * sg)},${Yb(0.44)} ${X(-0.3 * sg)},${Yb(0.68)}Q${X(-0.2 * sg)},${Yb(0.6)} ${X(-0.1 * sg)},${Yb(0.88)}L${X(0)},${Yb(1)}`;
      q += `<path d="M${X(0)},${Yb(0.18)}${half(1)}M${X(0)},${Yb(0.18)}${half(-1)}" fill="${dark}" stroke="${col}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
      q += glyph(cx - bw * 0.17, y0 + bh * 0.26, bw * 0.34, NE.cream, 3.4);
      const cy2 = y0 + bh + cr + 5;
      q += `<circle cx="${r1(cx)}" cy="${r1(cy2)}" r="${r1(cr)}" fill="${dark}" stroke="${col}" stroke-width="4"/><circle cx="${r1(cx)}" cy="${r1(cy2)}" r="${r1(cr * 0.76)}" fill="none" stroke="${NE.green}" stroke-width="2.4"/>`;
      q += `<text x="${r1(cx)}" y="${r1(cy2 + cr * 0.16)}" font-family="${SANS}" font-weight="600" font-size="${r1(cr * 0.42)}" fill="${NE.green}" text-anchor="middle" letter-spacing="1.5">PAWN</text>`;
    } else if (kind === 'watch') {
      // the sign for the upstairs shop: brass letters on green-black, a small clock at the head
      q += rect(x0, y0, w, h, '#0f1a17') + `<rect x="${r1(x0 + 3)}" y="${r1(y0 + 3)}" width="${r1(w - 6)}" height="${r1(h - 6)}" fill="none" stroke="${NE.amber}" stroke-width="2.4" rx="4"/>`;
      q += `<circle cx="${r1(cx)}" cy="${r1(y0 + 25)}" r="14" fill="none" stroke="${NE.cream}" stroke-width="2.4"/><path d="M${r1(cx)},${r1(y0 + 25)}v-9M${r1(cx)},${r1(y0 + 25)}l6,4" stroke="${NE.cream}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
      'WATCH'.split('').forEach((ch, j) => { q += `<text x="${r1(cx)}" y="${r1(y0 + 66 + j * 24)}" font-family="${SANS}" font-weight="600" font-size="22" fill="${NE.amber}" text-anchor="middle">${ch}</text>`; });
      q += `<text x="${r1(cx)}" y="${r1(y1 - 13)}" font-family="${SANS}" font-weight="500" font-size="15" letter-spacing="1.5" fill="${NE.cream}" text-anchor="middle">CO.</text>`;
    }
    const flick = i === 8 || i === 13;
    signs += `<g${k < 0.3 ? ` opacity="${r1(0.55 + k * 1.5)}"` : ''}>${q}${flick ? `<animate attributeName="opacity" values="1;1;0.35;1;0.8;1;1;1;0.5;1" dur="${i === 8 ? 7 : 11}s" repeatCount="indefinite"/>` : ''}</g>`;
  });
  s += refl + glows + signs;
  // ripples that break the reflections
  for (let i = 0; i < 26; i++) { const y = VY + 30 + R() * 400, x = R() * 1500; s += `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x + 60 + R() * 220)}" y2="${r1(y)}" stroke="#05090a" stroke-width="${r1(1.5 + R() * 3)}" opacity="0.5"/>`; }

  /* overhead wires */
  s += `<path d="M0,96Q420,250 800,${VY - 70}M1600,-40Q1150,150 800,${VY - 70}M0,238Q300,330 800,${VY - 40}" stroke="#05090a" stroke-width="1.4" fill="none" opacity="0.7"/>`;

  /* double-decker, coming toward us in the right-hand lanes */
  (function () {
    const k = 0.52, cx = VX + 410 * k, w = 220 * k, gy = VY + EYE * k, ty = VY - 237 * k, x0 = cx - w / 2, x1 = cx + w / 2, h = gy - ty;
    const k2 = 0.3, bx = VX + (410 - 110) * k2, bgy = VY + EYE * k2, bty = VY - 237 * k2;
    s += `<ellipse cx="${r1(cx)}" cy="${r1(gy + 6)}" rx="${r1(w * 0.9)}" ry="12" fill="#05090a" opacity="0.6"/>`;
    s += poly([[x0, ty], [bx, bty], [bx, bgy], [x0, gy]], '#a8956a');
    s += poly([[x0, ty + h * 0.1], [bx, bty + (bgy - bty) * 0.1], [bx, bty + (bgy - bty) * 0.36], [x0, ty + h * 0.36]], '#f3cd80', 'opacity="0.9"');
    s += poly([[x0, ty + h * 0.52], [bx, bty + (bgy - bty) * 0.52], [bx, bty + (bgy - bty) * 0.76], [x0, ty + h * 0.76]], '#f3cd80', 'opacity="0.8"');
    for (let u = 0.2; u < 1; u += 0.2) { const x = x0 + (bx - x0) * u, t = bty + (ty - bty) * (1 - u), b = bgy + (gy - bgy) * (1 - u); s += `<line x1="${r1(x)}" y1="${r1(t + (b - t) * 0.1)}" x2="${r1(x)}" y2="${r1(t + (b - t) * 0.76)}" stroke="#7a6a48" stroke-width="2.5"/>`; }
    s += poly([[x0, ty + h * 0.82], [bx, bty + (bgy - bty) * 0.82], [bx, bgy], [x0, gy]], '#8f2a23');
    s += rect(x0, ty, w, h, '#dcc896', 'rx="7"');
    s += rect(x0 + 5, ty + h * 0.07, w - 10, h * 0.25, '#17262a', 'rx="4"') + rect(x0 + 5, ty + h * 0.07, w - 10, h * 0.25, '#f3cd80', 'rx="4" opacity="0.38"');
    s += rect(x0 + 8, ty + h * 0.36, w - 16, h * 0.085, '#0a1012', 'rx="2"') + `<text x="${r1(cx)}" y="${r1(ty + h * 0.425)}" font-family="${SANS}" font-weight="600" font-size="${r1(h * 0.052)}" letter-spacing="0.5" fill="#f4b64e" text-anchor="middle">1A · STAR FERRY</text>`;
    s += rect(x0 + 5, ty + h * 0.48, w - 10, h * 0.27, '#17262a', 'rx="4"') + rect(x0 + 5, ty + h * 0.48, w - 10, h * 0.27, '#f3cd80', 'rx="4" opacity="0.3"');
    s += rect(x0, ty + h * 0.8, w, h * 0.2, '#a8322a', 'rx="5"');
    s += `<ellipse cx="${r1(x0 + w * 0.2)}" cy="${r1(ty + h * 0.89)}" rx="34" ry="24" fill="url(#hk-g-cream)"/><ellipse cx="${r1(x1 - w * 0.2)}" cy="${r1(ty + h * 0.89)}" rx="34" ry="24" fill="url(#hk-g-cream)"/>`;
    s += `<circle cx="${r1(x0 + w * 0.2)}" cy="${r1(ty + h * 0.89)}" r="${r1(w * 0.07)}" fill="#fff6d8"/><circle cx="${r1(x1 - w * 0.2)}" cy="${r1(ty + h * 0.89)}" r="${r1(w * 0.07)}" fill="#fff6d8"/>`;
    s += `<path d="M${r1(x0)},${r1(ty + h * 0.12)}h-9v${r1(h * 0.1)}M${r1(x1)},${r1(ty + h * 0.12)}h9v${r1(h * 0.1)}" stroke="#0a1012" stroke-width="3" fill="none"/>`;
    s += `<rect x="${r1(x0 + w * 0.12)}" y="${r1(gy + 5)}" width="${r1(w * 0.76)}" height="150" fill="url(#hk-rf-cream)" opacity="0.5"/>`;
  })();

  /* red taxi, going away from us on the left */
  (function () {
    const k = 0.84, cx = VX - 318 * k, W = 158 * k, H = 132 * k, gy = VY + EYE * k, x0 = cx - W / 2, t = gy - H;
    s += `<ellipse cx="${r1(cx)}" cy="${r1(gy + 3)}" rx="${r1(W * 0.6)}" ry="9" fill="#05090a" opacity="0.7"/>`;
    s += rect(x0 + W * 0.07, gy - H * 0.14, W * 0.17, H * 0.14, '#070b0c', 'rx="3"') + rect(x0 + W * 0.76, gy - H * 0.14, W * 0.17, H * 0.14, '#070b0c', 'rx="3"');
    s += poly([[x0 + W * 0.1, t + H * 0.44], [x0 + W * 0.2, t + H * 0.06], [x0 + W * 0.8, t + H * 0.06], [x0 + W * 0.9, t + H * 0.44]], '#b8251e');
    s += rect(x0 + W * 0.19, t + H * 0.03, W * 0.62, H * 0.075, '#cfd6d6', 'rx="3"');
    s += poly([[x0 + W * 0.17, t + H * 0.41], [x0 + W * 0.25, t + H * 0.13], [x0 + W * 0.75, t + H * 0.13], [x0 + W * 0.83, t + H * 0.41]], '#14252a');
    s += `<path d="M${r1(x0 + W * 0.3)},${r1(t + H * 0.38)}l${r1(W * 0.06)},${r1(-H * 0.22)}M${r1(x0 + W * 0.56)},${r1(t + H * 0.38)}l${r1(W * 0.05)},${r1(-H * 0.22)}" stroke="${NE.cyan}" stroke-width="3" opacity="0.4"/><path d="M${r1(x0 + W * 0.42)},${r1(t + H * 0.38)}l${r1(W * 0.05)},${r1(-H * 0.22)}" stroke="${NE.pink}" stroke-width="5" opacity="0.35"/>`;
    s += rect(x0, t + H * 0.4, W, H * 0.47, '#c92c23', `rx="${r1(H * 0.08)}"`) + rect(x0, t + H * 0.4, W, H * 0.12, '#e2473a', `rx="${r1(H * 0.06)}"`);
    s += rect(x0 + W * 0.02, t + H * 0.82, W * 0.96, H * 0.1, '#1b2224', 'rx="3"');
    s += `<ellipse cx="${r1(x0 + W * 0.13)}" cy="${r1(t + H * 0.57)}" rx="30" ry="20" fill="url(#hk-g-red)"/><ellipse cx="${r1(x0 + W * 0.87)}" cy="${r1(t + H * 0.57)}" rx="30" ry="20" fill="url(#hk-g-red)"/>`;
    s += rect(x0 + W * 0.04, t + H * 0.51, W * 0.2, H * 0.12, '#ff5a48', 'rx="2"') + rect(x0 + W * 0.76, t + H * 0.51, W * 0.2, H * 0.12, '#ff5a48', 'rx="2"');
    s += rect(cx - W * 0.16, t + H * 0.66, W * 0.32, H * 0.11, '#f2c84b', 'rx="1.5"') + `<text x="${r1(cx)}" y="${r1(t + H * 0.752)}" font-family="${SANS}" font-weight="600" font-size="${r1(H * 0.09)}" fill="#1b1b12" text-anchor="middle" letter-spacing="0.6">TX 8128</text>`;
    s += rect(cx - W * 0.11, t - H * 0.065, W * 0.22, H * 0.1, '#fbf3d6', 'rx="2"') + `<text x="${r1(cx)}" y="${r1(t + H * 0.012)}" font-family="${SANS}" font-weight="600" font-size="${r1(H * 0.075)}" fill="#b8251e" text-anchor="middle" letter-spacing="0.5">TAXI</text>`;
    s += `<rect x="${r1(x0 + W * 0.03)}" y="${r1(gy + 4)}" width="${r1(W * 0.22)}" height="120" fill="url(#hk-rf-red)"/><rect x="${r1(x0 + W * 0.75)}" y="${r1(gy + 4)}" width="${r1(W * 0.22)}" height="120" fill="url(#hk-rf-red)"/>`;
  })();

  /* people: heads on the horizon, umbrellas, no faces */
  function person(x, k, tone, um) {
    const hd = VY - 4 * k, ft = VY + EYE * k, w = 50 * k;
    let q = `<path d="M${r1(x - w * 0.5)},${r1(hd + 40 * k)}Q${r1(x - w * 0.56)},${r1(hd + 22 * k)} ${r1(x - w * 0.2)},${r1(hd + 20 * k)}L${r1(x + w * 0.2)},${r1(hd + 20 * k)}Q${r1(x + w * 0.56)},${r1(hd + 22 * k)} ${r1(x + w * 0.5)},${r1(hd + 40 * k)}L${r1(x + w * 0.36)},${r1(ft)}H${r1(x - w * 0.36)}Z" fill="${tone}"/><circle cx="${r1(x)}" cy="${r1(hd + 9 * k)}" r="${r1(10.5 * k)}" fill="${tone}"/>`;
    if (um) q += `<path d="M${r1(x - 58 * k)},${r1(hd - 14 * k)}Q${r1(x)},${r1(hd - 78 * k)} ${r1(x + 58 * k)},${r1(hd - 14 * k)}Z" fill="${tone}" stroke="${um}" stroke-width="${r1(1.2 + k)}" stroke-opacity="0.55"/><line x1="${r1(x + 6 * k)}" y1="${r1(hd - 14 * k)}" x2="${r1(x + 6 * k)}" y2="${r1(hd + 46 * k)}" stroke="${tone}" stroke-width="${r1(1.5 * k + 0.6)}"/>`;
    return q;
  }
  s += person(238, 0.62, '#0b1416', NE.amber) + person(276, 0.6, '#0d181a') + person(384, 0.4, '#13211f') + person(1236, 0.52, '#0b1416', NE.pink) + person(1198, 0.46, '#101c1d') + person(1126, 0.36, '#15262a') + person(668, 0.2, '#1b3033') + person(690, 0.18, '#1b3033');
  s += person(74, 1.56, '#05090b', NE.red) + person(1548, 1.5, '#05090b') + person(1462, 1.08, '#070c0e');

  s += rect(0, 0, 1600, 150, 'url(#hk-top)') + rect(0, 560, 1600, 340, 'url(#hk-bot)');
  return s + '</svg>';
};

/* =====================================================================
   FACTORY — a watch-case shop floor: CNC row, trays of cases, pad printer
   ===================================================================== */
S.factory = function (o) {
  o = o || {};
  const R = rng(316), VX = 820, VY = 400;
  const tt = x => (x + 30) / 850;
  const topY = x => 130 + (VY - 130) * tt(x), botY = x => 760 - (760 - VY) * tt(x);
  const ceilL = x => 20 + (VY - 20) * tt(x);
  const rT = x => 366 + (255 - 366) * ((x - 1010) / 620), rB = x => 432 + (536 - 432) * ((x - 1010) / 620);
  let s = OPEN + '<defs>';
  s += `<linearGradient id="factory-ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22302d"/><stop offset="1" stop-color="#5d706a"/></linearGradient>`;
  s += `<linearGradient id="factory-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d6cb"/><stop offset="0.35" stop-color="#a3b7aa"/><stop offset="1" stop-color="#6d8478"/></linearGradient>`;
  s += `<linearGradient id="factory-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dde4dc"/><stop offset="1" stop-color="#c3cdc5"/></linearGradient>`;
  s += `<radialGradient id="factory-lg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f4fff8" stop-opacity="0.7"/><stop offset="1" stop-color="#f4fff8" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="factory-sp" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#d6fff4" stop-opacity="0.95"/><stop offset="0.5" stop-color="#58c9b6" stop-opacity="0.35"/><stop offset="1" stop-color="#58c9b6" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="factory-gr" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6dffa2" stop-opacity="0.8"/><stop offset="1" stop-color="#6dffa2" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="factory-lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a0" stop-opacity="0.62"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></linearGradient>`;
  s += `<linearGradient id="factory-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d9a97"/><stop offset="0.45" stop-color="#eef3f1"/><stop offset="1" stop-color="#9aa6a3"/></linearGradient>`;
  s += `<linearGradient id="factory-pad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2a68c"/><stop offset="0.6" stop-color="#dc7458"/><stop offset="1" stop-color="#b9543d"/></linearGradient>`;
  s += `<linearGradient id="factory-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3fbfa"/><stop offset="1" stop-color="#cfe6e4"/></linearGradient>`;
  s += `<linearGradient id="factory-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1512" stop-opacity="0.7"/><stop offset="1" stop-color="#0d1512" stop-opacity="0"/></linearGradient>`;
  s += '</defs>';

  /* shell: ceiling, walls, floor */
  s += rect(0, 0, 1600, 900, '#5d706a');
  s += poly([[-30, 20], [745, ceilL(745)], [1010, 366], [1630, 255], [1630, -10], [-30, -10]], 'url(#factory-ceil)');
  s += poly([[-30, 20], [745, ceilL(745)], [745, topY(745)], [-30, 130]], '#cdd6ce');
  s += poly([[1010, 366], [1630, 255], [1630, 536], [1010, 432]], 'url(#factory-wall)');
  s += rect(745, ceilL(745), 265, 432 - ceilL(745), '#d4dcd4');
  s += poly([[-30, 760], [745, 432], [1010, 432], [1630, 536], [1630, 900], [-30, 900]], 'url(#factory-floor)');
  // ceiling beams and ducts
  [0.08, 0.3, 0.48, 0.62, 0.73, 0.82].forEach(t => { const xl = -30 + 775 * t / 0.912, yl = ceilL(xl), xr = 1630 - 620 * t / 0.912 * 1, yr = 255 + (366 - 255) * (t / 0.912); s += `<line x1="${r1(xl)}" y1="${r1(yl)}" x2="${r1(xr)}" y2="${r1(yr)}" stroke="#18231f" stroke-width="${r1(9 * (1 - t))}" opacity="0.5"/>`; });
  // back wall: door, banner, clock
  s += rect(770, 396, 34, 36, '#9fb0a8') + rect(820, 376, 150, 16, '#f1f4ee') + `<text x="895" y="388" font-family="${SANS}" font-weight="600" font-size="9" letter-spacing="2.4" fill="#1f3a32" text-anchor="middle">PRECISION · PATIENCE</text>`;
  s += `<circle cx="988" cy="410" r="9" fill="#f6f7f2" stroke="#1f3a32" stroke-width="1.8"/><path d="M988,410v-5.5M988,410l4,2" stroke="#1f3a32" stroke-width="1.3" stroke-linecap="round"/>`;
  s += rect(826, 402, 60, 30, '#b7c4bc') + rect(892, 408, 40, 24, '#aebbb4');

  /* right wall: tall daylight windows, bins below */
  for (let i = 0; i < 6; i++) {
    const xa = 1034 + i * 100 + i * i * 2, xb = xa + 74 + i * 4;
    const q = (x, v) => [x, rT(x) + (rB(x) - rT(x)) * v];
    s += poly([q(xa, 0.1), q(xb, 0.1), q(xb, 0.6), q(xa, 0.6)], 'url(#factory-win)');
    const xm = (xa + xb) / 2; s += `<line x1="${r1(xm)}" y1="${r1(q(xm, 0.1)[1])}" x2="${r1(xm)}" y2="${r1(q(xm, 0.6)[1])}" stroke="#c3cdc5" stroke-width="3"/><line x1="${r1(xa)}" y1="${r1(q(xa, 0.35)[1])}" x2="${r1(xb)}" y2="${r1(q(xb, 0.35)[1])}" stroke="#c3cdc5" stroke-width="3"/>`;
    // light falling on the floor from each window
    s += poly([[xa - 40, rB(xa) + 26 + i * 8], [xb - 30, rB(xb) + 26 + i * 8], [xb - 150 - i * 20, rB(xb) + 70 + i * 22], [xa - 150 - i * 20, rB(xa) + 66 + i * 20]], '#f4fbf4', 'opacity="0.12"');
    for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) { const x0 = xa + j * (xb - xa + 22) / 3, x1 = x0 + (xb - xa) / 3.4; s += poly([q(x0, 0.7 + k * 0.095), q(x1, 0.7 + k * 0.095), q(x1, 0.775 + k * 0.095), q(x0, 0.775 + k * 0.095)], ['#2f6a60', '#8fa39b', '#c9a35a', '#2f6a60', '#6f8a82'][Math.floor(R() * 5)], 'opacity="0.8"'); }
  }

  /* fluorescent strips, their glow, and their reflections in the floor */
  [330, 900, 1480].forEach(xk => {
    let t = 0.04;
    for (let n = 0; n < 7; n++) {
      const len = (1 - t) * 0.2, ta = t, tb = t + len, w = 34;
      const pa = [xk + (VX - xk) * ta, -10 + (VY + 10) * ta * 0.93], pb = [xk + (VX - xk) * tb, -10 + (VY + 10) * tb * 0.93];
      const wa = w * (1 - ta), wb = w * (1 - tb);
      s += `<ellipse cx="${r1((pa[0] + pb[0]) / 2)}" cy="${r1((pa[1] + pb[1]) / 2 + 8)}" rx="${r1(120 * (1 - ta))}" ry="${r1(54 * (1 - ta))}" fill="url(#factory-lg)"/>`;
      s += poly([[pa[0] - wa / 2, pa[1]], [pa[0] + wa / 2, pa[1]], [pb[0] + wb / 2, pb[1]], [pb[0] - wb / 2, pb[1]]], '#f8fff8');
      // reflection
      const fa = [xk + (VX - xk) * ta, 910 - (910 - VY) * ta * 0.93], fb = [xk + (VX - xk) * tb, 910 - (910 - VY) * tb * 0.93];
      s += poly([[fa[0] - wa, fa[1]], [fa[0] + wa, fa[1]], [fb[0] + wb, fb[1]], [fb[0] - wb, fb[1]]], '#f4fff4', 'opacity="0.1"');
      t = tb + (1 - tb) * 0.1;
    }
  });
  // safety lines on the floor
  s += poly([[250, 910], [282, 910], [VX - 60, 436], [VX - 62, 436]], '#e3c14a', 'opacity="0.85"') + poly([[1130, 910], [1164, 910], [VX + 20, 436], [VX + 18, 436]], '#e3c14a', 'opacity="0.7"');

  /* the CNC row, far to near */
  s += poly([[-30, 130], [745, topY(745)], [745, botY(745)], [-30, 760]], '#243631');
  const XS = []; for (let i = 0; i <= 8; i++) XS.push(VX - 850 * Math.pow(0.775, i));
  for (let i = 7; i >= 0; i--) {
    const xa = XS[i] + (XS[i + 1] - XS[i]) * 0.05, xb = XS[i + 1], hz = i / 9;
    const H = botY(xa) - topY(xa);
    const q = (u, v) => { const x = xa + (xb - xa) * u; return [x, topY(x) + (botY(x) - topY(x)) * v]; };
    const Q = (u0, u1, v0, v1, fill, ex) => poly([q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)], fill, ex);
    const body = mix('#f0f2ec', '#c9d4cd', hz), teal = mix('#1f3a32', '#5d766e', hz), glass = mix('#132824', '#4d6862', hz);
    // floor shadow and reflection
    s += poly([q(0, 1), q(1, 1), [xb + H * 0.1, botY(xb) + H * 0.07], [xa + H * 0.16, botY(xa) + H * 0.1]], '#1c2a26', 'opacity="0.3"');
    s += Q(0, 1, 0, 1, body) + Q(0, 0.035, 0, 1, '#ffffff', 'opacity="0.55"') + Q(0.965, 1, 0, 1, '#000', 'opacity="0.1"');
    s += Q(0, 1, 0, 0.075, teal) + Q(0, 1, 0.86, 1, teal) + Q(0, 1, 0.832, 0.86, mix('#c9a35a', '#b9b08f', hz));
    // door with window
    s += Q(0.09, 0.66, 0.15, 0.72, mix('#e3e7e0', '#c2cdc6', hz)) + Q(0.15, 0.6, 0.21, 0.57, glass);
    const wc = q(0.375, 0.4);
    s += `<ellipse cx="${r1(wc[0])}" cy="${r1(wc[1])}" rx="${r1((xb - xa) * 0.2)}" ry="${r1(H * 0.15)}" fill="url(#factory-sp)" opacity="${r1(1 - hz * 0.6)}"/>`;
    s += Q(0.35, 0.4, 0.21, 0.36, mix('#aebfba', '#8fa39d', hz)) + Q(0.365, 0.385, 0.36, 0.42, '#e8f6f2');
    s += poly([q(0.2, 0.21), q(0.3, 0.21), q(0.2, 0.57), q(0.15, 0.57), q(0.15, 0.4)], '#fff', 'opacity="0.1"');
    s += Q(0.62, 0.64, 0.3, 0.54, mix('#6f807a', '#8fa39d', hz));
    // control panel
    s += Q(0.72, 0.95, 0.19, 0.6, mix('#22332f', '#5d766e', hz)) + Q(0.75, 0.92, 0.22, 0.38, mix('#0c1613', '#3d5650', hz));
    if (i < 5) {
      s += Q(0.77, 0.87, 0.245, 0.262, '#6dffa2', 'opacity="0.9"') + Q(0.77, 0.83, 0.285, 0.3, '#f4b64e', 'opacity="0.9"') + Q(0.77, 0.9, 0.325, 0.34, '#6dffa2', 'opacity="0.7"');
      for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) s += Q(0.76 + j * 0.04, 0.785 + j * 0.04, 0.42 + k * 0.035, 0.44 + k * 0.035, '#93a59f', 'opacity="0.8"');
      const e = q(0.835, 0.55); s += `<circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="${r1(H * 0.014)}" fill="#d9483a"/>`;
    }
    // machine number on the top band
    if (i < 4) { const lp = q(0.12, 0.052), ang = Math.atan(0.3176 - 0.052 * 0.7411) * 180 / Math.PI; s += `<text transform="translate(${r1(lp[0])},${r1(lp[1])}) skewY(${r1(ang)})" font-family="${SANS}" font-weight="600" font-size="${r1(H * 0.04)}" letter-spacing="${r1(H * 0.006)}" fill="#f1e9d6" opacity="0.92">CNC–0${i + 3}</text>`; }
    // stack light: red, amber, green (green lit)
    const tp = q(0.86, 0), tw = Math.max(3, H * 0.02), th = H * 0.03;
    s += rect(tp[0] - tw * 0.2, tp[1] - th * 1.2, tw * 0.4, th * 1.2, '#55665f');
    s += rect(tp[0] - tw / 2, tp[1] - th * 4.2, tw, th, '#7a3c34') + rect(tp[0] - tw / 2, tp[1] - th * 3.2, tw, th, '#8a7436') + rect(tp[0] - tw / 2, tp[1] - th * 2.2, tw, th, '#6dffa2');
    s += `<ellipse cx="${r1(tp[0])}" cy="${r1(tp[1] - th * 1.7)}" rx="${r1(tw * 3.4)}" ry="${r1(tw * 3.4)}" fill="url(#factory-gr)"/>`;
  }

  /* an operator at the far machines */
  (function () {
    const x = 612, fy = botY(x) + 6, h = 112;
    s += `<path d="M${x - 15},${fy}L${x - 17},${fy - h * 0.62}Q${x - 18},${fy - h * 0.8} ${x - 6},${fy - h * 0.82}L${x + 7},${fy - h * 0.82}Q${x + 18},${fy - h * 0.8} ${x + 17},${fy - h * 0.6}L${x + 14},${fy}Z" fill="#a9cbd4"/><path d="M${x + 6},${fy - h * 0.72}l-22,${r1(h * 0.16)}l3,6l22,-12z" fill="#a9cbd4"/>`;
    s += `<circle cx="${x}" cy="${r1(fy - h * 0.9)}" r="9" fill="#2a3b3a"/><path d="M${x - 10},${r1(fy - h * 0.93)}q10,-11 20,0z" fill="#f1e9d6"/>`;
    s += rect(x - 14, fy - h * 0.3, 28, h * 0.3, '#3a514f');
  })();

  /* a cart of trays: bare steel cases, fresh off the machines */
  (function () {
    const x0 = 436, x1 = 690;
    s += rect(x0 - 4, 458, 7, 320, 'url(#factory-steel)') + rect(x1 - 3, 458, 7, 320, 'url(#factory-steel)');
    [[452, 506], [566, 624], [684, 746]].forEach((yy, k) => {
      const ya = yy[0], yb = yy[1], inset = 22;
      s += poly([[x0 - 8, yb], [x1 + 8, yb], [x1 + 8, yb + 9], [x0 - 8, yb + 9]], '#93a19d');
      s += poly([[x0 + inset, ya], [x1 - inset, ya], [x1 + 4, yb], [x0 - 4, yb]], '#17231f');
      for (let r = 0; r < 3; r++) {
        const v = (r + 0.5) / 3, y = ya + (yb - ya) * v, xl = x0 + inset * (1 - v) + 14, xr = x1 - inset * (1 - v) - 14, sc = 0.78 + v * 0.3;
        for (let c = 0; c < 7; c++) {
          const x = xl + (xr - xl) * c / 6, rx = 12.5 * sc, ry = 5.4 * sc;
          s += rect(x - rx * 0.42, y - ry * 1.55, rx * 0.84, ry * 3.1, '#8f9c99', `rx="${r1(ry * 0.4)}"`);
          s += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="url(#factory-steel)"/><ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx * 0.68)}" ry="${r1(ry * 0.66)}" fill="#17231f"/>`;
          if (R() < 0.42) s += `<path d="M${r1(x - rx * 0.6)},${r1(y - ry * 0.8)}h${r1(rx * 0.5)}" stroke="#fff" stroke-width="${r1(1.6 * sc)}" stroke-linecap="round" opacity="0.95"/>`;
          if (k === 0 && R() < 0.2) s += `<path d="M${r1(x + rx * 0.5)},${r1(y - ry * 2.2)}v${r1(ry * 2.4)}M${r1(x + rx * 0.5 - ry * 1.2)},${r1(y - ry)}h${r1(ry * 2.4)}" stroke="#fff" stroke-width="1.1" opacity="0.9"/>`;
        }
      }
    });
  })();

  /* right foreground: the pad-printing station */
  (function () {
    // bench
    s += poly([[1058, 598], [1640, 598], [1640, 652], [1016, 652]], '#d9ddd3') + rect(1016, 652, 630, 250, '#8e9b93') + rect(1016, 652, 630, 9, '#b7c1b9');
    s += rect(1060, 661, 16, 250, '#6f7d76') + rect(1100, 684, 230, 60, '#84928a', 'rx="3"') + rect(1190, 708, 50, 6, '#6f7d76', 'rx="3"') + rect(1350, 684, 230, 60, '#84928a', 'rx="3"') + rect(1440, 708, 50, 6, '#6f7d76', 'rx="3"');
    // tray of blank dials (left of the machine)
    s += poly([[1070, 610], [1196, 610], [1186, 640], [1052, 640]], '#17231f');
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const x = 1082 + c * 24 - r * 6 + (r ? 4 : 0), y = 618 + r * 13; s += `<ellipse cx="${x}" cy="${y}" rx="9.5" ry="4.2" fill="#f4f1e6"/><ellipse cx="${x - 2}" cy="${y - 1}" rx="5" ry="1.6" fill="#fff" opacity="0.7"/>`; if (r === 1 && c < 2) s += `<path d="M${x - 3.4},${y - 1.2}h6.8" stroke="#22302c" stroke-width="0.9"/>`; }
    // tray of cases (right of the machine)
    s += poly([[1476, 608], [1600, 608], [1612, 640], [1470, 640]], '#17231f');
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const x = 1492 + c * 25 + r * 3, y = 617 + r * 13; s += rect(x - 4.5, y - 7, 9, 14, '#8f9c99', 'rx="2"') + `<ellipse cx="${x}" cy="${y}" rx="10.5" ry="4.6" fill="url(#factory-steel)"/><ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="#17231f"/>`; if ((r + c) % 2 === 0) s += `<path d="M${x - 7},${y - 3.2}h6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`; }
    // task lamp and its pool of warm light on the jig
    s += poly([[1150, 352], [1204, 336], [1340, 500], [1206, 514]], 'url(#factory-lamp)');
    s += `<path d="M1108,600V480Q1108,318 1156,322" fill="none" stroke="#2a3b37" stroke-width="7" stroke-linecap="round"/>` + rect(1088, 592, 42, 10, '#2a3b37', 'rx="3"');
    s += `<path d="M1142,312l50,-14l14,36l-56,20z" fill="#c9a35a"/><path d="M1150,354l56,-20l2,6l-56,20z" fill="#fff3c8"/>`;
    // machine: base, column, head
    s += rect(1206, 524, 262, 76, '#eceee8', 'rx="6"') + rect(1206, 562, 262, 38, '#1f3a32', 'rx="6"') + rect(1206, 556, 262, 8, '#c9a35a');
    s += `<circle cx="1234" cy="581" r="9" fill="#58e08f"/><circle cx="1234" cy="581" r="13" fill="none" stroke="#0f1a17" stroke-width="2"/><circle cx="1440" cy="581" r="9" fill="#58e08f"/><circle cx="1440" cy="581" r="13" fill="none" stroke="#0f1a17" stroke-width="2"/><circle cx="1337" cy="581" r="8" fill="#d9483a"/>`;
    s += `<ellipse cx="1234" cy="581" rx="26" ry="26" fill="url(#factory-gr)" opacity="0.6"/><ellipse cx="1440" cy="581" rx="26" ry="26" fill="url(#factory-gr)" opacity="0.6"/>`;
    s += rect(1386, 196, 66, 330, '#e2e6df') + rect(1386, 196, 10, 330, '#fff', 'opacity="0.6"') + rect(1440, 196, 12, 330, '#000', 'opacity="0.1"');
    s += rect(1218, 188, 240, 76, '#eceee8', 'rx="10"') + rect(1218, 244, 240, 20, '#1f3a32', 'rx="6"') + rect(1218, 238, 240, 7, '#c9a35a');
    s += rect(1334, 204, 104, 24, '#c9a35a', 'rx="2"') + `<text x="1386" y="221" font-family="${SANS}" font-weight="600" font-size="12" letter-spacing="2.2" fill="#1f3a32" text-anchor="middle">TAMPO 90</text>`;
    // pneumatic cylinder and air line
    s += rect(1262, 128, 38, 62, 'url(#factory-steel)', 'rx="4"') + rect(1256, 122, 50, 10, '#55665f', 'rx="3"') + rect(1256, 182, 50, 10, '#55665f', 'rx="3"');
    s += `<path d="M1281,122C1281,80 1360,70 1404,104S1420,170 1420,196" fill="none" stroke="#2f7f8f" stroke-width="5" stroke-linecap="round"/>`;
    // pad shaft, holder and the silicone pad
    s += rect(1273, 264, 16, 70, 'url(#factory-steel)') + rect(1246, 330, 70, 18, '#2a3b37', 'rx="4"');
    s += `<path d="M1250,348H1312Q1318,392 1292,424Q1281,436 1270,424Q1244,392 1250,348Z" fill="url(#factory-pad)"/><path d="M1260,354Q1258,386 1272,408" fill="none" stroke="#ffd9c8" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
    // slide, jig and one blank dial waiting under the pad
    s += rect(1214, 506, 172, 12, 'url(#factory-steel)', 'rx="3"') + rect(1250, 488, 62, 20, '#2a3b37', 'rx="4"');
    s += `<ellipse cx="1281" cy="487" rx="25" ry="8" fill="#b9c2bf"/><ellipse cx="1281" cy="485.5" rx="22" ry="6.8" fill="#f6f3ea"/><ellipse cx="1275" cy="483.5" rx="11" ry="2.6" fill="#fff" opacity="0.85"/>`;
    // cliché plate and ink cup
    s += rect(1322, 498, 62, 9, '#cfd6d3', 'rx="2"') + rect(1334, 462, 40, 37, '#17231f', 'rx="5"') + rect(1334, 470, 40, 6, '#c9a35a') + `<ellipse cx="1354" cy="462" rx="20" ry="5" fill="#2a3b37"/>`;
  })();

  s += rect(0, 0, 1600, 120, 'url(#factory-top)');
  return s + '</svg>';
};

/* =====================================================================
   LA CHAUX-DE-FONDS — snow, blue dusk, the long factory on the left
   ===================================================================== */
S.chaux = function (o) {
  o = o || {};
  const R = rng(1976), VX = 860, VY = 352;
  const sOf = x => Math.abs(x - VX) / 780;
  const gY = x => VY + 308 * sOf(x);                    // ground line of the street walls
  const eY = (x, hf) => VY - 152 * (hf || 1) * sOf(x);  // eaves line
  const WARM = ['#f6c56f', '#ffdc96', '#f2b25c'];
  let s = OPEN + '<defs>';
  s += `<linearGradient id="chaux-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1929"/><stop offset="0.13" stop-color="#1a3352"/><stop offset="0.23" stop-color="#3b5d86"/><stop offset="0.3" stop-color="#7089ad"/><stop offset="0.39" stop-color="#8291b2"/><stop offset="0.44" stop-color="#c7aaa6"/><stop offset="1" stop-color="#c7aaa6"/></linearGradient>`;
  s += `<linearGradient id="chaux-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d7c9c"/><stop offset="1" stop-color="#a7bdd2"/></linearGradient>`;
  s += `<linearGradient id="chaux-street" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3d2e0"/><stop offset="0.4" stop-color="#93abc3"/><stop offset="1" stop-color="#4e6c8a"/></linearGradient>`;
  s += `<linearGradient id="chaux-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb6cc"/><stop offset="1" stop-color="#3c5874"/></linearGradient>`;
  s += `<linearGradient id="chaux-fac" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c4258"/><stop offset="1" stop-color="#4a627a"/></linearGradient>`;
  s += `<linearGradient id="chaux-roof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dbe6ef"/><stop offset="1" stop-color="#a9bdd0"/></linearGradient>`;
  s += `<radialGradient id="chaux-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.85"/><stop offset="0.4" stop-color="#f6b65a" stop-opacity="0.28"/><stop offset="1" stop-color="#f6b65a" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="chaux-smoke" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#c9d5e2" stop-opacity="0.5"/><stop offset="1" stop-color="#c9d5e2" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="chaux-bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1929" stop-opacity="0"/><stop offset="1" stop-color="#0d1929" stop-opacity="0.75"/></linearGradient>`;
  s += '</defs>';

  /* sky, stars, ridges */
  s += rect(0, 0, 1600, 900, 'url(#chaux-sky)');
  for (let i = 0; i < 22; i++) s += `<circle cx="${r1(R() * 1600)}" cy="${r1(R() * 150)}" r="${r1(0.6 + R() * 0.9)}" fill="#e9f0f7" opacity="${r1(0.25 + R() * 0.5)}"/>`;
  const yR = x => 208 + 0.055 * Math.abs(x - 520) + 9 * Math.sin(x / 90);
  s += `<path d="M0,270C260,222 420,250 700,236S1240,262 1600,226V420H0Z" fill="#4c6a8c" opacity="0.7"/>`;
  function firs(dy, step, hmin, hmax, fill) {
    let d = `M-10,460L-10,${r1(yR(-10) + dy)}`;
    for (let x = -10; x < 1612; x += step) { const b = yR(x) + dy, h = hmin + R() * (hmax - hmin); d += `L${r1(x + step * 0.5)},${r1(b - h)}L${r1(x + step)},${r1(yR(x + step) + dy)}`; }
    return `<path d="${d}L1612,460Z" fill="${fill}"/>`;
  }
  s += firs(-16, 13, 8, 20, '#2b4864') + firs(0, 17, 12, 30, '#14262b');
  /* the snowy hillside the town climbs, and its upper streets */
  s += `<path d="M0,304C300,268 560,262 860,268S1380,286 1600,318V480H0Z" fill="url(#chaux-hill)"/>`;
  for (let i = 0; i < 46; i++) { const x = 80 + R() * 1440, y = 262 + R() * 26 + Math.abs(x - 860) * 0.03, h = 10 + R() * 16; s += poly([[x - h * 0.34, y], [x, y - h], [x + h * 0.34, y]], '#14262b', 'opacity="0.9"'); }
  s += poly([[851, VY], [871, VY], [863, 282], [859, 282]], '#d6e2ec');
  for (let k = 0; k < 5; k++) {
    const y = 349 - k * 14, half = 330 - k * 34, gap = 11 - k * 1.7, hb = 11 - k * 1.2, sc = 1 - k * 0.14;
    let x = VX - half;
    while (x < VX + half) {
      const w = (22 + R() * 16) * sc;
      if (x + w < VX - gap || x > VX + gap) {
        s += rect(x, y - hb, w, hb, mix('#27405a', '#4f6d8d', k / 6));
        s += poly([[x - 1.5, y - hb], [x + w + 1.5, y - hb], [x + w - 3 * sc, y - hb - 6.5 * sc], [x + 3 * sc, y - hb - 6.5 * sc]], mix('#d3e0eb', '#a5bbd0', k / 5));
        for (let c = 0; c < 2; c++) if (R() < 0.5) s += rect(x + 3 * sc + c * (w - 6) / 2, y - hb * 0.7, 2 * sc + 0.4, 2.6 * sc + 0.4, WARM[Math.floor(R() * 3)], 'opacity="0.9"');
      }
      x += w + (3 + R() * 5) * sc;
    }
    s += `<circle cx="${r1(VX - gap - 2)}" cy="${r1(y - hb - 2)}" r="${r1(1.6 * sc + 0.4)}" fill="#ffe2a0"/><ellipse cx="${r1(VX - gap - 2)}" cy="${r1(y - hb - 2)}" rx="${r1(11 * sc)}" ry="${r1(11 * sc)}" fill="url(#chaux-glow)" opacity="0.7"/>`;
  }

  /* church tower, behind the right-hand roofs */
  s += rect(1216, 166, 48, 200, '#22384f') + rect(1216, 166, 15, 200, '#3b5672');
  s += poly([[1208, 168], [1272, 168], [1240, 88]], '#1d3248') + poly([[1208, 168], [1240, 168], [1240, 88]], '#c9d7e4', 'opacity="0.8"');
  s += `<path d="M1240,88v-15M1234,78h12" stroke="#1d3248" stroke-width="2.4"/>`;
  s += rect(1228, 176, 9, 20, '#101e2e', 'rx="4"') + rect(1243, 176, 9, 20, '#101e2e', 'rx="4"');
  s += `<ellipse cx="1240" cy="222" rx="34" ry="34" fill="url(#chaux-glow)" opacity="0.6"/><circle cx="1240" cy="222" r="14" fill="#f6ebcf"/><circle cx="1240" cy="222" r="14" fill="none" stroke="#101e2e" stroke-width="2"/><path d="M1240,222v-9M1240,222l7,4" stroke="#101e2e" stroke-width="2" stroke-linecap="round"/>`;

  /* street walls. One function for both sides: xn = near edge, xf = far edge */
  function block(xn, xf, hf, col, endCol, roofH, floors, opt) {
    opt = opt || {};
    const left = xn < VX; let b = '';
    const q = (x, v) => [x, eY(x, hf) + (gY(x) - eY(x, hf)) * v];
    // end face toward the viewer, then roof, then street face
    const ex = left ? Math.max(-30, xn - 300) : xn, ew = left ? xn - ex : Math.min(1640, xn + 300) - xn;
    b += rect(ex, eY(xn, hf), ew, gY(xn) - eY(xn, hf), endCol);
    b += poly([[left ? ex : xn, eY(xn, hf)], [left ? xn : xn + ew, eY(xn, hf)], [(left ? xn : xn + ew) - (left ? 0.5 : 0.5) * ew, eY(xn, hf) - roofH * sOf(xn) * 1.25], [(left ? ex : xn) + 0.5 * ew, eY(xn, hf) - roofH * sOf(xn) * 1.25]], '#b4c6d8');
    b += poly([[xn, eY(xn, hf) + 2], [xf, eY(xf, hf) + 2], [xf, eY(xf, hf) - roofH * sOf(xf)], [xn, eY(xn, hf) - roofH * sOf(xn)]], 'url(#chaux-roof)');
    b += poly([q(xn, 0), q(xf, 0), q(xf, 1), q(xn, 1)], col);
    b += poly([q(xn, 0.9), q(xf, 0.9), q(xf, 1), q(xn, 1)], '#0d1929', 'opacity="0.18"');
    if (opt.plain) return b;
    const z0 = 1 / sOf(xn), z1 = 1 / Math.max(0.02, sOf(xf)), n = Math.min(opt.bays || Math.max(2, Math.round((z1 - z0) / 0.105)), Math.max(2, Math.floor(Math.abs(xf - xn) / 12)));
    const X = z => left ? VX - 780 / z : VX + 780 / z;
    for (let f = 0; f < floors; f++) {
      const v0 = 0.08 + f * (0.86 / floors), v1 = v0 + (0.86 / floors) * 0.62;
      for (let c = 0; c < n; c++) {
        const xa = X(z0 + (z1 - z0) * (c + 0.24) / n), xb = X(z0 + (z1 - z0) * (c + 0.76) / n), big = sOf(xa) > 0.3;
        const lit = R() < (opt.lit != null ? opt.lit : 0.3);
        b += poly([q(xa, v0), q(xb, v0), q(xb, v1), q(xa, v1)], lit ? WARM[Math.floor(R() * 3)] : '#14263a', lit ? 'opacity="0.95"' : 'opacity="0.85"');
        if (!lit && big) b += poly([q(xa, v0), q(xb, v0), q(xb, v0 + (v1 - v0) * 0.35), q(xa, v0 + (v1 - v0) * 0.35)], '#6b89a8', 'opacity="0.35"');
        if (big) b += `<line x1="${r1(xa)}" y1="${r1(q(xa, v1)[1])}" x2="${r1(xb)}" y2="${r1(q(xb, v1)[1])}" stroke="#dbe6ef" stroke-width="${r1(1 + sOf(xa) * 2.2)}" opacity="0.8"/>`;
      }
    }
    // chimneys with snow caps
    for (let c = 0; c < (opt.chim || 1); c++) { const x = xn + (xf - xn) * (0.3 + c * 0.4), k = sOf(x), y = eY(x, hf) - roofH * k * 0.75; b += rect(x - 6 * k, y - 34 * k, 16 * k, 36 * k, '#1c3046') + rect(x - 8 * k, y - 38 * k, 20 * k, 6 * k, '#e3ecf3'); }
    return b;
  }
  const BR = [[1640, 1352, 1.0, '#213851', 4], [1332, 1196, 1.14, '#27415c', 4], [1180, 1086, 0.94, '#2d4966', 3], [1074, 1010, 1.06, '#33516f', 4], [1002, 962, 0.9, '#3a5978', 3], [956, 926, 1.0, '#41617f', 3], [922, 902, 0.9, '#496a88', 2]];
  const BL = [[668, 742, 1.02, '#2d4966', 3], [752, 800, 0.9, '#35536f', 3], [806, 834, 1.0, '#41617f', 2]];
  for (let i = BR.length - 1; i >= 0; i--) s += block(BR[i][0], BR[i][1], BR[i][2], BR[i][3], mix(BR[i][3], '#0d1929', 0.25), 62, BR[i][4], { chim: i < 3 ? 2 : 1 });
  for (let i = BL.length - 1; i >= 0; i--) s += block(BL[i][0], BL[i][1], BL[i][2], BL[i][3], mix(BL[i][3], '#0d1929', 0.25), 62, BL[i][4]);

  /* ground and the street climbing to the crest */
  s += poly([[-20, gY(-20)], [VX, VY], [1620, gY(1620)], [1620, 900], [-20, 900]], 'url(#chaux-ground)');
  s += poly([[560, 900], [1150, 900], [872, VY], [850, VY]], 'url(#chaux-street)');
  s += `<path d="M770,900L857,${VY}M936,900L865,${VY}" stroke="#3f5d7c" stroke-width="7" opacity="0.3" fill="none"/><path d="M800,900L858.5,${VY}M906,900L863.5,${VY}" stroke="#e6eef5" stroke-width="5" opacity="0.25" fill="none"/>`;
  /* the factory: one long wall of tall windows, running up the street */
  (function () {
    const xn = -40, xf = 640, hf = 1.0, z0 = 1 / sOf(xn), z1 = 1 / sOf(xf), bays = 20;
    const X = z => VX - 780 / z, Z = i => z0 + (z1 - z0) * i / bays;
    const q = (x, v) => [x, eY(x, hf) + (gY(x) - eY(x, hf)) * v];
    const roofY = (x, t) => eY(x, hf) - 66 * sOf(x) * t;
    // end wall beyond the far corner (toward the cross street) and roof
    s += poly([[xn, roofY(xn, 1)], [xf, roofY(xf, 1)], [xf, eY(xf, hf) + 2], [xn, eY(xn, hf) + 2]], 'url(#chaux-roof)');
    s += `<line x1="${xn}" y1="${r1(roofY(xn, 1))}" x2="${xf}" y2="${r1(roofY(xf, 1))}" stroke="#f1f6fa" stroke-width="3"/>`;
    // skylights in the roof: one of them is lit
    for (let i = 2; i < bays; i += 3) {
      const xa = X(Z(i + 0.2)), xb = X(Z(i + 0.8)), lit = i === 5;
      if (lit) s += `<ellipse cx="${r1((xa + xb) / 2)}" cy="${r1(roofY(xa, 0.5))}" rx="${r1(70 * sOf(xa))}" ry="${r1(54 * sOf(xa))}" fill="url(#chaux-glow)"/>`;
      s += poly([[xa, roofY(xa, 0.78)], [xb, roofY(xb, 0.78)], [xb, roofY(xb, 0.24)], [xa, roofY(xa, 0.24)]], lit ? '#ffd98a' : '#3b556f');
      s += poly([[xa - 2, roofY(xa, 0.78)], [xb + 2, roofY(xb, 0.78)], [xb + 2, roofY(xb, 0.88)], [xa - 2, roofY(xa, 0.88)]], '#f1f6fa');
    }
    // chimney stack
    (function () { const x = X(Z(9.5)), k = sOf(x), y = roofY(x, 0.9); s += rect(x - 14 * k, y - 150 * k, 34 * k, 152 * k, '#2a3f55') + rect(x - 14 * k, y - 150 * k, 10 * k, 152 * k, '#4a627a') + rect(x - 17 * k, y - 158 * k, 40 * k, 10 * k, '#e3ecf3'); })();
    // facade
    s += poly([q(xn, 0), q(xf, 0), q(xf, 1), q(xn, 1)], 'url(#chaux-fac)');
    s += poly([q(xn, 0), q(xf, 0), q(xf, 0.035), q(xn, 0.035)], '#5c748c') + poly([q(xn, 0.9), q(xf, 0.9), q(xf, 1), q(xn, 1)], '#22364b');
    s += poly([q(xn, 0.305), q(xf, 0.305), q(xf, 0.36), q(xn, 0.36)], '#51697f', 'opacity="0.55"') + poly([q(xn, 0.6), q(xf, 0.6), q(xf, 0.628), q(xn, 0.628)], '#51697f', 'opacity="0.5"');
    // ghost lettering on the frieze, receding with the wall
    if (o.sign !== false) {
      const word = 'FABRIQUE  CORÉMONT';
      for (let k = 0; k < word.length; k++) { if (word[k] === ' ') continue; const z = Z(2.5 + k * 0.47), x = X(z), kk = sOf(x); s += `<text x="${r1(x)}" y="${r1(q(x, 0.3325)[1] + 8.5 * kk)}" font-family="${SERIF}" font-weight="600" font-size="${r1(25 * kk)}" fill="#e9eef2" opacity="${r1(0.2 + (k % 3) * 0.05)}" text-anchor="middle">${word[k]}</text>`; }
    }
    // three rows of tall windows
    const LIT = { '1-2': 1, '1-3': 1, '0-11': 1, '0-12': 1, '2-8': 1, '1-15': 1, '2-17': 1, '0-5': 1 };
    const ROWS = [[0.07, 0.275], [0.385, 0.585], [0.655, 0.87]];
    for (let f = 0; f < 3; f++) for (let i = 0; i < bays; i++) {
      if (f === 2 && i === 6) continue; // the door
      const xa = X(Z(i + 0.2)), xb = X(Z(i + 0.8)), v0 = ROWS[f][0], v1 = ROWS[f][1], lit = LIT[f + '-' + i], kk = sOf(xa);
      if (xb < -10) continue;
      if (lit) s += `<ellipse cx="${r1((xa + xb) / 2)}" cy="${r1(q(xa, (v0 + v1) / 2)[1])}" rx="${r1(120 * kk)}" ry="${r1(120 * kk)}" fill="url(#chaux-glow)" opacity="0.55"/>`;
      s += poly([q(xa, v0), q(xb, v0), q(xb, v1), q(xa, v1)], lit ? WARM[i % 3] : '#17293c');
      if (!lit && kk > 0.3) s += poly([q(xa, v0), q(xb, v0), q(xb, v0 + (v1 - v0) * 0.3), q(xa, v0 + (v1 - v0) * 0.45)], '#7391b0', 'opacity="0.32"');
      if (kk > 0.36) { // glazing bars on the nearer windows
        const xm = (xa + xb) / 2, bc = lit ? '#8a5a22' : '#2e4760';
        s += `<line x1="${r1(xm)}" y1="${r1(q(xm, v0)[1])}" x2="${r1(xm)}" y2="${r1(q(xm, v1)[1])}" stroke="${bc}" stroke-width="${r1(1 + kk * 2)}"/>`;
        [0.25, 0.5, 0.75].forEach(t => { const v = v0 + (v1 - v0) * t; s += `<line x1="${r1(xa)}" y1="${r1(q(xa, v)[1])}" x2="${r1(xb)}" y2="${r1(q(xb, v)[1])}" stroke="${bc}" stroke-width="${r1(0.8 + kk * 1.6)}"/>`; });
      }
      s += `<line x1="${r1(xa - 2 * kk)}" y1="${r1(q(xa, v1)[1])}" x2="${r1(xb + 2 * kk)}" y2="${r1(q(xb, v1)[1])}" stroke="#e9f0f6" stroke-width="${r1(1.2 + kk * 3)}" opacity="0.9"/>`;
    }
    // the door, its lamp, and the light it puts on untrodden snow
    const da = X(Z(6.1)), db = X(Z(6.9)), dk = sOf(da), dm = (da + db) / 2;
    s += `<ellipse cx="${r1(dm + 10)}" cy="${r1(gY(dm) + 16)}" rx="${r1(190 * dk)}" ry="${r1(52 * dk)}" fill="url(#chaux-glow)" opacity="0.75"/>`;
    s += poly([q(da, 0.67), q(db, 0.67), q(db, 1), q(da, 1)], '#101e2e');
    s += poly([q(da + 3, 0.7), q(db - 3, 0.7), q(db - 3, 0.99), q(da + 3, 0.99)], '#3a2a1c');
    s += poly([q(da - 6, 0.64), q(db + 6, 0.64), q(db + 6, 0.67), q(da - 6, 0.67)], '#e9f0f6');
    s += `<ellipse cx="${r1(dm)}" cy="${r1(q(dm, 0.6)[1])}" rx="${r1(110 * dk)}" ry="${r1(110 * dk)}" fill="url(#chaux-glow)"/><circle cx="${r1(dm)}" cy="${r1(q(dm, 0.6)[1])}" r="${r1(9 * dk)}" fill="#fff0c4"/>`;
    // snow drifted against the wall
    let d = `M${xn},${r1(gY(xn) + 30)}`; for (let i = 0; i <= 20; i++) { const x = xn + (xf - xn) * i / 20; d += `L${r1(x)},${r1(gY(x) - (4 + 9 * R()) * sOf(x))}`; } s += `<path d="${d}L${xf + 20},${r1(gY(xf) + 8)}L${xn},${r1(gY(xn) + 60)}Z" fill="#c3d2e0"/>`;
  })();

  /* street lamps climbing with the street */
  function lamp(x, y, k) {
    const h = 230 * k;
    return `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(120 * k + 6)}" ry="${r1(28 * k + 2)}" fill="url(#chaux-glow)" opacity="0.6"/><line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x)}" y2="${r1(y - h)}" stroke="#101e2e" stroke-width="${r1(1 + 5 * k)}"/><path d="M${r1(x - 13 * k)},${r1(y - h)}h${r1(26 * k)}l${r1(-5 * k)},${r1(-20 * k)}h${r1(-16 * k)}z" fill="#101e2e"/><ellipse cx="${r1(x)}" cy="${r1(y - h - 6 * k)}" rx="${r1(80 * k + 8)}" ry="${r1(80 * k + 8)}" fill="url(#chaux-glow)"/><circle cx="${r1(x)}" cy="${r1(y - h - 7 * k)}" r="${r1(7 * k + 0.8)}" fill="#fff0c4"/><rect x="${r1(x - 14 * k)}" y="${r1(y - h - 24 * k)}" width="${r1(28 * k)}" height="${r1(5 * k)}" fill="#e9f0f6"/>`;
  }
  [0.9, 0.82, 0.7, 0.54].forEach(t => { s += lamp(560 + 290 * t - 26 * (1 - t), 900 - 548 * t, (1 - t) * 1.25); s += lamp(1150 - 278 * t + 26 * (1 - t), 900 - 548 * t, (1 - t) * 1.25); });
  s += lamp(1196, 640, 1.02);

  /* chimney smoke, drifting */
  [[X9(), 170, 0.9], [1444, 176, 0.75], [1292, 212, 0.5], [1153, 264, 0.36]].forEach((c, i) => {
    let g = '';
    for (let k = 0; k < 5; k++) g += `<ellipse cx="${r1(c[0] + k * 10 * c[2] + k * k * 7 * c[2])}" cy="${r1(c[1] - k * 30 * c[2])}" rx="${r1((20 + k * 12) * c[2])}" ry="${r1((16 + k * 8) * c[2])}" fill="url(#chaux-smoke)" opacity="${r1(0.85 - k * 0.15)}"/>`;
    s += `<g>${g}<animateTransform attributeName="transform" type="translate" values="0,0;${r1(10 * c[2])},${r1(-6 * c[2])};0,0" dur="${9 + i * 2}s" repeatCount="indefinite"/></g>`;
  });
  function X9() { const z0 = 1 / sOf(-40), z1 = 1 / sOf(640); return VX - 780 / (z0 + (z1 - z0) * 9.5 / 20) + 4; }

  /* foreground drifts */
  s += `<path d="M0,742C200,700 420,760 640,742S1080,704 1300,744S1520,730 1600,716V900H0Z" fill="#35506c" opacity="0.7"/>`;
  s += rect(0, 600, 1600, 300, 'url(#chaux-bot)');

  /* falling snow */
  let fl = '';
  for (let i = 0; i < 58; i++) {
    const x = R() * 1640 - 20, r = 0.9 + R() * 2.4, dur = 9 + R() * 12, dx = 30 + R() * 70, op = 0.35 + R() * 0.55;
    fl += `<circle cx="${r1(x)}" cy="-10" r="${r1(r)}" fill="#f4f8fb" opacity="${r1(op)}"><animateTransform attributeName="transform" type="translate" from="0 0" to="${r1(dx)} 930" dur="${r1(dur)}s" begin="${r1(-R() * dur)}s" repeatCount="indefinite"/></circle>`;
  }
  s += `<g>${fl}</g>`;
  return s + '</svg>';
};

/* =====================================================================
   ATTIC — under the factory roof: trusses, one skylight, twelve boxes
   ===================================================================== */
S.attic = function (o) {
  o = o || {};
  const open = o.open !== false;
  const R = rng(144), VX = 800, VY = 400, EYE = 250, W = 720, KNEE = 150, RIDGE = 820;
  const P = (X, Yh, k) => [VX + X * k, VY + (EYE - Yh) * k];
  const roof = t => [W * (1 - t), KNEE + (RIDGE - KNEE) * t];           // point on the right roof slope (mirror X for left)
  const FAR = 0.22, NEAR = 2.2;
  let s = OPEN + '<defs>';
  s += `<linearGradient id="attic-roofL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17110c"/><stop offset="1" stop-color="#4a3a2a"/></linearGradient>`;
  s += `<linearGradient id="attic-roofR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#1c150f"/><stop offset="1" stop-color="#55432f"/></linearGradient>`;
  s += `<linearGradient id="attic-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a563f"/><stop offset="0.3" stop-color="#4a3a2a"/><stop offset="1" stop-color="#1c140e"/></linearGradient>`;
  s += `<linearGradient id="attic-shaft" gradientUnits="userSpaceOnUse" x1="1200" y1="120" x2="590" y2="570"><stop offset="0" stop-color="#eef4f2" stop-opacity="0.5"/><stop offset="0.6" stop-color="#eef0e4" stop-opacity="0.2"/><stop offset="1" stop-color="#f1e9d6" stop-opacity="0.1"/></linearGradient>`;
  s += `<radialGradient id="attic-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e6f0f2" stop-opacity="0.6"/><stop offset="1" stop-color="#e6f0f2" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="attic-gleam" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffdf9e" stop-opacity="0.85"/><stop offset="0.45" stop-color="#e8b860" stop-opacity="0.3"/><stop offset="1" stop-color="#e8b860" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="attic-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f4eeda" stop-opacity="0.5"/><stop offset="1" stop-color="#f4eeda" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="attic-sheet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a59c88"/><stop offset="1" stop-color="#4a4337"/></linearGradient>`;
  s += `<linearGradient id="attic-bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0906" stop-opacity="0"/><stop offset="1" stop-color="#0c0906" stop-opacity="0.8"/></linearGradient>`;
  s += `<linearGradient id="attic-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0906" stop-opacity="0.8"/><stop offset="1" stop-color="#0c0906" stop-opacity="0"/></linearGradient>`;
  s += '</defs>';
  s += rect(0, 0, 1600, 900, '#120d09');

  /* shell: roof planes, knee walls, gable, floor */
  const rf = t => roof(t), ridgeF = P(0, RIDGE, FAR), ridgeN = P(0, RIDGE, NEAR);
  s += poly([P(-W, KNEE, FAR), ridgeF, ridgeN, P(-W, KNEE, NEAR)], 'url(#attic-roofL)');
  s += poly([P(W, KNEE, FAR), ridgeF, ridgeN, P(W, KNEE, NEAR)], 'url(#attic-roofR)');
  s += poly([P(-W, 0, FAR), P(-W, KNEE, FAR), P(-W, KNEE, NEAR), P(-W, 0, NEAR)], '#241a12') + poly([P(W, 0, FAR), P(W, KNEE, FAR), P(W, KNEE, NEAR), P(W, 0, NEAR)], '#2a1f15');
  // roof battens running to the gable, and pinpricks of daylight between the tiles
  [0.16, 0.34, 0.52, 0.7, 0.86].forEach(t => { const q = rf(t); [-1, 1].forEach(sg => { const a = P(sg * q[0], q[1], NEAR), b = P(sg * q[0], q[1], FAR); s += `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke="#0e0a07" stroke-width="3" opacity="0.5"/>`; }); });
  for (let i = 0; i < 34; i++) { const t = 0.1 + R() * 0.85, k = 0.26 + R() * 0.9, q = rf(t), sg = R() < 0.5 ? -1 : 1, p = P(sg * q[0], q[1], k); if (p[1] > 20) s += `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r1(0.6 + k * 1.1)}" fill="#e6f0f2" opacity="${r1(0.3 + R() * 0.5)}"/>`; }
  // far gable with its round window
  s += poly([P(-W, 0, FAR), P(-W, KNEE, FAR), ridgeF, P(W, KNEE, FAR), P(W, 0, FAR)], '#5b4a38');
  s += `<ellipse cx="800" cy="346" rx="60" ry="60" fill="url(#attic-halo)" opacity="0.8"/><circle cx="800" cy="346" r="17" fill="#dfeaec"/><path d="M783,346h34M800,329v34" stroke="#3a2c20" stroke-width="2.4"/><circle cx="800" cy="346" r="17" fill="none" stroke="#3a2c20" stroke-width="3"/>`;
  for (let x = 660; x < 950; x += 22) s += `<line x1="${x}" y1="455" x2="${x}" y2="${r1(Math.max(278, 422 - (158 - Math.abs(x - 800)) * 0.93))}" stroke="#3a2c20" stroke-width="1" opacity="0.5"/>`;
  // floor boards
  s += poly([P(-W, 0, FAR), P(W, 0, FAR), P(W, 0, NEAR), P(-W, 0, NEAR)], 'url(#attic-floor)');
  for (let X = -660; X <= 660; X += 110) { const a = P(X, 0, FAR), b = P(X, 0, NEAR); s += `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke="#120c08" stroke-width="2" opacity="0.4"/>`; }
  for (let i = 0; i < 16; i++) { const k = 0.25 + R() * 1.2, X = -650 + Math.floor(R() * 12) * 110, a = P(X, 0, k), b = P(X + 110, 0, k); s += `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke="#120c08" stroke-width="1.6" opacity="0.35"/>`; }

  /* the skylight in the right slope */
  const SK = [[0.36, 1 / 0.92], [0.6, 1 / 0.92], [0.6, 1 / 1.36], [0.36, 1 / 1.36]].map(c => { const q = rf(c[0]); return P(q[0], q[1], c[1]); });
  const skc = [(SK[0][0] + SK[2][0]) / 2, (SK[0][1] + SK[2][1]) / 2];
  s += `<ellipse cx="${r1(skc[0])}" cy="${r1(skc[1])}" rx="270" ry="230" fill="url(#attic-halo)"/>`;
  s += poly(SK.map((p, i) => [p[0] + [14, 6, -10, -4][i], p[1] + [10, -14, -8, 12][i]]), '#0e0a07');
  s += poly(SK, '#e4eef0');
  s += poly([SK[0], [SK[0][0] + (SK[1][0] - SK[0][0]) * 0.24, SK[0][1] + (SK[1][1] - SK[0][1]) * 0.24], [SK[3][0] + (SK[2][0] - SK[3][0]) * 0.34, SK[3][1] + (SK[2][1] - SK[3][1]) * 0.34], SK[3]], '#9fb4c4');
  const m0 = [(SK[0][0] + SK[3][0]) / 2, (SK[0][1] + SK[3][1]) / 2], m1 = [(SK[1][0] + SK[2][0]) / 2, (SK[1][1] + SK[2][1]) / 2];
  s += `<line x1="${r1(m0[0])}" y1="${r1(m0[1])}" x2="${r1(m1[0])}" y2="${r1(m1[1])}" stroke="#0e0a07" stroke-width="5"/>`;

  /* trusses, far to near; each is rafters + collar tie + king post + two posts */
  const TZ = [4.1, 3.4, 2.7, 2.05, 1.45, 0.8];
  function truss(z, i) {
    const k = 1 / z, col = mix('#6a5843', '#150f0a', Math.min(1, k * 1.05)), w = k * 30;
    const a = P(-W, KNEE, k), b = P(0, RIDGE, k), c = P(W, KNEE, k), ct = 0.61, q = rf(ct), cl = P(-q[0], q[1], k), cr = P(q[0], q[1], k), pq = rf(1 - 380 / W);
    let g = `<path d="M${pts([a, b])}M${pts([c, b])}" stroke="${col}" stroke-width="${r1(w)}" stroke-linecap="square" fill="none"/>`;
    g += `<line x1="${r1(cl[0])}" y1="${r1(cl[1])}" x2="${r1(cr[0])}" y2="${r1(cr[1])}" stroke="${col}" stroke-width="${r1(w * 0.8)}"/>`;
    g += `<line x1="${r1(b[0])}" y1="${r1(b[1])}" x2="${r1(b[0])}" y2="${r1(cl[1])}" stroke="${col}" stroke-width="${r1(w * 0.7)}"/>`;
    [-1, 1].forEach(sg => { const f = P(sg * 380, 0, k), t = P(sg * 380, pq[1], k), br = P(sg * 250, q[1], k), b0 = P(sg * 380, pq[1] - 190, k); g += `<line x1="${r1(f[0])}" y1="${r1(f[1])}" x2="${r1(t[0])}" y2="${r1(t[1])}" stroke="${col}" stroke-width="${r1(w * 0.82)}"/><line x1="${r1(b0[0])}" y1="${r1(b0[1])}" x2="${r1(br[0])}" y2="${r1(br[1])}" stroke="${col}" stroke-width="${r1(w * 0.5)}"/>`; });
    // a lit edge on the beams that face the skylight
    if (i >= 3) g += `<path d="M${pts([[a[0] + w * 0.3, a[1] - w * 0.36], [b[0] + w * 0.1, b[1] + w * 0.1]])}" stroke="#bfae92" stroke-width="${r1(w * 0.1)}" opacity="0.35" fill="none"/><line x1="${r1(P(-380, 0, k)[0] + w * 0.36)}" y1="${r1(P(-380, 0, k)[1])}" x2="${r1(P(-380, pq[1], k)[0] + w * 0.36)}" y2="${r1(P(-380, pq[1], k)[1])}" stroke="#bfae92" stroke-width="${r1(w * 0.1)}" opacity="0.35"/>`;
    return g;
  }

  /* dust-sheeted benches along the right wall */
  function sheet(z0, z1, lump) {
    const k0 = 1 / z0, k1 = 1 / z1, a = P(340, 0, k0), b = P(700, 0, k0), ta = P(340, 232, k0), tb = P(700, 232, k0), fa = P(340, 232, k1), fb = P(700, 232, k1), w = b[0] - a[0], h = a[1] - ta[1];
    let g = `<ellipse cx="${r1((a[0] + b[0]) / 2)}" cy="${r1(a[1] + 4)}" rx="${r1(w * 0.62)}" ry="${r1(12 * k0)}" fill="#0c0805" opacity="0.5"/>`;
    g += poly([ta, tb, fb, fa], '#9a927f');
    // whatever was left on the bench: a lamp, a lathe, a stack of trays
    if (lump === 1) g += `<path d="M${r1(ta[0] + w * 0.62)},${r1(ta[1] + 2)}C${r1(ta[0] + w * 0.63)},${r1(ta[1] - h * 0.24)} ${r1(ta[0] + w * 0.66)},${r1(ta[1] - h * 0.37)} ${r1(ta[0] + w * 0.72)},${r1(ta[1] - h * 0.37)}C${r1(ta[0] + w * 0.8)},${r1(ta[1] - h * 0.36)} ${r1(ta[0] + w * 0.86)},${r1(ta[1] - h * 0.16)} ${r1(ta[0] + w * 0.92)},${r1(ta[1] + 2)}Z" fill="#8f8775"/><path d="M${r1(ta[0] + w * 0.1)},${r1(ta[1] + 2)}C${r1(ta[0] + w * 0.14)},${r1(ta[1] - h * 0.24)} ${r1(ta[0] + w * 0.42)},${r1(ta[1] - h * 0.28)} ${r1(ta[0] + w * 0.5)},${r1(ta[1] + 2)}Z" fill="#857d6c"/>`;
    if (lump === 2) g += `<path d="M${r1(ta[0] + w * 0.16)},${r1(ta[1] + 2)}C${r1(ta[0] + w * 0.2)},${r1(ta[1] - h * 0.42)} ${r1(ta[0] + w * 0.34)},${r1(ta[1] - h * 0.5)} ${r1(ta[0] + w * 0.5)},${r1(ta[1] - h * 0.46)}C${r1(ta[0] + w * 0.68)},${r1(ta[1] - h * 0.44)} ${r1(ta[0] + w * 0.76)},${r1(ta[1] - h * 0.2)} ${r1(ta[0] + w * 0.84)},${r1(ta[1] + 2)}Z" fill="#8a8270"/>`;
    g += `<path d="M${r1(a[0] - w * 0.035)},${r1(a[1] + 3)}L${r1(ta[0] - w * 0.012)},${r1(ta[1] + h * 0.05)}Q${r1(ta[0])},${r1(ta[1] - 2)} ${r1(ta[0] + w * 0.05)},${r1(ta[1])}Q${r1(ta[0] + w * 0.5)},${r1(ta[1] + h * 0.035)} ${r1(tb[0] - w * 0.05)},${r1(tb[1])}Q${r1(tb[0])},${r1(tb[1] - 2)} ${r1(tb[0] + w * 0.012)},${r1(tb[1] + h * 0.05)}L${r1(b[0] + w * 0.035)},${r1(b[1] + 3)}Q${r1(b[0] - w * 0.08)},${r1(b[1] - h * 0.05)} ${r1(b[0] - w * 0.19)},${r1(b[1] + 2)}T${r1(a[0] + w * 0.58)},${r1(a[1] + 1)}T${r1(a[0] + w * 0.31)},${r1(a[1] + 3)}T${r1(a[0] - w * 0.035)},${r1(a[1] + 3)}Z" fill="url(#attic-sheet)"/>`;
    [0.1, 0.27, 0.45, 0.63, 0.82].forEach((u, j) => { g += `<path d="M${r1(ta[0] + w * u)},${r1(ta[1] + h * 0.05)}q${r1(w * 0.035 * (j % 2 ? 1 : -1))},${r1(h * 0.5)} ${r1(w * 0.012)},${r1(h * 0.92)}" fill="none" stroke="#3a342b" stroke-width="${r1(1 + k0 * 2.4)}" opacity="0.4"/><path d="M${r1(ta[0] + w * u - w * 0.04)},${r1(ta[1] + h * 0.07)}q${r1(w * 0.02 * (j % 2 ? 1 : -1))},${r1(h * 0.4)} ${r1(w * 0.006)},${r1(h * 0.8)}" fill="none" stroke="#d8cfba" stroke-width="${r1(1 + k0 * 2)}" opacity="0.16"/>`; });
    return g;
  }

  /* the twelve boxes under the left eaves */
  const XL = -660, XR = -470, HB = 36;
  function box(i) {
    const z0 = 1.0 + i * 0.2, z1 = z0 + 0.16, k0 = 1 / z0, k1 = 1 / z1, dark = Math.min(1, 0.1 + i * 0.045), isOpen = open && i === 3;
    const lit = i >= 3 && i <= 6 ? 0.22 : 0;
    const fa = P(XL, HB, k0), fb = P(XR, HB, k0), ga = P(XL, 0, k0), gb = P(XR, 0, k0), ra = P(XL, HB, k1), rb = P(XR, HB, k1), gr = P(XR, 0, k1);
    let g = `<ellipse cx="${r1((ga[0] + gb[0]) / 2 + 14 * k0)}" cy="${r1(ga[1] + 2)}" rx="${r1((gb[0] - ga[0]) * 0.62)}" ry="${r1(9 * k0)}" fill="#0c0805" opacity="0.5"/>`;
    g += poly([fb, rb, gr, gb], mix('#5c4329', '#3c2d1f', dark));
    g += poly([fa, fb, gb, ga], mix('#94734a', '#5d4a35', dark));
    g += poly([fa, fb, rb, ra], isOpen ? '#20150c' : mix(mix('#b89460', '#7a654b', dark), '#f1e3c0', lit));
    const fw = fb[0] - fa[0], fh = ga[1] - fa[1];
    g += rect(fa[0], fa[1] + fh * 0.2, fw, Math.max(1, fh * 0.07), '#2a1c10', 'opacity="0.55"');
    g += rect(fa[0] + fw * 0.46, fa[1] + fh * 0.12, fw * 0.08, fh * 0.34, '#c9a35a');
    g += rect(fa[0] + fw * 0.08, fa[1] + fh * 0.4, fw * 0.26, fh * 0.44, '#e9dfc6', 'opacity="0.9"');
    if (k0 > 0.42) g += `<text x="${r1(fa[0] + fw * 0.21)}" y="${r1(fa[1] + fh * 0.74)}" font-family="${SERIF}" font-weight="600" font-style="italic" font-size="${r1(fh * 0.36)}" fill="#3a2a1c" text-anchor="middle">${i + 1}</text>`;
    if (isOpen) {
      const cx = (fa[0] + fb[0] + ra[0] + rb[0]) / 4, cy = (fa[1] + ra[1]) / 2;
      // lid, set down on the boards beside it
      const la = P(XR + 26, 8, k0 * 0.99), lb = P(XR + 216, 8, k0 * 0.99), lc = P(XR + 216, 8, k1 * 1.02), ld = P(XR + 26, 8, k1 * 1.02), l0 = P(XR + 26, 0, k0 * 0.99), l1 = P(XR + 216, 0, k0 * 0.99);
      g += poly([la, lb, l1, l0], '#6f5636') + poly([la, lb, lc, ld], '#c7a46c');
      // grease paper and a dozen movements
      const ia = [fa[0] + fw * 0.05, fa[1] - 1], ib = [fb[0] - fw * 0.04, fb[1] - 1], ic = [rb[0] - fw * 0.03, rb[1] + 1.5], id = [ra[0] + fw * 0.05, ra[1] + 1.5];
      g += poly([ia, ib, ic, id], '#efe4c4');
      g += poly([ib, [ib[0] + fw * 0.09, ib[1] + fh * 0.5], [ib[0] - fw * 0.06, ib[1] + fh * 0.3], [ib[0] - fw * 0.12, ib[1]]], '#e3d6b2');
      for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
        const v = r ? 0.26 : 0.74, u = (c + 0.5) / 6;
        const x = (id[0] + (ic[0] - id[0]) * u) * v + (ia[0] + (ib[0] - ia[0]) * u) * (1 - v), y = id[1] * v + ia[1] * (1 - v), rr = fw * 0.058 * (r ? 0.92 : 1);
        g += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rr)}" ry="${r1(rr * 0.4)}" fill="#8a6a2c"/><ellipse cx="${r1(x)}" cy="${r1(y - rr * 0.12)}" rx="${r1(rr * 0.9)}" ry="${r1(rr * 0.34)}" fill="#e9c877"/><ellipse cx="${r1(x - rr * 0.25)}" cy="${r1(y - rr * 0.18)}" rx="${r1(rr * 0.36)}" ry="${r1(rr * 0.12)}" fill="#fff6d8"/>`;
      }
      g += `<ellipse cx="${r1(cx)}" cy="${r1(cy - 12)}" rx="${r1(fw * 1.3)}" ry="${r1(fw * 0.8)}" fill="url(#attic-gleam)"><animate attributeName="opacity" values="0.82;1;0.82" dur="5s" repeatCount="indefinite"/></ellipse>`;
    }
    return g;
  }

  /* paint in depth order */
  s += truss(TZ[0], 0) + truss(TZ[1], 1);
  for (let i = 11; i >= 8; i--) s += box(i);
  s += truss(TZ[2], 2) + sheet(2.75, 3.3, 0);
  for (let i = 7; i >= 6; i--) s += box(i);
  // the pool of light on the boards, then the shaft itself
  const pool = [P(-500, 0, 1 / 1.5), P(-140, 0, 1 / 1.5), P(-140, 0, 1 / 2.1), P(-500, 0, 1 / 2.1)];
  s += `<ellipse cx="${r1((pool[0][0] + pool[1][0]) / 2 + 20)}" cy="${r1((pool[0][1] + pool[2][1]) / 2)}" rx="230" ry="62" fill="url(#attic-pool)"/>`;
  s += poly(pool, '#f1e9d6', 'opacity="0.2"');
  s += truss(TZ[3], 3);
  for (let i = 5; i >= 4; i--) s += box(i);
  s += sheet(1.72, 2.3, 2);
  s += truss(TZ[4], 4);
  for (let i = 3; i >= 0; i--) s += box(i);
  s += poly([SK[1], SK[0], pool[1], pool[0]], 'url(#attic-shaft)');
  s += poly([[SK[1][0] - 26, SK[1][1] + 30], [SK[0][0] - 60, SK[0][1] - 26], [pool[1][0] - 56, pool[1][1]], [pool[0][0] + 70, pool[0][1]]], 'url(#attic-shaft)', 'opacity="0.45"');
  // motes
  let dust = '';
  for (let i = 0; i < 48; i++) {
    const u = R(), v = 0.06 + R() * 0.9;
    const tx = SK[1][0] + (SK[0][0] - SK[1][0]) * u, ty = SK[1][1] + (SK[0][1] - SK[1][1]) * u, bx = pool[0][0] + (pool[1][0] - pool[0][0]) * u, by = pool[0][1];
    const x = tx + (bx - tx) * v, y = ty + (by - ty) * v, d = 5 + R() * 7;
    dust += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.8 + R() * 1.6)}" fill="#fff8e6" opacity="0.1"><animate attributeName="opacity" values="0.08;${r1(0.4 + R() * 0.5)};0.08" dur="${r1(d)}s" begin="${r1(-R() * d)}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0,0;${r1(-8 - R() * 10)},${r1(6 + R() * 10)};0,0" dur="${r1(d * 2.6)}s" begin="${r1(-R() * d)}s" repeatCount="indefinite"/></circle>`;
  }
  s += `<g>${dust}</g>`;
  s += sheet(0.98, 1.4, 1);
  s += truss(TZ[5], 5);
  // a stool and a forgotten coat, near left
  s += `<path d="M-10,900V560Q30,548 60,566L84,900Z" fill="#0c0805"/>`;
  s += rect(0, 0, 1600, 130, 'url(#attic-top)') + rect(0, 590, 1600, 310, 'url(#attic-bot)');
  return s + '</svg>';
};

})();
