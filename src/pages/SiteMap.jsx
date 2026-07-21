import { Link } from 'react-router-dom'

const links = [
    { label: 'Home', to: '/' },
    { label: 'Vitamins & Supplements', to: '/category/Vitamins%20%26%20Supplements' },
    { label: 'Protein & Fitness', to: '/category/Protein%20%26%20Fitness' },
    { label: 'Beauty & Slimming', to: '/category/Beauty%20%26%20Slimming' },
    { label: 'Food', to: '/category/Food' },
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
