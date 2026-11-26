// post-x-promote-make-your-own-bounty-01 entry (Node 22, standard library only, no network).
// The entry is one X post by @sofianeouafir quoting make.fun's make-your-own-bounty post.
// This program hands that post in: it reads POST.json from the bot folder and writes it to
// the output folder, where the house gate picks it up.
//
// In the grader container the folders are /bot and /output. Locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(msg: string): never {
  console.error(`POST.json: ${msg}`);
  process.exit(1);
}

let doc: { url?: unknown };
try {
  doc = JSON.parse(readFileSync(join(BOT_DIR, "POST.json"), "utf8"));
} catch (err) {
  fail(`could not be read from ${BOT_DIR}: ${(err as Error).message}`);
}

const url = typeof doc.url === "string" ? doc.url.trim() : "";
const m = url.match(/^https:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})$/);
if (!m) fail("url must be https://x.com/<handle>/status/<id>");
// The entry is our own post, never make.fun's post that it quotes.
if (m[1].toLowerCase() === "makefunai") fail("url names make.fun's own post, not the entrant's");

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, "POST.json"), JSON.stringify({ url }) + "\n");
console.log(`handed in ${url}`);
