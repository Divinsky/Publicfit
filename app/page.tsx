import Link from "next/link";
import { PEOPLE, rankedBrands } from "@/lib/data";
import { TrustBadges } from "@/components/Nav";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="py-8">
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Meta Global AI Developer Hackathon · Build for Your World</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mt-3">Which brands<br />genuinely fit?</h1>
        <p className="text-lg text-stone-600 max-w-2xl mt-4">
          PublicFit predicts brand fit for notable people from cited public sources only — then turns the best matches into a shoppable creator storefront. No private data. No speculation. Every claim, clickable.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/predict" className="bg-ink text-white px-6 py-3 rounded-full font-medium">Run the Brand Fit Predictor →</Link>
          <Link href="/store/simone-biles" className="border border-ink px-6 py-3 rounded-full font-medium">See a sample storefront</Link>
        </div>
        <div className="mt-6"><TrustBadges /></div>
      </section>

      <section>
        <h2 className="font-serif text-3xl font-bold mb-4">Seeded demo — try these first</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PEOPLE.map((p) => {
            const top = rankedBrands(p.id)[0];
            return (
              <Link key={p.id} href={`/predict?person=${p.id}`} className="bg-white border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-sm text-stone-500">{p.role}</p>
                <h3 className="font-serif text-2xl font-bold">{p.name}</h3>
                <p className="text-sm text-stone-600 mt-1">{p.tagline}</p>
                {top && <p className="mt-3 text-sm">Top predicted match: <strong>{top.brand.name}</strong> · {top.score.overall}/100</p>}
                <p className="text-sm underline mt-2">Predict brand fit →</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { n: "1 · Predict", t: "Muse Spark scores category fit, audience, track record, and brand safety — with citations for every claim." },
          { n: "2 · Storefront", t: "High-fit matches become a claimable storefront. Founding sellers: 0% commission for 90 days, then a permanently lower rate." },
          { n: "3 · Feed & waitlist", t: "Fans get a feed ranked by PublicFit scores, with personalization strictly opt-in, plus a quarterly rolling waitlist." },
        ].map((s) => (
          <div key={s.n} className="bg-white border rounded-2xl p-5"><p className="font-semibold">{s.n}</p><p className="text-stone-600 mt-1 text-sm">{s.t}</p></div>
        ))}
      </section>
    </div>
  );
}
