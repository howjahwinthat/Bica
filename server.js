import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

// Allow frontend requests from localhost:5174
app.use(cors({ origin: "http://localhost:5174" }));
app.use(express.json());

// ===== STUDENTS =====
let students = []; // in-memory store

// POST /api/students/signup
app.post("/api/students/signup", (req, res) => {
  console.log("Received signup request:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Signup failed: missing fields");
    return res.status(400).json({ message: "All fields required" });
  }

  if (students.find(s => s.email === email)) {
    console.log("Signup failed: email exists");
    return res.status(400).json({ message: "Email already exists" });
  }

  const newStudent = { id: students.length + 1, name, email, password, role: "student" };
  students.push(newStudent);

  const token = jwt.sign({ id: newStudent.id, role: "student" }, "secretkey");

  console.log("Signup success:", newStudent);
  res.json({ user: { id: newStudent.id, email: newStudent.email, role: "student" }, token });
});

// ===== ROOMS & TIMESLOTS =====
let rooms = [
  { id: 1, name: "Room A", capacity: 10 },
  { id: 2, name: "Room B", capacity: 5 },
];

let timeslots = [];

// GET rooms
app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

// POST timeslot
app.post("/api/timeslots", (req, res) => {
  const newTimeslot = { id: timeslots.length + 1, ...req.body };
  timeslots.push(newTimeslot);
  res.status(201).json(newTimeslot);
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));