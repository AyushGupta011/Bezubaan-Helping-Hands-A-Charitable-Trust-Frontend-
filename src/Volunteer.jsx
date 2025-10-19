import React, { useState } from 'react';
import { motion } from 'motion/react';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    availability: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show a success message
    setSubmitStatus('Thank you! Your volunteer request has been submitted.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      availability: '',
      message: ''
    });

    // Later you can send formData to backend here
  };

  return (
    <div className="bg-gray-200 py-12 px-4 ">
      <div className="volunteer-page1 h-full w-full p-20">
         <div className="volunteer-content text-center flex flex-col items-center justify-center gap-20 px-4  py-12">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl sm:text-4xl font-bold text-black mb-4"
        >
          Join Our Volunteer Family
        </motion.h1>

        {/* Intro Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-700 text-lg mb-8"
        >
          At <span className="font-semibold text-orange-500">Bezubaan NGO</span>, we work tirelessly to protect and care for street animals. By volunteering, you become part of a community that saves lives, spreads awareness, and ensures animals get the love and protection they deserve.
        </motion.p>

        {/* Roles / Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div   animate={{ y: [0, -10, 0, 10, 0] }}  // up-down animation
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white p-6 rounded-lg shadow text-center h-[200px] hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Feeding Animals</h3>
            <p className="text-gray-600">
              Help provide nutritious food to street animals in different areas, ensuring no animal goes hungry.
            </p>
          </motion.div>

          <motion.div  animate={{ y: [0, -10, 0, 10, 0] }}  // down-up animation
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white p-6 rounded-lg shadow text-center h-[200px] hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Rescue Operations</h3>
            <p className="text-gray-600">
              Participate in rescue missions to save injured or abandoned animals and take them to safety or clinics.
            </p>
          </motion.div>

          <motion.div   animate={{ y: [0, -10, 0, 10, 0] }}  // left-right animation
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white p-6 rounded-lg shadow text-center h-[200px] hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Awareness Campaigns</h3>
            <p className="text-gray-600">
              Spread awareness about animal welfare through workshops, campaigns, and social media.
            </p>
          </motion.div>

          <motion.div   animate={{ y: [0, -10, 0, 10, 0] }}  // up-down animation
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white p-6 rounded-lg shadow text-center h-[200px] hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Fundraising & Support</h3>
            <p className="text-gray-600">
              Help us raise funds and gather resources to support our rescue, feeding, and medical programs.
            </p>
          </motion.div>
        </motion.div>

        {/* Call-to-action */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-gray-700 text-lg"
        >
          Whether you can spare a few hours a week or want to be actively involved in multiple projects, there is a place for you at Bezubaan NGO. Scroll down to fill the volunteer form and join our mission.
        </motion.p>
      </div>
      </div>
      <div className="w-full volunteer-container">
       
        <p className="text-center text-gray-600 mb-8">
          Join us in helping street animals. Fill out the form below to volunteer.
        </p>

        <form onSubmit={handleSubmit} className=" volunteer-form flex items-center flex-col gap-10 p-8 rounded-lg ">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name *"
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email *"
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
            required
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone *"
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select a Role *</option>
            <option value="feeding">Feeding Animals</option>
            <option value="rescue">Rescue Operations</option>
            <option value="awareness">Awareness Campaigns</option>
            <option value="fundraising">Fundraising</option>
          </select>

          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="Availability *"
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Message / Notes"
            className="w-full px-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-black"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors"
          >
            Submit
          </button>

          {submitStatus && (
            <p className="text-green-600 font-medium mt-3">{submitStatus}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Volunteer;
