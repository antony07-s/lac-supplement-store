import { Link } from 'react-router-dom'
import { MessageSquare, Package, PlusCircle, ShoppingBag } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, manage your store from here.">
      <div className="mb-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
        <p className="eyebrow">Store management</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Manage your product catalog and keep your storefront up to date.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/admin/products"
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg"
        >
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand-blue"><Package size={23} /></span>
          <h3 className="font-bold text-gray-800 mb-1">Manage Products</h3>
          <p className="text-sm text-gray-500">View, edit, and delete your product catalog</p>
        </Link>

        <Link
          to="/admin/products/add"
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg"
        >
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-brand-gold"><PlusCircle size={23} /></span>
          <h3 className="font-bold text-gray-800 mb-1">Add New Product</h3>
          <p className="text-sm text-gray-500">Upload a new product with photos and pricing</p>
        </Link>

        <Link to="/admin/orders" className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-sky-700"><ShoppingBag size={23} /></span>
          <h3 className="mb-1 font-bold text-gray-800">Manage Orders</h3>
          <p className="text-sm text-gray-500">Review orders and update fulfilment</p>
        </Link>

        <Link to="/admin/reviews" className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-brand-gold"><MessageSquare size={23} /></span>
          <h3 className="mb-1 font-bold text-gray-800">Manage Reviews</h3>
          <p className="text-sm text-gray-500">Review and moderate customer feedback</p>
        </Link>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
