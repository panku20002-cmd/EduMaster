
import React, { useState } from 'react';
import { CheckSquare, Square, AlertOctagon, ShieldCheck, Smartphone, Database, Server, Rocket } from 'lucide-react';
import { ChecklistItem } from '../types';

const INITIAL_CHECKLIST: ChecklistItem[] = [
    { id: '1', category: 'Security', label: 'Password Hashing (Bcrypt) Verified', status: 'pass', isCritical: true },
    { id: '2', category: 'Security', label: 'Role-Based Access Control Active', status: 'pass', isCritical: true },
    { id: '3', category: 'Security', label: 'API Rate Limiting Enabled', status: 'pass', isCritical: true },
    { id: '4', category: 'Performance', label: 'Database Indexing Optimized', status: 'pass', isCritical: false },
    { id: '5', category: 'Performance', label: 'Response Time < 200ms', status: 'pass', isCritical: true },
    { id: '6', category: 'Reliability', label: 'Error Logging & Alerts Live', status: 'pass', isCritical: true },
    { id: '7', category: 'Reliability', label: 'Daily Backups Scheduled', status: 'pass', isCritical: true },
    { id: '8', category: 'Compliance', label: 'Privacy Policy & Terms Published', status: 'pass', isCritical: true },
    { id: '9', category: 'Mobile', label: 'Push Notifications Verified', status: 'pass', isCritical: false },
    { id: '10', category: 'Mobile', label: 'Offline Sync Tested', status: 'pass', isCritical: false },
    { id: '11', category: 'Release', label: 'Final QA Sign-off', status: 'pass', isCritical: true },
];

export const ProductionChecklist: React.FC = () => {
    const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

    const toggleStatus = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const nextStatus = item.status === 'pass' ? 'fail' : item.status === 'fail' ? 'pending' : 'pass';
            return { ...item, status: nextStatus };
        }));
    };

    const criticalFailures = items.filter(i => i.isCritical && i.status !== 'pass').length;
    const isReady = criticalFailures === 0;

    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-lg ${isReady ? 'bg-green-600 border-green-700 text-white' : 'bg-red-50 border-red-200'}`}>
                <div>
                    <h2 className={`text-2xl font-bold flex items-center gap-2 ${isReady ? 'text-white' : 'text-red-800'}`}>
                        {isReady ? <><Rocket /> v1.0.0 RELEASE READY</> : 'Launch Blocked 🛑'}
                    </h2>
                    <p className={`text-sm mt-1 ${isReady ? 'text-green-100' : 'text-red-600'}`}>
                        {isReady ? 'All systems operational. Ready for App Store submission.' : `${criticalFailures} critical items need attention.`}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-3xl font-bold ${isReady ? 'text-white' : 'text-slate-800'}`}>
                        {Math.round((items.filter(i => i.status === 'pass').length / items.length) * 100)}%
                    </p>
                    <p className={`text-xs uppercase font-bold ${isReady ? 'text-green-200' : 'text-slate-500'}`}>Readiness Score</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    
                    {/* Render Categories */}
                    {['Security', 'Performance', 'Reliability', 'Compliance', 'Mobile', 'Release'].map((cat) => (
                        <div key={cat} className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                {cat === 'Security' && <ShieldCheck size={18} className="text-blue-600"/>}
                                {cat === 'Performance' && <Server size={18} className="text-purple-600"/>}
                                {cat === 'Reliability' && <Database size={18} className="text-orange-600"/>}
                                {cat === 'Mobile' && <Smartphone size={18} className="text-teal-600"/>}
                                {cat === 'Release' && <Rocket size={18} className="text-green-600"/>}
                                {cat} Check
                            </h3>
                            <div className="space-y-3">
                                {items.filter(i => i.category === cat).map(item => (
                                    <div 
                                        key={item.id} 
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => toggleStatus(item.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.status === 'pass' ? <CheckSquare className="text-green-500" size={20} /> : <Square className="text-slate-300" size={20} />}
                                            <div>
                                                <p className={`text-sm font-medium ${item.status === 'pass' ? 'text-slate-700' : 'text-slate-500'}`}>{item.label}</p>
                                                {item.isCritical && <span className="text-[10px] text-red-500 font-bold uppercase">Critical</span>}
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase
                                            ${item.status === 'pass' ? 'bg-green-100 text-green-700' : item.status === 'fail' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                                        `}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
