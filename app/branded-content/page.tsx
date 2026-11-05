"use client";
import { useState } from "react";
import Link from "next/link";
import { BRANDED_REQUESTS, getPerson, getBrand, type BrandedRequest } from "@/lib/data";

// Branded content (facebook_branded_content_ads_brand): a brand asks to
// boost a creator's post as a branded-content ad, and the creator approves
// it here. Demo: approvals are local; live via the branded-content flow
// when connected.
export default function BrandedContent() {
  const [requests, setRequests] = useState<BrandedRequest[]>(BRANDED_REQUESTS);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function approve(r: BrandedRequest) {
    const res = await fetch("/api/branded-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) {
      setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "approved" } : x)));
      setNotes((prev) => ({ ...prev, [r.id]: data.live ? "Approved — the brand can now boost this post." : "Approved (demo — kept local; the brand can boost it once connected)." }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator tools · Branded content</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Branded content</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Brands ask to boost a creator&apos;s post as a branded-content ad. The creator
          approves it here — nothing is boosted without their say-so.
        </p>
      </div>
      <div className="space-y-3">
        {requests.map((r) => {
          const person = getPerson(r.personId);
          const brand = getBrand(r.brandId);
          return (
            <div key={r.id} className="bg-white border rounded-2xl p-5">
              <p className="font-semibold">{brand ? brand.name : r.brandId} → {person ? person.name : r.personId}</p>
              <p className="text-sm text-stone-500 mt-1">Post: &ldquo;{r.postCaption}&rdquo;</p>
              <p className="text-stone-700 mt-2">{r.note}</p>
              <p className="text-sm mt-2">Status: <strong>{r.status}</strong></p>
              {r.status === "pending" ? (
                <button onClick={() => approve(r)} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium mt-3">Approve</button>
              ) : (
                <p className="text-sm text-teal-700 mt-3">✓ Approved.</p>
              )}
              {notes[r.id] && <p className="text-sm text-stone-500 mt-2">{notes[r.id]}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">See <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.</p>
    </div>
  );
}
