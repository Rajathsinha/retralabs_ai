import { Mail, HelpCircle, Package, Thermometer, MessageSquare, Clock } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    {
      question: 'What are the shipping timelines?',
      answer:
        'Orders are typically processed within 1-2 business days. Shipping times vary by location: 3-5 business days for metro cities, 5-7 business days for other locations. You will receive tracking information once your order ships.',
    },
    {
      question: 'How should I store these peptides?',
      answer:
        'All peptides should be stored at -20°C or below immediately upon receipt. Once reconstituted, store at 2-8°C and use within the timeframe specified in the product documentation. Avoid repeated freeze-thaw cycles.',
    },
    {
      question: 'Are these products approved for human use?',
      answer:
        'No. All products are strictly for in vitro research and analytical purposes only. They are not approved for human consumption, therapeutic use, or veterinary applications. Purchasers must comply with all applicable regulations.',
    },
    {
      question: 'What documentation is provided with each order?',
      answer:
        'Each order includes a Certificate of Analysis (CoA) showing purity testing results, batch number, storage instructions, and reconstitution guidelines. Additional technical documentation is available upon request.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'Due to the nature of these products and storage requirements, we cannot accept returns once shipped. However, if you receive damaged products or incorrect items, please contact us within 48 hours with photographic evidence.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Currently, we only ship within India. International shipping may be available in the future subject to regulatory compliance.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Support</h1>
        <p className="text-gray-600 max-w-2xl mb-12">
          Find answers to common questions or get in touch with our team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <Mail className="w-8 h-8 text-blue-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              Our team typically responds within 24 hours.
            </p>
            <a
              href="mailto:support@retralabs.in"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              support@retralabs.in
            </a>
          </div>

          <div className="border border-gray-200 p-6 hover:border-green-300 transition-colors bg-gradient-to-br from-green-50 to-white">
            <MessageSquare className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Support</h3>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-green-600" />
              <p className="text-sm font-semibold text-green-700">
                9AM-6PM • SLA: 1 Hour
              </p>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Outside hours: Response depends on agent availability
            </p>
            <a
              href="https://wa.me/918217824384?text=Hello%2C%20I%20need%20support%20with%20RetraLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-bold inline-flex items-center gap-1"
            >
              +91 8217824384
            </a>
          </div>

          <div className="border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <Package className="w-8 h-8 text-blue-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Status</h3>
            <p className="text-gray-600 mb-4">
              Track your order or inquire about delivery.
            </p>
            <p className="text-sm text-gray-500">
              Email us with your order number for updates.
            </p>
          </div>

          <div className="border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <Thermometer className="w-8 h-8 text-blue-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Technical Support
            </h3>
            <p className="text-gray-600 mb-4">
              Questions about storage, handling, or protocols.
            </p>
            <p className="text-sm text-gray-500">
              Contact our scientific team for assistance.
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-blue-700" />
            <h2 className="text-3xl font-light text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 bg-blue-50 border border-blue-100">
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Research Use Disclaimer
          </h3>
          <p className="text-gray-700 leading-relaxed">
            All products sold by RetraLabs are intended solely for in vitro research
            and analytical purposes. These materials are not approved for human or
            animal consumption, therapeutic applications, or any clinical use.
            Purchasers must be affiliated with recognized research institutions or
            laboratories and must comply with all applicable local, state, and federal
            regulations. By purchasing these products, you acknowledge that you are a
            qualified research professional and will use these materials in accordance
            with proper laboratory safety protocols.
          </p>
        </div>
      </section>
    </div>
  );
}
