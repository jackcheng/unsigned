/* UNSIGNED — Prologue: Stopped (Montréal) */
(function () {
'use strict';
const G = window.G;
const { n, d, me, m, nb, opt, choice, hub, iff, act, bg, show, hide, learn, page, slot, cash, travel, chapter, hud, goal, tool, goto, pause, sfx, tick, music, fade, inspect, wind, regulate, voicemail, titledrop, panel } = G.dsl;
const fact = t => act(s => { (s.facts = s.facts || []).push(t); });

const ENVELOPE = { html: '<div class="p-envelope"><span>Pour Lou</span></div>' };
const CARD = { html: '<div class="p-card"><div><b>GASPARD JACOT</b><i>Horlogerie ancienne · Expertise</i></div><span>Rue du Rhône, Genève<br>sur rendez-vous</span></div>' };

/* ------------------------------------------------------------------ */
G.scene('pro_cold', [
  music(null), tick(0),
  n('Two weeks after the funeral, there is still one message from her that you have not played.'),
  voicemail({ mode: 'refuse', when: '23 days ago', intro: 'Left on a Thursday morning, at 9:14. She died that Saturday, in her sleep, in the flat above the shop.', tries: ['Your thumb stops a centimetre above the glass.', 'Forty-one seconds. You have had twenty-three days to find forty-one seconds.'], done: 'Not yet' }),
  n('You put the phone face down on the passenger seat, and go in to help your mother empty the shop.'),
  goto('pro_shop')
]);

/* ------------------------------------------------------------------ */
G.scene('pro_shop', [
  bg('shop'), music('home'), hud('Horlogerie Calame · Montréal', 'Late November'),
  n('*Horlogerie Calame* is twelve feet wide and has been on this street since 1978. There are forty-one clocks on its walls. For the first time in your life, not one of them is going.'),
  n('Your grandmother wound them every Monday. It took her most of an hour. Nobody has had the heart to do it since, and over three weeks they have run down one by one, each stopping at its own private time.'),
  d('claire', 'Lou. Good. You take the bench, I can’t look at the bench. Anything with a customer’s name on it goes in this box, anything broken goes in that one, and the man who buys by the kilo is coming at four.'),
  choice([
    opt('“By the kilo?”', [
      d('claire', 'It’s a watch-repair shop, not the Louvre. Tools, spare parts, forty-one clocks that don’t go. He weighs it, he writes a cheque, and on the thirty-first we give the landlord his keys. That’s the plan. It’s a good plan.')
    ]),
    opt('“How are you doing?”', [
      d('claire', 'I’m doing the boxes. Ask me after the boxes.'),
      n('She has not stopped moving since you came in. You know this about your mother: she grieves the way other people do their taxes. Late, all at once, and with the door shut.')
    ]),
    opt('Say nothing. Sit down at the bench.', [
      n('The stool is set for someone four inches shorter than you. You don’t adjust it.')
    ])
  ]),
  n('The bench. A green-shaded lamp. Brass tweezers laid out in order of size. A loupe on a wire headband. You spent every Saturday of your childhood on the floor underneath it, sorting screws into an egg carton, while above you her hands did things too small to see.'),
  n('You have not been inside this shop in two years. You design apps, in another city. Designed. The last one was switched off in September, and your job with it, and you never told her about either.'),
  n('The top drawer sticks, the way it always did. Inside, on a square of chamois leather, is an envelope.'),
  show(ENVELOPE),
  n('Her handwriting. Two words.'),
  choice([opt('Open it.', [])]),
  sfx('page'),
  show('heirloom', { stop: [4, 17, 22] }),
  n('A watch slides into your palm. Steel, plain, lighter than you expected, on a brown strap gone soft and dark. You know it the way you know a voice. It was on her wrist in every memory you have of her.'),
  n('It has stopped. Seventeen minutes past four.'),
  d('claire', 'She wore that every single day. She’d push it up her arm to wash the dishes sooner than take it off.'),
  me('What make is it?'),
  d('claire', 'It isn’t. Look at it. There’s nothing on it. I asked her once, I was about twelve, everybody at school had a Timex. What’s the brand, Maman? And she said: “It’s signed. You’re just not reading it right.”'),
  d('claire', 'She liked riddles a great deal more than she liked answers.'),
  n('Her loupe is on the bench where she left it. You pick it up.'),
  hide(),
  inspect('heirloom', { views: ['dial'], need: 3, stop: [4, 17, 22], intro: 'The loupe is heavier than it looks. Move it over the watch, and click on anything that catches your eye.' }),
  show('heirloom', { stop: [4, 17, 22] }),
  n('No name. No number. A blank, where every other watch you have ever seen tells you who made it.'),
  n('And it isn’t ticking, and with a small cold shock you understand exactly what that means.'),
  n('She would never have put a watch away unwound. So on that last Friday evening she wound it full, sealed it in an envelope with your name on it, and went upstairs. A watch like this has a [[power reserve]] of forty hours or so. It went on running in the dark of the drawer all that night, and all the next day, and stopped at seventeen minutes past four on the Sunday with nobody there to hear it.'),
  n('It outlived her by a day.'),
  n('When you were six she held a watch against your ear, maybe this one, and said: *Écoute.* Listen. *It’s alive.* You believed her completely.'),
  choice([opt('Wind it.', [])]),
  hide(),
  wind({ watch: 'heirloom', stopped: [4, 17, 22], title: 'Wind it', say: 'Between finger and thumb, the crown is cold.',
    lines: { 4: 'Something inside takes up the slack.', 9: 'The little hand at six twitches. And goes.', 18: 'It is ticking. Five beats a second, thin and quick, like something very small, running.', 32: 'Each turn is a little stiffer than the one before.', full: 'The crown pushes back against your thumb. Full. Forty hours, starting now.', set: 'You pull the crown out, bring the hands round to the present, and press it home.' } }),
  tick(18000, 0.3),
  titledrop(),
  tick(18000, 0.12),
  show('heirloom'),
  n('You put it on. The strap finds its own holes: your wrist is the size hers was.'),
  act(s => { s.roll.seven = 'heirloom'; s.facts = []; }),
  goto('pro_roll')
]);

/* ------------------------------------------------------------------ */
G.scene('pro_roll', [
  bg('shop'), music('home'), hide(),
  n('At the very back of the bottom drawer, behind a tin of mainsprings, is the thing she called *le rouleau*: a roll of brown leather tied with a bootlace. You were never allowed to touch it.'),
  n('Untied, it opens flat across the bench. Seven pockets, stitched by hand. Six are empty. The seventh has kept the shape of the watch on your wrist. A paper tag is pinned to each.'),
  tool('roll'),
  panel('roll', { slot: 'dress' }),
  n('You read the tags twice. *Sold 1978: the lease on the shop. Sold 1984: Claire’s teeth. Sold 1987: Claire’s university.*'),
  n('Your mother has come to stand behind you. She reads them over your shoulder, and you feel her go completely still.'),
  d('claire', '*Les dents de Claire.*'),
  d('claire', 'I had braces for three years. I thought the insurance paid.'),
  d('claire', 'Well. Of course she kept receipts. Thirty years of “do you know what I gave up for you”, and she never once had to say it out loud. She only had to write it on a little tag and wait.'),
  choice([
    opt('“I don’t think that’s what these are.”', [
      d('claire', 'You weren’t her daughter. You got Saturdays and hot chocolate. I got the bill.')
    ]),
    opt('“She gave up a lot.”', [
      d('claire', 'I know she did. I was there. I would only have liked, once, not to be the reason.')
    ]),
    opt('Say nothing.', [
      n('There is nothing you could say that she is not already saying to herself.')
    ])
  ]),
  n('Underneath the roll is a notebook with a black oilcloth cover, the kind schoolchildren used to have. The first page is addressed to you.'),
  page('letter'),
  n('The rest is in French you can read and cannot understand. *Réglage plat et pendu, deux positions. Fond à ressort. Came, pas de roue à colonnes.* Bench language. She was right. You never learned it.'),
  goal('Find out what her watch is.'),
  sfx('bell'),
  n('The bell over the door rings. It is ten past two. The man who buys by the kilo is not due until four.'),
  d('gaspard', 'Forgive me. The sign says closed, and I have come six thousand kilometres to ignore it. Madame Calame’s family, I think? Gaspard Jacot. I am so very sorry.'),
  n('Sixty or so. A navy coat that fits the way coats fit in other countries. When he shakes your mother’s hand his cuff rides back from a slim rose-gold watch, with one word on the dial that you cannot make out.'),
  d('claire', 'You’re not the scrap man.'),
  d('gaspard', 'I am a kind of scrap man. I buy old watches, in Geneva. I wrote to your mother, madame, once a year from 2009. She answered me one time. One word.'),
  me('What word?'),
  d('gaspard', '*Non.*'),
  d('gaspard', 'I had hoped to ask, with great respect, whether she left any personal pieces. Not the shop stock. Her own —'),
  n('He stops. He is looking at your wrist.'),
  n('For a moment he says nothing at all. Then, very gently, as if to an animal that might bolt:'),
  d('gaspard', 'May I ask where you got that?'),
  choice([
    opt('“It was my grandmother’s.”', []),
    opt('“Why?”', []),
    opt('Pull your sleeve down over it.', [n('Too late, and you both know it.')])
  ]),
  d('gaspard', 'I will give you twenty thousand dollars for it. Today. I can have a banker’s draft here within the hour.'),
  n('Your mother makes a small sound.'),
  d('claire', 'For *that?* It hasn’t even got a name on it.'),
  d('gaspard', 'No. It has not.'),
  choice([
    opt('“What is it?”', [
      d('gaspard', 'If I told you, the price would go up, and it would be you who raised it. I am a dealer; forgive me. But I will tell you something true instead.')
    ]),
    opt('“It isn’t for sale.”', [
      d('gaspard', 'Everything in a watch shop is for sale. That is what a shop is. But I take your point. Not today.')
    ]),
    opt('“Why would you pay that?”', [
      d('gaspard', 'Because I know what it is, and you do not.')
    ])
  ]),
  d('gaspard', 'A price is only the distance between what two people know. At this moment the distance between you and me is twenty thousand dollars. You should feel free to make it shorter.'),
  show(CARD),
  d('gaspard', 'My card. The offer stands until the end of the year. After that I shall have found another way, and I would rather not. I much prefer to buy from someone who understands what they are selling.'),
  d('gaspard', 'Madame. Lou. *Mes condoléances.* She had the best hands in the Jura. Almost nobody knew it.'),
  sfx('bell'),
  n('Through the lettered window you watch him cross the street. He does not look back at the shop. It is the way a person doesn’t look at something they have already decided to have.'),
  hide(),
  d('claire', 'Twenty thousand dollars.'),
  d('claire', 'Lou. She was four months behind on the rent. Did you know? No. Neither did I, until the landlord told me, at the funeral, with a sandwich in his hand. The rent, the suppliers, the tax: eleven thousand dollars. That watch is the difference between me paying her debts and her paying them herself.'),
  choice([
    opt('“Give me until the thirty-first.”', []),
    opt('“He wants it too much. I need to know why.”', []),
    opt('“It was on her wrist every day of my life.”', [d('claire', 'And mine.')])
  ]),
  d('claire', 'And what will you know on the thirty-first that you don’t know now?'),
  me('What it is.'),
  d('claire', 'It’s a watch, Lou.'),
  n('On your wrist it ticks, five times a second. You have been wearing it for forty minutes, and already you can’t hear it unless you try.'),
  me('The end of the year. If I still don’t understand what I’d be selling, I’ll sell it, and you can pay everything.'),
  d('claire', '…The thirty-first. I’ll tell the scrap man January. Then the keys go back. And so does that.'),
  goal('Before December 31: find out what her watch is, and why a man from Geneva wants it so badly.'),
  act(s => { s.flags.offer = 20000; }),
  goto('pro_mai')
]);

/* ------------------------------------------------------------------ */
G.scene('pro_mai', [
  bg('shop', { time: 'night' }), music('home'), hud('Horlogerie Calame · Montréal', 'Three days later'), hide(), tick(0),
  act(s => { if (!s.cash) s.cash = 8800; }),
  n('Mai Tran was nineteen when your grandmother took her on, in 1996: the only apprentice she ever had. She has her own bench now, above a jeweller’s on rue Saint-Hubert, where she services other people’s Rolexes for other people’s shops. She still has a key to this one.'),
  d('mai', 'You wound it. Good. Give.'),
  n('She has the back off before you can see how. On her own wrist: a black plastic Casio, the kind that costs twenty dollars.'),
  choice([
    opt('“That’s what a watchmaker wears?”', [
      d('mai', 'At the bench you want something you can drop in the cleaning machine by mistake. And it keeps better time than everything I repair. Your grandmother hated it. She bought me three.')
    ]),
    opt('“Can you tell me what this is?”', [
      d('mai', 'I can tell you what it isn’t, which is anything I have seen before. And I have had a thousand backs off.')
    ])
  ]),
  d('mai', 'I took it home on Tuesday. Stripped it, cleaned it, oiled it. The whole time I felt her reading over my shoulder. Come here. Look inside before I close it up.'),
  inspect('heirloom', { views: ['inside', 'movement'], need: 5, intro: 'Mai swings the lamp across. “Don’t breathe on it.”' }),
  tick(18000, 0.12),
  d('mai', '*BC*, every five years since 1976. She did her own servicing. Nobody else has ever had the back off this watch. And the next one fell due this year.'),
  d('mai', 'No name on the dial: fine. We call that a [[sterile dial]]. Armies order them, and spies. But no name on the *movement?* No case-maker’s stamp? Every part of a Swiss watch is signed by someone. It is how they got paid. This was built by people who all decided not to sign.'),
  d('mai', 'And it’s good, Lou. I don’t mean nice. Look at the regulator: sixty years, and it has hardly been pushed off centre. Somebody adjusted this who was better than me. I have only ever met one person who was better than me.'),
  me('She made it?'),
  d('mai', 'Nobody “makes” a watch. A case-maker makes the case, a dial-maker the dial, a movement factory the movement. A brand buys the lot, screws it together and prints its own name on top. Three hundred years, that’s been the system. It’s called [[établissage]].'),
  d('mai', 'What your grandmother did was the last step, the one that decides whether it’s a watch or an ornament. She regulated. *[[Régleuse]].* She took a hairspring you can hardly see and made it breathe evenly. Forty watches a day, in a factory in La Chaux-de-Fonds, for twenty years. She never talked about it.'),
  d('mai', 'I’ve done the cleaning. The regulating I’ve left. Sit.'),
  me('Me?'),
  d('mai', 'It’s her watch, it’s your wrist, and it’s due. I’ll tell you where to put your hands.'),
  regulate({ stage: 1, start: 38, title: 'Regulate it', caption: 'The steel pointer over A and R is the regulator.',
    intro: 'Mai’s [[timing machine]] listens to each tick and prints a dot. A level line keeps time. This one climbs: fresh from cleaning, the watch is gaining thirty-eight seconds a day.' }),
  iff(() => Math.abs(G.last.rate) <= 0.7, [
    d('mai', '…Stop. Don’t touch it again. Who taught you to do that?'),
    n('Nobody. Unless sorting screws into an egg carton counts.'),
    act(s => { s.flags.zero = 1; })
  ], [
    d('mai', 'A couple of seconds a day. A new [[chronometer]] from a shop in Geneva is allowed six. That will do.'),
    d('mai', 'She would have gone on to zero. She’d have been here till midnight.')
  ]),
  d('mai', 'Now sign.'),
  n('She puts a steel scriber in your fingers, and turns the open back toward you. Under the column of *BC*s there is room.'),
  sfx('snip'),
  act(s => { s.flags.serviced = 1; }),
  n('*LC 26.* Your hand shakes. Hers never did. Mai presses the back home with the heel of her palm, and it is a watch again.'),
  fact('No name anywhere: not on the dial, not on the movement, not inside the case. Mai: “built by people who all decided not to sign.”'),
  fact('She serviced it herself every five years from 1976. The movement carries only a number: N° 7.'),
  n('You show her the roll, the tags, the notebook, the card.'),
  d('mai', 'Jacot. Huh.'),
  d('mai', 'He’s real. He’s the one the auction houses telephone when they can’t work out what a thing is. If he wants it, it’s something.'),
  d('mai', '“Sisters.” She means the same [[reference]]. Same model, same years. You’ll never get hers back: they went to dealers forty years ago, they could be in Osaka. But you can find one like each.'),
  me('Why would I?'),
  d('mai', 'Because she asked. And because you can’t read her notebook and you can’t read that watch, and a man who can read both has just offered you twenty thousand dollars not to learn.'),
  d('mai', 'Do you know what she said, every time I asked her why a watch was made a certain way? “Go and hold ten of them.” She never just told me. It drove me insane. She was right every time.'),
  choice([
    opt('“I have nine thousand dollars and no job.”', [d('mai', 'Then you’re better off than she was in 1976.')]),
    opt('“I don’t know anything about watches.”', [d('mai', 'You know one. Most collectors started with less.')]),
    opt('“Where would I even begin?”', [])
  ]),
  d('mai', 'Pocket one. *W.W.W., 1945, celle de Papa.* That’s British Army. Her father’s watch. For an honest one there’s only one place I’d go: Portobello Road, in London, on a Saturday, before it’s light. Ask for Peg. Say you’re Blanche Calame’s grandchild.'),
  n('Your mother has been listening from the doorway of the back room, with her coat on.'),
  d('claire', 'You’re going to London. To buy an old watch. So that you can understand an old watch.'),
  me('Yes.'),
  d('claire', 'You sound exactly like her.'),
  n('It is not a compliment. Then she opens the till, takes out everything in it, counts it twice, and holds it out to you.'),
  d('claire', 'The float. Eighteen hundred. If I give it to the landlord, it’s gone. If I give it to you, it’s… I don’t know what it is. Wasted her way instead of mine.'),
  cash(1800, 'the float from her till'),
  d('mai', 'And this.'),
  n('A dog-eared repair envelope, dated 1998, with a steel watch inside.'),
  show('orphan', { label: true }),
  d('mai', 'An orphan. Left for repair, never collected, the shop’s by law after a year. I’ve serviced it. When you run short, and you will, sell it. Sell it *honestly*. Say everything that’s wrong with it before the buyer can find it.'),
  d('mai', 'And if you’re short after that, have the dealer send the bill to me. I’ll put it on the shop’s account. You can owe your grandmother. Everybody else did.'),
  hide(),
  act(s => { s.flags.orphan = 1; }),
  tool('carnet'),
  goal('London. Portobello Road, Saturday, before dawn. Ask for Peg. Find a sister of Papa’s watch: a W.W.W., 1945.'),
  goto('lon_arrive')
]);
})();
