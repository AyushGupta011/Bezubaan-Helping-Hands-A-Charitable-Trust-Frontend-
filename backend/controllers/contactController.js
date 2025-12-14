import Contact from '../models/Contact.js';
import {sendMail} from '../config/mailer.js'
import dotenv from 'dotenv';
dotenv.config();


export const submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

  try {
    const emailSubject = `🐾 New Message from a Caring Supporter!`;
const emailHtml = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Logo Section -->
      <div style="text-align: center; padding: 20px; background-color: #2E8B57;">
        <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px; height: auto;" />
      </div>

      <!-- Content Section -->
      <div style="padding: 25px;">
        <h2 style="color: #2E8B57; text-align: center;">📬 New Contact Form Submission</h2>

        <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
          <strong>Name:</strong> ${req.body.name}
        </div>

        <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
          <strong>Email:</strong> ${req.body.email}
        </div>

        <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
          <strong>Message:</strong><br>${req.body.message}
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

        <p style="font-size: 0.9em; color: #555; text-align: center;">
          Received on: ${new Date().toLocaleString()}
        </p>
      </div>

      <!-- Footer Section -->
      <div style="text-align: center; padding: 15px; background-color: #2E8B57; color: #fff;">
        Bezubaan - Helping Hands A Charitable Trust
      </div>
    </div>
  </div>
`;
   await sendMail(process.env.ADMIN_EMAIL,emailSubject, emailHtml);
    // ----- Confirmation Email to User -----
    const userSubject = `💌 Your Message Has Been Received!`;
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding: 20px; background-color: #2E8B57;">
            <img src="${process.env.LOGO_URL}" alt="Bezubaan NGO Logo" style="max-width: 150px; height: auto;" />
          </div>
          <div style="padding: 25px;">
            <h2 style="color: #2E8B57; text-align: center;">🙏 Thank You for Reaching Out!</h2>
            <p>Hi ${req.body.name},</p>
            <p>We have received your message and our team at <strong>Bezubaan NGO</strong> will get back to you soon.</p>
            <div style="margin: 15px 0; padding: 15px; background-color: #f1f8f2; border-left: 5px solid #2E8B57;">
              <strong>Your Message:</strong><br>${req.body.message}
            </div>
            <p>We appreciate your support and care for street animals! 🐶🐱</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 0.9em; color: #555; text-align: center;">
              Sent on: ${new Date().toLocaleString()}
            </p>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #2E8B57; color: #fff;">
            Bezubaan - Helping Hands A Charitable Trust
          </div>
        </div>
      </div>
    `;

    await sendMail( req.body.email,userSubject, userEmailHtml); // send to user


    //  await sendMail(
    //   '📩 New Contact Message',
    //   `
    //   <h3>Contact Form Submission</h3>
    //   <p><b>Name:</b> ${req.body.name}</p>
    //   <p><b>Email:</b> ${req.body.email}</p>
    //   <p><b>Message:</b> ${req.body.message}</p>
    //   `
    // );
    } catch (mailError) {
      console.error("Mail sending failed:", mailError);
      // Optionally, you can still respond success if saving to DB worked
      return res.status(500).json({ message: 'Contact saved, but failed to send email', error: mailError.message });
    }
    res.status(200).json({success:true, message: 'Mail sent Successfully to our team', contact });
  } catch (error) {
    console.error("save contact error",error)
    res.status(500).json({ message: 'Error saving contact', error:error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({success:true,contacts});
  } catch (error) {
    res.status(500).json({success:false, message: 'Failed to fetch contacts', error });
  }
};