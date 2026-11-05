import Link from "next/link";
import { PEOPLE, BRANDS, rankedBrands } from "@/lib/data";

// Creator discovery for brands (facebook_creator_marketplace_discovery).
// Brands browse creators and see each creator's top PublicFit brand fits,
// so they can find a genuine match. Demo: seeded roster; live discovery
// via the Creator Marketplace API when connected.
export default function Discover() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">For brands · Creator Marketplace discovery</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Discover creators</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Find a creator who genuinely fits your brand. Each creator shows their top
          PublicFit brand matches, so you start from fit — not follower count alone.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PEOPLE.map((p) => {
          const top = rankedBrands(p.id).slice(0, 3);
          return (
            <div key={p.id} className="bg-white border rounded-2xl p-5">
              <p className="text-sm text-stone-500">{p.role}</p>
              <h2 className="font-serif text-2xl font-bold">{p.name}</h2>
              <p className="text-sm text-stone-600 mt-1">{p.tagline}</p>
              <p className="text-sm text-stone-500 mt-1">Audience: {p.audience}</p>
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">Top brand fits</p>
                <ul className="space-y-1 text-sm">
                  {top.map((t) => (
                    <li key={t.brand.id} className="flex justify-between"><span>{t.brand.name}</span><span className="font-bold">{t.score.overall}/100</span></li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3 mt-4">
                <Link href={`/predict?person=${p.id}`} className="underline text-sm">Predict fit →</Link>
                <Link href={`/store/${p.handle}`} className="underline text-sm">Storefront →</Link>
                <Link href="/messages" className="underline text-sm">Message →</Link>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">
        Brands on PublicFit: {BRANDS.map((b) => b.name).join(", ")}. Discovery is a
        starting point — every match is a prediction with cited public sources, not a
        guarantee.
      </p>
    </div>
  );
}
