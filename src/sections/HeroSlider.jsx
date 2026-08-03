import { Link } from 'react-router-dom'

// Temporary wellness imagery. Replace these URLs with Ayusydah-owned campaign images when available.
const heroImages = [
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
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
      <div className="page-shell grid min-h-[500px] items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:py-0">
        <div className="relative z-10 py-6 text-white lg:py-14">
          <p className="eyebrow !text-[#f7e7c2]">Everyday wellness</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-[-.055em] sm:text-5xl lg:text-6xl">Small rituals. Stronger you.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">Discover considered supplements and everyday essentials that make wellness feel simple.</p>
          <Link to="/category/Vitamins%20%26%20Supplements" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-brand-blue transition hover:bg-brand-gold hover:text-white">Shop essentials</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-white/55">Wellness, thoughtfully selected</p>
        </div>

        <div className="relative hidden h-[500px] gap-3 overflow-hidden rounded-3xl border border-white/10 bg-blue-950/20 p-3 shadow-2xl shadow-blue-950/30 sm:grid sm:grid-cols-2 lg:h-[590px]">
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
