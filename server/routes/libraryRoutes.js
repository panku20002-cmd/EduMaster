
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// @desc    Get Library Analytics (Admin Only)
// @route   GET /api/library/analytics
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
    try {
        // Mocking complex analytics queries
        const stats = {
            totalBooks: 450,
            totalDownloads: 1250,
            activeReaders: 320,
            mostReadBooks: [
                { id: 'b1', title: 'Concepts of Physics', count: 450 },
                { id: 'b3', title: 'Calculus Made Easy', count: 380 },
                { id: 'b7', title: 'Class 10 Past Papers', count: 310 }
            ],
            subjectUsage: [
                { subject: 'Physics', count: 35 },
                { subject: 'Math', count: 30 },
                { subject: 'Chemistry', count: 20 },
                { subject: 'History', count: 15 }
            ],
            dailyActivity: [120, 145, 132, 160, 110, 180, 195] // Last 7 days
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Log Book Download & Check Offline Permissions
// @route   POST /api/library/download/:bookId
router.post('/download/:bookId', protect, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        // 1. Check if book is downloadable
        // const book = await db.query("SELECT is_downloadable FROM library_books WHERE id = $1", [bookId]);
        // if (!book.rows[0].is_downloadable) return res.status(403).json({message: 'Download not allowed'});

        // 2. Log Download
        await db.query(
            "INSERT INTO library_downloads (user_id, book_id, timestamp) VALUES ($1, $2, NOW())",
            [userId, bookId]
        );

        // 3. Return Encrypted Token/URL for offline access
        res.json({ 
            message: 'Download authorized',
            offlineToken: 'ENC-' + Math.random().toString(36).substr(2),
            expiry: '30d' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get AI Recommendations
// @route   GET /api/library/recommendations
router.get('/recommendations', protect, async (req, res) => {
    try {
        const user = req.user;
        let recommendedBooks = [];

        // Mock AI Logic
        if (user.role === 'student') {
            // Fetch student profile for class/subjects
            // const profile = await db.query("SELECT class_grade FROM student_profiles WHERE user_id = $1", [user.id]);
            // const grade = profile.rows[0].class_grade;
            
            // Mock recommendation based on "Weak Subject" or "Current Class"
            recommendedBooks = [
                { id: 'b1', reason: 'Recommended for Class 12 Physics' },
                { id: 'b5', reason: 'Essential Lab Manual for your course' }
            ];
        } else if (user.role === 'teacher') {
            recommendedBooks = [
                { id: 'b6', reason: 'New teaching resource for Python' },
                { id: 'b2', reason: 'Popular reference among your students' }
            ];
        }

        res.json(recommendedBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
