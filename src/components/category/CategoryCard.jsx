import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cloudinaryImage, cloudinarySrcSet } from '../../utils/cloudinaryImage.js'

function CategoryCard({ category, to }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <Link to={to || `/category/${encodeURIComponent(category.name)}`} className="group block min-w-0 text-center">
        <div className="overflow-hidden rounded-2xl bg-stone-100 shadow-sm transition duration-300 group-hover:shadow-lg">
          <img
            src={cloudinaryImage(category.image, { width: 640, height: 480, crop: 'fill' })}
            srcSet={cloudinarySrcSet(category.image, [320, 480, 640], { height: 480, crop: 'fill' })}
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 200px"
            alt={category.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p className="mt-3 text-sm font-bold text-stone-800 group-hover:text-brand-blue">
          {category.name}
        </p>
      </Link>
    </motion.div>
  )
}

export default CategoryCard
