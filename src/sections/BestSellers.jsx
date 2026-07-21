import products from '../data/products.json'
import ProductCard from '../components/product/ProductCard.jsx'

function BestSellers() {
  return (
    <section className="bg-[#f4f6f0]"><div className="page-shell section-space">
      <p className="eyebrow">Most loved</p><h2 className="section-title mt-2 mb-8">Best sellers</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div></section>
  )
}

export default BestSellers
