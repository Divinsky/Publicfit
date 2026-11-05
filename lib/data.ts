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
  {
    id: "taylor-swift", handle: "taylor-swift", name: "Taylor Swift",
    role: "Singer-songwriter", tagline: "Storytelling, reinvention, and one of the largest live audiences in music.",
    style: ["editorial", "classic", "bold", "warm"], signals: ["creativity", "community", "authenticity", "excellence"],
    audience: "Music fans, pop culture audiences, and live-event crowds.",
    sources: [
      { label: "Taylor Swift — Official site", url: "https://www.taylorswift.com/", note: "Her own public site." },
      { label: "Taylor Swift — Wikipedia", url: "https://en.wikipedia.org/wiki/Taylor_Swift", note: "Public career record." },
      { label: "Capital One — Taylor Swift partnership (press coverage)", url: "https://www.capitalone.com/", note: "Capital One has publicly partnered with Swift; see brand press releases for deal terms." },
    ],
  },
  {
    id: "beyonce", handle: "beyonce", name: "Beyoncé",
    role: "Singer · Founder, Parkwood Entertainment", tagline: "Artistry, heritage, and large-scale cultural moments.",
    style: ["premium", "editorial", "bold", "classic"], signals: ["creativity", "excellence", "community", "authenticity"],
    audience: "Music fans, fashion audiences, and cultural-event crowds.",
    sources: [
      { label: "Beyoncé — Official site", url: "https://www.beyonce.com/", note: "Her own public site." },
      { label: "Parkwood Entertainment", url: "https://www.parkwoodentertainment.com/", note: "Her own public company." },
      { label: "adidas — Ivy Park partnership (press coverage)", url: "https://www.adidas.com/us/about.html", note: "Ivy Park partnership publicly documented; see brand press releases." },
    ],
  },
  {
    id: "mrbeast", handle: "mrbeast", name: "MrBeast",
    role: "Creator · Founder, Feastables", tagline: "Large-scale challenges, philanthropy, and creator-led commerce.",
    style: ["bold", "casual", "editorial"], signals: ["creativity", "community", "authenticity", "excellence"],
    audience: "Gen Z and young millennial YouTube audiences.",
    sources: [
      { label: "MrBeast — YouTube", url: "https://www.youtube.com/@MrBeast", note: "His public channel." },
      { label: "Feastables — About", url: "https://www.feastables.com/", note: "His own public brand." },
      { label: "MrBeast — Official site", url: "https://www.mrbeast.com/", note: "His own public site." },
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
  { id: "coca-cola", name: "Coca-Cola", category: "Beverages", tagline: "Global beverages and cultural moments.", style: ["classic", "bold", "warm"], signals: ["community", "creativity", "excellence"], audience: "Broad global consumers.", sources: [{ label: "Coca-Cola — About", url: "https://www.coca-cola.com/", note: "Public brand site." }] },
  { id: "sephora", name: "Sephora", category: "Beauty retail", tagline: "Beauty retail and creator-led launches.", style: ["editorial", "premium", "clean"], signals: ["creativity", "authenticity", "community"], audience: "Beauty and lifestyle shoppers.", sources: [{ label: "Sephora", url: "https://www.sephora.com/", note: "Public brand site." }] },
  { id: "gymshark", name: "Gymshark", category: "Activewear", tagline: "Creator-led fitness apparel.", style: ["athletic", "bold", "casual"], signals: ["community", "creativity", "wellness"], audience: "Fitness creators and gym audiences.", sources: [{ label: "Gymshark", url: "https://www.gymshark.com/", note: "Public brand site." }] },
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
  "taylor-swift": {
    spotify: [92, 94, 85, 90], "coca-cola": [85, 88, 60, 90], sephora: [80, 85, 55, 90],
    nike: [82, 88, 65, 86], dove: [82, 86, 50, 92], beats: [75, 80, 50, 84],
    "louis-vuitton": [78, 80, 45, 80], athleta: [70, 72, 40, 90], "alo-yoga": [65, 68, 35, 90],
    adidas: [68, 70, 35, 86], gymshark: [60, 65, 30, 88], whoop: [55, 55, 30, 88], gatorade: [55, 58, 30, 88],
  },
  "beyonce": {
    adidas: [90, 92, 88, 86], "coca-cola": [88, 90, 75, 88], sephora: [85, 88, 60, 90],
    "louis-vuitton": [85, 86, 60, 80], athleta: [78, 82, 65, 90], spotify: [82, 86, 55, 90],
    nike: [80, 85, 55, 86], beats: [80, 84, 60, 84], dove: [80, 84, 55, 92],
    gatorade: [70, 75, 50, 88], "alo-yoga": [70, 74, 40, 90], gymshark: [62, 65, 35, 88], whoop: [60, 60, 35, 88],
  },
  "mrbeast": {
    spotify: [85, 88, 60, 90], beats: [82, 86, 60, 84], gatorade: [80, 84, 50, 88],
    nike: [78, 82, 55, 86], "coca-cola": [75, 80, 45, 86], adidas: [72, 76, 45, 86],
    gymshark: [70, 75, 40, 86], whoop: [65, 68, 35, 88], athleta: [55, 58, 30, 90],
    dove: [55, 58, 30, 92], "alo-yoga": [50, 52, 25, 90], sephora: [45, 48, 25, 88], "louis-vuitton": [40, 45, 20, 80],
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
  "taylor-swift": [
    { id: "ts1", name: "Vinyl record (sample pick)", brand: "Spotify", price: 32, kind: "partner", fit: 93, note: "High-fit audio + music-culture overlap." },
    { id: "ts2", name: "Everyday lip (sample pick)", brand: "Sephora", price: 0, kind: "partner", fit: 85, note: "Shown as a partner category only — price intentionally blank in demo; no checkout is live." },
  ],
  "beyonce": [
    { id: "b1", name: "Ivy Park hoodie (sample pick)", brand: "adidas", price: 120, kind: "partner", fit: 91, note: "Publicly documented Ivy Park partnership; see Predictor citations." },
    { id: "b2", name: "Fragrance (sample pick)", brand: "Sephora", price: 0, kind: "partner", fit: 86, note: "Shown as a partner category only — price intentionally blank in demo; no checkout is live." },
  ],
  "mrbeast": [
    { id: "mb1", name: "Chocolate bar multipack (sample pick)", brand: "Feastables", price: 24, kind: "own", fit: 96, note: "His own public brand." },
    { id: "mb2", name: "Studio headphones (sample pick)", brand: "Beats by Dre", price: 349, kind: "partner", fit: 87, note: "High-fit audio + creator-culture overlap." },
  ],
};

export function getPerson(idOrHandle: string) {
  return PEOPLE.find((p) => p.id === idOrHandle || p.handle === idOrHandle);
}
export function getBrand(id: string) { return BRANDS.find((b) => b.id === id); }

// Seeded demo Instagram DM conversations for the Messages inbox.
// Senders are fictional (a fan, a small brand) and the threads are
// illustrative only — they are not real DMs. When a creator's Instagram
// is connected, live threads replace these via the Graph API.
export type DmMessage = { from: "them" | "creator"; text: string; time: string };
export type DmConversation = {
  id: string; personId: string; fromName: string; fromHandle: string; kind: "fan" | "brand";
  preview: string; messages: DmMessage[]; recipientIgId?: string;
};
export const MESSAGES: DmConversation[] = [
  {
    id: "dm-simone-1", personId: "simone-biles", fromName: "Maya R.", fromHandle: "@maya.runs", kind: "fan",
    preview: "Hi! Is the Athleta tight from your storefront true to size?",
    messages: [
      { from: "them", text: "Hi! I love your storefront — is the Athleta tight from it true to size?", time: "Tue 10:14" },
      { from: "creator", text: "Hi Maya! I wear a small and it fits true to size. The pocket is great for a phone on runs.", time: "Tue 10:31" },
      { from: "them", text: "Perfect, ordering it now. Thank you!", time: "Tue 10:33" },
    ],
  },
  {
    id: "dm-emma-1", personId: "emma-chamberlain", fromName: "North Roast Coffee", fromHandle: "@northroast", kind: "brand",
    preview: "We'd love to talk about a tasting collab for Chamberlain Coffee fans.",
    messages: [
      { from: "them", text: "Hi Emma! We're a small roaster and we'd love to talk about a tasting collab for Chamberlain Coffee fans.", time: "Mon 15:02" },
      { from: "them", text: "Happy to send samples and a one-pager — no pressure at all.", time: "Mon 15:03" },
    ],
  },
  {
    id: "dm-lebron-1", personId: "lebron-james", fromName: "Dre K.", fromHandle: "@dre.kicks", kind: "fan",
    preview: "That LeBron shoe on your storefront — is it the same colorway as the Finals pair?",
    messages: [
      { from: "them", text: "That LeBron shoe on your storefront — is it the same colorway as the Finals pair?", time: "Sun 18:40" },
    ],
  },
];

// Seeded demo Instagram comments on a creator's posts (instagram_manage_comments).
// Commenters are fictional; the threads are illustrative only.
export type IgComment = { id: string; personId: string; postCaption: string; fromName: string; fromHandle: string; text: string; time: string; replied?: string };
export const COMMENTS: IgComment[] = [
  { id: "c1", personId: "simone-biles", postCaption: "Back in the gym — new training block.", fromName: "Jess T.", fromHandle: "@jess.trains", text: "This is so inspiring. What do you wear for training?", time: "2h" },
  { id: "c2", personId: "simone-biles", postCaption: "Back in the gym — new training block.", fromName: "Ari P.", fromHandle: "@ari.plays", text: "The Athleta set from your storefront is my favorite!", time: "5h", replied: "Thank you! It's the one I train in most days." },
  { id: "c3", personId: "emma-chamberlain", postCaption: "Morning coffee, as usual.", fromName: "Sam W.", fromHandle: "@sam.wakes", text: "Is this the new Chamberlain roast?", time: "1h" },
  { id: "c4", personId: "lebron-james", postCaption: "Game day.", fromName: "Chris D.", fromHandle: "@chris.dunks", text: "Those shoes are clean. Link?", time: "3h" },
];

// Seeded demo Instagram insights (instagram_manage_insights), last 28 days.
export type IgInsights = { personId: string; reach: number; impressions: number; profileViews: number; followers: number; followerChange: number; topPosts: { caption: string; reach: number }[] };
export const INSIGHTS: IgInsights[] = [
  { personId: "simone-biles", reach: 4820000, impressions: 12400000, profileViews: 318000, followers: 11200000, followerChange: 42000, topPosts: [{ caption: "Back in the gym — new training block.", reach: 2100000 }, { caption: "Mental health check-in.", reach: 1800000 }] },
  { personId: "emma-chamberlain", reach: 3900000, impressions: 9800000, profileViews: 264000, followers: 16400000, followerChange: 31000, topPosts: [{ caption: "Morning coffee, as usual.", reach: 1900000 }, { caption: "New Chamberlain Coffee drop.", reach: 1500000 }] },
  { personId: "lebron-james", reach: 9100000, impressions: 24100000, profileViews: 502000, followers: 159000000, followerChange: 88000, topPosts: [{ caption: "Game day.", reach: 4200000 }, { caption: "Community court opening.", reach: 3100000 }] },
];

// Seeded demo Facebook Page posts (pages_*): Page posts, visitor posts,
// and comments on them. All illustrative.
export type PagePost = { id: string; personId: string; kind: "page" | "visitor"; author: string; text: string; time: string; likes: number; comments: { from: string; text: string; time: string }[] };
export const PAGE_POSTS: PagePost[] = [
  { id: "pp1", personId: "simone-biles", kind: "page", author: "Simone Biles", text: "New training block starts today. Storefront is stocked with the pieces I actually train in.", time: "Tue 09:00", likes: 18400, comments: [{ from: "Maya R.", text: "Ordering the tight today!", time: "Tue 10:14" }] },
  { id: "pp2", personId: "simone-biles", kind: "visitor", author: "Jess T.", text: "Tried the recovery journal from the storefront — love it.", time: "Mon 18:20", likes: 212, comments: [] },
  { id: "pp3", personId: "emma-chamberlain", kind: "page", author: "Emma Chamberlain", text: "Morning coffee, as usual. New roast is in the storefront.", time: "Mon 08:00", likes: 22100, comments: [{ from: "Sam W.", text: "Is this the new roast?", time: "Mon 09:12" }] },
];

// Seeded demo branded-content requests (facebook_branded_content_ads_brand):
// a brand asks to boost a creator's post as a branded-content ad.
export type BrandedRequest = { id: string; personId: string; brandId: string; postCaption: string; note: string; status: "pending" | "approved" };
export const BRANDED_REQUESTS: BrandedRequest[] = [
  { id: "br1", personId: "simone-biles", brandId: "athleta", postCaption: "Back in the gym — new training block.", note: "Athleta asks to boost this post as a branded-content ad for 14 days.", status: "pending" },
  { id: "br2", personId: "emma-chamberlain", brandId: "louis-vuitton", postCaption: "Morning coffee, as usual.", note: "Louis Vuitton asks to boost this post as a branded-content ad for 7 days.", status: "pending" },
];
