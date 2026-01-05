const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

router.use(protect);
router.use(authorize('student'));

// View My Profile (Includes Enrollment Number)
router.get('/profile', async (req, res) => {
    try {
        const query = `
            SELECT u.name, u.email, u.mobile, sp.class_grade, sp.enrollment_number, sp.bio
            FROM users u
            JOIN student_profiles sp ON u.id = sp.user_id
            WHERE u.id = $1
        `;
        const result = await db.query(query, [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
        
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- PARENT LINK APPROVALS ---

// @desc Get Pending Parent Requests
// @route GET /api/student/parent-requests
router.get('/parent-requests', async (req, res) => {
    try {
        const query = `
            SELECT spl.id, u.name as parent_name, u.email, spl.relationship, spl.created_at
            FROM student_parent_links spl
            JOIN users u ON spl.parent_id = u.id
            WHERE spl.student_id = $1 AND spl.status = 'pending'
        `;
        const result = await db.query(query, [req.user.id]);
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Approve Parent Request
// @route PUT /api/student/approve-parent/:linkId
router.put('/approve-parent/:linkId', async (req, res) => {
    try {
        // Security check: Ensure the link belongs to this student
        const result = await db.query(
            "UPDATE student_parent_links SET status = 'active' WHERE id = $1 AND student_id = $2 RETURNING *",
            [req.params.linkId, req.user.id]
        );
        if(result.rows.length === 0) return res.status(404).json({ message: 'Request not found' });
        res.json({ message: 'Parent access approved' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Reject Parent Request
// @route DELETE /api/student/reject-parent/:linkId
router.delete('/reject-parent/:linkId', async (req, res) => {
    try {
        const result = await db.query(
            "DELETE FROM student_parent_links WHERE id = $1 AND student_id = $2 RETURNING *",
            [req.params.linkId, req.user.id]
        );
        if(result.rows.length === 0) return res.status(404).json({ message: 'Request not found' });
        res.json({ message: 'Parent request rejected' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- CORE STUDENT FEATURES ---

// View Available Courses
router.get('/explore', async (req, res) => {
    const result = await db.query("SELECT * FROM courses WHERE status = 'approved'");
    res.json(result.rows);
});

// Enroll
router.post('/enroll/:courseId', async (req, res) => {
    try {
        await db.query(
            "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)",
            [req.user.id, req.params.courseId]
        );
        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (e) {
        res.status(400).json({ message: 'Already enrolled or error' });
    }
});

// Submit Assignment
router.post('/submit/:assignmentId', async (req, res) => {
    const { file_url } = req.body;
    await db.query(
        "INSERT INTO submissions (assignment_id, student_id, file_url) VALUES ($1, $2, $3)",
        [req.params.assignmentId, req.user.id, file_url]
    );
    res.json({ message: 'Assignment Submitted' });
});

module.exports = router;