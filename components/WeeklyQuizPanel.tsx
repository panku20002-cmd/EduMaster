
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Brain, ChevronRight, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { WeeklyQuiz, QuizQuestion, StudentLevel } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Fetch Helper
const fetchQuiz = (): WeeklyQuiz => ({
    id: 'wk-45',
    weekNumber: 45,
    title: 'AI Weekly Assessment',
    timeLimit: 180, // 3 mins
    studentLevel: 'Intermediate',
    status: 'pending',
    questions: [
        { id: '1', text: 'What is the chemical symbol for Gold?', options: ['Ag', 'Au', 'Fe', 'Cu'], correctAnswer: 1, subject: 'Chemistry', difficulty: 'Intermediate' },
        { id: '2', text: 'Solve for x: 3x - 7 = 14', options: ['5', '7', '6', '8'], correctAnswer: 1, subject: 'Math', difficulty: 'Intermediate' },
        { id: '3', text: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'], correctAnswer: 0, subject: 'Physics', difficulty: 'Intermediate' }
    ]
});

export const WeeklyQuizPanel: React.FC = () => {
    const [phase, setPhase] = useState<'intro' | 'active' | 'result'>('intro');
    const [quiz, setQuiz] = useState<WeeklyQuiz | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [resultData, setResultData] = useState<{score: number, oldLevel: StudentLevel, newLevel: StudentLevel, feedback: string} | null>(null);

    useEffect(() => {
        // Load quiz
        const data = fetchQuiz();
        setQuiz(data);
        setTimeLeft(data.timeLimit);
    }, []);

    useEffect(() => {
        let timer: any;
        if (phase === 'active' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && phase === 'active') {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [phase, timeLeft]);

    const handleStart = () => {
        setPhase('active');
    };

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (!quiz) return;
        if (currentQIndex < quiz.questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!quiz) return;
        // Calculate Score
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });

        // Mock AI Level Adjustment Logic
        const percentage = (correctCount / quiz.questions.length) * 100;
        let newLevel = quiz.studentLevel;
        if (percentage > 80 && quiz.studentLevel !== 'Advanced') newLevel = 'Advanced';
        if (percentage < 40 && quiz.studentLevel !== 'Beginner') newLevel = 'Beginner';

        setResultData({
            score: percentage,
            oldLevel: quiz.studentLevel,
            newLevel: newLevel,
            feedback: percentage > 80 ? "Fantastic! You've leveled up." : percentage < 40 ? "We'll adjust the difficulty to help you learn." : "Good job! Keep going."
        });
        setPhase('result');
    };

    if (!quiz) return <div className="p-8 text-center text-slate-500">Loading Assessment...</div>;

    // --- INTRO SCREEN ---
    if (phase === 'intro') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto mt-8">
                <div className="bg-indigo-600 p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                        <Brain size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Weekly AI Assessment</h2>
                    <p className="opacity-90 text-sm">Week {quiz.weekNumber} • {quiz.questions.length} Questions • {Math.ceil(quiz.timeLimit/60)} Mins</p>
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                        <div>
                            <p className="text-xs text-indigo-500 font-bold uppercase">Current Level</p>
                            <p className="text-xl font-bold text-indigo-900">{quiz.studentLevel}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-indigo-500 font-bold uppercase">Target</p>
                            <p className="text-sm font-bold text-indigo-900">Score 80%+ to Level Up</p>
                        </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Questions are tailored to your current progress.</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Results will update your AI learning path.</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Once started, the timer cannot be paused.</li>
                    </ul>

                    <button onClick={handleStart} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg">
                        Start Assessment
                    </button>
                </div>
            </div>
        );
    }

    // --- QUIZ ACTIVE ---
    if (phase === 'active') {
        const question = quiz.questions[currentQIndex];
        const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl mx-auto mt-8 flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {currentQIndex + 1} / {quiz.questions.length}</p>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{question.subject}</span>
                    </div>
                    <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                        <Clock size={20} />
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1">
                    <motion.div 
                        className="h-full bg-indigo-600"
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                        {question.text}
                    </h3>

                    <div className="space-y-4">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                                    ${answers[currentQIndex] === idx 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold shadow-sm' 
                                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                                `}
                            >
                                <span>{opt}</span>
                                {answers[currentQIndex] === idx && <CheckCircle size={20} className="text-indigo-600"/>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={handleNext}
                        disabled={answers[currentQIndex] === undefined}
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {currentQIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'} <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // --- RESULTS ---
    if (phase === 'result' && resultData) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto mt-8 text-center p-12">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Award size={48} className="text-green-600" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
                <p className="text-slate-500 mb-8">{resultData.feedback}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Score</p>
                        <p className="text-4xl font-bold text-slate-800">{resultData.score}%</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Level Update</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-bold text-slate-500">{resultData.oldLevel}</span>
                            <ChevronRight size={16} className="text-slate-300"/>
                            <span className={`text-xl font-bold ${resultData.newLevel !== resultData.oldLevel ? 'text-indigo-600' : 'text-slate-800'}`}>
                                {resultData.newLevel}
                            </span>
                            {resultData.newLevel !== resultData.oldLevel && (
                                resultData.score > 50 
                                    ? <TrendingUp size={20} className="text-green-500"/>
                                    : <TrendingDown size={20} className="text-red-500"/>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => window.location.reload()} 
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return null;
};
