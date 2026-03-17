import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e8f2ed',
          100: '#c3ddd0',
          200: '#9bc8b1',
          300: '#6fb292',
          400: '#4da07a',
          500: '#2d9163',
          600: '#1a6b4a',
          700: '#14573c',
          800: '#0e432e',
          900: '#083020',
          950: '#041a11',
        },
        accent: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.6s ease-out forwards',
        'fade-in-down':  'fadeInDown 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right':'slideInRight 0.6s ease-out forwards',
        'scale-in':      'scaleIn 0.4s ease-out forwards',
        'float':         'float 6s ease-in-out infinite',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'gradient-x':   'gradientX 3s ease infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:     { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown:   { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { '0%': { opacity: '0', transform: 'translateX(-40px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(40px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:      { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseSoft:    { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        shimmer:      { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        gradientX:    { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        bounceSubtle: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        glow:         { '0%': { boxShadow: '0 0 20px rgba(26,107,74,0.1)' }, '100%': { boxShadow: '0 0 30px rgba(26,107,74,0.3)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dot-pattern':     'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
      },
      backgroundSize: { 'dot-sm': '20px 20px' },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary:   { DEFAULT: '#1a6b4a', foreground: '#ffffff' },
            secondary: { DEFAULT: '#0d0d0d', foreground: '#ffffff' },
            success:   { DEFAULT: '#10b981', foreground: '#ffffff' },
            warning:   { DEFAULT: '#f59e0b', foreground: '#ffffff' },
            danger:    { DEFAULT: '#f43f5e', foreground: '#ffffff' },
          },
        },
      },
    }),
  ],
};
