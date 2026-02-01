import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-gray-600">
              Research peptides for laboratory and educational use only.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-gray-900 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-gray-900 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-gray-900 transition-colors">
                  Support
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="hover:text-gray-900 transition-colors">
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Contact</h4>
            <p className="text-sm text-gray-600">support@retralabs.in</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2024 RetraLabs. All rights reserved.</p>
            <p className="mt-4 md:mt-0">
              <strong>Research Use Disclaimer:</strong> All products are for research purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
