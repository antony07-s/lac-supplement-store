import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom'
import { getWithRetry } from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'

function ProductListing() {
    const PRODUCTS_PER_PAGE = 10
    const { category } = useParams()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const headingRef = useRef(null)

    const searchTerm = searchParams.get('q')?.trim().slice(0, 100) || ''
    const currentPage = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)
    const decodedCategory = category ? decodeURIComponent(category) : ''
    const showAllProducts = location.pathname === '/products'

    useEffect(() => {
        const controller = new AbortController()
        const params = { page: currentPage, limit: PRODUCTS_PER_PAGE }
        if (searchTerm) params.search = searchTerm
        else if (!showAllProducts && decodedCategory) params.category = decodedCategory

        getWithRetry('/products', { params, signal: controller.signal })
            .then((res) => {
                const returnedProducts = Array.isArray(res.data) ? res.data : (res.data.products || [])
                const isLegacyResponse = Array.isArray(res.data)
                setProducts(isLegacyResponse
                    ? returnedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)
                    : returnedProducts)
                setTotal(isLegacyResponse ? returnedProducts.length : (res.data.total || 0))
            })
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return
                setError('Unable to load products right now. Please try again shortly.')
            })
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [currentPage, decodedCategory, searchTerm, showAllProducts])

    const title = searchTerm ? `Search results for "${searchTerm}"` : showAllProducts ? 'All products' : decodedCategory
    const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
    const page = Math.min(currentPage, totalPages)

    const changePage = (nextPage) => {
        const nextParams = new URLSearchParams(searchParams)
        if (nextPage === 1) nextParams.delete('page')
        else nextParams.set('page', String(nextPage))
        setSearchParams(nextParams)
        headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main className="page-shell section-space">
            <p className="text-xs text-gray-400 mb-2">
                <Link to="/" className="hover:text-brand-blue hover:underline">Home</Link>
                {' > '}
                {title}
            </p>
            <h1 ref={headingRef} className="section-title mb-8 scroll-mt-28">{title}</h1>

            {loading ? (
                <p className="text-gray-500">Loading products...</p>
            ) : error ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">{error}</div>
            ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">We're curating this collection now. Explore our daily essentials while you wait.</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <nav aria-label="Product pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => changePage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                            onClick={() => changePage(pageNumber)}
                                aria-current={pageNumber === page ? 'page' : undefined}
                                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition ${pageNumber === page ? 'bg-brand-blue text-white' : 'border border-stone-300 text-brand-blue hover:bg-stone-100'}`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => changePage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    )
}

export default ProductListing
