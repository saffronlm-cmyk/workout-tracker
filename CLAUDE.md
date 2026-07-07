# Strength + Pilates Tracker

A personal strength + Pilates workout tracker being turned into a public, multi-user,
premium fitness product. Ships as a static site with **no build step**. Currently
single-user (Saffron), no backend; the 6-month plan to change that lives in
**`ROADMAP.md`** — read its §0 before doing any work. **What to work on next is always
the topmost `next` row in ROADMAP.md §9.**

## Architecture

- **`index.html`** — the entire app (~1,100+ lines): markup, `<style>` CSS, and one
  `<script>` block. No bundler, no framework, no dependencies, no CDN scripts —
  hand-rolled everything (this is doctrine, see ROADMAP.md §0 rule 5). Edit directly.
- **`scripts/validate.mjs`** — the repo's guard: syntax-checks the embedded script,
  runs it in a stubbed DOM, renders every screen, and asserts every tappable/swappable
  exercise has library instructions. **Run it before every commit that touches
  `index.html`** (`node scripts/validate.mjs`). CI (`.github/workflows/ci.yml`) runs
  it on every push/PR; a `.claude/hooks/session-start.sh` hook runs it at session start.
- **`sample-data/my-history-backup.json`** — 9 real logged sessions in the
  Settings → Backup & Restore import format. Reviewed personal data: never regenerate
  or "clean up". Useful as test fixture for import/merge and chart work.
- Tabs: Today (logging, with back-fill date control), Split, Calendar (streaks +
  per-day history, folded-in former History tab), Library, Settings.

## Data model (read this before touching state)

- All state is one JSON blob in `localStorage` under key **`spt3`**, held in the
  global `S`: `sess` (active session name), `split` (4/5/6), `deload`, `logs`,
  `checks`, `feels`, `notes` (all keyed by composite `"<Session>_<YYYY-MM-DD>"`),
  `hist` (saved session entries `{date, sess, logs, feels, note}`, deduped by
  date+session), `swaps` (sticky exercise substitutions per session type), `daily`
  (per-date `{cycle, cmin, steps}`).
- Set logs are arrays of `{w, r, n}` (kg / reps / note). Unilateral exercises log two
  keys: `<id>_L` and `<id>_R`.
- **Exercise ids are permanent.** History is keyed on them. Retired ids go in the
  `LEGACY` map so old logs still resolve to names; library-suggested swaps get
  deterministic ids via `slug(name)`. Never reuse or rename a shipped id.
- Program content lives in the `DATA`/`SP` globals (becoming a versioned `PROGRAM`
  document — ROADMAP task P1-2, schema in ROADMAP Appendix B).
- `LIB` is the exercise library (~100 movements: muscles, instructions, benefit,
  alternatives). CI enforces that every rendered movement has an entry — new
  exercises require a `LIB` entry in the same PR.
- The `tone` flag on an exercise switches progressive-overload hints from
  weight-progression to reps/tempo coaching (`ovHint`). This is deliberate product
  philosophy, not an inconsistency.

## Dev workflow

- **Branches/PRs:** work on `claude/*` branches, open a draft PR. One ROADMAP task per
  PR; update the ROADMAP §9 tracker row in the same PR. A **merged PR is finished** —
  for follow-ups, restart the branch from latest `main`
  (`git fetch origin main && git checkout -B <branch> origin/main`).
- **Checks before commit:** `node scripts/validate.mjs` always; plus
  `node scripts/smoke_test.mjs` once it exists (ROADMAP P0-6). CI must be green.
- No secrets in the repo: Supabase anon/publishable keys inline are fine; service-role
  keys, Stripe secrets, webhook secrets are not (edge-function/Actions secrets only).
- This app's backend (when it exists, ROADMAP P2-1) is its **own** Supabase project.
  Daily Shuffle's project (`jsxcctrskkkxgdxfaduo`) is strictly off-limits from this repo.
- **Keep this file true.** If your change alters any fact stated here (architecture,
  storage keys, conventions, workflow), update this file in the same PR.

<!-- Once sw.js exists (ROADMAP P0-2): bump its CACHE constant once per PR that
     changes shippable app code; doc-only changes don't need a bump. -->
