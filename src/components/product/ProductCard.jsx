import { Star, Heart, ShoppingBag, PackageCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useRef, useState } from 'react'
import bp4 from '../../assets/BP4.png'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { showCartToast } from '../../utils/cartToast.js'
import { trackEvent } from '../../utils/telemetry.js'
import { cloudinaryImage, cloudinarySrcSet } from '../../utils/cloudinaryImage.js'

const localImages = { BP4: bp4 }

function ProductCard({ product, priority = false }) {
    const location = useLocation()
    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product._id)
    const defaultVariant = Array.isArray(product.variants) ? product.variants.find((variant) => variant.isAvailable && Number(variant.stock) !== 0) || product.variants[0] : null
    const outOfStock = defaultVariant ? (!defaultVariant.isAvailable || Number(defaultVariant.stock) === 0) : Number(product.stock) === 0
    const lowStock = !outOfStock && Number(defaultVariant?.stock ?? product.stock) > 0 && Number(defaultVariant?.stock ?? product.stock) <= 5
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 1
    const image = localImages[defaultVariant?.image] || defaultVariant?.image || localImages[product.image] || product.image
    const optimizedImage = cloudinaryImage(image, { width: 480, height: 480 })
    const imageSrcSet = cloudinarySrcSet(image, [240, 360, 480], { height: 480 })
    const price = Number(defaultVariant?.price ?? product.price) || 0
    const originalPrice = Number(defaultVariant?.originalPrice ?? product.originalPrice) || 0
    const discount = originalPrice > price
        ? Math.round((1 - price / originalPrice) * 100)
        : null

    const [adding, setAdding] = useState(false)
    const addingRef = useRef(false)
    const productUrl = `/product/${product._id}?returnTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`

    const add = () => {
        if (addingRef.current) return
        addingRef.current = true
        setAdding(true)
        addToCart(product, 1, defaultVariant)
        trackEvent('add_to_cart', { item_id: product._id, item_name: product.name, value: price, currency: 'MYR' })
        showCartToast(`${product.name}${defaultVariant ? ` — ${defaultVariant.packSize}` : ''} added to bag`)
        setTimeout(() => { addingRef.current = false; setAdding(false) }, 700)
    }

    return (
        <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(23,37,84,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
            {discount && (
                <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-brand-gold px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white">
                    SAVE {discount}%
                </span>
            )}

            <button
                onClick={() => toggleWishlist(product)}
                aria-label={`${inWishlist ? 'Remove' : 'Add'} ${product.name} ${inWishlist ? 'from' : 'to'} wishlist`}
                className={`absolute right-3.5 top-3.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-sm ${inWishlist ? 'text-rose-500' : 'text-stone-500 hover:text-brand-blue'}`}
            >
                <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>

            <Link to={productUrl} onClick={() => trackEvent('view_item', { item_id: product._id, item_name: product.name, value: price, currency: 'MYR' })} className="aspect-square w-full overflow-hidden bg-white flex items-center justify-center p-3 border-b border-stone-100">
                <img
                    src={optimizedImage}
                    srcSet={imageSrcSet}
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 240px"
                    alt={product.name}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    decoding="async"
                    onError={(event) => { event.currentTarget.style.display = 'none' }}
                    className="h-full w-full object-contain"
                />
            </Link>

            <div className="flex flex-1 flex-col px-1 pt-2.5">
                <p className="min-h-4 truncate text-[9px] font-bold uppercase tracking-widest leading-4 text-brand-blue/65">
                    {product.category || 'Ayusydah'}
                </p>

                                <Link to={productUrl} className="mt-1 min-h-[2.5rem] text-xs font-bold leading-4 text-stone-800 hover:text-brand-blue line-clamp-2 sm:min-h-[2.75rem] sm:text-sm sm:leading-5">
                    {product.name}
                </Link>
                <p className="mt-1 min-h-4 text-[10px] font-medium text-stone-500">{hasVariants ? `${product.variants.length} sizes available` : ''}</p>

                <div className="mt-1.5 flex min-h-[1.125rem] items-center gap-1 text-[11px] text-stone-500">
                    <Star size={12} className="fill-brand-gold text-brand-gold" />
                    <span>{product.rating} <span className="text-stone-400">({product.reviews})</span></span>
                </div>

                <div className="mt-2 flex min-h-5 items-baseline gap-1.5 tabular-nums">
                    <span className="text-sm font-extrabold text-brand-blue sm:text-base">
                        RM {price.toFixed(2)}
                    </span>
                    {discount && (
                        <del className="text-[10px] text-stone-400">
                            RM {originalPrice.toFixed(2)}
                        </del>
                    )}
                </div>

                <p className="mt-1.5 flex min-h-4 items-center gap-1 text-[10px] font-semibold text-amber-700">{lowStock && <><PackageCheck size={12} /> Only {defaultVariant?.stock ?? product.stock} left</>}</p>

                <button onClick={add} disabled={adding || outOfStock} className="mt-auto flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full bg-brand-blue px-2 text-[11px] font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-70"><ShoppingBag size={14} />{outOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to bag'}</button>
            </div>
        </article>
    )
}

export default ProductCard
