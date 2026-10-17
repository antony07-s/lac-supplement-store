import { Link } from 'react-router-dom'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'

const links = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/products' },
    { label: 'Herbal Supplements', to: '/category/Herbal%20Supplements' },
    { label: 'Ayurvedic Wellness', to: '/category/Ayurvedic%20Wellness' },
    { label: 'Juices', to: '/category/Juices' },
    { label: 'Skin & Hair Care', to: '/category/Skin%20%26%20Hair%20Care' },
    { label: 'Brands', to: '/category/Brands' },
    { label: 'Cart', to: '/cart' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'About Us', to: '/about-us' },
    { label: 'Contact Us', to: '/contact-us' },
]

function SiteMap() {
    return (
        <main className="page-shell section-space max-w-4xl">
            <Link to="/" className="mb-7 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-blue"><ChevronLeft size={17} /> Back to Home</Link>
            <header className="mb-8"><p className="eyebrow mb-2">Find your way around</p><h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Site Map</h1></header>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to} className="group flex min-h-14 items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/30 hover:text-brand-blue hover:shadow-md">
                            {link.label}<ArrowUpRight size={16} className="text-stone-400 transition group-hover:text-brand-blue" />
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default SiteMap
