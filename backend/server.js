import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ===============================
// AUTH LOGIN
// ===============================

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = 'admin'",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: "admin",
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    res.json({
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: "admin",
      },
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// STUDIES
// ===============================

app.get("/api/studies", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM studies");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/studies/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM studies WHERE study_id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Study not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/studies", async (req, res) => {
  try {
    const {
      title,
      description,
      researcher_id,
      credit_value,
      max_participants,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await db.query(
      `INSERT INTO studies 
       (title, description, researcher_id, credit_value, max_participants, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        researcher_id || null,
        credit_value || null,
        max_participants || null,
        status || "draft",
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM studies WHERE study_id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error("Create study error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/studies/:id", async (req, res) => {
  console.log("PUT /api/studies/:id hit", req.params.id);
  console.log("body:", req.body);
  try {
    const {
      title,
      description,
      credit_value,
      max_participants,
      status,
    } = req.body;

    await db.query(
      `UPDATE studies 
       SET title = ?, description = ?, credit_value = ?, 
           max_participants = ?, status = ?
       WHERE study_id = ?`,
      [
        title,
        description,
        credit_value,
        max_participants,
        status,
        req.params.id,
      ]
    );

    const [updated] = await db.query(
      "SELECT * FROM studies WHERE study_id = ?",
      [req.params.id]
    );

    res.json(updated[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/studies/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM studies WHERE study_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Study not found" });
    }

    res.json({ message: "Study deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});