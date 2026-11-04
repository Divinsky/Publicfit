import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Demo: accepted locally only. Production: verify identity before transfer.
  return NextResponse.json({ ok: true, handle: body.handle, foundingOffer: "0% commission for 90 days, then a permanently lower rate" });
}
