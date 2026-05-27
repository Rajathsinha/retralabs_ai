import { useEffect, useRef } from 'react';

const BUSINESS_UNIT_ID = '6979766a0f4152620862a8e6';
const TRUSTPILOT_URL   = 'https://www.trustpilot.com/review/retralabs.in';

/**
 * Trustpilot TrustBox template IDs.
 *
 * microStar   — just 5 stars,        ~20 px tall  (smallest, footer)
 * microCombo  — stars + wordmark,    ~20 px tall  (catalogue header)
 * microReview — stars + review count ~24 px tall  (product detail)
 * mini        — score + stars + count ~150 px tall (homepage)
 */
export const TP_TEMPLATES = {
  microStar:   '5419b637fa0340045cd0c936',
  microCombo:  '5419b732fbfb950b10de65e5',
  microReview: '5419b6ffb0d04a076446a9af',
  mini:        '53aa8807dec7e10d38f59f32',
} as const;

type TemplateKey = keyof typeof TP_TEMPLATES;

interface TrustpilotWidgetProps {
  template?:  TemplateKey;
  height?:    string;
  width?:     string;
  theme?:     'dark' | 'light';
  className?: string;
}

export default function TrustpilotWidget({
  template  = 'microCombo',
  height    = '24px',
  width     = '160px',
  theme     = 'dark',
  className = '',
}: TrustpilotWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tp = (window as any).Trustpilot;
    if (tp) {
      tp.loadFromElement(el, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className}`}
      data-locale="en-US"
      data-template-id={TP_TEMPLATES[template]}
      data-businessunit-id={BUSINESS_UNIT_ID}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
    >
      <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
