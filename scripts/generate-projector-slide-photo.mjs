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

// 4K 16:9 canvas for projector
const WIDTH = 3840;
const HEIGHT = 2160;

const DONATE_URL = "https://www.elizabethsgift.com/donate";

// Source poster photo (family on the boat, already branded with name + tagline)
const PHOTO_W = 1080;
const PHOTO_H = 1350;

async function generateSlide() {
  // QR code paths
  const qrSvg = await QRCode.toString(DONATE_URL, {
    type: "svg",
    margin: 0,
    color: { dark: CHARCOAL, light: CREAM },
    errorCorrectionLevel: "H",
  });
  const viewBoxMatch = qrSvg.match(/viewBox="([^"]+)"/);
  const qrViewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 33 33";
  const pathsMatch = qrSvg.match(/<path[^>]*\/>/g);
  const qrPaths = pathsMatch ? pathsMatch.join("\n") : "";

  // Embed the photo as base64
  const photoBuf = readFileSync(resolve(projectRoot, "projector-photo.jpg"));
  const photoData = `data:image/jpeg;base64,${photoBuf.toString("base64")}`;

  const centerX = WIDTH / 2;

  // --- Photo on top (centered) ---
  const photoTop = 90;
  const photoH = 1560;
  const photoW = Math.round(photoH * (PHOTO_W / PHOTO_H)); // 1248
  const photoX = Math.round((WIDTH - photoW) / 2);
  const photoBottom = photoTop + photoH; // 1650

  // --- Donate cluster below: QR + scan text, centered as a group ---
  const qrSize = 300;
  const gap = 80;
  const textBlockW = 640;
  const clusterW = qrSize + gap + textBlockW;
  const clusterX = Math.round((WIDTH - clusterW) / 2);
  const clusterCenterY = photoBottom + 230; // 1880
  const qrX = clusterX;
  const qrY = clusterCenterY - qrSize / 2;
  const textX = clusterX + qrSize + gap;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap');
    </style>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />

  <!-- Photo poster (centered, top) -->
  <g>
    <image href="${photoData}" x="${photoX}" y="${photoTop}" width="${photoW}" height="${photoH}" preserveAspectRatio="xMidYMid slice" />
    <rect x="${photoX}" y="${photoTop}" width="${photoW}" height="${photoH}" fill="none" stroke="${CHARCOAL}" stroke-opacity="0.12" stroke-width="2" />
  </g>

  <!-- Divider between photo and donate cluster -->
  <line x1="${centerX - 70}" y1="${photoBottom + 75}" x2="${centerX + 70}" y2="${photoBottom + 75}" stroke="${OLIVE}" stroke-width="3" opacity="0.5" />

  <!-- Donate cluster: QR + text -->
  <g transform="translate(${qrX}, ${qrY})">
    <rect x="-26" y="-26" width="${qrSize + 52}" height="${qrSize + 52}" rx="16" fill="white" />
    <rect x="-24" y="-24" width="${qrSize + 48}" height="${qrSize + 48}" rx="14" fill="none" stroke="${OLIVE}" stroke-width="2.5" opacity="0.3" />
    <svg viewBox="${qrViewBox}" width="${qrSize}" height="${qrSize}">
      ${qrPaths}
    </svg>
  </g>

  <text x="${textX}" y="${clusterCenterY - 18}" text-anchor="start"
        font-family="'Playfair Display', Georgia, serif"
        font-size="66" font-weight="500" fill="${CHARCOAL}" letter-spacing="4">
    Scan to Donate
  </text>
  <text x="${textX}" y="${clusterCenterY + 58}" text-anchor="start"
        font-family="'Playfair Display', Georgia, serif"
        font-size="44" font-weight="400" fill="${OLIVE}">
    elizabethsgift.com/donate
  </text>
</svg>`;

  const svgPath = resolve(projectRoot, "projector-slide-photo.svg");
  writeFileSync(svgPath, svgContent);
  console.log(`SVG saved to: ${svgPath}`);

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
  const htmlPath = resolve(projectRoot, "projector-slide-photo.html");
  writeFileSync(htmlPath, htmlContent);
  console.log(`HTML saved to: ${htmlPath}`);
  console.log("Done.");
}

generateSlide().catch(console.error);
