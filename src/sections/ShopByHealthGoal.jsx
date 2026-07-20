import healthGoals from '../data/healthGoals.json'
import CategoryCard from '../components/category/CategoryCard.jsx'

function ShopByHealthGoal() {
  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Shop by Health Goal
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {healthGoals.map((goal) => (
          <CategoryCard key={goal.id} category={goal} />
        ))}
      </div>
    </section>
  )
}

export default ShopByHealthGoal