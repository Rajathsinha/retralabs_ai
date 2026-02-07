import { Mail, ArrowUpRight } from 'lucide-react';
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
              <Logo size="sm" />
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Research peptides for laboratory and educational use only. Sourced directly from verified manufacturers.
            </p>
            <a
              href="mailto:support@retralabs.in"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@retralabs.in
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate(link.key)}
                    className="text-sm hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate(link.key)}
                    className="text-sm hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  Track Order
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/918217824384"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} RetraLabs. All rights reserved.</p>
            <p>Research Use Disclaimer: All products are for research purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
