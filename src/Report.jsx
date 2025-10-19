import React, { useState } from "react";
import {motion} from "motion/react";

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
    <div className="">
        <div className="report-page1">

        </div>
    <div className="report-form p-6 bg-white shadow-lg rounded-lg">
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