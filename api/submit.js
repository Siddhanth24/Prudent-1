const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12756255",
  password: "P5wXTUceKQ",
  database: "sql12756255",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, option_selected } = req.body;

  if (!name || !email || !message || !option_selected) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO contacts (name, email, message, option_selected) VALUES (?, ?, ?, ?)";

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(query, [name, email, message, option_selected]);
    connection.release(); // Release the connection back to the pool

    return res.status(200).json({ message: "Data saved successfully!" });
  } catch (err) {
    console.error("Database error: ", err);
    return res.status(500).json({ error: "Failed to save data" });
  }
};


