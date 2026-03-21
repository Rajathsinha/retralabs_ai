import { Box } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** Use "dark" on light backgrounds (header), "light" on dark backgrounds (footer) */
  variant?: 'light' | 'dark';
}

export default function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-7 h-7', icon: 'w-3.5 h-3.5', text: 'text-sm', dot: 'w-1 h-1' },
    md: { container: 'w-9 h-9', icon: 'w-4.5 h-4.5', text: 'text-lg', dot: 'w-1.5 h-1.5' },
    lg: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl', dot: 'w-2 h-2' },
  };

  const { container, text, dot } = sizes[size];
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white/70' : 'text-white';

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon box — always dark, like an app icon */}
      <div
        className={`${container} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{
          background: '#0d1117',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <Box className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`${text} font-bold tracking-tight text-white`}>RetraLabs</span>
        <span className={`${dot} bg-cyan-400 rounded-full flex-shrink-0 mb-0.5`} />
      </div>
    </div>
  );
}
