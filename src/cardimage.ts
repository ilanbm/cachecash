/**
 * Generated share image (v1.0.2): a zero-dep SVG card writer that mirrors
 * the in-repo hero (assets/card.svg) — dark terminal window, traffic lights,
 * magenta branded box border — with the numbers substituted from the live
 * Summary. Written on share-prompt accept so the post has an attachment
 * without a manual screenshot.
 *
 * Share-safe rules (same as the templates): NEVER project names, no "-eq"
 * jargon — subscriber figures say "in API-value" and the footer carries the
 * qualifier. Every substituted string is XML-escaped.
 *
 * PNG: X attachments need a raster, so on darwin we best-effort convert via
 * `qlmanage -t -s 1440` (ships with macOS) and rename its `<name>.svg.png`
 * output; any failure silently falls back to SVG-only. `dir`/`execFileSyncFn`
 * are injectable so tests never touch a real ~/Downloads or spawn anything.
 */

import { execFileSync } from "node:child_process";
import { existsSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { decideEnding, wrappedLines } from "./render.js";
import { fmtDollars, fmtTokensCompact, makeInk, makeSym } from "./format.js";
import type { Summary } from "./types.js";

export const CARD_BASENAME = "cache-refund-card";

/** Minimal XML escaping for every substituted string. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** The top wrapped insight, share-safe: no project (never passed), no "-eq". */
function imageWrappedLine(s: Summary): string {
  const lines = wrappedLines(s, makeInk(false), makeSym(false), false);
  const first = lines[1] ?? "";
  return first.replace(/^\s*»\s*/, "").replace(/-eq\b/g, "");
}

/** Short window tag, mirrors the box's "(last 90d)". */
function windowTag(s: Summary): string {
  return s.window.mode === "days" && s.window.days != null
    ? `last ${s.window.days}d`
    : `${Math.round(s.counterfactual.spanDays)}d span`;
}

/**
 * Build the SVG card. Ending-aware like the terminal box: C leads with the
 * API-value receipt figure; A/B lead with the score.
 */
export function buildCardSvg(s: Summary): string {
  const kind = decideEnding(s);
  const score = s.efficiencyScore.toFixed(1);
  const scale = `${fmtTokensCompact(s.tokens.creationTotal + s.tokens.readTotal)} tokens · ${s.scope.sessions.toLocaleString()} sessions`;
  const wrapped = imageWrappedLine(s);
  const subscriber = s.currency !== "USD";

  let headline: string;
  let figure: string;
  let figureClass: string;
  if (kind === "C") {
    const delta = s.counterfactual.delta1hMinus5m;
    headline = "YOUR 1H CACHE RECEIPT";
    figure =
      delta < 0
        ? `saved ≈${fmtDollars(Math.abs(delta))} in API-value (${windowTag(s)})`
        : `≈${fmtDollars(delta)} costlier than the default (${windowTag(s)})`;
    figureClass = delta < 0 ? "green" : "orange";
  } else {
    headline = "CACHE EFFICIENCY SCORE";
    figure = `${score} / 100`;
    figureClass = s.efficiencyScore >= 90 ? "green" : "orange";
  }
  const scoreLine = kind === "C" ? `efficiency score: ${score} / 100` : kind === "B" ? "certified optimal" : "fix available";

  const footerA = "100% local · token counts + timestamps · nothing leaves this machine";
  const footerB = subscriber ? "$ figures are API-value (list rates) — not a bill" : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="440" viewBox="0 0 720 440">
  <defs>
    <style>
      .t { font-family: "SF Mono", Menlo, Monaco, "DejaVu Sans Mono", monospace; font-size: 15px; white-space: pre; }
      .dim { fill: #8b8fa3; }
      .txt { fill: #e6e6ef; }
      .green { fill: #3fd68f; font-weight: 600; }
      .head { fill: #e6e6ef; font-weight: 700; letter-spacing: 1px; }
      .brand { fill: #d75fd7; font-weight: 700; }
      .orange { fill: #e8a15d; }
    </style>
  </defs>
  <!-- window -->
  <rect x="8" y="8" width="704" height="424" rx="14" fill="#15161c"/>
  <rect x="8" y="8" width="704" height="424" rx="14" fill="none" stroke="#2a2c37" stroke-width="1"/>
  <!-- title bar -->
  <path d="M8 22 a14 14 0 0 1 14 -14 h676 a14 14 0 0 1 14 14 v26 h-704 z" fill="#1d1f28"/>
  <circle cx="34" cy="28" r="6.5" fill="#ff5f57"/>
  <circle cx="56" cy="28" r="6.5" fill="#febc2e"/>
  <circle cx="78" cy="28" r="6.5" fill="#28c840"/>
  <text x="360" y="33" text-anchor="middle" class="t dim" font-size="13">npx cache-refund</text>

  <!-- prompt -->
  <text x="44" y="86" class="t dim">$ <tspan class="txt">npx cache-refund card</tspan></text>

  <!-- receipt box: brand woven into the top border -->
  <rect x="44" y="112" width="524" height="168" rx="10" fill="none" stroke="#d75fd7" stroke-width="1.6"/>
  <rect x="64" y="103" width="142" height="18" fill="#15161c"/>
  <text x="135" y="117" text-anchor="middle" class="t brand" font-size="14">cache-refund</text>

  <text x="306" y="158" text-anchor="middle" class="t head">${escapeXml(headline)}</text>
  <text x="306" y="186" text-anchor="middle" class="t ${figureClass}">${escapeXml(figure)}</text>
  <text x="306" y="228" text-anchor="middle" class="t txt">${escapeXml(scoreLine)}</text>
  <text x="306" y="254" text-anchor="middle" class="t dim">${escapeXml(scale)}</text>

  <!-- wrapped line -->
  <text x="44" y="322" class="t"><tspan class="orange">›</tspan><tspan class="txt"> ${escapeXml(wrapped)}</tspan></text>

  <!-- share rail -->
  <text x="44" y="364" class="t dim">share: npx cache-refund card  ·  #cacherefund</text>

  <!-- footer note -->
  <text x="44" y="${footerB ? 396 : 404}" class="t dim" font-size="12.5">${escapeXml(footerA)}</text>
${footerB ? `  <text x="44" y="416" class="t dim" font-size="12.5">${escapeXml(footerB)}</text>` : ""}
</svg>
`;
}

export interface CardImageResult {
  svgPath: string;
  /** null when PNG conversion was unavailable/failed (non-darwin, or qlmanage hiccup). */
  pngPath: string | null;
}

export interface CardImageOpts {
  /** Output dir override (tests). Default: ~/Downloads if it exists, else cwd. */
  dir?: string;
  platform?: NodeJS.Platform;
  /** Injectable qlmanage runner (tests). */
  execFileSyncFn?: (cmd: string, args: string[]) => void;
}

/** Default output dir: ~/Downloads when present, else the current directory. */
export function defaultCardDir(home: string = homedir(), cwd: string = process.cwd()): string {
  const downloads = join(home, "Downloads");
  return existsSync(downloads) ? downloads : cwd;
}

/**
 * Write the SVG (and, on darwin, best-effort PNG) card for this Summary.
 * Never throws for the PNG leg — SVG-only is the graceful floor.
 */
export function writeCardImage(s: Summary, opts: CardImageOpts = {}): CardImageResult {
  const dir = opts.dir ?? defaultCardDir();
  const platform = opts.platform ?? process.platform;
  const exec = opts.execFileSyncFn ?? ((cmd: string, args: string[]) => execFileSync(cmd, args, { stdio: "ignore" }));

  const svgPath = join(dir, `${CARD_BASENAME}.svg`);
  writeFileSync(svgPath, buildCardSvg(s), "utf8");

  let pngPath: string | null = null;
  if (platform === "darwin") {
    try {
      // qlmanage renders `<basename>.svg.png` into the -o dir.
      exec("qlmanage", ["-t", "-s", "1440", "-o", dir, svgPath]);
      const qlOut = join(dir, `${CARD_BASENAME}.svg.png`);
      if (existsSync(qlOut)) {
        const target = join(dir, `${CARD_BASENAME}.png`);
        renameSync(qlOut, target);
        pngPath = target;
      }
    } catch {
      pngPath = null; // silent SVG-only fallback
    }
  }
  return { svgPath, pngPath };
}
