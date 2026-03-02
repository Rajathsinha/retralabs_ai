import { Link, Divider } from '@heroui/react';
import { Mail } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const COMPANY_LINKS = [
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact Us' },
  { key: 'support', label: 'Support' },
  { key: 'catalogue', label: 'Products' },
];

const LEGAL_LINKS = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'refund', label: 'Refund Policy' },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="mb-5">
              <Logo size="sm" variant="light" />
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Research peptides for laboratory and educational use only. Sourced directly from verified manufacturers.
            </p>
            <Link
              href="mailto:support@retralabs.in"
              color="secondary"
              className="inline-flex items-center gap-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              support@retralabs.in
            </Link>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">COMPANY</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    as="button"
                    color="foreground"
                    onPress={() => onNavigate(link.key)}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">LEGAL</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    as="button"
                    color="foreground"
                    onPress={() => onNavigate(link.key)}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  as="button"
                  color="foreground"
                  onPress={() => onNavigate('track-order')}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/918217824384"
                  isExternal
                  color="foreground"
                  className="text-sm text-slate-400 hover:text-white"
                >
                  WhatsApp Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="bg-slate-800/50" />

        <div className="pt-8 pr-20 md:pr-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} RetraLabs. All rights reserved.</p>
            <p className="text-center md:text-right">Research Use Disclaimer: All products are for research purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
