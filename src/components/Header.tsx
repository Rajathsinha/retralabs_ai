import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Badge,
  Tooltip,
} from '@heroui/react';
import {
  ShoppingCart,
  Calculator,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <ReconstitutionCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="xl"
        isBordered
        classNames={{
          base: 'bg-white/95 backdrop-blur-lg',
          wrapper: 'px-4 sm:px-6',
        }}
      >
        <NavbarContent justify="start">
          <NavbarBrand
            className="cursor-pointer"
            onClick={() => handleNav('home')}
          >
            <Logo size="md" />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex gap-1" justify="center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <NavbarItem key={item.key} isActive={isActive}>
                <Button
                  variant={isActive ? 'flat' : 'light'}
                  color={isActive ? 'primary' : 'default'}
                  size="sm"
                  startContent={<Icon className="w-4 h-4" />}
                  onPress={() => handleNav(item.key)}
                  className="font-medium"
                >
                  {item.label}
                </Button>
              </NavbarItem>
            );
          })}
          <NavbarItem>
            <Button
              variant="light"
              size="sm"
              startContent={<Calculator className="w-4 h-4" />}
              onPress={() => setShowCalculator(true)}
              className="font-medium"
            >
              Calculator
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Tooltip content="View Cart" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                aria-label="Cart"
                onPress={() => handleNav('checkout')}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Tooltip>
          </NavbarItem>
          <NavbarMenuToggle className="md:hidden" />
        </NavbarContent>

        <NavbarMenu className="pt-6 gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <NavbarMenuItem key={item.key}>
                <Button
                  fullWidth
                  variant={isActive ? 'flat' : 'light'}
                  color={isActive ? 'primary' : 'default'}
                  startContent={<Icon className="w-5 h-5" />}
                  onPress={() => handleNav(item.key)}
                  className="justify-start font-medium text-base h-12"
                  size="lg"
                >
                  {item.label}
                </Button>
              </NavbarMenuItem>
            );
          })}
          <NavbarMenuItem>
            <Button
              fullWidth
              variant="light"
              startContent={<Calculator className="w-5 h-5" />}
              onPress={() => {
                setIsMenuOpen(false);
                setTimeout(() => setShowCalculator(true), 300);
              }}
              className="justify-start font-medium text-base h-12"
              size="lg"
            >
              Calculator
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className="mt-4">
            <Button
              fullWidth
              color="primary"
              variant="solid"
              startContent={<ShoppingCart className="w-5 h-5" />}
              onPress={() => handleNav('checkout')}
              size="lg"
              className="font-semibold"
            >
              View Cart
              {cartItemCount > 0 && (
                <Badge content={cartItemCount} color="secondary" size="sm" />
              )}
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  );
}
