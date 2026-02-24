import { useEffect, useRef } from 'react';

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
}: TrustpilotWidgetProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      if ((window as any).Trustpilot && divRef.current) {
        try {
          (window as any).Trustpilot.loadFromElement(divRef.current, true);
        } catch (error) {
          console.error('Failed to load Trustpilot widget:', error);
        }
      }
    };

    if ((window as any).Trustpilot) {
      loadWidget();
    } else {
      const timer = setTimeout(loadWidget, 500);
      return () => clearTimeout(timer);
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
    <div ref={divRef} className="trustpilot-widget" {...attrs}>
      <a href="https://www.trustpilot.com/review/retralabs.in" target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
