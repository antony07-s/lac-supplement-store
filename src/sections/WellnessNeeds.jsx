import { Activity, Apple, HeartPulse, Leaf, Stethoscope, VenusAndMars } from 'lucide-react'
import { Link } from 'react-router-dom'

const needs = [
  { label: 'Blood Sugar Wellness', goal: 'Metabolic Health', icon: Activity },
  { label: 'Kidney & Urinary Wellness', goal: 'Kidney Health', icon: Stethoscope },
  { label: 'Digestive Wellness', goal: 'Digestive Health', icon: Apple },
  { label: 'Heart & Cholesterol Wellness', goal: 'Heart Health', icon: HeartPulse },
  { label: "Women's Wellness", goal: 'Energy & Vitality', icon: VenusAndMars },
  { label: "Men's Wellness", goal: "Men's Wellness", icon: VenusAndMars },
  { label: 'Everyday Wellness', goal: 'Immune Support', icon: Leaf },
]

// Display labels follow the storefront language while links use existing health-goal filters.
function WellnessNeeds() {
  return <section className="page-shell section-space">
    <p className="eyebrow">Find what supports you</p>
    <h2 className="section-title mt-2">Shop By Wellness Need</h2>
    <p className="mt-2 text-sm text-stone-600">Find the right products for your wellness journey.</p>
    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {needs.map(({ label, goal, icon: Icon }) => <Link key={label} to={`/products?healthGoal=${encodeURIComponent(goal)}`} className="group rounded-2xl border border-stone-100 bg-[#f7faf5] p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-gold hover:shadow-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-800 transition group-hover:bg-brand-gold group-hover:text-white"><Icon size={30} strokeWidth={1.7} /></span>
        <span className="mt-3 block text-xs font-bold leading-4 text-brand-blue-dark">{label}</span>
      </Link>)}
    </div>
  </section>
}

export default WellnessNeeds
