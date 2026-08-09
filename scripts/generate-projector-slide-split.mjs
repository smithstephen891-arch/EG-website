import QRCode from "qrcode";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const CREAM = "#FDF8E8";
const CHARCOAL = "#2D2A26";
const OLIVE = "#8B9A46";

const WIDTH = 3840;
const HEIGHT = 2160;
const DONATE_URL = "https://www.elizabethsgift.com/donate";

const PHOTO_W = 1080;
const PHOTO_H = 1350;

async function generateSlide() {
  const qrSvg = await QRCode.toString(DONATE_URL, {
    type: "svg",
    margin: 0,
    color: { dark: CHARCOAL, light: CREAM },
    errorCorrectionLevel: "H",
  });
  const qrViewBox = (qrSvg.match(/viewBox="([^"]+)"/) || [])[1] || "0 0 33 33";
  const qrPaths = (qrSvg.match(/<path[^>]*\/>/g) || []).join("\n");

  const photoBuf = readFileSync(resolve(projectRoot, "projector-photo.jpg"));
  const photoData = `data:image/jpeg;base64,${photoBuf.toString("base64")}`;

  // Logo paths (olive), scaled from a 1080x1080 viewBox
  const logoSvg = readFileSync(resolve(projectRoot, "public/images/eg-logo.svg"), "utf-8");
  const logoPaths = (logoSvg.match(/<path[^>]*\/>/g) || [])
    .join("\n")
    .replace(/class="st0"/g, `fill="${OLIVE}"`);

  // --- Left: photo poster, vertically centered ---
  const photoH = 1760;
  const photoW = Math.round(photoH * (PHOTO_W / PHOTO_H)); // 1408
  const photoY = Math.round((HEIGHT - photoH) / 2); // 200
  const photoX = 256;
  const photoRight = photoX + photoW; // 1664

  // --- Right: donate column, centered in the remaining space ---
  const rightCenterX = Math.round(photoRight + (WIDTH - photoRight) / 2); // ~2752

  const logoSize = 230;
  const logoY = 560;
  const logoScale = logoSize / 1080;

  const headingY = 935;

  const qrSize = 460;
  const qrY = 1015;
  const qrX = rightCenterX - qrSize / 2;

  const urlY = 1605;

  const dividerX = Math.round((photoRight + rightCenterX - 230) / 2);

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap');
    </style>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />

  <!-- Left: photo poster -->
  <g>
    <image href="${photoData}" x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" preserveAspectRatio="xMidYMid meet" />
    <rect x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" fill="none" stroke="${CHARCOAL}" stroke-opacity="0.12" stroke-width="2" />
  </g>

  <!-- Subtle vertical divider -->
  <line x1="${dividerX}" y1="${photoY + 120}" x2="${dividerX}" y2="${photoY + photoH - 120}" stroke="${OLIVE}" stroke-width="2" opacity="0.25" />

  <!-- Right: donate column -->
  <g transform="translate(${rightCenterX - logoSize / 2}, ${logoY}) scale(${logoScale})">
    ${logoPaths}
  </g>

  <text x="${rightCenterX}" y="${headingY}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, serif"
        font-size="90" font-weight="500" fill="${CHARCOAL}" letter-spacing="3">
    Scan to Donate
  </text>

  <g transform="translate(${qrX}, ${qrY})">
    <rect x="-30" y="-30" width="${qrSize + 60}" height="${qrSize + 60}" rx="18" fill="white" />
    <rect x="-28" y="-28" width="${qrSize + 56}" height="${qrSize + 56}" rx="16" fill="none" stroke="${OLIVE}" stroke-width="3" opacity="0.3" />
    <svg viewBox="${qrViewBox}" width="${qrSize}" height="${qrSize}">
      ${qrPaths}
    </svg>
  </g>

  <text x="${rightCenterX}" y="${urlY}" text-anchor="middle"
        font-family="'Playfair Display', Georgia, serif"
        font-size="52" font-weight="400" fill="${OLIVE}">
    elizabethsgift.com/donate
  </text>
</svg>`;

  writeFileSync(resolve(projectRoot, "projector-slide-split.svg"), svgContent);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
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
  writeFileSync(resolve(projectRoot, "projector-slide-split.html"), htmlContent);
  console.log("Done — projector-slide-split.svg / .html");
}

generateSlide().catch(console.error);
