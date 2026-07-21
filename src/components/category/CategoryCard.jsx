import { Link } from 'react-router-dom'

function CategoryCard({ category }) {
  return (
    <Link to={`/category/${encodeURIComponent(category.name)}`} className="group block min-w-0 text-center">
      <div className="overflow-hidden rounded-2xl bg-stone-100 shadow-sm transition duration-300 group-hover:shadow-lg">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm font-bold text-stone-800 group-hover:text-brand-blue">
        {category.name}
      </p>
    </Link>
  )
}

export default CategoryCard
