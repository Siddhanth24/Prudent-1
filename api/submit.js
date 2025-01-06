const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12754242",
  password: "JTnJkFGb67",
  database: "sql12754242",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, option_selected } = req.body;

  if (!name || !email || !message || !option_selected) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO contacts (name, email, message, option_selected) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, message, option_selected], (err) => {
    if (err) {
      console.error("Database insert error: ", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    return res.status(200).json({ message: "Data saved successfully!" });
  });
};

