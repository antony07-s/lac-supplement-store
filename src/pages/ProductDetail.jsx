import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
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
const sectionLabelPattern = /^(Product(?: Name)?|Botanical (?:Name|Source)|Description|Key Benefits|Suitable For|Suggested Use|Food Supplement Only|Available Sizes|Pack Size|How to Use)\s*:?[\s\u00a0]*(.*)$/i
const whyChoosePattern = /^(Why Choose AYUSYDAH(?:\s+.+)?\??)\s*$/i

const parseDescription = (description) => {
  const lines = String(description || '')
    .replace(/\r/g, '')
    .replace(/[□]/g, '•')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const blocks = []

  for (let index = 0; index < lines.length;) {
    const line = lines[index]
    if (/^[•·-]\s*/.test(line)) {
      const items = []
      while (index < lines.length && /^[•·-]\s*/.test(lines[index])) {
        items.push(lines[index].replace(/^[•·-]\s*/, '').trim())
        index += 1
      }
      blocks.push({ type: 'list', items })
      continue
    }
    const whyChooseHeading = line.match(whyChoosePattern)
    if (whyChooseHeading) {
      blocks.push({ type: 'heading', text: whyChooseHeading[1] })
      index += 1
      continue
    }
    const inlineHeading = line.match(sectionLabelPattern)
    if (inlineHeading) {
      blocks.push({ type: 'heading', text: inlineHeading[1] })
      if (inlineHeading[2]) blocks.push({ type: 'paragraph', text: inlineHeading[2] })
      index += 1
      continue
    }
    const disclaimerLabel = line.match(/^(Food Supplement Only\.?)(\s+.*)?$/i)
    if (disclaimerLabel) {
      blocks.push({ type: 'heading', text: disclaimerLabel[1] })
      if (disclaimerLabel[2]?.trim()) blocks.push({ type: 'paragraph', text: disclaimerLabel[2].trim() })
      index += 1
      continue
    }
    blocks.push({ type: line.endsWith(':') ? 'heading' : 'paragraph', text: line.replace(/^\*\*|\*\*$/g, '') })
    index += 1
  }
  return blocks
}

const renderInlineBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function ProductDescription({ description }) {
  const blocks = parseDescription(description)

  return (
    <div className="mb-8 space-y-3 text-sm leading-7 text-stone-600">
      {blocks.map((block, index) => {
        if (block.type === 'heading') return <p key={index} className="mb-1 mt-4 font-bold text-stone-800">{renderInlineBold(block.text)}</p>
        if (block.type === 'list') return <ul key={index} className="list-disc space-y-1 pl-5 marker:text-brand-blue">{block.items.map((item) => <li key={item}>{renderInlineBold(item)}</li>)}</ul>
        return <p key={index} className="text-stone-600">{renderInlineBold(block.text)}</p>
      })}
    </div>
  )
}

function AutoPlayProductVideo({ videoUrl }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }, { threshold: 0.6 })

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [videoUrl])

  return (
    <video ref={videoRef} className="aspect-video w-full rounded-xl bg-stone-900" controls muted playsInline preload="metadata">
      <source src={videoUrl} />
      Your browser does not support product videos.
    </video>
  )
}

function ProductVideo({ product }) {
  const videoUrl = product.videoUrl || ''
  if (!videoUrl) return null
  const isEmbed = /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(videoUrl)
  const embedUrl = videoUrl.includes('youtu.be/') ? `https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1].split(/[?&#]/)[0]}` : videoUrl.includes('watch?v=') ? `https://www.youtube.com/embed/${videoUrl.split('watch?v=')[1].split('&')[0]}` : videoUrl
  return <section className="mb-8 pt-2"><h2 className="mb-3 text-sm font-bold text-stone-800">Product Video</h2>{isEmbed ? <iframe className="aspect-video w-full rounded-xl border border-stone-200" src={embedUrl} title={`${product.name} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <AutoPlayProductVideo videoUrl={videoUrl} />}</section>
}

function ProductDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState('')
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
    setSelectedVariantId('')

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
  const requestedReturnTo = searchParams.get('returnTo')
  const returnTo = requestedReturnTo?.startsWith('/') ? requestedReturnTo : `/category/${encodeURIComponent(product.category)}`
  const variants = Array.isArray(product.variants) ? product.variants : []
  const selectedVariant = variants.find((variant) => variant._id === selectedVariantId) || variants[0] || null
  const displayImage = localImages[selectedVariant?.image] || selectedVariant?.image || imageSrc
  const inWishlist = isInWishlist(product._id, selectedVariant?._id)
  const sellable = selectedVariant || product
  const parsedStock = Number(sellable.stock)
  const stockLimit = sellable.stock !== undefined && sellable.stock !== null && sellable.stock !== '' && Number.isFinite(parsedStock)
    ? Math.max(0, Math.floor(parsedStock))
    : null
  const isOutOfStock = selectedVariant ? (!selectedVariant.isAvailable || stockLimit === 0) : stockLimit === 0
  const canIncreaseQuantity = stockLimit === null || quantity < stockLimit
  const price = Number(sellable.price) || 0
  const originalPrice = Number(sellable.originalPrice) || 0

  const handleAddToCart = () => {
    if (adding) return
    setAdding(true)
    addToCart(product, quantity, selectedVariant)
    toast.success(`${quantity} ${product.name}${selectedVariant ? ` — ${selectedVariant.packSize}` : ''} added to bag`, { id: `add-${product._id}-${selectedVariant?._id || 'default'}` })
    setTimeout(() => setAdding(false), 700)
  }

  return (
    <main className="page-shell section-space max-w-5xl">
      <Link to={returnTo} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ChevronLeft size={16} />
        Back to {product.category}
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Reveal direction="scale" className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[#f2f6ff] p-6">
          {imageSrc ? (
            <img src={displayImage} alt={product.name} loading="eager" onError={(event) => { event.currentTarget.style.display = 'none' }} className="h-full w-full object-contain mix-blend-multiply" />
          ) : (
            <span className="text-sm text-stone-500">Image unavailable</span>
          )}
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <p className="eyebrow mb-3">Ayusydah wellness</p><h1 className="section-title mb-3">{product.name}</h1>
          <div className="mb-4 flex items-center gap-1"><Star size={16} className="fill-brand-gold text-brand-gold" /><span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span></div>
          <div className="mb-6 flex items-center gap-3"><span className="text-2xl font-bold text-brand-blue">RM {price.toFixed(2)}</span>{originalPrice > price && <span className="text-lg text-gray-400 line-through">RM {originalPrice.toFixed(2)}</span>}</div>
          <ProductDescription description={product.description} />
          <ProductVideo product={product} />

          {variants.length > 0 && (
            <fieldset className="mb-6">
              <legend className="mb-3 text-sm font-semibold text-stone-700">Pack size{selectedVariant ? `: ${selectedVariant.packSize}` : ''}</legend>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const unavailable = !variant.isAvailable || Number(variant.stock) === 0
                  return <button key={variant._id} type="button" disabled={unavailable} onClick={() => { setSelectedVariantId(variant._id); setQuantity(1) }} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${selectedVariant?._id === variant._id ? 'border-brand-blue bg-brand-blue text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-brand-blue'} disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400 disabled:line-through`}>
                    {variant.packSize}{unavailable ? ' · Unavailable' : ''}
                  </button>
                })}
              </div>
              {selectedVariant?.sku && <p className="mt-2 text-xs text-stone-500">SKU: {selectedVariant.sku}</p>}
            </fieldset>
          )}

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
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleWishlist(selectedVariant ? { ...product, variantId: selectedVariant._id, packSize: selectedVariant.packSize, price, image: selectedVariant.image || product.image } : product)} aria-label={`${inWishlist ? 'Remove' : 'Add'} ${product.name} ${inWishlist ? 'from' : 'to'} wishlist`} className={`rounded-full border px-5 ${inWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500 hover:text-brand-blue'}`}>
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
