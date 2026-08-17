import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/*
 * Builds the site-wide social share card at public/og-image.png.
 *
 * Without one, iMessage and every other scraper picked whichever photo it
 * found on the page first — for the home page that was Elizabeth and her
 * father in the pool, which reads as a stranger's holiday snap when it turns
 * up in a text thread. This card is the mark and the name, nothing else.
 *
 * Run: node scripts/generate-og-image.mjs
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Design tokens, from src/app/globals.css.
const CREAM = "#FDF8E8";
const CHARCOAL = "#2D2A26";
const OLIVE = "#B9BA77"; // the logo's own olive, lighter than --color-olive

// 1200x630 is the size every scraper crops toward, iMessage included.
const WIDTH = 1200;
const HEIGHT = 630;

// Corben is a webfont, so it is not available to the rasteriser. Georgia is
// the nearest serif present on every machine that runs this, and matches the
// fallback stack the projector-slide scripts already use.
const SERIF = "Georgia, 'Times New Roman', serif";

const LOGO_SIZE = 290;
const LOGO_Y = 88;
const NAME_BASELINE = LOGO_Y + LOGO_SIZE + 92;

function buildSvg() {
  const logoSvg = readFileSync(resolve(projectRoot, "public/images/eg-logo.svg"), "utf-8");
  // The logo fills via a `.st0` class in a <style> block. Inline the fill
  // instead, so the paths survive being lifted out of their own document.
  const logoPaths = (logoSvg.match(/<path[^>]*\/>/g) || [])
    .join("\n    ")
    .replace(/class="st0"/g, `fill="${OLIVE}"`);

  if (!logoPaths) throw new Error("No paths found in eg-logo.svg");

  const centerX = WIDTH / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />

  <g transform="translate(${centerX - LOGO_SIZE / 2}, ${LOGO_Y}) scale(${LOGO_SIZE / 1080})">
    ${logoPaths}
  </g>

  <text x="${centerX}" y="${NAME_BASELINE}" text-anchor="middle"
        font-family="${SERIF}" font-size="76" font-weight="600"
        fill="${CHARCOAL}" letter-spacing="-1">Elizabeth&#x2019;s Gift</text>
</svg>`;
}

const svg = buildSvg();
const pngPath = resolve(projectRoot, "public/og-image.png");

// density lifts the rasteriser above the nominal 96dpi so the curves of the
// mark stay clean, then we resize back down to the exact card size.
const info = await sharp(Buffer.from(svg), { density: 288 })
  .resize(WIDTH, HEIGHT, { fit: "fill" })
  .png({ compressionLevel: 9 })
  .toFile(pngPath);

console.log(`Wrote ${pngPath} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
