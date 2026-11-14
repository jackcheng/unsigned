/* UNSIGNED — the chapter list: start from any scene, for playtesting.
   Nothing here stores a state per scene. To start at a scene, the story before it is played through silently
   (the same automatic play the test scripts use: every topic asked, the first answer chosen, each watch looked over
   and bought), and the game opens on what that leaves: the roll, the carnet, the money, the words learned.
   So the list keeps up with the script by itself. A new scene appears under its chapter with no work here;
   give it a nicer name in NAMES if the place name is not enough. */
(function () {
'use strict';
const G = window.G, $ = G.$, $$ = G.$$, esc = G.esc;
const KEY = 'unsigned.chapters', ASK = 'unsigned.chapters.open';

/* scene id -> the name shown in the list */
const NAMES = {
  pro_cold: 'The message', pro_shop: 'The shop, and her watch', pro_roll: 'The empty roll', pro_mai: 'Mai at the bench',
  lon_arrive: 'Portobello Road', lon_peg: 'Peg’s trench watch', lon_three: 'Three field watches', lon_after: 'The first pocket',
  par_arrive: 'The Puces de Saint-Ouen', par_two: 'Two Corémonts', par_after: 'The second pocket',
  mar_arrive: 'The Vallon des Auffes', mar_tin: 'The biscuit tin', mar_after: 'The third pocket',
  ny_arrive: 'West 47th Street', ny_three: 'Three chronographs', ny_auction: 'The auction',
  tok_arrive: 'Nakano Broadway', tok_suwa: 'Lake Suwa', tok_memory: 'March 1967',
  hk_arrive: 'Tsim Sha Tsui', hk_factory: 'The case factory',
  jura_arrive: 'La Chaux-de-Fonds', jura_yvette: 'Yvette’s rooms', jura_attic: 'The attic', jura_letter: 'The letter',
  jura_voice: 'The last message', jura_name: 'The name', act_end: 'The end of the act'
};
/* what there is to do in a scene, said in a word */
const DOES = { voicemail: 'message', inspect: 'loupe', wind: 'winding', regulate: 'regulating', haggle: 'haggling', bezel: 'bezel', stamp: 'stamping', naming: 'naming', settime: 'setting', listing: 'listing', ending: 'last screen' };

/* ---- shown or hidden ----
   Shown when the game runs from a file or from this computer; hidden on the published game,
   until five taps on the act line of the title, or ?chapters=1 in the address (?chapters=0 hides it). The choice is remembered. */
const get = (store, k) => { try { return store.getItem(k); } catch (e) { return null; } };
const put = (store, k, v) => { try { if (v == null) store.removeItem(k); else store.setItem(k, v); } catch (e) {} };
const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|.*\.local)$/.test(location.hostname);
let mem = null;
const C = G.chapters = {
  on() { const v = mem != null ? mem : get(localStorage, KEY); return v === '1' || (v == null && local); },
  set(v) { mem = v ? '1' : '0'; put(localStorage, KEY, mem); },
  /* the menu asks for the list, then reloads to the title: remember the request across the reload */
  ask() { put(sessionStorage, ASK, '1'); },
  asked() { const v = get(sessionStorage, ASK) === '1'; put(sessionStorage, ASK, null); return v; }
};

/* ---- the list, read off the scenes themselves ---- */
function walk(st, fn) {
  if (!st) return;
  if (Array.isArray(st)) { st.forEach(x => walk(x, fn)); return; }
  if (typeof st !== 'object') return;
  fn(st); walk(st.then, fn); walk(st.opts, fn); if (st.k === 'if') { walk(st.a, fn); walk(st.b, fn); }
}
C.list = function () {
  const groups = []; let cur = null;
  Object.keys(G.scenes).forEach(id => {
    const steps = G.scenes[id] || [], ch = steps.find(s => s && s.k === 'chapter');
    if (ch) { cur = { num: ch.num, title: ch.title, sub: ch.sub, scenes: [] }; groups.push(cur); }
    else if (!cur) { cur = { num: 'Prologue', title: 'Horlogerie Calame', sub: 'Montréal', scenes: [] }; groups.push(cur); }
    const does = [], hud = steps.find(s => s && s.k === 'hud' && s.place);
    walk(steps, s => { const d = s.k === 'game' ? DOES[s.name] : s.k === 'slot' ? 'the roll' : null; if (d && does.indexOf(d) < 0) does.push(d); });
    cur.scenes.push({ id, name: NAMES[id] || (hud ? String(hud.place).split(' · ')[0] : id), does: does.join(' · ') });
  });
  return groups;
};

/* ---- play silently up to a scene; resolves with the game as it stands when that scene opens ---- */
C.reach = function (id, first) {
  return new Promise((resolve, reject) => {
    const was = { s: G.s, snap: G.snap, log: G.log };
    let over = false;
    const end = err => {
      if (over) return; over = true; clearTimeout(timer);
      const at = G.s && G.s.scene, snap = G.snap;
      G.auto = false; G.stopAt = null;
      if (!err && at !== id) err = new Error('The story ended before it reached that scene.');
      if (err) { err.at = at; G.s = was.s; G.snap = was.snap; G.log = was.log; reject(err); }
      else resolve(snap);
    };
    const timer = setTimeout(() => end(new Error('The story stopped and would not go on by itself.')), 20000);
    G.s = G.fresh(); G.log = []; G.last = null; G.ended = false; G.clearPortraits();
    G.auto = true; G.stopAt = id;
    G.run(first || Object.keys(G.scenes)[0]).then(() => end(), e => end(e instanceof Error ? e : new Error(String(e && e.message || e))));
  });
};

/* ---- the screen ---- */
C.open = function (ov, back, start) {
  const saved = G.load(), here = saved && saved.scene;
  let h = `<div class="chap"><div class="chap-head"><div><h2>Chapters</h2>
    <p class="chap-note">Start from any scene. The story before it is played through for you (every question asked, the first answer given each time), so the roll, the carnet and the money are as that leaves them.${here ? ' Starting from here replaces the saved game.' : ''}</p></div>
    <button class="btn" data-a="back">Back</button></div><p class="chap-err"></p><div class="chap-grid">`;
  C.list().forEach(g => {
    h += `<section><div class="chap-n">${esc(g.num)}</div><h3>${esc(g.title)}</h3><div class="chap-c">${esc(g.sub || '')}</div>`;
    g.scenes.forEach(sc => { h += `<button class="chap-s${sc.id === here ? ' here' : ''}" data-s="${esc(sc.id)}"><span>${esc(sc.name)}</span>${sc.does || sc.id === here ? `<small>${sc.id === here ? 'saved here' + (sc.does ? ' · ' : '') : ''}${esc(sc.does)}</small>` : ''}</button>`; });
    h += `</section>`;
  });
  h += `</div></div>`;
  ov.className = 'on g-start g-chap'; ov.scrollTop = 0; ov.innerHTML = h; G.modal = true;
  const err = $('.chap-err', ov), btns = $$('.chap-s', ov);
  let failed = false;
  $('[data-a="back"]', ov).onclick = () => { if (failed) location.reload(); else back(); };
  btns.forEach(b => b.onclick = () => {
    if (failed) return;
    btns.forEach(x => { x.disabled = true; }); b.classList.add('going');
    const id = b.dataset.s;
    // let the pressed row paint before the story runs
    setTimeout(() => C.reach(id).then(snap => start(id, snap), e => {
      console.error(e); failed = true; b.classList.remove('going');
      err.textContent = `Couldn’t get there. ${e.message}${e.at ? ` It stopped in the scene “${NAMES[e.at] || e.at}”.` : ''} Back returns to the title.`;
      ov.scrollTop = 0;
    }), 30);
  });
};
})();
