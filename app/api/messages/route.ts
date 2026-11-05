import { NextRequest, NextResponse } from "next/server";
import { MESSAGES } from "@/lib/data";
import { getInstagramConversations, sendInstagramMessage } from "@/lib/social";

// Messages inbox (instagram_manage_messages).
// GET: live Instagram DM threads when the token is connected, otherwise
// the seeded demo threads. POST: send a creator-written reply — via the
// Instagram Messaging API when the thread has a real recipient id and
// the token is live, otherwise accepted locally (demo) and echoed back.
export async function GET() {
  const live = await getInstagramConversations();
  if (live && live.length > 0) {
    return NextResponse.json({ live: true, conversations: live });
  }
  return NextResponse.json({ live: false, conversations: MESSAGES });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const conversationId = typeof body.conversationId === "string" ? body.conversationId : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!conversationId || !text) {
    return NextResponse.json({ ok: false, error: "conversationId and text are required" }, { status: 400 });
  }
  const convo = MESSAGES.find((c) => c.id === conversationId);
  if (convo?.recipientIgId) {
    const sent = await sendInstagramMessage(convo.recipientIgId, text);
    if (sent.ok) return NextResponse.json({ ok: true, live: true, message: { from: "creator", text, time: "now" } });
  }
  // Demo: no real recipient / no live token — accept locally.
  return NextResponse.json({ ok: true, live: false, message: { from: "creator", text, time: "now" } });
}
