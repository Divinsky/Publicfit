"use client";
import { useState } from "react";
import Link from "next/link";
import { COMMENTS, getPerson, type IgComment } from "@/lib/data";

// Instagram comments (instagram_manage_comments): read and reply to
// comments on a creator's posts. Demo: seeded threads; replies go via
// the Graph API when live, otherwise kept local.
export default function Comments() {
  const [comments, setComments] = useState<IgComment[]>(COMMENTS);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function reply(c: IgComment) {
    const text = (drafts[c.id] || "").trim();
    if (!text) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: c.id, text }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) {
      setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, replied: text } : x)));
      setDrafts((prev) => ({ ...prev, [c.id]: "" }));
      setNotes((prev) => ({ ...prev, [c.id]: data.live ? "Replied via Instagram." : "Replied (demo — kept local; goes live when the creator's Instagram is connected)." }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator inbox · Instagram comments</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Comments</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Comments on a creator&apos;s Instagram posts, in one place. Reply here and it goes
          out as the creator on Instagram. Demo: seeded threads; live when the creator&apos;s
          Instagram is connected.
        </p>
      </div>
      <div className="space-y-3">
        {comments.map((c) => {
          const p = getPerson(c.personId);
          return (
            <div key={c.id} className="bg-white border rounded-2xl p-5">
              <p className="text-sm text-stone-500">On &ldquo;{c.postCaption}&rdquo; · {p ? p.name : ""}</p>
              <p className="mt-2"><strong>{c.fromName}</strong> <span className="text-stone-500 text-sm">{c.fromHandle}</span> <span className="text-stone-400 text-sm">· {c.time}</span></p>
              <p className="text-stone-700 mt-1">{c.text}</p>
              {c.replied && <p className="mt-3 bg-stone-100 rounded-xl px-4 py-2 text-sm"><strong>Creator replied:</strong> {c.replied}</p>}
              {!c.replied && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={drafts[c.id] || ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    placeholder="Reply as the creator…"
                    className="flex-1 rounded-full border px-4 py-2 text-sm"
                  />
                  <button onClick={() => reply(c)} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium">Reply</button>
                </div>
              )}
              {notes[c.id] && <p className="text-sm text-stone-500 mt-2">{notes[c.id]}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">See <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.</p>
    </div>
  );
}
