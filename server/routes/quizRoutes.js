
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');

// --- MOCK QUESTION BANK ---
const QUESTION_BANK = [
    // Beginner
    { id: 'q1', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], correctAnswer: 1, subject: 'Biology', difficulty: 'Beginner' },
    { id: 'q2', text: 'Solve: 5 + 3 * 2', options: ['16', '11', '10', '13'], correctAnswer: 1, subject: 'Math', difficulty: 'Beginner' },
    { id: 'q3', text: 'Which is a noun?', options: ['Run', 'Quickly', 'Table', 'Blue'], correctAnswer: 2, subject: 'English', difficulty: 'Beginner' },
    // Intermediate
    { id: 'q4', text: 'What is the chemical symbol for Gold?', options: ['Ag', 'Au', 'Fe', 'Cu'], correctAnswer: 1, subject: 'Chemistry', difficulty: 'Intermediate' },
    { id: 'q5', text: 'Solve for x: 2x + 5 = 15', options: ['5', '10', '7.5', '2.5'], correctAnswer: 0, subject: 'Math', difficulty: 'Intermediate' },
    { id: 'q6', text: 'Who wrote "Romeo and Juliet"?', options: ['Hemingway', 'Shakespeare', 'Dickens', 'Austen'], correctAnswer: 1, subject: 'English', difficulty: 'Intermediate' },
    // Advanced
    { id: 'q7', text: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], correctAnswer: 1, subject: 'Math', difficulty: 'Advanced' },
    { id: 'q8', text: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Mars', 'Neptune'], correctAnswer: 1, subject: 'Physics', difficulty: 'Advanced' },
    { id: 'q9', text: 'What year did World War II end?', options: ['1942', '1945', '1948', '1950'], correctAnswer: 1, subject: 'History', difficulty: 'Advanced' }
];

// Helper to determine next level
const calculateNewLevel = (currentScore, currentLevel) => {
    if (currentScore >= 80) {
        if (currentLevel === 'Beginner') return 'Intermediate';
        if (currentLevel === 'Intermediate') return 'Advanced';
    } else if (currentScore < 40) {
        if (currentLevel === 'Advanced') return 'Intermediate';
        if (currentLevel === 'Intermediate') return 'Beginner';
    }
    return currentLevel;
};

// @desc    Get Current Weekly Quiz (AI Generated)
// @route   GET /api/quiz/current
router.get('/current', protect, async (req, res) => {
    try {
        // 1. Fetch Student Level (Mocked, would be in DB)
        // const studentProfile = await db.query("SELECT current_level FROM student_profiles WHERE user_id = $1", [req.user.id]);
        // const level = studentProfile.rows[0]?.current_level || 'Beginner';
        
        // Mocking level for demo
        const level = 'Intermediate'; 

        // 2. Generate Quiz based on Level
        // Filter questions that match the level
        const suitableQuestions = QUESTION_BANK.filter(q => q.difficulty === level || q.difficulty === 'Beginner'); // Fallback to easier if needed
        
        // Randomly select 5
        const selectedQuestions = suitableQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

        const quiz = {
            id: 'wk-' + getWeekNumber(new Date()),
            weekNumber: getWeekNumber(new Date()),
            title: `Weekly Assessment (Week ${getWeekNumber(new Date())})`,
            questions: selectedQuestions,
            timeLimit: 300, // 5 minutes
            studentLevel: level,
            status: 'pending'
        };

        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Submit Quiz Results
// @route   POST /api/quiz/submit
router.post('/submit', protect, async (req, res) => {
    const { quizId, score, totalQuestions, currentLevel } = req.body;
    try {
        const percentage = Math.round((score / totalQuestions) * 100);
        const newLevel = calculateNewLevel(percentage, currentLevel);
        
        // 1. Save Result
        await db.query(
            "INSERT INTO quiz_results (user_id, quiz_id, score, percentage, level_at_time) VALUES ($1, $2, $3, $4, $5)",
            [req.user.id, quizId, score, percentage, currentLevel]
        );

        // 2. Update Student Level (AI Adjustment)
        if (newLevel !== currentLevel) {
            // await db.query("UPDATE student_profiles SET current_level = $1 WHERE user_id = $2", [newLevel, req.user.id]);
        }

        // 3. Generate Feedback
        let feedback = "";
        if (percentage >= 80) feedback = `Excellent work! You've been promoted to ${newLevel} level questions.`;
        else if (percentage >= 50) feedback = `Good effort. Keep practicing to reach the next level.`;
        else feedback = `Don't worry. We will adjust the difficulty to help you build a stronger foundation.`;

        res.json({
            success: true,
            score,
            percentage,
            oldLevel: currentLevel,
            newLevel,
            feedback
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get Quiz History (For Parent/Student)
// @route   GET /api/quiz/history/:studentId
router.get('/history/:studentId', protect, async (req, res) => {
    // Auth check: Student can see own, Parent can see child's
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) return res.status(403).json({message: 'Forbidden'});
    
    // If parent, check link (Skipped for brevity, assume middleware handles it)

    try {
        // Mock History Data
        const history = [
            { week: 42, score: 80, level: 'Beginner', date: '2023-10-20' },
            { week: 43, score: 60, level: 'Intermediate', date: '2023-10-27' },
            { week: 44, score: 90, level: 'Intermediate', date: '2023-11-03' }
        ];
        res.json({
            currentLevel: 'Advanced',
            history
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7);
    return weekNo;
}

module.exports = router;
