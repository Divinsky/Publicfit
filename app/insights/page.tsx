import { INSIGHTS, getPerson } from "@/lib/data";

// Instagram insights (instagram_manage_insights): reach, impressions,
// profile views, and follower change for a creator, last 28 days.
// Demo: seeded numbers; live when the creator's Instagram is connected.
export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Creator analytics · Instagram insights</p>
        <h1 className="font-serif text-4xl font-bold mt-2">Insights</h1>
        <p className="text-stone-600 mt-2 max-w-2xl">
          Reach, impressions, profile views, and follower change for each creator over the
          last 28 days. Demo: seeded numbers; live when the creator&apos;s Instagram is
          connected.
        </p>
      </div>
      <div className="space-y-4">
        {INSIGHTS.map((s) => {
          const p = getPerson(s.personId);
          return (
            <div key={s.personId} className="bg-white border rounded-2xl p-5">
              <h2 className="font-serif text-2xl font-bold">{p ? p.name : s.personId}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {[
                  { label: "Reach", value: s.reach.toLocaleString() },
                  { label: "Impressions", value: s.impressions.toLocaleString() },
                  { label: "Profile views", value: s.profileViews.toLocaleString() },
                  { label: "Followers", value: `${s.followers.toLocaleString()} (+${s.followerChange.toLocaleString()})` },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-sm text-stone-500">{m.label}</p>
                    <p className="text-xl font-bold">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Top posts by reach</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  {s.topPosts.map((t) => (
                    <li key={t.caption} className="flex justify-between"><span>{t.caption}</span><span className="font-semibold">{t.reach.toLocaleString()}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">Insights are the creator&apos;s own account data, shown only to them. They are never used for scoring.</p>
    </div>
  );
}
