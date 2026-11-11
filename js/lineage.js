/* UNSIGNED — the Lineage board: real watches, real dates.
   Each node is unlocked by id from the story. `from` lists direct ancestors
   or influences (drawn as links). `cfg` is a Watch.svg config for the thumbnail.
   Nodes flagged act2 stay as "?" until Act II. */
(function () {
'use strict';

const STEEL_BR = { type: 'bracelet' };
const tri = (c, ink, hand) => [
  { pos: 3, r: 0.23, type: '30min', color: c, ink: ink, hand: hand },
  { pos: 6, r: 0.23, type: '12h', color: c, ink: ink, hand: hand },
  { pos: 9, r: 0.23, type: 'seconds', color: c, ink: ink, hand: hand }
];

window.Lineage = {
  families: [
    { id: 'origins', name: 'Origins' },
    { id: 'field', name: 'Field' },
    { id: 'dress', name: 'Dress & everyday' },
    { id: 'pilot', name: 'Pilot & travel' },
    { id: 'dive', name: 'Dive' },
    { id: 'chrono', name: 'Chronograph' },
    { id: 'electric', name: 'Electric & quartz' },
    { id: 'luxe', name: 'Sport-luxe' },
    { id: 'revival', name: 'Revival & independents' }
  ],

  nodes: [
    /* ------------------------------ ORIGINS ------------------------------ */
    {
      id: 'wristlet', fam: 'origins', year: 1810, name: 'The wristlet', maker: 'Breguet; Patek Philippe',
      line: 'The first wristwatches were jewels for queens. Men carried pockets.',
      text: 'In 1810 Caroline Murat, Queen of Naples, ordered from Breguet an oval repeating watch on a bracelet of hair and gold thread; it was delivered in 1812. In 1868 Patek Philippe made a bracelet watch for the Hungarian Countess Koscowicz. For a century the “wristlet” stayed a woman’s ornament. Men kept their watches in a pocket, on a chain.',
      from: [],
      cfg: { mm: 27, shape: 'tonneau', metal: 'gold', lugW: 10, bezel: { type: 'thin' }, crown: { pos: 3, size: 0.7 }, dial: { color: '#ece9df', finish: 'guilloche', track: 'none', indices: 'breguet', numFont: 'serif', numItalic: true, numSize: 0.2, ink: '#26221a' }, hands: { style: 'breguet', color: 'blued', seconds: 'none' }, strap: { type: 'canvas', color: '#b89a54' } }
    },
    {
      id: 'santos', fam: 'origins', year: 1904, name: 'Santos-Dumont', maker: 'Cartier',
      line: 'A pilot couldn’t reach his pocket. Cartier put the watch on his wrist.',
      text: 'The aviator Alberto Santos-Dumont complained to his friend Louis Cartier that he couldn’t check a pocket watch with both hands on the controls. Cartier’s answer, in 1904, was a flat square watch on a leather strap, with the bezel screws left showing. Sold to the public from 1911, it was among the first wristwatches designed for a man with a job to do.',
      from: ['wristlet'],
      cfg: { mm: 35, shape: 'square', metal: 'gold', bezel: { type: 'screws' }, dial: { color: '#f3efe2', track: 'railroad', trackAt: 0.6, indices: 'roman', numAt: 0.8, numSize: 0.26, numFont: 'serif', ink: '#1a1a1a' }, hands: { style: 'sword', color: 'blued', seconds: 'none' }, strap: { type: 'leather', color: '#3a1f14' } }
    },
    {
      id: 'trench', fam: 'origins', year: 1915, name: 'The trench watch', maker: 'many makers',
      line: 'War solders wire lugs to a pocket watch, and men never go back.',
      text: 'Officers in the First World War needed both hands and the exact time: barrages were timed to the minute. Small pocket watches gained soldered wire lugs, luminous radium numerals, and sometimes a metal grille to guard the glass. The men who survived came home wearing them. By the 1930s wristwatches were outselling pocket watches, and the “wristlet” was no longer a woman’s thing.',
      from: ['wristlet'],
      cfg: { mm: 34, metal: 'silver', lugs: 'wire', bezel: { type: 'thin' }, crown: { pos: 3, kind: 'onion' }, dial: { color: '#f4f0e4', finish: 'enamel', track: 'railroad', indices: 'trench', red12: true, lume: 'radium', ink: '#222', numSize: 0.21, sub: [{ pos: 6, r: 0.24 }] }, hands: { style: 'cathedral', color: 'blued', lume: 'radium', seconds: 'sub' }, strap: { type: 'leather', color: '#6a4a2c' }, wear: { cracks: 3 } }
    },

    /* ------------------------------- FIELD ------------------------------- */
    {
      id: 'a11', fam: 'field', year: 1942, name: 'A-11', maker: 'Elgin, Waltham, Bulova',
      line: 'Black dial, white numerals, hacking seconds: a specification, not a model.',
      text: 'The A-11 was a US military specification of the Second World War, built in huge numbers by Elgin, Waltham and Bulova. A small case, a black dial, white numerals, and a seconds hand that stopped when the crown was pulled, so that a whole aircrew could set their watches to the same second. It is sometimes called the watch that won the war.',
      from: ['trench'],
      cfg: { mm: 32, metal: 'chrome', bezel: { type: 'coin' }, dial: { color: '#121210', track: 'ticks', indices: 'arabic', ink: '#eeeade', numSize: 0.19, numAt: 0.7 }, hands: { style: 'pencil', color: 'white', seconds: 'center', secColor: 'white' }, strap: { type: 'canvas', color: '#6a6846' } }
    },
    {
      id: 'www', fam: 'field', year: 1945, name: 'W.W.W. “Dirty Dozen”', maker: 'twelve makers',
      line: 'One British specification, twelve makers, about 150,000 watches.',
      text: 'Late in the war the British War Office wrote a single specification, Watch, Wristlet, Waterproof, and twelve makers built to it: Buren, Cyma, Eterna, Grana, Jaeger-LeCoultre, Lemania, Longines, IWC, Omega, Record, Timor and Vertex. Black dial, railway minute track, small seconds, luminous hands, and the broad arrow of Crown property. Collectors later nicknamed them the Dirty Dozen, after the film.',
      from: ['trench'],
      cfg: { mm: 37, metal: 'chrome', bezel: { type: 'smooth' }, dial: { color: '#15140f', track: 'railroad', indices: 'www', ink: '#e9e4d2', lume: 'radium', pips: true, numSize: 0.19, logo: 'broadarrow', logoY: -0.2, sub: [{ pos: 6, r: 0.27 }] }, hands: { style: 'pencil', color: 'white', lume: 'radium', seconds: 'sub' }, strap: { type: 'nato', color: '#5d5a43' } }
    },
    {
      id: 'explorer', fam: 'field', year: 1953, name: 'Explorer', maker: 'Rolex',
      line: 'The field watch goes up a mountain and comes back a civilian.',
      text: 'Rolex supplied Oyster Perpetuals to the 1953 British Everest expedition and launched the Explorer that year on the strength of it: a plain steel watch with a black dial and big luminous 3, 6 and 9. Which watch Hillary actually had on at the summit is still argued over; Smiths claimed it too. Either way, the tool watch became something you could wear to the office.',
      from: ['www', 'perpetual'],
      cfg: { mm: 36, metal: 'steel', bezel: { type: 'smooth' }, dial: { color: '#0d0d0f', track: 'ticks', indices: 'explorer', lume: 'tritium', ink: '#eee' }, hands: { style: 'mercedes', color: 'steel', lume: 'tritium', seconds: 'center' }, strap: STEEL_BR }
    },
    {
      id: 'khaki', fam: 'field', year: 1964, name: 'US-issue field watch', maker: 'Benrus, Hamilton and others',
      line: 'The Vietnam-era field watch: small, plain, and meant to be used up.',
      text: 'American specifications of the 1960s, MIL-W-46374 for general issue and the related GG-W-113, produced small matte watches with a 24-hour inner scale and hacking seconds, made by Benrus, Hamilton and others. Some were built to be thrown away rather than repaired. Hamilton later sold the same look to civilians as the Khaki, and it is still the template for most field watches made today.',
      from: ['a11'],
      cfg: { mm: 34, metal: 'titanium', bezel: { type: 'smooth' }, dial: { color: '#121311', track: 'ticks', indices: 'arabic', ink: '#ecebe2', numSize: 0.17, numAt: 0.68, lume: 'tritium', pips: true }, hands: { style: 'syringe', color: 'white', lume: 'tritium', seconds: 'center', secColor: 'white' }, strap: { type: 'nato', color: '#565a3c' } }
    },
    {
      id: 'w10', fam: 'field', year: 1967, name: 'W10', maker: 'Smiths',
      line: 'The last service watch made, movement and all, in England.',
      text: 'Smiths of Cheltenham made the W10 for the British Army from about 1967 to 1970: black dial, sword hands, a circled T for its tritium paint, and a movement built in England rather than bought from Switzerland. When the contract ended, so did serially made English watches for the forces. The next issue watches came from Hamilton and CWC, and were Swiss.',
      from: ['www'],
      cfg: { mm: 35, metal: 'steel', bezel: { type: 'smooth' }, dial: { color: '#111210', track: 'railroad', indices: 'arabic', ink: '#eeeade', numSize: 0.18, numAt: 0.69, lume: 'tritium', pips: true, text: [{ t: 'SMITHS', y: -0.36, s: 7.5 }], logo: 'circleT', logoY: 0.3 }, hands: { style: 'sword', color: 'white', lume: 'tritium', seconds: 'center', secColor: 'white' }, strap: { type: 'nato', color: '#777c7e' } }
    },
    {
      id: 'g10', fam: 'field', year: 1980, name: 'G10', maker: 'CWC',
      line: 'The field watch goes quartz. A battery hatch replaces the winding ritual.',
      text: 'CWC, the Cabot Watch Company, began supplying the British forces in the 1970s and in 1980 delivered the G10: the familiar black dial and sword hands, now with a quartz movement and a battery hatch in the case back. The name comes from the G1098 form used to draw one from stores. The grey nylon strap drawn from the same stores is what the world now calls a NATO.',
      from: ['w10', 'seikoqr'],
      cfg: { mm: 36, shape: 'tonneau', metal: 'steel', quartz: true, bezel: { type: 'thin' }, dial: { color: '#111210', track: 'railroad', indices: 'arabic', ink: '#eeeade', numSize: 0.18, numAt: 0.69, lume: 'tritium', pips: true, text: [{ t: 'CWC', y: -0.36, s: 8 }], logo: 'circleT', logoY: 0.3 }, hands: { style: 'sword', color: 'white', lume: 'tritium', seconds: 'center', secColor: 'white' }, strap: { type: 'nato', color: '#777c7e' } }
    },

    /* --------------------------- DRESS & EVERYDAY --------------------------- */
    {
      id: 'tank', fam: 'dress', year: 1917, name: 'Tank', maker: 'Cartier',
      line: 'Two parallel bars and a strap between them. The dress watch as architecture.',
      text: 'Louis Cartier drew the Tank in 1917 and put it on sale in 1919. The story goes that the two side bars, the brancards, came from the plan view of the Renault tanks on the Western Front. Case and lugs became one line, and the strap seemed to grow out of the watch. Rectangular, with Roman numerals and a sapphire in the crown, it has barely changed.',
      from: ['santos'],
      cfg: { mm: 30, shape: 'rect', metal: 'gold', crown: { pos: 3, size: 0.8 }, dial: { color: '#f3efe2', track: 'railroad', trackAt: 0.62, indices: 'roman', numAt: 0.82, numSize: 0.3, numFont: 'serif', numWeight: 600, ink: '#1a1a1a' }, hands: { style: 'sword', color: 'blued', seconds: 'none', w: 0.07 }, strap: { type: 'leather', color: '#3a1f14' } }
    },
    {
      id: 'oyster', fam: 'dress', year: 1926, name: 'Oyster', maker: 'Rolex',
      line: 'A screw-down crown and back: the wristwatch learns to keep water out.',
      text: 'Dust and damp killed early wristwatches. In 1926 Rolex patented the Oyster, a case with a screwed bezel, a screwed back and a crown that screwed down onto a tube like a submarine hatch. The next year Mercedes Gleitze wore one during a Channel swim, and Rolex bought the front page of the Daily Mail to say so. Every dive watch starts here.',
      from: ['trench'],
      cfg: { mm: 32, shape: 'cushion', metal: 'steel', bezel: { type: 'coin' }, crown: { pos: 3, size: 1.1 }, dial: { color: '#ece6d4', track: 'railroad', indices: 'arabic', ink: '#26221a', numSize: 0.19, numAt: 0.68, sub: [{ pos: 6, r: 0.24 }] }, hands: { style: 'cathedral', color: 'blued', lume: 'radium', seconds: 'sub' }, strap: { type: 'leather', color: '#5a3c26' } }
    },
    {
      id: 'perpetual', fam: 'dress', year: 1931, name: 'The self-winding rotor', maker: 'Harwood; Rolex',
      line: 'The wearer’s own movement winds the watch.',
      text: 'John Harwood, an English watchmaker, patented a self-winding wristwatch in the 1920s; its weight swung back and forth between buffers. In 1931 Rolex introduced the Perpetual, with a rotor free to turn a full circle, and paired it with the Oyster case. A sealed watch that never needed opening or winding: that combination is still what most people mean by “an automatic”.',
      from: ['oyster'],
      cfg: { mm: 32, metal: 'steel', bezel: { type: 'stepped' }, dial: { color: '#e7dfc8', track: 'ticks', indices: 'arabic', nums: [12, 3, 6, 9], rest: 'dagger', ink: '#26221a', numSize: 0.22, lume: 'radium' }, hands: { style: 'pencil', color: 'blued', lume: 'radium', seconds: 'center', secColor: 'blued' }, strap: { type: 'leather', color: '#3b2a20' } }
    },
    {
      id: 'reverso', fam: 'dress', year: 1931, name: 'Reverso', maker: 'Jaeger-LeCoultre',
      line: 'A watch that turns its back on a polo mallet.',
      text: 'British officers playing polo in India kept breaking their watch glasses. The answer, patented in 1931, was a rectangular case that slides and flips over in its carriage to present a plain steel back. The blank side turned out to be perfect for engraving initials, crests and enamel miniatures. With the Tank, it defines the Art Deco rectangular watch.',
      from: ['tank'],
      cfg: { mm: 30, shape: 'rect', metal: 'steel', gadroons: true, crown: { pos: 3, size: 0.8 }, dial: { color: '#14161a', track: 'railroad', trackAt: 0.62, indices: 'arabic', numAt: 0.82, numSize: 0.27, ink: '#e9e6dc' }, hands: { style: 'sword', color: 'steel', seconds: 'none', w: 0.07 }, strap: { type: 'leather', color: '#2a1a12' } }
    },
    {
      id: 'calatrava', fam: 'dress', year: 1932, name: 'Calatrava ref. 96', maker: 'Patek Philippe',
      line: 'Round, flat, nothing to add and nothing to remove.',
      text: 'Reference 96, launched in 1932, is the round dress watch reduced to its essentials: a flat bezel, lugs flowing out of the case, baton or dagger markers, small seconds at six. It is usually linked to Bauhaus thinking, form following function. Thirty-one millimetres across, it became the pattern for nearly every simple round dress watch since, at every price.',
      from: [],
      cfg: { mm: 31, metal: 'gold', lugs: 'thin', bezel: { type: 'smooth', w: 0.1 }, dial: { color: '#ebe6d6', track: 'dots', indices: 'dagger', applied: 'gold', ink: '#2a2418', sub: [{ pos: 6, r: 0.24 }] }, hands: { style: 'dauphine', color: 'gold', seconds: 'sub' }, strap: { type: 'leather', color: '#2a1a12' } }
    },
    {
      id: 'datejust', fam: 'dress', year: 1945, name: 'Datejust', maker: 'Rolex',
      line: 'A date in a window. The everyday watch finds its final form.',
      text: 'For its fortieth anniversary in 1945 Rolex brought out the Datejust: a waterproof, self-winding chronometer with the date showing through a window at three. The fluted bezel and five-link Jubilee bracelet arrived with it; the magnifying “Cyclops” lens came a few years later. Neither dress watch nor tool watch, it is the one most people picture when they hear “a watch”.',
      from: ['perpetual'],
      cfg: { mm: 36, metal: 'steel', bezel: { type: 'fluted' }, dial: { color: '#c9cdd2', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', ink: '#222', date: { pos: 3, cyclops: true } }, hands: { style: 'baton', color: 'steel', seconds: 'center' }, strap: { type: 'bracelet', kind: 'jubilee' } }
    },
    {
      id: 'ultrathin', fam: 'dress', year: 1957, name: 'Calibre 9P', maker: 'Piaget',
      line: 'A movement two millimetres thick, and the race to be thinnest.',
      text: 'At the 1957 Basel fair Piaget showed the 9P, a hand-wound movement just two millimetres thick, followed in 1960 by the 12P, an automatic at 2.3. Thinness became its own kind of complication: harder to make, harder to adjust, and invisible unless you knew. The extra-flat gold watch was the height of elegance for twenty years, until quartz made thin easy.',
      from: ['calatrava'],
      cfg: { mm: 33, metal: 'gold', lugs: 'thin', bezel: { type: 'thin' }, dial: { color: '#f4f1e7', track: 'none', indices: 'stick', ink: '#26221a' }, hands: { style: 'stick', color: 'black', seconds: 'none' }, strap: { type: 'leather', color: '#1a1a1a' } }
    },
    {
      id: 'grandseiko', fam: 'dress', year: 1960, name: 'Grand Seiko', maker: 'Seiko',
      line: 'Japan sets out to build the best ordinary watch in the world.',
      text: 'Seiko’s Suwa factory made the first Grand Seiko in 1960, built to match the Swiss chronometer standard and soon held to a stricter one of its own. In 1967 the 44GS, drawn by Taro Tanaka, fixed the look later called the Grammar of Design: flat surfaces, razor edges, mirror polish, wide hands that catch any light. It was a statement of intent that Switzerland was slow to read.',
      from: ['calatrava'],
      cfg: { mm: 37, metal: 'polished', lugs: 'bold', bezel: { type: 'smooth', w: 0.06 }, dial: { color: '#e4e6e7', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', idxW: 0.075, ink: '#222' }, hands: { style: 'dauphine', color: 'steel', seconds: 'center', w: 0.06 }, strap: { type: 'leather', color: '#161616' } }
    },
    {
      id: 'maxbill', fam: 'dress', year: 1961, name: 'Max Bill', maker: 'Junghans',
      line: 'A Bauhaus student designs a watch with nothing on it but time.',
      text: 'Max Bill studied at the Bauhaus and co-founded the Ulm School of Design. After a kitchen clock for Junghans in the 1950s, he drew a wristwatch for them in 1961: a domed glass, hair-thin lines for the minutes, small clean numerals or none at all. It is the purest statement of the idea that a dial is information design. Every minimalist watch since owes it something.',
      from: ['calatrava'],
      cfg: { mm: 34, metal: 'steel', lugs: 'thin', bezel: { type: 'thin' }, dial: { color: '#f3f1ea', track: 'ticks', indices: 'stick', ink: '#1c1c1c' }, hands: { style: 'stick', color: 'black', seconds: 'center' }, strap: { type: 'leather', color: '#8a6a48' } }
    },

    /* --------------------------- PILOT & TRAVEL --------------------------- */
    {
      id: 'hourangle', fam: 'pilot', year: 1931, name: 'Lindbergh Hour Angle', maker: 'Longines',
      line: 'A rotating bezel turns a watch into a navigation instrument.',
      text: 'The US Navy navigator Philip Van Horn Weems devised a watch whose seconds could be synchronised to a radio time signal by turning a ring, and Longines built it from 1929. Charles Lindbergh extended the idea: his 1931 Hour Angle watch let an aviator read longitude from the dial and bezel. It is the first famous rotating bezel. Every dive, GMT and slide-rule bezel descends from it.',
      from: ['santos'],
      cfg: { mm: 46, metal: 'steel', bezel: { type: '24h' }, crown: { pos: 3, kind: 'onion', size: 1.1 }, dial: { color: '#f3f0e6', finish: 'enamel', track: 'railroad', indices: 'roman', numFont: 'serif', numSize: 0.17, numAt: 0.76, ink: '#1c1c1c', ring: { c: '#1c1c1c', r: 0.36, w: 0.012 } }, hands: { style: 'breguet', color: 'blued', seconds: 'center', secColor: 'blued' }, strap: { type: 'leather', color: '#5a3c26' } }
    },
    {
      id: 'worldtimer', fam: 'pilot', year: 1937, name: 'World time', maker: 'Louis Cottier',
      line: 'Twenty-four cities on one dial: all the time, everywhere, at a glance.',
      text: 'The Geneva watchmaker Louis Cottier devised his world-time mechanism in 1931: a ring of city names around the dial and a 24-hour ring turning inside it, so that the hour in every zone can be read at once. Through the 1930s he built it for Patek Philippe, Vacheron Constantin and others. It was a watch for an age of ocean liners, telegrams and the first airlines.',
      from: [],
      cfg: { mm: 36, metal: 'gold', lugs: 'thin', bezel: { type: '24h' }, dial: { color: '#efe9d8', track: 'none', indices: 'none', ink: '#26221a', inner: { color: '#263a5e', ink: '#efe9d8', tri: '#c9a35a' } }, hands: { style: 'leaf', color: 'blued', seconds: 'none' }, strap: { type: 'leather', color: '#3a1f14' } }
    },
    {
      id: 'flieger', fam: 'pilot', year: 1940, name: 'B-Uhr', maker: 'IWC, Lange, Laco, Stowa, Wempe',
      line: 'Fifty-five millimetres of legibility, worn over a flight jacket.',
      text: 'The Beobachtungsuhr, or observer’s watch, was specified by the German air ministry and built from 1940 by five firms: A. Lange & Söhne, Laco, Stowa, Wempe and IWC. Fifty-five millimetres wide, black dial, huge numerals, a triangle with two dots at twelve, and an onion crown that could be worked in gloves. The “Type A” and “Type B” dials are still copied line for line.',
      from: ['hourangle'],
      cfg: { mm: 46, metal: 'steel', bezel: { type: 'thin' }, crown: { pos: 3, kind: 'onion', size: 1.2 }, dial: { color: '#0e0e0f', track: 'ticks', indices: 'flieger-a', lume: 'tritium', ink: '#eee' }, hands: { style: 'sword', color: 'blued', lume: 'tritium', seconds: 'center' }, strap: { type: 'leather', color: '#4a3220' } }
    },
    {
      id: 'mark11', fam: 'pilot', year: 1948, name: 'Mark 11', maker: 'IWC; Jaeger-LeCoultre',
      line: 'The navigator’s watch: a soft-iron cage against the cockpit’s magnets.',
      text: 'Built for Royal Air Force navigators from 1948, the Mark 11 packed a chronometer-grade movement inside a soft-iron inner case that shielded it from the magnetic fields of aircraft instruments. Outside: a 36-millimetre steel case, black dial, white numerals, the broad arrow. IWC and Jaeger-LeCoultre both made it. It stayed in service for decades and set the proportions of the modern pilot’s watch.',
      from: ['flieger', 'www'],
      cfg: { mm: 36, metal: 'steel', bezel: { type: 'smooth' }, dial: { color: '#101112', track: 'railroad', indices: 'flieger-a', lume: 'tritium', ink: '#eeeade', numSize: 0.19, logo: 'broadarrow', logoY: 0.3 }, hands: { style: 'pencil', color: 'white', lume: 'tritium', seconds: 'center', secColor: 'white' }, strap: { type: 'nato', color: '#777c7e' } }
    },
    {
      id: 'navitimer', fam: 'pilot', year: 1952, name: 'Navitimer', maker: 'Breitling',
      line: 'A circular slide rule around a chronograph: the cockpit computer.',
      text: 'Breitling took the circular slide rule from its wartime Chronomat and adapted it for flying: fuel consumption, rate of climb, miles to nautical miles, all worked out by turning the beaded bezel. Launched in the early 1950s and adopted by the Aircraft Owners and Pilots Association, the Navitimer made the busiest dial in watchmaking into an emblem. Pilots used it until electronics took over.',
      from: ['breitling2', 'hourangle'],
      cfg: { mm: 41, metal: 'steel', bezel: { type: 'sliderule' }, pushers: true, dial: { color: '#111214', track: 'none', indices: 'baton', idxIn: 0.64, idxOut: 0.8, lume: 'tritium', ink: '#eee', sliderule: '#e9e5d6', sub: [{ pos: 3, r: 0.2, type: '30min', color: '#e9e5d6', ink: '#111', hand: '#111' }, { pos: 6, r: 0.2, type: '12h', color: '#e9e5d6', ink: '#111', hand: '#111' }, { pos: 9, r: 0.2, type: 'seconds', color: '#e9e5d6', ink: '#111', hand: '#111' }] }, hands: { style: 'pencil', color: 'steel', lume: 'tritium', seconds: 'sub', chrono: true, secColor: 'white' }, strap: { type: 'leather', color: '#161616' } }
    },
    {
      id: 'airman', fam: 'pilot', year: 1953, name: 'Airman', maker: 'Glycine',
      line: 'One turn of the hour hand per day, and a bezel for somewhere else.',
      text: 'Glycine’s Airman, from 1953, was built around a 24-hour dial: the hour hand goes round once a day, so a pilot can’t confuse 0400 with 1600. A rotating 24-hour bezel, locked by a second crown, tracks another time zone. It was affordable, and popular with American airmen in Vietnam. A tiny pin at the top of the dial stops the seconds hand for setting.',
      from: ['hourangle'],
      /* ink = dial colour hides the stray 12-hour batons the renderer draws under '24h' numerals */
      cfg: { mm: 36, metal: 'steel', h24: true, bezel: { type: '24h' }, crown: { pos: [3, 4] }, dial: { color: '#0f0f10', track: 'ticks', trackInk: '#e8e6dc', indices: '24h', ink: '#0f0f10', numInk: '#e8e6dc', numSize: 0.17, date: { pos: 3, at: 0.5 } }, hands: { style: 'syringe', color: 'steel', lume: 'tritium', seconds: 'center' }, strap: { type: 'leather', color: '#3a2a1e' } }
    },
    {
      id: 'gmtmaster', fam: 'pilot', year: 1954, name: 'GMT-Master', maker: 'Rolex',
      line: 'A fourth hand and a two-colour bezel, for crews crossing time zones.',
      text: 'Developed with Pan American Airways for its long-haul crews and launched in the mid-1950s, the GMT-Master added a fourth hand that circles once in 24 hours, read against a rotating bezel. Red for day, blue for night: collectors later called it the Pepsi. The first bezels were Bakelite with radium numerals and cracked easily; aluminium replaced them. It is the template for every travel watch since.',
      from: ['worldtimer', 'airman'],
      /* renderer: bezel.color is the lower (day) half, color2 the upper (night) half */
      cfg: { mm: 38, metal: 'steel', bezel: { type: 'gmt', color: '#b3262b', color2: '#1c3a7a' }, dial: { color: '#0d0d0f', track: 'ticks', indices: 'sub', applied: 'steel', lume: 'tritium', ink: '#eee', date: { pos: 3, cyclops: true } }, hands: { style: 'mercedes', color: 'steel', lume: 'tritium', seconds: 'center', gmt: { color: 'red', at: 16 } }, strap: STEEL_BR }
    },

    /* -------------------------------- DIVE -------------------------------- */
    {
      id: 'radiomir', fam: 'dive', year: 1936, name: 'Radiomir', maker: 'Panerai',
      line: 'A cushion case with wire lugs for the frogmen of the Italian navy.',
      text: 'Panerai of Florence supplied instruments to the Royal Italian Navy. In 1936 it delivered prototype watches for the navy’s frogmen: a big cushion-shaped case made by Rolex, wire lugs, and a dial glowing with Panerai’s radium compound, Radiomir. They were military secrets for decades and were not sold to the public until 1993. Then the big watch they started became a worldwide fashion.',
      from: ['oyster'],
      cfg: { mm: 46, shape: 'cushion', metal: 'steel', lugs: 'wire', crown: { pos: 3, kind: 'onion', size: 1.1 }, bezel: { type: 'thin' }, dial: { color: '#111', track: 'none', indices: 'california', lume: 'radium', ink: '#eee' }, hands: { style: 'pencil', color: 'gold', lume: 'radium', seconds: 'none' }, strap: { type: 'leather', color: '#7a5632' } }
    },
    {
      id: 'fiftyfathoms', fam: 'dive', year: 1953, name: 'Fifty Fathoms', maker: 'Blancpain',
      line: 'The modern dive watch arrives complete: black dial, lume, turning bezel.',
      text: 'Blancpain’s chief, Jean-Jacques Fiechter, was a diver himself. Working with the French navy’s combat swimmers, Captain Robert Maloubier and Lieutenant Claude Riffaud, he produced in 1953 a watch with an automatic movement, a black dial with big luminous markers, and a rotating bezel secured against accidental knocks, so the timing of a dive could be trusted. Almost nothing has been added since.',
      from: ['oyster', 'hourangle'],
      cfg: { mm: 41, metal: 'steel', bezel: { type: 'dive', hash: false }, dial: { color: '#0c0c0e', track: 'ticks', indices: 'arabic', nums: [12, 3, 6, 9], rest: 'dagger', lume: 'tritium', ink: '#e9e6dc', numSize: 0.24, numInk: '#e6d3a1' }, hands: { style: 'pencil', color: 'steel', lume: 'tritium', seconds: 'center', secColor: 'steel' }, strap: { type: 'rubber', color: '#141414' } }
    },
    {
      id: 'submariner', fam: 'dive', year: 1953, name: 'Submariner', maker: 'Rolex',
      line: 'The Oyster goes diving, and becomes the most copied watch on earth.',
      text: 'Rolex put a rotating bezel and a luminous black dial on its Oyster Perpetual in 1953 and showed the result at Basel the next year: the Submariner, good to 100 metres. Navies bought it, and then James Bond wore one. The dots, bars and triangle of its dial, and the hour hand with the three-part circle, are the most imitated design in watchmaking.',
      from: ['oyster', 'perpetual'],
      cfg: { mm: 38, metal: 'steel', bezel: { type: 'dive' }, dial: { color: '#0d0d0f', track: 'ticks', indices: 'sub', lume: 'tritium', ink: '#e8e6dc' }, hands: { style: 'mercedes', color: 'steel', lume: 'tritium', seconds: 'center', secStyle: 'lollipop' }, strap: STEEL_BR }
    },
    {
      id: 'compressor', fam: 'dive', year: 1956, name: 'Super Compressor', maker: 'EPSA (Ervin Piquerez S.A.)',
      line: 'A case that seals tighter the deeper it goes, with two crowns.',
      text: 'The case maker Ervin Piquerez, in the Swiss Jura, patented a design in the 1950s whose sprung back pressed harder on its gasket as water pressure rose. EPSA sold the case to dozens of brands, from Longines and Jaeger-LeCoultre to Enicar. Most have two crowns: one winds, the other turns a timing ring under the glass. Inside the back is a small diver’s helmet.',
      from: ['fiftyfathoms'],
      cfg: { mm: 42, metal: 'steel', bezel: { type: 'thin' }, crown: { pos: [2, 4], kind: 'cross' }, dial: { color: '#101216', track: 'ticks', indices: 'baton', lume: 'tritium', ink: '#e8e6dc', inner: {} }, hands: { style: 'sword', color: 'steel', lume: 'tritium', seconds: 'center', secStyle: 'arrow' }, strap: { type: 'rubber', color: '#151515' } }
    },
    {
      id: 'seamaster300', fam: 'dive', year: 1957, name: 'Seamaster 300', maker: 'Omega',
      line: 'One of three professional watches Omega launched in a single year.',
      text: 'In 1957 Omega released a trio of tool watches: the Speedmaster chronograph, the anti-magnetic Railmaster, and the Seamaster 300 for divers. All three shared a broad-arrow hour hand. The Seamaster 300 was issued to British military divers in the 1960s. It showed that by the late fifties every serious Swiss house needed a dive watch in the catalogue, whoever its usual customers were.',
      from: ['fiftyfathoms', 'submariner'],
      cfg: { mm: 39, metal: 'steel', bezel: { type: 'dive', hash: false }, dial: { color: '#0d0d0f', track: 'ticks', indices: 'arabic', nums: [12, 3, 6, 9], rest: 'dagger', lume: 'tritium', ink: '#e9e6dc', numSize: 0.22, numInk: '#e6d3a1' }, hands: { style: 'arrow', color: 'steel', lume: 'tritium', seconds: 'center', secStyle: 'lollipop' }, strap: STEEL_BR }
    },
    {
      id: '62mas', fam: 'dive', year: 1965, name: '62MAS', maker: 'Seiko',
      line: 'Japan’s first dive watch, and the start of a separate tradition.',
      text: 'Seiko’s first diver, in 1965, was rated to 150 metres and went to the Antarctic with a Japanese research expedition. Its big square markers and wide hands began a line that ran through the 6105, seen on Martin Sheen’s wrist in Apocalypse Now, and on to the SKX of the 1990s: tough, cheap, and the first real watch of countless enthusiasts.',
      from: ['submariner'],
      cfg: { mm: 37, metal: 'steel', bezel: { type: 'dive', color: '#1d1f22' }, crown: { pos: 3, size: 1.2 }, dial: { color: '#3a3e44', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', lume: 'tritium', idxW: 0.1, idxIn: 0.72, ink: '#eee', date: { pos: 3, frame: true } }, hands: { style: 'baton', color: 'steel', lume: 'tritium', seconds: 'center' }, strap: { type: 'rubber', color: '#141414' } }
    },
    {
      id: 'doxa', fam: 'dive', year: 1967, name: 'Sub 300', maker: 'Doxa',
      line: 'An orange dial and a decompression table on the bezel.',
      text: 'Doxa designed the Sub 300 with divers, for recreational diving rather than for navies. The dial was orange, chosen after tests for legibility in murky water; the bezel carried the US Navy’s no-decompression limits, so depth and time could be read together. Jacques Cousteau’s company sold it in America. It proved a tool watch could have a personality, and a colour.',
      from: ['submariner'],
      cfg: { mm: 42, shape: 'cushion', metal: 'steel', bezel: { type: 'dive', color: '#c9cdd2', ink: '#222' }, dial: { color: '#f26a1b', track: 'ticks', indices: 'baton', ink: '#111', date: { pos: 3 } }, hands: { style: 'plongeur', color: 'black', mColor: 'black', lume: 'tritium', seconds: 'center' }, strap: { type: 'bracelet', kind: 'rice' } }
    },
    {
      id: 'seadweller', fam: 'dive', year: 1967, name: 'Sea-Dweller', maker: 'Rolex',
      line: 'Saturation divers breathe helium. Their watches had to learn to exhale.',
      text: 'Divers living for days in pressurised chambers breathe a helium mix, and helium seeps into a watch. On the way back up it can’t get out fast enough, and the crystal pops off. The Sea-Dweller of 1967 added a one-way valve in the case side to let the gas escape. Rolex worked closely with COMEX, the Marseille diving company, which issued the watches to its men.',
      from: ['submariner'],
      cfg: { mm: 40, metal: 'steel', bezel: { type: 'dive' }, crown: { pos: 3, guards: true }, dial: { color: '#0d0d0f', track: 'ticks', indices: 'sub', applied: 'steel', lume: 'tritium', ink: '#e8e6dc', date: { pos: 3 }, text: [{ t: 'SEA-DWELLER', y: 0.27, s: 5.4, c: '#d2382e', ls: 0.5 }, { t: 'SUBMARINER 2000', y: 0.38, s: 5, c: '#d2382e', ls: 0.3 }] }, hands: { style: 'mercedes', color: 'steel', lume: 'tritium', seconds: 'center', secStyle: 'lollipop' }, strap: STEEL_BR }
    },
    {
      id: 'ploprof', fam: 'dive', year: 1970, name: 'Seamaster 600 “Ploprof”', maker: 'Omega',
      line: 'Omega’s answer to helium: keep it out with a case like a bank vault.',
      text: 'Instead of letting helium out, Omega tried to stop it getting in. The Seamaster 600 of 1970, nicknamed Ploprof for plongeur professionnel, was a block of steel with the crown on the left under a locking nut and a red button to release the bezel. COMEX divers tested it. Huge, strange and uncompromising, it marks the high tide of the purpose-built professional dive watch.',
      from: ['seamaster300'],
      cfg: { mm: 45, shape: 'cushion', metal: 'steel', lugs: 'none', lugW: 24, bezel: { type: 'dive', color: '#1c3a7a' }, crown: { pos: 9, size: 1.3 }, pushers: 'mono', dial: { color: '#1d3b72', track: 'ticks', indices: 'baton', lume: 'tritium', idxW: 0.08, ink: '#eee', date: { pos: 3 } }, hands: { style: 'plongeur', color: 'white', mColor: 'orange', lume: 'tritium', seconds: 'center', secColor: 'white' }, strap: { type: 'bracelet', kind: 'mesh' } }
    },
    {
      id: 'tuna', fam: 'dive', year: 1975, name: 'Professional 600m “Tuna”', maker: 'Seiko',
      line: 'A diver’s letter of complaint, answered with titanium and a shroud.',
      text: 'In 1968 a professional diver from Kure wrote to Seiko that its watches failed in saturation work. Seven years later came the answer: a 600-metre watch with a one-piece titanium case, a seal that kept helium out without a valve, and a protective outer shroud that earned it the nickname Tuna, after the can. It introduced the ribbed “accordion” rubber strap that divers still wear.',
      from: ['62mas'],
      cfg: { mm: 48, metal: 'titanium', lugs: 'none', lugW: 22, bezel: { type: 'dive', color: '#141414' }, crown: { pos: 4, size: 1.1 }, dial: { color: '#0b0b0c', track: 'ticks', indices: 'dot', applied: 'steel', lume: 'tritium', idxW: 0.065, ink: '#eee', date: { pos: 3 } }, hands: { style: 'arrow', color: 'steel', lume: 'tritium', seconds: 'center', secStyle: 'lollipop' }, strap: { type: 'rubber', color: '#111' } }
    },

    /* ----------------------------- CHRONOGRAPH ----------------------------- */
    {
      id: 'breitling2', fam: 'chrono', year: 1934, name: 'Two-pusher chronograph', maker: 'Breitling',
      line: 'Start, stop, start again, reset: the chronograph gets its modern controls.',
      text: 'Early wrist chronographs did everything through the crown or a single button. Breitling moved the control to its own pusher around 1915, and in 1934 added a second one, so that timing could be stopped and restarted without returning to zero. Two pushers flanking the crown, two or three small counters on the dial: the layout has been standard ever since.',
      from: [],
      cfg: { mm: 35, metal: 'steel', lugs: 'thin', bezel: { type: 'thin' }, pushers: true, dial: { color: '#e9e2cd', track: 'railroad', indices: 'arabic', ink: '#26221a', numSize: 0.15, numAt: 0.74, sub: [{ pos: 3, r: 0.24, type: '30min' }, { pos: 9, r: 0.24, type: 'seconds' }] }, hands: { style: 'leaf', color: 'blued', seconds: 'sub', chrono: true, secColor: 'blued' }, strap: { type: 'leather', color: '#5a3c26' } }
    },
    {
      id: 'speedmaster', fam: 'chrono', year: 1957, name: 'Speedmaster', maker: 'Omega',
      line: 'A racing chronograph with the speed scale moved out to the bezel.',
      text: 'The first Speedmaster, reference CK2915, was sold to engineers and racing drivers. Its new idea was to move the tachymeter scale off the dial and onto the bezel, leaving the dial clear and the chronograph easy to read. Inside was the calibre 321, a column-wheel movement designed with Lemania. Nobody at Omega was thinking about space. That came later, and by accident.',
      from: ['breitling2'],
      cfg: { mm: 39, metal: 'steel', bezel: { type: 'tachy', color: '#c9ced3', ink: '#1c1c1c' }, pushers: true, dial: { color: '#111', track: 'fine', indices: 'baton', lume: 'radium', ink: '#eee', sub: [{ pos: 3, r: 0.22, type: '30min' }, { pos: 6, r: 0.22, type: '12h' }, { pos: 9, r: 0.22, type: 'seconds' }] }, hands: { style: 'arrow', color: 'steel', lume: 'radium', seconds: 'sub', chrono: true, secColor: 'steel' }, strap: STEEL_BR }
    },
    {
      id: 'carrera', fam: 'chrono', year: 1963, name: 'Carrera', maker: 'Heuer',
      line: 'Jack Heuer removes everything from the dial that isn’t timing.',
      text: 'Jack Heuer named it after the Carrera Panamericana, the Mexican road race, and designed it around one rule: legibility. The fifth-of-a-second scale was printed on the sloping ring that holds the crystal, freeing the dial of clutter. Clean, mid-sized and modern in 1963, it tied the chronograph to motor racing for good, a link Heuer deepened with the Autavia and Monaco.',
      from: ['breitling2'],
      cfg: { mm: 36, metal: 'steel', bezel: { type: 'thin' }, pushers: true, dial: { color: '#e2e3e1', finish: 'sunburst', track: 'fine', indices: 'baton', applied: 'steel', ink: '#1c1c1c', sub: [{ pos: 3, r: 0.2, type: '30min' }, { pos: 6, r: 0.2, type: '12h' }, { pos: 9, r: 0.2, type: 'seconds' }] }, hands: { style: 'baton', color: 'black', seconds: 'sub', chrono: true, secColor: 'black' }, strap: { type: 'leather', color: '#161616' } }
    },
    {
      id: 'daytona', fam: 'chrono', year: 1963, name: 'Cosmograph Daytona', maker: 'Rolex',
      line: 'A slow seller for years. Then the most wanted chronograph alive.',
      text: 'Rolex’s Cosmograph of 1963, soon named for the Florida speedway, had an engraved tachymeter bezel and contrasting counters. It sold poorly; the versions with “exotic” Art Deco dials sold worst of all. Then collectors noticed that Paul Newman wore one. In 2017 Newman’s own watch made 17.8 million dollars at auction in New York. Almost everything precious was once unwanted.',
      from: ['speedmaster'],
      cfg: { mm: 37, metal: 'steel', bezel: { type: 'tachy', color: '#c9ced3', ink: '#1c1c1c' }, pushers: true, dial: { color: '#ece8dc', track: 'fine', indices: 'baton', applied: 'steel', ink: '#1c1c1c', sub: tri('#141414', '#eee', '#eee') }, hands: { style: 'baton', color: 'black', seconds: 'sub', chrono: true, secColor: 'black' }, strap: STEEL_BR }
    },
    {
      id: 'moonwatch', fam: 'chrono', year: 1969, name: 'The Moonwatch', maker: 'Omega / NASA',
      line: 'Tested to destruction on Earth, then worn on the Moon.',
      text: 'In the mid-1960s NASA bought chronographs from several makers and tried to break them with heat, cold, vacuum, shock and vibration. Only the Speedmaster passed, and it was flight-qualified in March 1965. On 20 July 1969 Buzz Aldrin wore his on the lunar surface. In 1970 the crew of Apollo 13 used one to time a fourteen-second engine burn that helped get them home.',
      from: ['speedmaster'],
      cfg: { mm: 42, metal: 'steel', bezel: { type: 'tachy' }, crown: { pos: 3, guards: true }, pushers: true, dial: { color: '#111', track: 'fine', indices: 'baton', lume: 'tritium', ink: '#eee', sub: [{ pos: 3, r: 0.22, type: '30min' }, { pos: 6, r: 0.22, type: '12h' }, { pos: 9, r: 0.22, type: 'seconds' }] }, hands: { style: 'baton', color: 'white', lume: 'tritium', seconds: 'sub', chrono: true, secColor: 'white' }, strap: { type: 'canvas', color: '#2b2b2b' } }
    },
    {
      id: 'elprimero', fam: 'chrono', year: 1969, name: 'El Primero', maker: 'Zenith',
      line: 'An automatic chronograph beating ten times a second.',
      text: 'Zenith announced El Primero on 10 January 1969: a fully integrated self-winding chronograph, with a column wheel and a balance running at 36,000 beats an hour, fast enough to time tenths of a second. It was first to be shown, though rivals reached the shops sooner. Who “won” 1969 depends on what you count. The movement itself is still in production.',
      from: ['breitling2', 'perpetual'],
      cfg: { mm: 38, metal: 'steel', bezel: { type: 'thin' }, pushers: true, dial: { color: '#eeeae0', track: 'fine', indices: 'baton', applied: 'steel', ink: '#1c1c1c', sub: [{ pos: 3, r: 0.27, type: '30min', color: '#2c4a8a', ink: '#eee', hand: '#eee' }, { pos: 6, r: 0.27, type: '12h', color: '#55595f', ink: '#eee', hand: '#eee' }, { pos: 9, r: 0.27, type: 'seconds', color: '#b4b7ba', ink: '#111', hand: '#111' }], date: { pos: 4.5, at: 0.8 } }, hands: { style: 'baton', color: 'black', seconds: 'sub', chrono: true, secColor: 'red' }, strap: { type: 'bracelet', kind: 'h' } }
    },
    {
      id: 'calibre11', fam: 'chrono', year: 1969, name: 'Calibre 11 “Chronomatic”', maker: 'Heuer, Breitling, Hamilton-Buren',
      line: 'A consortium, a micro-rotor, and a crown on the wrong side.',
      text: 'Heuer, Breitling, Hamilton-Buren and the specialist Dubois Dépraz pooled their money in secret and unveiled their automatic chronograph on 3 March 1969, in Geneva and New York at once. A chronograph module sat on a thin micro-rotor movement, which put the crown on the left. It went into the Autavia, the Carrera and the square, waterproof Monaco that Steve McQueen later wore in Le Mans.',
      from: ['carrera'],
      cfg: { mm: 39, shape: 'square', metal: 'steel', crown: { pos: 9 }, pushers: true, bezel: { type: 'smooth', w: 0.02 }, dial: { color: '#274a86', track: 'ticks', indices: 'baton', ink: '#fff', sub: [{ pos: 3, r: 0.25, type: '30min', color: '#eee', ink: '#111', hand: '#111' }, { pos: 9, r: 0.25, type: '12h', color: '#eee', ink: '#111', hand: '#111' }], date: { pos: 6 } }, hands: { style: 'baton', color: 'red', seconds: 'none', chrono: true, secColor: 'red' }, strap: { type: 'leather', color: '#1a1a1a' } }
    },
    {
      id: 'seiko6139', fam: 'chrono', year: 1969, name: '6139', maker: 'Seiko',
      line: 'The third automatic chronograph of 1969, and the quietest.',
      text: 'While the Swiss were holding press conferences, Seiko put its own automatic chronograph on sale in Japan in the spring of 1969. The 6139 had a column wheel and a vertical clutch, a refinement the Swiss adopted much later. Colonel William Pogue wore a yellow-dialled one aboard Skylab in 1973, which by most accounts makes it the first automatic chronograph in space.',
      from: ['grandseiko'],
      cfg: { mm: 41, shape: 'tonneau', metal: 'steel', pushers: true, bezel: { type: 'tachy', color: '#1c3a7a' }, dial: { color: '#e8b820', finish: 'sunburst', track: 'ticks', indices: 'baton', ink: '#111', inner: { color: '#1c3a7a' }, sub: [{ pos: 6, r: 0.24, type: '30min', color: '#111', ink: '#eee', hand: '#eee' }], date: { pos: 3, day: 'SUN' } }, hands: { style: 'baton', color: 'steel', seconds: 'none', chrono: true, secColor: 'red' }, strap: { type: 'bracelet', kind: 'h' } }
    },
    {
      id: 'valjoux7750', fam: 'chrono', year: 1973, name: 'Valjoux 7750', maker: 'Valjoux',
      line: 'The workhorse: a chronograph designed to be made by the hundred thousand.',
      text: 'Edmond Capt designed the 7750 at Valjoux in the early 1970s, using a computer to help lay it out. It replaced the hand-finished column wheel with a stamped cam, cheap to make and tough. Launched into the quartz crisis, it was shelved within a couple of years, the tooling kept. When mechanical watches came back in the 1980s it was waiting, and it has powered most Swiss chronographs since.',
      from: ['elprimero', 'calibre11'],
      cfg: { mm: 41, metal: 'steel', bezel: { type: 'tachy' }, pushers: true, dial: { color: '#14161a', track: 'fine', indices: 'baton', lume: 'tritium', ink: '#eee', sub: [{ pos: 12, r: 0.21, type: '30min' }, { pos: 6, r: 0.21, type: '12h' }, { pos: 9, r: 0.21, type: 'seconds' }], date: { pos: 3, day: 'MON' } }, hands: { style: 'baton', color: 'white', lume: 'tritium', seconds: 'sub', chrono: true, secColor: 'orange' }, strap: STEEL_BR }
    },

    /* --------------------------- ELECTRIC & QUARTZ --------------------------- */
    {
      id: 'ventura', fam: 'electric', year: 1957, name: 'Electric 500 / Ventura', maker: 'Hamilton',
      line: 'The first watch with a battery instead of a mainspring.',
      text: 'On 3 January 1957 Hamilton, of Lancaster, Pennsylvania, announced the first electric wristwatch. It still had a balance wheel, but a battery and a coil kept it swinging. The triangular Ventura case, by the industrial designer Richard Arbib, looked like the future, and Elvis Presley wore one in Blue Hawaii. The contacts wore out and the watches were troublesome. But the mainspring was no longer sacred.',
      from: [],
      cfg: { mm: 32, shape: 'cushion', metal: 'gold', bezel: { type: 'thin' }, dial: { color: '#0e0e10', track: 'none', indices: 'dot', applied: 'gold', idxW: 0.035, ink: '#e3bd62', text: [{ t: 'ELECTRIC', y: 0.34, s: 5.5, c: '#e3bd62' }] }, hands: { style: 'dauphine', color: 'gold', seconds: 'center', secColor: 'gold' }, strap: { type: 'leather', color: '#141414' } }
    },
    {
      id: 'accutron', fam: 'electric', year: 1960, name: 'Accutron', maker: 'Bulova',
      line: 'No balance wheel at all: a tuning fork that hums instead of ticking.',
      text: 'The Swiss engineer Max Hetzel replaced the balance wheel with a tiny tuning fork, driven by a transistor circuit and vibrating 360 times a second. Bulova launched it in 1960 and guaranteed it to within a minute a month, several times better than a good mechanical watch. The seconds hand glides; the watch hums. The “Spaceview” models left the dial off so customers could see the circuit.',
      from: ['ventura'],
      cfg: { mm: 34, metal: 'steel', lugs: 'thin', bezel: { type: 'thin' }, crown: { pos: 0 }, dial: { color: '#2f6a50', track: 'dots', trackInk: '#222', indices: 'none', ink: '#e9e6dc', ring: { c: '#e3dfd0', r: 0.92, w: 0.16 }, sub: [{ pos: 4, at: 0.45, r: 0.17, type: '30min', color: '#b5651d', ink: '#b5651d', hand: '#b5651d', nums: false }, { pos: 8, at: 0.45, r: 0.17, type: '30min', color: '#b5651d', ink: '#b5651d', hand: '#b5651d', nums: false }], text: [{ t: 'ACCUTRON', y: -0.42, s: 6, c: '#e9e6dc' }] }, hands: { style: 'baton', color: 'white', seconds: 'center', secColor: 'white' }, strap: { type: 'leather', color: '#161616' } }
    },
    {
      id: 'astron', fam: 'electric', year: 1969, name: 'Quartz Astron 35SQ', maker: 'Seiko',
      line: 'Christmas Day, 1969, Tokyo: the first quartz wristwatch goes on sale.',
      text: 'After ten years of work at Suwa, Seiko put the Astron on sale on 25 December 1969. A sliver of quartz, vibrating 8,192 times a second, was counted down by a circuit into one step of the seconds hand each second. It kept time to about five seconds a month. In a gold case it cost 450,000 yen, about the price of a small car. The price fell fast.',
      from: ['accutron', 'grandseiko'],
      cfg: { mm: 36, shape: 'cushion', metal: 'gold', quartz: true, bezel: { type: 'thin' }, dial: { color: '#e3d7b6', finish: 'linen', track: 'none', indices: 'baton', applied: 'gold', ink: '#26221a', text: [{ t: 'SEIKO', y: -0.36, s: 8.5, w: 600 }, { t: 'QUARTZ', y: 0.34, s: 5.5 }] }, hands: { style: 'baton', color: 'black', seconds: 'center', secColor: 'black' }, strap: { type: 'leather', color: '#161616' } }
    },
    {
      id: 'beta21', fam: 'electric', year: 1970, name: 'Beta 21', maker: 'a Swiss consortium',
      line: 'Switzerland’s own quartz movement: brilliant, costly, and late.',
      text: 'Some twenty Swiss firms had funded a joint electronics lab in Neuchâtel, the CEH, whose quartz prototypes topped the observatory trials in 1967. The production version, Beta 21, reached the shops in 1970 in big gold cases signed by Omega, Rolex, Patek Philippe and others. Only about six thousand were made. The Swiss had the technology. They treated it as a luxury, not a revolution.',
      from: ['accutron'],
      cfg: { mm: 40, shape: 'tonneau', metal: 'gold', quartz: true, lugW: 26, bezel: { type: 'thin' }, dial: { color: '#d9c68f', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'gold', ink: '#2a2418', date: { pos: 3, frame: true } }, hands: { style: 'baton', color: 'black', seconds: 'center', secColor: 'black' }, strap: { type: 'bracelet', kind: 'integrated', metal: 'gold' } }
    },
    {
      id: 'pulsar', fam: 'electric', year: 1972, name: 'Pulsar', maker: 'Hamilton',
      line: 'No hands, no dial: press a button and red numbers light up.',
      text: 'Hamilton’s Pulsar, sold from 1972, was the first watch with no moving parts: a quartz circuit and a display of red light-emitting diodes that lit only when you pressed a button, to spare the battery. In an 18-carat gold case it cost 2,100 dollars, more than a gold Rolex. Within five years an LED watch could be had for about ten.',
      from: ['astron', 'ventura'],
      cfg: { mm: 40, shape: 'tv', metal: 'gold', crown: { pos: 0 }, display: { type: 'led', text: '10:09' }, strap: { type: 'bracelet', kind: 'h', metal: 'gold' } }
    },
    {
      id: 'seikoqr', fam: 'electric', year: 1972, name: '38-series quartz', maker: 'Seiko',
      line: 'Three years after the Astron, quartz at a price a clerk could manage.',
      text: 'Seiko followed the Astron with quartz calibres built to be made in quantity, among them the 38 series of the early 1970s: steel cases, day and date, and dials proudly marked with letters such as QR and QT. Each new model cost less and kept better time than the last. This, more than the gold Astron, is the watch that emptied the workshops of the Jura.',
      from: ['astron'],
      cfg: { mm: 37, shape: 'cushion', metal: 'steel', quartz: true, bezel: { type: 'thin' }, dial: { color: '#2a4a7c', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', ink: '#fff', date: { pos: 3, day: 'MON', frame: true }, text: [{ t: 'SEIKO', y: -0.36, s: 10, w: 600 }, { t: 'QUARTZ', y: 0.32, s: 6 }, { t: 'QR', y: 0.45, s: 8, w: 600 }] }, hands: { style: 'baton', color: 'steel', seconds: 'center' }, strap: { type: 'bracelet', kind: 'h' } }
    },
    {
      id: 'lcd', fam: 'electric', year: 1973, name: 'The LCD watch', maker: 'Seiko; Casio',
      line: 'Always-on liquid crystal digits, and the watch becomes a gadget.',
      text: 'Liquid crystal displays stayed visible without a button and sipped power. Seiko’s 06LC of 1973 showed hours, minutes and seconds in six digits; Casio, a calculator company, entered in 1974 with the Casiotron, which also knew the length of every month. Within a decade a watch with an alarm, a stopwatch and a light cost less than a restaurant meal, and came from Asia.',
      from: ['pulsar', 'seikoqr'],
      cfg: { mm: 37, shape: 'tv', metal: 'steel', crown: { pos: 0 }, display: { type: 'lcd', text: '10:09 36' }, strap: { type: 'bracelet', kind: 'h' } }
    },
    {
      id: 'gshock', fam: 'electric', year: 1983, name: 'G-Shock DW-5000C', maker: 'Casio',
      line: 'Built to survive a ten-metre drop. The anti-luxury watch.',
      text: 'Casio engineer Kikuo Ibe, the story goes, broke a watch his father had given him and set out to build one that couldn’t break. His brief was the “triple ten”: survive a ten-metre fall, ten bar of water pressure, ten years on one battery. After some two hundred prototypes, the 1983 DW-5000C floated its module inside a hollow, cushioned resin case. Soldiers, skaters and firefighters adopted it.',
      from: ['lcd'],
      cfg: { mm: 42, shape: 'tv', metal: 'resin', crown: { pos: 0 }, display: { type: 'lcd', text: '10:09 36', top: 'SU 28', labels: [{ t: 'SHOCK RESIST', x: 0, y: -0.6, s: 7, c: '#d8d8d8', ls: 1.5 }, { t: 'WATER 200M RESIST', x: 0, y: 0.6, s: 5.2, c: '#d2443a', ls: 1 }] }, strap: { type: 'rubber', color: '#141414' } }
    },
    {
      id: 'swatch', fam: 'electric', year: 1983, name: 'Swatch', maker: 'ETA / SMH',
      line: 'Fifty-one parts, welded shut, made by robots in Switzerland.',
      text: 'The Swiss answer to cheap quartz was to make it cheaper, and fun. Engineers Elmar Mock and Jacques Müller, under Ernst Thomke at ETA, built the movement straight into a plastic case: 51 parts instead of around 91, assembled by machine and sealed for good. Launched in Zurich on 1 March 1983 and sold as fashion, Swatch paid for the survival of the mechanical brands above it.',
      from: ['seikoqr'],
      cfg: { mm: 34, metal: 'resin', bezel: { type: 'thin' }, quartz: true, dial: { color: '#111', track: 'ticks', indices: 'arabic', nums: [12, 3, 6, 9], rest: 'baton', ink: '#f2d21b', numSize: 0.26, date: { pos: 3, day: 'MO' } }, hands: { style: 'baton', color: 'red', seconds: 'center', secColor: 'yellow' }, strap: { type: 'rubber', color: '#b0261e' } }
    },

    /* ------------------------------ SPORT-LUXE ------------------------------ */
    {
      id: 'royaloak', fam: 'luxe', year: 1972, name: 'Royal Oak', maker: 'Audemars Piguet',
      line: 'Steel at the price of gold: the luxury sports watch is invented.',
      text: 'Gérald Genta drew it, the story goes, in a single night before the 1972 Basel fair: an octagonal bezel held by eight visible screws, a dial stamped with tiny squares, and a bracelet that grew out of the case. In steel it cost 3,300 francs, more than many gold watches. The trade thought Audemars Piguet had lost its mind. It turned out to be the future of the high end.',
      from: ['datejust'],
      cfg: { mm: 39, shape: 'octagon', metal: 'steel', lugW: 27, bezel: { type: 'octa' }, dial: { color: '#2b3f5e', finish: 'tapisserie', track: 'ticks', indices: 'baton', applied: 'steel', lume: 'tritium', ink: '#fff', date: { pos: 3 } }, hands: { style: 'baton', color: 'steel', lume: 'tritium', seconds: 'none' }, strap: { type: 'integrated' } }
    },
    {
      id: 'nautilus', fam: 'luxe', year: 1976, name: 'Nautilus', maker: 'Patek Philippe',
      line: 'Genta again: a porthole with ears, and a whole genre follows.',
      text: 'Four years after the Royal Oak, Gérald Genta gave Patek Philippe the Nautilus, shaped like a ship’s porthole with a hinge-like ear on each side. The advertising said that one of the world’s costliest watches was made of steel. Around it came a family of integrated-bracelet rivals: Girard-Perregaux’s Laureato, IWC’s Ingenieur SL, also by Genta, and Vacheron Constantin’s 222, by Jörg Hysek.',
      from: ['royaloak'],
      cfg: { mm: 40, shape: 'cushion', ears: true, metal: 'steel', lugs: 'none', lugW: 27, bezel: { type: 'smooth', w: 0.1 }, dial: { color: '#26384f', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', lume: 'tritium', ink: '#eee', date: { pos: 3 } }, hands: { style: 'baton', color: 'steel', lume: 'tritium', seconds: 'none' }, strap: { type: 'integrated' } }
    },

    /* ----------------------- REVIVAL & INDEPENDENTS ----------------------- */
    {
      id: 'vermot', fam: 'revival', year: 1975, name: 'The hidden tools', maker: 'Charles Vermot, Zenith',
      line: 'Ordered to scrap the El Primero, one foreman hid it in the attic.',
      text: 'In 1975 Zenith’s American owners decided mechanical watches were finished and ordered the El Primero tooling sold for scrap. Charles Vermot, a foreman in Le Locle, quietly carried the presses, cams, cutting tools and plans up to an attic, labelled everything, and walled it in. Nine years later, when Ebel and then Rolex came asking for the movement, he showed the company where it was.',
      from: ['elprimero'],
      cfg: { mm: 40, shape: 'tonneau', metal: 'steel', lugW: 24, bezel: { type: 'thin' }, pushers: true, dial: { color: '#23354f', finish: 'sunburst', track: 'fine', indices: 'baton', applied: 'steel', ink: '#eee', sub: tri('#d8d9d6', '#111', '#111'), date: { pos: 4.5, at: 0.8 } }, hands: { style: 'baton', color: 'steel', seconds: 'sub', chrono: true, secColor: 'red' }, strap: { type: 'bracelet', kind: 'h' } }
    },
    {
      id: 'blancpain83', fam: 'revival', year: 1983, name: 'Blancpain, relaunched', maker: 'Jean-Claude Biver & Jacques Piguet',
      line: 'A dormant name, bought for 22,000 francs, and one sentence.',
      text: 'In 1983 Jean-Claude Biver and Jacques Piguet bought the rights to Blancpain, a name that had gone quiet, for 22,000 francs, and set up in a farmhouse in Le Brassus. The slogan did the rest: “Since 1735 there has never been a quartz Blancpain watch. And there never will be.” Mechanical watchmaking, written off as obsolete, was offered back to the world as a luxury.',
      from: ['fiftyfathoms'],
      cfg: { mm: 34, metal: 'gold', lugs: 'thin', bezel: { type: 'stepped' }, dial: { color: '#f4f1e8', track: 'none', indices: 'roman', numFont: 'serif', numSize: 0.17, numAt: 0.78, ink: '#26221a', sub: [{ pos: 6, r: 0.22, type: '30min', color: '#1f2f66', ink: '#1f2f66', hand: '#e3bd62', nums: false }] }, hands: { style: 'leaf', color: 'gold', seconds: 'none' }, strap: { type: 'leather', color: '#3a1f14' } }
    },
    {
      id: 'independents', fam: 'revival', year: 1985, name: 'The independents', maker: 'AHCI and after',
      line: 'One maker, one bench, one name on the dial: their own.',
      text: 'In 1985 Vincent Calabrese and Svend Andersen founded the AHCI, an academy for watchmakers who worked alone under their own names. From it and around it came a new kind of maker: George Daniels on the Isle of Man, Philippe Dufour and his Simplicity of 2000, François-Paul Journe, whose dials say “Invenit et Fecit”. Small numbers, and each watch signed by the person responsible for it.',
      from: ['blancpain83', 'calatrava'],
      cfg: { mm: 36, metal: 'rose', lugs: 'thin', bezel: { type: 'smooth', w: 0.07 }, dial: { color: '#f4f2ec', track: 'railroad', indices: 'baton', applied: 'rose', ink: '#26221a', sub: [{ pos: 6, r: 0.27 }] }, hands: { style: 'leaf', color: 'blued', seconds: 'sub' }, strap: { type: 'leather', color: '#1a1a1a' } }
    },
    {
      id: 'forums', fam: 'revival', year: 1995, name: 'Forums and blogs', maker: 'collectors online', act2: true,
      line: 'Strangers compare notes, and the buyer starts to know more than the shop.',
      text: 'From the mid-1990s collectors gathered on sites such as TimeZone and later Watchuseek, posting photographs, movement pictures and arguments. Knowledge that had lived in dealers’ heads became searchable. Hodinkee began as a blog in 2008. The customer who had read everything was a new kind of customer, and a small maker who could speak to that customer directly no longer needed a shop window.',
      from: ['independents'],
      cfg: { mm: 42, metal: 'steel', bezel: { type: 'dive' }, crown: { pos: 4, guards: true }, dial: { color: '#0c0c0e', track: 'ticks', indices: 'sub', lume: 'luminova', ink: '#eee', date: { pos: 3, day: 'SAT' } }, hands: { style: 'arrow', color: 'steel', lume: 'luminova', seconds: 'center', secStyle: 'lollipop' }, strap: { type: 'rubber', color: '#111' } }
    },
    {
      id: 'gs9s', fam: 'revival', year: 1998, name: 'Grand Seiko 9S', maker: 'Seiko',
      line: 'The firm that invented the quartz watch starts adjusting hairsprings again.',
      text: 'Seiko had stopped making mechanical Grand Seikos in the mid-1970s, its own quartz having made them pointless. In 1998 it brought them back with a new family of movements, the 9S, and a standard stricter than the Swiss chronometer test. Skills that had nearly died out had to be taught again by those who remembered. Precision by hand had become worth paying for.',
      from: ['grandseiko'],
      cfg: { mm: 37, metal: 'polished', lugs: 'bold', bezel: { type: 'smooth', w: 0.06 }, dial: { color: '#ebe7da', finish: 'sunburst', track: 'ticks', indices: 'baton', applied: 'steel', idxW: 0.07, ink: '#222', date: { pos: 3, frame: true } }, hands: { style: 'dauphine', color: 'steel', seconds: 'center', secColor: 'blued', w: 0.06 }, strap: STEEL_BR }
    },
    {
      id: 'microbrand', fam: 'revival', year: 2012, name: 'The microbrand', maker: 'two people and a laptop', act2: true,
      line: 'Buy the movement, draw the rest, sell direct. A very old idea, online.',
      text: 'In the 2010s crowdfunding, online sales and capable suppliers let very small firms design a watch, have its parts made by specialists, and sell it straight to enthusiasts. Movements came from Seiko, Miyota or Sellita; the case, dial and idea were the founder’s own. It is the old Swiss établissage system, a name gathering other people’s crafts, run from a spare room. Most fail. A few are loved.',
      from: ['forums', 'independents'],
      cfg: { mm: 38, metal: 'steel', bezel: { type: 'thin' }, dial: { color: '#e6a98f', finish: 'sector', track: 'railroad', indices: 'none', ink: '#2a2018' }, hands: { style: 'syringe', color: 'blued', seconds: 'center', secColor: 'blued' }, strap: { type: 'leather', color: '#6f7376' } }
    }
  ]
};
})();
