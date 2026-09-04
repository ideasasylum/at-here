---
name: at-here
description: Contact cards for AT Protocol accounts, read as a lighting cue list from cyc black through a cobalt-to-dawn horizon to white day.
colors:
  cyc: "#050505"
  cobalt: "#0A33FF"
  violet-mid: "#854FD7"
  rose: "#FF6AAE"
  dawn: "#FFC1D6"
  day: "#F7F5FF"
  white: "#FFFFFF"
  deep-rose: "#C42C86"
  stencil-violet: "#8A5BE6"
  ink-light: "#F4F1FA"
  ink-dark: "#0B0A12"
  stage-dim: "#AEB8E8"
  stage-soft: "#C9CFF0"
  stage-body: "#D9DCF2"
  blank-top: "#1A1B2E"
  blank-bottom: "#0B0B14"
  field: "rgba(10,12,28,.78)"
  placeholder: "#9AA3D6"
typography:
  display:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 8.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  wordmark:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
  name:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tabular-nums"
  action:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
  label:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.14em"
  display-did:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 4.6vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 0.92
  display-home:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 11vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
  display-error:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 6.4vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 0.92
  headline-example:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.2rem)"
    fontWeight: 800
    lineHeight: 0.95
  section:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1
  lede:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  blurb:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Saira, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  hairline: "2px"
  actor: "3px 3px 0 0"
  actor-corner: "3px"
  control: "4px"
  counter: "50%"
spacing:
  seam: "44px"
  gutter: "clamp(20px, 5vw, 72px)"
  measure: "62ch"
  container: "1240px"
  band-gap: "clamp(24px, 4vw, 56px)"
  scene-gap: "clamp(32px, 5vw, 80px)"
components:
  button-primary:
    backgroundColor: "linear-gradient(92deg, {colors.cobalt} 0%, {colors.deep-rose} 100%)"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "15px 22px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cobalt}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "15px 22px"
  button-secondary-hover:
    backgroundColor: "rgba(10, 51, 255, 0.08)"
    textColor: "{colors.cobalt}"
  input-lookup:
    backgroundColor: "rgba(10, 12, 28, 0.78)"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.control}"
    padding: "16px 18px"
  wordmark:
    textColor: "{colors.ink-light}"
    typography: "{typography.wordmark}"
  wordmark-hover:
    textColor: "{colors.dawn}"
  tag-unlisted:
    backgroundColor: "transparent"
    rounded: "{rounded.hairline}"
    padding: "5px 8px 4px"
  band-cue:
    typography: "{typography.headline}"
    padding: "70px 0 34px"
  band-utility:
    backgroundColor: "{colors.day}"
    textColor: "{colors.ink-dark}"
    padding: "84px 0 52px"
  band-record:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-dark}"
    padding: "92px 0 56px"
---

# Design System: at-here

## Overview

**Creative North Star: "Cyclorama Dawn"**

The card is a lighting cue list read top to bottom as one dawn. Identity sits on a black cyclorama; each app the account has written to is a full-width horizon band, and the bands rise through cobalt, violet, rose and dawn pink in rank order; the utilities sit in a day wash; the record footer is white. Colour encodes reading order and nothing else. Every band is a flat solid with a gradient only in the 44px seam where it meets the band above, so text always sits on a solid, and the ink on each band is chosen by measured contrast rather than assigned by hand.

Type does two jobs and no more. Big Shoulders Stencil in caps carries the handle and the app names, the only two things on the page that name an identity; Saira carries everything else at 17px with tabular numerals on by default. The voice is plain and factual: labels are data labels (DID, PDS, Apps, Collections), never decorative eyebrows. Density is generous but not airy; bands carry a minimum of 150px on desktop and collapse to content height on small screens.

The system refuses the link-in-bio scaffold: no avatar circle, no stacked pill buttons, no per-app brand colours or logos, no theme toggle. The avatar is an actor standing on the lit cobalt horizon at the foot of the first viewport, casting a long skewed shadow into the first band.

**Key Characteristics:**
- Flat solid bands, gradient confined to the seam
- Band colour derived from rank position along a fixed cobalt-to-dawn ramp
- Ink flips per band by measured WCAG contrast
- Stencil display caps for identity, Saira for everything else, tabular numerals
- Motion is a stage raise: brightness fades up in cue order, disabled under reduced-motion

## Colors

A four-stop dawn ramp on a black cyclorama, followed by two near-white days; all inks are derived rather than assigned.

### Primary
- **Cobalt** (`{colors.cobalt}`): the first band, the horizon glow behind the first viewport, the caret, the selection background, the scrollbar thumb, the secondary button's stroke and label, links on the white record band, and the start of every primary gradient. This is the one hue the browser surfaces carry.
- **Violet Mid** (`{colors.violet-mid}`): the computed midpoint between cobalt and rose, and the second stop of the band ramp. It never appears as a hard-coded value; it exists because `mix(COBALT, ROSE, 0.5)` produces it.
- **Rose** (`{colors.rose}`): the third stop of the band ramp and the focus ring colour of the lookup input (`0 0 0 3px` at 28% alpha).
- **Dawn** (`{colors.dawn}`): the last stop of the band ramp, the wordmark's hover colour, the thin lit line drawn along the horizon, and the warning colour in the readout.

### Secondary
- **Deep Rose** (`{colors.deep-rose}`): the end of the primary action gradient. It exists so a white label holds AA (5.18:1) where plain rose would not; it is never a band colour.
- **Stencil Violet** (`{colors.stencil-violet}`): the 45% stop of the handle's display gradient (`92deg`, cobalt to rose). See the inconsistency note under Named Rules.

### Neutral
- **Cyc** (`{colors.cyc}`): the black of the stage, the html background, the theme-color, and the `--prev` of the first band's seam.
- **Day** (`{colors.day}`): the utility band behind Save this card.
- **White** (`{colors.white}`): the record footer band, and the label colour on primary buttons and selection.
- **Ink Light** (`{colors.ink-light}`): the light ink candidate. Wins on cyc, cobalt and violet bands.
- **Ink Dark** (`{colors.ink-dark}`): the dark ink candidate. Wins on rose, dawn, day and white bands.
- **Stage Dim** (`{colors.stage-dim}`): the dim label ink used only on the black stage: top nav link, readout labels, the Full bio cue, and at alpha as the readout rule (35%), input border (45% rest, 75% hover), and blank actor border (25%).
- **Stage Soft** (`{colors.stage-soft}`): the headline line under the name on the stage.
- **Stage Body** (`{colors.stage-body}`): bio and lede paragraphs on the stage.

### Named Rules
**The Rank Ramp Rule.** A cue band's colour is `scale(APP_STOPS, i / (n - 1))` where `APP_STOPS = [cobalt, violet-mid, rose, dawn]`, `i` is the app's zero-based rank and `n` the app count. One app is cobalt; two apps are cobalt and dawn; the ramp is linear RGB interpolation between adjacent stops. Colour never signals importance, only order.

**The Measured Ink Rule.** Each band picks `ink-light` or `ink-dark`, whichever has the higher WCAG contrast against the band. Along the ramp the flip happens between t≈0.35 (`#8B50D5`, light wins at 4.47) and t≈0.40 (`#9D54CF`, dark wins at 4.32). Utility (day) and record (white) bands always take dark ink. Never hand-assign ink on a band.

**The Secondary Ink Rule.** Secondary ink (rank, evidence, notes, labels, the Unlisted tag) is the band mixed toward its primary ink, walking t from 0.60 in 0.05 steps until the pair reaches 4.6:1, then stopping. Results: cobalt `#D1D5FB`, rose `#482239`, dawn `#604A57`, day `#696871`, white `#6D6C71`. If no step reaches 4.6:1 the loop falls back to the primary ink; this happens at the violet-mid stop.

**The Hold Rule.** Hover and focus on a cue lay a hold wash over the whole band: `rgba(255,255,255,.09)` on light-ink bands, `rgba(5,5,5,.06)` on dark-ink bands. Active deepens to `rgba(5,5,5,.14)` on every band.

**The Seam-Only Gradient Rule.** Bands are flat. The only gradients on the page are the 44px seam (`--prev` to `--band`, vertical), the horizon glow, the handle's display gradient, and the primary action. Unlisted apps mark their seam with a 135deg 8px/8px repeating stripe of `--prev` and `--band` instead of the smooth blend.

## Typography

**Display Font:** Big Shoulders Stencil (with Arial Narrow, sans-serif), weights 700 and 800, always uppercase
**Body Font:** Saira (with Helvetica Neue, Arial, sans-serif), weights 400, 500, 600
**Label/Mono Font:** none distinct; labels are Saira 500 tracked and uppercase; numerals are Saira with `tabular-nums` set on body

**Character:** Stencil caps read as gel frames on a light plot: industrial, cut, and unmistakably an identity marker. Saira is a rounded geometric sans that stays plain and factual beneath them. The pairing keeps display type rare: two roles use the stencil (identity and section heads), everything else is Saira.

### Hierarchy
- **Display** (800, `clamp(2.75rem, 8.4vw, 6rem)`, 0.92, uppercase, max 16ch): the handle on the card stage, filled with the 92deg cobalt to stencil-violet to rose gradient via `background-clip: text` and `padding-bottom: .06em` so descenders are not clipped. Variants: DID as handle `clamp(1.6rem, 4.6vw, 3.4rem)` with `overflow-wrap: anywhere`; home h1 `clamp(3.4rem, 11vw, 6rem)` balanced; error h1 `clamp(2.2rem, 6.4vw, 4.4rem)` max 22ch. Dots in handles get a `<wbr>` after them.
- **Headline** (800, `clamp(1.9rem, 3.4vw, 2.7rem)`, 0.95, uppercase): the app name on each cue band, in band ink. 1.7rem below 480px. The example cue on home and error pages uses `clamp(1.5rem, 2.4vw, 2.2rem)`.
- **Title** (800, `clamp(1.6rem, 2.6vw, 2.2rem)`, 1, uppercase): the utility band's Save this card. Record band h2s are a fixed 1.5rem with 18px below.
- **Wordmark** (700, 1.15rem, 1, 0.06em, uppercase): at-here, top left, ink-light, dawn on hover.
- **Name** (600, `clamp(1.35rem, 2.2vw, 1.7rem)`, 1.2, -0.01em): display name beneath the handle. Followed by the headline line at 1.08rem in stage-soft.
- **Lede** (400, `clamp(1.1rem, 1.6vw, 1.3rem)`, inherits 1.55): home and error intro paragraph, stage-body, with 600 ink-light emphasis.
- **Body** (400, 17px, 1.55): everything unlabelled. Bio and record prose are capped at `62ch`; utility prose at 52ch. Cue blurbs are 1rem in band ink; profile notes 0.95rem in secondary ink, clamped to two lines. Everything smaller than body (readout warning, record list, record terms, credit line, tertiary links) shares one 0.875rem step.
- **Action** (600, 0.95rem, 1, 0.02em): the Open/Visit label on cues, both button variants, and the lookup submit. The lookup input itself is 500 at 1.05rem.
- **Label** (500, 0.7rem, 1.6, 0.14em, uppercase): readout terms. Evidence lines are 500 0.72rem/1.7 at 0.1em with 600 band-ink counts. Record footer terms are 0.68rem. The top nav link is 500 0.875rem at 0.12em; the Full bio cue is 500 0.8rem at 0.12em. Rank numerals are 500 0.82rem at 0.1em, zero-padded to two digits, not uppercase.
- **Tag** (600, 0.66rem, 1, 0.14em, uppercase): the Unlisted chip beside an unrecognised app name.

### Named Rules
**The Two Stencil Roles Rule.** Big Shoulders Stencil appears only as the identity (handle, app name, wordmark) or a section head. It is never used for body, labels, buttons or numerals.

**The Tabular Data Rule.** `font-variant-numeric: tabular-nums` is set on body and inherited everywhere; counts (Apps, Collections, collection totals) are 600 weight in primary ink so they read as data.

**The Label-Is-Data Rule.** Tracked uppercase micro-type appears only as a `<dt>` naming a value, an evidence line naming record collections, a rank numeral, or a status tag. It is never placed above a heading as an eyebrow.

## Layout

One centred column, `max-width: 1240px`, with a fluid gutter of `clamp(20px, 5vw, 72px)` on both sides. Every band is full-bleed in colour and uses the same `.wrap` column for its content, so the seams run edge to edge while text stays on the grid.

**Stage (first viewport).** A two-column grid, `minmax(0, 1fr) minmax(220px, 300px)`, gap `40px clamp(32px, 5vw, 80px)`, top padding `clamp(40px, 7vh, 84px)`, bottom padding `clamp(120px, 22vh, 220px)`, minimum height `calc(72svh - 60px)`. The handle, name, headline and bio fill the left; the readout `<dl>` (auto / 1fr, gap `10px 18px`, hairline top rule) sits top right. The horizon glow is absolutely positioned across the bottom `min(38vh, 320px)`; the actor is absolutely positioned bottom-right on the column's edge at `clamp(96px, 12vw, 168px)` wide, 3:4 aspect, shifted 1px down so it stands on the seam. Home and error stages are single-column with no minimum height and bottom padding `clamp(64px, 9vh, 104px)`.

**Cue band.** Grid `minmax(0, 7fr) minmax(0, 8fr) auto`, gap `10px clamp(24px, 4vw, 56px)`, items centred, padding `calc(44px + 26px)` top and 34px bottom, `min-height: 150px`. Column one is the lead (rank and app name, baseline-aligned, gap 18px); column two is the about stack (blurb, note, evidence at 6px gaps); column three is the action.

**Utility band.** Grid `minmax(0, 1fr) auto`, gap `20px 48px`, padding `calc(44px + 40px)` top and 52px bottom. Actions wrap in a 12px flex row.

**Record band.** Grid `minmax(0, 3fr) minmax(0, 2fr)`, gap `40px clamp(32px, 5vw, 80px)`, padding `calc(44px + 48px)` top and 56px bottom, `flex: 1` so it fills to the viewport floor. The collection list runs in two CSS columns with 32px gap and 2px row padding; the credit line spans both columns under a hairline with 26px above.

**Seam rhythm.** Every band's top padding is `44px + content offset`; the 44px is the seam and is never occupied by text.

**860px and below.** Stage collapses to one column with 30px gap and 64px bottom padding; the readout narrows to `calc(100% - 150px)` to leave room for the actor, which shrinks to `clamp(88px, 26vw, 120px)` at the gutter. Cue bands become `minmax(0, 1fr) auto` with the lead in row one, the about stack spanning row two, and the action reduced to a 28px arrow with its label visually hidden. Utility and record go single column; collections drop to one column; the lookup form stacks vertically with a full-width submit.

**480px and below.** The readout becomes one column with 10px between pairs and narrows to `calc(100% - 130px)`; app names fix at 1.7rem; the Unlisted tag drops below the name as a block.

## Elevation & Depth

Depth is theatrical, not architectural: the page is a stack of flat lit surfaces and the only things that cast are lights and the actor. There are no card shadows, no borders around containers, no layered panels. Depth reads from the seam gradient (the band above bleeding 44px into the band below), the cobalt horizon glow, and the actor's long skewed shadow falling onto the first band.

### Shadow Vocabulary
- **Horizon glow** (`radial-gradient(70% 100% at 50% 100%, rgba(10,51,255,.85) 0%, rgba(10,51,255,.38) 42%, rgba(10,51,255,0) 100%)` with a 2px dawn line at 70% opacity along its foot): the lit floor of the first viewport; hidden in print.
- **Actor lift** (`box-shadow: 0 -12px 40px rgba(10,51,255,.25)`): a cobalt bloom rising behind the avatar so it reads as lit from the horizon.
- **Actor long shadow** (`skewX(32deg)` element, `clamp(64px, 7.5vw, 104px)` tall, `linear-gradient(180deg, rgba(5,5,5,.62), rgba(5,5,5,.28) 55%, transparent)`): the one hard-edged shadow in the world, cast from the actor's feet onto the first band; hidden in print.
- **Primary action glow** (`0 10px 28px -12px rgba(10,51,255,.55)`, hover `0 14px 32px -12px rgba(196,44,134,.6)`): the gradient button's soft cobalt bloom, warming to deep rose on hover.
- **Input focus ring** (`0 0 0 3px rgba(255,106,174,.28)` with a rose border): the lookup field's focus.

### Named Rules
**The Only Lights Cast Rule.** Shadows belong to lit things: the horizon, the actor, the primary action, the focused field. Bands, cards, lists and text never carry a shadow.

**The Raise Rule.** Bands enter with `@keyframes raise` (filter brightness .42 to 1) over 0.7s on `cubic-bezier(.16, 1, .3, 1)`, delayed `min(i * 70ms, 560ms) + 80ms` by band index (`--i`) so the cue list lights top to bottom; the actor's shadow lengthens (`scaleY .35` to `1`) over 1.1s on the same curve. Hover transitions are 160–180ms. Under `prefers-reduced-motion: reduce` every animation and transition is removed.

## Shapes

Near-square. Interactive controls carry a 4px radius (buttons, lookup input and submit); the Unlisted tag and focus rings carry 2px; the actor image rounds only its top corners at 3px because it stands on the seam. The single circle is the 26px numbered step counter on the home page. Bands, seams and the horizon are rectilinear and full-bleed; the only diagonals are the actor's 32deg skewed shadow and the 135deg stripe on an unlisted seam. Borders are hairlines: 1px at low alpha for rules (readout, record list rows, credit) and 1.5px for strokes on controls (secondary button, input, step counter). The Unlisted tag uses a 1px stroke in secondary ink.

## Components

### Cue band
The signature component: one full-width lit band per app, the whole band a link. Reads as a cue on a lighting plot.
- **Anatomy:** seam (44px `::before`, `--prev` to `--band`), rank (`01`, secondary ink, `min-width: 2ch`), app name (Headline, band ink, optional Unlisted tag), about stack (blurb in band ink, optional two-line note in secondary ink, evidence line in secondary ink with 600 band-ink counts), action (`Open {app}` or `Visit {app}` in Action type with a 24px stroked arrow).
- **Colour:** set per instance as inline custom properties `--band`, `--prev`, `--ink`, `--ink-2`, `--hold`, `--i` from `themeFor(appBandColor(i, n), previous)`. Nothing in the stylesheet knows a band's colour.
- **Hover / Focus:** hold wash fades in over 180ms; arrow slides 6px right on the same 180ms curve. Focus ring is a 3px outline in band ink inset 10px.
- **Unlisted variant:** `.cue.unlisted` swaps the seam blend for the 8px diagonal stripe; the name gains the Unlisted tag; the blurb explains at-here does not recognise the collection.
- **Example variant:** on home and error pages one cobalt cue links to the author's card with the rank hidden and a smaller name.

### Actor and horizon
The avatar as a figure on a lit stage floor.
- **Actor:** `clamp(96px, 12vw, 168px)` wide, 3:4, `object-fit: cover`, top corners 3px, cobalt lift shadow, positioned so its base sits 1px into the first seam. With no avatar a blank panel stands in: `linear-gradient(180deg, #1A1B2E, #0B0B14)` with a stage-dim hairline at 25%.
- **Long shadow:** a sibling span skewed 32deg from the actor's feet, gradient from 62% black to transparent, animated by `lengthen`.
- **Horizon:** the cobalt radial glow across the stage foot with a 2px dawn line; the first band's seam begins where it ends.

### Buttons
- **Shape:** near-square (4px radius), 1.5px transparent border reserved so variants align, `15px 22px` padding, Action type, 10px gap to an inline arrow.
- **Primary:** white label on the 92deg cobalt to deep rose gradient, cobalt glow at rest warming to deep rose on hover. Used once per page for Download vCard.
- **Secondary:** cobalt label and 1.5px cobalt stroke on transparent; 8% cobalt fill on hover. Used for JSON.
- **Tertiary link (`.also`):** 500 0.875rem at 0.06em in secondary ink, underlined at 0.22em offset, primary ink on hover.
- **Active:** every button drops 1px (`translateY(1px)`) over 160ms.
- **Focus:** 3px outline in band ink, 3px offset.

### Lookup form
- **Style:** input flex 1 with 500 1.05rem Saira, `16px 18px` padding, `rgba(10,12,28,.78)` fill, 1.5px stage-dim stroke at 45%, 4px radius; placeholder `#9AA3D6` at 0.04em. Submit is the primary gradient with a 20px search glyph and `0 22px` padding, matching the input's height.
- **Hover:** stroke rises to 75% alpha.
- **Focus:** stroke turns rose with a 3px rose ring at 28%; native outline removed. Submit uses the 3px ink-light outline.
- **Mobile:** stacks vertically below 860px; submit becomes full-width with `16px 22px` padding.

### Readout
A `<dl>` of DID, PDS, Apps and Collections on the stage: auto / 1fr grid, `10px 18px` gap, Label terms in stage-dim, values in ink-light with `overflow-wrap: anywhere`, counts at 600. Opens with a 1px stage-dim rule at 35%. An unverified handle adds a full-width dawn warning line with a 16px stroked triangle glyph.

### Navigation
A single top bar: the wordmark left (Big Shoulders Stencil 700, ink-light, dawn on hover) and, on card pages only, Look up another at right (500 0.85rem 0.12em uppercase, stage-dim, ink-light and underlined on hover). No menu, no mobile variant beyond the same row.

### Unlisted tag
Inline chip after an unrecognised app name: Tag type, `5px 8px 4px`, 1px stroke and text in secondary ink, 2px radius, raised `.35em` to sit beside the stencil caps. Below 480px it drops to its own line.

### Record footer
White band, dark ink. Collection list (0.9rem/1.7, two columns, 8% ink-dark hairlines between rows), method prose in secondary ink at 0.95rem with cobalt links, a DID/PDS `<dl>` at 0.88rem, and a spanning credit line at 0.85rem under a 12% hairline. On the home page the left column is a numbered `.steps` list with 26px cobalt-stroked circle counters.

### Browser surfaces
`color-scheme: dark`; `theme-color` cyc; `::selection` cobalt with white text; `caret-color` cobalt; `scrollbar-color` cobalt on cyc; global `:focus-visible` is a 3px outline in the current band ink (fallback ink-light) at 4px offset with 2px radius. Print drops the horizon and long shadow and sets black on white.

## Do's and Don'ts

### Do:
- **Do** derive every band colour from rank position with `appBandColor(i, n)` and every ink with `themeFor`; pass them as inline `--band`, `--prev`, `--ink`, `--ink-2`, `--hold`, `--i`.
- **Do** keep bands flat: colour changes only in the 44px seam, and text never sits in the seam.
- **Do** reserve Big Shoulders Stencil 800 caps for the handle, app names and section heads; set everything else in Saira with tabular numerals.
- **Do** run primary actions cobalt to deep rose (`#C42C86`) so white labels hold AA; never end an action gradient on plain rose.
- **Do** use the hold wash (9% white on light-ink bands, 6% black on dark-ink bands) for hover and focus on a band link, and a 3px band-ink outline for focus.
- **Do** raise bands in cue order with `--i` delays capped at 560ms, and remove all animation and transition under `prefers-reduced-motion`.
- **Do** mark unrecognised apps with the striped seam and the Unlisted tag, never by omitting them.

### Don't:
- **Don't** build the link-in-bio scaffold: no avatar circle, no stacked pill buttons, no centred column of equal chips.
- **Don't** give an app its brand colour or logo; band colour means order, and glyphs are limited to the arrow, search and warning strokes.
- **Don't** place tracked uppercase text above a heading as a kicker or eyebrow; micro-type names a value, a collection, a rank or a status.
- **Don't** hand-pick ink for a band or assert a fixed ink colour in CSS; the flip is measured.
- **Don't** add drop shadows to bands, cards, lists or text; only the horizon, the actor, the primary action and the focused field cast.
- **Don't** add a theme toggle or a light mode; the world is one dawn read top to bottom.
- **Don't** use radii above 4px on anything but the step counter circle.
