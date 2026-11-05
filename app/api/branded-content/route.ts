import { NextRequest, NextResponse } from "next/server";
import { BRANDED_REQUESTS } from "@/lib/data";

// Branded content (facebook_branded_content_ads_brand).
// GET: pending branded-content ad requests. POST { id } — the creator
// approves a request (demo: accepted locally; live: via the Graph API
// branded-content flow when connected).
export async function GET() {
  return NextResponse.json({ live: false, requests: BRANDED_REQUESTS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const found = BRANDED_REQUESTS.find((r) => r.id === id);
  if (!found) return NextResponse.json({ ok: false, error: "request not found" }, { status: 404 });
  return NextResponse.json({ ok: true, live: false, id, status: "approved" });
}
