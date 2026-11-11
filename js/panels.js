/* UNSIGNED — panels: the carnet (notebook), the roll, the lineage board, the menu. */
(function () {
'use strict';
const G = window.G, $ = G.$, $$ = G.$$, el = G.el, esc = G.esc;
let closer = null;

G.openPanel = function (name, arg) {
  return new Promise(resolve => {
    if (G.auto) { if (name === 'carnet' || name === 'roll') clearNews(name, arg); resolve(); return; }
    if (G.modal && !(arg && arg.force)) { resolve(); return; }
    const root = $('#panel'); root.innerHTML = ''; root.className = 'on p-' + name; G.modal = true;
    const close = () => { root.className = ''; root.innerHTML = ''; G.modal = false; G.closePanel = null; G.hudDots(); Sound.sfx('soft'); resolve(); };
    G.closePanel = close;
    ({ carnet, roll, lineage, menu })[name](root, arg || {}, close);
  });
};
function clearNews(name, arg) {
  if (name === 'roll') G.s.news.roll = {};
  if (name === 'carnet' && arg && arg.page) delete G.s.news.pages[arg.page];
}
const closeBtn = (label) => `<button class="btn close">${label || 'Close'}</button>`;

/* ================= CARNET ================= */
function carnet(root, arg, close) {
  let tab = arg.tab || 'pages', cur = arg.page || null;
  Sound.sfx('page');
  const wrap = el('div', 'book');
  root.appendChild(wrap);
  function draw() {
    const pages = G.pages;
    if (!cur) { const news = Object.keys(G.s.news.pages); cur = news[0] || (pages.filter(p => G.s.pages[p.id]).slice(-1)[0] || pages[0]).id; }
    let h = `<div class="book-tabs"><button data-t="pages" class="${tab === 'pages' ? 'on' : ''}">Her pages</button><button data-t="glossary" class="${tab === 'glossary' ? 'on' : ''}">Words${Object.keys(G.s.news.terms).length ? '<i></i>' : ''}</button><button data-t="notes" class="${tab === 'notes' ? 'on' : ''}">My notes</button></div>`;
    h += `<div class="spread">`;
    if (tab === 'pages') {
      h += `<div class="leaf left"><h3>Carnet de B. Calame</h3><ul class="plist">`;
      pages.forEach(p => {
        if (p.hidden && !G.s.pages[p.id]) return;
        const open = !!G.s.pages[p.id];
        h += `<li class="${open ? 'open' : 'locked'}${p.id === cur ? ' cur' : ''}${G.s.news.pages[p.id] ? ' new' : ''}" data-p="${p.id}"><span class="num">${p.num || ''}</span><span class="pt">${esc(p.title)}</span>${open ? '' : '<span class="lock">not yet</span>'}</li>`;
      });
      h += `</ul><p class="leafnote">Her handwriting is small and exact, in French, full of words from the workshop. The pages open as you learn to read them.</p></div>`;
      const p = pages.find(x => x.id === cur) || pages[0], open = !!G.s.pages[p.id];
      h += `<div class="leaf right page-${p.id}">`;
      if (open) {
        h += `<div class="phead"><span class="num">${p.num || ''}</span><h2>${esc(p.title)}</h2>${p.when ? `<div class="when">${esc(p.when)}</div>` : ''}</div>`;
        if (p.sketch) h += `<div class="sketch">${Watch.svg(typeof p.sketch === 'string' ? cfgOf(p.sketch) : p.sketch, { crop: 'head' })}</div>`;
        h += `<div class="pbody">${p.body.map(par => `<p>${G.fmtPlain(typeof par === 'function' ? par(G.s) : par)}</p>`).join('')}</div>`;
        if (p.sold) h += `<div class="sold">${G.fmtPlain(p.sold)}</div>`;
      } else {
        h += `<div class="phead"><span class="num">${p.num || ''}</span><h2>${esc(p.title)}</h2></div>`;
        h += `<div class="pbody fr"><p>${esc(p.fr || '…')}</p></div><p class="cant">You can read the words. You can’t yet read what they mean.</p>`;
      }
      h += `</div>`;
    } else if (tab === 'glossary') {
      const ids = Object.keys(G.s.terms).filter(id => G.terms[id]).sort((a, b) => G.terms[a].t.localeCompare(G.terms[b].t));
      h += `<div class="leaf wide"><h3>Words I’ve learned <small>${ids.length}</small></h3>`;
      if (!ids.length) h += `<p class="leafnote">Nothing yet. Underlined words in conversation end up here.</p>`;
      h += `<dl class="gloss">${ids.map(id => `<div class="${G.s.news.terms[id] ? 'new' : ''}"><dt>${esc(G.terms[id].t)}</dt><dd>${G.fmtPlain(G.terms[id].d)}</dd></div>`).join('')}</dl></div>`;
    } else {
      const facts = G.s.facts || [];
      h += `<div class="leaf left mine"><h3>Where I am</h3><p class="goal">${G.fmtPlain(G.s.goal || '—')}</p>`;
      h += `<h3>Money</h3><p class="goal">${G.money(G.s.cash)}${G.s.cash < 0 ? ' — the shop’s account is covering the difference. I owe my grandmother.' : ''}</p>`;
      h += `<p class="leafnote">Keys: <b>C</b> carnet · <b>R</b> roll · <b>L</b> lineage · <b>Space</b> continue · hold <b>Ctrl</b> to skim.</p></div>`;
      h += `<div class="leaf right mine"><h3>What I know about her watch</h3>${facts.length ? `<ol class="facts">${facts.map(f => `<li>${G.fmtPlain(f)}</li>`).join('')}</ol>` : '<p class="leafnote">Almost nothing.</p>'}</div>`;
    }
    h += `</div>${closeBtn(arg.reading ? 'Close the carnet' : 'Close')}`;
    wrap.innerHTML = h;
    $$('.book-tabs button', wrap).forEach(b => b.onclick = () => { tab = b.dataset.t; Sound.sfx('page'); draw(); if (tab === 'glossary') setTimeout(() => { G.s.news.terms = {}; }, 0); });
    $$('.plist li', wrap).forEach(li => li.onclick = () => { cur = li.dataset.p; Sound.sfx('page'); delete G.s.news.pages[cur]; draw(); });
    $('.close', wrap).onclick = close;
    if (tab === 'pages') delete G.s.news.pages[cur];
  }
  draw();
}
function cfgOf(id) { const w = G.watches[id]; let c = w ? w.cfg : {}; if (typeof c === 'function') c = c(G.s); return c; }

/* ================= ROLL ================= */
function roll(root, arg, close) {
  let cur = arg.slot || null;
  const wrap = el('div', 'rollwrap'); root.appendChild(wrap);
  if (!cur) { const news = Object.keys(G.s.news.roll); cur = news[0] || 'seven'; }
  function draw() {
    let h = `<h2>The roll</h2><p class="rollsub">Seven pockets. She filled them once, and emptied six herself.</p><div class="roll">`;
    G.slots.forEach(sl => {
      const wid = G.s.roll[sl.id], filled = !!wid;
      h += `<button class="pocket${filled ? ' filled' : ''}${sl.id === cur ? ' cur' : ''}${arg.placing && sl.id === arg.slot ? ' placing' : ''}" data-s="${sl.id}"><div class="pw">${filled ? G.watchSvg(wid, { live: false }) : '<div class="empty"></div>'}</div><div class="tag"><b>${sl.num}</b>${esc(sl.short)}</div></button>`;
    });
    h += `</div>`;
    const sl = G.slots.find(x => x.id === cur), wid = G.s.roll[cur], w = wid && G.watches[wid];
    h += `<div class="rolldetail"><div class="rtag"><div class="fr">${esc(sl.fr)}</div><div class="en">${esc(sl.en)}</div>${sl.sold ? `<div class="soldfr">${esc(sl.sold)}</div><div class="en">${esc(sl.soldEn)}</div>` : ''}</div>`;
    if (w) {
      const paid = G.s.paid[wid];
      h += `<div class="rinfo"><h3>${esc(w.name)}</h3><div class="rsub">${esc(w.sub || '')}${paid != null ? ` · paid ${G.money(paid)}` : ''}</div><p>${G.fmtPlain(w.verdict || '')}</p>${arg.placing ? '' : `<button class="btn small exam">Examine it</button>`}</div>`;
    } else h += `<div class="rinfo"><h3>Empty</h3><p>${G.fmtPlain(sl.hint || 'The pocket has kept the shape of what used to be in it.')}</p></div>`;
    h += `</div>${closeBtn(arg.placing ? 'Roll it up' : 'Close')}`;
    wrap.innerHTML = h;
    $$('.pocket', wrap).forEach(b => b.onclick = () => { cur = b.dataset.s; Sound.sfx('soft'); arg.placing = false; draw(); });
    $('.close', wrap).onclick = () => { G.s.news.roll = {}; close(); };
    const ex = $('.exam', wrap); if (ex) ex.onclick = async () => { G.s.news.roll = {}; close(); await G.games.inspect(wid, { free: true }); };
  }
  draw();
  if (arg.placing) Sound.sfx('good');
}

/* ================= LINEAGE ================= */
const XPTS = [[1800, 0], [1900, 170], [1925, 520], [1940, 820], [1985, 3160], [2000, 3560], [2025, 4040]];
function X(y) { for (let i = 1; i < XPTS.length; i++) if (y <= XPTS[i][0]) { const a = XPTS[i - 1], b = XPTS[i]; return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]); } return XPTS[XPTS.length - 1][1]; }
function lineage(root, arg, close) {
  const L = window.Lineage; const wrap = el('div', 'linwrap'); root.appendChild(wrap);
  if (!L) { wrap.innerHTML = '<p>No lineage data.</p>' + closeBtn(); $('.close', wrap).onclick = close; return; }
  const rowH = 118, top = 54, left = 40, known = G.s.nodes, byId = {}; L.nodes.forEach(n => byId[n.id] = n);
  const kids = {}; L.nodes.forEach(n => (n.from || []).forEach(p => { (kids[p] = kids[p] || []).push(n.id); }));
  const state = n => known[n.id] ? 'known' : (n.act2 ? (G.s.flags.act2tease ? 'ghost' : 'hidden') : (((n.from || []).some(p => known[p]) || (kids[n.id] || []).some(k => known[k])) ? 'ghost' : 'hidden'));
  const pos = {}; let maxX = 0;
  L.families.forEach((f, r) => {
    const ns = L.nodes.filter(n => n.fam === f.id).sort((a, b) => a.year - b.year); let last = -1e9;
    ns.forEach(n => { let x = X(n.year); if (x < last + 92) x = last + 92; last = x; pos[n.id] = { x: left + x + 60, y: top + r * rowH + rowH / 2 - 6 }; maxX = Math.max(maxX, left + x + 60); });
  });
  const width = maxX + 240, height = top + L.families.length * rowH + 10;
  const total = L.nodes.filter(n => !n.act2).length, got = L.nodes.filter(n => known[n.id] && !n.act2).length;
  let h = `<div class="linhead"><h2>Lineage</h2><span class="lincount">${got} of ${total} traced${G.s.flags.act2tease ? ' · the rest belongs to Act II' : ''}</span><span class="linhelp">drag or scroll sideways · click a watch</span>${closeBtn()}</div>`;
  h += `<div class="linbody"><div class="linrows">${L.families.map((f, r) => `<div class="linrow" style="top:${top + r * rowH}px;height:${rowH}px">${esc(f.name)}</div>`).join('')}</div><div class="linscroll"><div class="lincanvas" style="width:${width}px;height:${height}px">`;
  // decade axis
  for (let y = 1900; y <= 2020; y += 10) h += `<div class="decade" style="left:${left + X(y) + 60}px"><span>${y}</span></div>`;
  h += `<div class="decade" style="left:${left + X(1810) + 60}px"><span>1810</span></div>`;
  L.families.forEach((f, r) => { h += `<div class="lane" style="top:${top + r * rowH}px;height:${rowH}px"></div>`; });
  // links
  let paths = '';
  L.nodes.forEach(n => { const sn = state(n); if (sn === 'hidden') return; (n.from || []).forEach(pid => { const p = byId[pid]; if (!p) return; const sp = state(p); if (sp === 'hidden') return; const a = pos[pid], b = pos[n.id], dx = Math.max(40, Math.abs(b.x - a.x) * 0.5); paths += `<path class="${sn === 'known' && sp === 'known' ? '' : 'ghost'}" d="M${a.x + 30},${a.y}C${a.x + 30 + dx},${a.y} ${b.x - 30 - dx},${b.y} ${b.x - 30},${b.y}"/>`; }); });
  h += `<svg class="links" width="${width}" height="${height}">${paths}</svg>`;
  L.nodes.forEach(n => {
    const st = state(n); if (st === 'hidden') return; const p = pos[n.id];
    if (st === 'known') h += `<button class="node${G.s.news.nodes[n.id] ? ' new' : ''}" data-n="${n.id}" style="left:${p.x}px;top:${p.y}px"><span class="thumb">${Watch.svg(n.cfg, { crop: 'head' })}</span><span class="nl">${esc(n.name)}</span><span class="ny">${n.year}</span></button>`;
    else h += `<div class="node ghost" style="left:${p.x}px;top:${p.y}px"><span class="thumb">?</span><span class="nl">${n.act2 ? 'Act II' : ''}</span></div>`;
  });
  h += `</div></div></div><div class="lincard"></div>`;
  wrap.innerHTML = h;
  const scroll = $('.linscroll', wrap), card = $('.lincard', wrap), rows = $('.linrows', wrap);
  scroll.addEventListener('scroll', () => { rows.style.transform = `translateY(${-scroll.scrollTop}px)`; });
  function select(id, noscroll) {
    const n = byId[id]; if (!n) return;
    $$('.node', wrap).forEach(b => b.classList.toggle('sel', b.dataset.n === id));
    const fam = L.families.find(f => f.id === n.fam);
    const chips = (ids, lab) => { const k = ids.filter(i => byId[i]); if (!k.length) return ''; return `<div class="chips"><span>${lab}</span>${k.map(i => known[i] ? `<button data-go="${i}">${esc(byId[i].name)}</button>` : `<em>?</em>`).join('')}</div>`; };
    card.innerHTML = `<div class="cthumb">${Watch.svg(n.cfg, { crop: 'head' })}</div><div class="ctext"><div class="cfam">${esc(fam ? fam.name : '')} · ${n.year}</div><h3>${esc(n.name)}</h3><div class="cmaker">${esc(n.maker || '')}</div><p class="cline">${G.fmtPlain(n.line || '')}</p><p>${G.fmtPlain(n.text || '')}</p>${chips(n.from || [], 'from')}${chips(kids[id] || [], 'led to')}</div>`;
    card.classList.add('on');
    $$('[data-go]', card).forEach(b => b.onclick = () => select(b.dataset.go));
    if (!noscroll) { const p = pos[id]; scroll.scrollTo({ left: Math.max(0, p.x - scroll.clientWidth / 2), behavior: 'smooth' }); }
    delete G.s.news.nodes[id];
  }
  $$('.node[data-n]', wrap).forEach(b => b.onclick = () => { Sound.sfx('soft'); select(b.dataset.n, true); b.classList.remove('new'); });
  $('.close', wrap).onclick = () => { G.s.news.nodes = {}; close(); };
  // drag to pan
  let drag = null;
  scroll.addEventListener('pointerdown', e => { if (e.target.closest('.node')) return; drag = { x: e.clientX, y: e.clientY, l: scroll.scrollLeft, t: scroll.scrollTop }; scroll.classList.add('drag'); });
  window.addEventListener('pointermove', e => { if (!drag) return; scroll.scrollLeft = drag.l - (e.clientX - drag.x); scroll.scrollTop = drag.t - (e.clientY - drag.y); });
  window.addEventListener('pointerup', () => { drag = null; scroll.classList.remove('drag'); });
  scroll.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && scroll.scrollHeight <= scroll.clientHeight + 2) { scroll.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  const news = Object.keys(G.s.news.nodes).filter(i => byId[i]), ks = Object.keys(known).filter(i => byId[i]);
  const first = arg.node || news[0] || ks[ks.length - 1];
  if (first) { const p = pos[first]; scroll.scrollLeft = Math.max(0, p.x - scroll.clientWidth / 2); select(first, true); }
  else card.innerHTML = '<p class="cempty">Nothing traced yet. Every watch you learn about takes its place here, next to the watches it came from.</p>', card.classList.add('on');
}

/* ================= MENU ================= */
function menu(root, arg, close) {
  const wrap = el('div', 'menuwrap'); root.appendChild(wrap);
  function main() {
    wrap.innerHTML = `<h2>Unsigned</h2><div class="msub">Act I — The Empty Roll</div>
      <button class="btn" data-a="resume">Resume</button>
      <button class="btn" data-a="log">Read back</button>
      <button class="btn" data-a="sound">Sound: ${Sound.on ? 'on' : 'off'}</button>
      <label class="vol"><span>Volume</span><input type="range" min="0" max="100" step="5" value="${Math.round(Sound.vol * 100)}" aria-label="Volume"></label>
      <button class="btn" data-a="motion">Scene motion: ${G.motion.rate > 0 ? 'on' : 'off'}</button>
      <button class="btn" data-a="title">Back to the title</button>
      <p class="mnote">The game saves by itself at the start of every scene.</p>`;
    const vr = $('.vol input', wrap);
    vr.oninput = () => { Sound.init(); Sound.setVol(vr.value / 100); if (!Sound.on && +vr.value > 0) { Sound.toggle(); $('#hud .snd').classList.remove('off'); $('[data-a="sound"]', wrap).textContent = 'Sound: on'; } };
    vr.onchange = () => Sound.sfx('note');
    $$('button', wrap).forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'resume') close();
      else if (a === 'sound') { Sound.init(); const on = Sound.toggle(); $('#hud .snd').classList.toggle('off', !on); main(); }
      else if (a === 'motion') { G.setMotion(G.motion.rate > 0 ? 0 : 20, true); main(); }
      else if (a === 'log') log();
      else if (a === 'title') { location.reload(); }
    });
  }
  function log() {
    wrap.innerHTML = `<h2>Read back</h2><div class="logbox">${G.log.map(l => `<div class="ll k-${l.kind}">${l.who ? `<b>${esc(l.who)}</b>` : ''}<span>${l.html}</span></div>`).join('') || '<p>Nothing yet.</p>'}</div><button class="btn" data-a="back">Back</button>`;
    const lb = $('.logbox', wrap); lb.scrollTop = lb.scrollHeight;
    $('button', wrap).onclick = main;
  }
  main();
}
})();
