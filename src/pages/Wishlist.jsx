import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { showCartToast } from '../utils/cartToast.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { cloudinaryImage } from '../utils/cloudinaryImage.js'


function Wishlist() {
    const { wishlistItems, toggleWishlist } = useWishlist()
    const { addToCart } = useCart()
    const [addingId, setAddingId] = useState(null)

    const handleAddToCart = (item) => {
        if (addingId === item._id) return
        const variant = item.variantId ? item.variants?.find((entry) => entry._id === item.variantId) : null
        const sellable = variant || item
        if ((variant && !variant.isAvailable) || Number(sellable.stock) === 0) return
        setAddingId(item._id)
        if (addToCart(item, 1, variant)) showCartToast(`${item.name} added to bag`)
        setTimeout(() => setAddingId(null), 700)
    }

    if (wishlistItems.length === 0) {
        return (
            <main className="page-shell grid min-h-[55vh] place-items-center py-16 text-center">
                <section className="surface-card w-full max-w-xl px-6 py-12 sm:px-10">
                    <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-brand-blue"><Heart size={25} /></div>
                    <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">Your Wishlist is Empty</h1>
                    <p className="mb-6 text-gray-500">Save items you love to find them here later.</p>
                    <Link to="/products" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-blue-dark">Continue Shopping</Link>
                </section>
            </main>
        )
    }

    return (
        <main className="page-shell section-space max-w-5xl">
            <Link to="/products" className="mb-6 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-blue"><ChevronLeft size={17} /> Back to Products</Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-7 sm:text-4xl">Your Wishlist <span className="text-lg font-medium text-stone-500">({wishlistItems.length})</span></h1>

            <div className="grid gap-3 sm:grid-cols-2">
                {wishlistItems.map((item) => {
                    const imageSrc = item.image
                    const isAdding = addingId === item._id
                    const variant = item.variantId ? item.variants?.find((entry) => entry._id === item.variantId) : null
                    const outOfStock = (variant && !variant.isAvailable) || Number((variant || item).stock) === 0
                    return (
                        <div key={item._id} className="surface-card grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 p-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:p-4">
                            <div className="row-span-2 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f2f6ff] p-2 sm:h-[4.5rem] sm:w-[4.5rem]">
                                {imageSrc ? <img src={cloudinaryImage(imageSrc, { width: 160, height: 160 })} alt={item.name} width="160" height="160" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none' }} className="h-full w-full object-contain" /> : <span className="text-[10px] text-stone-500">No image</span>}
                            </div>
                            <div className="min-w-0">
                                <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-800">{item.name}{item.packSize ? ` — ${item.packSize}` : ''}</p>
                                <p className="mt-1 text-sm font-bold text-brand-blue">RM {(Number(item.price) || 0).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => handleAddToCart(item)}
                                disabled={isAdding || outOfStock}
                                className="min-h-10 rounded-full bg-brand-blue px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 sm:col-start-2 sm:justify-self-start"
                            >
                                {outOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={() => toggleWishlist(item)}
                                aria-label={`Remove ${item.name} from wishlist`}
                                className="min-h-10 justify-self-start px-2 text-xs font-semibold text-gray-500 hover:text-red-500 sm:col-start-2"
                            >
                                Remove
                            </button>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

export default Wishlist
