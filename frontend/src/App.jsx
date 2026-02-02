import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './Home.jsx'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import PawCursor from './PawCursor.jsx'
import Chatbot from './components/Chatbot..jsx'
import About from './About.jsx'
import HeroLanguages from './HeroLanguages.jsx'
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Donate from './Donate.jsx'
import Lenis from "@studio-freight/lenis";
import Contact from './Contact.jsx'
import Report from './Report.jsx'
import Adopt from './Adopt.jsx'
import Volunteer from './Volunteer.jsx'

// Admin imports
import AdminLogin from './components/admin/Login.jsx'
import AdminLayout from './components/admin/Layout.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import AdminContacts from './components/admin/Contacts.jsx'
import AdminVolunteers from './components/admin/Volunteers.jsx'
import AdminReports from './components/admin/Reports.jsx'
import AdminDonations from './components/admin/Donations.jsx'

gsap.registerPlugin(ScrollTrigger)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  const [showHero, setShowHero] = useState(() => {
    try {
      return !localStorage.getItem('bezubaan_seen_hero');
    } catch (e) {
      return true;
    }
  });

  const handleFinish = () => {
    try { localStorage.setItem('bezubaan_seen_hero', '1'); } catch (e) {}
    setShowHero(false);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  const cardVariants = {
    initial: { opacity: 1, rotateX: 0, y: 0, scale: 1 },
    exit: {
      opacity: 0,
      rotateX: -90,
      y: -300,
      scale: 0.8,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    enter: { opacity: 1, rotateX: 0, y: 0, scale: 1 },
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 1000 * 5);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {showHero && (
          <motion.div
            key="hero"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white"
            variants={cardVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <HeroLanguages
              displayDuration={2500}
              animationDuration={600}
              onFinish={handleFinish}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!showHero && (
        <motion.div 
          initial={{ opacity: 0, y: 300, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ height: showHero ? "300vh" : "auto" }}
          className="card2 relative z-10 min-h-[100vh] flex-grow"
        >
          <PawCursor />
          <Navbar />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="volunteers" element={<AdminVolunteers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="donations" element={<AdminDonations />} />
            </Route>
            
            {/* Main Site Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/report" element={<Report />} />
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/volunteer" element={<Volunteer />} />
          </Routes>
          {/* Chatbot (hidden on admin routes) */}
          {!window.location.pathname.startsWith('/admin') && <Chatbot />}
          <Footer />
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </motion.div>
      )}
    </Router>
  )
}

export default App