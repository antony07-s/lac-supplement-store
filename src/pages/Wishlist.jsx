import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import bp4 from '../assets/BP4.png'

const localImages = { BP4: bp4 }

function Wishlist() {
    const { wishlistItems, toggleWishlist } = useWishlist()
    const { addToCart } = useCart()

    if (wishlistItems.length === 0) {
        return (
            <main className="page-shell py-24 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h1>
                <p className="text-gray-500 mb-6">Save items you love to find them here later.</p>
                <Link to="/" className="text-brand-blue font-semibold hover:underline">
                    Continue Shopping
                </Link>
            </main>
        )
    }

    return (
        <main className="page-shell section-space max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Wishlist</h1>

            <div className="space-y-4">
                {wishlistItems.map((item) => {
                    const imageSrc = localImages[item.image] || item.image
                    return (
                        <div key={item._id} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f2f6ff] p-2">
                                {imageSrc ? <img src={imageSrc} alt={item.name} onError={(event) => { event.currentTarget.style.display = 'none' }} className="h-full w-full object-contain" /> : <span className="text-[10px] text-stone-500">No image</span>}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-brand-blue font-semibold">RM {(Number(item.price) || 0).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => addToCart(item)}
                                className="text-xs bg-brand-blue text-white font-semibold px-4 py-2 rounded-full hover:bg-brand-blue-dark"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => toggleWishlist(item)}
                                className="text-xs text-gray-400 hover:text-red-500"
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
