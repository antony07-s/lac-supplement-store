import HeroSlider from '../sections/HeroSlider.jsx'
import FeaturedCategories from '../sections/FeaturedCategories.jsx'
import BestSellers from '../sections/BestSellers.jsx'
import PromoBanner from '../components/ui/PromoBanner.jsx'
import ShopByHealthGoal from '../sections/ShopByHealthGoal.jsx'
import BrandsCarousel from '../sections/BrandsCarousel.jsx'
import Testimonials from '../sections/Testimonials.jsx'
import Newsletter from '../sections/Newsletter.jsx'
import { useEffect, useState } from 'react'
import { GridSkeleton, HeroSkeleton } from '../components/ui/Shimmer.jsx'

function Home() {
    const [loading, setLoading] = useState(true)
    useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 350); return () => window.clearTimeout(timer) }, [])
    if (loading) return <main aria-label="Loading homepage"><HeroSkeleton /><div className="page-shell section-space"><div className="shimmer mb-8 h-9 w-64 rounded-lg" /><GridSkeleton count={6} /></div></main>
    return (
        <div>
            <HeroSlider />
            <FeaturedCategories />
            <BestSellers />
            <PromoBanner
                title="VIP Club Members Get Extra 10% Off"
                subtitle="Join Ayusydah rewards and unlock exclusive pricing on every order"
                ctaText="Join Now"
            />
            <ShopByHealthGoal />
            <BrandsCarousel />
            <Testimonials />
            <Newsletter />
        </div>
    )
}

export default Home
