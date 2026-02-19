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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on http://127.0.0.1:${PORT}`)
);





