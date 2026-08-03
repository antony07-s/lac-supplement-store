/* Context providers intentionally export their consumer hook from the same module. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id)
      if (exists) {
        return prev.filter((item) => item._id !== product._id)
      }
      return [...prev, product]
    })
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId)
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