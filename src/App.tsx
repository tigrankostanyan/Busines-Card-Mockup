import React, { useState, useRef, useEffect } from 'react';
import { CardSlot, Language, SceneConfig, TemplateConfig, TemplateId, UserPreset } from './types';
import { TEMPLATES, generateSampleMockupImages } from './constants/templates';
import { Header } from './components/Header';
import { CanvasArea } from './components/CanvasArea';
import { RightSidebar } from './components/RightSidebar';
import { copyMockupToClipboard, exportMockupImage } from './utils/exportMockup';
import { findSlotIdAtPoint } from './utils/dropTarget';
import {
  dbGetAllPresets,
  dbSavePreset,
  dbSaveAllPresets,
  dbDeletePreset,
  dbGetAppState,
  dbSetAppState,
  dbSaveSlots,
  dbGetSlots,
} from './utils/db';

const STORAGE_KEYS = {
  CURRENT_SCENE: 'mockup_studio_current_scene',
  CURRENT_SLOTS: 'mockup_studio_current_slots',
  USER_PRESETS: 'mockup_studio_user_presets',
  APP_LANG: 'mockup_studio_app_lang',
  ACTIVE_PRESET_ID: 'mockup_studio_active_preset_id',
};

function initializeSlotsForTemplate(template: TemplateConfig, previousSlots?: CardSlot[]): CardSlot[] {
  return template.slots.map((s) => {
    const existing = previousSlots?.find((p) => p.id === s.id);
    return {
      ...s,
      image: existing?.image || null,
      imageName: existing?.imageName,
      scale: existing?.scale ?? 1.0,
      panX: existing?.panX ?? 0,
      panY: existing?.panY ?? 0,
      rotation: existing?.rotation ?? 0,
      fit: existing?.fit ?? 'contain',
      borderRadius: existing?.borderRadius ?? 20,
      hasGlare: existing?.hasGlare ?? false,
      bgColor: existing?.bgColor ?? '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      customWidth: existing?.customWidth ?? null,
      customHeight: existing?.customHeight ?? null,
    };
  });
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APP_LANG);
      if (saved === 'en' || saved === 'hy') return saved;
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'hy';
  });

  const defaultTemplate = TEMPLATES[0]; // 3D Screen Spread (Left Tilt -37°)

  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig>(defaultTemplate);

  // Initialize scene config with localStorage persistence
  const [scene, setScene] = useState<SceneConfig>(() => {
    const baseScene: SceneConfig = {
      template: 'left-tilt-37',
      sceneRotation: -38,
      sceneZoom: 0.95,
      sceneTiltX: 0,
      sceneTiltY: 0,
      scenePanX: 0,
      scenePanY: 0,
      perspective: 1600,
      shadowDepth: 42,
      shadowBlur: 48,
      shadowOpacity: 0.28,
      cardGapX: 36,
      cardGapY: 36,
      cardWidth: 280,
      cardHeight: 520,
      globalBorderRadius: 20,
      centerCardsScale: 1.0,
      backdropType: 'color',
      backdropColor: '#B5BAC2',
      backdropGradient: '',
      exportPreset: '16:9 Widescreen (1600x900)',
      exportWidth: 1600,
      exportHeight: 900,
      exportFormat: 'png',
      exportScale: 2,
      cardGlare: false,
      deviceFrame: false,
      frameColor: 'rgba(255, 255, 255, 0.4)',
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SCENE);
      if (saved) {
        return { ...baseScene, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return baseScene;
  });

  // Initialize slots
  const [slots, setSlots] = useState<CardSlot[]>(() => {
    try {
      const savedSlots = localStorage.getItem(STORAGE_KEYS.CURRENT_SLOTS);
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots);
        return initializeSlotsForTemplate(defaultTemplate, parsed);
      }
    } catch {
      // ignore
    }
    return initializeSlotsForTemplate(defaultTemplate);
  });

  // User Presets list from localStorage / IndexedDB
  const [userPresets, setUserPresets] = useState<UserPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PRESETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'default-studio-grey',
        name: 'Studio Grey 38° (Mockup Exact)',
        createdAt: Date.now(),
        scene: {
          template: 'left-tilt-37',
          sceneRotation: -38,
          sceneZoom: 0.95,
          sceneTiltX: 0,
          sceneTiltY: 0,
          scenePanX: 0,
          scenePanY: 0,
          perspective: 1600,
          shadowDepth: 42,
          shadowBlur: 48,
          shadowOpacity: 0.28,
          cardGapX: 36,
          cardGapY: 36,
          cardWidth: 280,
          cardHeight: 520,
          globalBorderRadius: 20,
          centerCardsScale: 1.0,
          backdropType: 'color',
          backdropColor: '#B5BAC2',
          backdropGradient: '',
          exportPreset: '16:9 Widescreen (1600x900)',
          exportWidth: 1600,
          exportHeight: 900,
          exportFormat: 'png',
          exportScale: 2,
          cardGlare: false,
          deviceFrame: false,
          frameColor: 'rgba(255, 255, 255, 0.4)',
        },
      },
    ];
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PRESET_ID) || 'default-studio-grey';
    } catch {
      return 'default-studio-grey';
    }
  });

  const [selectedCardId, setSelectedCardId] = useState<number | null>(4); // Default to Center Main Hero (Slot 4)
  const [activeTab, setActiveTab] = useState<'selected' | 'scene'>('scene');

  // Load from IndexedDB on initial mount
  useEffect(() => {
    // 1. Presets from IndexedDB
    dbGetAllPresets().then((dbPresets) => {
      if (dbPresets && dbPresets.length > 0) {
        setUserPresets(dbPresets);
      } else {
        // First run: save initial default presets to IndexedDB
        dbSaveAllPresets(userPresets);
      }
    });

    // 2. Active Preset ID
    dbGetAppState<string>('active_preset_id').then((savedId) => {
      if (savedId) {
        setActivePresetId(savedId);
      }
    });

    // 3. Full slot images
    dbGetSlots().then((dbSlots) => {
      if (dbSlots && dbSlots.length > 0) {
        setSlots((prev) =>
          prev.map((s) => {
            const found = dbSlots.find((d) => d.id === s.id);
            return found && found.image ? { ...s, image: found.image, imageName: found.imageName } : s;
          })
        );
      }
    });
  }, []);

  // Persist scene & slots & language changes automatically
  useEffect(() => {
    dbSetAppState('current_scene', scene);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SCENE, JSON.stringify(scene));
    } catch {
      // ignore
    }
  }, [scene]);

  useEffect(() => {
    // Persist full slots with images in IndexedDB (virtually unlimited capacity)
    dbSaveSlots(slots);
    // In localStorage, store slots without image data to prevent QuotaExceededError
    try {
      const lightweightSlots = slots.map((s) => ({ ...s, image: null }));
      localStorage.setItem(STORAGE_KEYS.CURRENT_SLOTS, JSON.stringify(lightweightSlots));
    } catch {
      // storage full or blocked
    }
  }, [slots]);

  useEffect(() => {
    dbSaveAllPresets(userPresets);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PRESETS, JSON.stringify(userPresets));
    } catch {
      // ignore
    }
  }, [userPresets]);

  useEffect(() => {
    if (activePresetId) {
      dbSetAppState('active_preset_id', activePresetId);
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PRESET_ID, activePresetId);
      } catch {
        // ignore
      }
    }
  }, [activePresetId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_LANG, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Preset Handlers
  const handleSaveCurrentPreset = (name: string) => {
    const newPreset: UserPreset = {
      id: `preset-${Date.now()}`,
      name,
      createdAt: Date.now(),
      scene: { ...scene },
      slotsConfig: slots.map((s) => ({
        id: s.id,
        scale: s.scale,
        panX: s.panX,
        panY: s.panY,
        rotation: s.rotation,
        fit: s.fit,
        borderRadius: s.borderRadius,
        hasGlare: s.hasGlare,
        bgColor: s.bgColor,
        customWidth: s.customWidth,
        customHeight: s.customHeight,
      })),
    };
    setUserPresets((prev) => [newPreset, ...prev]);
    setActivePresetId(newPreset.id);
    dbSavePreset(newPreset);
  };

  const handleApplyUserPreset = (preset: UserPreset) => {
    setActivePresetId(preset.id);

    // 1. Update scene
    setScene({ ...preset.scene });

    // 2. If template changed, match template
    const matchedTemplate = TEMPLATES.find((t) => t.id === preset.scene.template) || currentTemplate;
    setCurrentTemplate(matchedTemplate);

    // 3. Rebuild slots from the matched template (preserving images by id), then apply per-slot config
    setSlots((prev) => {
      const newSlots = initializeSlotsForTemplate(matchedTemplate, prev);
      if (preset.slotsConfig && preset.slotsConfig.length > 0) {
        return newSlots.map((slot) => {
          const cfg = preset.slotsConfig?.find((c) => c.id === slot.id);
          if (!cfg) return slot;
          return {
            ...slot,
            scale: cfg.scale ?? slot.scale,
            panX: cfg.panX ?? slot.panX,
            panY: cfg.panY ?? slot.panY,
            rotation: cfg.rotation ?? slot.rotation,
            fit: cfg.fit ?? slot.fit,
            borderRadius: cfg.borderRadius ?? slot.borderRadius,
            hasGlare: cfg.hasGlare ?? slot.hasGlare,
            bgColor: cfg.bgColor ?? slot.bgColor,
            customWidth: cfg.customWidth ?? slot.customWidth,
            customHeight: cfg.customHeight ?? slot.customHeight,
          };
        });
      }
      return newSlots;
    });

    // 4. If the template changed, point selection at a valid slot of the new layout
    if (matchedTemplate.id !== currentTemplate.id) {
      setSelectedCardId(
        matchedTemplate.slots[Math.floor(matchedTemplate.slots.length / 2)]?.id ||
          matchedTemplate.slots[0].id
      );
    }
  };

  const handleDeleteUserPreset = (presetId: string) => {
    setUserPresets((prev) => prev.filter((p) => p.id !== presetId));
    dbDeletePreset(presetId);
    if (activePresetId === presetId) {
      setActivePresetId(null);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Keep the latest slots available to the native (non-React) window drop listener.
  const slotsRef = useRef(slots);
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  // Universal native file-drop handling.
  //
  // React's delegated drop handlers on the 3D-transformed slots/stage only fire
  // when the cursor is exactly over the rendered (visible) part of a slot. The
  // axis-aligned bounding box of a rotated slot is much larger than its visible
  // face, so drops on the surrounding (transparent) area can fall through without
  // being accepted. Registering a plain `window`-level `drop` listener guarantees
  // every file drop on the page is accepted and routed to the nearest slot.
  useEffect(() => {
    const handleNativeDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleNativeDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      e.preventDefault();
      const id = findSlotIdAtPoint(e.clientX, e.clientY, slotsRef.current);
      if (id != null) {
        handleUpdateSlotImage(id, file);
        setSelectedCardId(id);
      }
    };
    window.addEventListener('dragover', handleNativeDragOver);
    window.addEventListener('drop', handleNativeDrop);
    return () => {
      window.removeEventListener('dragover', handleNativeDragOver);
      window.removeEventListener('drop', handleNativeDrop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCard = slots.find((s) => s.id === selectedCardId) || null;
  const filledSlotsCount = slots.filter((s) => Boolean(s.image)).length;

  // Handle template selection
  const handleSelectTemplate = (templateId: TemplateId) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    setCurrentTemplate(tmpl);
    setScene((prev) => ({
      ...prev,
      template: templateId,
      sceneRotation: tmpl.defaultRotation,
      sceneTiltX: tmpl.defaultTiltX,
      sceneTiltY: tmpl.defaultTiltY,
      perspective: tmpl.defaultPerspective,
      cardWidth: tmpl.defaultCardWidth,
      cardHeight: tmpl.defaultCardHeight,
    }));
    setSlots((prev) => initializeSlotsForTemplate(tmpl, prev));
    setSelectedCardId(tmpl.slots[Math.floor(tmpl.slots.length / 2)]?.id || tmpl.slots[0].id);
  };

  // Update card slot property
  const handleUpdateCardProp = <K extends keyof CardSlot>(key: K, value: CardSlot[K]) => {
    if (!selectedCardId) return;
    setSlots((prev) =>
      prev.map((slot) => (slot.id === selectedCardId ? { ...slot, [key]: value } : slot))
    );
  };

  // Update specific slot property directly by slot id
  const handleUpdateSlotProp = <K extends keyof CardSlot>(id: number, key: K, value: CardSlot[K]) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [key]: value } : slot))
    );
  };

  // Update scene property
  const handleUpdateSceneProp = <K extends keyof SceneConfig>(key: K, value: SceneConfig[K]) => {
    setScene((prev) => ({ ...prev, [key]: value }));
    if (key === 'globalBorderRadius') {
      setSlots((prev) => prev.map((slot) => ({ ...slot, borderRadius: value as number })));
    }
  };

  // Read uploaded file as DataURL and set into a slot
  const handleUpdateSlotImage = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === id
            ? {
                ...slot,
                image: dataUrl,
                imageName: file.name,
                scale: 1.0,
                panX: 0,
                panY: 0,
                fit: 'contain',
              }
            : slot
        )
      );
      setSelectedCardId(id);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadCardImage = (file: File) => {
    if (selectedCardId) {
      handleUpdateSlotImage(selectedCardId, file);
    }
  };

  const handleRemoveSlotImage = (id: number) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, image: null, imageName: undefined } : slot
      )
    );
  };

  const handleRemoveCardImage = () => {
    if (selectedCardId) {
      handleRemoveSlotImage(selectedCardId);
    }
  };

  // Apply current card's image to all slots
  const handleApplyImageToAllSlots = () => {
    if (!selectedCard?.image) return;
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        image: selectedCard.image,
        imageName: selectedCard.imageName,
        scale: selectedCard.scale,
        fit: selectedCard.fit,
        hasGlare: selectedCard.hasGlare,
      }))
    );
  };

  // Apply specific size to center / middle cards
  const handleApplySizeToCenterCards = (width: number, height: number) => {
    setSlots((prev) =>
      prev.map((slot) => {
        const isCenter =
          slot.col === 1 ||
          slot.id === 4 ||
          slot.shortLabel.toLowerCase().includes('center') ||
          slot.shortLabel.toLowerCase().includes('hero') ||
          slot.shortLabel.toLowerCase().includes('mid');
        return isCenter
          ? { ...slot, customWidth: width, customHeight: height }
          : slot;
      })
    );
  };

  // Apply size to all cards
  const handleApplySizeToAllCards = (width: number, height: number) => {
    setScene((prev) => ({ ...prev, cardWidth: width, cardHeight: height }));
    setSlots((prev) =>
      prev.map((slot) => ({ ...slot, customWidth: null, customHeight: null }))
    );
  };

  // Reset custom sizes
  const handleResetAllCustomSizes = () => {
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        customWidth: null,
        customHeight: null,
        scaleMultiplier: 1.0,
      }))
    );
  };

  // Upload single file and fill all slots
  const handleFillAllSlotsWithSingleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSlots((prev) =>
        prev.map((slot) => ({
          ...slot,
          image: dataUrl,
          imageName: file.name,
          scale: 1.0,
          panX: 0,
          panY: 0,
          fit: 'contain',
        }))
      );
    };
    reader.readAsDataURL(file);
  };

  // Load realistic sample designs
  const handleLoadDemo = () => {
    const demoScreens = generateSampleMockupImages();
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        image: demoScreens[slot.id] || demoScreens[1],
        imageName: `Sample-Screen-${slot.id}.svg`,
        scale: 1.0,
        panX: 0,
        panY: 0,
        fit: 'cover',
      }))
    );
  };

  // Clear all images
  const handleClearAll = () => {
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        image: null,
        imageName: undefined,
      }))
    );
  };

  // Export PNG / JPEG
  const handleExport = async () => {
    if (!canvasRef.current) return;
    const prevSelected = selectedCardId;
    try {
      setSelectedCardId(null);
      setIsExporting(true);
      // Wait a tick for React to re-render without selection ring
      await new Promise((resolve) => setTimeout(resolve, 50));
      await exportMockupImage({
        node: canvasRef.current,
        width: scene.exportWidth,
        height: scene.exportHeight,
        format: scene.exportFormat,
        scale: scene.exportScale,
        fileName: `mockup-spread-${currentTemplate.id}`,
        isTransparent: scene.backdropType === 'transparent',
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setSelectedCardId(prevSelected);
      setIsExporting(false);
    }
  };

  // Copy to Clipboard
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    const prevSelected = selectedCardId;
    try {
      setSelectedCardId(null);
      // Wait a tick for React to re-render without selection ring
      await new Promise((resolve) => setTimeout(resolve, 50));
      const success = await copyMockupToClipboard(
        canvasRef.current,
        scene.exportWidth,
        scene.exportHeight
      );
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } finally {
      setSelectedCardId(prevSelected);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCardId) {
          handleRemoveCardImage();
        }
      } else if (e.key >= '1' && e.key <= '9') {
        const slotNum = parseInt(e.key, 10);
        if (slotNum <= slots.length) {
          setSelectedCardId(slotNum);
          setActiveTab('selected');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCardId, slots.length]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#0b0f19] text-slate-100 font-sans relative">
      {/* Background ambient glowing frosted orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Top App Header */}
      <Header
        currentTemplate={currentTemplate}
        filledSlotsCount={filledSlotsCount}
        totalSlotsCount={slots.length}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'hy' ? 'en' : 'hy'))}
        onLoadDemo={handleLoadDemo}
        onExport={handleExport}
        onCopyClipboard={handleCopyClipboard}
        isExporting={isExporting}
        isCopied={isCopied}
      />

      {/* Main Studio View: Canvas in Center + Sidebar on Right */}
      <main className="flex-1 flex flex-row overflow-hidden relative z-10">
        <CanvasArea
          canvasRef={canvasRef}
          stageRef={stageRef}
          template={currentTemplate}
          slots={slots}
          selectedCardId={selectedCardId}
          onSelectCard={(id) => {
            setSelectedCardId(id || null);
            if (id) setActiveTab('selected');
          }}
          onUpdateSlotImage={handleUpdateSlotImage}
          onRemoveSlotImage={handleRemoveSlotImage}
          onUpdateSlotProp={handleUpdateSlotProp}
          scene={scene}
          onUpdateSceneProp={handleUpdateSceneProp}
          lang={lang}
        />

        <RightSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCard={selectedCard}
          slots={slots}
          onSelectCard={(id) => {
            setSelectedCardId(id);
            setActiveTab('selected');
          }}
          onUpdateCardProp={handleUpdateCardProp}
          onUploadCardImage={handleUploadCardImage}
          onRemoveCardImage={handleRemoveCardImage}
          onApplyImageToAllSlots={handleApplyImageToAllSlots}
          scene={scene}
          onUpdateSceneProp={handleUpdateSceneProp}
          onSelectTemplate={handleSelectTemplate}
          onFillAllSlotsWithSingleImage={handleFillAllSlotsWithSingleImage}
          onLoadDemo={handleLoadDemo}
          onClearAll={handleClearAll}
          onApplySizeToCenterCards={handleApplySizeToCenterCards}
          onApplySizeToAllCards={handleApplySizeToAllCards}
          onResetAllCustomSizes={handleResetAllCustomSizes}
          userPresets={userPresets}
          activePresetId={activePresetId}
          onSaveCurrentPreset={handleSaveCurrentPreset}
          onApplyUserPreset={handleApplyUserPreset}
          onDeleteUserPreset={handleDeleteUserPreset}
          lang={lang}
        />
      </main>
    </div>
  );
}
