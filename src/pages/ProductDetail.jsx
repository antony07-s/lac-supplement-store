import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, ChevronLeft } from 'lucide-react'
import products from '../data/products.json'
import bp4 from '../assets/BP4.png'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

const localImages = { BP4: bp4 }

function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/" className="text-brand-blue hover:underline">Back to Home</Link>
      </div>
    )
  }

  const imageSrc = localImages[product.image] || product.image
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto">
      <Link
        to={`/category/${encodeURIComponent(product.category)}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue mb-6"
      >
        <ChevronLeft size={16} />
        Back to {product.category}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-xl flex items-center justify-center p-8">
          <img src={imageSrc} alt={product.name} className="max-h-96 object-contain" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

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

          <p className="text-gray-600 mb-8">{product.description}</p>

          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark transition-colors"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`px-5 rounded-full border ${
                inWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500 hover:text-brand-blue'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail