import { MoveRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';


const heroImages = [
    "/assets/work1.jpeg",
    "/assets/work2.jpeg",
    "/assets/work4.jpeg",
    "/assets/work8.mp4",
    "/assets/work9.mp4"


];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 6000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);
const currentMedia = heroImages[currentIndex];
  const isVideo = currentMedia.endsWith(".mp4");
  return (
    <div id="hero" className="hero-wrapper">
      <div className="hero-bg-layer" />

      {heroImages.map((src, idx) => (
        
        <div
          key={idx}
          className={`hero-image-wrapper ${
            idx === currentIndex ? 'active' : 'fade-out'
          }`}
        >

          <div className="hero-image-opacity">
            {isVideo ? (
              <video
              
                src={src}
                autoPlay
                loop
                muted
                className="hero-video w-full h-full object-cover"
              />
            ) :(
            <img src={src} alt={`Slide ${idx}`} className="hero-image" />
            )}
          </div>
        </div>
      ))}

      <div className="hero-text-container flex justify-center">
        <div className="hero-text-content">
          <h1 className="hero-heading">Welcome to <span>bezubaan</span></h1>
          <h2 className="hero-subheading">Your one-stop solution for animal welfare</h2>
          <h2 className="hero-subheading2"> and Cruelty reporting</h2>

          <div className="hero-section-button  md:top-[110%] md:left-[70%]  left-20 top-120 sm:left-35 sm:top-130  absolute w-2/3  md:w-1/4 h-16 md:h-20 px-8 py-4 border-2 md:bottom-10 rounded-full flex justify-center items-center hover:bg-black transition">
            <Link to="/donate"><h3 className='text-center flex gap-6 justify-center  align-center font-bold text-sm md:text-xl lg:text-2xl'>Donate  <MoveRight size={40}/></h3></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
