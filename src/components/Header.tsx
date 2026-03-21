import { useState, useEffect, useRef } from 'react';
import { useDisclosure } from '@heroui/react';
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

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      <ReconstitutionCalculator isOpen={calcOpen} onClose={closeCalc} />

      {/* ── Header shell ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: scrolled ? 'rgba(3,6,15,0.97)' : 'rgba(3,6,15,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          transition: 'background 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

            {/* LEFT — Logo */}
            <RouterLink to="/" style={{ display: 'flex', flexShrink: 0, opacity: 1, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Logo size="md" variant="dark" />
            </RouterLink>

            {/* CENTER — Desktop nav */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
              {NAV_ITEMS.map(({ path, label }) => (
                <RouterLink
                  key={path}
                  to={path}
                  style={{
                    position: 'relative',
                    padding: '0.35rem 0.9rem',
                    fontSize: '0.82rem',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    color: active(path) ? 'rgb(34,211,238)' : 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { if (!active(path)) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; }}
                  onMouseLeave={e => { if (!active(path)) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {label}
                  {/* Active underline */}
                  {active(path) && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1.2rem',
                        height: '1.5px',
                        background: 'rgb(34,211,238)',
                        borderRadius: 9999,
                      }}
                    />
                  )}
                </RouterLink>
              ))}

              {/* Calculator */}
              <button
                onClick={openCalc}
                style={{
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.82rem',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.55)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                Calculator
              </button>
            </nav>

            {/* RIGHT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <Search size={15} />
                <span className="hidden md:inline" style={{ fontSize: '0.78rem' }}>
                  Search…
                  <span
                    style={{
                      marginLeft: '0.4rem',
                      padding: '0.1rem 0.35rem',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 4,
                      fontSize: '0.68rem',
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {isMac ? '⌘' : 'Ctrl'} K
                  </span>
                </span>
              </button>

              {/* Currency picker */}
              <div className="relative hidden md:block" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ChevronDown size={12} style={{ transform: currencyOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                </button>

                {currencyOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: 200,
                      background: 'var(--white)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    <p
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--text-light)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      Currency
                    </p>
                    {Object.values(CURRENCIES).map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrencyCode(c.code); setCurrencyOpen(false); }}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.6rem 0.75rem',
                          fontSize: '0.82rem',
                          color: 'var(--text)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--off-white)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: '1rem', width: 20 }}>{c.flag}</span>
                        <span style={{ flex: 1 }}>{c.name}</span>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.72rem', fontFamily: 'monospace' }}>{c.symbol}</span>
                        {c.code === currency.code && <Check size={13} color="var(--accent)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign In / Avatar */}
              {user ? (
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => navigate('/account')}
                    className="md:hidden"
                    aria-label="My Account"
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent)',
                      color: 'white', fontSize: '0.75rem', fontWeight: 500,
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {initials}
                  </button>
                  <button
                    onClick={() => setAvatarOpen(o => !o)}
                    className="hidden md:flex"
                    aria-label="Account menu"
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent)',
                      color: 'white', fontSize: '0.75rem', fontWeight: 500,
                      border: 'none', cursor: 'pointer',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {initials}
                  </button>
                  {avatarOpen && (
                    <div
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: 180,
                        background: 'var(--white)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.user_metadata?.name || 'Account'}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => { setAvatarOpen(false); navigate('/account'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: 'var(--text)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--off-white)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <UserCircle2 size={14} /> My Account
                      </button>
                      <button
                        onClick={async () => { setAvatarOpen(false); await signOut(); navigate('/'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signin')}
                    className="md:hidden"
                    aria-label="Sign in"
                    style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <UserCircle2 size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="hidden md:flex"
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                  >
                    Sign In
                  </button>
                </>
              )}

              {/* Cart */}
              <button
                onClick={() => navigate('/checkout')}
                aria-label="View cart"
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: cartCount > 0 ? 'var(--accent-light)' : 'transparent',
                  borderColor: cartCount > 0 ? 'var(--accent)' : 'var(--border)',
                  color: cartCount > 0 ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: cartCount > 0 ? 500 : 300,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => {
                  if (cartCount === 0) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }
                }}
              >
                <ShoppingCart size={15} />
                <span className="hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 18, height: 18,
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: 9999,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '0 0.3rem',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="md:hidden"
                style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? 600 : 0, opacity: open ? 1 : 0 }}
        >
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">

              {/* Mobile search */}
              <button
                onClick={() => { setOpen(false); setTimeout(() => setSearchOpen(true), 200); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--off-white)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  marginBottom: '0.5rem',
                }}
              >
                <Search size={16} /> Search products…
              </button>

              {/* Nav links */}
              {NAV_ITEMS.map(({ path, label, icon: Icon }, i) => (
                <RouterLink
                  key={path}
                  to={path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    color: active(path) ? 'var(--accent)' : 'var(--text)',
                    background: active(path) ? 'var(--accent-light)' : 'transparent',
                    fontWeight: active(path) ? 500 : 300,
                    transition: 'all 0.15s',
                    transitionDelay: open ? `${i * 30}ms` : '0ms',
                  }}
                >
                  <Icon size={16} color={active(path) ? 'var(--accent)' : 'var(--text-muted)'} />
                  {label}
                </RouterLink>
              ))}

              {/* Calculator */}
              <button
                onClick={() => { setOpen(false); setTimeout(openCalc, 300); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: 'none',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Calculator size={16} color="var(--text-muted)" /> Reconstitution Calculator
              </button>

              {/* Currency row */}
              <div style={{ padding: '0.5rem 1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Currency
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {Object.values(CURRENCIES).map(c => (
                    <button
                      key={c.code}
                      onClick={() => setCurrencyCode(c.code)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: 8,
                        fontSize: '0.78rem',
                        fontWeight: 400,
                        border: `1px solid ${c.code === currency.code ? 'var(--accent)' : 'var(--border)'}`,
                        background: c.code === currency.code ? 'var(--accent-light)' : 'transparent',
                        color: c.code === currency.code ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart + auth row */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => { setOpen(false); navigate('/checkout'); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.85rem',
                    borderRadius: 12,
                    border: `1px solid ${cartCount > 0 ? 'var(--accent)' : 'var(--border)'}`,
                    background: cartCount > 0 ? 'var(--accent-light)' : 'var(--off-white)',
                    color: cartCount > 0 ? 'var(--accent)' : 'var(--text)',
                    fontSize: '0.9rem',
                    fontWeight: cartCount > 0 ? 500 : 300,
                    cursor: 'pointer',
                  }}
                >
                  <ShoppingCart size={16} />
                  View Cart
                  {cartCount > 0 && (
                    <span style={{ background: 'var(--accent)', color: 'white', fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: 9999, marginLeft: 4 }}>
                      {cartCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => { setOpen(false); navigate('/account'); }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <UserCircle2 size={15} /> My Account
                    </button>
                    <button
                      onClick={async () => { setOpen(false); await signOut(); navigate('/'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem', borderRadius: 10, border: '1px solid #fca5a5', background: 'transparent', color: '#dc2626', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setOpen(false); navigate('/signin'); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
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
