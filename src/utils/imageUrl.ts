// Bundled asset so the image URL is always correct (avoids public path issues)
import bacWaterImage from '../assets/bac-water.png';

/** URL for Bacteriostatic Water image (use in onError fallback). */
export const BAC_WATER_IMAGE_URL = bacWaterImage;

/**
 * Maps product name keywords → local public-folder image paths.
 * Used as primary resolution when Supabase image_url is missing/broken.
 */
const NAME_TO_LOCAL_IMAGE: Array<[string, string]> = [
  ['bacteriostatic', bacWaterImage],
  ['bac-water',      bacWaterImage],
  ['retatrutide',    '/Retatrutide.png'],
  ['tirzepatide',    '/TIRZEPATIDE.png'],
  ['ghk-cu',         '/GHKCU.png'],
  ['ghk cu',         '/GHKCU.png'],
  ['semax',          '/SEMAX.png'],
  ['selank',         '/SELANK.png'],
  ['bpc',            '/BPC.png'],
  ['nad+',           '/NAD+.png'],
  ['nad ',           '/NAD+.png'],
  ['tb-500',         '/TB500.png'],
  ['tb500',          '/TB500.png'],
  ['tesamorelin',    '/Tesa.png'],
  ['mot-c',          '/motc.png'],
  ['motc',           '/motc.png'],
  ['mots-c',         '/motc.png'],
];

/**
 * Resolves product image URL for display.
 *
 * Priority order:
 * 1. Name-based mapping → always resolves to a known-good local image
 * 2. Provided imageUrl  → pass-through if name match not found
 * 3. Empty string       → component will show its bg-color placeholder
 */
export function getProductImageUrl(imageUrl: string, productName?: string): string {
  const normalizedName = (productName ?? '').toLowerCase();

  for (const [keyword, localPath] of NAME_TO_LOCAL_IMAGE) {
    if (normalizedName.includes(keyword)) {
      return localPath;
    }
  }

  // Name not matched — try URL-based heuristics for bac-water
  if (
    imageUrl === '/bac-water.jpg' ||
    imageUrl === 'bac-water.jpg' ||
    imageUrl.endsWith('bac-water.jpg') ||
    imageUrl.toLowerCase().includes('bac-water')
  ) {
    return bacWaterImage;
  }

  return imageUrl ?? '';
}
