/* global process */
const SITE_URL = 'https://www.ayusydah.com'
const STATIC_PATHS = [
  '/', '/products', '/about-us', '/contact-us', '/terms', '/privacy-policy',
  '/refund-policy', '/shipping-policy', '/faq', '/careers', '/site-map',
]

const escapeXml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
}[character]))

async function readJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Catalogue API returned ${response.status}`)
  return response.json()
}

export default async function sitemap(req, res) {
  const apiHost = process.env.VITE_API_URL?.replace(/\/$/, '')
  if (!apiHost) return res.status(503).send('Sitemap API is not configured')

  try {
    const [categories, firstPage] = await Promise.all([
      readJson(`${apiHost}/api/categories`),
      readJson(`${apiHost}/api/products?page=1&limit=50`),
    ])
    const products = Array.isArray(firstPage) ? [...firstPage] : [...(firstPage.products || [])]
    const total = Array.isArray(firstPage) ? products.length : Number(firstPage.total || 0)
    const pageCount = Math.ceil(total / 50)
    for (let page = 2; page <= pageCount; page += 1) {
      const data = await readJson(`${apiHost}/api/products?page=${page}&limit=50`)
      products.push(...(Array.isArray(data) ? data : data.products || []))
    }

    const categoryNames = new Set((Array.isArray(categories) ? categories : []).map((category) => category.name).filter(Boolean))
    products.forEach((product) => { if (product.category) categoryNames.add(product.category) })
    const urls = [
      ...STATIC_PATHS.map((path) => `${SITE_URL}${path}`),
      ...[...categoryNames].map((name) => `${SITE_URL}/category/${encodeURIComponent(name)}`),
      ...products.filter((product) => product._id).map((product) => `${SITE_URL}/product/${product._id}`),
    ]
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('')}</urlset>`
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(xml)
  } catch (error) {
    console.error('Sitemap generation failed:', error.message)
    return res.status(502).send('Unable to generate sitemap')
  }
}
