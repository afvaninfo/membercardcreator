import { MemberCardData } from '../types.ts';
import { TEQX_LOGO_DATA_URL } from '../assets/logo.ts';

// Cache loaded HTMLImageElements so live dragging is 60fps buttery smooth
const imageCache: Map<string, HTMLImageElement> = new Map();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image at ${src}`));
    };
    img.src = src;
  });
}

// Brand Colors
export const BRAND_COLORS = {
  blue: '#0B63CE',
  ink: '#0E1118',
  black: '#231F20',
  deepBlue: '#063A82',
  sky: '#5AA2F0',
  mist: '#EAF1FB',
  slate: '#3F4859',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

// Word wrapping helper that respects max lines and truncates with ellipsis
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
      if (lines.length === maxLines - 1) {
        // Last line: truncate with ellipsis
        const remainingWords = words.slice(i).join(' ');
        let candidate = remainingWords;
        while (candidate.length > 0 && ctx.measureText(candidate + '…').width > maxWidth) {
          candidate = candidate.slice(0, -1).trim();
        }
        lines.push((candidate || word) + '…');
        return lines;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

// Helper to draw a rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  }
  ctx.closePath();
}

// Helper to draw slanted parallelogram (Teqx slanted style)
function drawSlantedParallelogram(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  slant: number = 32
) {
  ctx.beginPath();
  ctx.moveTo(x + slant, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - slant, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

/**
 * Render complete 1080x1350 card onto HTMLCanvasElement
 */
export async function renderMemberCard(
  canvas: HTMLCanvasElement,
  data: MemberCardData
): Promise<void> {
  const WIDTH = 1080;
  const HEIGHT = 1350;

  if (canvas.width !== WIDTH || canvas.height !== HEIGHT) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // Ensure high quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Pristine background
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle top-right slanted accent stripes (Brand Guidelines Cover aesthetic)
  ctx.save();
  ctx.fillStyle = BRAND_COLORS.blue;
  drawSlantedParallelogram(ctx, 780, 0, 340, 36, 26);
  ctx.fill();

  ctx.fillStyle = BRAND_COLORS.sky;
  drawSlantedParallelogram(ctx, 830, 48, 280, 24, 18);
  ctx.fill();

  ctx.fillStyle = BRAND_COLORS.deepBlue;
  drawSlantedParallelogram(ctx, 880, 84, 220, 16, 12);
  ctx.fill();
  ctx.restore();

  // Subtle background grid or soft mist accents
  ctx.save();
  ctx.fillStyle = '#FAFCFF';
  drawRoundedRect(ctx, 40, 40, WIDTH - 80, HEIGHT - 80, 32);
  ctx.fill();
  ctx.strokeStyle = '#EDF2F7';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 2. Load and Draw Logo
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage(TEQX_LOGO_DATA_URL);
  } catch (err) {
    console.warn('Could not load base64 logo', err);
  }

  const logoX = 80;
  const logoY = 75;
  const logoW = 270;
  const logoH = 135;

  if (logoImg) {
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
  } else {
    // Fallback vector drawing of TEQX. Studio
    ctx.save();
    ctx.font = 'italic 900 48px "Archivo Black", "Archivo", sans-serif';
    ctx.fillStyle = BRAND_COLORS.blue;
    ctx.fillText('TEQX.', logoX, logoY + 60);
    ctx.font = '600 32px "Manrope", sans-serif';
    ctx.fillStyle = BRAND_COLORS.black;
    ctx.fillText('Studio', logoX, logoY + 110);
    ctx.restore();
  }

  // "MEMBERS" Tag / Badge
  ctx.save();
  const badgeX = 370;
  const badgeY = 96;
  const badgeW = 160;
  const badgeH = 40;

  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.fillStyle = BRAND_COLORS.ink;
  ctx.fill();

  // Cyan dot
  ctx.beginPath();
  ctx.arc(badgeX + 22, badgeY + 20, 5, 0, Math.PI * 2);
  ctx.fillStyle = BRAND_COLORS.sky;
  ctx.fill();

  // Badge text
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.font = '700 15px "Manrope", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('MEMBERS', badgeX + 38, badgeY + 25);
  ctx.restore();

  // Verification ID in top right
  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = BRAND_COLORS.slate;
  ctx.font = '600 16px "Manrope", monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText(data.memberId || '#TQ-2026', WIDTH - 80, 110);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 13px "Manrope", sans-serif';
  ctx.fillText('OCTOBER 2026 • OFFICIAL', WIDTH - 80, 132);
  ctx.restore();

  // 3. Right Side: Slanted Blue Panel + Member Photo
  // Position specifications
  const photoCenterX = 790;
  const photoCenterY = 370;
  const photoBoxW = data.photoShape === 'portrait' ? 340 : 360;
  const photoBoxH = data.photoShape === 'portrait' ? 420 : 360;
  const photoBoxX = photoCenterX - photoBoxW / 2;
  const photoBoxY = photoCenterY - photoBoxH / 2;

  // Draw signature slanted blue panel behind the photo
  ctx.save();
  const panelSlant = 42;
  const panelW = photoBoxW + 64;
  const panelH = photoBoxH + 48;
  const panelX = photoBoxX - 24;
  const panelY = photoBoxY - 24;

  // Blue slanted panel with rich gradient
  const grad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  grad.addColorStop(0, BRAND_COLORS.blue);
  grad.addColorStop(1, BRAND_COLORS.deepBlue);

  ctx.shadowColor = 'rgba(11, 99, 206, 0.35)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = grad;
  drawSlantedParallelogram(ctx, panelX, panelY, panelW, panelH, panelSlant);
  ctx.fill();

  // Accent stripe on the slanted panel
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(panelX + panelW - 32, panelY, 8, panelH);
  ctx.restore();

  // Photo Area Shadow & Border Setup
  ctx.save();
  ctx.shadowColor = 'rgba(14, 17, 24, 0.22)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  // Draw Photo clipping path
  const createPhotoPath = () => {
    ctx.beginPath();
    if (data.photoShape === 'circle') {
      const radius = photoBoxW / 2;
      ctx.arc(photoCenterX, photoCenterY, radius, 0, Math.PI * 2);
    } else if (data.photoShape === 'portrait') {
      drawRoundedRect(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, 24);
    } else {
      // square
      drawRoundedRect(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, 24);
    }
    ctx.closePath();
  };

  // Fill photo background white first
  createPhotoPath();
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fill();
  ctx.restore();

  // Load and Draw Member Photo
  let userPhotoImg: HTMLImageElement | null = null;
  if (data.photoUrl) {
    try {
      userPhotoImg = await loadImage(data.photoUrl);
    } catch {
      userPhotoImg = null;
    }
  }

  ctx.save();
  createPhotoPath();
  ctx.clip(); // Clip everything to the photo shape

  if (userPhotoImg) {
    // Calculate aspect fill
    const imgRatio = userPhotoImg.width / userPhotoImg.height;
    const boxRatio = photoBoxW / photoBoxH;
    let renderW: number;
    let renderH: number;

    if (imgRatio > boxRatio) {
      renderH = photoBoxH;
      renderW = photoBoxH * imgRatio;
    } else {
      renderW = photoBoxW;
      renderH = photoBoxW / imgRatio;
    }

    // Apply zoom
    const zoom = Math.max(1, Math.min(3, data.photoZoom || 1));
    renderW *= zoom;
    renderH *= zoom;

    // Apply user panning offsets
    const drawX = photoCenterX - renderW / 2 + (data.photoOffsetX || 0);
    const drawY = photoCenterY - renderH / 2 + (data.photoOffsetY || 0);

    ctx.drawImage(userPhotoImg, drawX, drawY, renderW, renderH);
  } else {
    // Empty placeholder state
    ctx.fillStyle = BRAND_COLORS.mist;
    ctx.fillRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);

    // Decorative avatar silhouette
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY - 20, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY + 110, 85, Math.PI, 0, false);
    ctx.fill();

    // Text: "ADD YOUR PHOTO"
    ctx.fillStyle = BRAND_COLORS.blue;
    ctx.font = '700 16px "Manrope", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('ADD YOUR PHOTO', photoCenterX, photoCenterY + 65);
  }
  ctx.restore();

  // Photo outline / white stroke border
  ctx.save();
  createPhotoPath();
  ctx.strokeStyle = BRAND_COLORS.white;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();

  // 4. Left Column: Member Name & Role
  const nameX = 80;
  const nameY = 270;
  const nameMaxWidth = 450;

  ctx.save();
  ctx.textAlign = 'left';
  const name = data.name.trim() || 'Your Name';

  // Dynamic font sizing for name:
  // Default: 68px. If long, step down to 54px or 44px
  let nameFontSize = 68;
  if (name.length > 28) {
    nameFontSize = 42;
  } else if (name.length > 18) {
    nameFontSize = 52;
  } else if (name.length > 12) {
    nameFontSize = 60;
  }

  ctx.font = `900 ${nameFontSize}px "Archivo Black", "Archivo", sans-serif`;
  ctx.fillStyle = BRAND_COLORS.black;

  // Split name into max 2 lines if needed
  const nameLines = wrapText(ctx, name, nameMaxWidth, 2);
  let curY = nameY;
  for (const line of nameLines) {
    ctx.fillText(line, nameX, curY);
    curY += nameFontSize * 1.05;
  }

  // Blue Role below name
  const role = data.role.trim() || 'Member Role / Title';
  ctx.font = '700 24px "Manrope", sans-serif';
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.letterSpacing = '0.5px';

  // Wrap role if long
  const roleLines = wrapText(ctx, role.toUpperCase(), nameMaxWidth, 2);
  curY += 8;
  for (const rLine of roleLines) {
    ctx.fillText(rLine, nameX, curY);
    curY += 30;
  }
  ctx.restore();

  // Subtle separator line below header
  ctx.save();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 590);
  ctx.lineTo(WIDTH - 80, 590);
  ctx.stroke();
  ctx.restore();

  // 5. Section: "MY VIEW ON TEQX STUDIO"
  const viewSectionY = 630;
  ctx.save();
  // Section Header
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.fillRect(80, viewSectionY, 6, 26);

  ctx.font = '800 18px "Manrope", sans-serif';
  ctx.fillStyle = BRAND_COLORS.slate;
  ctx.letterSpacing = '1.5px';
  ctx.fillText('MY VIEW ON TEQX STUDIO', 100, viewSectionY + 20);

  // Large subtle quote glyph
  ctx.font = 'italic 900 140px "Archivo Black", serif';
  ctx.fillStyle = '#E8F1FC';
  ctx.fillText('“', 80, viewSectionY + 120);

  // View Body Text
  const viewText =
    data.viewOnTeqx.trim() ||
    'Share what Teqx Studio means to you, how you build, and why you push creative and technical boundaries.';

  // Dynamic font sizing for view text based on length
  let viewFontSize = 32;
  let viewLineHeight = 44;
  let maxViewLines = 5;

  if (viewText.length > 250) {
    viewFontSize = 24;
    viewLineHeight = 35;
    maxViewLines = 6;
  } else if (viewText.length > 150) {
    viewFontSize = 28;
    viewLineHeight = 40;
    maxViewLines = 5;
  }

  ctx.font = `600 ${viewFontSize}px "Manrope", sans-serif`;
  ctx.fillStyle = BRAND_COLORS.ink;
  ctx.letterSpacing = '0px';

  const viewLines = wrapText(ctx, viewText, WIDTH - 160, maxViewLines);
  let textY = viewSectionY + 70;
  for (const vLine of viewLines) {
    ctx.fillText(vLine, 80, textY);
    textY += viewLineHeight;
  }
  ctx.restore();

  // 6. Section: "FUN FACT" Dark Box
  const funFactBoxY = 935;
  const funFactBoxW = WIDTH - 160;
  const funFactBoxH = 200;

  ctx.save();
  // Drop shadow for the fun fact box
  ctx.shadowColor = 'rgba(14, 17, 24, 0.12)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // Dark rounded box
  ctx.fillStyle = BRAND_COLORS.ink;
  drawRoundedRect(ctx, 80, funFactBoxY, funFactBoxW, funFactBoxH, 24);
  ctx.fill();

  // Clear shadow
  ctx.shadowColor = 'transparent';

  // "FUN FACT" Blue Pill inside box
  const pillX = 115;
  const pillY = funFactBoxY + 26;
  const pillW = 125;
  const pillH = 34;
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 17);
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.fill();

  ctx.font = '800 13px "Manrope", sans-serif';
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.letterSpacing = '1.2px';
  ctx.textAlign = 'center';
  ctx.fillText('FUN FACT', pillX + pillW / 2, pillY + 22);

  // Fun Fact Content Text
  const funFactText =
    data.funFact.trim() ||
    'Share a quirky hobby, surprising skill, or unexpected passion about you!';

  let ffFontSize = 26;
  let ffLineHeight = 38;
  let ffMaxLines = 3;

  if (funFactText.length > 110) {
    ffFontSize = 22;
    ffLineHeight = 32;
    ffMaxLines = 3;
  }

  ctx.textAlign = 'left';
  ctx.font = `600 ${ffFontSize}px "Manrope", sans-serif`;
  ctx.fillStyle = BRAND_COLORS.white;

  const ffLines = wrapText(ctx, funFactText, funFactBoxW - 70, ffMaxLines);
  let ffY = funFactBoxY + 98;
  for (const fLine of ffLines) {
    ctx.fillText(fLine, 115, ffY);
    ffY += ffLineHeight;
  }
  ctx.restore();

  // 7. Footer: "TEQX STUDIO" text and vibrant blue bottom bar
  const footerY = 1205;
  ctx.save();

  // Subtle separator line above footer
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(WIDTH - 80, footerY);
  ctx.stroke();

  // Left side brand typography: "TEQX STUDIO"
  ctx.font = '900 22px "Archivo Black", "Archivo", sans-serif';
  ctx.fillStyle = BRAND_COLORS.black;
  ctx.letterSpacing = '1px';
  ctx.fillText('TEQX STUDIO', 80, footerY + 52);

  ctx.font = '600 14px "Manrope", sans-serif';
  ctx.fillStyle = BRAND_COLORS.slate;
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Official Member Identity • teqx.studio', 80, footerY + 76);

  // Right side slanted decorative accents
  ctx.fillStyle = BRAND_COLORS.blue;
  drawSlantedParallelogram(ctx, WIDTH - 260, footerY + 44, 90, 16, 12);
  ctx.fill();

  ctx.fillStyle = BRAND_COLORS.sky;
  drawSlantedParallelogram(ctx, WIDTH - 150, footerY + 44, 70, 16, 12);
  ctx.fill();

  // Bottom edge full-width vibrant brand stripe
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.fillRect(0, HEIGHT - 14, WIDTH, 14);

  // Sky accent dot on bottom right
  ctx.fillStyle = BRAND_COLORS.sky;
  ctx.fillRect(WIDTH - 140, HEIGHT - 14, 60, 14);
  ctx.restore();
}
