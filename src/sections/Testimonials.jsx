import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api/axios.js'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    api.get('/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error('Failed to load testimonials:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="px-8 py-12 text-center max-w-2xl mx-auto">
        <p className="text-gray-500">Loading testimonials...</p>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const testimonial = testimonials[current]

  const goPrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const goNext = () => setCurrent((prev) => (prev + 1) % testimonials.length)

  return (
    <section className="px-8 py-12 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        What Our Customers Say
      </h2>

      <div className="flex items-center justify-center gap-4">
        <button onClick={goPrev} className="text-gray-400 hover:text-brand-blue">
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1">
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} size={18} className="fill-brand-gold text-brand-gold" />
            ))}
          </div>
          <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
          <p className="font-semibold text-gray-800">{testimonial.name}</p>
        </div>

        <button onClick={goNext} className="text-gray-400 hover:text-brand-blue">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full ${index === current ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Testimonials