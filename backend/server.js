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

app.get("/", (req, res) => res.send("Backend is running"));

// STUDENT AUTH
app.post("/api/student/signup", async (req, res) => {
  const { first_name, last_name, email, password, studentId, course } = req.body;
  if (!first_name || !last_name || !email || !password || !studentId || !course)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const [existing] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (role, first_name, last_name, email, password_hash) VALUES ('student', ?, ?, ?, ?)",
      [first_name, last_name, email, hashed]
    );
    await db.query("INSERT INTO students (student_id, student_number, major) VALUES (?, ?, ?)",
      [result.insertId, studentId, course]);
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/student/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'student'", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });
    const user = rows[0];
    if (!await bcrypt.compare(password, user.password_hash))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: "student", name: `${user.first_name} ${user.last_name}` },
      process.env.JWT_SECRET || "secret", { expiresIn: "7d" }
    );
    res.json({ user: { id: user.user_id, name: `${user.first_name} ${user.last_name}`, email: user.email, role: "student" }, token });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

// ADMIN AUTH
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'admin'", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });
    const user = rows[0];
    if (user.is_active === 0) return res.status(403).json({ message: "Account is disabled" });
    if (!await bcrypt.compare(password, user.password_hash))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: "admin", name: `${user.first_name} ${user.last_name}` },
      process.env.JWT_SECRET || "secret", { expiresIn: "8h" }
    );
    res.json({ user: { id: user.user_id, name: `${user.first_name} ${user.last_name}`, email: user.email, role: "admin" }, token });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

// STUDIES
app.get("/api/studies", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM studies ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.get("/api/studies/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM studies WHERE study_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Study not found" });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/studies", async (req, res) => {
  const { title, description, proctor, department, studyType, duration, credits, eligibilityCriteria, isActive, requiresPrescreen, building, roomNumber } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const [result] = await db.query(
      `INSERT INTO studies (title, description, proctor, department, study_type, duration, credit_value, eligibility_criteria, is_active, requires_prescreen, building, room_number, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [title, description||null, proctor||null, department||null, studyType||null, duration||null, credits||null, eligibilityCriteria||null, isActive?1:0, requiresPrescreen?1:0, building||null, roomNumber||null]
    );
    const [rows] = await db.query("SELECT * FROM studies WHERE study_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

// FIXED PUT — never overwrites status unless explicitly passed
app.put("/api/studies/:id", async (req, res) => {
  const { title, description, proctor, department, study_type, studyType, duration, credits, credit_value, eligibility_criteria, eligibilityCriteria, is_active, isActive, requires_prescreen, requiresPrescreen, is_open, building, room_number, roomNumber, status } = req.body;
  try {
    // First get current study so we don't lose existing status
    const [current] = await db.query("SELECT * FROM studies WHERE study_id = ?", [req.params.id]);
    if (!current.length) return res.status(404).json({ message: "Study not found" });
    const existing = current[0];

    // Only update status if explicitly provided, otherwise keep existing
    const finalStatus = status !== undefined ? status : existing.status;

    await db.query(
      `UPDATE studies SET title=?, description=?, proctor=?, department=?, study_type=?, duration=?, credit_value=?, eligibility_criteria=?, is_active=?, requires_prescreen=?, is_open=?, building=?, room_number=?, status=? WHERE study_id=?`,
      [
        title || existing.title,
        description !== undefined ? description : existing.description,
        proctor !== undefined ? proctor : existing.proctor,
        department !== undefined ? department : existing.department,
        studyType || study_type || existing.study_type,
        duration !== undefined ? duration : existing.duration,
        credits || credit_value || existing.credit_value,
        eligibilityCriteria || eligibility_criteria || existing.eligibility_criteria,
        isActive !== undefined ? (isActive ? 1 : 0) : existing.is_active,
        requiresPrescreen !== undefined ? (requiresPrescreen ? 1 : 0) : existing.requires_prescreen,
        is_open !== undefined ? (is_open ? 1 : 0) : existing.is_open,
        building !== undefined ? building : existing.building,
        roomNumber || room_number || existing.room_number,
        finalStatus,
        req.params.id,
      ]
    );
    const [rows] = await db.query("SELECT * FROM studies WHERE study_id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.delete("/api/studies/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM studies WHERE study_id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Study not found" });
    res.json({ message: "Study deleted successfully" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
