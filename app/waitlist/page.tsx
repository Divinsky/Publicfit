"use client";
import { useState } from "react";

export default function Waitlist() {
  const [type, setType] = useState<"notable" | "fan">("fan");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, email }) });
    setMsg((await res.json()).message);
  }
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-serif text-4xl font-bold">Get access</h1>
      <p className="text-stone-600">Notable people can request instant onboarding. Everyone else joins the quarterly rolling waitlist — no private data required to join.</p>
      <div className="flex gap-2">
        <button onClick={() => setType("notable")} className={`px-5 py-2 rounded-full border ${type === "notable" ? "bg-ink text-white" : "bg-white"}`}>I&apos;m a notable person</button>
        <button onClick={() => setType("fan")} className={`px-5 py-2 rounded-full border ${type === "fan" ? "bg-ink text-white" : "bg-white"}`}>I&apos;m a fan / brand</button>
      </div>
      {type === "notable" ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-sm space-y-2">
          <p className="font-semibold">Instant onboarding — verification checklist</p>
          <ol className="list-decimal pl-5 space-y-1"><li>Confirm identity via a public profile link</li><li>Review your auto-built storefront and sources</li><li>Approve (human-in-the-loop) before anything publishes</li><li>Claim with the founding offer: 0% for 90 days, then a permanently lower rate</li></ol>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-5 text-sm">
          <p className="font-semibold">Quarterly rolling waitlist</p>
          <p className="text-stone-600 mt-1">Cohorts open each quarter. Next cohort: January 2027. Joining adds you to that cohort only — you can leave anytime.</p>
        </div>
      )}
      <form onSubmit={submit} className="bg-white border rounded-2xl p-5 flex flex-wrap gap-2">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border rounded-full px-4 py-2 flex-1 min-w-[200px]" />
        <button className="bg-ink text-white px-5 py-2 rounded-full">{type === "notable" ? "Request instant onboarding" : "Join the waitlist"}</button>
      </form>
      {msg && <p className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm">✓ {msg}</p>}
    </div>
  );
}
