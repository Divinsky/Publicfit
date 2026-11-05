import { PEOPLE } from "@/lib/data";
import DataControls from "@/components/DataControls";
import { TrustBadges } from "@/components/Nav";

const INSTAGRAM_LOGIN_URL =
  "https://www.facebook.com/dialog/oauth?client_id=1143020638649278&config_id=2080998289215472&display=popup&override_default_response_type=true&redirect_uri=https%3A%2F%2Fpublicfit.app%2Fauth%2Fcallback&response_type=code&state=%3CSTATE%3E&prompt=login";

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
      <section className="bg-white border rounded-2xl p-5 space-y-3">
        <h2 className="font-serif text-2xl font-bold text-ink">Connect your Instagram</h2>
        <p className="text-stone-700">
          Creators can connect their public Instagram account so PublicFit can verify the profile
          and power live social sources. We only read public data — profile name, bio, follower
          counts, and public posts. No private profiles, no DMs.
        </p>
        <a
          href={INSTAGRAM_LOGIN_URL}
          className="inline-block bg-ink text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90"
        >
          Connect Instagram →
        </a>
        <p className="text-sm text-stone-500">
          You&apos;ll be taken to Meta to log in and grant access, then returned here.
        </p>
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
