import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Ayusydah | Everyday wellness',
  '/products': 'Shop supplements | Ayusydah',
  '/cart': 'Your cart | Ayusydah',
  '/login': 'Sign in | Ayusydah',
  '/register': 'Create an account | Ayusydah',
}

const pageDescriptions = {
  '/': 'Shop AYUSYDAH natural wellness products, including herbal supplements, Ayurvedic wellness, juices, and skin and hair care in Malaysia.',
  '/products': 'Browse AYUSYDAH wellness products and find the right option for your everyday routine.',
  '/cart': 'Review your AYUSYDAH shopping bag before checkout.',
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const isProduct = pathname.startsWith('/product/')
    const title = pageTitles[pathname] || (isProduct ? 'Product details | Ayusydah' : pathname.startsWith('/category/') ? 'Shop wellness | Ayusydah' : 'Ayusydah | Everyday wellness')
    const description = pageDescriptions[pathname] || (isProduct ? 'Explore AYUSYDAH product details, ingredients, and purchase options.' : 'AYUSYDAH natural wellness products for everyday life.')
    document.title = title
    const canonical = new URL(pathname, window.location.origin).href
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) { descriptionTag = document.createElement('meta'); descriptionTag.name = 'description'; document.head.appendChild(descriptionTag) }
    descriptionTag.content = description
    for (const [property, content] of [['og:title', title], ['og:description', description], ['og:type', isProduct ? 'product' : 'website'], ['og:url', canonical]]) {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag) }
      tag.content = content
    }
    if (!isProduct) {
      let schema = document.querySelector('#site-structured-data')
      if (!schema) { schema = document.createElement('script'); schema.id = 'site-structured-data'; schema.type = 'application/ld+json'; document.head.appendChild(schema) }
      schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'AYUSYDAH', url: window.location.origin, potentialAction: { '@type': 'SearchAction', target: `${window.location.origin}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } })
    }
  }, [pathname])

  return null
}
