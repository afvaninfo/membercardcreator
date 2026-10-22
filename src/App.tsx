/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { FormEditor } from './components/FormEditor.tsx';
import { CardPreview } from './components/CardPreview.tsx';
import { DownloadModal } from './components/DownloadModal.tsx';
import { DEFAULT_CARD_DATA, PRESET_PROFILES } from './presets.ts';
import { MemberCardData, PresetProfile } from './types.ts';
import { Palette, PenTool, Eye, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<MemberCardData>(DEFAULT_CARD_DATA);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teqx_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
    filename: string;
  }>({
    isOpen: false,
    imageUrl: null,
    filename: 'teqx-members-card.png',
  });

  // Sync dark class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('teqx_dark_mode', String(darkMode));
  }, [darkMode]);

  const handleUpdate = (updated: Partial<MemberCardData>) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateOffsets = (offsetX: number, offsetY: number) => {
    setData((prev) => ({
      ...prev,
      photoOffsetX: offsetX,
      photoOffsetY: offsetY,
    }));
  };

  const handleSelectPreset = (preset: PresetProfile) => {
    setData({ ...preset.data });
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields to default template?')) {
      setData(DEFAULT_CARD_DATA);
    }
  };

  const handleOpenModal = (imageUrl: string, filename: string) => {
    setModalState({
      isOpen: true,
      imageUrl,
      filename,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 dark:bg-[#0E1118] dark:text-slate-100">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Mobile View Switcher Tabs */}
        <div className="mb-6 flex lg:hidden items-center justify-center">
          <div className="flex w-full max-w-md rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-[#0B63CE] shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-[#0B63CE] shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Card Preview</span>
            </button>
          </div>
        </div>

        {/* Desktop Split Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Form Controls */}
          <div
            className={`lg:col-span-6 xl:col-span-6 space-y-6 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Quick Hero Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0B63CE] to-[#063A82] p-5 text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5AA2F0]">
                <Sparkles className="h-4 w-4" />
                <span>Teqx Studio Identity</span>
              </div>
              <h1 className="mt-1 font-['Archivo_Black'] text-xl tracking-tight sm:text-2xl">
                Official Members Card
              </h1>
              <p className="mt-1 text-xs text-white/80 leading-relaxed max-w-xl">
                Customize your card with your photo, role, view on the studio, and fun fact. Formatted in 4:5 high-resolution (1080×1350) for Instagram, portfolios, and community showcases.
              </p>
            </div>

            {/* Form Editor */}
            <FormEditor data={data} onChange={handleUpdate} />

            {/* Brand Specifications Summary Note */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                <Palette className="h-4 w-4 text-[#0B63CE]" />
                <span>Brand Identity Rules Enforced</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#0B63CE]" />
                  <span>Blue #0B63CE</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#0E1118]" />
                  <span>Ink #0E1118</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                  <span className="font-['Archivo_Black'] text-[10px]">Aa</span>
                  <span>Archivo Black</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                  <span className="font-['Manrope'] font-bold text-[10px]">Aa</span>
                  <span>Manrope</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview & Canvas Engine */}
          <div
            className={`lg:col-span-6 xl:col-span-6 ${
              activeTab === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="lg:sticky lg:top-20">
              <CardPreview
                data={data}
                onUpdateOffsets={handleUpdateOffsets}
                onOpenModal={handleOpenModal}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-['Archivo_Black'] text-[#0B63CE]">TEQX.</span>
            <span>Studio Members Identity Generator</span>
          </div>
          <div>Strictly adhering to TEQX Brand Guidelines v1.0</div>
        </div>
      </footer>

      {/* Download / Fallback Modal */}
      <DownloadModal
        isOpen={modalState.isOpen}
        imageUrl={modalState.imageUrl}
        filename={modalState.filename}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
