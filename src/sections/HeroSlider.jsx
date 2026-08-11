import { Link } from 'react-router-dom'

// Real Ayusydah product photography, sourced from Cloudinary.
const heroImages = [
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653704/ayusydah-products/blood-pressure.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653703/ayusydah-products/ashwagandha.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653693/ayusydah-products/curcumin.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653669/ayusydah-products/green-spirulina-extract.jpg',
  // 'https://res.cloudinary.com/pggies6d/image/upload/v1785653694/ayusydah-products/colon-cleanser.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653692/ayusydah-products/acne-pimple.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653680/ayusydah-products/carrot-extract.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653687/ayusydah-products/broccoli-sprout.jpg',
]

function ImageTicker({ direction = 'up' }) {
  const images = [...heroImages, ...heroImages]

  return (
    <div className="min-w-0 overflow-hidden">
      <div className={direction === 'up' ? 'hero-ticker-up space-y-3' : 'hero-ticker-down space-y-3'}>
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl bg-blue-100 shadow-lg shadow-blue-950/10">
            <img src={image} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroSlider() {
  return (
    <section aria-label="Ayusydah wellness collection" className="relative isolate overflow-hidden bg-[#102a62]">
      <div className="page-shell grid min-h-[320px] items-center gap-8 py-10 sm:min-h-[500px] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:py-0">
        <div className="relative z-10 py-6 text-white lg:py-14">
          <p className="eyebrow !text-[#f7e7c2]">Everyday wellness</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-[-.055em] sm:text-5xl lg:text-6xl">Small rituals. Stronger you.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">Discover considered supplements and everyday essentials that make wellness feel simple.</p>
          <Link to="/category/Health%20Concerns" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-brand-blue transition hover:bg-brand-gold hover:text-white">Shop essentials</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-white/55">Wellness, thoughtfully selected</p>
        </div>

        <div className="relative hidden h-[590px] gap-3 overflow-hidden rounded-3xl border border-white/10 bg-blue-950/20 p-3 shadow-2xl shadow-blue-950/30 lg:grid lg:grid-cols-2">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#102a62] to-transparent" />
          <ImageTicker direction="up" />
          <ImageTicker direction="down" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#102a62] to-transparent" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-80 bg-[radial-gradient(circle,rgba(88,145,255,.22),transparent_68%)] lg:block" />
    </section>
  )
}

export default HeroSlider
