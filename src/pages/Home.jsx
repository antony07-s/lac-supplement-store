import HeroSlider from '../sections/HeroSlider.jsx'
import FeaturedCategories from '../sections/FeaturedCategories.jsx'
import BestSellers from '../sections/BestSellers.jsx'
import PromoBanner from '../components/ui/PromoBanner.jsx'
import ShopByHealthGoal from '../sections/ShopByHealthGoal.jsx'
import BrandsCarousel from '../sections/BrandsCarousel.jsx'
import Testimonials from '../sections/Testimonials.jsx'
import Newsletter from '../sections/Newsletter.jsx'

function Home() {
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