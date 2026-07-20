import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import bp4 from '../assets/BP4.png'

const slides = [
    {
        id: 1,
        heading: 'Ayusydah Blood Pressure Support',
        subheading: 'Circulation support, 100% natural — traditionally used to help maintain healthy blood pressure levels',
        image: bp4,
        fit: 'contain',
    },
    {
        id: 2,
        heading: 'Storewide Health Supplement Sale',
        subheading: 'Buy 2nd Item at 60% off, 1st Item at 20% off + Free Gifts',
        image: 'https://picsum.photos/seed/hero2/1600/500',
        fit: 'cover',
    },
    {
        id: 3,
        heading: 'New Arrivals in Natural Wellness',
        subheading: 'Discover our latest range of dietary supplements',
        image: 'https://picsum.photos/seed/hero3/1600/500',
        fit: 'cover',
    },
]

function HeroSlider() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    const goNext = () => setCurrent((prev) => (prev + 1) % slides.length)

    return (
        <section className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.heading}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center ${slide.fit === 'contain' ? 'bg-brand-blue' : ''}`}>
                        {slide.fit === 'contain' ? (
                            <img
                                src={slide.image}
                                alt={slide.heading}
                                loading="lazy"
                                className="h-[85%] object-contain bg-white rounded-xl shadow-xl p-4"
                            />
                        ) : (
                            <img
                                src={slide.image}
                                alt={slide.heading}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-6 md:px-16">
                            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-xl">
                                {slide.heading}
                            </h1>
                            <p className="text-sm md:text-lg text-white mt-3 max-w-md">
                                {slide.subheading}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 z-10"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 z-10"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2.5 h-2.5 rounded-full ${index === current ? 'bg-brand-gold' : 'bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}

export default HeroSlider