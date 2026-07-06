# ROADMAP.md — 6-Month Launch Plan: Public, Multi-User, Premium

**Product:** Strength + Pilates Tracker (brand name TBD — task B-1)
**Owner:** Saffron (saffronlm@gmail.com) — final say on all gates and [HUMAN] tasks
**Written:** 6 July 2026 · **Horizon:** Week 1 = 6–12 Jul 2026 → Week 26 ends 3 Jan 2027
**Grounding:** the strategic audit of 6 Jul 2026 (see Decision Log §10 for its locked conclusions)

---

## §0 · How to run this file (operating rules — read first, every session)

This file is the single source of truth for what to build and in what order. It is
designed to be executed one task at a time by any Claude Code session with no memory
of previous sessions. Rules:

1. **Start every session** by reading this §0, then the Status Tracker (§9). Pick the
   **topmost task whose status is `next`**. If no task is `next`, pick the topmost
   `ready` task whose dependencies are all `done`. Work on **one task per session, one
   task per PR**.
2. **Read the task's Acceptance Criteria before writing code.** The task is done only
   when every AC line is verifiably true. If an AC is ambiguous, do not improvise
   scope — set the task's status to `blocked(<one-line reason>)` in the tracker,
   commit that, and stop.
3. **Before every commit that touches `index.html`:** run `node scripts/validate.mjs`
   (must pass) and, once P0-6 is done, `node scripts/smoke_test.mjs` (must pass).
   CI must be green on the PR.
4. **Branch/PR conventions:** work on `claude/<task-id>-<short-slug>` (e.g.
   `claude/p0-2-pwa`), open a **draft PR**, and update this file's Status Tracker row
   (status, date, PR number, one-line note) **in the same PR**. A merged PR is
   finished — never stack commits on merged history; restart branches from latest
   `main`.
5. **Never, under any circumstances:**
   - touch Daily Shuffle's Supabase project (`jsxcctrskkkxgdxfaduo`) — this app gets
     its **own** project (P2-1) with real auth + row-level security;
   - commit secrets (Supabase **anon/publishable** keys inline are fine; service-role
     keys, Stripe secret keys, webhook secrets are NOT — those live only in Supabase
     edge-function secrets / GitHub Actions secrets);
   - add a build step, framework, npm dependency, or CDN `<script>` to the app —
     the app stays a single self-contained `index.html` (hand-rolled SVG for charts);
   - start a phase before its gate row in §5 says **GO** with Saffron's sign-off date;
   - regenerate or "clean up" `sample-data/` — it is reviewed personal data.
6. **[HUMAN] tasks are Saffron-only.** A session may *prepare* them (draft copy,
   generate a checklist, stage config) but must not execute them (no buying domains,
   no creating Stripe/Cloudflare accounts, no posting publicly).
7. **Keep documentation true.** If a change alters any fact stated in `CLAUDE.md`
   (architecture, storage keys, conventions) or in this file, update it in the same PR.
8. **When a phase completes,** set its gate row to `awaiting sign-off` and stop phase
   work; pick up B-track (brand/audience) tasks or bug fixes until Saffron signs.

**Definition of "a session"**: one Claude Code working block (~1–3 h). Estimates below
are in sessions. Budget: ~2–3 AI sessions/week + ≤1 [HUMAN] task/week (Saffron has
2–5 h/week total).

---

## §1 · Strategy and North Star

**What this is:** not "another workout logger" (saturated, free) but **a signature
training method with a tracker attached** — women's strength × Pilates hybrid,
tone-first progression (the app already coaches "add reps or slow the tempo before
adding load" on `tone`-flagged movements), condition-aware adjustments (PCOS first),
asymmetry-aware programming. The method logic lives in the software, not in a PDF.
That is the premium story.

**The single most important outcome (North Star):**
> **By 3 Jan 2027 the app is publicly launched under its own brand and domain, and at
> least one stranger — someone with no personal connection to Saffron — is paying for
> premium.**
Stretch goal: 10 paying subscribers, 100 waitlist emails. The first stranger's payment
is the validation that the method-brand has commercial pull; everything in this plan
exists to make that moment possible and repeatable.

**Locked strategic decisions (do not re-litigate; see Decision Log §10):**
- **Web-first PWA for the entire 6 months.** No app stores. Payments via Stripe on the
  web (no 30% store tax, no review cycles).
- **Standalone brand** (not creator-led). Acquisition = landing page + waitlist + SEO
  content + niche communities. Brand identity work starts early (B-track).
- **Freemium, generous free core.** Free forever: full logging, the signature Lean &
  Tone program, calendar/streaks, exercise library, export/import, account + cloud
  backup. Premium: progress charts & insights, custom program editor, condition
  adjustment packs, multi-device sync. Full matrix in Appendix A.
- **Both program tiers:** signature programs = versioned, read-only, bundled content
  (the brand); custom programs = premium, user-owned documents in the same schema.
- **Separate from Daily Shuffle**, but the auth/RLS/payments patterns built here become
  the template for Daily Shuffle's own multi-tenant gate later. Everything stays keyed
  by ISO date so a future "suite" join remains possible. No shared Supabase project.
- **Engineering doctrine:** single-file app, no build step, no dependencies, hand-rolled
  SVG charts, fetch-only Supabase REST (no SDK), every fetch-write checks `res.ok` and
  surfaces a failure toast (rule inherited from Daily Shuffle's tracker bug).

**Why this ladder works:** each phase de-risks the next. Harden (P0) → make it worth
paying for (P1) → let others in (P2) → let money move (P3) → make it discoverable and
trustworthy (P4) → launch (P5). The brand track (B) runs in parallel from week 4
because a standalone brand with a 1–4 person beta pool needs a public waitlist early
to generate any demand signal before launch.

---

## §2 · Timeline overview

| Phase | Weeks | Dates (2026–27) | Goal (one line) | Gate at end |
|---|---|---|---|---|
| **P0** Harden | 1–2 | 6–19 Jul | Current app technically sound, installable, test-covered | — |
| **P1** Premium-feel | 3–7 | 20 Jul–23 Aug | Quality a stranger would pay for; hosted; beta running | **Gate A** (wk 8) |
| **P2** Accounts & sync | 8–12 | 24 Aug–27 Sep | Anyone can sign up; data syncs; RLS airtight | — |
| **P3** Freemium & payments | 13–17 | 28 Sep–1 Nov | Money moves; free/premium line enforced; program editor live | **Gate B** (wk 17) |
| **P4** Launch prep | 18–22 | 2 Nov–6 Dec | A stranger can discover, trust, sign up, delete | **Gate C** (wk 22) |
| **P5** Launch & iterate | 23–26 | 7 Dec–3 Jan | Public launch; first paying stranger; learning loop | Month-6 review |
| **B** Brand & audience | 4→26 | parallel | Name, domain, waitlist, SEO content, launch assets | — |

Slippage rule: if a phase runs >1 week over, cut its lowest task (each phase lists a
designated **cuttable** task) — never cut gates, security tasks, or the validator/smoke
requirements.

---

## §3 · Product phases and tasks

Task format: **ID · Title** · Type ([AI] / [HUMAN] / [PAIRED]) · Est (sessions) · Depends.
File references use function names, not line numbers (lines drift).

### Phase 0 — Harden the foundation (Weeks 1–2)
**Goal:** the current single-user app is technically sound, installable as a PWA, and
protected by a real browser test — so every later change lands on solid ground.

---

**P0-1 · Project CLAUDE.md** · [AI] · 1 · Depends: —
Create `CLAUDE.md` covering architecture, state model, conventions, validation
workflow, and the pointer to this file's §0.
**AC:** ✅ Done in the same PR that introduced this roadmap.

---

**P0-2 · Make the app an installable PWA** · [AI] · 1–2 · Depends: —
Add `manifest.json` (name uses working title "Strength + Pilates" until B-1 renames;
`display: standalone`, theme `#c9a99a`, background `#fdf6f0`, 192/512 maskable icons —
generate a simple SVG-derived placeholder icon: blush circle + white "S+P" wordmark,
rendered to PNG) and `sw.js` **ported from Daily Shuffle's proven pattern**:
network-first for the HTML document (deploys show up on next open), cache-first for
static assets, and a `CACHE` version constant. Register the SW in `index.html`; add
`<link rel="manifest">` and `theme-color` meta.
**AC:**
- Installable to the home screen on iOS Safari and Android Chrome with icon and
  standalone display (no browser chrome).
- With the network off, a previously-loaded app still opens and functions fully.
- `sw.js` has a `CACHE` constant; `CLAUDE.md` gains the rule "bump `CACHE` once per PR
  that changes shippable app code" (same rule as Daily Shuffle).
- `node scripts/validate.mjs` passes; smoke test (once it exists) covers SW-registered boot.

---

**P0-3 · Fix UTC date handling** · [AI] · 1 · Depends: —
`td()` uses `toISOString().slice(0,10)` (UTC) — logging after ~11 pm UK time (BST)
writes to *yesterday*. Add `localISO(d)` built from `getFullYear/getMonth/getDate` +
`pad2`, and replace **every** calendar-purpose `toISOString().slice(0,10)` — in `td()`,
`shiftActDate()` (currently does UTC arithmetic), the streak loop in `rCal()`, the
week-summary loop, and the `S.actdate` initializer in the `S` declaration.
**AC:**
- A logging action at 23:30 local time on any date writes to that local date
  (prove with a unit check in `scripts/validate.mjs` that constructs
  `new Date(2026, 5, 15, 23, 30)` and asserts `localISO` → `"2026-06-15"`, and run the
  validator with `TZ=America/Los_Angeles` in CI as a second matrix step).
- Streak/week-summary/calendar all use the same helper; zero remaining calendar-purpose
  `toISOString().slice(0,10)` calls in `index.html`.
- Back-fill (`setActDate`, `editDay`) behaves identically across DST boundaries.

---

**P0-4 · Remove the 200-session cliff + stop state double-storage** · [AI] · 1 · Depends: —
`saveSess()` and `importData()` silently truncate `S.hist` at 200 entries (~10 months
of real use). Raise the cap to 2000 with a console warning at 1800. Separately: saved
sessions stay in the live `S.logs`/`S.checks`/`S.feels`/`S.notes` maps forever,
double-storing everything. After a successful save, prune live-map entries whose
composite date key is older than 60 days (safe by design: `hydrateDay()` re-populates
the live slots from `S.hist` when a past day is edited).
**AC:**
- Importing a backup with 250 sessions retains all 250; export → wipe → import
  round-trips losslessly.
- After `saveSess()`, live-map keys older than 60 days are gone; editing an old day
  via the calendar still pre-fills correctly (hydrate path proven in validator).
- localStorage blob size for the sample dataset shrinks or stays equal, never grows.

---

**P0-5 · Escape user-generated content** · [AI] · 1 · Depends: —
User-typed text (session notes, per-set notes) is interpolated raw into HTML
attributes and a `<textarea>`; exercise names go into `onclick='...'` strings
(`nameTap`, `openExDetail`, `renderEx`). Safe today only because names are hardcoded —
custom programs (P3-5) make this a live XSS/breakage risk. Add
`esc(s)` (HTML-entity escape incl. quotes) and `escAttr` for JS-string-in-attribute
contexts; apply at every interpolation of user-typed content and every name passed
into an attribute. Do not restructure rendering — targeted escaping only.
**AC:**
- A session note of `"><img src=x onerror=alert(1)>` and a per-set note containing
  `'` and `"` render as inert visible text; saving/reloading round-trips them intact.
- A validator case injects hostile strings through `setNote`/`setLg` paths and asserts
  the rendered HTML contains the escaped forms.
- Exercise-detail modal still opens for every movement (names with `/` and `&` like
  "Assisted Pull-ups / Lat Pulldowns" keep working — validator already renders all).

---

**P0-6 · Browser smoke test + CI wiring** · [AI] · 1–2 · Depends: P0-2
Port Daily Shuffle's Playwright pattern (`scripts/smoke_test.mjs`, headless Chromium at
`/opt/pw-browsers/chromium`, fully offline, no npm install in-repo — use `node` +
Playwright available in the sandbox; if Playwright isn't importable without a
package.json, vendor the minimal launch via `playwright-core` is NOT allowed — instead
follow Daily Shuffle's exact approach in its `scripts/smoke_test.mjs`, which already
runs in this sandbox). Test: boot from `file://` or a throwaway local server, assert no
console errors, switch all 5 tabs, type a set (weight+reps), save the session, reload,
assert the set persisted and appears in the calendar day detail.
**AC:**
- `node scripts/smoke_test.mjs` passes locally in the sandbox and in CI (add a job to
  `.github/workflows/ci.yml` mirroring how Daily Shuffle runs it).
- The test fails (proven once by deliberate local break, not committed) when a tab
  button is broken — i.e., it catches what `validate.mjs`'s stubbed DOM cannot.
- Runtime under 2 minutes in CI.

*Cuttable in P0:* none — all five are foundations. If overrunning, P0-4's pruning half
may move to P1.

---

### Phase 1 — Premium-feel, still single-user (Weeks 3–7)
**Goal:** app quality a stranger would pay for — hosted at a public URL, program as
data, charts, timer, onboarding — validated by a small friends-&-family beta.

---

**P1-1 · Deploy to a public URL (Cloudflare Pages)** · [PAIRED] · 1 · Depends: P0-2
[HUMAN] Saffron creates a free Cloudflare account and connects the GitHub repo (repo
stays **private** — Cloudflare Pages deploys private repos free, unlike GitHub Pages;
this also keeps `sample-data/` personal history out of public view).
[AI] Prepare everything else: confirm zero-build static deploy config (output dir `/`),
document the setup steps in `docs/deploy.md`, verify SW + manifest behave on the
`*.pages.dev` domain.
**AC:**
- App loads over HTTPS at a `*.pages.dev` URL; installs as PWA from that URL on a real
  phone (Saffron confirms on iPhone).
- Pushing to `main` auto-deploys; a deploy is visible on next app open (network-first
  SW proven live).
- `docs/deploy.md` exists with the exact settings used.

---

**P1-2 · Program-as-data extraction** · [AI] · 2 · Depends: P0-6
The pivotal architectural move. Restructure the hardcoded `DATA`/`SP` globals into a
single versioned document: `var PROGRAM = {meta:{id:"lean-tone", version:1, name:
"Lean & Tone", tagline:"Pilates Hybrid"}, sessions:{...current DATA...},
splits:{...current SP...}}`, with thin compatibility accessors so rendering code reads
through one `getProgram()` indirection. The signature program **stays bundled in
`index.html`** (offline, free-tier, zero fetch). Target schema in Appendix B — follow
it exactly; it is what custom programs (P3-5) and future signature programs will use.
Keep the stable-ID discipline (`ID2NAME`, `LEGACY`, slugs) — it is what makes program
switching non-destructive.
**AC:**
- Rendering is pixel-identical: smoke test passes unchanged; validator passes.
- `PROGRAM` validates against Appendix B's shape (add a validator assertion walking
  required fields: every exercise has `id`, `name`, `sets`, `reps`; flags `uni`/`left`/
  `tone`/`grp`/`alts` optional).
- All reads of session data go through the accessor (grep shows no remaining direct
  `DATA[` outside the accessor and legacy-ID bootstrap).
- `subtitle()` and the header derive program name/tagline from `PROGRAM.meta`.

---

**P1-3 · Profile settings: weaker side, step goal, name** · [AI] · 1 · Depends: P1-2
Parametrize the personal hardcodings. Add a `profile` object to state
(`{side:"left", stepGoal:15000, name:""}`). The `left` exercise flags become "weaker
side leads": badges, "Left arm first" note text, and the Split tab's Asymmetry Protocol
copy all derive from `profile.side` (a `sideWord()` helper). `STEP_GOAL` reads from
profile. Settings tab gains a Profile card.
**AC:**
- Switching side to "right" flips every LEFT badge/lead note/protocol line to RIGHT
  without touching program data; switching back restores exactly.
- Existing logged `_L`/`_R` history remains correct regardless of the setting (log
  keys are anatomical, not preference-relative — verify in validator).
- Step goal changes reflect immediately in the daily card and calendar tags.
- Defaults preserve today's behavior exactly (left, 15000).

---

**P1-4 · Progress charts (hand-rolled SVG)** · [AI] · 2 · Depends: P1-2
In the exercise detail modal and a new "Progress" section: per-movement line chart of
top set weight per session date, and a reps-focused variant for `tone` movements
(reps × sets volume) — the chart must speak the app's own progression philosophy.
Per-side (L/R) series for unilateral movements on one chart, two colors. Inline SVG
generated by a `svgChart(series, opts)` helper — **no libraries**. Read the `dataviz`
skill before building. Style matches the app palette.
**AC:**
- Any movement with ≥2 logged sessions shows a chart in its modal; <2 shows the
  existing text history with an encouraging empty-state line.
- Unilateral movements show L and R as two labeled series; the sample-data backup
  (`sample-data/my-history-backup.json`, imported in the smoke test) renders charts
  for `ua2` (Single-Arm Dumbbell Rows) with visibly distinct L/R lines.
- `tone` movements chart reps/volume, not weight, with an axis label saying so.
- Charts render offline, no external fonts/assets; validator + smoke pass.

---

**P1-5 · Rest timer** · [AI] · 1 · Depends: —
Each exercise's rest chip ("Rest: 45s") becomes tappable: starts a countdown rendered
in the chip, ticks to 0:00, optional vibration (`navigator.vibrate` where supported)
and a gentle flash. Timer state is in-memory only (never persisted) and must survive
the frequent full re-renders (`rToday()`) — keep the countdown in a module-level
variable and re-attach on render.
**AC:**
- Tapping rest starts/cancels the countdown; logging sets mid-countdown (which
  triggers re-render via `updPct`) does not kill or reset the timer.
- Timer never blocks input; no persistence; works installed-PWA on iOS (visual only
  where vibrate unsupported).

---

**P1-6 · First-run onboarding** · [AI] · 1–2 · Depends: P1-3
A one-time, skippable 3-step overlay for a fresh device: (1) what this method is
(pull copy from `PROGRAM.meta` + focus lines), (2) pick split (4/5/6-day) and weaker
side, (3) how logging works (log sets → Save Session → streaks). Sets a
`profile.onboarded` flag.
**AC:**
- Fresh localStorage → onboarding shows once; completing or skipping never shows it
  again; existing users (any prior `spt3` blob) never see it.
- Choices land in `profile`/`S.split`; smoke test gains a fresh-boot onboarding path.

---

**P1-7 · Recruit & run the F&F beta** · [HUMAN] · (Saffron, ~2 h total) · Depends: P1-1
Saffron sends the `*.pages.dev` URL + install instructions (AI drafts the message and
a 1-page install guide in `docs/beta-guide.md`) to 1–4 people; asks them to train with
it for 2+ weeks; collects answers to exactly three questions: *What confused you?
What's missing? Would you pay ~£5/month for the premium features (charts, custom
programs)?*
**AC:**
- ≥2 people installed it and logged ≥4 sessions each across ≥2 weeks.
- Their answers are recorded in §10 Decision Log (verbatim quotes welcome).

*Cuttable in P1:* P1-6 (onboarding) can slip to Phase 4 polish if the phase overruns.

---

### 🚧 GATE A (end of Week 8) — "Is it usable and wanted?"
Criteria: P0 + P1 tasks done (minus designated cuts); beta ran per P1-7 AC; top-3
usability complaints filed as tracker rows (BUG-x) and either fixed or scheduled;
Saffron records GO/NO-GO for Phase 2 in §5. A NO-GO means: fix usability and re-run
2 more beta weeks, shifting all later dates — better to slip here than to build
accounts for an app nobody enjoyed.

---

### Phase 2 — Accounts & sync (Weeks 8–12)
**Goal:** any user can create an account with an email link and have their data safely
synced and restorable — with row-level security that would survive a hostile audit.

---

**P2-1 · Create the product's own Supabase project** · [PAIRED] · 1 · Depends: Gate A GO
[HUMAN] Saffron approves creation (free tier) in her existing Supabase org — the agent
session can create it via the Supabase MCP tools (`create_project`, London/eu-west-2
region) with her confirmation, or she clicks it in the dashboard.
**Never reuse Daily Shuffle's project.** [AI] After creation: record project ref, URL,
and anon key in `CLAUDE.md`'s config section; port Daily Shuffle's
`supabase-keepalive.yml` workflow (daily ping from `main`) so the free tier never
auto-pauses.
**AC:**
- New project exists, region London; ref + URL + anon key documented in `CLAUDE.md`;
  service-role key stored **nowhere** in the repo.
- Keep-alive workflow on `main`, green run visible in Actions.
- Auth settings: email provider on, magic links on, Site URL = the Pages URL (P1-1),
  redirect URLs include the `*.pages.dev` domain (and later the custom domain, B-3).

---

**P2-2 · Schema + RLS migrations** · [AI] · 1–2 · Depends: P2-1
Apply Appendix C's schema via Supabase MCP `apply_migration`, committing each migration
SQL file under `supabase/migrations/` in the repo (repo copy is the source of truth).
Tables: `profiles`, `user_state` (one jsonb doc per user), `entitlements`, `events`,
`waitlist`. RLS: owner-only (`auth.uid() = user_id`) for profiles/user_state;
entitlements readable by owner, writable **only** by service role; events insert-only;
waitlist anon-insert-only.
**AC:**
- All migrations committed and applied; `get_advisors` (security) reports no RLS
  findings on these tables.
- Proven negative test documented in the PR: with only the anon key and user A's JWT,
  selecting user B's `user_state` returns zero rows; anon without JWT reads nothing
  from any table except being able to INSERT into `waitlist`/`events`.

---

**P2-3 · Magic-link auth in the app (fetch-only, no SDK)** · [AI] · 2 · Depends: P2-2
Follow Daily Shuffle's no-SDK doctrine: raw `fetch` against GoTrue REST.
Sign-in: `POST {SB_URL}/auth/v1/otp` `{email, create_user:true}` (headers: `apikey`
anon) → user clicks the emailed link → app loads with `#access_token=…&refresh_token=…`
in the URL hash → parse, store under localStorage `spt_auth`, strip the hash.
Refresh: `POST /auth/v1/token?grant_type=refresh_token` on boot when the access token
is <10 min from expiry (decode JWT `exp` locally). Sign-out clears `spt_auth`.
Settings gains an Account card (email in → "check your email" state → signed-in state
with email shown + Sign out). **Every** authed REST call sends `apikey` + `Authorization:
Bearer <access_token>`, checks `res.ok`, and shows a ⚠ toast on failure (add the
toast utility now — Daily Shuffle's hard-learned rule).
**AC:**
- Full loop works on the deployed URL: enter email → email arrives → click →
  signed in; still signed in after app restart (refresh flow proven by manually
  expiring the access token); sign-out returns to anonymous local-only mode.
- Wrong/expired token on any call → toast, no silent failure, no crash, app remains
  usable offline/local.
- No SDK, no new files beyond `index.html` changes; validator + smoke pass (smoke test
  stubs auth by injecting a fake `spt_auth` — it must not depend on network).

---

**P2-4 · State sync engine** · [AI] · 2 · Depends: P2-3
Whole-document sync of the `spt3` blob to `user_state.doc`. Push: debounce 3 s after
any `sv()` while signed in → upsert (`Prefer: resolution=merge-duplicates`) with
`updated_at`. Pull: on boot when signed in → fetch doc; if server `updated_at` is
newer than the local `lastSync` marker, **merge using the existing import logic**
(`importData`'s map-merge + hist dedupe by date+session — already built and tested,
reuse it as a function, don't reimplement). Offline: pushes queue (a dirty flag) and
flush on next successful connection. Show a subtle sync-state indicator in Settings
(synced ✓ / pending / error ⚠).
**AC:**
- Two browsers, same account: log a session in A → appears in B after reload;
  divergent edits on both (different days) merge to the union, no duplicates
  (date+sess dedupe proven).
- Airplane-mode logging syncs on reconnect; failed push → ⚠ toast + pending state,
  data never lost locally.
- Sync payload for the sample dataset < 200 KB; no sync traffic when signed out.

---

**P2-5 · Local-data adoption on first sign-in** · [AI] · 1 · Depends: P2-4
A device with existing local history that signs in for the first time merges its local
blob **into** the account (never overwrites server with empty, never discards local).
Explicit confirm if both sides are non-trivially different ("Merge this device's 42
sessions into your account?").
**AC:**
- Beta users' pre-account history survives sign-in intact (test with the sample
  backup: import locally → sign in fresh account → all 9 sessions on server).
- Empty-local + rich-server sign-in pulls everything down without prompting; the
  destructive path (both rich) always asks first.

---

**P2-6 · Beta v2 on accounts** · [HUMAN] · (~1 h) · Depends: P2-5
Saffron and beta users sign in, confirm cross-device works. [AI] drafts the message.
**AC:** ≥2 beta users signed in with history intact; any sync bug filed as BUG-x rows.

*Cuttable in P2:* none — this phase is the product's spine. Overrun eats Phase 3's
week 13 (payments setup is [HUMAN]-gated anyway).

---

### Phase 3 — Freemium & payments (Weeks 13–17)
**Goal:** the free/premium line from Appendix A is enforced in-app, Stripe moves real
(test-mode) money end-to-end, and the premium flagship — the custom program editor —
exists.

---

**P3-1 · Entitlement gating + upgrade surfaces** · [AI] · 1–2 · Depends: P2-4
Client reads its `entitlements` row on boot/sync (`plan`, `current_period_end`);
`isPremium()` helper. Gate per Appendix A: charts (P1-4) and the Progress section,
custom program editor entry points, adjustment packs. Gated features render as
attractive locked cards ("🔒 Premium — see your strength curve") not dead ends; a
single Upgrade screen (Settings + locked-card taps) lists premium benefits and price.
Free users lose **nothing** they have today except charts (grandfather rule: anyone
who used the app before P3-1 merges keeps charts for 60 days via a local flag —
goodwill for beta users).
**AC:**
- `plan='free'` hides/locks exactly the Appendix A premium set, nothing more;
  flipping the row to `premium` in the DB unlocks all of it on next boot, no deploy.
- Signed-out local users are treated as free; no crash paths when entitlements fetch
  fails (default to last-known, then free).
- Every locked surface routes to the one Upgrade screen; smoke test covers a locked
  and (stub-entitled) unlocked render.

---

**P3-2 · Stripe account + products** · [HUMAN] · (~1.5 h, guided) · Depends: —
Saffron creates the Stripe account (identity + bank), then creates: product "Premium",
prices £5.99/month and £49/year (placeholders — finalized at Gate B), a Payment Link
per price with `client_reference_id` pass-through enabled, and the customer portal
enabled for self-serve cancel. [AI] pre-writes the exact click-path checklist in
`docs/stripe-setup.md` first.
**AC:** test-mode Payment Links + portal link exist; publishable details recorded in
`docs/stripe-setup.md`; secret keys stored only in Stripe dashboard + (later) edge
function secrets.

---

**P3-3 · Stripe webhook → entitlements (edge function)** · [AI] · 2 · Depends: P3-2, P2-2
One Supabase edge function `stripe-webhook`: verifies the Stripe signature, handles
`checkout.session.completed`, `customer.subscription.updated`, and
`customer.subscription.deleted` → upserts `entitlements` (plan, status,
`stripe_customer_id`, `current_period_end`) using the service role. `client_reference_id`
carries the Supabase `user_id` (the app appends it to the Payment Link URL). Every
received event also inserts an `events` row (name=`stripe_<type>`) for debugging.
Secrets (`STRIPE_WEBHOOK_SECRET`) live in edge function secrets only.
**AC:**
- Stripe test-mode checkout → entitlement flips to premium within 60 s; app unlocks
  on next boot/sync (full loop demonstrated and screenshotted in the PR).
- Cancel via customer portal → entitlement reverts at `current_period_end` (status
  handling proven with Stripe's test clocks or a simulated event).
- Bad-signature and replayed events are rejected; function logs clean in
  `get_logs`; no service-role material in the repo.

---

**P3-4 · Upgrade flow wiring** · [AI] · 1 · Depends: P3-1, P3-3
Upgrade screen buttons open the Payment Links with `?client_reference_id=<user_id>`
(require sign-in first — route through the Account card if anonymous); a "Manage
subscription" link (portal) appears for premium users; post-checkout return URL lands
back in the app with a "checking your upgrade…" state that polls entitlements briefly.
**AC:**
- Anonymous → tap upgrade → prompted to sign in → checkout → returns → premium within
  a minute, no manual refresh knowledge needed.
- Premium user sees Manage, not Upgrade; free user post-cancel sees Upgrade again
  after period end.

---

**P3-5 · Custom program editor (premium flagship)** · [AI] · 3 · Depends: P1-2, P3-1, P0-5
Premium users can duplicate the signature program (or start blank) into an editable
custom program stored in their state doc (`customPrograms[]`, same Appendix B schema),
and switch the active program. Editor scope v1 — deliberately modest: rename program;
reorder/remove/add exercises within sessions; per-exercise sets/reps/rest/uni/tone
flags; add exercises from the existing library (guarantees instructions exist); custom
exercise names allowed with a required muscles line + optional instructions (escaped —
P0-5 makes this safe). History continuity via the existing slug mechanism so renames/
swaps never orphan logged sets. **No** drag-drop, no superset editing UI in v1 (grp
preserved on duplicate, editable as a plain text field).
**AC:**
- Duplicate → edit → activate → Today renders the custom program; logging, overload
  hints, charts, and calendar all work identically; switching back to signature is
  lossless.
- A custom exercise named `Sarah's "Killer" Set <3` renders everywhere safely and its
  logged history survives a rename (slug continuity proven in validator).
- Free users see the editor entry as a locked card; program docs validate against
  Appendix B on save (reject invalid with a clear message).
- Validator extended: builds a synthetic custom program and renders all screens with it.

*Cuttable in P3:* P3-5 can ship 1–2 weeks into Phase 4 if payments run long — payments
before program editor, always (Gate B needs money moving, not the editor).

---

### 🚧 GATE B (end of Week 17) — "Does money move, at what price?"
Criteria: full test-mode loop green (P3-3/P3-4 ACs); free/premium boundary verified
from a second clean device; Saffron sets final launch pricing (default £5.99/£49 unless
beta feedback says otherwise) and flips Stripe to live mode; GO recorded in §5.

---

### Phase 4 — Brand, trust & launch prep (Weeks 18–22)
**Goal:** a stranger can discover the product, understand it in 30 seconds, trust it
with health-adjacent data, and leave cleanly if they want.

---

**P4-1 · Rename pass to the real brand** · [AI] · 1 · Depends: B-1 (name chosen)
Apply the B-1 brand: app title/header, `PROGRAM.meta`, manifest name/icons (real icon
from B-2), About card, export filename prefix, `CLAUDE.md`. Custom domain (B-3) added
to Supabase auth redirect URLs and Stripe return URLs.
**AC:** zero occurrences of the working title in user-facing surfaces; PWA re-installs
under the new name/icon; auth + checkout still round-trip on the custom domain.

---

**P4-2 · Landing page + waitlist→launch conversion** · [AI] · 2 · Depends: B-3
`landing/index.html` (separate static file, same repo, same Cloudflare deployment,
same no-build doctrine): the method promise (tone-first, Pilates hybrid,
condition-aware), 3 real screenshots (B-8), pricing, FAQ (incl. "is my data private?"),
email capture writing to the `waitlist` table (anon insert-only, P2-2), and the app
link. The app URL moves to `/app` (or app stays at root and landing at `/start` —
decide by what Cloudflare Pages makes trivial; document choice).
**AC:** page scores ≥90 mobile on Lighthouse (perf + SEO + a11y); waitlist form writes
a row and shows success without page reload; renders correctly with JS disabled except
the form.

---

**P4-3 · Privacy, terms, account deletion** · [PAIRED] · 2 · Depends: P2-2
[AI] drafts a plain-English privacy policy + ToS specific to what the app actually
does (UK GDPR framing: what's stored — training logs, subjective wellness `feels`
including inflammation, email; where — Supabase EU/London; processors — Supabase,
Stripe, Cloudflare; retention; export right = existing export button; erasure right =
new flow). Build the deletion flow: Settings → Delete account → typed confirm → edge
function (service role) deletes `user_state`/`profiles`/`entitlements` rows and the
auth user; local data offered as a final export first. [HUMAN] Saffron reviews and
approves the legal text (30 min; she may optionally get outside review — her call).
**AC:**
- `/privacy` and `/terms` pages live and linked from landing + app Settings + the
  auth email footer text.
- Deletion flow: server rows verifiably gone (documented negative query in PR), auth
  user gone, Stripe subscription cancelled via API if active; local device keeps its
  export.
- The `feels`/health-adjacent data is explicitly named in the policy — no vague
  boilerplate.

---

**P4-4 · Minimal privacy-respecting analytics** · [AI] · 1 · Depends: P2-2
No third-party trackers. A `track(name, props)` helper (`navigator.sendBeacon` →
`events` insert) for exactly: `signup`, `session_saved` (count only, no content),
`upgrade_started`, `upgrade_completed`, `waitlist_joined`, `install` (appinstalled
event). Document 5 ready-to-run SQL queries in `docs/metrics.md` (weekly actives,
signups, conversion, waitlist growth, retention cohort).
**AC:** events flow in production; `docs/metrics.md` queries return correct counts
against seeded test events; zero events fired for signed-out users beyond
`waitlist_joined`/`install`; policy (P4-3) mentions this telemetry.

---

**P4-5 · Empty/error-state & polish audit** · [AI] · 1–2 · Depends: P4-1
Walk every screen as three personas: brand-new (empty everything), free-with-history,
premium. Fix: blank charts, zero-state calendar, first-session Today, sync-error
recovery, offline banners, loading states on auth/checkout returns. Onboarding (P1-6)
gets the brand voice pass.
**AC:** a written walkthrough checklist committed as `docs/qa-walkthrough.md` with all
items ✅; smoke test extended with a fresh-user full journey (onboard → log → save →
reload).

---

**P4-6 · Soft launch to the waitlist** · [HUMAN] · (~1 h) · Depends: P4-2..P4-5, Gate C
Saffron emails the waitlist (AI drafts) + shares to her 1–4 beta circle for forwarding.
No public posts yet — this is the dress rehearsal cohort.
**AC:** ≥5 non-F&F signups OR 2 weeks elapsed (whichever first); zero P0/P1-severity
bugs open after the first week; funnel numbers recorded in §10.

*Cuttable in P4:* P4-4 can shrink to signup/upgrade events only. P4-3 is never cut.

---

### 🚧 GATE C (end of Week 22) — "Launch-ready?"
Checklist, all green: RLS re-audit (`get_advisors` clean + negative tests re-run);
Lighthouse PWA installable pass on the custom domain; restore-from-export and
account-deletion tested that week; legal pages live; analytics flowing; Stripe in live
mode with one real £ transaction (Saffron's own card, then refunded) — GO for public
launch recorded in §5.

---

### Phase 5 — Launch & iterate (Weeks 23–26)
**Goal:** public launch, first paying stranger, and a working weekly learning loop —
ending with a month-6 review that writes the next roadmap.

---

**P5-1 · Public launch** · [PAIRED] · 1 + (~2 h human) · Depends: Gate C GO
[AI] final deploy, launch-day monitoring checklist, drafts every post. [HUMAN] Saffron
posts per B-8's channel plan (niche communities with their rules respected, relevant
subreddits, her personal network as amplification — the brand stays standalone).
**AC:** launch posts live in ≥3 channels; app + landing stable through launch week
(no error-state reports unhandled >24 h); metrics dashboard reviewed daily that week.

**P5-2 · Iteration loop** · [AI] · ongoing (2 sessions/wk) · Depends: P5-1
Weekly: read `docs/metrics.md` outputs + any user emails Saffron forwards → file
BUG-x/IMP-x rows in the tracker → fix top items. Bug SLA: data-loss/security same
week; broken-flow next session; polish batched.
**AC:** every launch-cohort-reported bug has a tracker row with resolution; ≥1
user-visible improvement ships each week of the phase.

**P5-3 · Month-6 review & next roadmap** · [PAIRED] · 1 + (1 h human) · Depends: week 26
Score against the North Star and stretch goals with real numbers; decide the next
6 months: double down (more signature programs, adjustment packs beyond PCOS,
community features), hold (organic growth + polish), or fold learnings back. Explicitly
revisit the Daily Shuffle question: does the now-proven auth/RLS/Stripe stack migrate
to Daily Shuffle's Gate B, and is a shared-account "suite" worth pursuing? Write
`ROADMAP-2.md`.
**AC:** review written into §10 with metrics; `ROADMAP-2.md` exists in the same
task-per-session format as this file.

---

## §4 · B-track — Brand & audience (parallel, from Week 4)

One B-task ≈ one Saffron hour + optional AI drafting session. Sequence, one per week
where capacity allows (they are the default "[HUMAN] task of the week" when no product
[HUMAN] task is due):

**B-1 · Name the brand** · [PAIRED] · Week 4–6
[AI] generates 20 candidates fitting the positioning (feminine-strong, studio-boutique,
not gym-bro; check .com/.co.uk availability by documented manual lookup — no domain
APIs from the sandbox); Saffron shortlists 3, sleeps on it, picks one.
**AC:** name + available domain recorded in §10; working title retired at P4-1.

**B-2 · Brand mini-kit** · [PAIRED] · Week 6–8
[AI] drafts: wordmark SVG (Georgia-family serif consistent with the app), app icon
(from P0-2's placeholder, rebuilt with the real name), one-paragraph brand voice note
(warm, precise, coach-not-drill-sergeant — the voice already in the app's hints).
Saffron approves or iterates once (she has Canva connected for her own tweaks).
**AC:** `brand/` dir with icon SVG+PNGs (192/512 maskable), wordmark, `voice.md`.

**B-3 · Buy domain + wire it up** · [HUMAN] · Week 8 (~£10/yr)
Domain → Cloudflare (registrar or DNS) → Pages custom domain; [AI] pre-writes the
click-path and afterwards updates Supabase redirect URLs.
**AC:** app + landing on HTTPS custom domain; `*.pages.dev` redirects.

**B-4 · Waitlist live** · [AI] · Week 9 (can precede full landing page: a one-screen
"method + email box" version of P4-2)
**AC:** shareable URL collecting emails into `waitlist`.

**B-5..B-7 · SEO/content seeds** · [PAIRED] · Weeks 10–20, one every ~3 weeks
[AI] drafts, Saffron edits/approves (30 min each), published as static pages under
`landing/` (e.g. `/guides/pcos-strength-training`): (5) "Strength training with PCOS:
what to change and why", (6) "Tone-first progression: why chasing reps beats chasing
weight", (7) "Fixing left-right imbalances: an asymmetry protocol that works". Each
ends with the waitlist/app CTA. These are the standalone brand's only acquisition
engine before launch — they must be genuinely good, not SEO sludge.
**AC per piece:** factually careful (no medical claims — "training considerations",
not treatment); reads in the brand voice; internally linked; indexed by Google within
3 weeks of publishing (verify via `site:` search).

**B-8 · Launch kit** · [PAIRED] · Weeks 20–22
[AI] drafts: 3 app screenshots (staged via smoke-test browser with the sample dataset,
device-framed), launch copy per channel, a vetted channel list (each checked against
its self-promotion rules), Product Hunt draft if Saffron wants it. Saffron approves.
**AC:** `docs/launch-kit.md` complete before Gate C.

---

## §5 · Gates (sign-off record)

| Gate | Target date | Criteria summary | Status | Saffron sign-off |
|---|---|---|---|---|
| A | end wk 8 (≈30 Aug) | Beta ran; usable; top complaints filed | pending | — |
| B | end wk 17 (≈1 Nov) | Test-mode money loop green; price set; live mode on | pending | — |
| C | end wk 22 (≈6 Dec) | Security/PWA/legal/restore checklist all green | pending | — |

---

## §6 · Inputs Saffron must provide (with deadlines)

| When | Input | Cost | Notes |
|---|---|---|---|
| Week 3 | Cloudflare account + repo connect (P1-1) | £0 | ~20 min, AI writes the steps |
| Weeks 3–5 | 1–4 beta users + her own iPhone testing | £0 | the week's [HUMAN] task |
| Week 4–6 | Brand name decision (B-1) | £0 | the one decision only she can make |
| Week 8 | Domain purchase (B-3); Supabase project approval (P2-1) | ~£10/yr; £0 | Supabase free tier |
| Week 13 | Stripe account + products (P3-2) | £0 (fees on revenue only) | needs ID + bank details |
| Week 18+ | Legal text review (P4-3); screenshots approval (B-8) | £0 (optional paid legal review, her call) | |
| Weekly | ~45 min Friday review (see §8) | — | the plan's heartbeat |
| **Total cash** | | **< £50 for 6 months** | until real scale (Supabase Pro £25/mo only if usage demands) |

---

## §7 · Risk register

| # | Risk | Likelihood | Impact | Mitigation (built into the plan) |
|---|---|---|---|---|
| 1 | **Empty-room launch** — standalone brand, 1–4 beta, no audience | High | High | Waitlist from wk 9 (B-4); SEO content from wk 10 (B-5..7); success defined as *first* paying stranger, not scale; soft launch (P4-6) tests the funnel before the public one |
| 2 | **Cheaper-AI drift** — day-to-day model misreads scope, breaks things | Medium | High | §0 rules; one-task-one-PR; CI validator + smoke test as hard guardrails; explicit ACs; "blocked → stop and write it down" rule; Saffron merges every PR |
| 3 | Saffron's 2–5 h/week becomes 0 some weeks | Medium | Medium | Only gates and [HUMAN] tasks need her; AI tasks queue independently; nothing breaks by pausing — dates slip, order doesn't |
| 4 | Single-file `index.html` growth (~1.1k → est. 3k+ lines) | Medium | Medium | Daily Shuffle proves the pattern to 6k lines; validator/smoke keep it honest; sw.js/landing/docs are separate files; revisit only if CI can't keep it safe |
| 5 | Auth-by-raw-REST turns out fiddly (GoTrue edge cases) | Medium | Medium | P2-3 has 2 sessions budgeted; magic-link-only (no passwords) is the minimal surface; Daily Shuffle's fetch-only Supabase patterns are the reference |
| 6 | Stripe webhook/entitlement bugs charge or lock out users | Low | High | Test mode until Gate B; every webhook event logged to `events`; grandfather rule in P3-1; portal handles cancels (no custom billing UI) |
| 7 | iOS evicts localStorage for rarely-used web apps | Medium | Medium | Sync (P2-4) is the real backup; export button retained; onboarding nudges account creation |
| 8 | Health-adjacent data (`feels`, inflammation) mishandled | Low | High | EU-region project; owner-only RLS with negative tests (P2-2); named explicitly in policy (P4-3); deletion flow before any public user exists |
| 9 | Supabase free tier auto-pauses | Medium | Low | Keep-alive workflow ported from Daily Shuffle on day one of P2-1 |
| 10 | Repo privacy — personal training history in `sample-data/` | Low | Medium | Repo stays private; Cloudflare Pages deploys private repos; §0 rule 5 protects the data files |

---

## §8 · Rhythm — what to work on next, always

**The answer to "what now?" is mechanical: the topmost `next` row in §9.** Never more
than 2 rows are `next` at once.

**Weekly loop (repeat every week):**
- **AI session 1 (e.g. Tue):** §0 → pick topmost `next` → implement → draft PR with
  tracker row updated.
- **AI session 2 (e.g. Thu):** finish/address review on session 1's PR, or next task.
- **(Optional AI session 3):** B-track drafting or bug rows.
- **Saffron's Friday 45 min:** merge green PRs (test on her phone when UI changed);
  do the week's one [HUMAN] task (§6 / B-track); promote the next `ready` rows to
  `next`; jot anything notable in §10.
- **Every 4th Friday (+30 min):** phase check — compare position to §2 dates; if >1
  week behind, apply the phase's designated cut; check the upcoming gate's criteria.

**Session prompt Saffron can paste verbatim to the day-to-day AI:**
> Read ROADMAP.md §0 and follow it: pick the topmost `next` task in §9, implement it
> to its acceptance criteria, run the required checks, open a draft PR that also
> updates the tracker row. If blocked, mark the row blocked with a one-line reason
> and stop.

---

## §9 · Status Tracker

Statuses: `done` · `next` (work on now, max 2) · `ready` (unblocked, queued) ·
`waiting` (needs a dependency/gate/[HUMAN]) · `blocked(<reason>)` · `cut`.
Add `BUG-n` / `IMP-n` rows beneath the phase they belong to as they arise.

| ID | Task | Type | Status | Date | PR | Note |
|---|---|---|---|---|---|---|
| P0-1 | Project CLAUDE.md | AI | done | 2026-07-06 | (this PR) | created with roadmap |
| P0-2 | Installable PWA | AI | next | | | port DS sw.js pattern |
| P0-3 | Fix UTC dates | AI | next | | | |
| P0-4 | Cap + storage pruning | AI | ready | | | |
| P0-5 | Escape user content | AI | ready | | | |
| P0-6 | Browser smoke test + CI | AI | ready | | | needs P0-2 |
| P1-1 | Cloudflare Pages deploy | PAIRED | waiting | | | needs P0-2 + Saffron |
| P1-2 | Program-as-data | AI | waiting | | | needs P0-6 |
| P1-3 | Profile settings | AI | waiting | | | needs P1-2 |
| P1-4 | SVG progress charts | AI | waiting | | | needs P1-2 |
| P1-5 | Rest timer | AI | ready | | | independent |
| P1-6 | Onboarding | AI | waiting | | | cuttable → P4 |
| P1-7 | Run F&F beta | HUMAN | waiting | | | needs P1-1 |
| GATE-A | Usability gate | — | waiting | | | end wk 8 |
| P2-1 | New Supabase project | PAIRED | waiting | | | after Gate A |
| P2-2 | Schema + RLS | AI | waiting | | | |
| P2-3 | Magic-link auth | AI | waiting | | | |
| P2-4 | Sync engine | AI | waiting | | | |
| P2-5 | Local-data adoption | AI | waiting | | | |
| P2-6 | Beta v2 | HUMAN | waiting | | | |
| P3-1 | Entitlement gating | AI | waiting | | | |
| P3-2 | Stripe account/products | HUMAN | waiting | | | wk 13 |
| P3-3 | Webhook edge function | AI | waiting | | | |
| P3-4 | Upgrade flow | AI | waiting | | | |
| P3-5 | Custom program editor | AI | waiting | | | cuttable → early P4 |
| GATE-B | Money gate | — | waiting | | | end wk 17 |
| P4-1 | Brand rename pass | AI | waiting | | | needs B-1 |
| P4-2 | Landing page | AI | waiting | | | needs B-3 |
| P4-3 | Privacy/terms/deletion | PAIRED | waiting | | | never cut |
| P4-4 | Analytics | AI | waiting | | | shrinkable |
| P4-5 | Polish audit | AI | waiting | | | |
| P4-6 | Soft launch | HUMAN | waiting | | | |
| GATE-C | Launch-ready gate | — | waiting | | | end wk 22 |
| P5-1 | Public launch | PAIRED | waiting | | | |
| P5-2 | Iteration loop | AI | waiting | | | |
| P5-3 | Month-6 review | PAIRED | waiting | | | writes ROADMAP-2 |
| B-1 | Name the brand | PAIRED | ready | | | wk 4–6, Saffron decides |
| B-2 | Brand mini-kit | PAIRED | waiting | | | |
| B-3 | Domain purchase + wiring | HUMAN | waiting | | | |
| B-4 | Waitlist live | AI | waiting | | | |
| B-5 | Guide: PCOS strength training | PAIRED | waiting | | | |
| B-6 | Guide: tone-first progression | PAIRED | waiting | | | |
| B-7 | Guide: asymmetry protocol | PAIRED | waiting | | | |
| B-8 | Launch kit | PAIRED | waiting | | | |

---

## §10 · Decision Log

Newest first. Every gate outcome, beta finding, pricing decision, and strategy change
gets one dated line here — this is the file's memory.

- **2026-07-06** — Roadmap created from the strategic audit. Locked with Saffron:
  standalone brand (not creator-led); her capacity 2–5 h/week; freemium with
  **generous free core** (free: logging + signature program + history + account/backup;
  premium: charts/insights, custom program editor, adjustment packs, multi-device
  sync); beta pool is 1–4 people, so Gate A = usability signal and the waitlist is the
  demand signal; web-first PWA + Stripe for all 6 months, no app stores; "both tiers"
  program model (signature = brand, custom = premium); new dedicated Supabase project —
  Daily Shuffle's project and its open-anon pattern are explicitly off-limits; the
  auth/RLS/Stripe stack built here is the future template for Daily Shuffle's own
  multi-tenant gate. North Star: launched + first paying stranger by 3 Jan 2027.
- **2026-07-06** — Audit headline (for context): differentiators worth building the
  brand on = tone-aware progression coaching, condition-aware (PCOS) adjustments,
  asymmetry protocol, CI-enforced exercise-library content, boutique visual identity.
  Biggest risks = no distribution (risk #1) and the UTC date bug (P0-3).

---

## Appendix A · Freemium matrix (source of truth for P3-1 gating)

| Capability | Free | Premium |
|---|---|---|
| Signature Lean & Tone program (all splits 4/5/6) | ✅ | ✅ |
| Full logging: sets, feels, notes, daily movement, back-fill | ✅ | ✅ |
| Calendar, streaks, week summary | ✅ | ✅ |
| Exercise library + instructions | ✅ | ✅ |
| Rest timer, onboarding, deload mode | ✅ | ✅ |
| Export / import backup | ✅ | ✅ |
| Account + cloud backup (sign-in, one device at a time) | ✅ | ✅ |
| **Progress charts & insights** | 🔒 | ✅ |
| **Custom program editor + multiple programs** | 🔒 | ✅ |
| **Condition adjustment packs** (PCOS first; more later) | 🔒 | ✅ |
| **Multi-device sync** (marketed; v1 does not hard-enforce single-device for free — cost is trivial, enforcement deferred, revisit at month-6 review) | 🔒* | ✅ |
| Future signature programs beyond Lean & Tone | — | ✅ (roadmap-2) |

Pricing placeholder until Gate B: **£5.99/month or £49/year**.

## Appendix B · Program document schema (target for P1-2, P3-5)

```js
{
  meta: { id: "lean-tone", version: 1, name: "Lean & Tone",
          tagline: "Pilates Hybrid", custom: false },
  splits: { 4:[...], 5:[...], 6:[...] },      // arrays of session names
  sessions: {
    "<Session Name>": {
      focus: "one-line focus copy",
      warmup:  [ { name, note? } ],
      strength:[ { id, name, sets, reps, rest?, note?,
                   uni?:1, left?:1, tone?:1, grp?:"A",
                   alts?:[ {id, name, sets, reps, rest?, note?, uni?, left?, tone?} ] } ],
      opt:     [ /* same exercise shape */ ],
      cardio?: [ { id, name } ],               // cardio-type sessions
      abs?:    [ { id, name, note? } ]
    }
  }
}
```
Rules: exercise `id`s are permanent once shipped (history is keyed on them; retired ids
go to `LEGACY`); custom exercises get `slug(name)` ids; every `name` should resolve in
`LIB` (custom ones carry their own `muscles`/`instructions` inline); `uni` exercises
log `_L`/`_R`; `tone` switches overload coaching to reps/tempo.

## Appendix C · Backend schema + RLS (target for P2-2)

```sql
-- profiles: 1 row per user
create table profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text, side text default 'left', created_at timestamptz default now());
-- user_state: the whole client blob, one doc per user
create table user_state (
  user_id uuid primary key references auth.users on delete cascade,
  doc jsonb not null, updated_at timestamptz default now());
-- entitlements: written ONLY by service role (stripe webhook)
create table entitlements (
  user_id uuid primary key references auth.users on delete cascade,
  plan text not null default 'free' check (plan in ('free','premium')),
  status text, stripe_customer_id text, current_period_end timestamptz,
  updated_at timestamptz default now());
-- events: insert-only analytics; waitlist: anon insert-only
create table events (id bigint generated always as identity primary key,
  user_id uuid, name text not null, props jsonb, created_at timestamptz default now());
create table waitlist (id bigint generated always as identity primary key,
  email text not null, source text, created_at timestamptz default now());
```
RLS: enable on all five. `profiles`/`user_state`: for select/insert/update
`using/with check (auth.uid() = user_id)`. `entitlements`: select own only; **no**
insert/update policy (service role bypasses RLS). `events`: authenticated insert with
`user_id = auth.uid()` plus anon insert with `user_id is null`; no select. `waitlist`:
anon insert only; no select. Verify with `get_advisors` + the negative tests in P2-2's AC.

## Appendix D · Auth endpoints cheat-sheet (P2-3)

```
send link : POST {SB_URL}/auth/v1/otp            {"email":..., "create_user":true}   [apikey]
callback  : app URL receives #access_token=...&refresh_token=...&expires_in=...
refresh   : POST {SB_URL}/auth/v1/token?grant_type=refresh_token {"refresh_token":...} [apikey]
who am i  : GET  {SB_URL}/auth/v1/user                                                [apikey + Bearer]
data calls: {SB_URL}/rest/v1/<table>   headers: apikey: <anon>, Authorization: Bearer <access_token>
```
Store `{access_token, refresh_token, expires_at, email}` under localStorage `spt_auth`.
All writes: check `res.ok`, ⚠ toast on failure. Site URL + redirect allow-list must
include every domain the app is served from (P2-1, B-3).

## Appendix E · Stripe flow (P3-2..P3-4)

```
upgrade tap → require sign-in → open Payment Link + "?client_reference_id=" + user_id
Stripe webhook (edge fn `stripe-webhook`, verifies STRIPE_WEBHOOK_SECRET):
  checkout.session.completed        → upsert entitlements premium/active (+customer id)
  customer.subscription.updated     → update status + current_period_end
  customer.subscription.deleted     → plan stays premium until period end, then free
manage → Stripe customer portal link (no custom billing UI, ever, in v1)
```
