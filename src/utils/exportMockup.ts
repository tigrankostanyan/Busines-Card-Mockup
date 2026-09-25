import { toPng, toJpeg, toBlob, toCanvas } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportOptions {
  node: HTMLElement;
  width: number;
  height: number;
  format: 'png' | 'jpeg' | 'webp';
  scale: number;
  fileName?: string;
  isTransparent?: boolean;
}

export async function exportMockupImage(options: ExportOptions): Promise<string> {
  const { node, width, height, format, scale = 2, fileName = 'mockup-studio-export', isTransparent = false } = options;

  const exportPixelRatio = Math.max(1, Math.min(scale, 4));

  const filter = (domNode: HTMLElement) => {
    // Exclude interactive guides or selection boxes if tagged
    if (domNode.classList && domNode.classList.contains('no-export')) {
      return false;
    }
    return true;
  };

  const config = {
    quality: 0.95,
    pixelRatio: exportPixelRatio,
    filter: filter as any,
    backgroundColor: isTransparent ? undefined : undefined,
    width,
    height,
    style: {
      transform: 'none',
      webkitTransform: 'none',
      margin: '0',
      overflow: 'hidden',
      borderRadius: '0px',
      boxShadow: 'none',
      width: `${width}px`,
      height: `${height}px`,
      ...(isTransparent ? { backgroundImage: 'none', backgroundColor: 'transparent' } : {}),
    },
  };

  let dataUrl: string;

  if (format === 'jpeg') {
    dataUrl = await toJpeg(node, { ...config, backgroundColor: '#FFFFFF' });
  } else if (format === 'webp') {
    const canvas = await toCanvas(node, config);
    dataUrl = canvas.toDataURL('image/webp', 0.95);
  } else {
    dataUrl = await toPng(node, config);
  }

  // Trigger download
  const link = document.createElement('a');
  link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : format}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Trigger celebratory confetti
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
    });
  } catch (e) {
    // Ignore if not supported
  }

  return dataUrl;
}

export async function copyMockupToClipboard(node: HTMLElement, width: number, height: number): Promise<boolean> {
  try {
    const blob = await toBlob(node, {
      pixelRatio: 2,
      width,
      height,
      style: {
        transform: 'none',
        webkitTransform: 'none',
        margin: '0',
        overflow: 'hidden',
        borderRadius: '0px',
        boxShadow: 'none',
        width: `${width}px`,
        height: `${height}px`,
      },
      filter: (domNode: any) => !domNode?.classList?.contains?.('no-export'),
    });

    if (!blob) throw new Error('Failed to create image blob');

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.85 },
    });

    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
