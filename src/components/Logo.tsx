import { Box } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base', dot: 'w-1 h-1' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl', dot: 'w-1.5 h-1.5' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-3xl', dot: 'w-2 h-2' },
  };

  const { container, icon, text, dot } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${container} bg-gray-900 rounded-2xl flex items-center justify-center`}>
        <Box className={`${icon} text-cyan-400`} strokeWidth={2} />
      </div>
      <div className="flex items-center gap-1">
        <span className={`${text} tracking-tight`}>
          <span className="font-bold text-gray-900">RETRA</span>
          <span className="font-normal text-gray-900">LABS</span>
        </span>
        <span className={`${dot} bg-cyan-400 rounded-full`}></span>
      </div>
    </div>
  );
}
