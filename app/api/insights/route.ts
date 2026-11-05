import { NextResponse } from "next/server";
import { INSIGHTS } from "@/lib/data";
import { getInstagramInsights } from "@/lib/social";

// Instagram insights (instagram_manage_insights), last 28 days.
// Live when the token is connected, otherwise the seeded demo numbers.
export async function GET() {
  const live = await getInstagramInsights();
  if (live) {
    return NextResponse.json({
      live: true,
      insights: [{ personId: "connected", ...live, followerChange: 0, topPosts: [] }],
    });
  }
  return NextResponse.json({ live: false, insights: INSIGHTS });
}
