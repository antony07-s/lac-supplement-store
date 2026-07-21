import { useParams, Link, useSearchParams } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/product/ProductCard.jsx'

function ProductListing() {
    const { category } = useParams()
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get('q')?.trim() || ''
    const decodedCategory = category ? decodeURIComponent(category) : ''

    const filteredProducts = searchTerm
        ? products.filter((p) => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase()))
        : products.filter((p) => p.category === decodedCategory)
    const title = searchTerm ? `Search results for “${searchTerm}”` : decodedCategory

    return (
        <main className="page-shell section-space">
            <p className="text-xs text-gray-400 mb-2">
                <Link to="/" className="hover:text-brand-blue hover:underline">Home</Link>
                {' > '}
                {title}
            </p>
            <h1 className="section-title mb-8">{title}</h1>

            {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">We’re curating this collection now. Explore our daily essentials while you wait.</div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    )
}

export default ProductListing
