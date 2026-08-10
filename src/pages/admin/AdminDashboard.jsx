import { Link } from 'react-router-dom'
import { Package, PlusCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, manage your store from here.">
      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          to="/admin/products"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Package size={28} className="text-brand-blue mb-3" />
          <h3 className="font-bold text-gray-800 mb-1">Manage Products</h3>
          <p className="text-sm text-gray-500">View, edit, and delete your product catalog</p>
        </Link>

        <Link
          to="/admin/products/add"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle size={28} className="text-brand-gold mb-3" />
          <h3 className="font-bold text-gray-800 mb-1">Add New Product</h3>
          <p className="text-sm text-gray-500">Upload a new product with photos and pricing</p>
        </Link>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard