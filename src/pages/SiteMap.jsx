import { Link } from 'react-router-dom'

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
        <main className="page-shell section-space max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Site Map</h1>
            <ul className="grid grid-cols-2 gap-3">
                {links.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to} className="text-brand-blue hover:underline text-sm">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default SiteMap
