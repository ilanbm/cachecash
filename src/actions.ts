/**
 * Actions API (contracts). the actions module replaces this module with the real settings.json
 * edit (backup-first, preserve unknown keys, refuse if FORCE_PROMPT_CACHING_5M
 * is set) + baseline file (~/.claude/cache-cash.json) + verify/recheck logic
 * that re-runs the pipeline. Everything below is a stub that prints the manual
 * one-line instruction instead of writing anything. Read-only law (design
 * a locked choice) is upheld: this stub never touches the filesystem.
 *
 * // the actions module replaces this entire module.
 */

export interface ActionResult {
  /** true if a real write happened. Always false in this stub. */
  applied: boolean;
  /** Lines to print to the user (manual instructions in stub mode). */
  message: string[];
}

/**
 * Called after the ending-A [y/N] consent prompt accepts. the actions module's real
 * implementation backs up ~/.claude/settings.json, sets
 * `env.ENABLE_PROMPT_CACHING_1H=1`, preserves unknown keys, and writes the
 * baseline file. This stub only prints the manual instruction.
 */
export function applyEnable(): ActionResult {
  return {
    applied: false,
    message: [
      "cache-cash: automatic enable isn't wired up yet (the actions module).",
      "To enable the 1h cache TTL yourself, add this to ~/.claude/settings.json:",
      "",
      '  "env": { "ENABLE_PROMPT_CACHING_1H": "1" }',
      "",
      "Then start a new session (the flag only applies to sessions started",
      "after the change) and re-run `cache-cash --days 1` to confirm 1h landed.",
    ],
  };
}

/** `cache-cash revert` — the actions module's real implementation removes the env flag / sets FORCE_PROMPT_CACHING_5M. */
export function applyRevert(): ActionResult {
  return {
    applied: false,
    message: [
      "cache-cash: automatic revert isn't wired up yet (the actions module).",
      "To revert to the 5m cache TTL yourself, remove ENABLE_PROMPT_CACHING_1H",
      "from ~/.claude/settings.json, or set:",
      "",
      '  "env": { "FORCE_PROMPT_CACHING_5M": "1" }',
      "",
      "Then start a new session for the change to take effect.",
    ],
  };
}

/** `cache-cash verify` — the actions module's real implementation re-runs the pipeline at --days 1 and reads ttlRealityCheck. */
export function runVerify(): ActionResult {
  return {
    applied: false,
    message: [
      "cache-cash: automatic verify isn't wired up yet (the actions module).",
      "To check manually, run:",
      "",
      "  npx cache-cash --days 1",
      "",
      'And look at the "TTL received" line in the header — it reflects what',
      "actually landed in your transcripts, not what settings.json says.",
    ],
  };
}

/** `cache-cash recheck` — the actions module's real implementation compares current numbers against the enable-time baseline. */
export function runRecheck(): ActionResult {
  return {
    applied: false,
    message: [
      "cache-cash: automatic recheck isn't wired up yet (the actions module).",
      "recheck will compare your current numbers against the baseline saved",
      "when you ran `enable`, and show \"since switching: $X saved\".",
      "For now, re-run the full checkup and compare by eye:",
      "",
      "  npx cache-cash",
    ],
  };
}
