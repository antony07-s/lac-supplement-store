import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, MessageSquare, ArrowLeft, Menu } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Add Product', to: '/admin/products/add', icon: PlusCircle },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Reviews', to: '/admin/reviews', icon: MessageSquare },
]

function SidebarContent({ location, onNavigate }) {
  return (
    <>
      <div className="px-6 py-6 border-b border-gray-800">
        <span className="text-xl font-bold text-white">AYUSYDAH<span className="text-brand-gold">.</span></span>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-brand-blue text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Store
        </Link>
      </div>
    </>
  )
}

function AdminLayout({ children, title, subtitle, backTo }) {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-gray-900 text-white md:flex">
        <SidebarContent location={location} onNavigate={closeMobileNav} />
      </aside>

      {/* Mobile sidebar (slide-in) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-64 flex-col overflow-y-auto bg-gray-900 text-white">
            <SidebarContent location={location} onNavigate={closeMobileNav} />
          </aside>
        </div>
      )}

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64">
        <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-5 md:px-10">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden text-gray-600 shrink-0"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            {backTo && <Link to={backTo} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-brand-blue"><ArrowLeft size={14} /> Back</Link>}
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1 truncate">{subtitle}</p>}
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
