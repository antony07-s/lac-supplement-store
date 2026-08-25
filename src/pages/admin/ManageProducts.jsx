import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/products', { params: { limit: 50 } })
      .then((res) => { if (active) setProducts(Array.isArray(res.data) ? res.data : (res.data.products || [])) })
      .catch(() => { if (active) toast.error('Failed to load products') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <AdminLayout title="Products" subtitle={`${products.length} product${products.length !== 1 ? 's' : ''} in your catalog`}>
      <div className="flex justify-end mb-5">
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-brand-blue text-white font-semibold px-5 py-2.5 rounded-full hover:bg-brand-blue-dark text-sm transition-colors"
        >
          <PlusCircle size={16} />
          Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="sticky right-0 bg-gray-50 px-5 py-4 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="group transition-colors hover:bg-gray-50">
                  <td className="sticky right-0 bg-white px-5 py-3 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.18)] transition-colors group-hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-14 h-14 object-contain bg-gray-50 rounded-lg border border-gray-100" />
                      <span className="font-semibold text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block bg-blue-50 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">RM {product.price.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        aria-label={`Edit ${product.name}`}
                        title={`Edit ${product.name}`}
                        className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        aria-label={`Delete ${product.name}`}
                        title={`Delete ${product.name}`}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

export default ManageProducts
