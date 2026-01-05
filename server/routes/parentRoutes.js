const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Middleware: All routes here require PARENT role
router.use(protect);
router.use(authorize('parent'));

// Middleware to Check Active Parent-Student Relationship
const verifyParentChildLink = async (req, res, next) => {
    const studentId = req.params.id;
    if (!studentId) return res.status(400).json({ message: 'Student ID required' });

    try {
        const link = await db.query(
            "SELECT * FROM student_parent_links WHERE parent_id = $1 AND student_id = $2 AND status = 'active'",
            [req.user.id, studentId]
        );

        if (link.rows.length === 0) {
            return res.status(403).json({ message: 'Access Denied: This student is not linked or pending approval.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
};

// @desc    Get All Children (Active & Pending)
// @route   GET /api/parent/children
router.get('/children', async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, sp.class_grade, sp.enrollment_number, spl.relationship, spl.status, spl.id as link_id
            FROM users u
            JOIN student_profiles sp ON u.id = sp.user_id
            JOIN student_parent_links spl ON u.id = spl.student_id
            WHERE spl.parent_id = $1
            ORDER BY spl.status, u.name
        `;
        const result = await db.query(query, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Request to Link a New Child
// @route   POST /api/parent/link-request
router.post('/link-request', async (req, res) => {
    const { enrollment_number, relationship } = req.body;
    
    try {
        // 1. Find Student by Enrollment Number
        const studentRes = await db.query(
            "SELECT user_id FROM student_profiles WHERE enrollment_number = $1", 
            [enrollment_number]
        );

        if (studentRes.rows.length === 0) {
            return res.status(404).json({ message: 'Invalid Enrollment Number' });
        }

        const studentId = studentRes.rows[0].user_id;

        // 2. Check if already linked
        const existingLink = await db.query(
            "SELECT * FROM student_parent_links WHERE parent_id = $1 AND student_id = $2",
            [req.user.id, studentId]
        );

        if (existingLink.rows.length > 0) {
            return res.status(400).json({ message: 'Link request already exists' });
        }

        // 3. Create Pending Link
        await db.query(
            "INSERT INTO student_parent_links (parent_id, student_id, relationship, status) VALUES ($1, $2, $3, 'pending')",
            [req.user.id, studentId, relationship || 'Guardian']
        );

        res.status(201).json({ message: 'Link request sent. Waiting for student approval.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Unlink a Child
// @route   DELETE /api/parent/unlink/:studentId
router.delete('/unlink/:studentId', async (req, res) => {
    try {
        await db.query(
            "DELETE FROM student_parent_links WHERE parent_id = $1 AND student_id = $2",
            [req.user.id, req.params.studentId]
        );
        res.json({ message: 'Unlinked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CHILD SPECIFIC DATA ROUTES (Protected by verifyParentChildLink) ---

// @desc    Get Child Progress
router.get('/child/:id/progress', verifyParentChildLink, async (req, res) => {
    try {
        const query = `
            SELECT c.title, e.progress_percent, e.enrolled_at, c.category
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = $1
        `;
        const result = await db.query(query, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get Child Attendance
router.get('/child/:id/attendance', verifyParentChildLink, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC LIMIT 30", [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;