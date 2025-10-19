import React, { useState } from 'react'
import { Link } from 'react-router'
import { motion ,AnimatePresence } from "motion/react";
import { PawPrint, HandHeart, HeartHandshake, ChevronDown ,Menu,X} from "lucide-react";


const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
  return (
    <div className='navbar w-full  p-4'>
    <div className=' navbar-container h-50 w-full mx-auto  flex justify-between px-10 '>
        {/* logo */}
        <div className='navbar-logo flex justify-around gap-3 items-center h-20'>
            <img className='w-12 h-12  rounded-full ' src="src/assets/logo.jpeg" alt="" />
            <h1 className='text-black font-semibold text-xl'>Bezubaan<p className='text-xl'>Helping Hands Charitable Trust</p></h1>
            
  </div>

        {/* desktop menu */}
        <div className='navbar-links px-50 hidden md:flex gap-6 '>
<Link to="/"><motion.h3 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{ delay: 1, duration: 0.5 }} viewport={{once:true}}>Home</motion.h3></Link>
<Link to="/about"><motion.h3 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{ delay: 1, duration: 0.5 }} viewport={{once:true}}>About Us</motion.h3></Link>
<Link to="/report"><motion.h3 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{ delay: 1, duration: 0.5 }} viewport={{once:true}}>Report Cruelty</motion.h3></Link>
        {/* Dropdown for Get Involved */}
        <div className='dropdown relative'>
            <button className="flex items-center gap-2 bg-black-600  px-4 py-2 rounded-md hover:bg-black-700 transition" onClick={toggleDropdown}><motion.h3 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{ delay: 1, duration: 0.5 }}
          viewport={{ once: true}} >Get involved</motion.h3> <ChevronDown size={16} />
</button>
<AnimatePresence>
            {dropdownOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
                 className='dropdown-menu absolute  bg-black text-white mt-2 py-2 rounded shadow-lg z-40 w-40'>
                    <Link className='flex items-center gap-2 px-8 py-4 hover:text-black hover:bg-gray-100' to="/adopt"><PawPrint size={18} /><motion.h3 className='text-xl'>Adopt</motion.h3></Link>
                    <Link className='flex items-center gap-2 px-8 py-4  hover:text-black hover:bg-gray-100' to="/volunteer"><HandHeart size={18} /><motion.h3 className='text-xl'>Volunteer</motion.h3></Link>
                    <Link className='flex items-center gap-2 px-8 py-4  hover:text-black hover:bg-gray-100' to="/donate"><HeartHandshake size={18} /><motion.h3 className='text-xl'>Donate</motion.h3></Link>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
<Link to="/contact"><motion.h3 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{ delay:1, duration: 0.5 }} viewport={{once:true}}>Contact Us</motion.h3></Link>
        </div>
        {/* Hamburger Icon (Mobile) */}
        <div className='hamburger md:hidden pr-20 flex items-center '>
          <button onClick={toggleMenu} className='text-black focus:outline-none'>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        </div>
    

        {/* Mobile Menu */}
        <AnimatePresence>
      {menuOpen && (
        <motion.div
         initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay:.1, duration: 0.3 }}
         className='mobile-menu md:hidden z-9999  flex flex-col gap-3 mt-4 text-center text-white  bg-black rounded-2xl shadow-lg'>
          <Link to="/" onClick={toggleMenu}><div className="mobile-menu-list"><h3>Home</h3></div></Link>
          <Link to="/about" onClick={toggleMenu}><div className="mobile-menu-list"><h3>About Us</h3></div></Link>
          <Link to="/report" onClick={toggleMenu}><div className="mobile-menu-list"><h3>Report Cruelty</h3></div></Link>

          {/* Dropdown inside mobile menu */}
          <div className='text-center '>
           <div className="button mobile-menu-list">
            <button className="flex items-center gap-2 bg-black-600  px-4 py-2 rounded-md hover:bg-black-700 transition" onClick={toggleDropdown}>
              <h3>Get involved</h3> <ChevronDown size={20} />
            </button>
           </div>
           <AnimatePresence>
            {dropdownOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
               className='dropdown-menu flex flex-col w-full bg-white text-black mt-2 rounded shadow items-center'>
                <Link to="/adopt" onClick={toggleMenu} className=' gap-5 px-4 py-2 hover:bg-gray-100'>
<div className="flex gap-1.5"> <PawPrint size={20} /> <h3>Adopt</h3></div>
                </Link>
                <Link to="/volunteer" onClick={toggleMenu} className='flex items-center justify-around gap-5 px-4 py-2 hover:bg-gray-200'>
                  <div className="flex gap-1.5"><HandHeart size={20} /> <h3 className=''>Volunteer</h3></div>
                </Link>
                <Link to="/donate" onClick={toggleMenu} className='flex items-center justify-around gap-5 px-4 py-2 hover:bg-gray-100'>
<div className="flex gap-1.5">                  <HeartHandshake size={20} /> <h3>Donate</h3></div>
                </Link>
              </motion.div>
            )}
            </AnimatePresence>
            </div>


          <Link to="/contact" onClick={toggleMenu}><div className="mobile-menu-list"><h3>Contact Us</h3></div></Link>    
        </motion.div>
        
      )}
      </AnimatePresence>

  </div>


    

  )
}

export default Navbar