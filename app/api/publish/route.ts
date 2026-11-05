import { NextRequest, NextResponse } from "next/server";
import { publishInstagramPost } from "@/lib/social";

// Publish to Instagram (instagram_content_publish; Page Mentions via `mentions`).
// POST { imageUrl, caption, mentions[] } — via the Content Publishing API
// when the token is live, otherwise accepted locally (demo).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const caption = typeof body.caption === "string" ? body.caption.trim() : "";
  const mentions = Array.isArray(body.mentions) ? body.mentions.filter((m: unknown) => typeof m === "string") : [];
  if (!imageUrl || !caption) {
    return NextResponse.json({ ok: false, error: "imageUrl and caption are required" }, { status: 400 });
  }
  const pub = await publishInstagramPost(imageUrl, caption, mentions);
  if (pub.ok) return NextResponse.json({ ok: true, live: true, mediaId: pub.mediaId });
  return NextResponse.json({ ok: true, live: false, mediaId: null });
}
