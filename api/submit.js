const express = require("express");
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(express.json());

// Set SendGrid API Key
sgMail.setApiKey("N7aGDljKF7A.KNWpX3tZmr_uRxesp7ETscN4ebOtM26JUg6RxZZeCXc");

app.post("/api/submit", async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  const msg = {
    to: 'siddhanth.belliappa@gmail.com', // Destination email address
    from: 'no-reply@yourdomain.com', // Your SendGrid verified sender email
    subject: `New Contact Form Submission - ${option_selected}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await sgMail.send(msg);
    res.json({ message: "Form submitted and email sent!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
