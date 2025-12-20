#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: check-no-emoji-commit-msg <commit-msg-file>");
  process.exit(2);
}

const msg = fs.readFileSync(file, "utf8");
// Broad emoji ranges + variation selectors
const EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{FE0F}]/u;

if (EMOJI_REGEX.test(msg)) {
  console.error(
    "\nCommit message contains emojis. Please remove them and use clear language.",
  );
  console.error("Buffalo Projects brand: no emojis in commits/PRs.");
  process.exit(1);
}
