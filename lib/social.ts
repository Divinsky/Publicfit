// Facebook / Instagram live sources via the Meta Graph API.
//
// What this does: when META_GRAPH_TOKEN is set, a creator's public
// Instagram profile (via Business Discovery) and public Facebook Page are
// fetched and converted into the same cited Source entries the scorer
// already consumes, so live social evidence shows up in the Predictor's
// source list and in the Muse Spark prompt. Only public fields are ever
// read for sources (username, bio/about, follower/fan counts, public post
// captions and permalinks) — no private data, no non-public content.
//
// Messages (instagram_manage_messages) is separate: when a creator has
// connected their Instagram, the Messages inbox reads the DM threads they
// open and sends the replies they write, through the Instagram Messaging
// API. DMs are only ever touched at the creator's request, never scraped
// in bulk, and never used for scoring.
//
// What it needs: a Meta app user access token with instagram_basic and
// pages_read_engagement, from an account with a connected Instagram
// business/creator account (Business Discovery runs off the token
// owner's account). Messaging also needs instagram_manage_messages.
// Without the token, or on any fetch failure, this returns no sources
// and the app keeps working exactly as before — the demo never breaks
// on a missing social token.
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

// Read per call. On Workers (OpenNext, nodejs_compat, compatibility_date
// 2024-12-30) process.env is filled from secrets only inside a request, so
// a module-level read is always empty and every lookup stays non-live.
function getToken(): string {
  return process.env.META_GRAPH_TOKEN || "";
}

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

async function postJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Graph API ${res.status}`);
  return res.json();
}

async function getOwnIgId(): Promise<string | null> {
  const token = getToken();
  const me = await fetchJson(`${GRAPH_BASE}/me?fields=instagram_business_account&access_token=${encodeURIComponent(token)}`) as {
    instagram_business_account?: { id?: string };
  };
  return me?.instagram_business_account?.id || null;
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
  const token = getToken();
  // Step 1: the token owner's Instagram business account id.
  const me = await fetchJson(`${GRAPH_BASE}/me?fields=instagram_business_account&access_token=${encodeURIComponent(token)}`) as {
    instagram_business_account?: { id?: string };
  };
  const igId = me?.instagram_business_account?.id;
  if (!igId) return null;
  // Step 2: Business Discovery for the target handle's public profile.
  const fields = `business_discovery.username(${handle}){username,name,biography,followers_count,media_count,media.limit(3){caption,permalink,timestamp}}`;
  const data = await fetchJson(`${GRAPH_BASE}/${igId}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`) as {
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
  const token = getToken();
  const fields = "name,about,fan_count,link";
  const d = await fetchJson(`${GRAPH_BASE}/${encodeURIComponent(handle)}?fields=${fields}&access_token=${encodeURIComponent(token)}`) as {
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
  const token = getToken();
  // Missing token is a non-live miss. Do not cache it: the module Map
  // outlives the request, and a stored empty result would keep returning
  // live:false after the Worker secret is present.
  if (!token || !isSafeHandle(handle)) return { sources: [], live: false, profiles: [] };
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
  // Token was present for this fetch. A missing-token miss returns above
  // and is never written, so it cannot stick in the module cache.
  CACHE.set(handle, { at: Date.now(), value: result });
  return result;
}

// --- Instagram messaging (instagram_manage_messages) ---

export type DmThread = {
  id: string;
  fromName: string;
  fromHandle: string;
  preview: string;
  messages: { from: "them" | "creator"; text: string; time: string }[];
};

/**
 * Send a creator-written reply to an Instagram DM thread via the
 * Instagram Messaging API. Returns { ok, live }. Live only when the
 * token is set and the recipient has a real Instagram user id; the
 * demo seeded threads have none, so they stay local.
 */
export async function sendInstagramMessage(
  recipientIgId: string,
  text: string
): Promise<{ ok: boolean; live: boolean }> {
  const token = getToken();
  if (!token || !recipientIgId || !text.trim()) return { ok: false, live: false };
  try {
    const igId = await getOwnIgId();
    if (!igId) return { ok: false, live: false };
    const url = `${GRAPH_BASE}/${igId}/messages?access_token=${encodeURIComponent(token)}`;
    const res = (await postJson(url, {
      recipient: { id: recipientIgId },
      message: { text: text.trim() },
    })) as { message_id?: string };
    return { ok: !!res?.message_id, live: true };
  } catch {
    return { ok: false, live: false };
  }
}

/**
 * Live Instagram DM threads for the connected account, in the same
 * shape as the seeded demo threads. Returns null when the token is
 * not set or the fetch fails — callers fall back to the demo threads.
 */
export async function getInstagramConversations(): Promise<DmThread[] | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const igId = await getOwnIgId();
    if (!igId) return null;
    const fields = "participants,messages.limit(5){message,from,created_time}";
    const data = (await fetchJson(
      `${GRAPH_BASE}/${igId}/conversations?platform=instagram&fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`
    )) as {
      data?: {
        id?: string;
        participants?: { data?: { username?: string; name?: string }[] };
        messages?: { data?: { message?: string; from?: { username?: string }; created_time?: string }[] };
      }[];
    };
    const threads: DmThread[] = (data?.data || []).map((c) => {
      const other = (c.participants?.data || []).find((p) => p.username && p.username !== "") || {};
      const msgs = (c.messages?.data || []).map((m) => ({
        from: "them" as const,
        text: m.message || "",
        time: (m.created_time || "").slice(0, 10),
      }));
      return {
        id: c.id || "",
        fromName: other.name || other.username || "Instagram user",
        fromHandle: other.username ? `@${other.username}` : "",
        preview: msgs[msgs.length - 1]?.text || "",
        messages: msgs,
      };
    }).filter((t) => t.id);
    return threads;
  } catch {
    return null;
  }
}

// --- Comments (instagram_manage_comments) ---

/** Reply to an Instagram comment. Live only with a real comment id + token. */
export async function replyToInstagramComment(
  commentId: string,
  text: string
): Promise<{ ok: boolean; live: boolean }> {
  const token = getToken();
  if (!token || !commentId || !text.trim()) return { ok: false, live: false };
  try {
    const url = `${GRAPH_BASE}/${encodeURIComponent(commentId)}/replies?access_token=${encodeURIComponent(token)}`;
    const res = (await postJson(url, { message: text.trim() })) as { id?: string };
    return { ok: !!res?.id, live: true };
  } catch {
    return { ok: false, live: false };
  }
}

// --- Insights (instagram_manage_insights) ---

export type LiveInsights = { reach: number; impressions: number; profileViews: number };

/** Last-28-day Instagram insights for the connected account. Null when not live. */
export async function getInstagramInsights(): Promise<LiveInsights | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const igId = await getOwnIgId();
    if (!igId) return null;
    const url = `${GRAPH_BASE}/${igId}/insights?metric=reach,impressions,profile_views&period=day&metric_type=total&access_token=${encodeURIComponent(token)}`;
    const data = (await fetchJson(url)) as {
      data?: { name?: string; values?: { value?: number }[] }[];
    };
    const sum = (name: string) =>
      (data?.data || []).find((d) => d.name === name)?.values?.reduce((a, v) => a + (v.value || 0), 0) || 0;
    return { reach: sum("reach"), impressions: sum("impressions"), profileViews: sum("profile_views") };
  } catch {
    return null;
  }
}

// --- Publishing (instagram_content_publish; Page Mentions via tagging) ---

/**
 * Publish a photo post to Instagram (two-step Content Publishing flow).
 * `mentions` are Page/usernames to tag in the caption (Page Mentions).
 * Returns { ok, live, mediaId }.
 */
export async function publishInstagramPost(
  imageUrl: string,
  caption: string,
  mentions: string[] = []
): Promise<{ ok: boolean; live: boolean; mediaId?: string }> {
  const token = getToken();
  if (!token || !imageUrl || !caption.trim()) return { ok: false, live: false };
  try {
    const igId = await getOwnIgId();
    if (!igId) return { ok: false, live: false };
    const fullCaption = [...mentions.map((m) => `@${m}`), caption.trim()].join(" ").trim();
    const create = (await postJson(
      `${GRAPH_BASE}/${igId}/media?access_token=${encodeURIComponent(token)}`,
      { image_url: imageUrl, caption: fullCaption }
    )) as { id?: string };
    if (!create?.id) return { ok: false, live: false };
    const pub = (await postJson(
      `${GRAPH_BASE}/${igId}/media_publish?access_token=${encodeURIComponent(token)}`,
      { creation_id: create.id }
    )) as { id?: string };
    return { ok: !!pub?.id, live: true, mediaId: pub?.id };
  } catch {
    return { ok: false, live: false };
  }
}

// --- Facebook Page (pages_read_user_content, pages_manage_posts,
// pages_manage_metadata, pages_manage_engagement) ---

export type LivePagePost = {
  id: string; author: string; text: string; time: string; likes: number;
  comments: { from: string; text: string; time: string }[];
};

async function getOwnPageId(): Promise<string | null> {
  const token = getToken();
  const data = (await fetchJson(
    `${GRAPH_BASE}/me/accounts?fields=id&access_token=${encodeURIComponent(token)}`
  )) as { data?: { id?: string }[] };
  return data?.data?.[0]?.id || null;
}

/** Live Facebook Page posts + visitor posts + their comments. Null when not live. */
export async function getPagePosts(): Promise<LivePagePost[] | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const pageId = await getOwnPageId();
    if (!pageId) return null;
    const fields = "message,created_time,likes.summary(true),comments{message,from,created_time}";
    const data = (await fetchJson(
      `${GRAPH_BASE}/${pageId}/posts?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`
    )) as {
      data?: {
        id?: string; message?: string; created_time?: string;
        likes?: { summary?: { total_count?: number } };
        comments?: { data?: { message?: string; from?: { name?: string }; created_time?: string }[] };
      }[];
    };
    return (data?.data || []).map((p) => ({
      id: p.id || "",
      author: "Page",
      text: p.message || "",
      time: (p.created_time || "").slice(0, 10),
      likes: p.likes?.summary?.total_count || 0,
      comments: (p.comments?.data || []).map((c) => ({
        from: c.from?.name || "Visitor",
        text: c.message || "",
        time: (c.created_time || "").slice(0, 10),
      })),
    })).filter((p) => p.id);
  } catch {
    return null;
  }
}

/** Reply to a comment on a Facebook Page post. */
export async function replyToPageComment(
  commentId: string,
  text: string
): Promise<{ ok: boolean; live: boolean }> {
  const token = getToken();
  if (!token || !commentId || !text.trim()) return { ok: false, live: false };
  try {
    const url = `${GRAPH_BASE}/${encodeURIComponent(commentId)}/comments?access_token=${encodeURIComponent(token)}`;
    const res = (await postJson(url, { message: text.trim() })) as { id?: string };
    return { ok: !!res?.id, live: true };
  } catch {
    return { ok: false, live: false };
  }
}

/** Update a Facebook Page's about text (pages_manage_metadata). */
export async function updatePageInfo(about: string): Promise<{ ok: boolean; live: boolean }> {
  const token = getToken();
  if (!token || !about.trim()) return { ok: false, live: false };
  try {
    const pageId = await getOwnPageId();
    if (!pageId) return { ok: false, live: false };
    const url = `${GRAPH_BASE}/${pageId}?access_token=${encodeURIComponent(token)}`;
    const res = (await postJson(url, { about: about.trim() })) as { success?: boolean };
    return { ok: res?.success !== false, live: true };
  } catch {
    return { ok: false, live: false };
  }
}
