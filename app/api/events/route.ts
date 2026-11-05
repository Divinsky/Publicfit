import { NextRequest, NextResponse } from "next/server";
import { EVENTS } from "@/lib/data";

// Future events with a creator (instagram_manage_events).
// GET: upcoming events. POST: create an event (demo: accepted locally;
// live via the Instagram events API when connected).
export async function GET() {
  return NextResponse.json({ live: false, events: EVENTS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const personId = typeof body.personId === "string" ? body.personId : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const kind = typeof body.kind === "string" ? body.kind : "Live Q&A";
  if (!personId || !title || !date) {
    return NextResponse.json({ ok: false, error: "personId, title, and date are required" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    live: false,
    event: { id: `ev-${Date.now()}`, personId, title, kind, date, time, description, rsvps: 0 },
  });
}
