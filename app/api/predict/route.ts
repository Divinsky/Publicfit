import { NextRequest, NextResponse } from "next/server";
import { resolvePerson, resolveBrand, scoreBrandFit } from "@/lib/meta-ai";
import { rankedBrands, getPerson } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { person: personInput, brand: brandInput } = await req.json();
  const person = resolvePerson(String(personInput || "simone-biles"));
  if (!brandInput || brandInput === "__best__") {
    const ranked = rankedBrands(person.id);
    const results = ranked.length
      ? await Promise.all(ranked.slice(0, 5).map(async ({ brand }) => scoreBrandFit(person, brand)))
      : [await scoreBrandFit(person, resolveBrand("Nike"))];
    return NextResponse.json({ person, ranked: results });
  }
  const brand = resolveBrand(String(brandInput));
  const result = await scoreBrandFit(person, brand);
  const ranked = rankedBrands(person.id).slice(0, 5).map((r) => ({ brand: r.brand, score: r.score }));
  return NextResponse.json({ person, result, ranked });
}

export async function GET(req: NextRequest) {
  const person = getPerson(req.nextUrl.searchParams.get("person") || "simone-biles");
  if (!person) return NextResponse.json({ ranked: [] });
  return NextResponse.json({ ranked: rankedBrands(person.id) });
}
