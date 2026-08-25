import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'

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
import Seo from './components/Seo.jsx'
import MyOrders from './pages/MyOrders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import AdminRoute from './components/admin/AdminRoute.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ManageProducts from './pages/admin/ManageProducts.jsx'
import AddProduct from './pages/admin/AddProduct.jsx'
import EditProduct from './pages/admin/EditProduct.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import ManageReviews from './pages/admin/ManageReviews.jsx'
import Checkout from './pages/Checkout.jsx'

function App() {
  const location = useLocation()

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register'

  return (
    <>
      <ScrollToTop />
      <Seo />

      <Toaster position="top-center" />

      {/* Show website header only on normal pages */}
      {!isAuthPage && (
        <>
          <PromoBar />
          <UtilityBar />
          <Header />
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/category/:category" element={<ProductListing />} />
            <Route path="/search" element={<ProductListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/track-order" element={<TrackOrder />} />

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
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
            <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

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
