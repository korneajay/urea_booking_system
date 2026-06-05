import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import AboutUs from './components/AboutUs'
import Availability from './components/Availability'
import DealerLocator from './components/DealerLocator'
import Support from './components/Support'
import './index.css'

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Features />
    <Footer />
  </>
)

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<><Navbar /><Dashboard /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutUs /><Footer /></>} />
          <Route path="/availability" element={<><Navbar /><Availability /><Footer /></>} />
          <Route path="/dealer-locator" element={<><Navbar /><DealerLocator /><Footer /></>} />
          <Route path="/support" element={<><Navbar /><Support /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

