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

// ===============================
// RA AUTH
// ===============================

app.post("/api/ra/signup", async (req, res) => {
  const { first_name, last_name, email, password, department } = req.body;
  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const [existing] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (role, first_name, last_name, email, password_hash) VALUES ('researcher', ?, ?, ?, ?)",
      [first_name, last_name, email, hashed]
    );
    await db.query(
      "INSERT INTO researchers (researcher_id, department) VALUES (?, ?)",
      [result.insertId, department || null]
    );
    res.status(201).json({ message: "RA account created successfully" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/ra/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'researcher'", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });
    const user = rows[0];
    if (!await bcrypt.compare(password, user.password_hash))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: "researcher", name: `${user.first_name} ${user.last_name}` },
      process.env.JWT_SECRET || "secret", { expiresIn: "8h" }
    );
    res.json({ user: { id: user.user_id, name: `${user.first_name} ${user.last_name}`, email: user.email, role: "researcher" }, token });
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

app.put("/api/studies/:id", async (req, res) => {
  const { title, description, proctor, department, study_type, studyType, duration, credits, credit_value, eligibility_criteria, eligibilityCriteria, is_active, isActive, requires_prescreen, requiresPrescreen, is_open, building, room_number, roomNumber, status } = req.body;
  try {
    const [current] = await db.query("SELECT * FROM studies WHERE study_id = ?", [req.params.id]);
    if (!current.length) return res.status(404).json({ message: "Study not found" });
    const existing = current[0];
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

// ===============================
// TRAINING
// ===============================

app.get("/api/training/workflows", async (req, res) => {
  try {
    const [workflows] = await db.query("SELECT * FROM training_workflows ORDER BY created_at ASC");
    for (const workflow of workflows) {
      const [modules] = await db.query(
        "SELECT * FROM training_modules WHERE workflow_id = ? ORDER BY order_index ASC",
        [workflow.workflow_id]
      );
      for (const module of modules) {
        if (module.type === "quiz") {
          const [questions] = await db.query(
            "SELECT * FROM training_quiz_questions WHERE module_id = ?",
            [module.module_id]
          );
          module.questions = questions.map((q) => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
          }));
        }
      }
      workflow.modules = modules;
    }
    res.json(workflows);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/training/workflows", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const [result] = await db.query(
      "INSERT INTO training_workflows (title, description) VALUES (?, ?)",
      [title, description || null]
    );
    const [rows] = await db.query("SELECT * FROM training_workflows WHERE workflow_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.delete("/api/training/workflows/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM training_workflows WHERE workflow_id = ?", [req.params.id]);
    res.json({ message: "Workflow deleted" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/training/modules", async (req, res) => {
  const { workflow_id, title, description, type, content, order_index } = req.body;
  if (!workflow_id || !title || !type) return res.status(400).json({ message: "Missing required fields" });
  try {
    const [result] = await db.query(
      "INSERT INTO training_modules (workflow_id, title, description, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [workflow_id, title, description || null, type, content || null, order_index || 0]
    );
    const [rows] = await db.query("SELECT * FROM training_modules WHERE module_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.delete("/api/training/modules/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM training_modules WHERE module_id = ?", [req.params.id]);
    res.json({ message: "Module deleted" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/training/questions", async (req, res) => {
  const { module_id, question, type, options, correct_answer } = req.body;
  if (!module_id || !question || !type || !correct_answer) return res.status(400).json({ message: "Missing required fields" });
  try {
    const [result] = await db.query(
      "INSERT INTO training_quiz_questions (module_id, question, type, options, correct_answer) VALUES (?, ?, ?, ?, ?)",
      [module_id, question, type, JSON.stringify(options || []), correct_answer]
    );
    const [rows] = await db.query("SELECT * FROM training_quiz_questions WHERE question_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.delete("/api/training/questions/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM training_quiz_questions WHERE question_id = ?", [req.params.id]);
    res.json({ message: "Question deleted" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.get("/api/training/progress/:userId", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM training_progress WHERE user_id = ?", [req.params.userId]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/training/progress", async (req, res) => {
  const { user_id, module_id, completed, score } = req.body;
  if (!user_id || !module_id) return res.status(400).json({ message: "Missing required fields" });
  try {
    const [existing] = await db.query(
      "SELECT * FROM training_progress WHERE user_id = ? AND module_id = ?",
      [user_id, module_id]
    );
    if (existing.length) {
      await db.query(
        "UPDATE training_progress SET completed=?, score=?, completed_at=? WHERE user_id=? AND module_id=?",
        [completed ? 1 : 0, score || null, completed ? new Date() : null, user_id, module_id]
      );
    } else {
      await db.query(
        "INSERT INTO training_progress (user_id, module_id, completed, score, completed_at) VALUES (?, ?, ?, ?, ?)",
        [user_id, module_id, completed ? 1 : 0, score || null, completed ? new Date() : null]
      );
    }
    res.json({ message: "Progress saved" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/training/seed", async (req, res) => {
  try {
    const [existing] = await db.query("SELECT * FROM training_workflows LIMIT 1");
    if (existing.length) return res.json({ message: "Already seeded" });

    const [w1] = await db.query(
      "INSERT INTO training_workflows (title, description) VALUES (?, ?)",
      ["New Researcher Onboarding", "Essential training for new research assistants and principal investigators"]
    );
    const [w2] = await db.query(
      "INSERT INTO training_workflows (title, description) VALUES (?, ?)",
      ["Data Management & Privacy", "Learn best practices for handling participant data securely"]
    );

    const [m1] = await db.query(
      "INSERT INTO training_modules (workflow_id, title, description, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [w1.insertId, "Introduction to BICA", "Overview of the BICA system and its features", "guide",
        "Welcome to BICA! This guide will walk you through the core features of the system.\n\nWhat is BICA?\nBICA is a research study management platform that helps administrators create and manage studies, onboard participants, and track progress.\n\nKey Features:\n- Create and manage research studies\n- Approve or reject study submissions\n- Track participant sessions\n- Manage credits and attendance\n\nPlease read through this guide carefully before proceeding to the next module.", 0]
    );
    const [m2] = await db.query(
      "INSERT INTO training_modules (workflow_id, title, description, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [w1.insertId, "Creating Your First Study", "Step-by-step guide to setting up a research study", "guide",
        "How to Create a Study\n\n1. Navigate to Create Study from the dashboard.\n2. Fill in the study title, proctor name, and department.\n3. Select the study type: Online, In-Person, or Hybrid.\n4. Choose the duration and credit value.\n5. Select the building and enter the room number.\n6. Add a description and eligibility criteria.\n7. Click Create Study.\n\nOnce created, your study will appear in the Study Approval queue with a Draft status. An admin will review and approve it before it becomes active.", 1]
    );
    const [m3] = await db.query(
      "INSERT INTO training_modules (workflow_id, title, description, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [w1.insertId, "Knowledge Check: Basics", "Test your understanding of core concepts", "quiz", null, 2]
    );

    await db.query(
      "INSERT INTO training_quiz_questions (module_id, question, type, options, correct_answer) VALUES (?, ?, ?, ?, ?)",
      [m3.insertId, "What status does a study have when first created?", "multiple_choice",
        JSON.stringify(["Active", "Draft", "Closed", "Pending"]), "Draft"]
    );
    await db.query(
      "INSERT INTO training_quiz_questions (module_id, question, type, options, correct_answer) VALUES (?, ?, ?, ?, ?)",
      [m3.insertId, "Admins can approve or reject studies from the Study Approval page.", "true_false",
        JSON.stringify(["True", "False"]), "True"]
    );

    const [m4] = await db.query(
      "INSERT INTO training_modules (workflow_id, title, description, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [w2.insertId, "GDPR & Privacy Regulations", "Understanding data protection requirements", "guide",
        "Data Privacy Guidelines\n\nAll research data must be handled in accordance with GDPR and institutional privacy policies.\n\nKey Rules:\n- Never share participant personal data outside the research team.\n- All data must be stored securely and encrypted where possible.\n- Participants must provide informed consent before data collection.\n- Data should only be retained for as long as necessary.\n\nYour Responsibilities:\n1. Ensure all study participants have signed consent forms.\n2. Do not store participant data on personal devices.\n3. Report any data breaches immediately to the admin team.", 0]
    );
    await db.query(
      "INSERT INTO training_quiz_questions (module_id, question, type, options, correct_answer) VALUES (?, ?, ?, ?, ?)",
      [m4.insertId, "Participant data can be shared freely with other departments.", "true_false",
        JSON.stringify(["True", "False"]), "False"]
    );

    res.json({ message: "Seeded successfully" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));