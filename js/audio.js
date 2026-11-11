/* UNSIGNED — sound. Everything is synthesised with WebAudio: no audio files. */
(function () {
'use strict';
const A = { on: true, ready: false, vol: 0.8 };
let ctx, master, tickBus, sfxBus, musBus, noise, delay;
let tickRate = 0, tickVol = 0, tickNext = 0, tickFlip = false, tickTimer = null, tickKind = 'mech';
let musTimer = null, mood = null, drone = [];

function init() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  try { ctx = new AC(); } catch (e) { return; }
  master = ctx.createGain(); master.gain.value = A.on ? A.vol : 0; master.connect(ctx.destination);
  tickBus = ctx.createGain(); tickBus.gain.value = 1; tickBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
  musBus = ctx.createGain(); musBus.gain.value = 0.55;
  // a soft echo for the music
  delay = ctx.createDelay(1.5); delay.delayTime.value = 0.46;
  const fb = ctx.createGain(); fb.gain.value = 0.34;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
  musBus.connect(master); musBus.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
  const len = ctx.sampleRate * 1;
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  A.ready = true;
  tickTimer = setInterval(schedule, 40);
  if (mood) startMusic();
}
A.init = init;
function applyGain() { if (master) master.gain.setTargetAtTime(A.on ? A.vol : 0, ctx.currentTime, 0.05); }
A.toggle = function () { A.on = !A.on; applyGain(); try { localStorage.setItem('unsigned.sound', A.on ? '1' : '0'); } catch (e) {} return A.on; };
A.setVol = function (v) { A.vol = Math.max(0, Math.min(1, v)); applyGain(); try { localStorage.setItem('unsigned.volume', String(A.vol)); } catch (e) {} };
try { if (localStorage.getItem('unsigned.sound') === '0') A.on = false; const v = parseFloat(localStorage.getItem('unsigned.volume')); if (v >= 0 && v <= 1) A.vol = v; } catch (e) {}

function burst(t, freq, q, vol, dur, bus, type) {
  const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.0015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(bus || sfxBus); src.start(t, Math.random() * 0.9); src.stop(t + dur + 0.02);
}
function tone(t, freq, vol, dur, bus, type, attack) {
  const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus || sfxBus); o.start(t); o.stop(t + dur + 0.05);
  return o;
}

/* ---- ticking ---- */
function schedule() {
  if (!ctx || !tickRate || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  if (tickNext < now) tickNext = now + 0.02;
  while (tickNext < now + 0.12) {
    const v = tickVol * (0.85 + Math.random() * 0.3);
    if (tickKind === 'quartz') { burst(tickNext, 1500, 2.2, v * 0.7, 0.05, tickBus); tone(tickNext, 190, v * 0.25, 0.05, tickBus); }
    else {
      burst(tickNext, tickFlip ? 4600 : 3500, 4, v, 0.022, tickBus);
      burst(tickNext + 0.006, tickFlip ? 7200 : 6100, 6, v * 0.5, 0.012, tickBus);
    }
    tickFlip = !tickFlip; tickNext += 1 / tickRate;
  }
}
/* bph: beats per hour (18000, 21600, 28800, 36000) or 'quartz'; vol 0..1 */
A.tick = function (bph, vol) {
  if (!bph) { tickRate = 0; return; }
  tickKind = bph === 'quartz' ? 'quartz' : 'mech';
  tickRate = bph === 'quartz' ? 1 : bph / 3600; tickVol = (vol == null ? 0.5 : vol) * 0.32;
  if (ctx) tickNext = Math.max(tickNext, ctx.currentTime + 0.03);
};
A.tickVol = function (vol) { tickVol = vol * 0.32; };

/* ---- one-shot effects ---- */
const SFX = {
  click(t) { burst(t, 2400, 2, 0.3, 0.03); },
  soft(t) { burst(t, 900, 1.2, 0.2, 0.05); },
  page(t) { burst(t, 1900, 0.7, 0.08, 0.22, null, 'highpass'); burst(t + 0.09, 3200, 0.9, 0.07, 0.16); },
  ratchet(t) { burst(t, 3000, 5, 0.45, 0.02); burst(t + 0.012, 5200, 7, 0.2, 0.012); },
  bezel(t) { burst(t, 2100, 6, 0.5, 0.025); tone(t, 320, 0.05, 0.03); },
  note(t) { tone(t, 1318.5, 0.07, 0.5); tone(t + 0.07, 1975.5, 0.05, 0.6); },
  good(t) { tone(t, 784, 0.07, 0.5); tone(t + 0.1, 1174.7, 0.06, 0.6); tone(t + 0.2, 1568, 0.05, 0.9); },
  bad(t) { tone(t, 196, 0.07, 0.3, null, 'triangle'); tone(t + 0.02, 185, 0.055, 0.35, null, 'triangle'); },
  coin(t) { tone(t, 2637, 0.05, 0.25); tone(t + 0.05, 3520, 0.05, 0.4); burst(t, 6000, 3, 0.05, 0.04); },
  thup(t) { tone(t, 110, 0.13, 0.16, null, 'sine', 0.008); burst(t, 380, 0.9, 0.1, 0.09, null, 'lowpass'); },
  lift(t) { burst(t, 1200, 0.6, 0.06, 0.25, null, 'highpass'); },
  whoosh(t) { const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(1800, t + 0.5); f.frequency.exponentialRampToValueAtTime(260, t + 1.3); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); src.connect(f); f.connect(g); g.connect(sfxBus); src.start(t); src.stop(t + 1.5); },
  bell(t) { [523.25, 1046.5, 1569.7].forEach((f, i) => tone(t, f, 0.06 / (i + 1), 2.2)); },
  chime(t) { [659.25, 830.6, 987.8].forEach((f, i) => tone(t + i * 0.16, f, 0.05, 1.6, musBus)); },
  gavel(t) { tone(t, 150, 0.16, 0.12, null, 'triangle'); burst(t, 900, 1.5, 0.1, 0.05); },
  phone(t) { [0, 0.16].forEach(d => { tone(t + d, 880, 0.06, 0.1, null, 'triangle'); tone(t + d, 1108, 0.06, 0.1, null, 'triangle'); }); },
  beep(t) { tone(t, 1000, 0.05, 0.25, null, 'sine'); },
  snip(t) { burst(t, 5200, 3, 0.25, 0.03); },
  open(t) { burst(t, 500, 0.8, 0.3, 0.18, null, 'lowpass'); burst(t + 0.12, 2600, 2, 0.06, 0.05); }
};
A.sfx = function (name, delayS) {
  if (!ctx || ctx.state !== 'running') return;
  const f = SFX[name]; if (f) f(ctx.currentTime + (delayS || 0) + 0.005);
};

/* ---- generative ambience: sparse bells over a quiet drone ---- */
const MOODS = {
  home:    { root: 146.83, scale: [0, 2, 4, 7, 9, 12, 14, 16], gap: [2.6, 5.2], vol: 0.05 },
  rain:    { root: 130.81, scale: [0, 3, 5, 7, 10, 12, 15], gap: [2.8, 5.5], vol: 0.045 },
  gilt:    { root: 164.81, scale: [0, 2, 3, 7, 9, 12, 14], gap: [2.4, 4.6], vol: 0.045 },
  sea:     { root: 174.61, scale: [0, 2, 4, 7, 9, 11, 14, 16], gap: [2.2, 4.4], vol: 0.05 },
  city:    { root: 138.59, scale: [0, 3, 5, 7, 10, 12, 14], gap: [2.0, 4.0], vol: 0.045 },
  still:   { root: 155.56, scale: [0, 2, 5, 7, 9, 12, 14], gap: [3.4, 6.8], vol: 0.05 },
  neon:    { root: 123.47, scale: [0, 2, 5, 7, 10, 12, 14], gap: [2.2, 4.2], vol: 0.045 },
  snow:    { root: 146.83, scale: [0, 2, 3, 7, 8, 12, 14, 15], gap: [3.0, 6.0], vol: 0.05 },
  memory:  { root: 196.00, scale: [0, 2, 4, 7, 9, 12], gap: [1.8, 3.6], vol: 0.05 }
};
function stopDrone() { drone.forEach(n => { try { n.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 1.2); n.o.stop(ctx.currentTime + 5); } catch (e) {} }); drone = []; }
function startMusic() {
  if (!ctx) return;
  clearTimeout(musTimer); stopDrone();
  const m = MOODS[mood]; if (!m) return;
  [1, 1.5, 2.005].forEach((k, i) => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = m.root * k / 2;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(m.vol * (i === 0 ? 0.5 : 0.22), ctx.currentTime, 2.5);
    o.connect(g); g.connect(musBus); o.start(); drone.push({ o, g });
  });
  const play = () => {
    if (!MOODS[mood]) return; const mm = MOODS[mood];
    if (ctx.state === 'running') {
      const t = ctx.currentTime + 0.05, deg = mm.scale[Math.floor(Math.random() * mm.scale.length)];
      const f = mm.root * 2 * Math.pow(2, deg / 12);
      tone(t, f, mm.vol, 3.4, musBus, 'sine', 0.02); tone(t, f * 2.01, mm.vol * 0.22, 1.6, musBus, 'sine', 0.01);
      if (Math.random() < 0.3) { const d2 = mm.scale[Math.floor(Math.random() * mm.scale.length)]; tone(t + 0.35, mm.root * 2 * Math.pow(2, d2 / 12), mm.vol * 0.7, 3, musBus, 'sine', 0.02); }
    }
    musTimer = setTimeout(play, (mm.gap[0] + Math.random() * (mm.gap[1] - mm.gap[0])) * 1000);
  };
  musTimer = setTimeout(play, 1200);
}
A.music = function (name) {
  if (name === mood) return; mood = name || null;
  if (!ctx) return;
  if (!mood) { clearTimeout(musTimer); stopDrone(); return; }
  startMusic();
};

window.Sound = A;
})();
