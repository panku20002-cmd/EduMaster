
import React, { useState } from 'react';
import { 
    Calendar, CheckCircle, Clock, Target, TrendingUp, AlertTriangle, 
    Shield, Flag, Award, Zap, ChevronRight, BarChart2 
} from 'lucide-react';

type Phase = 'stabilize' | 'improve' | 'scale' | 'monetize';

export const ProductRoadmap: React.FC = () => {
    const [activePhase, setActivePhase] = useState<Phase>('stabilize');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Flag className="text-indigo-600" /> Post-Launch Strategy Map
                    </h2>
                    <p className="text-slate-500 text-sm">30-60-90 Day Execution Plan & Governance</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                        <Target size={12}/> Phase 1 Active
                    </span>
                </div>
            </div>

            {/* Phase Timeline Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-1 overflow-x-auto">
                <TabButton 
                    phase="stabilize" 
                    label="Phase 1: Stabilize" 
                    sub="Days 1-30" 
                    isActive={activePhase === 'stabilize'} 
                    onClick={() => setActivePhase('stabilize')} 
                    color="blue"
                />
                <TabButton 
                    phase="improve" 
                    label="Phase 2: Improve" 
                    sub="Days 31-90" 
                    isActive={activePhase === 'improve'} 
                    onClick={() => setActivePhase('improve')} 
                    color="purple"
                />
                <TabButton 
                    phase="scale" 
                    label="Phase 3: Scale" 
                    sub="Days 91-180" 
                    isActive={activePhase === 'scale'} 
                    onClick={() => setActivePhase('scale')} 
                    color="orange"
                />
                <TabButton 
                    phase="monetize" 
                    label="Phase 4: Monetize" 
                    sub="Future" 
                    isActive={activePhase === 'monetize'} 
                    onClick={() => setActivePhase('monetize')} 
                    color="green"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Objectives & Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                            {activePhase === 'stabilize' && <Shield className="text-blue-500"/>}
                            {activePhase === 'improve' && <Zap className="text-purple-500"/>}
                            {activePhase === 'scale' && <TrendingUp className="text-orange-500"/>}
                            {activePhase === 'monetize' && <Award className="text-green-500"/>}
                            Strategic Objectives
                        </h3>
                        
                        <div className="space-y-4">
                            {getObjectives(activePhase).map((obj, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white
                                        ${obj.status === 'done' ? 'bg-green-500' : obj.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'}
                                    `}>
                                        {obj.status === 'done' ? <CheckCircle size={12}/> : i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{obj.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{obj.desc}</p>
                                    </div>
                                    <span className={`ml-auto text-[10px] px-2 py-1 rounded font-bold uppercase
                                        ${obj.status === 'done' ? 'bg-green-100 text-green-700' : obj.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}
                                    `}>
                                        {obj.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Register (Contextual) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={18}/> Phase Risks & Mitigation
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2">Risk</th>
                                        <th className="px-4 py-2">Probability</th>
                                        <th className="px-4 py-2">Mitigation Plan</th>
                                        <th className="px-4 py-2">Owner</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {getRisks(activePhase).map((risk, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3 font-medium text-slate-800">{risk.title}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                                    ${risk.prob === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                                                `}>{risk.prob}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs">{risk.plan}</td>
                                            <td className="px-4 py-3 text-xs">{risk.owner}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: KPIs & Targets */}
                <div className="space-y-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Target size={100} />
                        </div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <BarChart2 size={20}/> Success Metrics
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {getKPIs(activePhase).map((kpi, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1 opacity-90">
                                        <span>{kpi.label}</span>
                                        <span className="font-bold">{kpi.current} / {kpi.target}</span>
                                    </div>
                                    <div className="w-full bg-indigo-800 rounded-full h-2">
                                        <div 
                                            className={`h-full rounded-full ${kpi.status === 'good' ? 'bg-green-400' : kpi.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                            style={{ width: `${kpi.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Growth Recommendation */}
                    <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <Zap size={18} className="text-indigo-600"/> PM Recommendation
                        </h3>
                        <p className="text-sm text-slate-600 italic">
                            "{getRecommendation(activePhase)}"
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-bold">
                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">PL</div>
                            Senior Product Lead
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DATA HELPERS ---

const TabButton = ({ phase, label, sub, isActive, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 min-w-[140px] p-4 text-left border-b-4 transition-all duration-300
            ${isActive 
                ? `border-${color}-500 bg-${color}-50/50` 
                : 'border-transparent hover:bg-slate-50 opacity-60 hover:opacity-100'}
        `}
    >
        <p className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{label}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{sub}</p>
    </button>
);

function getObjectives(phase: Phase) {
    switch(phase) {
        case 'stabilize': return [
            { title: 'Monitor Live Metrics', desc: 'Ensure 99.9% uptime and <200ms latency on core APIs.', status: 'in_progress' },
            { title: 'Triage Critical Bugs', desc: 'Resolve all P0/P1 issues reported within 24 hours.', status: 'in_progress' },
            { title: 'Backup Verification', desc: 'Run disaster recovery drills and verify data integrity.', status: 'todo' },
            { title: 'Payment Reconciliation', desc: 'Audit first batch of transactions for accuracy.', status: 'done' }
        ];
        case 'improve': return [
            { title: 'Analyze User Feedback', desc: 'Categorize NPS feedback and identify top friction points.', status: 'todo' },
            { title: 'Optimize Onboarding', desc: 'Reduce drop-off rate during student signup by 15%.', status: 'todo' },
            { title: 'Refine AI Quizzes', desc: 'Improve question relevance based on initial usage data.', status: 'todo' },
            { title: 'Enhance Library', desc: 'Partner with 2 publishers for premium content.', status: 'todo' }
        ];
        case 'scale': return [
            { title: 'Multi-School Onboarding', desc: 'Launch automated onboarding portal for institutes.', status: 'todo' },
            { title: 'Security Hardening', desc: 'Complete third-party penetration testing.', status: 'todo' },
            { title: 'Horizontal Scaling', desc: 'Implement auto-scaling groups for API servers.', status: 'todo' },
            { title: 'Feature Flags', desc: 'Roll out A/B testing framework for new features.', status: 'todo' }
        ];
        default: return [
            { title: 'Define Pricing Tiers', desc: 'Finalize Basic, Pro, and Enterprise school plans.', status: 'todo' },
            { title: 'Invoice Automation', desc: 'Automate monthly billing and dunning emails.', status: 'todo' },
            { title: 'Premium Add-ons', desc: 'Launch paid AI tutor limits and advanced analytics.', status: 'todo' }
        ];
    }
}

function getRisks(phase: Phase) {
    switch(phase) {
        case 'stabilize': return [
            { title: 'Unexpected Load Spike', prob: 'Medium', plan: 'Over-provision capacity by 50% for first week.', owner: 'DevOps' },
            { title: 'Critical Bug Leak', prob: 'Low', plan: 'Hotfix pipeline ready for <1h deployment.', owner: 'QA Lead' }
        ];
        case 'improve': return [
            { title: 'Low Retention', prob: 'Medium', plan: 'Launch in-app guided tours and email tips.', owner: 'Product' },
            { title: 'AI Hallucinations', prob: 'High', plan: 'Add disclaimer and feedback loop for bad answers.', owner: 'AI Eng' }
        ];
        case 'scale': return [
            { title: 'DB Performance Botleneck', prob: 'High', plan: 'Implement read-replicas and caching layer.', owner: 'Backend Lead' },
            { title: 'Compliance Violation', prob: 'Low', plan: 'Conduct GDPR/DPDP audit before scaling.', owner: 'Legal' }
        ];
        default: return [
            { title: 'High Churn', prob: 'Medium', plan: 'Offer annual discounts and lock-in features.', owner: 'Sales' }
        ];
    }
}

function getKPIs(phase: Phase) {
    switch(phase) {
        case 'stabilize': return [
            { label: 'Uptime', current: '99.8%', target: '99.9%', progress: 98, status: 'good' },
            { label: 'Bug Fix Time', current: '4h', target: '24h', progress: 100, status: 'good' },
            { label: 'Support Tickets', current: '15/day', target: '<10', progress: 60, status: 'warning' }
        ];
        case 'improve': return [
            { label: 'Retention (W1)', current: '65%', target: '80%', progress: 81, status: 'good' },
            { label: 'NPS Score', current: '42', target: '50+', progress: 84, status: 'warning' },
            { label: 'Daily Active Users', current: '1.2k', target: '2k', progress: 60, status: 'warning' }
        ];
        case 'scale': return [
            { label: 'New Schools', current: '2', target: '10', progress: 20, status: 'red' },
            { label: 'API Latency (p95)', current: '180ms', target: '<150ms', progress: 80, status: 'good' }
        ];
        default: return [
            { label: 'MRR', current: '$1.2k', target: '$10k', progress: 12, status: 'red' }
        ];
    }
}

function getRecommendation(phase: Phase) {
    switch(phase) {
        case 'stabilize': return "Focus purely on stability. Do not ship new features. Prioritize bug fixes and performance tuning to build trust with early adopters.";
        case 'improve': return "Listen to the 'silent majority' via analytics, not just vocal users. Simplify the onboarding process before spending marketing budget.";
        case 'scale': return "Technical debt must be paid now. Refactor the authentication service and database queries before onboarding 10+ schools.";
        case 'monetize': return "Start with a simple flat fee per student for schools. Avoid complex tiered pricing until we have usage data to support it.";
    }
}
