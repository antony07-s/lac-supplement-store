import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, ChevronLeft } from 'lucide-react'
import products from '../data/products.json'
import bp4 from '../assets/BP4.png'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import toast from 'react-hot-toast'

const localImages = { BP4: bp4 }

function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) {
    return (
      <div className="page-shell section-space text-center">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/" className="text-brand-blue hover:underline">Back to Home</Link>
      </div>
    )
  }

  const imageSrc = localImages[product.image] || product.image
  const inWishlist = isInWishlist(product.id)

  return (
    <main className="page-shell section-space max-w-5xl">
      <Link
        to={`/category/${encodeURIComponent(product.category)}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue mb-6"
      >
        <ChevronLeft size={16} />
        Back to {product.category}
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[#f1f4ed] p-6">
          <img src={imageSrc} alt={product.name} loading="eager" className="h-full w-full object-contain mix-blend-multiply" />
        </div>

        <div>
          <p className="eyebrow mb-3">Ayusydah wellness</p><h1 className="section-title mb-3">{product.name}</h1>

          <div className="flex items-center gap-1 mb-4">
            <Star size={16} className="fill-brand-gold text-brand-gold" />
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-brand-blue">
              RM {product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                RM {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-sm leading-7 text-stone-600 mb-8">{product.description}</p>

          <div className="flex gap-3">
            <button
              onClick={() => { addToCart(product); toast.success(`${product.name} added to bag`) }}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark transition-colors"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`px-5 rounded-full border ${inWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500 hover:text-brand-blue'
                }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail
