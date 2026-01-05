
import React from 'react';
import { BarChart2, BookOpen, Download, Users, TrendingUp, PieChart } from 'lucide-react';
import { LibraryAnalyticsData } from '../types';

interface LibraryAnalyticsProps {
    data: LibraryAnalyticsData;
}

export const LibraryAnalytics: React.FC<LibraryAnalyticsProps> = ({ data }) => {
    
    // Calculate max for bar chart scaling
    const maxDownloads = Math.max(...data.mostReadBooks.map(b => b.count));
    const maxDaily = Math.max(...data.dailyActivity);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Books" 
                    value={data.totalBooks} 
                    icon={<BookOpen className="text-blue-500" />} 
                    bg="bg-blue-50" 
                />
                <StatCard 
                    label="Total Downloads" 
                    value={data.totalDownloads} 
                    icon={<Download className="text-green-500" />} 
                    bg="bg-green-50" 
                />
                <StatCard 
                    label="Active Readers" 
                    value={data.activeReaders} 
                    icon={<Users className="text-purple-500" />} 
                    bg="bg-purple-50" 
                />
                <StatCard 
                    label="Engagement Score" 
                    value="High" 
                    icon={<TrendingUp className="text-orange-500" />} 
                    bg="bg-orange-50" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Most Read Books Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart2 size={20} className="text-slate-500" /> Most Popular Books
                    </h3>
                    <div className="space-y-4">
                        {data.mostReadBooks.map((book, i) => (
                            <div key={book.id} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-600">
                                    <span>{i + 1}. {book.title}</span>
                                    <span>{book.count} reads</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(book.count / maxDownloads) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subject Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-slate-500" /> Subject Distribution
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {data.subjectUsage.map((subj, i) => (
                            <div key={i} className="flex-1 min-w-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                <p className="text-2xl font-bold text-slate-800">{subj.count}%</p>
                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">{subj.subject}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Weekly Activity Trend</h4>
                        <div className="flex items-end justify-between h-24 gap-2">
                            {data.dailyActivity.map((val, i) => (
                                <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm relative group">
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-600"
                                        style={{ height: `${(val / maxDaily) * 100}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, bg }: any) => (
    <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between h-32 ${bg} border-opacity-50 border-slate-200 bg-opacity-30`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        </div>
    </div>
);
