import HeroSlider from '../sections/HeroSlider.jsx'
import BestSellers from '../sections/BestSellers.jsx'
import FeaturedCategories from '../sections/FeaturedCategories.jsx'
import Newsletter from '../sections/Newsletter.jsx'
import TrustBar from '../sections/TrustBar.jsx'
import WellnessNeeds from '../sections/WellnessNeeds.jsx'
import WhyChoose from '../sections/WhyChoose.jsx'

function Home() {
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
