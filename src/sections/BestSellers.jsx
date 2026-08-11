import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'
import Reveal from '../components/Frame/Reveal.jsx'

function BestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async (signal) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/products', { params: { limit: 10 }, signal })
      setProducts(Array.isArray(res.data) ? res.data : (res.data.products || []))
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
    <section className="bg-[#f4f7fc]">
      <div className="page-shell section-space">
        <p className="eyebrow">Our range</p>
        <h2 className="section-title mt-2 mb-8">Explore our products</h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5" aria-label="Loading products">
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
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {products.slice(0, 10).map((product) => (
              <StaggerItem key={product._id} direction="up">
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
        {!loading && products.length > 0 && (
          <Reveal direction="fade" className="mt-8 text-center">
            <Link to="/products" className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-blue px-6 text-sm font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white">
              View All Products
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export default BestSellers
