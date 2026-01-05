
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, Book, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { LibraryBook } from '../types';

// Mock AI Suggestions
const MOCK_SUGGESTIONS: LibraryBook[] = [
    {
        id: 's1',
        title: 'Introduction to Quantum Mechanics',
        author: 'David Griffiths',
        subject: 'Physics',
        classLevel: 'Degree',
        type: 'Textbook',
        fileUrl: '#',
        coverUrl: '',
        status: 'pending_approval',
        addedBy: 'AI Auto-Bot',
        uploadDate: '2023-10-27',
        downloads: 0,
        isDownloadable: false,
        offlineEncrypted: false,
        aiConfidence: 98,
        sourceUrl: 'https://openstax.org/books/quantum',
        licenseType: 'Creative Commons BY-NC-SA'
    },
    {
        id: 's2',
        title: 'Advanced Calculus Notes',
        author: 'MIT OpenCourseWare',
        subject: 'Math',
        classLevel: 'Class 12',
        type: 'Notes',
        fileUrl: '#',
        coverUrl: '',
        status: 'pending_approval',
        addedBy: 'AI Auto-Bot',
        uploadDate: '2023-10-27',
        downloads: 0,
        isDownloadable: true,
        offlineEncrypted: false,
        aiConfidence: 85,
        sourceUrl: 'https://ocw.mit.edu',
        licenseType: 'Public Domain'
    },
    {
        id: 's3',
        title: 'History of Ancient India',
        author: 'Unknown Source',
        subject: 'History',
        classLevel: 'Class 10',
        type: 'Reference',
        fileUrl: '#',
        coverUrl: '',
        status: 'pending_approval',
        addedBy: 'AI Auto-Bot',
        uploadDate: '2023-10-27',
        downloads: 0,
        isDownloadable: false,
        offlineEncrypted: false,
        aiConfidence: 45, // Low confidence
        sourceUrl: 'https://archive.org/details/ancient-india',
        licenseType: 'Unknown'
    }
];

export const AdminLibraryAI: React.FC = () => {
    const [suggestions, setSuggestions] = useState<LibraryBook[]>(MOCK_SUGGESTIONS);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        // Mock API Scan
        setTimeout(() => {
            setIsScanning(false);
            alert("Scan Complete! Found 3 new educational resources.");
        }, 3000);
    };

    const handleApprove = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
        // Call API to move to active library
    };

    const handleReject = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
        // Call API to delete
    };

    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-purple-400" /> AI Auto-Librarian
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Automatically discovers Open Access books from verified educational repositories.
                    </p>
                </div>
                <button 
                    onClick={handleScan}
                    disabled={isScanning}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all
                        ${isScanning ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                    `}
                >
                    <RefreshCw size={20} className={isScanning ? 'animate-spin' : ''} />
                    {isScanning ? 'Scanning Repositories...' : 'Start Auto-Discovery'}
                </button>
            </div>

            {/* Suggestions Queue */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                    <h3 className="font-bold text-purple-900 flex items-center gap-2">
                        <Book size={18} /> Pending Approval Queue
                    </h3>
                    <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                        {suggestions.length} Items
                    </span>
                </div>

                {suggestions.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
                        <p>All clear! No pending suggestions.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {suggestions.map(book => (
                            <div key={book.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Book Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-bold text-lg text-slate-800">{book.title}</h4>
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border
                                                    ${(book.aiConfidence || 0) > 80 ? 'bg-green-50 text-green-700 border-green-200' : 
                                                      (book.aiConfidence || 0) > 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}
                                                `}>
                                                    AI Confidence: {book.aiConfidence}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-slate-600 mb-2">by <span className="font-semibold">{book.author}</span></p>
                                        
                                        <div className="flex flex-wrap gap-2 text-xs mb-4">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Subject: {book.subject}</span>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Class: {book.classLevel}</span>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Type: {book.type}</span>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <ExternalLink size={12} /> Source: 
                                                <a href={book.sourceUrl} target="_blank" className="text-blue-600 hover:underline truncate max-w-[200px]">{book.sourceUrl}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <ShieldCheck size={12} /> License: 
                                                <span className="font-mono bg-slate-200 px-1 rounded">{book.licenseType}</span>
                                            </div>
                                            {(book.aiConfidence || 0) < 60 && (
                                                <div className="flex items-center gap-2 text-red-600 font-bold mt-2">
                                                    <AlertTriangle size={12} /> Low confidence. Please verify content manually.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                        <button 
                                            onClick={() => handleApprove(book.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                                        >
                                            <Check size={18} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReject(book.id)}
                                            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                        <button className="flex-1 text-xs text-blue-600 hover:underline font-medium text-center mt-1">
                                            Preview Content
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for check circle if needed
const CheckCircle = ({size, className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
