import { blobUrl, getRecord, resolveIdentity } from "./atproto";
import { detectApps, type DetectedApp } from "./apps";

export interface CardApp extends DetectedApp {
  description: string | null;
}

export interface Card {
  did: string;
  handle: string | null;
  handleVerified: boolean;
  pds: string;
  pdsHost: string;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  headline: string | null;
  description: string | null;
  avatar: string | null;
  apps: CardApp[];
  collections: string[];
  generatedAt: string;
}

interface BlueskyProfile {
  displayName?: string;
  description?: string;
  avatar?: { ref?: { $link?: string } };
}

interface TangledProfile {
  description?: string;
}

interface SifaProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
}

const blank = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export async function buildCard(identifier: string): Promise<Card> {
  const identity = await resolveIdentity(identifier);
  const { did, handle, pds } = identity;
  const apps = detectApps(identity.collections, { did, handle });

  const records = new Map<string, Record<string, unknown> | null>();
  await Promise.all(
    apps
      .filter((app) => app.profileCollection)
      .map(async (app) => {
        const record = await getRecord(pds, did, app.profileCollection!).catch(() => null);
        records.set(app.profileCollection!, record);
      }),
  );

  const bluesky = records.get("app.bsky.actor.profile") as BlueskyProfile | null | undefined;
  const tangled = records.get("sh.tangled.actor.profile") as TangledProfile | null | undefined;
  const sifa = records.get("id.sifa.profile.self") as SifaProfile | null | undefined;

  const appDescriptions: Record<string, string | null> = {
    "app.bsky.actor.profile": blank(bluesky?.description),
    "sh.tangled.actor.profile": blank(tangled?.description),
    "id.sifa.profile.self": blank(sifa?.headline) ?? blank(sifa?.about),
  };

  const avatarCid = bluesky?.avatar?.ref?.$link;
  const givenName = blank(sifa?.firstName);
  const familyName = blank(sifa?.lastName);
  const fullName = [givenName, familyName].filter(Boolean).join(" ") || null;
  const headline = blank(sifa?.headline);
  const description = blank(bluesky?.description) ?? blank(sifa?.about) ?? blank(tangled?.description);

  const appDescription = (app: DetectedApp): string | null => {
    const text = app.profileCollection ? appDescriptions[app.profileCollection] ?? null : null;
    return text && text !== description && text !== headline ? text : null;
  };

  return {
    did,
    handle,
    handleVerified: identity.handleVerified,
    pds,
    pdsHost: new URL(pds).host,
    displayName: blank(bluesky?.displayName) ?? fullName,
    givenName,
    familyName,
    headline,
    description,
    avatar: avatarCid ? blobUrl(did, avatarCid) : null,
    apps: apps.map((app) => ({ ...app, description: appDescription(app) })),
    collections: identity.collections,
    generatedAt: new Date().toISOString(),
  };
}
