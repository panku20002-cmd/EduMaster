
import React, { useState } from 'react';
import { 
    Activity, Server, Database, CloudRain, ToggleRight, ToggleLeft, 
    AlertOctagon, CheckCircle, RefreshCw, Zap, ShieldAlert, Cpu, HardDrive 
} from 'lucide-react';
import { SystemHealth, FeatureFlag, BackupRecord } from '../types';

// Mock Data
const MOCK_HEALTH: SystemHealth = {
    status: 'healthy',
    uptime: '99.98%',
    cpuUsage: 45,
    memoryUsage: 62,
    activeUsers: 1452,
    errorRate: 0.05,
    lastBackup: 'Today, 03:00 AM',
    apiVersion: 'v1.2.4 (RC-1)'
};

const MOCK_FLAGS: FeatureFlag[] = [
    { id: '1', key: 'new_ui', label: 'Modern Dashboard UI', isEnabled: true, description: 'Enable the new React 19 interface.' },
    { id: '2', key: 'beta_ai', label: 'AI Tutor Beta', isEnabled: true, description: 'Allow students to access AI Solver.' },
    { id: '3', key: 'maintenance', label: 'Maintenance Mode', isEnabled: false, description: 'Block all user logins.' },
    { id: '4', key: 'auto_backup', label: 'Auto-Backup Hourly', isEnabled: false, description: 'Increase backup frequency.' }
];

const MOCK_BACKUPS: BackupRecord[] = [
    { id: 'b1', timestamp: 'Today, 03:00 AM', size: '2.4 GB', status: 'success', type: 'automated' },
    { id: 'b2', timestamp: 'Yesterday, 03:00 AM', size: '2.3 GB', status: 'success', type: 'automated' },
    { id: 'b3', timestamp: 'Oct 25, 10:00 PM', size: '2.3 GB', status: 'success', type: 'manual' }
];

export const DevOpsPanel: React.FC = () => {
    const [health, setHealth] = useState(MOCK_HEALTH);
    const [flags, setFlags] = useState(MOCK_FLAGS);
    const [backups, setBackups] = useState(MOCK_BACKUPS);
    const [isBackingUp, setIsBackingUp] = useState(false);

    const toggleFlag = (id: string) => {
        setFlags(prev => prev.map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f));
    };

    const triggerBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => {
            const newBackup: BackupRecord = {
                id: `b${Date.now()}`,
                timestamp: 'Just now',
                size: '2.41 GB',
                status: 'success',
                type: 'manual'
            };
            setBackups([newBackup, ...backups]);
            setIsBackingUp(false);
            alert("Backup completed successfully!");
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Server className="text-indigo-600" /> DevOps & Operations Center
                </h2>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-green-600">Systems Operational</span>
                </div>
            </div>

            {/* Live Monitoring Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <HealthCard 
                    label="CPU Usage" 
                    value={`${health.cpuUsage}%`} 
                    icon={<Cpu size={20}/>} 
                    status={health.cpuUsage > 80 ? 'warning' : 'good'} 
                />
                <HealthCard 
                    label="Memory" 
                    value={`${health.memoryUsage}%`} 
                    icon={<HardDrive size={20}/>} 
                    status={health.memoryUsage > 80 ? 'warning' : 'good'} 
                />
                <HealthCard 
                    label="Active Users" 
                    value={health.activeUsers.toLocaleString()} 
                    icon={<Activity size={20}/>} 
                    status="good" 
                />
                <HealthCard 
                    label="Error Rate" 
                    value={`${health.errorRate}%`} 
                    icon={<ShieldAlert size={20}/>} 
                    status={health.errorRate > 1 ? 'critical' : 'good'} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Feature Toggles (Hotfix/Rollout) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-500"/> Feature Flags & Controls
                    </h3>
                    <div className="space-y-4">
                        {flags.map(flag => (
                            <div key={flag.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{flag.label}</p>
                                    <p className="text-xs text-slate-500">{flag.description}</p>
                                </div>
                                <button onClick={() => toggleFlag(flag.id)} className={`transition-colors ${flag.isEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                                    {flag.isEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Backup & Disaster Recovery */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Database size={18} className="text-blue-500"/> Data Backup & Recovery
                        </h3>
                        <button 
                            onClick={triggerBackup}
                            disabled={isBackingUp}
                            className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <CloudRain size={14} /> {isBackingUp ? 'Backing up...' : 'Trigger Backup'}
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {backups.map(backup => (
                            <div key={backup.id} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <div>
                                        <p className="font-medium text-slate-700">{backup.timestamp}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{backup.type} • {backup.size}</p>
                                    </div>
                                </div>
                                <button className="text-xs text-blue-600 font-bold hover:underline">Restore</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Incident Response / Logs */}
            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-sm overflow-hidden font-mono text-xs">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertOctagon size={16} className="text-red-500" /> Live System Logs (Tail)
                </h3>
                <div className="space-y-1 opacity-80">
                    <p><span className="text-blue-400">INFO</span> [10:45:02] API Gateway: Request latency 45ms</p>
                    <p><span className="text-blue-400">INFO</span> [10:45:05] Auth Service: User login success (ID: u882)</p>
                    <p><span className="text-green-400">SUCCESS</span> [10:46:12] Cron: Daily Attendance Check completed</p>
                    <p><span className="text-yellow-400">WARN</span> [10:48:00] DB: High connection pool usage (85%)</p>
                    <p><span className="text-blue-400">INFO</span> [10:49:22] Backup Service: Snapshot created</p>
                </div>
            </div>
        </div>
    );
};

const HealthCard = ({ label, value, icon, status }: any) => {
    const color = status === 'good' ? 'text-green-600 bg-green-50 border-green-200' 
                : status === 'warning' ? 'text-orange-600 bg-orange-50 border-orange-200' 
                : 'text-red-600 bg-red-50 border-red-200';
    
    return (
        <div className={`p-4 rounded-xl border ${color} bg-opacity-30`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase opacity-70">{label}</span>
                {icon}
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};
