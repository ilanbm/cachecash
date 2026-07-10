# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.2] — 2026-07-10

- **Renamed to `cache-refund`** (previously published as a scoped package).
  Say it out loud — that's the whole product. The install line is now
  `npx cache-refund`; the installed command is `cache-refund`; the hashtag is
  `#cacherefund`. The enable prompt now reads "Claim your cache refund".
  Baseline and backup filenames follow the new name.
- **Share text in plain English**: prefilled posts now use percentage framing
  ("~14% of my cache costs, ≈$X in API-value") — no terminal jargon (`-eq`,
  "5m world") in tweets; the terminal keeps its labeled conventions.
- **Generated share image**: accepting the share prompt ([x]/[b]) writes a
  ready-to-attach `cache-refund-card.svg` (dark terminal-window card, your
  numbers, never project names) to `~/Downloads` (or the current directory),
  converts to PNG on macOS when possible, and reveals it in Finder — no more
  manual screenshot.
- **Closing card**: interactive checkups now end by dealing your card — the
  share-ready block is re-printed as the final frame, so the tail of the
  terminal is the screenshot.
- **Prompt label**: `[c] copy for Slack` → `[c] copy to clipboard`.

## [1.0.1] — 2026-07-10

- **Share-safe output by default** (privacy): human-facing output no longer
  prints project names anywhere; a new `--projects` flag opts back in for
  local diagnosis. `--json` (machine mode) keeps its project fields unchanged.
- **Branded, recognizable frame**: the score/receipt box weaves `cache-refund`
  into its top border (`╭─── cache-refund ───…──╮`, bright magenta on TTYs;
  `+--- cache-refund ---...---+` in ASCII/CI mode), replacing the interior
  brand line. All three endings share the frame.
- **Progress-line fix**: the live scan counter is now a real in-place counter
  (percent-throttled) and is erased on completion — no more stuck
  "scanning 0/1 sessions (0%)" frame above the checkup.
- **Share prompt** (interactive checkup runs only, once per machine, Enter
  skips): post to X / Bluesky via your own browser with a prefilled,
  editable summary — never project names — or copy the markdown block for
  Slack. The CLI still makes zero network requests; see SECURITY.md.
  Re-offered only right after a successful `enable` and after a `recheck`
  with positive savings.
- **Scale line on the card**: the box now shows `<tokens> tokens ·
  <sessions> sessions`; the share hint now points at `card`.

## [1.0.0] — 2026-07-10

Initial public release.

- Checkup report over local Claude Code transcripts: gap-bucket analysis,
  five-cause leak attribution, cache efficiency score (`score_version: 1`),
  biggest single miss and worst day.
- Three billing-aware endings: recommender (API on the 5-minute default),
  validator (API on 1-hour), receipt (subscription — labeled `$-equivalent`).
- Symmetric, regime-aware 5m↔1h counterfactual with a bounded tail-write
  correction; parity-tested against an independent Python reference
  implementation (see [METHODOLOGY.md](./METHODOLOGY.md)).
- TTL reality check: reports the TTL you actually *received*, read from your
  transcripts' usage fields, not from settings.
- Actions: `enable` / `revert` (confirmed, backup-first settings edit),
  `verify`, `recheck` (savings receipts against a baseline saved at enable).
- Output modes: `card`, `--md`, `--compact`, `--explain`, `--json`.
- Claude Code plugin/skill (`/plugin marketplace add m8t-labs/cache-refund`).
- 100% local: token counts and timestamps only, no conversation content,
  no network, zero runtime dependencies.

[Unreleased]: https://github.com/m8t-labs/cache-refund/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/m8t-labs/cache-refund/releases/tag/v1.0.0
