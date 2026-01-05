const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

router.use(protect);
router.use(authorize('teacher'));

// Create Course
router.post('/courses', async (req, res) => {
    const { title, description, category, thumbnail_url } = req.body;
    const result = await db.query(
        "INSERT INTO courses (title, description, teacher_id, category, thumbnail_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, description, req.user.id, category, thumbnail_url]
    );
    res.status(201).json(result.rows[0]);
});

// Create Assignment
router.post('/assignments', async (req, res) => {
    const { course_id, title, due_date } = req.body;
    // Check ownership
    const courseCheck = await db.query("SELECT id FROM courses WHERE id = $1 AND teacher_id = $2", [course_id, req.user.id]);
    if(courseCheck.rows.length === 0) return res.status(403).json({message: 'Not your course'});

    const result = await db.query(
        "INSERT INTO assignments (course_id, title, due_date, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [course_id, title, due_date, req.user.id]
    );
    res.status(201).json(result.rows[0]);
});

module.exports = router;