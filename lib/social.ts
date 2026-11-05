// Facebook / Instagram live sources via the Meta Graph API.
//
// What this does: when META_GRAPH_TOKEN is set, a creator's public
// Instagram profile (via Business Discovery) and public Facebook Page are
// fetched and converted into the same cited Source entries the scorer
// already consumes, so live social evidence shows up in the Predictor's
// source list and in the Muse Spark prompt. Only public fields are ever
// read (username, bio/about, follower/fan counts, public post captions
// and permalinks) — no private data, no DMs, no non-public content.
//
// What it needs: a Meta app user access token with instagram_basic and
// pages_read_engagement, from an account with a connected Instagram
// business/creator account (Business Discovery runs off the token
// owner's account). Without the token, or on any fetch failure, this
// returns no sources and the app keeps working exactly as before — the
// demo never breaks on a missing social token.
//
// Env: META_GRAPH_TOKEN (optional). See .env.example for setup notes.
import type { Source } from "./data";

export type SocialProfile = {
  platform: "instagram" | "facebook";
  handle: string;
  displayName: string;
  bio: string;
  followers: number | null;
  url: string;
  recentPosts: { caption: string; url: string; date: string }[];
};

export type SocialResult = {
  sources: Source[];
  live: boolean;
  profiles: SocialProfile[];
};

const GRAPH_BASE = "https://graph.facebook.com/v21.0";
const TOKEN = process.env.META_GRAPH_TOKEN || "";

// Public Instagram handles for the seeded demo people. Custom entries
// use their own input as the handle attempt.
const HANDLE_MAP: Record<string, string> = {
  "simone-biles": "simonebiles",
  "lebron-james": "kingjames",
  "emma-chamberlain": "emmachamberlain",
};

function cleanHandle(input: string): string {
  return input.replace(/^@/, "").trim().toLowerCase();
}

function isSafeHandle(handle: string): boolean {
  return /^[a-z0-9._-]{1,64}$/.test(handle);
}

// Short in-memory cache so the 5 parallel scoring calls in one predict
// request share a single social fetch. 10-minute TTL.
const CACHE = new Map<string, { at: number; value: SocialResult }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Graph API ${res.status}`);
  return res.json();
}

function toSource(profile: SocialProfile): Source[] {
  const out: Source[] = [{
    label: `${profile.platform === "instagram" ? "Instagram" : "Facebook"} — @${profile.handle} (live)`,
    url: profile.url,
    note: [
      profile.displayName,
      profile.bio ? `Bio: ${profile.bio.slice(0, 160)}` : "",
      profile.followers !== null ? `${profile.followers.toLocaleString()} followers` : "",
    ].filter(Boolean).join(" · ") || "Public profile.",
  }];
  for (const post of profile.recentPosts.slice(0, 2)) {
    out.push({
      label: `${profile.platform === "instagram" ? "Instagram" : "Facebook"} post — @${profile.handle} (live)`,
      url: post.url,
      note: `${post.date}: ${(post.caption || "").slice(0, 160) || "Public post."}`,
    });
  }
  return out;
}

async function fetchInstagram(handle: string): Promise<SocialProfile | null> {
  // Step 1: the token owner's Instagram business account id.
  const me = await fetchJson(`${GRAPH_BASE}/me?fields=instagram_business_account&access_token=${encodeURIComponent(TOKEN)}`) as {
    instagram_business_account?: { id?: string };
  };
  const igId = me?.instagram_business_account?.id;
  if (!igId) return null;
  // Step 2: Business Discovery for the target handle's public profile.
  const fields = `business_discovery.username(${handle}){username,name,biography,followers_count,media_count,media.limit(3){caption,permalink,timestamp}}`;
  const data = await fetchJson(`${GRAPH_BASE}/${igId}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(TOKEN)}`) as {
    business_discovery?: {
      username?: string; name?: string; biography?: string; followers_count?: number;
      media?: { data?: { caption?: string; permalink?: string; timestamp?: string }[] };
    };
  };
  const d = data?.business_discovery;
  if (!d?.username) return null;
  return {
    platform: "instagram",
    handle: d.username,
    displayName: d.name || d.username,
    bio: d.biography || "",
    followers: typeof d.followers_count === "number" ? d.followers_count : null,
    url: `https://www.instagram.com/${d.username}/`,
    recentPosts: (d.media?.data || [])
      .filter((m) => m.permalink)
      .map((m) => ({ caption: m.caption || "", url: m.permalink as string, date: (m.timestamp || "").slice(0, 10) })),
  };
}

async function fetchFacebook(handle: string): Promise<SocialProfile | null> {
  // Public Page lookup by username. Fails quietly when the handle is not
  // a Page or the token lacks the permission — that is expected.
  const fields = "name,about,fan_count,link";
  const d = await fetchJson(`${GRAPH_BASE}/${encodeURIComponent(handle)}?fields=${fields}&access_token=${encodeURIComponent(TOKEN)}`) as {
    name?: string; about?: string; fan_count?: number; link?: string;
  };
  if (!d?.name) return null;
  return {
    platform: "facebook",
    handle,
    displayName: d.name,
    bio: d.about || "",
    followers: typeof d.fan_count === "number" ? d.fan_count : null,
    url: d.link || `https://www.facebook.com/${handle}/`,
    recentPosts: [],
  };
}

/**
 * Live Instagram/Facebook sources for a creator handle. Returns an empty,
 * non-live result when no token is set or any fetch fails — callers must
 * treat that as "social not connected", never as an error.
 */
export async function getSocialSources(personHandle: string): Promise<SocialResult> {
  const handle = HANDLE_MAP[personHandle] || cleanHandle(personHandle);
  if (!TOKEN || !isSafeHandle(handle)) return { sources: [], live: false, profiles: [] };
  const cached = CACHE.get(handle);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;
  const profiles: SocialProfile[] = [];
  for (const fn of [fetchInstagram, fetchFacebook]) {
    try {
      const p = await fn(handle);
      if (p) profiles.push(p);
    } catch { /* one platform failing must not break the other */ }
  }
  const result: SocialResult = {
    sources: profiles.flatMap(toSource),
    live: profiles.length > 0,
    profiles,
  };
  CACHE.set(handle, { at: Date.now(), value: result });
  return result;
}
