
import React, { useState } from 'react';
import { Shield, Smartphone, Monitor, Globe, LogOut, Trash2, AlertTriangle, Download, Clock, MapPin, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';
import { Session, LoginHistoryItem } from '../types';

// Mock Data with Suspicious Flag
const MOCK_SESSIONS: Session[] = [
    { id: 's1', device: 'Chrome on Windows', browser: 'Chrome', ip: '192.168.1.45', lastActive: 'Active Now', isCurrent: true, location: 'Mumbai, India' },
    { id: 's2', device: 'iPhone 13 Pro', browser: 'Safari', ip: '10.0.0.5', lastActive: '2 hours ago', isCurrent: false, location: 'Mumbai, India' },
];

const MOCK_LOGIN_HISTORY: LoginHistoryItem[] = [
    { id: 'l1', timestamp: 'Today, 10:30 AM', device: 'Chrome / Windows', ip: '192.168.1.45', status: 'success', riskLevel: 'low', location: 'Mumbai' },
    { id: 'l2', timestamp: 'Yesterday, 8:15 PM', device: 'iPhone 13', ip: '10.0.0.5', status: 'success', riskLevel: 'low', location: 'Mumbai' },
    { id: 'l3', timestamp: 'Oct 25, 3:00 AM', device: 'Unknown Browser', ip: '45.22.11.9', status: 'suspicious', riskLevel: 'high', riskReason: 'New Location (Russia)', location: 'Moscow, Russia' },
];

export const SecuritySettings: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletionPassword, setDeletionPassword] = useState('');
    const [isDeletionScheduled, setIsDeletionScheduled] = useState(false);

    const handleRevoke = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        // Call API
    };

    const handleDeleteAccount = () => {
        if (!deletionPassword) return alert("Please enter password");
        // API Call here
        alert("Account scheduled for deletion in 30 days. You will be logged out.");
        setIsDeletionScheduled(true);
        setShowDeleteConfirm(false);
    };

    const handleCancelDeletion = () => {
        setIsDeletionScheduled(false);
        alert("Deletion cancelled. Your account is safe.");
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="text-teal-600" /> Security & Privacy
                    </h2>
                    <p className="text-slate-500 text-sm">Manage sessions, monitor risks, and control your data.</p>
                </div>
            </div>

            {/* Login History with Suspicious Detection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} /> Recent Activity Logs
                    </h3>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border">Last 30 Days</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-white border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Device & IP</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_LOGIN_HISTORY.map(item => (
                                <tr key={item.id} className={item.riskLevel === 'high' ? 'bg-red-50/30' : ''}>
                                    <td className="px-6 py-3">
                                        {item.status === 'success' ? (
                                            <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase"><CheckCircle size={14} /> Success</span>
                                        ) : item.status === 'suspicious' ? (
                                            <span className="flex items-center gap-1 text-red-600 font-bold text-xs uppercase"><AlertTriangle size={14} /> Suspicious</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-slate-500 font-bold text-xs uppercase"><XCircle size={14} /> Failed</span>
                                        )}
                                        {item.riskReason && <p className="text-[10px] text-red-600 font-bold mt-1">{item.riskReason}</p>}
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="font-medium text-slate-800">{item.device}</p>
                                        <p className="text-xs text-slate-400">{item.ip}</p>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">{item.location}</td>
                                    <td className="px-6 py-3 text-slate-500">{item.timestamp}</td>
                                    <td className="px-6 py-3 text-right">
                                        {item.riskLevel === 'high' && (
                                            <button className="text-xs text-red-600 font-bold hover:underline">Report</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Smartphone size={18} /> Active Sessions
                    </h3>
                    <button className="text-xs text-red-600 font-bold hover:underline" onClick={() => setSessions(sessions.filter(s => s.isCurrent))}>
                        Revoke All Others
                    </button>
                </div>
                <div className="divide-y divide-slate-100">
                    {sessions.map(session => (
                        <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.isCurrent ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {session.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        {session.device}
                                        {session.isCurrent && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">This Device</span>}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                        <MapPin size={10} /> {session.location} • {session.ip} • <Clock size={10} /> {session.lastActive}
                                    </p>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <button 
                                    onClick={() => handleRevoke(session.id)}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Management & Deletion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Data Export */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Download size={18} /> GDPR Data Export
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                        Download a secure archive of your personal data, including grades, attendance, and logs.
                    </p>
                    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                        <Download size={16} /> Request Archive
                    </button>
                </div>

                {/* Secure Deletion Zone */}
                {isDeletionScheduled ? (
                    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <Clock size={18} /> Deletion Scheduled
                        </h3>
                        <p className="text-xs text-yellow-700 mb-4">
                            Your account is scheduled for permanent deletion in <b>29 days</b>. You can cancel this request anytime before then to restore full access.
                        </p>
                        <button onClick={handleCancelDeletion} className="w-full py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-sm font-bold hover:bg-yellow-100">
                            Cancel Deletion
                        </button>
                    </div>
                ) : (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <Trash2 size={18} /> Delete Account
                        </h3>
                        <p className="text-xs text-red-600 mb-4">
                            Permanently delete your account. This action triggers a 30-day cooling-off period before final data wipe.
                        </p>
                        {showDeleteConfirm ? (
                            <div className="space-y-3 bg-white p-3 rounded-lg border border-red-100">
                                <p className="text-xs font-bold text-red-800">Verify Identity to Proceed</p>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={deletionPassword}
                                    onChange={(e) => setDeletionPassword(e.target.value)}
                                    className="w-full text-sm p-2 border rounded"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700">Confirm Deletion</button>
                                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-100 text-slate-600 text-xs font-bold py-2 rounded hover:bg-gray-200">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center justify-center gap-2">
                                <AlertOctagon size={16} /> Request Account Deletion
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
