import categories from '../data/categories.json'
import CategoryCard from '../components/category/CategoryCard.jsx'

function FeaturedCategories() {
  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories