import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProductSection from './components/ProductSection'
import Footer from './components/Footer'
import { Routes, Route } from "react-router-dom"
import Shop from './Pages/Shop'
import AboutUs from './Pages/AboutUs'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <ProductSection />
          </>
        } />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
