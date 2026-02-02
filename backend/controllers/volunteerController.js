import Volunteer from '../models/Volunteer.js';
import { sendMail } from '../config/mailer.js';
import dotenv from 'dotenv';
dotenv.config();


export const submitVolunteer = async (req, res) => {
  try {
    // Save volunteer to DB
    const {name,email,phone,role,availability,message} = req.body;
    const volunteer = new Volunteer({name,email,phone,role,availability,message});
    await volunteer.save();

    // ----- Email to Admin -----
    const adminSubject = `🐾 New Volunteer Submission!`;
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Logo Section -->
          <div style="text-align: center; padding: 20px; background-color: #2E8B57;">
       <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
          </div>

          <!-- Content Section -->
          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🌟 New Volunteer Submission</h2>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Name:</strong> ${name}
            </div>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Email:</strong> ${email}
            </div>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Phone:</strong> ${phone || 'N/A'}
            </div>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Role:</strong> ${role}
            </div>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Availability:</strong> ${availability}
            </div>

            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Message:</strong><br>${message || 'N/A'}
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

            <p style="font-size: 0.9em; color: #555; text-align: center;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #2E8B57; color: #fff;">
            Bezubaan – Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;

    await sendMail(process.env.ADMIN_EMAIL,adminSubject, adminEmailHtml);

    // ----- Confirmation Email to Volunteer -----
    const userSubject = `💌 Thank You for Volunteering with Bezubaan NGO!`;
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; padding: 20px; background-color: #2E8B57;">
              <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px;" />
          </div>

          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🙏 Thank You for Volunteering!</h2>
            <p>Hi ${name},</p>
            <p>We have received your volunteer application for <strong>${role}</strong> with availability: <strong>${availability}</strong>.</p>
            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Your Message:</strong><br>${message || 'N/A'}
            </div>
            <p>Our team will reach out to you soon. Thank you for supporting street animals! 🐶🐱</p>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

            <p style="font-size: 0.9em; color: #555; text-align: center;">
              Sent on: ${new Date().toLocaleString()}
            </p>
          </div>

          <div style="text-align: center; padding: 15px; background-color: #2E8B57; color: #fff;">
            Bezubaan – Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;

    await sendMail(email,userSubject, userEmailHtml);

    return res.status(201).json({success:true, message: 'Volunteer form submitted successfully', volunteer });

  } catch (error) {
    console.error('Error submitting volunteer:', error);
   return res.status(500).json({
      success:false,
      message: 'Error saving volunteer',
      error: error.message || error.toString(),
    });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return res.json({success:true,volunteers});
  } catch (error) {
    console.error('Failed to fetch volunteers:', error);
    return res.status(500).json({success:false, message: 'Failed to fetch volunteers', error: error.message || error.toString() });
  }
};
