#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const threshold = Number(process.argv[2] || 80);

async function main() {
  try {
    const raw = await readFile("coverage/coverage-summary.json", "utf8");
    const json = JSON.parse(raw);
    const files = Object.entries(json).filter(([k]) => k !== "total");
    const below = files
      .filter(
        ([, v]) =>
          v.lines.pct < threshold ||
          v.branches.pct < threshold ||
          v.functions.pct < threshold ||
          v.statements.pct < threshold,
      )
      .sort((a, b) => a[1].lines.pct - b[1].lines.pct);

    if (below.length === 0) {
      console.log(`All files meet coverage ≥ ${threshold}%`);
      return;
    }

    console.log(`Files below ${threshold}% coverage:`);
    for (const [file, stats] of below) {
      const { lines, branches, functions, statements } = stats;
      console.log(
        `- ${file} :: lines ${lines.pct}% | branches ${branches.pct}% | funcs ${functions.pct}% | stmts ${statements.pct}%`,
      );
    }
  } catch (err) {
    console.error(
      "Unable to read coverage summary. Make sure to run tests with coverage first.",
    );
    console.error(err?.message || err);
    process.exit(1);
  }
}

main();
