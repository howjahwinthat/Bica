import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

app.use(cors({
  origin: 'http://localhost:5173' // or your frontend URL
}));
app.use(express.json());

// Test DB connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json({ success: true, time: rows[0].now });
  } catch (err) {import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs'; // for hashing passwords

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database connection
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Root route
app.get('/', (req, res) => res.send('Backend is running'));

// Signup route
app.post('/api/student/signup', async (req, res) => {
  try {
    const { name, email, studentNumber, major, yearLevel, password } = req.body;

    if (!name || !email || !studentNumber || !major || !yearLevel || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email or student number exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into users
    const [userResult] = await db.query(
      'INSERT INTO users (role, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      ['student', name.split(' ')[0], name.split(' ')[1] || '', email, passwordHash]
    );

    const userId = userResult.insertId;

    // Insert into students
    const [studentResult] = await db.query(
      'INSERT INTO students (student_id, student_number, major, year_level, total_credits) VALUES (?, ?, ?, ?, ?)',
      [userId, studentNumber, major, yearLevel, 0.0]
    );

    // In real app, generate JWT
    const token = 'fake-jwt-token';

    res.status(201).json({
      message: 'Student account created',
      user: {
        id: userId,
        name,
        email,
        role: 'student',
        studentNumber,
        major,
        yearLevel,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on http://127.0.0.1:${PORT}`)
);






