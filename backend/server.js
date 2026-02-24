app.post('/api/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    // Safely fetch student
    const [students] = await db.query('SELECT * FROM students WHERE student_id = ?', [user.user_id]);

    if (students.length === 0) {
      return res.status(400).json({ message: 'Student record not found' });
    }

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
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
