import fs from "fs/promises";
import path from "path";

let cachedLogo: Buffer | null = null;

/** Load company logo PNG buffer (SVG rasterized or vector fallback via pdfkit caller). */
export async function loadCompanyLogoBuffer(): Promise<Buffer | null> {
  if (cachedLogo) return cachedLogo;

  const pngPath = path.join(process.cwd(), "public/brand/rakshak-enrollment-logo.png");
  const legacyPngPath = path.join(process.cwd(), "public/brand/logo.png");
  const svgPath = path.join(process.cwd(), "public/brand/logo.svg");

  try {
    await fs.access(pngPath);
    cachedLogo = await fs.readFile(pngPath);
    return cachedLogo;
  } catch {
    // try legacy path
  }

  try {
    await fs.access(legacyPngPath);
    cachedLogo = await fs.readFile(legacyPngPath);
    return cachedLogo;
  } catch {
    // PNG not provided — caller draws vector fallback
  }

  try {
    const svg = await fs.readFile(svgPath);
    try {
      const sharp = (await import("sharp")).default;
      cachedLogo = await sharp(svg).resize(128, 128).png().toBuffer();
      return cachedLogo;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export function getCompanyName(): string {
  return process.env.COMPANY_NAME ?? "Rakshak Securitas";
}
