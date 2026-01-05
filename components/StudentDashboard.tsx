
import React, { useState } from 'react';
import { 
    Search, Bell, BookOpen, Clock, Award, Calendar, ChevronRight, Video,
    LayoutDashboard, ClipboardList, PenTool, MessageSquare, User, LogOut,
    Download, PlayCircle, CheckCircle, AlertCircle, Compass, Shield, Check, X,
    BarChart2, CreditCard, Book, Brain, Sparkles, Zap
} from 'lucide-react';
import { CourseCard } from './CourseCard';
import { MOCK_COURSES, MOCK_SCHEDULE, MOCK_STATS, MOCK_ASSIGNMENTS, MOCK_QUIZZES, MOCK_CERTIFICATES, MOCK_ANNOUNCEMENTS } from '../constants';
import { EmojiCharacter } from './EmojiCharacter';
import { EmojiMood } from '../types';
import { AttendanceAnalytics } from './AttendanceAnalytics';
import { StudentFeesPanel } from './FinanceComponents';
import { DigitalLibrary } from './LibraryComponents';
import { NotificationCenter } from './NotificationCenter';
import { AIPerformancePanel } from './AIPerformancePanel';
import { AISolverPanel } from './AISolverPanel';
import { WeeklyQuizPanel } from './WeeklyQuizPanel';
import { SecuritySettings } from './SecuritySettings'; // Imported

type StudentView = 'dashboard' | 'courses' | 'explore' | 'assignments' | 'quizzes' | 'live' | 'progress' | 'certificates' | 'profile' | 'analytics' | 'fees' | 'library' | 'ai-insights' | 'ai-solver' | 'weekly-quiz' | 'security';

// Mock Pending Requests (In real app, fetch from API)
const MOCK_PARENT_REQUESTS = [
    { id: 'req1', parent_name: 'Mr. Rajesh Sharma', email: 'rajesh@parent.com', relationship: 'Father', date: 'Today' }
];

export const StudentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<StudentView>('dashboard');
  const [pendingRequests, setPendingRequests] = useState(MOCK_PARENT_REQUESTS);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleApprove = (id: string) => {
      // API call to approve would go here
      setPendingRequests(prev => prev.filter(r => r.id !== id));
      alert("Parent access approved! They can now view your academic progress.");
  };

  const handleReject = (id: string) => {
      // API call to reject would go here
      setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- STUDENT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-30">
        <div className="p-6 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl bg-blue-600">E</div>
           <span className="text-xl font-bold text-slate-800 tracking-tight">EduMaster</span>
        </div>

        <div className="px-6 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                Student Portal
            </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <NavItem icon={<Zap size={20} />} label="Weekly Quiz" active={activeView === 'weekly-quiz'} onClick={() => setActiveView('weekly-quiz')} badge="REQ" />
            <NavItem icon={<Brain size={20} />} label="AI Insights" active={activeView === 'ai-insights'} onClick={() => setActiveView('ai-insights')} />
            <NavItem icon={<Sparkles size={20} />} label="AI Doubt Solver" active={activeView === 'ai-solver'} onClick={() => setActiveView('ai-solver')} />
            <NavItem icon={<Book size={20} />} label="Library" active={activeView === 'library'} onClick={() => setActiveView('library')} />
            <NavItem icon={<Compass size={20} />} label="Explore Courses" active={activeView === 'explore'} onClick={() => setActiveView('explore')} />
            <NavItem icon={<BookOpen size={20} />} label="My Courses" active={activeView === 'courses'} onClick={() => setActiveView('courses')} />
            <NavItem icon={<CreditCard size={20} />} label="Fees & Invoices" active={activeView === 'fees'} onClick={() => setActiveView('fees')} />
            <NavItem icon={<Video size={20} />} label="Live Classes" active={activeView === 'live'} onClick={() => setActiveView('live')} badge="2" />
            <NavItem icon={<ClipboardList size={20} />} label="Assignments" active={activeView === 'assignments'} onClick={() => setActiveView('assignments')} badge="1" />
            <NavItem icon={<PenTool size={20} />} label="Tests & Quizzes" active={activeView === 'quizzes'} onClick={() => setActiveView('quizzes')} />
            <NavItem icon={<BarChart2 size={20} />} label="Attendance Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
            <NavItem icon={<Award size={20} />} label="Certificates" active={activeView === 'certificates'} onClick={() => setActiveView('certificates')} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
            <NavItem icon={<User size={20} />} label="Profile" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
            <NavItem icon={<Shield size={20} />} label="Security & Privacy" active={activeView === 'security'} onClick={() => setActiveView('security')} />
            <button 
                onClick={() => window.location.reload()} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md z-20 px-6 border-b border-slate-200 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-slate-800 capitalize hidden md:block">
                {activeView === 'dashboard' ? 'Overview' : activeView.replace('-', ' ')}
            </h2>
            <div className="md:hidden font-bold text-blue-600">EduMaster</div>

            <div className="flex items-center gap-4 relative">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                    />
                </div>
                
                {/* Notification Bell */}
                <button 
                    className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <Bell size={20} />
                    {pendingRequests.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    )}
                </button>
                <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

                <div className="w-8 h-8 rounded-full bg-blue-100 border border-slate-200 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
                </div>
            </div>
        </header>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                {/* ... (Pending Requests Alert code remains same) ... */}
                {pendingRequests.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 text-sm">Parent Link Request</h3>
                                <p className="text-xs text-orange-700">A parent is requesting access to your academic data.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                             {pendingRequests.map(req => (
                                 <div key={req.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-orange-100 shadow-sm w-full sm:w-auto">
                                     <div className="text-xs">
                                         <p className="font-bold text-slate-800">{req.parent_name}</p>
                                         <p className="text-xs text-slate-500">{req.relationship}</p>
                                     </div>
                                     <div className="flex gap-1 ml-2">
                                         <button onClick={() => handleApprove(req.id)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check size={14}/></button>
                                         <button onClick={() => handleReject(req.id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><X size={14}/></button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

                {activeView === 'dashboard' && <DashboardHome setActiveView={setActiveView} />}
                {activeView === 'fees' && <StudentFeesPanel studentName="Alex Sharma" />}
                {activeView === 'library' && <DigitalLibrary userRole='student' />}
                {activeView === 'ai-insights' && <AIPerformancePanel role='student' />}
                {activeView === 'ai-solver' && <AISolverPanel />}
                {activeView === 'weekly-quiz' && <WeeklyQuizPanel />}
                {activeView === 'courses' && <CoursesView />}
                {activeView === 'explore' && <ExploreView />}
                {activeView === 'assignments' && <AssignmentsView />}
                {activeView === 'live' && <LiveClassesView />}
                {activeView === 'quizzes' && <QuizzesView />}
                {activeView === 'analytics' && <AnalyticsView />}
                {activeView === 'certificates' && <CertificatesView />}
                {activeView === 'profile' && <ProfileView />}
                {activeView === 'security' && <SecuritySettings />}
            </div>
        </div>

      </main>
    </div>
  );
};

// ... (Rest of existing sub-views remains unchanged)
// --- SUB-VIEWS ---

const AnalyticsView = () => {
    // Mock Data based on spec
    const mockData = {
        totalDays: 30,
        present: 22,
        absent: 8,
        percentage: 73, // Triggers Warning
        history: [],
    };
    return <AttendanceAnalytics role="student" data={mockData} />;
};

const DashboardHome = ({ setActiveView }: { setActiveView: (view: StudentView) => void }) => (
    <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex items-center justify-between">
            <div className="relative z-10 max-w-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
                <p className="text-blue-100 mb-6">You have 2 assignments pending and a live class starting in 30 minutes. Keep up the great work!</p>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView('weekly-quiz')} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
                        <Zap size={16} /> Weekly Quiz
                    </button>
                    <button onClick={() => setActiveView('ai-insights')} className="bg-blue-700/50 text-white border border-blue-400/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Brain size={16} /> AI Insights
                    </button>
                </div>
            </div>
            {/* Character */}
            <div className="hidden md:block absolute right-10 -bottom-10 transform scale-110">
                 <div className="w-48 h-40">
                    <EmojiCharacter mood={EmojiMood.HAPPY} />
                 </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <StatCard icon={<BookOpen className="text-blue-500" />} label="Enrolled Courses" value={MOCK_STATS.coursesInProgress} />
             <StatCard icon={<CheckCircle className="text-green-500" />} label="Lessons Done" value={MOCK_STATS.completedLessons} />
             <StatCard icon={<Clock className="text-orange-500" />} label="Hours Learned" value={MOCK_STATS.hoursLearned} />
             <StatCard icon={<Award className="text-purple-500" />} label="Certificates" value={MOCK_STATS.certificates} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Courses */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Continue Learning</h3>
                    <button onClick={() => setActiveView('courses')} className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MOCK_COURSES.slice(0, 2).map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                {/* Latest Announcement Mini View */}
                <div className="bg-white p-4 rounded-xl border border-blue-100 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-blue-500"/>
                        <span className="font-bold text-slate-800 text-sm">Latest Announcement</span>
                    </div>
                    {MOCK_ANNOUNCEMENTS.slice(0,1).map(ann => (
                        <div key={ann.id}>
                            <p className="font-bold text-sm text-slate-700">{ann.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{ann.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800">Today's Schedule</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
                    {MOCK_SCHEDULE.map(item => (
                        <div key={item.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.isLive ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                <Video size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.time}</p>
                                {item.isLive && <span className="text-[10px] font-bold text-red-500 uppercase">Live Now</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CoursesView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    </div>
);

const ExploreView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Explore New Courses</h2>
        <p className="text-slate-500">Discover new topics and expand your knowledge.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show some courses as "Start Learning" (not enrolled) */}
            {MOCK_COURSES.map(course => (
                 <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative h-40 overflow-hidden">
                        <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700">
                            {course.category}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 mb-3">{course.instructor}</p>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-4">
                            <span>{course.totalLessons} Lessons</span>
                            <span className="text-yellow-500 flex items-center gap-1">★ 4.9</span>
                        </div>
                        <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm">
                            Enroll Now
                        </button>
                    </div>
                 </div>
            ))}
        </div>
    </div>
);

const AssignmentsView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {MOCK_ASSIGNMENTS.map(assign => (
                        <tr key={assign.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-800">{assign.title}</td>
                            <td className="px-6 py-4">{assign.subject}</td>
                            <td className="px-6 py-4">{assign.dueDate}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                    ${assign.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                                      assign.status === 'submitted' ? 'bg-blue-100 text-blue-600' : 
                                      'bg-green-100 text-green-600'}
                                `}>
                                    {assign.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {assign.status === 'graded' ? (
                                    <span className="font-bold text-slate-800">Grade: {assign.grade}</span>
                                ) : (
                                    <button className="text-blue-600 font-bold hover:underline">
                                        {assign.status === 'pending' ? 'Submit' : 'View'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const LiveClassesView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Live Classes</h2>
        <div className="grid grid-cols-1 gap-4">
            {MOCK_SCHEDULE.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${item.isLive ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-100 text-slate-500'}`}>
                            {item.title.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                            <p className="text-slate-500 text-sm">{item.instructor} • {item.subject}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-400">
                                <Clock size={14} /> {item.time}
                            </div>
                        </div>
                    </div>
                    {item.isLive ? (
                        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2">
                            <Video size={18} /> Join Now
                        </button>
                    ) : (
                        <button className="px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                            Upcoming
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const QuizzesView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Tests & Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_QUIZZES.map(quiz => (
                <div key={quiz.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">{quiz.subject}</span>
                        {quiz.status === 'completed' && <span className="text-green-600 font-bold text-sm">{quiz.score}%</span>}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mb-6">{quiz.questions} Questions • {quiz.timeLimit}</p>
                    
                    <div className="mt-auto">
                        {quiz.status === 'completed' ? (
                             <button className="w-full py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200 text-sm">
                                View Results
                             </button>
                        ) : (
                             <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                Start Quiz
                             </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CertificatesView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">My Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CERTIFICATES.map(cert => (
                <div key={cert.id} className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 border-dashed relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={100} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">{cert.courseName}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Issued on {cert.issueDate}</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700">
                            <Download size={14} /> Download PDF
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ProfileView = () => (
    <div className="max-w-xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Alex Sharma</h2>
            <p className="text-slate-500">Class 12 • Science Stream</p>
            <div className="bg-slate-100 rounded-lg p-2 mt-4 inline-block">
                <p className="text-xs font-mono text-slate-500">Enrollment ID: <span className="font-bold text-slate-800 select-all">STU839210</span></p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
                <div className="text-center px-4">
                    <p className="font-bold text-xl text-slate-800">12</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Courses</p>
                </div>
                <div className="w-px bg-slate-200 h-10"></div>
                <div className="text-center px-4">
                    <p className="font-bold text-xl text-slate-800">8</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Certs</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Account Settings</div>
             <div className="divide-y divide-slate-100">
                 <button className="w-full text-left px-6 py-4 text-sm text-slate-600 hover:bg-slate-50 flex justify-between items-center">
                    Edit Profile Information <ChevronRight size={16} />
                 </button>
                 <button className="w-full text-left px-6 py-4 text-sm text-slate-600 hover:bg-slate-50 flex justify-between items-center">
                    Change Password <ChevronRight size={16} />
                 </button>
                 <button className="w-full text-left px-6 py-4 text-sm text-slate-600 hover:bg-slate-50 flex justify-between items-center">
                    Notification Preferences <ChevronRight size={16} />
                 </button>
             </div>
        </div>
    </div>
);

// --- HELPERS ---

const NavItem = ({ icon, label, active, badge, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
            ${active 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
        `}
    >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {badge && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{badge}</span>
        )}
    </button>
);

const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
        <div className="mb-2">{icon}</div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
);
