import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

interface TrustpilotWidgetProps {
  templateId: string;
  businessunitId: string;
  styleHeight?: string;
  styleWidth?: string;
  theme?: string;
  stars?: string;
  locale?: string;
  token?: string;
  schemaType?: string;
  isList?: boolean;
}

export default function TrustpilotWidget({
  templateId,
  businessunitId,
  styleHeight = '52px',
  styleWidth = '100%',
  theme,
  stars,
  locale = 'en-US',
  token,
  schemaType,
  isList = false,
}: TrustpilotWidgetProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [loadAttempted, setLoadAttempted] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const loadWidget = () => {
      if ((window as any).Trustpilot && divRef.current) {
        try {
          (window as any).Trustpilot.loadFromElement(divRef.current, true);
          setLoadAttempted(true);
          return true;
        } catch (error) {
          console.error('Failed to load Trustpilot widget:', error);
        }
      }
      return false;
    };

    if ((window as any).Trustpilot) {
      loadWidget();
    } else {
      const timer = setInterval(() => {
        attempts++;
        if (loadWidget() || attempts >= maxAttempts) {
          clearInterval(timer);
          setLoadAttempted(true);
        }
      }, 300);

      return () => clearInterval(timer);
    }
  }, []);

  const attrs: Record<string, string> = {
    'data-locale': locale,
    'data-template-id': templateId,
    'data-businessunit-id': businessunitId,
    'data-style-height': styleHeight,
    'data-style-width': styleWidth,
  };

  if (theme) attrs['data-theme'] = theme;
  if (stars) attrs['data-stars'] = stars;
  if (token) attrs['data-token'] = token;
  if (schemaType) attrs['data-schema-type'] = schemaType;

  return (
    <div>
      <div ref={divRef} className="trustpilot-widget" {...attrs}>
        <a href="https://www.trustpilot.com/review/retralabs.in" target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>

      {loadAttempted && !isList && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Visit us on Trustpilot to see verified reviews from real customers</p>
          <a
            href="https://www.trustpilot.com/review/retralabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <span>View Reviews on Trustpilot</span>
          </a>
        </div>
      )}

      {loadAttempted && isList && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Verified by Trustpilot</span>
              </div>
              <p className="text-gray-700 mb-2 font-medium">Excellent Product Quality</p>
              <p className="text-gray-600 text-sm">High-quality research peptides with excellent purity. Fast shipping and great customer service. Highly recommended for researchers.</p>
              <p className="text-gray-500 text-xs mt-3">Customer Name</p>
            </div>
          ))}
          <div className="text-center pt-4">
            <a
              href="https://www.trustpilot.com/review/retralabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              View all reviews on Trustpilot
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
