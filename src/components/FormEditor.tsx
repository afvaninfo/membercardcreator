import React, { useRef } from 'react';
import {
  Upload,
  Trash2,
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  Sparkles,
  User,
  Briefcase,
  Quote,
  Smile,
  Circle,
  Square,
  RectangleVertical,
} from 'lucide-react';
import { MemberCardData, PhotoShape } from '../types.ts';

interface FormEditorProps {
  data: MemberCardData;
  onChange: (updated: Partial<MemberCardData>) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange({
        photoUrl: result,
        photoZoom: 1.1,
        photoOffsetX: 0,
        photoOffsetY: 0,
      });
    };
    reader.readAsDataURL(file);
    // Reset file input so re-selecting same file triggers change
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    onChange({
      photoUrl: null,
      photoZoom: 1,
      photoOffsetX: 0,
      photoOffsetY: 0,
    });
  };

  const resetPhotoPlacement = () => {
    onChange({
      photoZoom: 1.1,
      photoOffsetX: 0,
      photoOffsetY: 0,
    });
  };

  const setViewPreset = (text: string) => {
    onChange({ viewOnTeqx: text });
  };

  const setFunFactPreset = (text: string) => {
    onChange({ funFact: text });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Member Identity */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-[#231F20] uppercase dark:text-white mb-4">
          <User className="h-4 w-4 text-[#0B63CE]" />
          <span>Member Identity</span>
        </h2>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="member-name"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Full Name <span className="text-[#0B63CE]">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  data.name.length >= 40
                    ? 'font-bold text-red-500'
                    : data.name.length > 32
                    ? 'text-amber-500'
                    : 'text-slate-400'
                }`}
              >
                {data.name.length}/40
              </span>
            </div>
            <div className="relative">
              <input
                id="member-name"
                type="text"
                maxLength={40}
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-['Archivo_Black'] text-slate-900 placeholder:text-slate-400 placeholder:font-['Manrope'] placeholder:font-normal focus:border-[#0B63CE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>
          </div>

          {/* Role Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="member-role"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Role / Title <span className="text-[#0B63CE]">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  data.role.length >= 60
                    ? 'font-bold text-red-500'
                    : data.role.length > 48
                    ? 'text-amber-500'
                    : 'text-slate-400'
                }`}
              >
                {data.role.length}/60
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Briefcase className="h-4 w-4 text-[#0B63CE]" />
              </div>
              <input
                id="member-role"
                type="text"
                maxLength={60}
                value={data.role}
                onChange={(e) => onChange({ role: e.target.value })}
                placeholder="e.g. Creative Technologist"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#0B63CE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Member Photo */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-[#231F20] uppercase dark:text-white">
            <Upload className="h-4 w-4 text-[#0B63CE]" />
            <span>Member Photo</span>
          </h2>
          {data.photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove Photo</span>
            </button>
          )}
        </div>

        {/* Upload Button & Drop Target */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-1 gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 text-center hover:border-[#0B63CE] hover:bg-[#EAF1FB]/40 focus:outline-none focus:ring-2 focus:ring-[#0B63CE] dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-[#0B63CE] dark:hover:bg-slate-800 transition-all"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-xs group-hover:scale-110 group-hover:bg-[#0B63CE] text-[#0B63CE] group-hover:text-white dark:bg-slate-800 dark:text-slate-200 transition-all">
              <Upload className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              {data.photoUrl ? 'Click to Change Photo' : 'Upload Member Photo'}
            </p>
            <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP (Square or Portrait recommended)</p>
          </div>

          {/* Photo Shape Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Photo Shape
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'portrait', label: 'Portrait', icon: RectangleVertical },
                  { id: 'square', label: 'Square', icon: Square },
                  { id: 'circle', label: 'Circle', icon: Circle },
                ] as const
              ).map((shape) => {
                const Icon = shape.icon;
                const isSelected = data.photoShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => onChange({ photoShape: shape.id as PhotoShape })}
                    className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] ${
                      isSelected
                        ? 'border-[#0B63CE] bg-[#0B63CE] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{shape.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Size & Reposition Controls */}
          {data.photoUrl && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reposition & Zoom
                </span>
                <button
                  type="button"
                  onClick={resetPhotoPlacement}
                  className="inline-flex min-h-[32px] items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0B63CE] dark:text-slate-400 dark:hover:text-[#5AA2F0] transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Position</span>
                </button>
              </div>

              {/* Tip regarding direct drag */}
              <div className="rounded-lg bg-[#EAF1FB] px-2.5 py-1.5 text-[11px] text-[#063A82] dark:bg-[#063A82]/30 dark:text-[#5AA2F0]">
                💡 <strong>Interactive:</strong> You can also click and drag the photo directly on the preview card!
              </div>

              {/* Zoom Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <Maximize2 className="h-3.5 w-3.5 text-[#0B63CE]" />
                    <span>Zoom</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {data.photoZoom.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={data.photoZoom}
                  onChange={(e) => onChange({ photoZoom: parseFloat(e.target.value) })}
                  className="w-full accent-[#0B63CE] cursor-pointer"
                />
              </div>

              {/* Horizontal Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <MoveHorizontal className="h-3.5 w-3.5 text-[#0B63CE]" />
                    <span>Left / Right</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {data.photoOffsetX > 0 ? `+${data.photoOffsetX}px` : `${data.photoOffsetX}px`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="2"
                  value={data.photoOffsetX}
                  onChange={(e) => onChange({ photoOffsetX: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#0B63CE] cursor-pointer"
                />
              </div>

              {/* Vertical Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <MoveVertical className="h-3.5 w-3.5 text-[#0B63CE]" />
                    <span>Up / Down</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {data.photoOffsetY > 0 ? `+${data.photoOffsetY}px` : `${data.photoOffsetY}px`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="2"
                  value={data.photoOffsetY}
                  onChange={(e) => onChange({ photoOffsetY: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#0B63CE] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Your View on Teqx Studio */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="view-teqx"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Quote className="h-3.5 w-3.5 text-[#0B63CE]" />
            <span>Your View on Teqx Studio</span>
          </label>
          <span
            className={`text-[11px] font-mono ${
              data.viewOnTeqx.length >= 320
                ? 'font-bold text-red-500'
                : data.viewOnTeqx.length > 280
                ? 'text-amber-500'
                : 'text-slate-400'
            }`}
          >
            {data.viewOnTeqx.length}/320
          </span>
        </div>

        <textarea
          id="view-teqx"
          rows={4}
          maxLength={320}
          value={data.viewOnTeqx}
          onChange={(e) => onChange({ viewOnTeqx: e.target.value })}
          placeholder="Share what working with or experiencing Teqx Studio means to you..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B63CE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800 transition-colors resize-none"
        />

        {/* Quick idea chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Quick ideas:</span>
          {[
            'Fast, sharp, and laser-focused on work that matters.',
            'Designing visual identities that lean forward with intense contrast.',
            'Uncompromising code craft and bold creative momentum.',
          ].map((idea, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setViewPreset(idea)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:border-[#0B63CE] hover:text-[#0B63CE] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#0B63CE] transition-colors"
            >
              Idea {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Section 4: A Fun Fact About You */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="fun-fact"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Smile className="h-3.5 w-3.5 text-[#0B63CE]" />
            <span>A Fun Fact About You</span>
          </label>
          <span
            className={`text-[11px] font-mono ${
              data.funFact.length >= 160
                ? 'font-bold text-red-500'
                : data.funFact.length > 135
                ? 'text-amber-500'
                : 'text-slate-400'
            }`}
          >
            {data.funFact.length}/160
          </span>
        </div>

        <textarea
          id="fun-fact"
          rows={3}
          maxLength={160}
          value={data.funFact}
          onChange={(e) => onChange({ funFact: e.target.value })}
          placeholder="A quirky hobby, secret skill, or surprising fact about you..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B63CE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800 transition-colors resize-none"
        />

        {/* Quick idea chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Quick ideas:</span>
          {[
            'I own 4 mechanical keyboards and none sound the same.',
            'Secretly a competitive Mario Kart speedrunner.',
            'Can solve a 3x3 Rubik’s cube in under 32 seconds.',
          ].map((idea, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFunFactPreset(idea)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:border-[#0B63CE] hover:text-[#0B63CE] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#0B63CE] transition-colors"
            >
              Idea {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
