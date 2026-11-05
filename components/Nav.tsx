import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-stone-200 bg-cream/90 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">PublicFit<span className="text-accent">.</span></Link>
        <nav className="flex flex-wrap gap-5 text-sm font-medium">
          <Link href="/predict">Brand Fit Predictor</Link>
          <Link href="/store/simone-biles">Storefronts</Link>
          <Link href="/feed">Fan Feed</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/comments">Comments</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/publish">Publish</Link>
          <Link href="/page-manager">Page</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/branded-content">Branded Content</Link>
          <Link href="/waitlist">Waitlist</Link>
          <Link href="/trust">Trust &amp; Ethics</Link>
        </nav>
        <Link href="/predict" className="bg-ink text-white px-4 py-2 rounded-full text-sm">Try the predictor →</Link>
      </div>
    </header>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {["Public sources only", "No private accounts", "No private-life speculation", "Prediction, not a judgment"].map((b) => (
        <span key={b} className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full">✓ {b}</span>
      ))}
    </div>
  );
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span>{label}</span><span className="font-semibold">{value}</span></div>
      <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-accent" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
