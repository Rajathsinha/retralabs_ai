import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import SupportPage from './pages/SupportPage';
import ReviewsPage from './pages/ReviewsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
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

type Page = 'home' | 'catalogue' | 'product' | 'checkout' | 'support' | 'reviews' | 'payment-success' | 'payment-failed' | 'track-order' | 'about' | 'contact' | 'privacy' | 'terms' | 'refund';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('orderId')) {
      if (window.location.pathname.includes('payment-success')) {
        setCurrentPage('payment-success');
      } else if (window.location.pathname.includes('payment-failed')) {
        setCurrentPage('payment-failed');
      }
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalogue':
        return <CataloguePage onNavigate={handleNavigate} />;
      case 'product':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <CataloguePage onNavigate={handleNavigate} />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'support':
        return <SupportPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'payment-success':
        return <PaymentSuccessPage onNavigate={handleNavigate} />;
      case 'payment-failed':
        return <PaymentFailedPage onNavigate={handleNavigate} />;
      case 'track-order':
        return <OrderTrackingPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'refund':
        return <RefundPolicyPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main className="flex-1">
            <PageTransition pageKey={currentPage}>
              {renderPage()}
            </PageTransition>
          </main>
          <Footer onNavigate={handleNavigate} />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
