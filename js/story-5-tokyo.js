/* UNSIGNED — Chapter Five: The Enemy (Tokyo, Suwa) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, goto, sfx, tick, music, fade, inspect, regulate } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });
const LNW = id => ({ html: `<div style="height:38vh;aspect-ratio:1">${Watch.svg((Lineage.nodes.find(x => x.id === id) || {}).cfg || {}, { crop: 'head' })}</div>` });

G.scene('tok_arrive', [
  hide(), tick(0),
  chapter('Chapter Five', 'The Enemy', 'Tokyo'),
  travel('tokyo', { note: 'Fourteen hours, over the Pole, on your mother’s air miles.', cost: 380 }),
  bg('nakano'), music('neon'), hud('Nakano Broadway · Tokyo', 'December 20'),
  n('Nakano Broadway is a shopping arcade from the 1960s that the comic-book collectors took over floor by floor. On the third floor, between a shop of vinyl monsters and a shop that sells only railway timetables, there is a corridor of watch dealers. Glass walls. Ten thousand watches. Every one with a tag written by hand.'),
  d('aiko', 'Lou-san? I’m Aiko. Mai-san wrote. My grandfather has been… I don’t know the English. He has ironed a shirt.'),
  n('Twenty-five; a cardigan; and on her wrist a black resin watch built like a small bunker.'),
  d('aiko', 'He’s in Suwa. Two and a half hours by train; we go tomorrow. Today I’m supposed to teach you “the other side”. His words. He gave me a list.'),
  hub('Ask Aiko…', [
    opt('“Start at the beginning.”', [
      d('aiko', 'Okay. Seiko is a clock shop in Tokyo, 1881. By the 1950s they make more watches than anyone in Japan, and they want one thing: to be as good as Switzerland. Not cheaper. *As good.*'),
      d('aiko', 'So, 1960: the first Grand Seiko. Built to the Swiss chronometer standard, and it cost a young office worker two months’ pay. Then in 1967 a designer, Tanaka Taro, writes rules for how a Seiko should look. Flat surfaces. Sharp edges. Polished like a mirror, so it throws light. The “Grammar of Design”. My grandfather wears one. He’ll pretend it’s nothing.'),
      learn('grandseiko'),
      d('aiko', 'And the company had two factories that competed against each other on purpose. Suwa, in the mountains, and Daini, in Tokyo. Grandfather was Suwa. Don’t mention Daini.')
    ]),
    opt('“What did your grandfather do?”', [
      d('aiko', 'Adjustment. Regulation. He prepared the movements that Suwa sent to Switzerland, for the [[observatory trials]]. Every year from 1964. The first year they were a joke: a hundred-and-something place. He says the Swiss were very polite about it.'),
      d('aiko', 'Every year, better. By 1967 Seiko’s watches were right near the top of the list at Neuchâtel. And the next year there was no wristwatch competition at Neuchâtel. People give different reasons. Grandfather has his own opinion. He won’t say it in front of a guest.'),
      d('aiko', 'So in ’68 they sent the watches to Geneva instead. And there, the Seikos were the best mechanical watches entered.'),
      me('Neuchâtel, 1967. My grandmother was there. On the other side.'),
      d('aiko', 'I know. That’s why he ironed the shirt.')
    ]),
    opt('“And then quartz.”', [
      d('aiko', 'Yes. While grandfather was adjusting hairsprings, upstairs in the same building another team was building this.'),
      show(LNW('astron')),
      d('aiko', 'The Quartz Astron. On sale in Tokyo on the twenty-fifth of December, 1969. A gold case. 450,000 yen: the price of a Toyota Corolla.'),
      d('aiko', 'A crystal of [[quartz]], cut like a tuning fork. Electricity makes it vibrate thousands of times a second, exactly. A circuit counts. Accurate to five seconds a *month*. The best watch grandfather ever adjusted in his life was good for perhaps two seconds a *day*.'),
      learn('astron'),
      hide(),
      d('aiko', 'They weren’t the only ones trying. An American watch ran on a battery already in 1957, the Hamilton; Elvis had one. In 1960 Bulova made one with a real tuning fork inside. It hums. And the Swiss had their own quartz, the Beta 21, a year after Seiko: twenty companies sharing one movement. Too big, too late, too many bosses.'),
      learn('ventura', 'accutron', 'beta21')
    ]),
    opt('“What happened to the price?”', [
      d('aiko', 'It fell off a cliff. That’s what electronics do. 1969: a car. 1973: an office worker’s bonus. That’s the 38 series. Your grandmother’s is one of those.'),
      learn('seikoqr'),
      d('aiko', 'Then the Americans made watches with no hands at all. Pulsar, 1972: press a button and red numbers light up. Two thousand dollars, in gold, and James Bond wore one. A few years later the same idea cost twenty dollars.'),
      learn('pulsar'),
      d('aiko', 'Then LCD, always on, no button: Seiko in 1973, Casio the year after. And Casio wasn’t even a watch company. Calculators! After that, anyone with a chip factory could make a watch.'),
      learn('lcd')
    ]),
    opt('“What’s on your wrist?”', [
      d('aiko', 'G-Shock. 1983. An engineer at Casio, Ibe-san. The story is that he dropped the watch his father gave him, and it broke, and he decided to build one that couldn’t. He threw prototypes out of a third-floor window for two years. Ten-metre drop, ten bar of water, ten-year battery.'),
      d('aiko', 'It’s the opposite of everything in this corridor. I sell hand-wound watches from 1965 all day. And I wear this, because I ride a bicycle in Tokyo.'),
      learn('gshock')
    ]),
    opt('“What did quartz do to people?”', [
      d('aiko', 'You know the Swiss part better than me. Ninety thousand watchmakers in 1970. Thirty thousand by the mid-eighties. Whole towns. The [[quartz crisis]].'),
      d('aiko', 'But grandfather said: tell them what it did *here*. In 1975 Seiko stopped making mechanical Grand Seiko. Just stopped. Nobody at Suwa adjusted a hairspring any more. He was thirty-seven. They put him on a line fitting batteries.'),
      d('aiko', 'He says quartz didn’t beat the Swiss. It beat the *hand*. Everybody’s hand. It only reached Switzerland a few years late.')
    ]),
    opt('“Let’s go and see him.”', [], { exit: true })
  ]),
  goto('tok_suwa')
]);

G.scene('tok_suwa', [
  hide(),
  travel('suwa', { note: 'The Azusa express, west out of Shinjuku and up into the mountains.', cost: 60 }),
  bg('suwa'), music('still'), hud('Lake Suwa · Nagano', 'December 21'),
  n('Suwa is a town wrapped round a lake, in a bowl of mountains. In the 1950s the newspapers called it *the Switzerland of the East*. They meant the air, and the precision.'),
  n('Mr. Sakamoto is waiting on the veranda in an ironed shirt. He is eighty-eight: born in 1938. The same year as her.'),
  d('sakamoto', 'Calame-san’s grandchild.'),
  n('He bows. Then he looks at your wrist, and is silent for long enough that Aiko studies her feet.'),
  d('sakamoto', 'She was wearing it. In 1998. I asked to see inside. She said no.'),
  d('aiko', 'He says she said no very fast.'),
  d('sakamoto', 'Please. Sit. First I return what is not mine.'),
  n('A box the size of a paperback. On the lid, in block capitals, in her hand: L’ENNEMI. Underneath, smaller: MAGNIFIQUE. And under that, in different ink, a third line that you cannot read, because it is in Japanese.'),
  show('seikoQR'),
  n('He takes a battery from his shirt pocket. He has had it ready. He fits it without looking. The seconds hand twitches, and begins to move in single, separate, perfect steps.'),
  tick('quartz', 0.3),
  hide(),
  inspect('seikoQR', { need: 5, intro: '“Please. Look at everything. She did.”' }),
  tick(0),
  d('sakamoto', 'In 1998 I am sixty. Retired. I visit my daughter at McGill University. My watch stops. I find a small shop. An old woman changes my battery. In her drawer I see this, in this box, with this word on it.'),
  d('sakamoto', 'I say: this is my company. She says: I know. I say: why *enemy?* And she tells me about a factory, and a town, and 1976.'),
  d('sakamoto', 'I tell her: I adjusted hairsprings at Suwa for eleven years. For Neuchâtel. In 1975 they say, Sakamoto, no more hairsprings; here is a tray of batteries. The crystal did not need me either.'),
  d('sakamoto', 'She was silent a long time. Then she said… Aiko.'),
  d('aiko', 'He has told me this so many times. She said, *“Alors nous sommes pareils.”* Then we are the same.'),
  d('sakamoto', 'She gave me the watch. I said I must pay. She said: one dollar. So it is a sale and not a gift. A gift, you can refuse.'),
  n('He points to the third line on the box.'),
  d('aiko', 'He wrote that on the plane home. It says: *Not enemy. Colleague.*'),
  n('In her notebook, in the different ink: *Not the enemy. Hands, like mine.* They wrote the same sentence in the same week, on opposite sides of an ocean, and never told each other.'),
  d('sakamoto', 'I promised: when someone of hers comes, it goes back. For the same price.'),
  choice([opt('Give him a hundred-yen coin.', [])]),
  sfx('coin'),
  n('You have one, from the ticket machine at Shinjuku. He receives it in both hands, as if it were heavier than it is.'),
  act(s => { s.paid.seikoQR = 1; s.cash -= 1; }),
  slot('quartz', 'seikoQR'),
  page('quartz'),
  d('sakamoto', 'One more thing about 1998. That year the company called the old men back. They wanted to make mechanical Grand Seiko again, after twenty-three years. And nobody under fifty knew how to adjust a hairspring. So I taught. Three years.'),
  learn('gs9s'),
  d('sakamoto', 'This is why I was happy when I walked into her shop. I told her: they need us again. Not for the time. The crystal has the time. For some other reason.'),
  d('aiko', 'He says she asked him, “What reason?” And he said he didn’t know yet, but people were paying for it.'),
  n('*It took me twenty years to learn what the reason was.* 1973, and twenty-five.'),
  d('sakamoto', 'Now. May I see inside? She said no. But you are not she.'),
  choice([opt('Open it for him.', [])]),
  show('heirloom', { view: 'movement' }),
  tick(18000, 0.3),
  n('Aiko fetches a case knife and a cushion. He opens your grandmother’s watch as Marius did, with two thumbs. Then he does something Marius didn’t. He takes from his pocket a loupe that is older than you are, and goes completely away.'),
  n('A minute. Two. The balance swings. Out on the lake a bird lands, and takes off again.'),
  d('sakamoto', 'Breguet overcoil. The end of the spring is lifted and bent inward, by hand, here, so it breathes in a circle and not to one side. This curve… she made this curve with tweezers. I can see three small corrections. Three! I would need twenty.'),
  d('sakamoto', 'And the stud is pinned after counting. This is competition work. In 1967, at Suwa, we had the Neuchâtel results on the wall. We knew every number. Corémont, thirteen lignes, number seven. I remember it. It was ahead of mine by a very little.'),
  d('sakamoto', 'The paper said: *régleur, H. Jacot.* For thirty years I thought: who is this Jacot, with such hands?'),
  me('It wasn’t Jacot.'),
  d('sakamoto', 'No. I think I knew in 1998. A person does not say *no* so fast about an ordinary watch.'),
  fact('Mr. Sakamoto: the hairspring’s end curve was formed by hand, “competition work”. In 1967 it finished ahead of his own entry by a very little.'),
  tick(0), hide(),
  d('sakamoto', 'Her notebook. May I? …Here. At the back. Rates. Five positions. Night one, night two… forty-four. This is the log of the adjustment. You see how the numbers come together, slowly, like… Aiko?'),
  d('aiko', 'Like birds landing.'),
  n('He puts your finger on the first line of the table. *Nuit 1. 12 mars 1967.*'),
  goto('tok_memory')
]);

G.scene('tok_memory', [
  hide(), fade('out', 900),
  bg(null), music('memory'), hud('La Chaux-de-Fonds', 'March 1967 · night one'),
  fade('in', 900),
  n('The workshop of the Fabrique Corémont, after the others have gone home. One lamp. A timing machine the size of a typewriter, that prints on a paper tape. A movement the diameter of a large coin, numbered 7.'),
  n('You are twenty-nine. Your daughter is asleep at your mother’s. M. Jacot has said that if the piece is ready by the deadline, he will see that it is entered.'),
  n('He has not said under whose name.'),
  regulate({ stage: 2, start: -22, beat: 1.9, title: 'Night one', eyebrow: 'Corémont · 1967', caption: 'Calibre 13‴, N° 7',
    intro: 'Two lines on the tape: a [[beat error]]. The tick and the tock are falling unevenly. Move the stud until they become one line. Then bring the rate to nothing.',
    good: 'Enough for tonight', perfect: 'Write it down', sayNear: 'Nearly flat. It would pass. You are not interested in passing.', sayZero: 'A flat line. One night down.' }),
  n('Forty-three more nights like this one. Dial up. Dial down. Crown up, crown down, crown left. Warm, and cold. Each night the five numbers close up a little, like the fingers of a hand.'),
  n('On the forty-fourth night you take the dial off one last time. With a graver, where the dial will cover it, you cut two letters, a number, and a year.'),
  fade('out', 900),
  bg('suwa'), music('still'), hud('Lake Suwa · Nagano', 'December 21'),
  fade('in', 900),
  d('sakamoto', 'You understand the table now.'),
  me('I think so.'),
  d('sakamoto', 'Then you understand why I ironed a shirt.'),
  d('aiko', 'What’s the next one?'),
  me('*Airman, 24 heures, 1976. L’heure d’avant.* The time before.'),
  d('sakamoto', 'Airman. Pilot’s watch. For this: Hong Kong.'),
  d('aiko', 'He has a friend. Of course he has a friend. A dealer in Tsim Sha Tsui. They have been arguing about bezels by fax since 1985.'),
  d('sakamoto', 'Wing. Tell him Sakamoto says his bezels are still wrong.'),
  n('At the gate he bows again, lower than before. You realise that it is not to you.'),
  goal('Hong Kong. Tsim Sha Tsui: Uncle Wing. Find a 24-hour Airman. Tell him his bezels are still wrong.'),
  goto('hk_arrive')
]);
})();
