import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navDropdowns } from '../../data/navData.js'

const navItems = [
    'Brands',
    'Vitamins & Supplements',
    'Protein & Fitness',
    'Beauty & Slimming',
    'Food',
    'Promotions',
    'Health Guide',
]

function Header() {
    const [openItem, setOpenItem] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4 md:py-5">
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <span className="text-2xl md:text-3xl font-bold text-brand-blue">
                    YourBrand
                </span>

                <div className="hidden md:block flex-1 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search for products, health concerns and brands"
                        className="w-full border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-brand-blue"
                    />
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <button className="hidden md:flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-blue">
                        <User size={22} />
                        <span>Register | Login</span>
                    </button>

                    <button className="hidden md:block text-gray-700 hover:text-brand-blue">
                        <Heart size={22} />
                    </button>

                    <button className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-blue">
                        <span className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                0
                            </span>
                        </span>
                        <span className="hidden md:inline">Cart</span>
                    </button>
                </div>
            </div>

            {/* Desktop nav row */}
            <nav className="hidden md:block px-8 pb-4 bg-gray-50">
                <ul className="flex items-center gap-10 text-base font-semibold text-gray-800 pt-3 whitespace-nowrap">
                    {navItems.map((item) => (
                        <li
                            key={item}
                            onMouseEnter={() => setOpenItem(item)}
                            onMouseLeave={() => setOpenItem(null)}
                            className={`hover:text-brand-blue cursor-pointer relative pb-2 border-b-2 shrink-0 ${
                                openItem === item ? 'border-brand-blue text-brand-blue' : 'border-transparent'
                            }`}
                        >
                            {item}

                            {openItem === item && navDropdowns[item] && (
                                <div className="absolute top-full left-0 pt-3 w-[720px] z-50">
                                    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6">
                                        <div className="flex gap-6 mb-4 pb-4 border-b border-gray-200">
                                            {navDropdowns[item].featured.map((f) => (
                                                <div key={f.label} className="text-center text-xs font-semibold text-gray-700 w-20">
                                                    <img
                                                        src={f.img}
                                                        alt={f.label}
                                                        loading="lazy"
                                                        className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                                                    />
                                                    {f.label}
                                                </div>
                                            ))}
                                        </div>
                                        <ul className="grid grid-cols-4 gap-y-2 gap-x-6 text-sm text-brand-blue whitespace-nowrap">
                                            {navDropdowns[item].links.map((link) => (
                                                <li key={link} className="hover:underline cursor-pointer">
                                                    {link}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                                            <span className="text-sm text-brand-blue font-semibold hover:underline cursor-pointer">
                                                View All
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm mb-3 focus:outline-none focus:border-brand-blue"
                    />
                    <ul className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
                        {navItems.map((item) => (
                            <li key={item} className="py-3 border-b border-gray-100">
                                {item}
                            </li>
                        ))}
                        <li className="py-3 flex items-center gap-2">
                            <User size={18} /> Register | Login
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    )
}

export default Header