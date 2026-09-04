# at-here design brief: Cyclorama Dawn

Status: proposed, awaiting confirmation. Shape output only; no code, no direction contract, no DESIGN.md yet.
Seed key 2b6888a7, re-roll round 1, bolder register, chosen challenger `stagecraft-theater-lighting-cyclorama-dawn`.
Quality bar: `.impeccable/reference/cyclorama-board.png` and `cyclorama-hero.png`.

## 1. Job and audience

- Visitor mode: **Operate**. The visitor arrives from a link the account owner shared (bio, signature, README) and wants to reach that person on one of the apps listed. Secondary visitors type a handle on the home page out of curiosity.
- They already know who the person is. The page must confirm identity in the first glance, then get them to the right app in one tap.
- Audience is the AT Protocol community: developers and early adopters. Voice stays plain and factual.

## 2. Outcome and proof

- Primary action: follow through to an app profile. Every app row is the link.
- Secondary actions: download vCard, view JSON, look up another account.
- Proof is the network's own record. Each app row shows the record collections that justify it, and the page says how it was assembled (handle to DID to PDS to repository). Presence is never asserted without its evidence.
- The only magnitude shown is the count of record collections per app. No invented activity metrics.

## 3. Selected direction

**World:** the seamless cyclorama, a stage wall lit from black night through cobalt and rose into white day. Content lives in horizontal horizon bands stacked dark to light. Cue names in stencil caps with tabular numerals; body text in a clean geometric sans. Cyc black, cobalt horizon, rose gather, dawn rose, day wash, white day. Materials: matte absorbent black, cobalt sheen, soft diffuse white.

**Structural thesis:** the card is a lighting cue list. Reading order is the dawn. Band colour encodes position in the sequence, not importance, so it is always honest. Identity sits in blackout at the top, apps rise through cobalt into rose and dawn in rank order, utilities sit in day wash, and the record-collection footer is white day. The dawn always completes, whether the account has one app or fifteen. It refuses the category default: no avatar-in-a-circle over stacked pill buttons, no cards floating on a gradient.

**First viewport (desktop):** full-bleed cyc black. Top left, a small tracked stencil kicker: AT-HERE · CONTACT CARD. Below it the handle, enormous, in stencil caps with the cobalt-to-rose gradient running through the letterforms. Under it the display name and headline in the sans, and the bio clamped to about four lines with a disclosure for the rest. The avatar stands on the horizon line as the actor: a photo cut into a standing silhouette frame at the right, casting a long shadow toward the viewer. Right edge, a cue readout in small tracked caps and tabular numerals: DID, PDS host, N APPS · M COLLECTIONS, and a HANDLE UNCONFIRMED warning when the DID document does not claim the handle. The horizon itself is the top edge of the first app band, glowing cobalt at the bottom of the viewport, with LX 01 BLUESKY and its arrow visible. The primary action sits on the horizon.

**App bands:** one full-width band per app, each a flat solid colour with a soft gradient only at the seam above it, so text always sits on a solid. Left: LX number (two-digit rank) and the app name in stencil caps. Middle: the blurb in the sans, then the evidence line in small tracked caps: the count and the collection NSIDs. Right: GO with an arrow, or VISIT SITE when no profile page exists. The whole band is the link. Text colour flips per band by luminance: white on black and cobalt, cyc black on dawn and day. Unrecognised apps carry an UNLISTED label and a hatched seam so state never relies on colour alone.

**Utilities band (day wash):** LX SAVE. Download vCard as the primary button in the cobalt-to-rose gradient, JSON as the outlined secondary, Look up another account as a text link.

**Footer band (white day):** every record collection as tracked labels in two columns, DID and PDS in full, a one-line account of how the card was assembled, and the credit line.

**Signature motion:** the raise. On load the cyc is blackout; bands come up in cue order from the top, each a short raise, and the actor's shadow lengthens as the horizon lights. Total under about 1.2 seconds regardless of band count. Hover or focus on a band holds it one step brighter, matching the board's active state. Reduced motion: fully lit, static.

**Home page:** the world at rest. Blackout with a single cobalt horizon line. The at-here mark in stencil caps, one factual subline, the lookup input sitting on the horizon (dark field, outlined, stencil placeholder), LOOK UP as the primary button. Below the horizon, one real example band linking to jamie.ideasasylum.com.

**Error pages:** LX 000 · BLACKOUT kicker, the message in the sans, the lookup input on the horizon. Messages: "No account resolves to {input}." (404), "That isn't a handle or a DID." (400), "The PDS at {host} didn't answer. Try again shortly." (502).

**Implementation consequence:** server-rendered HTML from `src/render/html.ts`, CSS custom properties for the band scale, CSS-only animations so the page needs no JavaScript. Bands are a semantic list of links. Fonts are the one new dependency (see open decisions).

## 4. Scope and boundaries

- Fidelity: production-ready. Breadth: card page, home page, three error pages. Interactivity: links, one disclosure, hover and focus states, load motion.
- Named targets: `src/render/html.ts` (all markup and styles), possibly a small static asset route for fonts.
- Untouched: routing, resolution, the app registry, JSON and vCard output, caching, copy in the JSON and vCard.
- Anti-goals: no link-in-bio layout; no glow, neon edges or blur; no dark-mode/light-mode toggle (the world is one scene); no marketing copy; no metrics beyond collection counts; no per-app brand colours or logos (the dawn owns colour).

## 5. States and ranges

- Apps: 1 (a fresh Bluesky account) to 15 or more (a heavy user). The gradient steps divide across however many bands exist; with few apps, bands are taller and steps larger.
- Collections per app: 1 to about 12. The evidence line wraps to a second row when needed.
- Display name missing: the handle stands alone. Avatar missing: the actor is a silhouette outline on the horizon. Bio missing: the readout moves up.
- Bio length: empty to several paragraphs with URLs. Clamp to about four lines with a disclosure.
- Handle unconfirmed by DID document: warning in the readout, never hidden.
- DID given instead of handle: the DID document's handle is shown; with none, the DID is the title in stencil caps and wraps.
- Unknown apps: UNLISTED label, hatched seam, domain as the name, VISIT SITE to the domain.
- Loading has no state of its own: the Worker renders complete HTML.

## 6. Interaction and layout

- Hierarchy: handle, then the first app band, then the readout. Everything else is secondary.
- Topology: one vertical sequence, no sidebar, no tabs.
- Mobile: bands stack full width and stay the tap target (minimum 56px tall). Band content wraps: name and rank on the first line, evidence on the second, arrow at the right edge. The readout moves below the bio. The actor shrinks and stands at the right of the horizon; its shadow may be dropped on narrow screens.
- Focus: visible stencil outline on bands and buttons. Bands are real links; keyboard order follows cue order.
- Feedback: hover and focus hold the band one step brighter; active presses it one step darker.

## 7. Constraints and open decisions

- Contrast: AA on every band. Solid band interiors, gradient only at seams, text colour chosen per band by luminance.
- No JavaScript required. CSS animations only, with prefers-reduced-motion honoured.
- Performance: fonts are the only external weight. Everything else is inline CSS in the response, under the current cache headers.
- Open: font delivery. Candidates are Saira Stencil One for display with Saira for text (one superfamily, tabular figures available), or Big Shoulders Stencil for a taller display. Load from Google Fonts or self-host WOFF2 through a Worker static asset route. Decide at build.
- Open: an OpenGraph image per card (the first viewport as a rendered image) would make shared links land well. Out of scope unless asked.
- Open: whether the actor silhouette uses the Bluesky banner image behind the horizon when one exists. Default no.
