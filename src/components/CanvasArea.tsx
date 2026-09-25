import React, { useRef, useState, useEffect, DragEvent } from 'react';
import { Plus, Image as ImageIcon, X, Move } from 'lucide-react';
import { CardSlot, Language, SceneConfig, TemplateConfig } from '../types';
import { translations } from '../translations';
import { findSlotIdAtPoint } from '../utils/dropTarget';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  template: TemplateConfig;
  slots: CardSlot[];
  selectedCardId: number | null;
  onSelectCard: (id: number) => void;
  onUpdateSlotImage: (id: number, file: File) => void;
  onRemoveSlotImage: (id: number) => void;
  onUpdateSlotProp: <K extends keyof CardSlot>(id: number, key: K, value: CardSlot[K]) => void;
  scene: SceneConfig;
  onUpdateSceneProp: <K extends keyof SceneConfig>(key: K, value: SceneConfig[K]) => void;
  lang: Language;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  stageRef,
  template,
  slots,
  selectedCardId,
  onSelectCard,
  onUpdateSlotImage,
  onRemoveSlotImage,
  onUpdateSlotProp,
  scene,
  onUpdateSceneProp,
  lang,
}) => {
  const t = translations[lang];
  const [dragOverSlotId, setDragOverSlotId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeUploadSlotIdRef = useRef<number | null>(null);
  const [activeUploadSlotId, setActiveUploadSlotId] = useState<number | null>(null);

  // JS-driven hover so 3D dead-zones (where CSS :hover never fires) still work
  const [hoveredSlotId, setHoveredSlotId] = useState<number | null>(null);
  const hoverThrottleRef = useRef<number>(0);

  // Scaler to ensure the canvas is ALWAYS rendered at native resolution (scene.exportWidth x scene.exportHeight)
  // and scaled visually to fit the preview stage, guaranteeing 100% WYSIWYG between preview and export.
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    if (!stageRef.current) return;
    const stageEl = stageRef.current;

    const updateScale = () => {
      const rect = stageEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Provide comfortable padding inside stage
      const paddingX = 48;
      const paddingY = 48;
      const availW = Math.max(100, rect.width - paddingX);
      const availH = Math.max(100, rect.height - paddingY);
      const scale = Math.min(availW / scene.exportWidth, availH / scene.exportHeight);
      setCanvasScale(scale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(stageEl);
    return () => ro.disconnect();
  }, [scene.exportWidth, scene.exportHeight, stageRef]);

  // Mouse Drag / Pan within slot state
  const [draggingSlotId, setDraggingSlotId] = useState<number | null>(null);
  const dragStartRef = useRef<{
    slotId: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    hasMoved: boolean;
  } | null>(null);

  // Mouse Drag / Pan for entire scene
  const [isDraggingScene, setIsDraggingScene] = useState(false);
  const sceneDragStartRef = useRef<{
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    hasMoved: boolean;
  } | null>(null);

  // Handle global window mouse movement during slot image pan
  useEffect(() => {
    if (!draggingSlotId) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const { slotId, startX, startY, startPanX, startPanY } = dragStartRef.current;

      const dx = (e.clientX - startX) / (canvasScale || 1);
      const dy = (e.clientY - startY) / (canvasScale || 1);

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStartRef.current.hasMoved = true;
      }

      // Project mouse movement according to the 3D scene rotation
      const rad = (-scene.sceneRotation * Math.PI) / 180;

      // Rotate delta into slot's local coordinate system
      const localDx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localDy = dx * Math.sin(rad) + dy * Math.cos(rad);

      // Pan is in pixels. Adjust sensitivity based on zoom scale.
      const slot = slots.find(s => s.id === slotId);
      const currentScale = slot?.scale || 1;
      const sensitivity = 1 / currentScale;
      const newPanX = Math.round(startPanX + localDx * sensitivity);
      const newPanY = Math.round(startPanY + localDy * sensitivity);

      onUpdateSlotProp(slotId, 'panX', newPanX);
      onUpdateSlotProp(slotId, 'panY', newPanY);
    };

    const handleMouseUp = () => {
      setDraggingSlotId(null);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingSlotId, scene.sceneRotation, onUpdateSlotProp, slots, canvasScale]);

  // Handle global window mouse movement during scene pan
  useEffect(() => {
    if (!isDraggingScene) return;

    const handleSceneMouseMove = (e: MouseEvent) => {
      if (!sceneDragStartRef.current) return;
      const { startX, startY, startPanX, startPanY } = sceneDragStartRef.current;

      const dx = (e.clientX - startX) / (canvasScale || 1);
      const dy = (e.clientY - startY) / (canvasScale || 1);

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        sceneDragStartRef.current.hasMoved = true;
      }

      // Drag sensitivity can be adjusted. Inverse to scene zoom.
      const sensitivity = 1 / (scene.sceneZoom || 1);
      const newPanX = Math.round(startPanX + dx * sensitivity);
      const newPanY = Math.round(startPanY + dy * sensitivity);

      onUpdateSceneProp('scenePanX', newPanX);
      onUpdateSceneProp('scenePanY', newPanY);
    };

    const handleSceneMouseUp = () => {
      setIsDraggingScene(false);
      sceneDragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleSceneMouseMove);
    window.addEventListener('mouseup', handleSceneMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleSceneMouseMove);
      window.removeEventListener('mouseup', handleSceneMouseUp);
    };
  }, [isDraggingScene, scene.sceneZoom, onUpdateSceneProp, canvasScale]);

  const triggerUploadForSlot = (id: number, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    activeUploadSlotIdRef.current = id;
    setActiveUploadSlotId(id);
    onSelectCard(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleMouseDownOnSlot = (slot: CardSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCard(slot.id);

    // If empty slot, clicking should trigger upload
    if (!slot.image) {
      triggerUploadForSlot(slot.id, e);
      return;
    }

    // Don't initiate pan if clicking on a button
    if ((e.target as HTMLElement).closest('button')) return;

    setDraggingSlotId(slot.id);
    dragStartRef.current = {
      slotId: slot.id,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: slot.panX ?? 0,
      startPanY: slot.panY ?? 0,
      hasMoved: false,
    };
  };

  const handleMouseDownOnScene = (e: React.MouseEvent) => {
    // If clicking on a button or something interactive outside the canvas
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDraggingScene(true);
    sceneDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPanX: scene.scenePanX ?? 0,
      startPanY: scene.scenePanY ?? 0,
      hasMoved: false,
    };
  };

  const handleWheelOnSlot = (slot: CardSlot, e: React.WheelEvent) => {
    if (!slot.image) return;
    e.preventDefault();
    e.stopPropagation();

    const zoomStep = e.deltaY < 0 ? 0.06 : -0.06;
    const currentScale = slot.scale ?? 1.0;
    const newScale = Math.max(0.3, Math.min(5.0, Number((currentScale + zoomStep).toFixed(2))));

    onUpdateSlotProp(slot.id, 'scale', newScale);
    if (selectedCardId !== slot.id) {
      onSelectCard(slot.id);
    }
  };

  const handleCardClick = (slot: CardSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCard(slot.id);
    if (!slot.image) {
      triggerUploadForSlot(slot.id, e);
    }
  };

  const handleSlotDragOver = (slotId: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverSlotId(slotId);
  };
  const handleSlotDragLeave = (slotId: number, e: DragEvent<HTMLDivElement>) => {
    setDragOverSlotId((cur) => (cur === slotId ? null : cur));
  };

  // Stage-level fallback routing. Only used when the drag hovers the canvas
  // area outside a slot; highlights the intended slot for visual feedback.
  const handleStageDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverSlotId(findSlotIdAtPoint(e.clientX, e.clientY, slots));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slotId = activeUploadSlotIdRef.current || activeUploadSlotId;
    if (slotId && e.target.files && e.target.files[0]) {
      onUpdateSlotImage(slotId, e.target.files[0]);
      onSelectCard(slotId);
    }
  };

  // Compute realistic directional shadow based on shadow depth matching studio mockup
  const shadowDepthFactor = scene.shadowDepth / 40; // 1.0 at default 40
  const baseShadowOffsetX = Math.round(16 * shadowDepthFactor);
  const baseShadowOffsetY = Math.round(30 * shadowDepthFactor);
  const baseShadowBlur = Math.round(52 * shadowDepthFactor);
  const baseShadowSpread = Math.round(-6 * shadowDepthFactor);
  const baseShadowAlpha1 = Math.min(0.40, 0.24 * shadowDepthFactor);
  const baseShadowAlpha2 = Math.min(0.24, 0.12 * shadowDepthFactor);

  const getCardShadowStyle = (isHero: boolean) => {
    if (scene.shadowDepth <= 0) return 'none';
    const mult = isHero ? 1.35 : 1.0;
    const offX = Math.round(baseShadowOffsetX * mult);
    const offY = Math.round(baseShadowOffsetY * mult);
    const blur = Math.round(baseShadowBlur * mult);
    const a1 = Math.min(0.48, baseShadowAlpha1 * (isHero ? 1.25 : 1.0));
    const a2 = Math.min(0.30, baseShadowAlpha2 * (isHero ? 1.2 : 1.0));

    return `${offX}px ${offY}px ${blur}px ${baseShadowSpread}px rgba(0, 0, 0, ${a1}), ${Math.round(offX * 0.4)}px ${Math.round(offY * 0.4)}px ${Math.round(blur * 0.35)}px rgba(0, 0, 0, ${a2})`;
  };

  // Background style computation
  const getBackdropStyle = () => {
    if (scene.backdropType === 'transparent') {
      return {
        backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        backgroundColor: 'transparent',
      };
    }
    if (scene.backdropType === 'gradient' && scene.backdropGradient) {
      return { background: scene.backdropGradient };
    }
    return { backgroundColor: scene.backdropColor };
  };

  return (
    <div
      ref={stageRef}
      onClick={() => onSelectCard(0)}
      onDragOver={handleStageDragOver}
      className="flex-1 h-full w-full relative overflow-hidden bg-transparent flex items-center justify-center p-4 sm:p-8 select-none"
    >
      {/* Hidden file input for slot uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* 1. Footprint in stage flexbox: exact scaled width and height */}
      <div
        style={{
          width: `${Math.round(scene.exportWidth * canvasScale)}px`,
          height: `${Math.round(scene.exportHeight * canvasScale)}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* 2. Scaler: applies CSS scale only to the preview, NOT to mockup-export-canvas */}
        <div
          style={{
            transform: `scale(${canvasScale})`,
            transformOrigin: 'center center',
            width: `${scene.exportWidth}px`,
            height: `${scene.exportHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* 3. The Exportable Canvas: 100% native resolution, ZERO scale transform on itself */}
          <div
            ref={canvasRef}
            id="mockup-export-canvas"
            onMouseDown={(e) => {
              const targetSlotId = findSlotIdAtPoint(e.clientX, e.clientY, slots);
              if (targetSlotId) {
                const slot = slots.find((s) => s.id === targetSlotId);
                if (slot) {
                  handleMouseDownOnSlot(slot, e);
                }
              } else {
                handleMouseDownOnScene(e);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              const now = Date.now();
              if (now - hoverThrottleRef.current < 16) return;
              hoverThrottleRef.current = now;
              const id = findSlotIdAtPoint(e.clientX, e.clientY, slots);
              setHoveredSlotId(id);
            }}
            onMouseLeave={() => setHoveredSlotId(null)}
            onWheel={(e) => {
              // Same fallback routing for scroll-to-zoom
              const targetSlotId = findSlotIdAtPoint(e.clientX, e.clientY, slots);
              if (targetSlotId) {
                const slot = slots.find((s) => s.id === targetSlotId);
                if (slot) {
                  handleWheelOnSlot(slot, e);
                }
              }
            }}
            style={{
              width: `${scene.exportWidth}px`,
              height: `${scene.exportHeight}px`,
              position: 'relative',
              flexShrink: 0,
              cursor: isDraggingScene
                ? 'grabbing'
                : draggingSlotId
                  ? 'grabbing'
                  : hoveredSlotId
                    ? slots.find(s => s.id === hoveredSlotId)?.image
                      ? 'grab'
                      : 'pointer'
                    : 'grab', // Default cursor on empty canvas is grab for panning
              ...getBackdropStyle(),
            }}
            className="shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/15 rounded-2xl flex items-center justify-center overflow-hidden transition-colors duration-200"
          >
        {/* 3D Scene World Wrapper */}
        <div
          style={{
            perspective: `${scene.perspective}px`,
            perspectiveOrigin: '50% 50%',
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Rotated & Tilted 3D Matrix Plane */}
          <div
            id="mockup-transform-plane"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateX(${scene.scenePanX ?? 0}px) translateY(${scene.scenePanY ?? 0}px) rotateX(${scene.sceneTiltX}deg) rotateY(${scene.sceneTiltY}deg) rotateZ(${scene.sceneRotation}deg) scale(${scene.sceneZoom})`,
              transition: draggingSlotId || isDraggingScene ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              width: '0px',
              height: '0px',
            }}
          >
            {/* Render Each Card Slot in the 3D Plane */}
            {slots.map((slot) => {
              const isSelected = selectedCardId === slot.id;
              const isDragOver = dragOverSlotId === slot.id;
              const isThisSlotDragging = draggingSlotId === slot.id;
              const isHovered = hoveredSlotId === slot.id;
              const hasImage = Boolean(slot.image);

              // Check if slot is in the middle / center column or center hero card
              const isCenterCard =
                slot.col === 1 ||
                slot.id === 4 ||
                slot.shortLabel.toLowerCase().includes('center') ||
                slot.shortLabel.toLowerCase().includes('hero') ||
                slot.shortLabel.toLowerCase().includes('mid');

              const centerScale = isCenterCard ? (scene.centerCardsScale ?? 1.0) : 1.0;
              const slotScaleMult = (slot.scaleMultiplier ?? 1.0) * centerScale;

              const actionCorner = `${(slot.posX ?? 0) > 0 ? 'left-2' : 'right-2'} ${(slot.posY ?? 0) < 0 ? 'bottom-2' : 'top-2'
                }`;

              const dynamicWidth = (slot.customWidth ?? scene.cardWidth) * slotScaleMult;
              const dynamicHeight = (slot.customHeight ?? scene.cardHeight) * slotScaleMult;

              // Template base reference for optical spacing consistency
              const defaultW = template?.defaultCardWidth || 280;
              const defaultH = template?.defaultCardHeight || 520;
              const defaultGX = template?.defaultGapX || 36;
              const defaultGY = template?.defaultGapY || 36;

              const scaleFactorX = (scene.cardWidth + scene.cardGapX) / (defaultW + defaultGX);
              const scaleFactorY = (scene.cardHeight + scene.cardGapY) / (defaultH + defaultGY);

              const computedPosX = slot.posX * scaleFactorX;
              const computedPosY = slot.posY * scaleFactorY;

              const effectivePosZ = isSelected ? 12 : (slot.posZ || 0);
              const effectiveZIndex = isSelected ? 30 : slot.zIndex;
              const cardRadius = typeof slot.borderRadius === 'number' ? slot.borderRadius : scene.globalBorderRadius;

              return (
                <div
                  key={slot.id}
                  id={`card-slot-${slot.id}`}
                  onClick={(e) => handleCardClick(slot, e)}
                  onMouseDown={(e) => handleMouseDownOnSlot(slot, e)}
                  onWheel={(e) => handleWheelOnSlot(slot, e)}
                  onDragOver={(e) => handleSlotDragOver(slot.id, e)}
                  onDragLeave={(e) => handleSlotDragLeave(slot.id, e)}
                  style={{
                    position: 'absolute',
                    left: `${computedPosX}px`,
                    top: `${computedPosY}px`,
                    width: `${dynamicWidth}px`,
                    height: `${dynamicHeight}px`,
                    marginLeft: `-${dynamicWidth / 2}px`,
                    marginTop: `-${dynamicHeight / 2}px`,
                    zIndex: effectiveZIndex,
                    transform: `translate3d(0, 0, ${effectivePosZ}px)`,
                    borderRadius: `${cardRadius}px`,
                    boxShadow: getCardShadowStyle(isCenterCard && slot.id === 4),
                    backgroundColor: slot.bgColor || '#ffffff',
                    cursor: hasImage
                      ? isThisSlotDragging
                        ? 'grabbing'
                        : isHovered ? 'grab' : 'default'
                      : isHovered ? 'pointer' : 'default',
                    pointerEvents: 'auto',
                  }}
                  className={`relative overflow-hidden transition-shadow duration-150 ${isSelected
                    ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-transparent shadow-2xl shadow-blue-500/30'
                    : isDragOver
                      ? 'ring-4 ring-emerald-400 ring-offset-4'
                      : isHovered
                        ? 'ring-2 ring-blue-400/50'
                        : ''
                    }`}
                >
                  {/* Card Content (Image or Empty Placeholder) */}
                  {hasImage ? (
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-white select-none">
                      <img
                        src={slot.image!}
                        alt={slot.label}
                        crossOrigin="anonymous"
                        draggable={false}
                        style={{
                          transform: `scale(${slot.scale}) rotate(${slot.rotation}deg)`,
                          objectFit: slot.fit,
                          objectPosition: `calc(50% + ${slot.panX || 0}px) calc(50% + ${slot.panY || 0}px)`,
                          width: '100%',
                          height: '100%',
                        }}
                        className="pointer-events-none select-none"
                      />

                      {/* Glass Glare Sheen (only if explicitly enabled) */}
                      {Boolean(slot.hasGlare || scene.cardGlare) && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(125deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.03) 100%)',
                          }}
                        />
                      )}

                      {/* Subtle Device Screen Border Highlight */}
                      {scene.deviceFrame && (
                        <div
                          className="absolute inset-0 pointer-events-none border border-black/5"
                          style={{
                            borderRadius: `${cardRadius}px`,
                          }}
                        />
                      )}

                      {/* Removed top corner action buttons at user request */}

                      {/* Bottom Floating Interactive Guide on Hover / Selection (Hidden on export) */}
                      <div className={`no-export absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/20 text-white text-[10px] font-medium backdrop-blur-md pointer-events-none transition-opacity duration-150 flex items-center gap-1.5 shadow-lg z-20 whitespace-nowrap ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                        <Move className="w-3 h-3 text-blue-400" />
                        <span>{t.scrollDragHint}</span>
                        <span className="font-mono text-blue-300 font-bold bg-blue-500/20 px-1 rounded">
                          {Math.round(slot.scale * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Empty Placeholder State (Clean White Studio Card) */
                    <button
                      type="button"
                      onClick={(e) => triggerUploadForSlot(slot.id, e)}
                      className={`w-full h-full flex flex-col items-center justify-center p-4 text-center border-2 border-dashed transition-all bg-white cursor-pointer select-none ${isDragOver
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                          : isHovered
                            ? 'border-blue-400 bg-slate-50 text-slate-600'
                            : 'border-slate-300 text-slate-600'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 transition-transform duration-150 shadow-sm ${isHovered ? 'scale-110' : ''}`}>
                        <Plus className="w-6 h-6 text-slate-500" />
                      </div>

                      <div className="text-xs font-bold text-slate-800 tracking-tight mb-1">
                        {slot.shortLabel}
                      </div>

                      <p className="text-[11px] text-slate-500 leading-tight max-w-[140px]">
                        {t.dropToUpload}
                      </p>

                      <span className="mt-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                        PNG / JPG / WebP
                      </span>
                    </button>
                  )}

                  {/* Corner Slot Badge (hidden during export) */}
                  <div className={`no-export absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-950/75 border border-white/15 text-slate-200 text-[10px] font-bold backdrop-blur-md pointer-events-none z-20 transition-opacity duration-150 ${isHovered || isSelected ? 'opacity-100' : 'opacity-80'}`}>
                    #{slot.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
