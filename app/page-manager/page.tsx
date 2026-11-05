"use client";
import { useState } from "react";
import Link from "next/link";
import { PAGE_POSTS, getPerson, type PagePost } from "@/lib/data";

// Facebook Page manager (pages_read_user_content, pages_manage_posts,
// pages_manage_metadata, pages_manage_engagement): view Page posts and
// visitor posts, reply to comments, and update the Page about text.
// Demo: seeded posts; live when the Page token is connected.
export default function PageManager() {
  const [posts, setPosts] = useState<PagePost[]>(PAGE_POSTS);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [about, setAbout] = useState("PublicFit creator storefront — brand-fit predictions from cited public evidence.");
  const [note, setNote] = useState("");

  async function reply(postId: string, commentFrom: string) {
    const text = (replyDrafts[`${postId}:${commentFrom}`] || "").trim();
    if (!text) return;
    const res = await fetch("/api/page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reply", commentId: `${postId}:${commentFrom}`, text }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { from: "Page", text, time: "now" }] } : p)));
      setReplyDrafts((prev) => ({ ...prev, [`${postId}:${commentFrom}`]: "" }));
      setNote(data.live ? "Reply posted to the Page." : "Reply saved (demo — kept local; posts live when the Page is connected).");
    }
  }

  async function saveAbout(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "about", about }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) setNote(data.live ? "Page about text updated." : "About text saved (demo — kept local; updates live when the Page is connected).");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator tools · Facebook Page</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Page Manager</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          The creator&apos;s Facebook Page: its posts, visitor posts, and comments — plus the
          Page&apos;s about text. Demo: seeded posts; live when the Page is connected.
        </p>
      </div>

      <form onSubmit={saveAbout} className="bg-white border rounded-2xl p-5 max-w-2xl space-y-2">
        <label className="text-sm font-semibold">Page about text</label>
        <input value={about} onChange={(e) => setAbout(e.target.value)} className="w-full rounded-full border px-4 py-2 text-sm" />
        <button className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium">Save about text</button>
      </form>
      {note && <p className="text-sm text-stone-600">{note}</p>}

      <div className="space-y-3">
        {posts.map((p) => {
          const person = getPerson(p.personId);
          return (
            <div key={p.id} className="bg-white border rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{p.kind === "page" ? "Page post" : "Visitor post"}</p>
              <p className="font-semibold mt-1">{p.author} <span className="text-stone-500 font-normal text-sm">· {p.time} · {p.likes.toLocaleString()} likes</span></p>
              <p className="text-stone-700 mt-1">{p.text}</p>
              {person && <p className="text-sm text-stone-500 mt-1">On {person.name}&apos;s Page</p>}
              <div className="mt-3 space-y-2">
                {p.comments.map((c, i) => (
                  <p key={i} className="text-sm bg-stone-100 rounded-xl px-4 py-2"><strong>{c.from}:</strong> {c.text} <span className="text-stone-500">· {c.time}</span></p>
                ))}
                {p.comments.length > 0 && (
                  <div className="flex gap-2">
                    <input
                      value={replyDrafts[`${p.id}:${p.comments[0].from}`] || ""}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [`${p.id}:${p.comments[0].from}`]: e.target.value }))}
                      placeholder={`Reply to ${p.comments[0].from}…`}
                      className="flex-1 rounded-full border px-4 py-2 text-sm"
                    />
                    <button onClick={() => reply(p.id, p.comments[0].from)} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium">Reply</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">See <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.</p>
    </div>
  );
}
