
import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, Award, HelpCircle, Users, FileText, BarChart2, Shield, Database, Lock, Book } from 'lucide-react';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard';
import { UserRole } from '../types';
import { LegalModal } from './LegalModal';

interface DashboardLayoutProps {
  role: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const isAdmin = role === 'admin';
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="flex h-screen bg-slate-50">
      
      {legalType && <LegalModal type={legalType} onClose={() => setLegalType(null)} />}

      {/* Sidebar - Desktop */}
      <aside className={`w-64 border-r hidden md:flex flex-col z-30 transition-colors duration-300
        ${isAdmin ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-2">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl 
             ${role === 'teacher' ? 'bg-purple-600' : isAdmin ? 'bg-red-600' : 'bg-blue-600'}`}>
             {isAdmin ? <Shield size={18} /> : 'E'}
           </div>
           <div>
               <span className={`text-xl font-bold tracking-tight block leading-none ${isAdmin ? 'text-white' : 'text-slate-800'}`}>
                 EduMaster
               </span>
               <span className={`text-[10px] font-mono opacity-50 ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>v1.0.0 Gold</span>
           </div>
        </div>

        {/* Role Badge */}
        <div className="px-6 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md 
                ${role === 'teacher' ? 'bg-purple-50 text-purple-600' : 
                  isAdmin ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-blue-50 text-blue-600'}
            `}>
                {role === 'teacher' ? 'Teacher Workspace' : isAdmin ? 'Super Admin Console' : 'Student Portal'}
            </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label={isAdmin ? "System Overview" : "Dashboard"} active role={role} />
            <NavItem icon={<Book size={20} />} label="Digital Library" role={role} />
            
            {role === 'student' && (
                <>
                    <NavItem icon={<BookOpen size={20} />} label="My Courses" role={role} />
                    <NavItem icon={<Calendar size={20} />} label="Schedule" role={role} />
                    <NavItem icon={<Award size={20} />} label="Certificates" role={role} />
                </>
            )}

            {role === 'teacher' && (
                <>
                    <NavItem icon={<BookOpen size={20} />} label="Manage Courses" role={role} />
                    <NavItem icon={<Users size={20} />} label="Students" role={role} />
                    <NavItem icon={<FileText size={20} />} label="Assignments" badge="5" role={role} />
                    <NavItem icon={<BarChart2 size={20} />} label="Analytics" role={role} />
                </>
            )}

            {isAdmin && (
                <>
                    <NavItem icon={<Users size={20} />} label="User Management" role={role} />
                    <NavItem icon={<Database size={20} />} label="Course Data" role={role} badge="12" />
                    <NavItem icon={<Lock size={20} />} label="Security Logs" role={role} />
                    <NavItem icon={<BarChart2 size={20} />} label="Platform Stats" role={role} />
                </>
            )}

            {!isAdmin && <NavItem icon={<MessageSquare size={20} />} label="Messages" badge="3" role={role} />}
        </nav>

        {/* Bottom Actions */}
        <div className={`p-4 border-t space-y-1 ${isAdmin ? 'border-slate-800' : 'border-slate-100'}`}>
            <NavItem icon={<HelpCircle size={20} />} label="Support" role={role} />
            <NavItem icon={<Settings size={20} />} label="Settings" role={role} />
            <button 
                onClick={() => window.location.reload()} 
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors
                    ${isAdmin ? 'text-red-400 hover:bg-slate-800' : 'text-red-500 hover:bg-red-50'}
                `}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
            <div className={`pt-2 flex justify-center gap-3 text-[10px] ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>
                <button onClick={() => setLegalType('privacy')} className="hover:underline">Privacy</button>
                <button onClick={() => setLegalType('terms')} className="hover:underline">Terms</button>
            </div>
        </div>
      </aside>

      {/* Main Content Area - Role Based Rendering */}
      {role === 'student' && <StudentDashboard />}
      {role === 'teacher' && <TeacherDashboard />}
      {role === 'admin' && <AdminDashboard />}

    </div>
  );
};

const NavItem = ({ icon, label, active, badge, role }: any) => {
    const isAdmin = role === 'admin';
    
    let activeClass = 'bg-blue-50 text-blue-600';
    let inactiveClass = 'text-slate-500 hover:bg-slate-50 hover:text-slate-800';

    if (role === 'teacher') activeClass = 'bg-purple-50 text-purple-600';
    if (isAdmin) {
        activeClass = 'bg-slate-800 text-white shadow-inner';
        inactiveClass = 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';
    }

    return (
        <a href="#" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
            ${active ? `${activeClass} shadow-sm` : inactiveClass}
        `}>
            {icon}
            <span className="flex-1">{label}</span>
            {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md
                    ${isAdmin ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}
                `}>{badge}</span>
            )}
        </a>
    );
};
