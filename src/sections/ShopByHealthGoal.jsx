import healthGoals from '../data/healthGoals.json'
import CategoryCard from '../components/category/CategoryCard.jsx'

function ShopByHealthGoal() {
  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Start with what matters</p><h2 className="section-title mt-2 mb-8">Shop by health goal</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {healthGoals.map((goal) => (
          <CategoryCard key={goal.id} category={goal} />
        ))}
      </div>
    </section>
  )
}

export default ShopByHealthGoal
