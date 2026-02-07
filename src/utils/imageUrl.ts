// Bundled asset so the image URL is always correct (avoids public path issues)
import bacWaterImage from '../assets/bac-water.png';

/** URL for Bacteriostatic Water image (use in onError fallback). */
export const BAC_WATER_IMAGE_URL = bacWaterImage;

/**
 * Resolves product image URL for display.
 * Bacteriostatic Water: use bundled asset so it always loads.
 */
export function getProductImageUrl(imageUrl: string, productName?: string): string {
  if (productName && productName.toLowerCase().includes('bacteriostatic water')) {
    return bacWaterImage;
  }
  if (!imageUrl) return imageUrl;
  if (
    imageUrl === '/bac-water.jpg' ||
    imageUrl === 'bac-water.jpg' ||
    imageUrl.endsWith('bac-water.jpg') ||
    imageUrl.toLowerCase().includes('bac-water')
  ) {
    return bacWaterImage;
  }
  return imageUrl;
}
