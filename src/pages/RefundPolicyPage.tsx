export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: February 1, 2026</p>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to providing high-quality research materials. This policy outlines the terms
              and conditions for order cancellations, returns, and refunds. Due to the sensitive nature of
              our products, certain restrictions apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Cancellation</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Before Shipment</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You may cancel your order before it has been shipped. To request a cancellation:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Contact us immediately at support@researchpeptides.com</li>
                  <li>Provide your order number and reason for cancellation</li>
                  <li>Cancellation requests are processed within 24 hours</li>
                  <li>Full refund will be issued if cancellation is approved before shipment</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">After Shipment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once an order has been shipped, it cannot be cancelled. However, you may be eligible for a
                  return and refund according to our return policy below.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <p className="text-blue-900 font-semibold mb-2">Eligibility for Returns</p>
              <p className="text-blue-800 leading-relaxed">
                Due to the nature of our products, returns are only accepted in the following circumstances:
              </p>
            </div>

            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Product arrived damaged or compromised during shipping</li>
              <li>Wrong product was shipped</li>
              <li>Product defect or quality issue verified by our team</li>
              <li>Package tampering or seal broken upon arrival</li>
            </ul>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Products cannot be returned if the seal has been broken by the
                customer, if storage conditions were not maintained, or for change of mind.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To initiate a return, follow these steps:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
              <li>
                <strong>Contact us within 48 hours</strong> of receiving the product at
                support@retralabs.in
              </li>
              <li>
                <strong>Provide documentation:</strong> Order number, photos of the product and packaging,
                and detailed description of the issue
              </li>
              <li>
                <strong>Wait for approval:</strong> Our team will review your request within 2-3 business days
              </li>
              <li>
                <strong>Return shipping:</strong> If approved, we will provide return shipping instructions
              </li>
              <li>
                <strong>Product inspection:</strong> Returned products will be inspected upon receipt
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Processing Time</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Approved refunds are processed within 7-10 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Bank processing may take an additional 5-7 business days</li>
                  <li>You will receive an email confirmation once the refund is processed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Amount</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Depending on the circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>Full refund:</strong> For damaged, wrong, or defective products</li>
                  <li><strong>Partial refund:</strong> May apply if product packaging is partially damaged but product is intact</li>
                  <li><strong>Store credit:</strong> May be offered as an alternative to refund</li>
                  <li><strong>Shipping costs:</strong> Original shipping fees are non-refundable unless the error was on our part</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Refundable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The following are not eligible for refund or return:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Products with broken seals (opened by customer)</li>
              <li>Products damaged due to improper storage by customer</li>
              <li>Products past the return window (48 hours from delivery)</li>
              <li>Products without proof of purchase</li>
              <li>Products used or altered in any way</li>
              <li>Special order or custom products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Damage</h2>
            <p className="text-gray-700 leading-relaxed">
              If your order arrives damaged, please document the damage with photos before opening the
              package. Contact us immediately with photos of both the outer packaging and the product.
              We will work with the shipping carrier to resolve the issue and provide a replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Guarantee</h2>
            <p className="text-gray-700 leading-relaxed">
              All our products undergo quality testing and come with certificates of analysis. If you
              receive a product that does not meet stated specifications, we will provide a full refund
              or replacement upon verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Replacement Products</h2>
            <p className="text-gray-700 leading-relaxed">
              In cases of damaged or defective products, we may offer a replacement instead of a refund.
              Replacements are subject to product availability and will be shipped at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact for Refunds & Cancellations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For any questions or to initiate a return/refund:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 font-medium">Email: support@retralabs.in</p>
              <p className="text-sm text-gray-600 mt-2">
                Please include your order number and detailed description of the issue
              </p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-amber-900 font-semibold mb-2">Important Reminder</p>
              <p className="text-amber-800 leading-relaxed">
                All products are for research use only. Refunds or returns cannot be processed for products
                that have been used for purposes other than legitimate research. By purchasing, you agree to
                this policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
