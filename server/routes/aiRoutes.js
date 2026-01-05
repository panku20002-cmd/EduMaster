
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Mock AI Logic Helper
const calculateRisk = (attendance, avgGrade) => {
    if (attendance < 75 || avgGrade < 50) return 'high';
    if (attendance < 85 || avgGrade < 70) return 'medium';
    return 'low';
};

// @desc    Get Student AI Performance Report
// @route   GET /api/ai/performance/:studentId
router.get('/performance/:studentId', protect, async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Security: Only allow student (self), parent (linked), teacher/admin
        if (req.user.role === 'student' && req.user.id !== studentId) return res.status(403).json({message: 'Unauthorized'});
        // Note: Full parent linking check omitted for brevity, assumed handled by middleware in real app

        // 1. Gather Data (Mocked Aggregation)
        // In real app: Fetch real attendance % and Grade AVG from DB
        const attendance = 82; // Mock
        const avgGrade = 78;   // Mock

        // 2. AI Logic Rule Engine
        const risk = calculateRisk(attendance, avgGrade);
        const score = Math.round((attendance * 0.4) + (avgGrade * 0.6));

        const prediction = {
            studentId,
            studentName: 'Student Name', // Fetch from DB
            overallScore: score,
            riskLevel: risk,
            attendanceTrend: 'stable',
            gradeTrend: 'up',
            weakSubjects: ['Physics', 'Calculus'],
            strengths: ['Computer Science', 'English'],
            lastUpdated: new Date().toISOString()
        };

        res.json(prediction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get Class Risk Overview (Teacher)
// @route   GET /api/ai/class-risk
router.get('/class-risk', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        // Mock returning multiple students
        const mockClassData = [
            { studentId: '1', studentName: 'Alex Sharma', overallScore: 78, riskLevel: 'medium', weakSubjects: ['Physics'] },
            { studentId: '2', studentName: 'Rohan Das', overallScore: 45, riskLevel: 'high', weakSubjects: ['Math', 'Physics'] },
            { studentId: '3', studentName: 'Priya Singh', overallScore: 92, riskLevel: 'low', weakSubjects: [] }
        ];
        res.json(mockClassData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
