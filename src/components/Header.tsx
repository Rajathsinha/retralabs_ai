import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, useDisclosure } from '@heroui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Calculator, Menu, X,
  Home, FlaskConical, Star, Users, HelpCircle,
  Search, ChevronDown, Check, LogOut, UserCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ReconstitutionCalculator from './ReconstitutionCalculator';
import SearchModal from './SearchModal';

const NAV_ITEMS = [
  { path: '/',          label: 'Home',      icon: Home },
  { path: '/catalogue', label: 'Catalogue', icon: FlaskConical },
  { path: '/reviews',   label: 'Reviews',   icon: Star },
  { path: '/about',     label: 'About',     icon: Users },
  { path: '/support',   label: 'Support',   icon: HelpCircle },
];

export default function Header() {
  const { cart }                      = useCart();
  const { currency, setCurrencyCode } = useCurrency();
  const { user, signOut }             = useAuth();
  const cartCount                     = cart.reduce((n, i) => n + i.quantity, 0);
  const location                      = useLocation();
  const navigate                      = useNavigate();
  const [open,         setOpen]         = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [avatarOpen,   setAvatarOpen]   = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const avatarRef   = useRef<HTMLDivElement>(null);

  /* User initials for avatar */
  const initials = user
    ? (user.user_metadata?.name || user.email || 'U')
        .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const { isOpen: calcOpen, onOpen: openCalc, onClose: closeCalc } = useDisclosure();

  /* ── Scroll blur ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close drawer on navigate ── */
  useEffect(() => { setOpen(false); }, [location.pathname]);

  /* ── Cmd/Ctrl+K → open search ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Close currency dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    if (currencyOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [currencyOpen]);

  /* ── Close avatar dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    if (avatarOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [avatarOpen]);

  const active = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <>
      {/* ── Search modal (portal to body) ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Calculator Modal ── */}
      <Modal
        isOpen={calcOpen}
        onClose={closeCalc}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base:     'bg-transparent shadow-none',
          backdrop: 'bg-slate-950/80 backdrop-blur-sm',
          wrapper:  'items-center',
        }}
        hideCloseButton
      >
        <ModalContent>
          {() => <ReconstitutionCalculator isOpen={calcOpen} onClose={closeCalc} />}
        </ModalContent>
      </Modal>

      {/* ── Header shell ── */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-md border-white/8 shadow-[0_2px_20px_rgba(0,0,0,0.5)]'
            : 'bg-slate-950 border-white/[0.06]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header row ── */}
          <div className="flex items-center justify-between h-14">

            {/* LEFT — Logo */}
            <RouterLink to="/" className="hover:opacity-75 transition-opacity flex-shrink-0">
              <Logo size="md" variant="light" />
            </RouterLink>

            {/* CENTER — Desktop nav */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-0.5">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <RouterLink
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg ${
                    active(path)
                      ? 'text-white'
                      : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active(path) ? 'text-cyan-400' : 'text-white/30'}`} />
                  {label}
                  {active(path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </RouterLink>
              ))}

              {/* Calculator */}
              <button
                onClick={openCalc}
                className="flex items-center gap-1.5 px-3.5 py-2 ml-1 rounded-lg text-sm font-medium text-white/45 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
              >
                <Calculator className="w-3.5 h-3.5 text-white/30" />
                Calculator
              </button>
            </nav>

            {/* RIGHT — Search | Currency | Cart | Hamburger */}
            <div className="flex items-center gap-1.5">

              {/* Search button — desktop: pill with shortcut hint, mobile: icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="flex items-center gap-2 rounded-lg text-white/50 hover:text-white/80 transition-all duration-200
                           px-2 py-2
                           md:px-3 md:py-1.5 md:border md:border-white/10 md:hover:border-white/20 md:hover:bg-white/5 md:text-sm"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:flex items-center gap-2 text-sm text-white/35">
                  Search products…
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[11px] font-mono text-white/30">
                    {isMac ? '⌘' : 'ctrl'} K
                  </span>
                </span>
              </button>

              {/* Currency picker */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyOpen(o => !o)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                >
                  <span className="text-base leading-none">{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/25 border-b border-white/8">
                      Currency
                    </p>
                    {Object.values(CURRENCIES).map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrencyCode(c.code); setCurrencyOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-white/6 transition-colors"
                      >
                        <span className="text-base leading-none w-5">{c.flag}</span>
                        <span className="flex-1 text-white/80">{c.name}</span>
                        <span className="text-white/40 text-xs font-mono">{c.symbol}</span>
                        {c.code === currency.code && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign In / Avatar — desktop only */}
              {user ? (
                <div className="relative hidden md:block" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen(o => !o)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-xs font-extrabold hover:opacity-90 transition-opacity"
                    aria-label="Account menu"
                  >
                    {initials}
                  </button>
                  {avatarOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-3 py-2.5 border-b border-white/8">
                        <p className="text-xs font-bold text-white/80 truncate">{user.user_metadata?.name || 'Account'}</p>
                        <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setAvatarOpen(false); navigate('/account'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors text-left"
                      >
                        <UserCircle2 className="w-4 h-4" /> My Account
                      </button>
                      <button
                        onClick={async () => { setAvatarOpen(false); await signOut(); navigate('/'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/signin')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => navigate('/checkout')}
                aria-label="View cart"
                className="relative flex items-center gap-2 p-2 md:px-4 md:py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-white border border-transparent md:border-white/10 md:hover:border-white/25 hover:bg-white/8 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 md:static md:top-auto md:right-auto bg-cyan-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-white/10 bg-slate-950/98 backdrop-blur-md">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">

              {/* Mobile search */}
              <button
                onClick={() => { setOpen(false); setTimeout(() => setSearchOpen(true), 200); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-white/55 hover:text-white hover:bg-white/6 transition-all duration-200"
              >
                <Search className="w-4 h-4 flex-shrink-0 text-white/40" />
                Search products…
              </button>

              {/* Nav links */}
              {NAV_ITEMS.map(({ path, label, icon: Icon }, i) => (
                <RouterLink
                  key={path}
                  to={path}
                  style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    active(path)
                      ? 'text-white bg-white/10 border border-white/10'
                      : 'text-white/55 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active(path) ? 'text-cyan-400' : 'text-white/40'}`} />
                  {label}
                  {active(path) && <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />}
                </RouterLink>
              ))}

              {/* Calculator */}
              <button
                onClick={() => { setOpen(false); setTimeout(openCalc, 300); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-white/55 hover:text-white hover:bg-white/6 transition-all duration-200 text-left"
              >
                <Calculator className="w-4 h-4 text-white/40" />
                Reconstitution Calculator
              </button>

              {/* Mobile currency row */}
              <div className="px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Currency</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(CURRENCIES).map(c => (
                    <button
                      key={c.code}
                      onClick={() => setCurrencyCode(c.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                        c.code === currency.code
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart CTA */}
              <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => { setOpen(false); navigate('/checkout'); }}
                  className="w-full flex items-center justify-center gap-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 font-semibold px-4 py-3.5 rounded-xl transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart
                  {cartCount > 0 && (
                    <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Auth row */}
                {user ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setOpen(false); navigate('/account'); }}
                      className="flex-1 flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/6 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-sm"
                    >
                      <UserCircle2 className="w-4 h-4" />
                      My Account
                    </button>
                    <button
                      onClick={async () => { setOpen(false); await signOut(); navigate('/'); }}
                      className="flex items-center gap-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setOpen(false); navigate('/signin'); }}
                    className="w-full flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/6 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-sm"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
