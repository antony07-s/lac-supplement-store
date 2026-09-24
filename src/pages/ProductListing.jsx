import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { getWithRetry } from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'

const PRODUCTS_PER_PAGE = 10
const sortOptions = [['newest', 'Newest'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name: A–Z']]

function ProductListing() {
  const { category } = useParams()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const headingRef = useRef(null)
  const searchTerm = searchParams.get('q')?.trim().slice(0, 100) || ''
  const healthGoal = searchParams.get('healthGoal')?.trim().slice(0, 100) || ''
  const sort = sortOptions.some(([value]) => value === searchParams.get('sort')) ? searchParams.get('sort') : 'newest'
  const currentPage = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)
  const decodedCategory = category ? decodeURIComponent(category) : ''
  const showAllProducts = location.pathname === '/products'

  useEffect(() => {
    const controller = new AbortController()
    const params = { page: currentPage, limit: PRODUCTS_PER_PAGE, sort }
    if (searchTerm) params.search = searchTerm
    else if (healthGoal) params.healthGoal = healthGoal
    else if (!showAllProducts && decodedCategory) params.category = decodedCategory
    getWithRetry('/products', { params, signal: controller.signal })
      .then((res) => {
        const data = res.data
        const catalog = Array.isArray(data) ? data : (data.products || [])
        setProducts(Array.isArray(data) ? catalog.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE) : catalog)
        setTotal(Array.isArray(data) ? catalog.length : (data.total || 0))
        setError('')
      })
      .catch((err) => { if (err.code !== 'ERR_CANCELED') { setProducts([]); setError('Unable to load products right now. Please try again shortly.') } })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [currentPage, decodedCategory, healthGoal, searchTerm, showAllProducts, sort, retryKey])

  const title = searchTerm ? `Search results for “${searchTerm}”` : healthGoal || (showAllProducts ? 'All products' : decodedCategory)
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const updateParams = (nextPage = 1, nextSort = sort) => {
    setLoading(true)
    const next = new URLSearchParams(searchParams)
    if (nextSort === 'newest') next.delete('sort'); else next.set('sort', nextSort)
    if (nextPage === 1) next.delete('page'); else next.set('page', String(nextPage))
    setSearchParams(next)
  }
  const retry = () => setRetryKey((value) => value + 1)

  return <main className="page-shell section-space">
    <p className="mb-2 text-xs text-gray-400"><Link to="/" className="hover:text-brand-blue hover:underline">Home</Link>{' > '}{title}</p>
    <div className="mb-8 space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><h1 ref={headingRef} className="section-title scroll-mt-28">{title}</h1><span className="text-sm text-stone-500" aria-live="polite">{loading ? 'Loading products…' : `${total} product${total === 1 ? '' : 's'}`}</span></div>
      <div className="w-full sm:flex sm:justify-end"><label htmlFor="product-sort" className="flex w-full flex-col gap-1.5 text-sm font-semibold text-stone-700 sm:w-auto sm:flex-row sm:items-center sm:gap-2">Sort by<select id="product-sort" value={sort} onChange={(event) => updateParams(1, event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 sm:w-auto sm:min-w-48">{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    </div>
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5" aria-label="Loading products">{Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => <div key={index} className="shimmer aspect-[3/4] rounded-2xl" />)}</div>
      : error ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600"><p>{error}</p><button type="button" onClick={retry} className="mt-4 min-h-11 rounded-full border border-brand-blue px-5 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white">Try again</button></div>
        : products.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">We’re curating this collection now. Explore our daily essentials while you wait.</div>
          : <><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>{totalPages > 1 && <nav aria-label="Product pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2"><button type="button" onClick={() => updateParams(Math.max(1, page - 1))} disabled={page === 1} className="min-h-11 rounded-full border border-stone-300 px-4 text-sm font-semibold text-brand-blue hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => updateParams(number)} aria-current={number === page ? 'page' : undefined} className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold ${number === page ? 'bg-brand-blue text-white' : 'border border-stone-300 text-brand-blue hover:bg-stone-100'}`}>{number}</button>)}<button type="button" onClick={() => updateParams(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="min-h-11 rounded-full border border-stone-300 px-4 text-sm font-semibold text-brand-blue hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40">Next</button></nav>}</>}
  </main>
}

export default ProductListing
