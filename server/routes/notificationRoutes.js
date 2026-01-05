
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// @desc    Get My Notifications
// @route   GET /api/notifications
router.get('/', protect, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Mark Notification as Read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
    try {
        await db.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Trigger Notification (Admin/System Only)
// @route   POST /api/notifications/send
router.post('/send', protect, authorize('admin', 'teacher'), async (req, res) => {
    const { target_user_id, title, message, type, priority } = req.body;
    try {
        // 1. Save to DB
        const result = await db.query(
            "INSERT INTO notifications (user_id, title, message, type, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [target_user_id, title, message, type, priority || 'normal']
        );

        // 2. Mock External Push (Firebase/APNs would go here)
        console.log(`[PUSH SERVICE] Sending to user ${target_user_id}: ${title}`);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
