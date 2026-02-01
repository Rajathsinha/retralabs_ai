import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onNavigate('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="md" />
          </button>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalogue')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'catalogue'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => onNavigate('track-order')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'track-order'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Track Order
            </button>
            {/* Reviews temporarily hidden
            <button
              onClick={() => onNavigate('reviews')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'reviews'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
            */}
            <button
              onClick={() => onNavigate('support')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'support'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Support
            </button>
          </nav>

          <button
            onClick={() => onNavigate('checkout')}
            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
