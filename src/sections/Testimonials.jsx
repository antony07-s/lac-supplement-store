import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../api/axios.js'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    api.get('/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="page-shell px-4 py-12 text-center">
        <p className="text-gray-500">Loading testimonials...</p>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const testimonial = testimonials[current]

  const goPrev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  const goNext = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }
  const goTo = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  return (
    <section className="page-shell py-14 text-center">
      <p className="eyebrow">Real customer reviews</p>
      <h2 className="section-title mt-2 mb-2">What Our Customers Say</h2>
      <p className="mb-7 text-sm text-stone-600">Wellness journeys shared by our community.</p>

      <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 rounded-2xl border border-emerald-100 bg-[#f7faf5] p-6 sm:p-9">
        <button onClick={goPrev} className="text-gray-400 hover:text-brand-blue">
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={goNext} className="text-gray-400 hover:text-brand-blue">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === current ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
