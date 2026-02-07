import { Box } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** Use "dark" on light backgrounds (header), "light" on dark backgrounds (footer) */
  variant?: 'light' | 'dark';
}

export default function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base', dot: 'w-1 h-1' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl', dot: 'w-1.5 h-1.5' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-3xl', dot: 'w-2 h-2' },
  };

  const { container, icon, text, dot } = sizes[size];
  const isLight = variant === 'light';
  const boxBg = isLight ? 'bg-slate-800' : 'bg-gray-900';
  const iconColor = isLight ? 'text-cyan-400' : 'text-cyan-400';
  const textColor = isLight ? 'text-slate-400' : 'text-gray-900';
  const dotColor = 'bg-cyan-400';

  return (
    <div className="flex items-center gap-3">
      <div className={`${container} ${boxBg} rounded-full flex items-center justify-center`}>
        <Box className={`${icon} ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`${text} font-semibold tracking-tight ${textColor}`}>RETRALABS</span>
        <span className={`${dot} ${dotColor} rounded-full flex-shrink-0`} />
      </div>
    </div>
  );
}
