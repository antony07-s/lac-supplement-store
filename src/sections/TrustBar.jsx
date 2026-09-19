import { CreditCard, Headset, ShieldCheck, Truck } from 'lucide-react'

const benefits = [
  { icon: Truck, title: 'Fast Delivery', detail: 'Across Malaysia' },
  { icon: CreditCard, title: 'Secure Payment', detail: 'Multiple Payment Options' },
  { icon: Headset, title: 'Customer Support', detail: "We're Here to Help" },
  { icon: ShieldCheck, title: 'Authentic Products', detail: 'Quality You Can Trust' },
]

// A compact service promise strip directly below the homepage hero.
function TrustBar() {
  return <section className="border-y border-emerald-100 bg-emerald-50/70">
    <div className="page-shell grid grid-cols-1 divide-y divide-emerald-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
      {benefits.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-3 px-4 py-4 sm:px-5">
        <Icon className="shrink-0 text-emerald-800" size={29} strokeWidth={1.8} />
        <div><p className="text-sm font-extrabold text-brand-blue-dark">{title}</p><p className="text-xs text-stone-600">{detail}</p></div>
      </div>)}
    </div>
  </section>
}

export default TrustBar
