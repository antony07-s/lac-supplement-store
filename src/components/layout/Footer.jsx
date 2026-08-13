import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';

const linkRoutes = {
  'About Us': '/about-us',
  'Terms & Conditions': '/terms',
  'Privacy Policy': '/privacy-policy',
  FAQ: '/faq',
  Careers: '/careers',
  'Site Map': '/site-map',
  'Contact Us': '/contact-us',
  'My Wishlist': '/wishlist',
  'My Orders': '/my-orders',
  'Track My Orders': '/track-order',
};

const footerColumns = [
  {
    title: 'Company',
    links: [
      'About Us',
      'Terms & Conditions',
      'Privacy Policy',
      'FAQ',
      'Careers',
      'Site Map',
    ],
  },
  {
    title: 'Account',
    links: ['My Orders', 'My Wishlist', 'Track My Orders'],
  },
  {
    title: 'Loyalty Program',
    links: ['VIP Club Privileges', 'Apply Now'],
  },
  {
    title: 'Customer Service',
    links: [
      'Store Locator',
      'Shipping Information',
      'Return & Refund Policy',
      'Contact Us',
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="page-shell py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-sm font-semibold uppercase text-white">
                {col.title}
              </h2>

              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to={linkRoutes[link] || '/'}
                      className="cursor-pointer hover:text-brand-gold"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase text-white">
              Follow Us
            </h2>

            <div className="mb-6 flex gap-3">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="hover:text-brand-gold"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="#youtube"
                aria-label="YouTube"
                className="hover:text-brand-gold"
              >
                <FaYoutube size={20} />
              </a>

              <a
                href="#instagram"
                aria-label="Instagram"
                className="hover:text-brand-gold"
              >
                <FaInstagram size={20} />
              </a>
            </div>

            <h2 className="mb-3 text-sm font-semibold uppercase text-white">
              Payment Methods
            </h2>

            <div className="flex flex-wrap gap-2">
              {['VISA', 'Mastercard', 'PayPal', 'FPX'].map((method) => (
                <span
                  key={method}
                  className="rounded bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ayusydah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
