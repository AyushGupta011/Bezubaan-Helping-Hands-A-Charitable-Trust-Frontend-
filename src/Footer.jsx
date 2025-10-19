import React from 'react'
import { Link } from 'react-router'
import { PawPrint } from 'lucide-react'

const Footer = () => {
  return (
    <div>
        <footer className="footer w-full">
            <div className=" w-full footer-container gap-10 flex justify-around items-center  text-gray-700 ">
                <div className="w-1/4 footer-links flex gap-1 flex-col">
            
                   <Link to="/"><h3 > <PawPrint size={15}/> Home</h3></Link>
                   <Link to="/about"><h3 > <PawPrint size={15}/>About Us</h3></Link>   
                     <Link to="/report"><h3 ><PawPrint size={15}/>Report Cruelty</h3></Link>
                     <Link to="/contact"><h3 ><PawPrint size={15}/>Contact Us</h3></Link>

                </div>
                <div className="w-1/4 mx-auto flex flex-col gap-1 footer-social md:border-l md:border-gray-600">
                <h1>Social Media</h1>
                    <Link to="https://www.instagram.com/bezubaan.01?igsh=Y29lZjQ3eXF6a3V5"><h3 className='text-2xl'><PawPrint size={15}/>Instagram</h3></Link>
                    <Link to="/"><h3 ><PawPrint size={15}/>Facebook</h3></Link>
                </div>
                <div className="w-1/4 mx-auto footer-location  p-2 ">
                    <h1 className='text-lg font-bold'>Location</h1>
                    <h2>
                    1:
                    </h2>
                    <h3>Purani Bazar near Arshad Hospital <br />
                        Shahganj ,Jaunpur 223101</h3>
                    <h2>
                     2:
                    </h2>
                    <h3>Near Shankar Hotel Crossing Republic <br />
                       Ghaziabad </h3>
                </div>
                <div className="w-1/4 pl-5 footer-logo p-2 ">
                    <img className='w-35 h-35 order-first md:order-last' src="/assets/logo.jpeg" alt="Bezubaan Logo" />
                </div>
            </div>







            <div className="copyright text-center ">
                <p>&copy; {new Date().getFullYear()} Bezubaan Helping Hands Charitable Trust. All rights reserved.</p>
            </div>
        </footer>
    </div>
  )
}

export default Footer