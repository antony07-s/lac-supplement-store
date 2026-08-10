import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

const categories = [
  'Vitamins & Supplements',
  'Beauty & Slimming',
  'Protein & Fitness',
  'Food',
  'Wellness',
  'Sports Nutrition',
]

function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: categories[0],
    description: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) {
      toast.error('Please select a product image')
      return
    }
    if (Number(form.price) < 0 || Number(form.originalPrice) < 0) {
      toast.error('Price cannot be negative')
      return
    }
    setSaving(true)
    try {
      const uploadData = new FormData()
      uploadData.append('image', imageFile)
      const uploadRes = await api.post('/products/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const productData = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        image: uploadRes.data.imageUrl,
      }

      await api.post('/products', productData)
      toast.success('Product created')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Add Product" subtitle="Create a new product in your catalog">
      <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ayusydah Blood Pressure Support"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Price (RM) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Optional"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
              className="w-full text-sm border border-dashed border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddProduct