import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
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
    window.scrollTo(0, 0);
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
        return <HomePage onNavigate={setCurrentPage} />;
      case 'catalogue':
        return <CataloguePage onNavigate={handleNavigate} />;
      case 'product':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={setCurrentPage} />
        ) : (
          <CataloguePage onNavigate={handleNavigate} />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={setCurrentPage} />;
      case 'support':
        return <SupportPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'payment-success':
        return <PaymentSuccessPage onNavigate={setCurrentPage} />;
      case 'payment-failed':
        return <PaymentFailedPage onNavigate={setCurrentPage} />;
      case 'track-order':
        return <OrderTrackingPage onNavigate={setCurrentPage} />;
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
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="flex-1">{renderPage()}</main>
        <Footer onNavigate={setCurrentPage} />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
