import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'
import Reveal from '../components/Frame/Reveal.jsx'

function BestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-[#f4f7fc]">
      <div className="page-shell section-space">
        <p className="eyebrow">Our range</p>
        <h2 className="section-title mt-2 mb-8">Explore our products</h2>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
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