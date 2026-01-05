
import React, { useState } from 'react';
import { 
    Search, Bell, Users, ShieldAlert, CheckCircle, XCircle, 
    AlertTriangle, FileText, Database, Server, Filter, 
    LayoutDashboard, UserCheck, BookOpen, Settings, LogOut, 
    Lock, Activity, TrendingUp, UserMinus, ToggleLeft, ToggleRight,
    MapPin, Scan, Calculator, Book, ClipboardCheck, Building2,
    MessageSquare, DollarSign, Flag
} from 'lucide-react';
import { MOCK_USERS, MOCK_ADMIN_STATS, MOCK_COURSES, MOCK_LOGS, MOCK_SETTINGS } from '../constants';
import { AdminFinancePanel } from './FinanceComponents';
import { DigitalLibrary } from './LibraryComponents';
import { ProductionChecklist } from './ProductionChecklist';
import { DevOpsPanel } from './DevOpsPanel';
import { LiveMonitoringPanel } from './LiveMonitoringPanel';
import { AdminFeedbackManager } from './AdminFeedbackManager';
import { CostControlPanel } from './CostControlPanel';
import { ProductRoadmap } from './ProductRoadmap'; 
import { clearSession } from '../utils/auth';

type View = 'overview' | 'students' | 'teachers' | 'courses' | 'approvals' | 'reports' | 'finance' | 'settings' | 'library' | 'checklist' | 'schools' | 'security' | 'devops' | 'monitoring' | 'feedback' | 'cost' | 'roadmap';

export const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('overview');

  const handleLogout = () => {
      clearSession();
      window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-30">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <ShieldAlert size={20} />
            </div>
            <div>
                <h1 className="font-bold text-white tracking-wider text-lg">EduMaster</h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Command Center</p>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-600 mb-2 mt-2">Strategy & Ops</p>
            <AdminNavItem icon={<LayoutDashboard size={18} />} label="Overview" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
            <AdminNavItem icon={<Flag size={18} />} label="Roadmap & Strategy" active={currentView === 'roadmap'} onClick={() => setCurrentView('roadmap')} badge="BETA" />
            <AdminNavItem icon={<Activity size={18} />} label="Live Monitoring" active={currentView === 'monitoring'} onClick={() => setCurrentView('monitoring')} badge="LIVE" />
            <AdminNavItem icon={<Server size={18} />} label="DevOps Controls" active={currentView === 'devops'} onClick={() => setCurrentView('devops')} />
            <AdminNavItem icon={<ShieldAlert size={18} />} label="Security & Risks" active={currentView === 'security'} onClick={() => setCurrentView('security')} />
            <AdminNavItem icon={<DollarSign size={18} />} label="Cost Control" active={currentView === 'cost'} onClick={() => setCurrentView('cost')} />
            
            <p className="px-3 text-[10px] uppercase font-bold text-slate-600 mb-2 mt-4">Management</p>
            <AdminNavItem icon={<Users size={18} />} label="Users" active={currentView === 'students'} onClick={() => setCurrentView('students')} />
            <AdminNavItem icon={<MessageSquare size={18} />} label="User Feedback" active={currentView === 'feedback'} onClick={() => setCurrentView('feedback')} />
            <AdminNavItem icon={<CheckCircle size={18} />} label="Approvals" active={currentView === 'approvals'} badge={MOCK_ADMIN_STATS.pendingApprovals} onClick={() => setCurrentView('approvals')} />
            <AdminNavItem icon={<Calculator size={18} />} label="Finance" active={currentView === 'finance'} onClick={() => setCurrentView('finance')} />
            <AdminNavItem icon={<Building2 size={18} />} label="Multi-School" active={currentView === 'schools'} onClick={() => setCurrentView('schools')} />
            
            <p className="px-3 text-[10px] uppercase font-bold text-slate-600 mb-2 mt-4">Configuration</p>
            <AdminNavItem icon={<Settings size={18} />} label="System Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors text-sm font-medium">
                <LogOut size={16} /> Logout Securely
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-20">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                {currentView.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Operational
                </div>
                <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                
                {currentView === 'overview' && <OverviewPanel />}
                {currentView === 'roadmap' && <ProductRoadmap />}
                
                {/* Operations & DevOps */}
                {currentView === 'monitoring' && <LiveMonitoringPanel />}
                {currentView === 'devops' && <DevOpsPanel />}
                {currentView === 'security' && <SecurityAdminPanel />}
                {currentView === 'cost' && <CostControlPanel />}
                
                {/* Management */}
                {currentView === 'feedback' && <AdminFeedbackManager />}
                {currentView === 'schools' && <SchoolsPanel />}
                {currentView === 'finance' && <AdminFinancePanel />}
                {currentView === 'library' && <DigitalLibrary isAdmin={true} />}
                {currentView === 'checklist' && <ProductionChecklist />}
                
                {/* Visual Placeholders */}
                {currentView === 'students' && (
                    <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center h-96 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Users size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">User Management</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Placeholder for student and teacher CRUD operations, role assignments, and profile management.
                        </p>
                    </div>
                )}
                
                {currentView === 'courses' && (
                    <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center h-96 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <BookOpen size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">Course Management</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Placeholder for creating courses, assigning teachers, and managing curriculum content.
                        </p>
                    </div>
                )}
                
                {currentView === 'approvals' && (
                    <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center h-96 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">Approvals Workflow</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Placeholder for reviewing pending teacher registrations, course publications, and content moderation.
                        </p>
                    </div>
                )}
                
                {currentView === 'settings' && <SettingsPanel />}

            </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-PANELS ---

const SchoolsPanel = () => {
    const schools = [
        { id: 1, name: 'Greenwood High', code: 'GWH', admin: 'Principal Roy', status: 'active', students: 1200 },
        { id: 2, name: 'St. Marys Institute', code: 'SMI', admin: 'Sr. Nancy', status: 'active', students: 850 },
        { id: 3, name: 'Tech Valley Academy', code: 'TVA', admin: 'Mr. Stark', status: 'inactive', students: 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Registered Institutions</h3>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">+ Onboard School</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map(school => (
                    <div key={school.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl font-bold text-slate-500">
                                {school.code.substring(0,1)}
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${school.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {school.status}
                            </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-800">{school.name}</h4>
                        <p className="text-xs text-slate-500 mb-4">Code: {school.code} • Admin: {school.admin}</p>
                        
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700">{school.students} Students</span>
                            <button className="text-blue-600 hover:underline text-xs font-bold">Manage</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SecurityAdminPanel = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="text-red-600" /> Platform Security & Risks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <UserMinus size={18} className="text-orange-500" /> Account Deletion Requests
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm font-bold text-slate-800">John Doe (Student)</p>
                                <p className="text-xs text-slate-500">Requested: 2 days ago</p>
                            </div>
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">Cooling Off</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" /> Suspicious Login Flags
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                            <div>
                                <p className="text-sm font-bold text-red-800">IP 45.22.11.9 (Russia)</p>
                                <p className="text-xs text-red-600">Failed attempts on Admin Account</p>
                            </div>
                            <button className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded border border-red-200 hover:bg-red-50">Block IP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OverviewPanel = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Students" value={MOCK_ADMIN_STATS.totalStudents} icon={<Users className="text-blue-500" />} trend="+12% this week" />
            <StatCard label="Total Teachers" value={MOCK_ADMIN_STATS.totalTeachers} icon={<UserCheck className="text-purple-500" />} trend="+4% this week" />
            <StatCard label="Active Courses" value={MOCK_ADMIN_STATS.activeCourses} icon={<BookOpen className="text-green-500" />} trend="Steady" />
            <StatCard label="Pending Approvals" value={MOCK_ADMIN_STATS.pendingApprovals} icon={<CheckCircle className="text-orange-500" />} alert />
        </div>
        {/* Additional Overview Content could go here */}
    </div>
);

const SettingsPanel = () => (
    <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center h-96 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Settings size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">System Settings</h3>
        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Placeholder for configuring global application settings, notification preferences, and system defaults.
        </p>
    </div>
);

const AdminNavItem = ({ icon, label, active, badge, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            ${active ? 'bg-slate-800 text-white border-l-4 border-red-500 pl-2' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
        `}
    >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge === 'LIVE' ? 'bg-green-500 text-white animate-pulse' : 'bg-red-600 text-white'}`}>{badge}</span>
        )}
    </button>
);

const StatCard = ({ label, value, icon, trend, alert }: any) => (
    <div className={`bg-white p-5 rounded-lg border shadow-sm relative overflow-hidden ${alert ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-md ${alert ? 'bg-red-100' : 'bg-slate-50'}`}>{icon}</div>
            <span className={`text-[10px] font-bold ${alert ? 'text-red-600' : 'text-green-600'}`}>{trend}</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        {alert && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 blur-xl opacity-20 -mr-8 -mt-8"></div>}
    </div>
);
