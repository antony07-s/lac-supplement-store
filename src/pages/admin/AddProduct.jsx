import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

const categories = [
  'Health Concerns',
  'Ayurveda',
  'Beauty & Hair',
  'Food & Nutrition',
  'Brands',
]

function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: categories[0],
    description: '',
    videoUrl: '',
    healthGoals: [],
  })
  const [healthGoals, setHealthGoals] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [variants, setVariants] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.get('/health-goals').then((res) => setHealthGoals(res.data)).catch(() => toast.error('Unable to load health goals')) }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const basePrice = Number(form.price)
    if (form.price === '' || !Number.isFinite(basePrice) || basePrice < 0 || (form.originalPrice !== '' && Number(form.originalPrice) < 0)) {
      toast.error('Enter a valid normal product price')
      return
    }
    const cleanedVariants = variants.map((variant) => ({ ...variant, price: Number(variant.price), originalPrice: variant.originalPrice === '' ? Number(variant.price) : Number(variant.originalPrice), stock: Number(variant.stock) }))
    if (cleanedVariants.some((variant) => !variant.packSize || !Number.isFinite(variant.price) || variant.price < 0 || !Number.isSafeInteger(variant.stock) || variant.stock < 0)) {
      toast.error('Complete every variant with a pack size, price, and stock')
      return
    }
    setSaving(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('image', imageFile)
        const uploadRes = await api.post('/products/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        imageUrl = uploadRes.data.imageUrl
      }
      let videoUrl = form.videoUrl || ''
      let videoPublicId = ''
      if (videoFile) {
        const uploadData = new FormData()
        uploadData.append('video', videoFile)
        const uploadRes = await api.post('/products/upload-video', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } })
        videoUrl = uploadRes.data.videoUrl
        videoPublicId = uploadRes.data.videoPublicId || ''
      }

      const productData = {
        ...form,
        price: basePrice,
        originalPrice: form.originalPrice === '' ? basePrice : Number(form.originalPrice),
        image: imageUrl,
        variants: cleanedVariants,
        videoUrl,
        videoPublicId,
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
    <AdminLayout title="Add Product" subtitle="Create a new product in your catalog" backTo="/admin/products">
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

          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Upload Product Video <span className="normal-case font-normal">(optional, replaces URL)</span></label><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setVideoFile(event.target.files[0] || null)} className="w-full text-sm border border-dashed border-gray-300 rounded-lg px-4 py-3" /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Video URL <span className="normal-case font-normal">(optional)</span></label><input type="url" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>

          <section className="rounded-xl border border-stone-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-bold text-stone-800">Product variants</h2><button type="button" onClick={() => setVariants((current) => [...current, { packSize: '', price: '', originalPrice: '', sku: '', stock: '', image: '', isAvailable: true }])} className="rounded-full border border-brand-blue px-3 py-1.5 text-xs font-semibold text-brand-blue">Add variant</button></div>
            <div className="space-y-3">
              {variants.map((variant, index) => <div key={index} className="grid gap-2 rounded-lg bg-stone-50 p-3 sm:grid-cols-2">
              {['packSize', 'price', 'originalPrice', 'sku', 'stock', 'image'].map((field) => <label key={field} className="text-xs font-medium text-stone-600">{{ packSize: 'Pack size', price: 'Price (RM)', originalPrice: 'Compare-at price (RM)', sku: 'SKU', stock: 'Stock quantity', image: 'Variant image URL (optional)' }[field]}<input type={['price', 'originalPrice', 'stock'].includes(field) ? 'number' : 'text'} min={['price', 'originalPrice', 'stock'].includes(field) ? '0' : undefined} placeholder={field === 'packSize' ? 'e.g. 30 Capsules' : field === 'image' ? 'https://...' : ''} value={variant[field]} onChange={(event) => setVariants((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: event.target.value } : entry))} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" /></label>)}
                <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={variant.isAvailable} onChange={(event) => setVariants((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, isAvailable: event.target.checked } : entry))} /> Available</label>
                {variants.length > 1 && <button type="button" onClick={() => setVariants((current) => current.filter((_, entryIndex) => entryIndex !== index))} className="text-left text-sm font-semibold text-rose-600">Remove variant</button>}
              </div>)}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Price (RM) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
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
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Health goals</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-3">
              {healthGoals.map((goal) => <label key={goal._id} className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.healthGoals.includes(goal.name)} onChange={(event) => setForm((current) => ({ ...current, healthGoals: event.target.checked ? [...current.healthGoals, goal.name] : current.healthGoals.filter((name) => name !== goal.name) }))} />{goal.name}</label>)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Select only goals directly supported by this product’s description.</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category</label>
            <select
              name="category"
              id="category"
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
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Image <span className="normal-case font-normal">(optional — add later)</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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
