import { afterEach, describe, expect, it, vi } from "vitest";
import { classifyIdentifier, handleFromDocument, pdsEndpoint, resolveIdentity, ResolutionError } from "../src/atproto";

const DID = "did:plc:wu2l6vx2ahoo7v56gyig3vot";
const didDocument = {
  id: DID,
  alsoKnownAs: [`at://jamie.ideasasylum.com`],
  service: [{ id: "#atproto_pds", type: "AtprotoPersonalDataServer", serviceEndpoint: "https://eurosky.social" }],
};

function mockFetch(routes: Record<string, unknown>) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    for (const [prefix, body] of Object.entries(routes)) {
      if (url.startsWith(prefix)) {
        return body === null
          ? new Response("not found", { status: 404 })
          : new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
      }
    }
    return new Response("unexpected " + url, { status: 500 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("classifyIdentifier", () => {
  it("recognises handles and DIDs", () => {
    expect(classifyIdentifier("jamie.ideasasylum.com")).toBe("handle");
    expect(classifyIdentifier("did:plc:wu2l6vx2ahoo7v56gyig3vot")).toBe("did");
    expect(classifyIdentifier("did:web:example.com")).toBe("did");
    expect(classifyIdentifier("not a handle")).toBeNull();
    expect(classifyIdentifier("nodots")).toBeNull();
    expect(classifyIdentifier("")).toBeNull();
  });
});

describe("DID document helpers", () => {
  it("extracts the PDS endpoint and handle", () => {
    expect(pdsEndpoint(didDocument)).toBe("https://eurosky.social");
    expect(handleFromDocument(didDocument)).toBe("jamie.ideasasylum.com");
    expect(pdsEndpoint({ id: DID })).toBeNull();
  });
});

describe("resolveIdentity", () => {
  it("resolves a handle through the AppView, PLC directory and PDS", async () => {
    const fetchMock = mockFetch({
      "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle": { did: DID },
      "https://plc.directory/": didDocument,
      "https://eurosky.social/xrpc/com.atproto.repo.describeRepo": {
        collections: ["sh.tangled.actor.profile", "app.bsky.actor.profile"],
      },
    });

    const identity = await resolveIdentity("Jamie.IdeasAsylum.com");
    expect(identity.did).toBe(DID);
    expect(identity.handle).toBe("jamie.ideasasylum.com");
    expect(identity.handleVerified).toBe(true);
    expect(identity.pds).toBe("https://eurosky.social");
    expect(identity.collections).toEqual(["app.bsky.actor.profile", "sh.tangled.actor.profile"]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("falls back to DNS when the AppView cannot resolve the handle", async () => {
    mockFetch({
      "https://public.api.bsky.app/": null,
      "https://cloudflare-dns.com/dns-query": { Answer: [{ data: `"did=${DID}"` }] },
      "https://plc.directory/": didDocument,
      "https://eurosky.social/xrpc/com.atproto.repo.describeRepo": { collections: [] },
    });
    const identity = await resolveIdentity("jamie.ideasasylum.com");
    expect(identity.did).toBe(DID);
  });

  it("flags a handle the DID document does not claim", async () => {
    mockFetch({
      "https://public.api.bsky.app/": { did: DID },
      "https://plc.directory/": { ...didDocument, alsoKnownAs: ["at://someone-else.example"] },
      "https://eurosky.social/xrpc/com.atproto.repo.describeRepo": { collections: [] },
    });
    const identity = await resolveIdentity("jamie.ideasasylum.com");
    expect(identity.handleVerified).toBe(false);
  });

  it("uses the DID document handle when given a DID", async () => {
    mockFetch({
      "https://plc.directory/": didDocument,
      "https://eurosky.social/xrpc/com.atproto.repo.describeRepo": { collections: [] },
    });
    const identity = await resolveIdentity(DID);
    expect(identity.handle).toBe("jamie.ideasasylum.com");
    expect(identity.handleVerified).toBe(true);
  });

  it("throws a 404 when nothing can resolve the handle", async () => {
    mockFetch({ "https://public.api.bsky.app/": null, "https://cloudflare-dns.com/": null, "https://nobody.example/": null });
    await expect(resolveIdentity("nobody.example")).rejects.toBeInstanceOf(ResolutionError);
  });

  it("rejects unsupported DID methods", async () => {
    await expect(resolveIdentity("did:key:zabc")).rejects.toMatchObject({ status: 400 });
  });
});
