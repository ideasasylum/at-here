import type { Card, CardApp } from "../card";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const e = escapeHtml;

const STYLES = `
:root{color-scheme:light dark;--bg:#f7f7f5;--fg:#1c1c1a;--muted:#6b6b66;--card:#fff;--line:#e4e4e0;--accent:#1d6fd6;--accent-fg:#fff;--chip:#eef2f8}
@media(prefers-color-scheme:dark){:root{--bg:#141413;--fg:#ececea;--muted:#9a9a94;--card:#1e1e1c;--line:#2c2c29;--accent:#5b9bf0;--accent-fg:#0d1a2b;--chip:#232a35}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:720px;margin:0 auto;padding:2rem 1.25rem 4rem}
a{color:var(--accent)}
header.profile{display:flex;gap:1.25rem;align-items:flex-start;margin-bottom:2rem}
header.profile img,.avatar-fallback{width:88px;height:88px;border-radius:50%;flex:none;object-fit:cover;background:var(--chip)}
.avatar-fallback{display:grid;place-items:center;font-size:2rem;color:var(--muted)}
h1{margin:0;font-size:1.6rem;line-height:1.2}
.handle{color:var(--muted);margin:.15rem 0 0;word-break:break-all}
.handle .unverified{color:#b3261e;font-size:.85em}
.bio{margin:.75rem 0 0;white-space:pre-line}
.meta{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;font-size:.85rem;color:var(--muted);margin:2rem 0 1rem}
.meta code{font:.9em ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all}
h2{font-size:1rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:2rem 0 .75rem}
ul.apps{list-style:none;padding:0;margin:0;display:grid;gap:.75rem}
li.app{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:1rem 1.25rem;display:grid;grid-template-columns:44px 1fr auto;gap:1rem;align-items:center}
li.app .icon{width:44px;height:44px;border-radius:10px;background:var(--chip);display:grid;place-items:center;font-weight:600;color:var(--accent)}
li.app.unknown .icon{color:var(--muted)}
li.app .name{font-weight:600}
li.app .blurb{color:var(--muted);font-size:.9rem}
li.app .desc{margin:.35rem 0 0;font-size:.9rem;white-space:pre-line}
li.app .cols{margin:.4rem 0 0;font-size:.75rem;color:var(--muted);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all}
li.app .go{white-space:nowrap;font-size:.9rem}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2.5rem}
.actions a{display:inline-block;padding:.55rem 1rem;border-radius:8px;border:1px solid var(--line);background:var(--card);text-decoration:none;color:var(--fg)}
.actions a.primary{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
footer{margin-top:3rem;font-size:.85rem;color:var(--muted)}
form.lookup{display:flex;gap:.5rem;margin:1.5rem 0}
form.lookup input{flex:1;font:inherit;padding:.65rem .9rem;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg)}
form.lookup button{font:inherit;padding:.65rem 1.1rem;border-radius:8px;border:0;background:var(--accent);color:var(--accent-fg);cursor:pointer}
p.lede{font-size:1.15rem;color:var(--muted)}
details summary{cursor:pointer;color:var(--muted)}
details ul{columns:2;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem;padding-left:1.25rem}
@media(max-width:520px){li.app{grid-template-columns:44px 1fr}li.app .go{grid-column:2}}
`;

function layout(title: string, body: string, description?: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title>
${description ? `<meta name="description" content="${e(description)}">` : ""}
<style>${STYLES}</style>
</head>
<body>
<main>
${body}
<footer>at-here builds contact cards from public AT Protocol data. Apps appear when an account has written records for them.</footer>
</main>
</body>
</html>
`;
}

function renderApp(app: CardApp): string {
  const initial = app.name.trim().charAt(0).toUpperCase() || "?";
  const target = app.profileUrl ?? app.homepage;
  const linkText = app.profileUrl ? "View profile" : "Visit site";
  return `<li class="app${app.known ? "" : " unknown"}">
  <div class="icon" aria-hidden="true">${e(initial)}</div>
  <div>
    <div class="name">${e(app.name)}</div>
    ${app.blurb ? `<div class="blurb">${e(app.blurb)}</div>` : `<div class="blurb">Unrecognised app</div>`}
    ${app.description ? `<p class="desc">${e(app.description)}</p>` : ""}
    <div class="cols">${app.collections.map(e).join(" · ")}</div>
  </div>
  <a class="go" href="${e(target)}" rel="noopener">${linkText} →</a>
</li>`;
}

export function renderCard(card: Card, origin: string): string {
  const title = card.displayName ?? card.handle ?? card.did;
  const slug = encodeURIComponent(card.handle ?? card.did);
  const avatar = card.avatar
    ? `<img src="${e(card.avatar)}" alt="" width="88" height="88">`
    : `<div class="avatar-fallback" aria-hidden="true">@</div>`;
  const handleLine = card.handle
    ? `@${e(card.handle)}${card.handleVerified ? "" : ' <span class="unverified">(handle not confirmed by DID document)</span>'}`
    : e(card.did);

  const body = `
<header class="profile">
  ${avatar}
  <div>
    <h1>${e(title)}</h1>
    <p class="handle">${handleLine}</p>
    ${card.headline && card.headline !== card.description ? `<p class="bio"><strong>${e(card.headline)}</strong></p>` : ""}
    ${card.description ? `<p class="bio">${e(card.description)}</p>` : ""}
  </div>
</header>

<h2>Found on ${card.apps.length} ${card.apps.length === 1 ? "app" : "apps"}</h2>
<ul class="apps">
${card.apps.map(renderApp).join("\n")}
</ul>

<div class="actions">
  <a class="primary" href="/${slug}.vcf" download>Download vCard</a>
  <a href="/${slug}.json">JSON</a>
  <a href="/">Look up another account</a>
</div>

<div class="meta">
  <span>DID <code>${e(card.did)}</code></span>
  <span>PDS <code>${e(card.pdsHost)}</code></span>
</div>

<details>
  <summary>All ${card.collections.length} record collections</summary>
  <ul>${card.collections.map((c) => `<li>${e(c)}</li>`).join("")}</ul>
</details>
`;
  return layout(`${title} · at-here`, body, `Where to find ${title} across the AT Protocol network`).replace(
    "<head>",
    `<head>\n<link rel="alternate" type="text/vcard" href="${origin}/${slug}.vcf">\n<link rel="alternate" type="application/json" href="${origin}/${slug}.json">`,
  );
}

export function renderHome(): string {
  const body = `
<h1>at-here</h1>
<p class="lede">A contact card for any AT Protocol account. Enter a handle or DID to see every app it can be found on, then download it as a vCard.</p>
<form class="lookup" method="get" action="/">
  <input name="q" type="text" placeholder="jamie.ideasasylum.com" autocomplete="off" autocapitalize="none" spellcheck="false" required>
  <button type="submit">Look up</button>
</form>
<p>Or go straight to <code>/your.handle</code>, <code>/your.handle.vcf</code> or <code>/your.handle.json</code>.</p>
`;
  return layout("at-here", body, "Contact cards for AT Protocol accounts");
}

export function renderError(status: number, message: string): string {
  const body = `
<h1>${status === 404 ? "Not found" : "Something went wrong"}</h1>
<p class="lede">${e(message)}</p>
<form class="lookup" method="get" action="/">
  <input name="q" type="text" placeholder="handle or did:plc:…" autocomplete="off" autocapitalize="none" spellcheck="false" required>
  <button type="submit">Look up</button>
</form>
`;
  return layout(`${status} · at-here`, body);
}
