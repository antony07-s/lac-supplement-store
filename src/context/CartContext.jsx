/* Context providers intentionally export their consumer hook from the same module. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext()
const CART_STORAGE_KEY = 'ayusydah-cart'

const getStoredCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    const parsedCart = savedCart ? JSON.parse(savedCart) : []
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
}

const getStockLimit = (product) => {
  const stock = product?.stock
  if (stock === undefined || stock === null || stock === '') return null
  const parsedStock = Number(stock)
  return Number.isFinite(parsedStock) ? Math.max(0, Math.floor(parsedStock)) : null
}

const getSafeQuantity = (quantity) => {
  const parsedQuantity = Number(quantity)
  return Number.isFinite(parsedQuantity) ? Math.max(1, Math.floor(parsedQuantity)) : 1
}

const getSafePrice = (price) => {
  const parsedPrice = Number(price)
  return Number.isFinite(parsedPrice) ? parsedPrice : 0
}

const mergeCarts = (localItems, serverItems) => {
  const merged = [...serverItems]
  localItems.forEach((localItem) => {
    const existing = merged.find((item) => item._id === localItem._id)
    if (existing) {
      const stockLimit = getStockLimit(existing)
      const combined = getSafeQuantity(existing.quantity) + getSafeQuantity(localItem.quantity)
      existing.quantity = stockLimit === null ? combined : Math.min(combined, stockLimit)
    } else {
      merged.push(localItem)
    }
  })
  return merged
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState(getStoredCart)
  const hasMergedForUser = useRef(null)
  const isFirstRun = useRef(true)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    const wasFirstRun = isFirstRun.current
    isFirstRun.current = false

    if (!user) {
      hasMergedForUser.current = null
      return
    }
    if (hasMergedForUser.current === user.id) return

    let active = true
    api.get('/cart')
      .then((res) => {
        if (!active) return
        const serverItems = Array.isArray(res.data) ? res.data : []
        setCartItems((currentLocalItems) => (
          wasFirstRun ? serverItems : mergeCarts(currentLocalItems, serverItems)
        ))
        hasMergedForUser.current = user.id
      })
      .catch((err) => console.error('Failed to load saved cart:', err))

    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!user || hasMergedForUser.current !== user.id) return
    const items = cartItems.map((item) => ({ productId: item._id, quantity: getSafeQuantity(item.quantity) }))
    api.put('/cart', { items }).catch((err) => console.error('Failed to sync cart:', err))
  }, [cartItems, user])

  const addToCart = (product, quantity = 1) => {
    setCartItems((previousItems) => {
      const requestedQuantity = getSafeQuantity(quantity)
      const stockLimit = getStockLimit(product)
      const existingItem = previousItems.find((item) => item._id === product._id)

      if (existingItem) {
        return previousItems.map((item) => item._id === product._id
          ? {
            ...item,
            ...product,
            quantity: stockLimit === null
              ? getSafeQuantity(item.quantity) + requestedQuantity
              : Math.min(getSafeQuantity(item.quantity) + requestedQuantity, stockLimit),
          }
          : item)
      }

      if (stockLimit === 0) return previousItems
      return [...previousItems, {
        ...product,
        quantity: stockLimit === null ? requestedQuantity : Math.min(requestedQuantity, stockLimit),
      }]
    })
  }

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((previousItems) => previousItems.map((item) => {
      if (item._id !== productId) return item
      const stockLimit = getStockLimit(item)
      const requestedQuantity = getSafeQuantity(quantity)
      return {
        ...item,
        quantity: stockLimit === null ? requestedQuantity : Math.min(requestedQuantity, stockLimit),
      }
    }))
  }

  const removeFromCart = (productId) => {
    setCartItems((previousItems) => previousItems.filter((item) => item._id !== productId))
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((count, item) => count + getSafeQuantity(item.quantity), 0)
  const subtotal = useMemo(
    () => cartItems.reduce((amount, item) => amount + getSafePrice(item.price) * getSafeQuantity(item.quantity), 0),
    [cartItems],
  )
  const total = subtotal

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      total,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}