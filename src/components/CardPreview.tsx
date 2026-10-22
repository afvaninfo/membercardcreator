import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  Move,
  Maximize,
  Sparkles,
  AlertCircle,
  FileImage,
} from 'lucide-react';
import { MemberCardData } from '../types.ts';
import { renderMemberCard } from '../utils/canvasRenderer.ts';
import { exportMemberCard, copyCardToClipboard } from '../utils/exportCard.ts';

interface CardPreviewProps {
  data: MemberCardData;
  onUpdateOffsets: (offsetX: number, offsetY: number) => void;
  onOpenModal: (imageUrl: string, filename: string) => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  data,
  onUpdateOffsets,
  onOpenModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialOffsets, setInitialOffsets] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Ensure Google Fonts are active before drawing
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  // Redraw canvas whenever data or fonts change
  const drawCard = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      await renderMemberCard(canvasRef.current, data);
    } catch (err) {
      console.error('Error drawing member card:', err);
    }
  }, [data]);

  useEffect(() => {
    drawCard();
  }, [drawCard, fontsLoaded]);

  // Handle Dragging directly on the preview card
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!data.photoUrl) return;
    // Capture pointer for smooth dragging
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffsets({ x: data.photoOffsetX, y: data.photoOffsetY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = 1080 / rect.width; // Map screen pixels to canvas coordinates

    const deltaX = (e.clientX - dragStart.x) * scale;
    const deltaY = (e.clientY - dragStart.y) * scale;

    const newX = Math.round(Math.max(-150, Math.min(150, initialOffsets.x + deltaX)));
    const newY = Math.round(Math.max(-150, Math.min(150, initialOffsets.y + deltaY)));

    onUpdateOffsets(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      setIsDragging(false);
      setDragStart(null);
    }
  };

  // Export / Download
  const handleExport = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    setExportNotice(null);

    try {
      const result = await exportMemberCard(canvasRef.current, data.name);
      if (result.success) {
        if (result.usedShareApi) {
          setExportNotice('Shared card successfully!');
        } else {
          setExportNotice('Card download initiated!');
        }
      } else {
        // Fallback: If programmatic download is restricted in sandbox, open fallback modal
        if (result.dataUrl) {
          onOpenModal(result.dataUrl, result.filename);
        } else {
          setExportNotice(result.error || 'Download failed. Please right-click the card to save.');
        }
      }
    } catch (err) {
      console.warn('Export error:', err);
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        onOpenModal(url, `${data.name || 'member'}-teqx-card.png`);
      }
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  // Copy to clipboard
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    const ok = await copyCardToClipboard(canvasRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      // If clipboard API failed, open modal
      const url = canvasRef.current.toDataURL('image/png');
      onOpenModal(url, `${data.name || 'member'}-teqx-card.png`);
    }
  };

  // Fullscreen view / manual save
  const handleViewModal = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    onOpenModal(url, `${data.name || 'member'}-teqx-card.png`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Canvas Wrapper */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[460px] select-none rounded-2xl bg-white p-2 sm:p-3 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10"
      >
        {/* Floating Tag */}
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#0B63CE]" />
            <span>1080 × 1350 • 4:5 Instagram Ready</span>
          </div>

          {data.photoUrl && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0B63CE]">
              <Move className="h-3 w-3" />
              <span>Drag photo to pan</span>
            </div>
          )}
        </div>

        {/* Interactive Canvas container */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative overflow-hidden rounded-xl bg-white shadow-inner aspect-[4/5] w-full touch-none ${
            data.photoUrl ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
          title={data.photoUrl ? 'Click and drag to reposition your photo' : 'Teqx Members Card Preview'}
        >
          <canvas
            ref={canvasRef}
            width={1080}
            height={1350}
            className="h-full w-full object-contain pointer-events-none"
          />

          {/* Active dragging indicator badge */}
          {isDragging && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0E1118]/80 px-3.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-xs">
              Repositioning Photo...
            </div>
          )}
        </div>
      </div>

      {/* Notice Message */}
      {exportNotice && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EAF1FB] px-4 py-2 text-xs font-semibold text-[#0B63CE] dark:bg-[#063A82]/30 dark:text-[#5AA2F0] animate-in fade-in slide-in-from-top-1">
          <Sparkles className="h-4 w-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex w-full max-w-[460px] flex-col gap-2.5">
        {/* Primary Download / Share Button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="group relative flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#0B63CE] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0B63CE]/30 hover:bg-[#063A82] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] focus-visible:ring-offset-2 disabled:opacity-60 transition-all cursor-pointer"
        >
          {isExporting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download / Share PNG</span>
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          {/* Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-[#0B63CE] hover:text-[#0B63CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#0B63CE] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Image!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          {/* Fullscreen / Save as fallback */}
          <button
            type="button"
            onClick={handleViewModal}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-[#0B63CE] hover:text-[#0B63CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#0B63CE] transition-all cursor-pointer"
          >
            <Maximize className="h-3.5 w-3.5 text-slate-500" />
            <span>Save / View High-Res</span>
          </button>
        </div>

        {/* Sandbox Note */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 justify-center">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>If download does not start, click "Save / View High-Res" to right-click & save.</span>
        </div>
      </div>
    </div>
  );
};
