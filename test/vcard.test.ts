import { describe, expect, it } from "vitest";
import type { Card } from "../src/card";
import { escapeText, foldLine, renderVCard } from "../src/render/vcard";

const card: Card = {
  did: "did:plc:abc",
  handle: "jamie.ideasasylum.com",
  handleVerified: true,
  pds: "https://eurosky.social",
  pdsHost: "eurosky.social",
  displayName: "jamie",
  givenName: "Jamie",
  familyName: "Lawrence",
  headline: "CTO, Podia",
  description: "Line one\nLine two; with, punctuation",
  avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:abc/cid@jpeg",
  apps: [
    {
      id: "bluesky",
      name: "Bluesky",
      blurb: "Microblogging",
      homepage: "https://bsky.app",
      profileUrl: "https://bsky.app/profile/jamie.ideasasylum.com",
      profileCollection: "app.bsky.actor.profile",
      collections: ["app.bsky.actor.profile"],
      known: true,
      description: null,
    },
    {
      id: "leaflet",
      name: "Leaflet",
      blurb: "Publishing",
      homepage: "https://leaflet.pub",
      profileUrl: null,
      profileCollection: null,
      collections: ["pub.leaflet.document"],
      known: true,
      description: null,
    },
  ],
  collections: ["app.bsky.actor.profile", "pub.leaflet.document"],
  generatedAt: "2026-09-04T10:00:00.000Z",
};

describe("renderVCard", () => {
  const output = renderVCard(card, "https://at-here.example/jamie.ideasasylum.com.vcf");
  const lines = output.replace(/\r\n /g, "").split("\r\n");

  it("produces a vCard 4.0 envelope with CRLF line endings", () => {
    expect(lines[0]).toBe("BEGIN:VCARD");
    expect(lines[1]).toBe("VERSION:4.0");
    expect(lines.at(-2)).toBe("END:VCARD");
    expect(output.endsWith("\r\n")).toBe(true);
    expect(output).not.toMatch(/[^\r]\n/);
  });

  it("includes identity fields", () => {
    expect(lines).toContain("FN:jamie");
    expect(lines).toContain("N:Lawrence;Jamie;;;");
    expect(lines).toContain("NICKNAME:jamie.ideasasylum.com");
    expect(lines).toContain("UID:did:plc:abc");
    expect(lines).toContain("TITLE:CTO\\, Podia");
    expect(lines).toContain("NOTE:Line one\\nLine two\\; with\\, punctuation");
    expect(lines).toContain("REV:20260904T100000Z");
  });

  it("adds a URL per app that has a profile page", () => {
    expect(lines).toContain("item1.URL:https://bsky.app/profile/jamie.ideasasylum.com");
    expect(lines).toContain("item1.X-ABLabel:Bluesky");
    expect(lines).toContain(
      "X-SOCIALPROFILE;TYPE=bluesky;X-USER=jamie.ideasasylum.com:https://bsky.app/profile/jamie.ideasasylum.com",
    );
    expect(output).not.toContain("item2.");
  });
});

describe("escapeText", () => {
  it("escapes backslashes, newlines, semicolons and commas", () => {
    expect(escapeText("a\\b\nc;d,e")).toBe("a\\\\b\\nc\\;d\\,e");
  });
});

describe("foldLine", () => {
  it("leaves short lines alone", () => {
    expect(foldLine("FN:jamie")).toBe("FN:jamie");
  });

  it("folds at 75 octets with a leading space continuation", () => {
    const folded = foldLine("NOTE:" + "x".repeat(100));
    const parts = folded.split("\r\n");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toHaveLength(75);
    expect(parts[1].startsWith(" ")).toBe(true);
    expect(folded.replace(/\r\n /g, "")).toBe("NOTE:" + "x".repeat(100));
  });

  it("counts multibyte characters by octet", () => {
    const folded = foldLine("NOTE:" + "é".repeat(60));
    for (const part of folded.split("\r\n")) {
      expect(new TextEncoder().encode(part).length).toBeLessThanOrEqual(75);
    }
  });
});
