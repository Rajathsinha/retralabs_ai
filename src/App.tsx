import { Component, ReactNode, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ReviewsPage from './pages/ReviewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountPage from './pages/AccountPage';

// ─── Error Boundary ───────────────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean; error?: Error }
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('App error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-slate-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Scroll to top on route change ───────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// ─── Auth Callback Handler ────────────────────────────────────────────────────
// Safety net: if a Supabase auth email link deposits tokens on a page other
// than /reset-password (e.g. site URL is misconfigured in the Supabase dashboard),
// we detect the hash fragment here and redirect to the correct page.
function AuthCallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    // Password recovery token landed on the wrong page — redirect to /reset-password
    if (
      hash.includes('type=recovery') &&
      !window.location.pathname.includes('/reset-password')
    ) {
      navigate('/reset-password', { replace: true });
      return;
    }

    // Email verification / magic-link: after SIGNED_IN fires, redirect to /account
    // We listen once; Supabase will fire SIGNED_IN when the hash is processed.
    if (hash.includes('type=signup') || hash.includes('type=magiclink')) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/account', { replace: true });
          subscription.unsubscribe();
        }
      });
      return () => subscription.unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

// ─── Animated page wrapper ────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.22, ease: 'easeIn' } },
};

function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// ─── Root layout with AnimatePresence ────────────────────────────────────────
function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* AnimatePresence enables exit animations when route changes */}
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation();
  return (
    <ErrorBoundary>
      <CartProvider>
        <ScrollToTop />
        {/* Handles Supabase auth hash tokens that land on the wrong page */}
        <AuthCallbackHandler />
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route path="/"               element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/catalogue"      element={<AnimatedPage><CataloguePage /></AnimatedPage>} />
            <Route path="/product/:id"    element={<AnimatedPage><ProductDetailPage /></AnimatedPage>} />
            <Route path="/checkout"       element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
            <Route path="/reviews"        element={<AnimatedPage><ReviewsPage /></AnimatedPage>} />
            <Route path="/about"          element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="/contact"        element={<AnimatedPage><ContactPage /></AnimatedPage>} />
            <Route path="/support"        element={<AnimatedPage><SupportPage /></AnimatedPage>} />
            <Route path="/track-order"    element={<AnimatedPage><OrderTrackingPage /></AnimatedPage>} />
            <Route path="/payment-success" element={<AnimatedPage><PaymentSuccessPage /></AnimatedPage>} />
            <Route path="/payment-failed"  element={<AnimatedPage><PaymentFailedPage /></AnimatedPage>} />
            <Route path="/privacy"        element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
            <Route path="/terms"          element={<AnimatedPage><TermsPage /></AnimatedPage>} />
            <Route path="/refund"         element={<AnimatedPage><RefundPolicyPage /></AnimatedPage>} />
            <Route path="/signin"         element={<AnimatedPage><SignInPage /></AnimatedPage>} />
            <Route path="/register"       element={<AnimatedPage><SignUpPage /></AnimatedPage>} />
            <Route path="/forgot-password" element={<AnimatedPage><ForgotPasswordPage /></AnimatedPage>} />
            {/* Handles password reset links: /reset-password#access_token=...&type=recovery */}
            <Route path="/reset-password" element={<AnimatedPage><ResetPasswordPage /></AnimatedPage>} />
            <Route path="/account"        element={<AnimatedPage><ProtectedRoute><AccountPage /></ProtectedRoute></AnimatedPage>} />
          </Route>
        </Routes>
      </CartProvider>
    </ErrorBoundary>
  );
}
