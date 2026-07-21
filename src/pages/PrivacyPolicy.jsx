import StaticPageLayout from '../components/layout/StaticPageLayout.jsx'

function PrivacyPolicy() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.</p>
      <h3 className="font-semibold text-gray-800 pt-2">Information We Collect</h3>
      <p>We may collect your name, email address, shipping address, and order history when you create an account or make a purchase.</p>
      <h3 className="font-semibold text-gray-800 pt-2">How We Use It</h3>
      <p>Your information is used to process orders, provide customer support, and — with your consent — send updates about new products and promotions.</p>
      <h3 className="font-semibold text-gray-800 pt-2">Data Security</h3>
      <p>We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.</p>
    </StaticPageLayout>
  )
}

export default PrivacyPolicy