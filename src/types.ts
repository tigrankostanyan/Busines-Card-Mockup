export type TemplateId =
  | 'left-tilt-37'
  | 'right-tilt-37'
  | 'isometric-3d'
  | 'triple-cascade'
  | 'panorama-5'
  | 'matrix-9';

export type ImageFit = 'cover' | 'contain' | 'fill';

export interface CardSlot {
  id: number;
  label: string;
  shortLabel: string;
  col: number;
  row: number;
  zIndex: number;
  // Position adjustments
  posX: number;
  posY: number;
  posZ?: number;
  // Content
  image: string | null;
  imageName?: string;
  scale: number; // 0.5 to 3.0
  panX: number; // -100 to 100
  panY: number; // -100 to 100
  rotation: number; // -180 to 180
  fit: ImageFit;
  borderRadius: number;
  hasGlare: boolean;
  bgColor: string;
  borderWidth: number;
  borderColor: string;
  // Custom slot dimensions override (width / height)
  customWidth?: number | null;
  customHeight?: number | null;
  scaleMultiplier?: number;
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  nameArmenian: string;
  description: string;
  slotCount: number;
  defaultRotation: number;
  defaultTiltX: number;
  defaultTiltY: number;
  defaultPerspective: number;
  defaultCardWidth: number;
  defaultCardHeight: number;
  defaultGapX: number;
  defaultGapY: number;
  slots: Omit<CardSlot, 'image' | 'scale' | 'panX' | 'panY' | 'rotation' | 'fit' | 'borderRadius' | 'hasGlare' | 'bgColor' | 'borderWidth' | 'borderColor'>[];
}

export interface SceneConfig {
  template: TemplateId;
  sceneRotation: number;
  sceneZoom: number;
  sceneTiltX: number;
  sceneTiltY: number;
  scenePanX?: number;
  scenePanY?: number;
  perspective: number;
  shadowDepth: number;
  shadowBlur: number;
  shadowOpacity: number;
  cardGapX: number;
  cardGapY: number;
  cardWidth: number;
  cardHeight: number;
  globalBorderRadius: number;
  centerCardsScale?: number;
  backdropType: 'color' | 'gradient' | 'transparent';
  backdropColor: string;
  backdropGradient: string;
  exportPreset: string;
  exportWidth: number;
  exportHeight: number;
  exportFormat: 'png' | 'jpeg' | 'webp';
  exportScale: number;
  cardGlare: boolean;
  deviceFrame: boolean;
  frameColor: string;
}

export interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  scene: SceneConfig;
  slotsConfig?: {
    id: number;
    scale: number;
    panX: number;
    panY: number;
    rotation: number;
    fit: ImageFit;
    borderRadius: number;
    hasGlare: boolean;
    bgColor: string;
    customWidth?: number | null;
    customHeight?: number | null;
  }[];
}

export type Language = 'en' | 'hy';
