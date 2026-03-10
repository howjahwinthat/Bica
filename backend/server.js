// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js'; // your MySQL pool

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ===============================
// HEALTH CHECK
// ===============================
app.get('/', (req, res) => res.send('Backend is running'));

// ===============================
// ROOMS
// ===============================
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, capacity FROM rooms');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ===============================
// STUDIES WITH TIMESLOTS
// ===============================

// CREATE NEW STUDY + TIMESLOTS
app.post('/api/studies', async (req, res) => {
  const { title, description, researcher_id, credit_value, max_participants, status, timeslots } = req.body;

  if (!title || !description || !researcher_id || !credit_value || !max_participants || !status) {
    return res.status(400).json({ message: 'All study fields are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO studies
        (title, description, researcher_id, credit_value, max_participants, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, researcher_id, credit_value, max_participants, status]
    );

    const study_id = result.insertId;

    // Insert timeslots if provided
    if (Array.isArray(timeslots)) {
      for (let t of timeslots) {
        const { room_id, start_datetime, end_datetime } = t;
        if (room_id && start_datetime && end_datetime) {
          await db.query(
            `INSERT INTO timeslots (study_id, room_id, start_time, end_time)
             VALUES (?, ?, ?, ?)`,
            [study_id, room_id, start_datetime, end_datetime]
          );
        }
      }
    }

    res.status(201).json({ study_id, message: 'Study and timeslots created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT STUDY + TIMESLOTS
app.put('/api/studies/:study_id', async (req, res) => {
  const { study_id } = req.params;
  const { title, description, researcher_id, credit_value, max_participants, status, timeslots } = req.body;

  try {
    await db.query(
      `UPDATE studies
       SET title = ?, description = ?, researcher_id = ?, credit_value = ?, max_participants = ?, status = ?
       WHERE study_id = ?`,
      [title, description, researcher_id, credit_value, max_participants, status, study_id]
    );

    // Delete existing timeslots and replace
    if (Array.isArray(timeslots)) {
      await db.query(`DELETE FROM timeslots WHERE study_id = ?`, [study_id]);
      for (let t of timeslots) {
        const { room_id, start_datetime, end_datetime } = t;
        if (room_id && start_datetime && end_datetime) {
          await db.query(
            `INSERT INTO timeslots (study_id, room_id, start_time, end_time)
             VALUES (?, ?, ?, ?)`,
            [study_id, room_id, start_datetime, end_datetime]
          );
        }
      }
    }

    res.json({ study_id, message: 'Study and timeslots updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL STUDIES WITH TIMESLOTS
app.get('/api/studies', async (req, res) => {
  try {
    const [studies] = await db.query('SELECT * FROM studies');
    const result = [];

    for (let s of studies) {
      const [slots] = await db.query(
        'SELECT id, room_id, start_time, end_time FROM timeslots WHERE study_id = ?',
        [s.study_id]
      );
      result.push({ ...s, timeslots: slots });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET SINGLE STUDY WITH TIMESLOTS
app.get('/api/studies/:study_id', async (req, res) => {
  const { study_id } = req.params;
  try {
    const [studies] = await db.query('SELECT * FROM studies WHERE study_id = ?', [study_id]);
    if (!studies.length) return res.status(404).json({ message: 'Study not found' });

    const [slots] = await db.query(
      'SELECT id, room_id, start_time AS start_datetime, end_time AS end_datetime FROM timeslots WHERE study_id = ?',
      [study_id]
    );

    res.json({ ...studies[0], timeslots: slots });
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