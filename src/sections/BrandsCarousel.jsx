import { Link } from 'react-router-dom'
import brands from '../data/brands.json'
function BrandsCarousel() { return <section className="bg-[#f4f6f0]"><div className="page-shell section-space"><p className="eyebrow">Trusted standards</p><h2 className="section-title mt-2 mb-8">Featured brands</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{brands.map((brand) => <Link to={`/category/${encodeURIComponent(brand.name)}`} key={brand.id} className="flex min-h-24 items-center justify-center rounded-2xl border border-stone-200 bg-white px-3 text-center text-sm font-extrabold tracking-[-.04em] text-brand-blue transition hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-lg">{brand.name}</Link>)}</div></div></section> }
export default BrandsCarousel
