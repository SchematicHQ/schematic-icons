// Local-only icon previewer. Reads dist/schematic-icons.{json,css} and emits preview.html
// at the repo root.
//
// Usage:
//   yarn preview                  # full grid only
//   yarn preview stripe orb       # adds a "featured" row and an in-circle row for those icons
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "dist/schematic-icons.json"), "utf8"));
const css = fs.readFileSync(path.join(root, "dist/schematic-icons.css"), "utf8");

const requested = process.argv.slice(2);
const featured = requested.filter((n) => n in manifest);
const unknown = requested.filter((n) => !(n in manifest));
if (unknown.length) {
  console.warn(`warning: unknown icon(s) ignored: ${unknown.join(", ")}`);
}
const featuredSet = new Set(featured);
const rest = Object.keys(manifest).filter((n) => !featuredSet.has(n)).sort();

const cell = (name) => `
      <div class="cell">
        <i class="icon icon-${name}"></i>
        <span class="label">${name}</span>
      </div>`;

const circleCell = (name) => `
      <div class="circle-cell">
        <div class="circle"><i class="icon icon-${name}"></i></div>
        <span class="label">${name}</span>
      </div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>schematic-icons preview (${Object.keys(manifest).length} icons)</title>
<style>
${css}
body { font: 13px/1.4 -apple-system, system-ui, sans-serif; margin: 0; padding: 32px; background: #fafafa; color: #111; }
h1 { font-size: 16px; margin: 0 0 4px; }
h2 { font-size: 13px; margin: 32px 0 12px; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.hint { color: #888; margin: 0 0 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1px; background: #e5e5e5; border: 1px solid #e5e5e5; }
.cell { background: #fff; padding: 20px 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.cell .icon { font-size: 48px; line-height: 1; color: #111; }
.cell .label { font-size: 11px; color: #666; font-family: ui-monospace, "SF Mono", Menlo, monospace; overflow: hidden; text-overflow: ellipsis; max-width: 100%; white-space: nowrap; }
.featured .cell { background: #fff8e1; }
.featured .cell .icon { color: #000; }
.circle-grid { display: flex; flex-wrap: wrap; gap: 32px; padding: 28px 24px; background: #fff; border: 1px solid #e5e5e5; }
.circle-cell { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.circle-cell .circle { width: 40px; height: 40px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.circle-cell .circle .icon { font-size: 24px; line-height: 1; color: #111; }
.circle-cell .label { font-size: 11px; color: #666; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
.controls { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.controls label { display: inline-flex; gap: 6px; align-items: center; color: #666; }
.dark body { background: #111; color: #eee; }
.dark .cell { background: #1c1c1c; }
.dark .cell .icon { color: #eee; }
.dark .cell .label { color: #888; }
.dark .featured .cell { background: #2a2416; }
.dark .circle-grid { background: #1c1c1c; border-color: #333; }
.dark .circle-cell .circle { background: #2d2d2d; }
.dark .circle-cell .circle .icon { color: #eee; }
.dark .circle-cell .label { color: #888; }
.dark .grid { background: #333; border-color: #333; }
.dark h2 { color: #888; }
.dark .hint { color: #666; }
</style>
</head>
<body>
<h1>schematic-icons preview</h1>
<p class="hint">${Object.keys(manifest).length} icons. Toggle dark mode to check contrast.</p>
<div class="controls">
  <label><input type="checkbox" onchange="document.documentElement.classList.toggle('dark', this.checked)"> dark background</label>
  <label>size <input type="range" min="16" max="128" value="48" oninput="document.querySelectorAll('.cell .icon').forEach(e => e.style.fontSize = this.value + 'px')"></label>
</div>

${featured.length ? `<h2>featured</h2>
<div class="grid featured">${featured.map(cell).join("")}
</div>
<h2>featured — in-circle preview</h2>
<div class="circle-grid">${featured.map(circleCell).join("")}
</div>` : ""}

<h2>all icons (alphabetical)</h2>
<div class="grid">${rest.map(cell).join("")}
</div>
</body>
</html>
`;

const out = path.join(root, "preview.html");
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${html.length} bytes, ${Object.keys(manifest).length} icons)`);
