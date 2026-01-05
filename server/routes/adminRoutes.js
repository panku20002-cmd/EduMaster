const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Secure all routes
router.use(protect);
router.use(authorize('admin'));

// Get All Users
router.get('/users', async (req, res) => {
    const result = await db.query('SELECT id, name, email, role, status FROM users ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
});

// Approve Course
router.put('/courses/:id/approve', async (req, res) => {
    const { id } = req.params;
    await db.query("UPDATE courses SET status = 'approved' WHERE id = $1", [id]);
    
    // Audit Log
    await db.query(
        "INSERT INTO audit_logs (admin_id, action, target_type, target_id) VALUES ($1, 'approve_course', 'course', $2)",
        [req.user.id, id]
    );
    res.json({ message: 'Course Approved' });
});

module.exports = router;