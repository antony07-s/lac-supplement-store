import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import ProductContentFields from '../../components/admin/ProductContentFields.jsx'

const categories = [
  'Health Concerns',
  'Ayurveda',
  'Beauty & Hair',
  'Food & Nutrition',
  'Brands',
]

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [variants, setVariants] = useState([])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => { setForm({ ...res.data, keyBenefitsText: (res.data.keyBenefits || []).join('\n') }); setVariants(res.data.variants || []) })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedVariants = variants.map((variant) => ({ ...variant, price: Number(variant.price), originalPrice: Number(variant.originalPrice) || Number(variant.price), stock: Number(variant.stock) }))
    if (cleanedVariants.some((variant) => !variant.packSize?.trim() || !Number.isFinite(variant.price) || variant.price < 0 || !Number.isSafeInteger(variant.stock) || variant.stock < 0)) {
      toast.error('Each variant needs a pack size, price, and stock quantity.')
      return
    }
    setSaving(true)
    try {
      let imageUrl = form.image

      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('image', imageFile)
        const uploadRes = await api.post('/products/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        imageUrl = uploadRes.data.imageUrl
      }
      let videoUrl = form.videoUrl || ''
      if (videoFile) {
        const uploadData = new FormData()
        uploadData.append('video', videoFile)
        const uploadRes = await api.post('/products/upload-video', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } })
        videoUrl = uploadRes.data.videoUrl
      }

      await api.put(`/products/${id}`, {
        name: form.name,
        price: cleanedVariants[0]?.price ?? Number(form.price),
        originalPrice: cleanedVariants[0]?.originalPrice ?? Number(form.originalPrice),
        category: form.category,
        description: form.description,
        botanicalName: form.botanicalName,
        keyBenefits: String(form.keyBenefitsText || '').split('\n').map((item) => item.trim()).filter(Boolean),
        whyChoose: form.whyChoose,
        suitableFor: form.suitableFor,
        suggestedUse: form.suggestedUse,
        disclaimer: form.disclaimer,
        videoUrl,
        image: imageUrl,
        variants: cleanedVariants,
      })

      toast.success('Product updated')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    )
  }

  if (!form) {
    return (
      <AdminLayout title="Edit Product">
        <p className="text-gray-500">Product not found</p>
      </AdminLayout>
    )
  }

   return (
    <AdminLayout title="Edit Product" subtitle={form.name} backTo="/admin/products">
      <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          <ProductContentFields form={form} onChange={handleChange} />
          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Upload Product Video <span className="normal-case font-normal">(optional, replaces URL)</span></label><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setVideoFile(event.target.files[0] || null)} className="w-full text-sm border border-dashed border-gray-300 rounded-lg px-4 py-3" /></div>

          <section className="rounded-xl border border-stone-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-bold text-stone-800">Product variants</h2><button type="button" onClick={() => setVariants((current) => [...current, { packSize: '', price: '', originalPrice: '', sku: '', stock: 0, image: '', isAvailable: true }])} className="rounded-full border border-brand-blue px-3 py-1.5 text-xs font-semibold text-brand-blue">Add variant</button></div>
            {variants.length === 0 ? <p className="text-sm text-stone-500">No variants yet. This product uses its legacy product-level price and stock.</p> : <div className="space-y-3">{variants.map((variant, index) => <div key={variant._id || index} className="grid gap-2 rounded-lg bg-stone-50 p-3 sm:grid-cols-2">
              {['packSize', 'price', 'originalPrice', 'sku', 'stock', 'image'].map((field) => <label key={field} className="text-xs font-medium text-stone-600">{{ packSize: 'Pack size', price: 'Price (RM)', originalPrice: 'Compare-at price (RM)', sku: 'SKU', stock: 'Stock quantity', image: 'Variant image URL (optional)' }[field]}<input type={['price', 'originalPrice', 'stock'].includes(field) ? 'number' : 'text'} min={['price', 'originalPrice', 'stock'].includes(field) ? '0' : undefined} placeholder={field === 'packSize' ? 'e.g. 30 Capsules' : field === 'image' ? 'https://...' : ''} value={variant[field] ?? ''} onChange={(event) => setVariants((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: event.target.value } : entry))} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" /></label>)}
              <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={variant.isAvailable !== false} onChange={(event) => setVariants((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, isAvailable: event.target.checked } : entry))} /> Available</label>
              <button type="button" onClick={() => setVariants((current) => current.filter((_, entryIndex) => entryIndex !== index))} className="text-left text-sm font-semibold text-rose-600">Remove variant</button>
            </div>)}</div>}
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Price (RM)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                required={variants.length === 0}
                disabled={variants.length > 0}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm disabled:bg-stone-100 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
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
                disabled={variants.length > 0}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm disabled:bg-stone-100 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
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
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Current Image</label>
            <img src={form.image} alt={form.name} className="w-20 h-20 object-contain bg-gray-50 rounded-lg border border-gray-200 mb-3" />
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Replace Image (optional)</label>
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditProduct
