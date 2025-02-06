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

// Function to send email and store data in PostgreSQL
const sendEmailAndSaveToDB = async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  try {
    // Send email using Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@prudentdubai.com',
      subject: `New Contact Form Submission - ${option_selected}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p><p><strong>Option Selected:</strong> ${option_selected}</p>`,
    });

    // Save form data to PostgreSQL database
    await client.query(
      'INSERT INTO contacts(name, email, message, option_selected) VALUES($1, $2, $3, $4)',
      [name, email, message, option_selected]
    );

    res.json({ message: 'Form submitted and email sent successfully!' });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

// Handling POST request to submit form data
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await sendEmailAndSaveToDB(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
