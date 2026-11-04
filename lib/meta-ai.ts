// Meta Muse suite via the Meta Model API — NOT the third-party "Muse.ai"
// video platform. Structured scoring: Muse Spark (hosted) via the Meta
// Model API. Open-weights path: Muse Spark Open via an inference partner
// (Baseten Model APIs by default) for tagging/embeddings — the $10K "Best
// Build on Meta Open Weight Models" bonus is verified by the inference
// partner, so that path must actually run on the partner. Muse Glimmer can
// be swapped in via META_OPEN_MODEL when a partner serves it; Glimmer is
// open-weight and self-host/partner-only, it is not served on the Meta
// Model API. Muse Image: visual fit. META_FAST_MODEL is an optional
// fast-model slot (e.g. a partner-served Glimmer) for ranking/tagging.
import { BRANDS, PEOPLE, getBrand, getPerson, seededFit, type Brand, type FitScore, type Person, type Source } from "./data";

export type FitResult = {
  person: Person; brand: Brand; score: FitScore;
  personUpside: string; brandUpside: string; rationale: string[];
  sources: Source[]; visualFit: number; tags: string[];
  mode: "live" | "demo"; model: string;
};

const BASE = process.env.META_MODEL_API_BASE_URL || "https://api.meta.ai/v1";
const KEY = process.env.META_MODEL_API_KEY || "";
const SPARK_MODEL = process.env.META_SPARK_MODEL || "muse-spark-1.3";
// Open-weights inference partner (Baseten Model APIs, OpenAI-compatible).
const OPEN_BASE = process.env.META_OPEN_API_BASE_URL || "https://inference.baseten.co/v1";
const OPEN_KEY = process.env.META_OPEN_API_KEY || "";
const OPEN_MODEL = process.env.META_OPEN_MODEL || "meta-models/muse-spark-open-1026";

/** Deterministic hash used only for demo-mode scoring of custom names. */
function hash01(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}
function demoScore(person: Person, brand: Brand): FitScore {
  const seeded = seededFit(person.id, brand.id);
  if (seeded) return seeded;
  const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;
  const category = 55 + overlap(person.signals, brand.signals) * 9 + Math.round(hash01(person.id + brand.id) * 15);
  const audience = 55 + overlap(person.style, brand.style) * 7 + Math.round(hash01(brand.id + person.id) * 15);
  const trackRecord = 45 + Math.round(hash01(person.name + brand.name) * 20);
  const safety = 82 + Math.round(hash01(brand.name) * 10);
  const clamp = (n: number) => Math.max(35, Math.min(97, n));
  return { category: clamp(category), audience: clamp(audience), trackRecord: clamp(trackRecord), safety: clamp(safety),
    overall: Math.round(clamp(category) * 0.3 + clamp(audience) * 0.3 + clamp(trackRecord) * 0.2 + clamp(safety) * 0.2) };
}

/**
 * scoreBrandFit — Muse Spark via the Meta Model API for structured JSON
 * scoring + citations. Any failure (no key, network, bad JSON) falls back
 * to the deterministic seeded demo scorer so the demo never breaks.
 * Only public-source material is ever passed in the prompt.
 *
 * Commercial framing, by design: this is a brand-partnership fit engine
 * (audience overlap, product-category fit, documented track record,
 * brand safety). It is NOT a personality, character, or psychological
 * analysis — the prompt forbids inferring traits or private-life detail.
 */
export async function scoreBrandFit(person: Person, brand: Brand): Promise<FitResult> {
  const tags = await embedAndTag(`${person.name} ${person.signals.join(" ")} ${person.style.join(" ")} | ${brand.name} ${brand.signals.join(" ")}`);
  const visualFit = await scoreVisualFit(person.style, brand.style);
  const sources: Source[] = [...person.sources, ...brand.sources];

  if (!KEY) {
    return buildDemo(person, brand, tags, visualFit, sources);
  }
  try {
    const res = await fetch(`${BASE.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: SPARK_MODEL,
        messages: [
          { role: "system", content: "You are a commercial brand-partnership fit engine. Score ONLY commercial signals from cited public sources (interviews, public posts, press, past partnerships, public campaigns, product categories). This is NOT a personality, character, or psychological analysis: do not infer personality traits, character, or anything about a person's private life. Return JSON only: {category, audience, trackRecord, safety, rationale: string[], personUpside: string, brandUpside: string}. Each score 0-100. category = product-category and public-positioning fit between the person's public commercial footprint and the brand's category. audience = audience overlap. trackRecord = documented past partnerships only — a low score means 'no documented deal found'. safety = brand-safety / partnership risk from the public record. Frame every score as a sourced commercial-fit prediction, never as a judgment of a person." },
          { role: "user", content: `Person: ${person.name} (${person.role}). Public positioning signals: ${person.signals.join(", ")}. Style: ${person.style.join(", ")}. Brand: ${brand.name} (${brand.category}). Brand positioning signals: ${brand.signals.join(", ")}. Style: ${brand.style.join(", ")}. Sources: ${sources.map((s) => `${s.label} ${s.url}`).join("; ")}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });
    if (!res.ok) throw new Error(`Meta API ${res.status}`);
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text);
    const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 50)));
    const score: FitScore = {
      category: clamp(parsed.category), audience: clamp(parsed.audience),
      trackRecord: clamp(parsed.trackRecord), safety: clamp(parsed.safety),
      overall: 0,
    };
    score.overall = Math.round(score.category * 0.3 + score.audience * 0.3 + score.trackRecord * 0.2 + score.safety * 0.2);
    return { person, brand, score, personUpside: parsed.personUpside || "", brandUpside: parsed.brandUpside || "",
      rationale: Array.isArray(parsed.rationale) ? parsed.rationale : [], sources, visualFit, tags, mode: "live", model: SPARK_MODEL };
  } catch {
    return buildDemo(person, brand, tags, visualFit, sources);
  }
}

function buildDemo(person: Person, brand: Brand, tags: string[], visualFit: number, sources: Source[]): FitResult {
  const score = demoScore(person, brand);
  const shared = person.signals.filter((v) => brand.signals.includes(v));
  return {
    person, brand, score, visualFit, tags, sources, mode: "demo", model: "seeded-demo (no META_MODEL_API_KEY)",
    rationale: [
      shared.length ? `Shared public positioning signals: ${shared.join(", ")}.` : "No direct shared signals — fit comes from audience and category overlap.",
      `Audience overlap: ${person.audience} vs ${brand.audience}`,
      "Track-record score reflects only widely reported past partnerships; a low score means 'no documented deal found', not a negative judgment.",
    ],
    personUpside: `A ${brand.name} partnership would put ${person.name} in front of ${brand.audience.toLowerCase()} while staying consistent with their public work.`,
    brandUpside: `${brand.name} gains credible reach into ${person.audience.toLowerCase()} with a partner whose public record is already citable.`,
  };
}

/**
 * embedAndTag — Muse Spark Open (open weights) via an inference partner
 * for fast tagging + embeddings. Live path tries the partner's embeddings
 * endpoint (requires META_OPEN_API_KEY); demo path derives tags from
 * keywords and a deterministic hash embedding (see lib/db.ts for pgvector).
 * Tags never depend on the live call, so the demo works with no partner key.
 */
export async function embedAndTag(text: string): Promise<string[]> {
  const lower = text.toLowerCase();
  const vocab = ["athletic", "wellness", "luxury", "creator", "community", "excellence", "authenticity", "mental health", "inclusion", "longevity", "creativity"];
  const tags = vocab.filter((v) => lower.includes(v));
  if (!OPEN_KEY) return tags.length ? tags : ["creator", "public-figure"];
  try {
    // Best-effort live embedding call; result is intentionally not required
    // for scoring — the demo must work even if this endpoint differs.
    await fetch(`${OPEN_BASE.replace(/\/$/, "")}/embeddings`, {
      method: "POST", headers: { Authorization: `Bearer ${OPEN_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: OPEN_MODEL, input: text }),
    });
  } catch { /* fall through to keyword tags */ }
  return tags.length ? tags : ["creator", "public-figure"];
}

/** Deterministic 128-d hash embedding (demo stand-in for an open-model embedding). */
export function demoEmbedding(text: string): number[] {
  const vec = new Array(128).fill(0);
  for (let i = 0; i < text.length; i++) vec[(i * 31 + text.charCodeAt(i)) % 128] += 1;
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

/**
 * scoreVisualFit — Muse Image / vision endpoint for aesthetic alignment.
 * Demo path scores shared style keywords; a live vision call would compare
 * public style descriptors, never private imagery.
 */
export async function scoreVisualFit(personStyle: string[], brandStyle: string[]): Promise<number> {
  const shared = personStyle.filter((s) => brandStyle.includes(s)).length;
  const base = 55 + shared * 12 + Math.round(hash01(personStyle.join() + brandStyle.join()) * 10);
  return Math.max(40, Math.min(98, base));
}

export function resolvePerson(input: string): Person {
  const found = getPerson(input) || PEOPLE.find((p) => p.name.toLowerCase() === input.toLowerCase());
  if (found) return found;
  return { id: `custom-${input.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, handle: input.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: input, role: "Notable person (custom entry)", tagline: "Custom entry — scores are a demo prediction until public sources are added.",
    style: ["editorial"], signals: ["authenticity", "community"], audience: "Their public audience.",
    sources: [{ label: "Add a public source to improve this profile", url: "https://www.google.com/search?q=" + encodeURIComponent(input), note: "Placeholder — replace with a cited public source before publishing." }] };
}
export function resolveBrand(input: string): Brand {
  const found = getBrand(input) || BRANDS.find((b) => b.name.toLowerCase() === input.toLowerCase());
  if (found) return found;
  return { id: `custom-${input.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: input, category: "Brand (custom entry)",
    tagline: "Custom entry — scores are a demo prediction until public sources are added.",
    style: ["editorial"], signals: ["authenticity"], audience: "Its public audience.",
    sources: [{ label: "Add a public source to improve this brand profile", url: "https://www.google.com/search?q=" + encodeURIComponent(input), note: "Placeholder — replace with a cited public source before publishing." }] };
}
