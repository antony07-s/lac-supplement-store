import { useParams, Link  } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/product/ProductCard.jsx'

function ProductListing() {
    const { category } = useParams()
    const decodedCategory = decodeURIComponent(category)

    const filteredProducts = products.filter((p) => p.category === decodedCategory)

    return (
        <div className="px-8 py-10">
            <p className="text-xs text-gray-400 mb-2">
                <Link to="/" className="hover:text-brand-blue hover:underline">Home</Link>
                {' > '}
                {decodedCategory}
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{decodedCategory}</h1>

            {filteredProducts.length === 0 ? (
                <p className="text-gray-500">No products found in this category yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductListing