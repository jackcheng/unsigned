/* UNSIGNED — Chapter Seven: The Seventh (La Chaux-de-Fonds) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, sfx, tick, music, fade, pause, inspect, stamp, naming, voicemail, ending } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });

const CERT = { html: '<div class="p-cert"><h4>Observatoire cantonal de Neuchâtel</h4><p>Bulletin de marche · Concours chronométrique de 1967</p><p class="big">Corémont · calibre 13‴ · N° 7</p><p>Chronomètre-bracelet · 1<sup>er</sup> prix de série</p><p>Régleur : <span class="hand">H. Jacot</span></p></div>' };
const CARD49 = { html: '<div class="p-tag">Bientôt. Pas moi.<em>— B.</em><small>Soon. Not me.</small></div>' };
const BOX = () => ({ html: `<div class="p-box">${Array.from({ length: 12 }, (_, i) => Watch.svg(Watch.merge(G.watches.cal13.cfg, { mov: { text: [{ t: 'N° ' + (85 + i), x: -0.46, y: 0.7, s: 8.5, f: 'serif', i: true }], reg: 0 } }), { view: 'movement', crop: 'tight' })).join('')}</div>` });

/* the first dial with a name on it */
G.watches.first = { name: 'N° 1', cfg: s => { const c = G.heirloomCfg(s, { name: s.brand || '' }); c.strap = null; c.time = [10, 9, 36]; return c; } };

G.scene('jura_arrive', [
  hide(), tick(0),
  chapter('Chapter Seven', 'The Seventh', 'La Chaux-de-Fonds'),
  travel('chaux', { note: 'Geneva, Neuchâtel, and then the little red train that climbs.', cost: 540 }),
  bg('chaux'), music('snow'), hud('La Chaux-de-Fonds · Jura', 'December 30'),
  n('La Chaux-de-Fonds sits a thousand metres up in the Jura, in a fold of the hills too high for wheat and too cold for vines. So for three hundred years it has grown the only crop that needs nothing but light and patience.'),
  n('The town burned in 1794 and was rebuilt as a grid: long straight streets, every house turned toward the south, every workshop window made as tall as it could be. Marx called the whole place a single watch factory. Le Corbusier was born here, and trained as an engraver of watch cases before he ever drew a building.'),
  n('Your mother walks out of the station and stops.'),
  d('claire', 'It’s smaller.'),
  d('claire', 'It is exactly the same, and it’s smaller.'),
  n('She is sixty. She left at ten. She has no watch on, and she has not looked at her phone since Geneva.'),
  d('claire', 'Rue du Nord. This way. Don’t help me.'),
  n('The snow squeaks. She turns left without looking at the street names, then right, then stops in front of a long building with four storeys of tall windows. Half are lit. Beside the door, a row of letterboxes: an engraver, a strap-maker, two people who each make eight watches a year.'),
  n('In the stone over the door there is a line of paler shapes where bronze letters used to be. FABRIQUE CORÉMONT.'),
  d('claire', 'They had a siren. Seven in the morning, noon, half past one, six. You could set your… well. Everyone did.'),
  choice([
    opt('“What do you remember?”', [
      d('claire', 'Under her bench. There was a bar across for her feet, and I sat on it. I remember the last night. All the women were there, and old Monsieur Paul, and nobody sent me to bed. They worked until it got light. I thought it was a party.'),
      n('She says it as if she is hearing it for the first time.')
    ]),
    opt('“Are you all right?”', [d('claire', 'No. Keep walking.')])
  ]),
  n('A window opens on the top floor. A very small, very old woman leans out into the snow, in a cardigan.'),
  d('yvette', '*Claire Calame. Tu es en retard.*'),
  d('claire', '…Madame Yvette?'),
  d('yvette', 'Fifty years late. I had the coffee ready in 1977. Come up. Bring the tall one.'),
  goto('jura_yvette')
]);

G.scene('jura_yvette', [
  bg('chaux'), music('snow'), hide(),
  n('Three rooms and a workbench, under the roof of the old factory. Yvette Robert is ninety, and was a régleuse at Corémont from 1953 to the last day. On her wrist is a gold watch the size of a button, which she winds while she talks, without looking.'),
  d('yvette', 'You have Émile’s eyes, Claire, and her mouth. A pity. It should have been the other way about. And you. Show me.'),
  show('heirloom'),
  n('You hold out your wrist. She doesn’t need a loupe. She doesn’t even bend.'),
  d('yvette', '*La septième.* She wore it. Good. I was afraid she would keep it in a drawer, like a saint’s finger.'),
  hide(),
  hub('Ask Yvette…', [
    opt('“Tell me about 1967.”', [
      d('yvette', 'Every spring the house sent pieces to the Observatory at Neuchâtel. Forty-five days of tests. The directors lived for it. The pieces were prepared by the *régleurs de précision*: the men, in white coats, on the top floor, with their names on the bulletins.'),
      d('yvette', 'We were downstairs. Sixty women. Forty watches a day each, and they called it *réglage courant*. Ordinary regulation. The same hairsprings. The same tweezers.'),
      d('yvette', 'In ’67 Jacot’s piece would not come right. Number seven. He was a decent man, Henri, and a *correct* régleur. Correct. He knew what he had downstairs. One evening after the siren he came to Blanche’s bench, put it down, said nothing, and went home.'),
      d('yvette', 'Forty-four nights. I kept her company for some of them. I brought soup.'),
      d('yvette', 'A first prize. The bulletin came with his name on it. The directors gave him a gold watch. And Henri Jacot went into the cloakroom and wept, and not for joy. I saw him. Then he came out and shook everybody’s hand.'),
      fact('Yvette: Henri Jacot could not get N° 7 right. He left it on Blanche’s bench. Forty-four nights later it won, under his name.')
    ]),
    opt('“What happened in 1976?”', [
      d('yvette', 'The Americans who had bought the house sent a letter. Quartz. Closure on the thirtieth of September. Everything to be sold: the machines to a dealer in Bienne, and the stock, the movements, finished or not, to a scrap merchant. *Au kilo.* By the kilo.'),
      d('yvette', 'There was a [[gross]] of thirteen-lignes in the stores. The competition calibre. The parts were made; nobody was going to finish them. A hundred and forty-four of the best movements this town ever produced, to be melted for the brass.'),
      d('yvette', 'We had all read about LIP. In Besançon, just over the border, three years before. The workers there occupied their factory and hid the watches so the liquidators could not have them. Tens of thousands of watches, in cellars and attics all over the town. *C’est possible*, they said.'),
      d('yvette', 'So we thought: if the French can. Six of us, and old Paul. Six weeks of nights. We finished them, every one. Blanche regulated every one herself; she would not let us. And on the last night we carried them up.'),
      d('yvette', 'In Le Locle, the year before, a man called Vermot did the same thing with the tools for Zenith’s chronograph. Hid them in an attic, against orders. He is famous now, and rightly. He was a foreman, and a man.'),
      learn('vermot')
    ]),
    opt('“Why did she never come back?”', [
      d('yvette', 'The plan was: she goes to Canada, to a cousin, for two years. Things get better. She comes back; we case them; we sell them under a name of our own. *Les Régleuses*, I wanted. She said it was a terrible name.'),
      d('yvette', 'Things did not get better. And she had Claire, and no Émile, and a shop. Every New Year she sent a card. Two words: *Pas encore.* Not yet. I have forty-eight of them.'),
      d('yvette', 'This autumn there was a forty-ninth.'),
      show(CARD49),
      n('Your mother has turned to the window.'),
      hide()
    ]),
    opt('“What is this building now?”', [
      d('yvette', 'When they sold the factory off in lots, in 1981, I bought the top floor. With everything in it, and everything behind the walls. A régleuse’s savings; the notary laughed. Now it is workshops. Young people. One makes straps. Two of them make *watches*. The whole watch, by hand, eight a year, and people wait five years and pay the price of a house. They call themselves independents.'),
      learn('independents'),
      d('yvette', 'So you see, it came back. Not the factory. The hands. Blanche’s Japanese friend told her it would. She did not believe him until she saw it in a magazine.')
    ]),
    opt('“Take us up.”', [], { exit: true })
  ]),
  goto('jura_attic')
]);

G.scene('jura_attic', [
  hide(), bg('attic', { open: false }), music('still'), hud('The attic of the Fabrique Corémont', 'December 30'),
  n('Four flights, then a ladder. Yvette goes first, at ninety, and does not use the rail.'),
  n('An attic the length of the building. Roof timbers as thick as a man. One skylight, and the snow-light coming through it in a slab. Old benches under dust sheets. And along the far wall, where a partition has been taken down (recently; the plaster dust is still on the floor), twelve flat wooden boxes in a row.'),
  d('yvette', 'I had the wall opened in October. After the card.'),
  d('claire', 'I carried one of those.'),
  n('Everyone looks at her.'),
  d('claire', 'Up that ladder. I was ten. It was heavy, and they told me not to drop it, and I didn’t know what was in it. I have dreamed about that ladder my whole life. I thought it was a dream about… I don’t know. A ladder.'),
  d('yvette', 'You carried number four. You dropped nothing.'),
  choice([opt('Open the box.', [])]),
  sfx('open'),
  bg('attic', { open: true }),
  n('The lid comes away with a breath of camphor and old oil. Greaseproof paper, folded like a letter. Under it, in a rack of brass rings: twelve movements. Each has a paper tag on a thread, and on each tag are five numbers in a hand you would know anywhere.'),
  show(BOX),
  n('A dozen. And eleven more boxes.'),
  hide(),
  inspect('cal13', { need: 3, intro: 'Yvette: “Don’t wind it more than a turn. The oil is fifty years old.”' }),
  n('Yvette gives one a single turn of the ratchet with her thumbnail. The balance shivers. And swings.'),
  tick(18000, 0.3),
  d('yvette', '*Regarde-moi ça.* Fifty years asleep, and one turn.'),
  n('Five beats a second, thin and quick. The same sound as the one on your wrist. In the silence of the attic you can hear them both, a fraction apart, like two people breathing in a dark room.'),
  tick(0),
  n('Under the twelfth box is a flat parcel in brown paper: a hundred and forty-four dials. Silvered, lacquered, set with twelve markers each. Not one has a word on it.'),
  n('And a single sheet of drafting linen, rolled. A watch case, drawn at ten times life size, in pencil, every dimension given in tenths of a millimetre. In the corner: *É.C. — hiver 73.*'),
  d('claire', 'That’s Papa’s writing.'),
  n('It is the first time you have ever heard her call him that.'),
  fact('In the attic: a gross of finished movements, each regulated by Blanche. 144 dials, all blank. One case drawing, signed É.C., winter 1973.'),
  n('Feet on the ladder. Unhurried. Good shoes.'),
  d('gaspard', 'Madame Robert. You never answered my letters either.'),
  d('yvette', 'You wrote to me in English, Gaspard. I knew your mother.'),
  n('He has stopped at the top of the ladder. He is looking past all three of you at the open box, and for the first time since you met him he looks his age.'),
  d('gaspard', 'A gross. All of it. Here. Sixty metres from my father’s bench.'),
  choice([
    opt('Open her notebook to the last pages.', []),
    opt('“Did you bring the bulletin?”', [])
  ]),
  show(CERT),
  n('He has it with him, of course, in a leather folder. *Corémont, calibre 13‴, N° 7. Régleur: H. Jacot.* And under that, the table of daily rates: forty-five days, five positions, in the Observatory’s small official type.'),
  n('You lay her notebook open beside it. Forty-four nights. Five positions.'),
  n('They are the same numbers. Not close. The same, to the tenth of a second. Hers are dated from March. The Observatory’s begin in May.'),
  d('gaspard', '…She could have copied them afterwards. From the bulletin.'),
  hide(),
  n('You take the watch off your wrist and hold it out. He understands. So does Yvette, who has already found a case knife and a dial cushion in the pocket of her cardigan.'),
  n('It takes her ninety seconds to lift the hands and turn out the dial screws. She is ninety years old, and her fingers do not shake at all.'),
  n('The dial comes away. Underneath, on the bare plate, cut with a graver in letters a millimetre high, exactly where Mai said it would be:'),
  nb('B.C. — 44 nuits — 1967', 'under the dial'),
  n('Nobody says anything. Somewhere under the eaves, snow slides off the roof.'),
  d('yvette', 'Your father was a decent man, Gaspard. He knew what she was. He never once said that movement was his. Did he? Think. Did he ever say it, in so many words?'),
  d('gaspard', '…He never spoke about 1967 at all. I thought it was modesty.'),
  n('He takes the bulletin out of its folder, and looks at it. For a moment you think he is going to tear it.'),
  n('He lays it in the open box, on the greaseproof paper, face up.'),
  d('gaspard', 'That belongs with the movement. Not on my wall.'),
  d('gaspard', 'Now. I am going to make you an offer, Lou, and you should hear all of it before you answer, because it is a good one.'),
  d('gaspard', 'Six hundred thousand francs. For the gross, the dials, the drawing, and number seven. I launch Corémont in the spring with a hundred and forty-four *original* observatory calibres, and her name on every caseback. *Calibre Blanche.* Her story, told properly, in forty shops and every magazine. A film, I should think.'),
  d('gaspard', 'You cannot do that alone. You have a hundred and forty-four movements that need servicing, no cases, no customers, no company and, forgive me, no profession. In three years you will sell them to me anyway, for half.'),
  d('yvette', 'He is not lying.'),
  d('gaspard', 'And before you ask, madame: my lawyers have a view on who owns the contents of a Corémont attic.'),
  d('yvette', 'It is not a Corémont attic. It is my attic. I bought this floor in 1981, with the walls and everything behind them. *Demande au notaire.* He’s dead, but his son has the papers.'),
  n('Gaspard closes his eyes, briefly, like a man checkmated by a move he saw coming and hoped she would miss.'),
  n('Then everyone is looking at you.'),
  n('Your mother, who needed eleven thousand dollars by tomorrow. Yvette, who has waited fifty years. Gaspard, who has waited thirty, and who has the name, the shops, the money, and a sentence with a date in it.'),
  n('In Yvette’s hand, open, the watch ticks.'),
  choice([
    opt('“Her name is not going on the back of yours.”', [
      act(s => { s.flags.gaspard = 'rival'; }),
      d('gaspard', 'No. I suppose it would not sit well there.')
    ]),
    opt('“You have a name and nothing to put it on. I have the opposite problem. I think mine is easier to fix.”', [
      act(s => { s.flags.gaspard = 'respect'; }),
      d('gaspard', '*Touché.* That is, forgive me, exactly what she would have said.')
    ]),
    opt('“Ask me again in three years.”', [
      act(s => { s.flags.gaspard = 'open'; }),
      d('gaspard', 'I shall. I keep a diary.')
    ])
  ]),
  d('gaspard', 'Then we are to be competitors. I should warn you: I am rather good at it. I have a three-year start, forty shops, and a name a hundred years old.'),
  me('It isn’t your name.'),
  d('gaspard', 'No. But it is *a* name. You do not even have that.'),
  n('At the ladder he turns back.'),
  d('gaspard', 'The bulletin stays. And, Lou: when you find out how hard this is, and you will, by about March, remember that I asked politely.'),
  n('The good shoes go down the ladder. A door, four floors below. Then only the snow.'),
  goto('jura_letter')
]);

G.scene('jura_letter', [
  hide(), bg('attic', { open: true }), music('still'), hud('The attic of the Fabrique Corémont', 'December 30'), tick(0),
  n('Yvette has put back the dial, and the hands, and closed the watch, while nobody was looking. She gives it to you. Then she reaches into the first box, under the rack, and takes out an envelope.'),
  d('yvette', 'This came with the card. She said: when they are both standing here. Not before. I have carried it in my cardigan for two months and it has ruined the pocket.'),
  n('*Claire. Lou.*'),
  n('Your mother holds it out to you. Her hand is not steady.'),
  d('claire', 'You read it. I can’t do her handwriting.'),
  nb('Claire: you found the tags. I know you, so I know what you think they say. They are not a bill.', 'Blanche'),
  nb('I did not sell those watches *for* you, as if you were a debt. I traded them. Six things I loved for one person I loved more, and I would make the same trade again before the second hand came round.', 'Blanche'),
  n('Your mother makes a sound you have never heard her make. Yvette, who is half her size, puts an arm round as much of her as she can reach.'),
  nb('Lou: the dial is blank because nobody would print my name on one. So I made the whole dial say it. But a blank is also where every dial begins.', 'Blanche'),
  nb('There are a hundred and forty-four movements in these boxes, as good as anything I ever did. A hundred and forty-four dials with nothing on them. One drawing of a case, by your grandfather.', 'Blanche'),
  nb('You can leave all of it exactly as it is, ma petite seconde, and I will not mind. Or you can do the thing I never dared.', 'Blanche'),
  nb('Print something.', 'Blanche'),
  act(s => { s.pages.last = 1; s.news.pages.last = 1; }),
  n('In the roll, six pockets are full. And the last locked page of her notebook is only French.'),
  page('seven'),
  d('claire', 'Lou. Give me the roll.'),
  n('She unrolls it across the lid of the box, and takes the watch out of the second pocket.'),
  d('claire', '*Les dents de Claire.*'),
  act(s => { s.flags.claireWears = 1; G.clearPortraits(); }),
  n('She straps it on. It is the first watch you have ever seen on her wrist.'),
  d('claire', 'I had braces for three years and I hated every single day. I would have hated crooked teeth more. She knew that. She always bloody knew.'),
  d('claire', 'I paid the landlord, by the way. Yesterday. From Geneva.'),
  me('With what?'),
  d('claire', 'I sold the car.'),
  d('claire', 'Don’t look at me like that. Apparently it runs in the family.'),
  d('claire', 'We’re keeping the shop. You’re going to need a bench.'),
  goto('jura_voice')
]);

G.scene('jura_voice', [
  hide(), bg('chaux'), music(null), hud('La Chaux-de-Fonds · Jura', 'December 30, evening'), tick(0),
  n('Later. The others have gone down to Yvette’s, for coffee that has been ready since 1977. You are sitting on the top step of the factory with the snow coming down, and a telephone in your hand.'),
  voicemail({ mode: 'play', when: 'Two months ago', intro: 'Forty-one seconds.', done: 'End of message', lines: [
    'Lou. C’est moi. Don’t be frightened, nobody is dead.',
    'I was at the bench this morning and I put my watch on the machine. You know which watch.',
    'Since Sunday it has gained two seconds.',
    'Two. In a week. After sixty years.',
    'I wanted to tell somebody who would understand what that means. And then I remembered that you don’t. Not yet.',
    'So. Come to the shop. I’ll show you. It won’t take long. You were always quick, when you were looking.',
    'Bring nothing. *À bientôt, ma petite seconde.*' ] }),
  music('home'),
  n('Two seconds in a week.'),
  n('A month ago that would have been a sentence about nothing. Now you know what a new chronometer is allowed in a single day. You know what a hairspring is, and what forty-four nights are, and what it means when a regulator sits dead centre.'),
  n('She was not telling you she was dying. She was telling you that at eighty-eight she was still the best there was, and that she wanted one person on earth to know it.'),
  n('You know it.'),
  goto('jura_name')
]);

G.scene('jura_name', [
  hide(), bg('chaux'), music('home'), hud('La Chaux-de-Fonds · Jura', 'December 31'), tick(0),
  n('The last morning of the year. Downstairs from the attic one of the young independents has lent you his workshop, and gone to buy bread. On his bench: a pad printer, a pot of black ink, and a steel plate that Yvette’s nephew will engrave before lunch, if you tell him what to cut.'),
  n('In the jig is one of the hundred and forty-four dials. Silvered. Twelve markers. Blank.'),
  n('Your mother is on the stool beside you, with a watch on her wrist. Yvette is in the doorway, pretending she isn’t.'),
  d('claire', 'Well? What does it say?'),
  naming({ eyebrow: 'A new page, after hers', say: 'One line. The name that goes where she left the space.', suggest: ['Calame', 'Blanche', 'Petite Seconde', 'La Septième'], button: 'Cut the plate' }),
  stamp({ cfg: s => G.heirloomCfg(s, { blank: true, name: '' }), printed: s => G.heirloomCfg(s, { blank: true, name: s.brand }), eyebrow: 'The pad printer', button: 'Press',
    say: s => `The plate reads ${s.brand.toUpperCase()}, backwards. The pad is warm.`, after: 'Four seconds. It took her sixty years to leave the space.' }),
  show('first'),
  tick(18000, 0.2),
  n('Yvette fits the hands herself, and sets them at [[ten past ten]]. “Because it is the only time of day when a watch smiles.”'),
  n('It is not a watch yet. It is a dial held over a bare movement, with borrowed hands. It has no case, no crystal, no crown, no strap, no price and no customer. It has a name.'),
  d('yvette', '*Bon.* Now there are a hundred and forty-three more, a case that exists only on paper, and a man in Geneva with a three-year start. What are you going to do about that?'),
  choice([
    opt('“Go and hold ten of them.”', [d('yvette', 'Ha! She said that to everybody. Nobody ever did it. You did it.')]),
    opt('“Send a drawing to a factory I know.”', [d('yvette', 'Good. Blanche always said the Swiss never made anything alone, and were the last to admit it.')]),
    opt('“Learn to regulate. Properly.”', [d('yvette', 'I am ninety. You have perhaps two years of me. We start on Monday.')])
  ]),
  hide(),
  show('heirloom'),
  n(() => { const t = new Date(), h = t.getHours(), mm = String(t.getMinutes()).padStart(2, '0'); return `On your wrist the seventh watch says it is ${((h + 11) % 12) + 1}:${mm}. Since Mai’s bench it has gained about a second and a half.`; }),
  n('You wind it. You don’t need to. You only want to feel it push back.'),
  act(s => { s.flags.act2tease = 1; s.flags.done = 1; s.goal = 'Act II: The Name on the Dial.'; }),
  hide(),
  fade('out', 1400),
  goto('act_end')
]);

G.scene('act_end', [
  hide(), tick(0),
  act(s => { s.flags.act2tease = 1; }),
  fade('in', 10),
  ending({ tease: 'A hundred and forty-four movements. A hundred and forty-three blank dials. One case that exists only on paper. A shop in Montréal with forty-one clocks to wind. And in Geneva, a man with a hundred-year-old name and a three-year start. Act II is about everything that goes around the movement: the drawing, the suppliers, the first customer, the price, and the reason the thing should exist at all.' })
]);
})();
