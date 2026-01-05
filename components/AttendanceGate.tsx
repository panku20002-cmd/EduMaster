import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, UserCheck, Calendar, Scan, MapPin } from 'lucide-react';
import { AttendanceVerification } from './AttendanceVerification';

interface AttendanceGateProps {
  children: React.ReactNode;
  userRole: string;
}

export const AttendanceGate: React.FC<AttendanceGateProps> = ({ children, userRole }) => {
  // We assume parent and admin don't need daily attendance marking in this spec
  // If they do, remove this check.
  const shouldCheckAttendance = userRole === 'student' || userRole === 'teacher';
  
  const [attendanceMarked, setAttendanceMarked] = useState<boolean | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shouldCheckAttendance) {
        setAttendanceMarked(true);
        setLoading(false);
        return;
    }
    checkStatus();
  }, [userRole]);

  const checkStatus = async () => {
    try {
        // Mock API call simulation if no backend running in preview
        const storedDate = localStorage.getItem('last_attendance_date');
        const today = new Date().toISOString().split('T')[0];
        
        if (storedDate === today) {
            setAttendanceMarked(true);
        } else {
            setAttendanceMarked(false);
        }
    } catch (err) {
        console.error("Attendance Check Failed");
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (data: { method: string, lat?: number, long?: number }) => {
      setShowVerification(false);
      setLoading(true);
      try {
          // await fetch('/api/attendance/mark', { 
          //   method: 'POST',
          //   body: JSON.stringify(data)
          // });
          
          // Simulation success
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem('last_attendance_date', today);
          setTimeout(() => {
              setAttendanceMarked(true);
              setLoading(false);
          }, 800);
      } catch (err) {
          setError("Failed to mark attendance. Please try again.");
          setLoading(false);
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
      );
  }

  if (attendanceMarked) {
      return <>{children}</>;
  }

  return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          
          {showVerification && (
              <AttendanceVerification onVerify={handleVerify} onCancel={() => setShowVerification(false)} />
          )}

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="h-2 bg-indigo-600 w-full"></div>
              <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                      <UserCheck size={40} className="text-indigo-600" />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                          <Clock size={20} className="text-orange-500" />
                      </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Attendance Required</h2>
                  <p className="text-slate-500 mb-6">
                      Good morning! You must mark your attendance to unlock your dashboard for today.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-500">Date</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                              <Calendar size={14}/> {new Date().toLocaleDateString()}
                          </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Role</span>
                          <span className="font-bold text-indigo-600 uppercase text-xs px-2 py-0.5 bg-indigo-50 rounded">
                              {userRole}
                          </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Scan size={12}/> Biometric</span>
                           <span className="flex items-center gap-1"><MapPin size={12}/> Geofence Enabled</span>
                      </div>
                  </div>

                  {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                          <AlertTriangle size={16} /> {error}
                      </div>
                  )}

                  <button 
                      onClick={() => setShowVerification(true)}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                      <CheckCircle size={20} /> Verify & Mark Present
                  </button>
                  
                  <p className="text-xs text-slate-400 mt-4">
                      Verification required. Failure to mark will trigger alerts to parents/admin.
                  </p>
              </div>
          </div>
      </div>
  );
};