/* Context providers intentionally export their consumer hook from the same module. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from './AuthContext.jsx'

const WishlistContext = createContext()
const WISHLIST_STORAGE_KEY = 'ayusydah-wishlist'

const getStoredWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const mergeWishlists = (localItems, serverItems) => {
  const merged = [...serverItems]
  localItems.forEach((localItem) => {
    if (!merged.find((item) => item._id === localItem._id && item.variantId === localItem.variantId)) {
      merged.push(localItem)
    }
  })
  return merged
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState(getStoredWishlist)
  const hasLoadedForUser = useRef(null)
  const previousUserId = useRef(user?.id ?? null)

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    if (!user) {
      if (previousUserId.current !== null) {
        setWishlistItems([])
        localStorage.removeItem(WISHLIST_STORAGE_KEY)
      }
      hasLoadedForUser.current = null
      previousUserId.current = null
      return
    }

    if (hasLoadedForUser.current === user.id) return

    const isGuestToUserTransition = previousUserId.current === null

    let active = true
    api.get('/wishlist')
      .then((res) => {
        if (!active) return
        const serverItems = Array.isArray(res.data) ? res.data : []
        setWishlistItems((currentLocalItems) => (
          isGuestToUserTransition ? mergeWishlists(currentLocalItems, serverItems) : serverItems
        ))
        hasLoadedForUser.current = user.id
        previousUserId.current = user.id
      })
      .catch((err) => console.error('Failed to load saved wishlist:', err))

    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!user || hasLoadedForUser.current !== user.id) return
    const items = wishlistItems.map((item) => ({ productId: item._id, variantId: item.variantId }))
    api.put('/wishlist', { items }).catch((err) => console.error('Failed to sync wishlist:', err))
  }, [wishlistItems, user])

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
    const exists = prev.find((item) => item._id === product._id && item.variantId === product.variantId)
      if (exists) {
        return prev.filter((item) => !(item._id === product._id && item.variantId === product.variantId))
      }
      return [...prev, product]
    })
  }

  const isInWishlist = (productId, variantId) => {
    return wishlistItems.some((item) => item._id === productId && item.variantId === variantId)
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
