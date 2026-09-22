import { CheckCircle2, Headset, Leaf, PackageCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cloudinaryImage, cloudinarySrcSet } from '../utils/cloudinaryImage.js'

const points = [
  { icon: CheckCircle2, title: 'Natural & Trusted', detail: 'Inspired by traditional wellness.' },
  { icon: Leaf, title: 'Wide Range', detail: 'Supplements, juices, skin & hair care.' },
  { icon: Truck, title: 'Malaysia Delivery', detail: 'Fast and reliable shipping.' },
  { icon: Headset, title: 'Customer Support', detail: "We're always here to help." },
]

// Brand story section, using product imagery already hosted for the catalogue.
function WhyChoose() {
  return <section className="overflow-hidden bg-[#f5f8f1]">
    <div className="page-shell grid gap-8 py-14 lg:grid-cols-[.9fr_1fr_1fr] lg:items-center">
      <div><p className="eyebrow">Why choose us</p><h2 className="section-title mt-2">Why Choose AYUSYDAH</h2>
        <div className="mt-6 space-y-4">{points.map(({ icon: Icon, title, detail }) => <div key={title} className="flex gap-3"><Icon className="mt-0.5 shrink-0 text-emerald-700" size={23} /><div><p className="text-sm font-extrabold text-brand-blue-dark">{title}</p><p className="text-xs text-stone-600">{detail}</p></div></div>)}</div>
      </div>
      <div className="lg:border-x lg:border-emerald-900/15 lg:px-8"><h3 className="font-serif text-3xl font-bold leading-tight text-brand-blue-dark">Wellness for a Better Tomorrow</h3><p className="mt-4 text-sm leading-6 text-stone-600">At AYUSYDAH, we believe in the power of nature to support your everyday wellbeing. Our range of herbal supplements, Ayurvedic products, juices and personal care solutions is thoughtfully selected for daily life.</p><Link to="/about-us" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand-gold px-6 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-brand-blue">Our Story</Link></div>
      <div className="relative overflow-hidden rounded-3xl bg-emerald-100"><img src={cloudinaryImage('https://res.cloudinary.com/pggies6d/image/upload/v1787569045/ayusydah-products/kidney.jpg', { width: 900, height: 675, crop: 'fill' })} srcSet={cloudinarySrcSet('https://res.cloudinary.com/pggies6d/image/upload/v1787569045/ayusydah-products/kidney.jpg', [480, 640, 900], { height: 675, crop: 'fill' })} sizes="(max-width: 1023px) 100vw, 33vw" alt="Natural AYUSYDAH wellness product" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover mix-blend-multiply" /><div className="absolute bottom-5 right-5 max-w-44 rounded-2xl bg-white/90 p-3 text-right font-serif text-lg italic leading-tight text-emerald-900">A healthier you, a brighter tomorrow</div><PackageCheck className="absolute left-5 top-5 text-emerald-800" size={32} /></div>
    </div>
  </section>
}

export default WhyChoose
