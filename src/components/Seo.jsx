import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const siteName = 'AYUSYDAH'
const fallbackDescription = 'Shop AYUSYDAH natural wellness products, including herbal supplements, Ayurvedic wellness, juices, and skin and hair care in Malaysia.'
const socialImage = 'https://res.cloudinary.com/pggies6d/image/upload/f_auto,q_auto,w_1200/v1789990514/hero-banner-clean.jpg.png'
const pageMeta = {
  '/': ['Ayusydah | Natural wellness in Malaysia', fallbackDescription],
  '/products': ['Shop natural wellness products | Ayusydah', 'Browse AYUSYDAH herbal supplements, Ayurvedic wellness, juices, and skin and hair care.'],
  '/cart': ['Your cart | Ayusydah', 'Review your AYUSYDAH shopping bag before checkout.'],
  '/about-us': ['About AYUSYDAH | Natural wellness in Malaysia', 'Learn about AYUSYDAH and our considered approach to natural wellness.'],
  '/contact-us': ['Contact AYUSYDAH', 'Contact AYUSYDAH for product and order support.'],
  '/faq': ['Frequently asked questions | AYUSYDAH', 'Answers to common AYUSYDAH product, delivery, and order questions.'],
  '/shipping-policy': ['Delivery and shipping policy | AYUSYDAH', 'Read AYUSYDAH delivery times, shipping regions, and shipping information.'],
  '/refund-policy': ['Refund policy | AYUSYDAH', 'Read the AYUSYDAH refund and return policy.'],
  '/privacy-policy': ['Privacy policy | AYUSYDAH', 'Read how AYUSYDAH handles personal information.'],
  '/terms': ['Terms and conditions | AYUSYDAH', 'Read the AYUSYDAH terms and conditions.'],
}

const ensureMeta = (selector, attribute, value) => {
  let tag = document.querySelector(selector)
  if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, selector.match(/="([^"]+)/)?.[1] || ''); document.head.appendChild(tag) }
  tag.content = value
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const isProduct = pathname.startsWith('/product/')
    const isPrivate = ['/cart', '/checkout', '/wishlist', '/my-orders', '/track-order', '/login', '/register', '/forgot-password'].some((path) => pathname === path || pathname.startsWith(`${path}/`)) || pathname.startsWith('/orders/') || pathname.startsWith('/admin')
    const [title, description] = pageMeta[pathname] || (isProduct
      ? ['Product details | AYUSYDAH', 'Explore AYUSYDAH product details, ingredients, and purchase options.']
      : pathname.startsWith('/category/') || pathname === '/search'
        ? ['Shop wellness products | AYUSYDAH', 'Find AYUSYDAH wellness products for your everyday routine.']
        : [`${siteName} | Everyday wellness`, fallbackDescription])
    const baseUrl = import.meta.env.PROD ? (import.meta.env.VITE_SITE_URL || 'https://www.ayusydah.com').replace(/\/$/, '') : window.location.origin
    const canonical = `${baseUrl}${pathname}`
    document.title = title
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = canonical
    ensureMeta('meta[name="description"]', 'name', description)
    ensureMeta('meta[property="og:title"]', 'property', title)
    ensureMeta('meta[property="og:description"]', 'property', description)
    ensureMeta('meta[property="og:type"]', 'property', isProduct ? 'product' : 'website')
    ensureMeta('meta[property="og:url"]', 'property', canonical)
    ensureMeta('meta[property="og:image"]', 'property', socialImage)
    ensureMeta('meta[property="og:locale"]', 'property', 'en_MY')
    ensureMeta('meta[name="twitter:card"]', 'name', 'summary_large_image')
    ensureMeta('meta[name="robots"]', 'name', isPrivate ? 'noindex,nofollow' : 'index,follow')
    if (!isProduct) {
      let schema = document.querySelector('#site-structured-data')
      if (!schema) { schema = document.createElement('script'); schema.id = 'site-structured-data'; schema.type = 'application/ld+json'; document.head.appendChild(schema) }
      schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'Organization', name: siteName, url: baseUrl, logo: `${baseUrl}/favicon.svg`, email: 'lsmu@hotmail.com', telephone: '+601172232047' },
        { '@type': 'WebSite', name: siteName, url: baseUrl, potentialAction: { '@type': 'SearchAction', target: `${baseUrl}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      ] })
    }
  }, [pathname])
  return null
}
