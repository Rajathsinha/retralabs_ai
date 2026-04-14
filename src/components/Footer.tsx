import { Divider, Chip, Link } from '@heroui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Mail, ArrowUpRight, MessageCircle, ShieldCheck, Globe, FileCheck, FlaskConical } from 'lucide-react';
import Logo from './Logo';
import { WHATSAPP_NUMBER } from '../constants/config';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'COA Verified', color: 'text-emerald-400', chipColor: 'success' as const },
  { icon: Globe, label: 'GMP Sourced', color: 'text-accent-400', chipColor: 'warning' as const },
  { icon: FileCheck, label: 'HPLC Tested', color: 'text-blue-400', chipColor: 'primary' as const },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/support', label: 'Support' },
  { to: '/catalogue', label: 'Products' },
  { to: '/reviews', label: 'Reviews' },
];

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/refund', label: 'Refund Policy' },
];

const WA_DEFAULT = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I have a question about RetraLabs products.')}`;

function FooterLink({ href, children, external = false }: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    'text-sm text-slate-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
      </a>
    );
  }

  return (
    <RouterLink to={href} className={cls}>
      {children}
      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
    </RouterLink>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">

      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <Chip
                  key={badge.label}
                  variant="flat"
                  color={badge.chipColor}
                  size="sm"
                  startContent={<Icon className={`w-3.5 h-3.5 ${badge.color} ml-1`} />}
                  classNames={{
                    base: 'bg-white/5 border border-white/10 px-3 py-4',
                    content: 'text-slate-400 text-xs font-medium',
                  }}
                >
                  {badge.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-5">
              <Logo size="sm" variant="light" />
            </div>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              India's trusted research peptide supplier. HPLC-verified, COA-backed compounds sourced
              directly from GMP-certified manufacturers.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="mailto:support@retralabs.in"
                className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@retralabs.in
              </Link>
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}>
                  <FooterLink href={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <FooterLink href={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/track-order">Track Order</FooterLink>
              </li>
              <li>
                <FooterLink href={WA_DEFAULT} external>
                  WhatsApp Support
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="bg-slate-800/50 mb-8" />

        {/* Bottom Bar */}
        <div className="pr-20 md:pr-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} RetraLabs. All rights reserved.</p>
            <p className="text-center md:text-right">
              Research Use Disclaimer: All products are for laboratory research purposes only. Not for human use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
