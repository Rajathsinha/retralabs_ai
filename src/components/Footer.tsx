import { Link as RouterLink } from 'react-router-dom';
import { Mail, ArrowUpRight, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const COMPANY_LINKS = [
  { to: '/about',     label: 'About Us' },
  { to: '/contact',   label: 'Contact Us' },
  { to: '/support',   label: 'Support' },
  { to: '/catalogue', label: 'Products' },
  { to: '/reviews',   label: 'Reviews' },
];

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms',   label: 'Terms & Conditions' },
  { to: '/refund',  label: 'Refund Policy' },
];

const PHONE      = '918217824384';
const WA_DEFAULT = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hi, I have a question about RetraLabs products.')}`;

const linkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.82rem',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.2s',
  lineHeight: 1.4,
};

const headingStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text)',
  marginBottom: '1.25rem',
};

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--off-white)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        fontFamily: "'Outfit', system-ui, sans-serif",
        fontWeight: 300,
      }}
    >
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem' }}
             className="grid-cols-1 md:grid-cols-4">

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo size="sm" variant="light" />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: 260 }}>
              India's trusted research peptide supplier. HPLC-verified, COA-backed compounds sourced
              directly from GMP-certified manufacturers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="mailto:support@retralabs.in"
                style={{ ...linkStyle, color: 'var(--accent)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent)')}
              >
                <Mail size={14} />
                support@retralabs.in
              </a>
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, color: 'var(--accent)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent)')}
              >
                <MessageCircle size={14} />
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Company column */}
          <div>
            <p style={headingStyle}>Company</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {COMPANY_LINKS.map(link => (
                <li key={link.to}>
                  <RouterLink
                    to={link.to}
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <p style={headingStyle}>Legal</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {LEGAL_LINKS.map(link => (
                <li key={link.to}>
                  <RouterLink
                    to={link.to}
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p style={headingStyle}>Quick Links</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <RouterLink
                  to="/track-order"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Track Order
                </RouterLink>
              </li>
              <li>
                <a
                  href="https://www.trustpilot.com/review/retralabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Trustpilot Reviews <ArrowUpRight size={11} />
                </a>
              </li>
              <li>
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  WhatsApp Support <ArrowUpRight size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="md:flex-row md:justify-between md:items-center">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              &copy; {new Date().getFullYear()} RetraLabs. All rights reserved.
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: 480, lineHeight: 1.5 }}>
              Research Use Disclaimer: All products are for in vitro research purposes only. Not for human or veterinary use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
