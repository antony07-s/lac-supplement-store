import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import CategoryCard from '../components/category/CategoryCard.jsx'

function ShopByHealthGoal() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/health-goals')
      .then((res) => setGoals(res.data))
      .catch((err) => console.error('Failed to load health goals:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Start with what matters</p>
      <h2 className="section-title mt-2 mb-8">Shop by health goal</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {goals.map((goal) => (
            <CategoryCard key={goal._id} category={goal} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ShopByHealthGoal