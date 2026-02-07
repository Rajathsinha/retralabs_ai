import { useState, useEffect } from 'react';
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
  );
}

export default App;
