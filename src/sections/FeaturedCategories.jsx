import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cloudinaryImage, cloudinarySrcSet } from '../utils/cloudinaryImage.js'

const categories = ['Herbal Supplements', 'Ayurvedic Wellness', 'Juices', 'Skin & Hair Care']
const categoryPath = (name) => `/category/${encodeURIComponent(name)}`
const homeImage = (name) => `https://res.cloudinary.com/pggies6d/image/upload/f_auto,q_auto,c_fill,w_900,h_700/ayusydah-home/${name}.jpg`
const categoryImages = {
  'Herbal Supplements': homeImage('herbal-supplements'),
  'Ayurvedic Wellness': homeImage('ayurvedic-wellness'),
  Juices: homeImage('natural-juices'),
  'Skin & Hair Care': homeImage('skin-hair-care'),
}

function FeaturedCategories() {
  return <section className="page-shell section-space">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl font-bold uppercase tracking-[-.04em] text-brand-blue-dark sm:text-3xl">Shop by category</h2>
        <p className="mt-1 text-sm text-stone-500">Explore our wide range of natural wellness products.</p>
      </div>
      <Link to="/shop" className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-blue-dark px-5 py-2.5 text-sm font-bold text-brand-blue-dark transition hover:bg-brand-blue-dark hover:text-white">View All Categories <ArrowRight size={15} /></Link>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{categories.map((category) => <CategoryTile key={category} category={category} image={categoryImages[category]} />)}</div>
    <div className="mt-5 grid gap-4 lg:grid-cols-2"><Campaign title="Pure Goodness in Every Bottle" body="Natural herbal juices for a healthier, happier you." cta="Shop Juices" category="Juices" image={categoryImages.Juices} /><Campaign title="Natural Care for Healthy Hair" body="Botanical solutions for stronger, healthier hair." cta="Shop Hair Care" category="Skin & Hair Care" image={categoryImages['Skin & Hair Care']} /></div>
  </section>
}

function CategoryTile({ category, image }) {
  return <Link to={categoryPath(category)} className="group overflow-hidden rounded-lg bg-[#f7f7f5] text-center shadow-sm ring-1 ring-stone-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123b53]">
    <div className="aspect-[1.58/1] overflow-hidden bg-[#edf1e8]"><img src={cloudinaryImage(image, { width: 900 })} srcSet={cloudinarySrcSet(image, [320, 480, 640, 900])} sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 300px" alt={category} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
    <div className="flex min-h-[100px] flex-col items-center justify-center gap-3 px-3 py-4"><h3 className="font-serif text-sm font-bold leading-tight text-brand-blue-dark sm:text-base">{category}</h3><span className="inline-flex w-full max-w-40 items-center justify-center gap-1.5 rounded-full bg-[#b87932] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition group-hover:bg-[#123b53]">Shop Now <ArrowRight size={13} /></span></div>
  </Link>
}

function Campaign({ title, body, cta, category, image }) { return <div className="relative min-h-48 overflow-hidden rounded-lg bg-[#edf2e6] p-5 shadow-sm sm:min-h-56 sm:p-7"><img src={cloudinaryImage(image, { width: 900 })} srcSet={cloudinarySrcSet(image, [480, 640, 900])} sizes="(max-width: 1023px) 55vw, 420px" alt="" loading="lazy" decoding="async" className="absolute inset-y-0 right-0 h-full w-[55%] object-cover object-center opacity-95 transition duration-500 hover:scale-105" /><div className="absolute inset-y-0 right-[38%] w-1/3 bg-gradient-to-r from-[#edf2e6] via-[#edf2e6]/90 to-transparent" /><div className="relative max-w-[57%]"><h3 className="font-serif text-2xl font-bold italic leading-[.92] text-brand-blue-dark sm:text-3xl">{title}</h3><p className="mt-3 text-xs leading-4 text-stone-600 sm:text-sm sm:leading-5">{body}</p><Link to={categoryPath(category)} className="mt-4 inline-flex items-center rounded-full bg-[#123b53] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#b87932]">{cta} <ArrowRight className="ml-1.5" size={13} /></Link></div></div> }
export default FeaturedCategories
