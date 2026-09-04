export interface DidDocument {
  id: string;
  alsoKnownAs?: string[];
  service?: { id: string; type: string; serviceEndpoint: string }[];
  verificationMethod?: { id: string; type: string; publicKeyMultibase?: string }[];
}

export interface Identity {
  did: string;
  handle: string | null;
  handleVerified: boolean;
  pds: string;
  didDocument: DidDocument;
  collections: string[];
}

export class ResolutionError extends Error {
  constructor(message: string, readonly status = 404) {
    super(message);
  }
}

const HANDLE_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const DID_RE = /^did:[a-z]+:[A-Za-z0-9._:%-]*[A-Za-z0-9._-]$/;

export type IdentifierKind = "handle" | "did";

export function classifyIdentifier(input: string): IdentifierKind | null {
  const value = input.trim();
  if (DID_RE.test(value)) return "did";
  if (HANDLE_RE.test(value)) return "handle";
  return null;
}

const UPSTREAM_TTL = 300;

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T | null> {
  const response = await fetch(url, {
    ...init,
    cf: { cacheTtl: UPSTREAM_TTL, cacheEverything: true },
    headers: { accept: "application/json", "user-agent": "at-here (+https://at-here.ideasasylum.com)", ...init.headers },
  } as RequestInit);
  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function resolveViaAppView(handle: string): Promise<string | null> {
  const data = await getJson<{ did?: string }>(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
  );
  return data?.did ?? null;
}

async function resolveViaDns(handle: string): Promise<string | null> {
  const data = await getJson<{ Answer?: { data: string }[] }>(
    `https://cloudflare-dns.com/dns-query?name=_atproto.${handle}&type=TXT`,
    { headers: { accept: "application/dns-json" } },
  );
  for (const answer of data?.Answer ?? []) {
    const match = answer.data.replace(/^"|"$/g, "").match(/^did=(did:.+)$/);
    if (match) return match[1];
  }
  return null;
}

async function resolveViaWellKnown(handle: string): Promise<string | null> {
  try {
    const response = await fetch(`https://${handle}/.well-known/atproto-did`, {
      cf: { cacheTtl: UPSTREAM_TTL, cacheEverything: true },
    } as RequestInit);
    if (!response.ok) return null;
    const text = (await response.text()).trim();
    return DID_RE.test(text) ? text : null;
  } catch {
    return null;
  }
}

export async function resolveHandle(handle: string): Promise<string> {
  const normalized = handle.toLowerCase();
  const did =
    (await resolveViaAppView(normalized)) ??
    (await resolveViaDns(normalized)) ??
    (await resolveViaWellKnown(normalized));
  if (!did) throw new ResolutionError(`Could not resolve handle ${handle}`);
  return did;
}

export async function resolveDid(did: string): Promise<DidDocument> {
  let url: string;
  if (did.startsWith("did:plc:")) {
    url = `https://plc.directory/${did}`;
  } else if (did.startsWith("did:web:")) {
    const host = decodeURIComponent(did.slice("did:web:".length));
    url = `https://${host}/.well-known/did.json`;
  } else {
    throw new ResolutionError(`Unsupported DID method in ${did}`, 400);
  }
  const doc = await getJson<DidDocument>(url);
  if (!doc) throw new ResolutionError(`Could not resolve ${did}`);
  return doc;
}

export function pdsEndpoint(doc: DidDocument): string | null {
  const service = doc.service?.find(
    (s) => s.id === "#atproto_pds" || s.id === `${doc.id}#atproto_pds`,
  );
  return service?.serviceEndpoint ?? null;
}

export function handleFromDocument(doc: DidDocument): string | null {
  const aka = doc.alsoKnownAs?.find((alias) => alias.startsWith("at://"));
  return aka ? aka.slice("at://".length) : null;
}

export async function describeRepo(pds: string, did: string): Promise<string[]> {
  const data = await getJson<{ collections?: string[] }>(
    `${pds}/xrpc/com.atproto.repo.describeRepo?repo=${encodeURIComponent(did)}`,
  );
  if (!data) throw new ResolutionError(`Could not read repository for ${did} at ${pds}`, 502);
  return (data.collections ?? []).slice().sort();
}

export async function getRecord<T = Record<string, unknown>>(
  pds: string,
  did: string,
  collection: string,
  rkey = "self",
): Promise<T | null> {
  const data = await getJson<{ value?: T }>(
    `${pds}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(did)}&collection=${collection}&rkey=${rkey}`,
  );
  return data?.value ?? null;
}

export async function resolveIdentity(identifier: string): Promise<Identity> {
  const kind = classifyIdentifier(identifier);
  if (!kind) throw new ResolutionError(`"${identifier}" is not a handle or DID`, 400);

  const requestedHandle = kind === "handle" ? identifier.toLowerCase() : null;
  const did = kind === "did" ? identifier : await resolveHandle(identifier);
  const didDocument = await resolveDid(did);
  const pds = pdsEndpoint(didDocument);
  if (!pds) throw new ResolutionError(`${did} has no PDS in its DID document`);

  const documentHandle = handleFromDocument(didDocument);
  const handle = requestedHandle ?? documentHandle;
  const handleVerified = handle !== null && documentHandle === handle;
  const collections = await describeRepo(pds, did);

  return { did, handle, handleVerified, pds, didDocument, collections };
}

export function blobUrl(did: string, cid: string, kind: "avatar" | "banner" = "avatar"): string {
  return `https://cdn.bsky.app/img/${kind}/plain/${did}/${cid}@jpeg`;
}
