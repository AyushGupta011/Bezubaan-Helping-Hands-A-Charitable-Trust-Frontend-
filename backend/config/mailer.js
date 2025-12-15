import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  
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
