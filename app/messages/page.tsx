"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MESSAGES, getPerson, type DmConversation, type DmMessage } from "@/lib/data";

type Thread = DmConversation & { messages: DmMessage[] };

export default function Messages() {
  const [threads, setThreads] = useState<Thread[]>(MESSAGES as Thread[]);
  const [live, setLive] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(MESSAGES[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sentNote, setSentNote] = useState("");

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.conversations) && d.conversations.length > 0) {
          setThreads(d.conversations);
          setLive(!!d.live);
          setSelectedId((prev) => prev || d.conversations[0].id);
        }
      })
      .catch(() => { /* demo threads stay */ });
  }, []);

  const selected = threads.find((t) => t.id === selectedId) || threads[0];
  const person = selected ? getPerson(selected.personId) : undefined;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !selected || sending) return;
    setSending(true);
    setSentNote("");
    const text = draft.trim();
    setDraft("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selected.id, text }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        const msg: DmMessage = { from: "creator", text, time: "now" };
        setThreads((prev) => prev.map((t) => (t.id === selected.id ? { ...t, messages: [...t.messages, msg], preview: text } : t)));
        setSentNote(data.live ? "Sent via Instagram DM." : "Sent (demo — kept local; goes via Instagram DM once the creator's Instagram is connected).");
      }
    } catch {
      setSentNote("Could not send — try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator inbox · Instagram DMs</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Messages</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Fans and brands message a creator&apos;s storefront through Instagram. The creator reads
          the thread here and replies — the reply goes out as an Instagram DM from their
          connected account. {live ? "Live: connected to Instagram." : "Demo: conversations below are seeded; replies are kept local until the creator's Instagram is connected."}
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        <div className="space-y-2">
          {threads.map((t) => {
            const p = getPerson(t.personId);
            return (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left bg-white border rounded-xl p-4 ${t.id === selected?.id ? "border-ink ring-1 ring-ink" : ""}`}
              >
                <p className="font-semibold">{t.fromName} <span className="text-stone-500 font-normal text-sm">{t.fromHandle}</span></p>
                <p className="text-xs text-stone-500">{t.kind === "brand" ? "Brand inquiry" : "Fan"} · {p ? `to ${p.name}` : ""}</p>
                <p className="text-sm text-stone-600 mt-1 truncate">{t.preview}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white border rounded-2xl p-5 flex flex-col min-h-[420px]">
          {selected ? (
            <>
              <div className="border-b pb-3">
                <p className="font-semibold">{selected.fromName} <span className="text-stone-500 font-normal text-sm">{selected.fromHandle}</span></p>
                <p className="text-sm text-stone-500">
                  {selected.kind === "brand" ? "Brand inquiry" : "Fan message"}{person ? ` · to ${person.name}` : ""} · via Instagram DM
                </p>
              </div>
              <div className="flex-1 space-y-3 py-4">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "creator" ? "bg-ink text-white ml-auto" : "bg-stone-100"}`}>
                    <p>{m.text}</p>
                    <p className={`text-xs mt-1 ${m.from === "creator" ? "text-stone-300" : "text-stone-500"}`}>{m.time}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="flex gap-2 border-t pt-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Reply as the creator…"
                  className="flex-1 rounded-full border px-4 py-2 text-sm"
                />
                <button disabled={sending || !draft.trim()} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">
                  Send
                </button>
              </form>
              {sentNote && <p className="text-sm text-stone-500 mt-2">{sentNote}</p>}
            </>
          ) : (
            <p className="text-stone-500">Pick a conversation to read and reply.</p>
          )}
        </div>
      </div>

      <p className="text-sm text-stone-500">
        Only the creator (or their team) sees these threads, and only the threads they open.
        PublicFit never reads DMs in bulk and never uses them for scoring. See{" "}
        <Link href="/trust" className="underline">Trust &amp; Ethics</Link> and{" "}
        <Link href="/privacypolicy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
