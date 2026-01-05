
import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Bug, Lightbulb, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Auto-detected info
    const deviceInfo = navigator.userAgent; 
    const pageUrl = window.location.href;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        
        console.log("Submitting Ticket:", {
            type,
            message,
            deviceInfo,
            pageUrl,
            timestamp: new Date().toISOString()
        });

        // Mock API call
        setTimeout(() => {
            setSubmitted(false);
            setIsOpen(false);
            setMessage('');
            setType('general');
        }, 2000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden"
                    >
                        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-sm">Send Feedback</h3>
                            <button onClick={() => setIsOpen(false)}><X size={16}/></button>
                        </div>
                        
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                    <button 
                                        type="button" 
                                        onClick={() => setType('bug')}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 ${type === 'bug' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}
                                    >
                                        <Bug size={12}/> Bug
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setType('feature')}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 ${type === 'feature' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                                    >
                                        <Lightbulb size={12}/> Idea
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setType('general')}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 ${type === 'general' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}
                                    >
                                        <Smile size={12}/> Other
                                    </button>
                                </div>

                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 min-h-[100px] resize-none"
                                    required
                                />

                                <div className="text-[10px] text-slate-400 px-1">
                                    <p>Auto-included: Device & Page info for debugging.</p>
                                </div>

                                <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                                    <Send size={14} /> Submit Feedback
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Send size={24} />
                                </div>
                                <p className="font-bold text-slate-800">Thank You!</p>
                                <p className="text-xs text-slate-500 mt-1">Your feedback helps us improve.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            >
                {isOpen ? <X size={24} /> : <MessageSquarePlus size={24} />}
            </button>
        </div>
    );
};
