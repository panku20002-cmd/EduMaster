
import React, { useState } from 'react';
import { MessageSquare, Bug, Lightbulb, CheckCircle, XCircle, Filter, Search, Smartphone, User } from 'lucide-react';
import { FeedbackTicket } from '../types';

const MOCK_TICKETS: FeedbackTicket[] = [
    { id: 't1', userId: 'u1', userName: 'Alex Sharma', userRole: 'student', type: 'bug', priority: 'high', status: 'open', message: 'Quiz timer freezes on mobile when rotating screen.', deviceInfo: 'iPhone 13, iOS 16.4', timestamp: '10 mins ago' },
    { id: 't2', userId: 'u2', userName: 'Prof. Gupta', userRole: 'teacher', type: 'feature', priority: 'medium', status: 'in_progress', message: 'Can we have bulk upload for grades?', deviceInfo: 'Chrome 114, Windows 11', timestamp: '2 hours ago' },
    { id: 't3', userId: 'u3', userName: 'Mrs. Verma', userRole: 'parent', type: 'general', priority: 'low', status: 'resolved', message: 'The new design looks great!', deviceInfo: 'Android 13, Pixel 6', timestamp: '1 day ago' },
];

export const AdminFeedbackManager: React.FC = () => {
    const [tickets, setTickets] = useState<FeedbackTicket[]>(MOCK_TICKETS);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

    const handleStatusChange = (id: string, newStatus: FeedbackTicket['status']) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const filteredTickets = tickets.filter(t => filter === 'all' || (filter === 'open' ? t.status !== 'resolved' : t.status === 'resolved'));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="text-blue-600" /> User Feedback & Issues
                    </h2>
                    <p className="text-slate-500 text-sm">Manage bug reports and feature requests from users.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-600'}`}>All</button>
                    <button onClick={() => setFilter('open')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === 'open' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-600'}`}>Open</button>
                    <button onClick={() => setFilter('resolved')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === 'resolved' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-600'}`}>Resolved</button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
                        {/* Icon Side */}
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${ticket.type === 'bug' ? 'bg-red-100 text-red-600' : ticket.type === 'feature' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
                            `}>
                                {ticket.type === 'bug' ? <Bug size={20}/> : ticket.type === 'feature' ? <Lightbulb size={20}/> : <MessageSquare size={20}/>}
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border
                                ${ticket.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'}
                            `}>
                                {ticket.priority}
                            </span>
                        </div>

                        {/* Content Side */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        {ticket.userName} 
                                        <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 rounded">{ticket.userRole}</span>
                                    </h4>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                        <Smartphone size={10} /> {ticket.deviceInfo} • {ticket.timestamp}
                                    </p>
                                </div>
                                <div className={`text-xs font-bold uppercase px-2 py-1 rounded
                                    ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : ticket.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}
                                `}>
                                    {ticket.status.replace('_', ' ')}
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                                {ticket.message}
                            </p>

                            <div className="flex gap-2 justify-end">
                                {ticket.status !== 'resolved' && (
                                    <>
                                        <button 
                                            onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                                            className="px-3 py-1.5 text-xs font-bold border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50"
                                        >
                                            Mark In Progress
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(ticket.id, 'resolved')}
                                            className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-700 flex items-center gap-1"
                                        >
                                            <CheckCircle size={12} /> Resolve
                                        </button>
                                    </>
                                )}
                                {ticket.status === 'resolved' && (
                                    <button 
                                        onClick={() => handleStatusChange(ticket.id, 'open')}
                                        className="px-3 py-1.5 text-xs font-bold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
                                    >
                                        Re-open
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
