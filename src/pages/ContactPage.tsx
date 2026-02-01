import { Mail, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Contact Us</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We're here to assist with your research needs. Whether you have questions about our products,
              need technical specifications, or require support with your order, our team is ready to help.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">
                Send us a detailed inquiry and we'll respond within 24 hours
              </p>
              <a href="mailto:support@researchpeptides.com" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                support@retralabs.in
              </a>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-3">
                Quick questions and real-time support via messaging
              </p>
              <a href="https://wa.me/918217824384?text=Hello%2C%20I%20came%20across%20your%20website%20RetraLabs" className="text-green-600 hover:text-green-700 text-sm font-medium">
                +91 8217824384
              </a>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Response Time</h3>
              <p className="text-sm text-gray-600">
                We typically respond to all inquiries within 24 hours during business days
              </p>
            </div>
          </div>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
                <p className="text-gray-700">
                  Yes, we ship to most countries. Shipping times and availability may vary based on location
                  and local regulations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How are products stored and shipped?</h3>
                <p className="text-gray-700">
                  All products are stored under controlled conditions and shipped with appropriate cooling
                  measures to maintain stability during transit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get certificates of analysis?</h3>
                <p className="text-gray-700">
                  Yes, certificates of analysis are available upon request for all products. Please contact
                  us with your order details.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-bold text-amber-900 mb-2">Important Notice</h3>
            <p className="text-sm text-amber-800">
              All products are strictly for research use only. We do not provide medical advice or support
              any use outside of laboratory research environments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
