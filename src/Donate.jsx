import React, { useEffect, useState } from "react";
import axios from "axios";
import loadRazorpay from "./utils/loadRazorpay";

const API = "http://localhost:5000/api";

const Donate = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [donations,setDonations] =useState([]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    const savedDonations = JSON.parse(localStorage.getItem("donations")) || [];
    setDonations(savedDonations);
  }, []);

  // Save to localStorage whenever donations update
  useEffect(() => {
    localStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  const payNow = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.amount) {
      alert("Please fill name, email and amount");
      return;
    }

    
    setLoading(true);

    const ok = await loadRazorpay();
    if (!ok) {
      setLoading(false);
      alert("Failed to load payment gateway. Check your internet.");
      return;
    }

    try {
      // 1) Create order on backend
      const { data } = await axios.post(`${API}/donations/order`, {
        name: form.name,
        email: form.email,
        amount: Number(form.amount),
        message: form.message,
      });

      const options = {
        key: data.key,
        amount: data.amount,           // in paise
        currency: data.currency,
        name: "Bezubaan Animal Welfare",
        description: "Donation",
        order_id: data.orderId,
        prefill: {
          name: form.name,
          email: form.email,
        },
        notes: { message: form.message },
        theme: { color: "#16a34a" },
        handler: async function (response) {
          // 2) Verify on backend
          try {
            await axios.post(`${API}/donations/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Thank you for your donation! 🐾");
            setForm({ name: "", email: "", amount: "", message: "" });
            const newDonation ={...form, date:new Date().toLocaleString()};
    setDonations([...donate,newDonation])

          } catch {
            alert("Payment captured, but verification failed. We’ll review it.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setLoading(false);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (e) {
      alert(e?.response?.data?.message || "Could not start payment.");
      setLoading(false);
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-page1 flex flex-col gap-10  bg-gray-200">
        <h2 className="text-2xl font-bold text-black p-20">Celebrate Your Birthday with Bezubaan 🐶 </h2>
        <p className="">Make your special day even more meaningful by sharing it with those who need your love the most – our rescued street animals. ❤️
          <br />
          Instead of just cakes and candles, celebrate by:
          <ul className="list-disc pl-6 mt-2">
            <li>🐶 Feeding rescued animals a special meal</li>
            <li>🐾 Donating for their medical care and shelter</li>
            <li>📸 Sharing your wishes and kindness with them</li>
          </ul>
          <br />
          Your birthday can bring hope, joy, and wagging tails to countless innocent souls. Together, we can turn your celebration into a day of love, compassion, and change. 🌟
        </p>
        <br />

      <div className="video">
         <video
              
                src="/assets/donate.mp4"
                autoPlay
                loop
                muted
                className="hero-video md:h-150 md:w-120 h-90 w-90 object-cover"
              />
      </div>

      </div>
   
    <div className="donate-form bg-gray-200 flex flex-col  p-6">
      <form onSubmit={payNow} className="rounded-2xl flex flex-col gap-5 p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Donate to Bezubaan 🐶</h2>

        <label className="block text-sm mb-1">Name</label>
        <input name="name" value={form.name} onChange={onChange}
               className="w-full border rounded-lg px-4 py-2 mb-4" required />

        <label className="block text-sm mb-1">Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange}
               className="w-full border rounded-lg px-4 py-2 mb-4" required />

        <label className="block text-sm mb-1">Amount (₹)</label>
        <input type="number" min="1" name="amount" value={form.amount} onChange={onChange}
               className="w-full border rounded-lg px-4 py-2 mb-4" required />

        <label className="block text-sm mb-1">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={onChange}
                  className="w-full border rounded-lg px-4 py-2 mb-6" rows="3" />

        <button type="submit" disabled={loading}
                className="w-full bg-white text-black py-2 border rounded-lg hover:bg-black hover:text-white transition">
          {loading ? "Processing..." : "Donate Securely"}
        </button>
      </form>
    </div>
    {/* card section */}
    <div className="donation-card">
      <h2 className="text-lg font-bold mb-2">Recent Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {donations.map((don, index) => (
          <div
            key={index}
            className="p-4 border rounded shadow bg-white"
          >
            <h3 className="font-bold">{don.name}</h3>
            <p>Donated: ₹{don.amount}</p>
            <p className="text-sm text-gray-500">On: {don.date}</p>
          </div>
        ))}
    </div>

     </div>

     </div>
  );
};

export default Donate;