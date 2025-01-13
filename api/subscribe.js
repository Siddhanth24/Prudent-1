const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

// Middleware for parsing JSON data
app.use(express.json());

// Create a MySQL connection pool
const dbConfig = {
    host: "sql12.freesqldatabase.com",
    user: "sql12756255",
    password: "P5wXTUceKQ",
    database: "sql12756255",
    port: 3306,
};
const pool = mysql.createPool(dbConfig);

// Route to handle the subscription
app.post("/api/subscribe", async (req, res) => {
  const { name, email, message, option_selected } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Insert subscription details into the database
    const sql = `
      INSERT INTO your_table_name (name, email, message, option_selected)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      name || "Subscriber", // Default name if none provided
      email,
      message || "None", // Default message if none provided
      option_selected || "Subscribe to Newsletter",
    ];

    await pool.query(sql, values);

    // Send success response
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
