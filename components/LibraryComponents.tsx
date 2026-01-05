
import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, Book, Download, Eye, Plus, Edit, Trash2, 
    MoreVertical, FileText, CheckCircle, XCircle, Wifi, Shield,
    BarChart, Sparkles, Lock, RefreshCw
} from 'lucide-react';
import { LibraryBook, UserRole } from '../types';
import { MOCK_LIBRARY_BOOKS } from '../constants';
import { LibraryAnalytics } from './LibraryAnalytics';
import { AdminLibraryAI } from './AdminLibraryAI';

// --- TYPES & HELPERS ---

interface LibraryProps {
    isAdmin?: boolean;
    userRole?: UserRole; // To drive recommendations
    userId?: string;
}

// Mock Analytics Data (Ideally fetched from API)
const MOCK_ANALYTICS_DATA = {
    totalBooks: 450,
    totalDownloads: 1250,
    activeReaders: 320,
    mostReadBooks: [
        { id: 'b1', title: 'Concepts of Physics', count: 450 },
        { id: 'b3', title: 'Calculus Made Easy', count: 380 },
        { id: 'b7', title: 'Class 10 Past Papers', count: 310 },
        { id: 'b5', title: 'Physics Lab Manual', count: 290 }
    ],
    subjectUsage: [
        { subject: 'Physics', count: 35 },
        { subject: 'Math', count: 30 },
        { subject: 'Chemistry', count: 20 },
        { subject: 'History', count: 15 }
    ],
    dailyActivity: [120, 145, 132, 160, 110, 180, 195]
};

// --- BOOK CARD COMPONENT ---

const BookCard: React.FC<{ book: LibraryBook; isAdmin?: boolean; recommendationReason?: string }> = ({ book, isAdmin, recommendationReason }) => {
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'downloaded'>('idle');

    const handleDownload = () => {
        if (!book.isDownloadable && !isAdmin) {
            alert("This book is read-only and cannot be downloaded.");
            return;
        }
        
        setDownloadStatus('downloading');
        // Simulate Secure Download Process
        setTimeout(() => {
            setDownloadStatus('downloaded');
            // In a real app, this would verify keys and store encrypted blob in IndexedDB
        }, 1500);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group relative">
            
            {/* Status Badges */}
            <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                {isAdmin && (
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm
                        ${book.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}
                    `}>
                        {book.status}
                    </span>
                )}
                {book.isDownloadable && (
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Wifi size={10} /> Offline Ready
                    </span>
                )}
            </div>

            {/* Recommendation Badge */}
            {recommendationReason && (
                <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 shadow-sm flex items-center gap-1 border border-amber-200">
                        <Sparkles size={10} /> Recommended
                    </span>
                </div>
            )}

            <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <Book size={48} className="text-slate-300" />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-lg" title="Read Online">
                        <Eye size={20} />
                    </button>
                    {book.isDownloadable && (
                        <button 
                            onClick={handleDownload}
                            disabled={downloadStatus !== 'idle'}
                            className="p-2 bg-white rounded-full text-slate-800 hover:bg-green-50 hover:text-green-600 transition-colors shadow-lg disabled:opacity-50" 
                            title="Secure Download"
                        >
                            {downloadStatus === 'downloaded' ? <CheckCircle size={20} className="text-green-600" /> : <Download size={20} />}
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {book.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded">
                        {book.classLevel}
                    </span>
                </div>
                
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{book.author}</p>
                
                {/* Recommendation Reason Text */}
                {recommendationReason && (
                    <p className="text-[10px] text-amber-600 mb-3 italic leading-tight">
                        "{recommendationReason}"
                    </p>
                )}

                <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <Download size={12} /> {book.downloads}
                    </span>
                    {downloadStatus === 'downloaded' ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                            <Lock size={10} /> Saved Securely
                        </span>
                    ) : (
                        <span className="uppercase font-semibold text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-500">
                            {book.type}
                        </span>
                    )}
                </div>

                {isAdmin && (
                    <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">Edit</button>
                        <button className="flex-1 py-1.5 border border-red-100 bg-red-50 rounded text-xs font-bold text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN LIBRARY COMPONENT ---

export const DigitalLibrary: React.FC<LibraryProps> = ({ isAdmin = false, userRole = 'student' }) => {
    const [viewMode, setViewMode] = useState<'library' | 'analytics' | 'ai-discovery'>('library');
    const [books, setBooks] = useState<LibraryBook[]>(MOCK_LIBRARY_BOOKS.map(b => ({...b, isDownloadable: true, offlineEncrypted: true})));
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterType, setFilterType] = useState('All');
    
    // Admin Modal State
    const [showAddModal, setShowAddModal] = useState(false);

    // Derived Data
    const subjects = ['All', ...Array.from(new Set(MOCK_LIBRARY_BOOKS.map(b => b.subject)))];
    const classes = ['All', ...Array.from(new Set(MOCK_LIBRARY_BOOKS.map(b => b.classLevel)))];
    const types = ['All', 'Textbook', 'Reference', 'Notes', 'Paper'];

    // Filter Logic
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || book.classLevel === filterClass;
        const matchesSubject = filterSubject === 'All' || book.subject === filterSubject;
        const matchesType = filterType === 'All' || book.type === filterType;
        const matchesVisibility = isAdmin ? true : book.status === 'active';

        return matchesSearch && matchesClass && matchesSubject && matchesType && matchesVisibility;
    });

    // AI Recommendation Logic (Mock)
    const getRecommendations = () => {
        if (isAdmin) return [];
        // Simple logic: If student, recommend 'Class 12' or 'Physics'. If teacher, recommend 'Reference'
        return books.filter(b => {
            if (userRole === 'student') return b.subject === 'Physics' || b.classLevel === 'Class 12';
            if (userRole === 'teacher') return b.type === 'Reference';
            return false;
        }).slice(0, 3); // Top 3
    };

    const recommendedBooks = getRecommendations();

    return (
        <div className="space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Book className="text-blue-600" /> Digital Library
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {isAdmin ? 'Manage library resources and books.' : 'Access free learning materials and textbooks.'}
                    </p>
                </div>
                
                <div className="flex gap-2">
                    {isAdmin && (
                        <>
                            <button 
                                onClick={() => setViewMode('ai-discovery')}
                                className={`px-4 py-2 font-bold text-sm rounded-xl flex items-center gap-2 border transition-colors
                                    ${viewMode === 'ai-discovery' ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                `}
                            >
                                <Sparkles size={18} className={viewMode === 'ai-discovery' ? 'text-purple-600' : 'text-slate-400'} /> 
                                AI Auto-Discovery
                            </button>
                            <button 
                                onClick={() => setViewMode(viewMode === 'library' ? 'analytics' : 'library')}
                                className={`px-4 py-2 font-bold text-sm rounded-xl flex items-center gap-2 border transition-colors
                                    ${viewMode === 'analytics' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                `}
                            >
                                <BarChart size={18} /> {viewMode === 'analytics' ? 'View Books' : 'Analytics'}
                            </button>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200"
                            >
                                <Plus size={18} /> Add Book
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* CONDITIONAL VIEWS */}
            
            {isAdmin && viewMode === 'analytics' && <LibraryAnalytics data={MOCK_ANALYTICS_DATA} />}
            
            {isAdmin && viewMode === 'ai-discovery' && <AdminLibraryAI />}

            {/* DEFAULT LIBRARY LIST VIEW */}
            {(!isAdmin || viewMode === 'library') && (
                <>
                    {/* RECOMMENDATION SECTION (STUDENT/TEACHER ONLY) */}
                    {!isAdmin && recommendedBooks.length > 0 && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                            <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-500" /> Recommended For You
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendedBooks.map(book => (
                                    <BookCard 
                                        key={book.id} 
                                        book={book} 
                                        recommendationReason={userRole === 'student' ? `Matches your ${book.subject} course` : "Popular Reference Material"} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by title or author..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select 
                                value={filterClass} 
                                onChange={(e) => setFilterClass(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100"
                            >
                                <option value="All">All Classes</option>
                                {classes.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select 
                                value={filterSubject} 
                                onChange={(e) => setFilterSubject(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100"
                            >
                                <option value="All">All Subjects</option>
                                {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100"
                            >
                                <option value="All">All Types</option>
                                {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredBooks.map(book => (
                                <BookCard key={book.id} book={book} isAdmin={isAdmin} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Book size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-500">No books found</h3>
                            <p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </>
            )}

            {/* Admin Add Modal (Mock) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><XCircle /></button>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Upload New Book</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Book Title</label>
                                <input type="text" className="w-full border rounded p-2 text-sm mt-1" placeholder="e.g. Advanced Physics" />
                            </div>
                            {/* ... Form fields ... */}
                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-2 hover:bg-slate-800">
                                Upload to Library
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
