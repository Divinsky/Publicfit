-- PublicFit Postgres + pgvector schema (optional; demo runs without it).
-- Run with: psql "$DATABASE_URL" -f schema.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS people (
  id text PRIMARY KEY,
  handle text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  embedding vector(128),
  sources jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  embedding vector(128),
  sources jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  person_handle text REFERENCES people(handle),
  brand_id text REFERENCES brands(id),
  name text NOT NULL,
  price_cents integer,
  kind text CHECK (kind IN ('own', 'public-pick', 'partner'))
);

CREATE INDEX IF NOT EXISTS people_embedding_idx ON people USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS brands_embedding_idx ON brands USING ivfflat (embedding vector_cosine_ops);
