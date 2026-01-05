
import React, { useState, useEffect } from 'react';
import { EmojiCharacter } from './components/EmojiCharacter';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { AttendanceGate } from './components/AttendanceGate'; 
import { FeedbackWidget } from './components/FeedbackWidget';
import { EmojiMood, UserRole } from './types';
import { motion } from 'framer-motion';
import { getSession, saveSession, clearSession } from './utils/auth';

const App: React.FC = () => {
  const [mood, setMood] = useState<EmojiMood>(EmojiMood.IDLE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Restore Session on Load
  useEffect(() => {
    const savedRole = getSession();
    if (savedRole) {
      setUserRole(savedRole);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (role: UserRole) => {
      saveSession(role); // Persist session
      setUserRole(role);
      setIsAuthenticated(true);
  };

  // Helper to handle logout safely
  const handleLogout = () => {
      clearSession();
      setIsAuthenticated(false);
      setUserRole('student');
      window.location.reload(); // Clean state reset
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  // --- ROUTING LOGIC ---

  if (isAuthenticated) {
      return (
          <>
            <AttendanceGate userRole={userRole}>
                {/* 2. Security Guards: Strict Rendering */}
                {userRole === 'admin' && <AdminDashboard />}
                {userRole === 'student' && <StudentDashboard />}
                {userRole === 'teacher' && <TeacherDashboard />}
                {userRole === 'parent' && <ParentDashboard />}
            </AttendanceGate>
            {/* Global Feedback Widget for Support & Bug Reporting */}
            <FeedbackWidget />
          </>
      );
  }

  // Unauthenticated users see the Login/Signup Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-4 lg:gap-12 items-center relative z-10 h-full">
        
        {/* Left Side: Form */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end py-4">
           <LoginForm 
                onStateChange={setMood} 
                onLoginSuccess={handleLoginSuccess} 
            />
        </div>

        {/* Right Side: Family Character */}
        <div className="order-1 lg:order-2 flex flex-col items-center justify-center lg:h-full lg:min-h-[500px] mb-4 lg:mb-0">
           <motion.div
             className="relative"
             animate={{ 
               y: mood === EmojiMood.EXCITED ? [0, -10, 0] : 0,
             }}
             transition={{ 
               type: "spring", 
               stiffness: 100, 
               damping: 10,
               repeat: mood === EmojiMood.EXCITED ? Infinity : 0,
               repeatDelay: 1.5
             }}
           >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white blur-[70px] opacity-70 scale-110 rounded-full z-0"></div>
              
              <div className="relative z-10 scale-90 md:scale-100">
                <EmojiCharacter mood={mood} />
              </div>
           </motion.div>
           
           <motion.div 
             className="mt-6 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl text-slate-600 font-medium text-center text-sm shadow-sm border border-white/60 max-w-xs"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             key={mood}
           >
             {mood === EmojiMood.SHY ? "Shh! We aren't looking at your password. 🙈" : 
              mood === EmojiMood.EXCITED ? "Everything looks perfect! Let's go! 🎉" : 
              mood === EmojiMood.HAPPY ? "Hello! Let's get your account set up. 👋" : 
              mood === EmojiMood.CONFUSED ? "Hmm, please check your details again... 🤔" :
              "Your Secure Family Guardians 🛡️"}
           </motion.div>
        </div>

      </div>
    </div>
  );
};

export default App;
