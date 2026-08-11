import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import CategoryCard from '../components/category/CategoryCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'

function ShopByHealthGoal() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/health-goals')
      .then((res) => setGoals(res.data))
      .catch(() => setGoals([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Start with what matters</p>
      <h2 className="section-title mt-2 mb-8">Shop by health goal</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {goals.map((goal) => (
            <StaggerItem key={goal._id}>
              <CategoryCard category={goal} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </section>
  )
}

export default ShopByHealthGoal
