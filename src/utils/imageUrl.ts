import bacWaterImage from '../assets/bac-water.jpg';

export const BAC_WATER_IMAGE_URL = bacWaterImage;

const NAME_TO_LOCAL_IMAGE: Array<[string, string]> = [
  ['bacteriostatic', bacWaterImage],
  ['bac-water',      bacWaterImage],
  ['retatrutide',    '/Retatrutide.jpg'],
  ['tirzepatide',    '/TIRZEPATIDE.jpg'],
  ['ghk-cu',         '/GHKCU.jpg'],
  ['ghk cu',         '/GHKCU.jpg'],
  ['semax',          '/SEMAX.jpg'],
  ['selank',         '/SELANK.jpg'],
  ['bpc',            '/BPC.jpg'],
  ['nad+',           '/NAD+.jpg'],
  ['nad ',           '/NAD+.jpg'],
  ['tb-500',         '/TB500.jpg'],
  ['tb500',          '/TB500.jpg'],
  ['tesamorelin',    '/Tesa.jpg'],
  ['mot-c',          '/motc.jpg'],
  ['motc',           '/motc.jpg'],
  ['mots-c',         '/motc.jpg'],
  ['aod',            '/AOD.webp'],
  ['epithalon',      '/Epithalone.webp'],
  ['kisspeptin',     '/KISSPEPTIN.webp'],
  ['ss-31',          '/SS-31.webp'],
  ['ss31',           '/SS-31.webp'],
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
