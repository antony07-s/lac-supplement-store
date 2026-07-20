import { Routes, Route } from 'react-router-dom'
import PromoBar from './components/layout/PromoBar.jsx'
import UtilityBar from './components/layout/UtilityBar.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CookieBanner from './components/ui/CookieBanner.jsx'
import ProductListing from './pages/ProductListing.jsx'

function App() {
  return (
    <>
      <PromoBar />
      <UtilityBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<ProductListing />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </>
  )
}

export default App