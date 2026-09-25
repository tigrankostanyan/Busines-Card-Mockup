import React from 'react';
import { Download, Sparkles, Copy, Check, Globe } from 'lucide-react';
import { Language, TemplateConfig } from '../types';
import { translations } from '../translations';

export const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="ac-bg" cx="38%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#24304d" />
        <stop offset="55%" stopColor="#141b2e" />
        <stop offset="100%" stopColor="#0b0f19" />
      </radialGradient>
      <linearGradient id="ac-main" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="45%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="ac-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
      <linearGradient id="ac-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="504" height="504" rx="118" fill="url(#ac-bg)" />
    <rect x="4" y="4" width="504" height="504" rx="118" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
    <g opacity="0.92">
      <rect x="126" y="156" width="260" height="200" rx="34" fill="url(#ac-left)" transform="translate(-92 -34) rotate(-15 256 256)" />
    </g>
    <g opacity="0.92">
      <rect x="126" y="156" width="260" height="200" rx="34" fill="url(#ac-right)" transform="translate(92 -34) rotate(14 256 256)" />
    </g>
    <rect x="126" y="156" width="260" height="200" rx="34" fill="url(#ac-main)" stroke="rgba(255,255,255,0.38)" strokeWidth="3" transform="rotate(-5 256 256)" />
  </svg>
);

interface HeaderProps {
  currentTemplate: TemplateConfig;
  filledSlotsCount: number;
  totalSlotsCount: number;
  lang: Language;
  onToggleLang: () => void;
  onLoadDemo: () => void;
  onExport: () => void;
  onCopyClipboard: () => void;
  isExporting: boolean;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTemplate,
  filledSlotsCount,
  totalSlotsCount,
  lang,
  onToggleLang,
  onLoadDemo,
  onExport,
  onCopyClipboard,
  isExporting,
  isCopied,
}) => {
  const t = translations[lang];

  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-30 shrink-0 select-none shadow-lg pointer-events-none">
      {/* The header bar is non-interactive so clicks on its empty areas pass
          through to canvas slots (e.g. slots 3 & 6) sitting underneath it.
          Each control below re-enables pointer events individually. */}
      {/* Left: Brand + Active Template Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 shadow-inner backdrop-blur-md flex items-center justify-center">
          <AppLogo className="w-full h-full" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{t.appTitle}</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
              {lang === 'hy' ? currentTemplate.nameArmenian : currentTemplate.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal hidden sm:block">
            {currentTemplate.description}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 transition-all backdrop-blur-md pointer-events-auto"
          title="Switch Language (Հայերեն / English)"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{lang === 'hy' ? 'HY' : 'EN'}</span>
        </button>

        {/* Demo screens quick trigger */}
        <button
          onClick={onLoadDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 active:bg-indigo-500/40 border border-indigo-400/30 transition-all shadow-xs backdrop-blur-md pointer-events-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span className="hidden md:inline">{t.loadDemo}</span>
          <span className="md:hidden">Demo</span>
        </button>

        {/* Slot fill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 backdrop-blur-md">
          <span
            className={`w-2 h-2 rounded-full ${
              filledSlotsCount === totalSlotsCount
                ? 'bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse'
                : filledSlotsCount > 0
                ? 'bg-amber-400'
                : 'bg-slate-500'
            }`}
          />
          <span>{t.filledCount(filledSlotsCount, totalSlotsCount)}</span>
        </div>

        {/* Copy to Clipboard */}
        <button
          onClick={onCopyClipboard}
          disabled={isCopied}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 transition-all backdrop-blur-md pointer-events-auto"
          title="Copy image directly to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">{t.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.copyClipboard}</span>
            </>
          )}
        </button>

        {/* Main Export PNG button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] shadow-lg shadow-blue-500/25 border border-white/20 transition-all disabled:opacity-50 pointer-events-auto cursor-pointer"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? t.exporting : t.exportPng}</span>
        </button>
      </div>
    </header>
  );
};
