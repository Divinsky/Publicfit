import { PEOPLE } from "@/lib/data";
import DataControls from "@/components/DataControls";
import { TrustBadges } from "@/components/Nav";

export default function Trust() {
  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-serif text-4xl font-bold">Trust, Ethics &amp; Data Controls</h1>
      <div><TrustBadges /></div>
      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">What PublicFit will — and won&apos;t — do</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Public sources only:</strong> interviews, public posts, press, past partnerships, and causes. Cited, clickable, inspectable.</li>
          <li><strong>No private accounts, no private data:</strong> no scraping private profiles, no DMs, no location or contact data.</li>
          <li><strong>No speculation on private life:</strong> relationships, health, and other private matters are out of scope, even if rumored publicly.</li>
          <li><strong>Predictions, not judgments:</strong> a Fit Score predicts whether a brand partnership fits on public evidence. It is not a rating of a person&apos;s character, and a low track-record score means only &ldquo;no documented deal found.&rdquo;</li>
          <li><strong>Human-in-the-loop:</strong> no profile or brand-match card publishes without human review (see the toggle on /predict).</li>
          <li><strong>Personalization is opt-in:</strong> fan activity is used for ranking only when the fan turns it on (see /feed).</li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-bold mb-3">Try the data controls on a seeded profile</h2>
        <div className="space-y-2">{PEOPLE.map((p) => (
          <div key={p.id} className="bg-white border rounded-xl p-4 flex justify-between items-center">
            <span><strong>{p.name}</strong> <span className="text-stone-500 text-sm">{p.role}</span></span>
            <DataControls person={p} />
          </div>
        ))}</div>
      </section>
      <p className="text-sm text-stone-500">Correction and deletion requests in this demo are captured locally and shown as a session state. In production they route to a human reviewer, and deletion removes the profile and its embeddings.</p>
    </div>
  );
}
