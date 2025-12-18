import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, subject, message) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Bezubaan Support",
          email: "ayushshg4@gmail.com", // must be verified in Brevo
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: message,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📧 Mail sent successfully via Brevo");
  } catch (err) {
    console.error(
      "❌ Brevo mail error:",
      err.response?.data || err.message
    );
  }
};
