import { User, Heart, ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { navigationItems } from '../../data/navData.js'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import ayusydahLogo from '../../assets/ayusydah-logo.jpeg'
import { trackEvent } from '../../utils/telemetry.js'

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [accountMenuOpen, setAccountMenuOpen] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    const { cartCount } = useCart()
    const { wishlistItems } = useWishlist()
    const { user, logout } = useAuth()
    const accountMenuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setAccountMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') { setMobileMenuOpen(false); setAccountMenuOpen(false) }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const handleLogout = () => {
        logout()
        setAccountMenuOpen(false)
    }

    const submitSearch = (event) => {
        event.preventDefault()
        const term = query.trim()
        if (term) { trackEvent('search', { search_term: term }); navigate(`/search?q=${encodeURIComponent(term)}`); setMobileMenuOpen(false) }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="page-shell flex items-center justify-between gap-3 py-3 pr-1 md:py-4">
                <button
                    aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-stone-700 hover:bg-stone-100 lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Link to="/" aria-label="AYUSYDAH Official Store home" className="flex shrink-0 items-center" onClick={() => setMobileMenuOpen(false)}>
                    <img src={ayusydahLogo} alt="AYUSYDAH Official Store" className="h-12 w-12 rounded-full object-contain sm:h-14 sm:w-14" />
                </Link>

                <div className="hidden lg:block flex-1 max-w-2xl">
                    <form onSubmit={submitSearch} className="relative block"><button type="submit" aria-label="Submit search" className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-brand-blue"><Search size={17} /></button><input
                        type="text"
                        placeholder="Search for products, health concerns and brands"
                        value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" className="w-full rounded-full border border-stone-300 py-3 pl-11 pr-5 text-sm focus:border-brand-blue focus:outline-none"
                    /></form>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative hidden lg:block" ref={accountMenuRef}>
                        <button
                            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-blue"
                        >
                            <User size={22} />
                            <span>{user ? user.name : 'Register | Login'}</span>
                        </button>

                        {accountMenuOpen && (
                            <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-200 shadow-lg rounded-lg py-3 z-50">
                                {user ? (
                                    <>
                                        {user.isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setAccountMenuOpen(false)}
                                                className="block px-5 py-2 text-sm text-brand-blue font-semibold hover:bg-gray-50"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/my-orders"
                                            onClick={() => setAccountMenuOpen(false)}
                                            className="block px-5 py-2 text-sm text-gray-700 hover:text-brand-blue hover:bg-gray-50"
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-5 py-2 text-sm text-gray-700 hover:text-brand-blue hover:bg-gray-50 border-t border-gray-100 mt-1 pt-3"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/register"
                                            onClick={() => setAccountMenuOpen(false)}
                                            className="block px-5 py-2 text-sm text-gray-700 hover:text-brand-blue hover:bg-gray-50"
                                        >
                                            Register an Account
                                        </Link>
                                        <Link
                                            to="/login"
                                            onClick={() => setAccountMenuOpen(false)}
                                            className="block px-5 py-2 text-sm text-gray-700 hover:text-brand-blue hover:bg-gray-50 border-t border-gray-100 mt-1 pt-3"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <Link to={user ? '/my-orders' : '/login'} aria-label={user ? `My account: ${user.name}` : 'Login or register'} className="flex max-w-32 cursor-pointer items-center gap-1.5 text-gray-700 hover:text-brand-blue lg:hidden">
                        <User size={22} />
                        {user && <span className="max-w-20 truncate text-xs font-semibold text-gray-700 sm:max-w-28 sm:text-sm">{user.name}</span>}
                    </Link>

                    <Link to="/wishlist" aria-label="Wishlist" className="flex items-center relative text-gray-700 hover:text-brand-blue">
                        <Heart size={22} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>

                    <Link to="/cart" className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-blue">
                        <span className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        </span>
                        <span className="hidden lg:inline">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Desktop category navigation: intentionally limited to the five customer-facing collections. */}
            <nav aria-label="Product categories" className="hidden border-t border-stone-100 bg-[#f7f8f4] lg:block relative">
                <ul className="page-shell flex items-center justify-between gap-2 py-3 text-[11px] font-bold text-gray-800 whitespace-nowrap lg:gap-3 lg:text-sm">
                    {navigationItems.map((item) => (
                        <li
                            key={item.label}
                            className="relative shrink-0 border-b-2 border-transparent pb-2 transition-colors hover:border-brand-blue hover:text-brand-blue"
                        >
                            <Link className="inline-flex items-center" to={item.to}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <nav aria-label="Mobile navigation" className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
                    <form onSubmit={submitSearch} className="relative"><button type="submit" aria-label="Submit search" className="absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-stone-500"><Search size={16} /></button><input
                        type="text"
                        placeholder="Search..."
                        value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" className="mb-3 w-full rounded-full border border-gray-300 py-2 pl-4 pr-11 text-sm focus:border-brand-blue focus:outline-none"
                    /></form>
                    <ul className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
                        {user && <li className="mb-2 rounded-xl bg-blue-50 px-4 py-3 text-brand-blue"><p className="text-xs font-medium uppercase tracking-wide text-blue-500">Signed in as</p><p className="mt-1 truncate">{user.name}</p></li>}
                        {navigationItems.map((item) => (
                            <li key={item.label} className="border-b border-gray-100">
                                <Link onClick={() => setMobileMenuOpen(false)} to={item.to} className="block py-3">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        {user?.isAdmin && (
                            <li className="py-3 border-b border-gray-100">
                                <Link onClick={() => setMobileMenuOpen(false)} to="/admin" className="text-brand-blue font-semibold">Admin Dashboard</Link>
                            </li>
                        )}
                        {user && (
                            <li className="py-3 border-b border-gray-100">
                                <Link onClick={() => setMobileMenuOpen(false)} to="/my-orders">My Orders</Link>
                            </li>
                        )}
                        <li className="py-3 flex items-center gap-2">
                            {user ? (
                                <button onClick={handleLogout} className="cursor-pointer text-red-500">Logout</button>
                            ) : (
                                <>
                                    <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
                                </>
                            )}
                        </li>
                        <li className="py-3 border-t border-gray-100">
                            <Link onClick={() => setMobileMenuOpen(false)} to="/wishlist">My Wishlist</Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    )
}

export default Header
