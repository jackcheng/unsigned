/* UNSIGNED — Chapter One: Papa’s Watch (London) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, tool, goto, label, jump, pause, sfx, tick, music, inspect, haggle } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });
const saw = (id, ob) => s => !!(s.obs[id] && s.obs[id][ob]);

G.scene('lon_arrive', [
  hide(), tick(0),
  chapter('Chapter One', 'Papa’s Watch', 'London'),
  travel('london', { note: 'Overnight from Montréal. You do not sleep.', cost: 620 }),
  bg('portobello'), music('rain'), hud('Portobello Road · London', 'Saturday, 6:40 a.m.'),
  n('Portobello Road in the rain, an hour before sunrise. The tourists come at ten, for the antiques. The trade comes now, with torches, and is gone by eight.'),
  n('Under the awnings men are turning over trays of watches by flashlight and saying almost nothing. Money changes hands the way it does in dreams: quickly, and without anyone appearing to count it.'),
  n('You ask four people for Peg. The fourth points with a bacon sandwich.'),
  d('peg', 'Blanche Calame’s grandchild. Well, I never. You’ve got her wrists.'),
  n('Seventy-five at least, in a waxed jacket and fingerless gloves, behind a folding table of watches laid out on green baize. A steel army watch on a grey strap ticks on her own arm.'),
  d('peg', 'I never met her. We wrote. Thirty years of letters about mainsprings. She’d send me parts nobody else on earth could find, and never once let me pay the postage. I heard, love. I’m sorry.'),
  d('peg', 'And you’ve come for a W.W.W. because of a pocket in a roll. That is the most Blanche thing I ever heard. Go on, then. What do you know about them?'),
  choice([
    opt('“Nothing.”', [d('peg', 'Good. Nothing’s easy to work with. It’s the ones who know a bit that I can’t help.')]),
    opt('“It’s a British Army watch.”', [d('peg', 'That’s what’s written on the back. I asked what you know about the watch.')])
  ]),
  d('peg', 'Right. Before I show you one, I’m going to show you why there is one.'),
  goto('lon_peg')
]);

G.scene('lon_peg', [
  bg('portobello'), music('rain'),
  show('trenchX', { label: 'Silver · 1916' }),
  d('peg', 'Nineteen-sixteen. Silver. Older than anybody you’ll ever meet.'),
  d('peg', 'Up to about 1900 a wristwatch was jewellery. A bracelet with a watch in it, for ladies. The first one anybody can document, Breguet made for the Queen of Naples, and that was 1810. A gentleman kept his watch in his waistcoat, on a chain. There was a saying: a man would sooner wear a skirt than a wristlet.'),
  learn('wristlet'),
  d('peg', 'Then men started dying in large numbers and organised ways. You can’t go fishing in your tunic for a pocket watch with a rifle in your hands. And in the trenches everything ran to the minute. The guns lift at seven-thirty; you go over at seven-thirty. If your watch says seven twenty-nine, you walk into your own shells.'),
  d('peg', 'So they soldered loops of wire onto small pocket watches and strapped them on. Luminous numbers, so you could read them in a hole at night. That’s this. Have a proper look. It won’t bite. It’s a touch radioactive, but it won’t bite.'),
  hide(),
  inspect('trenchX', { need: 2, intro: 'Peg holds the torch. “Take your time. It’s waited a hundred and ten years.”' }),
  learn('trench'),
  d('peg', 'By 1918 a few million men had got used to looking at their wrists. They came home and went on doing it. Inside ten years nobody was making pocket watches for anyone under sixty.'),
  d('peg', 'That’s the whole history of the wristwatch, love. Women invented it, and a war stopped men being embarrassed.'),
  d('peg', 'Mind you, Cartier had made one in 1904 for a Brazilian who flew airships and needed both hands. The French will tell you that was the first. The French will tell you a lot of things.'),
  learn('santos'),
  hub('Ask Peg…', [
    opt('“What about the next war?”', [
      d('peg', 'By 1939 everybody knew a soldier needed a watch. The question was what kind. The Americans answered first: the A-11. Black dial, white numbers, a seconds hand you could stop to synchronise. Little thing. Made by the hundred thousand. They call it the watch that won the war, which is a bit rich, but it did turn up on time.'),
      learn('a11'),
      d('peg', 'Our lot took until 1945 to write down what they wanted. Then they wrote it down properly. Black dial. Luminous. Seconds at six. Shatterproof glass. Regulated like a [[chronometer]]. And since Britain couldn’t build them fast enough, they ordered from Switzerland. Twelve firms: Buren, Cyma, Eterna, Grana, Jaeger-LeCoultre, Lemania, Longines, IWC, Omega, Record, Timor, Vertex.'),
      d('peg', 'A hundred and fifty thousand watches, near enough, all to the one drawing. Collectors call them the Dirty Dozen, after the film. Get all twelve and you can bore people at parties for the rest of your life.'),
      learn('www')
    ]),
    opt('“What’s that on your wrist?”', [
      d('peg', 'Smiths W10. Nineteen sixty-eight. Made in Cheltenham: case, dial, movement, the lot. The last watch the British Army ever bought that was built in England.'),
      d('peg', 'We invented half of this, you know. The lever escapement. The balance spring, if you ask an Englishman. By the time this was made we had one factory left, and then that shut. After that the Army bought Swiss again, and in 1980 it bought quartz, the G10, and that was the end of winding.'),
      learn('w10', 'g10'),
      d('peg', 'I wear it so that somebody does.')
    ]),
    opt('“Did army watches change what everyone else wore?”', [
      d('peg', 'Everything you think a “proper” watch looks like came out of an army specification. Dark dial, white numbers, nothing you don’t need. After Everest in ’53, when Rolex wanted a watch to sell on the back of it, what they built was an officer’s watch with the rank taken off. The Explorer.'),
      learn('explorer'),
      d('peg', 'And the Americans kept at it. Korea, Vietnam: cheap, tough, olive drab, built to a government paper. The Hamilton you can buy in any shopping centre today is that watch with a nicer strap.'),
      learn('khaki'),
      d('peg', 'We call the whole family a [[field watch]]. Rule one of a field watch: you can read it in one second, in the rain. Rule two: see rule one.')
    ]),
    opt('“Do you know a dealer called Jacot?”', [
      d('peg', 'Gaspard Jacot. Geneva. Lovely manners, lovely shoes. He buys one thing: Corémont. Little La Chaux-de-Fonds house, dead since the seventies. Dress watches. Nice. Not *great*. And he has paid silly money for every one that’s come up, for twenty years, and nobody in the trade can work out why.'),
      d('peg', 'A man who pays over the odds for the same thing for twenty years isn’t collecting, love. He’s looking for something.'),
      fact('Peg: Jacot has bought every Corémont watch to surface for twenty years. “He isn’t collecting. He’s looking for something.”'),
      act(s => { s.flags.pegJacot = 1; })
    ]),
    opt('“Show me the W.W.W.s.”', [], { exit: true })
  ]),
  goto('lon_three')
]);

G.scene('lon_three', [
  bg('portobello'), music('rain'),
  d('peg', 'I’ve two. And since you’ll go and look anyway, there’s a third on young Dane’s table, two down, that you ought to see as well. I’m saying nothing about it.'),
  show(['cymaA', 'recordB', 'omegaC'], { label: true }),
  d('peg', 'The Cyma: three thousand four hundred of your dollars. The Record: two thousand three. And whatever Dane wants for his “Omega”. Nineteen hundred, last I heard, which ought to tell you something, because a right one is four thousand all day long.'),
  d('peg', 'First rule, and it’s the only one you get for nothing: [[buy the seller]]. You can’t know everything about a watch. You can know whether the person selling it will be standing here next Saturday.'),
  d('peg', 'The second rule you can work out for yourself. There’s my loupe. And cup your hands round each one and look at it in the dark: old [[lume]] and new lume don’t glow alike. Take your time. I’ve a flask.'),
  label('look'),
  hide(),
  hub('Which will you look at?', [
    opt('The Cyma.', [inspect('cymaA', { need: 3 })], { keep: true, note: '$3,400' }),
    opt('The Record.', [inspect('recordB', { need: 3 })], { keep: true, note: '$2,300' }),
    opt('Dane’s “Omega”.', [inspect('omegaC', { need: 3 })], { keep: true, note: '$1,900' }),
    opt('“I’ve seen enough.”', [], { exit: true })
  ], { min: 1 }),
  show(['cymaA', 'recordB', 'omegaC'], { label: true }),
  d('peg', 'Well?'),
  choice('Three watches that all say the same thing on the back. Which one goes in the first pocket?', [
    opt('The Cyma.', [
      hide(),
      haggle({ who: 'peg', watch: 'cymaA', ask: 3400, floor: 2950, walkLabel: 'Look again',
        flaws: { crystal: { off: 150, say: 'It’ll polish out. But fair enough: that’s a tube of paste and my Saturday afternoon. Call it a hundred and fifty.' } },
        nope: { dead: 'That’s how you know it’s right, love. I ought to charge you extra for that.', lume: 'Crumbled is honest. I’d worry if it wasn’t.', bars: 'They’re meant to be fixed. That’s the specification.', nums: 'Those are right. That’s what right looks like.' },
        lines: { open: 'The Cyma’s three thousand four hundred. Best one I’ve had in two years. I know exactly what it is, which is why it’s that.', counter: 'Not for that. {p}, and I’m being soft because of who you are.', final: '{p}. That’s me done, love. I’ve my own rent.', deal: 'Go on, then. Done.', pay: 'Sold. Look after it.', walk: 'It’ll be here. Have another look round.' } })
    ]),
    opt('The Record.', [
      hide(),
      haggle({ who: 'peg', watch: 'recordB', ask: 2300, floor: 1950, walkLabel: 'Look again',
        flaws: { brass: { off: 150, say: 'It’s worn through on the edges, yes. Brass underneath. I’ll take something off for that.' }, circleT: { off: 100, say: 'It’s a Ministry dial, not a factory one. Some mind. I’ve priced it for the ones who mind, but go on.' } },
        nope: { faint: 'That’s exactly what it should do.', print: 'It’s sharp because it’s twenty years younger. I told you that for nothing.' },
        lines: { open: 'The Record’s two thousand three hundred. Honest watch, honest history, wrong dial for a purist.', counter: '{p}. It’s a real issue piece.', final: '{p}, and that’s the end of it.', deal: 'Done.', pay: 'Sold.', walk: 'Have another look, then.' } })
    ]),
    opt('Dane’s “Omega”.', [
      hide(),
      n('Two tables down. Dane is about twenty-five and wears a gold chronograph the size of a jam-jar lid.'),
      haggle({ who: 'dane', watch: 'omegaC', ask: 1900, floor: 1500, hardFloor: 1150, patience: 3, walkLabel: 'Go back to Peg',
        flaws: { lume: { off: 100, say: 'It’s vintage, innit. They all look like that. …Yeah, all right. Bit off.' }, hands: { off: 100, say: 'Hands is hands. Someone’s serviced it, haven’t they. Fine.' }, glow: { off: 150, say: 'That’s just… it’s been restored. Sympathetically. All right, all right.' }, engr: { off: 100, say: 'Army done ’em all different. …Go on.' }, polish: { off: 50, say: 'I thought you’d like it clean.' }, arrow: { off: 50, say: 'It’s an arrow. What d’you want from an arrow.' } },
        lines: { open: 'Omega W.W.W. Proper Dirty Dozen. Nineteen hundred and I’m robbing myself.', counter: 'Can’t do that. {p}.', final: '{p}, last price, I’ve got a bloke coming at eight.', deal: 'Yeah, go on. Cash?', pay: 'Lovely. Pleasure.', walk: 'Your loss, mate.' } })
    ])
  ]),
  iff(() => !G.last || !G.last.bought, [jump('look')]),
  iff(s => s.paid.cymaA != null, [
    act(s => { s.flags.field = 'cymaA'; }),
    d('peg', 'Good. You looked at it in the dark before you looked at the price. Blanche did that.')
  ], [iff(s => s.paid.recordB != null, [
    act(s => { s.flags.field = 'recordB'; }),
    d('peg', 'Nothing wrong with that choice. The Army put that dial on it, not some bodger in a shed. It has *more* history than the Cyma, not less. It just isn’t the history it started out with.')
  ], [
    act(s => { s.flags.field = 'omegaC'; }),
    n('You come back to Peg’s table with it in your hand. She looks at it for less than a second.'),
    iff(saw('omegaC', 'glow'), [d('peg', 'You saw it glow. And you bought it anyway.')], [d('peg', 'You never looked at it in the dark, did you.')]),
    d('peg', 'Well. Everybody’s first is wrong, love. Mine was a “Rolex” with a Timex inside. I’ve still got it; keeps me humble. That’ll hold the pocket open. But one day you’ll want to swap it, and when you do, you come to me.')
  ])]),
  goto('lon_after')
]);

G.scene('lon_after', [
  bg('portobello'), music('rain'), hide(),
  slot('field', s => s.flags.field),
  n('It fits the hollow exactly. The leather remembers the shape.'),
  n('And the first page of her notebook, which was noise this morning, is suddenly only French.'),
  page('field'),
  d('peg', 'What does she say?'),
  me('That a watch is for reading. That everything else is decoration, and decoration should have to argue for its place.'),
  d('peg', 'Ha. Give me your wrist.'),
  show('heirloom'),
  n('She takes your arm without asking and turns her torch on your grandmother’s watch.'),
  d('peg', 'Seconds at six, big as a W.W.W.’s. Twelve plain marks and not a thing more. No numbers; she’d stopped needing the numbers. But the *proportions*. Whoever drew this dial had worn one of mine for twenty years. This is a soldier’s watch that’s been to finishing school.'),
  fact('The dial is laid out like a field watch: big seconds at six, and nothing that doesn’t help you read it. Papa’s W.W.W. is in its bones.'),
  hide(),
  d('peg', 'What’s next in the roll?'),
  me('*Corémont extra-plate, 1962.*'),
  iff(s => s.flags.pegJacot, [
    d('peg', 'Corémont. Well, well. Then you’ll be meeting your Mr Jacot again, won’t you.')
  ], [
    d('peg', 'Corémont! Dead little Chaux-de-Fonds house. Dress watches. There’s a Geneva dealer buys every one that comes up. Jacot. Mind him.')
  ]),
  d('peg', 'For a dead Swiss dress watch you want the place where the French keep everything they’ve stopped using. Saint-Ouen. The flea market, top end of Paris. Go tomorrow; it’s Sunday. In the Marché Vernaison, ask for Inès. She does the thin gold stuff nobody wants. Tell her Peg says she still owes me for the Longines.'),
  d('peg', 'And Lou. When you’ve all six. Come and show me. I’d like to see that roll full before I fold this table up for good.'),
  goal('Paris. The flea market at Saint-Ouen, on Sunday. Ask for Inès. Find a Corémont dress watch.'),
  goto('par_arrive')
]);
})();
