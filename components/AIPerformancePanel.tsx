
import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Activity } from 'lucide-react';
import { AIPrediction } from '../types';

interface AIProps {
    data?: AIPrediction;
    role: 'student' | 'teacher' | 'parent';
}

// Mock Data if none provided
const MOCK_AI_DATA: AIPrediction = {
    studentId: '1',
    studentName: 'Alex Sharma',
    overallScore: 78,
    riskLevel: 'medium',
    attendanceTrend: 'down',
    gradeTrend: 'up',
    weakSubjects: ['Physics', 'Calculus'],
    strengths: ['Computer Science', 'English'],
    lastUpdated: 'Just now'
};

export const AIPerformancePanel: React.FC<AIProps> = ({ data = MOCK_AI_DATA, role }) => {
    
    const getRiskColor = (level: string) => {
        if(level === 'high') return 'bg-red-500';
        if(level === 'medium') return 'bg-orange-500';
        return 'bg-green-500';
    };

    const getRiskBg = (level: string) => {
        if(level === 'high') return 'bg-red-50 border-red-200';
        if(level === 'medium') return 'bg-orange-50 border-orange-200';
        return 'bg-green-50 border-green-200';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            {/* AI Badge */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={120} />
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">AI Performance Predictor</h3>
                        <p className="text-xs text-slate-500">Real-time academic risk analysis</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Score Circle */}
                    <div className="relative w-40 h-40 shrink-0">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                            <circle 
                                cx="80" cy="80" r="70" 
                                stroke={data.riskLevel === 'high' ? '#ef4444' : data.riskLevel === 'medium' ? '#f97316' : '#22c55e'} 
                                strokeWidth="12" 
                                fill="none" 
                                strokeDasharray="440"
                                strokeDashoffset={440 - (440 * data.overallScore) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-800">{data.overallScore}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">AI Score</span>
                        </div>
                    </div>

                    {/* Analysis Content */}
                    <div className="flex-1 w-full space-y-4">
                        
                        {/* Risk Alert */}
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${getRiskBg(data.riskLevel)}`}>
                            {data.riskLevel === 'high' ? <AlertTriangle className="text-red-600"/> : <Activity className="text-green-600"/>}
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wide opacity-80">Risk Assessment</h4>
                                <p className="font-bold text-lg capitalize">{data.riskLevel} Risk</p>
                            </div>
                        </div>

                        {/* Trends */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1">Attendance Trend</p>
                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                    {data.attendanceTrend === 'up' ? <TrendingUp size={16} className="text-green-500"/> : <TrendingDown size={16} className="text-red-500"/>}
                                    {data.attendanceTrend === 'up' ? 'Improving' : 'Declining'}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1">Grade Trend</p>
                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                    {data.gradeTrend === 'up' ? <TrendingUp size={16} className="text-green-500"/> : <TrendingDown size={16} className="text-red-500"/>}
                                    {data.gradeTrend === 'up' ? 'Rising' : 'Dropping'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions / Weaknesses */}
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-xs text-red-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                            <Target size={14}/> Attention Needed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.weakSubjects.map(s => (
                                <span key={s} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-100">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs text-green-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                            <CheckCircle size={14}/> Strong Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.strengths.map(s => (
                                <span key={s} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {role === 'teacher' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 italic">
                            * AI suggestions are based on data patterns. Please use professional judgment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
