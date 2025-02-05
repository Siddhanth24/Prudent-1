const express = require("express");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// Database connection (use the DATABASE_URL from Vercel)
const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_DN2KtQv7lWxs@ep-blue-tooth-a7arao3j-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ruddhansika@gmail.com",
    pass: "Thanuja1624!",
  },
});

// Contact Form API
app.post("/api/submit", async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  const mailOptions = {
    from: "ruddhansika@gmail.com",
    to: "siddhanth.belliappa@gmail.com",
    subject: `New Contact Form Submission - ${option_selected}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Form submitted and email sent!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Subscription API (Save data in Neon PostgreSQL)
app.post("/api/subscribe", async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const sql = `
      INSERT INTO contacts (name, email, message, option_selected)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [
      name || "Subscriber",
      email,
      message || "None",
      option_selected || "Subscribe to Newsletter",
    ];

    await pool.query(sql, values);

    res.status(200).json({ message: "Subscription successful! Thank you for subscribing." });
  } catch (error) {
    console.error("Error saving subscription:", error.message);
    res.status(500).json({ message: "An error occurred while saving your subscription. Please try again later." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
