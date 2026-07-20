import { Routes, Route } from 'react-router-dom'
import PromoBar from './components/layout/PromoBar.jsx'
import UtilityBar from './components/layout/UtilityBar.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import CookieBanner from './components/ui/CookieBanner.jsx'

function App() {
  return (
    <>
      <PromoBar />
      <UtilityBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </>
  )
}

export default App