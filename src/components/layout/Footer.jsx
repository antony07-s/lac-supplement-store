import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'

const footerColumns = [
    {
        title: 'Company',
        links: ['About Us', 'Terms & Conditions', 'Privacy Policy', 'FAQ', 'Careers', 'Site Map'],
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
        links: ['Store Locator', 'Shipping Information', 'Return & Refund Policy', 'Contact Us'],
    },
]

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {footerColumns.map((col) => (
                    <div key={col.title}>
                        <h4 className="text-white font-semibold text-sm uppercase mb-4">
                            {col.title}
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {col.links.map((link) => (
                                <li key={link} className="hover:text-brand-gold cursor-pointer">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h4 className="text-white font-semibold text-sm uppercase mb-4">
                        Follow Us
                    </h4>
                    <div className="flex gap-3 mb-6">
                        <FaFacebook size={20} className="hover:text-brand-gold cursor-pointer" />
                        <FaYoutube size={20} className="hover:text-brand-gold cursor-pointer" />
                        <FaInstagram size={20} className="hover:text-brand-gold cursor-pointer" />
                    </div>

                    <h4 className="text-white font-semibold text-sm uppercase mb-3">
                        Payment Methods
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-white text-gray-800 px-2 py-1 rounded">VISA</span>
                        <span className="bg-white text-gray-800 px-2 py-1 rounded">Mastercard</span>
                        <span className="bg-white text-gray-800 px-2 py-1 rounded">PayPal</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Ayusydah. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer