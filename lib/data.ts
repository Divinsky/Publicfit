export type Source = { label: string; url: string; note: string };
export type Person = {
  id: string; handle: string; name: string; role: string; tagline: string;
  style: string[]; signals: string[]; audience: string; sources: Source[];
};
export type Brand = {
  id: string; name: string; category: string; tagline: string;
  style: string[]; signals: string[]; audience: string; sources: Source[];
};
export type Product = { id: string; name: string; brand: string; price: number; kind: "own" | "public-pick" | "partner"; fit: number; note: string };
export type FitScore = { overall: number; category: number; audience: number; trackRecord: number; safety: number };

// Seeded demo data. Every claim below points at a real public page.
// Nothing here is drawn from a private account, and no private-life
// speculation is included. Past-deal notes are kept to widely reported
// partnerships; everything else is labelled a *prediction*.
export const PEOPLE: Person[] = [
  {
    id: "simone-biles", handle: "simone-biles", name: "Simone Biles",
    role: "Gymnast · Olympic champion", tagline: "Mental-health advocacy, longevity in sport, and precision under pressure.",
    style: ["bold", "athletic", "clean", "confident"], signals: ["mental health", "resilience", "inclusion", "excellence"],
    audience: "Young athletes, gymnastics fans, and wellness-minded audiences.",
    sources: [
      { label: "Olympics.com — Simone Biles profile", url: "https://www.olympics.com/en/athletes/simone-biles", note: "Public career record and Olympic results." },
      { label: "Team USA — Simone Biles", url: "https://www.teamusa.com/profiles/simone-biles", note: "Public bio and competition history." },
      { label: "Athleta — Simone Biles partnership (press coverage)", url: "https://www.athleta.com/", note: "Athleta has publicly partnered with Biles; see brand press releases for deal terms." },
    ],
  },
  {
    id: "lebron-james", handle: "lebron-james", name: "LeBron James",
    role: "Basketball player · Entrepreneur", tagline: "Longevity, community investment, and athlete-as-business-builder.",
    style: ["premium", "athletic", "bold", "classic"], signals: ["education", "community", "longevity", "excellence"],
    audience: "Sports fans, sneaker culture, and audiences following athlete business ventures.",
    sources: [
      { label: "NBA.com — LeBron James profile", url: "https://www.nba.com/player/2544/lebron-james", note: "Public career record." },
      { label: "Nike — LeBron James collection", url: "https://www.nike.com/w/lebron-james-shoes", note: "Long-running, publicly documented Nike partnership." },
      { label: "I PROMISE School (LeBron James Family Foundation)", url: "https://www.lebronjamesfamilyfoundation.org/", note: "Public education and community work." },
    ],
  },
  {
    id: "emma-chamberlain", handle: "emma-chamberlain", name: "Emma Chamberlain",
    role: "Creator · Founder, Chamberlain Coffee", tagline: "Casual, candid creator voice turned coffee founder and fashion collaborator.",
    style: ["casual", "minimal", "warm", "editorial"], signals: ["authenticity", "creativity", "accessibility", "wellness"],
    audience: "Gen Z and young millennial fans of creator-led food, fashion, and lifestyle content.",
    sources: [
      { label: "Chamberlain Coffee — About", url: "https://www.chamberlaincoffee.com/", note: "Her own public brand; founder role is public." },
      { label: "Louis Vuitton — Emma Chamberlain as house ambassador (press coverage)", url: "https://www.louisvuitton.com/", note: "Ambassador role has been publicly announced by the brand." },
      { label: "Vogue — Emma Chamberlain profile coverage", url: "https://www.vogue.com/tag/celebrity/emma-chamberlain", note: "Public press coverage of her work and style." },
    ],
  },
];

export const BRANDS: Brand[] = [
  { id: "nike", name: "Nike", category: "Sportswear", tagline: "Athlete-led performance and culture.", style: ["athletic", "bold", "premium"], signals: ["excellence", "community", "resilience"], audience: "Athletes and sneaker culture worldwide.", sources: [{ label: "Nike — About", url: "https://about.nike.com/en", note: "Public brand positioning." }] },
  { id: "athleta", name: "Athleta", category: "Activewear", tagline: "Women-led activewear with a wellness mission.", style: ["clean", "athletic", "warm"], signals: ["inclusion", "wellness", "mental health"], audience: "Women athletes and wellness audiences.", sources: [{ label: "Athleta — About", url: "https://www.athleta.com/", note: "Public brand site." }] },
  { id: "adidas", name: "adidas", category: "Sportswear", tagline: "Sport, street culture, and creator collaborations.", style: ["athletic", "bold", "casual"], signals: ["creativity", "community", "excellence"], audience: "Sport and streetwear fans.", sources: [{ label: "adidas — About", url: "https://www.adidas.com/us/about.html", note: "Public brand site." }] },
  { id: "gatorade", name: "Gatorade", category: "Sports nutrition", tagline: "Fuel for training and competition.", style: ["athletic", "bold"], signals: ["excellence", "longevity"], audience: "Athletes and sports fans.", sources: [{ label: "Gatorade — About", url: "https://www.gatorade.com/", note: "Public brand site." }] },
  { id: "beats", name: "Beats by Dre", category: "Audio", tagline: "Sound, sport, and music culture.", style: ["bold", "premium", "classic"], signals: ["creativity", "community"], audience: "Music and sports fans.", sources: [{ label: "Beats by Dre", url: "https://www.beatsbydre.com/", note: "Public brand site." }] },
  { id: "louis-vuitton", name: "Louis Vuitton", category: "Luxury fashion", tagline: "Heritage luxury with creator ambassadors.", style: ["premium", "editorial", "classic"], signals: ["creativity", "excellence"], audience: "Luxury and fashion audiences.", sources: [{ label: "Louis Vuitton", url: "https://www.louisvuitton.com/", note: "Public brand site." }] },
  { id: "alo-yoga", name: "Alo Yoga", category: "Activewear / wellness", tagline: "Mindful movement and studio-to-street style.", style: ["clean", "minimal", "warm"], signals: ["wellness", "mental health", "inclusion"], audience: "Yoga, pilates, and wellness audiences.", sources: [{ label: "Alo Yoga", url: "https://www.aloyoga.com/", note: "Public brand site." }] },
  { id: "dove", name: "Dove", category: "Personal care", tagline: "Real-beauty and self-esteem campaigns.", style: ["clean", "warm", "minimal"], signals: ["inclusion", "mental health", "authenticity"], audience: "Broad, wellness-minded consumers.", sources: [{ label: "Dove — Real Beauty", url: "https://www.dove.com/us/en/stories/about-dove.html", note: "Public campaign positioning." }] },
  { id: "spotify", name: "Spotify", category: "Audio / media", tagline: "Creator audio, podcasts, and music discovery.", style: ["casual", "editorial", "bold"], signals: ["creativity", "authenticity", "community"], audience: "Listeners and creator-audio fans.", sources: [{ label: "Spotify — About", url: "https://newsroom.spotify.com/company-info/", note: "Public company info." }] },
  { id: "whoop", name: "WHOOP", category: "Wearables / recovery", tagline: "Recovery, strain, and sleep for high performers.", style: ["clean", "athletic", "minimal"], signals: ["longevity", "wellness", "excellence"], audience: "Athletes and performance-minded consumers.", sources: [{ label: "WHOOP", url: "https://www.whoop.com/", note: "Public brand site." }] },
];

// Hand-tuned demo affinities (used only when no live API key is set).
// Keys are personId -> brandId -> [category, audience, trackRecord, safety].
const AFFINITY: Record<string, Record<string, [number, number, number, number]>> = {
  "simone-biles": {
    athleta: [96, 92, 95, 90], "alo-yoga": [93, 88, 62, 92], dove: [91, 84, 58, 94],
    nike: [88, 90, 70, 88], adidas: [80, 82, 55, 86], whoop: [85, 78, 50, 90],
    gatorade: [82, 85, 60, 88], beats: [70, 72, 45, 84], spotify: [65, 70, 40, 90], "louis-vuitton": [55, 60, 35, 80],
  },
  "lebron-james": {
    nike: [95, 97, 98, 88], beats: [88, 90, 85, 84], gatorade: [86, 90, 80, 86],
    whoop: [84, 80, 55, 88], adidas: [70, 75, 40, 82], athleta: [60, 55, 30, 88],
    spotify: [78, 82, 50, 88], "louis-vuitton": [72, 68, 45, 80], dove: [60, 58, 35, 90], "alo-yoga": [55, 50, 30, 88],
  },
  "emma-chamberlain": {
    "louis-vuitton": [90, 92, 94, 86], spotify: [92, 90, 70, 90], dove: [85, 84, 55, 92],
    "alo-yoga": [84, 86, 52, 90], athleta: [76, 78, 45, 90], nike: [70, 74, 48, 86],
    adidas: [78, 80, 50, 86], beats: [72, 76, 42, 86], whoop: [68, 62, 38, 88], gatorade: [50, 52, 30, 86],
  },
};

export function seededFit(personId: string, brandId: string): FitScore | null {
  const row = AFFINITY[personId]?.[brandId];
  if (!row) return null;
  const [category, audience, trackRecord, safety] = row;
  return { category, audience, trackRecord, safety, overall: Math.round(category * 0.3 + audience * 0.3 + trackRecord * 0.2 + safety * 0.2) };
}

export function rankedBrands(personId: string) {
  return BRANDS.map((b) => ({ brand: b, score: seededFit(personId, b.id) }))
    .filter((x): x is { brand: Brand; score: FitScore } => !!x.score)
    .sort((a, b) => b.score.overall - a.score.overall);
}

export const STOREFRONTS: Record<string, Product[]> = {
  "simone-biles": [
    { id: "sb1", name: "Salutation Stash Pocket Tight (sample pick)", brand: "Athleta", price: 109, kind: "partner", fit: 94, note: "High-fit partner item; style and category overlap documented in the Predictor." },
    { id: "sb2", name: "Recovery & training journal (public-pick category)", brand: "Editor's pick", price: 28, kind: "public-pick", fit: 82, note: "Sample category a fan storefront would stock; replace with a sourced public mention before launch." },
  ],
  "lebron-james": [
    { id: "lj1", name: "LeBron signature shoe (sample pick)", brand: "Nike", price: 180, kind: "partner", fit: 97, note: "Long-running public Nike partnership; see Predictor citations." },
    { id: "lj2", name: "Studio headphones (sample pick)", brand: "Beats by Dre", price: 349, kind: "partner", fit: 89, note: "High-fit audio + sport-culture overlap." },
  ],
  "emma-chamberlain": [
    { id: "ec1", name: "Steeped coffee bags (sample pick)", brand: "Chamberlain Coffee", price: 18, kind: "own", fit: 98, note: "Her own public brand." },
    { id: "ec2", name: "Everyday tote (sample pick)", brand: "Louis Vuitton", price: 0, kind: "partner", fit: 91, note: "Shown as a partner category only — price intentionally blank in demo; no checkout is live." },
  ],
};

export function getPerson(idOrHandle: string) {
  return PEOPLE.find((p) => p.id === idOrHandle || p.handle === idOrHandle);
}
export function getBrand(id: string) { return BRANDS.find((b) => b.id === id); }
