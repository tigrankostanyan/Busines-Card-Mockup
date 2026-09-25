import { TemplateConfig } from '../types';

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'left-tilt-37',
    name: '3D Studio Screen Spread (Left Tilt -38°)',
    nameArmenian: '3D Ստուդիո Էկրանների Սփռում (Ձախ Թեքում -38°)',
    description: 'Exact studio diagonal staggered screen spread · 7 slots',
    slotCount: 7,
    defaultRotation: -38,
    defaultTiltX: 0,
    defaultTiltY: 0,
    defaultPerspective: 1600,
    defaultCardWidth: 280,
    defaultCardHeight: 520,
    defaultGapX: 36,
    defaultGapY: 36,
    slots: [
      // Left track (2 cards: top, bottom)
      { id: 1, label: 'Slot 1 (Left Top)', shortLabel: '#1 Left Top', col: 0, row: 0, zIndex: 3, posZ: 0, posX: -316, posY: -278 },
      { id: 2, label: 'Slot 2 (Left Bottom)', shortLabel: '#2 Left Bottom', col: 0, row: 1, zIndex: 4, posZ: 0, posX: -316, posY: 278 },
      // Center track (3 cards: top, center main hero, bottom)
      { id: 3, label: 'Slot 3 (Center Top)', shortLabel: '#3 Center Top', col: 1, row: 0, zIndex: 2, posZ: 0, posX: 0, posY: -556 },
      { id: 4, label: 'Slot 4 (Center Main)', shortLabel: '#4 Center Main (Hero)', col: 1, row: 1, zIndex: 10, posZ: 8, posX: 0, posY: 0 },
      { id: 5, label: 'Slot 5 (Center Bottom)', shortLabel: '#5 Center Bottom', col: 1, row: 2, zIndex: 2, posZ: 0, posX: 0, posY: 556 },
      // Right track (2 cards: top, bottom)
      { id: 6, label: 'Slot 6 (Right Top)', shortLabel: '#6 Right Top', col: 2, row: 0, zIndex: 3, posZ: 0, posX: 316, posY: -278 },
      { id: 7, label: 'Slot 7 (Right Bottom)', shortLabel: '#7 Right Bottom', col: 2, row: 1, zIndex: 4, posZ: 0, posX: 316, posY: 278 },
    ],
  },
  {
    id: 'right-tilt-37',
    name: '3D Studio Screen Spread (Right Tilt +38°)',
    nameArmenian: '3D Ստուդիո Էկրանների Սփռում (Աջ Թեքում +38°)',
    description: 'Mirrored studio diagonal screen spread · 7 slots',
    slotCount: 7,
    defaultRotation: 38,
    defaultTiltX: 0,
    defaultTiltY: 0,
    defaultPerspective: 1600,
    defaultCardWidth: 280,
    defaultCardHeight: 520,
    defaultGapX: 36,
    defaultGapY: 36,
    slots: [
      { id: 1, label: 'Slot 1 (Left Top)', shortLabel: '#1 Left Top', col: 0, row: 0, zIndex: 3, posZ: 0, posX: -316, posY: -278 },
      { id: 2, label: 'Slot 2 (Left Bottom)', shortLabel: '#2 Left Bottom', col: 0, row: 1, zIndex: 4, posZ: 0, posX: -316, posY: 278 },
      { id: 3, label: 'Slot 3 (Center Top)', shortLabel: '#3 Center Top', col: 1, row: 0, zIndex: 2, posZ: 0, posX: 0, posY: -556 },
      { id: 4, label: 'Slot 4 (Center Main)', shortLabel: '#4 Center Main (Hero)', col: 1, row: 1, zIndex: 10, posZ: 8, posX: 0, posY: 0 },
      { id: 5, label: 'Slot 5 (Center Bottom)', shortLabel: '#5 Center Bottom', col: 1, row: 2, zIndex: 2, posZ: 0, posX: 0, posY: 556 },
      { id: 6, label: 'Slot 6 (Right Top)', shortLabel: '#6 Right Top', col: 2, row: 0, zIndex: 3, posZ: 0, posX: 316, posY: -278 },
      { id: 7, label: 'Slot 7 (Right Bottom)', shortLabel: '#7 Right Bottom', col: 2, row: 1, zIndex: 4, posZ: 0, posX: 316, posY: 278 },
    ],
  },
  {
    id: 'isometric-3d',
    name: 'Perspective Isometric Flow',
    nameArmenian: 'Իզոմետրիկ 3D Հոսք',
    description: 'Elevated isometric floating screens with real depth',
    slotCount: 5,
    defaultRotation: -28,
    defaultTiltX: 42,
    defaultTiltY: -12,
    defaultPerspective: 1000,
    defaultCardWidth: 270,
    defaultCardHeight: 540,
    defaultGapX: 36,
    defaultGapY: 36,
    slots: [
      { id: 1, label: 'Slot 1 (Back Left)', shortLabel: '#1 Back Left', col: 0, row: 0, zIndex: 1, posX: -310, posY: -180 },
      { id: 2, label: 'Slot 2 (Back Right)', shortLabel: '#2 Back Right', col: 1, row: 0, zIndex: 2, posX: 310, posY: -180 },
      { id: 3, label: 'Slot 3 (Hero Center)', shortLabel: '#3 Hero Center', col: 0, row: 1, zIndex: 5, posX: 0, posY: 40 },
      { id: 4, label: 'Slot 4 (Front Left)', shortLabel: '#4 Front Left', col: 0, row: 2, zIndex: 4, posX: -310, posY: 280 },
      { id: 5, label: 'Slot 5 (Front Right)', shortLabel: '#5 Front Right', col: 1, row: 2, zIndex: 3, posX: 310, posY: 280 },
    ],
  },
  {
    id: 'triple-cascade',
    name: 'Triple Cascade Showcase',
    nameArmenian: 'Եռակի Կասկադ',
    description: '3 overlapping angled mobile screens',
    slotCount: 3,
    defaultRotation: -25,
    defaultTiltX: 18,
    defaultTiltY: 0,
    defaultPerspective: 1200,
    defaultCardWidth: 300,
    defaultCardHeight: 600,
    defaultGapX: 40,
    defaultGapY: 40,
    slots: [
      { id: 1, label: 'Slot 1 (Left Behind)', shortLabel: '#1 Left', col: 0, row: 0, zIndex: 1, posX: -240, posY: -60 },
      { id: 2, label: 'Slot 2 (Center Hero)', shortLabel: '#2 Center Hero', col: 1, row: 0, zIndex: 3, posX: 0, posY: 20 },
      { id: 3, label: 'Slot 3 (Right In Front)', shortLabel: '#3 Right', col: 2, row: 0, zIndex: 2, posX: 240, posY: 100 },
    ],
  },
  {
    id: 'panorama-5',
    name: '5-Screen Linear Panorama',
    nameArmenian: '5 Էկրանների Պանորամա',
    description: 'Horizontal angled panoramic mobile presentation',
    slotCount: 5,
    defaultRotation: -18,
    defaultTiltX: 15,
    defaultTiltY: 0,
    defaultPerspective: 1400,
    defaultCardWidth: 240,
    defaultCardHeight: 480,
    defaultGapX: 20,
    defaultGapY: 20,
    slots: [
      { id: 1, label: 'Slot 1 (Far Left)', shortLabel: '#1 Far Left', col: 0, row: 0, zIndex: 1, posX: -520, posY: -60 },
      { id: 2, label: 'Slot 2 (Mid Left)', shortLabel: '#2 Mid Left', col: 1, row: 0, zIndex: 2, posX: -260, posY: -20 },
      { id: 3, label: 'Slot 3 (Center Hero)', shortLabel: '#3 Hero', col: 2, row: 0, zIndex: 5, posX: 0, posY: 20 },
      { id: 4, label: 'Slot 4 (Mid Right)', shortLabel: '#4 Mid Right', col: 3, row: 0, zIndex: 3, posX: 260, posY: 60 },
      { id: 5, label: 'Slot 5 (Far Right)', shortLabel: '#5 Far Right', col: 4, row: 0, zIndex: 2, posX: 520, posY: 100 },
    ],
  },
  {
    id: 'matrix-9',
    name: '3x3 Diagonal Matrix (9 Slots)',
    nameArmenian: '3x3 Անկյունագծային Մատրից (9 Սլոթ)',
    description: 'Full high-density 9-screen presentation layout',
    slotCount: 9,
    defaultRotation: -37,
    defaultTiltX: 22,
    defaultTiltY: 0,
    defaultPerspective: 1300,
    defaultCardWidth: 230,
    defaultCardHeight: 460,
    defaultGapX: 24,
    defaultGapY: 24,
    slots: [
      { id: 1, label: 'Slot 1 (Top Left)', shortLabel: '#1 Top Left', col: 0, row: 0, zIndex: 1, posX: -260, posY: -480 },
      { id: 2, label: 'Slot 2 (Top Center)', shortLabel: '#2 Top Mid', col: 1, row: 0, zIndex: 2, posX: 0, posY: -480 },
      { id: 3, label: 'Slot 3 (Top Right)', shortLabel: '#3 Top Right', col: 2, row: 0, zIndex: 3, posX: 260, posY: -480 },
      { id: 4, label: 'Slot 4 (Mid Left)', shortLabel: '#4 Mid Left', col: 0, row: 1, zIndex: 4, posX: -260, posY: 4 },
      { id: 5, label: 'Slot 5 (Center Hero)', shortLabel: '#5 Center Hero', col: 1, row: 1, zIndex: 7, posX: 0, posY: 4 },
      { id: 6, label: 'Slot 6 (Mid Right)', shortLabel: '#6 Mid Right', col: 2, row: 1, zIndex: 5, posX: 260, posY: 4 },
      { id: 7, label: 'Slot 7 (Bottom Left)', shortLabel: '#7 Bottom Left', col: 0, row: 2, zIndex: 6, posX: -260, posY: 488 },
      { id: 8, label: 'Slot 8 (Bottom Center)', shortLabel: '#8 Bottom Mid', col: 1, row: 2, zIndex: 8, posX: 0, posY: 488 },
      { id: 9, label: 'Slot 9 (Bottom Right)', shortLabel: '#9 Bottom Right', col: 2, row: 2, zIndex: 9, posX: 260, posY: 488 },
    ],
  },
];

export const BACKDROP_PALETTES = [
  { id: 'studio-grey', name: 'Studio Neutral Grey (Exact Mockup)', color: '#B5BAC2', type: 'color' as const, border: '#9DA3AD' },
  { id: 'light-cream', name: 'Studio Cream', color: '#F6F5F2', type: 'color' as const, border: '#E6E4DD' },
  { id: 'warm-gold', name: 'Warm Amber', color: '#F4A623', type: 'color' as const, border: '#D98E12' },
  { id: 'pure-white', name: 'Pure White', color: '#FFFFFF', type: 'color' as const, border: '#E2E2E5' },
  { id: 'obsidian', name: 'Obsidian Dark', color: '#17181F', type: 'color' as const, border: '#2D2E3B' },
  { id: 'slate-blue', name: 'Midnight Slate', color: '#0F172A', type: 'color' as const, border: '#1E293B' },
  { id: 'sage-gray', name: 'Sage Minimal', color: '#E8ECE9', type: 'color' as const, border: '#D0D8D2' },
  { id: 'soft-lilac', name: 'Lilac Mist', color: '#F3EDF7', type: 'color' as const, border: '#DFD4EA' },
  { id: 'sunset-grad', name: 'Sunset Aura', color: '#FF7E5F', gradient: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)', type: 'gradient' as const, border: '#E06B4E' },
  { id: 'studio-mesh', name: 'Studio Gradient', color: '#E0E7FF', gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F5F3FF 100%)', type: 'gradient' as const, border: '#C7D2FE' },
  { id: 'transparent', name: 'Transparent', color: 'transparent', type: 'transparent' as const, border: '#CCCCCC' },
];

export const EXPORT_PRESETS = [
  { label: '4:3 Standard (400x300)', width: 400, height: 300, ratio: '4:3' },
  { label: '4:3 High Res (1600x1200)', width: 1600, height: 1200, ratio: '4:3' },
  { label: '16:9 Dribbble (1600x900)', width: 1600, height: 900, ratio: '16:9' },
  { label: '16:9 Full HD (1920x1080)', width: 1920, height: 1080, ratio: '16:9' },
  { label: '16:9 4K Ultra (3840x2160)', width: 3840, height: 2160, ratio: '16:9' },
  { label: '1:1 Instagram Post (1080x1080)', width: 1080, height: 1080, ratio: '1:1' },
  { label: '9:16 Story / Reel (1080x1920)', width: 1080, height: 1920, ratio: '9:16' },
  { label: '3:2 Presentation (1500x1000)', width: 1500, height: 1000, ratio: '3:2' },
  { label: 'Twitter / X Banner (1500x500)', width: 1500, height: 500, ratio: '3:1' },
  { label: 'Custom Dimensions', width: 1200, height: 900, ratio: 'custom' },
];

// Sample app screens generated as SVG data URLs so the user can immediately test with beautiful designs
export function generateSampleMockupImages(): { [key: number]: string } {
  const screens: { [key: number]: string } = {};

  const demoThemes = [
    {
      title: 'Crypto Wallet',
      subtitle: '$48,920.50',
      badge: '+12.4% this week',
      accent: '#6366F1',
      bg1: '#0F172A',
      bg2: '#1E293B',
      cardBg: '#334155',
      items: ['Bitcoin BTC · $64,200', 'Ethereum ETH · $3,450', 'Solana SOL · $154.20'],
    },
    {
      title: 'Health & Fitness',
      subtitle: '8,420 kcal burned',
      badge: 'Goal: 10,000 steps',
      accent: '#10B981',
      bg1: '#064E3B',
      bg2: '#047857',
      cardBg: '#065F46',
      items: ['Morning Run · 5.4 km', 'HIIT Workout · 45 min', 'Sleep Score · 92%'],
    },
    {
      title: 'Analytics Pro',
      subtitle: '124.8K Users',
      badge: 'Conversion 4.8%',
      accent: '#3B82F6',
      bg1: '#1E1B4B',
      bg2: '#312E81',
      cardBg: '#3730A3',
      items: ['Active Sessions · 1,420', 'Bounce Rate · 24.1%', 'Revenue · $84,200'],
    },
    {
      title: 'Music Stream',
      subtitle: 'Midnight Vibes Playlist',
      badge: 'Now Playing',
      accent: '#EC4899',
      bg1: '#831843',
      bg2: '#9D174D',
      cardBg: '#BE185D',
      items: ['Solar Echoes · Ambient', 'Neon Drive · Synthwave', 'Deep Ocean · Lo-Fi'],
    },
    {
      title: 'Food Delivery',
      subtitle: 'Artisan Burger & Truffle',
      badge: '18-25 min delivery',
      accent: '#F59E0B',
      bg1: '#78350F',
      bg2: '#92400E',
      cardBg: '#B45309',
      items: ['Double Smash Patty', 'Parmesan Truffle Fries', 'Vanilla Bean Shake'],
    },
    {
      title: 'Smart Home Hub',
      subtitle: 'Living Room · 21.5°C',
      badge: '7 Devices Active',
      accent: '#06B6D4',
      bg1: '#164E63',
      bg2: '#155E75',
      cardBg: '#0E7490',
      items: ['Air Quality · Excellent', 'Ambient Lights · 60%', 'Smart Lock · Secure'],
    },
    {
      title: 'Travel Planner',
      subtitle: 'Tokyo & Kyoto 2026',
      badge: 'Day 4 of 10',
      accent: '#8B5CF6',
      bg1: '#3B0764',
      bg2: '#581C87',
      cardBg: '#6B21A8',
      items: ['Shibuya Crossing Tour', 'Fushimi Inari Sunrise', 'Bullet Train Shinkansen'],
    },
    {
      title: 'Task Master',
      subtitle: 'Sprint 24 · 85% Done',
      badge: '4 Tasks Left',
      accent: '#14B8A6',
      bg1: '#134E4A',
      bg2: '#115E59',
      cardBg: '#0F766E',
      items: ['Review PR #412', 'Deploy to Production', 'Client Sync Meeting'],
    },
    {
      title: 'Finance & Stocks',
      subtitle: '$142,390 Net Worth',
      badge: '+2.8% Today',
      accent: '#22C55E',
      bg1: '#14532D',
      bg2: '#166534',
      cardBg: '#15803D',
      items: ['NVDA · +4.2%', 'AAPL · +1.1%', 'GOOGL · +2.4%'],
    },
  ];

  demoThemes.forEach((theme, index) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="1040" viewBox="0 0 520 1040">
      <defs>
        <linearGradient id="bg-${index}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${theme.bg1}"/>
          <stop offset="100%" stop-color="${theme.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="520" height="1040" fill="url(#bg-${index})"/>
      
      <!-- Top Status Bar -->
      <text x="40" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#FFFFFF">9:41</text>
      <circle cx="430" cy="48" r="6" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="450" cy="48" r="6" fill="#FFFFFF" opacity="0.8"/>
      <rect x="465" y="42" width="22" height="12" rx="3" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="468" y="45" width="14" height="6" rx="1.5" fill="#FFFFFF"/>

      <!-- App Header -->
      <rect x="40" y="100" width="48" height="48" rx="14" fill="${theme.accent}"/>
      <circle cx="64" cy="124" r="12" fill="#FFFFFF" opacity="0.9"/>
      <text x="104" y="125" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">${theme.title}</text>
      <text x="104" y="145" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94A3B8">${theme.badge}</text>

      <!-- Main Balance / Hero Card -->
      <rect x="36" y="180" width="448" height="220" rx="28" fill="${theme.cardBg}" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>
      <text x="64" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#CBD5E1">Total Balance</text>
      <text x="64" y="285" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="800" fill="#FFFFFF">${theme.subtitle}</text>
      
      <!-- Pill Badge -->
      <rect x="64" y="320" width="180" height="38" rx="19" fill="${theme.accent}" fill-opacity="0.25"/>
      <circle cx="82" cy="339" r="5" fill="${theme.accent}"/>
      <text x="96" y="345" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${theme.badge}</text>

      <!-- Chart / Visual element -->
      <path d="M 64 540 Q 140 460 220 500 T 360 440 T 456 410" fill="none" stroke="${theme.accent}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 64 540 Q 140 460 220 500 T 360 440 T 456 410 L 456 590 L 64 590 Z" fill="${theme.accent}" fill-opacity="0.12"/>

      <!-- List Items -->
      <text x="40" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">Recent Activity</text>
      
      ${theme.items.map((item, idx) => `
        <g transform="translate(36, ${670 + idx * 95})">
          <rect width="448" height="78" rx="20" fill="${theme.cardBg}" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
          <circle cx="44" cy="39" r="18" fill="${theme.accent}" fill-opacity="0.3"/>
          <rect x="36" y="31" width="16" height="16" rx="4" fill="${theme.accent}"/>
          <text x="80" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" fill="#FFFFFF">${item}</text>
        </g>
      `).join('')}

      <!-- Bottom Nav Bar -->
      <rect x="36" y="940" width="448" height="64" rx="32" fill="#090D16" fill-opacity="0.85" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1"/>
      <circle cx="100" cy="972" r="10" fill="${theme.accent}"/>
      <circle cx="200" cy="972" r="8" fill="#64748B"/>
      <circle cx="300" cy="972" r="8" fill="#64748B"/>
      <circle cx="400" cy="972" r="8" fill="#64748B"/>
    </svg>`;
    screens[index + 1] = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });

  return screens;
}
