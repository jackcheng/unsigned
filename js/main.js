/* UNSIGNED — boot and title screen */
(function () {
'use strict';
const G = window.G, $ = G.$, $$ = G.$$;
const FIRST = 'pro_cold';

function begin(scene, resume) {
  const ov = $('#overlay');
  Sound.init();
  ov.classList.add('out');
  setTimeout(() => {
    ov.className = ''; ov.innerHTML = ''; G.modal = false;
    if (resume) G.restoreStage(); else { G.setBg(null, null, true); G.setHud('', ''); }
    G.run(scene).catch(e => { console.error(e); });
  }, 800);
}

function title() {
  Watch.start();
  const ov = $('#overlay'); ov.className = 'on g-start'; G.modal = true;
  const saved = G.load();
  const ok = saved && saved.scene && G.scenes[saved.scene];
  ov.innerHTML = `<div class="start"><div class="start-watch">${Watch.svg(G.heirloomCfg(ok ? saved : null), { live: true, vb: '-150 -200 300 400' })}</div>
    <div class="start-text"><h1>UNSIGNED</h1><p class="tag">A game about watches, and the people nobody put on the dial.</p><div class="act">Act I · The Empty Roll</div>
    <div class="start-btns">${ok ? '<button class="btn gold" data-a="cont">Continue</button>' : ''}<button class="btn${ok ? '' : ' gold'}" data-a="new">${ok ? 'Begin again' : 'Begin'}</button></div>
    <p class="start-fine">About ninety minutes. It saves by itself. Best with sound.<br>Click, or press <b>Space</b>, to go on. Underlined words can be clicked.</p><button class="linkbtn" data-a="code">Have a save code?</button></div></div>`;
  $$('[data-a]', ov).forEach(b => b.onclick = () => {
    if (b.dataset.a === 'code') return paste();
    if (b.dataset.a === 'cont') { G.s = saved; if (!G.s.news) G.s.news = { nodes: {}, terms: {}, pages: {}, roll: {} }; begin(saved.scene, true); }
    else { if (ok && !confirm('Start again from the beginning? Your saved game will be replaced.')) return; G.wipe(); G.s = G.fresh(); begin(FIRST, false); }
  });
}

function paste() {
  const box = $('.start-text', $('#overlay'));
  const had = G.load() && G.load().scene;
  box.innerHTML = `<h2 class="paste-h">Have a save code?</h2><p class="codenote">Paste the code you copied from <i>Menu → Save code</i>.${had ? ' It will replace the game saved here.' : ''}</p>
    <textarea class="codebox" rows="4" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="UNSIGNED1.…"></textarea>
    <p class="codeerr"></p>
    <div class="codeacts"><button class="btn gold" data-a="load">Load it</button><button class="btn" data-a="back">Back</button></div>`;
  const ta = $('.codebox', box), err = $('.codeerr', box);
  $('[data-a="back"]', box).onclick = () => title();
  $('[data-a="load"]', box).onclick = () => {
    if (G.useCode(ta.value)) { title(); return; }
    err.textContent = ta.value.trim() ? 'That code didn’t work. Check it was copied whole, from UNSIGNED1. to the end.' : 'Paste the code into the box first.';
  };
}

/* ?scene=id jumps straight to a scene with a plausible mid-game state (for testing) */
function dev(scene) {
  Watch.start();
  G.s = G.fresh();
  const q = new URLSearchParams(location.search);
  G.s.cash = +(q.get('cash') || 6000); G.s.hudOn = true; G.s.tools = { carnet: 1, roll: 1, lineage: 1 }; G.s.flags.cashOn = 1; G.s.flags.serviced = 1;
  G.s.roll.seven = 'heirloom'; G.s.pages.letter = 1; G.s.facts = [];
  (q.get('roll') || '').split(',').filter(Boolean).forEach(kv => { const p = kv.split(':'); G.s.roll[p[0]] = p[1]; G.s.pages[p[0]] = 1; });
  (q.get('flags') || '').split(',').filter(Boolean).forEach(k => { G.s.flags[k] = 1; });
  if (q.get('auto')) G.auto = true;
  document.addEventListener('click', () => Sound.init(), { once: true });
  G.setBg(null, null, true); G.setHud('', '');
  G.run(scene).catch(e => { console.error(e); });
}

document.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search), sc = q.get('scene');
  if (sc && G.scenes[sc]) dev(sc); else title();
});
})();
