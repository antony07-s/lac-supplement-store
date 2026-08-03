import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import CategoryCard from '../components/category/CategoryCard.jsx'

function FeaturedCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-shell section-space">
      <p className="eyebrow">Curated for you</p>
      <h2 className="section-title mt-2 mb-8">Shop by category</h2>
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedCategories