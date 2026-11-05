import { PEOPLE, BRANDS } from "./data";
import { demoEmbedding } from "./meta-ai";

/**
 * Postgres + pgvector store (schema.sql). When DATABASE_URL is unset —
 * the default for the hackathon demo — this module returns the seeded
 * in-memory data, so the app runs out of the box. Wire up DATABASE_URL
 * and a `pg` client to replace these functions with real queries;
 * the shape (people/brands with embedding vectors) is unchanged.
 * DATABASE_URL is read per call: on Workers, process.env is empty at
 * module scope even when the secret is set.
 */
function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || "";
}

export function usingPostgres(): boolean {
  return Boolean(getDatabaseUrl());
}

export function listPeople() { return PEOPLE; }
export function listBrands() { return BRANDS; }

/** Cosine similarity between two demo embeddings. */
export function cosine(a: number[], b: number[]) {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0)) || 1;
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0)) || 1;
  return dot / (na * nb);
}

export function nearestBrandsFor(text: string, limit = 5) {
  const query = demoEmbedding(text);
  return BRANDS.map((b) => ({ brand: b, similarity: cosine(query, demoEmbedding(`${b.name} ${b.signals.join(" ")} ${b.style.join(" ")}`)) }))
    .sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}
