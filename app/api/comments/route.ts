import { NextRequest, NextResponse } from "next/server";
import { COMMENTS } from "@/lib/data";
import { replyToInstagramComment } from "@/lib/social";

// Instagram comments (instagram_manage_comments).
// GET: seeded demo comments. POST: reply to a comment — via the Graph API
// when the comment has a real id and the token is live, otherwise demo.
export async function GET() {
  return NextResponse.json({ live: false, comments: COMMENTS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const commentId = typeof body.commentId === "string" ? body.commentId : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!commentId || !text) {
    return NextResponse.json({ ok: false, error: "commentId and text are required" }, { status: 400 });
  }
  const sent = await replyToInstagramComment(commentId, text);
  if (sent.ok) return NextResponse.json({ ok: true, live: true, reply: text });
  return NextResponse.json({ ok: true, live: false, reply: text });
}
