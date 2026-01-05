
import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, DollarSign, ShieldAlert, BookOpen } from 'lucide-react';
import { Notification, NotificationType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', userId: 'u1', title: 'Low Attendance Alert', message: 'Your attendance in Physics has dropped below 75%.', type: 'attendance', isRead: false, timestamp: '10 mins ago', priority: 'high' },
    { id: '2', userId: 'u1', title: 'Fee Payment Due', message: 'Invoice #INV-2023-002 is due tomorrow.', type: 'finance', isRead: false, timestamp: '2 hours ago', priority: 'normal' },
    { id: '3', userId: 'u1', title: 'New Assignment', message: 'Math Problem Set 3 has been uploaded.', type: 'academic', isRead: true, timestamp: '1 day ago', priority: 'normal' }
];

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'attendance': return <AlertCircle size={16} className="text-red-500" />;
            case 'finance': return <DollarSign size={16} className="text-orange-500" />;
            case 'security': return <ShieldAlert size={16} className="text-red-600" />;
            case 'academic': return <BookOpen size={16} className="text-blue-500" />;
            default: return <Info size={16} className="text-slate-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-4 w-96 z-50">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-slate-700" />
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {notifications.filter(n => !n.isRead).length}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 hover:underline">Mark all read</button>
                        <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${n.isRead ? 'opacity-70' : 'bg-blue-50/30'}`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    {!n.isRead && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>}
                                    <div className="flex gap-3">
                                        <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${n.priority === 'high' ? 'bg-red-100' : 'bg-slate-100'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div>
                                            <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
