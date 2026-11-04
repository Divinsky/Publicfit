import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const isNotable = body.type === "notable";
  return NextResponse.json({ ok: true,
    message: isNotable ? "Instant onboarding requested — verification checklist issued (demo)." : "Joined the quarterly rolling waitlist — next cohort opens January 2027 (demo)." });
}
