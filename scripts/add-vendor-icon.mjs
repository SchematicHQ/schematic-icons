// Generate a schematic-icons glyph from a brand logo, end to end.
//
// SCOPE: vendor/brand icons only (Stripe, Clerk, Orb, WorkOS, ...). The repo's
// generic UI icons (arrows, chevrons, etc.) are hand-authored SVGs in src/svg
// and are NOT produced by this script — don't point it at those.
//
// Pipeline: fetch the logo from logo.dev (raster) -> potrace trace -> normalize
// into the repo's `0 0 24 24` / fill="black" glyph convention -> preview ->
// (on approval) commit on a branch and open a draft PR.
//
// logo.dev's image CDN is raster-only, so the conversion traces the bitmap.
// Tracing is lossy and brand-dependent (tiled "app-icon" logos trace worse than
// clean standalone marks), which is exactly why there's an approval gate before
// anything is committed. Tune a bad trace with --invert / --threshold.
//
// Usage:
//   yarn add-vendor-icon <name> <domain>        # e.g. yarn add-vendor-icon workos workos.com
//   yarn add-vendor-icon <name> --file logo.png # trace a local image instead of fetching
//
// Options:
//   --token <key>     logo.dev PUBLISHABLE key (else $LOGO_DEV_API_KEY, else prompt)
//   --file <path>     trace a local image instead of fetching from logo.dev
//   --invert          trace light marks on dark backgrounds (white-on-tile logos)
//   --threshold <n>   potrace luminance threshold 0-255 (default: auto)
//   --size <px>       logo.dev fetch size (default 512)
//   --color           fetch the color logo instead of greyscale
//   --yes             skip the approval prompt (auto-approve)
//   --no-open         don't open preview.html in a browser
//   --no-pr           stop after preview; don't branch/commit/push/open a PR
//   --force           overwrite an existing icon of the same name

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

import { Potrace, trace } from "potrace";
import {
  encodeSVGPath,
  SVGPathData,
  SVGPathDataTransformer,
} from "svg-pathdata";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BOX = 24; // target viewBox edge
const PAD = 1; // padding inside the box; keeps bbox ~1..23 like sibling icons

function die(msg) {
  console.error(`\nerror: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { positional: [], greyscale: true, pr: true, open: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--token":
        opts.token = argv[++i];
        break;
      case "--file":
        opts.file = argv[++i];
        break;
      case "--invert":
        opts.invert = true;
        break;
      case "--threshold":
        opts.threshold = Number(argv[++i]);
        break;
      case "--size":
        opts.size = Number(argv[++i]);
        break;
      case "--color":
        opts.greyscale = false;
        break;
      case "--yes":
        opts.yes = true;
        break;
      case "--no-open":
        opts.open = false;
        break;
      case "--no-pr":
        opts.pr = false;
        break;
      case "--force":
        opts.force = true;
        break;
      default:
        if (a.startsWith("--")) die(`unknown option: ${a}`);
        opts.positional.push(a);
    }
  }
  return opts;
}

// Bare domain from a domain or full URL.
function toDomain(input) {
  const s = /^https?:\/\//.test(input) ? input : `https://${input}`;
  try {
    return new URL(s).hostname.replace(/^www\./, "");
  } catch {
    return die(`could not parse a domain from "${input}"`);
  }
}

async function resolveToken(opts) {
  if (opts.token) return opts.token;
  if (process.env.LOGO_DEV_API_KEY) return process.env.LOGO_DEV_API_KEY;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const t = (await rl.question("logo.dev publishable key (pk_...): ")).trim();
  rl.close();
  return t || die("no logo.dev key provided");
}

async function fetchLogo(domain, opts) {
  const token = await resolveToken(opts);
  const url = new URL(`https://img.logo.dev/${encodeURIComponent(domain)}`);
  url.searchParams.set("token", token);
  url.searchParams.set("format", "png");
  url.searchParams.set("size", String(opts.size || 512));
  url.searchParams.set("retina", "true");
  if (opts.greyscale) url.searchParams.set("greyscale", "true");
  // Don't trace logo.dev's generated letter-monogram fallback.
  url.searchParams.set("fallback", "404");

  const res = await fetch(url);
  if (!res.ok) {
    die(
      `logo.dev returned HTTP ${res.status} for "${domain}" (no logo on file, or bad key)`,
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const isPng =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) die(`logo.dev did not return a PNG for "${domain}"`);
  return buf;
}

function traceToPaths(input, opts) {
  const params = {
    turdSize: 2,
    optTolerance: 0.4,
    color: "black",
    background: "transparent",
    blackOnWhite: !opts.invert,
    threshold: Number.isFinite(opts.threshold)
      ? opts.threshold
      : Potrace.THRESHOLD_AUTO,
  };
  return new Promise((resolve, reject) => {
    trace(input, params, (err, svg) => {
      if (err) return reject(err);
      const ds = [...svg.matchAll(/\bd="([^"]+)"/g)].map((m) => m[1]);
      if (!ds.length) {
        return reject(
          new Error("trace produced no paths (try --invert or --threshold)"),
        );
      }
      resolve(ds.map((d) => new SVGPathData(d).toAbs()));
    });
  });
}

// Loose bbox over absolute command coordinates (control points included, so it
// slightly over-estimates — safe: the glyph gets marginally more padding, never clipped).
function boundingBox(paths) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const pd of paths) {
    for (const c of pd.commands) {
      for (const key of ["x", "x1", "x2"]) {
        if (c[key] != null) {
          minX = Math.min(minX, c[key]);
          maxX = Math.max(maxX, c[key]);
        }
      }
      for (const key of ["y", "y1", "y2"]) {
        if (c[key] != null) {
          minY = Math.min(minY, c[key]);
          maxY = Math.max(maxY, c[key]);
        }
      }
    }
  }
  return { minX, minY, w: maxX - minX, h: maxY - minY };
}

function normalizeToGlyph(paths) {
  const b = boundingBox(paths);
  if (!(b.w > 0 && b.h > 0)) die("traced geometry has no area");
  const s = Math.min((BOX - 2 * PAD) / b.w, (BOX - 2 * PAD) / b.h);
  const tx = (BOX - b.w * s) / 2 - b.minX * s;
  const ty = (BOX - b.h * s) / 2 - b.minY * s;
  const matrix = SVGPathDataTransformer.MATRIX(s, 0, 0, s, tx, ty);
  return paths.map((pd) =>
    encodeSVGPath(pd.transform(matrix).round(1000).commands),
  );
}

function writeGlyph(name, ds) {
  const body = ds
    .map(
      (d) =>
        `<path fill-rule="evenodd" clip-rule="evenodd" d="${d}" fill="black"/>`,
    )
    .join("\n");
  const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>
`;
  const dest = path.join(root, "src", "svg", `${name}.svg`);
  fs.writeFileSync(dest, svg);
  return dest;
}

function run(cmd, args) {
  execFileSync(cmd, args, { cwd: root, stdio: "inherit" });
}

function capture(cmd, args) {
  return execFileSync(cmd, args, { cwd: root }).toString().trim();
}

async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ans = (await rl.question(question)).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes";
}

function openInBrowser(file) {
  const opener = process.platform === "darwin" ? "open" : "xdg-open";
  try {
    execFileSync(opener, [file], { cwd: root, stdio: "ignore" });
  } catch {
    console.log(`(open ${path.relative(root, file)} to view)`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const [name, source] = opts.positional;

  if (!name)
    die(
      "usage: yarn add-vendor-icon <name> <domain>  (see scripts/add-vendor-icon.mjs header)",
    );
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    die(`icon name must be kebab-case, got "${name}"`);
  }
  if (!opts.file && !source)
    die(`no logo source: pass a <domain> or --file <path>`);

  const dest = path.join(root, "src", "svg", `${name}.svg`);
  if (fs.existsSync(dest) && !opts.force) {
    die(`src/svg/${name}.svg already exists (use --force to overwrite)`);
  }

  // 1. Get the raster.
  let input;
  let sourceDesc;
  if (opts.file) {
    if (!fs.existsSync(opts.file)) die(`file not found: ${opts.file}`);
    input = opts.file;
    sourceDesc = `local file ${path.basename(opts.file)}`;
    console.log(`tracing local image ${opts.file}`);
  } else {
    const domain = toDomain(source);
    console.log(
      `fetching ${opts.greyscale ? "greyscale " : ""}logo for ${domain} from logo.dev...`,
    );
    input = await fetchLogo(domain, opts);
    sourceDesc = `logo.dev (${domain})`;
  }

  // 2-3. Trace + normalize into the glyph convention.
  const paths = await traceToPaths(input, opts);
  const ds = normalizeToGlyph(paths);
  writeGlyph(name, ds);
  console.log(
    `wrote src/svg/${name}.svg (${ds.length} path${ds.length > 1 ? "s" : ""})`,
  );

  // 4. Preview with the new icon highlighted, then ask for approval.
  run("yarn", ["preview", name]);
  if (opts.open) openInBrowser(path.join(root, "preview.html"));

  if (!opts.yes) {
    const ok = await confirm(
      `\nApprove "${name}"? (preview.html is open) — y to commit + open a draft PR: `,
    );
    if (!ok) {
      console.log(
        `aborted. left src/svg/${name}.svg in place for inspection or manual tuning.`,
      );
      process.exit(0);
    }
  }

  if (!opts.pr) {
    console.log(`--no-pr: keeping src/svg/${name}.svg, skipping git.`);
    process.exit(0);
  }

  // 5. Commit on a branch and open a draft PR.
  const branch = `add-${name}-icon`;
  if (capture("git", ["branch", "--show-current"]) !== branch) {
    run("git", ["checkout", "-b", branch]);
  }
  run("git", ["add", path.relative(root, dest)]);
  run("git", ["commit", "-m", `feat: add ${name} icon`]);
  run("git", ["push", "-u", "origin", branch]);
  run("gh", [
    "pr",
    "create",
    "--draft",
    "--base",
    "main",
    "--title",
    `feat: add ${name} icon`,
    "--body",
    `Adds a \`${name}\` brand glyph, traced from ${sourceDesc} and normalized into the repo's \`0 0 24 24\` / fill="black" convention via \`yarn add-vendor-icon\`.`,
  ]);
}

main().catch((err) => die(err.message));
