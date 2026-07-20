function CategoryCard({ category }) {
  return (
    <div className="group cursor-pointer text-center">
      <div className="overflow-hidden rounded-xl shadow-sm">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 font-semibold text-gray-800 group-hover:text-brand-blue">
        {category.name}
      </p>
    </div>
  )
}

export default CategoryCard