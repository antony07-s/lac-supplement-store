import StaticPageLayout from '../components/layout/StaticPageLayout.jsx'

function PrivacyPolicy() {
  return <StaticPageLayout title="Privacy Policy">
    <p className="text-sm text-stone-500">Last updated: September 22, 2026</p>
    <p>Sapphire Agro Foods (operating Ayusydah.com) respects your privacy and is committed to protecting your personal data in accordance with Malaysia&apos;s Personal Data Protection Act 2010 (PDPA).</p>
    {/* // TODO: needs DPDP Act 2023 language, do not auto-replace legal wording */}
    <h3 className="font-semibold text-gray-800 pt-2">1. Information We Collect</h3><p>When you use our website or place an order, we may collect: name, email address, phone number, delivery address, and payment-related information (processed securely via our payment gateway partners — we do not store your card or bank details).</p>
    <h3 className="font-semibold text-gray-800 pt-2">2. How We Use Your Information</h3><p>We use your information to:</p><ul className="list-disc space-y-1 pl-5"><li>Process and deliver your orders</li><li>Communicate with you regarding your order or enquiries</li><li>Improve our website and customer experience</li><li>Send promotional updates, where you have opted in</li></ul>
    <h3 className="font-semibold text-gray-800 pt-2">3. Payment Security</h3><p>All payments are processed through secure, PCI-compliant third-party payment gateways (such as PayPal and Razorpay). We do not store your full card or bank account details on our servers.</p>
    <h3 className="font-semibold text-gray-800 pt-2">4. Data Sharing</h3><p>We do not sell or rent your personal data to third parties. Your data may be shared with delivery/courier partners and payment processors solely to fulfil your order.</p>
    <h3 className="font-semibold text-gray-800 pt-2">5. Data Retention</h3><p>We retain your personal data only as long as necessary to fulfil the purposes outlined in this policy or as required by law.</p>
    <h3 className="font-semibold text-gray-800 pt-2">6. Your Rights</h3><p>You may request to access, correct, or delete your personal data by contacting us at lsmu@hotmail.com.</p>
    <h3 className="font-semibold text-gray-800 pt-2">7. Cookies</h3><p>Our website may use cookies to improve your browsing experience. You can disable cookies through your browser settings.</p>
    <h3 className="font-semibold text-gray-800 pt-2">8. Contact</h3><p>For privacy-related questions, contact us at lsmu@hotmail.com or +91 7626 863977.</p>
  </StaticPageLayout>
}

export default PrivacyPolicy
