import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, ChevronLeft, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import bp4 from '../assets/BP4.png'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { getWithRetry } from '../api/axios.js'
import toast from 'react-hot-toast'
import ProductCard from '../components/product/ProductCard.jsx'
import Reveal from '../components/Frame/Reveal.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'

const localImages = { BP4: bp4 }

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    let active = true
    // These resets keep route changes from briefly displaying the previous product state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    setQuantity(1)

    getWithRetry(`/products/${id}`)
      .then((res) => { if (active) setProduct(res.data) })
      .catch((err) => {
        if (active) {
          setProduct(null)
          setError(err.response?.status === 404 ? 'Product not found.' : 'Unable to load this product right now.')
        }
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!product?._id || !product.category) return undefined

    let active = true
        getWithRetry('/products', { params: { category: product.category, limit: 6 } })
      .then((res) => {
        if (!active) return
        setRelatedProducts((Array.isArray(res.data) ? res.data : (res.data.products || []))
          .filter((candidate) => candidate._id !== product._id && candidate.category === product.category)
          .slice(0, 5))
      })
      .catch(() => { if (active) setRelatedProducts([]) })

    return () => { active = false }
  }, [product?._id, product?.category])

  if (loading) {
    return <div className="page-shell section-space text-center"><p className="text-gray-500">Loading product...</p></div>
  }

  if (!product) {
    return (
      <div className="page-shell section-space text-center">
        <p className="text-gray-600">{error || 'Product not found.'}</p>
        <Link to="/" className="text-brand-blue hover:underline">Back to Home</Link>
      </div>
    )
  }

  const imageSrc = localImages[product.image] || product.image
  const inWishlist = isInWishlist(product._id)
  const parsedStock = Number(product.stock)
  const stockLimit = product.stock !== undefined && product.stock !== null && product.stock !== '' && Number.isFinite(parsedStock)
    ? Math.max(0, Math.floor(parsedStock))
    : null
  const isOutOfStock = stockLimit === 0
  const canIncreaseQuantity = stockLimit === null || quantity < stockLimit
  const price = Number(product.price) || 0
  const originalPrice = Number(product.originalPrice) || 0

  const handleAddToCart = () => {
    if (adding) return
    setAdding(true)
    addToCart(product, quantity)
    toast.success(`${quantity} ${product.name} added to bag`, { id: `add-${product._id}` })
    setTimeout(() => setAdding(false), 700)
  }

  return (
    <main className="page-shell section-space max-w-5xl">
      <Link to={`/category/${encodeURIComponent(product.category)}`} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ChevronLeft size={16} />
        Back to {product.category}
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Reveal direction="scale" className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[#f2f6ff] p-6">
          {imageSrc ? (
            <img src={imageSrc} alt={product.name} loading="eager" onError={(event) => { event.currentTarget.style.display = 'none' }} className="h-full w-full object-contain mix-blend-multiply" />
          ) : (
            <span className="text-sm text-stone-500">Image unavailable</span>
          )}
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <p className="eyebrow mb-3">Ayusydah wellness</p><h1 className="section-title mb-3">{product.name}</h1>
          <div className="mb-4 flex items-center gap-1"><Star size={16} className="fill-brand-gold text-brand-gold" /><span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span></div>
          <div className="mb-6 flex items-center gap-3"><span className="text-2xl font-bold text-brand-blue">RM {price.toFixed(2)}</span>{originalPrice > price && <span className="text-lg text-gray-400 line-through">RM {originalPrice.toFixed(2)}</span>}</div>
          <p className="mb-8 text-sm leading-7 text-stone-600">{product.description}</p>

          {isOutOfStock ? (
            <p className="mb-4 text-sm font-semibold text-rose-600">Currently unavailable</p>
          ) : (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-stone-700">Quantity</span>
              <div className="inline-flex items-center rounded-full border border-stone-300 bg-white shadow-sm">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity === 1} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center rounded-l-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={16} /></button>
                <motion.span key={quantity} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} aria-live="polite" className="min-w-9 text-center text-sm font-bold text-stone-800">{quantity}</motion.span>
                <button type="button" onClick={() => setQuantity((current) => stockLimit === null ? current + 1 : Math.min(current + 1, stockLimit))} disabled={!canIncreaseQuantity} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center rounded-r-full text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} /></button>
              </div>
              {stockLimit !== null && <span className="text-xs text-stone-500">{stockLimit} available</span>}
            </div>
          )}

          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleAddToCart} disabled={isOutOfStock || adding} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-blue py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60">
              <ShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleWishlist(product)} aria-label={`${inWishlist ? 'Remove' : 'Add'} ${product.name} ${inWishlist ? 'from' : 'to'} wishlist`} className={`rounded-full border px-5 ${inWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500 hover:text-brand-blue'}`}>
              <motion.span animate={inWishlist ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} className="inline-flex">
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </motion.span>
            </motion.button>
          </div>
        </Reveal>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-stone-200 pt-12">
          <p className="eyebrow">More to explore</p>
          <h2 className="section-title mt-2 mb-8">You may also like</h2>
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {relatedProducts.map((relatedProduct) => (
              <StaggerItem key={relatedProduct._id}>
                <ProductCard product={relatedProduct} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </main>
  )
}

export default ProductDetail
