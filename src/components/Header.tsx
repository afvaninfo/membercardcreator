import React from 'react';
import { Sun, Moon, Sparkles, RotateCcw } from 'lucide-react';
import { PresetProfile } from '../types.ts';
import { PRESET_PROFILES } from '../presets.ts';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectPreset: (preset: PresetProfile) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onSelectPreset,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0E1118]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-['Archivo_Black'] text-xl tracking-tight text-[#0B63CE] sm:text-2xl">
              TEQX.
            </span>
            <span className="font-['Manrope'] text-lg font-bold text-[#231F20] dark:text-white sm:text-xl">
              Studio
            </span>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 rounded-full bg-[#EAF1FB] px-2.5 py-0.5 text-xs font-bold text-[#0B63CE] dark:bg-[#063A82]/40 dark:text-[#5AA2F0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B63CE] animate-pulse" />
            <span>Members Card Maker</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-[#0B63CE] hover:text-[#0B63CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#0B63CE] transition-colors"
              title="Load sample member profile"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#0B63CE]" />
              <span className="hidden sm:inline">Sample Profiles</span>
              <span className="sm:hidden">Presets</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 hidden w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl group-hover:block group-focus-within:block dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Load Preset Profile
              </div>
              {PRESET_PROFILES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className="w-full rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-[#EAF1FB] hover:text-[#0B63CE] dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Reset form"
            aria-label="Reset form"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-[#0B63CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
