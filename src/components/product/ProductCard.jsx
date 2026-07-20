import { Star, Heart, ShoppingCart } from 'lucide-react'
import bp4 from '../../assets/BP4.png'

const localImages = { BP4: bp4 }

function ProductCard({ product }) {
  const imageSrc = localImages[product.image] || product.image
  const hasDiscount = product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 relative">
      {hasDiscount && (
        <span className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discountPercent}%
        </span>
      )}

      <button className="absolute top-3 right-3 z-10 text-gray-400 hover:text-brand-blue">
        <Heart size={20} />
      </button>

      <div className="overflow-hidden rounded-lg bg-gray-50 mb-3">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-48 object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
        {product.name}
      </h3>

      <div className="flex items-center gap-1 mb-2">
        <Star size={14} className="fill-brand-gold text-brand-gold" />
        <span className="text-xs text-gray-600">
          {product.rating} ({product.reviews})
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold text-brand-blue">
          RM {product.price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-400 line-through">
            RM {product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white text-sm font-semibold py-2 rounded-full hover:bg-brand-blue-dark transition-colors">
        <ShoppingCart size={16} />
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard