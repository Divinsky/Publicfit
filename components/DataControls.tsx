"use client";
import { useState } from "react";
import type { Person } from "@/lib/data";

/** "Manage My Data" drawer — inspect sources, request a correction, delete. */
export default function DataControls({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleted, setDeleted] = useState(false);
  if (deleted) return <p className="text-sm bg-red-50 border border-red-200 p-3 rounded-xl">Demo: this profile has been marked deleted in this session. No data was sent anywhere.</p>;
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm underline underline-offset-4">Manage My Data</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h2 className="font-serif text-2xl font-bold">Manage My Data — {person.name}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <p className="text-sm text-stone-600 mt-2">PublicFit uses only cited public sources. Here is everything held for this profile in the demo:</p>
            <ul className="mt-4 space-y-2 text-sm">
              {person.sources.map((s) => (
                <li key={s.url} className="border rounded-lg p-3">
                  <a className="font-medium underline" href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                  <p className="text-stone-600">{s.note}</p>
                </li>
              ))}
            </ul>
            <label className="block mt-4 text-sm font-medium">Request a correction
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What is wrong, and what public source proves it?" className="mt-1 w-full border rounded-lg p-2" rows={3} />
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => { alert("Demo: correction request captured locally (not submitted). In production this goes to a human reviewer."); }} className="bg-ink text-white px-4 py-2 rounded-full text-sm">Submit correction request</button>
              <button onClick={() => { if (confirm("Delete this profile from PublicFit in this demo session?")) setDeleted(true); }} className="border border-red-300 text-red-700 px-4 py-2 rounded-full text-sm">Request profile deletion</button>
            </div>
            <p className="text-xs text-stone-500 mt-3">No SSN, private contact, or private-account data is ever collected by this demo.</p>
          </div>
        </div>
      )}
    </>
  );
}
