import "./globals.css";
import Nav from "@/components/Nav";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "PublicFit — Which brands genuinely fit?", description: "Sourced brand-fit predictions for notable people, turned into shoppable creator storefronts." };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink font-sans antialiased">
        <Nav />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="max-w-6xl mx-auto px-4 py-10 text-sm text-stone-500 border-t border-stone-200 mt-8">
          PublicFit — hackathon MVP. Scores are sourced fit <em>predictions</em>, not endorsements, character judgments, or guarantees of a deal. Public sources only.
          {" · "}<Link href="/privacypolicy" className="underline">Privacy Policy</Link>
        </footer>
      </body>
    </html>
  );
}
