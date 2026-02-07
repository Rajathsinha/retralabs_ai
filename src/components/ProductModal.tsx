import { X, Check } from 'lucide-react';
import { ProductWithVariants, ProductVariant } from '../types';
import { useEffect } from 'react';

interface ProductModalProps {
  product: ProductWithVariants;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (variant: ProductVariant) => void;
  addedVariantId: string | null;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart, addedVariantId }: ProductModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isFlagship = product.name === 'Retatrutide' || product.name === 'Tirzepatide';
  const isBacWater = product.name === 'Bacteriostatic Water (Pharma Grade)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-8">
          <div className="flex gap-3 mb-4">
            {isFlagship && (
              <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                FLAGSHIP
              </span>
            )}
            {product.name === 'Retatrutide' && (
              <span className="px-3 py-1 bg-cyan-400 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </span>
            )}
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-8">
            {product.description}
          </p>

          <div className="space-y-3">
            {product.variants.map((variant) => {
              const isAdded = addedVariantId === variant.id;

              return (
                <div
                  key={variant.id}
                  className="bg-gray-50 rounded-xl p-5 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {isBacWater ? `${variant.dosage_mg}ML` : `${variant.dosage_mg}mg`}
                      </h3>
                      {variant.in_stock ? (
                        <span className="px-3 py-1 bg-cyan-400 text-white text-xs font-bold rounded-full">
                          IN STOCK
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
                          LIMITED
                        </span>
                      )}
                    </div>
                    {variant.vial_configuration && (
                      <p className="text-sm text-gray-500 mb-2">
                        {variant.vial_configuration}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{variant.price_inr.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => onAddToCart(variant)}
                    disabled={!variant.in_stock}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      isAdded
                        ? 'bg-green-500 text-white'
                        : variant.in_stock
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Added
                      </span>
                    ) : (
                      'Add to Research'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 uppercase tracking-wide text-center mt-8">
            For in-vitro research only. Not for human consumption.
          </p>
        </div>
      </div>
    </div>
  );
}
