"use client";
import { useState } from "react";
import Link from "next/link";

// Publish to Instagram (instagram_content_publish; Page Mentions via tagging).
// Compose a photo post, optionally tag a Page, and publish. Demo: accepted
// locally; live via the Content Publishing API when connected.
export default function Publish() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [mention, setMention] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim() || busy) return;
    setBusy(true);
    setNote("");
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: imageUrl.trim(), caption: caption.trim(), mentions: mention.trim() ? [mention.trim().replace(/^@/, "")] : [] }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) {
      setNote(data.live ? `Published to Instagram (media id ${data.mediaId || "received"}).` : "Accepted (demo — not published externally; goes live via Instagram when connected).");
      setImageUrl(""); setCaption(""); setMention("");
    } else {
      setNote("Could not publish — check the image URL and caption.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator tools · Instagram publishing</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Publish</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Publish a photo post to the creator&apos;s Instagram — for example, announcing a
          new storefront. Optionally tag a Page (a Page Mention) in the caption.
        </p>
      </div>
      <form onSubmit={publish} className="bg-white border rounded-2xl p-5 space-y-3 max-w-2xl">
        <div>
          <label className="text-sm font-semibold">Image URL</label>
          <input required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…/photo.jpg" className="w-full rounded-full border px-4 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-sm font-semibold">Caption</label>
          <textarea required value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Announcing the new storefront…" rows={3} className="w-full rounded-2xl border px-4 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-sm font-semibold">Tag a Page (optional)</label>
          <input value={mention} onChange={(e) => setMention(e.target.value)} placeholder="e.g. athleta (without @)" className="w-full rounded-full border px-4 py-2 text-sm mt-1" />
          <p className="text-xs text-stone-500 mt-1">Adds @page to the caption as a Page Mention.</p>
        </div>
        <button disabled={busy} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">Publish to Instagram</button>
        {note && <p className="text-sm text-stone-600">{note}</p>}
      </form>
      <p className="text-sm text-stone-500">Only the connected creator can publish. See <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.</p>
    </div>
  );
}
