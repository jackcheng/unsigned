# Unsigned — Act I: The Empty Roll

A narrative game about watches, and the people nobody put on the dial.

You inherit your grandmother's watch: steel, plain, and with no name anywhere on it. A dealer from Geneva offers twenty thousand dollars for it on the spot, and will not say why. You have until the end of the year to find out what it is. Her notebook says the way to understand it is to find the sisters of six other watches she once owned and sold. That takes you to London, Paris, Marseille, New York, Tokyo, Hong Kong and finally the Swiss Jura.

## Running it

Open `index.html` in a browser. There is no build step and no server; everything is plain static files and it works from `file://`. Nothing is fetched from the network.

Served over HTTPS it also installs as a home screen app (`manifest.webmanifest`, `icons/`) and plays offline: `sw.js` caches every file on first load. When you change or add a file, bump `CACHE` in `sw.js` and keep its file list in step, or installed copies will keep the old version.

It plays in landscape only. A phone held upright is asked to turn (iPhone ignores an orientation lock from a web app, so the page does the asking), and there are no upright layouts to maintain.

About ninety minutes. It saves by itself at the start of every scene (in the browser's local storage). Best with sound.

## Controls

- Click, or press **Space**, to continue. Hold **Ctrl** to skim.
- **1–9** pick a choice.
- **C** opens her notebook (the carnet), **R** the watch roll, **L** the lineage board, **Esc** the menu.
- Underlined words can be clicked for a definition; they collect in the carnet.
- The menu has switches for sound and for scene motion (falling snow, rain, water). Motion also backs off by itself on a machine that struggles.

## What you do

- **The loupe.** Examine each watch: dial, in the dark, caseback, movement. What you notice becomes your leverage.
- **Haggling.** Point out real faults and the price drops. Call an honest feature a fault and the seller loses patience.
- **Winding, regulating, timing a dive, printing a dial.** Each watch type is taught by using it once.
- **The lineage board.** Every real watch you hear about takes its place in a family tree, next to what it came from.
- **The roll.** Six empty pockets. What you put in each one is up to you and your budget, and the game remembers.

## Files

```
index.html            entry point
manifest.webmanifest  home screen app details
sw.js                 offline cache (bump CACHE on every change)
icons/                app icons; icon.svg is the source for the PNGs
css/style.css         all styling
js/fonts.js           bundled fonts (embedded, so the game works offline)
js/watch.js           the procedural watch illustrator (every watch is drawn from a small config)
js/audio.js           synthesised sound: ticking at the right beat rates, effects, ambience
js/engine.js          state, saving, story runner, dialogue, backdrop layering
js/panels.js          carnet, roll, lineage board, menu
js/games.js           loupe, haggling, winding, regulating, bezel, pad printer, travel, ending
js/data.js            people, watches and what the loupe finds, her notebook, the glossary
js/lineage.js         the lineage board: 61 entries, with dates, text and drawings
js/scenes-*.js        the twelve location backdrops, drawn in SVG
js/story-*.js         the script, one file per chapter
```

Appending `?scene=<id>` to the URL jumps straight to a scene with a mid-game state, which is useful when editing the script (scene ids are the first argument of each `G.scene(...)` call).

## Fact and fiction

The watches on the lineage board, their dates and their makers are real. The people in the story are invented, as are the Corémont company and its calibre 13‴, the Meridor chronograph, and the shop-signed skin diver. Where the historical record is disputed (who was first in 1969, why Neuchâtel stopped, whose watch reached the summit of Everest) the game says so.

## Licences

The bundled fonts are EB Garamond, Cormorant Garamond, Jost, Caveat and La Belle Aurore, all under the SIL Open Font License 1.1. The licence texts and copyright notices are in `licenses/`.
