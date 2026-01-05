
import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Globe, AlertTriangle, CheckCircle, Wifi, Cpu, Clock } from 'lucide-react';
import { SystemMetric } from '../types';

export const LiveMonitoringPanel: React.FC = () => {
    const [metrics, setMetrics] = useState<SystemMetric[]>([]);
    const [alerts, setAlerts] = useState<string[]>([]);

    // Simulate Live Data Feed
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const newMetric: SystemMetric = {
                timestamp: now.toLocaleTimeString(),
                cpu: Math.floor(Math.random() * 30) + 20, // 20-50% base
                memory: Math.floor(Math.random() * 40) + 40, // 40-80% base
                latency: Math.floor(Math.random() * 100) + 20, // 20-120ms
                activeConnections: Math.floor(Math.random() * 50) + 1200,
                errorRate: Math.random() < 0.1 ? 2.5 : 0.1 // Occasional spike
            };

            setMetrics(prev => [...prev.slice(-19), newMetric]); // Keep last 20

            // Auto Alert Logic
            if (newMetric.errorRate > 2) {
                setAlerts(prev => [`High Error Rate detected (${newMetric.errorRate.toFixed(1)}%) at ${newMetric.timestamp}`, ...prev].slice(0, 5));
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const current = metrics[metrics.length - 1] || { cpu: 0, memory: 0, latency: 0, errorRate: 0, activeConnections: 0 };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-red-600 animate-pulse" /> Live System Monitor
                </h2>
                <span className="text-xs font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                    ● REC {new Date().toLocaleTimeString()}
                </span>
            </div>

            {/* Health Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard 
                    title="API Server" 
                    status={current.errorRate > 5 ? 'critical' : current.latency > 200 ? 'degraded' : 'healthy'}
                    metric={`${current.latency}ms`}
                    subtext="Response Time"
                    icon={<Globe size={18}/>}
                />
                <StatusCard 
                    title="Database" 
                    status="healthy" 
                    metric={`${current.activeConnections}`}
                    subtext="Active Connections"
                    icon={<Database size={18}/>}
                />
                <StatusCard 
                    title="Background Jobs" 
                    status="healthy" 
                    metric="Processing"
                    subtext="Cron / Queue"
                    icon={<Clock size={18}/>}
                />
            </div>

            {/* Live Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* CPU & Memory Trend */}
                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                        <Cpu size={14}/> Resource Usage (Live)
                    </h3>
                    <div className="h-48 flex items-end gap-1">
                        {metrics.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group relative">
                                {/* Memory Bar (Purple) */}
                                <div 
                                    className="bg-purple-600/50 w-full rounded-sm transition-all duration-300"
                                    style={{ height: `${m.memory}%` }}
                                ></div>
                                {/* CPU Bar (Blue) - Overlay */}
                                <div 
                                    className="bg-blue-500 w-full rounded-sm transition-all duration-300 absolute bottom-0"
                                    style={{ height: `${m.cpu}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                        <span>-40s</span>
                        <span>Now</span>
                    </div>
                    <div className="flex gap-4 mt-4 text-xs font-bold">
                        <span className="text-blue-400">● CPU: {current.cpu}%</span>
                        <span className="text-purple-400">● MEM: {current.memory}%</span>
                    </div>
                </div>

                {/* Alerts & Incidents */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-orange-500"/> Recent Alerts
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {alerts.length === 0 ? (
                            <div className="text-slate-400 text-sm text-center py-8">System is stable. No alerts.</div>
                        ) : (
                            alerts.map((alert, i) => (
                                <div key={i} className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-start gap-2 animate-in slide-in-from-right">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0"/>
                                    {alert}
                                </div>
                            ))
                        )}
                    </div>
                    <button className="mt-4 w-full py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-50">
                        View Historical Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, status, metric, subtext, icon }: any) => {
    const color = status === 'healthy' ? 'bg-green-500' : status === 'degraded' ? 'bg-orange-500' : 'bg-red-500';
    const bg = status === 'healthy' ? 'bg-green-50 border-green-200' : status === 'degraded' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';
    const text = status === 'healthy' ? 'text-green-800' : status === 'degraded' ? 'text-orange-800' : 'text-red-800';

    return (
        <div className={`p-4 rounded-xl border ${bg}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                    {icon} {title}
                </div>
                <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            </div>
            <p className={`text-2xl font-bold ${text}`}>{metric}</p>
            <p className="text-xs text-slate-500 opacity-80">{subtext}</p>
        </div>
    );
};
