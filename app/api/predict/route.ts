import { NextRequest, NextResponse } from "next/server";
import { resolvePerson, resolveBrand, scoreBrandFit } from "@/lib/meta-ai";
import { rankedBrands, getPerson } from "@/lib/data";
import { getSocialSources } from "@/lib/social";

export async function POST(req: NextRequest) {
  const { person: personInput, brand: brandInput } = await req.json();
  const person = resolvePerson(String(personInput || "simone-biles"));
  // Live Instagram/Facebook sources, fetched once per request and shared
  // across all scoring calls. Empty + non-live when no token is set.
  const social = await getSocialSources(person.handle);
  const opts = { extraSources: social.sources, socialLive: social.live };
  if (!brandInput || brandInput === "__best__") {
    const ranked = rankedBrands(person.id);
    const results = ranked.length
      ? await Promise.all(ranked.slice(0, 5).map(async ({ brand }) => scoreBrandFit(person, brand, opts)))
      : [await scoreBrandFit(person, resolveBrand("Nike"), opts)];
    return NextResponse.json({ person, ranked: results, social: { live: social.live, profiles: social.profiles } });
  }
  const brand = resolveBrand(String(brandInput));
  const result = await scoreBrandFit(person, brand, opts);
  const ranked = rankedBrands(person.id).slice(0, 5).map((r) => ({ brand: r.brand, score: r.score }));
  return NextResponse.json({ person, result, ranked, social: { live: social.live, profiles: social.profiles } });
}

export async function GET(req: NextRequest) {
  const person = getPerson(req.nextUrl.searchParams.get("person") || "simone-biles");
  if (!person) return NextResponse.json({ ranked: [] });
  return NextResponse.json({ ranked: rankedBrands(person.id) });
}
