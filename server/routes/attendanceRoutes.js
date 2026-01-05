const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// @desc    Check if attendance is marked for today
// @route   GET /api/attendance/status
router.get('/status', protect, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await db.query(
            "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
            [req.user.id, today]
        );
        
        if (result.rows.length > 0) {
            res.json({ marked: true, data: result.rows[0] });
        } else {
            res.json({ marked: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Mark attendance for today (Login Gate) with Verification Data
// @route   POST /api/attendance/mark
router.post('/mark', protect, async (req, res) => {
    const { verification_method, location_lat, location_long } = req.body;
    try {
        const today = new Date().toISOString().split('T')[0];
        const check = await db.query(
            "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
            [req.user.id, today]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // In a real app, validate lat/long against geofence here
        // const isValidLocation = checkGeofence(location_lat, location_long);
        // if(!isValidLocation) return res.status(403).json({message: 'Outside allowed campus radius'});

        await db.query(
            "INSERT INTO attendance (user_id, role, date, status, verification_method, location) VALUES ($1, $2, $3, 'present', $4, $5)",
            [req.user.id, req.user.role, today, verification_method || 'manual', location_lat ? `${location_lat},${location_long}` : null]
        );

        res.json({ message: 'Attendance marked successfully', status: 'present' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get Detailed Analytics (Role Based)
// @route   GET /api/attendance/analytics
router.get('/analytics', protect, async (req, res) => {
    try {
        const { range = '30days' } = req.query; // simplified mock logic
        
        let stats = {
            totalDays: 30,
            present: 0,
            absent: 0,
            percentage: 0,
            history: [],
            atRiskStudents: [] // For teachers/admin
        };

        if (req.user.role === 'student') {
            // Fetch student specific
            const history = await db.query(
                "SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC LIMIT 30", 
                [req.user.id]
            );
            stats.history = history.rows;
            stats.present = history.rows.filter(r => r.status === 'present').length;
            stats.absent = history.rows.filter(r => r.status === 'absent').length;
            stats.percentage = Math.round((stats.present / (stats.present + stats.absent || 1)) * 100);
        
        } else if (req.user.role === 'teacher') {
            // Fetch aggregate for enrolled students
            const result = await db.query(`
                SELECT u.name, sp.enrollment_number, 
                COUNT(case when a.status = 'present' then 1 end) as present_count,
                COUNT(a.id) as total_count
                FROM users u
                JOIN student_profiles sp ON u.id = sp.user_id
                JOIN enrollments e ON u.id = e.student_id
                JOIN courses c ON e.course_id = c.id
                LEFT JOIN attendance a ON u.id = a.user_id
                WHERE c.teacher_id = $1 AND u.role = 'student'
                GROUP BY u.id, u.name, sp.enrollment_number
            `, [req.user.id]);

            stats.classData = result.rows.map(row => ({
                name: row.name,
                id: row.enrollment_number,
                percentage: Math.round((parseInt(row.present_count) / parseInt(row.total_count || 1)) * 100)
            }));
            
            stats.atRiskStudents = stats.classData.filter(s => s.percentage < 75);
        }

        res.json(stats);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Admin: Trigger End-of-Day Check & Performance Alerts
// @route   POST /api/attendance/run-daily-check
router.post('/run-daily-check', protect, authorize('admin'), async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // 1. Find & Mark Absent Students
        const absentStudents = await db.query(`
            SELECT u.id, u.name, sp.enrollment_number 
            FROM users u
            JOIN student_profiles sp ON u.id = sp.user_id
            WHERE u.role = 'student' AND u.status = 'active'
            AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.user_id = u.id AND a.date = $1)
        `, [today]);

        for (const student of absentStudents.rows) {
            // Mark Absent
            await db.query(
                "INSERT INTO attendance (user_id, role, date, status, auto_marked) VALUES ($1, 'student', $2, 'absent', TRUE)",
                [student.id, today]
            );

            // 2. CHECK PERCENTAGE FOR ALERTS
            const hist = await db.query("SELECT status FROM attendance WHERE user_id = $1", [student.id]);
            const total = hist.rows.length;
            const present = hist.rows.filter(r => r.status === 'present').length;
            const percentage = Math.round((present / total) * 100);

            // 3. SEND ALERTS BASED ON THRESHOLDS
            if (percentage < 75) {
                const type = percentage < 60 ? 'critical_attendance' : 'warning_attendance';
                const msg = percentage < 60 
                    ? `CRITICAL: ${student.name}'s attendance is ${percentage}%. Immediate action required.`
                    : `WARNING: ${student.name}'s attendance has dropped to ${percentage}%.`;

                // Notify Student
                await db.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, 'Attendance Alert', $2, $3)", [student.id, msg, type]);
                
                // Notify Parents
                const parents = await db.query("SELECT parent_id FROM student_parent_links WHERE student_id = $1 AND status = 'active'", [student.id]);
                for (const parent of parents.rows) {
                    await db.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, 'Child Attendance Alert', $2, $3)", [parent.parent_id, msg, type]);
                }
            }
        }

        res.json({ 
            message: 'Daily check completed & Alerts sent.', 
            students_processed: absentStudents.rowCount 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;