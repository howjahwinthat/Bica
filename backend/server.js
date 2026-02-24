import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===============================
   STUDENT SIGNUP
================================ */
app.post('/api/student/signup', async (req, res) => {
  try {
    const { name, email, studentId, course, password } = req.body;

    if (!name || !email || !studentId || !course || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into users table
    const [userResult] = await db.query(
      'INSERT INTO users (role, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [
        'student',
        name.split(' ')[0],
        name.split(' ').slice(1).join(' ') || '',
        email,
        passwordHash,
      ]
    );

    const userId = userResult.insertId;

    // Insert into students table
    await db.query(
      'INSERT INTO students (student_id, student_number, major, year_level, total_credits) VALUES (?, ?, ?, ?, ?)',
      [userId, studentId, course, '1', 0.0]
    );

    // Create REAL JWT
    const token = jwt.sign(
      {
        id: userId.toString(),
        name,
        email,
        role: 'student',
        studentId,
        course,
        credits: 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Student account created',
      user: {
        id: userId.toString(),
        name,
        email,
        role: 'student',
        studentId,
        course,
        credits: 0,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   STUDENT LOGIN
================================ */
app.post('/api/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const [students] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [user.user_id]
    );

    const student = students[0];

    const fullName = `${user.first_name} ${user.last_name}`.trim();

    const token = jwt.sign(
      {
        id: user.user_id.toString(),
        name: fullName,
        email: user.email,
        role: user.role,
        studentId: student.student_number,
        course: student.major,
        credits: student.total_credits,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user.user_id.toString(),
        name: fullName,
        email: user.email,
        role: user.role,
        studentId: student.student_number,
        course: student.major,
        credits: student.total_credits,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on http://127.0.0.1:${PORT}`)
);
