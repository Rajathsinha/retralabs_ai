import { useEffect, useRef } from 'react';

// Trustpilot TrustBox widget template IDs
export const TRUSTPILOT_TEMPLATES = {
  micro: '5406e65db0d04a09e042d5fc',   // Micro TrustBox (compact stars + score)
  slider: '53aa8807dec7e10d38f59f33',  // Review slider (carousel of review cards)
  mini: '53aa8807dec7e10d38f59f33',    // Alias for slider
} as const;

const BUSINESS_UNIT_ID = '6979766a0f4152620862a8e6';

interface TrustpilotWidgetProps {
  templateId: string;
  height?: string;
  theme?: 'light' | 'dark';
  stars?: string;
  locale?: string;
}

export default function TrustpilotWidget({
  templateId,
  height = '400px',
  theme = 'light',
  stars = '1,2,3,4,5',
  locale = 'en-IN',
}: TrustpilotWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).Trustpilot && ref.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Trustpilot.loadFromElement(ref.current, true);
      }
    };

    const existingScript = document.querySelector(
      'script[src*="trustpilot.com/bootstrap"]'
    );

    if (existingScript) {
      loadWidget();
    } else {
      const script = document.createElement('script');
      script.src =
        '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      script.onload = loadWidget;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={BUSINESS_UNIT_ID}
      data-style-height={height}
      data-style-width="100%"
      data-theme={theme}
      data-stars={stars}
    >
      <a
        href="https://www.trustpilot.com/review/retralabs.in"
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        View RetraLabs reviews on Trustpilot
      </a>
    </div>
  );
}
