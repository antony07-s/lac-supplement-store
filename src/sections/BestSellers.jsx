import products from '../data/products.json'
import ProductCard from '../components/product/ProductCard.jsx'

function BestSellers() {
  return (
    <section className="px-8 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Best Sellers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default BestSellers