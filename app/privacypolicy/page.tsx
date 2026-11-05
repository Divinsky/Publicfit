export const metadata = {
  title: "Privacy Policy — PublicFit",
  description: "How PublicFit collects, uses, and protects information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">Privacy Policy</h1>
        <p className="text-stone-500 text-sm mt-2">Last updated: November 5, 2026</p>
      </div>

      <section className="space-y-3 text-stone-700">
        <p>
          PublicFit is a hackathon MVP operated by Irina Divinsky (IntelliGene AI). It predicts
          brand–creator fit from cited public evidence and turns strong matches into claimable
          creator storefronts. This policy explains what we collect, what we don&apos;t, and how to
          reach us.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">What we collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Waitlist:</strong> if you join the waitlist or request onboarding, we ask for
            your email address and whether you are a notable person or a fan / brand. In the
            current demo, waitlist submissions are not saved to a database — the confirmation is
            generated and no waitlist is retained. If storage is enabled in a production version,
            we will update this policy first and use the address only to contact you about access.
          </li>
          <li>
            <strong>Storefront claims:</strong> if you claim a storefront, we receive the public
            handle you submit. In the demo, claims are accepted locally only and are not stored.
            In production, we verify identity before any transfer.
          </li>
          <li>
            <strong>Predictions:</strong> when you run a prediction, the creator and brand names
            you enter are sent to our AI providers (Meta and Baseten) to generate the score. We do
            not store your prediction inputs.
          </li>
          <li>
            <strong>Public social data:</strong> when live social sources are connected, we read
            public Instagram and Facebook data (profile name, bio, follower counts, public Page
            information) through Meta&apos;s Graph API. We only use public data — no private
            profiles, location, or contact details. Direct messages are handled separately, only
            through the Messages feature (see below).
          </li>
          <li>
            <strong>Instagram messages:</strong> when a creator uses Messages, we read the
            direct-message threads they open and send the replies they write, through the
            Instagram Messaging API, using their connected account. Only the threads the creator
            opens are read, only at their request, and messages are never used for scoring. In
            the demo, conversations are seeded and replies are kept local; nothing is sent
            externally.
          </li>
          <li>
            <strong>Instagram comments:</strong> when a creator uses Comments, we read the
            comments on their Instagram posts and send the replies they write, through the
            Graph API. Only the comments on their own posts are read, only at their request.
            In the demo, comments are seeded and replies are kept local.
          </li>
          <li>
            <strong>Instagram insights:</strong> when a creator views Insights, we read their
            own account insights (reach, impressions, profile views, follower change) through
            the Graph API. This is the creator&apos;s own account data, shown only to them, and
            never used for scoring. In the demo, numbers are seeded.
          </li>
          <li>
            <strong>Publishing:</strong> when a creator publishes, we post the photo and
            caption they provide to their Instagram, and tag any Page they name (a Page
            Mention). Only what they provide is posted, only at their request. In the demo,
            posts are accepted locally and not published externally.
          </li>
          <li>
            <strong>Facebook Page:</strong> when a creator uses Page Manager, we read their
            Facebook Page posts, visitor posts, and comments, and update the Page about text
            they provide, through the Graph API. Only their own Page is accessed. In the demo,
            posts are seeded and changes are kept local.
          </li>
          <li>
            <strong>Events:</strong> when a creator creates an event, we store the event
            details they provide (title, kind, date, time, description) so fans can see it and
            RSVP. In the demo, events are seeded and created locally; nothing is posted
            externally.
          </li>
          <li>
            <strong>Correction and deletion requests:</strong> you can ask us to correct or delete
            a profile. In the demo, requests are captured as local session state. In production,
            they go to a human reviewer, and deletion removes the profile and its embeddings.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">What we do not collect</h2>
        <p>
          We do not collect private account data, location data, payment
          information, or passwords. There is no account or login on this site. Direct messages
          are only read and sent through the Messages feature, with the connected creator&apos;s
          permission, and only for the threads they open. We do not sell
          personal information, and we do not use it for advertising.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">How we use information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To generate fit scores and storefronts from public evidence.</li>
          <li>To respond to waitlist, onboarding, claim, correction, and deletion requests.</li>
          <li>To operate and secure the site.</li>
        </ul>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Third parties</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Cloudflare</strong> hosts the site (Workers) and may set security cookies to
            protect it.
          </li>
          <li>
            <strong>Meta</strong> provides the AI scoring (Muse Spark) and, when connected, public
            Instagram and Facebook data.
          </li>
          <li>
            <strong>Baseten</strong> provides open-model inference for tagging.
          </li>
        </ul>
        <p>These providers process data only to provide their services to us.</p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Cookies</h2>
        <p>
          We do not use analytics or advertising cookies. Our host may set security cookies. Your
          browser settings can block cookies; the site will still work.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Retention</h2>
        <p>
          Demo data is not retained beyond the session. In production, we will retain waitlist and
          claim information only as long as needed for access and support, and delete it on request.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Your choices</h2>
        <p>
          Leave the waitlist anytime by contacting us. Request correction or deletion of a profile,
          or a copy of information we hold about you, by contacting us. We will respond and, in
          production, route the request to a human reviewer.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Children</h2>
        <p>
          PublicFit is not directed at children under 13, and we do not knowingly collect
          information from them.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Changes</h2>
        <p>
          If this policy changes, we will update the date above and note the change here.
        </p>
      </section>

      <section className="space-y-3 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-ink">Contact</h2>
        <p>
          For privacy questions or requests, contact us at parked@parkpiggy.app.
        </p>
      </section>
    </div>
  );
}
