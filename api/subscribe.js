import { Resend } from 'resend';
import { Client } from 'pg'; 

// Initialize Resend with the API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize PostgreSQL client using environment variable
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon.tech's hosted databases
  },
});

client.connect();

// Route to handle the subscription
const handleSubscription = async (req, res) => {
  const { email, message } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Send subscription email using Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@prudentdubai.com',
      subject: `New Subscription - Subscribe to newsletters`,
      html: `<p><strong>Name:</strong> Subscriber</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message || 'None'}</p><p><strong>Option Selected:</strong> Subscribe to newsletters</p>`,
    });

    // Save subscription details to PostgreSQL database
    await client.query(
      'INSERT INTO contacts(name, email, message, option_selected) VALUES($1, $2, $3, $4)',
      ["Subscriber", email, message || "None", "Subscribe to newsletters"]
    );

    // Send success response
    res.status(200).json({ message: "Subscription successful! Thank you for subscribing." });
  } catch (error) {
    console.error("Error processing subscription:", error.message);
    res.status(500).json({ message: "An error occurred while saving your subscription. Please try again later." });
  }
};

// Handling POST request to subscribe
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await handleSubscription(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
