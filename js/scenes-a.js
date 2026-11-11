/* UNSIGNED — location backdrops, set A: shop, portobello, puces, marseille.
   Each Scenes.<name>(o) returns a 1600x900 SVG string (slice-cropped by the stage).
   Flat, layered travel-poster drawings; the lower third stays calm for the dialogue panel. */
(function () {
'use strict';
const S = (window.Scenes = window.Scenes || {});
const R = v => Math.round(v * 10) / 10;
function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function mix(a, b, t) { const A = hex(a), B = hex(b); t = Math.max(0, Math.min(1, t)); return '#' + [0, 1, 2].map(i => Math.round(A[i] + (B[i] - A[i]) * t).toString(16).padStart(2, '0')).join(''); }
const pts = a => a.map(p => R(p[0]) + ',' + R(p[1])).join(' ');
const poly = (a, fill, extra) => `<polygon points="${pts(a)}" fill="${fill}" ${extra || ''}/>`;
const SVG = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
const SERIF = "'Cormorant Garamond', serif", SANS = 'Jost, sans-serif';

/* ---------- clocks (shared by shop and puces) ---------- */
function face(r, h, m, o) {
  o = o || {}; const fc = o.face || '#cfc7ae', ink = o.ink || '#23201b';
  let s = `<circle r="${R(r)}" fill="${fc}"/>`;
  if (r > 9) for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180, r1 = r * (i % 3 ? 0.8 : 0.7), r2 = r * 0.9;
    s += `<line x1="${R(Math.sin(a) * r1)}" y1="${R(-Math.cos(a) * r1)}" x2="${R(Math.sin(a) * r2)}" y2="${R(-Math.cos(a) * r2)}" stroke="${ink}" stroke-width="${R(Math.max(0.7, r * (i % 3 ? 0.03 : 0.06)))}"/>`;
  }
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  s += `<line x1="0" y1="${R(r * 0.1)}" x2="0" y2="${R(-r * 0.48)}" stroke="${ink}" stroke-width="${R(Math.max(1.2, r * 0.085))}" stroke-linecap="round" transform="rotate(${R(ha)})"/>`;
  s += `<line x1="0" y1="${R(r * 0.12)}" x2="0" y2="${R(-r * 0.74)}" stroke="${ink}" stroke-width="${R(Math.max(0.9, r * 0.05))}" stroke-linecap="round" transform="rotate(${R(ma)})"/>`;
  s += `<circle r="${R(Math.max(1.1, r * 0.07))}" fill="${ink}"/>`;
  s += `<path d="M${R(-r * 0.86)},${R(-r * 0.2)}A${R(r * 0.88)},${R(r * 0.88)} 0 0 1 ${R(r * 0.2)},${R(-r * 0.86)}A${R(r * 1.3)},${R(r * 1.3)} 0 0 0 ${R(-r * 0.86)},${R(-r * 0.2)}Z" fill="#fff" opacity="0.1"/>`;
  return s;
}
const K = {
  round(x, y, r, h, m, o) { o = o || {}; return `<g transform="translate(${x},${y})"><circle r="${R(r * 1.2)}" fill="${o.rim || '#2a1f16'}"/><circle r="${R(r * 1.07)}" fill="${o.rim2 || mix(o.rim || '#2a1f16', '#000', 0.35)}"/>${face(r, h, m, o)}</g>`; },
  oct(x, y, r, h, m, o) { o = o || {}; let p = []; for (let i = 0; i < 8; i++) { const a = (i * 45 + 22.5) * Math.PI / 180; p.push([Math.sin(a) * r * 1.42, -Math.cos(a) * r * 1.42]); } return `<g transform="translate(${x},${y})">${poly(p, o.rim || '#3a2819')}<circle r="${R(r * 1.08)}" fill="${mix(o.rim || '#3a2819', '#000', 0.4)}"/>${face(r, h, m, o)}</g>`; },
  school(x, y, r, h, m, o) { o = o || {}; const rim = o.rim || '#3a2819'; return `<g transform="translate(${x},${y})"><path d="M${R(-r * 0.62)},${R(r * 0.9)}h${R(r * 1.24)}v${R(r * 1.25)}l${R(-r * 0.62)},${R(r * 0.5)}l${R(-r * 0.62)},${R(-r * 0.5)}z" fill="${rim}"/><rect x="${R(-r * 0.4)}" y="${R(r * 1.42)}" width="${R(r * 0.8)}" height="${R(r * 0.6)}" fill="${mix(rim, '#000', 0.5)}"/><line x1="0" y1="${R(r * 1.3)}" x2="0" y2="${R(r * 1.8)}" stroke="${o.brass || '#a8823a'}" stroke-width="1.4"/><circle cx="0" cy="${R(r * 1.84)}" r="${R(r * 0.17)}" fill="${o.brass || '#a8823a'}"/></g>` + K.oct(x, y, r, h, m, o); },
  reg(x, y, w, ht, h, m, o) { // Vienna regulator, x = centre, y = top
    o = o || {}; const rim = o.rim || '#2d1f15', br = o.brass || '#a8823a', r = w * 0.36;
    return `<g transform="translate(${x},${y})"><path d="M${R(-w * 0.62)},${R(w * 0.3)}L0,0L${R(w * 0.62)},${R(w * 0.3)}Z" fill="${rim}"/><circle cx="0" cy="${R(-3)}" r="4" fill="${rim}"/><rect x="${R(-w / 2)}" y="${R(w * 0.3)}" width="${w}" height="${R(ht - w * 0.3)}" fill="${rim}"/><rect x="${R(-w * 0.38)}" y="${R(w * 0.42)}" width="${R(w * 0.76)}" height="${R(ht - w * 0.62)}" fill="${mix(rim, '#000', 0.5)}"/><path d="M${R(-w * 0.34)},${R(ht)}h${R(w * 0.68)}l${R(-w * 0.34)},${R(w * 0.3)}z" fill="${rim}"/><line x1="0" y1="${R(w * 0.9)}" x2="0" y2="${R(ht - w * 0.52)}" stroke="${br}" stroke-width="1.6"/><circle cx="0" cy="${R(ht - w * 0.46)}" r="${R(w * 0.17)}" fill="${br}"/><g transform="translate(0,${R(w * 0.42 + r + 3)})">${face(r, h, m, o)}</g></g>`;
  },
  cuckoo(x, y, w, h, m, o) { // x centre, y roof peak; both weights run all the way down
    o = o || {}; const rim = o.rim || '#33231a', dk = mix(rim, '#000', 0.4), r = w * 0.24;
    return `<g transform="translate(${x},${y})"><line x1="${R(-w * 0.14)}" y1="${R(w * 0.9)}" x2="${R(-w * 0.14)}" y2="${R(w * 2.2)}" stroke="${o.brass || '#a8823a'}" stroke-width="1.3" stroke-dasharray="2.4 1.8" opacity="0.8"/><line x1="${R(w * 0.14)}" y1="${R(w * 0.9)}" x2="${R(w * 0.14)}" y2="${R(w * 2.3)}" stroke="${o.brass || '#a8823a'}" stroke-width="1.3" stroke-dasharray="2.4 1.8" opacity="0.8"/><ellipse cx="${R(-w * 0.14)}" cy="${R(w * 2.3)}" rx="${R(w * 0.075)}" ry="${R(w * 0.15)}" fill="${rim}"/><ellipse cx="${R(w * 0.14)}" cy="${R(w * 2.4)}" rx="${R(w * 0.075)}" ry="${R(w * 0.15)}" fill="${rim}"/><rect x="${R(-w * 0.4)}" y="${R(w * 0.36)}" width="${R(w * 0.8)}" height="${R(w * 0.66)}" fill="${rim}"/><path d="M${R(-w * 0.62)},${R(w * 0.46)}L0,0L${R(w * 0.62)},${R(w * 0.46)}L${R(w * 0.5)},${R(w * 0.52)}L0,${R(w * 0.14)}L${R(-w * 0.5)},${R(w * 0.52)}Z" fill="${dk}"/><rect x="${R(-w * 0.07)}" y="${R(w * 0.24)}" width="${R(w * 0.14)}" height="${R(w * 0.15)}" rx="2" fill="${dk}"/><path d="M${R(-w * 0.5)},${R(w * 1.02)}q${R(w * 0.25)},${R(w * 0.16)} ${R(w * 0.5)},0q${R(w * 0.25)},${R(w * 0.16)} ${R(w * 0.5)},0z" fill="${dk}"/><g transform="translate(0,${R(w * 0.7)})">${face(r, h, m, o)}</g></g>`;
  },
  sun(x, y, r, h, m, o) { o = o || {}; const br = o.brass || '#a8823a'; let s = `<g transform="translate(${x},${y})">`; for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180, l = r * (i % 2 ? 1.7 : 2.3); s += `<line x1="${R(Math.sin(a) * r)}" y1="${R(-Math.cos(a) * r)}" x2="${R(Math.sin(a) * l)}" y2="${R(-Math.cos(a) * l)}" stroke="${br}" stroke-width="${i % 2 ? 1.6 : 2.4}" stroke-linecap="round"/>`; } return s + `<circle r="${R(r * 1.14)}" fill="${br}"/>${face(r, h, m, o)}</g>`; },
  deco(x, y, w, h, m, o) { o = o || {}; const rim = o.rim || '#1d2a27'; return `<g transform="translate(${x},${y})"><rect x="${R(-w / 2)}" y="${R(-w / 2)}" width="${w}" height="${w}" rx="${R(w * 0.16)}" fill="${rim}"/><rect x="${R(-w * 0.43)}" y="${R(-w * 0.43)}" width="${R(w * 0.86)}" height="${R(w * 0.86)}" rx="${R(w * 0.11)}" fill="${o.brass || '#a8823a'}" opacity="0.8"/>${face(w * 0.36, h, m, o)}</g>`; },
  alarm(x, y, r, h, m, o) { o = o || {}; const br = o.brass || '#a8823a'; return `<g transform="translate(${x},${y})"><circle cx="${R(-r * 0.7)}" cy="${R(-r * 1.02)}" r="${R(r * 0.42)}" fill="${br}"/><circle cx="${R(r * 0.7)}" cy="${R(-r * 1.02)}" r="${R(r * 0.42)}" fill="${br}"/><line x1="${R(-r * 0.6)}" y1="${R(r * 0.8)}" x2="${R(-r * 0.9)}" y2="${R(r * 1.2)}" stroke="${br}" stroke-width="2.4" stroke-linecap="round"/><line x1="${R(r * 0.6)}" y1="${R(r * 0.8)}" x2="${R(r * 0.9)}" y2="${R(r * 1.2)}" stroke="${br}" stroke-width="2.4" stroke-linecap="round"/><circle r="${R(r * 1.16)}" fill="${br}"/>${face(r, h, m, o)}</g>`; },
  carriage(x, y, w, ht, h, m, o) { o = o || {}; const br = o.brass || '#a8823a'; return `<g transform="translate(${x},${y})"><path d="M${R(-w * 0.28)},${R(-ht)}v${R(-ht * 0.16)}h${R(w * 0.56)}v${R(ht * 0.16)}" fill="none" stroke="${br}" stroke-width="2.2"/><rect x="${R(-w / 2)}" y="${R(-ht)}" width="${w}" height="${ht}" rx="2" fill="${br}"/><rect x="${R(-w * 0.38)}" y="${R(-ht * 0.9)}" width="${R(w * 0.76)}" height="${R(ht * 0.8)}" fill="${mix(br, '#000', 0.55)}"/><g transform="translate(0,${R(-ht * 0.56)})">${face(w * 0.3, h, m, o)}</g></g>`; },
  mantel(x, y, w, h, m, o) { o = o || {}; const rim = o.rim || '#33231a'; return `<g transform="translate(${x},${y})"><path d="M${R(-w / 2)},0v${R(-w * 0.12)}q${R(w * 0.14)},${R(-w * 0.02)} ${R(w * 0.22)},${R(-w * 0.2)}a${R(w * 0.28)},${R(w * 0.28)} 0 0 1 ${R(w * 0.56)},0q${R(w * 0.08)},${R(w * 0.18)} ${R(w * 0.22)},${R(w * 0.2)}v${R(w * 0.12)}z" fill="${rim}"/><g transform="translate(0,${R(-w * 0.34)})">${face(w * 0.2, h, m, o)}</g></g>`; }
};

/* =====================================================================
   SHOP — Horlogerie Calame, Montréal. Seen from inside, toward the street.
   ===================================================================== */
S.shop = function (o) {
  o = o || {}; const N = o.time === 'night', rnd = rng(1978);
  const C = N ? {
    wallT: '#0b1411', wallB: '#0f1a16', dado: '#0d0a08', dadoHi: '#15100c', rail: '#1a130e', floorT: '#0d0a08', floorB: '#060504',
    skyT: '#050a14', skyB: '#101c30', bldA: '#0a1322', bldB: '#0d182a', snow: '#3a4c66', roofSnow: '#2c3d57', lit: '#e8b257', litP: 0.5,
    frame: '#060504', frameHi: '#1a130e', letter: '#6a5425', letterO: 0.7, faceL: '#4f5a57', rimL: '#14100c', brassL: '#4f4326',
    sil: '#040506', wood: '#3d2a1b', box1: '#2f271e', box2: '#3a3025', box3: '#261f18', tape: '#4a4030', door: '#120d09', card: '#7f7b69'
  } : {
    wallT: '#14221e', wallB: '#1a2c26', dado: '#16100c', dadoHi: '#211812', rail: '#2a1f16', floorT: '#1a140f', floorB: '#0c0907',
    skyT: '#6a8aae', skyB: '#bccbd8', bldA: '#4c6788', bldB: '#5b7797', snow: '#e2eaf1', roofSnow: '#e9eff4', lit: '#f5c76e', litP: 0.3,
    frame: '#0c0908', frameHi: '#39424a', letter: '#2f2610', letterO: 0.85, faceL: '#98a4a3', rimL: '#221a14', brassL: '#7d7450',
    sil: '#0a0c0e', wood: '#3d2a1b', box1: '#6a5a46', box2: '#7c6a51', box3: '#524536', tape: '#9a8c6c', door: '#211710', card: '#e6dec8'
  };
  const warm = { face: '#dcc791', rim: '#4a3320', brass: '#c9a35a', ink: '#2a2118' };       // lit by the bench lamp
  const warm2 = { face: '#c4b183', rim: '#3d2b1c', brass: '#b08c48', ink: '#2a2118' };
  const cool = { face: C.faceL, rim: C.rimL, brass: C.brassL, ink: N ? '#0c0e0d' : '#1c2222' };
  let s = '<defs>';
  s += `<linearGradient id="shop-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wallT}"/><stop offset="1" stop-color="${C.wallB}"/></linearGradient>`;
  s += `<linearGradient id="shop-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyT}"/><stop offset="1" stop-color="${C.skyB}"/></linearGradient>`;
  s += `<linearGradient id="shop-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.floorT}"/><stop offset="1" stop-color="${C.floorB}"/></linearGradient>`;
  s += `<linearGradient id="shop-cold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c2de" stop-opacity="0.15"/><stop offset="1" stop-color="#a9c2de" stop-opacity="0.01"/></linearGradient>`;
  s += `<radialGradient id="shop-lamp" gradientUnits="userSpaceOnUse" cx="1290" cy="418" r="${N ? 430 : 400}"><stop offset="0" stop-color="#ffd58c" stop-opacity="${N ? 0.5 : 0.42}"/><stop offset="0.35" stop-color="#f3b566" stop-opacity="${N ? 0.22 : 0.18}"/><stop offset="1" stop-color="#f3b566" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="shop-street" gradientUnits="userSpaceOnUse" cx="626" cy="286" r="${N ? 190 : 130}"><stop offset="0" stop-color="#ffe2a6" stop-opacity="${N ? 0.85 : 0.75}"/><stop offset="0.3" stop-color="#ffcf8a" stop-opacity="${N ? 0.32 : 0.28}"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="shop-wincool" gradientUnits="userSpaceOnUse" cx="800" cy="300" r="620"><stop offset="0" stop-color="#9db8d6" stop-opacity="${N ? 0.03 : 0.14}"/><stop offset="1" stop-color="#9db8d6" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="shop-frost"><stop offset="0" stop-color="#fff" stop-opacity="${N ? 0.1 : 0.34}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="shop-vig" cx="0.5" cy="0.42" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${N ? 0.7 : 0.55}"/></radialGradient>`;
  s += `<linearGradient id="shop-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14573f"/><stop offset="0.6" stop-color="#2f9a72"/><stop offset="1" stop-color="#8fe0b4"/></linearGradient>`;
  s += `<linearGradient id="shop-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6ad" stop-opacity="0.34"/><stop offset="1" stop-color="#ffd58c" stop-opacity="0.03"/></linearGradient>`;
  s += `<radialGradient id="shop-halo"><stop offset="0" stop-color="#ffe6ad" stop-opacity="0.34"/><stop offset="1" stop-color="#ffe6ad" stop-opacity="0"/></radialGradient>`;
  s += `<clipPath id="shop-glass"><rect x="516" y="88" width="568" height="418"/></clipPath><clipPath id="shop-dglass"><rect x="316" y="166" width="110" height="258"/></clipPath>`;
  s += `<path id="shop-arc" d="M552,258A318,318 0 0 1 1048,258" fill="none"/>`;
  s += '</defs>';

  /* --- wall, dado, floor --- */
  s += `<rect width="1600" height="900" fill="url(#shop-wall)"/>`;
  let st = ''; for (let x = 12; x < 1600; x += 36) st += `M${x},52V522`;
  s += `<path d="${st}" stroke="#000" stroke-width="10" opacity="0.07"/><path d="${st}" stroke="#c9a35a" stroke-width="0.8" opacity="${N ? 0.03 : 0.06}" transform="translate(9,0)"/>`;
  s += `<rect width="1600" height="54" fill="#070b0a" opacity="0.75"/><rect y="50" width="1600" height="5" fill="${C.rail}"/>`;
  s += `<rect width="1600" height="522" fill="url(#shop-wincool)"/>`;
  s += `<rect y="522" width="1600" height="90" fill="${C.dado}"/><rect y="522" width="1600" height="8" fill="${C.rail}"/>`;
  for (let x = 14; x < 1600; x += 106) s += `<rect x="${x}" y="540" width="86" height="58" fill="${C.dadoHi}" opacity="0.7"/>`;
  s += `<rect y="612" width="1600" height="288" fill="url(#shop-floor)"/><rect y="606" width="1600" height="7" fill="${C.rail}" opacity="0.8"/>`;
  let pl = ''; for (let x = -400; x <= 2000; x += 66) pl += `M${x},612L${R(800 + (x - 800) * 2.1)},900`;
  s += `<path d="${pl}" stroke="#000" stroke-width="1.6" opacity="0.32"/>`;
  if (!N) s += poly([[520, 612], [1080, 612], [1330, 900], [270, 900]], 'url(#shop-cold)');

  /* --- the street, through the window --- */
  let out = `<rect x="516" y="88" width="568" height="418" fill="url(#shop-sky)"/>`;
  const bx = [508, 704, 894, 1092], tops = [262, 236, 272];
  for (let i = 0; i < 3; i++) {
    const x0 = bx[i], x1 = bx[i + 1], top = tops[i], col = i % 2 ? C.bldB : C.bldA, dk = mix(col, '#0a1220', 0.35);
    out += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${506 - top}" fill="${col}"/>`;
    out += `<rect x="${x0 - 3}" y="${top - 9}" width="${x1 - x0 + 6}" height="12" fill="${dk}"/><rect x="${x0 - 3}" y="${top - 14}" width="${x1 - x0 + 6}" height="7" rx="3.5" fill="${C.roofSnow}"/>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const wx = x0 + 26 + c * ((x1 - x0 - 52 - 24) / 2), wy = top + 26 + r * 62; if (wy > 440) continue;
      const lit = rnd() < C.litP;
      out += `<rect x="${R(wx)}" y="${wy}" width="24" height="36" fill="${lit ? C.lit : dk}" opacity="${lit ? 0.92 : 0.8}"/><rect x="${R(wx - 2)}" y="${wy + 36}" width="28" height="3" fill="${C.roofSnow}" opacity="0.7"/>`;
    }
    // balcony and the outside staircase every Plateau triplex has
    const by = top + 128;
    out += `<rect x="${x0 + 14}" y="${by}" width="${x1 - x0 - 28}" height="4" fill="${dk}"/><rect x="${x0 + 14}" y="${by - 3}" width="${x1 - x0 - 28}" height="3" fill="${C.roofSnow}" opacity="0.8"/>`;
    for (let q = x0 + 18; q < x1 - 14; q += 9) out += `<rect x="${q}" y="${by - 20}" width="1.6" height="20" fill="${dk}"/>`;
    out += `<rect x="${x0 + 14}" y="${by - 22}" width="${x1 - x0 - 28}" height="2.4" fill="${dk}"/>`;
    const sx = i === 1 ? x1 - 34 : x0 + 34, dir = i === 1 ? -1 : 1;
    out += `<path d="M${sx},${by + 2}Q${sx + dir * 18},${by + 60} ${sx + dir * 74},506" fill="none" stroke="${dk}" stroke-width="9"/><path d="M${sx},${by - 2}Q${sx + dir * 18},${by + 56} ${sx + dir * 74},502" fill="none" stroke="${C.roofSnow}" stroke-width="2.4" stroke-dasharray="5 5" opacity="0.85"/><path d="M${sx - dir * 6},${by - 20}Q${sx + dir * 12},${by + 38} ${sx + dir * 68},484" fill="none" stroke="${dk}" stroke-width="2"/>`;
  }
  out += `<rect x="516" y="88" width="568" height="418" fill="${C.skyB}" opacity="${N ? 0.1 : 0.3}"/>`;
  // parked car under snow, snowbank
  out += `<path d="M884,500v-22q0,-8 10,-10l22,-4l16,-22q4,-6 12,-6h62q8,0 12,6l14,22l14,4q8,2 8,10v22z" fill="${mix(C.bldA, '#0a1220', 0.55)}"/><path d="M930,440q4,-9 14,-9h62q10,0 14,9l4,7q-48,-7 -98,0zM886,470q30,-10 60,-6l-4,8q-30,-2 -56,6z" fill="${C.snow}"/>`;
  out += `<path d="M516,506V486q40,-14 86,-6t90,2q60,-10 110,-2t96,4q50,-8 96,-2t90,-6V506z" fill="${C.snow}"/>`;
  // street lamp
  out += `<rect x="593" y="296" width="5" height="200" fill="${mix(C.bldA, '#070b12', 0.7)}"/><path d="M595.5,300q0,-22 22,-22h8" fill="none" stroke="${mix(C.bldA, '#070b12', 0.7)}" stroke-width="4"/><path d="M617,278h18l-3,9h-12z" fill="${mix(C.bldA, '#070b12', 0.7)}"/>`;
  out += `<circle cx="626" cy="286" r="${N ? 190 : 130}" fill="url(#shop-street)"/><circle cx="626" cy="289" r="5.5" fill="#fff3cf"/>`;
  if (N) out += `<ellipse cx="620" cy="494" rx="110" ry="14" fill="#ffcf8a" opacity="0.2"/>`;
  // snow
  let fl = '';
  for (let i = 0; i < 58; i++) {
    const x = 520 + rnd() * 560, r = 1.2 + rnd() * 2.1, d = 8 + rnd() * 9, sway = rnd() * 44 - 22;
    fl += `<circle cx="${R(x)}" cy="78" r="${R(r)}" fill="#fff" opacity="${R((N ? 0.25 : 0.5) + rnd() * 0.45)}"><animateTransform attributeName="transform" type="translate" values="0 0;${R(sway)} 220;${R(-sway * 0.4)} 440" dur="${R(d)}s" begin="${R(-rnd() * d)}s" repeatCount="indefinite"/></circle>`;
  }
  out += fl;
  // glass: sheen, frost in the corners, the lamp's reflection
  out += poly([[560, 88], [650, 88], [520, 330], [516, 250]], '#fff', 'opacity="0.05"') + poly([[690, 88], [720, 88], [540, 506], [516, 506], [516, 470]], '#fff', 'opacity="0.035"');
  [[516, 88], [1084, 88], [516, 506], [1084, 506]].forEach((c, i) => { out += `<circle cx="${c[0]}" cy="${c[1]}" r="${i < 2 ? 120 : 150}" fill="url(#shop-frost)"/>`; });
  out += `<circle cx="1046" cy="404" r="60" fill="url(#shop-halo)" opacity="${N ? 0.8 : 0.5}"/>`;
  // lettering, gilt on the outside, read backwards from within
  const letter = (dx, dy, fill, op) => `<g transform="translate(${1600 + dx},${dy}) scale(-1,1)" fill="${fill}" opacity="${op}"><text font-family="${SERIF}" font-weight="600" font-size="43" letter-spacing="5.5" text-anchor="middle"><textPath href="#shop-arc" startOffset="50%">HORLOGERIE CALAME</textPath></text><text x="800" y="292" font-family="${SERIF}" font-weight="600" font-size="15.5" letter-spacing="5" text-anchor="middle">RÉPARATION · MONTRES · PENDULES</text><path d="M742,310h116M790,310l10,6l10,-6l-10,-6z" stroke="${fill}" stroke-width="1.2"/></g>`;
  out += letter(-1.6, 1.6, '#d9b566', N ? 0.3 : 0.5) + letter(0, 0, C.letter, C.letterO);
  // what is left on the window ledge, in silhouette
  const stand = (x, h) => `<rect x="${x - 11}" y="501" width="22" height="5" rx="1.5" fill="${C.sil}"/><path d="M${x},503V${506 - h + 10}" stroke="${C.sil}" stroke-width="3.4"/><path d="M${x + 8},${506 - h}a9,8 0 1 0 0,12" fill="none" stroke="${C.sil}" stroke-width="3.6" stroke-linecap="round"/>`;
  out += stand(548, 50) + stand(584, 36) + stand(626, 58) + stand(1056, 44) + stand(1020, 60);
  out += `<path d="M936,506v-10q10,-2 14,-16a17,17 0 0 1 34,0q4,14 14,16v10z" fill="${C.sil}"/><circle cx="967" cy="482" r="9" fill="${C.skyB}" opacity="${N ? 0.12 : 0.4}"/>`;
  out += `<path d="M660,506l5,-12h14l5,12zM1000,506l-4,-9h-12l-4,9z" fill="${C.card}" opacity="${N ? 0.3 : 0.55}"/>`;
  s += `<g clip-path="url(#shop-glass)">${out}</g>`;
  s += `<path fill-rule="evenodd" d="M498,70H1102V524H498ZM516,88V506H1084V88Z" fill="${C.frame}"/><path d="M516,88V506M516,88H1084" stroke="${C.frameHi}" stroke-width="1.6" opacity="0.7" fill="none"/>`;
  s += `<rect x="488" y="518" width="624" height="14" fill="${C.rail}"/><rect x="488" y="518" width="624" height="2" fill="${N ? '#2a2018' : '#5d6870'}" opacity="0.8"/>`;
  // radiator under the window
  for (let i = 0; i < 13; i++) s += `<rect x="${702 + i * 15}" y="548" width="11" height="60" rx="5" fill="${N ? '#0c1110' : '#1b2524'}"/><rect x="${704 + i * 15}" y="550" width="3" height="52" rx="1.5" fill="${N ? '#18201f' : '#3a4a4a'}" opacity="0.7"/>`;
  s += `<rect x="690" y="570" width="14" height="5" fill="${N ? '#0c1110' : '#1b2524'}"/>`;

  /* --- door --- */
  s += `<rect x="282" y="86" width="178" height="526" fill="${C.frame}"/><rect x="298" y="100" width="146" height="30" fill="url(#shop-sky)"/><rect x="298" y="100" width="146" height="30" fill="${C.skyB}" opacity="0.3"/>`;
  s += `<rect x="298" y="142" width="146" height="470" fill="${C.door}"/>`;
  let dg = `<rect x="316" y="166" width="110" height="258" fill="url(#shop-sky)"/><rect x="316" y="310" width="110" height="114" fill="${C.bldB}"/><rect x="316" y="302" width="110" height="9" fill="${C.roofSnow}" opacity="0.8"/><rect x="336" y="336" width="20" height="30" fill="${C.lit}" opacity="0.85"/><rect x="384" y="336" width="20" height="30" fill="${mix(C.bldB, '#0a1220', 0.4)}"/><rect x="316" y="166" width="110" height="258" fill="${C.skyB}" opacity="${N ? 0.1 : 0.3}"/><path d="M316,424v-16q30,-10 56,-4t54,-4v24z" fill="${C.snow}"/>`;
  for (let i = 0; i < 9; i++) { const x = 320 + rnd() * 102, d = 6 + rnd() * 6; dg += `<circle cx="${R(x)}" cy="160" r="${R(1.2 + rnd() * 1.8)}" fill="#fff" opacity="${R((N ? 0.25 : 0.5) + rnd() * 0.4)}"><animateTransform attributeName="transform" type="translate" values="0 0;${R(rnd() * 20 - 10)} 270" dur="${R(d)}s" begin="${R(-rnd() * d)}s" repeatCount="indefinite"/></circle>`; }
  dg += poly([[330, 166], [372, 166], [316, 300], [316, 220]], '#fff', 'opacity="0.05"');
  s += `<g clip-path="url(#shop-dglass)">${dg}</g>`;
  s += `<rect x="316" y="448" width="110" height="140" fill="#000" opacity="0.28"/><rect x="316" y="448" width="110" height="2" fill="${C.frameHi}" opacity="0.5"/>`;
  s += `<rect x="304" y="424" width="9" height="34" rx="2" fill="${cool.brass}"/><circle cx="308.5" cy="434" r="7" fill="${cool.brass}"/><rect x="346" y="600" width="50" height="5" fill="#000" opacity="0.3"/>`;
  // the sign still says OPEN on the inside
  s += `<g transform="translate(371,262) rotate(-4)"><path d="M-24,-15L0,-50L24,-15" fill="none" stroke="${C.sil}" stroke-width="1.4"/><circle cx="0" cy="-51" r="3.4" fill="${C.sil}"/><rect x="-40" y="-17" width="80" height="34" rx="3" fill="${C.card}"/><rect x="-36" y="-13" width="72" height="26" rx="2" fill="none" stroke="#9c2f24" stroke-width="1" opacity="${N ? 0.5 : 0.8}"/><text x="0" y="6" font-family="${SANS}" font-weight="600" font-size="15" letter-spacing="3.5" fill="#9c2f24" text-anchor="middle" opacity="${N ? 0.6 : 1}">OUVERT</text></g>`;
  // shop bell on its spring
  s += `<path d="M444,150q-26,-8 -30,18" fill="none" stroke="${cool.brass}" stroke-width="2.2"/><path d="M406,180q0,-13 8,-13t8,13l3,5h-22z" fill="${cool.brass}"/><circle cx="414" cy="187" r="2.4" fill="${cool.brass}"/>`;

  /* --- left wall: clocks in window light, a shelf, the photograph --- */
  s += K.reg(78, 84, 64, 196, 4, 17, cool);
  s += K.round(196, 124, 34, 10, 52, cool);
  s += `<rect x="134" y="186" width="116" height="80" fill="${cool.rim}"/><rect x="141" y="193" width="102" height="66" fill="${N ? '#4a4f49' : '#9aa19b'}"/><rect x="149" y="200" width="86" height="52" fill="${N ? '#33342e' : '#7d7a69'}"/>`;
  s += `<rect x="149" y="200" width="86" height="24" fill="${N ? '#42443c' : '#a3a08c'}"/><path d="M153,252v-22h66v-6h6v-16h5v44z" fill="${N ? '#1c1d19' : '#3d3a30'}"/>`;
  for (let q = 0; q < 7; q++) s += `<rect x="${157 + q * 9}" y="234" width="4.6" height="12" fill="${N ? '#4a4f49' : '#b5b29c'}" opacity="0.8"/>`;
  s += K.oct(206, 322, 23, 7, 38, cool) + K.round(132, 326, 17, 1, 5, cool);
  s += `<rect x="26" y="398" width="252" height="6" fill="${C.rail}"/><path d="M44,404v14l14,-14zM258,404v14l-14,-14z" fill="${C.rail}"/>`;
  s += K.alarm(70, 374, 17, 6, 30, cool) + K.carriage(150, 398, 34, 46, 2, 44, cool) + K.mantel(228, 398, 70, 9, 12, cool);

  /* --- boxes, half packed --- */
  const box = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="#fff" opacity="0.07"/><rect x="${x + w - 16}" y="${y}" width="16" height="${h}" fill="#000" opacity="0.16"/>`;
  s += `<g transform="translate(112,452)">${face(30, 3, 41, cool)}</g><circle cx="112" cy="452" r="36" fill="none" stroke="${cool.rim}" stroke-width="7"/>`;
  s += poly([[56, 466], [70, 440], [96, 452], [84, 466]], N ? '#55564c' : '#b9bdb8') + poly([[128, 466], [150, 444], [176, 458], [170, 466]], N ? '#4a4b43' : '#a7aca8');
  s += poly([[40, 466], [10, 446], [18, 436], [48, 456]], C.box2) + poly([[186, 466], [220, 448], [213, 438], [180, 456]], C.box3);
  s += box(40, 466, 146, 86, C.box1) + `<rect x="40" y="466" width="146" height="14" fill="${C.box3}" opacity="0.6"/>`;
  s += box(16, 552, 200, 178, C.box2) + `<rect x="106" y="552" width="20" height="178" fill="${C.tape}" opacity="0.7"/>`;
  s += box(198, 594, 168, 150, C.box1) + `<rect x="198" y="610" width="168" height="16" fill="${C.tape}" opacity="0.6"/><text x="282" y="672" font-family="${SANS}" font-weight="600" font-size="21" letter-spacing="5" fill="#9c2f24" text-anchor="middle" opacity="${N ? 0.45 : 0.8}">FRAGILE</text><path d="M262,694h40M272,690l-10,4l10,4M292,690l10,4l-10,4" stroke="#9c2f24" stroke-width="1.6" fill="none" opacity="${N ? 0.4 : 0.7}"/>`;
  s += `<ellipse cx="246" cy="588" rx="20" ry="7.5" fill="none" stroke="${C.tape}" stroke-width="7"/><rect x="286" y="586" width="44" height="6" rx="3" fill="${C.sil}" transform="rotate(-8 308 589)"/>`;

  /* --- right wall: the clocks nearest the lamp --- */
  s += K.round(1196, 150, 50, 8, 20, warm2) + K.sun(1338, 132, 20, 11, 4, warm) + K.cuckoo(1450, 76, 78, 5, 55, warm) + K.deco(1546, 148, 62, 12, 33, warm2);
  s += K.round(1158, 276, 21, 2, 27, warm2) + K.school(1262, 268, 27, 9, 48, warm) + K.oct(1392, 266, 25, 3, 9, warm) + K.reg(1528, 214, 60, 178, 6, 43, warm) + K.round(1168, 376, 24, 7, 2, warm) + K.round(1462, 330, 19, 10, 15, warm);

  /* --- bench --- */
  s += `<rect x="1128" y="486" width="472" height="126" fill="#1c130d"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
    const dx = 1142 + c * 88, dy = 494 + r * 56, ajar = r === 0 && c === 3;
    if (ajar) { // one drawer left ajar: the corner of an envelope
      s += `<rect x="${dx}" y="${dy}" width="80" height="48" fill="#0c0806"/>` + poly([[dx + 22, dy + 6], [dx + 66, dy - 2], [dx + 70, dy + 10], [dx + 26, dy + 14]], '#efe6cf') + `<rect x="${dx - 2}" y="${dy + 8}" width="84" height="46" fill="#5d4129"/><rect x="${dx - 2}" y="${dy + 8}" width="84" height="4" fill="#8a643f"/><circle cx="${dx + 40}" cy="${dy + 32}" r="5" fill="#d9b566"/>`;
    } else s += `<rect x="${dx}" y="${dy}" width="80" height="48" fill="${c > 0 && c < 4 ? '#4a3321' : '#39271a'}"/><rect x="${dx}" y="${dy}" width="80" height="3" fill="#7a5838" opacity="0.6"/><circle cx="${dx + 40}" cy="${dy + 24}" r="4.6" fill="${c > 0 && c < 4 ? '#c9a35a' : '#8f733c'}"/>`;
  }
  s += `<rect x="1118" y="466" width="482" height="22" fill="#6b4a2e"/><rect x="1118" y="466" width="482" height="5" fill="#a87c4c"/><rect x="1118" y="486" width="482" height="4" fill="#000" opacity="0.35"/>`;
  s += `<rect x="1130" y="612" width="16" height="120" fill="#170f0a"/><rect x="1570" y="612" width="16" height="120" fill="#170f0a"/>`;
  // stool
  s += `<path d="M1196,596L1180,760M1264,596L1280,760M1188,690H1272" stroke="#1d140e" stroke-width="9" fill="none"/><ellipse cx="1230" cy="592" rx="48" ry="11" fill="#3a2819"/><ellipse cx="1230" cy="589" rx="48" ry="9" fill="#5a3f28"/>`;

  /* --- lamp light, then the things on the bench --- */
  s += `<rect width="1600" height="900" fill="url(#shop-lamp)"/>`;
  s += poly([[1236, 410], [1344, 410], [1452, 468], [1128, 468]], 'url(#shop-cone)');
  s += `<ellipse cx="1290" cy="470" rx="168" ry="9" fill="#ffe6ad" opacity="0.5"/>`;
  s += `<rect x="1228" y="462" width="126" height="5" rx="1" fill="#1f5a45"/>`;
  // screwdrivers in their stand
  s += `<ellipse cx="1160" cy="463" rx="22" ry="5" fill="#2a1d14"/><rect x="1142" y="448" width="36" height="14" rx="3" fill="#3a2819"/>`;
  [['#b5432e', -14, -9], ['#c9a35a', -8, -3], ['#2b4a9a', -2, 0], ['#2f6a55', 5, 3], ['#e9dfc6', 11, 8], ['#1a1a1a', 16, 12]].forEach(d => { s += `<line x1="${1160 + d[1]}" y1="450" x2="${1160 + d[1] + d[2] * 0.5}" y2="418" stroke="#c9ced4" stroke-width="2"/><line x1="${1160 + d[1] + d[2] * 0.36}" y1="428" x2="${1160 + d[1] + d[2] * 0.5}" y2="416" stroke="${d[0]}" stroke-width="5" stroke-linecap="round"/>`; });
  // loupe and tweezers on the mat
  s += `<path d="M1242,462l4,-15h15l4,15z" fill="#15120f"/><ellipse cx="1253.5" cy="447" rx="7.5" ry="2.2" fill="#3a352e"/><path d="M1314,461l32,-3M1314,463l32,-3" stroke="#d5dade" stroke-width="1.6" stroke-linecap="round"/>`;
  // a movement under its glass dome
  s += `<ellipse cx="1420" cy="465" rx="31" ry="5" fill="#2a1d14"/><ellipse cx="1420" cy="460" rx="14" ry="3.6" fill="#d9b566"/><ellipse cx="1420" cy="459" rx="8" ry="2" fill="#f7e2a2"/><path d="M1392,464v-28a28,28 0 0 1 56,0v28" fill="#dff0f2" fill-opacity="0.1" stroke="#eaf5f6" stroke-opacity="0.5" stroke-width="1.5"/><path d="M1400,440a20,20 0 0 1 14,-22" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2.2" stroke-linecap="round"/>`;
  // banker's lamp
  s += `<ellipse cx="1290" cy="465" rx="36" ry="6" fill="#8f6f2f"/><ellipse cx="1290" cy="462" rx="30" ry="4.4" fill="#d9b566"/><path d="M1290,460V424q0,-10 -10,-12" fill="none" stroke="#c9a35a" stroke-width="5"/>`;
  s += `<path d="M1230,410q0,-34 60,-34t60,34z" fill="url(#shop-shade)"/><path d="M1240,398q6,-16 34,-18" fill="none" stroke="#c9f5dc" stroke-opacity="0.5" stroke-width="2.4" stroke-linecap="round"/><rect x="1226" y="408" width="128" height="5" rx="2" fill="#fff4cf"/><circle cx="1228" cy="408" r="4.4" fill="#d9b566"/><circle cx="1352" cy="408" r="4.4" fill="#d9b566"/>`;
  s += `<circle cx="1290" cy="414" r="90" fill="url(#shop-halo)"/>`;

  // dust in the lamp light
  for (let i = 0; i < 12; i++) { const x = 1160 + rnd() * 260, y = 300 + rnd() * 150, d = 9 + rnd() * 10; s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(0.8 + rnd() * 0.9)}" fill="#ffe9b8" opacity="0"><animate attributeName="opacity" values="0;${R(0.25 + rnd() * 0.4)};0" dur="${R(d)}s" begin="${R(-rnd() * d)}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;${R(rnd() * 30 - 15)} ${R(-18 - rnd() * 22)}" dur="${R(d)}s" begin="${R(-rnd() * d)}s" repeatCount="indefinite"/></circle>`; }
  s += `<rect width="1600" height="900" fill="url(#shop-vig)"/>`;
  return SVG(s);
};

/* =====================================================================
   PORTOBELLO — Portobello Road, a Saturday, 6.40 am, rain.
   One-point perspective: M(L, h, k) maps lateral position L (-1 left
   facade .. +1 right facade), height h (0 ground .. 1 roofline) and
   depth k (1 = picture plane, smaller = further) to the screen.
   ===================================================================== */
S.portobello = function (o) {
  o = o || {}; const rnd = rng(1971), VX = 800, VY = 436, HW = 840, HH = 640, EYE = 0.23;
  const M = (L, h, k) => [VX + L * HW * k, VY + (EYE - h) * HH * k];
  const HAZE = '#647a9c', hz = (c, k) => mix(c, HAZE, Math.max(0, Math.min(0.86, (1 - k) * 1.05 - 0.12)));
  const aff = (p0, px, py, w, h) => `matrix(${R((px[0] - p0[0]) / w * 1000) / 1000},${R((px[1] - p0[1]) / w * 1000) / 1000},${R((py[0] - p0[0]) / h * 1000) / 1000},${R((py[1] - p0[1]) / h * 1000) / 1000},${R(p0[0])},${R(p0[1])})`;
  let s = '<defs>';
  s += `<linearGradient id="portobello-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131d36"/><stop offset="0.5" stop-color="#2b3f63"/><stop offset="1" stop-color="#5f7594"/></linearGradient>`;
  s += `<linearGradient id="portobello-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c607f"/><stop offset="0.25" stop-color="#2a364f"/><stop offset="1" stop-color="#121829"/></linearGradient>`;
  s += `<radialGradient id="portobello-bulb"><stop offset="0" stop-color="#fff1c4" stop-opacity="0.95"/><stop offset="0.16" stop-color="#ffd78a" stop-opacity="0.55"/><stop offset="0.5" stop-color="#f2b25e" stop-opacity="0.14"/><stop offset="1" stop-color="#f2b25e" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="portobello-streak"><stop offset="0" stop-color="#ffd78a" stop-opacity="0.5"/><stop offset="0.6" stop-color="#ffd78a" stop-opacity="0.2"/><stop offset="1" stop-color="#ffd78a" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="portobello-far" gradientUnits="userSpaceOnUse" cx="800" cy="430" r="330"><stop offset="0" stop-color="#9fb0c6" stop-opacity="0.9"/><stop offset="0.45" stop-color="#7f93af" stop-opacity="0.5"/><stop offset="1" stop-color="#7f93af" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="portobello-vig" cx="0.5" cy="0.45" r="0.78"><stop offset="0.55" stop-color="#060a16" stop-opacity="0"/><stop offset="1" stop-color="#060a16" stop-opacity="0.6"/></radialGradient>`;
  s += '</defs>';
  s += `<rect width="1600" height="900" fill="url(#portobello-sky)"/>`;
  // low cloud bands
  s += `<path d="M0,120q300,-26 620,-6t980,-18V0H0z" fill="#0d1528" opacity="0.45"/><path d="M0,230q380,-34 800,-8t800,-22v-70q-420,26 -800,6t-800,20z" fill="#3a4f78" opacity="0.22"/>`;
  // road
  s += poly([M(-0.62, 0, 3.6), M(-0.62, 0, 0.06), M(0.62, 0, 0.06), M(0.62, 0, 3.6)], 'url(#portobello-road)');

  const PAL = { '-1': ['#93809f', '#6f9396', '#a59a76', '#7b8eb1', '#a47f88', '#7c9a89', '#8a84a9', '#a39074', '#7393a0', '#9c8496', '#86989a', '#8b8cab'], '1': ['#a08c74', '#7c8db0', '#a37f8d', '#6d9690', '#9f9a7e', '#8a81a6', '#7a98a4', '#a68a80', '#7f97b0', '#9a9478', '#8f84a0', '#7c9c94'] };
  const kb = []; for (let i = 0; i <= 12; i++) kb.push(1.5 / (1 + i * 0.42));
  const SIGNS = { '-1': ['', '', 'ANTIQUES', 'SILVER', 'PRINTS & MAPS'], '1': ['', '', 'CLOCKS · WATCHES', 'BOOKS', 'CURIOS'] };
  [-1, 1].forEach(sg => {
    // far block dissolving into the rain
    s += poly([M(sg, 0, kb[12]), M(sg, 0.95, kb[12]), M(sg, 0.9, 0.07), M(sg, 0, 0.07)], hz('#7d8fb0', 0.2));
    for (let q = 0; q < 9; q++) { const kk = 0.1 + rnd() * 0.13, c = M(sg, 0.4 + rnd() * 0.4, kk); s += `<rect x="${R(c[0])}" y="${R(c[1])}" width="${R(5 * kk * 4)}" height="${R(11 * kk * 4)}" fill="${q % 3 ? '#4c6083' : '#e6c98a'}" opacity="${q % 3 ? 0.5 : 0.6}"/>`; }
    for (let i = 11; i >= 0; i--) {
      const k0 = kb[i], k1 = kb[i + 1], km = (k0 + k1) / 2, hf = 0.9 + ((i * 7 + (sg > 0 ? 3 : 0)) % 5) * 0.035, base = PAL[sg][i], col = hz(base, km), dk = hz(mix(base, '#0e1528', 0.6), km), lt = hz(mix(base, '#c9d3e4', 0.3), km);
      const Q = (u, h) => M(sg, h, k0 + (k1 - k0) * u);
      const quad = (u0, u1, h0, h1, fill, ex) => poly([Q(u0, h0), Q(u1, h0), Q(u1, h1), Q(u0, h1)], fill, ex);
      // chimney, wall, cornice
      s += quad(0.08, 0.2, hf, hf + 0.07, dk) + quad(0.1, 0.13, hf + 0.07, hf + 0.095, hz('#b0785a', km)) + quad(0.15, 0.18, hf + 0.07, hf + 0.095, hz('#b0785a', km));
      s += quad(0, 1, 0, hf, col);
      s += quad(0, 1, hf - 0.035, hf, lt) + quad(0, 1, hf - 0.05, hf - 0.035, dk, 'opacity="0.35"');
      // sash windows, two floors
      const nw = i < 3 ? 3 : 2;
      [[0.645, 0.81], [0.39, 0.535]].forEach((fl, fi) => {
        for (let w = 0; w < nw; w++) {
          const u0 = (w + 0.3) / nw, u1 = (w + 0.74) / nw, lit = rnd() < 0.22;
          s += quad(u0 - 0.02, u1 + 0.02, fl[0] - 0.015, fl[1] + 0.015, lt, 'opacity="0.5"');
          s += quad(u0, u1, fl[0], fl[1], lit ? hz('#f3c56c', Math.min(1, km + 0.25)) : dk);
          if (!lit && k0 > 0.4) s += quad(u0, u1, (fl[0] + fl[1]) / 2 - 0.004, (fl[0] + fl[1]) / 2 + 0.004, lt, 'opacity="0.5"');
        }
      });
      // shopfront: fascia, glass, door
      const shopLit = (i + (sg > 0 ? 1 : 0)) % 3 === 1;
      s += quad(0, 1, 0, 0.3, dk);
      s += quad(0.03, 0.97, 0.255, 0.305, hz(mix(base, '#141c30', 0.35), km));
      s += quad(0.08, 0.66, 0.04, 0.235, shopLit ? hz('#d9a95a', Math.min(1, km + 0.2)) : hz('#1a2540', km), shopLit ? 'opacity="0.8"' : '');
      s += quad(0.74, 0.93, 0, 0.235, hz('#131b30', km));
      if (shopLit && k0 > 0.3) { s += quad(0.08, 0.66, 0.04, 0.09, dk, 'opacity="0.8"'); for (let q = 0; q < 4; q++) s += quad(0.14 + q * 0.13, 0.2 + q * 0.13, 0.09, 0.13 + (q % 2) * 0.04, dk, 'opacity="0.75"'); }
      const sign = SIGNS[sg][i];
      if (sign) {
        const p0 = Q(sg < 0 ? 0.08 : 0.92, 0.3), px = Q(sg < 0 ? 0.92 : 0.08, 0.3), py = Q(sg < 0 ? 0.08 : 0.92, 0.26), W = 200, H = 26;
        const a = aff(p0, px, py, W, H);
        s += `<text transform="${a}" x="${W / 2}" y="${H * 0.76}" font-family="${SERIF}" font-weight="600" font-size="20" letter-spacing="3" fill="${hz('#d9c28a', km)}" text-anchor="middle" opacity="0.85">${sign}</text>`;
      }
      s += `<line x1="${R(Q(1, 0)[0])}" y1="${R(Q(1, 0)[1])}" x2="${R(Q(1, hf)[0])}" y2="${R(Q(1, hf)[1])}" stroke="${dk}" stroke-width="${R(2.4 * km)}" opacity="0.5"/>`;
    }
    // pavement and kerb
    s += poly([M(sg, 0, 3.6), M(sg, 0, 0.07), M(sg * 0.62, 0, 0.07), M(sg * 0.62, 0, 3.6)], '#27324c') + poly([M(sg * 0.62, 0, 3.6), M(sg * 0.62, 0, 0.07), M(sg * 0.6, 0, 0.07), M(sg * 0.6, 0, 3.6)], '#52627f', 'opacity="0.6"');
  });
  // the street name: enamel plate between the storeys of the second house
  (function () {
    const k0 = 0.8, k1 = 0.678, p0 = M(-1, 0.628, k0), px = M(-1, 0.628, k1), py = M(-1, 0.548, k0), W = 200, H = 70;
    s += `<g transform="${aff(p0, px, py, W, H)}"><rect width="${W}" height="${H}" rx="3" fill="#d5dae0"/><rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="2" fill="none" stroke="#141a26" stroke-width="2.4"/><text x="14" y="31" font-family="${SANS}" font-weight="600" font-size="23" letter-spacing="2" fill="#141a26">PORTOBELLO</text><text x="14" y="58" font-family="${SANS}" font-weight="600" font-size="23" letter-spacing="2" fill="#141a26">ROAD</text><text x="${W - 14}" y="58" font-family="${SANS}" font-weight="600" font-size="23" letter-spacing="1" fill="#b3322b" text-anchor="end">W11</text></g>`;
  })();
  // a hanging board for the arcade, square to the street
  (function () {
    const k = 0.7, a = M(1, 0.56, k), b = M(0.895, 0.56, k), c = M(0.895, 0.45, k);
    s += `<line x1="${R(a[0])}" y1="${R(a[1] - 4)}" x2="${R(b[0] - 4)}" y2="${R(a[1] - 4)}" stroke="#141a2c" stroke-width="3"/><rect x="${R(b[0])}" y="${R(a[1])}" width="${R(a[0] - b[0] - 8)}" height="${R(c[1] - a[1])}" rx="2" fill="#1c2a44"/><rect x="${R(b[0] + 3)}" y="${R(a[1] + 3)}" width="${R(a[0] - b[0] - 14)}" height="${R(c[1] - a[1] - 6)}" rx="1" fill="none" stroke="#c9a35a" stroke-width="1" opacity="0.8"/><text x="${R((a[0] + b[0]) / 2 - 4)}" y="${R(a[1] + 22)}" font-family="${SERIF}" font-weight="600" font-size="10.5" letter-spacing="1" fill="#d9c28a" text-anchor="middle">ANTIQUE</text><text x="${R((a[0] + b[0]) / 2 - 4)}" y="${R(a[1] + 38)}" font-family="${SERIF}" font-weight="600" font-size="10.5" letter-spacing="1" fill="#d9c28a" text-anchor="middle">ARCADE</text>`;
  })();

  // far end of the street: rain haze, a paler sky
  s += `<rect width="1600" height="900" fill="url(#portobello-far)"/>`;

  // puddles, wet sheen
  [[-0.2, 0.52, 60, 5], [0.24, 0.8, 110, 8], [-0.3, 1.3, 190, 13], [0.1, 1.9, 260, 16], [0.36, 0.42, 44, 4], [-0.05, 0.36, 38, 3]].forEach(p => { const c = M(p[0], 0, p[1]); s += `<ellipse cx="${R(c[0])}" cy="${R(c[1])}" rx="${p[2]}" ry="${p[3]}" fill="#7d93b4" opacity="0.26"/><ellipse cx="${R(c[0] - p[2] * 0.2)}" cy="${R(c[1] - p[3] * 0.2)}" rx="${R(p[2] * 0.5)}" ry="${R(p[3] * 0.45)}" fill="#b9c8dc" opacity="0.16"/>`; });

  /* --- stalls --- */
  const AW = ['#9b3d36', '#2f6b5d', '#30507f', '#b58a3f', '#7d3f5c'], CREAM = '#d8d1bf';
  const stalls = [[1.9, 1.03, 0], [0.9, 0.63, 1], [0.57, 0.44, 2], [0.4, 0.325, 3], [0.295, 0.25, 4], [0.228, 0.2, 0]];
  let glows = '', front = '', refl = '';
  [-1, 1].forEach(sg => {
    for (let n = stalls.length - 1; n >= 0; n--) {
      const ka = stalls[n][0], kz = stalls[n][1], km = Math.min(1, (ka + kz) / 2), ac = hz(AW[(stalls[n][2] + (sg > 0 ? 2 : 0)) % 5], km), cr = hz(CREAM, km), dk = hz('#161c2e', km);
      let g = '';
      // back cloth and the table with its trays
      g += poly([M(sg * 0.86, 0, ka), M(sg * 0.86, 0, kz), M(sg * 0.86, 0.3, kz), M(sg * 0.86, 0.3, ka)], hz('#1b2338', km), 'opacity="0.85"');
      g += poly([M(sg * 0.56, 0.088, ka), M(sg * 0.56, 0.088, kz), M(sg * 0.8, 0.088, kz), M(sg * 0.8, 0.088, ka)], hz('#3d4560', km));
      g += poly([M(sg * 0.56, 0, ka), M(sg * 0.56, 0, kz), M(sg * 0.56, 0.088, kz), M(sg * 0.56, 0.088, ka)], hz('#252c44', km));
      const items = Math.max(3, Math.round(16 * km));
      for (let q = 0; q < items; q++) { const kk = kz + (ka - kz) * (0.06 + 0.88 * rnd()), L = sg * (0.59 + rnd() * 0.18), c = M(L, 0.088, kk), sz = (3 + rnd() * 6) * Math.min(kk, 1.3); g += `<rect x="${R(c[0] - sz)}" y="${R(c[1] - sz * (0.5 + rnd()))}" width="${R(sz * 2)}" height="${R(sz * (0.5 + rnd()))}" rx="${R(sz * 0.3)}" fill="${hz(['#c9a35a', '#d9d2c0', '#8fa3a0', '#b5432e', '#e6dcc4', '#c9a35a'][Math.floor(rnd() * 6)], km)}" opacity="0.85"/>`; }
      // poles
      [ka, kz].forEach(kk => { if (kk > 1.6) return; const a = M(sg * 0.52, 0, kk), b = M(sg * 0.52, 0.295, kk); g += `<line x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}" stroke="${dk}" stroke-width="${R(Math.max(1.2, 5 * kk))}"/>`; });
      // striped awning and valance
      const ns = Math.max(4, Math.round(11 * Math.min(0.9, ka - kz) / 0.4));
      for (let q = 0; q < ns; q++) { const k0 = ka + (kz - ka) * q / ns, k1 = ka + (kz - ka) * (q + 1) / ns, c = q % 2 ? cr : ac; g += poly([M(sg * 0.5, 0.29, k0), M(sg * 0.5, 0.29, k1), M(sg * 0.88, 0.37, k1), M(sg * 0.88, 0.37, k0)], mix(mix(c, q % 2 ? ac : cr, 0.32), '#0e1528', 0.42)); g += poly([M(sg * 0.5, 0.29, k0), M(sg * 0.5, 0.29, k1), M(sg * 0.5, 0.262, k1), M(sg * 0.5, 0.262, k0)], c); }
      // string of bare bulbs
      const nb = Math.max(2, Math.round(5 * Math.min(1, (ka - kz) / 0.3)));
      for (let q = 0; q < nb; q++) {
        const kk = Math.min(ka, 1.55) + (kz - Math.min(ka, 1.55)) * (q + 0.5) / nb, c = M(sg * 0.505, 0.246, kk), gr = M(sg * 0.5, 0, kk), kq = Math.min(kk, 1.2);
        glows += `<circle cx="${R(c[0])}" cy="${R(c[1])}" r="${R(80 * kq)}" fill="url(#portobello-bulb)"/><circle cx="${R(c[0])}" cy="${R(c[1])}" r="${R(Math.max(1.4, 4.4 * kq))}" fill="#fff6d8"/>`;
        refl += `<ellipse cx="${R(gr[0] - sg * (26 + (q % 3) * 9) * kq)}" cy="${R(gr[1] + 96 * kq)}" rx="${R(Math.max(1.2, 4.6 * kq))}" ry="${R(96 * kq)}" fill="url(#portobello-streak)"/>`;
      }
      if (n === 0) front += g; else s += g;
    }
  });
  s += refl;
  // distant figures under umbrellas
  const fig = (L, k, col, ucol) => { const f = M(L, 0, k), h = 0.165 * HH * k, w = h * 0.3; return `<ellipse cx="${R(f[0])}" cy="${R(f[1] + 2)}" rx="${R(w * 0.9)}" ry="${R(w * 0.16)}" fill="#0b1020" opacity="0.5"/><rect x="${R(f[0] - w / 2)}" y="${R(f[1] - h * 0.86)}" width="${R(w)}" height="${R(h * 0.86)}" rx="${R(w * 0.4)}" fill="${col}"/><circle cx="${R(f[0])}" cy="${R(f[1] - h * 0.93)}" r="${R(h * 0.085)}" fill="${col}"/><line x1="${R(f[0] + w * 0.3)}" y1="${R(f[1] - h * 0.6)}" x2="${R(f[0] + w * 0.3)}" y2="${R(f[1] - h * 1.3)}" stroke="${col}" stroke-width="${R(Math.max(1, h * 0.02))}"/><path d="M${R(f[0] + w * 0.3 - h * 0.42)},${R(f[1] - h * 1.12)}a${R(h * 0.42)},${R(h * 0.3)} 0 0 1 ${R(h * 0.84)},0z" fill="${ucol}"/>`; };
  s += fig(-0.12, 0.2, hz('#1a2238', 0.3), hz('#1a2238', 0.3)) + fig(0.2, 0.27, hz('#141b30', 0.4), hz('#141b30', 0.4)) + fig(-0.34, 0.4, hz('#121829', 0.55), hz('#7d2f2b', 0.6)) + fig(0.4, 0.52, hz('#10162a', 0.7), hz('#10162a', 0.7));
  s += front;
  // a dealer behind the near right stall, torch on a tray (no face: cap and collar)
  (function () {
    const f = M(0.74, 0, 1.2), h = 0.185 * HH * 1.2;
    s += `<path d="M${R(f[0] - 34)},${R(f[1] - h * 0.42)}v${R(-h * 0.36)}q0,-16 18,-18h32q18,2 18,18v${R(h * 0.36)}z" fill="#0e1424"/><circle cx="${R(f[0])}" cy="${R(f[1] - h * 0.94)}" r="15" fill="#0e1424"/><path d="M${R(f[0] - 19)},${R(f[1] - h * 0.99)}q19,-16 38,0l6,3h-50z" fill="#0b1020"/>`;
    const t0 = [f[0] - 44, f[1] - h * 0.56], t1 = M(0.66, 0.09, 1.16);
    s += poly([t0, [t1[0] - 34, t1[1] + 2], [t1[0] + 30, t1[1] + 4]], '#ffe9b0', 'opacity="0.3"') + `<ellipse cx="${R(t1[0] - 2)}" cy="${R(t1[1] + 3)}" rx="34" ry="7" fill="#fff1c4" opacity="0.5"/><rect x="${R(t0[0] - 5)}" y="${R(t0[1] - 6)}" width="22" height="9" rx="3" fill="#0b1020" transform="rotate(24 ${R(t0[0])} ${R(t0[1])})"/>`;
  })();
  s += glows;
  // rain
  let rain = '';
  for (let gI = 0; gI < 3; gI++) {
    let ln = ''; for (let i = 0; i < 64; i++) { const x = rnd() * 1900 - 100, y = rnd() * 900, l = 26 + rnd() * 34; ln += `M${R(x)},${R(y)}l${R(-l * 0.16)},${R(l)}`; }
    const d = [0.9, 1.2, 1.55][gI];
    rain += `<g><path d="${ln}" stroke="#cfdcf0" stroke-width="${[1.3, 1, 0.8][gI]}" opacity="${[0.3, 0.24, 0.18][gI]}" fill="none"/><animateTransform attributeName="transform" type="translate" values="150 -900;-150 900" dur="${d}s" begin="${R(-d * gI / 3)}s" repeatCount="indefinite"/></g>`;
  }
  s += rain;
  s += `<rect width="1600" height="900" fill="url(#portobello-vig)"/>`;
  return SVG(s);
};

/* =====================================================================
   PUCES — a covered alley at the Saint-Ouen flea market, Paris.
   Same one-point mapper as Portobello; goods are little upright sprites
   drawn at k = 1 scale (112 px to the metre) and placed on the floor.
   ===================================================================== */
S.puces = function (o) {
  o = o || {}; const rnd = rng(1885), VX = 800, VY = 420, HW = 760, HH = 560, EYE = 0.3;
  const M = (L, h, k) => [VX + L * HW * k, VY + (EYE - h) * HH * k];
  const aff = (p0, px, py, w, h) => `matrix(${R((px[0] - p0[0]) / w * 1000) / 1000},${R((px[1] - p0[1]) / w * 1000) / 1000},${R((py[0] - p0[0]) / h * 1000) / 1000},${R((py[1] - p0[1]) / h * 1000) / 1000},${R(p0[0])},${R(p0[1])})`;
  const G1 = '#c9a35a', G2 = '#8a6a2c', G3 = '#ecd08e', IRON = '#39413a', WALL = '#8d8877';
  let s = '<defs>';
  s += `<linearGradient id="puces-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3c0"/><stop offset="1" stop-color="#efe7d2"/></linearGradient>`;
  s += `<linearGradient id="puces-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6cdb4"/><stop offset="0.22" stop-color="#a39c88"/><stop offset="0.6" stop-color="#5f5b50"/><stop offset="1" stop-color="#2c2b27"/></linearGradient>`;
  s += `<radialGradient id="puces-far" gradientUnits="userSpaceOnUse" cx="800" cy="408" r="300"><stop offset="0" stop-color="#f6efd9" stop-opacity="0.96"/><stop offset="0.4" stop-color="#eee5cc" stop-opacity="0.55"/><stop offset="1" stop-color="#eee5cc" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="puces-glow"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0.9"/><stop offset="0.25" stop-color="#f7cf82" stop-opacity="0.4"/><stop offset="1" stop-color="#f7cf82" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="puces-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a211c" stop-opacity="0.55"/><stop offset="0.3" stop-color="#1a211c" stop-opacity="0"/></linearGradient>`;
  s += `<radialGradient id="puces-vig" cx="0.5" cy="0.42" r="0.78"><stop offset="0.55" stop-color="#14120e" stop-opacity="0"/><stop offset="1" stop-color="#14120e" stop-opacity="0.62"/></radialGradient>`;
  s += '</defs>';
  s += `<rect width="1600" height="900" fill="url(#puces-sky)"/>`;

  /* --- glass and iron roof --- */
  const RE = 0.86, HE = 0.86, HR = 1.2;       // eave L, eave height, ridge height
  [-1, 1].forEach(sg => { s += poly([M(sg * RE, HE, 2.6), M(0, HR, 2.6), M(0, HR, 0.06), M(sg * RE, HE, 0.06)], sg < 0 ? '#e4dcc6' : '#d7cfb8'); });
  let bars = '', truss = '';
  for (let i = 0; i < 46; i++) { const k = 2.4 / (1 + i * 0.16); [-1, 1].forEach(sg => { const a = M(sg * RE, HE, k), b = M(0, HR, k); bars += `M${R(a[0])},${R(a[1])}L${R(b[0])},${R(b[1])}`; }); }
  s += `<path d="${bars}" stroke="#7d7a68" stroke-width="1" opacity="0.5" fill="none"/>`;
  [0.33, 0.66].forEach(t => [-1, 1].forEach(sg => { const a = M(sg * RE * (1 - t), HE + (HR - HE) * t, 2.6), b = M(sg * RE * (1 - t), HE + (HR - HE) * t, 0.06); s += `<line x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}" stroke="${IRON}" stroke-width="2" opacity="0.5"/>`; }));
  const tk = []; for (let i = 0; i < 9; i++) tk.push(1.7 / (1 + i * 0.5));
  tk.forEach(k => {
    const l = M(-RE, HE, k), r = M(RE, HE, k), t = M(0, HR, k), w = Math.max(1.5, 9 * k), op = Math.min(1, 0.35 + k * 0.6);
    truss += `<g opacity="${R(op)}" fill="none" stroke="${IRON}" stroke-linejoin="round"><path d="M${R(l[0])},${R(l[1])}L${R(t[0])},${R(t[1])}L${R(r[0])},${R(r[1])}" stroke-width="${R(w)}"/><path d="M${R(l[0])},${R(l[1])}Q${R(t[0])},${R(t[1] + (l[1] - t[1]) * 0.25)} ${R(r[0])},${R(r[1])}" stroke-width="${R(w * 0.55)}"/><path d="M${R(l[0])},${R(l[1])}H${R(r[0])}" stroke-width="${R(w * 0.4)}"/><path d="M${R(t[0])},${R(t[1])}V${R(l[1])}" stroke-width="${R(w * 0.4)}"/>`;
    [-1, 1].forEach(sg => { const c = M(sg * RE * 0.5, HE, k), d = M(sg * RE * 0.5, HE + (HR - HE) * 0.5, k); truss += `<path d="M${R(c[0])},${R(c[1])}V${R(d[1])}" stroke-width="${R(w * 0.3)}"/><circle cx="${R(M(sg * RE * 0.72, HE, k)[0])}" cy="${R(c[1] - 16 * k)}" r="${R(13 * k)}" stroke-width="${R(w * 0.3)}"/>`; });
    truss += `</g>`;
  });
  s += truss;
  [-1, 0, 1].forEach(sg => { const a = M(sg * RE, sg ? HE : HR, 2.6), b = M(sg * RE, sg ? HE : HR, 0.06); s += `<line x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}" stroke="${IRON}" stroke-width="${sg ? 5 : 3}" opacity="0.8"/>`; });

  /* --- floor --- */
  s += poly([M(-RE, 0, 3.4), M(-RE, 0, 0.06), M(RE, 0, 0.06), M(RE, 0, 3.4)], 'url(#puces-floor)');
  let fl = '';
  for (let i = -4; i <= 4; i++) { const a = M(i * RE / 4, 0, 3.4), b = M(i * RE / 4, 0, 0.06); fl += `M${R(a[0])},${R(a[1])}L${R(b[0])},${R(b[1])}`; }
  for (let i = 0; i < 26; i++) { const k = 3 / (1 + i * 0.32), a = M(-RE, 0, k), b = M(RE, 0, k); fl += `M${R(a[0])},${R(a[1])}H${R(b[0])}`; }
  s += `<path d="${fl}" stroke="#2f2d28" stroke-width="1.1" opacity="0.22" fill="none"/>`;
  s += `<ellipse cx="800" cy="470" rx="150" ry="26" fill="#f6efd9" opacity="0.35"/>`;

  /* --- stalls: bays down both sides --- */
  const kb = []; for (let i = 0; i <= 11; i++) kb.push(1.7 / (1 + i * 0.5));
  const FASCIA = ['#3c5a57', '#6b2e28', '#c9bf9f', '#2f4a3a', '#b5923f', '#49566b'];
  const NAMES = { '-1': ['', 'TABLEAUX · CADRES', 'LUMINAIRES', 'MOBILIER', 'LIVRES ANCIENS'], '1': ['', 'HORLOGERIE ANCIENNE', 'CURIOSITÉS', 'ARGENTERIE', 'BROCANTE'] };
  [-1, 1].forEach(sg => {
    s += poly([M(sg * RE, 0, kb[11]), M(sg * RE, HE, kb[11]), M(sg * RE, HE, 0.06), M(sg * RE, 0, 0.06)], '#a8a08a');
    for (let i = 10; i >= 0; i--) {
      const k0 = kb[i], k1 = kb[i + 1], km = (k0 + k1) / 2, fz = t => mix(t, '#cfc6ad', Math.max(0, Math.min(0.8, (1 - km) * 0.95 - 0.1)));
      const Q = (u, h) => M(sg * RE, h, k0 + (k1 - k0) * u), quad = (u0, u1, h0, h1, fill, ex) => poly([Q(u0, h0), Q(u1, h0), Q(u1, h1), Q(u0, h1)], fill, ex);
      const fc = FASCIA[(i + (sg > 0 ? 3 : 0)) % 6], lit = (i + (sg > 0 ? 0 : 1)) % 2 === 0;
      s += quad(0, 1, 0.62, HE, fz(WALL)) + quad(0, 1, 0.82, HE, fz('#6f6b5c'));
      s += quad(0.2, 0.42, 0.67, 0.78, fz('#cfc9b6'), 'opacity="0.55"') + quad(0.58, 0.8, 0.67, 0.78, fz('#cfc9b6'), 'opacity="0.55"');
      s += quad(0, 1, 0, 0.5, fz(lit ? '#3a2c1f' : '#231d18'));
      s += quad(0.12, 0.88, 0.04, 0.4, fz(lit ? '#5a4128' : '#2e2620'), 'opacity="0.9"');
      if (lit) { const c = Q(0.5, 0.36); s += `<circle cx="${R(c[0])}" cy="${R(c[1])}" r="${R(150 * km)}" fill="url(#puces-glow)" opacity="0.55"/>`; }
      s += quad(0, 1, 0.5, 0.62, fz(fc)) + quad(0, 1, 0.5, 0.515, fz(mix(fc, '#000', 0.4)));
      // half-raised shutter slats under the fascia
      for (let q = 0; q < 3; q++) s += quad(0.02, 0.98, 0.488 - q * 0.02, 0.5 - q * 0.02, fz(q % 2 ? '#6d7069' : '#84877f'));
      s += quad(-0.012, 0.03, 0, 0.62, fz('#55594f'));
      const nm = NAMES[sg][i];
      if (nm) {
        const W = 300, H = 40, p0 = Q(sg < 0 ? 0.06 : 0.94, 0.6), px = Q(sg < 0 ? 0.94 : 0.06, 0.6), py = Q(sg < 0 ? 0.06 : 0.94, 0.52);
        s += `<text transform="${aff(p0, px, py, W, H)}" x="${W / 2}" y="${H * 0.72}" font-family="${SERIF}" font-weight="600" font-size="${nm.length > 14 ? 19 : 25}" letter-spacing="${nm.length > 14 ? 1.6 : 4}" fill="${fz(/^#c9/.test(fc) ? '#3a2c1f' : '#e9dfc6')}" text-anchor="middle">${nm}</text>`;
      }
    }
  });

  /* --- sprites --- */
  const frame = (x, w, h, inner, art, t) => { t = t || 9; return `<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="${G2}"/><rect x="${x + 2}" y="${-h + 2}" width="${w - 4}" height="${h - 4}" fill="${G1}"/><rect x="${x + 4}" y="${-h + 4}" width="${w - 8}" height="2" fill="${G3}"/><rect x="${x + t - 2}" y="${-h + t - 2}" width="${w - 2 * t + 4}" height="${h - 2 * t + 4}" fill="${G2}"/><rect x="${x + t}" y="${-h + t}" width="${w - 2 * t}" height="${h - 2 * t}" fill="${inner}"/>${art || ''}`; };
  const SP = {
    frames() { // a leaning stack of gilt frames
      return `<g transform="rotate(-4)">${frame(-78, 128, 156, '#7f8f8c', `<rect x="-69" y="-76" width="110" height="67" fill="#4d5a42"/><path d="M-69,-76q30,-22 56,-8t54,-12v20z" fill="#5f6e52"/><circle cx="14" cy="-116" r="9" fill="#e9dfc6" opacity="0.7"/>`)}</g>`
        + `<g transform="translate(24,0) rotate(3)">${frame(-50, 100, 124, '#241f1a')}</g>`
        + `<g transform="translate(-30,0) rotate(-2)">${frame(-40, 78, 92, '#6b3a2c', `<circle cx="-2" cy="-44" r="15" fill="#c9a35a" opacity="0.8"/><rect x="-22" y="-32" width="42" height="12" fill="#3a2a1f"/>`, 8)}</g>`
        + `<g transform="translate(44,0) rotate(5)">${frame(-28, 58, 70, '#cfd3cc', `<path d="M-14,-56l22,0l-30,42z" fill="#fff" opacity="0.35"/>`, 7)}</g>`;
    },
    mirror() { return `<path d="M-10,-124q10,-18 20,0q-10,6 -20,0z" fill="${G1}"/><ellipse cx="0" cy="-66" rx="40" ry="60" fill="${G2}"/><ellipse cx="0" cy="-66" rx="36" ry="56" fill="${G1}"/><ellipse cx="0" cy="-66" rx="28" ry="48" fill="#d5d8cf"/><path d="M-16,-100q-8,26 0,60" stroke="#fff" stroke-width="5" opacity="0.4" fill="none" stroke-linecap="round"/><rect x="-22" y="-8" width="44" height="8" fill="${G2}"/>`; },
    chair(fab) { fab = fab || '#8a9a8f'; const wd = '#6b4a2e'; return `<path d="M-18,-40L-20,0M18,-40L20,0M-13,-40L-12,-6M13,-40L12,-6M-14,-50V-66M14,-50V-66" stroke="${wd}" stroke-width="3.4" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-82" rx="19" ry="23" fill="${wd}"/><ellipse cx="0" cy="-82" rx="14" ry="18" fill="${fab}"/><rect x="-22" y="-52" width="44" height="11" rx="4" fill="${fab}"/><rect x="-22" y="-43" width="44" height="5" rx="2" fill="${wd}"/>`; },
    lamps() { // console table with two lit lamps
      const lamp = x => `<circle cx="${x}" cy="-118" r="60" fill="url(#puces-glow)"/><path d="M${x - 9},-78q-4,-12 4,-20h10q8,8 4,20z" fill="#49566b"/><rect x="${x - 2}" y="-106" width="4" height="10" fill="${G1}"/><path d="M${x - 20},-104l7,-26h26l7,26z" fill="#f4d591"/><path d="M${x - 20},-104l7,-26h6l-5,26z" fill="#fff" opacity="0.25"/>`;
      return `<rect x="-64" y="-78" width="128" height="7" fill="#4a3321"/><rect x="-58" y="-71" width="116" height="8" fill="#39271a"/><path d="M-54,-63L-50,0M54,-63L50,0" stroke="#39271a" stroke-width="5" fill="none"/>${lamp(-32)}${lamp(30)}<rect x="-8" y="-88" width="18" height="10" fill="${G1}"/>`;
    },
    longcase() { const w1 = '#5a3b24', w2 = '#7a5433', w3 = '#3c2616'; return `<rect x="-25" y="-48" width="50" height="48" fill="${w1}"/><rect x="-25" y="-48" width="50" height="5" fill="${w2}"/><rect x="-18" y="-152" width="36" height="104" fill="${w1}"/><rect x="-9" y="-136" width="18" height="70" fill="${w3}"/><line x1="0" y1="-134" x2="0" y2="-86" stroke="${G1}" stroke-width="1.6"/><circle cx="0" cy="-82" r="6" fill="${G1}"/><rect x="-26" y="-208" width="52" height="56" fill="${w1}"/><path d="M-28,-208q28,-26 56,0z" fill="${w2}"/><circle cx="0" cy="-226" r="3.4" fill="${G1}"/><g transform="translate(0,-180)"><circle r="19" fill="${G1}"/>${face(16, 3, 52, { face: '#e9dfc6' })}</g><rect x="-26" y="-154" width="52" height="4" fill="${w2}"/>`; },
    vitrine() {
      let v = `<rect x="-86" y="-64" width="172" height="64" fill="#231a13"/><rect x="-86" y="-64" width="172" height="6" fill="#4a3321"/><rect x="-74" y="-50" width="68" height="40" fill="#1a130e"/><rect x="6" y="-50" width="68" height="40" fill="#1a130e"/><circle cx="-12" cy="-30" r="2.6" fill="${G1}"/><circle cx="12" cy="-30" r="2.6" fill="${G1}"/>`;
      v += `<rect x="-80" y="-212" width="160" height="148" fill="#1f3a32"/><rect x="-80" y="-212" width="160" height="148" fill="#ffe9b0" opacity="0.14"/>`;
      // three glass shelves of watches
      [-104, -150, -68].forEach((y, r) => {
        v += `<rect x="-78" y="${y}" width="156" height="2.4" fill="#dfeee9" opacity="${r === 2 ? 0 : 0.6}"/>`;
        for (let i = 0; i < 6; i++) { const x = -64 + i * 25.5 + (r % 2 ? 6 : 0), gold = (i + r) % 3 === 0, col = gold ? '#e6c56e' : '#d5dade', strap = ['#3a2a1f', '#141414', '#6b3a2c', '#2f4a3a'][(i + r) % 4];
          if ((i + r) % 4 === 3) v += `<circle cx="${x}" cy="${y - 13}" r="9" fill="${G1}"/><circle cx="${x}" cy="${y - 13}" r="6.6" fill="#f1e9d6"/><circle cx="${x}" cy="${y - 24}" r="2.6" fill="none" stroke="${G1}" stroke-width="1.4"/><path d="M${x},${y - 13}v-4.6M${x},${y - 13}h3.4" stroke="#222" stroke-width="1"/>`;
          else v += `<rect x="${x - 3.6}" y="${y - 26}" width="7.2" height="25" rx="2" fill="${strap}"/><circle cx="${x}" cy="${y - 13}" r="7.4" fill="${col}"/><circle cx="${x}" cy="${y - 13}" r="5.2" fill="${(i + r) % 2 ? '#f1e9d6' : '#1c1c1c'}"/><path d="M${x},${y - 13}v-3.6M${x},${y - 13}h2.8" stroke="${(i + r) % 2 ? '#222' : '#eee'}" stroke-width="0.9"/>`; }
      });
      v += `<rect x="-80" y="-212" width="160" height="148" fill="none" stroke="${G1}" stroke-width="5"/><line x1="0" y1="-212" x2="0" y2="-64" stroke="${G1}" stroke-width="3.4"/><rect x="-86" y="-220" width="172" height="10" fill="${G2}"/><rect x="-86" y="-220" width="172" height="3" fill="${G3}"/>`;
      v += `<path d="M-70,-206l26,0l-34,70v-52z" fill="#fff" opacity="0.16"/><path d="M14,-206l14,0l-22,56z" fill="#fff" opacity="0.13"/>`;
      v += `<path d="M-30,-220l5,-17h50l5,17z" fill="#efe6cf"/><text x="0" y="-224.6" font-family="${SANS}" font-weight="600" font-size="8.6" letter-spacing="1.6" fill="#7a2e26" text-anchor="middle">MONTRES</text>`;
      return v;
    },
    cases() { return `<rect x="-50" y="-32" width="100" height="32" rx="3" fill="#6b4a2e"/><rect x="-44" y="-60" width="88" height="28" rx="3" fill="#8a5a34"/><rect x="-36" y="-82" width="72" height="22" rx="3" fill="#4a3a2c"/><path d="M-30,-32v32M30,-32v32M-26,-60v28M26,-60v28M-20,-82v22M20,-82v22" stroke="#2a1d14" stroke-width="3" opacity="0.6"/><path d="M-8,-82q8,-10 16,0" stroke="#2a1d14" stroke-width="2.6" fill="none"/><path d="M-17,-91a17,17 0 0 1 34,0" fill="none" stroke="${G1}" stroke-width="2.4" transform="translate(0,-10)"/><circle cx="0" cy="-104" r="16" fill="#6f8f8a"/><path d="M-16,-104h32M0,-120v32M-11,-115q11,11 22,0M-11,-93q11,-11 22,0" stroke="#e9dfc6" stroke-width="0.9" fill="none" opacity="0.6"/><rect x="-2" y="-88" width="4" height="6" fill="${G1}"/>`; },
    urn() { return `<rect x="-17" y="-72" width="34" height="72" fill="#b9b19c"/><rect x="-21" y="-78" width="42" height="8" fill="#cfc8b4"/><rect x="-21" y="-8" width="42" height="8" fill="#a39c88"/><rect x="3" y="-70" width="14" height="62" fill="#000" opacity="0.1"/><path d="M-6,-78q-4,-6 0,-10q-18,-10 -16,-30q0,-10 8,-12h28q8,2 8,12q2,20 -16,30q4,4 0,10z" fill="#56706a"/><path d="M-14,-130h28l3,-6h-34z" fill="#6a8780"/><path d="M-10,-124q-6,14 2,30" stroke="#fff" stroke-width="3" opacity="0.2" fill="none" stroke-linecap="round"/>`; },
    rug() { return `<rect x="-46" y="0" width="92" height="150" fill="#7a2e26"/><rect x="-40" y="6" width="80" height="138" fill="none" stroke="#e0cfa8" stroke-width="2.4"/><rect x="-33" y="13" width="66" height="124" fill="none" stroke="#c9a35a" stroke-width="1.2"/><path d="M0,34l22,41l-22,41l-22,-41z" fill="#2f4a5a"/><path d="M0,52l12,23l-12,23l-12,-23z" fill="#e0cfa8"/>` + Array.from({ length: 12 }, (_, i) => `<line x1="${-43 + i * 7.8}" y1="150" x2="${-43 + i * 7.8}" y2="158" stroke="#e0cfa8" stroke-width="1.4"/>`).join(''); },
    chandelier() { let c = `<circle cx="0" cy="62" r="110" fill="url(#puces-glow)" opacity="0.6"/><line x1="0" y1="0" x2="0" y2="46" stroke="${G2}" stroke-width="2.4"/><path d="M-5,40h10l3,22h-16z" fill="${G1}"/>`; for (let i = -2; i <= 2; i++) { if (!i) continue; const x = i * 20; c += `<path d="M0,58q${x * 0.5},16 ${x},-2" fill="none" stroke="${G1}" stroke-width="2.4"/><rect x="${x - 2}" y="44" width="4" height="12" fill="#f1e9d6"/><circle cx="${x}" cy="41" r="3.4" fill="#fff3c4"/><circle cx="${x}" cy="66" r="2.4" fill="#eaf5f6" opacity="0.9"/><circle cx="${x * 0.5}" cy="76" r="2.2" fill="#eaf5f6" opacity="0.8"/>`; } return c + `<circle cx="0" cy="84" r="4.4" fill="#eaf5f6" opacity="0.9"/>`; },
    cage() { let c = `<line x1="0" y1="0" x2="0" y2="20" stroke="${G2}" stroke-width="1.6"/><circle cx="0" cy="22" r="3" fill="none" stroke="${G1}" stroke-width="1.6"/>`; for (let i = -3; i <= 3; i++) c += `<path d="M0,26Q${i * 9},30 ${i * 7},52V86" fill="none" stroke="${G1}" stroke-width="1.3"/>`; return c + `<path d="M-21,52h42M-21,70h42" stroke="${G1}" stroke-width="1.3"/><rect x="-23" y="86" width="46" height="5" rx="2" fill="${G2}"/>`; },
    figure(c) { return `<ellipse cx="0" cy="1" rx="22" ry="4" fill="#000" opacity="0.2"/><path d="M-17,0V-104q0,-22 17,-22t17,22V0z" fill="${c}"/><circle cx="0" cy="-140" r="13" fill="${c}"/>`; }
  };
  // a rug rolled out in front of the picture dealer, a crate of prints across the way
  (function () {
    const q = (L, k) => M(L, 0, k), A = q(-0.62, 1.04), B = q(-0.3, 1.04), C = q(-0.3, 0.8), D = q(-0.62, 0.8);
    const lerp = (p, r, t) => [p[0] + (r[0] - p[0]) * t, p[1] + (r[1] - p[1]) * t], cen = [(A[0] + B[0] + C[0] + D[0]) / 4, (A[1] + B[1] + C[1] + D[1]) / 4], inset = t => [A, B, C, D].map(p => lerp(p, cen, t));
    s += poly([A, B, C, D], '#6f2a24') + poly(inset(0.1), '#e0cfa8') + poly(inset(0.14), '#7a2e26') + poly(inset(0.34), '#2f4a5a') + poly(inset(0.44), '#7a2e26') + poly(inset(0.7), '#e0cfa8', 'opacity="0.8"');
    const c = M(0.4, 0, 0.94);
    s += `<g transform="translate(${R(c[0])},${R(c[1])})"><ellipse cx="0" cy="3" rx="56" ry="8" fill="#1c1a16" opacity="0.25"/><rect x="-46" y="-36" width="92" height="36" fill="#6b4a2e"/><rect x="-46" y="-36" width="92" height="5" fill="#8a643f"/><path d="M-46,-18h92" stroke="#3a2819" stroke-width="2"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${-42 + i * 9.4}" y="${-52 - (i * 5) % 9}" width="8" height="${18 + (i * 5) % 9}" fill="${['#e9dfc6', '#b5432e', '#cfc5a8', '#49566b', '#e9dfc6', '#c9a35a', '#d9d2c0', '#2f4a3a', '#e9dfc6'][i]}"/>`).join('') + `</g>`;
  })();
  const put = (L, k, body, h) => { const c = M(L, h || 0, k); return `<g transform="translate(${R(c[0])},${R(c[1])}) scale(${R(k * 100) / 100})">${body}</g>`; };
  const shadow = (L, k, w) => { const c = M(L, 0, k); return `<ellipse cx="${R(c[0])}" cy="${R(c[1] + 3 * k)}" rx="${R(w * k)}" ry="${R(w * k * 0.13)}" fill="#1c1a16" opacity="0.28"/>`; };
  const items = [
    [0.3, -0.84, 'chair', 0, 24, '#9a7a70'], [0.3, 0.8, 'urn', 0, 22], [0.36, -0.8, 'mirror', 0, 34], [0.36, 0.84, 'chair', 0, 24, '#7f8fa0'],
    [0.42, 0.8, 'longcase', 0, 28], [0.44, -0.84, 'rug', 0.47, 0], [0.48, -0.74, 'urn', 0, 22], [0.5, 0.8, 'chandelier', 0.5, 0],
    [0.56, -0.8, 'lamps', 0, 62], [0.6, 0.74, 'cases', 0, 50], [0.66, -0.72, 'chair', 0, 24, '#8a9a8f'], [0.7, 0.84, 'mirror', 0, 34],
    [0.66, 0.8, 'cage', 0.5, 0], [0.72, 0.78, 'longcase', 0, 28], [0.8, -0.84, 'chandelier', 0.5, 0], [0.9, -0.8, 'mirror', 0, 34],
    [0.92, -0.6, 'chair', 0, 24, '#a08c74'], [1.18, -0.64, 'frames', 0, 84], [1.22, 0.6, 'vitrine', 0, 90]
  ];
  items.forEach(it => { if (it[4]) s += shadow(it[1], it[0], it[4]); s += put(it[1], it[0], SP[it[2]](it[5]), it[3]); if (it[0] < 0.4) { /* far things soften below */ } });
  s += put(-0.2, 0.2, SP.figure('#6f6a5c')) + put(0.26, 0.26, SP.figure('#5d594e')) + put(0.1, 0.15, SP.figure('#857f6e'));

  // far end of the alley, washed out by daylight
  s += `<rect width="1600" height="900" fill="url(#puces-far)"/>`;

  /* --- garlands of bulbs across the alley --- */
  [[0.62, 0.8], [0.4, 0.78], [0.27, 0.76]].forEach(gd => {
    const k = gd[0], a = M(-RE, gd[1], k), b = M(RE, gd[1], k), sag = 46 * k;
    s += `<path d="M${R(a[0])},${R(a[1])}Q800,${R(a[1] + sag * 2)} ${R(b[0])},${R(b[1])}" fill="none" stroke="${IRON}" stroke-width="${R(Math.max(0.8, 1.6 * k))}" opacity="0.7"/>`;
    for (let i = 1; i < 12; i++) { const t = i / 12, x = a[0] + (b[0] - a[0]) * t, y = a[1] + sag * 2 * 2 * t * (1 - t) + 4 * k; s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(26 * k)}" fill="url(#puces-glow)" opacity="0.5"/><circle cx="${R(x)}" cy="${R(y)}" r="${R(Math.max(1.3, 4 * k))}" fill="#fff3c4"/>`; }
  });

  /* --- ivy along the left eave, trailing over the stalls --- */
  const GREENS = ['#1f3a2c', '#2f4a3a', '#3c5f45', '#27462f', '#4a6f4c'];
  const leaf = (x, y, r, c, a) => `<path d="M0,${R(-r)}q${R(r * 0.9)},${R(r * 0.1)} ${R(r * 0.9)},${R(r * 0.9)}q${R(-r * 0.4)},${R(r * 0.5)} ${R(-r * 0.9)},${R(r * 0.4)}q${R(-r * 0.5)},${R(0.1 * r)} ${R(-r * 0.9)},${R(-r * 0.4)}q0,${R(-r * 0.8)} ${R(r * 0.9)},${R(-r * 0.9)}z" transform="translate(${R(x)},${R(y)}) rotate(${R(a)})" fill="${c}"/>`;
  let ivy = '';
  for (let i = 0; i < 150; i++) {
    const k = 0.32 + Math.pow(rnd(), 0.7) * 1.25, h = 0.6 + rnd() * 0.3 - (rnd() < 0.2 ? rnd() * 0.22 : 0), c = M(-RE + 0.012, h, k);
    ivy += leaf(c[0] + (rnd() * 26 - 6) * k, c[1], (10 + rnd() * 12) * k, GREENS[Math.floor(rnd() * 5)], rnd() * 360);
  }
  for (let i = 0; i < 7; i++) { // hanging strands
    const k = 0.5 + i * 0.13 + rnd() * 0.05, top = M(-RE + 0.02, 0.64, k), len = (60 + rnd() * 90) * k;
    ivy += `<path d="M${R(top[0])},${R(top[1])}q${R(8 * k)},${R(len * 0.5)} ${R(2 * k)},${R(len)}" fill="none" stroke="#27462f" stroke-width="${R(2 * k)}"/>`;
    for (let q = 0; q < 6; q++) ivy += leaf(top[0] + (4 + (q % 2 ? 7 : -5)) * k, top[1] + len * (q + 1) / 6.4, (8 + rnd() * 5) * k, GREENS[(q + i) % 5], rnd() * 360);
  }
  for (let i = 0; i < 26; i++) { const k = 0.5 + rnd() * 0.9, c = M(RE - 0.012, 0.74 + rnd() * 0.14, k); ivy += leaf(c[0] - rnd() * 16 * k, c[1], (9 + rnd() * 9) * k, GREENS[Math.floor(rnd() * 5)], rnd() * 360); }
  s += ivy;
  // enamel plaque
  (function () { const p0 = M(RE, 0.79, 0.99), px = M(RE, 0.79, 0.87), py = M(RE, 0.7, 0.99), W = 150, H = 62; s += `<g transform="${aff(px, p0, M(RE, 0.7, 0.87), W, H)}"><rect width="${W}" height="${H}" rx="4" fill="#23407a"/><rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="2" fill="none" stroke="#e9e6dc" stroke-width="2.4"/><text x="${W / 2}" y="41" font-family="${SANS}" font-weight="600" font-size="27" letter-spacing="3" fill="#f1ede2" text-anchor="middle">ALLÉE 7</text></g>`; })();

  s += `<rect width="1600" height="900" fill="url(#puces-top)"/><rect width="1600" height="900" fill="url(#puces-vig)"/>`;
  return SVG(s);
};

/* =====================================================================
   MARSEILLE — the Vallon des Auffes: a fishing port the size of a courtyard,
   the Corniche viaduct across its mouth, hard winter sun.
   Flat stage layers: sky, hill, sea, bridge, houses, water, boats.
   ===================================================================== */
S.marseille = function (o) {
  o = o || {}; const rnd = rng(1961);
  const STONE = '#eadfc2', STONE2 = '#d6c8a4', STONE3 = '#b3a27f', ROOF = '#c06c43', ROOF2 = '#9c5232';
  let s = '<defs>';
  s += `<linearGradient id="marseille-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3486c6"/><stop offset="0.55" stop-color="#86c2e2"/><stop offset="1" stop-color="#d6ebee"/></linearGradient>`;
  s += `<radialGradient id="marseille-sun" gradientUnits="userSpaceOnUse" cx="1352" cy="104" r="420"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.08" stop-color="#fffbe6" stop-opacity="0.7"/><stop offset="0.35" stop-color="#fff6d0" stop-opacity="0.22"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></radialGradient>`;
  s += `<linearGradient id="marseille-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2670a4"/><stop offset="1" stop-color="#3a97b6"/></linearGradient>`;
  s += `<linearGradient id="marseille-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc4b6"/><stop offset="0.3" stop-color="#2aa3a6"/><stop offset="0.62" stop-color="#157282"/><stop offset="1" stop-color="#0b3f4c"/></linearGradient>`;
  s += `<linearGradient id="marseille-arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f7f5e" stop-opacity="0.75"/><stop offset="1" stop-color="#8f7f5e" stop-opacity="0"/></linearGradient>`;
  s += `<radialGradient id="marseille-vig" cx="0.5" cy="0.4" r="0.8"><stop offset="0.6" stop-color="#06202a" stop-opacity="0"/><stop offset="1" stop-color="#06202a" stop-opacity="0.5"/></radialGradient>`;
  s += `<clipPath id="marseille-wclip"><rect x="0" y="478" width="1600" height="422"/></clipPath>`;
  s += '</defs>';
  s += `<rect width="1600" height="900" fill="url(#marseille-sky)"/><rect width="1600" height="900" fill="url(#marseille-sun)"/><circle cx="1352" cy="104" r="23" fill="#fff"/>`;
  // gulls
  [[250, 96, 1], [318, 122, 0.7], [1010, 150, 0.8], [930, 90, 0.55]].forEach(g => { s += `<path d="M${g[0] - 13 * g[2]},${g[1]}q${6 * g[2]},${-8 * g[2]} ${13 * g[2]},0q${7 * g[2]},${-8 * g[2]} ${13 * g[2]},0" fill="none" stroke="#fff" stroke-width="${R(2.2 * g[2])}" stroke-linecap="round" opacity="0.9"/>`; });

  /* --- far hill, Notre-Dame de la Garde on top --- */
  s += `<path d="M40,400Q200,330 330,236Q392,178 430,168Q476,176 540,236Q640,318 800,400Z" fill="#c2c2ae"/><path d="M430,168Q476,176 540,236Q640,318 800,400H560Q500,300 430,168Z" fill="#d9d6bd"/>`;
  for (let i = 0; i < 70; i++) { const t = rnd(), x = 110 + t * 620, top = 400 - Math.max(0, 1 - Math.abs(x - 430) / 390) * 215, y = top + 22 + rnd() * (400 - top - 26); if (y > 396) continue; s += i % 4 === 0 ? `<ellipse cx="${R(x)}" cy="${R(y)}" rx="${R(7 + rnd() * 8)}" ry="${R(4 + rnd() * 3)}" fill="#6f8f76" opacity="0.75"/>` : `<rect x="${R(x)}" y="${R(y)}" width="${R(7 + rnd() * 9)}" height="${R(5 + rnd() * 5)}" fill="${['#f1ead8', '#e6d3a8', '#e3bfa4', '#f6f1e3'][i % 4]}" opacity="0.85"/>`; }
  s += `<path d="M398,172h64v-9l-8,-7h-40l-16,7z" fill="#dcd5bd"/><rect x="398" y="166" width="64" height="2" fill="#9aa692" opacity="0.7"/><path d="M440,156a9,9 0 0 1 18,0z" fill="#b9c4b0"/>`;
  s += `<rect x="423" y="116" width="12" height="46" fill="#e6dfc8"/>` + [122, 130, 138, 146, 154].map(y => `<rect x="423" y="${y}" width="12" height="2.2" fill="#8fa08c" opacity="0.8"/>`).join('') + `<path d="M421,116h16l-3,-7h-10z" fill="#cfc8b0"/><rect x="427.6" y="99" width="2.8" height="10" fill="#e3bd62"/><circle cx="429" cy="97" r="2.6" fill="#f0cf7a"/>`;

  /* --- open sea beyond the bridge, the Château d'If on the horizon --- */
  s += `<rect x="300" y="392" width="1000" height="90" fill="url(#marseille-sea)"/><rect x="300" y="392" width="1000" height="2" fill="#e8f3f2" opacity="0.5"/>`;
  s += `<path d="M770,392q14,-8 30,-8h34q20,2 30,8z" fill="#b9c7c4"/><rect x="800" y="377" width="26" height="8" fill="#c9d3cc"/><rect x="806" y="372" width="7" height="6" fill="#c9d3cc"/>`;
  s += `<path d="M1150,392l16,-22l12,22z" fill="#f6f1e3" opacity="0.9"/><rect x="1146" y="391" width="34" height="2.4" fill="#33485a" opacity="0.7"/>`;

  /* --- the viaduct: three round arches --- */
  const AR = [[360, 610], [675, 925], [990, 1240]];
  let holes = ''; AR.forEach(a => { const r = (a[1] - a[0]) / 2; holes += `M${a[0]},482V425A${r},${r} 0 0 1 ${a[1]},425V482Z`; });
  s += `<path fill-rule="evenodd" d="M290,262H1310V482H290Z${holes}" fill="${STONE}"/>`;
  let courses = ''; for (let y = 276; y < 480; y += 13) courses += `M290,${y}H1310`;
  s += `<clipPath id="marseille-bclip"><path fill-rule="evenodd" d="M290,262H1310V482H290Z${holes}"/></clipPath><g clip-path="url(#marseille-bclip)"><path d="${courses}" stroke="${STONE3}" stroke-width="1" opacity="0.28"/>`;
  [[290, 360], [610, 675], [925, 990], [1240, 1310]].forEach(pr => { s += `<rect x="${pr[0]}" y="262" width="${R((pr[1] - pr[0]) * 0.34)}" height="220" fill="${STONE3}" opacity="0.3"/>`; });
  s += `<rect x="290" y="262" width="1020" height="16" fill="${STONE3}" opacity="0.5"/></g>`;
  AR.forEach(a => {
    const r = (a[1] - a[0]) / 2, cx = (a[0] + a[1]) / 2;
    s += `<path d="M${a[0]},425A${r},${r} 0 0 1 ${a[1]},425" fill="none" stroke="${STONE2}" stroke-width="12"/><path d="M${a[0]},425A${r},${r} 0 0 1 ${a[1]},425" fill="none" stroke="${STONE3}" stroke-width="12" stroke-dasharray="1.5 15" opacity="0.7"/>`;
    s += `<path d="M${a[0]},482V425A${r},${r} 0 0 1 ${a[1]},425V482H${a[1] - 26}V425A${r - 26},${r - 14} 0 0 0 ${a[0] + 12},425V482Z" fill="url(#marseille-arch)"/>`;
  });
  // parapet, lamps, the 83 bus
  s += `<rect x="282" y="246" width="1036" height="18" fill="${STONE}"/><rect x="282" y="246" width="1036" height="4" fill="#f7efd8"/><path d="M290,256H1310" stroke="${STONE3}" stroke-width="6" stroke-dasharray="3 9" opacity="0.6"/>`;
  for (let x = 340; x < 1300; x += 152) s += `<rect x="${x}" y="206" width="3" height="42" fill="#3a4a52"/><path d="M${x + 1.5},208q0,-8 10,-8" fill="none" stroke="#3a4a52" stroke-width="2.4"/><circle cx="${x + 13}" cy="201" r="3.6" fill="#f6f1e3"/>`;
  s += `<rect x="700" y="222" width="76" height="25" rx="4" fill="#f6f1e3"/><rect x="700" y="237" width="76" height="6" fill="#2a9fa6"/><rect x="706" y="226" width="56" height="9" rx="1.5" fill="#33485a"/><rect x="766" y="226" width="7" height="12" rx="1.5" fill="#33485a"/><circle cx="716" cy="247" r="4.4" fill="#222b30"/><circle cx="760" cy="247" r="4.4" fill="#222b30"/>`;
  s += `<path d="M1080,247v-8q0,-3 5,-4l5,-6h18l7,6q7,1 7,5v7z" fill="#b5432e"/><circle cx="1090" cy="247" r="3.6" fill="#222b30"/><circle cx="1113" cy="247" r="3.6" fill="#222b30"/>`;

  /* --- houses --- */
  const SH = ['#3a78a3', '#3f7a63', '#7fa0b3', '#a8473a', '#2f5d86', '#6a8f6a'];
  const house = (x, y, w, h, wall, q) => {
    q = q || {}; const sh = q.sh || SH[Math.floor(rnd() * SH.length)];
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wall}"/><rect x="${x}" y="${y}" width="${R(w * 0.3)}" height="${h}" fill="#5a4a3a" opacity="0.14"/>`;
    const cols = q.cols || Math.max(1, Math.round(w / 56)), rows = q.rows != null ? q.rows : Math.max(1, Math.floor((h - 16) / 50));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x + (c + 0.5) * w / cols - 8, wy = y + 20 + r * 48, closed = rnd() < 0.28;
      if (closed) g += `<rect x="${R(wx - 2)}" y="${wy}" width="20" height="28" fill="${sh}"/><path d="M${R(wx - 2)},${wy + 7}h20M${R(wx - 2)},${wy + 14}h20M${R(wx - 2)},${wy + 21}h20M${R(wx + 8)},${wy}v28" stroke="#1d2f3a" stroke-width="0.9" opacity="0.4"/>`;
      else g += `<rect x="${R(wx)}" y="${wy}" width="16" height="28" fill="#2f4557"/><rect x="${R(wx - 9)}" y="${wy - 1}" width="8" height="30" fill="${sh}"/><rect x="${R(wx + 17)}" y="${wy - 1}" width="8" height="30" fill="${sh}"/><rect x="${R(wx - 2)}" y="${wy + 28}" width="20" height="3" fill="#fff" opacity="0.5"/>`;
    }
    if (q.flat) g += `<rect x="${x - 3}" y="${y - 7}" width="${w + 6}" height="9" fill="${mix(wall, '#8a7a5a', 0.25)}"/><rect x="${x - 3}" y="${y - 7}" width="${w + 6}" height="2.4" fill="#fff" opacity="0.4"/>`;
    else { g += poly([[x - 7, y + 3], [x + w + 7, y + 3], [x + w - 3, y - 13], [x + 3, y - 13]], ROOF) + `<path d="M${x - 2},${y - 2}H${x + w + 2}M${x + 1},${y - 7}H${x + w - 1}" stroke="${ROOF2}" stroke-width="1.4" opacity="0.7"/><rect x="${x - 7}" y="${y + 3}" width="${w + 14}" height="5" fill="#4a3526" opacity="0.4"/>`; if (q.chim) g += `<rect x="${x + w * 0.66}" y="${y - 26}" width="12" height="16" fill="${wall}"/><rect x="${x + w * 0.66 - 2}" y="${y - 29}" width="16" height="4" fill="${ROOF2}"/>`; }
    if (q.door) g += `<path d="M${x + w / 2 - q.door / 2},${y + h}v${-h * 0.56}q0,-${q.door * 0.35} ${q.door / 2},-${q.door * 0.35}t${q.door / 2},${q.door * 0.35}v${h * 0.56}z" fill="${q.dcol || sh}"/><path d="M${x + w / 2},${y + h}v${-h * 0.56 - q.door * 0.32}" stroke="#1d2f3a" stroke-width="1.2" opacity="0.45"/>`;
    return g;
  };
  const pine = (x, y, sc) => `<path d="M${x},${y}q${-6 * sc},${-34 * sc} ${4 * sc},${-70 * sc}" fill="none" stroke="#6b5238" stroke-width="${R(5 * sc)}"/><ellipse cx="${R(x + 4 * sc)}" cy="${R(y - 78 * sc)}" rx="${R(46 * sc)}" ry="${R(17 * sc)}" fill="#2f5a43"/><ellipse cx="${R(x - 12 * sc)}" cy="${R(y - 88 * sc)}" rx="${R(30 * sc)}" ry="${R(12 * sc)}" fill="#3d6d50"/><ellipse cx="${R(x + 22 * sc)}" cy="${R(y - 84 * sc)}" rx="${R(24 * sc)}" ry="${R(10 * sc)}" fill="#244a36"/>`;
  // left bank
  s += `<path d="M0,290Q120,250 250,262Q330,300 372,372L392,482H0Z" fill="#cdbf9c"/><path d="M250,262Q330,300 372,372L392,482H330Q340,360 250,262Z" fill="#b7a682"/>`;
  s += pine(52, 214, 1.05) + pine(300, 236, 0.8);
  s += house(8, 178, 128, 126, '#e6b267', { chim: 1, sh: '#3f7a63' }) + house(132, 196, 104, 110, '#f6efde', { sh: '#3a78a3' }) + house(232, 226, 86, 84, '#e39a78', { cols: 1, sh: '#7fa0b3' });
  s += house(-10, 284, 112, 110, '#f6efde', { flat: 1, sh: '#a8473a' }) + house(98, 300, 116, 96, '#efd68e', { chim: 1, sh: '#2f5d86' }) + house(210, 318, 100, 80, '#f3e7cf', { sh: '#3f7a63' }) + house(306, 340, 74, 62, '#e8b9a2', { cols: 1, rows: 1, sh: '#3a78a3' });
  // laundry
  s += `<path d="M98,318q-28,10 -56,2" fill="none" stroke="#5a4a3a" stroke-width="1"/>` + [[52, 322, '#f6f1e3'], [64, 324, '#b5432e'], [76, 324, '#f2c14e'], [88, 321, '#7fa0b3']].map(l => `<rect x="${l[0]}" y="${l[1]}" width="9" height="14" fill="${l[2]}"/>`).join('');
  // cabanons on the water
  s += house(0, 396, 92, 74, '#f6efde', { rows: 0, door: 40, dcol: '#2f6f9a' }) + house(88, 404, 84, 66, '#e6b267', { rows: 0, door: 38, dcol: '#3f7a63' }) + house(168, 398, 96, 72, '#f3e7cf', { rows: 0, door: 42, dcol: '#a8473a', flat: 1 }) + house(260, 410, 82, 60, '#e39a78', { rows: 0, door: 36, dcol: '#e9dfc6' });
  // right bank
  s += `<path d="M1600,300Q1480,262 1350,276Q1262,310 1232,380L1210,482H1600Z" fill="#d6c8a4"/><path d="M1350,276Q1262,310 1232,380L1210,482H1262Q1262,360 1350,276Z" fill="#c2b28c"/>`;
  s += pine(1560, 236, 1.1) + pine(1296, 262, 0.7);
  s += house(1330, 204, 106, 112, '#f6efde', { sh: '#2f5d86', chim: 1 }) + house(1432, 188, 100, 128, '#efd68e', { sh: '#3f7a63' }) + house(1528, 216, 90, 100, '#e39a78', { cols: 1, sh: '#7fa0b3' });
  s += house(1262, 300, 104, 100, '#e8b9a2', { sh: '#3a78a3' }) + house(1362, 292, 122, 108, '#f3e7cf', { flat: 1, sh: '#a8473a' }) + house(1480, 306, 126, 96, '#e6b267', { chim: 1, sh: '#2f5d86' });
  s += house(1246, 404, 84, 66, '#f6efde', { rows: 0, door: 38, dcol: '#3f7a63' });
  // the restaurant terrace: striped awning, a few tables
  s += `<rect x="1326" y="398" width="274" height="72" fill="#f3e7cf"/><rect x="1326" y="398" width="82" height="72" fill="#5a4a3a" opacity="0.14"/><rect x="1346" y="430" width="230" height="40" fill="#2f4557"/>`;
  for (let i = 0; i < 16; i++) s += poly([[1332 + i * 17, 402], [1349 + i * 17, 402], [1343 + i * 17, 436], [1322 + i * 17, 436]], i % 2 ? '#f6f1e3' : '#2f6f9a');
  s += `<rect x="1318" y="436" width="282" height="10" fill="#f6f1e3"/><text x="1458" y="444.4" font-family="${SANS}" font-weight="600" font-size="8.4" letter-spacing="3.4" fill="#2f6f9a" text-anchor="middle">BOUILLABAISSE · POISSONS</text><rect x="1318" y="446" width="282" height="4" fill="#1d2f3a" opacity="0.25"/>`;
  for (let i = 0; i < 5; i++) s += `<rect x="${1362 + i * 46}" y="459" width="20" height="3" fill="#f6f1e3"/><rect x="${1371 + i * 46}" y="462" width="2" height="8" fill="#d5dade"/>`;

  /* --- quays --- */
  s += `<rect x="0" y="468" width="352" height="9" fill="#f1e7cc"/><rect x="0" y="476" width="352" height="18" fill="${STONE3}"/><rect x="0" y="488" width="352" height="6" fill="#5f6b4a" opacity="0.55"/>`;
  s += `<rect x="1248" y="468" width="352" height="9" fill="#f1e7cc"/><rect x="1248" y="476" width="352" height="18" fill="${STONE3}"/><rect x="1248" y="488" width="352" height="6" fill="#5f6b4a" opacity="0.55"/>`;
  [40, 150, 290, 1300, 1430, 1560].forEach(x => { s += `<rect x="${x}" y="459" width="9" height="10" rx="2.5" fill="#3a4a52"/>`; });
  // nets drying, a stack of crates
  s += `<rect x="296" y="456" width="18" height="12" fill="#2f6f9a"/><rect x="316" y="458" width="16" height="10" fill="#e0a23e"/><rect x="302" y="445" width="18" height="12" fill="#b5432e"/><rect x="1586" y="455" width="14" height="13" fill="#2f6f9a"/>`;

  /* --- water --- */
  s += `<rect x="0" y="482" width="1600" height="418" fill="url(#marseille-water)"/><rect x="352" y="478" width="896" height="6" fill="#4cc4b6"/>`;
  let wv = '';
  // reflections: piers, bright walls
  const wob = (x0, x1, y0, y1, col, op) => { let d = `M${x0},${y0}`; const n = 9; for (let i = 1; i <= n; i++) d += `L${R(x0 + (i % 2 ? 7 : -5) * (i / n + 0.3))},${R(y0 + (y1 - y0) * i / n)}`; for (let i = n; i >= 0; i--) d += `L${R(x1 + (i % 2 ? -6 : 6) * (i / n + 0.3))},${R(y0 + (y1 - y0) * i / n)}`; return `<path d="${d}Z" fill="${col}" opacity="${op}"/>`; };
  wv += wob(300, 360, 484, 590, STONE, 0.24) + wob(610, 675, 484, 600, STONE, 0.24) + wob(925, 990, 484, 600, STONE, 0.24) + wob(1240, 1300, 484, 590, STONE, 0.24);
  wv += wob(20, 80, 494, 560, '#f6efde', 0.22) + wob(110, 160, 494, 550, '#e6b267', 0.22) + wob(190, 250, 494, 560, '#f3e7cf', 0.2) + wob(1350, 1560, 494, 560, '#f3e7cf', 0.18);
  AR.forEach(a => { wv += wob(a[0] + 30, a[1] - 30, 484, 540, '#2670a4', 0.22); });

  /* --- boats: the pointus --- */
  const boat = (x, y, sc, strake, q) => {
    q = q || {}; const hull = q.hull || '#f6f1e3', dir = q.flip ? -1 : 1;
    let b = `<g transform="translate(${x},${y}) scale(${R(sc * dir)},${sc})">`;
    b += `<g opacity="0.3" transform="scale(1,-0.55) translate(0,-30)"><path d="M-64,-12Q-52,10 -30,14H32Q54,10 62,-10Q30,-1 0,-1T-64,-12Z" fill="#0e4855"/></g>`;
    if (q.mast !== false) b += `<line x1="-8" y1="0" x2="-8" y2="-58" stroke="#6b5238" stroke-width="2.6"/><path d="M-40,-22L26,-64" stroke="#6b5238" stroke-width="2.2"/><path d="M-36,-23L22,-60l2,5L-33,-18z" fill="#f1e7cc"/>`;
    b += `<path d="M-64,-12Q-52,10 -30,14H32Q54,10 62,-10Q30,-1 0,-1T-64,-12Z" fill="${hull}"/>`;
    b += `<path d="M-64,-12Q-30,-1 0,-1T62,-10L60,-4Q30,5 0,5T-61,-6Z" fill="${strake}"/>`;
    b += `<path d="M-50,8Q-40,13 -30,14H32Q44,13 52,8Q0,13 -50,8Z" fill="#9c3b34"/>`;
    b += `<path d="M-64,-12l-4,-13l5,0l4,13z" fill="${strake}"/><rect x="10" y="-11" width="22" height="10" rx="1.5" fill="${q.cab || '#d9cdb0'}"/><path d="M-64,-12Q-30,-1 0,-1T62,-10" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/>`;
    return b + `</g>`;
  };
  let boats = '';
  boats += boat(548, 497, 0.5, '#2f6f9a', { mast: false }) + boat(1068, 499, 0.48, '#b5432e', { flip: 1, mast: false }) + boat(470, 507, 0.56, '#3f7a63', { flip: 1 });
  boats += boat(214, 528, 0.95, '#2f6f9a') + boat(330, 556, 0.86, '#3f7a63', { flip: 1, mast: false, hull: '#f3e7cf' }) + boat(110, 574, 1.12, '#b5432e', { flip: 1 });
  boats += boat(1304, 530, 0.95, '#e0a23e', { flip: 1 }) + boat(1196, 560, 0.84, '#2f6f9a', { mast: false }) + boat(1430, 570, 1.12, '#2a9fa6', { hull: '#f6f1e3' });
  boats += boat(1290, 716, 1.9, '#27546e', { hull: '#9fb3b0', cab: '#8a9a94', flip: 1 }) + boat(250, 742, 1.7, '#7a3a34', { hull: '#a3b3ac', cab: '#8a9a94', mast: false });
  // mooring lines and buoys
  boats += `<path d="M150,528L60,480M270,560L352,482M1240,530L1300,478M1250,558L1250,490M1500,572L1540,478" stroke="#e9dfc6" stroke-width="0.9" opacity="0.6" fill="none"/>`;
  [[410, 538, '#f2742b'], [640, 552, '#f6f1e3'], [960, 546, '#f2742b'], [1130, 606, '#f2742b'], [520, 628, '#f6f1e3'], [786, 590, '#f2742b']].forEach(b => { boats += `<ellipse cx="${b[0]}" cy="${b[1] + 6}" rx="7" ry="2.4" fill="#0e4855" opacity="0.4"/><circle cx="${b[0]}" cy="${b[1]}" r="5.4" fill="${b[2]}"/><circle cx="${b[0] - 1.6}" cy="${b[1] - 1.8}" r="1.6" fill="#fff" opacity="0.7"/>`; });

  // shimmer
  let sh = '';
  for (let i = 0; i < 90; i++) {
    const y = 492 + Math.pow(rnd(), 1.3) * 380, x = rnd() * 1600, w = (10 + rnd() * 34) * (0.5 + (y - 480) / 400), d = 2.2 + rnd() * 3.6, op = (0.3 + rnd() * 0.5) * (y > 640 ? 0.5 : 1);
    sh += `<rect x="${R(x)}" y="${R(y)}" width="${R(w)}" height="${R(1.4 + (y - 480) / 300)}" rx="1" fill="#eafff8" opacity="${R(op * 0.3)}"><animate attributeName="opacity" values="${R(op * 0.15)};${R(op)};${R(op * 0.15)}" dur="${R(d)}s" begin="${R(-rnd() * d)}s" repeatCount="indefinite"/></rect>`;
  }
  let rip = ''; for (let i = 0; i < 26; i++) { const y = 500 + i * i * 0.56 + i * 6, x = (i * 173) % 1500; rip += `M${x},${R(y)}q40,-5 80,0t80,0`; }
  s += `<g clip-path="url(#marseille-wclip)">${wv}<path d="${rip}" stroke="#0e5565" stroke-width="1.6" fill="none" opacity="0.28"/>${boats}${sh}</g>`;

  s += `<rect width="1600" height="900" fill="url(#marseille-vig)"/>`;
  return SVG(s);
};

})();
