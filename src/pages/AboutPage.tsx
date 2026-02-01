export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">About Us</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              We are a specialized supplier of research-grade peptides and compounds, dedicated to supporting
              scientific research and development. Our mission is to provide researchers and institutions with
              access to high-quality, laboratory-grade materials for their studies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We maintain the highest standards of quality and purity in all our products. Each batch is:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Independently verified for purity and composition</li>
              <li>Stored under optimal conditions to maintain stability</li>
              <li>Shipped with proper documentation and handling instructions</li>
              <li>Backed by certificates of analysis upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Use Only</h2>
            <p className="text-gray-700 leading-relaxed">
              All products sold through our platform are strictly for research purposes only. They are not
              intended for human consumption, medical use, or any application outside of controlled laboratory
              environments. We serve the scientific community with materials that support advancement in
              biochemical research and development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Assurance</h2>
            <p className="text-gray-700 leading-relaxed">
              We work exclusively with certified manufacturers and suppliers who adhere to strict quality
              control protocols. Our products undergo rigorous testing to ensure they meet or exceed industry
              standards for research-grade materials.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
