/* UNSIGNED — the hands-on parts: loupe, haggling, winding, regulating, bezel, pad printer, travel. */
(function () {
'use strict';
const G = window.G, $ = G.$, $$ = G.$$, el = G.el, esc = G.esc, wait = G.wait;
const games = G.games = {};

function openGame(cls) { const ov = $('#overlay'); ov.innerHTML = ''; ov.className = 'on g-' + cls; G.modal = true; return ov; }
function closeGame() { const ov = $('#overlay'); ov.className = ''; ov.innerHTML = ''; G.modal = false; restoreTick(); }
function restoreTick() { if (G.s && G.s.tickNow) Sound.tick(G.s.tickNow[0], G.s.tickNow[1]); else Sound.tick(0); }
function cfgOf(id) { const w = G.watches[id]; let c = w.cfg; if (typeof c === 'function') c = c(G.s); return c; }
const VB = 150, vbStr = `-${VB} -${VB} ${VB * 2} ${VB * 2}`;

/* =====================================================================
   INSPECT — the loupe
   ===================================================================== */
const VIEWNAME = { dial: 'Dial', uv: 'In the dark', back: 'Caseback', inside: 'Inside the back', movement: 'Movement' };
games.inspect = function (id, o) {
  o = o || {};
  return new Promise(resolve => {
    const w = G.watches[id], all = (w.obs || []).filter(ob => !ob.if || ob.if(G.s));
    const found = G.s.obs[id] = G.s.obs[id] || {};
    const views = (o.views || w.views || ['dial']).slice(), closed = o.views ? {} : (w.closed || {});
    if (G.auto) { all.forEach(ob => { if (views.indexOf(ob.v || 'dial') >= 0) found[ob.id] = 1; }); resolve({ found }); return; }
    let view = views[0], hot = null, lastFind = Date.now(), hintTimer = null, dead = false;
    const avail = all.filter(ob => views.indexOf(ob.v || 'dial') >= 0);
    const need = o.free ? 0 : Math.min(o.need != null ? o.need : 3, avail.length);
    const cfg = cfgOf(id), R = Watch.radius(cfg), LR = 105, Z = 2.4;
    const ov = openGame('inspect');
    ov.innerHTML = `<div class="ins">
      <div class="ins-stage"><div class="ins-watch"></div><div class="loupe"><div class="loupe-in"></div></div></div>
      <div class="ins-side">
        <div class="ins-head"><div class="eyebrow">${o.free ? 'From the roll' : 'Under the loupe'}</div><h2>${esc(w.name)}</h2><p>${esc(w.sub || '')}</p></div>
        <div class="ins-tabs"></div>
        <div class="ins-hint">${G.fmt(o.intro || 'Move the loupe over the watch. Click on whatever catches your eye.')}</div>
        <div class="ins-notes"></div>
        <div class="ins-foot"><button class="btn ghost hintbtn" style="visibility:hidden">Not seeing it?</button><button class="btn done"></button></div>
      </div></div>`;
    const stage = $('.ins-watch', ov), loupe = $('.loupe', ov), lin = $('.loupe-in', ov), notes = $('.ins-notes', ov), doneBtn = $('.done', ov), hintBtn = $('.hintbtn', ov), hintEl = $('.ins-hint', ov);
    const inView = () => all.filter(ob => (ob.v || 'dial') === view);
    G._ins = { id, R, VB, avail, found, need, get view() { return view; } };
    const count = () => avail.filter(ob => found[ob.id]).length;
    function marks() {
      let s = `<svg class="marks" viewBox="${vbStr}">`;
      inView().forEach(ob => { if (found[ob.id]) s += `<circle class="mk" cx="${ob.at[0] * R}" cy="${ob.at[1] * R}" r="${(ob.r || 0.16) * R * 0.8}"/>`; });
      return s + '</svg>';
    }
    function render() {
      const v = view === 'uv' ? 'dial' : view;
      const mk = () => Watch.svg(cfg, { view: v, vb: vbStr, live: !!w.live || (!w.stopped && !o.stop) });
      stage.innerHTML = mk() + marks(); lin.innerHTML = mk() + marks();
      [stage, lin].forEach(e => { e.classList.toggle('uv', view === 'uv'); const s = $('svg.watch', e); if ((w.stopped || o.stop) && s) { s.dataset.run = '0'; s.dataset.amp = '0'; if (o.stop && v === 'dial') Watch.setHands(s, o.stop[0], o.stop[1], o.stop[2] || 0); } });
      $('.ins-stage', ov).classList.toggle('dark', view === 'uv');
      let th = '';
      views.forEach(vn => { const tot = all.filter(ob => (ob.v || 'dial') === vn).length, got = all.filter(ob => (ob.v || 'dial') === vn && found[ob.id]).length; th += `<button class="${vn === view ? 'on' : ''}" data-v="${vn}">${VIEWNAME[vn]}${tot ? `<i>${got}/${tot}</i>` : ''}</button>`; });
      Object.keys(closed).forEach(vn => { th += `<button class="shut" data-shut="${vn}">${VIEWNAME[vn]}</button>`; });
      $('.ins-tabs', ov).innerHTML = th;
      $$('.ins-tabs [data-v]', ov).forEach(b => b.onclick = () => { view = b.dataset.v; Sound.sfx(view === 'uv' ? 'click' : 'open'); lastFind = Date.now(); render(); });
      $$('.ins-tabs [data-shut]', ov).forEach(b => b.onclick = () => { hintEl.innerHTML = G.fmt(closed[b.dataset.shut]); Sound.sfx('soft'); });
      const c = count();
      doneBtn.disabled = c < need;
      doneBtn.textContent = c < need ? `Keep looking (${c} of ${need})` : (o.done || 'Put it down');
      if (!w.stopped && !o.stop && w.runs !== false) Sound.tick(cfg.quartz ? 'quartz' : (cfg.bph || 18000), view === 'movement' || view === 'inside' ? 0.5 : 0.22); else Sound.tick(0);
    }
    function addNote(ob, fresh) {
      const d = el('div', 'note' + (fresh ? ' fresh' : ''), `<b>${esc(ob.t)}</b><p>${G.fmt(ob.x)}</p>`);
      notes.insertBefore(d, notes.firstChild);
    }
    avail.forEach(ob => { if (found[ob.id]) addNote(ob, false); });
    function move(e) {
      const r = stage.getBoundingClientRect(); if (!r.width) return;
      const px = e.clientX - r.left, py = e.clientY - r.top, S = r.width;
      const inside = px > -20 && py > -20 && px < S + 20 && py < S + 20;
      loupe.classList.toggle('on', inside);
      const sr = loupe.parentNode.getBoundingClientRect();
      loupe.style.left = (r.left - sr.left) + 'px'; loupe.style.top = (r.top - sr.top) + 'px';
      loupe.style.transform = `translate(${px - LR}px,${py - LR}px)`;
      lin.style.width = lin.style.height = (S * Z) + 'px';
      lin.style.transform = `translate(${-px * Z + LR}px,${-py * Z + LR}px)`;
      const ux = (px / S * 2 * VB - VB) / R, uy = (py / S * 2 * VB - VB) / R;
      hot = null;
      const iv = inView();
      for (let i = 0; i < iv.length; i++) { const ob = iv[i]; if (!found[ob.id] && Math.hypot(ux - ob.at[0], uy - ob.at[1]) < (ob.r || 0.16) * 1.15) { hot = ob; break; } }
      loupe.classList.toggle('hot', !!hot);
    }
    function click(e) {
      move(e);
      if (hot) {
        const ob = hot; found[ob.id] = 1; hot = null; lastFind = Date.now(); hintBtn.style.visibility = 'hidden';
        Sound.sfx('note'); addNote(ob, true); render(); loupe.classList.remove('hot');
        if (ob.learn) G.learn(ob.learn);
        hintEl.innerHTML = count() >= avail.length ? 'That is everything this watch has to say.' : (inView().every(x => found[x.id]) ? 'Nothing more on this side. Try another view.' : 'Noted.');
      } else { Sound.sfx('soft'); loupe.classList.add('miss'); setTimeout(() => loupe.classList.remove('miss'), 250); }
    }
    const stg = $('.ins-stage', ov);
    stg.addEventListener('pointermove', move);
    stg.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') move(e); });
    stg.addEventListener('click', click);
    hintTimer = setInterval(() => { if (dead) return; if (Date.now() - lastFind > 16000 && inView().some(x => !found[x.id])) hintBtn.style.visibility = 'visible'; }, 1000);
    hintBtn.onclick = () => {
      const ob = inView().find(x => !found[x.id]); if (!ob) return;
      const ring = el('div', 'hintring'); const S = stage.getBoundingClientRect().width;
      ring.style.left = ((ob.at[0] * R + VB) / (2 * VB) * S) + 'px'; ring.style.top = ((ob.at[1] * R + VB) / (2 * VB) * S) + 'px';
      stage.appendChild(ring); setTimeout(() => ring.remove(), 2600); lastFind = Date.now(); hintBtn.style.visibility = 'hidden';
    };
    doneBtn.onclick = () => { dead = true; clearInterval(hintTimer); Sound.sfx('click'); closeGame(); resolve({ found }); };
    render();
  });
};

/* =====================================================================
   HAGGLE
   ===================================================================== */
const r50 = n => Math.round(n / 50) * 50;
games.haggle = function (o) {
  return new Promise(resolve => {
    const w = G.watches[o.watch], p = G.people[o.who] || {}, found = G.s.obs[o.watch] || {};
    let price = o.ask, floor = o.floor, patience = o.patience != null ? o.patience : 2, final = false; const used = {};
    const L = Object.assign({ open: `It’s ${G.money(o.ask)}.`, counter: 'I can do {p}.', final: 'That’s {p}, and that’s me done.', deal: 'Done.', pay: 'Sold.', walk: 'Suit yourself.', nope: 'That’s not a fault. That’s the watch.' }, o.lines || {});
    const buy = pr => { G.s.paid[o.watch] = pr; G.cash(-pr, w.name); return { bought: true, price: pr }; };
    if (G.auto) { let pr = o.ask; Object.keys(o.flaws || {}).forEach(k => { if (found[k]) pr -= o.flaws[k].off; }); resolve(buy(Math.max(o.floor, r50(pr * 0.92)))); return; }
    const ov = openGame('haggle');
    ov.innerHTML = `<div class="hg"><div class="hg-watch">${G.watchSvg(o.watch, { vb: vbStr, live: false })}</div>
      <div class="hg-main"><div class="hg-seller"><div class="portrait">${p.watch ? G.watchSvg(p.watch, { wrist: p.wrist || {}, live: false }) : ''}</div><div><div class="who"><span class="name">${esc(p.name || '')}</span></div><div class="hg-say"></div></div></div>
      <div class="hg-price"><span>asking</span><b></b><em></em></div><div class="hg-opts"></div></div></div>`;
    const say = t => { const e = $('.hg-say', ov); if (e) e.innerHTML = G.fmt(t.replace('{p}', G.money(price))); };
    const opts = $('.hg-opts', ov);
    function draw() {
      $('.hg-price b', ov).textContent = G.money(price);
      $('.hg-price em', ov).textContent = G.s.cash < price ? `You have ${G.money(G.s.cash)}. The shop’s account would cover the rest.` : `You have ${G.money(G.s.cash)}.`;
      $('.hg-price span', ov).textContent = final ? 'final price' : 'asking';
      let h = '';
      const pts = (w.obs || []).filter(ob => found[ob.id] && !used[ob.id] && ob.talk !== false);
      if (!final && pts.length) h += `<div class="hg-label">Point something out</div><div class="hg-points">${pts.map(ob => `<button class="chip" data-ob="${ob.id}">${esc(ob.t)}</button>`).join('')}</div>`;
      h += `<div class="hg-label">Or</div><div class="hg-acts">`;
      if (!final) { const a = r50(price * 0.78), b = r50(price * 0.9); if (a < price) h += `<button class="btn small" data-offer="${a}">Offer ${G.money(a)}</button>`; if (b < price && b !== a) h += `<button class="btn small" data-offer="${b}">Offer ${G.money(b)}</button>`; }
      h += `<button class="btn small gold" data-pay="1">Pay ${G.money(price)}</button><button class="btn small ghost" data-walk="1">${esc(o.walkLabel || 'Walk away')}</button></div>`;
      opts.innerHTML = h;
      $$('[data-ob]', opts).forEach(b => b.onclick = () => {
        const id = b.dataset.ob; used[id] = 1; Sound.sfx('click');
        const f = (o.flaws || {})[id];
        if (f) { price = Math.max(floor - 100, price - f.off); floor = Math.max(o.hardFloor || 0, floor - f.off * 0.5); Sound.sfx('good'); say(f.say); }
        else { patience--; Sound.sfx('bad'); say((o.nope || {})[id] || L.nope); if (patience <= 0) { final = true; setTimeout(() => say(L.final), 1500); } }
        draw();
      });
      $$('[data-offer]', opts).forEach(b => b.onclick = () => {
        const offer = +b.dataset.offer; Sound.sfx('click');
        if (offer >= floor) { price = offer; say(L.deal); done(buy(offer)); }
        else { patience--; price = Math.max(r50(floor), r50((offer + price) / 2)); if (patience <= 0) { final = true; say(L.final); } else say(L.counter); draw(); }
      });
      const pb = $('[data-pay]', opts); pb.onclick = () => { Sound.sfx('click'); say(L.pay); done(buy(price)); };
      $('[data-walk]', opts).onclick = () => { Sound.sfx('click'); say(L.walk); done({ bought: false }); };
    }
    function done(res) { opts.innerHTML = `<div class="hg-acts"><button class="btn small" data-ok="1">Continue</button></div>`; $('[data-ok]', opts).onclick = () => { closeGame(); resolve(res); }; }
    say(L.open); draw();
  });
};

/* =====================================================================
   WIND — bring a stopped watch back
   ===================================================================== */
games.wind = function (o) {
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const id = o.watch || 'heirloom', cfg = cfgOf(id), N = o.clicks || 44, st = o.stopped || [4, 17, 22];
    const ov = openGame('wind');
    ov.innerHTML = `<div class="wind"><div class="wind-watch">${Watch.svg(cfg, { vb: vbStr, live: true })}<div class="crown-hit"></div></div>
      <div class="wind-ui"><div class="eyebrow">${esc(o.title || 'Wind it')}</div><p class="wind-say">${G.fmt(o.say || '')}</p><div class="spring"><i></i></div>
      <p class="wind-hint">Drag upward on the watch, stroke after stroke, the way you’d roll the crown between finger and thumb. Or hold <b>W</b>.</p><button class="btn done" style="visibility:hidden">Continue</button></div></div>`;
    const svg = $('svg.watch', ov), bar = $('.spring i', ov), sayEl = $('.wind-say', ov), btn = $('.done', ov), crown = $('.w-crown', svg);
    svg.dataset.run = '0'; svg.dataset.amp = '0'; Watch.setHands(svg, st[0], st[1], st[2]);
    let n = 0, acc = 0, lastY = null, running = false, full = false, keyT = null, dead = false;
    const lines = o.lines || {};
    function setOffset() { const now = new Date(), tgt = new Date(now); tgt.setHours(st[0], st[1], st[2], 0); svg.dataset.off = (tgt - now) / 60000; }
    function clickOnce() {
      if (full || dead) return;
      n++; Sound.sfx('ratchet'); bar.style.width = Math.min(100, n / N * 100) + '%';
      if (crown) { crown.style.transform = `translateY(${n % 2 ? -0.8 : 0.8}px)`; }
      if (lines[n]) sayEl.innerHTML = G.fmt(lines[n]);
      if (!running && n >= (o.startAt || 9)) { running = true; setOffset(); svg.dataset.run = '1'; svg.dataset.amp = '0.45'; Sound.tick(cfg.bph || 18000, 0.25); }
      if (running) { const a = Math.min(1, 0.45 + (n - 9) / (N - 9) * 0.55); svg.dataset.amp = a; Sound.tickVol(0.25 + a * 0.35); }
      if (n >= N) { full = true; sayEl.innerHTML = G.fmt(lines.full || 'The crown pushes back. Full.'); $('.wind-hint', ov).style.visibility = 'hidden'; btn.style.visibility = 'visible'; btn.textContent = o.set === false ? 'Continue' : 'Pull the crown. Set the time.'; }
    }
    const area = $('.wind-watch', ov);
    area.addEventListener('pointerdown', e => { lastY = e.clientY; acc = 0; area.setPointerCapture && area.setPointerCapture(e.pointerId); });
    area.addEventListener('pointermove', e => { if (lastY == null) return; const dy = lastY - e.clientY; lastY = e.clientY; if (dy > 0) { acc += dy; while (acc > 13) { acc -= 13; clickOnce(); } } });
    const up = () => { lastY = null; }; area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
    const kd = e => { if ((e.key === 'w' || e.key === 'W') && !keyT) { clickOnce(); keyT = setInterval(clickOnce, 110); } }, ku = e => { if (e.key === 'w' || e.key === 'W') { clearInterval(keyT); keyT = null; } };
    document.addEventListener('keydown', kd); document.addEventListener('keyup', ku);
    let phase = 0;
    btn.onclick = () => {
      Sound.sfx('click');
      if (phase === 0 && o.set !== false) {
        phase = 1; btn.style.visibility = 'hidden';
        const from = +svg.dataset.off, t0 = performance.now(), dur = 2600;
        // wind the hands forward to the present
        let target = 0; while (target < from) target += 720; const span = (target - from);   // go forwards only
        const step = () => { const k = Math.min(1, (performance.now() - t0) / dur), e2 = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; svg.dataset.off = from + span * e2; if (k < 1) requestAnimationFrame(step); else { svg.dataset.off = 0; sayEl.innerHTML = G.fmt(lines.set || 'Now it tells the right time.'); btn.textContent = 'Continue'; btn.style.visibility = 'visible'; phase = 2; } };
        Sound.sfx('bezel'); requestAnimationFrame(step);
      } else { dead = true; clearInterval(keyT); document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); closeGame(); resolve(); }
    };
  });
};

/* =====================================================================
   REGULATE — the timing machine
   ===================================================================== */
games.regulate = function (o) {
  o = o || {};
  return new Promise(resolve => {
    const two = o.stage === 2;
    if (G.auto) { resolve({ rate: 1.5, beat: 0.1 }); return; }
    const cfg = cfgOf(o.watch || 'heirloom');
    const ov = openGame('reg');
    ov.innerHTML = `<div class="reg"><div class="reg-left"><div class="reg-mov">${Watch.svg(cfg, { view: 'movement', vb: vbStr })}</div><div class="reg-cap">${G.fmt(o.caption || '')}</div></div>
      <div class="reg-right"><div class="eyebrow">${esc(o.eyebrow || 'The timing machine')}</div><h2>${esc(o.title || 'Regulate it')}</h2><p class="reg-intro">${G.fmt(o.intro || '')}</p>
      <div class="tape"><canvas width="640" height="220"></canvas><span class="tl">gaining ↗</span><span class="bl">losing ↘</span></div>
      <div class="reads"><div><span>Rate</span><b class="r-rate"></b></div><div><span>Beat error</span><b class="r-beat"></b></div><div><span>Amplitude</span><b class="r-amp">284°</b></div></div>
      <div class="ctl"><span>Regulator</span><button data-d="-5">◀◀ <u>R</u>etard</button><button data-d="-0.6">◀</button><button data-d="0.6">▶</button><button data-d="5"><u>A</u>vance ▶▶</button></div>
      ${two ? `<div class="ctl"><span>Stud</span><button data-b="-0.45">◀◀</button><button data-b="-0.12">◀</button><button data-b="0.12">▶</button><button data-b="0.45">▶▶</button></div>` : ''}
      <p class="reg-say"></p><button class="btn done" disabled>Not yet</button></div></div>`;
    const cv = $('canvas', ov), c2 = cv.getContext('2d'), Wd = cv.width, Hd = cv.height;
    const svg = $('svg.watch', ov), reg = $('.w-reg', svg);
    let rate = o.start != null ? o.start : 38, beat = two ? (o.beat != null ? o.beat : 1.9) : 0.2, disp = rate, x = 0, y = Hd / 2, dead = false, flip = false, lastDraw = 0;
    const tol = o.tol || (two ? 2 : 3), sayEl = $('.reg-say', ov), btn = $('.done', ov);
    Sound.tick(cfg.bph || 18000, 0.5);
    function paintBg() { c2.fillStyle = '#f3ead2'; c2.fillRect(0, 0, Wd, Hd); c2.strokeStyle = 'rgba(90,70,30,0.13)'; c2.lineWidth = 1; for (let i = 0; i < Wd; i += 32) { c2.beginPath(); c2.moveTo(i + 0.5, 0); c2.lineTo(i + 0.5, Hd); c2.stroke(); } for (let j = 0; j < Hd; j += 22) { c2.beginPath(); c2.moveTo(0, j + 0.5); c2.lineTo(Wd, j + 0.5); c2.stroke(); } }
    paintBg();
    function status() {
      const okR = Math.abs(rate) <= tol, okB = Math.round(beat * 10) / 10 <= 0.3;
      $('.r-rate', ov).textContent = (disp >= 0 ? '+' : '−') + Math.abs(disp).toFixed(1) + ' s/d';
      $('.r-rate', ov).className = 'r-rate' + (Math.abs(disp) <= tol ? ' ok' : '');
      $('.r-beat', ov).textContent = beat.toFixed(1) + ' ms'; $('.r-beat', ov).className = 'r-beat' + (okB ? ' ok' : '');
      const ok = okR && okB; btn.disabled = !ok;
      if (ok) { const a = Math.abs(rate); btn.textContent = a <= 0.7 ? (o.perfect || 'Leave it exactly there') : (o.good || `Good enough: ${(rate >= 0 ? '+' : '−') + a.toFixed(0)} seconds a day`); }
      else btn.textContent = 'Not yet';
      let t;
      if (two && !okB) t = o.sayBeat || 'Two lines: the tick and the tock are landing unevenly. Move the stud until they become one line.';
      else if (rate > tol) t = o.sayFast || 'The line climbs: the watch is gaining. Ease the regulator toward R.';
      else if (rate < -tol) t = o.saySlow || 'The line falls: the watch is losing. Nudge the regulator toward A.';
      else if (Math.abs(rate) > 0.7) t = o.sayNear || 'Nearly flat. This would pass. She would have kept going.';
      else t = o.sayZero || 'A flat line.';
      sayEl.innerHTML = G.fmt(t);
      if (reg) reg.setAttribute('transform', `rotate(${55 - Math.max(-21, Math.min(21, rate * 0.5))})`);
    }
    $$('[data-d]', ov).forEach(b => b.onclick = () => { const d = +b.dataset.d; rate += d + (Math.random() - 0.5) * (Math.abs(d) > 1 ? 1.2 : 0.3); Sound.sfx('ratchet'); status(); });
    $$('[data-b]', ov).forEach(b => b.onclick = () => { const d = +b.dataset.b; beat = Math.abs(beat + d + (Math.random() - 0.5) * 0.05); Sound.sfx('ratchet'); status(); });
    const kd = e => { if (e.key === 'ArrowLeft') { rate -= e.shiftKey ? 5 : 0.6; status(); } if (e.key === 'ArrowRight') { rate += e.shiftKey ? 5 : 0.6; status(); } };
    document.addEventListener('keydown', kd);
    function frame(t) {
      if (dead) return;
      if (t - lastDraw > 30) {
        lastDraw = t; disp += (rate - disp) * 0.08;
        x += 2.1; y -= rate * 0.05;
        if (x > Wd) { x = 0; paintBg(); }
        const wrap = v => ((v % Hd) + Hd) % Hd;
        c2.fillStyle = '#2a2318';
        flip = !flip; const off = flip ? 0 : beat * 15 + 0.0;
        c2.fillRect(x, wrap(y + off + (Math.random() - 0.5) * 1.4), 2.2, 2.2);
        if (Math.random() < 0.1) status();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame); status();
    btn.onclick = () => { dead = true; document.removeEventListener('keydown', kd); Sound.sfx('good'); closeGame(); resolve({ rate, beat }); };
  });
};

/* =====================================================================
   BEZEL — timing a dive
   ===================================================================== */
games.bezel = function (o) {
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const cfg = cfgOf(o.watch), start = o.minute || 17, elapsed = o.elapsed || 23, hr = 10;
    const ov = openGame('bezel');
    ov.innerHTML = `<div class="bz"><div class="bz-watch">${Watch.svg(cfg, { vb: vbStr })}</div>
      <div class="bz-ui"><div class="eyebrow">${esc(o.eyebrow || 'The bezel')}</div><h2>${esc(o.title || 'Mark the dive')}</h2><p class="bz-say"></p>
      <div class="bz-ctl"><button class="btn turn">Turn the bezel ↺</button><button class="btn go" style="display:none"></button></div><div class="bz-q"></div></div></div>`;
    const svg = $('svg.watch', ov), bez = $$('.w-bezel-rot', svg), sayEl = $('.bz-say', ov), turn = $('.turn', ov), go = $('.go', ov), q = $('.bz-q', ov);
    Watch.setHands(svg, hr, start, 12);
    let clicks = 0, rep = null, phase = 'set', overs = 0;
    const L = Object.assign({ set: 'Bring the triangle round to the minute hand.', over: 'Too far, and it will not come back. It only turns one way. Go round again.', marked: 'Marked.', ask: 'How long has he been down?', right: 'Right.', wrong: 'Read where the minute hand points on the bezel.' }, o.lines || {});
    const say = t => { sayEl.innerHTML = G.fmt(t); };
    say(L.set);
    const pipMin = () => ((60 - (clicks % 60)) % 60);
    function one() {
      if (phase !== 'set') return; const was = pipMin();
      clicks++; Sound.sfx('bezel'); bez.forEach(b => b.setAttribute('transform', `rotate(${-clicks * 6})`));
      if (pipMin() === start) { say(L.marked); go.style.display = ''; go.textContent = o.goLabel || 'He goes under'; }
      else { go.style.display = 'none'; if (was === start) { overs++; say(L.over); } }
    }
    turn.addEventListener('pointerdown', () => { one(); clearInterval(rep); rep = setInterval(one, 85); });
    const stop = () => { clearInterval(rep); rep = null; }; window.addEventListener('pointerup', stop);
    go.onclick = () => {
      if (phase !== 'set') return; phase = 'dive'; turn.style.display = 'none'; go.style.display = 'none'; say(o.diveLine || '…'); Sound.sfx('whoosh');
      const t0 = performance.now(), dur = 2600;
      const step = () => { const k = Math.min(1, (performance.now() - t0) / dur); const m = start + elapsed * k; Watch.setHands(svg, hr, m, (k * 600) % 60); if (k < 1) requestAnimationFrame(step); else ask(); };
      requestAnimationFrame(step);
    };
    function ask() {
      phase = 'ask'; say(L.ask);
      const answers = [elapsed, (start + elapsed) % 60, elapsed + 10].sort((a, b) => a - b);
      q.innerHTML = answers.map(a => `<button class="btn small" data-a="${a}">${a} minutes</button>`).join('');
      $$('button', q).forEach(b => b.onclick = () => {
        if (+b.dataset.a === elapsed) { Sound.sfx('good'); say(L.right); q.innerHTML = `<button class="btn small">Continue</button>`; $('button', q).onclick = () => { window.removeEventListener('pointerup', stop); closeGame(); resolve({ overs }); }; }
        else { Sound.sfx('bad'); say(L.wrong); b.disabled = true; }
      });
    }
  });
};

/* =====================================================================
   STAMP — the pad printer
   ===================================================================== */
games.stamp = function (o) {
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const val = v => typeof v === 'function' ? v(G.s) : v;
    const before = val(o.cfg), after = val(o.printed);
    const ov = openGame('stamp');
    ov.innerHTML = `<div class="st"><div class="st-rig"><div class="st-dial">${Watch.svg(before, { crop: 'tight' })}</div><div class="st-pad"><i></i></div><div class="st-arm"></div></div>
      <div class="st-ui"><div class="eyebrow">${esc(o.eyebrow || 'The pad printer')}</div><p class="st-say">${G.fmt(val(o.say) || '')}</p><button class="btn press">${esc(o.button || 'Press')}</button></div></div>`;
    const rig = $('.st-rig', ov), btn = $('.press', ov), sayEl = $('.st-say', ov); let phase = 0;
    btn.onclick = async () => {
      if (phase === 0) {
        phase = 1; btn.disabled = true; Sound.sfx('lift');
        rig.classList.add('down'); await new Promise(r => setTimeout(r, 520));
        Sound.sfx('thup'); $('.st-dial', ov).innerHTML = Watch.svg(after, { crop: 'tight', live: !!o.live });
        await new Promise(r => setTimeout(r, 420));
        rig.classList.remove('down'); rig.classList.add('printed'); Sound.sfx('lift');
        await new Promise(r => setTimeout(r, 800));
        sayEl.innerHTML = G.fmt(val(o.after) || ''); btn.textContent = 'Continue'; btn.disabled = false; phase = 2;
      } else { Sound.sfx('click'); closeGame(); resolve(); }
    };
  });
};

/* =====================================================================
   NAMING — the last interaction of Act I
   ===================================================================== */
games.naming = function (o) {
  o = o || {};
  return new Promise(resolve => {
    if (G.auto) { G.s.brand = 'Calame'; resolve('Calame'); return; }
    const ov = openGame('naming');
    const sug = o.suggest || ['Calame', 'Blanche', 'Petite Seconde', 'La Septième'];
    ov.innerHTML = `<div class="nm"><div class="nm-card"><div class="eyebrow">${esc(o.eyebrow || 'A new page')}</div><p class="nm-say">${G.fmt(o.say || '')}</p>
      <input type="text" maxlength="18" spellcheck="false" autocomplete="off" placeholder="the name">
      <div class="nm-sug">${sug.map(x => `<button class="chip">${esc(x)}</button>`).join('')}</div>
      <p class="nm-note">${G.fmtPlain(o.note || 'Up to eighteen characters. A dial is a small place.')}</p>
      <button class="btn done" disabled>${esc(o.button || 'This is the name')}</button></div></div>`;
    const inp = $('input', ov), btn = $('.done', ov);
    const upd = () => { btn.disabled = !inp.value.trim(); };
    inp.addEventListener('input', upd);
    $$('.chip', ov).forEach(c => c.onclick = () => { inp.value = c.textContent; upd(); Sound.sfx('click'); inp.focus(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled) btn.click(); e.stopPropagation(); });
    setTimeout(() => inp.focus(), 200);
    btn.onclick = () => { const name = inp.value.trim().replace(/\s+/g, ' ').slice(0, 18); G.s.brand = name; G.clearPortraits(); Sound.sfx('click'); closeGame(); resolve(name); };
  });
};

/* =====================================================================
   VOICEMAIL
   ===================================================================== */
games.voicemail = function (o) {
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const ov = openGame('vm');
    ov.innerHTML = `<div class="vm"><div class="phone"><div class="ph-top"><span>Voicemail</span></div>
      <div class="ph-item"><div class="ph-av">G</div><div class="ph-meta"><b>Grand-maman</b><span>${esc(o.when || '23 days ago')} · mobile</span></div><div class="ph-dur">0:41</div></div>
      <div class="ph-bar"><i></i></div><button class="ph-play" aria-label="Play">▶</button></div>
      <div class="vm-text"></div><div class="vm-acts"></div></div>`;
    const text = $('.vm-text', ov), acts = $('.vm-acts', ov), play = $('.ph-play', ov), bar = $('.ph-bar i', ov);
    if (o.mode === 'play') {
      let started = false;
      play.onclick = async () => {
        if (started) return; started = true; play.classList.add('playing'); play.textContent = '❚❚'; Sound.sfx('beep');
        const lines = o.lines || [], per = lines.map(l => Math.max(2200, 900 + l.length * 62)), total = per.reduce((a, b) => a + b, 0);
        bar.style.transition = `width ${total}ms linear`; requestAnimationFrame(() => { bar.style.width = '100%'; });
        for (let i = 0; i < lines.length; i++) { const p = el('p', '', G.fmt(lines[i])); text.appendChild(p); requestAnimationFrame(() => p.classList.add('on')); text.scrollTop = text.scrollHeight; await new Promise(r => setTimeout(r, per[i])); }
        play.textContent = '▶'; play.classList.remove('playing'); Sound.sfx('beep');
        acts.innerHTML = `<button class="btn small">${esc(o.done || 'End of message')}</button>`; $('button', acts).onclick = () => { closeGame(); resolve(); };
      };
      if (o.intro) { text.innerHTML = `<p class="on hint">${G.fmt(o.intro)}</p>`; play.addEventListener('click', () => { const h = $('.hint', text); if (h) h.remove(); }, { once: true }); }
    } else {
      const tries = o.tries || ['Your thumb stops a centimetre above the glass.', 'Forty-one seconds. You have had twenty-three days to find forty-one seconds.'];
      let n = 0;
      text.innerHTML = `<p class="on">${G.fmt(o.intro || '')}</p>`;
      const later = () => { acts.innerHTML = `<button class="btn small">${esc(o.done || 'Not yet')}</button>`; $('button', acts).onclick = () => { Sound.sfx('soft'); closeGame(); resolve(); }; };
      play.onclick = () => { Sound.sfx('soft'); play.classList.add('shake'); setTimeout(() => play.classList.remove('shake'), 400); const p = el('p', '', G.fmt(tries[Math.min(n, tries.length - 1)])); if (n < tries.length) { text.appendChild(p); requestAnimationFrame(() => p.classList.add('on')); } n++; if (n >= 1) later(); };
      setTimeout(later, 6000);
    }
  });
};

/* =====================================================================
   TITLE DROP / CHAPTER CARD / TRAVEL
   ===================================================================== */
games.titledrop = function (o) {
  o = o || {};
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const ov = openGame('title');
    ov.innerHTML = `<div class="td"><div class="td-t">${'UNSIGNED'.split('').map((c, i) => `<span style="animation-delay:${i * 120}ms">${c}</span>`).join('')}</div><div class="td-s">${esc(o.sub || 'Act I · The Empty Roll')}</div></div>`;
    let ok = false; setTimeout(() => { ok = true; ov.classList.add('ready'); }, 2600);
    ov.onclick = () => { if (!ok) return; ov.onclick = null; ov.classList.add('out'); setTimeout(() => { closeGame(); resolve(); }, 900); };
  });
};
games.chapter = function (st) {
  return new Promise(resolve => {
    if (G.auto) { resolve(); return; }
    const ov = openGame('chapter');
    ov.innerHTML = `<div class="ch"><div class="ch-n">${esc(st.num)}</div><div class="ch-t">${esc(st.title)}</div>${st.sub ? `<div class="ch-s">${esc(st.sub)}</div>` : ''}</div>`;
    Sound.sfx('bell');
    let done = false; const fin = () => { if (done) return; done = true; ov.classList.add('out'); setTimeout(() => { closeGame(); resolve(); }, 800); };
    setTimeout(() => { ov.onclick = fin; }, 900); setTimeout(fin, 4200);
  });
};

const CITY = {
  montreal: { n: 'Montréal', off: -5 }, london: { n: 'London', off: 0 }, paris: { n: 'Paris', off: 1 }, marseille: { n: 'Marseille', off: 1 },
  newyork: { n: 'New York', off: -5 }, tokyo: { n: 'Tokyo', off: 9 }, suwa: { n: 'Suwa', off: 9 }, hongkong: { n: 'Hong Kong', off: 8 }, chaux: { n: 'La Chaux-de-Fonds', off: 1, ring: 'CHX-DE-FDS' }
};
const RING = { 0: 'LONDON', 1: 'PARIS', 2: 'CAIRO', 3: 'MOSCOW', 4: 'DUBAI', 5: 'KARACHI', 6: 'DHAKA', 7: 'BANGKOK', 8: 'HONG KONG', 9: 'TOKYO', 10: 'SYDNEY', 11: 'NOUMÉA', 12: 'AUCKLAND', '-11': 'MIDWAY', '-10': 'HONOLULU', '-9': 'ALASKA', '-8': 'L. ANGELES', '-7': 'DENVER', '-6': 'CHICAGO', '-5': 'NEW YORK', '-4': 'CARACAS', '-3': 'RIO', '-2': 'S. GEORGIA', '-1': 'AZORES' };
games.travel = function (to, o) {
  return new Promise(resolve => {
    const from = G.s.city || 'montreal', A = CITY[from], B = CITY[to]; G.s.city = to;
    if (G.auto) { if (o.cost) { G.s.cash -= o.cost; G.s.flags.cashOn = 1; } resolve(); return; }
    const ov = openGame('travel');
    const ring = Object.assign({}, RING); ring[A.off] = (A.ring || A.n).toUpperCase(); ring[B.off] = (B.ring || B.n).toUpperCase();
    const ang = off => ((off % 24) + 24) % 24 * 15;
    let s = `<svg viewBox="-260 -260 520 520" class="wt"><defs><radialGradient id="wtg" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stop-color="#f7f1df"/><stop offset="1" stop-color="#d9cfb4"/></radialGradient></defs>`;
    s += `<circle r="252" fill="#b8944e"/><circle r="246" fill="#1a2a25"/><g class="wt-ring" style="transform:rotate(${-ang(A.off)}deg)">`;
    Object.keys(ring).forEach(k => { const a = ang(+k), hl = (+k === B.off) ? ' class="dest"' : (+k === A.off ? ' class="orig"' : ''); s += `<text${hl} transform="rotate(${a}) translate(0,-213)" text-anchor="middle" font-size="${ring[k].length > 8 ? 8.4 : ring[k].length > 6 ? 9.4 : 10.5}">${ring[k]}</text><line x1="0" y1="-190" x2="0" y2="-183" transform="rotate(${a + 7.5})" stroke="#c9a35a" stroke-width="1"/>`; });
    s += `</g><circle r="180" fill="url(#wtg)"/><path d="M-180,0A180,180 0 0 0 180,0Z" fill="#22344e" opacity="0.92"/><g class="wt-24">`;
    for (let h = 1; h <= 24; h++) { const a = h * 15, night = h < 6 || h > 18; s += `<text class="${night ? 'nt' : 'dy'}" transform="rotate(${a + 180}) translate(0,-156)" text-anchor="middle" font-size="15">${h}</text>`; }
    s += `</g><circle r="132" fill="#16241f" stroke="#c9a35a" stroke-width="1.5"/><path d="M0,-252l-9,-16h18z" fill="#c9a35a" transform="translate(0,22)"/></svg>`;
    const diff = B.off - A.off;
    const rel = diff === 0 ? 'the same hour as ' + A.n : `${Math.abs(diff)} hour${Math.abs(diff) === 1 ? '' : 's'} ${diff > 0 ? 'ahead of' : 'behind'} ${A.n}`;
    ov.innerHTML = `<div class="tr"><div class="tr-dial">${s}<div class="tr-centre"><div class="tr-from">${esc(A.n)}</div><div class="tr-arrow">↓</div><div class="tr-to">${esc(B.n)}</div></div></div><div class="tr-cap"><div class="tr-rel">${esc(rel)}</div>${o.note ? `<div class="tr-note">${G.fmt(o.note)}</div>` : ''}${o.cost ? `<div class="tr-cost">${G.money(-o.cost).replace('−', '− ')}</div>` : ''}</div></div>`;
    Sound.sfx('whoosh');
    let d = ang(B.off) - ang(A.off); if (d > 180) d -= 360; if (d < -180) d += 360;
    const steps = Math.abs(Math.round(d / 15));
    setTimeout(() => { const r = $('.wt-ring', ov); if (r) r.style.transform = `rotate(${-(ang(A.off) + d)}deg)`; for (let i = 0; i < steps; i++) Sound.sfx('bezel', 0.1 + i * (1.9 / Math.max(1, steps))); }, 500);
    if (o.cost) setTimeout(() => { G.s.cash -= o.cost; G.s.flags.cashOn = 1; G.setHud(); }, 800);
    let done = false; const fin = () => { if (done) return; done = true; ov.classList.add('out'); setTimeout(() => { closeGame(); resolve(); }, 700); };
    setTimeout(() => { ov.classList.add('ready'); ov.onclick = fin; }, 2800);
  });
};

/* =====================================================================
   ENDING — the last screen of the act
   ===================================================================== */
games.ending = function (o) {
  return new Promise(() => {
    if (G.auto) { G.ended = true; return; }
    const L = window.Lineage, total = L ? L.nodes.filter(n => !n.act2).length : 0, got = L ? L.nodes.filter(n => G.s.nodes[n.id] && !n.act2).length : 0;
    const words = Object.keys(G.s.terms).length, seen = Object.keys(G.s.obs).reduce((a, k) => a + Object.keys(G.s.obs[k]).length, 0);
    const SIS = { field: 'cymaA', dress: 'coremontA', diver: 'enicarA', chrono: 'chronoA', quartz: 'seikoQR', gmt: 'airmanA' };
    const right = Object.keys(SIS).filter(k => G.s.roll[k] === SIS[k]).length;
    const mai = right === 6 ? 'Six sisters for six pockets. She would have pretended not to be impressed.' : right >= 4 ? `${right} true sisters and ${6 - right} standing in. Better than my first roll. Swap them when you can; the dealers said they would wait.` : `${right} true sisters; the rest are holding the pockets open. That is how every collection starts. You know where the right ones are now.`;
    const ov = openGame('ending');
    let roll = '';
    G.slots.forEach(sl => { const wid = G.s.roll[sl.id]; roll += `<div class="e-slot">${wid ? G.watchSvg(wid, { live: sl.id === 'seven' }) : '<div class="empty"></div>'}<span>${sl.num}</span></div>`; });
    ov.innerHTML = `<div class="end"><div class="e-eyebrow">End of Act I</div><h1>The Empty Roll</h1>
      <div class="e-roll">${roll}</div>
      <p class="e-mai"><b>Mai</b>, by text: “${mai}”</p>
      <div class="e-stats"><div><b>${got}</b><span>of ${total} watches traced in the lineage</span></div><div><b>${seen}</b><span>details noticed under the loupe</span></div><div><b>${words}</b><span>words learned</span></div><div><b>${G.money(G.s.cash)}</b><span>${G.s.cash < 0 ? 'owed to the shop' : 'left in your pocket'}</span></div></div>
      <div class="e-next"><div class="e-eyebrow">Act II</div><h2>The Name on the Dial</h2><p>${G.fmtPlain(o && o.tease || '')}</p></div>
      <div class="e-acts"><button class="btn small" data-a="roll">Open the roll</button><button class="btn small" data-a="lineage">Open the lineage</button><button class="btn small" data-a="carnet">Open the carnet</button><button class="btn small ghost" data-a="again">Start over</button></div>
      <p class="e-fine">Act II is not built yet. Your save is kept, so the story can pick up from here.</p></div>`;
    Sound.music('home');
    $$('[data-a]', ov).forEach(b => b.onclick = async () => {
      const a = b.dataset.a;
      if (a === 'again') { if (confirm('Erase this playthrough and return to the title?')) { G.wipe(); location.reload(); } return; }
      G.modal = false; await G.openPanel(a, { force: true }); G.modal = true;
    });
  });
};
})();
