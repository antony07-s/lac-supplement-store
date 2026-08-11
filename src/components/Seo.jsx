import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Ayusydah | Everyday wellness',
  '/products': 'Shop supplements | Ayusydah',
  '/cart': 'Your cart | Ayusydah',
  '/login': 'Sign in | Ayusydah',
  '/register': 'Create an account | Ayusydah',
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = pageTitles[pathname] || (pathname.startsWith('/product/') ? 'Product details | Ayusydah' : pathname.startsWith('/category/') ? 'Shop wellness | Ayusydah' : 'Ayusydah | Everyday wellness')
    document.title = title
    const canonical = new URL(pathname, window.location.origin).href
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
  }, [pathname])

  return null
}
