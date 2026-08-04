import { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom'
import api from '../api/axios.js'
import ProductCard from '../components/product/ProductCard.jsx'

function ProductListing() {
    const PRODUCTS_PER_PAGE = 10
    const { category } = useParams()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const searchTerm = searchParams.get('q')?.trim() || ''
    const decodedCategory = category ? decodeURIComponent(category) : ''
    const showAllProducts = location.pathname === '/products'

    useEffect(() => {
        api.get('/products')
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.error('Failed to load products:', err)
                setError('Unable to load products right now. Please try again shortly.')
            })
            .finally(() => setLoading(false))
    }, [])

    const filteredProducts = searchTerm
        ? products.filter((p) => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase()))
        : showAllProducts ? products : products.filter((p) => p.category === decodedCategory)

    const title = searchTerm ? `Search results for "${searchTerm}"` : showAllProducts ? 'All products' : decodedCategory
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
    const page = Math.min(currentPage, totalPages)
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE,
    )

    useEffect(() => {
        // A new search/category always starts from the first results page.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1)
    }, [searchTerm, decodedCategory, showAllProducts])

    return (
        <main className="page-shell section-space">
            <p className="text-xs text-gray-400 mb-2">
                <Link to="/" className="hover:text-brand-blue hover:underline">Home</Link>
                {' > '}
                {title}
            </p>
            <h1 className="section-title mb-8">{title}</h1>

            {loading ? (
                <p className="text-gray-500">Loading products...</p>
            ) : error ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">{error}</div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">We're curating this collection now. Explore our daily essentials while you wait.</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <nav aria-label="Product pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                            disabled={page === 1}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => setCurrentPage(pageNumber)}
                                aria-current={pageNumber === page ? 'page' : undefined}
                                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition ${pageNumber === page ? 'bg-brand-blue text-white' : 'border border-stone-300 text-brand-blue hover:bg-stone-100'}`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
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
