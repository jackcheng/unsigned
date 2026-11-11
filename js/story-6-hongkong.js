/* UNSIGNED — Chapter Six: The Time Before (Hong Kong) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, sfx, tick, music, inspect, stamp } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });
const nFound = id => s => Object.keys(s.obs[id] || {}).length;

G.scene('hk_arrive', [
  hide(), tick(0),
  chapter('Chapter Six', 'The Time Before', 'Hong Kong'),
  travel('hongkong', { note: 'Four hours south-west. You change your watch by one hour, and your coat entirely.', cost: 310 }),
  bg('hk'), music('neon'), hud('Tsim Sha Tsui · Hong Kong', 'December 23'),
  n('For much of the last twenty years Hong Kong has bought more Swiss watches than anywhere on earth. On Nathan Road every third shopfront is a wall of them, under lights hot enough to tan. The real business is upstairs.'),
  n('Four flights up, behind a steel gate: a room the size of a lift. One desk, one safe, one fan, one man.'),
  d('wing', 'Sakamoto’s friend’s grandchild. Sit down. He says my bezels are wrong?'),
  me('He said to tell you they are *still* wrong.'),
  d('wing', 'Forty years! He is thinking of one bezel. It was 1986. Sit, sit.'),
  n('Seventy; a white shirt; and on his wrist the heaviest-looking watch you have seen yet. Solid yellow gold, on a bracelet like a tank track.'),
  hub('Ask Uncle Wing…', [
    opt('“Why gold?”', [
      d('wing', 'My father came from Shanghai in 1949 with one suitcase, and this watch’s grandfather sewn into his coat. You understand? A house, you cannot carry. Money becomes paper overnight. A gold Rolex is the same price in every city in the world, and it crosses a border on your arm. For my father’s generation that was not jewellery. It was a passport.'),
      d('wing', 'The date in a window, the fluted bezel, this bracelet: Rolex has made it since 1945, the Datejust, and hardly changed a line. That is the trick. A watch you can recognise from across a restaurant. It was the first like that.'),
      learn('datejust')
    ]),
    opt('“Tell me about pilots’ watches.”', [
      d('wing', 'A pilot has the problem the sailor had before him. To know where you are, you must know exactly what time it is somewhere else. Lindbergh flies the Atlantic in 1927, and afterwards he draws a watch himself, for Longines: a bezel that turns, to work out his longitude from the sun. 1931.'),
      learn('hourangle'),
      d('wing', 'Then war. The German air force orders an observer’s watch as big as the lid of a jam jar. Black dial, white numbers, a triangle at twelve so that you know which way is up when the aeroplane does not. The *Flieger*. Every pilot’s watch in a shop today is a small one of those.'),
      learn('flieger'),
      d('wing', 'The British answer: the Mark 11, 1948. Small, plain, with a cage of soft iron inside so the magnets in the instruments cannot stop it. For navigators. People say it is the best military watch ever made, and I have never won that argument.'),
      learn('mark11'),
      d('wing', 'And for pilots who liked arithmetic: Breitling, 1952. A circular slide rule round the dial. Fuel, speed, distance. The Navitimer. You need good eyes and a patient co-pilot.'),
      learn('navitimer')
    ]),
    opt('“And two time zones at once?”', [
      d('wing', 'The jet. Before the jet you crossed an ocean in five days on a ship, and your body changed its own time. After it, you eat breakfast in London and lunch in New York, and your head is nowhere.'),
      d('wing', 'Glycine, 1953: the Airman. Twenty-four hours on the dial, a second twenty-four on the bezel. Cheap. Tough. Then Pan American asks Rolex for a watch for its crews: the GMT-Master, 1954. An extra hand that goes round once a day, and a bezel in two colours, red for day and blue for night. Everybody calls it the Pepsi.'),
      learn('airman', 'gmtmaster'),
      d('wing', 'And for the man who does not fly the plane but owns it: the world-timer. A Geneva watchmaker, Cottier, in the thirties. A ring of city names; all twenty-four zones at once. I think you have seen one, in your head, every time you changed planes.'),
      learn('worldtimer')
    ]),
    opt('“I’m looking for an Airman.”', [], { exit: true })
  ]),
  d('wing', 'An Airman I have. A good one. Thirteen hundred US. But I do not sell to someone I have not examined.'),
  show('gmtFake', { label: '“GMT-Master, 1968, all original”' }),
  d('wing', 'So. An examination. This came in last week with a young man who was very sure. He said: GMT-Master, 1968, all original, eighteen thousand dollars.'),
  d('wing', 'Tell me three things wrong with it, and the Airman is eleven hundred. Four, and it is one thousand. Use the dark. Take your time. I have the fan.'),
  hide(),
  inspect('gmtFake', { need: 0, done: 'I’ve seen enough', intro: 'An examination. Find what is wrong. Don’t forget to look at it in the dark.' }),
  iff(s => nFound('gmtFake')(s) >= 4, [
    d('wing', 'Four! And the hands against the dial in the dark; I did not expect that one. Who taught you?'),
    me('A woman at a market in the rain. A man with a biscuit tin. A dealer with a neon sign.'),
    d('wing', 'And your grandmother.'),
    me('She tried. I wasn’t listening.'),
    d('wing', 'You are listening now. One thousand.'),
    act(s => { s.flags.airPrice = 1000; })
  ], [iff(s => nFound('gmtFake')(s) === 3, [
    d('wing', 'Three. Good. You have eyes. Eleven hundred.'),
    act(s => { s.flags.airPrice = 1100; })
  ], [
    d('wing', 'Hm. You have eyes, but you have not finished looking. Thirteen hundred. Less fifty for honesty, because you did not pretend.'),
    act(s => { s.flags.airPrice = 1250; })
  ])]),
  d('wing', 'You understand why I ask. Every part of that watch may be a real part. A bezel from here, a dial from there, a hand from a later model. A [[frankenwatch]]. The young man did not know. Somebody sold it to him for sixteen thousand. The most expensive thing in this business is the education.'),
  show('airmanA', { label: true }),
  d('wing', 'Now the real one. Look.'),
  hide(),
  inspect('airmanA', { need: 3 }),
  d('wing', s => `${G.money(s.flags.airPrice)}. In this room the price is the price.`),
  choice([opt(s => `Pay ${G.money(s.flags.airPrice)}.`, [])]),
  act(s => { s.paid.airmanA = s.flags.airPrice; }),
  s => cash(-s.flags.airPrice, 'Glycine Airman'),
  slot('gmt', 'airmanA'),
  page('gmt'),
  n('*Sold 1994. Lou est là. I only want the time Lou is in.*'),
  n('You read it standing up, in a room the size of a lift, with a fan turning. Uncle Wing has found something in the safe that needs his attention.'),
  choice([
    opt('Set the Airman the way she did.', [
      show('airmanA'),
      n('You pull the crown. The little pin rises at twenty-four and catches the seconds hand. You set the hands to Montréal. Then you turn the bezel six hours on, to a street in the Jura, and lock it.'),
      act(s => { s.flags.setAirman = 1; }),
      hide()
    ]),
    opt('Put it in the roll without touching it.', [])
  ]),
  m('lou', 'Pocket six. The tag says: “Sold 1994 — Lou is here. I no longer need the time before.”'),
  m('claire', '…I called it the sad watch.'),
  m('claire', 'I was TEN.'),
  m('claire', 'I’m at the shop. I’ve stopped packing. All the clocks are stopped and I can’t stand it, so I’m winding them. It takes for ever. How did she do this every Monday.'),
  d('wing', 'You have one more day in Hong Kong. You should see where watches come from. Not Switzerland. I mean where they *come from*. My niece’s boy has a factory. Kit!'),
  goal('The roll is full. One more day in Hong Kong: Kit’s factory.'),
  goto('hk_factory')
]);

G.scene('hk_factory', [
  hide(), bg('factory'), music('city'), hud('A case factory, across the border', 'December 24'),
  n('Forty minutes by train and one border, in a district that is nothing but factories. Kit Leung’s family have been making watch cases since Kit’s grandfather bought one second-hand lathe in Kowloon in 1968. They moved the works over the border in the eighties.'),
  d('kit', 'Granddad started with plastic. LCD cases, 1977: two million a year, for brands in Texas and Tokyo. People say “the quartz crisis” as if it was weather. It was us. It was Kowloon.'),
  n('Now it is a hall as clean as a hospital. Forty machines the size of wardrobes, each with a window, each milling a block of steel into a watch case with a sound like tearing silk.'),
  hub('Ask Kit…', [
    opt('“Who are these for?”', [
      d('kit', 'Can’t say. Contracts. More Swiss names than you’d think. The label says [[Swiss Made]] and it’s true: the rule is sixty per cent of the cost Swiss, plus the movement, plus final assembly. The other forty can come from anywhere. A lot of it comes from here. It’s not a scandal. It’s just [[établissage]], with container ships.'),
      d('kit', 'And about thirty brands that didn’t exist ten years ago. Two people and a laptop. They email me a drawing. They buy a movement from Japan or Switzerland, a dial from down the road, straps from Italy. I send back three hundred watches, and they sell them online, direct, no shop. We call that a [[microbrand]].'),
      me('People just… start watch brands?'),
      d('kit', 'Every week. Most are dead in two years: a famous dive watch with a different word on it. The ones that live? There’s one in Vancouver. One in Glasgow that fires its own enamel dials. One in Paris that began because the founder’s father left him a box of old watches and a notebook.'),
      me('A notebook.'),
      d('kit', 'Yeah. Why?'),
      d('kit', 'The ones that live know why they exist. That’s the only difference. Same factory. Same steel.')
    ]),
    opt('“How did the Swiss survive at all?”', [
      d('kit', 'Two ways. Up, and down.'),
      d('kit', 'Up: 1972. Audemars Piguet is in trouble. They ring a designer called Genta the night before a trade fair and say, we need a steel sports watch nobody has seen. He draws it overnight, or so the story goes. An octagon, eight screws showing, and a bracelet that is part of the case: an [[integrated bracelet]]. The Royal Oak. Steel, and priced above gold watches. Everyone thought they had lost their minds.'),
      learn('royaloak'),
      d('kit', 'But it changed what *expensive* meant. Not the metal. The design, the finishing, the idea. Four years later Genta does it again for Patek: the Nautilus. Every “luxury sports watch” is a grandchild of that one night.'),
      learn('nautilus'),
      d('kit', 'Down: 1983. The banks that own the big Swiss groups are ready to break them up. And a few engineers say: we can’t beat Asia on labour, so take the labour out. Fifty-one parts instead of ninety-something. The case welded shut. Built by robots, in plastic, in colours. Sell it as fashion. The Swatch.'),
      learn('swatch'),
      d('kit', 'Granddad bought one to take apart. He said, “They’ve beaten us with our own stick.” The Swatch money kept the lights on at half the grand old names until mechanical came back.')
    ]),
    opt('“Mechanical came back?”', [
      d('kit', 'Yeah. That’s the strange part, right? By 1985 a ten-dollar quartz beats any mechanical watch ever made. So nobody *needs* one. And that is exactly when people start to *want* them. Because now it isn’t a tool. It’s a thing a person made, that runs on a spring, that you can hear.'),
      d('kit', 'Once nobody needs your product, the story is the product. You can do that honestly, or you can do it the other way.')
    ]),
    opt('“Show me how a dial gets its name.”', [], { exit: true })
  ]),
  n('At the end of the hall, a machine no bigger than a sewing machine. A steel plate engraved with lettering in reverse. A pot of ink. Above it, a soft red dome of silicone, like the nose of a clown.'),
  d('kit', '[[Pad printing]]. Ink goes into the engraving; the pad picks it up; the pad puts it down. That is how every dial in the world gets its words. This job’s a new client. Swiss guy, Geneva, very good drawings, pays on time. Go on. You do one.'),
  stamp({ cfg: s => G.watches.dialBlank.cfg(s), printed: s => G.watches.dialPrinted.cfg(s), eyebrow: 'The pad printer', button: 'Press',
    say: 'A blue dial sits in the jig. Finished, lacquered, and perfectly empty. Kit calls it a [[dial blank]].', after: 'CORÉMONT. *Depuis 1921.* It took about four seconds.' }),
  n('You look at it for a long moment. Then at the rack behind it: three hundred identical blue dials, drying. Each with the same word.'),
  d('kit', 'You know them?'),
  choice([
    opt('“My grandmother worked there. The real one.”', []),
    opt('“It’s a dead brand. Somebody bought the name.”', [])
  ]),
  d('kit', 'Ah. A zombie. We do a few. Honestly? His is a good watch. Good case; I should know. Good movement. It’s only that the sentence on the dial is about somebody else.'),
  d('kit', 'Let me see yours.'),
  show('heirloom'),
  n('Kit puts your grandmother’s watch under a microscope, the kind with a screen. The dial fills it like a snowfield.'),
  d('kit', 'Huh. Okay. So this is strange.'),
  d('kit', 'The markers are applied. Riveted, by hand. Nice. But there is no print. None. No minute track, no “Swiss”, nothing. And look at the lacquer: no ghost, no pad mark. It isn’t that a name wore off, or somebody removed it. This dial was *finished*. And then it skipped the last machine. On purpose.'),
  d('kit', 'Nobody orders that. Printing is the cheapest step there is. It’s four seconds. You would have to stand there and say: no. Stop. Leave it. Leave it blank.'),
  n('Blank.'),
  n('Something moves at the back of your head, in French.'),
  d('kit', 'In the trade a dial like that, before printing, we just call it a blank. I guess in French that’s… what?'),
  me('*Blanc.*'),
  n('White. Blank. The same word. And for a woman —'),
  me('*Blanche.*'),
  n('*It’s signed. You’re just not reading it right.*'),
  n('Sixty years. On her wrist at the dishes, at the bench, at your mother’s graduation, on the day you were born: her name, in the only letters nobody could forbid her. She wrote it by leaving it out.'),
  fact('The dial was finished and then, on purpose, never printed. A blank. *Blanche.* It has been signed all along.'),
  hide(),
  m('lou', 'It IS signed.'),
  m('claire', '?'),
  m('lou', 'The dial. It isn’t unsigned. It’s blank. Blanc. BLANCHE.'),
  n('Three dots appear. And disappear. And appear.'),
  m('claire', 'I asked her when I was twelve.'),
  m('claire', 'It has been in front of me my whole life.'),
  m('claire', 'Where are you going next.'),
  m('lou', 'The roll is full. She said the seventh would explain the rest. La Chaux-de-Fonds. Jacot will be there on the 31st.'),
  m('claire', 'I haven’t been back since I was ten.'),
  m('claire', 'I’ll meet you in Geneva on the 29th. Don’t argue. I know the way from the station. My feet know.'),
  d('kit', 'Hey. When you’re finished with… whatever this is. If you ever want to make something. Send me a drawing. Not a brand deck. Not a “story”. A drawing.'),
  choice([
    opt('“I’m not a watch person. I design apps.”', [d('kit', 'You’ve been in six countries in a month, looking at dials through a loupe. I have bad news for you.')]),
    opt('“A drawing of what?”', [d('kit', 'You tell me. You’re the one who has held ten of them.')])
  ]),
  goal('La Chaux-de-Fonds, with your mother. The seventh watch will explain the rest.'),
  goto('jura_arrive')
]);
})();
