import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import CategoryCard from '../components/category/CategoryCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'

function FeaturedCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Curated for you</p>
      <h2 className="section-title mt-2 mb-8">Shop by category</h2>
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((cat) => (
            <StaggerItem key={cat._id}>
              <CategoryCard category={cat} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </section>
  )
}

export default FeaturedCategories
