import React, { useState } from "react";
import {motion} from "motion/react";
import { FaPaw, FaHandPaper, FaDog, FaBolt, FaClock } from 'react-icons/fa';
const crueltyTypes = [
  {
    icon: <FaPaw size={30} className="text-black" />,
    title: "Neglect",
    description: "Leaving animals without food, water, or shelter."
  },
  {
    icon: <FaHandPaper size={30} className="text-black" />,
    title: "Physical Abuse",
    description: "Hitting, kicking, or harming animals intentionally."
  },
  {
    icon: <FaDog size={30} className="text-black" />,
    title: "Abandonment",
    description: "Leaving pets on streets or unwanted animals in unsafe conditions."
  },
  {
    icon: <FaBolt size={30} className="text-black" />,
    title: "Illegal Activities",
    description: "Dogfighting, poaching, or using animals for entertainment in abusive ways."
  },
  {
    icon: <FaClock size={30} className="text-black" />,
    title: "Overworking",
    description: "Forcing animals to work long hours without proper rest, care, or nutrition."
  },
];
const Report = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    date: "",
    time: "",
    details: "",
    image: null,
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:5000/api/report-cruelty", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStatus("Report submitted successfully ✅");
        setFormData({
          name: "",
          contact: "",
          location: "",
          date: "",
          time: "",
          details: "",
          image: null,
        });
      } else {
        setStatus("Error submitting report ❌");
      }
    } catch (err) {
      setStatus("Server error ❌");
    }
  };

  return (
    <div className="bg-gray-200 py-16 px-4 flex flex-col justify-center items-center ">
        <div className="report-page1 flex flex-col justify-center items-center gap-20 w-full ">
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Stop Animal Cruelty
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Every animal deserves care and protection. Sadly, many animals suffer due to human neglect, abuse, or exploitation. At Bezubaan NGO, we aim to raise awareness about these cruel acts and encourage compassionate action.
        </p>
      </motion.div>

      {/* Examples of Cruelty */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {crueltyTypes.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-red-500 mb-2">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Awareness Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-10 max-w-3xl"
      >
        <p className="text-gray-700 text-lg mb-4">
          Every act of cruelty leaves lasting harm. You can make a difference by reporting abuse, volunteering, adopting rescued animals, and spreading awareness.
        </p>
        <p className="text-gray-700 text-lg font-semibold">
          Together, we can create a safer world for all animals.
        </p>
      </motion.div>

      {/* Call-to-Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-8"
      >
   
      </motion.div>

        </div>
    <div className="report-form p-6  shadow-lg rounded-lg">
      <motion.h2  initial={{opacity:0,x:-20}}
          whileInView={{opacity:1,x:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="text-2xl font-bold mb-4">Report Cruelty</motion.h2>
      <motion.p  initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}} className="mb-4 text-gray-600">
        Please provide details about the incident , Your identity will be kept
        confidential.
      </motion.p>

      <form onSubmit={handleSubmit} className="report-input flex flex-col gap-5 space-y-4">
        <motion.input
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <motion.input
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          type="text"
          name="contact"
          placeholder="Contact Number / Email"
          value={formData.contact}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <motion.input
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          type="text"
          name="location"
          placeholder="Incident Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="date-time  flex  gap-20">
            <label><h4>Select Date</h4></label>
          <motion.input
           initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
            type="date"
            name="date"
            placeholder="date"
            value={formData.date}
            onChange={handleChange}
            className="date p-2 border rounded"
            required
          />
          <label><h4>Select Time</h4></label>
          <motion.input
           initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
            type="time"
            name="time"
            placeholder="time"
            value={formData.time}
            onChange={handleChange}
            
            className="time p-2 border rounded"
            required
          />
        </div>
        <motion.textarea
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          name="details"
          placeholder="Incident Details"
          value={formData.details}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
          required
        />
        <motion.input
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-10/12 border rounded image"
        />
        <motion.button
         initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
          type="submit"
          className="w-full hover:bg-black hover:text-white p-2 rounded border "
        >
          Submit Report
        </motion.button>
      </form>

      {status && <motion.p
       initial={{opacity:0,y:-20}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:0.3 , duration:0.5}}
          viewport={{once:true}}
       className="mt-4 text-center text-sm">{status}</motion.p>}
    </div>

    </div>
  );
};

export default Report;