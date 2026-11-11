/* UNSIGNED — data: people, watches (with what the loupe finds), the roll, the carnet, the glossary. */
(function () {
'use strict';
const G = window.G;
const at = (deg, r) => [+(r * Math.sin(deg * Math.PI / 180)).toFixed(3), +(-r * Math.cos(deg * Math.PI / 180)).toFixed(3)];
const LN = (id, extra) => { const n = (window.Lineage ? Lineage.nodes : []).find(x => x.id === id); return Watch.merge(n ? n.cfg : {}, extra || {}); };

/* =====================================================================
   PEOPLE — everyone is introduced by their wrist
   ===================================================================== */
G.people = {
  lou:      { name: 'Lou', watch: 'heirloom', wrist: { skin: '#c9a084', sleeve: '#34424e', knit: true } },
  claire:   { name: 'Claire', role: 'your mother', watch: s => (s.flags.claireWears && s.roll.dress) || 'none', wrist: { skin: '#cfa78c', sleeve: '#7a2f3a', sleeveAt: 0.9 } },
  mai:      { name: 'Mai', role: 'watchmaker — your grandmother’s only apprentice', watch: 'w_mai', wrist: { skin: '#d3a77f', sleeve: '#2c3a36' } },
  gaspard:  { name: 'Gaspard Jacot', role: 'dealer, Geneva', watch: 'w_gaspard', wrist: { skin: '#dcbfa3', sleeve: '#1b202c', cuff: '#f4f3ef' } },
  peg:      { name: 'Peg', role: 'stallholder, Portobello Road, since 1971', watch: 'w_peg', wrist: { skin: '#e4c6b2', sleeve: '#4f5436', knit: true } },
  dane:     { name: 'The lad two stalls down', watch: 'w_dane', wrist: { skin: '#e0b89c', sleeve: '#16181c' } },
  ines:     { name: 'Inès', role: 'dealer, Marché Vernaison', watch: 'w_ines', wrist: { skin: '#b88a69', sleeve: '#141414' } },
  marius:   { name: 'Marius', role: 'saturation diver, retired', watch: 'w_marius', wrist: { skin: '#b07a55' } },
  lola:     { name: 'Lola', role: 'dealer, West 47th Street', watch: 'w_lola', wrist: { skin: '#a97350', sleeve: '#3a2b55' } },
  auction:  { name: 'The auctioneer' },
  aiko:     { name: 'Aiko', role: 'sells vintage Seiko in Nakano; his granddaughter', watch: 'w_aiko', wrist: { skin: '#e2c2a2', sleeve: '#c9c2b2', knit: true } },
  sakamoto: { name: 'Mr. Sakamoto', role: 'regulator, Suwa Seikosha, retired', watch: 'w_sakamoto', wrist: { skin: '#d6b491', sleeve: '#4b505c', cuff: '#e9e7e1' } },
  wing:     { name: 'Uncle Wing', role: 'dealer, Tsim Sha Tsui', watch: 'w_wing', wrist: { skin: '#cfa47d', sleeve: '#262626', cuff: '#dedbd2' } },
  kit:      { name: 'Kit', role: 'third generation of a case factory', watch: 'w_kit', wrist: { skin: '#c99b74', sleeve: '#37475a' } },
  yvette:   { name: 'Yvette', role: 'régleuse, retired; ninety', watch: 'w_yvette', wrist: { skin: '#e8cfbd', sleeve: '#66587a', knit: true } }
};

/* =====================================================================
   WATCHES
   ===================================================================== */
const W = G.watches = {};
W.none = { name: '', cfg: { none: true } };

/* ---- the heirloom ---- */
const HEIR = {
  mm: 36, metal: 'steel', lugs: 'thin', bezel: { type: 'thin' }, bph: 18000,
  dial: { color: '#f3f0e7', finish: 'matte', track: 'none', indices: 'baton', applied: 'steel', idxW: 0.04, idxIn: 0.76, idxOut: 0.93, ink: '#3a3a3a', sub: [{ pos: 6, r: 0.27, type: 'seconds', plain: true }] },
  hands: { style: 'leaf', color: 'blued', seconds: 'sub' },
  strap: { type: 'leather', color: '#5a3a26', grain: 5 },
  wear: { scratches: 16, seed2: 8 },
  back: { type: 'snap', lines: [] },
  inside: { stamps: [{ t: 'ACIER INOXYDABLE', y: -0.66, s: 6 }], marks: [] },
  mov: { type: 'manual', finish: 'rhodium', swan: true, chatons: true, blue: true, text: [{ t: 'N° 7', x: -0.46, y: 0.7, s: 8.5, f: 'serif', i: true }] }
};
const YEARS = ['76', '81', '86', '91', '96', '01', '06', '11', '16', '21'];
G.heirloomCfg = function (s, o) {
  o = o || {};
  const c = JSON.parse(JSON.stringify(HEIR));
  YEARS.forEach((y, i) => { c.inside.marks.push({ t: 'BC ' + y, x: -0.56 + (i > 4 ? 0.36 : 0), y: -0.34 + (i % 5) * 0.135, rot: -5 + (i % 3), s: 9 }); });
  if (s && s.flags.serviced) c.inside.marks.push({ t: 'LC 26', x: 0.2, y: 0.36, rot: -3, s: 10, c: '#ffffff', o: 0.95 });
  const name = o.name != null ? o.name : (s && s.flags.signed ? s.brand : '');
  if (name) { const n = name.toUpperCase(); c.dial.text = [{ t: n, y: -0.37, s: Math.min(8.6, 96 / Math.max(6, n.length)), f: 'serif', w: 600, ls: n.length > 12 ? 0.9 : 1.8 }]; }
  if (o.blank) { c.noHands = true; c.strap = null; }
  return c;
};
W.heirloom = {
  name: 'Blanche’s watch', sub: 'no maker · no name · hand-wound', live: true,
  cfg: s => G.heirloomCfg(s),
  views: ['dial', 'uv', 'back', 'inside', 'movement'],
  verdict: 'The seventh. The only one she never let go.',
  obs: [
    { id: 'blank', v: 'dial', at: [0, -0.33], r: 0.2, t: 'Where the name should be', x: 'Nothing. No brand, no *Swiss*, no number. Every watch you have ever seen says who made it. This one doesn’t say.' },
    { id: 'hands', v: 'dial', at: [0, 0], r: 0.14, t: 'Blue hands', x: 'Not paint. The steel itself has been heated until it turned this blue: [[blued steel]]. Somebody held these over a flame and watched for the exact second to stop.' },
    { id: 'sub', v: 'dial', at: [0, 0.44], r: 0.2, t: 'The little dial at six', x: 'A second, smaller dial with its own hand, going round once a minute: the [[small seconds]]. In French, *la petite seconde*. It is what she called you.' },
    { id: 'crystal', v: 'dial', at: [-0.5, -0.5], r: 0.2, t: 'Scratches', x: 'The [[crystal]] is scuffed all over, fine as cobweb. Sixty years of sleeves and doorframes and workbench edges.' },
    { id: 'crown', v: 'dial', at: [1.03, 0], r: 0.17, t: 'The crown', x: 'The [[crown]] is worn smooth along one edge, where a thumb rolled it every morning for fifty years.' },
    { id: 'nolume', v: 'uv', at: [0, -0.2], r: 0.9, t: 'In the dark', x: 'Nothing glows. No [[lume]] anywhere on it. A watch for someone who was rarely in the dark, or who knew what time it was anyway.' },
    { id: 'bare', v: 'back', at: [0, 0], r: 0.5, t: 'A bare back', x: 'Brushed steel and not one engraved letter. No maker, no metal, no serial. As if the case had made itself.' },
    { id: 'rim', v: 'back', at: [0.62, 0.62], r: 0.2, t: 'The rim', x: 'No notches for a wrench, no screw thread showing. The back is sprung into place. Whoever made this did not want it opened by just anyone.' },
    { id: 'marks', v: 'inside', at: [-0.38, -0.02], r: 0.42, t: 'A column of scratches', x: 'Tiny, in her hand: BC 76, BC 81, BC 86… a [[service mark]] every five years, the last one BC 21. The next was due this year.' },
    { id: 'nostamp', v: 'inside', at: [0, -0.6], r: 0.22, t: 'No maker’s stamp', x: 'A case-maker stamps the inside of his backs: a name, a number, a trademark. This one says only *acier inoxydable*: stainless steel.' },
    { id: 'lc', v: 'inside', at: [0.32, 0.31], r: 0.2, t: 'LC 26', x: 'Yours. Scratched under hers with a hand that shook a little.', talk: false, if: s => s.flags.serviced },
    { id: 'balance', v: 'movement', at: [0.39, -0.33], r: 0.17, t: 'The balance', x: 'A gold wheel swinging back and forth, five beats every second: the [[balance]]. Eighteen thousand an hour is its [[beat rate]]. Everything else in a watch exists to keep this moving and to count its swings.' },
    { id: 'spring', v: 'movement', at: [0.39, -0.03], r: 0.13, t: 'The hairspring', x: 'A blue coil finer than a hair, breathing in and out under the balance: the [[hairspring]]. Its length decides how fast the watch runs. Adjusting it was a profession. It was hers.' },
    { id: 'reg', v: 'movement', at: [0.76, -0.3], r: 0.15, t: 'A and R', x: 'A steel pointer over two letters: *avance*, *retard*. The [[regulator]]. Push it toward A and the watch gains; toward R and it loses.' },
    { id: 'wheels', v: 'movement', at: [-0.25, -0.34], r: 0.2, t: 'The winding wheels', x: 'Turn the crown and these turn, tightening the [[mainspring]] coiled in its barrel underneath. That is all the energy a mechanical watch ever has: what you put in with your fingers.' },
    { id: 'jewels', v: 'movement', at: [-0.3, 0.42], r: 0.14, t: 'Red dots', x: 'Synthetic rubies, set in little gold collars. [[Jewels]] are bearings: hard, slick seats for the wheels’ pivots. They are there to resist wear, not to be precious.' },
    { id: 'n7', v: 'movement', at: [-0.39, 0.59], r: 0.15, t: 'N° 7', x: 'A [[movement]] is normally signed like a dial: maker, [[calibre]], jewel count, country. This one has stripes like light on water and no words. Only, low on the plate, a number: N° 7.' }
  ]
};

/* ---- wrists ---- */
W.w_mai = { name: 'Casio F-91W', cfg: { mm: 34, shape: 'tv', metal: 'resin', crown: { pos: 0 }, display: { type: 'lcd', text: '10:58 50', top: 'SA 28' }, strap: { type: 'rubber', color: '#17191b' } } };
W.w_gaspard = { name: 'Corémont, c.1955', cfg: { mm: 35, metal: 'rose', lugs: 'thin', bezel: { type: 'thin' }, dial: { color: '#ece6d6', finish: 'sunburst', track: 'ticks', indices: 'dagger', applied: 'rose', ink: '#2a2418', text: [{ t: 'CORÉMONT', y: -0.34, s: 7.5, f: 'serif', w: 600, ls: 1.6 }], logo: 'spiral', logoY: -0.5 }, hands: { style: 'dauphine', color: 'rose', seconds: 'center', secColor: 'rose' }, strap: { type: 'leather', color: '#15120f' } } };
W.w_peg = { name: 'Smiths W10', cfg: LN('w10', { strap: { type: 'nato', color: '#7b8087' } }) };
W.w_dane = { name: 'a very large chronograph', cfg: { mm: 46, metal: 'gold', bezel: { type: 'tachy' }, pushers: true, dial: { color: '#111', finish: 'sunburst', track: 'fine', indices: 'baton', applied: 'gold', ink: '#e8c66a', sub: [{ pos: 3, r: 0.22, type: '30min' }, { pos: 6, r: 0.22, type: '12h' }, { pos: 9, r: 0.22 }] }, hands: { style: 'baton', color: 'gold', seconds: 'sub', chrono: true, secColor: 'red' }, strap: { type: 'bracelet', metal: 'gold' } } };
W.w_ines = { name: 'Cartier Tank', cfg: LN('tank', { strap: { type: 'leather', color: '#4a1820' } }) };
W.w_marius = { name: 'Doxa Sub 300', cfg: LN('doxa') };
W.w_lola = { name: 'Omega Speedmaster', cfg: LN('moonwatch') };
W.w_aiko = { name: 'Casio G-Shock', cfg: LN('gshock') };
W.w_sakamoto = { name: 'Grand Seiko', cfg: LN('grandseiko') };
W.w_wing = { name: 'a gold Rolex Day-Date', cfg: { mm: 36, metal: 'gold', bezel: { type: 'fluted' }, dial: { color: '#d9b96a', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'gold', ink: '#3a2a08', date: { pos: 3, cyclops: true }, text: [{ t: 'FRI', y: -0.62, s: 6, w: 600, c: '#111' }] }, hands: { style: 'baton', color: 'gold', seconds: 'center', secColor: 'gold' }, strap: { type: 'bracelet', kind: 'jubilee', metal: 'gold' } } };
W.w_kit = { name: 'a microbrand sector dial', cfg: { mm: 38, metal: 'steel', bezel: { type: 'thin' }, dial: { color: '#e9b9a0', finish: 'sector', color2: '#f3d7c6', track: 'railroad', indices: 'arabic', nums: [12, 3, 6, 9], rest: 'baton', numSize: 0.2, ink: '#2a2a2e' }, hands: { style: 'syringe', color: 'blued', seconds: 'center', secColor: 'blued' }, strap: { type: 'leather', color: '#6f7377' } } };
W.w_yvette = { name: 'a small gold watch', cfg: { mm: 24, metal: 'gold', lugs: 'thin', lugW: 10, bezel: { type: 'thin' }, dial: { color: '#efe7d3', finish: 'sunburst', track: 'none', indices: 'baton', applied: 'gold', ink: '#3a2a08' }, hands: { style: 'leaf', color: 'gold', seconds: 'none' }, strap: { type: 'leather', color: '#161616' } } };

/* ---- the orphan Mai gives you to sell ---- */
W.orphan = {
  name: 'Omega Seamaster, c.1964', sub: 'left for repair in 1998 · never collected',
  cfg: { mm: 34.5, metal: 'steel', bezel: { type: 'thin' }, bph: 19800, dial: { color: '#d9dcdc', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', ink: '#222', date: { pos: 3 }, text: [{ t: 'OMEGA', y: -0.36, s: 8, w: 500, ls: 1.4 }, { t: 'Seamaster', y: 0.34, s: 8, f: 'script', ls: 0 }], arc: 'SWISS MADE' }, hands: { style: 'dauphine', color: 'steel', seconds: 'center' }, strap: { type: 'leather', color: '#2b221b' }, wear: { spots: 10, seed: 4, scratches: 6 },
    back: { type: 'snap', arcTop: 'WATERPROOF', lines: [{ t: 'SEAMASTER', y: 0, s: 9 }], arcBottom: 'STAINLESS STEEL' }, mov: { type: 'auto', finish: 'rose', rotorText: 'TWENTY-FOUR JEWELS' } },
  views: ['dial', 'back', 'movement'],
  obs: [
    { id: 'dial', v: 'dial', at: [-0.3, 0.2], r: 0.24, t: 'An honest dial', x: 'Silver, with a faint freckling near the edge and *Swiss Made* still crisp under six. Never repainted. That is most of the value of this watch, right there.' },
    { id: 'crown', v: 'dial', at: [1.03, 0], r: 0.17, t: 'The crown', x: 'A plain crown. The original would have carried the maker’s symbol. Somebody replaced it, long ago. A buyer will ask.' },
    { id: 'lugs', v: 'dial', at: [0.62, -1.02], r: 0.2, t: 'Soft edges', x: 'The lugs have lost their bevels: the case has been machine-[[polished|polishing]] at least once. Shiny, and a little less of a watch each time.' },
    { id: 'mov', v: 'movement', at: [0, -0.5], r: 0.3, t: 'Copper-coloured and clean', x: 'An [[automatic]] movement, plated the colour of a new penny, with a rotor that swings as you move. Mai serviced it last month. That is worth saying out loud.' }
  ]
};

/* ---- London: three W.W.W. ---- */
const WWW = (brand, extra) => Watch.merge({
  mm: 37, metal: 'steel', bezel: { type: 'smooth' }, bph: 18000,
  dial: { color: '#17160f', finish: 'matte', track: 'railroad', indices: 'www', ink: '#e8e3d0', lume: 'radium', pips: true, numSize: 0.185, logo: 'broadarrow', logoY: -0.19, text: [{ t: brand, y: -0.37, s: 8.5, w: 500, ls: 1.2 }], sub: [{ pos: 6, r: 0.27 }] },
  hands: { style: 'pencil', color: 'white', lume: 'radium', seconds: 'sub' },
  strap: { type: 'nato', color: '#5c5a44' }
}, extra || {});
W.cymaA = {
  name: 'Cyma W.W.W.', sub: 'British Army issue · 1945 · La Chaux-de-Fonds',
  cfg: WWW('CYMA', { wear: { scratches: 12, seed2: 3, backScratches: 14 }, back: { arcTop: 'STAINLESS STEEL', lines: [{ t: 'W.W.W.', y: -0.14, s: 13 }, { t: 'P 21384', y: 0.16, s: 10 }, { t: '70591', y: 0.42, s: 8.5 }], logo: 'broadarrow', logoY: -0.46 } }),
  views: ['dial', 'uv', 'back'], closed: { movement: '“I don’t open backs in the rain, love. Come back at ten and I’ll show you fifteen jewels and no rust.”' },
  verdict: 'An honest soldier: original dial, radium burnt brown, both numbers right. The sister of Papa’s watch.',
  obs: [
    { id: 'arrow', v: 'dial', at: [0, -0.17], r: 0.13, t: 'The arrow', x: 'Three strokes, like a bird’s footprint: the [[broad arrow]]. It has marked British government property since the 1500s. Cannons, blankets, prisoners’ uniforms, and this.' },
    { id: 'lume', v: 'dial', at: at(60, 0.76), r: 0.14, t: 'Brown dots', x: 'A dot of [[radium]] paint at every hour, burnt the colour of toast, and a little crumbled. The hands are the same shade exactly. They aged together: that is what [[matching lume]] looks like.' },
    { id: 'sub', v: 'dial', at: [0, 0.42], r: 0.2, t: 'Seconds at six', x: 'A soldier glancing down needs one answer before any other: is it still running? So the seconds get a dial of their own.' },
    { id: 'crystal', v: 'dial', at: [-0.42, -0.5], r: 0.2, t: 'A scuffed crystal', x: 'Acrylic, scratched grey. It polishes out with a dab of paste and ten minutes. Hardly a flaw, but worth a mention.' },
    { id: 'dead', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Almost nothing', x: 'A ghost of grey, if that. Eighty-year-old radium is still radioactive, but the compound that did the glowing burnt out long ago. A W.W.W. that lights up like a torch has been repainted.' },
    { id: 'www', v: 'back', at: [0, -0.13], r: 0.16, t: 'W.W.W.', x: '*Watch, Wristlet, Waterproof*: the Ministry’s name for the specification. Black dial, luminous hands, seconds at six, shatterproof crystal, accurate to a [[chronometer]]’s standard. Twelve Swiss firms built to it.' },
    { id: 'nums', v: 'back', at: [0, 0.27], r: 0.2, t: 'Two numbers', x: 'The Army’s serial, with Cyma’s letter P; under it the maker’s own case number. Both struck deep, by the same hand, at the same time.' },
    { id: 'bars', v: 'back', at: [0, -1.12], r: 0.22, t: 'Fixed bars', x: 'The strap bars are solid steel, soldered into the lugs. If a bar can’t spring out, a watch can’t be lost. It is why these wear one-piece straps that thread through: what the world now calls a [[NATO strap]].' }
  ]
};
W.recordB = {
  name: 'Record W.W.W.', sub: 'British Army issue · 1945 · re-dialled in service',
  cfg: WWW('RECORD', { mm: 36.5, metal: 'chrome', dial: { ink: '#f4f2ea', lume: 'tritium', logo: 'circleT', logoY: -0.2, text: [{ t: 'RECORD', y: -0.4, s: 8, w: 500, ls: 1.2 }] }, hands: { lume: 'tritium' }, strap: { type: 'nato', color: '#6d7078' }, wear: { scratches: 5 }, back: { lines: [{ t: 'W.W.W.', y: -0.14, s: 13 }, { t: 'L 14027', y: 0.16, s: 10 }, { t: '628344', y: 0.42, s: 8.5 }], logo: 'broadarrow', logoY: -0.46 } }),
  views: ['dial', 'uv', 'back'], closed: { movement: '“Not in this weather.”' },
  verdict: 'A real issue watch wearing a Ministry replacement dial. Not as it left the factory in 1945, but every change was made by the Army.',
  obs: [
    { id: 'circleT', v: 'dial', at: [0, -0.18], r: 0.13, t: 'A T in a circle', x: 'No arrow here: a circled T. In the 1950s and 60s the Ministry of Defence pulled the radium out of its watches and re-dialled them with [[tritium]], marked with this T. A [[service dial]]: not original, but not a forgery either.' },
    { id: 'print', v: 'dial', at: at(300, 0.6), r: 0.15, t: 'Sharp white numerals', x: 'Whiter and crisper than the Cyma’s. Twenty years younger, and it shows.' },
    { id: 'brass', v: 'dial', at: [-0.96, 0.25], r: 0.16, t: 'Yellow at the edges', x: 'Where the plating has worn through, brass shows. A few of the twelve makers chrome-plated a brass case. Most used solid steel.' },
    { id: 'faint', v: 'uv', at: [0, -0.1], r: 0.9, t: 'A faint, even ghost', x: 'A weak green breath from dots and hands alike. Tritium loses half its glow every twelve years or so. Even, faint, matching: as it should be.' },
    { id: 'nums', v: 'back', at: [0, 0.27], r: 0.2, t: 'Two numbers', x: 'L for Record, then the maker’s number. Deep and right.' }
  ]
};
W.omegaC = {
  name: '“Omega W.W.W.”', sub: 'described as: British Army issue · 1945',
  cfg: WWW('OMEGA', { mm: 35, metal: 'polished', dial: { color: '#0c0c0c', ink: '#ffffff', lume: 'fresh', lumeColor: '#e8d48a', logoY: -0.17, text: [{ t: 'OMEGA', y: -0.39, s: 10, w: 600, ls: 0.6 }] }, hands: { style: 'sword', lume: 'fresh', color: 'steel' }, strap: { type: 'leather', color: '#3a2a1c' }, back: { lines: [{ t: 'W.W.W', y: -0.1, s: 15, f: 'serif' }, { t: 'Y 8351', y: 0.26, s: 9 }], logo: 'broadarrow', logoY: -0.46 } }),
  views: ['dial', 'uv', 'back'], closed: { movement: '“Can’t open it, mate, haven’t got the tool on me.”' },
  verdict: 'A put-together: a real old case, perhaps, wearing a new dial, new paint and somebody else’s hands. It fills the pocket. It is nobody’s sister.',
  obs: [
    { id: 'arrow', v: 'dial', at: [0, -0.15], r: 0.13, t: 'A fat arrow', x: 'Thick, slightly crooked, and nudging the name above it. Ministry printers were not artists, but they were consistent.' },
    { id: 'lume', v: 'dial', at: at(60, 0.76), r: 0.14, t: 'Custard-yellow dots', x: 'Every dot the same tidy yellow, edges sharp as a decal. Time does not age anything this evenly. Somebody mixed this colour to look old: a [[relume]].' },
    { id: 'hands', v: 'dial', at: [0, 0], r: 0.14, t: 'The wrong hands', x: 'Sword-shaped, where the other two have straight pencils, and far too clean. Parts from one watch on another: a [[frankenwatch]].' },
    { id: 'polish', v: 'dial', at: [0.6, -1.0], r: 0.2, t: 'Rounded like soap', x: 'The case shines, and every edge on it has gone soft. Heavy [[polishing]] takes the metal with the scratches.' },
    { id: 'glow', v: 'uv', at: [0, -0.1], r: 0.9, t: 'It blazes', x: 'Bright green, hands and dial, like a new alarm clock. That is [[Super-LumiNova]], which did not exist until the 1990s. On a watch from 1945.' },
    { id: 'engr', v: 'back', at: [0, 0.1], r: 0.3, t: 'Shallow engraving', x: 'The letters are thin, fancy, and barely scratch the steel. And there is one number where there should be two.' }
  ]
};
W.trenchX = {
  name: 'Silver trench watch', sub: 'London import hallmark · 1916',
  cfg: LN('trench', { wear: { cracks: 4, burn: 0.2 }, strap: { type: 'leather', color: '#6a4a2c' } }),
  views: ['dial'], stopped: true,
  obs: [
    { id: 'lugs', v: 'dial', at: [0, -1.18], r: 0.24, t: 'Wire lugs', x: 'A loop of silver wire soldered to a small pocket watch so that a strap could pass through. That solder joint is the whole invention.', learn: ['trench'] },
    { id: 'dial', v: 'dial', at: [0.36, 0.36], r: 0.2, t: 'A white dial with hairlines', x: 'Fired enamel on copper, bright as the day it left the kiln, and cracked like an old plate. Enamel never fades; it only breaks.' },
    { id: 'red12', v: 'dial', at: [0, -0.56], r: 0.15, t: 'A red twelve', x: 'So that a man could find the top of the dial in a hurry, in the mud, at night.' },
    { id: 'crown', v: 'dial', at: [1.08, 0], r: 0.18, t: 'An onion', x: 'A big ribbed [[crown]], shaped like an onion, to be wound with cold fingers. Pilots’ watches kept it for the same reason, with gloves.' }
  ]
};

/* ---- Paris: two Corémonts ---- */
const CORE = extra => Watch.merge({
  mm: 33, metal: 'gold', lugs: 'thin', bezel: { type: 'thin' }, bph: 18000,
  dial: { color: '#ebe6d8', finish: 'sunburst', track: 'ticks', trackAt: 0.99, indices: 'baton', applied: 'gold', idxW: 0.04, ink: '#2a2418', text: [{ t: 'CORÉMONT', y: -0.36, s: 7.6, f: 'serif', w: 600, ls: 1.7 }], logo: 'spiral', logoY: -0.52, arc: 'SWISS MADE' },
  hands: { style: 'dauphine', color: 'gold', seconds: 'none' },
  strap: { type: 'leather', color: '#18130f' }
}, extra || {});
W.coremontA = {
  name: 'Corémont extra-plate', sub: '18-carat gold · 33 mm · c.1961',
  cfg: CORE({ wear: { spots: 26, seed: 12, spotColor: '#8a6a3a', scratches: 4 }, back: { type: 'snap', lines: [{ t: 'à Thérèse', y: -0.22, s: 12, f: 'script', ls: 0, o: 0.5 }, { t: '1961', y: 0.02, s: 10, f: 'script', ls: 0, o: 0.5 }, { t: '0,750', y: 0.46, s: 6.5 }, { t: '⌂ 127', y: 0.6, s: 6 }] }, mov: { type: 'manual', finish: 'gilt', text: [{ t: 'CORÉMONT WATCH C°', x: -0.5, y: -0.72, s: 5.5, rot: -24 }, { t: '17 RUBIS', x: -0.42, y: 0.78, s: 5.5 }, { t: 'SWISS', x: -0.1, y: 0.92, s: 5 }] } }),
  views: ['dial', 'back', 'movement'],
  verdict: 'Thin, gold, untouched, and somebody else’s wedding present. A sister of the watch Émile gave her.',
  obs: [
    { id: 'sig', v: 'dial', at: [0, -0.34], r: 0.15, t: 'The signature', x: 'CORÉMONT, in thin capitals, and the accent on the É is a flat little bar. Above it a tiny spiral: a hairspring. The firm’s emblem was the thing its régleuses adjusted.' },
    { id: 'spots', v: 'dial', at: [0.38, 0.3], r: 0.22, t: 'Freckles', x: 'A scatter of faint brown specks under the lacquer. [[Patina]]: sixty years of slow chemistry. It can’t be convincingly faked and it can’t be undone, which is why collectors pay for it.' },
    { id: 'idx', v: 'dial', at: at(240, 0.72), r: 0.14, t: 'Gold batons', x: 'Each hour marker is a separate piece of gold, riveted through the dial from behind: [[applied indices]]. Their shadows all fall the same way.' },
    { id: 'thin', v: 'dial', at: [-0.95, -0.2], r: 0.17, t: 'How thin it is', x: 'On edge it is barely thicker than two coins. *Extra-plate*: extra-flat. In the 1950s and 60s the great houses raced each other toward thinness the way they would later race toward depth.' },
    { id: 'hall', v: 'back', at: [0, 0.53], r: 0.17, t: 'Tiny stamps', x: '*0,750*: three-quarters pure, eighteen carats. Beside it a case-maker’s number in a little cartouche. Swiss [[hallmarks|hallmark]], crisp and deep: this case has not been polished away.' },
    { id: 'ded', v: 'back', at: [0, -0.12], r: 0.24, t: 'À Thérèse, 1961', x: 'A dedication, engraved in script and worn half away by sixty years of wrist. Every old watch was somebody’s. Some buyers mind. Some pay extra.' },
    { id: 'regc', v: 'movement', at: [0.76, -0.3], r: 0.15, t: 'A centred regulator', x: 'The pointer sits almost exactly between A and R. Whoever adjusted this did not need to shove the index to one side to make it keep time. They got the hairspring right instead.' },
    { id: 'gilt', v: 'movement', at: [-0.4, -0.62], r: 0.22, t: 'Corémont Watch C°', x: 'Signed, gilded, plain. An [[ébauche]] bought in from a movement factory, finished and adjusted in-house. Seventeen jewels: the honest number for a simple hand-wound watch.' }
  ]
};
W.coremontB = {
  name: 'Corémont, steel', sub: 'stainless · 34 mm · offered as “c.1958, mint”',
  cfg: CORE({ mm: 34, metal: 'steel', dial: { color: '#fbfaf6', finish: 'matte', applied: 'steel', trackAt: 0.965, text: [{ t: 'COREMONT', y: -0.35, s: 8.6, f: 'serif', w: 700, ls: 1.1, sk: -7 }], logo: 'star', logoY: -0.52, arc: '' }, hands: { style: 'dauphine', color: 'steel' }, strap: { type: 'leather', color: '#3a2618' }, back: { arcTop: 'ANTIMAGNÉTIQUE · ÉTANCHE', lines: [{ t: 'CORÉMONT', y: 0, s: 9, f: 'serif' }], arcBottom: 'ACIER INOXYDABLE' } }),
  views: ['dial', 'back'], closed: { movement: '“The back is tight. I don’t force backs,” says the man at the next stall, who is selling it.' },
  verdict: 'A real Corémont with a repainted face. The watch is true and the name on it is a copy of itself.',
  obs: [
    { id: 'sig', v: 'dial', at: [0, -0.33], r: 0.15, t: 'The signature', x: 'COREMONT. The letters are heavier, they lean, and there is no accent at all. The little spiral above has become a star.' },
    { id: 'clean', v: 'dial', at: [0.36, 0.34], r: 0.22, t: 'Not one freckle', x: 'Paper white, flawless, flat. On a steel watch that has supposedly been worn since 1958.' },
    { id: 'track', v: 'dial', at: at(120, 0.8), r: 0.15, t: 'A drifting track', x: 'The minute marks do not quite meet the hour batons: touching at four, a gap at ten. The dial was printed with the markers already on it, by someone lining it up by eye.' },
    { id: 'swiss', v: 'dial', at: [0, 0.8], r: 0.15, t: 'Nothing under six', x: 'Where *Swiss Made* should hide beneath the six o’clock marker: bare dial. Repainters forget it, or can’t print that small.' },
    { id: 'back', v: 'back', at: [0, 0], r: 0.3, t: 'An honest back', x: 'Worn, correct, deeply stamped: *antimagnétique, étanche*. The case is real. So, very likely, is everything inside it.' }
  ]
};
W.coremontNew = {
  name: 'Corémont “Héritage” prototype', sub: 'steel · 40 mm · not yet for sale',
  cfg: { mm: 40, shape: 'octagon', metal: 'steel', bezel: { type: 'smooth', w: 0.1 }, lugW: 26, dial: { color: '#243a5c', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', lume: 'luminova', ink: '#f2f2f2', date: { pos: 3 }, text: [{ t: 'CORÉMONT', y: -0.36, s: 9, f: 'serif', w: 600, ls: 1.8 }, { t: 'DEPUIS 1921', y: -0.24, s: 4.6, ls: 1.6 }, { t: 'AUTOMATIC', y: 0.36, s: 4.8, ls: 1.4 }], logo: 'spiral', logoY: -0.53 }, hands: { style: 'baton', color: 'steel', lume: 'luminova', seconds: 'center' }, strap: { type: 'integrated' }, bph: 28800 }
};

/* ---- Marseille ---- */
W.enicarA = {
  name: 'Enicar Sherpa Super-Dive', sub: 'EPSA Super Compressor · c.1964',
  cfg: { mm: 40, metal: 'steel', bezel: { type: 'thin', w: 0.045 }, crown: { pos: [2, 4], kind: 'cross' }, bph: 18000,
    dial: { color: '#101216', finish: 'matte', track: 'none', indices: 'baton', lume: 'pumpkin', idxIn: 0.6, idxOut: 0.8, idxW: 0.06, ink: '#e8e3d0', inner: { color: '#0b0c0f' }, date: { pos: 3, at: 0.6 }, text: [{ t: 'ENICAR', y: -0.33, s: 8, w: 500, ls: 1.4 }, { t: 'SHERPA', y: 0.3, s: 5.4, ls: 1.4 }, { t: 'Super-Dive', y: 0.41, s: 6.4, f: 'script', ls: 0 }], arc: '' },
    hands: { style: 'sword', color: 'steel', lume: 'pumpkin', seconds: 'center', secStyle: 'arrow' },
    strap: { type: 'rubber', color: '#141414' }, wear: { moist: 0.3, scratches: 8 },
    back: { arcTop: 'SUPER COMPRESSOR', lines: [{ t: 'SHERPA', y: -0.05, s: 11 }, { t: '600', y: 0.2, s: 10 }], arcBottom: 'WATERPROOF · STAINLESS STEEL' },
    inside: { stamps: [{ t: 'E. PIQUEREZ S.A.', y: -0.02, s: 6.5 }, { t: 'BREVET ✚', y: 0.14, s: 6.5 }, { t: 'SWISS MADE', y: 0.6, s: 5.5 }], logo: 'helmet', logoY: -0.38, marks: [{ t: '4.71 R', x: -0.6, y: 0.4, rot: 20 }] },
    mov: { type: 'auto', finish: 'rhodium', rotorText: 'ENICAR · ULTRASONIC · 21 RUBIS' } },
  views: ['dial', 'uv', 'inside', 'movement'],
  verdict: 'Twin crowns, the bezel under the glass, the little helmet inside the back. Émile’s workshop made this case, or one beside it on the same bench.',
  obs: [
    { id: 'crown2', v: 'dial', at: at(60, 1.07), r: 0.16, t: 'A cross-hatched crown', x: 'Cut like the face of a file. That cross-hatch is the calling card of one case-maker in the Jura: Ervin Piquerez S.A., [[EPSA]]. They built cases for a hundred brands, and most of them wear this crown.' },
    { id: 'crown4', v: 'dial', at: at(120, 1.07), r: 0.16, t: 'The lower crown', x: 'Also cross-hatched, but the pattern is sharper and the steel a shade brighter. A replacement, and an old one. Correct part, wrong decade.' },
    { id: 'inner', v: 'dial', at: [0, -0.74], r: 0.16, t: 'A bezel under glass', x: 'The minute ring sits *inside* the crystal, turned by the upper crown. Nothing can knock it. No sand can jam it. The price is a second hole in the case.' },
    { id: 'tide', v: 'dial', at: [-0.42, 0.5], r: 0.2, t: 'A tide-line', x: 'A faint brown bloom along the lower edge of the dial. Once, in sixty years, water got past a tired seal. It is a dive watch that has actually been wet.' },
    { id: 'lume', v: 'uv', at: [0, -0.1], r: 0.9, t: 'A tired glow', x: 'The faintest green, the same on hands and markers: old [[tritium]], honestly spent.' },
    { id: 'helmet', v: 'inside', at: [0, -0.34], r: 0.17, t: 'A diver’s helmet', x: 'Stamped inside the back: a tiny helmet, and *Brevet*, patent. The mark of the [[Super Compressor]].' },
    { id: 'spring', v: 'inside', at: [0.7, 0.3], r: 0.2, t: 'How it seals', x: 'The back is not screwed down hard. It rides on a spring ring. The deeper the watch goes, the harder the water presses the back onto its gasket: it uses the sea to keep the sea out.' },
    { id: 'rotor', v: 'movement', at: [0.1, 0.6], r: 0.3, t: 'A half-disc that swings', x: 'The [[rotor]]. It turns with every movement of the wrist and winds the mainspring: an [[automatic]]. A diver doesn’t unscrew a crown underwater to wind his watch.' }
  ]
};
W.skinB = {
  name: 'Skin diver, signed by a shop', sub: 'private label · c.1968',
  cfg: { mm: 36, metal: 'chrome', bezel: { type: 'dive', faded: 0.45, w: 0.17 }, bph: 18000,
    dial: { color: '#141414', finish: 'matte', track: 'ticks', indices: 'dot', lume: 'tritium', ink: '#e8e3d0', date: { pos: 3 }, text: [{ t: 'AUBAGNE FRÈRES', y: -0.38, s: 5.6, ls: 1 }, { t: 'TOULON', y: -0.27, s: 4.6, ls: 1.4 }, { t: '17 JEWELS', y: 0.3, s: 4.6, ls: 1 }, { t: 'INCABLOC', y: 0.4, s: 4.6, ls: 1 }, { t: 'WATERPROOF', y: 0.5, s: 4.6, ls: 1 }] },
    hands: { style: 'pencil', color: 'steel', lume: 'tritium', seconds: 'center' }, strap: { type: 'rubber', color: '#1a1a1a' }, wear: { scratches: 14 } },
  views: ['dial', 'uv'], closed: { movement: '“That one I don’t open. If I open it you’ll see the rust and I’ll have to give it to you.”' },
  verdict: 'A beach watch with a shop’s name on it. Honest, cheap, and not a Compressor. It holds the pocket open.',
  obs: [
    { id: 'bezel', v: 'dial', at: at(40, 0.88), r: 0.16, t: 'A faded ring', x: 'The bezel has gone from black to slate, and it turns both ways with a fingertip. Held on by friction. Fine for timing an egg.' },
    { id: 'words', v: 'dial', at: [0, 0.33], r: 0.18, t: 'Three promises', x: '*17 Jewels. Incabloc. Waterproof.* In the sixties anybody could print *waterproof* on a dial, and nearly everybody did. Nobody checked.' },
    { id: 'name', v: 'dial', at: [0, -0.28], r: 0.16, t: 'A shop’s name', x: 'Aubagne Frères, Toulon: a jeweller, not a factory. A [[private label]]. They ordered cases from one supplier, movements from another, and had their own name printed on the dial.' },
    { id: 'lume', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Faint and even', x: 'Old tritium, matching. Nobody has bothered to improve this watch, which is the best thing about it.' }
  ]
};

/* ---- New York ---- */
W.chronoA = {
  name: 'Meridor chronograph', sub: 'Valjoux 7733 · hand-wound · c.1969',
  cfg: { mm: 37, metal: 'steel', bezel: { type: 'tachy' }, pushers: true, bph: 18000,
    dial: { color: '#ece8dd', finish: 'matte', track: 'fine', indices: 'baton', lume: 'pumpkin', idxW: 0.045, ink: '#151515', sub: [{ pos: 3, r: 0.25, type: '30min', color: '#151515', ink: '#eee' }, { pos: 9, r: 0.25, type: 'seconds', color: '#151515', ink: '#eee' }], text: [{ t: 'MERIDOR', y: -0.42, s: 6.8, ls: 1.4 }, { t: 'T SWISS T', y: 0.6, s: 3.6, ls: 1 }] },
    hands: { style: 'baton', color: 'black', lume: 'pumpkin', seconds: 'sub', chrono: true, secColor: 'red' }, strap: { type: 'leather', color: '#2a2018' }, wear: { scratches: 7 },
    back: { arcTop: 'STAINLESS STEEL · WATERPROOF', lines: [{ t: 'INCABLOC', y: 0, s: 8 }, { t: '7733 · 4129', y: 0.3, s: 7 }] },
    mov: { type: 'chrono', finish: 'gilt', cam: true, text: [{ t: 'SEVENTEEN JEWELS', x: -0.52, y: 0.8, s: 5 }, { t: 'SWISS', x: -0.1, y: 0.93, s: 5 }, { t: '7733', x: -0.66, y: -0.7, s: 6 }] } },
  views: ['dial', 'uv', 'back', 'movement'],
  verdict: 'A working chronograph with a forgotten name and the same engine as watches ten times its price. The sister of the one she timed her own work with.',
  obs: [
    { id: 'push', v: 'dial', at: at(60, 1.07), r: 0.16, t: 'Two buttons', x: 'Start and stop above the crown, reset below. Breitling gave the wrist [[chronograph]] its second button in 1934, and it has worked this way ever since.', learn: ['breitling2'] },
    { id: 'regs', v: 'dial', at: [0.37, 0], r: 0.17, t: 'Two little dials', x: 'On the left the ordinary seconds, always running. On the right a [[register]]: it clicks forward one mark for each minute timed, up to thirty. White dial, black registers: a [[panda dial]].' },
    { id: 'tachy', v: 'dial', at: at(315, 0.86), r: 0.15, t: 'Numbers on the bezel', x: 'A [[tachymeter]]. Start the hand at one mile-marker, stop it at the next, and it points to your speed. A slide rule with one answer on it.' },
    { id: 'tswisst', v: 'dial', at: [0, 0.5], r: 0.14, t: 'T SWISS T', x: 'Two tiny T’s either side of *Swiss*: the dial carries [[tritium]]. That dates it between the early 1960s and the late 1990s without opening the back.' },
    { id: 'ding', v: 'dial', at: at(150, 0.92), r: 0.14, t: 'A dent', x: 'A small flat on the bezel at five o’clock where it met a doorframe, some time before you were born.' },
    { id: 'match', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Spent, and matching', x: 'Barely a glow, the same on hands and markers. Nothing has been touched up.' },
    { id: 'cam', v: 'movement', at: [-0.02, -0.62], r: 0.16, t: 'A cam, not a castle', x: 'The switching is done by a stamped steel cam: cheap to make, hard to kill. The grander chronographs use a [[column wheel]], a tiny castle turret. Collectors pay for the turret. The cam keeps the same time.' },
    { id: '7733', v: 'movement', at: [-0.5, -0.58], r: 0.17, t: '7733', x: 'Valjoux, calibre 7733. One [[ébauche]] factory supplied this movement to brand after brand. The names on the dials were nearly stickers.' }
  ]
};
const POGUE = extra => Watch.merge({
  mm: 41, shape: 'tonneau', metal: 'steel', pushers: true, bezel: { type: 'tachy', color: '#1c3a7a', color2: '#b3262b', w: 0.13 }, bph: 21600, lugW: 19,
  dial: { color: '#d9a81e', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', lume: 'tritium', ink: '#141414', inner: { color: '#1c3a7a', tri: '#fff' }, sub: [{ pos: 6, r: 0.25, type: '30min', color: '#141414', ink: '#eee' }], date: { pos: 3, day: 'SUN', at: 0.56 }, text: [{ t: 'SEIKO', y: -0.4, s: 9, w: 600, ls: 1 }, { t: 'CHRONOGRAPH', y: -0.28, s: 4.4, ls: 1 }, { t: 'AUTOMATIC', y: -0.2, s: 4.4, ls: 1 }] },
  hands: { style: 'baton', color: 'steel', lume: 'tritium', seconds: 'none', chrono: true, secColor: 'red' },
  strap: { type: 'bracelet', kind: 'h' }
}, extra || {});
W.pogueC = {
  name: 'Seiko 6139 “Pogue”', sub: 'automatic chronograph · November 1973',
  cfg: POGUE({ wear: { scratches: 9 }, back: { arcTop: 'WATER RESISTANT · STAINLESS STEEL', lines: [{ t: 'SEIKO', y: -0.16, s: 12, w: 600 }, { t: '6139-6002', y: 0.1, s: 8 }, { t: '3N4087', y: 0.34, s: 8 }], arcBottom: 'JAPAN' }, mov: { type: 'chrono', rotor: true, finish: 'nickel', rotorText: 'SEIKO · 17 JEWELS · 6139B' } }),
  views: ['dial', 'back', 'movement'],
  verdict: 'One of the three automatic chronographs of 1969, and the calibre that went to Skylab. Honest, a little faded, and a cousin rather than a sister.',
  obs: [
    { id: 'dial', v: 'dial', at: [-0.3, -0.05], r: 0.2, t: 'Gold going to mustard', x: 'A sunburst that was once bright gold and has settled, evenly, toward mustard. The printing is hair-fine. Nobody has been near this with a paintbrush.' },
    { id: 'one', v: 'dial', at: [0, 0.38], r: 0.17, t: 'One register', x: 'A single counter at six, where Swiss chronographs have two or three. Seiko’s engineers asked what a person actually reads, and left the rest out.' },
    { id: 'serial', v: 'back', at: [0, 0.33], r: 0.16, t: '3N4087', x: 'On a Seiko the first digit of the serial is the year and the second is the month: 3, and N for November. November 1973. The watch tells you its own birthday.' },
    { id: 'wheel', v: 'movement', at: [-0.02, -0.62], r: 0.16, t: 'A castle turret', x: 'Under the rotor, a [[column wheel]]: the refined way to switch a chronograph. In 1969 Seiko put one, self-winding, into a watch a schoolteacher could buy.' }
  ]
};
W.pogueB = {
  name: 'Seiko 6139, “mint”', sub: 'automatic chronograph · described as 1971',
  cfg: POGUE({ bezel: { color: '#1f49b0', color2: '#e02020' }, dial: { color: '#f5d000', finish: 'matte', inner: { color: '#1f49b0' }, lume: 'fresh', text: [{ t: 'SEIKO', y: -0.4, s: 10.5, w: 700, ls: 0.4 }, { t: 'CHRONOGRAPH', y: -0.27, s: 5, ls: 0.6 }, { t: 'AUTOMATIC', y: -0.18, s: 5, ls: 0.6 }] }, hands: { lume: 'fresh' }, back: { arcTop: 'WATER RESISTANT · STAINLESS STEEL', lines: [{ t: 'SEIKO', y: -0.16, s: 12, w: 600 }, { t: '6139-6002', y: 0.1, s: 8 }, { t: '6D2210', y: 0.34, s: 8 }], arcBottom: 'JAPAN' } }),
  views: ['dial', 'uv', 'back'], closed: { movement: 'It’s a web listing. Four photographs, none of the inside.' },
  verdict: 'A tired 6139 from 1976 under a brand-new costume. It fills the pocket and lies about its age.',
  obs: [
    { id: 'yellow', v: 'dial', at: [-0.3, -0.05], r: 0.2, t: 'Taxi yellow', x: 'Flat, loud, perfectly even. The real dial is a metallic sunburst that shifts with the light. This one has been sprayed.' },
    { id: 'font', v: 'dial', at: [0, -0.33], r: 0.16, t: 'Fat letters', x: 'SEIKO, a size too big and a weight too heavy, sitting a little low. Dial text is the hardest thing to copy and the first thing to check.' },
    { id: 'glow', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Bright as a toy', x: 'Fresh lume, hands and dial. On a watch sold as fifty-five years untouched.' },
    { id: 'serial', v: 'back', at: [0, 0.33], r: 0.16, t: '6D2210', x: 'Year 6, month D: December 1976. The seller says 1971. The case is telling the truth; the listing is not.' }
  ]
};

/* ---- Tokyo / Suwa ---- */
W.seikoQR = {
  name: 'Seiko Quartz QR, ref. 3863', sub: 'June 1973 · hers',
  cfg: { mm: 37, shape: 'cushion', metal: 'steel', quartz: true, bezel: { type: 'thin' }, lugs: 'none',
    dial: { color: '#2b4a7a', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', ink: '#f3f3f3', date: { pos: 3, day: 'FRI', frame: true }, text: [{ t: 'SEIKO', y: -0.38, s: 10, w: 600, ls: 1 }, { t: 'QUARTZ', y: 0.3, s: 5.4, ls: 1.6 }, { t: 'QR', y: 0.44, s: 8.5, w: 600, ls: 1 }], arc: 'JAPAN 3863-7010 T' },
    hands: { style: 'baton', color: 'steel', seconds: 'center' }, strap: { type: 'bracelet', kind: 'h' }, wear: { scratches: 6 },
    back: { arcTop: 'WATER RESISTANT · STAINLESS STEEL', lines: [{ t: 'SEIKO', y: -0.2, s: 13, w: 600 }, { t: '3863-7010', y: 0.06, s: 8 }, { t: '362951', y: 0.3, s: 8 }], arcBottom: 'JAPAN' },
    inside: { stamps: [{ t: 'SEIKO', y: -0.6, s: 7 }, { t: 'STAINLESS STEEL', y: 0.62, s: 5.5 }], marks: [{ t: 'BC 73', x: -0.5, y: -0.16, rot: -5, s: 10 }, { t: 'démontée,', x: -0.5, y: 0.0, rot: -4, s: 9 }, { t: 'comprise,', x: -0.5, y: 0.13, rot: -4, s: 9 }, { t: 'remontée.', x: -0.5, y: 0.26, rot: -4, s: 9 }] },
    mov: { type: 'quartz', cell: 'SEIKO SB-B9' } },
  views: ['dial', 'back', 'inside', 'movement'],
  verdict: 'Not a sister. The very watch: bought in Bienne like a spy in 1973, given away in Montréal in 1998, kept by a lake for twenty-eight years.',
  obs: [
    { id: 'qr', v: 'dial', at: [0, 0.38], r: 0.17, t: 'QUARTZ · QR', x: 'In 1969 a quartz watch cost as much as a small car. Four years later Seiko was selling this one to office workers. That is the whole [[quartz crisis]], in two letters.' },
    { id: 'tick', v: 'dial', at: [0, 0], r: 0.14, t: 'One step a second', x: 'The seconds hand jumps once, waits, jumps again. A mechanical hand sweeps in five or eight tiny steps a second; a [[quartz]] one saves its battery by moving only when it must.' },
    { id: 'day', v: 'dial', at: [0.5, 0], r: 0.16, t: 'Day and date', x: 'The day wheel is printed twice: English, and kanji. Turn the crown one way or the other to choose.' },
    { id: 'serial', v: 'back', at: [0, 0.3], r: 0.16, t: '362951', x: 'Year 3, month 6. June 1973. Her page says: *June 1973, a jeweller’s in Bienne*.' },
    { id: 'bc', v: 'inside', at: [-0.3, 0.05], r: 0.34, t: 'BC 73', x: 'Scratched inside the back in a hand you would know anywhere: *démontée, comprise, remontée*. Taken apart. Understood. Put back together.' },
    { id: 'xtal', v: 'movement', at: [0.02, -0.57], r: 0.14, t: 'A little silver can', x: 'Inside it, a sliver of quartz crystal cut like a tuning fork. Put a current through it and it vibrates thousands of times a second, at a rate that barely changes with heat, cold, position or mood.' },
    { id: 'coil', v: 'movement', at: [0.44, 0.17], r: 0.16, t: 'A copper coil', x: 'A motor the size of a lentil. Once a second the circuit sends it a pulse, and it kicks the hands forward one step.' },
    { id: 'trim', v: 'movement', at: [-0.55, -0.25], r: 0.12, t: 'A brass screw', x: 'A trimmer. Even quartz is regulated: someone at Suwa turned this a hair to the left or the right, listening to a machine.' },
    { id: 'cell', v: 'movement', at: [-0.35, 0.42], r: 0.22, t: 'The battery', x: 'Where the mainspring would be. The energy no longer comes from your fingers.' }
  ]
};

/* ---- Hong Kong ---- */
W.airmanA = {
  name: 'Glycine Airman', sub: '24-hour pilot’s watch · c.1967',
  cfg: { mm: 36, metal: 'steel', h24: true, bezel: { type: '24h' }, crown: { pos: [3, 4] }, bph: 18000, time: [10, 9, 36],
    dial: { color: '#0f0f10', finish: 'matte', track: 'ticks', trackInk: '#e8e3d0', indices: '24h', ink: '#0f0f10', numInk: '#e8e3d0', lume: 'tritium', numSize: 0.2, date: { pos: 3, at: 0.5 }, text: [{ t: 'GLYCINE', y: -0.36, s: 6.6, ls: 1.4, c: '#e8e3d0' }, { t: 'AIRMAN', y: 0.3, s: 5.6, ls: 1.6, c: '#e8e3d0' }, { t: 'AM', y: -0.52, x: 0.36, s: 4, c: '#e8e3d0' }, { t: 'PM', y: 0.52, x: -0.36, s: 4, c: '#e8e3d0' }] },
    hands: { style: 'syringe', color: 'steel', lume: 'tritium', seconds: 'center' }, strap: { type: 'leather', color: '#3a2a1e' }, wear: { scratches: 8 },
    back: { arcTop: 'GLYCINE AIRMAN', lines: [{ t: 'WORLD TIME', y: -0.1, s: 9 }, { t: '24 HOURS', y: 0.12, s: 8 }, { t: '671.238', y: 0.36, s: 7.5 }], arcBottom: 'WATERPROOF · INCABLOC' } },
  views: ['dial', 'uv', 'back'], closed: { movement: '“Later. If you buy it I will open it and oil it for you myself.”' },
  verdict: 'A whole day in one turn of the hand. The sister of the watch that kept the time before.',
  obs: [
    { id: 'h24', v: 'dial', at: at(180, 0.56), r: 0.16, t: 'Twelve at the bottom', x: 'Twenty-four hours on the dial. The hour hand goes round once a day: straight down at noon, straight up at midnight. A pilot crossing time zones can’t confuse two in the morning with two in the afternoon.' },
    { id: 'bezel', v: 'dial', at: at(45, 0.88), r: 0.15, t: 'A second day', x: 'The bezel carries its own twenty-four hours, and turns. Set it six hours on from the hand, and you read two places at once. The small crown at four locks it there.' },
    { id: 'pin', v: 'dial', at: [0, -0.7], r: 0.13, t: 'A wire at the top', x: 'At twenty-four o’clock, a hair-thin pin. Pull the crown and it rises through the dial to catch the seconds hand exactly at zero: [[hacking]]. For crews setting their watches together, on a count.' },
    { id: 'lume', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Faint and matching', x: 'Old tritium on hands and dots, the same weak green. Untouched.' },
    { id: 'back', v: 'back', at: [0, 0], r: 0.3, t: 'World Time', x: 'Glycine, Bienne, 1953: the first of these went to airline crews, then to American pilots in Vietnam, who bought them at the base exchange with their own money.' }
  ]
};
W.gmtFake = {
  name: 'a “GMT-Master 1675”', sub: 'Uncle Wing’s examination piece',
  cfg: { mm: 40, metal: 'polished', bezel: { type: 'gmt', color: '#e23a2a', color2: '#2a56c8', bold: true }, crown: { guards: true }, bph: 19800,
    dial: { color: '#0d0d0f', finish: 'gloss', track: 'ticks', indices: 'sub', applied: 'steel', lume: 'fresh', ink: '#f3f3f3', date: { pos: 3, cyclops: true, at: 0.66 }, text: [{ t: 'GMT-MASTER', y: 0.3, s: 5.4, ls: 0.8 }, { t: 'OFFICIALLY CERTIFIED', y: 0.4, s: 3.6, ls: 0.6, x: 0.03 }], arc: 'SWISS – T < 25' },
    hands: { style: 'mercedes', color: 'steel', lume: 'luminova', seconds: 'center', gmt: { color: '#ff7a1a', at: 15 } }, strap: { type: 'bracelet', kind: 'oyster' },
    back: { lines: [] } },
  views: ['dial', 'uv'],
  verdict: 'A lesson, not a watch.',
  obs: [
    { id: 'bezel', v: 'dial', at: at(50, 0.86), r: 0.15, t: 'A loud bezel', x: 'The red is a tomato, the blue is a swimming pool, and the numerals are a size too fat. An old aluminium insert fades toward pink and sky; collectors call the palest ones [[ghosts|ghost bezel]]. This one was anodised last year.' },
    { id: 'lume', v: 'dial', at: at(60, 0.6), r: 0.13, t: 'White dots', x: 'Hour plots as white as teeth, in a dial that claims 1968. Old tritium goes cream, then custard.' },
    { id: 'tmark', v: 'dial', at: [0, 0.68], r: 0.13, t: 'SWISS – T < 25', x: 'The dial says [[tritium]], in print. Remember that when the lights go off.' },
    { id: 'hand', v: 'dial', at: at(225, 0.5), r: 0.15, t: 'An orange hand', x: 'The 24-hour hand should be red, with a small triangle. This one is orange and a size large: the part from a later, cheaper watch.' },
    { id: 'glow', v: 'uv', at: [0, -0.1], r: 0.9, t: 'Two different greens', x: 'The dial plots blaze one green and the hands blaze another. Printed tritium would be nearly dead by now. Nothing here is the age it says it is, and nothing here is the same age as anything else.' }
  ]
};
W.dialBlank = { name: 'a dial blank', cfg: s => ({ mm: 40, metal: 'brass', lugs: 'none', strap: null, crown: { pos: 0 }, noHands: true, bezel: { type: 'none' }, dial: { color: '#243a5c', finish: 'sunburst', track: 'none', indices: 'none', ink: '#f2f2f2' } }) };
W.dialPrinted = { name: 'a printed dial', cfg: s => ({ mm: 40, metal: 'brass', lugs: 'none', strap: null, crown: { pos: 0 }, noHands: true, bezel: { type: 'none' }, dial: { color: '#243a5c', finish: 'sunburst', track: 'ticks', indices: 'none', ink: '#f2f2f2', text: [{ t: 'CORÉMONT', y: -0.36, s: 9.5, f: 'serif', w: 600, ls: 1.8 }, { t: 'DEPUIS 1921', y: -0.22, s: 4.8, ls: 1.6 }, { t: 'AUTOMATIC', y: 0.36, s: 4.8, ls: 1.4 }], logo: 'spiral', logoY: -0.54 } }) };

/* ---- the Jura ---- */
W.cal13 = {
  name: 'Corémont calibre 13‴', sub: 'one of a gross · finished 1976 · never cased',
  cfg: { mm: 36, metal: 'brass', lugs: 'none', strap: null, crown: { pos: 0 }, bph: 18000, mov: { type: 'manual', finish: 'rhodium', swan: true, chatons: true, blue: true, text: [{ t: 'N° 96', x: -0.46, y: 0.7, s: 8.5, f: 'serif', i: true }] } },
  views: ['movement'], stopped: true,
  obs: [
    { id: 'same', v: 'movement', at: [-0.3, -0.5], r: 0.3, t: 'The same stripes', x: 'The same bridges, the same blued screws, the same gold collars round the jewels as the one on your wrist. A [[ligne]] is an old French unit, a twelfth of an inch; thirteen lignes is about 29 millimetres. This is its twin.' },
    { id: 'reg', v: 'movement', at: [0.76, -0.3], r: 0.15, t: 'Dead centre', x: 'The regulator sits exactly between A and R. So does the next one. So, when you check, does every one in the box.' },
    { id: 'num', v: 'movement', at: [-0.39, 0.59], r: 0.15, t: 'N° 96', x: 'This box runs from 85 to 96. Twelve boxes. A hundred and forty-four: a [[gross]].' },
    { id: 'still', v: 'movement', at: [0.39, -0.2], r: 0.25, t: 'A balance that is not moving', x: 'Asleep for fifty years. The oil will have dried to varnish. It would need to be taken apart, cleaned, oiled, and listened to. Every one of them would.' }
  ]
};

/* =====================================================================
   THE ROLL
   ===================================================================== */
G.slots = [
  { id: 'field', num: 'I', short: 'celle de Papa', fr: 'W.W.W., 1945. Celle de Papa.', en: 'The Army watch, 1945. Papa’s.', sold: 'Vendue 1978 — le bail de la boutique.', soldEn: 'Sold 1978 — the lease on the shop.' },
  { id: 'dress', num: 'II', short: 'la Corémont', fr: 'Corémont extra-plate, 1962. D’Émile, pour moi.', en: 'The Corémont dress watch, 1962. From Émile, for me.', sold: 'Vendue 1984 — les dents de Claire.', soldEn: 'Sold 1984 — Claire’s teeth.' },
  { id: 'diver', num: 'III', short: 'la Compressor', fr: 'Super Compressor, 1964. Celle d’Émile.', en: 'The Super Compressor, 1964. Émile’s.', sold: 'Vendue 1987 — l’université de Claire, première année.', soldEn: 'Sold 1987 — Claire’s university, first year.' },
  { id: 'chrono', num: 'IV', short: 'le chrono', fr: 'Chronographe, 1969. Payé par moi.', en: 'The chronograph, 1969. Paid for by me.', sold: 'Vendue 1991 — l’hiver où la boutique a failli fermer.', soldEn: 'Sold 1991 — the winter the shop nearly closed.' },
  { id: 'quartz', num: 'V', short: 'l’ennemi', fr: 'Seiko à quartz, 1973. L’ennemi. Magnifique.', en: 'The Seiko quartz, 1973. The enemy. Magnificent.', sold: 'Rendue 1998 — à M. Sakamoto, Suwa. 1 $.', soldEn: 'Returned 1998 — to Mr. Sakamoto, Suwa. One dollar.' },
  { id: 'gmt', num: 'VI', short: 'l’heure d’avant', fr: 'Airman 24 heures, 1976. L’heure d’avant.', en: 'The 24-hour Airman, 1976. The time before.', sold: 'Vendue 1994 — Lou est là. Je n’ai plus besoin de l’heure d’avant.', soldEn: 'Sold 1994 — Lou is here. I no longer need the time before.' },
  { id: 'seven', num: 'VII', short: 'la mienne', fr: 'La mienne.', en: 'Mine.', sold: '', soldEn: '' }
];

/* =====================================================================
   THE CARNET — her pages
   ===================================================================== */
G.pages = [
  { id: 'letter', num: '', title: 'Pour Lou', body: [
    'Lou —',
    'Seven watches taught me everything I know. Six are gone. I let them go myself, one at a time, and I would do it again.',
    'I can’t give them back to you. But every watch has sisters: the same reference, the same year, made on the same benches. If you want to know me, go and find the sisters. Hold them. Listen to them. Put each one in the pocket where mine used to sleep.',
    'Don’t read ahead. You couldn’t anyway. I have written these pages the way we speak at the bench, and you never learned to speak it. That is my fault as much as yours.',
    'When six pockets are full, the seventh watch will explain the rest.',
    '— B.' ] },
  { id: 'field', num: 'I', title: 'Celle de Papa', when: '1945 – 1978', sketch: 'cymaA',
    fr: 'Cal. 234, 15 rubis, ancre. Boîte acier, fond vissé, anses fixes. Cadran noir, chemin de fer, radium. Refusée au contrôle — un point à 7 h décentré.',
    body: [
      'Papa assembled them at Cyma in the spring of 1945: black dials, for the English army. Every one was inspected by a man from their Ministry who had a loupe and no sense of humour. This one he refused. A single luminous dot, at seven o’clock, sat a hair off its mark.',
      'Papa bought it at the staff price and wore it until he died, in 1955.',
      'Maman painted dials like it. Not for Cyma; for whoever paid. At the kitchen table, with a glass rod and a little pot of radium paste. On winter nights, when the lamp was out, the table glowed. We thought it was pretty.',
      'I wore it to my first day at Corémont. I was seventeen, it was far too big for my wrist, and I did not care.',
      'What it taught me: a watch is for reading. A soldier in the rain has one second to look. Everything on a dial that does not help him is decoration, and decoration should have to argue for its place.' ],
    sold: 'Vendue 1978, rue Sainte-Catherine. First and last month’s rent on the shop. Papa would have understood. He liked rent to be paid.' },
  { id: 'dress', num: 'II', title: 'La Corémont', when: '1962 – 1984', sketch: 'coremontA',
    fr: 'Boîte or 18 ct, 33 mm, extra-plate. Cal. 10½‴, 17 rubis. Réglage plat et pendu, 2 pos. Cadran argenté, index appliques or, aiguilles dauphine.',
    body: [
      'Émile gave it to me on the fourteenth of April 1962, on the steps of the mairie, instead of a ring. He said I would look at a watch more often.',
      'He had gone to the foreman and asked which batch was mine. So the watch he bought me was one I had adjusted myself: my hairspring, my forty minutes at the bench, and CORÉMONT on the dial in gold.',
      'By then I had regulated some four thousand of their watches. This was the first I was allowed to keep, and I had to get married to do it.',
      'Émile said: one day there will be one with your name on it. I said: don’t be silly, régleuses don’t have names. He said: then we will find another way to write it.',
      'What it taught me: thin is difficult. Anybody can make a thing strong by making it thick.' ],
    sold: 'Vendue 1984. Les dents de Claire. She smiled with her mouth shut for a year and I could not stand it.' },
  { id: 'diver', num: 'III', title: 'La Compressor d’Émile', when: '1964 – 1987', sketch: 'enicarA',
    fr: 'Boîte E.P.S.A. « Super Compressor », 2 couronnes, lunette intérieure tournante. Fond à ressort — plus ça serre, mieux ça tient. Automatique.',
    body: [
      'In 1963 Émile left the gold-case workshop and went down to Bassecourt, to Piquerez, where the money was: waterproof cases, for the Americans. He came home on Fridays smelling of cutting oil.',
      'This is one of his. He was proud of the principle and explained it to everybody, including people who had not asked. The deeper it goes, the harder the water presses the back against its seal. *Plus ça serre, mieux ça tient.* The harder it’s squeezed, the better it holds. He said a marriage ought to be built like that.',
      'He died in February 1974, at his bench, forty-one years old, the month they laid off half the workshop. I found out then that it is also how a widow is built.',
      'What it taught me: a case is a promise. The movement is the one who has to keep it.' ],
    sold: 'Vendue 1987. Claire, université, première année. Émile would have sold it faster than I did.' },
  { id: 'chrono', num: 'IV', title: 'Le chrono', when: '1969 – 1991', sketch: 'chronoA',
    fr: 'Valjoux 7733, 17 rubis, chrono 2 compteurs, 30 min. Came. Boîte acier 37 mm, tachymètre. Tritium.',
    body: [
      'July 1969, a shop in the rue Neuve, two weeks’ wages. The week the Americans walked on the Moon.',
      'Not for the Moon. The year before, the directors had given M. Jacot a gold watch for “his” result at the Observatory. I wanted something on my wrist that I had paid for myself, and that could count.',
      'I used it at the bench. So many minutes dial up; so many crown down. A chronograph is a watch that admits some minutes matter more than others.',
      'What it taught me: two buttons, three hands too many, a scale round the edge, and still you can read it at a glance. Complication is not the enemy of clarity. Carelessness is.' ],
    sold: 'Vendue 1991 — the winter the shop nearly closed. I timed the bailiff with it first. Eleven minutes.' },
  { id: 'quartz', num: 'V', title: 'L’ennemi', when: '1973 – 1998', sketch: 'seikoQR',
    fr: 'Seiko 3863, quartz. Pas de balancier. Pas de spiral. Moteur pas-à-pas. ± 15 s par MOIS. Démontée, comprise, remontée.',
    body: [
      'June 1973. I bought the enemy at a jeweller’s in Bienne, where nobody knew me, with cash, like a spy.',
      'I took it apart on the kitchen table after Claire was asleep. No balance. No hairspring. A sliver of stone that sings thousands of times a second, a circuit that counts the song, and a motor the size of a lentil.',
      'M. Jacot said: a toy. I put it back together and wore it for a month against my best work. It beat my best work. It beat everybody’s.',
      'I wrote on the box: L’ENNEMI. Then underneath, because I am honest about watches if about nothing else: MAGNIFIQUE.',
      'What it taught me: after 1973 nobody needed my hands in order to know the time. If they were ever going to want my work again, it would have to be for some other reason. It took me twenty years to learn what the reason was.',
      '*(in different ink)* 1998. A gentleman came into the shop for a battery. Not the enemy. Hands, like mine.' ],
    sold: 'Rendue 1998, à M. Sakamoto, de Suwa. One dollar. It was never really mine.' },
  { id: 'gmt', num: 'VI', title: 'L’heure d’avant', when: '1976 – 1994', sketch: 'airmanA',
    fr: 'Glycine Airman, 24 h. Stop-seconde à 24. Lunette 24 h tournante, blocage à 4 h. Aiguilles sur Montréal; lunette + 6.',
    body: [
      'October 1976, the week before the aeroplane. A pilot’s watch, for a woman who had never flown. Twenty-four hours on the dial: the whole day in one turn of the hand.',
      'I set the hands to Montréal and turned the bezel six hours on, to home. For eighteen years I could look down and know what time it was in the rue du Nord: whether the factory siren would be going (there was no factory), whether Maman’s kitchen light would be on (there was no Maman).',
      'Claire called it the sad watch. She was ten, and she was right.',
      'What it taught me: a watch can hold a place as well as an hour.' ],
    sold: 'Vendue 1994. Lou est là. I don’t need the time before any more. I only want the time Lou is in.' },
  { id: 'seven', num: 'VII', title: 'La mienne', when: '1976 –', sketch: s => G.heirloomCfg(s),
    fr: 'Mouvement : 13‴, N° 7. Boîte : É.C., en perruque, hiver 73. Cadran : blanc. Aiguilles : bleuies à la lampe, par moi.',
    body: [
      'The movement: Corémont thirteen lignes, N° 7. Mine. Forty-four nights in 1967. They put M. Jacot’s name on the bulletin. I put mine under the dial, where it would keep.',
      'The case: Émile’s. Made *en perruque* in the winter of 1973, on the firm’s lathes, after hours, for a watch that did not exist yet. He never saw what went into it.',
      'The dial: from Yvette’s brother at the dial works. Finished, lacquered, twelve markers set by hand. Then he asked me what to print on it, and I said: nothing. Leave it *blanche*.',
      'The hands: I blued them myself over the spirit lamp, the night the factory closed.',
      'Papa’s plainness. The Corémont’s thinness. Émile’s seal. The chrono’s discipline. The enemy’s lesson. The Airman’s homesickness. All six are in it. It is the only watch I ever designed, and nobody will ever know, which is how régleuses sign.',
      'They gave Jacot the medal. I took the movement. I consider us even.' ] },
  { id: 'last', num: '', title: 'La dernière page', hidden: true, body: [
    'Claire. Lou.',
    'If you are reading this then Yvette has kept her word for longer than anyone should have to, and you owe her a good lunch.',
    'Claire: you found the tags. I know you, so I know what you think they say. They are not a bill. I did not sell those watches *for* you, as if you were a debt. I traded them. Six things I loved for one person I loved more, and I would make the same trade again before the second hand came round.',
    'Lou: the dial is blank because nobody would print my name on one. So I made the whole dial say it. But a blank is also where every dial begins.',
    'There are a hundred and forty-four movements in these boxes. I adjusted every one, and they are as good as anything I ever did. There are a hundred and forty-four dials with nothing on them. There is one drawing of a case, by your grandfather.',
    'You can leave all of it exactly as it is, *ma petite seconde*, and I will not mind. Or you can do the thing I never dared.',
    'Print something.',
    '— B.' ] }
];

/* =====================================================================
   WORDS
   ===================================================================== */
G.terms = {
  'crown': { t: 'Crown', d: 'The knob on the side of the case. Turn it to wind the mainspring; pull it out to set the hands.' },
  'crystal': { t: 'Crystal', d: 'The clear cover over the dial. Acrylic (plastic) on most older watches: it scratches easily and polishes out. Sapphire on modern ones: very hard to scratch, possible to shatter.' },
  'lume': { t: 'Lume', d: 'Luminous paint on hands and markers, so the time can be read in the dark. The material changed over the century, radium, then tritium, then Super-LumiNova, and each one ages differently. That makes it a clock inside the clock.' },
  'blued steel': { t: 'Blued steel', d: 'Steel heated slowly to about 290 °C, when its surface turns a deep cornflower blue. A few seconds too long and it goes grey. Done by eye.' },
  'small seconds': { t: 'Small seconds', d: 'A seconds hand on its own little sub-dial, usually at six o’clock, instead of in the centre. The older arrangement, and the simpler one mechanically. French: *petite seconde*.' },
  'service mark': { t: 'Service mark', d: 'Watchmakers traditionally scratch their initials and the date inside the caseback each time they service a watch. A good old watch carries a column of them: a guest book.' },
  'balance': { t: 'Balance', d: 'The wheel that swings back and forth and divides time into equal beats. It is to a watch what a pendulum is to a clock.' },
  'hairspring': { t: 'Hairspring', d: 'The spiral spring that pulls the balance back to centre on every swing. Its effective length sets the rate of the watch. French: *spiral*.' },
  'regulator': { t: 'Regulator', d: 'A small lever on the balance cock that shortens or lengthens the working part of the hairspring. Marked A/R in French (*avance, retard*) or F/S in English.' },
  'mainspring': { t: 'Mainspring', d: 'A long ribbon of spring steel coiled inside a drum called the barrel. Winding tightens it; its slow unwinding drives the watch.' },
  'jewels': { t: 'Jewels', d: 'Synthetic ruby bearings for the fastest-wearing pivots. Seventeen covers everything that needs one in a simple hand-wound watch. More than that is either a complication or an advertisement.' },
  'movement': { t: 'Movement', d: 'The mechanism of a watch: everything inside the case that isn’t the dial or hands.' },
  'calibre': { t: 'Calibre', d: 'A particular design of movement, known by a name or number. “Valjoux 7733” and “Corémont 13‴” are calibres.' },
  'beat rate': { t: 'Beat rate', d: 'How many times the balance ticks per hour. 18,000 is five ticks a second, the old standard. 28,800 is eight. 36,000, ten, is “high-beat”. Faster is steadier, and harder on the oil.' },
  'power reserve': { t: 'Power reserve', d: 'How long a fully wound watch runs before it stops. About forty hours for most older watches: long enough to forget one morning, not two.' },
  'timing machine': { t: 'Timing machine', d: 'A microphone that listens to the tick and draws it. A level line means the watch keeps time; a rising one, that it gains; a falling one, that it loses. Before the 1930s, the only way to know was to wait a day and look.' },
  'beat error': { t: 'Beat error', d: 'When the tick and the tock are not evenly spaced because the balance does not rest dead centre. On a timing machine it shows as two parallel lines instead of one.' },
  'chronometer': { t: 'Chronometer', d: 'Not the same as a chronograph. A watch whose accuracy has been independently tested. Today’s Swiss standard, COSC, allows a mechanical watch to lose four or gain six seconds a day.' },
  'automatic': { t: 'Automatic', d: 'A mechanical watch that winds itself from the motion of the wearer’s arm. Also “self-winding”.' },
  'rotor': { t: 'Rotor', d: 'The weighted half-disc in an automatic watch. It swings as you move and winds the mainspring through a set of gears.' },
  'quartz': { t: 'Quartz', d: 'A watch regulated by a vibrating quartz crystal and powered by a battery. An ordinary one is ten times or more as accurate as a fine mechanical watch, and has a fraction of the parts.' },
  'quartz crisis': { t: 'Quartz crisis', d: 'The 1970s and early 80s, when cheap, accurate electronic watches from Japan, America and Hong Kong collapsed the Swiss mechanical industry. Swiss watchmaking jobs fell from about 90,000 to about 30,000.' },
  'ébauche': { t: 'Ébauche', d: 'A movement supplied as a kit or blank by a specialist factory, for a brand to finish, adjust and case. Most “Swiss watch brands” in history did not make their own movements.' },
  'ligne': { t: 'Ligne', d: 'The old French unit still used for movement diameters: one twelfth of a French inch, about 2.26 mm. Written with three ticks: 13‴.' },
  'gross': { t: 'Gross', d: 'Twelve dozen: 144. Watch parts were counted, ordered and boxed by the dozen and the gross.' },
  'régleuse': { t: 'Régleuse', d: 'A woman who fits and adjusts hairsprings: pinning, counting, truing, timing. Skilled, badly paid, and for most of the twentieth century almost always a woman. The men who did the same work for competitions were called *régleurs de précision*, and got their names printed.' },
  'établissage': { t: 'Établissage', d: 'The traditional Swiss system: a watch is assembled by an *établisseur* from parts made in dozens of independent workshops, case from one, dial from another, hands from a third. The name on the dial belongs to whoever put it together.' },
  'perruque': { t: 'Perruque', d: '“The wig”. French workshop slang for making something for yourself with the employer’s tools, on the employer’s time. *Faire la perruque.*' },
  'reference': { t: 'Reference', d: 'A maker’s model number. Two watches of the same reference are the same design: “sisters”.' },
  'patina': { t: 'Patina', d: 'The marks of age on a dial or lume: yellowing, freckling, fading. Because it can’t be honestly reproduced, collectors treat it as proof, and often as beauty.' },
  'redial': { t: 'Redial', d: 'A dial that has been stripped and repainted. It looks newer and is worth far less, because the one irreplaceable part of the watch is gone. The signature is where repainters most often slip.' },
  'service dial': { t: 'Service dial', d: 'A genuine replacement dial fitted later by the maker or, for military watches, by the armed forces. Not original, not fake. Collectors argue about what it is worth.' },
  'relume': { t: 'Relume', d: 'Fresh luminous paint applied over, or in place of, the original. Sometimes tinted to look aged.' },
  'matching lume': { t: 'Matching lume', d: 'When hands and dial have aged to the same colour, they have very probably been together since the factory. Mismatched lume means something was replaced.' },
  'frankenwatch': { t: 'Frankenwatch', d: 'A watch assembled from the parts of several: this case, that dial, someone else’s hands. Every part may be genuine. The watch never existed.' },
  'polishing': { t: 'Polishing', d: 'Buffing a case to remove scratches. It also removes metal, and with it the sharp edges and bevels the case-maker cut. An unpolished case with honest scratches is worth more than a shiny round one.' },
  'hallmark': { t: 'Hallmark', d: 'An official stamp on precious metal showing its purity, and often where and by whom it was tested.' },
  'private label': { t: 'Private label', d: 'A watch made by suppliers and signed with the name of the shop or company that ordered it.' },
  'provenance': { t: 'Provenance', d: 'The documented history of who owned an object. In an auction room it can be worth more than the object.' },
  'radium': { t: 'Radium', d: 'Radioactive luminous paint, used from the 1910s to about 1960. It glowed without needing light, and it harmed the people who painted it. Old radium turns brown and stops glowing but stays radioactive.' },
  'tritium': { t: 'Tritium', d: 'A milder radioactive lume, used from about 1960 to the late 1990s. Dials are marked T or “T < 25”. It ages from white through cream to custard, and its glow halves about every twelve years.' },
  'super-luminova': { t: 'Super-LumiNova', d: 'Modern non-radioactive lume, developed in Japan in the 1990s. It charges in light and glows brightly for hours. On a watch said to be older than that, it means repainting.' },
  'broad arrow': { t: 'Broad arrow', d: 'The three-stroke mark of British government property, used since the sixteenth century and stamped on service watches.' },
  'nato strap': { t: 'NATO strap', d: 'A one-piece nylon strap that threads behind the watch, so that it stays on the wrist even if a bar breaks. British military issue from 1973; the name comes from its stock number.' },
  'applied indices': { t: 'Applied indices', d: 'Hour markers made as separate pieces of metal and fixed to the dial, rather than printed on it.' },
  'extra-plat': { t: 'Extra-plat', d: 'Extra-flat. A very thin watch. Thinness is hard: every part has less room to be strong in.' },
  'epsa': { t: 'EPSA', d: 'Ervin Piquerez S.A., a case-maker in Bassecourt in the Swiss Jura. Its patented waterproof cases were sold to dozens of brands in the 1950s and 60s.' },
  'super compressor': { t: 'Super Compressor', d: 'EPSA’s case design of 1956: the caseback is sprung, so rising water pressure squeezes it tighter onto its seal. Usually recognisable by two crowns and a rotating ring under the crystal.' },
  'unidirectional bezel': { t: 'Unidirectional bezel', d: 'A dive bezel that turns only anticlockwise. If it is knocked, it can only make the dive look longer than it was, never shorter. The error is always on the side of air.' },
  'helium valve': { t: 'Helium escape valve', d: 'A one-way valve that lets helium out of a watch case. Needed only by saturation divers living for weeks in a pressurised helium atmosphere; without it the gas that has crept in blows the crystal off on the way back up.' },
  'chronograph': { t: 'Chronograph', d: 'A watch with a built-in stopwatch. Not the same as a chronometer.' },
  'register': { t: 'Register', d: 'A small counter dial on a chronograph, totalling elapsed minutes or hours.' },
  'panda dial': { t: 'Panda dial', d: 'A white chronograph dial with black registers. The reverse, black with white, is a “reverse panda”.' },
  'tachymeter': { t: 'Tachymeter', d: 'A scale that turns the time taken to cover one mile or kilometre into a speed.' },
  'column wheel': { t: 'Column wheel', d: 'A small castle-shaped wheel that co-ordinates a chronograph’s start, stop and reset. Costlier to make than the alternative, a flat cam, and smoother under the finger.' },
  'hacking': { t: 'Hacking', d: 'When pulling the crown stops the seconds hand, so that a watch can be set to the exact second. A military requirement.' },
  'ghost bezel': { t: 'Ghost bezel', d: 'An aluminium bezel insert that has faded pale with sun and salt. Like most collectors’ nicknames, a flaw renamed as a virtue.' },
  'estimate': { t: 'Estimate', d: 'The price range an auction house prints in its catalogue. Set low on purpose: a result “five times the estimate” is its own advertisement.' },
  'buyer’s premium': { t: 'Buyer’s premium', d: 'The auction house’s fee, added on top of the winning bid: commonly around a quarter more.' },
  'hammer': { t: 'Hammer price', d: 'The winning bid at auction, before the buyer’s premium is added.' },
  'swiss made': { t: 'Swiss Made', d: 'A legal label. Since 2017: at least 60% of the manufacturing cost Swiss, a Swiss movement, cased and inspected in Switzerland. The rest may come from anywhere.' },
  'pad printing': { t: 'Pad printing', d: 'How dials are printed. A soft silicone pad lifts ink from an engraved plate and presses it onto the dial. One press per colour.' },
  'dial blank': { t: 'Dial blank', d: 'A finished dial that has not yet been printed.' },
  'microbrand': { t: 'Microbrand', d: 'A very small watch company, often one or two people, that designs its own watches, has them built by specialist suppliers, and sells directly to customers online.' },
  'integrated bracelet': { t: 'Integrated bracelet', d: 'A bracelet designed as one continuous form with the case, rather than attached between lugs.' },
  'observatory trials': { t: 'Observatory trials', d: 'Annual accuracy competitions held at the observatories of Neuchâtel and Geneva. Movements were tested for weeks in several positions and temperatures; makers entered their best, prepared by their best adjusters.' },
  'field watch': { t: 'Field watch', d: 'A plain, tough, legible watch descended from military issue: dark dial, bold numerals, nothing decorative. The test is whether it can be read in one second in bad light.' },
  'buy the seller': { t: 'Buy the seller', d: 'The oldest rule in collecting. You can never know everything about a watch, but you can judge the person selling it: what they tell you unasked, and whether they will still be there next week.' },
  'dress watch': { t: 'Dress watch', d: 'A thin, simple watch meant to disappear under a cuff: usually precious metal, usually no date, often no seconds hand. Hard to design, because there is nowhere to hide a mistake.' },
  'sterile dial': { t: 'Sterile dial', d: 'A dial with no maker’s name. Usually ordered that way by armed forces or intelligence services, so that a captured watch says nothing about where it came from.' },
  'saturation diving': { t: 'Saturation diving', d: 'Living for days or weeks in a pressurised chamber at the depth of the work, breathing a helium mix, so that the long decompression only has to be done once at the end.' },
  'ten past ten': { t: 'Ten past ten', d: 'Watches in photographs are almost always set to about 10:10. The hands frame the name on the dial, clear the sub-dials, and turn up at the corners like a smile.' },
  'bulletin': { t: 'Bulletin', d: 'The certificate an observatory issued for a watch that passed its trials, listing its daily rates and the name of the person who adjusted it.' }
};
})();
