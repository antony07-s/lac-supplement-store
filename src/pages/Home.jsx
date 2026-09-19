import HeroSlider from '../sections/HeroSlider.jsx'
import BestSellers from '../sections/BestSellers.jsx'
import FeaturedCategories from '../sections/FeaturedCategories.jsx'
import Newsletter from '../sections/Newsletter.jsx'
import TrustBar from '../sections/TrustBar.jsx'
import WellnessNeeds from '../sections/WellnessNeeds.jsx'
import WhyChoose from '../sections/WhyChoose.jsx'
import { useEffect, useState } from 'react'
import { GridSkeleton, HeroSkeleton } from '../components/ui/Shimmer.jsx'

function Home() {
    const [loading, setLoading] = useState(true)
    useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 350); return () => window.clearTimeout(timer) }, [])
    if (loading) return <main aria-label="Loading homepage"><HeroSkeleton /><div className="page-shell section-space"><div className="shimmer mb-8 h-9 w-64 rounded-lg" /><GridSkeleton count={6} /></div></main>
    return (
        <div>
            <HeroSlider />
            <TrustBar />
            <BestSellers />
            <WellnessNeeds />
            <FeaturedCategories />
            <WhyChoose />
            {/* Customer reviews are intentionally hidden until approved real customer feedback is available. */}
            <Newsletter />
        </div>
    )
}

export default Home
