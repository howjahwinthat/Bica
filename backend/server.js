import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

// Allow both frontend origins
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

// ===============================
// HEALTH CHECK
// ===============================
app.get('/', (req, res) => res.send('Backend is running'));

// ===============================
// STUDENT AUTH (DB-backed)
// ===============================
app.post('/api/student/signup', async (req, res) => {
  const { first_name, last_name, email, password, studentId, course } = req.body;
  if (!first_name || !last_name || !email || !password || !studentId || !course) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (role, first_name, last_name, email, password_hash) VALUES ('student', ?, ?, ?, ?)`,
      [first_name, last_name, email, hashed]
    );
    const user_id = result.insertId;
    await db.query(
      `INSERT INTO students (student_id, student_number, major) VALUES (?, ?, ?)`,
      [user_id, studentId, course]
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
    const [rows] = await db.query(
      `SELECT * FROM users WHERE email = ? AND role = 'student'`,
      [email]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = {
      id: String(userRow.user_id),
      name: `${userRow.first_name} ${userRow.last_name}`,
      email: userRow.email,
      role: 'student',
    };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ===============================
// STUDENTS (in-memory, legacy)
// ===============================
let students = [];

app.post('/api/students/signup', (req, res) => {
  console.log('Received signup request:', req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.log('Signup failed: missing fields');
    return res.status(400).json({ message: 'All fields required' });
  }
  if (students.find(s => s.email === email)) {
    console.log('Signup failed: email exists');
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newStudent = { id: students.length + 1, name, email, password, role: 'student' };
  students.push(newStudent);
  const token = jwt.sign(
    { id: newStudent.id, role: 'student' },
    process.env.JWT_SECRET || 'secret'
  );
  console.log('Signup success:', newStudent);
  res.json({
    user: { id: newStudent.id, email: newStudent.email, role: 'student' },
    token,
  });
});

// ===============================
// ROOMS & TIMESLOTS
// ===============================
let rooms = [
  { id: 1, name: 'Room A', capacity: 10 },
  { id: 2, name: 'Room B', capacity: 5 },
];
let timeslots = [];

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/api/timeslots', (req, res) => {
  const newTimeslot = { id: timeslots.length + 1, ...req.body };
  timeslots.push(newTimeslot);
  res.status(201).json(newTimeslot);
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
