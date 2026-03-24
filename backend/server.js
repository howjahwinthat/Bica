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

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ===============================
// STUDENT AUTH
// ===============================

// SIGNUP
app.post("/api/student/signup", async (req, res) => {
  const { first_name, last_name, email, password, studentId, course } = req.body;

  if (!first_name || !last_name || !email || !password || !studentId || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check existing
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert user
    const [result] = await db.query(
      `INSERT INTO users (role, first_name, last_name, email, password_hash) 
       VALUES ('student', ?, ?, ?, ?)`,
      [first_name, last_name, email, hashed]
    );

    const user_id = result.insertId;

    // insert student details
    await db.query(
      `INSERT INTO students (student_id, student_number, major) 
       VALUES (?, ?, ?)`,
      [user_id, studentId, course]
    );

    res.status(201).json({ message: "Student registered successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/student/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = 'student'",
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
        role: "student",
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: "student",
      },
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ADMIN AUTH
// ===============================

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
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

    if (user.is_active === 0) {
      return res.status(403).json({ message: "Account is disabled" });
    }

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
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// STUDIES
// ===============================

// GET ALL
app.get("/api/studies", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM studies");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ONE
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

// CREATE
app.post("/api/studies", async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO studies (title, description) VALUES (?, ?)",
      [title, description || null]
    );

    const [rows] = await db.query(
      "SELECT * FROM studies WHERE study_id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
app.put("/api/studies/:id", async (req, res) => {
  const { title, description } = req.body;

  try {
    await db.query(
      "UPDATE studies SET title = ?, description = ? WHERE study_id = ?",
      [title, description, req.params.id]
    );

    const [rows] = await db.query(
      "SELECT * FROM studies WHERE study_id = ?",
      [req.params.id]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
app.delete("/api/studies/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM studies WHERE study_id = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
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