import type { Card } from "../card";

const encoder = new TextEncoder();

export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function foldLine(line: string, maxOctets = 75): string {
  const out: string[] = [];
  let current = "";
  let currentOctets = 0;
  let limit = maxOctets;
  for (const char of line) {
    const octets = encoder.encode(char).length;
    if (currentOctets + octets > limit) {
      out.push(current);
      current = " ";
      currentOctets = 1;
      limit = maxOctets;
    }
    current += char;
    currentOctets += octets;
  }
  out.push(current);
  return out.join("\r\n");
}

function property(name: string, value: string | null | undefined, params: Record<string, string> = {}): string | null {
  if (value === null || value === undefined || value === "") return null;
  const paramText = Object.entries(params)
    .map(([key, val]) => `;${key}=${val}`)
    .join("");
  return foldLine(`${name}${paramText}:${value}`);
}

export function renderVCard(card: Card, sourceUrl: string): string {
  const fullName = card.displayName ?? card.handle ?? card.did;
  const lines: (string | null)[] = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    property("PRODID", "-//at-here//AT Protocol contact card//EN"),
    property("UID", card.did),
    property("SOURCE", sourceUrl),
    property("REV", card.generatedAt.replace(/[-:]|\.\d+/g, "")),
    property("FN", escapeText(fullName)),
    card.givenName || card.familyName
      ? property("N", `${escapeText(card.familyName ?? "")};${escapeText(card.givenName ?? "")};;;`)
      : null,
    property("NICKNAME", card.handle ? escapeText(card.handle) : null),
    property("PHOTO", card.avatar, { MEDIATYPE: "image/jpeg" }),
    property("TITLE", card.headline ? escapeText(card.headline) : null),
    property("NOTE", card.description ? escapeText(card.description) : null),
    property("X-ATPROTO-DID", card.did),
    property("X-ATPROTO-PDS", card.pds),
  ];

  let item = 1;
  for (const app of card.apps) {
    if (!app.profileUrl) continue;
    lines.push(property(`item${item}.URL`, app.profileUrl));
    lines.push(property(`item${item}.X-ABLabel`, escapeText(app.name)));
    lines.push(
      property("X-SOCIALPROFILE", app.profileUrl, {
        TYPE: app.id,
        ...(card.handle ? { "X-USER": card.handle } : {}),
      }),
    );
    item += 1;
  }

  lines.push("END:VCARD");
  return lines.filter((line): line is string => line !== null).join("\r\n") + "\r\n";
}
