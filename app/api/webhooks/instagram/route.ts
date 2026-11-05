import { NextRequest, NextResponse } from "next/server";

// Meta webhook verification (GET):
// Meta sends hub.mode=subscribe, hub.verify_token, hub.challenge.
// We return hub.challenge as plain text with 200 only when the token matches
// INSTAGRAM_WEBHOOK_VERIFY_TOKEN. Webhook events arrive as POST.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

  if (
    mode === "subscribe" &&
    token &&
    verifyToken &&
    token === verifyToken &&
    challenge
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  console.log("Instagram webhook event", JSON.stringify(body));
  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}
