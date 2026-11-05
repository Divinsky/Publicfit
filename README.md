# PublicFit — Meta Global AI Developer Hackathon

**Theme: Build for Your World**

## Built during the hackathon window (Oct 26–Nov 4, 2026)

Work built during the Oct 26–Nov 4, 2026 hackathon window: the commercial brand-partnership scoring rewrite (category/audience/track-record/safety, with the explicit ban on personality/character/private-life inference), the "Values alignment" → "Category fit" rename, removal of all Llama references, Muse Spark hosted scoring (muse-spark-1.3 via api.meta.ai), and the Muse Spark Open via Baseten open-weights path. Earlier scaffolding (brand-fit predictor, claimable storefronts, fan feed/waitlist, seeded demo mode) predates the window and is marked as such here.

PublicFit predicts which brands genuinely fit a notable person using only cited public sources, then turns those matches into a shoppable creator storefront and marketplace.

## One-command setup

```bash
cd publicfit
npm install
npm run dev
# open http://localhost:3000
```

**No API keys required.** Without `META_MODEL_API_KEY`, the app runs in deterministic demo mode with 3 seeded notable people, 10 brands, and real public source links — every screen works immediately.

## Going live with Meta AI

```bash
cp .env.example .env.local
# set META_MODEL_API_KEY in .env.local, then restart
npm run dev
```

`lib/meta-ai.ts` then calls the Meta Model API (Muse Spark for structured scoring, Muse Spark Open via Baseten for open-weights tagging/embeddings, and the Muse Image path for visual fit). Any failure falls back to demo scoring — the demo never breaks on a bad key or endpoint.

### Meta AI tooling — for judges

This is Meta's **Muse** suite via the Meta Model API, not the third-party video platform "Muse.ai":

| Meta tool | Where PublicFit uses it |
|---|---|
| **Muse Spark** | `scoreBrandFit()` — structured JSON scoring + citations for the Predictor |
| **Muse Spark Open (open weights)** | `embedAndTag()` — fast tagging and embeddings via an inference partner (Baseten Model APIs, `meta-models/muse-spark-open-1026` by default; Muse Glimmer can be swapped in via `META_OPEN_MODEL` when a partner serves it). This is the path that qualifies for the "Best Build on Meta Open Weight Models" bonus, which is verified by the inference partner. Pgvector-ready, see `schema.sql` |
| **Muse Image** | `scoreVisualFit()` — aesthetic alignment between person and brand |
| **Muse Glimmer / fast models** | Optional fast-model slot via `META_FAST_MODEL` in `.env.example` — e.g. for feed ranking/tagging when a partner-served fast model is preferred. Note: Glimmer is open-weight and self-host/partner-only, not served on the Meta Model API |
| **SAM 3.1** | Not needed for this text-and-score MVP; noted here so the omission is deliberate, not an oversight — a future version could segment storefront imagery with it |
| **Muse Code** | The agentic coding tool in the same featured stack; this MVP was built with Muse-family assistance |

Accepted participants receive $150 in Meta Model API credits for the event, which is what the live paths above are designed to run on. "Use of Meta AI Tooling" is a significant judging criterion (roughly 25% per the event guidance), so the Predictor page surfaces its mode and model on every result (`Mode: live/demo · Model: …`) — judges can see immediately whether a score came from Muse Spark or from the seeded demo fallback.

Optional Postgres + pgvector: set `DATABASE_URL`, then `psql "$DATABASE_URL" -f schema.sql`. Until then, `lib/db.ts` serves the seeded in-memory store with the same shape.

## What is built

| Route | What it proves |
|---|---|
| `/` | Pitch, seeded people, top predicted match per person |
| `/predict` | Brand Fit Predictor: pick a person + brand, or "Find best-fit brands". Overall score (0–100) + Category / Audience / Track record / Brand-safety sub-scores, upside for both sides, ranked brands, clickable citations, human-in-the-loop publish toggle |
| `/store/[handle]` | Auto-built claimable storefront (e.g. `/store/simone-biles`), with "Claim This Storefront" — founding offer: **0% commission for 90 days, then a permanently lower rate**, plus PublicFit brand-match leads |
| `/feed` | Personalized fan feed ranked by PublicFit scores + follows, with a clear opt-in toggle (off by default) |
| `/waitlist` | Access gate: notable people request instant onboarding; everyone else joins the quarterly rolling waitlist (next cohort: January 2027) |
| `/trust` | Guardrails + "Manage My Data" drawer: inspect sources, request a correction, delete a profile |

Guardrails, enforced in copy and in code: a commercial brand-partnership fit engine only — audience overlap, product-category fit, documented track record, brand safety. Public sources only, no private accounts, no speculation on private life, no personality or character analysis, scores framed strictly as sourced fit predictions, not character judgments.

## 2-minute judge demo script

**0:00–0:30 — The problem, in one screen.** Open `/`. "Brands guess at celebrity fit. PublicFit predicts it from cited public evidence — and turns the answer into a store."

**0:30–1:00 — Predict.** Open `/predict`. It auto-runs Simone Biles. Point to the Fit Score and the four sub-scores, then click a citation — every claim links to a real public source. Switch the brand to Athleta, or hit "Find best-fit brands" for the ranked list. Toggle human review on and publish the card — note publishing is *blocked* until a human reviews.

**1:00–1:30 — Storefront.** Open `/store/simone-biles`. Own products, public picks, and high-fit partner items in one place. Scroll to "Claim This Storefront": 0% for 90 days, then a permanently lower rate, plus brand-match leads. Submit the demo claim form.

**1:30–2:00 — Feed, waitlist, trust.** Open `/feed`: turn personalization ON and watch follow-boosted ranking (it's off by default). Open `/waitlist` and flip to "I'm a notable person" for the instant-onboarding checklist. Finish on `/trust` and open "Manage My Data" — inspect sources, request a correction, delete the profile. Close: "Public only, cited always, human in the loop."

## Tech

Next.js 14 (App Router) + TypeScript + Tailwind CSS. API routes in `app/api/*`. AI layer in `lib/meta-ai.ts`: `scoreBrandFit`, `embedAndTag`, `scoreVisualFit`. Seeded data in `lib/data.ts`. Postgres/pgvector schema in `schema.sql`.

## Honest demo notes

- Seeded scores are hand-tuned demo affinities; live mode replaces them with Meta Model API output.
- Storefront products are sample picks labelled as such; no checkout is live and no purchase is taken.
- Past-deal notes cover only widely reported partnerships; a low track-record score means "no documented deal found", not a negative judgment.

## Facebook / Instagram live sources

When `META_GRAPH_TOKEN` is set (see `.env.example`), the Predictor pulls
a creator's public Instagram profile via Business Discovery and their
public Facebook Page via the Graph API, and appends them as cited
sources on the match card — the same sources Muse Spark scores from.
Only public fields are read (bio, follower counts, public post links).
Without the token, or if either fetch fails, the app falls back to its
seeded public sources and the card reads "Social sources: not connected".
