/* UNSIGNED — Chapter Four: 1969 (New York) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, label, jump, sfx, tick, music, inspect, haggle } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });
const saw = (id, ob) => s => !!(s.obs[id] && s.obs[id][ob]);
const CERT = { html: '<div class="p-cert"><h4>Observatoire cantonal de Neuchâtel</h4><p>Bulletin de marche · Concours chronométrique de 1967</p><p class="big">Corémont · calibre 13‴ · N° 7</p><p>Chronomètre-bracelet · 1<sup>er</sup> prix de série</p><p>Régleur : <span class="hand">H. Jacot</span></p></div>' };

G.scene('ny_arrive', [
  hide(), tick(0),
  chapter('Chapter Four', '1969', 'New York'),
  travel('newyork', { note: 'Marseille, Paris, and eight hours of Atlantic.', cost: 480 }),
  bg('nyc'), music('city'), hud('West 47th Street · New York', 'Mid-December'),
  n('One block of West 47th Street does more business in watches and stones than most countries. More than two thousand dealers, most of them in booths the size of a wardrobe, inside buildings called *exchanges*. Nothing has a price tag. Everything has a price.'),
  n('Booth 61 has a neon sign: ESPINAL & DAUGHTER. The *& DAUGHTER* is newer than the rest.'),
  d('lola', 'You’re Mai’s person. The grandkid. Okay, two things. One: I’m sorry about your grandmother. My dad says she was the only watchmaker in Canada he’d trust with a hairspring. Two: Mai says you’re broke and you have an Omega. Broke first. Let me see it.'),
  show('orphan', { label: true }),
  n('You put the orphan on her pad.'),
  d('lola', 'Uh-huh. Before I look: you tell *me* what it is. Pretend I’m a stranger on the internet with nine hundred dollars and trust issues.'),
  hide(),
  inspect('orphan', { need: 3, intro: 'Know what you’re selling before you sell it.' }),
  show('orphan', { label: true }),
  d('lola', 'Okay. Now write me the listing. Out loud. Start with the dial.'),
  act(s => { s.flags.honest = 0; }),
  choice('The dial:', [
    opt('“Original dial. Light freckling near the edge.”', [act(s => { s.flags.honest++; })]),
    opt('“Stunning original dial!”', [])
  ]),
  choice('The case and crown:', [
    opt('“Replacement crown. The case has been polished at some point.”', [act(s => { s.flags.honest++; })]),
    opt('Don’t mention them.', [])
  ]),
  choice('The movement:', [
    opt('“Serviced last month, by a watchmaker I can name.”', [act(s => { s.flags.honest++; })]),
    opt('“Runs great!”', [])
  ]),
  iff(s => s.flags.honest === 3, [
    d('lola', '*That* is a listing. You told me the two things I’d have found in ten seconds. So now I believe you about the thing I can’t check, which is the service.'),
    d('lola', 'Eleven hundred. And I’ll make two hundred on it by Friday, because I can put *my* name behind *your* description.'),
    cash(1100, 'the Omega, sold to Lola'),
    act(s => { s.flags.honestSeller = 1; })
  ], [iff(s => s.flags.honest > 0, [
    d('lola', 'Mm. You know what a buyer hears when half the story’s missing? “Hiding something.” I found the rest in about four seconds. So now I’m wondering what else there is.'),
    d('lola', 'Nine hundred.'),
    cash(900, 'the Omega, sold to Lola')
  ], [
    d('lola', 'So that’s a lie, with adjectives. I’d find the crown in four seconds and the polish in six, and then I’d never buy from you again, and neither would anybody I have lunch with.'),
    d('lola', 'Seven-fifty, because I like Mai.'),
    cash(750, 'the Omega, sold to Lola')
  ])]),
  hide(),
  d('lola', 'People think a dealer’s margin is greed. It’s rent, it’s the watch that came back, and it’s the three in the drawer nobody wants. The margin is the price of still being here next week.'),
  d('lola', 'Sell it the way you’d want it sold to you. The whole business is that sentence. On this street a reputation takes twenty years and one watch.'),
  act(s => { s.flags.orphan = 0; }),
  d('lola', 'Okay. Now the fun part. You want a chronograph from ’69. Do you know why that year?'),
  hub('Ask Lola…', [
    opt('“What is a chronograph, exactly?”', [
      d('lola', 'A watch with a stopwatch built in. Two jobs, one case. Top button starts and stops. Bottom button resets. Breitling worked out the two-button thing in the thirties and nobody has improved on it.'),
      learn('breitling2'),
      d('lola', 'It is *not* a [[chronometer]]. Chronometer means it passed an accuracy test. [[Chronograph]] means it has buttons. People mix them up at dinner and I leave the dinner.')
    ]),
    opt('“What’s that on your wrist?”', [
      d('lola', 'Speedmaster. Omega, 1957. It was for race-car guys: the first watch to put the [[tachymeter]] out on the bezel where you could read it.'),
      learn('speedmaster'),
      d('lola', 'Then NASA needed a watch for spacewalks. They asked a few brands for chronographs and tried to kill them. Baked them, froze them, shook them, put them in a vacuum. This is the one that was still running. 1965.'),
      d('lola', 'July ’69, it’s on Buzz Aldrin’s arm on the Moon. April ’70, Apollo 13, the computers are off to save power, and they time a fourteen-second engine burn on a wristwatch to get home. That’s not marketing. That’s just what happened.'),
      learn('moonwatch')
    ]),
    opt('“What else came out of racing?”', [
      d('lola', 'Heuer. Jack Heuer, the family’s kid; he ran their office here in New York for a while. He hated cluttered dials. In ’63 he draws the Carrera: clean, wide open, named after a road race in Mexico that killed people. That’s the modern chronograph face, right there.'),
      learn('carrera'),
      d('lola', 'Same year, Rolex does the Cosmograph. Later they print *Daytona* on it, for the speedway. And nobody wanted it. I’m serious. My dad remembers dealers *throwing one in* to close the sale on a gold watch.'),
      d('lola', 'Especially the ones with the funny art-deco dials. Those sat in the case for years. Then Paul Newman wore one in some photographs, Italian collectors started calling it “the Paul Newman”, and in 2017 Newman’s own watch sold across town for seventeen point eight *million* dollars.'),
      learn('daytona'),
      d('lola', 'First law of collecting: everything precious was once unwanted. Second law: by the time you’ve heard that, it’s too late for that one.')
    ]),
    opt('“So what happened in 1969?”', [
      d('lola', 'Every chronograph up to then, you wound by hand. The [[automatic]] chronograph was the last big thing nobody had built: two complicated machines in one small box. By the late sixties three teams are racing to do it, in secret.'),
      d('lola', 'Zenith, in Le Locle. They announce first, January ’69. The El Primero. It beats ten times a second, and they still make it.'),
      learn('elprimero'),
      d('lola', 'Heuer and Breitling and a couple of partners: rivals who split the bill. Calibre 11. They unveil it in March, in Geneva and New York on the same day. That’s the square blue Heuer Monaco, the Steve McQueen one.'),
      learn('calibre11'),
      d('lola', 'And Seiko, who told nobody anything, and just put theirs on sale in Japan that May. The 6139. If “first” means “first in a shop”, it might have been them.'),
      learn('seiko6139'),
      d('lola', 'Who won? Depends who’s telling it. They all crossed the line inside a few months.'),
      d('lola', 'And then, this is the part that kills me, on Christmas Day that same year Seiko sells the first quartz wristwatch. So 1969 is the greatest year mechanical watches ever had. And the last.')
    ]),
    opt('“Why are some of these so cheap?”', [
      d('lola', 'Because the famous ones and the forgotten ones have the same guts. There was a movement factory, Valjoux. They sold hand-wound chronograph movements to anybody with a chequebook: Heuer, Breitling, and two hundred little brands that are gone. We call those “poor man’s Heuers”. Same engine, wrong name, a tenth of the money.'),
      d('lola', 'Valjoux’s automatic came in ’73, the 7750, drawn partly with a computer, which was science fiction then. Quartz nearly killed it. The story is that somebody kept the tooling instead of scrapping it like they were told. Good thing: it’s inside half the mechanical chronographs on earth now.'),
      learn('valjoux7750')
    ]),
    opt('“What have you got?”', [], { exit: true })
  ]),
  goto('ny_three')
]);

G.scene('ny_three', [
  bg('nyc'), music('city'),
  show(['chronoA', 'pogueC', 'pogueB'], { label: true }),
  d('lola', 'Three. This one’s mine: Meridor, nobody’s heard of it, Valjoux 7733 inside, fourteen fifty. This one’s also mine: Seiko 6139, the yellow one. They call it the Pogue; by most accounts an astronaut wore his own on Skylab in ’73 without asking NASA. Seventeen hundred.'),
  d('lola', 'And *this* one is a listing on my phone. A customer sent it this morning asking if it’s a good deal. Same Seiko, “mint”, eight hundred and fifty dollars. You tell me if it’s a good deal.'),
  label('look'),
  hide(),
  hub('Which will you look at?', [
    opt('The Meridor.', [inspect('chronoA', { need: 4 })], { keep: true, note: '$1,450' }),
    opt('Lola’s Seiko.', [inspect('pogueC', { need: 3 })], { keep: true, note: '$1,700' }),
    opt('The listing.', [inspect('pogueB', { need: 3, intro: 'Four photographs on a cracked phone screen. One of them was taken with the lights off.' })], { keep: true, note: '$850' }),
    opt('“I’ve looked.”', [], { exit: true })
  ], { min: 1 }),
  show(['chronoA', 'pogueC', 'pogueB'], { label: true }),
  choice('Hers was hand-wound, two registers, and paid for out of two weeks’ wages.', [
    opt('The Meridor.', [
      hide(),
      haggle({ who: 'lola', watch: 'chronoA', ask: 1450, floor: 1250, walkLabel: 'Look again',
        flaws: { ding: { off: 100, say: 'The ding. Yeah. It’s been there longer than I have. Fine, a hundred.' } },
        nope: { cam: 'That’s not a flaw. That’s why it’s fourteen hundred and not eight thousand.', tswisst: 'That’s a *good* sign. That’s the dial telling you its age.', match: 'Matching is what you want.', tachy: 'It’s a scale. It’s supposed to be there.', '7733': 'That’s the movement. That’s the reason to buy it.' },
        lines: { open: 'Fourteen fifty. It’s a working chronograph from the year of the Moon with all its own parts. Find me another.', counter: 'Nope. {p}.', final: '{p}. I have rent in midtown.', deal: 'Okay. Deal.', pay: 'Sold. Wind it every morning; it likes that.', walk: 'Look again. I’ll be here.' } })
    ]),
    opt('Lola’s Seiko.', [
      hide(),
      haggle({ who: 'lola', watch: 'pogueC', ask: 1700, floor: 1500, walkLabel: 'Look again',
        flaws: {},
        nope: { dial: 'Faded *evenly* is the good kind. That’s the proof nobody touched it.', one: 'One register is the design.', serial: 'The serial matches. That’s what you want it to do.', wheel: 'You’re complaining about a column wheel? In a seventeen-hundred-dollar watch?' },
        lines: { open: 'Seventeen hundred. Honest dial, right serial, went to space on the quiet.', counter: '{p}. That’s a friend price.', final: '{p}, and that’s the floor.', deal: 'Deal.', pay: 'Sold.', walk: 'Look again.' } })
    ]),
    opt('The listing.', [
      hide(),
      iff(s => saw('pogueB', 'glow')(s) || saw('pogueB', 'serial')(s), [
        d('lola', 'You saw the serial. You saw the lume. And you’re buying it because it’s eight-fifty.'),
        me('Because it’s eight-fifty.'),
        d('lola', 'Then at least nobody’s fooling you. You’re just being cheap. I respect that more.')
      ], [
        d('lola', 'You’re sure. Okay. It’s your money, and it’s your pocket.')
      ]),
      act(s => { s.paid.pogueB = 850; G.last = { bought: true, price: 850 }; }),
      cash(-850, 'Seiko 6139, from a listing'),
      n('It will arrive in Montréal in a padded envelope that smells of somebody else’s cigarettes.')
    ])
  ]),
  iff(() => !G.last || !G.last.bought, [jump('look')]),
  iff(s => s.paid.chronoA != null, [
    act(s => { s.flags.chrono = 'chronoA'; }),
    d('lola', 'Good pick. Nobody will ever compliment you on it. That’s how you know you bought it for the right reason.')
  ], [iff(s => s.paid.pogueC != null, [
    act(s => { s.flags.chrono = 'pogueC'; }),
    d('lola', 'The one that went to space on the quiet. It isn’t what she had; hers was hand-wound, two registers. But it’s a hell of a cousin.')
  ], [
    act(s => { s.flags.chrono = 'pogueB'; })
  ])]),
  hide(),
  slot('chrono', s => s.flags.chrono),
  page('chrono'),
  n('*The directors had given M. Jacot a gold watch for “his” result at the Observatory.* The quotation marks are hers. She has pressed so hard that the nib went through the paper.'),
  fact('1968: Corémont’s directors rewarded Henri Jacot for “his” result at the Observatory. The quotation marks are Blanche’s.'),
  d('lola', 'You okay?'),
  me('What’s “the Observatory”?'),
  d('lola', 'Neuchâtel, probably. Every year the Swiss houses sent their best movements to an observatory to be tested, for weeks. The Olympics of accuracy: [[observatory trials]]. Winning was everything. The adjuster who prepared the winner was a star. Why?'),
  sfx('phone'),
  n('Your phone. Gaspard Jacot: *Park Avenue, six o’clock. The preview closes at eight. Wear what you like; everyone will be looking at your wrist anyway.*'),
  goto('ny_auction')
]);

G.scene('ny_auction', [
  bg('auction'), music('gilt'), hud('An auction house · Park Avenue', 'The same evening'), hide(),
  n('The saleroom is carpeted to the colour and depth of moss. Two hundred chairs. Along one wall, a row of people on telephones, murmuring in six languages to bidders who are in bed in Hong Kong and at breakfast in Geneva.'),
  d('gaspard', 'You came. Good. This is where watches go when they stop being watches.'),
  hub([
    opt('“How does this work?”', [
      d('gaspard', 'Every lot has an [[estimate]], printed low to make you brave. The auctioneer takes bids until the [[hammer]] falls. Then the house adds a quarter on top for itself, the [[buyer’s premium]], which everybody pretends to have forgotten until the invoice.'),
      d('gaspard', 'And nobody here is buying a watch. They are buying a story with a number attached. *Fresh to market. Original owner. One of eleven known.* The catalogue is literature. I say that with admiration.')
    ]),
    opt('“What makes one worth more than another?”', [
      d('gaspard', '[[Provenance]]. A steel chronograph is a steel chronograph. Put it on Paul Newman’s wrist and it is seventeen million dollars. The watch did not change. The sentence did.'),
      d('gaspard', 'After that: rarity, condition, and a thing the dealers call *honesty*, by which they mean that nobody has improved it. An untouched dial with ugly spots beats a restored one every time. Collectors pay for the truth. It is the only market I know where that is so.')
    ]),
    opt('“Why did you bring me here?”', [], { exit: true })
  ], { min: 1 }),
  d('gaspard', 'Because I owe you a true thing. In Montréal I promised you one, and gave you an epigram instead.'),
  d('gaspard', 'My father was Henri Jacot. *Chef-régleur* at Corémont for thirty-one years. In 1967 a movement he prepared, calibre thirteen lignes, number seven, took a first prize in its class at the Neuchâtel Observatory. It was the last year that competition was properly held. The [[bulletin]] hangs in my office. It has his name on it in copperplate.'),
  show(CERT),
  d('gaspard', 'When the factory was liquidated in 1976, number seven was not in the inventory. Nor were a hundred and forty-four others: the last series of that calibre, finished in the final weeks. A gross of the best movements Corémont ever made. Gone. The trustees assumed the scrap dealer. I never did.'),
  d('gaspard', 'I have spent thirty years looking for my father’s masterpiece. And three weeks ago, in a shop in Montréal, it was ticking on the wrist of a person who did not know what a regulator was.'),
  fact('Gaspard: the movement is Corémont calibre 13‴, N° 7, first prize in its class at the Neuchâtel Observatory, 1967. The bulletin names his father as its adjuster.'),
  fact('A gross of the same calibre, 144 movements, vanished when the factory closed in 1976.'),
  d('gaspard', 'Sixty thousand dollars. And if you know where the others are, name your own figure.'),
  act(s => { s.flags.offer = 60000; }),
  hide(),
  n(s => `Sixty thousand dollars. You have ${G.money(s.cash)} to your name, four watches in a roll, and two weeks.`),
  m('claire', 'Lou. He emailed me too. SIXTY. That’s her debts, and it’s first and last on an apartment for you, and it’s finished. She would understand. She sold six.'),
  choice([
    opt('“I can’t sell what I don’t understand yet.”', []),
    opt('“She sold six so she would never have to sell this one.”', []),
    opt('“…Maybe you’re right.”', [
      n('Gaspard has a pen. Of course he has a pen. It is in your hand before you have decided to take it.'),
      act(s => { s.flags.wavered = 1; })
    ])
  ]),
  m('mai', 'LOU. Do not sell it. Do NOT. I went back through my service photos. There is something under the dial. I didn’t want to say until I was sure. Call me NOW.'),
  n('You step out between the chairs. She picks up before it rings.'),
  d('mai', 'When I had the dial off, I photographed everything, like always. On the dial side of the main plate, where nobody ever looks, where the dial covers it for sixty years, somebody has engraved something. By hand. With a graver. Tiny.'),
  d('mai', '*B.C. — 44 nuits — 1967.*'),
  d('mai', 'Forty-four nights. Lou, adjusters sign under the dial. It’s the one place the firm can’t polish it off. Whoever prepared that movement for the Observatory signed it B.C. It wasn’t Jacot’s father. It was her.'),
  fact('Under the dial, hidden for sixty years: “B.C. — 44 nuits — 1967.” The prize movement was adjusted by Blanche.'),
  n('Across the room, Gaspard is watching a steel chronograph climb past four hundred thousand dollars. He has a photograph of his father’s certificate in his breast pocket.'),
  choice([
    opt('Tell him. Now.', [
      me('Monsieur Jacot. Has anyone ever taken the dial off number seven?'),
      d('gaspard', '…No. No one has seen it since 1967.'),
      me('Someone has. There is a signature underneath. It isn’t your father’s.'),
      n('He does not move. There are two hundred people in the room, and he is the only one who is perfectly still.'),
      d('gaspard', 'That is a serious thing to say.'),
      me('I know.'),
      d('gaspard', 'Then you had better be able to show me. Not here. The bulletin is in Geneva. The records are in La Chaux-de-Fonds. On the thirty-first, I think you said.'),
      act(s => { s.flags.toldGaspard = 1; })
    ]),
    opt('Say nothing. Not yet.', [
      iff(s => s.flags.wavered, [n('You put the pen down on an empty chair. He sees you do it.')], [n('You shake your head. He sees you do it.')]),
      n('He inclines his head a centimetre, like a man conceding a point in a game he still expects to win.'),
      d('gaspard', 'The thirty-first, then.')
    ])
  ]),
  m('lou', 'She adjusted the movement that won a prize in 1967. They put her boss’s name on it. She signed it where nobody would look.'),
  m('claire', '…'),
  m('claire', 'She never said. She never said ONE WORD.'),
  m('claire', 'What’s in the next pocket.'),
  m('lou', '“L’ennemi. Magnifique. Rendue 1998, à M. Sakamoto, Suwa.”'),
  m('mai', 'SAKAMOTO. I was THERE. ’98. An old Japanese guy came in for a battery. They talked for three hours in terrible English. She gave him a watch for a dollar. He sent New Year cards for years. The box of cards! Hang on.'),
  m('mai', 'Got it. Suwa, Nagano. And last year’s card is signed by a granddaughter, Aiko, with a shop stamp: Nakano Broadway, Tokyo. I’ve emailed her.'),
  m('claire', 'Tokyo. Fine. I have air miles. I’ll book it. Don’t say anything.'),
  goal('Tokyo. Nakano Broadway: Aiko. Then Suwa, and Mr. Sakamoto, who was given the enemy for a dollar in 1998.'),
  goto('tok_arrive')
]);
})();
