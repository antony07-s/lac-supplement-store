import toast from 'react-hot-toast'

// All add-to-cart entry points share one stable toast ID. react-hot-toast updates
// this notification in place instead of stacking a notification per product.
export function showCartToast(message) {
  toast.success(message, { id: 'cart-added', duration: 2600 })
}
