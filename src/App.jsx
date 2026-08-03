import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import PromoBar from './components/layout/PromoBar.jsx'
import UtilityBar from './components/layout/UtilityBar.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'

import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CookieBanner from './components/ui/CookieBanner.jsx'
import ProductListing from './pages/ProductListing.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Terms from './pages/Terms.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import FAQ from './pages/FAQ.jsx'
import Careers from './pages/Careers.jsx'
import SiteMap from './pages/SiteMap.jsx'
import ContactUs from './pages/ContactUs.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import MyOrders from './pages/MyOrders.jsx'

function App() {
  const location = useLocation()

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register'

  return (
    <>
      <ScrollToTop />

      <Toaster position="top-center" />

      {/* Show website header only on normal pages */}
      {!isAuthPage && (
        <>
          <PromoBar />
          <UtilityBar />
          <Header />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<ProductListing />} />
        <Route path="/search" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>

      {/* Show footer only on normal pages */}
      {!isAuthPage && (
        <>
          <Footer />
          <CookieBanner />
        </>
      )}
    </>
  )
}

export default App