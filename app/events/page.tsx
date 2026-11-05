"use client";
import { useState } from "react";
import Link from "next/link";
import { EVENTS, PEOPLE, getPerson, type CreatorEvent } from "@/lib/data";

// Future events with a creator (instagram_manage_events): a creator hosts
// an upcoming event (live Q&A, product drop, meetup, workout) and fans
// RSVP. The creator can create an event here. Demo: seeded events and
// locally-created ones; live via the Instagram events API when connected.
export default function Events() {
  const [events, setEvents] = useState<CreatorEvent[]>(EVENTS);
  const [rsvped, setRsvped] = useState<Set<string>>(new Set());
  const [personId, setPersonId] = useState("simone-biles");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Live Q&A");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function rsvp(id: string) {
    if (rsvped.has(id)) return;
    setRsvped((prev) => new Set(prev).add(id));
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, rsvps: e.rsvps + 1 } : e)));
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date.trim() || busy) return;
    setBusy(true);
    setNote("");
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, title: title.trim(), kind, date: date.trim(), time: time.trim(), description: description.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok && data.event) {
      setEvents((prev) => [data.event, ...prev]);
      setTitle(""); setDate(""); setTime(""); setDescription("");
      setNote(data.live ? "Event created on Instagram." : "Event created (demo — kept local; goes live on Instagram when connected).");
    } else {
      setNote("Could not create the event — fill in the title and date.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator events · Future events with a creator</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Events</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Upcoming events with a creator — a live Q&amp;A, a product drop, a meetup, a
          workout. Fans RSVP here; the creator manages the event.
        </p>
      </div>

      <div className="space-y-3">
        {events.map((ev) => {
          const p = getPerson(ev.personId);
          return (
            <div key={ev.id} className="bg-white border rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{ev.kind}</p>
              <h2 className="font-serif text-2xl font-bold mt-1">{ev.title}</h2>
              <p className="text-stone-600 mt-1">with {p ? p.name : ev.personId} · {ev.date}{ev.time ? ` · ${ev.time}` : ""}</p>
              {ev.description && <p className="text-stone-700 mt-2">{ev.description}</p>}
              <p className="text-sm text-stone-500 mt-2">{ev.rsvps.toLocaleString()} RSVPs</p>
              <button
                onClick={() => rsvp(ev.id)}
                disabled={rsvped.has(ev.id)}
                className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium mt-3 disabled:opacity-50"
              >
                {rsvped.has(ev.id) ? "You're in ✓" : "RSVP"}
              </button>
            </div>
          );
        })}
      </div>

      <form onSubmit={createEvent} className="bg-white border rounded-2xl p-5 space-y-3 max-w-2xl">
        <h2 className="font-serif text-2xl font-bold">Create an event</h2>
        <div>
          <label className="text-sm font-semibold">Creator</label>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-full rounded-full border px-4 py-2 text-sm mt-1 bg-white">
            {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Live Q&A: training and recovery" className="w-full rounded-full border px-4 py-2 text-sm mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Kind</label>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full rounded-full border px-4 py-2 text-sm mt-1 bg-white">
              <option>Live Q&amp;A</option>
              <option>Product drop</option>
              <option>Meetup</option>
              <option>Workout</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Time</label>
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="6:00 PM ET" className="w-full rounded-full border px-4 py-2 text-sm mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Date</label>
          <input required value={date} onChange={(e) => setDate(e.target.value)} placeholder="Nov 12, 2026" className="w-full rounded-full border px-4 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-sm font-semibold">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happens at the event…" rows={2} className="w-full rounded-2xl border px-4 py-2 text-sm mt-1" />
        </div>
        <button disabled={busy} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">Create event</button>
        {note && <p className="text-sm text-stone-600">{note}</p>}
      </form>
      <p className="text-sm text-stone-500">See <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.</p>
    </div>
  );
}
