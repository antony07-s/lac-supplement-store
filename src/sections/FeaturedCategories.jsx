import categories from '../data/categories.json'
import CategoryCard from '../components/category/CategoryCard.jsx'

function FeaturedCategories() {
  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Curated for you</p>
      <h2 className="section-title mt-2 mb-8">Shop by category</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories
