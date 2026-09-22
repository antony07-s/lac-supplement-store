import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
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
import ScrollToTop from './components/ScrollToTop.jsx'
import Seo from './components/Seo.jsx'
import MyOrders from './pages/MyOrders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import AdminRoute from './components/admin/AdminRoute.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import WhatsAppButton from './components/ui/WhatsAppButton.jsx'
import { reportError } from './utils/telemetry.js'

const AboutUs = lazy(() => import('./pages/AboutUs.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.jsx'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy.jsx'))
const FAQ = lazy(() => import('./pages/FAQ.jsx'))
const Careers = lazy(() => import('./pages/Careers.jsx'))
const SiteMap = lazy(() => import('./pages/SiteMap.jsx'))
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts.jsx'))
const AddProduct = lazy(() => import('./pages/admin/AddProduct.jsx'))
const EditProduct = lazy(() => import('./pages/admin/EditProduct.jsx'))
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders.jsx'))
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))

function RouteLoading() {
  return <main className="page-shell section-space grid min-h-64 place-items-center" aria-label="Loading page"><span aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" /></main>
}

function App() {
  const location = useLocation()

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password/')
  const isAdminPage = location.pathname.startsWith('/admin')

  useEffect(() => {
    const handleError = (event) => reportError(event.error || event.message, { source: 'window' })
    const handleRejection = (event) => reportError(event.reason, { source: 'unhandled-rejection' })
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    return () => { window.removeEventListener('error', handleError); window.removeEventListener('unhandledrejection', handleRejection) }
  }, [])

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
          <Suspense fallback={<RouteLoading />}>
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
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
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Show footer only on normal pages */}
      {!isAuthPage && (
        <>
          <Footer />
          <CookieBanner />
        </>
      )}
      {!isAuthPage && !isAdminPage && <WhatsAppButton />}
    </>
  )
}

export default App
