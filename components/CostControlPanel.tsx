
import React from 'react';
import { DollarSign, Database, Server, Cpu, HardDrive, AlertTriangle, ZapOff, TrendingUp } from 'lucide-react';
import { CostMetric } from '../types';

const MOCK_COSTS: CostMetric[] = [
    { category: 'compute', cost: 450, usageUnit: 'Hours', usageValue: 744, trend: 'stable', limit: 500 },
    { category: 'database', cost: 280, usageUnit: 'GB-Mo', usageValue: 120, trend: 'up', limit: 300 },
    { category: 'ai_services', cost: 120, usageUnit: 'Tokens', usageValue: 5000000, trend: 'up', limit: 150 },
    { category: 'storage', cost: 80, usageUnit: 'GB', usageValue: 450, trend: 'stable', limit: 100 },
];

export const CostControlPanel: React.FC = () => {
    
    const totalCost = MOCK_COSTS.reduce((acc, curr) => acc + curr.cost, 0);
    const budget = 1200;
    const burnRate = (totalCost / budget) * 100;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="text-green-600" /> Cost & Resource Optimization
                </h2>
                <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase">Current Bill</p>
                    <p className="text-2xl font-bold text-slate-800">${totalCost.toFixed(2)}</p>
                </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="font-bold text-slate-800 text-sm">Monthly Budget Utilization</h3>
                    <span className={`text-xs font-bold ${burnRate > 80 ? 'text-red-600' : 'text-green-600'}`}>
                        {burnRate.toFixed(1)}% Used
                    </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${burnRate > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${burnRate}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Budget Limit: ${budget}. Resets in 12 days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Breakdown */}
                <div className="space-y-4">
                    {MOCK_COSTS.map((metric) => (
                        <div key={metric.category} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                                    {metric.category === 'compute' ? <Server size={20}/> : 
                                     metric.category === 'database' ? <Database size={20}/> : 
                                     metric.category === 'ai_services' ? <Cpu size={20}/> : <HardDrive size={20}/>}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm capitalize">{metric.category.replace('_', ' ')}</p>
                                    <p className="text-xs text-slate-500">{metric.usageValue} {metric.usageUnit}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">${metric.cost}</p>
                                {metric.cost > metric.limit * 0.9 && (
                                    <span className="text-[10px] text-red-600 font-bold flex items-center justify-end gap-1">
                                        <AlertTriangle size={10}/> Near Limit
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ZapOff size={18} className="text-orange-500"/> Optimization Actions
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Limit AI Tutor Queries</p>
                                <p className="text-xs text-slate-500">Restrict free users to 10 queries/day</p>
                            </div>
                            <button className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-700">Apply</button>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Clear Temp Storage</p>
                                <p className="text-xs text-slate-500">Remove cached video files older than 30 days</p>
                            </div>
                            <button className="text-xs font-bold bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50">Purge</button>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Database Compaction</p>
                                <p className="text-xs text-slate-500">Optimize tables to reclaim space</p>
                            </div>
                            <button className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100">Run</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
