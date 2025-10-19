import React, { startTransition, useEffect, useRef } from 'react'
import HeroSection from './HeroSection'
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {motion} from "motion/react";

import { Link } from 'react-router';






gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  


    
    


  return (
    <div>

      <div className="home-container">
        <div className="home-page1">
          <HeroSection/>
        </div>
        <div className="home-page2 gap-15 px-4 md:px-16 py-10 ">
<div className="home-pag2-text items-center md:w-2/3">
  <motion.h1 initial={{opacity:0,y:-10}}
   whileInView={{opacity:1,y:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}  className='home-text  mx-auto text-[clamp(1.5rem,5vw,3.75rem)]  whitespace-nowrap text-3xl sm:text-4xl  md:text-6xl text-stone-600 mb-15  from-stone-400 to-gray-600'>How it Started</motion.h1>

<motion.p initial={{ opacity:0, y:-20}}
whileInView={{opacity:1,y:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}
className='para text-xl md:text-xl w-full py-10 leading-relaxed '>It all began when Abhilash Arya, the founder and president, offered a biscuit to a stray dog outside his home in Shahganj. What seemed like a small act of kindness turned into a divine calling. In that dog’s eyes, Abhilash saw something profound — as if the almighty Himself had appeared in the form of an innocent animal, silently handing over a great responsibility.

From that moment on, it was no longer just about one dog — it became a mission for every voiceless soul in Shahganj. Every wounded, abandoned, or hungry animal found a protector, a friend, and a family in him.

This heartfelt journey gave birth to Bezubaan Helping Hands — a movement of compassion, a platform for animal welfare, and a trust that believes:

Every life matters

Service to animals is service to God

Even a little support from you can change their world


Now, the responsibility lies with all of us.
Your small act of kindness can bring a world of difference to the lives of these voiceless beings.</motion.p>
          
</div>
<motion.div initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}

className="home-page2-img md:w-1/3 w-full ">
  <img className="w-full sm:w-1/2 md:w-1/3 mx-auto h-auto object-cover rounded shadow-lg" src="/assets/founder.jpeg" alt="" />
</motion.div>

        </div>
        <div className="home-page3  flex sm:items-center flex-col lg:flex-row md:flex-row ">
          <div className="work-text">
            <motion.h1 initial={{opacity:0,y:-10}}
            whileInView={{opacity:1,y:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}
             className=''>What we Do !</motion.h1>
            <motion.h4 initial={{opacity:0,y:-10}}
            whileInView={{opacity:1,y:0}}
            transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}>
            At Bezubaan Helping Hands, our work begins on the streets — where animals are often injured, hungry, abandoned, or ignored.
            </motion.h4>


            <motion.p initial={{opacity:0,y:-10}}
            whileInView={{opacity:1,y:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}
            >
           - Rescue sick or injured stray animals <br />

  - Provide medical treatment, shelter, and care <br />

- Run awareness drives to promote kindness toward animals <br />

- Help animals find safe, loving homes through adoption <br />

- Work with volunteers and local citizens to build a community of compassion
                  </motion.p> <motion.p initial={{opacity:0,y:-10}}
            whileInView={{opacity:1,y:0}} transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}>
            Every rescue is followed with love, recovery, and long-term care — because for us, every life deserves dignity.
            </motion.p>
          </div>
          <motion.div whileHover={{scale:0.8}}
          initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}}
          transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}}
          
          
           className="work-img">
            <img src="/assets/work7.jpeg" alt="" />

          </motion.div>

        </div>
        <div className="home-page4 flex flex-col justify-around md:flex-row ">
          <div className="home-page4-left items-center flex flex-col gap-20">
            <motion.div initial={{opacity:0,x:-40}}
            whileInView={{opacity:1,x:0}}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: false}} className="img-left ">
            <img src="/assets/work5.jpeg" alt="" />
          </motion.div>
           <motion.div initial={{opacity:0,x:40}}
            whileInView={{opacity:1,x:0 }}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: false}} className="img-right rounded-2xl overflow-hidden">
          <video className='w-full h-full object-cover rounded-2xl' src="/assets/work10.mp4" autoPlay muted loop ></video>
        </motion.div>

            <motion.div initial={{opacity:0,x:-40}}
            whileInView={{opacity:1,x:0}}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: false}}
            
            className="img-left ">
            <img src="/assets/work5.jpeg" alt="" />
          </motion.div>

          </div>
                    <div className="home-page4-right flex flex-col items-center gap-20">

            <motion.div initial={{opacity:0,x:40}}
            whileInView={{opacity:1,x:0}}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}} className="img-right rounded-2xl overflow-hidden">
          <video className='w-full h-full object-cover rounded-2xl' src="/assets/work10.mp4" autoPlay muted loop ></video>
        </motion.div>
                               <motion.div initial={{opacity:0,x:-40}}
            whileInView={{opacity:1,x:0}}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}} className="img-left ">
            <img src="/assets/work5.jpeg" alt="" />
          </motion.div>
            <motion.div initial={{opacity:0,x:40}}
            whileInView={{opacity:1,x:0}}
             transition={{ delay:0.3, duration: 0.5 }}
          viewport={{ once: true}} className="img-right rounded-2xl overflow-hidden">
          <video className='w-full h-full object-cover rounded-2xl' src="/assets/work10.mp4" autoPlay muted loop ></video>
        </motion.div>

                   <motion.div initial={{opacity:0}} whileInView={{opacity:1}} whileHover={{ backgroundColor: "black",color:"white", scale: 1.05 }} transition={{ delay:0.3, duration: 0.3 }} viewport={{once:true}} className="home4-button">
            <Link to="/about"><motion.h3  >About us</motion.h3></Link>
          </motion.div>
          </div>


        
        </div>
        <div className="home-page5">
          <motion.h1 initial={{opacity:0,y:-40}} whileInView={{opacity:1,y:0}} transition={{delay:.3,duration:0.5}}>Impact Stats</motion.h1>

          <motion.h3 initial={{opacity:0,x:-15}} whileInView={{opacity:1,x:0}} transition={{delay:.3,duration:0.5}}>🐾 1,300+ animals rescued




</motion.h3>
          <motion.h3 initial={{opacity:0,x:10}} whileInView={{opacity:1,x:0}} transition={{delay:.3,duration:0.5}}>🏠 1,00+ successful adoptions
</motion.h3>
          <motion.h3 initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} transition={{delay:.3,duration:0.5}}>🤝 500+ active volunteers</motion.h3>
          <motion.h3 initial={{opacity:0,x:10}} whileInView={{opacity:1,x:0}} transition={{delay:.3,duration:0.5}}>🚨 40+ cruelty cases prevented</motion.h3>
          

        </div>
        
        
        <div className="flex justify-center mt-8">

            </div>

      </div>
    </div>
  )
}

export default Home