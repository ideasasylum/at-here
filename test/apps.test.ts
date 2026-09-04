import { describe, expect, it } from "vitest";
import { detectApps, nsidAuthorityDomain } from "../src/apps";

const subject = { did: "did:plc:abc", handle: "jamie.ideasasylum.com" };

describe("detectApps", () => {
  it("groups collections by app, known apps first, busiest first, then by name", () => {
    const apps = detectApps(
      [
        "sh.tangled.actor.profile",
        "sh.tangled.graph.follow",
        "app.bsky.feed.post",
        "app.bsky.actor.profile",
        "id.sifa.profile.self",
        "computer.example.thing",
        "computer.example.other",
        "zz.another.thing",
      ],
      subject,
    );
    expect(apps.map((a) => a.id)).toEqual([
      "bluesky",
      "tangled",
      "sifa",
      "unknown:example.computer",
      "unknown:another.zz",
    ]);
    expect(apps[0].collections).toEqual(["app.bsky.feed.post", "app.bsky.actor.profile"]);
  });

  it("prefers the longest matching prefix", () => {
    const apps = detectApps(["app.bsky.feed.post", "app.bsky.feed.generator", "app.bsky.labeler.service"], subject);
    expect(apps.map((a) => a.id).sort()).toEqual(["bluesky", "bluesky-feeds", "bluesky-labeler"]);
  });

  it("builds profile URLs from the handle, falling back to the DID", () => {
    expect(detectApps(["app.bsky.actor.profile"], subject)[0].profileUrl).toBe(
      "https://bsky.app/profile/jamie.ideasasylum.com",
    );
    expect(detectApps(["app.bsky.actor.profile"], { did: "did:plc:abc", handle: null })[0].profileUrl).toBe(
      "https://bsky.app/profile/did:plc:abc",
    );
  });

  it("describes unknown apps by their reversed NSID authority", () => {
    const [app] = detectApps(["computer.aetheros.settings"], subject);
    expect(app.known).toBe(true);
    const [unknown] = detectApps(["zz.example.thing"], subject);
    expect(unknown.known).toBe(false);
    expect(unknown.name).toBe("example.zz");
    expect(unknown.homepage).toBe("https://example.zz");
  });
});

describe("nsidAuthorityDomain", () => {
  it("reverses the first two segments", () => {
    expect(nsidAuthorityDomain("fyi.unravel.frontpage.post")).toBe("unravel.fyi");
    expect(nsidAuthorityDomain("id.sifa.profile.self")).toBe("sifa.id");
  });
});
