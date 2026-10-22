import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, ExternalLink, MousePointerClick } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  filename: string;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  imageUrl,
  filename,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleCopy = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Could not copy image directly. You can right-click the image below to copy or save.');
    }
  };

  const handleManualDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#0E1118] border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="font-['Archivo_Black'] text-base text-[#231F20] dark:text-white">
              Teqx Member Card
            </h3>
            <p className="font-mono text-xs text-slate-400">{filename}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fallback instruction banner */}
        <div className="my-3 flex items-start gap-2.5 rounded-xl bg-[#EAF1FB] p-3 text-xs font-medium text-[#063A82] dark:bg-[#063A82]/30 dark:text-[#5AA2F0]">
          <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-[#0B63CE]" />
          <div>
            <strong>Save Tip:</strong> If automatic download was blocked by browser sandbox,{' '}
            <span className="font-bold underline">Right-click the card below and choose &quot;Save Image As...&quot;</span>{' '}
            (or tap and hold on mobile).
          </div>
        </div>

        {/* Image Display */}
        <div className="relative flex-1 overflow-auto rounded-xl bg-slate-100 p-2 text-center dark:bg-slate-900/80">
          <img
            src={imageUrl}
            alt="Teqx Studio Member Card"
            className="mx-auto max-h-[50vh] w-auto rounded-lg shadow-md object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-[#0B63CE] hover:text-[#0B63CE] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleManualDownload}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#0B63CE] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#063A82] transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
