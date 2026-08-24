import { Star, Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'
import bp4 from '../../assets/BP4.png'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'

const localImages = { BP4: bp4 }

function ProductCard({ product }) {
    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product._id)
    const defaultVariant = Array.isArray(product.variants) ? product.variants.find((variant) => variant.isAvailable && Number(variant.stock) !== 0) || product.variants[0] : null
    const image = localImages[defaultVariant?.image] || defaultVariant?.image || localImages[product.image] || product.image
    const price = Number(defaultVariant?.price ?? product.price) || 0
    const originalPrice = Number(defaultVariant?.originalPrice ?? product.originalPrice) || 0
    const discount = originalPrice > price
        ? Math.round((1 - price / originalPrice) * 100)
        : null

    const [adding, setAdding] = useState(false)

    const add = () => {
        if (adding) return
        setAdding(true)
        addToCart(product, 1, defaultVariant)
        toast.success(`${product.name}${defaultVariant ? ` — ${defaultVariant.packSize}` : ''} added to bag`, { id: `add-${product._id}-${defaultVariant?._id || 'default'}` })
        setTimeout(() => setAdding(false), 700)
    }

    return (
        <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_1px_2px_rgba(23,37,84,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
            {discount && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white">
                    SAVE {discount}%
                </span>
            )}

            <button
                onClick={() => toggleWishlist(product)}
                aria-label={`${inWishlist ? 'Remove' : 'Add'} ${product.name} ${inWishlist ? 'from' : 'to'} wishlist`}
                className={`absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm ${inWishlist ? 'text-rose-500' : 'text-stone-500 hover:text-brand-blue'}`}
            >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            {/* <Link to={`/product/${product._id}`} className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-stone-800 hover:text-brand-blue"></Link> */}
            <Link to={`/product/${product._id}`} className="aspect-square w-full overflow-hidden bg-white flex items-center justify-center p-6 border-b border-stone-100">
                <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => { event.currentTarget.style.display = 'none' }}
                    className="h-full w-full object-contain"
                />
            </Link>

            <div className="flex flex-1 flex-col px-1 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue/65">
                    Ayusydah
                </p>

                <Link to={`/product/${product._id}`} className="mt-1 block h-10 overflow-hidden text-sm font-bold leading-5 text-stone-800 hover:text-brand-blue">
                    {product.name}
                </Link>

                <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                    <Star size={14} className="fill-brand-gold text-brand-gold" />
                    <span>{product.rating} <span className="text-stone-400">({product.reviews})</span></span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-brand-blue">
                        RM {price.toFixed(2)}
                    </span>
                    {discount && (
                        <del className="text-xs text-stone-400">
                            RM {originalPrice.toFixed(2)}
                        </del>
                    )}
                </div>

                <button
                    onClick={add}
                    disabled={adding}
                    className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-3 text-xs font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-70"
                >
                    <ShoppingBag size={16} />
                    {adding ? 'Adding...' : 'Add to bag'}
                </button>
            </div>
        </article>
    )
}

export default ProductCard
