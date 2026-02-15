import { useState, useEffect } from 'react';
import { ShoppingCart, Calculator, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import ReconstitutionCalculator from './ReconstitutionCalculator';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'catalogue', label: 'Catalogue' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'track-order', label: 'Track Order' },
  { key: 'support', label: 'Support' },
];

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
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
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === item.key
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {currentPage === item.key && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent-500 rounded-full" />
                  )}
                </button>
              ))}
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
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 relative z-50"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-in-right">
            <div className="pt-20 px-6">
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                      currentPage === item.key
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowCalculator(true);
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Calculator
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => handleNav('checkout')}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
