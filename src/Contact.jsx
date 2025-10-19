import React, { useState } from "react";
import {motion} from "motion/react"
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // You can integrate backend API call here (Node.js/Express)
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
        <div className="contact-page1">
           <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
          Connect with Bezubaan
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          We are passionate about saving street animals. Follow us, donate, or volunteer — every action makes a difference. Stay updated and join our mission!
        </p>
        <div className="flex justify-center gap-6 text-orange-500 text-2xl">
          <motion.a
            href="https://facebook.com/bezubaan"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hover:text-orange-600"
          >
            <i className="fab fa-facebook-f"></i>
          </motion.a>
          <motion.a
            href="https://instagram.com/bezubaan"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hover:text-orange-600"
          >
            <i className="fab fa-instagram"></i>
          </motion.a>
          <motion.a
            href="https://twitter.com/bezubaan"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hover:text-orange-600"
          >
            <i className="fab fa-twitter"></i>
          </motion.a>
          <motion.a
            href="https://youtube.com/bezubaan"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hover:text-orange-600"
          >
            <i className="fab fa-youtube"></i>
          </motion.a>
        </div>
      </motion.div>



        </div>
        <section className="contact-page2">
      <motion.h2 initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="text-3xl font-bold text-center mb-4">Contact Us</motion.h2>
      <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="text-center mb-8 page-p">
        We’d love to hear from you! Fill out the form below and we’ll get back to you as soon as possible.
      </motion.p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form flex items-center flex-col gap-4">
        <motion.input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          className="name p-3 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <motion.input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          className="p-3 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <motion.textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          className="p-3 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-orange-400"
        ></motion.textarea>
        <motion.button
          type="submit"
          initial={{opacity:0}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:false}}
          className="p-3 bg-white text-black rounded-lg text-lg hover:bg-black hover:text-white transition border-2"
        >
          Send Message
        </motion.button>
      </form>

      {/* Contact Details */}
      <motion.div initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="contact-details mt-10 text-center">
        <motion.h3 initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="text-xl font-semibold">Our Contact Details</motion.h3>
        <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}><strong>Address 1:</strong>Purani Bazar near haddi hospital shahganj jaunpur 223101 </motion.p>
        <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}><strong>Address 2:</strong>Crossing Republic near Abes Engineering College 201009 </motion.p>
        <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}><strong>Phone:</strong> +91-9936690034</motion.p>
        <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}><strong>Phone:</strong> +91-9336837889</motion.p>
        <motion.p initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}><strong>Email:</strong> contact@bezubaan.org</motion.p>
      </motion.div>

      {/* Google Map */}
      <div className="contact-map mt-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_CODE"
          width="100%"
          height="300"
          className=" map rounded-lg border-0"
          allowFullScreen=""
          loading="lazy"
          title="Bezubaan NGO Location"
        ></iframe>
      </div>
    </section>
    </div>
  );
};

export default Contact;