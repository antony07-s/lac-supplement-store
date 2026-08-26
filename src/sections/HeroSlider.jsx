import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

// Real Ayusydah product photography, sourced from Cloudinary.
const heroImages = [
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569849/ayusydah-products/resveratrol.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569813/ayusydah-products/pumpkinseed.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569777/ayusydah-products/prostate.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569737/ayusydah-products/probiotics.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569709/ayusydah-products/piles.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569676/ayusydah-products/mokkirattai.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569630/ayusydah-products/memorybooster.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569083/ayusydah-products/liver.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787569045/ayusydah-products/kidney.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787568988/ayusydah-products/goldenturmericsoap.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787568808/ayusydah-products/glowsoap.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787568740/ayusydah-products/eyerevive-t.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787568512/ayusydah-products/pomogranate.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787568448/ayusydah-products/nervecare.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566869/ayusydah-products/fat%20burn%20plus.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566817/ayusydah-products/coconutsoap.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566772/ayusydah-products/goatmilk.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566711/ayusydah-products/spemax.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566597/ayusydah-products/kumkumadi.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566554/ayusydah-products/shilajit.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566438/ayusydah-products/coklet.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566338/ayusydah-products/eye%20revive.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787566053/ayusydah-products/fenugreek.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787565622/ayusydah-products/Bloodpressure.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787565575/ayusydah-products/carrot-extract.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787565536/ayusydah-products/acne-pimple.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787551728/ayusydah-products/gastric.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787550759/ayusydah-products/garlic-pure-extract.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787550056/ayusydah-products/flexseed.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787548253/ayusydah-products/curcumin.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787547554/ayusydah-products/colon%20cleanser.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787547386/ayusydah-products/broccoli-sprout.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787546706/ayusydah-products/Bluebery.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787546322/ayusydah-products/ashwagandha.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787546119/ayusydah-products/Thooth%20powder.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787545987/ayusydah-products/xtra%20gold.png',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787545754/ayusydah-products/boost.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1787545644/ayusydah-products/thyroid-support.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1786085581/ayusydah-products/green-spirulina-extract.jpg',
  'https://res.cloudinary.com/pggies6d/image/upload/v1785653667/ayusydah-products/grape-seed-extract.jpg'
]

const optimizedImage = (url, width) => url.trim().replace('/upload/', `/upload/f_auto,q_auto,dpr_auto,c_fill,w_${width}/`)

function HeroImage({ image, priority = false }) {
  const src = optimizedImage(image, 520)
  return <img
    src={src}
    srcSet={`${optimizedImage(image, 320)} 320w, ${optimizedImage(image, 520)} 520w, ${optimizedImage(image, 720)} 720w`}
    sizes="(max-width: 1023px) 0px, 250px"
    alt=""
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'}
    decoding="async"
    className="aspect-[4/5] w-full object-cover"
  />
}

function ImageTicker({ direction = 'up', startIndex = 0 }) {
  // Keep only the currently visible product image and its next two neighbours
  // in the DOM. The old implementation created 160 images on first render.
  const imageWindow = useMemo(() => Array.from({ length: 3 }, (_, offset) => heroImages[(startIndex + offset) % heroImages.length]), [startIndex])
  // The repeated nodes make the CSS loop seamless; they reuse the same URLs,
  // so there are still only three unique image downloads per column.
  const images = [...imageWindow, ...imageWindow]

  return (
    <div className="min-w-0 overflow-hidden">
      <div key={startIndex} className={direction === 'up' ? 'hero-ticker-up space-y-3' : 'hero-ticker-down space-y-3'}>
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl bg-blue-100 shadow-lg shadow-blue-950/10">
            <HeroImage image={image} priority={index === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroSlider() {
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    // Advance the small image window only after its animation loop. This avoids
    // downloading the full catalog while retaining the moving product display.
    const timer = window.setInterval(() => setStartIndex((current) => (current + 3) % heroImages.length), 32000)
    return () => window.clearInterval(timer)
  }, [])

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
          <ImageTicker direction="up" startIndex={startIndex} />
          <ImageTicker direction="down" startIndex={(startIndex + 3) % heroImages.length} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#102a62] to-transparent" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-80 bg-[radial-gradient(circle,rgba(88,145,255,.22),transparent_68%)] lg:block" />
    </section>
  )
}

export default HeroSlider
