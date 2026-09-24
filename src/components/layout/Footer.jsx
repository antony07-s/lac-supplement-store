import { Link } from 'react-router-dom'
import ayusydahLogo from '../../assets/ayusydah-logo.jpeg'

const columns = [
  ['Shop', [['Herbal Supplements', '/category/Herbal%20Supplements'], ['Ayurvedic Wellness', '/category/Ayurvedic%20Wellness'], ['Juices', '/category/Juices'], ['Skin & Hair Care', '/category/Skin%20%26%20Hair%20Care'], ['Brands', '/category/Brands']]],
  ['Customer Care', [['Contact Us', '/contact-us'], ['Track Order', '/track-order'], ['My Orders', '/my-orders'], ['FAQ', '/faq']]],
  ['About AYUSYDAH', [['Our Story', '/about-us'], ['Careers', '/careers'], ['Site Map', '/site-map']]],
  ['Legal', [['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms'], ['Refund Policy', '/refund-policy'], ['Delivery & Shipping', '/shipping-policy']]],
]

function Footer() {
  return <footer className="bg-brand-blue-dark text-white">
    <div className="page-shell grid gap-9 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
      <div><img src={ayusydahLogo} alt="AYUSYDAH" className="h-16 w-16 rounded-full object-contain" /><p className="mt-4 max-w-52 text-sm leading-6 text-white/75">Natural wellness for a healthier, happier you.</p></div>
      {columns.map(([title, links]) => <div key={title}><h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-brand-gold-light">{title}</h2><ul className="space-y-2.5 text-sm text-white/75">{links.map(([label, to]) => <li key={label}><Link className="hover:text-brand-gold-light" to={to}>{label}</Link></li>)}</ul></div>)}
      <div><h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-brand-gold-light">Secure payments</h2><span className="rounded bg-white px-2 py-1 text-[10px] font-extrabold text-brand-blue-dark">PayPal</span><p className="mt-4 text-xs leading-5 text-white/60">Payments are processed securely by PayPal. Available methods are shown during checkout.</p></div>
    </div>
    <div className="border-t border-white/15"><div className="page-shell flex flex-wrap justify-between gap-3 py-5 text-xs text-white/60"><span>© {new Date().getFullYear()} AYUSYDAH. All rights reserved.</span><span className="font-serif italic">A Healthier You, A Brighter Tomorrow</span></div></div>
  </footer>
}

export default Footer
