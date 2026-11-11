/* UNSIGNED — engine: state, save, story runner, dialogue UI. */
(function () {
'use strict';
const G = window.G = {
  s: null, snap: null, scenes: {}, people: {}, watches: {}, terms: {}, pages: [], slots: [],
  auto: false, ff: false, log: [], busy: false
};
const KEY = 'unsigned.act1.save';
const $ = (q, e) => (e || document).querySelector(q);
const $$ = (q, e) => Array.from((e || document).querySelectorAll(q));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const clone = o => JSON.parse(JSON.stringify(o));
const wait = ms => new Promise(r => setTimeout(r, G.auto ? 0 : ms));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
G.$ = $; G.$$ = $$; G.el = el; G.wait = wait; G.esc = esc;

/* ---------------- state ---------------- */
G.fresh = function () {
  return {
    v: 1, scene: null, cash: 0, flags: {}, roll: {}, paid: {}, obs: {}, terms: {}, nodes: {}, pages: {},
    news: { nodes: {}, terms: {}, pages: {}, roll: {} }, place: '', date: '', bg: null, bgo: null, mood: null,
    goal: '', brand: '', hudOn: false, tools: {}
  };
};
G.save = function () { try { localStorage.setItem(KEY, JSON.stringify(G.snap)); } catch (e) {} };
G.load = function () { try { const t = localStorage.getItem(KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } };
G.wipe = function () { try { localStorage.removeItem(KEY); } catch (e) {} };
G.money = n => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');

/* ---------------- text ---------------- */
G.fmt = function (text) {
  if (typeof text === 'function') text = text(G.s);
  let t = esc(text);
  t = t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, a, b) => {
    const id = (b || a).toLowerCase().trim();
    if (G.terms[id]) { if (G.s && !G.s.terms[id]) { G.s.terms[id] = 1; G.s.news.terms[id] = 1; G.hudDots(); } return `<span class="term" data-term="${id}">${a}</span>`; }
    return a;
  });
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  return t;
};
function wrapWords(node, st) {
  // wrap each word in a span so the line can "write itself"
  const kids = Array.from(node.childNodes);
  kids.forEach(k => {
    if (k.nodeType === 3) {
      const frag = document.createDocumentFragment();
      k.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = w; sp.style.animationDelay = (st.i++ * st.step) + 'ms'; frag.appendChild(sp);
      });
      node.replaceChild(frag, k);
    } else if (k.nodeType === 1) wrapWords(k, st);
  });
}

/* ---------------- stage: background, props, hud ---------------- */
/* A backdrop is one big SVG. If any part of it animates, the browser repaints all of it on every frame.
   So split it into stacked layers at the top level: runs of still artwork (painted once) and the few animated groups. */
const ANIM = 'animate,animateTransform,animateMotion,set';
function layerize(box) {
  const svg = box.querySelector('svg'); if (!svg) return;
  const kids = Array.from(svg.children), isDefs = k => k.tagName.toLowerCase() === 'defs' || k.tagName.toLowerCase() === 'style';
  const defs = kids.filter(isDefs), body = kids.filter(k => !isDefs(k));
  const moves = k => k.matches(ANIM) || !!k.querySelector(ANIM);
  if (!body.some(moves)) { svg.setAttribute('class', 'lay'); bake(svg); return; }
  const segs = [];
  body.forEach(k => { const a = moves(k), last = segs[segs.length - 1]; if (last && last.a === a) last.els.push(k); else segs.push({ a, els: [k] }); });
  box.innerHTML = '';
  segs.forEach(sg => {
    const layer = svg.cloneNode(false);
    defs.forEach(d => layer.appendChild(d.cloneNode(true)));
    sg.els.forEach(e => layer.appendChild(e));
    layer.setAttribute('class', sg.a ? 'lay moving' : 'lay');
    box.appendChild(layer);
    if (sg.a) { try { layer.pauseAnimations(); layer.setCurrentTime(motionTime()); } catch (e) {} }
    else bake(layer);
  });
}
/* Still layers are then painted once into a canvas, so that nothing the browser does later can make it redraw them.
   If any step fails, the layer simply stays as live SVG. */
const NS = 'http://www.w3.org/2000/svg';
function sceneFonts() {
  if (G._sf == null) G._sf = (window.FONT_FACES || []).filter(b => /font-family:'(Jost|Cormorant Garamond)'/.test(b)).join('');
  return G._sf;
}
function paint(cv) {
  if (!cv.parentNode || !cv._img) return;
  const r = cv.parentNode.getBoundingClientRect(); if (!r.width || !r.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const vw = cv._vb[2], vh = cv._vb[3], k = Math.max(w / vw, h / vh), c = cv.getContext('2d');
  c.clearRect(0, 0, w, h); c.drawImage(cv._img, (w - vw * k) / 2, (h - vh * k) / 2, vw * k, vh * k);
}
function bake(svg) {
  let src, vb;
  if (G.auto) return;
  try {
    if (!window.Blob || !window.URL || !URL.createObjectURL || !window.XMLSerializer) return;
    vb = (svg.getAttribute('viewBox') || '0 0 1600 900').trim().split(/[\s,]+/).map(Number);
    const clone = svg.cloneNode(true);
    clone.removeAttribute('class'); clone.removeAttribute('style');
    clone.setAttribute('xmlns', NS); clone.setAttribute('width', vb[2]); clone.setAttribute('height', vb[3]);
    const st = document.createElementNS(NS, 'style'); st.textContent = sceneFonts(); clone.insertBefore(st, clone.firstChild);
    src = new XMLSerializer().serializeToString(clone);
    const ids = {}; (src.match(/\sid="([^"]+)"/g) || []).forEach(m => { ids[m.replace(/^\sid="|"$/g, '')] = 1; });
    const refs = src.match(/url\((?:&quot;)?#([^)&]+)(?:&quot;)?\)|href="#([^"]+)"/g) || [];
    for (let i = 0; i < refs.length; i++) { const id = refs[i].replace(/^url\((?:&quot;)?#|^href="#|(?:&quot;)?\)$|"$/g, ''); if (!ids[id]) return; }
  } catch (e) { return; }
  const img = new Image(), url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml;charset=utf-8' }));
  img.onload = () => {
    if (!svg.parentNode) { URL.revokeObjectURL(url); return; }
    const cv = document.createElement('canvas'); cv.className = 'lay baked'; cv._img = img; cv._vb = vb;
    svg.parentNode.replaceChild(cv, svg); paint(cv);
    setTimeout(() => { paint(cv); URL.revokeObjectURL(url); }, 600);   // again, in case the embedded fonts were late
  };
  img.onerror = () => { URL.revokeObjectURL(url); };
  img.src = url;
}
let resizeT = null;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => document.querySelectorAll('canvas.baked').forEach(paint), 160); });
/* Ambient motion (snow, rain, water) is stepped by hand at a modest rate rather than left to run at 60 fps,
   and it backs off, then stops, on a machine that can't keep up. The story never depends on it. */
const M = G.motion = { rate: 20, t0: performance.now(), timer: null };
try { if (localStorage.getItem('unsigned.motion') === '0') M.rate = 0; } catch (e) {}
function motionTime() { return (performance.now() - M.t0) / 1000; }
G.setMotion = function (rate, remember) {
  M.rate = rate; clearInterval(M.timer); M.timer = null;
  if (remember) { try { localStorage.setItem('unsigned.motion', rate ? '1' : '0'); } catch (e) {} }
  if (rate > 0) M.timer = setInterval(() => {
    if (document.hidden) return; const t = motionTime();
    document.querySelectorAll('.bgl.on svg.moving').forEach(sv => { try { sv.setCurrentTime(t); } catch (e) {} });
  }, 1000 / rate);
};
G.setMotion(M.rate);
(function watchdog() {
  let last = performance.now(), ema = 16, slow = 0;
  function f(now) {
    const dt = now - last; last = now;
    if (dt < 400) ema += (dt - ema) * 0.06;
    if (M.rate > 0 && !document.hidden && document.querySelector('.bgl.on svg.moving')) {
      if (ema > 42) { slow = slow || now; if (now - slow > 1400) { G.setMotion(M.rate > 8 ? 8 : 0); slow = 0; ema = 24; } } else slow = 0;
    } else slow = 0;
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
})();

let bgFlip = false;
G.setBg = function (name, o, instant) {
  if (!G.s) return;
  G.s.bg = name; G.s.bgo = o || null;
  const a = $('#bg'), b = $('#bg2'), front = bgFlip ? a : b, back = bgFlip ? b : a;
  bgFlip = !bgFlip;
  let html = '';
  if (name && window.Scenes && Scenes[name]) { try { html = Scenes[name](o || {}); } catch (e) { console.error(e); } }
  front.innerHTML = html; layerize(front); front.className = 'bgl on' + (name ? '' : ' none') + (instant ? ' instant' : '');
  back.className = 'bgl';
  setTimeout(() => { if (!back.classList.contains('on')) back.innerHTML = ''; }, 1400);
  document.body.dataset.bg = name || 'none';
};
G.setHud = function (place, date) {
  if (place != null) G.s.place = place; if (date != null) G.s.date = date;
  $('#hud .place').innerHTML = esc(G.s.place || '') + (G.s.date ? `<span>${esc(G.s.date)}</span>` : '');
  $('#hud').classList.toggle('on', !!G.s.hudOn);
  $('#hud .cash').textContent = G.money(G.s.cash);
  $('#hud .cash').classList.toggle('neg', G.s.cash < 0);
  $('#hud .cash').style.display = G.s.flags.cashOn ? '' : 'none';
  $$('#hud [data-tool]').forEach(b => { b.style.display = G.s.tools[b.dataset.tool] ? '' : 'none'; });
  G.hudDots();
};
G.hudDots = function () {
  if (!G.s) return; const n = G.s.news;
  const set = (tool, on) => { const b = $(`#hud [data-tool="${tool}"]`); if (b) b.classList.toggle('dot', !!on); };
  set('carnet', Object.keys(n.pages).length || Object.keys(n.terms).length);
  set('roll', Object.keys(n.roll).length);
  set('lineage', Object.keys(n.nodes).length);
};

G.watchSvg = function (id, o) {
  const w = G.watches[id]; if (!w) return '';
  let cfg = w.cfg; if (typeof cfg === 'function') cfg = cfg(G.s);
  return Watch.svg(cfg, Object.assign({ live: !!w.live }, o || {}));
};
G.setProp = function (items, o) {
  o = o || {}; const p = $('#prop');
  if (!items) { p.classList.remove('on'); setTimeout(() => { if (!p.classList.contains('on')) p.innerHTML = ''; }, 500); return; }
  if (!Array.isArray(items)) items = [items];
  p.innerHTML = '';
  p.className = 'n' + items.length + (o.cls ? ' ' + o.cls : '');
  items.forEach(it => {
    const d = el('div', 'pitem');
    if (typeof it === 'string') {
      const w = G.watches[it];
      d.innerHTML = G.watchSvg(it, { view: o.view || 'dial', crop: o.crop }) + (o.label ? `<div class="plabel">${esc(typeof o.label === 'string' ? o.label : (w ? w.name : ''))}</div>` : '');
      if (o.uv) d.classList.add('uv');
      const sv = $('svg', d);
      if (sv && (o.stop || (w && w.stopped))) { sv.dataset.run = '0'; sv.dataset.amp = '0'; if (o.stop) Watch.setHands(sv, o.stop[0], o.stop[1], o.stop[2] || 0); }
    } else if (it.html) { d.innerHTML = it.html; d.classList.add('raw'); }
    p.appendChild(d);
  });
  requestAnimationFrame(() => p.classList.add('on'));
};

/* ---------------- toasts ---------------- */
G.toast = function (kind, text) {
  if (G.auto) return;
  const t = el('div', 'toast', `<b>${esc(kind)}</b>${text}`);
  $('#toasts').appendChild(t);
  requestAnimationFrame(() => t.classList.add('on'));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 600); }, 4200);
};
const TOOLHINT = { carnet: 'Her notebook is in the top bar now. Press C.', roll: 'The watch roll is in the top bar now. Press R.', lineage: 'The lineage board is open. Press L.' };
G.unlockTool = function (name) { if (G.s.tools[name]) return; G.s.tools[name] = 1; G.setHud(); if (TOOLHINT[name]) setTimeout(() => G.toast('New', TOOLHINT[name]), 900); };
G.learn = function (ids) {
  const names = [];
  ids.forEach(id => { if (!G.s.nodes[id]) { G.s.nodes[id] = 1; G.s.news.nodes[id] = 1; const n = (window.Lineage ? Lineage.nodes : []).find(x => x.id === id); names.push(n ? n.name : id); } });
  if (names.length) { G.unlockTool('lineage'); G.setHud(); Sound.sfx('note'); G.toast('Lineage', names.length > 3 ? names.slice(0, 3).map(esc).join(' · ') + ` · +${names.length - 3} more` : names.map(esc).join(' · ')); }
};
G.cash = function (delta, why) {
  G.s.cash += delta; G.s.flags.cashOn = 1; G.setHud();
  if (why) { Sound.sfx('coin'); G.toast(delta < 0 ? 'Spent' : 'Received', `${G.money(Math.abs(delta))} · ${esc(why)}`); }
};

/* ---------------- dialogue ---------------- */
let advance = null, lineDone = true, lastWho = null, portraitCache = {};
function portrait(who) {
  const p = G.people[who]; if (!p || !p.watch) return '';
  const wid = typeof p.watch === 'function' ? p.watch(G.s) : p.watch;
  const key = who + ':' + wid + ':' + (who === 'lou' ? (G.s.flags.signed ? G.s.brand : '') : '');
  if (!portraitCache[key]) portraitCache[key] = G.watchSvg(wid, { wrist: p.wrist || {}, live: false });
  return portraitCache[key];
}
G.clearPortraits = () => { portraitCache = {}; };
function showLine(kind, who, text) {
  return new Promise(resolve => {
    const dlg = $('#dlg'), p = G.people[who] || {};
    const html = G.fmt(text);
    G.log.push({ kind, who: p.name || '', html }); if (G.log.length > 120) G.log.shift();
    if (G.auto) { resolve(); return; }
    $('#choices').innerHTML = ''; $('#choices').classList.remove('on');
    dlg.className = 'on k-' + kind + (p.watch && (kind === 'd') ? ' has-p' : '');
    const first = who && !G.metScene[who]; if (who) G.metScene[who] = 1;
    let h = '';
    if (kind === 'd') {
      h += `<div class="portrait${lastWho === who ? ' same' : ''}">${portrait(who)}</div>`;
      h += `<div class="box"><div class="who"><span class="name">${esc(p.name || who)}</span>${p.role && first ? `<span class="role">${esc(p.role)}</span>` : ''}</div><div class="txt">${html}</div><div class="more">▾</div></div>`;
    } else if (kind === 'm') {
      h += `<div class="box${who === 'lou' ? ' mine' : ''}"><div class="who"><span class="name">${who === 'lou' ? 'You' : esc(p.name || who)}</span><span class="role">${who === 'lou' ? 'sent' : 'message'}</span></div><div class="txt bubble">${html}</div><div class="more">▾</div></div>`;
    } else if (kind === 'nb') {
      h += `<div class="box"><div class="slip"><div class="txt">${html}</div>${who ? `<div class="src">${esc(who)}</div>` : ''}</div><div class="more">▾</div></div>`;
    } else {
      h += `<div class="box"><div class="txt">${html}</div><div class="more">▾</div></div>`;
    }
    dlg.innerHTML = h; lastWho = kind === 'd' ? who : null;
    const txt = $('.txt', dlg), st = { i: 0, step: kind === 'nb' ? 34 : 17 };
    wrapWords(txt, st);
    const total = st.i * st.step + 260;
    lineDone = false;
    const finish = () => { lineDone = true; dlg.classList.add('done'); };
    const timer = setTimeout(finish, G.ff ? 0 : total);
    if (G.ff) { dlg.classList.add('done'); }
    advance = () => {
      if (!lineDone) { clearTimeout(timer); finish(); return; }
      advance = null; Sound.sfx('soft'); resolve();
    };
    if (G.ff) setTimeout(() => { if (advance) { lineDone = true; advance(); } }, 70);
  });
}
function showChoices(prompt, opts) {
  return new Promise(resolve => {
    if (G.auto) { const pick = G.autoPick ? G.autoPick(opts, prompt) : opts[0]; resolve(pick || opts[0]); return; }
    const dlg = $('#dlg'), box = $('#choices');
    advance = null;
    if (prompt) { dlg.className = 'on k-n done choosing'; dlg.innerHTML = `<div class="box"><div class="txt">${G.fmt(prompt)}</div></div>`; lastWho = null; }
    else { dlg.classList.add('choosing'); const m = $('.more', dlg); if (m) m.style.visibility = 'hidden'; }
    box.innerHTML = '';
    opts.forEach((o, i) => {
      const b = el('button', 'choice' + (o.seen ? ' seen' : '') + (o.exit ? ' exit' : ''), `<i>${i + 1}</i><span>${G.fmt(o.t)}</span>${o.note ? `<small>${G.fmt(o.note)}</small>` : ''}`);
      b.onclick = ev => { ev.stopPropagation(); Sound.sfx('click'); box.classList.remove('on'); box.innerHTML = ''; dlg.classList.remove('choosing'); resolve(o); };
      box.appendChild(b);
    });
    requestAnimationFrame(() => box.classList.add('on'));
  });
}
G.hideDialog = function () { $('#dlg').className = ''; $('#choices').classList.remove('on'); $('#choices').innerHTML = ''; lastWho = null; };

/* input */
function tryAdvance() { if (G.modal || !advance) return; advance(); }
document.addEventListener('click', e => {
  if (e.target.closest('.term')) { showTerm(e.target.closest('.term')); e.stopPropagation(); return; }
  hideTerm();
  if (e.target.closest('#hud') || e.target.closest('#overlay') || e.target.closest('#choices') || e.target.closest('button')) return;
  if (e.target.closest('#stage')) tryAdvance();
});
document.addEventListener('keydown', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (e.key === 'Control') { G.ff = true; if (advance && !G.modal) tryAdvance(); }
  if (G.modal) { if (e.key === 'Escape' && G.closePanel) G.closePanel(); return; }
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tryAdvance(); }
  else if (/^[1-9]$/.test(e.key)) { const b = $$('#choices .choice')[+e.key - 1]; if (b) b.click(); }
  else if (e.key === 'c' || e.key === 'C') { if (G.s && G.s.tools.carnet) G.openPanel('carnet'); }
  else if (e.key === 'r' || e.key === 'R') { if (G.s && G.s.tools.roll) G.openPanel('roll'); }
  else if (e.key === 'l' || e.key === 'L') { if (G.s && G.s.tools.lineage) G.openPanel('lineage'); }
  else if (e.key === 'Escape') { G.openPanel('menu'); }
});
document.addEventListener('keyup', e => { if (e.key === 'Control') G.ff = false; });

/* glossary popover */
function showTerm(span) {
  const id = span.dataset.term, t = G.terms[id]; if (!t) return;
  let pop = $('#termpop'); if (!pop) { pop = el('div'); pop.id = 'termpop'; document.body.appendChild(pop); }
  pop.innerHTML = `<b>${esc(t.t)}</b>${G.fmtPlain(t.d)}`;
  pop.classList.add('on');
  const r = span.getBoundingClientRect(), pw = Math.min(360, window.innerWidth - 24);
  pop.style.width = pw + 'px';
  pop.style.left = Math.max(12, Math.min(window.innerWidth - pw - 12, r.left + r.width / 2 - pw / 2)) + 'px';
  pop.style.top = ''; pop.style.bottom = (window.innerHeight - r.top + 10) + 'px';
  if (r.top < 200) { pop.style.bottom = ''; pop.style.top = (r.bottom + 10) + 'px'; }
}
function hideTerm() { const p = $('#termpop'); if (p) p.classList.remove('on'); }
G.fmtPlain = t => esc(t).replace(/\*([^*]+)\*/g, '<em>$1</em>');

/* ---------------- story DSL ---------------- */
const D = G.dsl = {
  n: t => ({ k: 'n', t }),
  d: (who, t) => ({ k: 'd', who, t }),
  me: t => ({ k: 'd', who: 'lou', t }),
  m: (who, t) => ({ k: 'm', who, t }),
  nb: (t, src) => ({ k: 'nb', t, src }),
  opt: (t, then, o) => Object.assign({ t, then: then || [] }, o || {}),
  choice: (prompt, opts) => Array.isArray(prompt) ? { k: 'choice', opts: prompt } : { k: 'choice', prompt, opts },
  hub: (prompt, opts, o) => Array.isArray(prompt) ? { k: 'hub', opts: prompt, min: (opts || {}).min } : { k: 'hub', prompt, opts, min: (o || {}).min },
  iff: (cond, a, b) => ({ k: 'if', cond, a, b }),
  act: fn => ({ k: 'act', fn }),
  bg: (name, o) => ({ k: 'bg', name, o }),
  show: (items, o) => ({ k: 'show', items, o }),
  hide: () => ({ k: 'show', items: null }),
  learn: (...ids) => ({ k: 'learn', ids }),
  page: (id, o) => ({ k: 'page', id, o }),
  slot: (slotId, watch) => ({ k: 'slot', slotId, watch }),
  cash: (delta, why) => ({ k: 'cash', delta, why }),
  travel: (to, o) => ({ k: 'travel', to, o }),
  chapter: (num, title, sub) => ({ k: 'chapter', num, title, sub }),
  hud: (place, date) => ({ k: 'hud', place, date }),
  goal: t => ({ k: 'act', fn: s => { s.goal = t; } }),
  tool: name => ({ k: 'tool', name }),
  goto: id => ({ k: 'goto', id }),
  label: name => ({ k: 'label', label: name }),
  jump: name => ({ k: 'jump', name }),
  pause: ms => ({ k: 'pause', ms }),
  sfx: (name, d) => ({ k: 'sfx', name, d }),
  tick: (bph, vol) => ({ k: 'tick', bph, vol }),
  music: name => ({ k: 'music', name }),
  fade: (to, ms) => ({ k: 'fade', to, ms }),
  game: (name, o) => ({ k: 'game', name, o }),
  panel: (name, arg) => ({ k: 'panel', name, arg })
};
['inspect', 'haggle', 'wind', 'regulate', 'bezel', 'stamp', 'naming', 'voicemail', 'titledrop', 'ending', 'settime', 'listing'].forEach(g => { D[g] = (a, b) => ({ k: 'game', name: g, a, b }); });
G.scene = (id, steps) => { G.scenes[id] = steps; };

const H = {
  n: st => showLine('n', null, st.t),
  d: st => showLine('d', st.who, st.t),
  m: st => { Sound.sfx('phone'); return showLine('m', st.who, st.t); },
  nb: st => { Sound.sfx('page'); return showLine('nb', st.src || '', st.t); },
  async choice(st) {
    const opts = st.opts.filter(o => !o.if || o.if(G.s));
    const o = await showChoices(st.prompt, opts);
    if (o.set) o.set(G.s);
    await exec(o.then);
  },
  async hub(st) {
    const used = {};
    for (;;) {
      const avail = st.opts.filter(o => !o.if || o.if(G.s));
      const topics = avail.filter(o => !o.exit), seen = topics.filter(o => used[o.t]).length;
      const need = Math.min(st.min != null ? st.min : 2, topics.length);
      const opts = avail.filter(o => !(used[o.t] && !o.keep && !o.exit) && !(o.exit && seen < need));
      const live = opts.filter(o => !o.exit);
      if (!opts.length) return;
      if (!live.length && opts.every(o => o.exit) && opts.length === 1 && opts[0].auto) { await exec(opts[0].then); return; }
      const o = G.auto ? (opts.find(x => !used[x.t] && !x.exit) || opts.find(x => x.exit) || opts[0]) : await showChoices(st.prompt, opts.map(x => Object.assign({}, x, { seen: !!used[x.t] })));
      used[o.t] = 1; if (o.set) o.set(G.s);
      await exec(o.then);
      if (o.exit) return;
    }
  },
  async if(st) { await exec(st.cond(G.s) ? st.a : st.b); },
  act(st) { st.fn(G.s); G.setHud(); },
  bg(st) { G.setBg(st.name, st.o); return wait(G.s.flags._quick ? 0 : 500); },
  show(st) { G.setProp(typeof st.items === 'function' ? st.items(G.s) : st.items, st.o); return wait(250); },
  learn(st) { G.learn(st.ids); },
  async page(st) {
    const first = !G.s.pages[st.id];
    G.s.pages[st.id] = 1; G.s.news.pages[st.id] = 1; G.unlockTool('carnet'); G.setHud();
    if (!(st.o && st.o.quiet)) { G.hideDialog(); await G.openPanel('carnet', { page: st.id, reading: true }); }
    else if (first) G.toast('Carnet', 'A page you can read now');
  },
  async slot(st) {
    G.s.roll[st.slotId] = typeof st.watch === 'function' ? st.watch(G.s) : st.watch; G.s.news.roll[st.slotId] = 1; G.s.tools.roll = 1; G.setHud();
    G.hideDialog(); await G.openPanel('roll', { slot: st.slotId, placing: true });
  },
  cash(st) { G.cash(st.delta, st.why); },
  async travel(st) { G.hideDialog(); G.setProp(null); await G.games.travel(st.to, st.o || {}); },
  async chapter(st) { G.hideDialog(); G.setProp(null); await G.games.chapter(st); },
  hud(st) { G.s.hudOn = true; G.setHud(st.place, st.date); },
  tool(st) { G.unlockTool(st.name); },
  goto(st) { throw { goto: st.id }; },
  label() {},
  jump(st) { throw { jump: st.name }; },
  pause(st) { return wait(st.ms); },
  sfx(st) { Sound.sfx(st.name, st.d); },
  tick(st) { Sound.tick(st.bph, st.vol); G.s.tickNow = st.bph ? [st.bph, st.vol] : null; },
  music(st) { G.s.mood = st.name; Sound.music(st.name); },
  async fade(st) { const f = $('#fade'); f.style.transitionDuration = (st.ms || 900) + 'ms'; f.classList.toggle('on', st.to !== 'in'); await wait(st.ms || 900); },
  async game(st) { G.hideDialog(); const r = await G.games[st.name](st.a, st.b); G.last = r; return r; },
  async panel(st) { G.hideDialog(); await G.openPanel(st.name, st.arg); }
};
async function exec(st) {
  if (!st) return;
  if (Array.isArray(st)) { for (let i = 0; i < st.length; i++) await exec(st[i]); return; }
  if (typeof st === 'function') { const r = st(G.s); if (r) await exec(r); return; }
  const h = H[st.k]; if (!h) throw new Error('Unknown step: ' + JSON.stringify(st).slice(0, 120));
  return h(st);
}
G.exec = exec;

async function runScene(steps) {
  const labels = {}; steps.forEach((st, i) => { if (st && st.k === 'label') labels[st.label] = i; });
  let i = 0;
  while (i < steps.length) {
    try { await exec(steps[i]); i++; }
    catch (e) {
      if (e && e.jump) { if (!(e.jump in labels)) throw new Error('No label ' + e.jump); i = labels[e.jump]; }
      else if (e && e.goto) return e.goto;
      else throw e;
    }
  }
  return null;
}
G.run = async function (sceneId) {
  G.running = true;
  while (sceneId) {
    const steps = G.scenes[sceneId];
    if (!steps) { console.error('Missing scene: ' + sceneId); break; }
    G.s.scene = sceneId; G.metScene = {};
    G.snap = clone(G.s); G.save();
    sceneId = await runScene(steps);
  }
  G.running = false;
};
/* resume: re-apply stage from saved state */
G.restoreStage = function () {
  G.setBg(G.s.bg, G.s.bgo, true); G.setHud(G.s.place, G.s.date); Sound.music(G.s.mood);
  if (G.s.tickNow) Sound.tick(G.s.tickNow[0], G.s.tickNow[1]); else Sound.tick(0);
  $('#fade').classList.remove('on'); G.setProp(null); G.hideDialog();
};

/* hud buttons */
document.addEventListener('DOMContentLoaded', () => {
  $$('#hud [data-tool]').forEach(b => { b.addEventListener('click', e => { e.stopPropagation(); Sound.sfx('click'); G.openPanel(b.dataset.tool); }); });
  $('#hud .snd').addEventListener('click', e => { e.stopPropagation(); Sound.init(); const on = Sound.toggle(); $('#hud .snd').classList.toggle('off', !on); });
  $('#hud .menu').addEventListener('click', e => { e.stopPropagation(); G.openPanel('menu'); });
  $('#hud .snd').classList.toggle('off', !Sound.on);
});
})();
