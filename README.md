# Fitcolor

The coolors.co of getting dressed — a fast, free, playful tool that randomizes
outfit color combinations using real color-theory rules. No login, no clutter.

## Getting started

Requires Node.js 18.18+ (Node 20 recommended).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## What's implemented (v1)

- **Generator** (`/`) — five outfit slots (top, bottom, outerwear, shoes,
  accessory), each with a color swatch, garment icon, lock/unlock, and a
  loose/fitted toggle on top/bottom/outerwear.
- **Randomize** — big button + spacebar (ignored while typing in an input),
  with a short flicker/shuffle animation on unlocked slots before they settle.
- **Color harmony engine** (`lib/harmonyEngine.ts` + `lib/palette.ts`) — seven
  rules (monochromatic, analogous, complementary, triadic, neutral + accent,
  60/30/10, 50/50) drawing from a curated, realistically-named color palette
  so results always read as real garment colors, not raw hex noise.
- **"Show your work"** — a plain-language explanation card under the outfit
  that updates with the active harmony rule.
- **Undertone + seasonal palette guidance** — optional, skippable, non-blocking
  "flatters your tone" badges. Never blocks or forbids a palette.
- **Style archetypes** — 8 styles (streetwear, minimalist, old money/preppy,
  vintage, grunge, athleisure, formal, boho) with an optional blend slider
  between two styles, feeding a formality range that constrains generation.
- **Occasion tags** — casual, work, formal, date, beach, night out, weekend —
  each nudging formality/saturation via the same formality-range mechanism.
- **Favorites** (`/favorites`) — heart a look to save it to `localStorage`;
  restore or delete from the Favorites page. No account, no server.
- **Share via URL** — the current outfit (colors, locks, rule, style,
  occasion, undertone, season) is continuously encoded into the URL query
  string, so any link is a shareable, restorable snapshot.
- **How it works** (`/how-it-works`) — plain-language explanation of every
  harmony rule, the ratio rules, and an explicit honesty statement.
- **Thai / English** (`lib/i18n`) — full UI + color-name translations, with a
  language toggle in the header; Thai swaps in Noto Serif/Sans Thai fonts.
- **Dark mode** — toggle in the header, persisted, with a considered warm
  palette in both modes (see `tailwind.config.ts`).

## Project structure

```
app/                Next.js App Router routes (Generator, Favorites, How it works)
components/         UI components (client components)
lib/                Color engine, palette data, style/occasion data, i18n, outfit state + URL codec
hooks/useOutfit.ts  The core outfit state hook (generation, locks, URL sync)
```

## Notes on what's intentionally not built

Per the product brief: no wardrobe upload, no virtual try-on, no social feed,
no AI rating, no digital closet, no photo-based skin detection (a "coming
soon" placeholder is shown instead), and no login/account system anywhere.

## A note on this build

This project was generated in a sandboxed environment without network
access, so it has not been run through `npm install` / `next dev` /
`next build` yet. The code was written carefully by hand to be correct, but
please run it locally and file/fix any issues you hit on first boot —
most likely candidates are a stray import path or a Tailwind class typo.
