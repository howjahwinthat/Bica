// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3600; // ✅ match frontend

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ===============================
// HEALTH CHECK
// ===============================
app.get('/', (req, res) => res.send('Backend is running'));

// ===============================
// STUDENT AUTH
// ===============================
app.post('/api/student/signup', async (req, res) => {
  const { name, email, password, studentId, course } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM students WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO students (name, email, password, student_id, course) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashed, studentId || null, course || null]
    );

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/student/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const student = rows[0];
    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   const user = {
      id: String(student.id),
      name: student.name,
      email: student.email,
      role: 'student',
      studentId: student.student_id,
      course: student.course,
      credits: student.credits ?? 0,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
  
});
// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
