const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// --- ADMIN ROUTES ---

// @desc Admin: Get Financial Analytics Dashboard Data
// @route GET /api/finance/admin/analytics
router.get('/admin/analytics', protect, authorize('admin'), async (req, res) => {
    try {
        // Mocking aggregation queries
        // In real app: SUM(amount) from invoices where status='paid'
        const revenueRes = await db.query("SELECT SUM(amount) as total FROM invoices WHERE status = 'paid'");
        const salaryRes = await db.query("SELECT SUM(total_amount) as total FROM salary_slips WHERE status = 'paid'");
        const pendingRes = await db.query("SELECT SUM(amount) as total FROM invoices WHERE status = 'pending'");
        const overdueRes = await db.query("SELECT SUM(amount) as total FROM invoices WHERE status = 'overdue'");

        const stats = {
            totalRevenue: parseInt(revenueRes.rows[0].total) || 1250000,
            totalExpenses: parseInt(salaryRes.rows[0].total) || 850000,
            pendingFees: parseInt(pendingRes.rows[0].total) || 120000,
            overdueFees: parseInt(overdueRes.rows[0].total) || 45000,
            monthlyRevenue: [45, 52, 49, 60, 55, 65, 70, 75, 68, 72, 80, 85], // Mock trend
            monthlyExpenses: [30, 30, 32, 32, 35, 35, 38, 38, 40, 40, 42, 45], // Mock trend
            collectionRate: 92
        };
        res.json(stats);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Admin: Update GST & Reminder Settings
// @route POST /api/finance/admin/settings
router.post('/admin/settings', protect, authorize('admin'), async (req, res) => {
    const { gstEnabled, gstPercentage, gstin, remindersEnabled } = req.body;
    try {
        // Upsert settings table
        await db.query(`
            INSERT INTO system_settings (key, value) 
            VALUES 
            ('gst_enabled', $1), ('gst_percentage', $2), ('gstin', $3), ('reminders_enabled', $4)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `, [gstEnabled, gstPercentage, gstin, remindersEnabled]);
        
        res.json({ message: 'Financial settings updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Admin: Set Teacher Daily Rate
// @route POST /api/finance/admin/set-rate
router.post('/admin/set-rate', protect, authorize('admin'), async (req, res) => {
    const { teacher_id, daily_rate } = req.body;
    try {
        await db.query(
            `INSERT INTO teacher_finance (teacher_id, daily_rate) VALUES ($1, $2)
             ON CONFLICT (teacher_id) DO UPDATE SET daily_rate = $2`,
            [teacher_id, daily_rate]
        );
        res.json({ message: 'Salary rate updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Admin: Run Monthly Salary Calculation (Automated)
// @route POST /api/finance/admin/calculate-salaries
router.post('/admin/calculate-salaries', protect, authorize('admin'), async (req, res) => {
    const { month, year } = req.body; 
    try {
        const teachers = await db.query("SELECT u.id, tf.daily_rate FROM users u LEFT JOIN teacher_finance tf ON u.id = tf.teacher_id WHERE u.role = 'teacher' AND u.status = 'active'");
        const results = [];

        for (const teacher of teachers.rows) {
            const dailyRate = teacher.daily_rate || 0; 
            const attendance = await db.query(
                `SELECT COUNT(*) FROM attendance 
                 WHERE user_id = $1 AND role = 'teacher' AND status = 'present' 
                 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`,
                [teacher.id, month, year]
            );
            
            const presentDays = parseInt(attendance.rows[0].count);
            const grossSalary = presentDays * dailyRate;
            const deductions = 0; // Placeholder for deduction logic
            const netSalary = grossSalary - deductions;

            const slip = await db.query(
                `INSERT INTO salary_slips (user_id, month, year, present_days, daily_rate, total_amount, status)
                 VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
                [teacher.id, month, year, presentDays, dailyRate, netSalary]
            );
            results.push(slip.rows[0]);
        }

        res.json({ message: 'Salaries calculated', count: results.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Admin: Approve Salary Payout
// @route PUT /api/finance/admin/approve-salary/:id
router.put('/admin/approve-salary/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await db.query("UPDATE salary_slips SET status = 'paid', payment_date = NOW() WHERE id = $1", [req.params.id]);
        
        // Notification for Teacher
        const slip = await db.query("SELECT user_id, month FROM salary_slips WHERE id = $1", [req.params.id]);
        await db.query(
            "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, 'Salary Credited', $2, 'finance')",
            [slip.rows[0].user_id, `Your salary for ${slip.rows[0].month} has been approved and processed.`]
        );

        res.json({ message: 'Salary marked as Paid' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- TEACHER ROUTES ---

// @desc Teacher: Get Salary Slips
// @route GET /api/finance/teacher/salary-history
router.get('/teacher/salary-history', protect, authorize('teacher'), async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM salary_slips WHERE user_id = $1 ORDER BY id DESC", 
            [req.user.id]
        );
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- STUDENT/PARENT ROUTES ---

// @desc Get My Fees (Invoices)
// @route GET /api/finance/student/fees
router.get('/student/fees/:studentId', protect, async (req, res) => {
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const query = `
            SELECT i.id, i.invoice_number, i.month, i.year, i.amount, i.tax_amount, i.total_amount, i.status, i.due_date 
            FROM invoices i 
            WHERE i.user_id = $1 
            ORDER BY i.due_date DESC
        `;
        const result = await db.query(query, [req.params.studentId]);
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// @desc Pay Fee
// @route POST /api/finance/pay
router.post('/pay', protect, async (req, res) => {
    const { invoice_id, amount, payment_method } = req.body;
    try {
        await db.query(
            "UPDATE invoices SET status = 'paid', payment_date = NOW(), payment_method = $1 WHERE id = $2",
            [payment_method, invoice_id]
        );

        await db.query(
            "INSERT INTO payments (user_id, invoice_id, amount, method, status) VALUES ($1, $2, $3, $4, 'success')",
            [req.user.id, invoice_id, amount, payment_method]
        );

        res.json({ message: 'Payment Successful', transactionId: 'TXN' + Date.now() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;