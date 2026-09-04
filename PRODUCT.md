# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: AT Protocol account holders who link to their own card from a bio, website, or email signature. Today that is mostly the author, with the expectation that others adopt it. Visitors to a card arrive from a link the owner shared and want to reach that person on one of the apps listed.

Secondary: curious people and developers who type a handle or DID into the home page to see where an account exists across the network.

## Product Purpose

at-here turns any AT Protocol handle or DID into a contact card: one page listing every app the account can be found on, with links to each profile, plus the same data as JSON and a downloadable vCard. It exists because identity on the AT Protocol is portable across apps but there is no single place to see or share that footprint. Success is a visitor clicking through to the app they wanted.

## Positioning

A small, open tool for the community rather than a personal page. It reads the network's own public record (the DID document and the repository's collection list) instead of asking anyone to register or maintain a profile. Anything an account has written to shows up automatically, including apps at-here has never heard of.

## Operating Context

- Deployed as a Cloudflare Worker at at-here.ideasasylum.com. No database; every card is assembled live from public.api.bsky.app, plc.directory, and the account's own PDS, then edge-cached for five minutes.
- URL shapes: `/{handle}` or `/{did}` for the card, `.vcf` and `.json` suffixes for the other formats, `/` for lookup.
- The app registry lives in `src/apps.ts` and maps NSID prefixes to app name, blurb, homepage, and a profile URL template. Unrecognised collections are grouped by their NSID authority domain.

## Capabilities and Constraints

- Data available per card: DID, handle (with a flag when the DID document does not confirm it), PDS host, list of record collections, and profile records from Bluesky (display name, bio, avatar, banner), Sifa (first and last name, headline, about), and Tangled (bio, links).
- Presence is inferred from written records only. Read-only use of an app, or an app that stores nothing in the repo, is invisible. Deleted records leave a collection listed.
- Realistic ranges: a fresh account has one or two apps; a typical active account has three to six; a heavy user might have ten or more. Collection counts per app range from one to about a dozen. Unknown apps appear with only a domain name.
- Bios can be empty or several paragraphs with URLs. Display names can be missing, in which case the handle stands in. Avatars may be missing.
- Error states: handle does not resolve (404), input is not a handle or DID (400), upstream PDS unreachable (502).
- Stack is settled: TypeScript Worker, server-rendered HTML in `src/render/html.ts`, no client framework, no build step for CSS. Vitest for unit tests.
- Open decision: whether to expose a way for account owners to correct or extend their card. Currently everything is read-only.

## Brand Commitments

- Name: at-here. Author credit belongs in a footer line, not in the identity.
- Voice: plain and factual, in the register of the AT Protocol developer community. No marketing tone.
- Aesthetic, pinned by the author after the first build (2026-09-05): neon nightclub / cyberpunk bar. Dark surfaces lit by neon tubes; nothing solid and saturated, no hard edges between regions, no cast shadows.

## Evidence on Hand

- Live data for jamie.ideasasylum.com shows Bluesky, Sifa, Tangled, Aether OS, and Standard.site, with a real avatar and bios. Use real accounts for design checks, not invented ones.
- App profile URL templates for apps where the author has no account are unverified guesses. No testimonials, usage figures, or adoption claims exist and must not be fabricated.

## Product Principles

- The network's record is the source of truth. Show what is there, say how it was found, and never imply presence that the data does not support.
- Every app entry exists to be clicked. The profile link is the primary affordance of each entry.
- Unknown apps are first-class. The tool should be useful for apps that did not exist when it was written.
- Works without an account, without JavaScript, and without a database. Speed and portability over features.
- One card, three formats. HTML, JSON, and vCard describe the same thing and must agree.
