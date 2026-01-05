import React from 'react';
import { BarChart, PieChart, Activity, Calendar, AlertTriangle, Download, Filter } from 'lucide-react';
import { AttendanceRecord, UserRole } from '../types';

interface AnalyticsProps {
    role: UserRole;
    data: {
        totalDays: number;
        present: number;
        absent: number;
        percentage: number;
        history: AttendanceRecord[];
        atRiskStudents?: { name: string, id: string, percentage: number }[]; // For teachers/admin
    };
}

export const AttendanceAnalytics: React.FC<AnalyticsProps> = ({ role, data }) => {
    // Determine status color
    const getStatusColor = (percent: number) => {
        if (percent >= 90) return 'text-green-600';
        if (percent >= 75) return 'text-blue-600';
        if (percent >= 60) return 'text-orange-500';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Attendance Analytics</h2>
                    <p className="text-slate-500 text-sm">Detailed insights and performance tracking.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
                        <Calendar size={16}/> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-100">
                        <Download size={16}/> Export Report
                    </button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Total Working Days" value={data.totalDays} icon={<Calendar className="text-slate-500"/>} />
                <MetricCard label="Days Present" value={data.present} icon={<CheckCircle className="text-green-500"/>} />
                <MetricCard label="Days Absent" value={data.absent} icon={<XCircle className="text-red-500"/>} />
                <MetricCard 
                    label="Attendance Rate" 
                    value={`${data.percentage}%`} 
                    icon={<Activity className={getStatusColor(data.percentage)}/>} 
                    color={getStatusColor(data.percentage)}
                />
            </div>

            {/* Alerts Section (Student View) */}
            {role === 'student' && data.percentage < 75 && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 
                    ${data.percentage < 60 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}
                `}>
                    <AlertTriangle className={data.percentage < 60 ? 'text-red-600' : 'text-orange-600'} size={24} />
                    <div>
                        <h4 className={`font-bold ${data.percentage < 60 ? 'text-red-800' : 'text-orange-800'}`}>
                            {data.percentage < 60 ? 'Critical Attendance Alert' : 'Low Attendance Warning'}
                        </h4>
                        <p className={`text-sm ${data.percentage < 60 ? 'text-red-700' : 'text-orange-700'}`}>
                            Your attendance is below {data.percentage < 60 ? '60%' : '75%'}. 
                            {data.percentage < 60 ? ' Immediate improvement is required to avoid academic penalties.' : ' Please try to be regular to class.'}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart (Simple CSS implementation) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart size={18} /> Monthly Trends
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {/* Mock bars - in real app would map data */}
                        {[80, 100, 90, 60, 100, 100, 0, 100, 90, 80, 70, 100].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                <div className="w-full bg-slate-100 rounded-t-md relative h-full flex items-end">
                                    <div 
                                        className={`w-full rounded-t-md transition-all duration-500 ${val === 0 ? 'bg-red-400' : val < 75 ? 'bg-orange-400' : 'bg-green-500'}`} 
                                        style={{ height: `${val}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-400">{i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart / Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                     <h3 className="font-bold text-slate-800 mb-4 w-full text-left">Distribution</h3>
                     <div className="relative w-40 h-40 rounded-full border-[12px] border-slate-100 mb-4"
                        style={{
                            background: `conic-gradient(#22c55e ${data.percentage}%, #ef4444 0)`
                        }}
                     >
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-slate-800">{data.percentage}%</span>
                            <span className="text-xs text-slate-400 font-bold uppercase">Present</span>
                        </div>
                     </div>
                     <div className="flex gap-4 text-sm">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-green-500 rounded-full"></div> Present
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-red-500 rounded-full"></div> Absent
                         </div>
                     </div>
                </div>
            </div>

            {/* Teacher/Admin: At Risk List */}
            {role !== 'student' && data.atRiskStudents && data.atRiskStudents.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-red-50 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={18} />
                        <h3 className="font-bold text-red-800">At-Risk Students (Action Needed)</h3>
                    </div>
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Attendance</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.atRiskStudents.map((s, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-3 font-bold text-slate-800">{s.name}</td>
                                    <td className="px-6 py-3">{s.id}</td>
                                    <td className="px-6 py-3 font-bold text-red-600">{s.percentage}%</td>
                                    <td className="px-6 py-3">
                                        <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded font-bold hover:bg-red-200">
                                            Send Alert
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const MetricCard = ({ label, value, icon, color }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
            {icon}
        </div>
        <p className={`text-2xl font-bold ${color || 'text-slate-800'}`}>{value}</p>
    </div>
);

// Helper Icons
const CheckCircle = ({className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const XCircle = ({className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);
