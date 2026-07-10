/**
 * Generated share-image tests (v1.0.2). The SVG writer's file IO runs against
 * an injected temp dir — never a real ~/Downloads — and the darwin PNG leg
 * uses an injected qlmanage stub, so nothing here spawns a real process.
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildCardSvg, CARD_BASENAME, defaultCardDir, escapeXml, writeCardImage } from "../src/cardimage.js";
import {
  fixtureEndingAEnable,
  fixtureEndingBOptimal,
  fixtureEndingCReceipt,
} from "./fixtures/summaries.js";

const PROJECT_LEAKS = ["orders-api", "web-dashboard", "widgetco", "quietco", "-Users-"];

describe("buildCardSvg", () => {
  it("is well-formed XML: single svg root, balanced text tags, no raw ampersands", () => {
    for (const s of [fixtureEndingAEnable, fixtureEndingBOptimal, fixtureEndingCReceipt]) {
      const svg = buildCardSvg(s);
      expect(svg.startsWith("<svg ")).toBe(true);
      expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect((svg.match(/<text/g) ?? []).length).toBe((svg.match(/<\/text>/g) ?? []).length);
      expect((svg.match(/<tspan/g) ?? []).length).toBe((svg.match(/<\/tspan>/g) ?? []).length);
      // every & must be an entity
      expect(svg).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+);)/);
    }
  });
  it("substitutes the Summary numbers (ending C: API-value figure, score, scale)", () => {
    const svg = buildCardSvg(fixtureEndingCReceipt);
    expect(svg).toContain("YOUR 1H CACHE RECEIPT");
    expect(svg).toContain("saved ≈$2,500.95 in API-value (last 90d)");
    expect(svg).toContain("efficiency score: 98.5 / 100");
    expect(svg).toMatch(/[\d.]+B tokens · 590 sessions/);
  });
  it("A/B endings lead with the score", () => {
    const a = buildCardSvg(fixtureEndingAEnable);
    expect(a).toContain("CACHE EFFICIENCY SCORE");
    expect(a).toContain("71.2 / 100");
    const b = buildCardSvg(fixtureEndingBOptimal);
    expect(b).toContain("96.3 / 100");
    expect(b).toContain("certified optimal");
  });
  it("share-safe: no project names, no -eq; brand label is cache-refund", () => {
    for (const s of [fixtureEndingAEnable, fixtureEndingBOptimal, fixtureEndingCReceipt]) {
      const svg = buildCardSvg(s);
      for (const leak of PROJECT_LEAKS) expect(svg).not.toContain(leak);
      expect(svg).not.toContain("-eq");
      expect(svg).toContain(">cache-refund</text>");
    }
    // subscriber footer carries the API-value qualifier
    expect(buildCardSvg(fixtureEndingCReceipt)).toContain("$ figures are API-value");
    expect(buildCardSvg(fixtureEndingAEnable)).not.toContain("$ figures are API-value");
  });
  it("escapeXml escapes all five specials", () => {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe("a &amp; b &lt; c &gt; d &quot; e &apos; f");
  });
});

describe("writeCardImage (injected dir + qlmanage stub — no real system access)", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "cache-refund-card-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes the SVG into the injected dir; non-darwin skips PNG entirely", () => {
    let execCalled = false;
    const res = writeCardImage(fixtureEndingCReceipt, {
      dir,
      platform: "linux",
      execFileSyncFn: () => {
        execCalled = true;
      },
    });
    expect(res.svgPath).toBe(join(dir, `${CARD_BASENAME}.svg`));
    expect(existsSync(res.svgPath)).toBe(true);
    expect(res.pngPath).toBeNull();
    expect(execCalled).toBe(false);
    expect(readFileSync(res.svgPath, "utf8")).toContain("YOUR 1H CACHE RECEIPT");
  });

  it("darwin: renames qlmanage's <name>.svg.png output to <name>.png", () => {
    const res = writeCardImage(fixtureEndingCReceipt, {
      dir,
      platform: "darwin",
      execFileSyncFn: (cmd, args) => {
        expect(cmd).toBe("qlmanage");
        expect(args).toContain("-t");
        expect(args).toContain("1440");
        // simulate qlmanage's output naming
        writeFileSync(join(dir, `${CARD_BASENAME}.svg.png`), "png-bytes");
      },
    });
    expect(res.pngPath).toBe(join(dir, `${CARD_BASENAME}.png`));
    expect(existsSync(res.pngPath!)).toBe(true);
    expect(existsSync(join(dir, `${CARD_BASENAME}.svg.png`))).toBe(false); // renamed away
  });

  it("darwin: silent SVG-only fallback when qlmanage fails", () => {
    const res = writeCardImage(fixtureEndingCReceipt, {
      dir,
      platform: "darwin",
      execFileSyncFn: () => {
        throw new Error("qlmanage exploded");
      },
    });
    expect(existsSync(res.svgPath)).toBe(true);
    expect(res.pngPath).toBeNull();
  });

  it("defaultCardDir: ~/Downloads when present, else cwd", () => {
    const home = mkdtempSync(join(tmpdir(), "cache-refund-home-"));
    try {
      expect(defaultCardDir(home, "/some/cwd")).toBe("/some/cwd"); // no Downloads yet
      const dl = join(home, "Downloads");
      mkdirSync(dl, { recursive: true });
      expect(defaultCardDir(home, "/some/cwd")).toBe(dl);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});
