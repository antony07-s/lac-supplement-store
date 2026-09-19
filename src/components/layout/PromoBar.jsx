import { Link } from 'react-router-dom'
import { HelpCircle, PackageCheck, Truck } from 'lucide-react'

// The compact utility bar mirrors the reference storefront's service links.
function PromoBar() {
  return <div className="bg-brand-blue-dark text-white"><div className="page-shell flex min-h-8 flex-wrap items-center justify-between gap-x-5 gap-y-1 py-1.5 text-[10px] sm:text-xs"><span className="font-semibold">Natural Wellness for a Healthier, Happier You</span><div className="flex items-center gap-3 sm:gap-5"><span className="hidden items-center gap-1 sm:flex"><Truck size={12} />Delivering Across Malaysia</span><Link className="flex items-center gap-1 hover:text-brand-gold" to="/faq"><HelpCircle size={12} />Help</Link><Link className="flex items-center gap-1 hover:text-brand-gold" to="/track-order"><PackageCheck size={12} />Track Order</Link><Link className="hover:text-brand-gold" to="/my-orders">My Account</Link></div></div></div>
}
export default PromoBar
