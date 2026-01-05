
import React, { useState } from 'react';
import { 
    Search, Bell, BookOpen, Clock, Award, Calendar, ChevronRight, 
    LayoutDashboard, ClipboardList, PenTool, MessageSquare, User, LogOut,
    Heart, ShieldCheck, Activity, AlertCircle, FileText, UserPlus, Check, X,
    ChevronDown, Lock, Zap, Shield
} from 'lucide-react';
import { MOCK_COURSES, MOCK_PARENT_STATS, MOCK_ASSIGNMENTS, MOCK_QUIZZES, MOCK_CERTIFICATES, MOCK_ATTENDANCE, MOCK_ANNOUNCEMENTS } from '../constants';
import { SecuritySettings } from './SecuritySettings'; 
import { clearSession } from '../utils/auth';

type ParentView = 'dashboard' | 'child-overview' | 'courses' | 'attendance' | 'results' | 'assignments' | 'certificates' | 'announcements' | 'profile' | 'weekly-progress' | 'security';

// Mock Children for Context Switching
const MOCK_CHILDREN = [
    { id: '1', name: 'Alex Sharma', grade: 'Class 12', enrollment: 'STU839210', status: 'active' },
    { id: '2', name: 'Rohan Sharma', grade: 'Class 8', enrollment: 'STU992211', status: 'active' },
    { id: '3', name: 'Priya Sharma', grade: 'Class 5', enrollment: 'STU112233', status: 'pending' }, // Pending Approval
];

export const ParentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ParentView>('dashboard');
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  
  // Add Child Form State
  const [newChildEnrollment, setNewChildEnrollment] = useState('');
  const [childrenList, setChildrenList] = useState(MOCK_CHILDREN);

  const handleAddChild = (e: React.FormEvent) => {
      e.preventDefault();
      // In real app: Call API
      if(newChildEnrollment) {
          const newChild = { 
              id: Math.random().toString(), 
              name: 'Pending Student...', 
              grade: '...', 
              enrollment: newChildEnrollment, 
              status: 'pending' 
          };
          setChildrenList([...childrenList, newChild]); // @ts-ignore
          setNewChildEnrollment('');
          setShowAddChildModal(false);
          alert(`Request sent to student with ID ${newChildEnrollment}. Waiting for their approval.`);
      }
  };

  const handleLogout = () => {
      clearSession();
      window.location.reload();
  };

  const activeChildren = childrenList.filter(c => c.status === 'active');
  const pendingChildren = childrenList.filter(c => c.status === 'pending');

  return (
    <div className="flex h-screen bg-teal-50 font-sans text-slate-800">
      
      {/* --- PARENT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-teal-100 hidden md:flex flex-col z-30 shadow-sm">
        <div className="p-6 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl bg-teal-600">P</div>
           <span className="text-xl font-bold text-slate-800 tracking-tight">EduMaster</span>
        </div>

        {/* CHILD SELECTOR */}
        <div className="px-4 mb-2 relative">
            <button 
                onClick={() => setShowChildSelector(!showChildSelector)}
                className="w-full bg-teal-50 border border-teal-100 rounded-xl p-3 flex items-center justify-between hover:bg-teal-100 transition-colors"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold shrink-0">
                        {selectedChild.name.charAt(0)}
                    </div>
                    <div className="text-left overflow-hidden">
                         <p className="text-xs font-bold text-slate-800 truncate">{selectedChild.name}</p>
                         <p className="text-[10px] text-slate-500 truncate">{selectedChild.grade}</p>
                    </div>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
            </button>
            
            {/* Dropdown */}
            {showChildSelector && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 bg-slate-50">Select Child</p>
                    {activeChildren.map(child => (
                        <button 
                            key={child.id}
                            onClick={() => { setSelectedChild(child); setShowChildSelector(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 flex items-center gap-2
                                ${selectedChild.id === child.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600'}
                            `}
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {child.name}
                        </button>
                    ))}
                    
                    {pendingChildren.length > 0 && (
                        <>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 bg-slate-50 border-t border-slate-100">Pending Approval</p>
                            {pendingChildren.map(child => (
                                <div key={child.id} className="px-4 py-3 text-sm text-slate-400 flex items-center gap-2 cursor-not-allowed opacity-70">
                                    <Clock size={12} />
                                    {child.enrollment}
                                </div>
                            ))}
                        </>
                    )}

                    <button 
                        onClick={() => { setShowAddChildModal(true); setShowChildSelector(false); }}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-blue-600 border-t border-slate-100 hover:bg-blue-50 flex items-center gap-2"
                    >
                        <UserPlus size={14} /> Add Another Child
                    </button>
                </div>
            )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <NavItem icon={<User size={20} />} label="Child Overview" active={activeView === 'child-overview'} onClick={() => setActiveView('child-overview')} />
            <NavItem icon={<Zap size={20} />} label="Weekly Progress" active={activeView === 'weekly-progress'} onClick={() => setActiveView('weekly-progress')} badge="NEW" />
            <NavItem icon={<BookOpen size={20} />} label="Courses & Progress" active={activeView === 'courses'} onClick={() => setActiveView('courses')} />
            <NavItem icon={<Calendar size={20} />} label="Attendance" active={activeView === 'attendance'} onClick={() => setActiveView('attendance')} />
            <NavItem icon={<PenTool size={20} />} label="Tests & Results" active={activeView === 'results'} onClick={() => setActiveView('results')} />
            <NavItem icon={<ClipboardList size={20} />} label="Assignments Status" active={activeView === 'assignments'} onClick={() => setActiveView('assignments')} />
            <NavItem icon={<Award size={20} />} label="Certificates" active={activeView === 'certificates'} onClick={() => setActiveView('certificates')} />
            <NavItem icon={<MessageSquare size={20} />} label="Announcements" active={activeView === 'announcements'} onClick={() => setActiveView('announcements')} />
        </nav>

        <div className="p-4 border-t border-teal-100 space-y-1">
            <NavItem icon={<User size={20} />} label="Profile & Settings" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
            <NavItem icon={<Shield size={20} />} label="Security" active={activeView === 'security'} onClick={() => setActiveView('security')} />
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* --- ADD CHILD MODAL --- */}
      {showAddChildModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                  <button onClick={() => setShowAddChildModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                      <X size={20} />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <UserPlus size={24} />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-slate-800">Link New Student</h3>
                          <p className="text-xs text-slate-500">Enter enrollment ID to request access.</p>
                      </div>
                  </div>
                  
                  <form onSubmit={handleAddChild} className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Enrollment Number</label>
                          <input 
                              type="text" 
                              value={newChildEnrollment}
                              onChange={(e) => setNewChildEnrollment(e.target.value)}
                              placeholder="e.g. STU123456" 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                              required
                          />
                          <p className="text-[10px] text-slate-500 mt-2">
                              The student will receive a notification to approve your request. Data access will be granted only after approval.
                          </p>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                          Send Request
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md z-20 px-6 border-b border-teal-100 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-slate-800 capitalize hidden md:block">
                {activeView.replace('-', ' ')}
            </h2>
            <div className="md:hidden font-bold text-teal-600">EduMaster</div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-slate-700">Mr. Sharma</span>
                    <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wide">Parent Account</span>
                </div>
                <button className="relative p-2 text-slate-500 hover:bg-teal-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-teal-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                     <User className="text-teal-600" size={20} />
                </div>
            </div>
        </header>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto bg-teal-50/50 p-6 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                {activeView === 'dashboard' && <ParentHome setActiveView={setActiveView} childName={selectedChild.name} />}
                {activeView === 'child-overview' && <ChildOverviewView childName={selectedChild.name} />}
                {activeView === 'weekly-progress' && <WeeklyProgressView childName={selectedChild.name} />}
                {activeView === 'courses' && <CoursesProgressView />}
                {activeView === 'attendance' && <AttendanceView />}
                {activeView === 'results' && <ResultsView />}
                {activeView === 'assignments' && <AssignmentsStatusView />}
                {activeView === 'certificates' && <CertificatesView childName={selectedChild.name} />}
                {activeView === 'announcements' && <AnnouncementsView />}
                {activeView === 'profile' && <ProfileView />}
                {activeView === 'security' && <SecuritySettings />}
            </div>
        </div>

      </main>
    </div>
  );
};

// --- SUB-VIEWS ---

const WeeklyProgressView = ({ childName }: { childName: string }) => {
    // Mock History
    const history = [
        { week: 45, score: 85, level: 'Intermediate', date: 'Nov 10' },
        { week: 44, score: 60, level: 'Beginner', date: 'Nov 03' },
        { week: 43, score: 45, level: 'Beginner', date: 'Oct 27' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Weekly Progress Report</h2>
                    <p className="text-slate-500 text-sm">Tracking {childName}'s AI Assessment Performance</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold text-sm">
                    Current Level: <span className="text-indigo-900">Intermediate</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest Result */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-teal-600"/> Latest Quiz Performance
                    </h3>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-teal-100">
                            <span className="text-3xl font-bold text-teal-600">85%</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-500 mb-4">Week 45 Assessment</p>
                    <div className="bg-green-50 p-3 rounded-lg text-xs text-green-700 font-medium text-center">
                        Level Up! Moved from Beginner to Intermediate.
                    </div>
                </div>

                {/* History List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-slate-500"/> History
                    </h3>
                    <div className="space-y-3">
                        {history.map((h, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-sm text-slate-700">Week {h.week}</p>
                                    <p className="text-xs text-slate-500">{h.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">{h.score}%</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{h.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (Rest of existing components: ParentHome, ChildOverviewView, CoursesProgressView, etc.)
const ParentHome = ({ setActiveView, childName }: { setActiveView: (view: ParentView) => void, childName: string }) => (
    <div className="space-y-8">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex items-center justify-between">
            <div className="relative z-10 max-w-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome, Mr. Sharma! 🛡️</h1>
                <p className="text-teal-100 mb-6">Here is a quick summary of <span className="font-bold text-white">{childName}'s</span> progress this week.</p>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView('child-overview')} className="bg-white text-teal-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors">
                        View Full Report
                    </button>
                </div>
            </div>
            <div className="hidden md:block absolute right-10 bottom-0 opacity-20 transform translate-y-4">
                 <ShieldCheck size={140} />
            </div>
        </div>
        {/* ... stats ... */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <StatCard icon={<BookOpen className="text-blue-500" />} label="Enrolled Courses" value="4" />
             <StatCard icon={<Activity className="text-teal-500" />} label="Attendance Rate" value={`${MOCK_PARENT_STATS.attendanceRate}%`} />
             <StatCard icon={<Award className="text-purple-500" />} label="Avg. Grade" value={MOCK_PARENT_STATS.avgGrade} />
             <StatCard icon={<AlertCircle className="text-orange-500" />} label="Upcoming Exams" value={MOCK_PARENT_STATS.upcomingDeadlines} />
        </div>
    </div>
);

const ChildOverviewView = ({childName}: {childName: string}) => (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Child Overview</h2>
        {/* ... content ... */}
    </div>
);

const CoursesProgressView = () => <div>Courses View Placeholder</div>;
const AttendanceView = () => <div>Attendance View Placeholder</div>;
const ResultsView = () => <div>Results View Placeholder</div>;
const AssignmentsStatusView = () => <div>Assignments View Placeholder</div>;
const CertificatesView = ({childName}: any) => <div>Certificates View Placeholder</div>;
const AnnouncementsView = () => <div>Announcements View Placeholder</div>;
const ProfileView = () => <div>Profile View Placeholder</div>;

const NavItem = ({ icon, label, active, badge, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${active ? 'bg-teal-100 text-teal-800 shadow-sm' : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'}`}>
        {icon} <span className="flex-1 text-left">{label}</span>
        {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{badge}</span>}
    </button>
);

const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center text-center justify-center">
        <div className="mb-2">{icon}</div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
);
