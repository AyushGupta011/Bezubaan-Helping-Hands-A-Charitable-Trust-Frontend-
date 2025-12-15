import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donation from '../models/Donation.js';
import { sendMail } from '../config/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 Step 1: Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;
    console.log("Incoming donation data:", req.body);

    if (!amount || !name || !email) {
      console.log("❌ Missing required fields:", { name, email, amount });
      return res.status(400).json({ message: 'Missing fields' });
    }

    const options = {
      amount: amount * 100, // Convert to paisa
      currency: 'INR',
      receipt: `donation_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const donation = new Donation({
      name,
      email,
      amount,
      message,
      orderId: order.id,
      paymentStatus: 'PENDING',
    });
    await donation.save();

    res.json({ order, donationId: donation._id, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Order creation failed', error });
  }
};

// 🟢 Step 2: Verify Payment Signature
export const verifyPayment = async (req, res) => {
  console.log("🔥 VERIFY PAYMENT HIT:", req.body);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const donation = await Donation.findOne({ orderId: razorpay_order_id });
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (expectedSignature === razorpay_signature) {
      donation.paymentStatus = 'SUCCESS';
      donation.paymentId = razorpay_payment_id;
      await donation.save();


      const { name, email, amount, message } = donation;
 const adminSubject = `🐾 New Donation Received!`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 650px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; background-color: #2E8B57; padding: 20px;">
            <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🎉 New Donation Submitted</h2>
            <p>A new donation has been submitted. Details are as follows:</p>

            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;">
              <b>Name:</b> ${name}
            </div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;">
              <b>Email:</b> ${email}
            </div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;">
              <b>Amount:</b> ₹${amount}
            </div>
            ${message ? `
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;">
              <b>Message:</b> ${message}
            </div>` : ''}

            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 0.9em; color: #555; text-align: center;">Submitted on: ${new Date().toLocaleString()}</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; background-color: #2E8B57; color: #fff; padding: 15px;">
            🐾 Bezubaan – Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;
    console.log("📧 Sending ADMIN mail to:", process.env.ADMIN_EMAIL);

    await sendMail(process.env.ADMIN_EMAIL, adminSubject, adminHtml);

    // ---------- Confirmation Email to User ----------
    const userSubject = `🙏 Thank You for Your Donation – Bezubaan NGO`;
    const userHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 650px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <div style="text-align: center; background-color: #2E8B57; padding: 20px;">
            <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
          </div>

          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🙏 Thank You for Your Support</h2>
            <p>Hi ${name},</p>
            <p>We have received your donation of <strong>₹${amount}</strong>. Your support helps us protect and care for street animals ❤️.</p>

            ${message ? `
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-top: 20px;">
              <b>Your Message:</b> ${message}
            </div>` : ''}

            <p style="margin-top: 15px;">We will reach out if more information is needed. Thank you for helping animals in need 🐶🐱</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 0.9em; color: #555; text-align: center;">Sent on: ${new Date().toLocaleString()}</p>
          </div>

          <div style="text-align: center; background-color: #2E8B57; color: #fff; padding: 15px;">
            🐾 Bezubaan – Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;
    console.log("📧 Sending USER mail to:", email);

    await sendMail(email, userSubject, userHtml);

      res.json({ success: true });
    } else {
      donation.paymentStatus = 'FAILED';
      await donation.save();
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Verification failed', error });
  }
};

// 🟢 Step 3: Fetch Donations for Admin Dashboard
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error });
  }
};
