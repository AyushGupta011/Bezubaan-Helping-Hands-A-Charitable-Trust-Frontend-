import React from 'react'
import { Link } from 'react-router'
import { PawPrint, Facebook, Instagram, MapPin } from 'lucide-react'
import { motion } from 'motion/react'

const Footer = () => {
  return (
    <footer className="w-full footer bg-gray-50 text-gray-700 pt-8 pb-6">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section with Logo and Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-8">
          
          {/* Logo Section - Centered on mobile, left on desktop */}
          <div
     
            className="w-full lg:w-1/4 flex justify-center lg:justify-center"
          >
            <img 
              className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg' 
              src="/assets/logo.jpeg" 
              alt="Bezubaan Logo" 
            />
          </div>
          
          {/* Content Grid */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/" className="flex items-center gap-2 hover:text-black transition-colors">
                    <PawPrint size={16} className="text-gray-500" />
                    <span>Home</span>
                  </Link>
                  <Link to="/about" className="flex items-center gap-2 hover:text-black transition-colors">
                    <PawPrint size={16} className="text-gray-500" />
                    <span>About Us</span>
                  </Link>
                  <Link to="/report" className="flex items-center gap-2 hover:text-black transition-colors">
                    <PawPrint size={16} className="text-gray-500" />
                    <span>Report Cruelty</span>
                  </Link>
                  <Link to="/contact" className="flex items-center gap-2 hover:text-black transition-colors">
                    <PawPrint size={16} className="text-gray-500" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Social Media</h3>
                <div className="space-y-3">
                  <a 
                    href="https://www.instagram.com/bezubaan.01" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    <Instagram size={16} className="text-gray-500" />
                    <span>Instagram</span>
                  </a>
                  <Link to="/" className="flex items-center gap-2 hover:text-black transition-colors">
                    <Facebook size={16} className="text-gray-500" />
                    <span>Facebook</span>
                  </Link>
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Our Locations</h3>
                <div className="space-y-4 m:align-center">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Jaunpur Center :</p>
                        <p className="text-gray-600 text-sm">
                          Purani Bazar near Arshad Hospital<br />
                          Shahganj, Jaunpur 223101
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bor"></div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Ghaziabad Center :</p>
                        <p className="text-gray-600 text-sm">
                          Near Shankar Hotel Crossing<br />
                          Republic, Ghaziabad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-300 my-6 bor"></div>
        
        {/* Copyright */}
        <div className="text-cente copyright">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Bezubaan Helping Hands Charitable Trust. All rights reserved.
          </p>
          <p>Made with ❤️ by Bezubaan Team</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer