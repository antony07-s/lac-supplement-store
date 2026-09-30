import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'

const templateHeaders = [
  'name', 'category', 'description', 'price', 'originalPrice', 'stock', 'shippingWeightKg',
  'bestSeller', 'healthGoals', 'imageUrl', 'variantPackSize', 'variantPrice',
  'variantOriginalPrice', 'variantStock', 'variantShippingWeightKg', 'variantSku', 'variantImageUrl',
]

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted && character === '"' && text[index + 1] === '"') { value += '"'; index += 1 }
    else if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) { row.push(value); value = '' }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(value); rows.push(row); row = []; value = ''
    } else value += character
  }
  if (quoted) throw new Error('CSV has an unclosed quote.')
  if (value || row.length) { row.push(value); rows.push(row) }
  return rows
}

const fieldKey = (value) => String(value || '').trim().toLowerCase().replace(/[\s_-]/g, '')
const numberValue = (value) => String(value ?? '').trim() === '' ? null : Number(value)
const normalizeTitle = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase()
function groupCsvRows(csvRows) {
  if (csvRows.length < 2) return { products: [], errors: ['The CSV has no product rows.'] }
  const headers = csvRows[0].map(fieldKey)
  const requiredHeaders = ['name', 'category', 'description', 'price', 'stock', 'shippingweightkg', 'imageurl']
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length) return { products: [], errors: [`Missing CSV column(s): ${missingHeaders.join(', ')}.`] }

  const productsByTitle = new Map()
  const errors = []
  const sharedFields = ['category', 'description', 'price', 'originalprice', 'stock', 'shippingweightkg', 'bestseller', 'healthgoals']

  csvRows.slice(1).forEach((cells, index) => {
    if (cells.every((cell) => !String(cell || '').trim())) return
    const line = index + 2
    const row = Object.fromEntries(headers.map((header, column) => [header, String(cells[column] ?? '').trim()]))
    const name = row.name || ''
    const key = normalizeTitle(name)
    if (!key) { errors.push(`Row ${line}: product name is required.`); return }
    let product = productsByTitle.get(key)
    if (!product) {
      product = { name, values: {}, images: new Set(), variants: new Map(), line }
      productsByTitle.set(key, product)
    } else if (product.name.trim().replace(/\s+/g, ' ') !== name.replace(/\s+/g, ' ')) {
      errors.push(`Rows for the same product use inconsistent title spelling: "${product.name}" / "${name}".`)
    }

    for (const field of sharedFields) {
      const value = row[field] || ''
      if (!value) continue
      const prior = product.values[field]
      const normalized = ['price', 'originalprice', 'stock', 'shippingweightkg'].includes(field) && Number.isFinite(Number(value)) ? String(Number(value)) : value
      const normalizedPrior = ['price', 'originalprice', 'stock', 'shippingweightkg'].includes(field) && Number.isFinite(Number(prior)) ? String(Number(prior)) : prior
      if (prior && normalizedPrior !== normalized) errors.push(`Row ${line}: ${field} differs from another row for "${product.name}".`)
      else product.values[field] = value
    }

    const imageUrl = row.imageurl || ''
    if (imageUrl) product.images.add(imageUrl)

    const packSize = row.variantpacksize || ''
    const variantFields = ['variantprice', 'variantoriginalprice', 'variantstock', 'variantshippingweightkg', 'variantsku', 'variantimageurl']
    if (packSize) {
      const variant = product.variants.get(packSize.toLowerCase()) || { packSize, values: {} }
      for (const field of variantFields) {
        const value = row[field] || ''
        if (!value) continue
        const old = variant.values[field]
        if (old && old !== value) errors.push(`Row ${line}: ${field} differs for the ${packSize} variant of "${product.name}".`)
        else variant.values[field] = value
      }
      product.variants.set(packSize.toLowerCase(), variant)
    } else if (variantFields.some((field) => row[field])) {
      errors.push(`Row ${line}: variant fields need a variantPackSize.`)
    }
  })

  const products = []
  for (const product of productsByTitle.values()) {
    const { values } = product
    const variants = [...product.variants.values()].map((entry) => {
      const value = entry.values
      const price = numberValue(value.variantprice)
      const stock = numberValue(value.variantstock)
      const weight = numberValue(value.variantshippingweightkg)
      const originalPrice = numberValue(value.variantoriginalprice) ?? price
      return { packSize: entry.packSize, price, originalPrice, stock, shippingWeightKg: weight, sku: value.variantsku || '', image: value.variantimageurl || '' }
    })
    const price = numberValue(values.price) ?? (variants.length ? Math.min(...variants.map((variant) => variant.price).filter(Number.isFinite)) : null)
    const originalPrice = numberValue(values.originalprice) ?? price
    const stock = numberValue(values.stock)
    const shippingWeightKg = numberValue(values.shippingweightkg)
    const bestSellerText = String(values.bestseller || '').toLowerCase()

    const healthGoals = String(values.healthgoals || '').split(/[|;]/).map((goal) => goal.trim()).filter(Boolean)
    const images = [...product.images]
    products.push({
      name: product.name.trim(), category: values.category || '', description: values.description || '',
      price, originalPrice, stock: variants.length ? undefined : stock,
      shippingWeightKg: variants.length ? undefined : shippingWeightKg,
      bestSeller: ['true', 'yes', '1'].includes(bestSellerText), healthGoals,
      image: images[0] || '', images, variants,
    })
  }
  if (!products.length) errors.push('No products found in the CSV.')
  return { products, errors: [...new Set(errors)] }
}

function ImportProducts() {
  const [fileName, setFileName] = useState('')
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState([])
  const [catalogPreview, setCatalogPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const imageCount = useMemo(() => products.reduce((total, product) => total + product.images.length, 0), [products])

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    setFileName(file?.name || '')
    setProducts([]); setErrors([]); setCatalogPreview(null); setResult(null)
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrors(['CSV must be smaller than 5 MB.']); return }
    setLoading(true)
    try {
      const grouped = groupCsvRows(parseCsv(await file.text()))
      setProducts(grouped.products)
      setErrors(grouped.errors)
      if (!grouped.errors.length) {
        try {
          const preview = await api.post('/products/bulk-import?preview=true', { products: grouped.products })
          setCatalogPreview(preview.data)
          if (preview.data.invalid?.length) {
            setErrors(preview.data.invalid.map((item) => `${item.name}: ${item.message}`))
          }
        } catch (error) {
          setErrors([error.response?.data?.message || 'Could not check imported titles against the catalog.'])
        }
      }
    } catch (error) {
      setErrors([error.message || 'Unable to read this CSV file.'])
    } finally { setLoading(false) }
  }

  const downloadTemplate = () => {
    const blob = new Blob([`${templateHeaders.join(',')}\r\n`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'ayusydah-product-import-template.csv'; link.click()
    URL.revokeObjectURL(url)
  }

  const submitImport = async () => {
    setImporting(true); setResult(null)
    try {
      const response = await api.post('/products/bulk-import', { products })
      setResult(response.data)
      toast.success(response.data.message || 'Product import completed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product import failed')
    } finally { setImporting(false) }
  }

  return <AdminLayout title="Import Products" subtitle="Group image rows by product title; existing products are skipped.">
    <section className="max-w-5xl space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="font-bold text-gray-800">Upload product CSV</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Use one row for each image. Repeat the product title and shared details on those rows; matching titles will become one product with a gallery.</p></div>
          <button type="button" onClick={downloadTemplate} className="min-h-10 rounded-lg border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-blue-50">Download template</button>
        </div>
        <label className="mt-5 block text-sm font-semibold text-gray-700">CSV file<input type="file" accept=".csv,text/csv" onChange={handleFile} className="mt-2 block w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:font-semibold file:text-white" /></label>
        {fileName && <p className="mt-2 text-xs text-gray-500">Selected: {fileName}</p>}
        <p className="mt-4 text-xs leading-5 text-gray-500">Required product fields: name, category, description, price, stock, shippingWeightKg. For products with pack variants, fill variantPackSize, variantPrice, variantStock and variantShippingWeightKg instead of product stock/weight. Each image uses its own HTTPS imageUrl row.</p>
      </div>

      {loading && <p className="text-sm text-gray-500">Reading and grouping CSV rows…</p>}
      {errors.length > 0 && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><h3 className="font-bold">Fix these CSV issues before importing</h3><ul className="mt-2 max-h-64 list-disc space-y-1 overflow-y-auto pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

      {products.length > 0 && <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 md:p-5"><div><h2 className="font-bold text-gray-800">Import preview</h2><p className="mt-1 text-sm text-gray-500">{products.length} grouped products · {imageCount} images</p>{catalogPreview && <p className="mt-1 text-sm font-semibold text-emerald-700">{catalogPreview.totalNew - catalogPreview.invalid.length} valid new products · {catalogPreview.skipped.length} existing titles left untouched</p>}</div><button type="button" onClick={submitImport} disabled={!catalogPreview?.createCount || Boolean(catalogPreview?.invalid?.length) || Boolean(errors.length) || importing || loading} className="min-h-11 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50">{importing ? 'Importing…' : `Add ${catalogPreview?.createCount || 0} new products`}</button></div>
        {catalogPreview?.invalid?.length > 0 && <div role="alert" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>{catalogPreview.invalid.length} new product(s) need required data before any import can run.</strong></div>}
        {catalogPreview?.skipped?.length > 0 && <details className="border-b border-gray-100 px-4 py-3 text-sm"><summary className="cursor-pointer font-semibold text-gray-700">Existing product titles that will not be changed ({catalogPreview.skipped.length})</summary><ul className="mt-2 grid gap-x-6 gap-y-1 text-xs text-gray-600 sm:grid-cols-2">{catalogPreview.skipped.map((name) => <li key={name}>{name}</li>)}</ul></details>}
        <div className="max-h-[28rem] overflow-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Images</th><th className="px-4 py-3">Variants</th><th className="px-4 py-3">Import</th></tr></thead><tbody className="divide-y divide-gray-100">{products.map((product) => { const exists = catalogPreview?.skipped?.some((name) => normalizeTitle(name) === normalizeTitle(product.name)); return <tr key={normalizeTitle(product.name)}><td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td><td className="px-4 py-3 text-gray-600">{product.category}</td><td className="px-4 py-3 text-gray-700">{Number.isFinite(product.price) ? `RM ${product.price.toFixed(2)}` : 'Missing'}</td><td className="px-4 py-3 text-gray-600">{product.images.length}</td><td className="px-4 py-3 text-gray-600">{product.variants.length || '—'}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${exists ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'}`}>{exists ? 'Already exists' : 'Will add'}</span></td></tr> })}</tbody></table></div>
      </section>}

      {result && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><p className="font-bold">{result.message}</p>{result.skipped?.length > 0 && <details className="mt-2"><summary className="cursor-pointer font-semibold">Existing titles left unchanged ({result.skipped.length})</summary><ul className="mt-2 list-disc pl-5">{result.skipped.map((name) => <li key={name}>{name}</li>)}</ul></details>}</div>}
    </section>
  </AdminLayout>
}

export default ImportProducts
