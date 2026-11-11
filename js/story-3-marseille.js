/* UNSIGNED — Chapter Three: Pressure (Marseille) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, label, jump, sfx, tick, music, inspect, haggle, bezel } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });

G.scene('mar_arrive', [
  hide(), tick(0),
  chapter('Chapter Three', 'Pressure', 'Marseille'),
  travel('marseille', { note: 'Three hours south on the TGV. The light changes at Avignon.', cost: 110 }),
  bg('marseille'), music('sea'), hud('Vallon des Auffes · Marseille', 'Tuesday, noon'),
  n('The Vallon des Auffes is a fishing port the size of a tennis court, tucked under a road bridge as if the city had tried to hide it. It is December, and the light is still hard enough to make you squint.'),
  n('The address is a boathouse. The man mending a net in front of it does not look up.'),
  d('marius', 'If you’re from the insurance, I’m dead.'),
  me('Inès sent me. From Saint-Ouen.'),
  d('marius', 'Then you’ve brought a bottle.'),
  n('You have. He inspects the label for longer than he will later inspect you.'),
  n('Seventy-eight, he says. The colour of a walnut, forearms like rope. On one of them, bare in December, a watch with a dial as orange as a life-jacket.'),
  d('marius', 'Compagnie Maritime d’Expertises. COMEX. Here, in Marseille. Nineteen seventy-one to eighty-eight. I lived in a steel tube at the bottom of the North Sea, breathing helium, a month at a time, and they paid me like a footballer. Sit. You want a Compressor. First you tell me what a dive watch is *for*.'),
  choice([
    opt('“Knowing what time it is underwater.”', [d('marius', 'Nobody cares what time it is underwater. No. Listen.')]),
    opt('“Knowing how long you’ve been down.”', [d('marius', '*Voilà.* Inès doesn’t send me idiots.')]),
    opt('“Staying alive.”', [d('marius', 'Yes. But how?')])
  ]),
  d('marius', 'You go down with a tank of air on your back. The air lasts so many minutes; the deeper, the fewer. Stay too long and you drown, or you come up with your blood fizzing like this bottle. So one number matters, and it is not the time. It is the time *elapsed*. How long have I been under?'),
  d('marius', 'Give me your eyes. I’ll show you on mine.'),
  bezel({ watch: 'w_marius', minute: 17, elapsed: 23, eyebrow: 'Marius’s Doxa', title: 'Mark the dive', goLabel: 'He goes under', diveLine: 'The orange dial goes green, then grey, then it is gone.',
    lines: { set: '“I’m going in. Now. Turn the ring until the triangle sits on the big hand.”', over: '“Too far! And it won’t come back; it turns the one way only. Go round again. Underwater you’d have less time to be annoyed.”', marked: '“There. The triangle is zero. Everything after it is my life.”', ask: '“I’m back. Don’t look at the hour. How long was I down?”', right: '“Twenty-three. You read it off the ring, where the big hand points. No arithmetic. Arithmetic is the first thing to go at forty metres.”', wrong: '“No. Where does the big hand point *on the ring?*”' } }),
  d('marius', 'It turns one way only. You saw. If I knock it on a rock, it can only move so as to tell me I’ve been down *longer*. Never shorter. It can only lie in the direction that keeps me alive. A [[unidirectional bezel]]. A ring of steel and a ratchet. That’s all the genius there is.'),
  hub('Ask Marius…', [
    opt('“Who made the first one?”', [
      d('marius', 'First you need two things that have nothing to do with diving. A case that doesn’t leak: Rolex, 1926, the Oyster. Screw-down back, screw-down crown. They hung one round the neck of a girl swimming the Channel, for the newspapers.'),
      d('marius', 'And a watch you don’t have to unscrew to wind. The [[rotor]]: Rolex again, 1931. Though an Englishman called Harwood got there first and got nothing for it.'),
      learn('oyster', 'perpetual'),
      d('marius', 'Then the Italians, 1936. Their navy wanted watches for men who rode torpedoes into enemy harbours at night. Panerai, in Florence. Big as a saucer, shining with radium. For half a century nobody but frogmen knew they existed.'),
      learn('radiomir'),
      d('marius', 'And then 1953, the year everything happened. A French officer, Maloubier, a combat swimmer, a real pirate, wants a watch for his men. Black dial, big luminous marks, a ring that turns to mark the time. Nobody will build it. Until a small house called Blancpain, whose boss happens to dive on his holidays. The Fifty Fathoms. *Ours.* Drawn for this coast.'),
      learn('fiftyfathoms'),
      d('marius', 'The same year Rolex shows the Submariner. Who was first by a month, the Swiss can argue about. I’ll tell you which one the French Navy bought.'),
      learn('submariner')
    ]),
    opt('“Why is yours orange?”', [
      d('marius', 'Doxa, 1967. They tried colours in the lake at Neuchâtel and found orange was the easiest to read in murky water. Down to a certain depth. Below that, orange goes grey like everything else. People will tell you it’s “the last colour to disappear”. It’s one of the first. But at twenty metres in the Vieux-Port, it’s a lamp.'),
      learn('doxa'),
      d('marius', 'Cousteau’s people sold them in America. And look at the ring: two scales. Outside, the depth. Inside, how many minutes you may stay there without stopping on the way up. The American Navy’s tables, engraved on your wrist.')
    ]),
    opt('“What is a Compressor?”', [
      d('marius', 'Ah. *That* is clever. Everybody else kept the water out by screwing everything down as hard as they could. In the Jura there was a case-maker, Piquerez, who said: why fight the sea? Use it. He put the back on a spring. The deeper you go, the harder the water pushes the back onto its seal. *Plus ça serre, mieux ça tient.*'),
      learn('compressor'),
      d('marius', 'Two crowns: one for the hands, one to turn a ring *under* the glass. Piquerez sold that case to everybody. A hundred names on the dial; one little diver’s helmet stamped inside the back.'),
      d('marius', 'Omega went their own way in ’57. The Seamaster 300: big ring on the outside, like Rolex.'),
      learn('seamaster300')
    ]),
    opt('“What was it like, living under pressure?”', [
      d('marius', 'You don’t dive from the surface. Six of you live in a chamber at the pressure of the sea bed, for a month. You breathe helium so the nitrogen doesn’t send you mad. You all sound like ducks. And when the job is done they take *five days* to bring the pressure down. [[Saturation diving]].'),
      d('marius', 'The first time, on the way up, the watches exploded. Truly. Pop: the glass across the chamber. Helium is the smallest thing there is; it creeps past any seal. Going down, it gets in. Coming up, it can’t get out fast enough.'),
      d('marius', 'So in ’67 Rolex put a tiny valve in the side of the case, to let it out. One way only. The Sea-Dweller. A [[helium valve]]. They made them for us, for COMEX. Mine had the name on the dial.'),
      d('marius', 'Omega solved it the other way: build a case so brutal that nothing gets in at all. The Ploprof. It looks like a doorknob. I knew a man who opened oysters with his.'),
      learn('seadweller', 'ploprof'),
      choice([
        opt('“Where is your Sea-Dweller now?”', [d('marius', 'I sold it in 1989 for the price of an outboard motor. People tell me what it’s worth today. They tell me every week. I’ve stopped answering the door.')]),
        opt('Let it go.', [])
      ])
    ]),
    opt('“Did the Japanese make dive watches?”', [
      d('marius', 'Seiko, 1965. A decent copy of the idea. Then a diver in Japan wrote to them, a professional, a saturation man, and said: your watches break. And instead of a lawyer, they sent engineers. Seven years. In ’75 they came out with a thing in titanium with a shroud round it like a tin of fish. We called it the Tuna. It needed no helium valve, because the helium couldn’t get in to begin with.'),
      learn('62mas', 'tuna'),
      d('marius', 'That’s when I knew the Swiss were in trouble. Not the quartz. That somebody had listened to a diver.')
    ]),
    opt('“Show me what’s in the biscuit tin.”', [], { exit: true })
  ]),
  goto('mar_tin')
]);

G.scene('mar_tin', [
  bg('marseille'), music('sea'),
  n('The tin once held *navettes*, the hard little boat-shaped biscuits of Marseille. Now it holds a chamois cloth and, this year, two watches.'),
  show(['enicarA', 'skinB'], { label: true }),
  d('marius', 'The Enicar. A real Compressor, sixty-four, sixty-five. Twenty-eight hundred and fifty of your dollars, and I don’t discuss. Well. I discuss a little. And that one, for the beach: four hundred and twenty. Honest, the pair of them. I don’t keep liars in the tin.'),
  d('marius', 'The Enicar I’ll open for you. The other one, no.'),
  label('look'),
  hide(),
  hub('Which will you look at?', [
    opt('The Enicar.', [inspect('enicarA', { need: 4 })], { keep: true, note: '$2,850' }),
    opt('The beach watch.', [inspect('skinB', { need: 3 })], { keep: true, note: '$420' }),
    opt('“I’ve looked.”', [], { exit: true })
  ], { min: 1 }),
  show(['enicarA', 'skinB'], { label: true }),
  choice('One is the case her husband’s workshop made. One is four hundred and twenty dollars.', [
    opt('The Enicar.', [
      hide(),
      haggle({ who: 'marius', watch: 'enicarA', ask: 2850, floor: 2450, walkLabel: 'Look again',
        flaws: { crown4: { off: 150, say: 'Yes, yes, the crown. A watchmaker in Toulon, 1971; I was standing there. The correct part. Fine. I take something off.' }, tide: { off: 200, say: 'It went in the sea, and the sea came in. Once. It has been dry for forty years. But you have eyes; I’ll pay for your eyes.' } },
        nope: { helmet: 'That’s not a fault. That’s the patent!', spring: 'That’s how it *works*. Were you listening?', lume: 'If it glowed I’d be worried.', inner: 'That is the whole idea of the watch.', crown2: 'That one is right. That is exactly right.', rotor: 'It’s an automatic. It’s supposed to have one.' },
        lines: { open: 'Twenty-eight fifty. It’s the last Compressor I have, and I dived with it.', counter: 'No. {p}. I’m old, not stupid.', final: '{p}. Or I put it back in the tin and we finish the bottle.', deal: 'Bon. Done.', pay: 'Sold. Don’t take it in the sea until a watchmaker has changed the seals.', walk: 'Look again. I’m not going anywhere.' } })
    ]),
    opt('The beach watch.', [
      hide(),
      haggle({ who: 'marius', watch: 'skinB', ask: 420, floor: 340, walkLabel: 'Look again',
        flaws: { bezel: { off: 40, say: 'The ring is tired. I told you that myself. Take forty off.' } },
        nope: { words: 'Everybody printed that. I didn’t.', name: 'A shop’s name is no shame.', lume: 'Good, isn’t it? Nobody’s touched it.' },
        lines: { open: 'Four hundred and twenty. It’s an honest watch for a swim and an aperitif.', counter: '{p}. It’s already nothing.', final: '{p}, and we don’t talk about it again.', deal: 'Done.', pay: 'Sold.', walk: 'Look again.' } })
    ])
  ]),
  iff(() => !G.last || !G.last.bought, [jump('look')]),
  iff(s => s.paid.enicarA != null, [
    act(s => { s.flags.diver = 'enicarA'; }),
    d('marius', 'Good. Then it goes to someone who looked inside before asking the price.')
  ], [
    act(s => { s.flags.diver = 'skinB'; }),
    d('marius', 'It isn’t a Compressor. You know that. Money?'),
    me('Money.'),
    d('marius', 'No shame in a beach watch. But when you can, come back. I’ll keep the Enicar in the tin till spring. I told you: I like very few people.')
  ]),
  goto('mar_after')
]);

G.scene('mar_after', [
  bg('marseille'), music('sea'), hide(),
  slot('diver', s => s.flags.diver),
  page('diver'),
  n('*I found out then that it is also how a widow is built.* You read it twice. Marius waits. He is good at waiting; it was his profession.'),
  d('marius', 'The husband made cases.'),
  me('At Piquerez. From 1963.'),
  d('marius', 'Then give me that.'),
  show('heirloom', { view: 'back' }),
  n('He holds out a hand for your grandmother’s watch. He uses no tool. He presses the back with both thumbs, turns it a fraction, and it lifts away with a sigh.'),
  d('marius', '*Putain.* Look at that. You see the ring? The back is on a spring. This is a Compressor back. On a dress watch! But no helmet. No *Brevet*. No Piquerez.'),
  d('marius', 'I’ll tell you what this is. A man who made these all day, for other people’s names, stayed behind one evening and made one for himself, on the firm’s lathe. We have a word. *La [[perruque]].* The wig. Every workshop in France has made a few wigs. It isn’t stealing. It’s signing. The only way a worker signs.'),
  fact('The caseback is sprung like a Super Compressor, with no patent mark: made after hours on the firm’s machines. Émile’s case.'),
  n('He clicks it shut, and holds it to his ear for a moment before he gives it back, as though checking that it had survived him.'),
  d('marius', 'A dress watch that could go to thirty metres, and nobody was ever to know. He must have loved her like an idiot.'),
  hide(),
  m('claire', 'Landlord called. He has somebody who wants the unit from Jan 1. Not one day past the 31st. How much have you spent?'),
  choice([
    opt('Tell her.', [
      m('lou', s => `${G.money(8800 + 1800 - s.cash)} so far. Three watches. Three pages.`),
      m('claire', 'Lou.')
    ]),
    opt('“Enough.”', [m('claire', 'That’s what she used to say.')])
  ]),
  m('gaspard', 'Lou — I shall be in New York for the December sales. Come as my guest. You should see where watches go when they stop being watches. — G.J.'),
  m('mai', 'Pocket 4 is a chronograph, right? New York. W 47th St, booth 61, Lola Espinal. Her dad taught me dial work. Sell the orphan there. HONESTLY.'),
  goal('New York. West 47th Street, booth 61: Lola. Sell the orphan. Find a chronograph from 1969.'),
  goto('ny_arrive')
]);
})();
