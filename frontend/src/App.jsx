import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import Home from './Home.jsx'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import PawCursor from './PawCursor.jsx'
import About from './About.jsx'
import HeroLanguages from './HeroLanguages.jsx'
import gsap from "gsap";
// import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import { motion,useScroll, useTransform ,AnimatePresence } from "motion/react";
import Donate from './Donate.jsx'
import Lenis from "@studio-freight/lenis";
import Contact from './Contact.jsx'
import Report from './Report.jsx'
import Adopt from './Adopt.jsx'
import Volunteer from './Volunteer.jsx'




gsap.registerPlugin(ScrollTrigger)

const App = () => {
  // const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showHero, setShowHero] = useState(true);

  // This will be called when HeroLanguages finishes
  const handleFinish = () => {
    setShowHero(false);
  };

  useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,   // scroll speed
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
      lenis.destroy(); // cleanup on unmount
    };
    }, []);
  


// const ref = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"], // start → end of first section
//   });
//   const rotateX = useTransform(scrollYProgress, [0, 1], [0, 150]);
//   const translateZ = useTransform(scrollYProgress, [0, 1], [0, -600]);
//   const scale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

//   const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
      setScrollEnabled(true);
      document.body.style.overflow = "auto";
    }, 1000 * 5); // displayDuration * translations.length
    return () => clearTimeout(timer);
  }, []);

  // useEffect(()=>{
  //   gsap.to(".card1",{
  //     scale:0.8,
  //     opacity:0,
  //     scrollTrigger:{
  //       trigger:".card1",
  //       start:"top 15%",
  //       end:"bottom 15%",
  //       markers:true,
  //       scrub:true
  //     }
  //   })
  // })
  return (
  
    <Router>
      {/* <motion.section
ref={ref}
        initial={{ rotateX: 15, rotateY: -10, opacity: 0, scale: 0.9 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
        exit={{ rotateX: -15, rotateY: 10, opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white ${
          scrollEnabled ? "relative" : "fixed top-0 left-0"
        }`}
        style={{
          rotateX,
          translateZ,
          opacity,
          scale,
          transformOrigin: "bottom center"
         }}
      >

             <motion.div whileHover={{ rotateY: 10, scale: 1.05 }  }
          transition={{ type: "spring", stiffness: 200 }}
 className="card1 sticky top-0 h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white ">
      <HeroLanguages displayDuration={2500} animationDuration={600}/>
</motion.div>
</motion.section> */}
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
              onFinish={handleFinish} // pass callback
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!showHero && (

       <motion.div 
       initial={{ opacity: 0, y: 300, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
style={{height:showHero? "300vh":"auto"}}
        className="card2 relative z-10 min-h-[100vh] flex-grow">
        <PawCursor/>



      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/donate" element={<Donate/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/report" element={<Report/>}/>
        <Route path="/adopt" element={<Adopt/>}/>
        <Route path="/volunteer" element={<Volunteer/>}/>
        
        
       


        </Routes>
  <Footer/>
       </motion.div>
      )}
   

    </Router>

    
  )
}

export default App