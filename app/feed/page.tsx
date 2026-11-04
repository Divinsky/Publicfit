"use client";
import { useState } from "react";
import Link from "next/link";
import { PEOPLE, rankedBrands, STOREFRONTS } from "@/lib/data";

export default function Feed() {
  const [personalize, setPersonalize] = useState(false);
  const [followed, setFollowed] = useState<string[]>(["simone-biles"]);
  const toggle = (id: string) => setFollowed((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);

  // Ranked by PublicFit score, boosted by follows — only when personalization is opted in.
  const items = PEOPLE.flatMap((p) => rankedBrands(p.id).slice(0, 2).map((r) => ({
    person: p, brand: r.brand, score: r.score.overall,
    rank: r.score.overall + (personalize && followed.includes(p.id) ? 15 : 0),
  }))).sort((a, b) => b.rank - a.rank);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl font-bold">Fan Feed</h1>
      <div className="bg-white border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Use my activity for personalization?</p>
          <p className="text-sm text-stone-600">Off by default. When on, the feed ranks by PublicFit scores <em>and</em> who you follow. You can turn it off anytime — the feed reverts to score-only ranking.</p>
        </div>
        <label className="flex items-center gap-2 font-medium text-sm">
          <input type="checkbox" checked={personalize} onChange={(e) => setPersonalize(e.target.checked)} className="w-5 h-5" />
          {personalize ? "Personalization ON" : "Personalization OFF"}
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {PEOPLE.map((p) => (
          <button key={p.id} onClick={() => toggle(p.id)} className={`px-4 py-2 rounded-full border text-sm ${followed.includes(p.id) ? "bg-ink text-white" : "bg-white"}`}>
            {followed.includes(p.id) ? "✓ Following " : "Follow "}{p.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-stone-500">{it.person.name} × {it.brand.name} · Fit {it.score}</p>
            <h3 className="font-bold mt-1">{it.brand.tagline}</h3>
            <p className="text-sm text-stone-600 mt-1">{personalize && followed.includes(it.person.id) ? "Boosted because you follow this person." : "Ranked by PublicFit score."}</p>
            <Link href={`/store/${it.person.handle}`} className="underline text-sm mt-2 inline-block">Shop {it.person.name}&apos;s storefront →</Link>
          </div>
        ))}
      </div>
      <p className="text-sm text-stone-500">Sample storefront stock: {Object.values(STOREFRONTS).flat().length} demo products across seeded storefronts.</p>
    </div>
  );
}
