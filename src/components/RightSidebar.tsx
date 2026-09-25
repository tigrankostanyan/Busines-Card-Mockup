import React, { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Sparkles,
  RotateCcw,
  Sliders,
  Layers,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sun,
  Palette,
  Bookmark,
  BookmarkPlus,
  BookmarkCheck,
  Move,
} from 'lucide-react';
import {
  CardSlot,
  ImageFit,
  Language,
  SceneConfig,
  TemplateConfig,
  TemplateId,
  UserPreset,
} from '../types';
import { BACKDROP_PALETTES, EXPORT_PRESETS, TEMPLATES } from '../constants/templates';
import { translations } from '../translations';

interface RightSidebarProps {
  activeTab: 'selected' | 'scene';
  setActiveTab: (tab: 'selected' | 'scene') => void;
  selectedCard: CardSlot | null;
  slots: CardSlot[];
  onSelectCard: (id: number) => void;
  onUpdateCardProp: <K extends keyof CardSlot>(key: K, value: CardSlot[K]) => void;
  onUploadCardImage: (file: File) => void;
  onRemoveCardImage: () => void;
  onApplyImageToAllSlots: () => void;
  scene: SceneConfig;
  onUpdateSceneProp: <K extends keyof SceneConfig>(key: K, value: SceneConfig[K]) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onFillAllSlotsWithSingleImage: (file: File) => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
  onApplySizeToCenterCards?: (width: number, height: number) => void;
  onApplySizeToAllCards?: (width: number, height: number) => void;
  onResetAllCustomSizes?: () => void;
  userPresets: UserPreset[];
  activePresetId?: string | null;
  onSaveCurrentPreset: (name: string) => void;
  onApplyUserPreset: (preset: UserPreset) => void;
  onDeleteUserPreset: (presetId: string) => void;
  lang: Language;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCard,
  slots,
  onSelectCard,
  onUpdateCardProp,
  onUploadCardImage,
  onRemoveCardImage,
  onApplyImageToAllSlots,
  scene,
  onUpdateSceneProp,
  onSelectTemplate,
  onFillAllSlotsWithSingleImage,
  onLoadDemo,
  onClearAll,
  onApplySizeToCenterCards,
  onApplySizeToAllCards,
  onResetAllCustomSizes,
  userPresets,
  activePresetId,
  onSaveCurrentPreset,
  onApplyUserPreset,
  onDeleteUserPreset,
  lang,
}) => {
  const t = translations[lang];
  const singleImageInputRef = useRef<HTMLInputElement | null>(null);
  const fillAllInputRef = useRef<HTMLInputElement | null>(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [activePresetNotification, setActivePresetNotification] = useState<string | null>(null);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    onSaveCurrentPreset(newPresetName.trim());
    setNewPresetName('');
    setActivePresetNotification(t.presetSavedSuccess);
    setTimeout(() => setActivePresetNotification(null), 3000);
  };

  const handleApplyPreset = (preset: UserPreset) => {
    onApplyUserPreset(preset);
    setActivePresetNotification(`${preset.name}: ${t.presetAppliedSuccess}`);
    setTimeout(() => setActivePresetNotification(null), 3000);
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCardImage(e.target.files[0]);
    }
  };

  const triggerSingleUpload = () => {
    if (singleImageInputRef.current) {
      singleImageInputRef.current.value = '';
      singleImageInputRef.current.click();
    }
  };

  const triggerFillAllUpload = () => {
    if (fillAllInputRef.current) {
      fillAllInputRef.current.value = '';
      fillAllInputRef.current.click();
    }
  };

  const handleFillAllUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFillAllSlotsWithSingleImage(e.target.files[0]);
    }
  };

  const handlePresetRatioChange = (presetLabel: string) => {
    const preset = EXPORT_PRESETS.find((p) => p.label === presetLabel);
    if (preset) {
      onUpdateSceneProp('exportPreset', preset.label);
      onUpdateSceneProp('exportWidth', preset.width);
      onUpdateSceneProp('exportHeight', preset.height);
    }
  };

  const getSlotLabel = (s: CardSlot) => {
    const raw = s.shortLabel.replace(/^#\d+\s*/, '').trim();
    if (lang === 'hy') {
      const hyMap: Record<string, string> = {
        'Left Top': 'Ձախ Վերև',
        'Left Bottom': 'Ձախ Ներքև',
        'Center Top': 'Մեջտեղ Վերև',
        'Center Main (Hero)': 'Գլխավոր (Hero)',
        'Center Hero': 'Գլխավոր (Hero)',
        'Hero Center': 'Գլխավոր (Hero)',
        'Center Bottom': 'Մեջտեղ Ներքև',
        'Right Top': 'Աջ Վերև',
        'Right Bottom': 'Աջ Ներքև',
        'Top Left': 'Վերև Ձախ',
        'Top Center': 'Վերև Մեջտեղ',
        'Top Mid': 'Վերև Մեջտեղ',
        'Top Right': 'Վերև Աջ',
        'Mid Left': 'Մեջտեղ Ձախ',
        'Mid Right': 'Մեջտեղ Աջ',
        'Bottom Left': 'Ներքև Ձախ',
        'Bottom Center': 'Ներքև Մեջտեղ',
        'Bottom Mid': 'Ներքև Մեջտեղ',
        'Bottom Right': 'Ներքև Աջ',
        'Left': 'Ձախ',
        'Right': 'Աջ',
        'Far Left': 'Ծայր Ձախ',
        'Far Right': 'Ծայր Աջ',
        'Back Left': 'Հետևի Ձախ',
        'Back Right': 'Հետևի Աջ',
        'Front Left': 'Առջևի Ձախ',
        'Front Right': 'Առջևի Աջ',
      };
      return hyMap[raw] || raw;
    }
    return raw;
  };

  return (
    <aside className="w-80 sm:w-96 bg-slate-900/60 backdrop-blur-2xl border-l border-white/10 h-full flex flex-col shrink-0 shadow-2xl select-none z-20 text-slate-100">
      {/* Hidden File Inputs */}
      <input
        ref={singleImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSingleImageUpload}
      />
      <input
        ref={fillAllInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFillAllUpload}
      />

      {/* Top Segmented Tab Switcher */}
      <div className="p-3 border-b border-white/10 bg-white/[0.02]">
        <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('selected')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'selected'
                ? 'bg-white/15 text-white shadow-md border border-white/15 backdrop-blur-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.tabSelectedCard}</span>
            {selectedCard?.image && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('scene')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scene'
                ? 'bg-white/15 text-white shadow-md border border-white/15 backdrop-blur-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.tabSceneCanvas}</span>
          </button>
        </div>
      </div>

      {/* Tab Body - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-200">
        {activeTab === 'selected' ? (
          /* =========================================================
             TAB 1: SELECTED CARD CONTROLS
             ========================================================= */
          <div className="space-y-5">
            {/* Quick Slot Navigation Strip */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                <span>{lang === 'hy' ? 'Ընտրել Սլոթը՝' : 'Select Slot:'}</span>
                <span className="text-white font-semibold">
                  {selectedCard ? `#${selectedCard.id} ${getSlotLabel(selectedCard)}` : (lang === 'hy' ? 'Ընտրված չէ' : 'None')}
                </span>
              </div>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))`,
                }}
              >
                {slots.map((slot) => {
                  const isCurrent = selectedCard?.id === slot.id;
                  const isFilled = Boolean(slot.image);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => onSelectCard(slot.id)}
                      className={`h-9 rounded-lg text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400/80 shadow-md shadow-blue-500/30'
                          : isFilled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200'
                      }`}
                      title={`#${slot.id} - ${getSlotLabel(slot)}`}
                    >
                      <span>#{slot.id}</span>
                      {isFilled && !isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1 shadow-xs shadow-emerald-400/60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedCard ? (
              <div className="space-y-4 pt-2 border-t border-white/10">
                {/* Upload or Change Image */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    {t.uploadImage}
                  </label>

                  {selectedCard.image ? (
                    <div className="space-y-2">
                      <div className="h-28 w-full rounded-xl border border-white/15 overflow-hidden relative bg-slate-950/60 group">
                        <img
                          src={selectedCard.image}
                          alt="Card thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={triggerSingleUpload}
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 shadow"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{t.changeImage}</span>
                          </button>
                          <button
                            onClick={onRemoveCardImage}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={triggerSingleUpload}
                          className="flex-1 py-2 px-3 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors backdrop-blur-md"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-300" />
                          <span>{t.changeImage}</span>
                        </button>
                        <button
                          onClick={onApplyImageToAllSlots}
                          className="py-2 px-3 rounded-lg border border-indigo-500/30 bg-indigo-500/20 hover:bg-indigo-500/30 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition-colors backdrop-blur-md"
                          title="Apply this image to all 7 slots"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.applyToAll}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={triggerSingleUpload}
                      className="w-full h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-white/35 bg-white/[0.04] hover:bg-white/[0.08] flex flex-col items-center justify-center p-4 text-center transition-all group backdrop-blur-md"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 shadow-inner border border-white/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-slate-200" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {t.uploadImage}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {t.dragDropHere}
                      </span>
                    </button>
                  )}
                </div>

                {/* Adjustments (Active when image exists) */}
                {selectedCard.image && (
                  <div className="space-y-4 pt-3 border-t border-white/10">
                    {/* Scale / Zoom Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-medium mb-1">
                        <span className="text-slate-400">{t.imageScale}</span>
                        <span className="font-bold text-white">
                          {Math.round(selectedCard.scale * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={selectedCard.scale}
                        onChange={(e) =>
                          onUpdateCardProp('scale', parseFloat(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Position X Offset */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-medium mb-1">
                        <span className="text-slate-400">{t.panX}</span>
                        <span className="font-bold text-white">
                          {selectedCard.panX}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={selectedCard.panX}
                        onChange={(e) =>
                          onUpdateCardProp('panX', parseInt(e.target.value, 10))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Position Y Offset */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-medium mb-1">
                        <span className="text-slate-400">{t.panY}</span>
                        <span className="font-bold text-white">
                          {selectedCard.panY}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={selectedCard.panY}
                        onChange={(e) =>
                          onUpdateCardProp('panY', parseInt(e.target.value, 10))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Fit Mode Toggle */}
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                        {t.fitMode}
                      </span>
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-950/60 rounded-lg border border-white/10">
                        {(['cover', 'contain', 'fill'] as ImageFit[]).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => onUpdateCardProp('fit', mode)}
                            className={`py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                              selectedCard.fit === mode
                                ? 'bg-white/15 text-white shadow-sm border border-white/10'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Corner Radius & Glare */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      {/* Corner Radius */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-medium mb-1">
                          <span className="text-slate-400">{t.cornerRadius}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="80"
                              value={selectedCard.borderRadius ?? scene.globalBorderRadius}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) onUpdateCardProp('borderRadius', Math.max(0, Math.min(80, val)));
                              }}
                              className="w-14 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-slate-500 text-[10px]">px</span>
                            <button
                              onClick={() => onUpdateSceneProp('globalBorderRadius', selectedCard.borderRadius ?? scene.globalBorderRadius)}
                              className="text-[10px] text-blue-400 hover:text-white underline ml-1"
                              title={t.applyRadiusToAll}
                            >
                              {lang === 'hy' ? 'Բոլորին' : 'All'}
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          step="1"
                          value={selectedCard.borderRadius ?? scene.globalBorderRadius}
                          onChange={(e) =>
                            onUpdateCardProp('borderRadius', parseInt(e.target.value, 10))
                          }
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        {/* Quick snap buttons */}
                        <div className="flex gap-1.5 mt-1.5">
                          {[0, 12, 20, 32, 48].map((r) => (
                            <button
                              key={r}
                              onClick={() => onUpdateCardProp('borderRadius', r)}
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                                (selectedCard.borderRadius ?? scene.globalBorderRadius) === r
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                              }`}
                            >
                              {r}px
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Screen Glare */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.screenGlare}</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedCard.hasGlare}
                          onChange={(e) =>
                            onUpdateCardProp('hasGlare', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer bg-slate-800 border-white/20"
                        />
                      </div>
                    </div>

                    {/* Card Dimensions (Լայնք & Բոյ for this slot) */}
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {t.slotDimensions}
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {selectedCard.customWidth ?? scene.cardWidth}px × {selectedCard.customHeight ?? scene.cardHeight}px
                        </span>
                      </div>

                      {/* Custom Slot Width (Լայնք) */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-medium mb-1">
                          <span className="text-slate-300">{t.slotWidth}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="100"
                              max="600"
                              value={selectedCard.customWidth ?? scene.cardWidth}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) onUpdateCardProp('customWidth', Math.max(80, Math.min(800, val)));
                              }}
                              className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-slate-500 text-[10px]">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="120"
                          max="500"
                          step="2"
                          value={selectedCard.customWidth ?? scene.cardWidth}
                          onChange={(e) => onUpdateCardProp('customWidth', parseInt(e.target.value, 10))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      {/* Custom Slot Height (Բոյ) */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-medium mb-1">
                          <span className="text-slate-300">{t.slotHeight}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="150"
                              max="1000"
                              value={selectedCard.customHeight ?? scene.cardHeight}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) onUpdateCardProp('customHeight', Math.max(120, Math.min(1200, val)));
                              }}
                              className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-slate-500 text-[10px]">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="200"
                          max="900"
                          step="5"
                          value={selectedCard.customHeight ?? scene.cardHeight}
                          onChange={(e) => onUpdateCardProp('customHeight', parseInt(e.target.value, 10))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      {/* Action buttons for size application */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            const curW = selectedCard.customWidth ?? scene.cardWidth;
                            const curH = selectedCard.customHeight ?? scene.cardHeight;
                            onApplySizeToCenterCards?.(curW, curH);
                          }}
                          className="py-1.5 px-2 text-[11px] font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Layers className="w-3 h-3" />
                          <span>{t.applyToCenterCards}</span>
                        </button>
                        <button
                          onClick={() => {
                            const curW = selectedCard.customWidth ?? scene.cardWidth;
                            const curH = selectedCard.customHeight ?? scene.cardHeight;
                            onApplySizeToAllCards?.(curW, curH);
                          }}
                          className="py-1.5 px-2 text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.applySizeToAll}</span>
                        </button>
                      </div>

                      {(selectedCard.customWidth != null || selectedCard.customHeight != null) && (
                        <button
                          onClick={() => {
                            onUpdateCardProp('customWidth', null);
                            onUpdateCardProp('customHeight', null);
                          }}
                          className="w-full py-1 text-[10px] text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{t.resetSlotSize}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-center bg-white/[0.03] rounded-2xl border border-white/10 text-slate-400 backdrop-blur-md space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {lang === 'hy' ? 'Ընտրեք Քարտը Խմբագրելու Համար' : 'Select a Slot to Edit'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {t.noCardSelected}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-white/10">
                  {slots.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectCard(s.id)}
                      className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/50 flex items-center justify-between text-xs transition-all group min-w-0"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                          #{s.id}
                        </span>
                        <span className="font-semibold text-slate-200 group-hover:text-white truncate text-[11px]">
                          {getSlotLabel(s)}
                        </span>
                      </div>
                      {s.image ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-xs shadow-emerald-400/50" title={lang === 'hy' ? 'Լցված է' : 'Filled'} />
                      ) : (
                        <span className="text-[10px] text-slate-400 group-hover:text-blue-300 font-medium shrink-0 whitespace-nowrap bg-white/5 group-hover:bg-blue-500/20 px-1.5 py-0.5 rounded transition-colors">
                          {lang === 'hy' ? '+ Նկար' : '+ Add'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================
             TAB 2: SCENE & CANVAS CONTROLS (Exact match to screenshot)
             ========================================================= */
          <div className="space-y-6">
            {/* 0. SAVED USER PRESETS SECTION */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/20 shadow-lg relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Bookmark className="w-4 h-4 text-blue-400" />
                  <label className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    {t.savedPresets}
                  </label>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {userPresets.length}
                </span>
              </div>

              {/* Notification toast */}
              {activePresetNotification && (
                <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{activePresetNotification}</span>
                </div>
              )}

              {/* Save current settings form */}
              <form onSubmit={handleSavePreset} className="flex gap-1.5 mb-3">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder={t.presetNamePlaceholder}
                  className="flex-1 bg-slate-950/70 border border-white/15 focus:border-blue-400 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 shrink-0"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{t.savePresetBtn}</span>
                </button>
              </form>

              {/* Presets List */}
              {userPresets.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {userPresets.map((preset) => {
                    const isActive = activePresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer select-none ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/25 via-blue-500/15 to-indigo-600/20 border-blue-500 shadow-md shadow-blue-500/15 ring-1 ring-blue-400/40'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex-1 flex items-center gap-2.5 overflow-hidden mr-2">
                          {/* Radio Selector Icon with Active Indicator */}
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              isActive
                                ? 'border-blue-400 bg-blue-500 shadow-sm shadow-blue-500/60 scale-105'
                                : 'border-white/30 group-hover:border-white/60 bg-white/5'
                            }`}
                          >
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                            )}
                          </div>

                          {/* Backdrop Color Swatch */}
                          <div
                            className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/25 shadow-xs"
                            style={{
                              background:
                                preset.scene.backdropType === 'gradient' && preset.scene.backdropGradient
                                  ? preset.scene.backdropGradient
                                  : preset.scene.backdropType === 'transparent'
                                    ? 'radial-gradient(circle, #888 1px, transparent 1px)'
                                    : preset.scene.backdropColor || '#B5BAC2',
                            }}
                            title={lang === 'hy' ? `Ֆոն՝ ${preset.scene.backdropColor || 'Գրադիենտ'}` : `Backdrop`}
                          />

                          {/* Preset Name & Badges */}
                          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                            <span
                              className={`font-semibold truncate transition-colors ${
                                isActive ? 'text-white font-bold' : 'text-slate-200 group-hover:text-white'
                              }`}
                            >
                              {preset.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/30 border border-blue-400/50 text-blue-200 text-[9px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
                                {t.presetActive}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {preset.scene.sceneRotation}°
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {isActive ? (
                            <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{t.presetApplied}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyPreset(preset)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs cursor-pointer"
                              title={t.loadPreset}
                            >
                              <BookmarkCheck className="w-3 h-3" />
                              <span>{t.loadPreset}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteUserPreset(preset.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/15 rounded-md transition-all cursor-pointer"
                            title={t.deletePreset}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-1">
                  {t.noSavedPresets}
                </p>
              )}
            </div>

            {/* 1. TEMPLATE LAYOUT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.templateLayout}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = scene.template === tmpl.id;
                  const isLeft = tmpl.id === 'left-tilt-37';
                  const isRight = tmpl.id === 'right-tilt-37';

                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => onSelectTemplate(tmpl.id)}
                      className={`group relative p-2 rounded-xl text-left border transition-all backdrop-blur-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-400/50 shadow-md shadow-blue-500/20'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Mini visual mockup card representation */}
                      <div className="h-16 w-full rounded-lg bg-slate-950/80 overflow-hidden relative mb-2 flex items-center justify-center p-1 border border-white/10">
                        <div
                          style={{
                            transform: `rotate(${
                              isLeft ? '-37deg' : isRight ? '37deg' : '-20deg'
                            }) scale(0.65)`,
                          }}
                          className="flex gap-1.5"
                        >
                          <div className="w-4 h-9 bg-slate-700 rounded-xs shadow-xs" />
                          <div className="w-4 h-9 bg-blue-500/60 rounded-xs shadow-xs" />
                          <div className="w-4 h-9 bg-slate-700 rounded-xs shadow-xs" />
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />
                          </div>
                        )}
                      </div>

                      <div className="text-xs font-bold text-white truncate">
                        {tmpl.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {tmpl.slotCount} slots
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. CANVAS BACKDROP */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.canvasBackdrop}
                </label>
                <span className="text-[11px] font-medium text-slate-400 capitalize">
                  {scene.backdropType === 'transparent' ? 'Transparent' : scene.backdropColor}
                </span>
              </div>

              {/* Palette circular swatches matching screenshot */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {BACKDROP_PALETTES.map((palette) => {
                  const isSelected =
                    scene.backdropType === palette.type &&
                    (palette.type === 'transparent' ||
                      (palette.type === 'gradient'
                        ? scene.backdropGradient === palette.gradient
                        : scene.backdropColor === palette.color));

                  return (
                    <button
                      key={palette.id}
                      onClick={() => {
                        onUpdateSceneProp('backdropType', palette.type);
                        if (palette.type === 'gradient' && palette.gradient) {
                          onUpdateSceneProp('backdropGradient', palette.gradient);
                        } else if (palette.type === 'color') {
                          onUpdateSceneProp('backdropColor', palette.color);
                        }
                      }}
                      title={palette.name}
                      style={{
                        background:
                          palette.type === 'transparent'
                            ? `repeating-conic-gradient(#334155 0% 25%, #0f172a 0% 50%) 50% / 8px 8px`
                            : palette.gradient || palette.color,
                      }}
                      className={`w-7 h-7 rounded-full transition-transform relative ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg'
                          : 'border border-white/20 hover:scale-105'
                      }`}
                    />
                  );
                })}

                {/* Custom Color Input */}
                <label
                  title="Pick custom color"
                  className="w-7 h-7 rounded-full border border-white/20 hover:scale-105 cursor-pointer relative overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-md"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-300" />
                  <input
                    type="color"
                    value={scene.backdropColor}
                    onChange={(e) => {
                      onUpdateSceneProp('backdropType', 'color');
                      onUpdateSceneProp('backdropColor', e.target.value);
                    }}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 3. SCENE CONTROLS */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {t.sceneControls}
              </label>

              {/* Scene Rotation slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.sceneRotation}</span>
                  <span className="font-bold text-white">
                    {scene.sceneRotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="1"
                  value={scene.sceneRotation}
                  onChange={(e) =>
                    onUpdateSceneProp('sceneRotation', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                {/* Quick snap buttons */}
                <div className="flex gap-1.5 mt-1.5">
                  {[-37, 0, 37].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => onUpdateSceneProp('sceneRotation', deg)}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                        scene.sceneRotation === deg
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene Zoom slider with expanded range and quick buttons */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.sceneZoom}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0.2"
                      max="3.5"
                      step="0.05"
                      value={Number(scene.sceneZoom.toFixed(2))}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) onUpdateSceneProp('sceneZoom', Math.max(0.2, Math.min(3.5, val)));
                      }}
                      className="w-14 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-500 text-[10px]">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.02"
                  value={scene.sceneZoom}
                  onChange={(e) =>
                    onUpdateSceneProp('sceneZoom', parseFloat(e.target.value))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                {/* Quick zoom buttons */}
                <div className="flex gap-1.5 mt-1.5">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((z) => (
                    <button
                      key={z}
                      onClick={() => onUpdateSceneProp('sceneZoom', z)}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                        Math.abs(scene.sceneZoom - z) < 0.01
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Position of All Cards (Scene Pan X & Pan Y) */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.scenePosition}</span>
                  </span>
                  {((scene.scenePanX ?? 0) !== 0 || (scene.scenePanY ?? 0) !== 0) && (
                    <button
                      onClick={() => {
                        onUpdateSceneProp('scenePanX', 0);
                        onUpdateSceneProp('scenePanY', 0);
                      }}
                      className="text-[10px] text-blue-400 hover:text-white underline transition-colors"
                    >
                      {t.centerScene}
                    </button>
                  )}
                </div>

                {/* Horizontal Position X (Left / Right) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-medium mb-1">
                    <span className="text-slate-400">{t.scenePanX}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="-1500"
                        max="1500"
                        value={scene.scenePanX ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) onUpdateSceneProp('scenePanX', val);
                        }}
                        className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-slate-500 text-[10px]">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    step="5"
                    value={scene.scenePanX ?? 0}
                    onChange={(e) =>
                      onUpdateSceneProp('scenePanX', parseInt(e.target.value, 10))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Vertical Position Y (Up / Down) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-medium mb-1">
                    <span className="text-slate-400">{t.scenePanY}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="-1500"
                        max="1500"
                        value={scene.scenePanY ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) onUpdateSceneProp('scenePanY', val);
                        }}
                        className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-slate-500 text-[10px]">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    step="5"
                    value={scene.scenePanY ?? 0}
                    onChange={(e) =>
                      onUpdateSceneProp('scenePanY', parseInt(e.target.value, 10))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Quick 4-direction step buttons */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    {lang === 'hy' ? 'Արագ տեղաշարժ՝' : 'Quick Step:'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onUpdateSceneProp('scenePanY', (scene.scenePanY ?? 0) - 50)}
                      className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 font-bold"
                      title="Move Up 50px"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => onUpdateSceneProp('scenePanY', (scene.scenePanY ?? 0) + 50)}
                      className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 font-bold"
                      title="Move Down 50px"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => onUpdateSceneProp('scenePanX', (scene.scenePanX ?? 0) - 50)}
                      className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 font-bold"
                      title="Move Left 50px"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => onUpdateSceneProp('scenePanX', (scene.scenePanX ?? 0) + 50)}
                      className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 font-bold"
                      title="Move Right 50px"
                    >
                      →
                    </button>
                    <button
                      onClick={() => {
                        onUpdateSceneProp('scenePanX', 0);
                        onUpdateSceneProp('scenePanY', 0);
                      }}
                      className="px-2 py-0.5 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 font-semibold"
                    >
                      0,0
                    </button>
                  </div>
                </div>
              </div>

              {/* Shadow Depth slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.shadowDepth}</span>
                  <span className="font-bold text-white">
                    {scene.shadowDepth}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scene.shadowDepth}
                  onChange={(e) =>
                    onUpdateSceneProp('shadowDepth', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* 3D Perspective Tilt slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.sceneTilt}</span>
                  <span className="font-bold text-white">
                    {scene.sceneTiltX}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={scene.sceneTiltX}
                  onChange={(e) =>
                    onUpdateSceneProp('sceneTiltX', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Corner Radius slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.cornerRadius}</span>
                  <span className="font-bold text-white">
                    {scene.globalBorderRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="2"
                  value={scene.globalBorderRadius}
                  onChange={(e) =>
                    onUpdateSceneProp('globalBorderRadius', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* 4. CARD SIZES & PROPORTIONS (ԼԱՅՆՔ ԵՎ ԲՈՅ) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.cardDimensions}
                </label>
                <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {scene.cardWidth} × {scene.cardHeight} px
                </span>
              </div>

              {/* Card Width (Լայնք) */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-300 font-medium">{t.cardWidth}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="100"
                      max="600"
                      value={scene.cardWidth}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) onUpdateSceneProp('cardWidth', Math.max(100, Math.min(600, val)));
                      }}
                      className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="140"
                  max="480"
                  step="2"
                  value={scene.cardWidth}
                  onChange={(e) =>
                    onUpdateSceneProp('cardWidth', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Card Height (Բոյ) */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-300 font-medium">{t.cardHeight}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="180"
                      max="1000"
                      value={scene.cardHeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) onUpdateSceneProp('cardHeight', Math.max(180, Math.min(1000, val)));
                      }}
                      className="w-16 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="220"
                  max="850"
                  step="5"
                  value={scene.cardHeight}
                  onChange={(e) =>
                    onUpdateSceneProp('cardHeight', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Quick Proportions / Presets */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                <button
                  onClick={() => {
                    const newH = Math.round(scene.cardWidth * (16 / 9));
                    onUpdateSceneProp('cardHeight', newH);
                  }}
                  className="py-1 px-1.5 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-md transition-colors text-center"
                  title="9:16 Mobile Aspect Ratio"
                >
                  9:16 Phone
                </button>
                <button
                  onClick={() => {
                    const newH = Math.round(scene.cardWidth * (5 / 4));
                    onUpdateSceneProp('cardHeight', newH);
                  }}
                  className="py-1 px-1.5 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-md transition-colors text-center"
                  title="4:5 Portrait Aspect Ratio"
                >
                  4:5 Card
                </button>
                <button
                  onClick={() => {
                    onUpdateSceneProp('cardHeight', scene.cardWidth);
                  }}
                  className="py-1 px-1.5 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-md transition-colors text-center"
                  title="1:1 Square Aspect Ratio"
                >
                  1:1 Square
                </button>
                <button
                  onClick={() => {
                    const newH = Math.round(scene.cardWidth * (9 / 16));
                    onUpdateSceneProp('cardHeight', newH);
                  }}
                  className="py-1 px-1.5 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-md transition-colors text-center"
                  title="16:9 Landscape Aspect Ratio"
                >
                  16:9 Wide
                </button>
              </div>

              {/* Global Corner Radius slider (All Cards) */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.globalCornerRadius}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="80"
                      value={scene.globalBorderRadius}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) onUpdateSceneProp('globalBorderRadius', Math.max(0, Math.min(80, val)));
                      }}
                      className="w-14 py-0.5 px-1.5 text-right text-xs font-mono bg-slate-950/70 border border-white/15 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={scene.globalBorderRadius}
                  onChange={(e) =>
                    onUpdateSceneProp('globalBorderRadius', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                {/* Quick snap buttons */}
                <div className="flex gap-1.5 mt-1.5">
                  {[0, 12, 20, 32, 48].map((r) => (
                    <button
                      key={r}
                      onClick={() => onUpdateSceneProp('globalBorderRadius', r)}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                        scene.globalBorderRadius === r
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {r === 0 ? (lang === 'hy' ? '0px (Ուղիղ)' : '0px') : `${r}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Spacing Horizontal (Gap X) */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.cardGapX}</span>
                  <span className="font-bold text-white font-mono">{scene.cardGapX}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={scene.cardGapX}
                  onChange={(e) =>
                    onUpdateSceneProp('cardGapX', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Card Spacing Vertical (Gap Y) */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-slate-400">{t.cardGapY}</span>
                  <span className="font-bold text-white font-mono">{scene.cardGapY}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={scene.cardGapY}
                  onChange={(e) =>
                    onUpdateSceneProp('cardGapY', parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Middle / Center Cards Scale Booster */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-blue-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    {t.centerCardsScale}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white font-mono">
                      {(scene.centerCardsScale ?? 1.0).toFixed(2)}x
                    </span>
                    {(scene.centerCardsScale && scene.centerCardsScale !== 1.0) && (
                      <button
                        onClick={() => onUpdateSceneProp('centerCardsScale', 1.0)}
                        className="text-[10px] text-blue-400 hover:text-white underline"
                      >
                        1.0x
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.02"
                  value={scene.centerCardsScale ?? 1.0}
                  onChange={(e) =>
                    onUpdateSceneProp('centerCardsScale', parseFloat(e.target.value))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>
            </div>

            {/* 5. EXPORT DIMENSIONS */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {t.exportDimensions}
              </label>

              {/* Preset Ratio Dropdown */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  {t.presetRatio}
                </span>
                <select
                  value={scene.exportPreset}
                  onChange={(e) => handlePresetRatioChange(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs font-medium bg-slate-950/70 border border-white/15 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {EXPORT_PRESETS.map((preset) => (
                    <option key={preset.label} value={preset.label} className="bg-slate-900 text-slate-200">
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Width & Height inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {t.widthPx}
                  </span>
                  <input
                    type="number"
                    value={scene.exportWidth}
                    onChange={(e) =>
                      onUpdateSceneProp('exportWidth', parseInt(e.target.value, 10) || 400)
                    }
                    className="w-full py-1.5 px-2.5 text-xs font-semibold bg-slate-950/70 border border-white/15 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {t.heightPx}
                  </span>
                  <input
                    type="number"
                    value={scene.exportHeight}
                    onChange={(e) =>
                      onUpdateSceneProp('exportHeight', parseInt(e.target.value, 10) || 300)
                    }
                    className="w-full py-1.5 px-2.5 text-xs font-semibold bg-slate-950/70 border border-white/15 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Export format & scale multiplier */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {t.format}
                  </span>
                  <select
                    value={scene.exportFormat}
                    onChange={(e) =>
                      onUpdateSceneProp('exportFormat', e.target.value as any)
                    }
                    className="w-full py-1.5 px-2 text-xs font-semibold bg-slate-950/70 border border-white/15 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="png" className="bg-slate-900 text-slate-200">PNG (Lossless)</option>
                    <option value="jpeg" className="bg-slate-900 text-slate-200">JPEG (Compact)</option>
                    <option value="webp" className="bg-slate-900 text-slate-200">WebP (Modern)</option>
                  </select>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {t.qualityScale}
                  </span>
                  <select
                    value={scene.exportScale}
                    onChange={(e) =>
                      onUpdateSceneProp('exportScale', parseInt(e.target.value, 10))
                    }
                    className="w-full py-1.5 px-2 text-xs font-semibold bg-slate-950/70 border border-white/15 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1} className="bg-slate-900 text-slate-200">1x Standard</option>
                    <option value={2} className="bg-slate-900 text-slate-200">2x Retina HD</option>
                    <option value={3} className="bg-slate-900 text-slate-200">3x Ultra Studio</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions (Exact match to screenshot) */}
      <div className="p-3 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl space-y-2">
        {/* Fill All Slots with Single Image Button */}
        <button
          onClick={triggerFillAllUpload}
          className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 active:scale-[0.99] text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all backdrop-blur-md"
        >
          <Upload className="w-4 h-4 text-blue-300" />
          <span>{t.fillAllSingle}</span>
        </button>

        {/* Secondary Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onLoadDemo}
            className="py-1.5 px-2.5 rounded-lg border border-indigo-400/30 bg-indigo-500/20 hover:bg-indigo-500/30 text-[11px] font-semibold text-indigo-300 flex items-center justify-center gap-1 transition-colors backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.loadDemo}</span>
          </button>
          <button
            onClick={onClearAll}
            className="py-1.5 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-400 hover:text-red-400 flex items-center justify-center gap-1 transition-colors backdrop-blur-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.clearAll}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
