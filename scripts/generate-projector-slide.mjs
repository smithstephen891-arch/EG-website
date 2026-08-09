import QRCode from "qrcode";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Design tokens
const CREAM = "#FDF8E8";
const CHARCOAL = "#2D2A26";
const OLIVE = "#8B9A46";
const CHARCOAL_50 = "rgba(45, 42, 38, 0.5)";

// Dimensions: 3840x2160 (4K 16:9) for maximum projector quality
const WIDTH = 3840;
const HEIGHT = 2160;

const DONATE_URL = "https://www.elizabethsgift.com/donate";

async function generateSlide() {
  // Generate QR code as SVG path data
  const qrSvg = await QRCode.toString(DONATE_URL, {
    type: "svg",
    margin: 0,
    color: { dark: CHARCOAL, light: CREAM },
    errorCorrectionLevel: "H",
  });

  // Extract the SVG content (paths) from the QR code output
  // The qrcode library outputs a full SVG — we need to extract paths and viewBox
  const viewBoxMatch = qrSvg.match(/viewBox="([^"]+)"/);
  const qrViewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 33 33";
  const pathsMatch = qrSvg.match(/<path[^>]*\/>/g);
  const qrPaths = pathsMatch ? pathsMatch.join("\n") : "";

  // Read the logo SVG
  const logoSvg = readFileSync(resolve(projectRoot, "public/images/eg-logo.svg"), "utf-8");
  // Extract just the paths from the logo
  const logoPathMatches = logoSvg.match(/<path[^>]*\/>/g);
  const logoPaths = logoPathMatches ? logoPathMatches.join("\n") : "";

  // Layout calculations (centered vertically and horizontally)
  const centerX = WIDTH / 2;

  // Vertical layout from top:
  // Logo: ~400px tall, starting at y=280
  // Name: below logo
  // Tagline: below name
  // QR code: below tagline
  // "Scan to Donate" label: below QR

  const logoY = 260;
  const logoSize = 380;
  const nameY = logoY + logoSize + 80;
  const taglineY = nameY + 120;
  const dividerY = taglineY + 70;
  const qrY = dividerY + 70;
  const qrSize = 520;
  const labelY = qrY + qrSize + 110;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap');
    </style>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />

  <!-- Logo (centered) -->
  <g transform="translate(${centerX - logoSize / 2}, ${logoY}) scale(${logoSize / 1080})">
    ${logoPaths.replace(/class="st0"/g, `fill="${OLIVE}"`)}
  </g>

  <!-- Organization Name -->
  <text x="${centerX}" y="${nameY}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
        font-size="180" font-weight="500" fill="${CHARCOAL}" letter-spacing="-2">
    Elizabeth&#x2019;s Gift
  </text>

  <!-- Tagline -->
  <text x="${centerX}" y="${taglineY}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
        font-size="72" font-weight="400" font-style="italic" fill="${CHARCOAL_50}">
    Lifting Up and Living Fully
  </text>

  <!-- Decorative divider -->
  <line x1="${centerX - 80}" y1="${dividerY}" x2="${centerX + 80}" y2="${dividerY}"
        stroke="${OLIVE}" stroke-width="2" opacity="0.5" />

  <!-- QR Code (centered) -->
  <g transform="translate(${centerX - qrSize / 2}, ${qrY})">
    <!-- QR background/border -->
    <rect x="-30" y="-30" width="${qrSize + 60}" height="${qrSize + 60}"
          rx="20" fill="white" />
    <rect x="-28" y="-28" width="${qrSize + 56}" height="${qrSize + 56}"
          rx="18" fill="none" stroke="${OLIVE}" stroke-width="3" opacity="0.3" />
    <!-- QR code content -->
    <svg viewBox="${qrViewBox}" width="${qrSize}" height="${qrSize}">
      ${qrPaths}
    </svg>
  </g>

  <!-- Scan label -->
  <text x="${centerX}" y="${labelY}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
        font-size="48" font-weight="400" fill="${CHARCOAL}" opacity="0.6" letter-spacing="6">
    SCAN TO DONATE
  </text>

  <!-- URL below scan label -->
  <text x="${centerX}" y="${labelY + 55}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
        font-size="36" font-weight="400" fill="${OLIVE}" opacity="0.7">
    elizabethsgift.com/donate
  </text>
</svg>`;

  // Write SVG file
  const svgPath = resolve(projectRoot, "projector-slide.svg");
  writeFileSync(svgPath, svgContent);
  console.log(`SVG saved to: ${svgPath}`);

  // Also create an HTML version for easy full-screen display
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elizabeth's Gift - Projector Slide</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: ${CREAM}; }
    body { display: flex; align-items: center; justify-content: center; }
    img { width: 100%; height: 100%; object-fit: contain; }
  </style>
</head>
<body>
  <img src="data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}" alt="Elizabeth's Gift Projector Slide" />
</body>
</html>`;

  const htmlPath = resolve(projectRoot, "projector-slide.html");
  writeFileSync(htmlPath, htmlContent);
  console.log(`HTML saved to: ${htmlPath}`);

  console.log("\nDone! Two files created:");
  console.log("  1. projector-slide.svg  — Vector (infinite resolution, open in any browser)");
  console.log("  2. projector-slide.html — Full-screen HTML (open in browser, press F11 for fullscreen)");
  console.log("\nTo save as high-res PNG: open the HTML in Chrome, press F11, then take a screenshot.");
  console.log("Or right-click the SVG and open with a browser for instant display.");
}

generateSlide().catch(console.error);
