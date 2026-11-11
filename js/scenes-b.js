/* UNSIGNED — backdrops, set B: New York (47th Street), the auction room,
   Nakano Broadway, Lake Suwa. Each returns an SVG string, viewBox 1600x900. */
(function () {
  'use strict';
  const S = (window.Scenes = window.Scenes || {});
  const f = n => Math.round(n * 10) / 10;
  function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const quad = p => 'M' + p.map(q => f(q[0]) + ',' + f(q[1])).join('L') + 'Z';
  const circ = (x, y, r) => `M${f(x - r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(r * 2)},0a${f(r)},${f(r)} 0 1,0 ${f(-r * 2)},0Z`;
  const box = (x, y, w, h) => `M${f(x)},${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
  const SVG = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
  const JOST = "Jost, 'Helvetica Neue', Arial, sans-serif", CORM = "'Cormorant Garamond', Georgia, serif";

  // a standing figure, feet at (x,y), height h
  function person(x, y, h, o) {
    o = o || {}; const hw = h * 0.125, hr = h * 0.072, lx = (o.lean || 0) * h * 0.012;
    let d = circ(x + lx, y - h * 0.915, hr) + box(x + lx - hr * 0.45, y - h * 0.86, hr * 0.9, h * 0.05);
    d += `M${f(x - hw)},${f(y - h * 0.79)}Q${f(x - hw * 0.9)},${f(y - h * 0.835)} ${f(x - hw * 0.3)},${f(y - h * 0.84)}H${f(x + hw * 0.3)}Q${f(x + hw * 0.9)},${f(y - h * 0.835)} ${f(x + hw)},${f(y - h * 0.79)}L${f(x + hw * 1.14)},${f(y - h * 0.35)}L${f(x - hw * 1.14)},${f(y - h * 0.35)}Z`;
    d += `M${f(x - hw * 0.96)},${f(y - h * 0.8)}L${f(x - hw * 1.5)},${f(y - h * 0.5)}L${f(x - hw * 1.2)},${f(y - h * 0.46)}L${f(x - hw * 0.8)},${f(y - h * 0.68)}Z`;
    d += `M${f(x + hw * 0.96)},${f(y - h * 0.8)}L${f(x + hw * 1.5)},${f(y - h * 0.5)}L${f(x + hw * 1.2)},${f(y - h * 0.46)}L${f(x + hw * 0.8)},${f(y - h * 0.68)}Z`;
    d += `M${f(x - hw * 0.9)},${f(y - h * 0.37)}H${f(x - hw * 0.08)}L${f(x - hw * 0.22)},${f(y)}H${f(x - hw * 0.78)}Z` + `M${f(x + hw * 0.9)},${f(y - h * 0.37)}H${f(x + hw * 0.08)}L${f(x + hw * 0.22)},${f(y)}H${f(x + hw * 0.78)}Z`;
    if (o.hat) d += box(x - hr * 1.35, y - h * 0.975, hr * 2.7, hr * 0.42) + box(x - hr * 0.85, y - h * 1.03, hr * 1.7, hr * 0.85);
    if (o.bag) d += box(x + hw * 1.1, y - h * 0.47, hw * 1.0, h * 0.16) + box(x + hw * 1.42, y - h * 0.5, hw * 0.36, h * 0.04);
    return d;
  }

  /* ===================================================== NEW YORK — W 47th ST */
  S.nyc = function (o) {
    o = o || {};
    const R = rng(4747), VX = 800, VY = 500;
    const L = (x, yN) => VY + (yN - VY) * (VX - x) / VX;       // line on the left wall (reference at x=0)
    const Rt = (x, yN) => VY + (yN - VY) * (x - VX) / VX;      // line on the right wall (reference at x=1600)
    const near = '#0a1211', far = '#3d525e';
    let bld = '', wWarm = '', wCool = '', wDark = '', shops = '', shopFr = '', ledges = '';
    function side(list, mirror) {
      const Y = mirror ? Rt : L, X = x => mirror ? 1600 - x : x;
      list.forEach(B => {
        const xa = B[0], xb = B[1], top = B[2], t = Math.min(1, Math.max(0, xa) / 720), col = mix(near, far, Math.pow(t, 1.3));
        const xA = X(xa), xB = X(xb);
        bld += `<path d="${quad([[xA, Y(xA, top)], [xB, Y(xB, top)], [xB, Y(xB, 862)], [xA, Y(xA, 862)]])}" fill="${col}"/>`;
        ledges += quad([[xA, Y(xA, top)], [xB, Y(xB, top)], [xB, Y(xB, top + 16)], [xA, Y(xA, top + 16)]]);
        ledges += quad([[xA, Y(xA, 640)], [xB, Y(xB, 640)], [xB, Y(xB, 652)], [xA, Y(xA, 652)]]);
        const cols = Math.max(2, Math.round((xb - xa) / (30 + 26 * (1 - t))));
        for (let r = top + 70; r < 600; r += 76) {
          for (let k = 0; k < cols; k++) {
            const X1 = X(xa + (xb - xa) * (k + 0.2) / cols), X2 = X(xa + (xb - xa) * (k + 0.8) / cols);
            const ys = [Y(X1, r), Y(X2, r), Y(X2, r + 46), Y(X1, r + 46)];
            if (Math.max(ys[2], ys[3]) < -6) continue;
            const q = quad([[X1, ys[0]], [X2, ys[1]], [X2, ys[2]], [X1, ys[3]]]), v = R();
            if (v < 0.2) wWarm += q; else if (v < 0.27) wCool += q; else wDark += q;
          }
        }
        const p = (xb - xa) * 0.07, x1 = X(xa + p), x2 = X(xb - p);
        shops += quad([[x1, Y(x1, 688)], [x2, Y(x2, 688)], [x2, Y(x2, 836)], [x1, Y(x1, 836)]]);
        const n = Math.max(1, Math.round((xb - xa) / 60));
        for (let k = 1; k < n; k++) { const xm = X(xa + p + (xb - xa - 2 * p) * k / n), w = 5 * (1 - t) + 1.4; shopFr += quad([[xm - w / 2, Y(xm, 688)], [xm + w / 2, Y(xm, 688)], [xm + w / 2, Y(xm, 836)], [xm - w / 2, Y(xm, 836)]]); }
        shopFr += quad([[x1, Y(x1, 806)], [x2, Y(x2, 806)], [x2, Y(x2, 836)], [x1, Y(x1, 836)]]);
      });
    }
    side([[-10, 190, -900], [190, 356, -640], [356, 476, -980], [476, 560, -1200], [560, 626, -300], [626, 682, -640], [682, 716, -150]], false);
    side([[-10, 214, -760], [214, 372, -1080], [372, 470, -560], [470, 548, -1300], [548, 612, -480], [612, 672, -220], [672, 712, -420]], true);

    // signs — flat panels facing the street
    const glowItems = [];
    function neonBox(x, y, w, h, c, bg) { glowItems.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="${c}" stroke-width="5"/>`); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${bg || '#0c1110'}"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/>`; }
    function vText(x, y, h, word, c, size) { let s = ''; const st = h / word.length; for (let i = 0; i < word.length; i++) s += `<text x="${x}" y="${f(y + st * (i + 0.5))}" font-family="${JOST}" font-weight="600" font-size="${size}" fill="${c}" text-anchor="middle" dominant-baseline="central">${word[i]}</text>`; return s; }
    let signs = '';
    // left: vertical DIAMONDS blade
    signs += `<rect x="236" y="120" width="30" height="5" fill="#1b2624"/><rect x="236" y="480" width="30" height="5" fill="#1b2624"/>`;
    signs += neonBox(262, 84, 60, 456, '#ff5466', '#150c10');
    const dia = vText(292, 104, 416, 'DIAMONDS', '#ffe3dc', 38);
    signs += dia; glowItems.push(vText(292, 104, 416, 'DIAMONDS', '#ff5466', 38));
    // left: lightbox WE BUY GOLD
    signs += `<rect x="36" y="420" width="212" height="70" rx="4" fill="#f3c84a"/><rect x="36" y="420" width="212" height="70" rx="4" fill="url(#nyc-lb)"/><text x="142" y="457" font-family="${JOST}" font-weight="600" font-size="25" letter-spacing="1.6" fill="#1c1406" text-anchor="middle" dominant-baseline="central">WE BUY GOLD</text>`;
    glowItems.push(`<rect x="36" y="420" width="212" height="70" rx="4" fill="#f3c84a" opacity="0.7"/>`);
    // left: small ones further down the block
    signs += neonBox(366, 350, 96, 34, '#58d8c4') + `<text x="414" y="368" font-family="${JOST}" font-weight="500" font-size="17" letter-spacing="3" fill="#bff5ea" text-anchor="middle" dominant-baseline="central">LOANS</text>`;
    signs += `<rect x="478" y="404" width="72" height="22" rx="2" fill="#efe3c4"/><text x="514" y="416" font-family="${JOST}" font-weight="600" font-size="10" letter-spacing="1.2" fill="#3a2a14" text-anchor="middle" dominant-baseline="central">JEWELRY</text>`;
    signs += `<rect x="566" y="430" width="44" height="14" rx="2" fill="#b3402e"/><rect x="630" y="446" width="30" height="10" rx="1" fill="#e9c35a" opacity="0.85"/>`;
    // right: WATCHES neon
    signs += `<rect x="1266" y="232" width="300" height="84" rx="5" fill="#0c1413"/>`;
    signs += `<text x="1416" y="270" font-family="${JOST}" font-weight="500" font-size="52" letter-spacing="9" fill="#e6f6ff" text-anchor="middle" dominant-baseline="central">WATCHES</text><rect x="1290" y="301" width="252" height="3.2" rx="1.6" fill="#f0cd7c"/>`;
    glowItems.push(`<text x="1416" y="270" font-family="${JOST}" font-weight="500" font-size="52" letter-spacing="9" fill="#86cfff" text-anchor="middle" dominant-baseline="central">WATCHES</text><rect x="1290" y="300" width="252" height="5" fill="#f0cd7c"/>`);
    // right: vertical EXCHANGE
    signs += `<rect x="1196" y="190" width="26" height="5" fill="#1b2624"/><rect x="1196" y="450" width="26" height="5" fill="#1b2624"/>`;
    signs += neonBox(1146, 150, 52, 352, '#6fe0a6', '#0b1512') + vText(1172, 166, 320, 'EXCHANGE', '#dcffe9', 30);
    glowItems.push(vText(1172, 166, 320, 'EXCHANGE', '#6fe0a6', 30));
    // right: lightbox WATCH REPAIR
    signs += `<rect x="1352" y="392" width="208" height="46" rx="3" fill="#efe6cf"/><rect x="1352" y="392" width="208" height="46" rx="3" fill="url(#nyc-lb)"/><text x="1456" y="409" font-family="${JOST}" font-weight="600" font-size="17" letter-spacing="2.4" fill="#1f2a26" text-anchor="middle" dominant-baseline="central">WATCH REPAIR</text><text x="1456" y="427" font-family="${JOST}" font-weight="500" font-size="10.5" letter-spacing="3" fill="#7a4a2a" text-anchor="middle" dominant-baseline="central">2ND FLOOR · SINCE 1961</text>`;
    glowItems.push(`<rect x="1352" y="392" width="208" height="46" fill="#efe6cf" opacity="0.6"/>`);
    signs += `<rect x="1062" y="404" width="76" height="22" rx="2" fill="#a8382c"/><text x="1100" y="416" font-family="${JOST}" font-weight="600" font-size="9.5" letter-spacing="1.2" fill="#ffe9d6" text-anchor="middle" dominant-baseline="central">ESTATE BUYERS</text>`;
    signs += `<rect x="1000" y="436" width="46" height="14" rx="2" fill="#e9c35a" opacity="0.9"/><rect x="948" y="452" width="28" height="9" rx="1" fill="#58d8c4" opacity="0.75"/>`;

    // string lights
    let wires = '', bulbs = '';
    [[330, 150, 1270, 132, 74, 24], [468, 262, 1132, 246, 46, 17], [566, 330, 1034, 320, 26, 12]].forEach(w => {
      const [x1, y1, x2, y2, sag, n] = w, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2;
      wires += `<path d="M${x1},${y1}Q${cx},${cy} ${x2},${y2}" fill="none" stroke="#0a100f" stroke-width="${f(0.8 + sag / 60)}" opacity="0.8"/>`;
      for (let i = 1; i < n; i++) { const t = i / n, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2; bulbs += circ(x, y + 3, 1.6 + sag / 26); }
    });

    // people
    let pplNear = '', pplMid = '', pplFar = '';
    pplNear += person(118, 905, 262, { hat: 1 }) + person(1488, 905, 258, { bag: 1 });
    pplMid += person(232, 868, 196) + person(1378, 866, 190, { hat: 1 }) + person(1318, 838, 150);
    pplFar += person(352, 800, 122, { bag: 1 }) + person(1246, 790, 112) + person(556, 668, 58) + person(586, 664, 54, { hat: 1 }) + person(1034, 662, 54) + person(498, 706, 80);

    // snow
    let snow = '';
    for (let i = 0; i < 38; i++) { const x = R() * 1700 - 40, r = 0.9 + R() * 1.6, d = 10 + R() * 12; snow += `<circle cx="${f(x)}" cy="-10" r="${f(r)}" fill="#eaf2f4" opacity="${f(0.35 + R() * 0.4)}"><animateTransform attributeName="transform" type="translate" values="0 0; ${f(-30 - R() * 50)} 930" dur="${f(d)}s" begin="${f(-R() * d)}s" repeatCount="indefinite"/></circle>`; }

    // steam
    let steam = '';
    for (let i = 0; i < 6; i++) { const d = 6 + i * 0.7; steam += `<ellipse cx="${586 + (i % 3) * 14}" cy="760" rx="${44 + i * 9}" ry="${36 + i * 8}" fill="url(#nyc-steamg)" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0; ${-16 - i * 6} ${-190 - i * 22}" dur="${d}s" begin="${f(-i * 1.3)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.5;0.28;0" dur="${d}s" begin="${f(-i * 1.3)}s" repeatCount="indefinite"/></ellipse>`; }

    const body = `
<defs>
  <linearGradient id="nyc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16283a"/><stop offset="0.3" stop-color="#2f4a5e"/><stop offset="0.5" stop-color="#7c8b93"/><stop offset="0.62" stop-color="#d7b79a"/></linearGradient>
  <radialGradient id="nyc-haze" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f4c9a0" stop-opacity="0.85"/><stop offset="0.45" stop-color="#e5a987" stop-opacity="0.32"/><stop offset="1" stop-color="#e5a987" stop-opacity="0"/></radialGradient>
  <linearGradient id="nyc-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a474c"/><stop offset="0.25" stop-color="#18232a"/><stop offset="1" stop-color="#0a1112"/></linearGradient>
  <linearGradient id="nyc-shop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7ad"/><stop offset="1" stop-color="#e19a4c"/></linearGradient>
  <linearGradient id="nyc-lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.3"/><stop offset="1" stop-color="#000" stop-opacity="0.12"/></linearGradient>
  <linearGradient id="nyc-ref" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.22" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="nyc-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c531"/><stop offset="1" stop-color="#c98f14"/></linearGradient>
  <radialGradient id="nyc-bulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
  <filter id="nyc-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="nyc-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
  <radialGradient id="nyc-steamg"><stop offset="0" stop-color="#e9f0ee" stop-opacity="0.95"/><stop offset="0.55" stop-color="#e9f0ee" stop-opacity="0.5"/><stop offset="1" stop-color="#e9f0ee" stop-opacity="0"/></radialGradient>
  <mask id="nyc-refm"><rect x="0" y="540" width="1600" height="360" fill="url(#nyc-ref)"/></mask>
</defs>
<rect width="1600" height="900" fill="url(#nyc-sky)"/>
<ellipse cx="800" cy="470" rx="330" ry="250" fill="url(#nyc-haze)"/>
<!-- far skyline at the end of the street -->
<g fill="#6e8492" opacity="0.72">
  <path d="M716,500V352h22v-28h12v-40h8v-34h4v34h8v40h12v28h22V500Z"/>
  <path d="M826,500V392h26v-18h18v18h14V500Z" opacity="0.85"/>
  <rect x="742" y="418" width="34" height="82" opacity="0.9"/>
</g>
<g fill="#8fa1aa" opacity="0.55"><rect x="700" y="430" width="24" height="70"/><rect x="872" y="410" width="30" height="90"/></g>
<!-- water tower on a mid-block roof -->
<g fill="#33454f"><rect x="584" y="216" width="26" height="24"/><path d="M581,216l16,-13l16,13Z"/><path d="M586,240l-3,22h3l3,-22ZM608,240l3,22h-3l-3,-22Z"/></g>
${bld}
<path d="${ledges}" fill="#000" opacity="0.22"/>
<path d="${wDark}" fill="#05090a" opacity="0.5"/>
<path d="${wWarm}" fill="#f1c47a" opacity="0.82"/>
<path d="${wCool}" fill="#a9d4e0" opacity="0.6"/>
<!-- street -->
<path d="M0,862L800,500L1600,862V900H0Z" fill="url(#nyc-st)"/>
<path d="M0,862L800,500L229,900H0Z" fill="#253034" opacity="0.75"/><path d="M1600,862L800,500L1371,900H1600Z" fill="#253034" opacity="0.75"/>
<path d="M229,900L800,500L247,900ZM1371,900L800,500L1353,900Z" fill="#5b676a" opacity="0.5"/>
<!-- storefronts -->
<g filter="url(#nyc-blur)" opacity="0.55"><path d="${shops}" fill="#f0b765"/></g>
<path d="${shops}" fill="url(#nyc-shop)"/>
<path d="${shopFr}" fill="#0a100f" opacity="0.85"/>
<!-- awning -->
<path d="M0,598H228L252,650H0Z" fill="#7a2a26"/><path d="M40,598h36l16,52H50ZM112,598h36l22,52h-38ZM184,598h36l28,52h-38Z" fill="#efe3c4" opacity="0.85"/><rect x="0" y="650" width="252" height="9" fill="#531c1a"/>
<path d="M1600,604H1392L1366,652H1600Z" fill="#1f3a34"/><rect x="1366" y="652" width="234" height="8" fill="#142622"/>
<text x="1490" y="634" font-family="${CORM}" font-weight="600" font-size="24" letter-spacing="3" fill="#d9bc7a" text-anchor="middle">Fine Timepieces</text>
<!-- reflections on wet asphalt -->
<g filter="url(#nyc-blur)" mask="url(#nyc-refm)">
  <rect x="452" y="640" width="54" height="270" fill="#ff5466" opacity="0.4"/><rect x="330" y="700" width="90" height="200" fill="#f3c84a" opacity="0.3"/>
  <rect x="1050" y="640" width="46" height="270" fill="#6fe0a6" opacity="0.34"/><rect x="1150" y="690" width="150" height="220" fill="#86cfff" opacity="0.3"/>
  <ellipse cx="800" cy="620" rx="46" ry="120" fill="#f4c9a0" opacity="0.2"/>
  <rect x="916" y="706" width="30" height="170" fill="#ff3b2c" opacity="0.55"/><rect x="1022" y="706" width="30" height="170" fill="#ff3b2c" opacity="0.55"/><rect x="944" y="712" width="80" height="150" fill="#f6c531" opacity="0.3"/>
</g>
<g fill="#cfe0e4" opacity="0.1"><ellipse cx="700" cy="812" rx="170" ry="4"/><ellipse cx="930" cy="866" rx="220" ry="5"/><ellipse cx="560" cy="742" rx="90" ry="3"/><ellipse cx="1080" cy="700" rx="70" ry="2.5"/></g>
<!-- manhole + far car -->
<ellipse cx="592" cy="762" rx="40" ry="9" fill="#060a0a" opacity="0.8"/><ellipse cx="592" cy="761" rx="33" ry="6.5" fill="none" stroke="#3d4a4c" stroke-width="1.5"/>
<g><rect x="748" y="566" width="52" height="34" rx="6" fill="#0c1314"/><rect x="755" y="558" width="38" height="16" rx="5" fill="#141d1f"/><rect x="751" y="584" width="9" height="5" rx="1.5" fill="#ff3b2c"/><rect x="788" y="584" width="9" height="5" rx="1.5" fill="#ff3b2c"/></g>
<!-- diamond lamp posts -->
<g><rect x="632" y="470" width="4" height="150" fill="#0a100f"/><rect x="964" y="470" width="4" height="150" fill="#0a100f"/>
  <circle cx="634" cy="452" r="34" fill="url(#nyc-bulb)" opacity="0.7"/><circle cx="966" cy="452" r="34" fill="url(#nyc-bulb)" opacity="0.7"/>
  <path d="M634,430l13,17l-13,24l-13,-24Z" fill="#f4fbff"/><path d="M634,430l13,17h-26Z" fill="#cfe6f2"/><path d="M634,471l-4,-24h8Z" fill="#fff"/>
  <path d="M966,430l13,17l-13,24l-13,-24Z" fill="#f4fbff"/><path d="M966,430l13,17h-26Z" fill="#cfe6f2"/><path d="M966,471l-4,-24h8Z" fill="#fff"/></g>
<!-- street sign pole -->
<g><rect x="440" y="520" width="5" height="250" fill="#0a100f"/><rect x="386" y="524" width="58" height="17" rx="2" fill="#1f6a4c"/><text x="415" y="533.5" font-family="${JOST}" font-weight="600" font-size="11" letter-spacing="1" fill="#f1f6ee" text-anchor="middle" dominant-baseline="central">W 47 St</text>
  <rect x="446" y="548" width="52" height="15" rx="2" fill="#0d0f0f"/><path d="M452,555.5h30v-4l11,4l-11,4v-4Z" fill="#f4f1e6"/></g>
<!-- sidewalk clock -->
<g><rect x="1236" y="560" width="6" height="240" fill="#0a100f"/><rect x="1228" y="786" width="22" height="16" fill="#0a100f"/><circle cx="1239" cy="538" r="33" fill="#0a100f"/><circle cx="1239" cy="538" r="27" fill="#f3ecd6"/><circle cx="1239" cy="538" r="27" fill="url(#nyc-lb)"/>
  <g stroke="#1b241f" stroke-linecap="round"><path d="M1239,538l-11,9" stroke-width="3.2"/><path d="M1239,538l15,-14" stroke-width="2.2"/></g>
  <path d="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => { const a = i * Math.PI / 6; return `M${f(1239 + Math.sin(a) * 21)},${f(538 - Math.cos(a) * 21)}L${f(1239 + Math.sin(a) * 25)},${f(538 - Math.cos(a) * 25)}`; }).join('')}" stroke="#1b241f" stroke-width="1.6"/></g>
<!-- signs -->
<g filter="url(#nyc-blur)" opacity="0.9">${glowItems.join('')}</g>
${signs}
<!-- string lights -->
${wires}
<g filter="url(#nyc-soft)" opacity="0.9"><path d="${bulbs}" fill="#ffd98a" transform="scale(1)"/></g>
<path d="${bulbs}" fill="#fff6dc"/>
<!-- far people -->
<path d="${pplFar}" fill="#0c1415"/>
<!-- cab -->
<g transform="translate(984,704) scale(0.84) translate(-1010,-752)">
  <ellipse cx="1010" cy="752" rx="96" ry="9" fill="#000" opacity="0.5"/>
  <rect x="934" y="728" width="26" height="24" rx="4" fill="#070b0b"/><rect x="1060" y="728" width="26" height="24" rx="4" fill="#070b0b"/>
  <path d="M948,668Q952,634 972,632H1048Q1068,634 1072,668Z" fill="#d9a41c"/>
  <path d="M960,666Q963,642 978,640H1042Q1057,642 1060,666Z" fill="#1c2a30"/><path d="M962,664Q965,646 979,643H1004L990,664Z" fill="#3c5560" opacity="0.6"/>
  <rect x="924" y="664" width="172" height="74" rx="12" fill="url(#nyc-cab)"/>
  <rect x="924" y="716" width="172" height="20" rx="7" fill="#161c1c"/>
  <rect x="930" y="682" width="40" height="15" rx="4" fill="#ff3b2c"/><rect x="1050" y="682" width="40" height="15" rx="4" fill="#ff3b2c"/>
  <g filter="url(#nyc-soft)"><rect x="930" y="682" width="40" height="15" rx="4" fill="#ff6a50" opacity="0.8"/><rect x="1050" y="682" width="40" height="15" rx="4" fill="#ff6a50" opacity="0.8"/></g>
  <rect x="988" y="700" width="44" height="14" rx="2" fill="#f1ead6"/><rect x="992" y="622" width="36" height="12" rx="3" fill="#fff3c9"/>
  <text x="1010" y="628.5" font-family="${JOST}" font-weight="600" font-size="8.5" letter-spacing="1.4" fill="#2a2206" text-anchor="middle" dominant-baseline="central">TAXI</text>
  <text x="1010" y="676" font-family="${JOST}" font-weight="600" font-size="10" letter-spacing="2" fill="#2a2206" text-anchor="middle" dominant-baseline="central" opacity="0.7">NYC</text>
</g>
<!-- steam -->
<g>${steam}</g>
<!-- nearer people, backlit by the windows -->
<path d="${pplMid}" fill="#081010"/>
<path d="${pplNear}" fill="#050a0a"/>
${snow}
<rect width="1600" height="900" fill="#0f1a17" opacity="0.1"/>`;
    return SVG(body);
  };

  /* ===================================================== THE AUCTION ROOM */
  S.auction = function (o) {
    o = o || {};
    const R = rng(112);
    // audience rows: [y of shoulders, head radius, spacing, tone]
    function row(y, r, gap, off, skip) {
      let d = '';
      for (let x = off; x < 1640; x += gap) {
        if (x > 742 && x < 858) continue;                   // the centre aisle
        const jx = (R() - 0.5) * gap * 0.12, hy = y - r * 1.35 + (R() - 0.5) * r * 0.3, w = r * (1.7 + R() * 0.25);
        d += circ(x + jx, hy, r * (0.94 + R() * 0.12));
        d += `M${f(x + jx - w)},${f(y + r * 2.6)}Q${f(x + jx - w)},${f(y - r * 0.2)} ${f(x + jx - r * 0.5)},${f(y - r * 0.42)}H${f(x + jx + r * 0.5)}Q${f(x + jx + w)},${f(y - r * 0.2)} ${f(x + jx + w)},${f(y + r * 2.6)}Z`;
        if (R() < 0.3) d += `M${f(x + jx - r)},${f(hy - r * 0.2)}Q${f(x + jx)},${f(hy - r * 1.5)} ${f(x + jx + r)},${f(hy - r * 0.2)}Z`; // hair
      }
      return d;
    }
    function chairs(y, w, gap, off, h) { let d = ''; for (let x = off; x < 1640; x += gap) { if (x > 742 && x < 858) continue; d += `M${f(x - w)},${f(y + h)}V${f(y + 8)}Q${f(x - w)},${f(y)} ${f(x - w + 8)},${f(y)}H${f(x + w - 8)}Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + 8)}V${f(y + h)}Z`; } return d; }
    // phone bank staff
    let staff = '', phones = '', lamps = '', lampGlow = '';
    [130, 232, 334, 436, 538].forEach((x, i) => {
      const hy = 470 + (i % 2) * 5, r = 19;
      staff += circ(x, hy, r) + `M${x - 38},560Q${x - 38},${hy + 26} ${x - 12},${hy + 23}H${x + 12}Q${x + 38},${hy + 26} ${x + 38},560Z`;
      if (i !== 2) { const sgn = i % 2 ? 1 : -1; staff += `M${x + sgn * 34},${hy + 60}L${x + sgn * 30},${hy + 8}L${x + sgn * 18},${hy - 2}L${x + sgn * 14},${hy + 10}L${x + sgn * 20},${hy + 62}Z`; phones += `<rect x="${x + sgn * 21 - 3.5}" y="${hy - 14}" width="7" height="25" rx="3" fill="#0b0f0e" transform="rotate(${sgn * 12} ${x + sgn * 21} ${hy})"/>`; }
      else staff += `M${x + 22},${hy + 40}L${x + 44},${hy - 54}L${x + 56},${hy - 52}L${x + 40},${hy + 44}Z` + circ(x + 51, hy - 60, 9);   // a raised hand: a phone bid
      const lx = x + 50; if (i < 5) { lamps += `<rect x="${lx - 1.5}" y="508" width="3" height="16" fill="#8a6c34"/><path d="M${lx - 14},510Q${lx},496 ${lx + 14},510Z" fill="#2f5a4a"/><rect x="${lx - 9}" y="523" width="18" height="3" rx="1.5" fill="#8a6c34"/>`; lampGlow += `<ellipse cx="${lx}" cy="522" rx="40" ry="14" fill="url(#auc-lamp)"/>`; }
    });
    // currency board rows
    const cur = [['USD', '180,000'], ['CHF', '158,400'], ['EUR', '165,600'], ['GBP', '141,300'], ['HKD', '1,404,000'], ['JPY', '27,000,000']];
    let board = '';
    cur.forEach((c, i) => {
      const y = i === 0 ? 206 : 228 + i * 27.5, big = i === 0;
      board += `<text x="1040" y="${y}" font-family="${JOST}" font-weight="500" font-size="${big ? 22 : 15}" letter-spacing="${big ? 5 : 4}" fill="#c9a35a" dominant-baseline="central">${c[0]}</text><text x="1436" y="${y}" font-family="${big ? CORM : JOST}" font-weight="${big ? 600 : 400}" font-size="${big ? 50 : 17}" letter-spacing="${big ? 1 : 1.6}" fill="#f1e9d6" text-anchor="end" dominant-baseline="central" opacity="${big ? 1 : 0.86}" style="font-variant-numeric:lining-nums;font-feature-settings:'lnum' 1">${c[1]}</text>`;
      if (i > 0) board += `<line x1="1040" x2="1436" y1="${y - 14}" y2="${y - 14}" stroke="#c9a35a" stroke-width="0.6" opacity="0.28"/>`;
    });
    // wall panels
    let panels = '';
    for (let x = 60; x < 1600; x += 185) panels += `<rect x="${x}" y="96" width="1.5" height="500" fill="#000" opacity="0.28"/><rect x="${x + 1.5}" y="96" width="1" height="500" fill="#fff" opacity="0.035"/>`;
    // track lights
    let track = '', cones = '';
    [[300, 430, 280], [560, 430, 280], [800, 640, 520], [1040, 1170, 300], [1240, 1240, 330], [1420, 1200, 300]].forEach((t, i) => {
      track += `<rect x="${t[0] - 7}" y="40" width="14" height="20" rx="3" fill="#0a0f0e"/><ellipse cx="${t[0]}" cy="61" rx="6" ry="2.4" fill="#ffe7b4"/>`;
      const spread = i === 2 ? 190 : 130;
      cones += `<path d="M${t[0] - 5},61L${t[1] - spread},${t[2] + 260}L${t[1] + spread},${t[2] + 260}L${t[0] + 5},61Z" fill="url(#auc-cone)" opacity="${i === 4 ? 0.5 : i === 2 ? 0.16 : 0.28}"/>`;
    });

    const body = `
<defs>
  <linearGradient id="auc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1211"/><stop offset="0.5" stop-color="#172622"/><stop offset="1" stop-color="#0f1917"/></linearGradient>
  <radialGradient id="auc-wash" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e9cf9a" stop-opacity="0.26"/><stop offset="0.6" stop-color="#e9cf9a" stop-opacity="0.07"/><stop offset="1" stop-color="#e9cf9a" stop-opacity="0"/></radialGradient>
  <linearGradient id="auc-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9bd" stop-opacity="0.55"/><stop offset="0.7" stop-color="#ffe9bd" stop-opacity="0.06"/><stop offset="1" stop-color="#ffe9bd" stop-opacity="0"/></linearGradient>
  <linearGradient id="auc-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#173a3a"/><stop offset="1" stop-color="#0c2224"/></linearGradient>
  <linearGradient id="auc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34181a"/><stop offset="1" stop-color="#120a0b"/></linearGradient>
  <linearGradient id="auc-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c1c13"/><stop offset="0.5" stop-color="#4a3020"/><stop offset="1" stop-color="#21150e"/></linearGradient>
  <radialGradient id="auc-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffdf9c" stop-opacity="0.7"/><stop offset="1" stop-color="#ffdf9c" stop-opacity="0"/></radialGradient>
  <linearGradient id="auc-aisle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2224"/><stop offset="1" stop-color="#2a1012"/></linearGradient>
  <filter id="auc-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>
</defs>
<rect width="1600" height="900" fill="url(#auc-wall)"/>
${panels}
<rect x="0" y="92" width="1600" height="3" fill="#c9a35a" opacity="0.5"/><rect x="0" y="0" width="1600" height="92" fill="#070c0b"/>
<rect x="0" y="66" width="1600" height="5" fill="#131c1a"/>
<!-- light washes on the wall -->
<ellipse cx="430" cy="270" rx="460" ry="320" fill="url(#auc-wash)"/><ellipse cx="1190" cy="320" rx="460" ry="360" fill="url(#auc-wash)"/><ellipse cx="800" cy="360" rx="300" ry="280" fill="url(#auc-wash)" opacity="0.6"/>
<!-- spotlights -->
${cones}
<!-- dado -->
<rect x="0" y="596" width="1600" height="304" fill="#0c1413"/><rect x="0" y="594" width="1600" height="2.5" fill="#c9a35a" opacity="0.35"/>
<!-- lot screen (left) -->
<g transform="translate(230,112) scale(0.808) translate(-100,-118)">
<rect x="92" y="112" width="536" height="324" rx="4" fill="#bfe6dc" opacity="0.22" filter="url(#auc-blur)"/>
<rect x="100" y="118" width="520" height="312" rx="3" fill="#060a0a"/><rect x="108" y="126" width="504" height="296" fill="url(#auc-scr)"/>
<text x="140" y="172" font-family="${JOST}" font-weight="500" font-size="17" letter-spacing="9" fill="#c9a35a" dominant-baseline="central">LOT</text>
<text x="134" y="270" font-family="${CORM}" font-weight="600" font-size="150" fill="#f1e9d6" dominant-baseline="central" letter-spacing="2" style="font-variant-numeric:lining-nums;font-feature-settings:'lnum' 1">112</text>
<line x1="140" x2="372" y1="346" y2="346" stroke="#c9a35a" stroke-width="0.8" opacity="0.6"/>
<text x="140" y="369" font-family="${JOST}" font-weight="400" font-size="12.5" letter-spacing="3.2" fill="#f1e9d6" opacity="0.85" dominant-baseline="central">CHRONOGRAPH · STAINLESS STEEL</text>
<text x="140" y="392" font-family="${JOST}" font-weight="400" font-size="12.5" letter-spacing="3.2" fill="#f1e9d6" opacity="0.6" dominant-baseline="central">CIRCA 1968 · FRESH TO MARKET</text>
<g transform="translate(494,268)">
  <rect x="-25" y="-136" width="50" height="272" rx="6" fill="#0a1a1b"/>
  <rect x="64" y="-46" width="16" height="13" rx="3" fill="#d8cfb8" transform="rotate(-32 72 -40)"/><rect x="64" y="33" width="16" height="13" rx="3" fill="#d8cfb8" transform="rotate(32 72 40)"/><rect x="74" y="-8" width="11" height="16" rx="3" fill="#d8cfb8"/>
  <circle r="76" fill="#d8cfb8"/><circle r="70" fill="#101b1c"/><circle r="56" fill="#efe7d2"/>
  <g stroke="#efe7d2" stroke-width="1.4">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(i => { const a = i * Math.PI / 10; return `<line x1="${f(Math.sin(a) * 60)}" y1="${f(-Math.cos(a) * 60)}" x2="${f(Math.sin(a) * 66)}" y2="${f(-Math.cos(a) * 66)}"/>`; }).join('')}</g>
  <g stroke="#22302c" stroke-width="2">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => { const a = i * Math.PI / 6; return `<line x1="${f(Math.sin(a) * 46)}" y1="${f(-Math.cos(a) * 46)}" x2="${f(Math.sin(a) * 53)}" y2="${f(-Math.cos(a) * 53)}"/>`; }).join('')}</g>
  <circle cx="-25" r="15" fill="#101b1c"/><circle cx="25" r="15" fill="#101b1c"/><circle cy="27" r="15" fill="#101b1c"/>
  <g stroke="#efe7d2" stroke-width="1.3" stroke-linecap="round"><line x1="-25" y1="0" x2="-33" y2="-8"/><line x1="25" y1="0" x2="25" y2="-11"/><line x1="0" y1="27" x2="9" y2="33"/></g>
  <path d="M0,0L-17,-22" stroke="#22302c" stroke-width="4.6" stroke-linecap="round"/><path d="M0,0L30,-25" stroke="#22302c" stroke-width="3.2" stroke-linecap="round"/><path d="M0,10V-52" stroke="#b23a2c" stroke-width="1.6"/><circle r="3.6" fill="#22302c"/>
</g>
</g>
<!-- currency board (right) -->
<g transform="translate(950,112) scale(0.913) translate(-1010,-124)">
<rect x="1002" y="118" width="476" height="270" rx="4" fill="#bfe6dc" opacity="0.18" filter="url(#auc-blur)"/>
<rect x="1010" y="124" width="460" height="258" rx="3" fill="#060a0a"/><rect x="1018" y="132" width="444" height="242" fill="url(#auc-scr)"/>
<text x="1040" y="160" font-family="${JOST}" font-weight="500" font-size="12" letter-spacing="6" fill="#f1e9d6" opacity="0.7" dominant-baseline="central">CURRENT BID</text>
${board}
</g>
${track}
<!-- phone bank (left) -->
<path d="${staff}" fill="#0a100f"/>
${phones}
<rect x="60" y="528" width="590" height="92" fill="url(#auc-wood)"/><rect x="60" y="524" width="590" height="7" fill="#5a3c26"/><rect x="60" y="531" width="590" height="1.5" fill="#c9a35a" opacity="0.55"/>
<g opacity="0.18" fill="#000"><rect x="176" y="540" width="2" height="80"/><rect x="294" y="540" width="2" height="80"/><rect x="412" y="540" width="2" height="80"/><rect x="530" y="540" width="2" height="80"/></g>
${lampGlow}${lamps}
<text x="355" y="576" font-family="${JOST}" font-weight="500" font-size="11" letter-spacing="8" fill="#c9a35a" opacity="0.6" text-anchor="middle" dominant-baseline="central">TELEPHONE BIDS</text>
<!-- rostrum + auctioneer (right) -->
<ellipse cx="1240" cy="470" rx="230" ry="210" fill="url(#auc-wash)"/>
<path d="M1196,520Q1192,446 1218,438L1228,432H1252L1262,438Q1290,446 1288,520Z" fill="#0a100f"/>
<circle cx="1240" cy="406" r="25" fill="#0a100f"/><path d="M1217,402Q1220,376 1242,378Q1264,380 1264,404Q1252,392 1217,402Z" fill="#070b0a"/>
<path d="M1200,462L1128,430L1096,422L1094,430L1124,444L1196,490Z" fill="#0a100f"/><circle cx="1094" cy="425" r="8" fill="#0a100f"/>
<path d="M1284,470L1312,496L1306,506L1276,488Z" fill="#0a100f"/><rect x="1300" y="486" width="34" height="9" rx="3" fill="#2c1c13" transform="rotate(-24 1317 490)"/><rect x="1322" y="468" width="13" height="22" rx="3" fill="#3a2518" transform="rotate(-24 1328 479)"/>
<path d="M1150,508H1330L1318,676H1162Z" fill="url(#auc-wood)"/><rect x="1142" y="500" width="196" height="12" rx="2" fill="#5a3c26"/><rect x="1142" y="511" width="196" height="1.5" fill="#c9a35a" opacity="0.6"/>
<path d="M1176,540H1304L1298,640H1182Z" fill="none" stroke="#c9a35a" stroke-width="1" opacity="0.4"/>
<circle cx="1240" cy="590" r="20" fill="none" stroke="#c9a35a" stroke-width="1.2" opacity="0.7"/><path d="M1240,590l-6,6M1240,590l9,-8" stroke="#c9a35a" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
<!-- floor + aisle -->
<rect x="0" y="640" width="1600" height="260" fill="url(#auc-floor)"/>
<path d="M756,640H844L900,900H700Z" fill="url(#auc-aisle)"/><path d="M756,640L700,900M844,640L900,900" stroke="#c9a35a" stroke-width="1.2" opacity="0.3"/>
<rect x="0" y="640" width="1600" height="40" fill="#000" opacity="0.25"/>
<!-- audience, three rows, far to near -->
<path d="${chairs(662, 30, 92, 62, 80)}" fill="#141d1b"/>
<path d="${row(650, 19, 92, 62)}" fill="#0b1211"/>
<!-- a raised paddle -->
<g><path d="M970,646L979,594h10L988,646Z" fill="#26352f"/><rect x="962" y="552" width="46" height="46" rx="6" fill="#efe6cf"/><text x="985" y="576" font-family="${JOST}" font-weight="600" font-size="24" fill="#1c2620" text-anchor="middle" dominant-baseline="central">88</text></g>
<path d="${chairs(742, 42, 124, 30, 120)}" fill="#0d1413"/>
<path d="${row(732, 27, 124, 30)}" fill="#070c0b"/>
<path d="${chairs(846, 56, 164, 98, 120)}" fill="#090e0d"/>
<path d="${row(838, 37, 164, 98)}" fill="#040807"/>
<rect width="1600" height="900" fill="#0f1a17" opacity="0.08"/>`;
    return SVG(body);
  };

  /* ===================================================== NAKANO BROADWAY */
  S.nakano = function (o) {
    o = o || {};
    const VX = 800, VY = 440, W0 = 960;          // wall reference plane sits 960px left/right of centre
    const yc = q => VY - 460 * q, yf = q => VY + 560 * q;   // ceiling / floor at depth-scale q
    const qk = k => 1 / (1 + 0.42 * k);
    function wall(mirror, seed) {
      const R = rng(seed), X = x => mirror ? 1600 - x : x;
      const Y = (x, yN) => VY + (yN - VY) * (VX - x) / W0;   // x in un-mirrored space
      const P = (x, yN) => [X(x), Y(x, yN)];
      let s = '', glass = '', frames = '', shelves = '', base = '', head = '';
      const cols = { '#c8d0cf': '', '#c9a35a': '', '#1d2725': '', '#f1e9d6': '', '#2d4d6e': '', '#a8442f': '' }, keys = Object.keys(cols);
      let straps = '', strapsB = '', tags = '', tagsY = '', signs = '', streak = '';
      const signCols = ['#b23a2c', '#e8c24a', '#efe6cf', '#2b6a5e', '#d9772e', '#27408b'];
      const words = mirror ? ['VINTAGE', 'TOKEI', 'OVERHAUL', 'WATCH', 'SINCE 1966', 'BUY'] : ['WATCH', 'BUY · SELL', 'TOKEI', 'VINTAGE', 'QUARTZ', 'SEIKO-YA'];
      for (let k = 0; k < 12; k++) {
        const xa = VX - W0 * qk(k), xb = VX - W0 * qk(k + 1), qa = qk(k), qb = qk(k + 1), qm = (qa + qb) / 2;
        const pad = (xb - xa) * 0.035;
        // glass
        glass += quad([P(xa + pad, 176), P(xb - pad, 176), P(xb - pad, 742), P(xa + pad, 742)]);
        // header sign block
        const sc = signCols[(k + (mirror ? 2 : 0)) % signCols.length];
        signs += `<path d="${quad([P(xa + pad * 2, 70), P(xb - pad * 2, 70), P(xb - pad * 2, 150), P(xa + pad * 2, 150)])}" fill="${sc}" opacity="${f(0.92 - k * 0.03)}"/>`;
        if (k < 5) {
          const x0 = xa + (xb - xa) / 2, m = (Y(xb, 110) - Y(xa, 110)) / (xb - xa) * (mirror ? -1 : 1), fs = 54 * qm, w = words[k % words.length];
          const dark = sc === '#e8c24a' || sc === '#efe6cf';
          signs += `<text transform="matrix(1,${f(m * 1)},0,1,${f(X(x0))},${f(Y(x0, 110))})" font-family="${JOST}" font-weight="600" font-size="${f(fs)}" letter-spacing="${f(fs * 0.12)}" fill="${dark ? '#1c2620' : '#f6f0de'}" text-anchor="middle" dominant-baseline="central" textLength="${f(Math.min((xb - xa) * 0.74, w.length * fs * 0.72))}" lengthAdjust="spacingAndGlyphs">${w}</text>`;
        }
        // shelves and watches
        const per = 6;
        for (let sIdx = 0; sIdx < 5; sIdx++) {
          const sy = 282 + sIdx * 115;
          shelves += quad([P(xa + pad, sy), P(xb - pad, sy), P(xb - pad, sy + 7), P(xa + pad, sy + 7)]);
          for (let i = 0; i < per; i++) {
            const t = (i + 0.5) / per, x = xa + pad + (xb - xa - 2 * pad) * t, q = (VX - x) / W0, r = 15 * q, y = Y(x, sy - 46), cx = X(x);
            if (cx < -30 || cx > 1630) continue;
            if (R() < 0.07) continue;
            const ck = keys[Math.floor(R() * R() * keys.length)];
            if (q > 0.2) {
              const dark = R() < 0.55; const st = box(cx - r * 0.56, y - r * 2.2, r * 1.12, r * 4.4);
              if (dark) straps += st; else strapsB += st;
              if (R() < 0.13) tagsY += box(cx - r * 0.9, Y(x, sy - 6) - r * 0.62, r * 1.8, r * 0.62); else tags += box(cx - r * 0.9, Y(x, sy - 6) - r * 0.62, r * 1.8, r * 0.62);
            }
            cols[ck] += circ(cx, y, r);
            if (q > 0.3) cols[ck === '#f1e9d6' ? '#1d2725' : '#f1e9d6'] += circ(cx, y, r * 0.66);
          }
        }
        if (k > 0 && k < 5) { const w = (xb - xa); streak += quad([P(xa + w * 0.5, 176), P(xa + w * 0.72, 176), P(xa + w * 0.3, 742), P(xa + w * 0.08, 742)]) + quad([P(xa + w * 0.8, 176), P(xa + w * 0.86, 176), P(xa + w * 0.44, 742), P(xa + w * 0.38, 742)]); }
        // mullion
        const mw = 9 * qa + 1;
        frames += quad([[X(xa) - mw / 2, Y(xa, 160)], [X(xa) + mw / 2, Y(xa, 160)], [X(xa) + mw / 2, Y(xa, 760)], [X(xa) - mw / 2, Y(xa, 760)]]);
      }
      const xe = VX - W0 * qk(12);
      head = quad([P(-170, 40), P(xe, 40), P(xe, 176), P(-170, 176)]);
      base = quad([P(-170, 742), P(xe, 742), P(xe, 1000), P(-170, 1000)]);
      s += `<path d="${quad([P(-170, -20), P(xe, -20), P(xe, 1000), P(-170, 1000)])}" fill="#132320"/>`;
      s += `<path d="${glass}" fill="url(#nak-glass${mirror ? 'R' : 'L'})"/>`;
      s += `<path d="${shelves}" fill="#9fb3a8" opacity="0.8"/>`;
      s += `<path d="${straps}" fill="#27322f" opacity="0.9"/><path d="${strapsB}" fill="#7a5a3a" opacity="0.9"/>`;
      keys.forEach(c => { if (cols[c]) s += `<path d="${cols[c]}" fill="${c}"/>`; });
      s += `<path d="${tags}" fill="#fbf7ea"/><path d="${tagsY}" fill="#e8b53a"/><path d="${streak}" fill="#fff" opacity="0.22"/>`;
      s += `<path d="${frames}" fill="#0c1715"/>`;
      s += `<path d="${head}" fill="#0c1715"/>${signs}`;
      s += `<path d="${base}" fill="#0e1b19"/><path d="${quad([P(-170, 742), P(xe, 742), P(xe, 760), P(-170, 760)])}" fill="#25403a"/><path d="${quad([P(-170, 930), P(xe, 930), P(xe, 946), P(-170, 946)])}" fill="#1c302c" opacity="0.8"/>`;
      // far depth haze
      s += `<path d="${quad([P(-170, -20), P(xe, -20), P(xe, 1000), P(-170, 1000)])}" fill="url(#nak-haze${mirror ? 'R' : 'L'})"/>`;
      return s;
    }
    // ceiling lights and floor tiles
    let lights = '', lightGlow = '', refl = '', tiles = '';
    for (let k = 0; k < 11; k++) {
      const q1 = qk(k + 0.15), q2 = qk(k + 0.75);
      [-340, 340].forEach(X0 => {
        lights += quad([[VX + (X0 - 46) * q1, yc(q1)], [VX + (X0 + 46) * q1, yc(q1)], [VX + (X0 + 46) * q2, yc(q2)], [VX + (X0 - 46) * q2, yc(q2)]]);
        refl += quad([[VX + (X0 - 80) * q1, yf(q1)], [VX + (X0 + 80) * q1, yf(q1)], [VX + (X0 + 80) * q2, yf(q2)], [VX + (X0 - 80) * q2, yf(q2)]]);
      });
      [-700, 700].forEach(X0 => { lightGlow += quad([[VX + (X0 - 12) * q1, yc(q1)], [VX + (X0 + 12) * q1, yc(q1)], [VX + (X0 + 12) * q2, yc(q2)], [VX + (X0 - 12) * q2, yc(q2)]]); });
    }
    for (let k = 0; k < 26; k++) { const q = 1 / (1 + 0.14 * k), y = yf(q); tiles += `M${f(VX - W0 * q)},${f(y)}H${f(VX + W0 * q)}`; }
    for (let X0 = -800; X0 <= 800; X0 += 160) tiles += `M${VX},${VY}L${f(VX + X0 * 1.2)},${f(yf(1.2))}`;
    const qe = qk(12), xe = VX - W0 * qe, ye1 = yc(qe), ye2 = yf(qe);
    // hanging signs facing the viewer: [depth q, lateral X (ref units), w, h (ref), colour, word]
    let hang = '';
    [[0.6, -560, 250, 74, '#b23a2c', 'WATCH'], [0.44, 520, 230, 70, '#efe6cf', 'TOKEI'], [0.31, -470, 220, 66, '#e8c24a', '3F'], [0.235, 420, 210, 62, '#2b6a5e', 'VINTAGE']].forEach(h => {
      const q = h[0], x = VX + h[1] * q, y = yc(q) + 58 * q, w = h[2] * q, hh = h[3] * q, dark = h[4] === '#efe6cf' || h[4] === '#e8c24a';
      hang += `<rect x="${f(x - w / 2 + w * 0.2)}" y="${f(yc(q))}" width="${f(Math.max(1, 2.4 * q))}" height="${f(58 * q)}" fill="#0a1211"/><rect x="${f(x + w / 2 - w * 0.2)}" y="${f(yc(q))}" width="${f(Math.max(1, 2.4 * q))}" height="${f(58 * q)}" fill="#0a1211"/>`;
      hang += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(hh)}" rx="${f(4 * q)}" fill="${h[4]}"/><text x="${f(x)}" y="${f(y + hh / 2)}" font-family="${JOST}" font-weight="600" font-size="${f(hh * 0.56)}" letter-spacing="${f(hh * 0.1)}" fill="${dark ? '#1c2620' : '#f6f0de'}" text-anchor="middle" dominant-baseline="central">${h[5]}</text>`;
    });
    // shoppers
    const pA = person(VX + 640 * 0.47, yf(0.47), 640 * 0.47, { bag: 1, lean: -1 }), pB = person(VX - 560 * 0.27, yf(0.27), 620 * 0.27), pC = person(VX - 470 * 0.27, yf(0.27), 560 * 0.27, { hat: 1 });

    const body = `
<defs>
  <linearGradient id="nak-glassL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6faf2"/><stop offset="0.45" stop-color="#e9f1e7"/><stop offset="1" stop-color="#c9dccf"/></linearGradient>
  <linearGradient id="nak-glassR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#f6faf2"/><stop offset="0.45" stop-color="#e9f1e7"/><stop offset="1" stop-color="#c9dccf"/></linearGradient>
  <linearGradient id="nak-hazeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0.5" stop-color="#1b322e" stop-opacity="0"/><stop offset="1" stop-color="#1b322e" stop-opacity="0.5"/></linearGradient>
  <linearGradient id="nak-hazeR" x1="1" y1="0" x2="0" y2="0"><stop offset="0.5" stop-color="#1b322e" stop-opacity="0"/><stop offset="1" stop-color="#1b322e" stop-opacity="0.5"/></linearGradient>
  <linearGradient id="nak-ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1513"/><stop offset="1" stop-color="#1d302b"/></linearGradient>
  <linearGradient id="nak-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c4640"/><stop offset="0.35" stop-color="#1f3530"/><stop offset="1" stop-color="#0f1c1a"/></linearGradient>
  <linearGradient id="nak-sideL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dfeee2" stop-opacity="0.34"/><stop offset="1" stop-color="#dfeee2" stop-opacity="0"/></linearGradient>
  <linearGradient id="nak-sideR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#dfeee2" stop-opacity="0.34"/><stop offset="1" stop-color="#dfeee2" stop-opacity="0"/></linearGradient>
  <radialGradient id="nak-end" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#e8f2e6" stop-opacity="0.3"/><stop offset="1" stop-color="#e8f2e6" stop-opacity="0"/></radialGradient>
  <filter id="nak-blur" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
</defs>
<rect width="1600" height="900" fill="#12211e"/>
<!-- ceiling -->
<path d="M0,0H1600V${f(yc(0.83))}L${f(1600 - xe)},${f(ye1)}H${f(xe)}L0,${f(yc(0.83))}Z" fill="url(#nak-ceil)"/>
<g stroke="#0a1412" stroke-width="1.2" opacity="0.7">${[-520, -160, 160, 520].map(X0 => `<line x1="${VX}" y1="${VY}" x2="${f(VX + X0 * 1.3)}" y2="${f(yc(1.3))}"/>`).join('')}</g>
<g filter="url(#nak-blur)" opacity="0.65"><path d="${lights}" fill="#eaf6e6"/></g>
<path d="${lights}" fill="#f7fcf2"/>
<g filter="url(#nak-blur)" opacity="0.4"><path d="${lightGlow}" fill="#eaf6e6"/></g><path d="${lightGlow}" fill="#eef8ea" opacity="0.92"/>
<!-- floor -->
<path d="M0,900H1600V${f(yf(0.83))}L${f(1600 - xe)},${f(ye2)}H${f(xe)}L0,${f(yf(0.83))}Z" fill="url(#nak-floor)"/>
<path d="${tiles}" fill="none" stroke="#0c1816" stroke-width="1" opacity="0.55"/>
<g filter="url(#nak-blur)"><path d="${refl}" fill="#e8f2e6" opacity="0.3"/></g>
<path d="M0,900L${f(xe)},${f(ye2)}L${f(xe + 60)},${f(ye2)}L420,900Z" fill="url(#nak-sideL)"/><path d="M1600,900L${f(1600 - xe)},${f(ye2)}L${f(1600 - xe - 60)},${f(ye2)}L1180,900Z" fill="url(#nak-sideR)"/>
<!-- end of the corridor -->
<rect x="${f(xe)}" y="${f(ye1)}" width="${f(1600 - 2 * xe)}" height="${f(ye2 - ye1)}" fill="#16302b"/>
<rect x="${f(xe + 26)}" y="${f(ye1 + 44)}" width="${f(1600 - 2 * xe - 52)}" height="${f(ye2 - ye1 - 44)}" fill="#0f211e"/>
<g opacity="0.85"><rect x="${f(xe + 40)}" y="${f(ye1 + 62)}" width="62" height="74" fill="#d9e8da" opacity="0.5"/><rect x="${f(1600 - xe - 102)}" y="${f(ye1 + 62)}" width="62" height="74" fill="#e8c98a" opacity="0.4"/><rect x="772" y="${f(ye1 + 70)}" width="56" height="${f(ye2 - ye1 - 70)}" fill="#0a1614"/></g>
<rect x="${f(xe + 26)}" y="${f(ye1 + 14)}" width="${f(1600 - 2 * xe - 52)}" height="22" fill="#b23a2c" opacity="0.8"/>
<text x="800" y="${f(ye1 + 25.5)}" font-family="${JOST}" font-weight="600" font-size="12" letter-spacing="7" fill="#f6f0de" text-anchor="middle" dominant-baseline="central" opacity="0.9">BROADWAY</text>
<ellipse cx="800" cy="440" rx="230" ry="150" fill="url(#nak-end)"/>
<!-- walls of showcases -->
${wall(false, 31)}
${wall(true, 67)}
<!-- hanging signs -->
${hang}
<!-- shoppers -->
<path d="${pB}${pC}" fill="#14241f"/>
<path d="${pA}" fill="#08100f"/>
<ellipse cx="${f(VX + 640 * 0.47)}" cy="${f(yf(0.47) + 4)}" rx="60" ry="7" fill="#000" opacity="0.35"/>
<rect width="1600" height="900" fill="#0f1a17" opacity="0.06"/>`;
    return SVG(body);
  };

  /* ===================================================== LAKE SUWA */
  S.suwa = function (o) {
    o = o || {};
    const R = rng(1938);
    // ridgeline generator
    function ridge(y0, amp, step, seed, peaks) {
      const r = rng(seed); let pts = [], x = -40, y = y0;
      while (x < 1660) { pts.push([x, y + (r() - 0.5) * amp * 0.5]); x += step * (0.6 + r() * 0.8); }
      (peaks || []).forEach(p => { pts.forEach(q => { const d = Math.abs(q[0] - p[0]); if (d < p[2]) q[1] -= p[1] * Math.pow(1 - d / p[2], 1.5); }); });
      return pts;
    }
    const pathOf = (pts, base) => 'M' + pts.map(p => f(p[0]) + ',' + f(p[1])).join('L') + `L1660,${base}L-40,${base}Z`;
    const farPts = ridge(408, 20, 46, 5, [[300, 86, 260], [560, 54, 180], [1010, 104, 300], [1330, 70, 220], [760, 30, 160]]);
    const backPts = ridge(398, 14, 60, 19, [[160, 60, 300], [820, 44, 320], [1260, 86, 260], [1520, 50, 200]]);
    const midPts = ridge(446, 16, 40, 11, [[120, 70, 260], [1480, 84, 300], [700, 16, 200], [1150, 30, 200]]);
    // shadowed flanks, away from the low sun
    function shade(pts, seed) {
      const r = rng(seed); let d = '';
      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i], a = pts[i - 1], b = pts[i + 1];
        if (p[1] > a[1] || p[1] > b[1]) continue;           // only at local peaks
        const dep = 26 + r() * 46;
        d += `M${f(p[0])},${f(p[1])}L${f(a[0])},${f(a[1])}L${f(a[0] - 26 - r() * 30)},${f(a[1] + dep)}L${f(p[0] - 6 + r() * 12)},${f(p[1] + dep * 1.25)}Z`;
      }
      return d;
    }
    // bare tree
    function tree(x, y, h, seed, lean) {
      const r = rng(seed); let d = [];
      (function br(x, y, a, len, w, depth) {
        const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
        d.push(`<path d="M${f(x)},${f(y)}Q${f((x + x2) / 2 + (r() - 0.5) * len * 0.18)},${f((y + y2) / 2)} ${f(x2)},${f(y2)}" stroke-width="${f(w)}"/>`);
        if (depth <= 0 || len < 7) return;
        const n = depth > 4 ? 2 : (r() < 0.45 ? 3 : 2);
        for (let i = 0; i < n; i++) { const sp = (i - (n - 1) / 2) * (0.5 + r() * 0.3) + (r() - 0.5) * 0.3; br(x2, y2, a * 0.82 + sp, len * (0.62 + r() * 0.2), Math.max(0.7, w * 0.64), depth - 1); }
      })(x, y, lean || 0, h * 0.3, h * 0.034, 7);
      return d.join('');
    }
    // far shore town
    let town = '', townLights = '';
    for (let x = 180; x < 1500; x += 9 + R() * 16) { const h = 3 + R() * 9, w = 6 + R() * 14; if (x > 640 && x < 980 && R() < 0.5) continue; town += box(x, 474 - h, w, h + 2); if (R() < 0.22) townLights += circ(x + w / 2, 474 - h / 2, 1.1); }
    // reeds
    let reeds = '';
    for (let i = 0; i < 46; i++) { const x = 20 + R() * 560, y = 742 + (x / 580) * 60 + R() * 24, hgt = 30 + R() * 56, bend = (R() - 0.3) * 26; reeds += `M${f(x)},${f(y)}Q${f(x + bend * 0.3)},${f(y - hgt * 0.6)} ${f(x + bend)},${f(y - hgt)}`; }
    // icicles along the eave
    let ice = '';
    for (let i = 0; i < 31; i++) { const t = i / 26, x = 1010 + t * 590 + R() * 8, y = 85 + t * 44, len = 10 + R() * 34 * (0.5 + t); ice += `M${f(x - 2.6)},${f(y)}L${f(x + 2.6)},${f(y)}L${f(x + 0.3)},${f(y + len)}Z`; }
    // floor boards
    let boards = '';
    for (let i = 1; i < 8; i++) { const t = i / 7; boards += `M${f(1150 - 156 * t)},${f(648 + 262 * t)}L1720,${f(638 + 272 * t)}`; }
    // shoji grid
    let shoji = '';
    for (let y = 150; y < 640; y += 70) shoji += `M1478,${y}H1720`;
    for (let x = 1520; x < 1720; x += 42) shoji += `M${x},118V640`;

    const body = `
<defs>
  <linearGradient id="suwa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aebfc8"/><stop offset="0.28" stop-color="#cfd9d9"/><stop offset="0.53" stop-color="#f1e9d6"/></linearGradient>
  <radialGradient id="suwa-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fffaf0" stop-opacity="0.95"/><stop offset="0.16" stop-color="#fff3d6" stop-opacity="0.7"/><stop offset="0.5" stop-color="#f9e6c0" stop-opacity="0.22"/><stop offset="1" stop-color="#f9e6c0" stop-opacity="0"/></radialGradient>
  <linearGradient id="suwa-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e7dc"/><stop offset="0.22" stop-color="#cdd7d6"/><stop offset="0.6" stop-color="#a9bcc0"/><stop offset="1" stop-color="#7f979d"/></linearGradient>
  <linearGradient id="suwa-far" gradientUnits="userSpaceOnUse" x1="0" y1="296" x2="0" y2="476"><stop offset="0" stop-color="#fbfaf4"/><stop offset="0.36" stop-color="#e0e7e6"/><stop offset="1" stop-color="#adbec5"/></linearGradient>
  <linearGradient id="suwa-mid" gradientUnits="userSpaceOnUse" x1="0" y1="360" x2="0" y2="478"><stop offset="0" stop-color="#eef1ec"/><stop offset="0.3" stop-color="#b3c2c5"/><stop offset="0.62" stop-color="#8ea3a9"/><stop offset="1" stop-color="#9db0b3"/></linearGradient>
  <linearGradient id="suwa-glit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e4" stop-opacity="0.8"/><stop offset="1" stop-color="#fff8e4" stop-opacity="0"/></linearGradient>
  <linearGradient id="suwa-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f3ec"/><stop offset="1" stop-color="#c3d0d3"/></linearGradient>
  <linearGradient id="suwa-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6846"/><stop offset="1" stop-color="#4a3524"/></linearGradient>
  <linearGradient id="suwa-post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2a1d"/><stop offset="0.5" stop-color="#6a4d34"/><stop offset="1" stop-color="#2f2118"/></linearGradient>
  <linearGradient id="suwa-shoji" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6ecd2"/><stop offset="1" stop-color="#eed9a8"/></linearGradient>
  <radialGradient id="suwa-mistg"><stop offset="0" stop-color="#f7f5ee" stop-opacity="1"/><stop offset="0.6" stop-color="#f7f5ee" stop-opacity="0.6"/><stop offset="1" stop-color="#f7f5ee" stop-opacity="0"/></radialGradient>
  <filter id="suwa-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="1600" height="900" fill="url(#suwa-sky)"/>
<circle cx="1096" cy="226" r="300" fill="url(#suwa-sun)"/><circle cx="1096" cy="226" r="40" fill="#fffaf0" opacity="0.92"/>
<!-- far ranges, snow-covered -->
<path d="${pathOf(backPts, 480)}" fill="#d2dde0" opacity="0.85"/>
<path d="${pathOf(farPts, 480)}" fill="url(#suwa-far)"/>

<!-- nearer range -->
<path d="${pathOf(midPts, 480)}" fill="url(#suwa-mid)"/>

<rect x="0" y="440" width="1600" height="40" fill="#e9e7dc" opacity="0.35"/>
<!-- far shore: the town -->
<path d="M0,472Q400,466 800,471T1600,468V482H0Z" fill="#5d7378"/>
<path d="${town}" fill="#52676c"/><path d="${townLights}" fill="#e8c98a"/>
<!-- lake -->
<rect x="0" y="476" width="1600" height="424" fill="url(#suwa-lake)"/>
<g opacity="0.2"><path d="${pathOf(midPts.map(p => [p[0], 476 + (476 - p[1]) * 0.7]), 476)}" fill="#6f878d"/></g>
<path d="M1064,478H1128L1168,720H1024Z" fill="url(#suwa-glit)" opacity="0.42"/>
<g fill="#fffaf0" opacity="0.6">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cx="${1096 + (i % 2 ? 9 : -7) * (1 + i * 0.3)}" cy="${498 + i * 24}" rx="${22 + i * 9}" ry="${1.6 + i * 0.25}"/>`).join('')}</g>
<g stroke="#f4f3ec" stroke-width="1.2" opacity="0.35" fill="none"><path d="M120,560h160M420,620h220M860,585h130M1240,640h200M640,700h260M180,668h120"/></g>
<!-- mist -->
<g fill="url(#suwa-mistg)">
  <ellipse cx="420" cy="478" rx="600" ry="46" opacity="0.8"><animateTransform attributeName="transform" type="translate" values="0 0; 70 0; 0 0" dur="70s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="1240" cy="486" rx="640" ry="42" opacity="0.7"><animateTransform attributeName="transform" type="translate" values="0 0; -90 0; 0 0" dur="88s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="820" cy="522" rx="720" ry="38" opacity="0.5"><animateTransform attributeName="transform" type="translate" values="-40 0; 60 0; -40 0" dur="100s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="300" cy="566" rx="500" ry="30" opacity="0.35"><animateTransform attributeName="transform" type="translate" values="0 0; 110 0; 0 0" dur="120s" repeatCount="indefinite"/></ellipse>
</g>
<!-- a smelt-fisher's boat, and two swans -->
<g fill="#3f5357"><path d="M352,589q26,8 60,0l-6,8h-46Z"/><rect x="372" y="574" width="20" height="15" rx="2"/><path d="M394,588l26,-22" stroke="#3f5357" stroke-width="1.2" fill="none"/></g>
<rect x="352" y="598" width="60" height="2" fill="#3f5357" opacity="0.3"/>
<g fill="#fbfaf4"><path d="M560,634q8,-7 16,-3q4,2 6,5q-12,4 -22,-2Z"/><path d="M579,632q1,-10 5,-11q3,0 2,3q-3,1 -3,9Z"/><path d="M606,640q7,-6 14,-3q4,2 5,5q-10,3 -19,-2Z"/><path d="M623,638q1,-9 4,-10q3,0 2,3q-2,1 -3,8Z"/></g>
<g stroke="#f4f3ec" stroke-width="1" opacity="0.5"><path d="M548,640h44M598,646h38"/></g>
<!-- near bank, snow -->
<path d="M0,718Q150,690 300,728T620,812Q700,850 760,900H0Z" fill="url(#suwa-snow)"/>
<path d="M0,760Q160,740 330,790T600,900H0Z" fill="#dfe6e4" opacity="0.7"/>
<path d="${reeds}" fill="none" stroke="#7a6a48" stroke-width="1.4" opacity="0.75"/>
<!-- bare trees -->
<g fill="none" stroke="#5c7176" stroke-linecap="round" opacity="0.75">${tree(452, 772, 250, 23, 0.1)}</g>
<g fill="none" stroke="#1c2a28" stroke-linecap="round">${tree(236, 768, 560, 7, -0.06)}${tree(74, 742, 380, 41, 0.14)}</g>
<path d="M214,772q22,-10 46,0q10,6 -4,8h-38q-12,-2 -4,-8Z" fill="#f4f3ec"/><path d="M58,746q16,-8 34,0q6,5 -4,6h-26q-8,-1 -4,-6Z" fill="#f4f3ec"/>
<!-- the house: eave, post, shoji, veranda -->
<g transform="translate(-110,0)">
<path d="M1478,118H1720V640H1478Z" fill="url(#suwa-shoji)"/><path d="${shoji}" stroke="#5a4230" stroke-width="3" fill="none"/><rect x="1470" y="110" width="12" height="536" fill="#3a2a1d"/>
<path d="M968,0H1720V137L1010,82Z" fill="#231a13"/>
<g stroke="#3a2a1d" stroke-width="7">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${1050 + i * 86}" y1="${f(86 + i * 6.4)}" x2="${1090 + i * 86}" y2="0"/>`).join('')}</g>
<path d="M1000,84L1720,137V127L1004,72Z" fill="#f6f5ee"/><path d="M968,0L1004,72L1000,84L960,6Z" fill="#e3e9e6"/>
<path d="${ice}" fill="#e9f2f4" opacity="0.9"/>
<rect x="1392" y="112" width="40" height="560" fill="url(#suwa-post)"/>
<g transform="translate(0,-46)">
<path d="M1150,648L1720,638V960H964Z" fill="url(#suwa-wood)"/>
<path d="${boards}" stroke="#2f2118" stroke-width="1.6" opacity="0.55" fill="none"/>
<path d="M1150,648L964,960H940L1132,646Z" fill="#2f2118"/><path d="M1150,648L1720,638" stroke="#b08a5e" stroke-width="2" opacity="0.6"/>
<!-- cushion, low table, tea, and a small paulownia box -->
<path d="M1456,712l112,-4l22,44l-146,6Z" fill="#27408b"/><path d="M1444,758l146,-6v9l-146,6Z" fill="#1a2c63"/>
<ellipse cx="1262" cy="742" rx="150" ry="12" fill="#000" opacity="0.3"/>
<rect x="1150" y="696" width="14" height="44" fill="#1c120c"/><rect x="1360" y="696" width="14" height="44" fill="#1c120c"/>
<path d="M1118,676H1404L1420,694H1104Z" fill="#3a2518"/><rect x="1104" y="694" width="316" height="9" fill="#21150e"/>
<path d="M1126,679H1396" stroke="#8a6846" stroke-width="1.4" opacity="0.6"/>
<g><path d="M1176,676v-20q0,-5 5,-5h20q5,0 5,5v20Z" fill="#b9cbbb"/><ellipse cx="1191" cy="652" rx="13" ry="3" fill="#6a7a52"/>
  <path d="M1332,676v-16q0,-4 4,-4h16q4,0 4,4v16Z" fill="#b9cbbb"/><ellipse cx="1344" cy="657" rx="10" ry="2.4" fill="#6a7a52"/>
  <path d="M1224,676q-6,-26 18,-27h14q24,1 18,27Z" fill="#2a2420"/><rect x="1242" y="643" width="14" height="7" rx="3" fill="#2a2420"/><path d="M1276,656l20,-7l2,5l-20,9Z" fill="#2a2420"/>
  <rect x="1292" y="660" width="34" height="16" fill="#e3cfa2"/><rect x="1292" y="660" width="34" height="5" fill="#d2ba86"/><rect x="1307" y="660" width="4" height="16" fill="#7a2a26" opacity="0.8"/></g>
<g fill="none" stroke="#fffaf0" stroke-width="3.6" stroke-linecap="round" stroke-opacity="0.75">
  <path d="M1190,646q-8,-14 0,-26t-2,-26" opacity="0"><animate attributeName="opacity" values="0;0.55;0" dur="6s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 4; -3 -10" dur="6s" repeatCount="indefinite"/></path>
  <path d="M1344,650q6,-12 -1,-22t3,-22" opacity="0"><animate attributeName="opacity" values="0;0.45;0" dur="7s" begin="-3s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 4; 3 -10" dur="7s" begin="-3s" repeatCount="indefinite"/></path>
</g>
</g>
</g>
<rect width="1600" height="900" fill="#f1e9d6" opacity="0.05"/>`;
    return SVG(body);
  };
})();
