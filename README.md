# St James — Bar + Club

A rebuild of [stjamesnightclub.com.au](https://www.stjamesnightclub.com.au/) as a Vite + React single-page app:
every component of the original site, re-laid-out against `desing-inspo.webp`, dark mode only, with
electric-blue gradient buttons and a full-bleed hero video.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # -> dist/
npm run preview
```

## What came from where

| Original site | Here |
| --- | --- |
| Header nav | `components/Navbar.jsx` — three floating glass pill clusters, merging into one bar on scroll, plus a full-screen overlay menu |
| Hero (YouTube background + logo) | `components/Hero.jsx` — the same reel (`Nd-eh12ufL4`) covering the whole first screen, with the wordmark rendered as live lightning |
| Three tiles | `components/Cards.jsx` — Weekly Club Photos / Join The Team / FAQs |
| "About St James" | `components/About.jsx` |
| "Follow Us On The Gram" | `components/Gram.jsx` — a double marquee of venue photography |
| "Contact Us" | `components/Contact.jsx` — enquiries, opening hours (tonight highlighted), location |
| Footer | `components/Footer.jsx` |
| `/apply` | `pages/Apply.jsx` — the application form, same fields, validated client-side |
| `/nightlife-photos` | `pages/Photos.jsx` — searchable, sortable album browser with grid/list views |
| the FAQ tile (which linked nowhere) | `pages/Faqs.jsx` — an accordion |

Old permalinks (`/nightlife-photos`, `/home`) redirect to the new routes.

## Design system

Everything visual resolves to two files:

- **`src/styles/tokens.css`** — the only place colour, radius, spacing, type scale and motion are defined.
  There is no light theme and no `prefers-color-scheme: light` branch anywhere; `color-scheme: dark` is
  declared on `:root`.
- **`src/styles/global.css`** — shared classes every component builds on: `.shell` `.section` `.rule`
  `.eyebrow` `.section-title` `.gradient-text` `.lead` `.glass` `.panel` `.btn` and the `.reveal`
  scroll-in animation.

The one gradient is `--grad-electric`. Every primary action is `.btn.btn--primary`, which pairs it with a
layered glow (`--glow-md`) and an outside-the-pill bloom so it reads as emitted light rather than a drop
shadow. Secondary actions are `.btn.btn--ghost`.

Component styles live beside their component and are namespaced (`sj-nav__`, `sj-hero__`, …) so nothing
can collide. `global.css` is imported **before** `App.jsx` in `main.jsx` so component rules win ties
against the shared classes — don't reorder those two imports.

## Hero video

The hero is `100svh` (with a `100vh` fallback) and the iframe is sized to the larger of the two cover
dimensions, then scaled to `1.34`. The scale is not decorative: YouTube paints its own title and channel
chrome across the top-left of an embed and no embed parameter removes it, so the player is pushed past
the edges. `/assets/hero-poster.jpg` covers first paint and cross-fades out 1.2s after the iframe loads,
which is long enough for playback to start instead of exposing the buffering spinner.

The wordmark is React Bits' `ElectricLogo` (vendored in `components/ElectricLogo.jsx`, needs `ogl`),
tracing the alpha of `/assets/st-james-logo-white.png`. A plain `<img>` of the same logo sits behind it
and hides once the canvas paints, so the logo is present on first paint and still correct if WebGL is
unavailable.

## Content

All copy, nav, hours, FAQs and venue facts live in **`src/data/site.js`**. Change the club's details
there, not in the components.

## Assets

`public/assets/` holds the venue's own photography, pulled from the original site. The three tile images
were cropped to remove the titles that were baked into them, since the new cards set their own type.
