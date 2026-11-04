"use client";
import { useState } from "react";
import Link from "next/link";
import { getPerson, STOREFRONTS, rankedBrands } from "@/lib/data";
import DataControls from "@/components/DataControls";
import { TrustBadges } from "@/components/Nav";

// Next 14: params is a plain object, not a promise.
export default function Storefront({ params }: { params: { handle: string } }) {
  const { handle } = params;
  const person = getPerson(handle);
  const [claimed, setClaimed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  if (!person) return <div><h1 className="font-serif text-3xl font-bold">Storefront not found</h1><p className="mt-2">Try <Link className="underline" href="/store/simone-biles">Simone Biles</Link>, <Link className="underline" href="/store/lebron-james">LeBron James</Link>, or <Link className="underline" href="/store/emma-chamberlain">Emma Chamberlain</Link>.</p></div>;
  const products = STOREFRONTS[person.id] || [];
  const top = rankedBrands(person.id).slice(0, 3);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle, name, email }) });
    setClaimed(true);
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-stone-500">{person.role}</p>
        <h1 className="font-serif text-4xl font-bold">{person.name} — Storefront</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">{person.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-3 items-center"><TrustBadges /><DataControls person={person} /></div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold mb-3">In one place: their products, public picks &amp; high-fit partners</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white border rounded-2xl p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">{p.kind === "own" ? "Their own product" : p.kind === "public-pick" ? "Verified public pick" : "High-fit partner item"}</span>
              <h3 className="font-bold mt-1">{p.name}</h3>
              <p className="text-sm text-stone-500">{p.brand}</p>
              <p className="text-sm mt-2">{p.note}</p>
              <p className="mt-3 font-semibold">{p.price ? `$${p.price}` : "Price on partner site"} <span className="text-sm font-normal text-stone-500">· Fit {p.fit}</span></p>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-500 mt-2">Demo storefront: no checkout is live and no purchase is taken. Partner items link to the brand in a production build.</p>
      </section>

      <section className="bg-white border rounded-2xl p-5">
        <h2 className="font-serif text-2xl font-bold mb-3">Top PublicFit brand matches for {person.name}</h2>
        <ul className="space-y-2">{top.map((t) => <li key={t.brand.id} className="flex justify-between text-sm border-b pb-2"><span><strong>{t.brand.name}</strong> — {t.brand.tagline}</span><span className="font-bold">{t.score.overall}/100</span></li>)}</ul>
        <Link href={`/predict?person=${person.id}`} className="underline text-sm mt-3 inline-block">See the full prediction →</Link>
      </section>

      <section className="bg-ink text-white rounded-2xl p-6">
        <h2 className="font-serif text-2xl font-bold">Claim This Storefront</h2>
        <p className="mt-2 text-stone-200">Founding offer: <strong>0% commission for 90 days</strong>, then a permanently lower rate — plus incoming PublicFit brand-match leads.</p>
        {claimed ? (
          <p className="mt-4 bg-teal-600 rounded-xl p-4">✓ Claim request received for {name || person.name} (demo — nothing was submitted externally). In production, identity verification precedes any transfer of control.</p>
        ) : (
          <form onSubmit={claim} className="mt-4 flex flex-wrap gap-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-full px-4 py-2 text-ink flex-1 min-w-[180px]" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for verification" className="rounded-full px-4 py-2 text-ink flex-1 min-w-[180px]" />
            <button className="bg-white text-ink px-5 py-2 rounded-full font-medium">Claim this storefront</button>
          </form>
        )}
      </section>
    </div>
  );
}
