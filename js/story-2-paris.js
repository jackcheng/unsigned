/* UNSIGNED — Chapter Two: The Name on the Dial (Paris) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, label, jump, sfx, tick, music, inspect, haggle } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });
const saw = (id, ob) => s => !!(s.obs[id] && s.obs[id][ob]);

G.scene('par_arrive', [
  hide(), tick(0),
  chapter('Chapter Two', 'The Name on the Dial', 'Paris'),
  travel('paris', { note: 'The first train under the Channel.', cost: 140 }),
  bg('puces'), music('gilt'), hud('Marché Vernaison · Saint-Ouen', 'Sunday, 11 a.m.'),
  n('The Puces de Saint-Ouen: seven hectares of things people have stopped wanting. Chandeliers. Anatomical models. A stuffed zebra. The entire contents of a provincial dentist’s surgery. And, in a glass case the size of a bathroom cabinet, forty gold watches as thin as coins.'),
  d('ines', 'Peg sent you? Then tell her I don’t owe her for the Longines any more. I am paying in grandchildren.'),
  n('Forty, perhaps. Black from collar to boots, and a rectangular gold watch on a strap the colour of wine.'),
  d('ines', 'A Corémont. *Extra-plate.* Do you know that in ten years only one man has asked me for a Corémont? Sit. I have one. I think a colleague at the end of the alley has another; I’ll telephone. While we wait, you will learn why these are the best-kept secret in watches.'),
  hub('Ask Inès…', [
    opt('“Why does nobody want them?”', [
      d('ines', 'Because they are small, and gold, and quiet. For thirty years everybody has wanted the opposite: big, steel, sporty. So a watch like this, eighteen carats, finished by hand, thinner than your telephone, costs less than the telephone. *Tant mieux.* I can afford my own stock.'),
      d('ines', 'It is called a [[dress watch]]. It has one job: to tell the time and disappear under a cuff. No date. No seconds hand, if possible. Nothing to explain. It is the hardest watch to design, because there is nowhere to hide a mistake.')
    ]),
    opt('“What’s on your wrist?”', [
      d('ines', 'A Tank. Louis Cartier drew it in 1917. They say he was looking at the new Renault tanks from above: two treads, and a cabin between. Perhaps. What matters is that he was the first to understand that a wristwatch is not a small pocket watch.'),
      d('ines', 'A pocket watch is round because a pocket doesn’t care. A wrist has a direction. So: a rectangle, and the strap grows out of the case.'),
      learn('tank'),
      d('ines', 'He had done it once already, in 1904, for his friend who flew. Square, with the screws showing. The Santos is the engineer. The Tank is the poet.'),
      learn('santos')
    ]),
    opt('“Where does the round one come from?”', [
      d('ines', '1932. Patek Philippe, reference 96. They call it the Calatrava. A circle, a flat bezel, lugs that flow out of the case as if they had been poured. It is pure Bauhaus: the form is what the function needs, and not one line more. Every round dress watch since is a comment on it. Including your Corémont.'),
      learn('calatrava'),
      d('ines', 'The year before, Jaeger-LeCoultre made the Reverso, for polo players in India: the case turns over to hide the glass. Rectangles again. Art Deco.'),
      learn('reverso'),
      d('ines', 'Then in the fifties the race was to be thin. In 1957 Piaget made a movement two millimetres high. Two! That is where [[extra-plate|extra-plat]] comes from.'),
      learn('ultrathin'),
      d('ines', 'And if you want the Bauhaus without the gold: Max Bill, who actually studied there, drew a watch for Junghans in 1961 that is nothing but lines and numbers. It still looks like next year.'),
      learn('maxbill')
    ]),
    opt('“How do I tell a good one?”', [
      d('ines', 'With a dress watch the dial is everything, because there is nothing else. And a dial is silver and lacquer. After sixty years it is spotted, or yellowed. Some people can’t bear that. So they send it to a man who strips it and paints it again. Now it is perfect. And worth a third.'),
      d('ines', 'We say [[redial]]. Look at the signature first. The repainter can copy a minute track; he almost never gets the letters right. Then ask whether it is *too* clean. A sixty-year-old face without one line on it is either a miracle or a lie.')
    ]),
    opt('“Show me the Corémonts.”', [], { exit: true })
  ]),
  goto('par_two')
]);

G.scene('par_two', [
  bg('puces'), music('gilt'),
  n('She lays two watches side by side on a velvet pad. The second arrived a minute ago in the hand of an old man from the far end of the alley, who now stands at a polite distance, eating a clementine.'),
  show(['coremontA', 'coremontB'], { label: true }),
  d('ines', 'Mine: gold, about 1961. Twelve hundred and fifty of your dollars. His: steel, he says 1958, he says *mint*, he wants four hundred and fifty. Look. Take your time. I will open mine if you ask. He won’t open his.'),
  label('look'),
  hide(),
  hub('Which will you look at?', [
    opt('The gold one.', [inspect('coremontA', { need: 4 })], { keep: true, note: '$1,250' }),
    opt('The steel one.', [inspect('coremontB', { need: 3 })], { keep: true, note: '$450' }),
    opt('“I’ve looked.”', [], { exit: true })
  ], { min: 1 }),
  iff(s => s.flags.gaspardParis, [], [
    show(['coremontA', 'coremontB'], { label: true }),
    n('“The É,” says a voice behind you, in English. “Always begin with the É.”'),
    d('gaspard', 'Forgive me. There are four people on earth who are telephoned when a Corémont comes up for sale. I am three of them.'),
    d('ines', 'Monsieur Jacot. *Quelle surprise.*'),
    n('It is not said like a surprise.'),
    d('gaspard', 'May I?'),
    n('He picks up the steel watch without a loupe, holds it at arm’s length, and puts it down again inside two seconds.'),
    iff(saw('coremontB', 'sig'), [d('gaspard', 'You had seen it already. Good.')], [d('gaspard', 'Look at the name.')]),
    d('gaspard', 'From 1921 to the end, the accent on the É of Corémont was drawn flat: a little bar, like the index of a regulator. This one has no accent at all, and the letters lean. A man with a computer made this dial around 2010. The watch underneath is perfectly real. Only the name is false. Which is a curious thing to counterfeit, when you think about it.'),
    d('gaspard', 'I know that signature better than anyone alive. I own it.'),
    me('You own it?'),
    d('gaspard', 'The name. *Corémont*, the word, and the little spiral. I bought them in 2004 from a bankruptcy trustee in Bienne, for about the price of a good lunch. The factory was thirty years dead. Nobody else even bid.'),
    choice([
      opt('“Why would anyone buy a dead name?”', []),
      opt('“What do you do with a name?”', [])
    ]),
    d('gaspard', 'In 1983 two men bought the name Blancpain for twenty-two thousand francs. There had been no Blancpain watches for years; the firm was a file in a drawer. They wrote one sentence. *Since 1735 there has never been a quartz Blancpain watch. And there never will be.*'),
    d('gaspard', 'Of course there had not. There had been no Blancpain watches at all. That sentence is now worth more than most banks. People do not buy movements, Lou. They buy a sentence with a date in it.'),
    learn('blancpain83'),
    n('He takes something from an inside pocket, wrapped in grey cloth.'),
    show('coremontNew', { label: 'Corémont — next year' }),
    d('gaspard', 'Next year. Forty millimetres, steel, a very good automatic movement that I buy from a very good factory. *Corémont, depuis 1921.* I have investors, a designer, forty shops waiting. What I do not have is anything *from before*. A revived name needs a relic. One true thing from the old house, to hold up to the light.'),
    d('gaspard', 'Your grandmother’s watch has inside it the last great thing Corémont ever made. I should like to build my sentence on it. Thirty-five thousand.'),
    act(s => { s.flags.offer = 35000; s.flags.gaspardParis = 1; }),
    choice([
      opt('“You still haven’t told me what it is.”', [
        d('gaspard', 'No. And for every week you spend finding out, I shall have to pay more. I am aware of how that sounds. Thirty-five.')
      ]),
      opt('“Her name isn’t in your sentence.”', [
        d('gaspard', 'Régleuses were never in anybody’s sentence. That was not my doing. But I could be the one to put her there. Think what that would be worth. Not to you. To her.')
      ]),
      opt('“Did you know her?”', [
        d('gaspard', 'My father did. Henri Jacot. He was *chef-régleur* at Corémont; her chief, for nineteen years. He used to say she could hear a watch running fast from across the room.'),
        fact('Gaspard’s father, Henri Jacot, was chef-régleur at Corémont: Blanche’s chief for nineteen years.'),
        act(s => { s.flags.knowsHenri = 1; })
      ])
    ]),
    d('gaspard', 'The gold one is right, by the way. I have eleven like it; I shan’t bid against you. *Madame.* Until the thirty-first, Lou.'),
    hide(),
    n('He goes the way he came, between a stuffed zebra and a stack of gilt frames, and the alley closes behind him like water.'),
    d('ines', 'He is not wrong about names. He is wrong about what they are *for*.')
  ]),
  show(['coremontA', 'coremontB'], { label: true }),
  d('ines', 'So. Which?'),
  choice('One has the right name on an imperfect face. One has a perfect face and a name that is a copy of itself.', [
    opt('The gold one.', [
      hide(),
      haggle({ who: 'ines', watch: 'coremontA', ask: 1250, floor: 1050, walkLabel: 'Look again',
        flaws: { ded: { off: 100, say: 'Yes. Somebody loved it before you. I can take a little off for Thérèse.' } },
        nope: { spots: 'The spots are the reason it costs what it costs. Without them I would not believe it either.', hall: 'Those are the proof it is gold. You want me to discount the proof?', thin: 'Thin is the point.', regc: 'That is a compliment to the watch, not a complaint.' },
        lines: { open: 'Twelve hundred and fifty. For eighteen carats and sixty years. It is absurd, I know; it should be three times that.', counter: 'No, no. {p}. I have to eat.', final: '{p}. After that I keep it and wear it myself.', deal: '*D’accord.* Done.', pay: 'Sold. It’s yours.', walk: 'Look again. It isn’t going anywhere; nobody wants them.' } })
    ]),
    opt('The steel one.', [
      hide(),
      haggle({ who: 'ines', watch: 'coremontB', ask: 450, floor: 320, hardFloor: 250, patience: 3, walkLabel: 'Look again',
        flaws: { sig: { off: 50, say: 'I’ve told him what you said about the name. He says: a redial, perhaps, but a *nice* redial. He’ll take something off.' }, clean: { off: 30, say: 'Too clean. Yes. He shrugs.' }, track: { off: 30, say: 'He admits the track.' }, swiss: { off: 30, say: 'He says nobody looks under the six. I told him you did.' } },
        nope: { back: 'The back is the one honest thing on it.' },
        lines: { open: 'He wants four hundred and fifty. I translate; I don’t recommend.', counter: 'He says {p}.', final: 'He says {p}, and he has finished his clementine.', deal: 'He says yes.', pay: 'He says thank you, and that you have good taste. He says that to everyone.', walk: 'As you like.' } })
    ])
  ]),
  iff(() => !G.last || !G.last.bought, [jump('look')]),
  iff(s => s.paid.coremontA != null, [
    act(s => { s.flags.dress = 'coremontA'; }),
    d('ines', 'Good. It was somebody’s wedding watch. It should go on being somebody’s something.')
  ], [
    act(s => { s.flags.dress = 'coremontB'; }),
    d('ines', 'You know what it is, you know what it costs, and you chose with your eyes open. That isn’t a mistake. A mistake is when you find out afterwards.')
  ]),
  goto('par_after')
]);

G.scene('par_after', [
  bg('puces'), music('gilt'), hide(),
  slot('dress', s => s.flags.dress),
  page('dress'),
  n('*This was the first I was allowed to keep, and I had to get married to do it.*'),
  d('ines', 'Show me this famous wrist.'),
  show('heirloom'),
  n('She turns your arm under her lamp, and is quiet for a while.'),
  d('ines', 'The bezel is hardly there. The lugs are brazed on, not stamped out; do you see how they flow? And it is thin, thin, for a watch with its own seconds dial. This case was made by someone who made cases for dress watches, in gold, all day. And then once, in steel, for himself.'),
  d('ines', 'And he didn’t sign it either. Two people who didn’t sign.'),
  fact('The case is a dress-watch maker’s work: thin, with brazed lugs and almost no bezel. Made by hand. Not signed.'),
  me('Her husband made cases. Émile.'),
  d('ines', '*Voilà.*'),
  hide(),
  d('ines', 'And the next pocket?'),
  me('*Super Compressor, 1964. Celle d’Émile.*'),
  d('ines', 'A diver. Not here; Paris doesn’t dive. South. There is an old man in Marseille, a COMEX diver from the seventies, who sells one watch a year out of a biscuit tin, to people he likes. He doesn’t like many people. I’ll write down the address. Bring him something to drink that isn’t water.'),
  goal('Marseille. An old diver who sells one watch a year from a biscuit tin. Find a Super Compressor. Bring a bottle.'),
  goto('mar_arrive')
]);
})();
