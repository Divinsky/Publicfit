import { NextResponse } from "next/server";
import { PEOPLE, BRANDS, rankedBrands } from "@/lib/data";

// Creator discovery for brands (facebook_creator_marketplace_discovery).
// Returns the seeded creator roster with each creator's top brand fits.
// When the Creator Marketplace API is connected, live discovery results
// replace this roster. Demo: seeded only.
export async function GET() {
  const creators = PEOPLE.map((p) => {
    const top = rankedBrands(p.id).slice(0, 3).map((t) => ({ brand: t.brand.name, score: t.score.overall }));
    return { id: p.id, name: p.name, role: p.role, tagline: p.tagline, audience: p.audience, topFits: top };
  });
  return NextResponse.json({ live: false, creators, brands: BRANDS.map((b) => ({ id: b.id, name: b.name, category: b.category })) });
}
