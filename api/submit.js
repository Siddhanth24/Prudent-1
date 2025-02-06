import { Resend } from 'resend';
import { Client } from 'pg'; // Import PostgreSQL client

// Initialize Resend with your API key
const resend = new Resend('re_iPyA4iJJ_Nmi1yjbnfSyNpRZD7mWbaYUy');

// Initialize PostgreSQL client using Vercel's environment variable for DATABASE_URL
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Vercel will automatically use this from environment variables
});

client.connect();

// Function to send email and store data in PostgreSQL
const sendEmailAndSaveToDB = async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  try {
    // Send email using Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with the sender's email address
      to: 'siddhanth.belliappa@gmail.com', // Replace with the recipient's email address
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
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

// Example: Handling POST request to submit form data
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await sendEmailAndSaveToDB(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
