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

function breakable(value: string): string {
  return e(value).replace(/\./g, ".<wbr>");
}

const BG = "#07060D";
const SURFACE = "#0D0A17";
const RECORD_SURFACE = "#09070F";
const CYAN = "#2FE0FF";
const VIOLET = "#7B5CFF";
const MAGENTA = "#FF3FD8";
const ORANGE = "#FF7A45";
const AMBER = "#FFB347";
const WARM = "#F6EDE0";
const INK = "#F2EFFA";
const INK_ON_NEON = "#1A0512";

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: Rgb): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

function rgbTriplet(hex: string): string {
  return hexToRgb(hex).join(",");
}

function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

function scale(stops: string[], t: number): string {
  if (stops.length === 1) return stops[0];
  const clamped = Math.min(1, Math.max(0, t));
  const segment = clamped * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(segment));
  return mix(stops[index], stops[index + 1], segment - index);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

interface BandTheme {
  surface: string;
  tube: string;
  tubeRgb: string;
  tubeInk: string;
  ink: string;
  ink2: string;
}

function secondaryInk(surface: string, start: string): string {
  for (let t = 0; t <= 1; t += 0.1) {
    const candidate = mix(start, INK, t);
    if (contrast(surface, candidate) >= 4.6) return candidate;
  }
  return INK;
}

function themeFor(tube: string, base = SURFACE): BandTheme {
  const surface = mix(base, tube, 0.06);
  return {
    surface,
    tube,
    tubeRgb: rgbTriplet(tube),
    tubeInk: mix(tube, "#FFFFFF", 0.72),
    ink: INK,
    ink2: secondaryInk(surface, mix(tube, INK, 0.45)),
  };
}

const TUBES = [CYAN, VIOLET, MAGENTA, ORANGE];

function tubeFor(index: number, total: number): string {
  const t = total <= 1 ? 0 : index / (total - 1);
  return scale(TUBES, t);
}

function bandStyle(theme: BandTheme, index?: number): string {
  const vars = [
    `--surface:${theme.surface}`,
    `--tube:${theme.tube}`,
    `--tube-rgb:${theme.tubeRgb}`,
    `--tube-ink:${theme.tubeInk}`,
    `--ink:${theme.ink}`,
    `--ink-2:${theme.ink2}`,
  ];
  if (index !== undefined) vars.push(`--i:${index}`);
  return vars.join(";");
}

const ARROW = `<svg class="arrow" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SEARCH = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const WARN = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 3 2.5 20h19L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v5M12 17v.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const CONTRACT = `<!--
THESIS: The contact card is a cue list read down one dark wall of a neon bar:
identity as the sign over the door, one lit shelf per app, each seam a neon
tube whose colour walks cyan to violet to magenta to orange in rank order,
utilities under amber, the record footer under warm white. It refuses the
link-in-bio scaffold of an avatar circle over stacked pill buttons, and it
refuses solid saturated fills: surfaces are dark, only the tubes are bright.
OWN-WORLD: near-black #07060D with a violet cast, dark tinted surfaces
#0D0A17, neon tubes cyan #2FE0FF, violet #7B5CFF, magenta #FF3FD8, orange
#FF7A45, amber #FFB347, warm white #F6EDE0. Tilt Neon for the sign, the app
names and section heads, glowing in their tube colour; Saira for text; tabular
numerals for data. Light spills from each tube into the surface below it.
STORY: The visitor recognises the person in one glance, sees where they can
be reached and why the card says so, and taps one shelf to get there.
FIRST VIEWPORT: Dark. Wordmark top left as a small cyan tube. The handle
enormous as a magenta neon sign, name and bio beneath, a readout of DID, PDS
and counts at the right. The avatar stands in a neon-rimmed frame on the first
tube, which runs the full width at the foot of the viewport; the first shelf
begins under it.
FORM: Cyclorama Dawn (seed 2b6888a7) re-lit as a neon bar at the user's
direction after the first build.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
-->`;

const STYLES = `
:root{
  --bg:${BG};--surface-base:${SURFACE};--cyan:${CYAN};--violet:${VIOLET};--magenta:${MAGENTA};--orange:${ORANGE};--amber:${AMBER};--warm:${WARM};
  --ink:${INK};--ink-dim:#A9A3C2;--ink-body:#D9D4EA;--ink-on-neon:${INK_ON_NEON};
  --cyan-rgb:${rgbTriplet(CYAN)};--magenta-rgb:${rgbTriplet(MAGENTA)};
  --display:"Tilt Neon","Trebuchet MS",sans-serif;
  --text:"Saira","Helvetica Neue",Arial,sans-serif;
  --gutter:clamp(20px,5vw,72px);
  --measure:62ch;
  --ease:cubic-bezier(.16,1,.3,1);
  color-scheme:dark;
}
*,*::before,*::after{box-sizing:border-box}
html{background:var(--bg);scrollbar-color:var(--cyan) var(--bg)}
body{margin:0;overflow-x:clip;background:var(--bg);color:var(--ink);font:400 17px/1.55 var(--text);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;font-variant-numeric:tabular-nums;caret-color:var(--cyan);min-height:100svh;display:flex;flex-direction:column}
::selection{background:var(--magenta);color:var(--ink-on-neon)}
a{color:inherit;text-decoration-thickness:1px;text-underline-offset:.18em}
h1,h2,h3{margin:0;font-weight:400}
p{margin:0}
code{font:.92em ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink)}
.wrap{width:100%;max-width:1240px;margin:0 auto;padding-left:var(--gutter);padding-right:var(--gutter)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
:focus-visible{outline:2px solid var(--cyan);outline-offset:4px;border-radius:2px;box-shadow:0 0 12px rgba(var(--cyan-rgb),.6)}

.top{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;padding-top:22px;padding-bottom:6px}
.mark{font:400 1.2rem/1 var(--display);letter-spacing:.02em;text-decoration:none;color:#DDF9FF;text-shadow:0 0 6px var(--cyan),0 0 16px rgba(var(--cyan-rgb),.7),0 0 34px rgba(var(--cyan-rgb),.3)}
.mark:hover{color:#fff}
.top-link{font:500 .875rem/1 var(--text);letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:var(--ink-dim)}
.top-link:hover{color:var(--ink);text-decoration:underline}

.stage{position:relative;z-index:2;overflow-x:clip;background:radial-gradient(120% 80% at 50% -10%,#150E28 0%,var(--bg) 60%);color:var(--ink)}
.stage .scene{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:40px clamp(32px,5vw,80px);padding-top:clamp(40px,7vh,84px);padding-bottom:clamp(120px,22vh,220px);min-height:calc(72svh - 60px);align-content:start}
.horizon{position:absolute;inset:auto 0 0 0;height:min(34vh,280px);pointer-events:none;background:linear-gradient(0deg,rgba(var(--tube-rgb,var(--cyan-rgb)),.20) 0%,rgba(var(--tube-rgb,var(--cyan-rgb)),.06) 45%,rgba(var(--tube-rgb,var(--cyan-rgb)),0) 100%)}

.handle{font-family:var(--display);font-weight:400;font-size:clamp(2.6rem,7.4vw,5.6rem);line-height:1.02;letter-spacing:.005em;overflow-wrap:break-word;max-width:16ch;color:#FFE3F8;text-shadow:0 0 1px rgba(255,255,255,.7),0 0 8px var(--magenta),0 0 24px var(--magenta),0 0 64px rgba(var(--magenta-rgb),.55);padding-bottom:.04em;animation:ignite 1.4s steps(1,end) 1}
.handle.did{font-size:clamp(1.5rem,4.2vw,3.2rem);max-width:none;overflow-wrap:anywhere}
@keyframes ignite{0%{opacity:.25}6%{opacity:.9}9%{opacity:.35}12%{opacity:1}30%{opacity:1}33%{opacity:.6}35%{opacity:1}100%{opacity:1}}
.who{margin-top:clamp(18px,3vh,30px);display:grid;gap:6px;max-width:var(--measure)}
.name{font:600 clamp(1.35rem,2.2vw,1.7rem)/1.2 var(--text);letter-spacing:-.01em}
.headline{font-size:1.08rem;color:var(--ink-body)}
.bio{margin-top:18px;max-width:var(--measure);white-space:pre-line;color:var(--ink-body)}
.bio.clamp{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;overflow:hidden}
details.more>summary{list-style:none;cursor:pointer}
details.more>summary::-webkit-details-marker{display:none}
details.more>summary .cta{display:inline-block;margin-top:8px;font:500 .8rem/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);border-bottom:1px solid currentColor;padding-bottom:3px}
details.more[open]>summary .bio{display:none}
details.more[open]>summary .cta{display:none}
details.more[open]>.bio{margin-top:18px}

.readout{align-self:start;display:grid;grid-template-columns:auto 1fr;gap:10px 18px;margin:0;font-size:.92rem;padding-top:clamp(12px,2vh,26px);border-top:1px solid rgba(255,255,255,.14)}
.readout dt{font:500 .7rem/1.6 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim)}
.readout dd{margin:0;color:var(--ink);overflow-wrap:anywhere;line-height:1.5}
.readout dd.num{font-weight:600;color:#BDF4FF}
.readout .warn{grid-column:1/-1;display:flex;gap:8px;align-items:flex-start;color:var(--amber);font-size:.875rem;padding-top:6px}
.readout .warn svg{flex:none;margin-top:3px}

.actor{position:absolute;right:max(var(--gutter),calc((100% - 1240px) / 2 + var(--gutter)));bottom:0;z-index:4;margin:0;width:clamp(96px,12vw,168px);aspect-ratio:3/4;transform:translateY(1px)}
.actor img,.actor .blank{display:block;width:100%;height:100%;object-fit:cover;border-radius:4px 4px 0 0;border:1px solid rgba(var(--tube-rgb,var(--cyan-rgb)),.7);border-bottom:0;box-shadow:0 0 0 1px rgba(var(--tube-rgb,var(--cyan-rgb)),.15),0 0 28px rgba(var(--tube-rgb,var(--cyan-rgb)),.35)}
.actor .blank{background:linear-gradient(180deg,#1A1430,#0B0916)}

.cues{list-style:none;margin:0;padding:0;position:relative;z-index:1}
.cue,.utility,.record{position:relative;background:var(--surface);color:var(--ink);animation:raise .8s var(--ease) both;animation-delay:calc(min(var(--i,0) * 80ms, 640ms) + 120ms)}
.cue::before,.utility::before,.record::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:rgb(var(--tube-rgb));box-shadow:0 0 6px rgb(var(--tube-rgb)),0 0 18px rgba(var(--tube-rgb),.7),0 0 48px rgba(var(--tube-rgb),.45);z-index:2}
.cue::after,.utility::after,.record::after{content:"";position:absolute;inset:0 0 auto 0;height:180px;background:linear-gradient(180deg,rgba(var(--tube-rgb),.16) 0%,rgba(var(--tube-rgb),.04) 55%,rgba(var(--tube-rgb),0) 100%);pointer-events:none}
.cue.unlisted::before{background:repeating-linear-gradient(90deg,rgb(var(--tube-rgb)) 0 18px,transparent 18px 26px)}
@keyframes raise{from{filter:brightness(.45)}to{filter:brightness(1)}}
.cue>a{position:relative;display:block;color:inherit;text-decoration:none;z-index:1}
.cue>a .hold{position:absolute;inset:0;background:rgba(var(--tube-rgb),.07);opacity:0;transition:opacity 180ms ease-out;pointer-events:none}
.cue>a:hover .hold,.cue>a:focus-visible .hold{opacity:1}
.cue>a:active .hold{opacity:1;background:rgba(0,0,0,.22)}
.cue>a:focus-visible{outline:2px solid rgb(var(--tube-rgb));outline-offset:-10px;box-shadow:none}
.cue .wrap{position:relative;display:grid;grid-template-columns:minmax(0,7fr) minmax(0,8fr) auto;gap:10px clamp(24px,4vw,56px);align-items:center;padding-top:46px;padding-bottom:40px;min-height:150px}
.cue .lead{display:flex;align-items:baseline;gap:18px;min-width:0}
.cue .rank{font:500 .82rem/1 var(--text);letter-spacing:.1em;color:rgb(var(--tube-rgb));flex:none;min-width:2ch}
.cue .app{font-family:var(--display);font-weight:400;font-size:clamp(1.7rem,3vw,2.4rem);line-height:1;letter-spacing:.01em;overflow-wrap:break-word;color:var(--tube-ink);text-shadow:0 0 1px rgba(255,255,255,.5),0 0 6px rgb(var(--tube-rgb)),0 0 18px rgba(var(--tube-rgb),.6),0 0 40px rgba(var(--tube-rgb),.3);transition:text-shadow 180ms ease-out}
.cue>a:hover .app{text-shadow:0 0 1px rgba(255,255,255,.8),0 0 8px rgb(var(--tube-rgb)),0 0 26px rgba(var(--tube-rgb),.85),0 0 60px rgba(var(--tube-rgb),.45)}
.cue .tag{display:inline-block;vertical-align:.35em;margin-left:14px;font:600 .66rem/1 var(--text);letter-spacing:.14em;text-transform:uppercase;padding:5px 8px 4px;border:1px solid rgb(var(--tube-rgb));color:rgb(var(--tube-rgb));border-radius:2px;text-shadow:none}
.cue .about{min-width:0;display:grid;gap:6px}
.cue .blurb{font-size:1rem;color:var(--ink-body)}
.cue .note{font-size:.95rem;color:var(--ink-2);white-space:pre-line;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.cue .evidence{font:500 .72rem/1.7 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2);overflow-wrap:anywhere}
.cue .evidence b{font-weight:600;color:var(--ink)}
.cue .go{display:inline-flex;align-items:center;gap:10px;font:600 .95rem/1 var(--text);letter-spacing:.02em;white-space:nowrap;color:var(--ink);padding:14px 0}
.cue .go .arrow{color:rgb(var(--tube-rgb));transition:transform 180ms var(--ease)}
.cue>a:hover .go .arrow{transform:translateX(6px)}

.utility .wrap{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px 48px;align-items:center;padding-top:64px;padding-bottom:60px}
.utility h2{font-family:var(--display);font-weight:400;font-size:clamp(1.5rem,2.4vw,2rem);line-height:1;letter-spacing:.01em;color:var(--tube-ink);text-shadow:0 0 1px rgba(255,255,255,.5),0 0 6px rgb(var(--tube-rgb)),0 0 18px rgba(var(--tube-rgb),.6),0 0 40px rgba(var(--tube-rgb),.3)}
.utility p{margin-top:10px;color:var(--ink-body);max-width:52ch}
.actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;position:relative}
.btn{display:inline-flex;align-items:center;gap:10px;font:600 .95rem/1 var(--text);letter-spacing:.02em;text-decoration:none;padding:15px 22px;border-radius:4px;border:1.5px solid transparent;transition:transform 160ms var(--ease),box-shadow 160ms var(--ease),background-color 160ms}
.btn:active{transform:translateY(1px)}
.btn.primary{color:var(--ink-on-neon);background:var(--magenta);border-color:#FF8AE6;box-shadow:0 0 14px rgba(var(--magenta-rgb),.55),0 0 40px rgba(var(--magenta-rgb),.25)}
.btn.primary:hover{background:#FF63E0;box-shadow:0 0 18px rgba(var(--magenta-rgb),.75),0 0 56px rgba(var(--magenta-rgb),.35)}
.btn.secondary{color:#BDF4FF;border-color:var(--cyan);background:rgba(var(--cyan-rgb),.06);box-shadow:0 0 12px rgba(var(--cyan-rgb),.3),inset 0 0 14px rgba(var(--cyan-rgb),.08)}
.btn.secondary:hover{background:rgba(var(--cyan-rgb),.14);box-shadow:0 0 18px rgba(var(--cyan-rgb),.5),inset 0 0 14px rgba(var(--cyan-rgb),.12)}
.btn:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
.utility .also{font:500 .875rem/1 var(--text);letter-spacing:.06em;color:var(--ink-dim);text-decoration:underline;text-underline-offset:.22em;padding:14px 4px}
.utility .also:hover{color:var(--ink)}

.record{flex:1}
.record .wrap{position:relative;padding-top:72px;padding-bottom:56px;display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:40px clamp(32px,5vw,80px)}
.record h2{font-family:var(--display);font-weight:400;font-size:1.5rem;line-height:1;letter-spacing:.01em;margin-bottom:18px;color:var(--tube-ink);text-shadow:0 0 6px rgba(var(--tube-rgb),.7),0 0 18px rgba(var(--tube-rgb),.35)}
.record .nsids{list-style:none;margin:0;padding:0;columns:2;column-gap:32px;font-size:.875rem;line-height:1.7;color:var(--ink-body)}
.record .nsids li{break-inside:avoid;overflow-wrap:anywhere;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.record .how{font-size:.95rem;color:var(--ink-dim);max-width:var(--measure)}
.record .how p+p{margin-top:12px}
.record .how a{color:#BDF4FF}
.record dl{margin:18px 0 0;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:.875rem}
.record dt{font:500 .68rem/1.7 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim)}
.record dd{margin:0;overflow-wrap:anywhere;color:var(--ink-body)}
.record .credit{grid-column:1/-1;padding-top:26px;margin-top:8px;border-top:1px solid rgba(255,255,255,.1);font-size:.875rem;color:var(--ink-dim);display:flex;flex-wrap:wrap;gap:6px 24px;justify-content:space-between}
.record .credit a{color:var(--ink)}

.lookup{display:flex;gap:10px;align-items:stretch;max-width:640px;margin-top:clamp(28px,5vh,44px)}
.lookup label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.lookup input{flex:1;min-width:0;font:500 1.05rem/1 var(--text);letter-spacing:.01em;padding:16px 18px;color:var(--ink);background:rgba(13,10,23,.85);border:1.5px solid rgba(var(--cyan-rgb),.4);border-radius:4px;transition:border-color 160ms,box-shadow 160ms}
.lookup input::placeholder{color:#8F8AAE;letter-spacing:.04em}
.lookup input:hover{border-color:rgba(var(--cyan-rgb),.7)}
.lookup input:focus{outline:none;border-color:var(--cyan);box-shadow:0 0 0 3px rgba(var(--cyan-rgb),.18),0 0 18px rgba(var(--cyan-rgb),.45)}
.lookup button{font:600 .95rem/1 var(--text);letter-spacing:.02em;display:inline-flex;align-items:center;gap:10px;padding:0 22px;border:1.5px solid #FF8AE6;border-radius:4px;color:var(--ink-on-neon);cursor:pointer;background:var(--magenta);box-shadow:0 0 14px rgba(var(--magenta-rgb),.55),0 0 40px rgba(var(--magenta-rgb),.25);transition:box-shadow 160ms,background-color 160ms}
.lookup button:hover{background:#FF63E0;box-shadow:0 0 18px rgba(var(--magenta-rgb),.75),0 0 56px rgba(var(--magenta-rgb),.35)}
.lookup button:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
.home .stage .scene,.error .stage .scene{grid-template-columns:minmax(0,1fr);min-height:0;padding-bottom:clamp(64px,9vh,104px)}
.home .handle,.error .handle{text-wrap:balance}
.home .handle{font-size:clamp(3rem,9.5vw,5.6rem);max-width:none}
.lede{margin-top:clamp(18px,3vh,28px);font-size:clamp(1.1rem,1.6vw,1.3rem);color:var(--ink-body);max-width:var(--measure)}
.lede b{font-weight:600;color:var(--ink)}
.example .rank{visibility:hidden}
.example .app{font-size:clamp(1.5rem,2.4vw,2.2rem)}
.steps{margin:0;padding:0;list-style:none;display:grid;gap:14px;counter-reset:step}
.steps li{position:relative;padding-left:42px;font-size:.98rem;color:var(--ink-dim);max-width:var(--measure)}
.steps li::before{counter-increment:step;content:counter(step);position:absolute;left:0;top:1px;width:26px;height:26px;border:1.5px solid var(--cyan);color:#BDF4FF;border-radius:50%;display:grid;place-items:center;font:600 .78rem/1 var(--text);box-shadow:0 0 10px rgba(var(--cyan-rgb),.35)}
.steps b{color:var(--ink);font-weight:600}
.error .handle{font-size:clamp(2rem,5.8vw,4rem);max-width:22ch}

@media (max-width:860px){
  .stage .scene{grid-template-columns:minmax(0,1fr);gap:30px;min-height:auto;padding-bottom:64px}
  .readout{max-width:calc(100% - 150px);min-height:120px}
  .home .stage .scene,.error .stage .scene{padding-bottom:56px}
  .actor{width:clamp(88px,26vw,120px);right:var(--gutter)}
  .cue .wrap{grid-template-columns:minmax(0,1fr) auto;gap:10px 20px;padding-top:34px;padding-bottom:28px;min-height:0}
  .cue .lead{grid-column:1;grid-row:1;flex-wrap:wrap;gap:6px 14px}
  .cue .about{grid-column:1/-1;grid-row:2}
  .cue .go{grid-column:2;grid-row:1;align-self:center;padding:0}
  .cue .go span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .cue .go .arrow{width:28px;height:28px}
  .utility .wrap{grid-template-columns:minmax(0,1fr);gap:22px;padding-top:48px;padding-bottom:44px}
  .record .wrap{grid-template-columns:minmax(0,1fr);gap:32px;padding-top:56px}
  .record .nsids{columns:1}
  .lookup{flex-direction:column}
  .lookup button{padding:16px 22px;justify-content:center}
}
@media (max-width:480px){
  .readout{grid-template-columns:1fr;gap:2px 0;max-width:calc(100% - 130px)}
  .readout dt{margin-top:10px}
  .readout dd.num{margin-top:-2px}
  .cue .app{font-size:1.6rem}
  .cue .tag{display:block;margin:8px 0 0;width:max-content}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
}
@media print{
  body{background:#fff;color:#000}
  .horizon{display:none}
  .handle,.cue .app,.utility h2,.record h2,.mark{text-shadow:none;color:#000}
}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tilt+Neon&family=Saira:wght@400;500;600&display=swap">`;

interface LayoutOptions {
  title: string;
  description: string;
  bodyClass?: string;
  head?: string;
}

function layout(options: LayoutOptions, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(options.title)}</title>
<meta name="description" content="${e(options.description)}">
<meta name="theme-color" content="${BG}">
<meta property="og:title" content="${e(options.title)}">
<meta property="og:description" content="${e(options.description)}">
${options.head ?? ""}
${FONTS}
<style>${STYLES}</style>
</head>
<body class="${options.bodyClass ?? ""}">
${CONTRACT}
${body}
</body>
</html>
`;
}

function topBar(showLookup: boolean): string {
  return `<nav class="top wrap" aria-label="Site">
  <a class="mark" href="/">at-here</a>
  ${showLookup ? `<a class="top-link" href="/">Look up another</a>` : ""}
</nav>`;
}

function lookupForm(id: string): string {
  return `<form class="lookup" method="get" action="/" role="search">
  <label for="${id}">Handle or DID</label>
  <input id="${id}" name="q" type="text" placeholder="handle or did:plc:…" autocomplete="off" autocapitalize="none" spellcheck="false" required>
  <button type="submit">${SEARCH}<span>Look up</span></button>
</form>`;
}

function renderBio(bio: string): string {
  const long = bio.length > 360 || bio.split("\n").length > 6;
  if (!long) return `<p class="bio">${e(bio)}</p>`;
  return `<details class="more">
  <summary><p class="bio clamp">${e(bio)}</p><span class="cta">Full bio</span></summary>
  <p class="bio">${e(bio)}</p>
</details>`;
}

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function stageStyle(tube: string): string {
  return `--tube-rgb:${rgbTriplet(tube)}`;
}

function renderCue(app: CardApp, index: number, theme: BandTheme, fallbackName: string): string {
  const target = app.profileUrl ?? app.homepage;
  const action = app.profileUrl ? `Open ${app.name}` : `Visit ${app.name}`;
  const evidence = `<b>${pluralize(app.collections.length, "collection")}</b> · ${app.collections.map(e).join(" · ")}`;
  const rank = String(index + 1).padStart(2, "0");
  const inner = `<span class="hold" aria-hidden="true"></span>
  <div class="wrap">
    <div class="lead">
      <span class="rank" aria-hidden="true">${rank}</span>
      <h3 class="app">${breakable(app.name)}${app.known ? "" : `<span class="tag">Unlisted</span>`}</h3>
    </div>
    <div class="about">
      <p class="blurb">${app.blurb ? e(app.blurb) : `Writes records under ${e(app.name)} that at-here does not recognise yet.`}</p>
      ${app.description ? `<p class="note">${e(app.description)}</p>` : ""}
      <p class="evidence">${evidence}</p>
    </div>
    <span class="go"><span>${e(action)}</span>${ARROW}</span>
  </div>`;
  return `<li class="cue${app.known ? "" : " unlisted"}" style="${bandStyle(theme, index)}">
  <a href="${e(target)}" rel="noopener" aria-label="${e(action)}: ${e(fallbackName)}">${inner}</a>
</li>`;
}

function credit(): string {
  return `<div class="credit">
      <span>Contact cards for AT Protocol accounts. Built from public data only.</span>
      <span>Made by <a href="https://jamie.ideasasylum.com" rel="noopener">Jamie Lawrence</a> · <a href="https://github.com/ideasasylum/at-here" rel="noopener">Source</a></span>
    </div>`;
}

export function renderCard(card: Card, origin: string): string {
  const title = card.displayName ?? card.handle ?? card.did;
  const slug = encodeURIComponent(card.handle ?? card.did);
  const collectionCount = card.collections.length;
  const appCount = card.apps.length;
  const description = `${title} is on ${pluralize(appCount, "AT Protocol app")}: ${card.apps.map((a) => a.name).join(", ")}.`;

  const tubes = card.apps.map((_, i) => tubeFor(i, appCount));
  const cueThemes = tubes.map((tube) => themeFor(tube));
  const utilityTheme = themeFor(AMBER);
  const recordTheme = themeFor(WARM, RECORD_SURFACE);
  const firstTube = tubes[0] ?? CYAN;

  const actor = card.avatar
    ? `<figure class="actor"><img src="${e(card.avatar)}" alt="" width="168" height="224" decoding="async" fetchpriority="high"></figure>`
    : `<figure class="actor" aria-hidden="true"><span class="blank"></span></figure>`;

  const readout = `<dl class="readout">
    <dt>DID</dt><dd>${e(card.did)}</dd>
    <dt>PDS</dt><dd>${e(card.pdsHost)}</dd>
    <dt>Apps</dt><dd class="num">${appCount}</dd>
    <dt>Collections</dt><dd class="num">${collectionCount}</dd>
    ${card.handle && !card.handleVerified ? `<div class="warn">${WARN}<span>The DID document does not confirm this handle.</span></div>` : ""}
  </dl>`;

  const stage = `<header class="stage" style="${stageStyle(firstTube)}">
  ${topBar(true)}
  <div class="wrap scene">
    <div>
      <h1 class="handle${card.handle ? "" : " did"}">${breakable(card.handle ?? card.did)}</h1>
      <div class="who">
        ${card.displayName && card.displayName !== card.handle ? `<p class="name">${e(card.displayName)}</p>` : ""}
        ${card.headline ? `<p class="headline">${e(card.headline)}</p>` : ""}
      </div>
      ${card.description ? renderBio(card.description) : ""}
    </div>
    ${readout}
  </div>
  <div class="horizon" aria-hidden="true"></div>
  ${actor}
</header>`;

  const cues = `<main>
  <h2 class="sr">Where to find ${e(title)}</h2>
  <ol class="cues">
${card.apps.map((app, i) => renderCue(app, i, cueThemes[i], title)).join("\n")}
  </ol>
  <section class="utility" style="${bandStyle(utilityTheme, appCount)}" aria-labelledby="save">
    <div class="wrap">
      <div>
        <h2 id="save">Save this card</h2>
        <p>The same card as a contact file for your address book, or as JSON for your own tools.</p>
      </div>
      <div class="actions">
        <a class="btn primary" href="/${slug}.vcf" download>Download vCard${ARROW}</a>
        <a class="btn secondary" href="/${slug}.json">JSON</a>
        <a class="also" href="/">Look up another account</a>
      </div>
    </div>
  </section>
</main>`;

  const record = `<footer class="record" style="${bandStyle(recordTheme, appCount + 1)}">
  <div class="wrap">
    <div>
      <h2>Record collections</h2>
      <ul class="nsids">${card.collections.map((c) => `<li>${e(c)}</li>`).join("")}</ul>
    </div>
    <div class="how">
      <h2>How this card was made</h2>
      <p>at-here resolved the handle to its DID, read the DID document to find the personal data server, and asked that server which record collections the account has written to. Each collection name belongs to an app, so anything the account has written appears here, including apps at-here does not recognise.</p>
      <p>Reading an app without writing to it leaves no record. Deleted records leave their collection listed.</p>
      <dl>
        <dt>DID</dt><dd>${e(card.did)}</dd>
        <dt>PDS</dt><dd><a href="${e(card.pds)}" rel="noopener">${e(card.pds)}</a></dd>
      </dl>
    </div>
    ${credit()}
  </div>
</footer>`;

  return layout(
    {
      title: `${title} · at-here`,
      description,
      bodyClass: "card",
      head: `<link rel="alternate" type="text/vcard" href="${origin}/${slug}.vcf">
<link rel="alternate" type="application/json" href="${origin}/${slug}.json">
<link rel="canonical" href="${origin}/${slug}">`,
    },
    `${stage}\n${cues}\n${record}`,
  );
}

function exampleCue(blurb: string): string {
  return `<li class="cue example" style="${bandStyle(themeFor(CYAN), 0)}">
      <a href="/jamie.ideasasylum.com">
        <span class="hold" aria-hidden="true"></span>
        <div class="wrap">
          <div class="lead">
            <span class="rank" aria-hidden="true">01</span>
            <h3 class="app">${breakable("jamie.ideasasylum.com")}</h3>
          </div>
          <div class="about">
            <p class="blurb">${e(blurb)}</p>
            <p class="evidence"><b>Live</b> · refreshed from the network every five minutes</p>
          </div>
          <span class="go"><span>Open the card</span>${ARROW}</span>
        </div>
      </a>
    </li>`;
}

export function renderHome(): string {
  const recordTheme = themeFor(WARM, RECORD_SURFACE);
  const body = `<header class="stage" style="${stageStyle(CYAN)}">
  ${topBar(false)}
  <div class="wrap scene">
    <div>
      <h1 class="handle">Where to find anyone on the AT&nbsp;Protocol</h1>
      <p class="lede">Enter a handle or DID. at-here reads the network's own record and lists <b>every app the account can be found on</b>, with a vCard you can save.</p>
      ${lookupForm("q")}
    </div>
  </div>
  <div class="horizon" aria-hidden="true"></div>
</header>
<main>
  <ol class="cues">
    ${exampleCue("An example card: the person who made this.")}
  </ol>
</main>
<footer class="record" style="${bandStyle(recordTheme, 1)}">
  <div class="wrap">
    <div>
      <h2>How it works</h2>
      <ol class="steps">
        <li><b>Resolve the handle</b> to its DID through the Bluesky AppView, then DNS, then the well-known file.</li>
        <li><b>Read the DID document</b> to find the personal data server that hosts the account.</li>
        <li><b>Ask that server</b> which record collections the account has written. Each collection belongs to an app.</li>
        <li><b>Render the card</b> in three forms: this page, a vCard, and JSON. Add <code>.vcf</code> or <code>.json</code> to any card address.</li>
      </ol>
    </div>
    <div class="how">
      <h2>What it will not show</h2>
      <p>Presence comes from written records only. Reading an app without writing to it leaves no trace, and an app that stores nothing in the repository cannot appear. Nothing is stored on this side beyond a five-minute cache: every card is rebuilt from public data.</p>
    </div>
    ${credit()}
  </div>
</footer>`;
  return layout(
    { title: "at-here", description: "Contact cards for AT Protocol accounts: every app an account can be found on.", bodyClass: "home" },
    body,
  );
}

const ERROR_TITLES: Record<number, string> = {
  400: "That isn't a handle or a DID",
  404: "Nobody answers at that address",
  502: "The network didn't answer",
};

export function renderError(status: number, message: string): string {
  const recordTheme = themeFor(WARM, RECORD_SURFACE);
  const title = ERROR_TITLES[status] ?? "Something went wrong";
  const body = `<header class="stage" style="${stageStyle(CYAN)}">
  ${topBar(false)}
  <div class="wrap scene">
    <div>
      <h1 class="handle">${e(title)}</h1>
      <p class="lede">${e(message)}${status === 502 ? " Try again in a moment." : ""}</p>
      ${lookupForm("q")}
    </div>
  </div>
  <div class="horizon" aria-hidden="true"></div>
</header>
<main>
  <ol class="cues">
    ${exampleCue("Or open the example card")}
  </ol>
</main>
<footer class="record" style="${bandStyle(recordTheme, 1)}">
  <div class="wrap">
    <div class="how">
      <h2>What works here</h2>
      <p>A handle such as <code>alice.bsky.social</code>, or a DID such as <code>did:plc:…</code> or <code>did:web:…</code>. Add <code>.vcf</code> or <code>.json</code> to any card address for the other formats.</p>
    </div>
    ${credit()}
  </div>
</footer>`;
  return layout({ title: `${title} · at-here`, description: message, bodyClass: "error" }, body);
}
