#!/usr/bin/env node
// Lightweight validation for the single-file tracker (index.html).
// 1. Extracts the embedded <script> and syntax-checks it.
// 2. Runs it in a stubbed DOM and asserts the data + every screen build.
// 3. Confirms every tappable / swappable exercise has library instructions.
// No dependencies — just Node. Exits non-zero on the first failure.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");

const fail = (msg) => {
  console.error("‼️  " + msg);
  process.exit(1);
};

// --- 1. Extract the embedded script -----------------------------------------
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) fail("No <script> block found in index.html");
const code = m[1];

// --- 2. Compile (syntax check) ----------------------------------------------
let script;
try {
  script = new vm.Script(code, { filename: "index.html#script" });
} catch (e) {
  fail("JavaScript syntax error: " + e.message);
}

// --- 3. Run in a stubbed DOM ------------------------------------------------
const noop = () => {};
const el = {
  className: "", style: {}, innerHTML: "", textContent: "", value: "",
  appendChild: noop, removeChild: noop,
  querySelector: () => el, querySelectorAll: () => [],
};
const sandbox = {
  document: {
    getElementById: () => el, querySelector: () => el, querySelectorAll: () => [],
    createElement: () => el, body: el,
  },
  localStorage: { getItem: () => null, setItem: noop },
  navigator: {}, alert: noop, confirm: () => true,
  console,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
try {
  script.runInContext(sandbox);
} catch (e) {
  fail("Script threw while initialising: " + e.message);
}

const { DATA, libFor, getSwapOptions } = sandbox;
if (!DATA || typeof libFor !== "function") fail("Expected globals DATA / libFor not defined");

// Sessions present
const sessions = Object.keys(DATA);
if (!sessions.length) fail("DATA has no sessions");

// Every screen renders without throwing
for (const fn of ["rToday", "rSplit", "rSet", "rLibrary", "rHist", "rCal"]) {
  if (typeof sandbox[fn] !== "function") fail("Render function missing: " + fn);
  try { sandbox[fn](); } catch (e) { fail(fn + "() threw: " + e.message); }
}

// --- 4. Instruction coverage ------------------------------------------------
const missing = [];
const seen = {};
const note = (name, ctx) => {
  if (seen[name]) return;
  seen[name] = 1;
  if (!libFor(name)) missing.push(`${name}  [${ctx}]`);
};
for (const k of sessions) {
  const s = DATA[k];
  for (const f of ["strength", "opt", "abs"]) {
    for (const e of s[f] || []) {
      note(e.name, `${k}/${f}`);
      for (const a of e.alts || []) note(a.name, `${k}/${f}/alt`);
    }
  }
}
// Library-suggested alternatives become swap options too
for (const k of sessions) {
  const s = DATA[k];
  for (const f of ["strength", "opt"]) {
    for (const e of s[f] || []) {
      const lib = libFor(e.name);
      if (lib && lib.alts) for (const n of lib.alts) note(n, `libalt of ${e.name}`);
    }
  }
}
if (missing.length) {
  fail("Exercises with no library instructions:\n  - " + missing.join("\n  - "));
}

// Sanity: swap options resolve cleanly
for (const k of sessions) {
  for (const e of DATA[k].strength || []) {
    try { getSwapOptions(e); } catch (err) { fail(`getSwapOptions failed for ${e.name}: ${err.message}`); }
  }
}

console.log(`✅ Validation passed — ${sessions.length} sessions, all screens render, every exercise has instructions.`);
