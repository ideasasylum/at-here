export interface Subject {
  did: string;
  handle: string | null;
}

export interface AppDefinition {
  id: string;
  name: string;
  blurb: string;
  homepage: string;
  prefixes: string[];
  profileUrl?: (subject: Subject) => string;
  profileCollection?: string;
}

export interface DetectedApp {
  id: string;
  name: string;
  blurb: string | null;
  homepage: string;
  profileUrl: string | null;
  profileCollection: string | null;
  collections: string[];
  known: boolean;
}

const who = (subject: Subject) => subject.handle ?? subject.did;

export const APPS: AppDefinition[] = [
  {
    id: "bluesky",
    name: "Bluesky",
    blurb: "Microblogging",
    homepage: "https://bsky.app",
    prefixes: ["app.bsky.", "chat.bsky."],
    profileUrl: (s) => `https://bsky.app/profile/${who(s)}`,
    profileCollection: "app.bsky.actor.profile",
  },
  {
    id: "bluesky-feeds",
    name: "Bluesky custom feeds",
    blurb: "Publishes feed generators",
    homepage: "https://bsky.app",
    prefixes: ["app.bsky.feed.generator"],
    profileUrl: (s) => `https://bsky.app/profile/${who(s)}/feed`,
  },
  {
    id: "bluesky-labeler",
    name: "Bluesky labeler",
    blurb: "Runs a moderation labeler",
    homepage: "https://bsky.app",
    prefixes: ["app.bsky.labeler."],
    profileUrl: (s) => `https://bsky.app/profile/${who(s)}`,
  },
  {
    id: "tangled",
    name: "Tangled",
    blurb: "Git hosting and code collaboration",
    homepage: "https://tangled.org",
    prefixes: ["sh.tangled."],
    profileUrl: (s) => `https://tangled.org/@${who(s)}`,
    profileCollection: "sh.tangled.actor.profile",
  },
  {
    id: "sifa",
    name: "Sifa",
    blurb: "Professional profile and CV",
    homepage: "https://sifa.id",
    prefixes: ["id.sifa."],
    profileUrl: (s) => `https://sifa.id/p/${who(s)}`,
    profileCollection: "id.sifa.profile.self",
  },
  {
    id: "frontpage",
    name: "Frontpage",
    blurb: "Link aggregator",
    homepage: "https://frontpage.fyi",
    prefixes: ["fyi.unravel.frontpage."],
    profileUrl: (s) => `https://frontpage.fyi/profile/${who(s)}`,
  },
  {
    id: "whitewind",
    name: "WhiteWind",
    blurb: "Long-form blogging",
    homepage: "https://whtwnd.com",
    prefixes: ["com.whtwnd."],
    profileUrl: (s) => `https://whtwnd.com/${who(s)}`,
  },
  {
    id: "leaflet",
    name: "Leaflet",
    blurb: "Publishing and newsletters",
    homepage: "https://leaflet.pub",
    prefixes: ["pub.leaflet."],
  },
  {
    id: "standard-site",
    name: "Standard.site",
    blurb: "Open publishing schema used by blogs and readers",
    homepage: "https://standard.site",
    prefixes: ["site.standard."],
  },
  {
    id: "grain",
    name: "Grain",
    blurb: "Photo sharing",
    homepage: "https://grain.social",
    prefixes: ["social.grain."],
    profileUrl: (s) => `https://grain.social/profile/${who(s)}`,
  },
  {
    id: "flashes",
    name: "Flashes",
    blurb: "Photo sharing",
    homepage: "https://flashes.blue",
    prefixes: ["blue.flashes."],
  },
  {
    id: "bookhive",
    name: "BookHive",
    blurb: "Book tracking and reviews",
    homepage: "https://bookhive.buzz",
    prefixes: ["buzz.bookhive."],
    profileUrl: (s) => `https://bookhive.buzz/profile/${who(s)}`,
  },
  {
    id: "skylights",
    name: "Skylights",
    blurb: "Reviews of books, films and more",
    homepage: "https://skylights.my",
    prefixes: ["my.skylights."],
    profileUrl: (s) => `https://skylights.my/profile/${who(s)}`,
  },
  {
    id: "popsky",
    name: "Popsky",
    blurb: "Film and TV reviews",
    homepage: "https://popsky.social",
    prefixes: ["app.popsky."],
    profileUrl: (s) => `https://popsky.social/profile/${who(s)}`,
  },
  {
    id: "rocksky",
    name: "Rocksky",
    blurb: "Music scrobbling",
    homepage: "https://rocksky.app",
    prefixes: ["app.rocksky."],
    profileUrl: (s) => `https://rocksky.app/profile/${who(s)}`,
  },
  {
    id: "teal",
    name: "Teal",
    blurb: "Music listening history",
    homepage: "https://teal.fm",
    prefixes: ["fm.teal."],
  },
  {
    id: "smokesignal",
    name: "Smoke Signal",
    blurb: "Events and RSVPs",
    homepage: "https://smokesignal.events",
    prefixes: ["events.smokesignal."],
    profileUrl: (s) => `https://smokesignal.events/${who(s)}`,
  },
  {
    id: "linkat",
    name: "Linkat",
    blurb: "Link-in-bio page",
    homepage: "https://linkat.blue",
    prefixes: ["blue.linkat."],
    profileUrl: (s) => `https://linkat.blue/${who(s)}`,
  },
  {
    id: "pinksea",
    name: "PinkSea",
    blurb: "Oekaki drawing board",
    homepage: "https://pinksea.art",
    prefixes: ["com.shinolabs.pinksea."],
    profileUrl: (s) => `https://pinksea.art/${s.did}`,
  },
  {
    id: "streamplace",
    name: "Streamplace",
    blurb: "Live video streaming",
    homepage: "https://stream.place",
    prefixes: ["place.stream."],
    profileUrl: (s) => `https://stream.place/${who(s)}`,
  },
  {
    id: "pastesphere",
    name: "Pastesphere",
    blurb: "Code and text snippets",
    homepage: "https://pastesphere.link",
    prefixes: ["link.pastesphere."],
    profileUrl: (s) => `https://pastesphere.link/user/${who(s)}`,
  },
  {
    id: "atfile",
    name: "ATFile",
    blurb: "File storage in your repo",
    homepage: "https://github.com/ziodotsh/atfile",
    prefixes: ["blue.zio.atfile."],
  },
  {
    id: "psky",
    name: "Psky",
    blurb: "Chat rooms",
    homepage: "https://psky.social",
    prefixes: ["social.psky."],
  },
  {
    id: "semble",
    name: "Semble",
    blurb: "Collaborative link collections",
    homepage: "https://semble.so",
    prefixes: ["network.cosmik."],
  },
  {
    id: "germ",
    name: "Germ",
    blurb: "Encrypted messaging",
    homepage: "https://germnetwork.com",
    prefixes: ["com.germnetwork."],
  },
  {
    id: "aetheros",
    name: "Aether OS",
    blurb: "Retro desktop for the atmosphere",
    homepage: "https://www.aetheros.computer",
    prefixes: ["computer.aetheros."],
  },
  {
    id: "statusphere",
    name: "Statusphere",
    blurb: "The AT Protocol example app",
    homepage: "https://atproto.com/guides/applications",
    prefixes: ["xyz.statusphere."],
  },
  {
    id: "lexicons",
    name: "Lexicon publisher",
    blurb: "Publishes schemas for other apps to use",
    homepage: "https://atproto.com/specs/lexicon",
    prefixes: ["com.atproto.lexicon.schema"],
  },
];

function matchingApp(collection: string): AppDefinition | null {
  let best: AppDefinition | null = null;
  let bestLength = -1;
  for (const app of APPS) {
    for (const prefix of app.prefixes) {
      if (collection.startsWith(prefix) && prefix.length > bestLength) {
        best = app;
        bestLength = prefix.length;
      }
    }
  }
  return best;
}

export function nsidAuthorityDomain(collection: string): string {
  const segments = collection.split(".");
  return segments.slice(0, 2).reverse().join(".");
}

export function detectApps(collections: string[], subject: Subject): DetectedApp[] {
  const detected = new Map<string, DetectedApp>();

  for (const collection of collections) {
    const app = matchingApp(collection);
    const key = app ? app.id : `unknown:${nsidAuthorityDomain(collection)}`;
    let entry = detected.get(key);
    if (!entry) {
      entry = app
        ? {
            id: app.id,
            name: app.name,
            blurb: app.blurb,
            homepage: app.homepage,
            profileUrl: app.profileUrl?.(subject) ?? null,
            profileCollection: app.profileCollection ?? null,
            collections: [],
            known: true,
          }
        : {
            id: key,
            name: nsidAuthorityDomain(collection),
            blurb: null,
            homepage: `https://${nsidAuthorityDomain(collection)}`,
            profileUrl: null,
            profileCollection: null,
            collections: [],
            known: false,
          };
      detected.set(key, entry);
    }
    entry.collections.push(collection);
  }

  return [...detected.values()].sort((a, b) => {
    if (a.known !== b.known) return a.known ? -1 : 1;
    if (a.collections.length !== b.collections.length) return b.collections.length - a.collections.length;
    return a.name.localeCompare(b.name);
  });
}
