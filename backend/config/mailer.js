import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP VERIFY FAILED:", err.message);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});


export const sendMail = async (to,subject,message) => {
  try {
    await transporter.sendMail({
      from: `"Bezubaan NGO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: message,
    });
    console.log('📧 Mail sent successfully');
  } catch (err) {
    console.error('❌ Mail send error:', err.message);
  }
};
