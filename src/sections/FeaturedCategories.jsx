import { useState, useEffect } from 'react'
import { getWithRetry } from '../api/axios.js'
import CategoryCard from '../components/category/CategoryCard.jsx'
import { StaggerGrid, StaggerItem } from '../components/Frame/StaggerGrid.jsx'

const juices = {
  _id: 'juices',
  name: 'Juices',
  image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=85',
}

function FeaturedCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWithRetry('/categories')
      .then((res) => {
        const received = Array.isArray(res.data) ? res.data : []
        setCategories(received.some((category) => category.name === juices.name)
          ? received
          : [...received, juices])
      })
      .catch(() => setCategories([juices]))
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
