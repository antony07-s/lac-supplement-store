import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const slides = [
  { id: 1, eyebrow: 'New daily ritual', heading: 'Wellness that fits your life.', copy: 'Thoughtfully selected vitamins and natural nutrition, delivered to your door.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1800&q=90' },
  { id: 2, eyebrow: 'Feel your best', heading: 'Small habits. Lasting vitality.', copy: 'Build a nourishing routine with dependable support for every day.', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=90' },
  { id: 3, eyebrow: 'Member favourites', heading: 'A better way to replenish.', copy: 'Shop essentials formulated to support energy, balance and recovery.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=90' },
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (!paused) { const timer = setInterval(() => setCurrent((i) => (i + 1) % slides.length), 6000); return () => clearInterval(timer) } }, [paused])
  const active = slides[current]
  const previous = () => setCurrent((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent((i) => (i + 1) % slides.length)
  return <section aria-label="Featured wellness offers" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative isolate overflow-hidden bg-[#e8efe5]">
    <img src={active.image} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#143a25]/95 via-[#143a25]/72 to-[#143a25]/10" />
    <div className="page-shell relative flex min-h-[390px] items-center py-16 sm:min-h-[460px]">
      <div className="max-w-xl text-white"><p className="eyebrow !text-[#f7e7c2]">{active.eyebrow}</p><h1 className="mt-3 text-4xl font-bold tracking-[-.05em] sm:text-5xl lg:text-6xl">{active.heading}</h1><p className="mt-5 max-w-md text-base leading-7 text-white/90 sm:text-lg">{active.copy}</p><Link to="/category/Vitamins%20%26%20Supplements" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-brand-blue transition hover:bg-brand-gold hover:text-white">Shop essentials</Link></div>
    </div>
    <div className="absolute inset-x-0 bottom-5"><div className="page-shell flex items-center justify-between"><div className="flex gap-2">{slides.map((slide, i) => <button key={slide.id} onClick={() => setCurrent(i)} aria-label={`Show slide ${i + 1}`} aria-current={i === current} className={`h-2.5 rounded-full transition-all ${i === current ? 'w-7 bg-white' : 'w-2.5 bg-white/55'}`} />)}</div><div className="flex gap-2"><button onClick={previous} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-blue hover:bg-white"><ChevronLeft size={20} /></button><button onClick={next} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-blue hover:bg-white"><ChevronRight size={20} /></button></div></div></div>
  </section>
}
export default HeroSlider
