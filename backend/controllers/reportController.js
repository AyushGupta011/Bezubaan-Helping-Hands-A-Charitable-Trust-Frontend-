import Report from '../models/Report.js';
import { sendMail } from '../config/mailer.js';
import dotenv from 'dotenv';
dotenv.config();


export const submitReport = async (req, res) => {
  try {
    console.log("Incoming Report Data:", req.body);
const contactParts = req.body.contact.split("/");
const contactString = `Phone: ${contactParts[0]} | Email: ${contactParts[1] || 'N/A'}`;
    const newreport = new Report({
        name: req.body.name,
  contact:contactString,
  location: req.body.location,
  description: req.body.details,
  imageUrl: req.body.imageUrl,
  date: req.body.date,
  time: req.body.time
    });
   const savedReport= await newreport.save();
      console.log("Saved Report:", savedReport);
try{
     const adminSubject = `🚨 New Animal Cruelty Report Received!`;
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 650px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header with Logo -->
          <div style="text-align: center; background-color: #2E8B57; padding: 20px;">
            <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🚨 New Cruelty Report Submitted</h2>
            <p>A new report has been submitted through the Bezubaan NGO website. Below are the details:</p>

            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;"><b>Name:</b> ${req.body.name || 'Anonymous'}</div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;"><b>Contact:</b> ${contactString}</div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;"><b>Location:</b> ${req.body.location || 'N/A'}</div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;"><b>Date:</b> ${req.body.date || 'N/A'}</div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;"><b>Time:</b> ${req.body.time || 'N/A'}</div>
            <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-bottom: 10px;">
              <b>Description:</b><br>${req.body.details}
            </div>
            ${req.body.imageUrl ? `
              <div style="text-align: center; margin-top: 20px;">
                <img src="${req.body.imageUrl}" alt="Report Image" style="max-width: 100%; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);" />
              </div>` : ''}

            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 0.9em; color: #555; text-align: center;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; background-color: #2E8B57; color: #fff; padding: 15px;">
            🐾 Bezubaan – Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;

    await sendMail(process.env.ADMIN_EMAIL,adminSubject, adminEmailHtml);
            }catch(err) {
  console.error("Failed to send admin email:", err);
}

    // ---------- Confirmation Email to User ----------
    if (req.body.email) {
        try {
            
       
      const userSubject = `🙏 Thank You for Reporting – Bezubaan NGO`;
      const userEmailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 650px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <div style="text-align: center; background-color: #2E8B57; padding: 20px;">
              <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
            </div>

            <div style="padding: 25px;">
              <h2 style="color: #2E8B57; text-align: center;">🙏 Thank You for Speaking Up</h2>
              <p>Dear ${req.body.name || 'Supporter'},</p>
              <p>We have received your report and our rescue team will review it soon. Your voice helps us protect innocent lives ❤️.</p>

              <div style="background-color: #f1f8f2; padding: 15px; border-left: 5px solid #2E8B57; margin-top: 20px;">
                <b>Report Summary:</b><br>
                Location: ${req.body.location || 'N/A'}<br>
                Date: ${req.body.date || 'N/A'}<br>
                Time: ${req.body.time || 'N/A'}
              </div>

              <p style="margin-top: 15px;">We will reach out if more information is needed. Thank you for helping animals in need 🐶🐱</p>
            </div>
            <div style="text-align: center; background-color: #2E8B57; color: #fff; padding: 15px;">
             🐾 Bezubaan – Helping Hands A Charitable Trust
            </div>
          </div>
        </div>
      `;

      await sendMail(req.body.email, userSubject,userEmailHtml);
       } catch (error) {
             console.error("Failed to send user email:", error);
        }
    }
    res.status(201).json({ success:true, message: 'Report submitted', newreport });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error saving report', error });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({success:true,reports});
  } catch (error) {
    res.status(500).json({success:false, message: 'Failed to fetch reports', error });
  }
};