export interface ExportResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  filename: string;
  usedShareApi?: boolean;
  error?: string;
}

export function sanitizeFilename(name: string): string {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${clean || 'member'}-teqx-members-card.png`;
}

/**
 * Triggers download or share for the member card canvas
 */
export async function exportMemberCard(
  canvas: HTMLCanvasElement,
  memberName: string,
  forceDownloadOnly: boolean = false
): Promise<ExportResult> {
  const filename = sanitizeFilename(memberName);

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve({
          success: false,
          filename,
          error: 'Failed to create image blob from canvas.',
        });
        return;
      }

      const file = new File([blob], filename, { type: 'image/png' });
      const objectUrl = URL.createObjectURL(blob);

      // 1. If Web Share API is available with file support and not forced download only
      if (!forceDownloadOnly && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${memberName} - Teqx Studio Member Card`,
            text: `Check out my official Teqx Studio Member Card! #TeqxStudio`,
            files: [file],
          });
          resolve({
            success: true,
            usedShareApi: true,
            blob,
            dataUrl: objectUrl,
            filename,
          });
          return;
        } catch (err: unknown) {
          // If user aborted/cancelled share dialog, don't treat as fatal error
          if ((err as Error)?.name === 'AbortError') {
            resolve({
              success: true,
              usedShareApi: true,
              blob,
              dataUrl: objectUrl,
              filename,
            });
            return;
          }
          console.warn('Share API failed, falling back to download:', err);
        }
      }

      // 2. Trigger programmatic download
      try {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Keep object URL active for a moment, then resolve
        setTimeout(() => {
          resolve({
            success: true,
            blob,
            dataUrl: objectUrl,
            filename,
          });
        }, 100);
      } catch (err) {
        resolve({
          success: false,
          blob,
          dataUrl: objectUrl,
          filename,
          error: err instanceof Error ? err.message : 'Download trigger failed.',
        });
      }
    }, 'image/png', 1.0);
  });
}

/**
 * Copy card image directly to clipboard
 */
export async function copyCardToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false;
  }

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        resolve(true);
      } catch (err) {
        console.warn('Failed to copy to clipboard', err);
        resolve(false);
      }
    }, 'image/png', 1.0);
  });
}
