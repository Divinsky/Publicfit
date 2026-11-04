"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PEOPLE, BRANDS } from "@/lib/data";
import { ScoreBar, TrustBadges } from "@/components/Nav";
import DataControls from "@/components/DataControls";
import type { FitResult } from "@/lib/meta-ai";

function PredictInner() {
  const params = useSearchParams();
  const [person, setPerson] = useState(params.get("person") || "simone-biles");
  const [customPerson, setCustomPerson] = useState("");
  const [brand, setBrand] = useState("__best__");
  const [customBrand, setCustomBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ result?: FitResult; ranked?: FitResult[] } | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [published, setPublished] = useState(false);

  async function run() {
    setLoading(true); setPublished(false); setReviewed(false);
    const res = await fetch("/api/predict", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person: customPerson || person, brand: brand === "__custom__" ? customBrand : brand }) });
    setData(await res.json()); setLoading(false);
  }
  useEffect(() => { run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const main: FitResult | undefined = data?.result || data?.ranked?.[0];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">Brand Fit Predictor</h1>
        <p className="text-stone-600 mt-2">A commercial brand-partnership fit engine. Public sources only. Scores are fit predictions, not character judgments or guarantees of a deal.</p>
        <div className="mt-3"><TrustBadges /></div>
      </div>

      <div className="bg-white border rounded-2xl p-5 grid md:grid-cols-3 gap-4">
        <label className="text-sm font-medium">Notable person
          <select value={person} onChange={(e) => { setPerson(e.target.value); setCustomPerson(""); }} className="mt-1 w-full border rounded-lg p-2 block">
            {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={customPerson} onChange={(e) => setCustomPerson(e.target.value)} placeholder="Or enter a name…" className="mt-2 w-full border rounded-lg p-2" />
        </label>
        <label className="text-sm font-medium">Brand
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 w-full border rounded-lg p-2 block">
            <option value="__best__">Find best-fit brands</option>
            {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            <option value="__custom__">Enter a brand…</option>
          </select>
          {brand === "__custom__" && <input value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} placeholder="Brand name" className="mt-2 w-full border rounded-lg p-2" />}
        </label>
        <div className="flex items-end"><button onClick={run} disabled={loading} className="bg-ink text-white px-6 py-2.5 rounded-full w-full disabled:opacity-50">{loading ? "Analyzing…" : "Predict fit"}</button></div>
      </div>

      {main && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold">{main.person.name} × {main.brand.name}</h2>
                <p className="text-sm text-stone-500">Mode: {main.mode} · Model: {main.model} · Visual fit (Muse Image path): {main.visualFit}/100</p>
                <p className="text-sm text-stone-500">Tags (Muse Spark Open): {main.tags.join(", ") || "—"}</p>
              </div>
              <div className="text-center"><p className="font-serif text-6xl font-bold">{main.score.overall}</p><p className="text-sm">Fit Score / 100</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <ScoreBar label="Category fit" value={main.score.category} />
              <ScoreBar label="Audience overlap" value={main.score.audience} />
              <ScoreBar label="Track record & past deals" value={main.score.trackRecord} />
              <ScoreBar label="Brand-safety / partnership risk" value={main.score.safety} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-teal-50 rounded-xl p-4"><p className="font-semibold">Upside for {main.person.name}</p><p className="text-stone-700 mt-1">{main.personUpside}</p></div>
              <div className="bg-amber-50 rounded-xl p-4"><p className="font-semibold">Upside for {main.brand.name}</p><p className="text-stone-700 mt-1">{main.brandUpside}</p></div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Why this score — with sources</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-stone-700">{main.rationale.map((r, i) => <li key={i}>{r}</li>)}</ul>
              <ul className="mt-3 space-y-1 text-sm">
                {main.sources.map((s) => <li key={s.url}>🔗 <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.label}</a> — {s.note}</li>)}
              </ul>
            </div>
            <div className="border-t pt-4 space-y-3">
              <label className="flex gap-2 text-sm font-medium"><input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} /> Human-in-the-loop review: I have reviewed this profile and match card before publication.</label>
              <button disabled={!reviewed} onClick={() => setPublished(true)} className="bg-accent text-white px-5 py-2 rounded-full text-sm disabled:opacity-40">Publish match card</button>
              {published && <p className="text-sm text-teal-700">✓ Published after human review (demo — no external publication).</p>}
              {!reviewed && <p className="text-sm text-stone-500">Publishing is blocked until a human reviews the card. This is intentional.</p>}
              <div><DataControls person={main.person} /></div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-serif text-xl font-bold mb-3">Top-matching brands</h3>
            <ol className="space-y-3">
              {(data?.ranked || []).map((r, i) => (
                <li key={r.brand.id} className="flex justify-between gap-2 text-sm border-b pb-2">
                  <span>{i + 1}. <strong>{r.brand.name}</strong> <span className="text-stone-500">{r.brand.category}</span></span>
                  <span className="font-bold">{r.score.overall}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-stone-500 mt-3">Ranked by overall Fit Score. Click a name on the home page to re-run for another person.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PredictPage() {
  return <Suspense><PredictInner /></Suspense>;
}
