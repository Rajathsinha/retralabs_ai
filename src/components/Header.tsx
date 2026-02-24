import { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  Calculator,
  Menu,
  X,
  Home,
  Grid3X3,
  Star,
  Truck,
  Headphones,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import ReconstitutionCalculator from './ReconstitutionCalculator';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'catalogue', label: 'Catalogue', icon: Grid3X3 },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'track-order', label: 'Track Order', icon: Truck },
  { key: 'support', label: 'Support', icon: Headphones },
];

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) closeMobile();
  }, [currentPage]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    if (!mobileOpen) return;
    setClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 250);
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    closeMobile();
  };

  const openMobile = () => {
    setClosing(false);
    setMobileOpen(true);
  };

  return (
    <>
      <ReconstitutionCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-100'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            <button
              onClick={() => handleNav('home')}
              className="hover:opacity-80 transition-opacity relative z-50"
            >
              <Logo size="md" />
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                      currentPage === item.key
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {currentPage === item.key && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent-500 rounded-full" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setShowCalculator(true)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 flex items-center gap-1.5"
              >
                <Calculator className="w-4 h-4" />
                Calculator
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('checkout')}
                className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => (mobileOpen ? closeMobile() : openMobile())}
                className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 relative z-50"
              >
                <div className="relative w-5 h-5">
                  <Menu
                    className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                      mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                      mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
              closing ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ animation: closing ? undefined : 'fadeIn 0.3s ease-out' }}
            onClick={closeMobile}
          />

          <div
            ref={menuRef}
            className={`absolute top-0 right-0 w-[min(320px,85vw)] h-full bg-white shadow-2xl transition-transform duration-300 ease-out ${
              closing ? 'translate-x-full' : 'translate-x-0'
            }`}
            style={{
              animation: closing ? undefined : 'slideFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="flex flex-col h-full">
              <div className="pt-20 px-5 flex-1 overflow-y-auto">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
                  Navigation
                </p>
                <nav className="space-y-0.5">
                  {NAV_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleNav(item.key)}
                        className={`w-full text-left px-3 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 flex items-center gap-3 group ${
                          isActive
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                        style={{
                          animation: closing
                            ? undefined
                            : `menuItemIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s both`,
                        }}
                      >
                        <span
                          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-accent-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px]" />
                        </span>
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
                        )}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      closeMobile();
                      setTimeout(() => setShowCalculator(true), 300);
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl text-[15px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 flex items-center gap-3 group"
                    style={{
                      animation: closing
                        ? undefined
                        : `menuItemIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${NAV_ITEMS.length * 0.05}s both`,
                    }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 transition-colors duration-200">
                      <Calculator className="w-[18px] h-[18px]" />
                    </span>
                    <span>Calculator</span>
                  </button>
                </nav>
              </div>

              <div
                className="p-5 border-t border-slate-100"
                style={{
                  animation: closing
                    ? undefined
                    : `menuItemIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(NAV_ITEMS.length + 1) * 0.05}s both`,
                }}
              >
                <button
                  onClick={() => handleNav('checkout')}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white text-[15px] font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  View Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes menuItemIn {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
