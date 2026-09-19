import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getWithRetry } from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'
import { ArrowRight } from 'lucide-react'

// These are the five confirmed products for the homepage Best Sellers collection.
const BEST_SELLER_MATCHES = ['diacare', 'prediacare', 'kidney guard', 'cholesterol', 'beetroot juice']

function BestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async (signal) => {
    setLoading(true)
    setError('')
    try {
      // Fetch the full small catalogue: a paginated first page cannot reliably
      // contain every curated product after new items are added.
      const res = await getWithRetry('/products', { params: { limit: 50 }, signal })
      const catalog = Array.isArray(res.data) ? res.data : (res.data.products || [])
      const selected = BEST_SELLER_MATCHES.map((needle) => catalog.find((product) => product.name.toLowerCase().includes(needle))).filter(Boolean)
      setProducts(selected)
    } catch (err) {
      if (err.code !== 'ERR_CANCELED') {
        setProducts([])
        setError('We could not load products right now.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // The request function sets loading state before it starts the external API request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts(controller.signal)
    return () => controller.abort()
  }, [loadProducts])

  return (
    <section id="best-sellers" className="bg-white">
      <div className="page-shell section-space">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4 sm:mb-2">
          <div>
            <p className="eyebrow">Customer favourites</p>
            <h2 className="section-title mt-2">Shop By Best Sellers</h2>
          <p className="mt-3 mb-3 text-sm text-stone-600">Customer favourites for everyday wellness.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-blue-dark px-5 py-2.5 text-sm font-bold text-brand-blue-dark transition hover:bg-brand-blue-dark hover:text-white">View All Products <ArrowRight size={15} /></Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 lg:gap-5" aria-label="Loading products">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="shimmer aspect-[3/4] rounded-2xl" />)}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="text-stone-600">{error}</p>
            <button type="button" onClick={() => loadProducts()} className="mt-4 rounded-full border border-brand-blue px-5 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white">Try again</button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">No products are available yet.</div>
        ) : (
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 lg:gap-5">
            {products.map((product) => (
              <StaggerItem key={product._id} direction="up">
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  )
}

export default BestSellers