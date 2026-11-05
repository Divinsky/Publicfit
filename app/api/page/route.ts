import { NextRequest, NextResponse } from "next/server";
import { PAGE_POSTS } from "@/lib/data";
import { getPagePosts, replyToPageComment, updatePageInfo } from "@/lib/social";

// Facebook Page (pages_read_user_content, pages_manage_posts,
// pages_manage_metadata, pages_manage_engagement).
// GET: live Page posts when connected, otherwise seeded demo posts.
// POST { action: "reply", commentId, text } — reply to a Page comment.
// POST { action: "about", about } — update the Page about text.
export async function GET() {
  const live = await getPagePosts();
  if (live && live.length > 0) {
    return NextResponse.json({ live: true, posts: live });
  }
  return NextResponse.json({ live: false, posts: PAGE_POSTS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "reply") {
    const commentId = typeof body.commentId === "string" ? body.commentId : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!commentId || !text) return NextResponse.json({ ok: false, error: "commentId and text are required" }, { status: 400 });
    const sent = await replyToPageComment(commentId, text);
    return NextResponse.json({ ok: true, live: sent.ok, reply: text });
  }
  if (body.action === "about") {
    const about = typeof body.about === "string" ? body.about.trim() : "";
    if (!about) return NextResponse.json({ ok: false, error: "about is required" }, { status: 400 });
    const done = await updatePageInfo(about);
    return NextResponse.json({ ok: true, live: done.ok, about });
  }
  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
