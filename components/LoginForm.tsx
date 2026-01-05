
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Check, ShieldCheck, Smartphone, Mail, ArrowRight, AtSign, Briefcase, GraduationCap, School, Book, Shield, Key, Heart, Facebook, Chrome, Globe, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiMood, UserRole } from '../types';
import { LegalModal } from './LegalModal';

interface LoginFormProps {
  onStateChange: (mood: EmojiMood) => void;
  onLoginSuccess: (role: UserRole) => void;
}

type AuthMode = 'signup' | 'login' | 'admin_login';
type Step = 'role_selection' | 'form';
type LoginMethod = 'email' | 'mobile';

export const LoginForm: React.FC<LoginFormProps> = ({ onStateChange, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<Step>('form'); 
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);
  
  // -- Form Fields --
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(''); // Email or Username
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  
  // Student Specific
  const [studentClass, setStudentClass] = useState('');
  const [language, setLanguage] = useState('');

  // Teacher Specific
  const [qualification, setQualification] = useState('');
  const [subject, setSubject] = useState('');

  // Parent Specific
  const [childEnrollment, setChildEnrollment] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // -- UX State --
  const [showPassword, setShowPassword] = useState(false);
  const [isPwdFocused, setIsPwdFocused] = useState(false);
  const [isConfirmPwdFocused, setIsConfirmPwdFocused] = useState(false);

  // -- Validation Logic --
  const patterns = {
    length: /.{8,}/,
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
    special: /[@$!%*?&]/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^[0-9]{10}$/
  };

  const [pwdValid, setPwdValid] = useState({
    length: false, upper: false, lower: false, number: false, special: false
  });

  useEffect(() => {
    setPwdValid({
      length: patterns.length.test(password),
      upper: patterns.upper.test(password),
      lower: patterns.lower.test(password),
      number: patterns.number.test(password),
      special: patterns.special.test(password)
    });
  }, [password]);

  const isPasswordStrong = Object.values(pwdValid).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;
  
  const isEmailLoginValid = username.length > 0 && password.length > 0;
  const isMobileLoginValid = patterns.mobile.test(mobile); 
  const isLoginValid = loginMethod === 'email' ? isEmailLoginValid : isMobileLoginValid;
  
  // Strict Validation based on Role
  const isStudentSignupValid = 
    selectedRole === 'student' &&
    fullName.length > 0 &&
    patterns.email.test(email) &&
    studentClass.length > 0 &&
    isPasswordStrong &&
    doPasswordsMatch;

  const isTeacherSignupValid = 
    selectedRole === 'teacher' &&
    fullName.length > 0 &&
    patterns.email.test(email) &&
    qualification.length > 0 &&
    subject.length > 0 &&
    isPasswordStrong &&
    doPasswordsMatch;

  const isParentSignupValid = 
    selectedRole === 'parent' &&
    fullName.length > 0 &&
    patterns.email.test(email) &&
    childEnrollment.length >= 6 && // Check for valid enrollment ID format
    isPasswordStrong &&
    doPasswordsMatch;

  const isSignupValid = selectedRole === 'student' ? isStudentSignupValid : selectedRole === 'teacher' ? isTeacherSignupValid : isParentSignupValid;

  // -- FAMILY MOOD LOGIC --
  useEffect(() => {
    let newMood = EmojiMood.IDLE;

    if (authMode === 'admin_login') {
        newMood = EmojiMood.IDLE; // Admin mood is neutral/serious
    }
    else if (isPwdFocused || isConfirmPwdFocused) {
        newMood = EmojiMood.SHY;
    }
    else if (authMode === 'signup' && step === 'role_selection') {
        newMood = EmojiMood.HAPPY;
    }
    else if (authMode === 'signup' && step === 'form') {
        if (isSignupValid) {
            newMood = EmojiMood.EXCITED;
        } else if (password.length > 0 && (!isPasswordStrong || !doPasswordsMatch)) {
            newMood = EmojiMood.CONFUSED;
        } else if (fullName.length > 0) {
            newMood = EmojiMood.HAPPY;
        }
    } else {
        // Login
        if (isLoginValid) newMood = EmojiMood.EXCITED;
        else if ((loginMethod === 'email' && username.length > 0) || (loginMethod === 'mobile' && mobile.length > 2)) newMood = EmojiMood.HAPPY;
    }

    onStateChange(newMood);
  }, [
      authMode, step, isPwdFocused, isConfirmPwdFocused, 
      isSignupValid, isLoginValid, isPasswordStrong, doPasswordsMatch, 
      fullName, username, mobile, password, confirmPassword, loginMethod,
      childEnrollment, onStateChange
  ]);

  const handleStartSignup = (role: UserRole) => {
      if(role === 'admin') return; // Cannot sign up as admin
      setSelectedRole(role);
      setStep('form');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setStudentClass('');
      setQualification('');
      setSubject('');
      setChildEnrollment('');
  };

  const handleSwitchMode = (mode: AuthMode) => {
      setAuthMode(mode);
      if (mode === 'signup') {
          setStep('role_selection');
      } else {
          setStep('form');
      }
      setPassword('');
      setConfirmPassword('');
      setMobile('');
      setUsername('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'admin_login') {
        // In real app: Validate against Admin DB
        if(isEmailLoginValid) onLoginSuccess('admin');
    }
    else if((authMode === 'login' && isLoginValid) || (authMode === 'signup' && isSignupValid)) {
        const roleToLogin = authMode === 'signup' ? selectedRole : selectedRole; 
        onLoginSuccess(roleToLogin);
    }
  };

  // -- UI: ADMIN MODE --
  if (authMode === 'admin_login') {
      return (
          <div className="w-full max-w-md bg-slate-900 rounded-lg shadow-2xl border border-slate-800 p-8 text-slate-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
              <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                      <Shield size={32} className="text-red-500" />
                  </div>
                  <h2 className="text-xl font-mono font-bold text-white tracking-widest uppercase">EduMaster Command</h2>
                  <p className="text-xs text-slate-500 font-mono">Restricted Access</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-slate-500">Admin ID</label>
                      <div className="relative">
                          <User className="absolute left-3 top-3 text-slate-500" size={16} />
                          <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm" 
                            placeholder="ADMIN-001"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-slate-500">Passcode</label>
                      <div className="relative">
                          <Key className="absolute left-3 top-3 text-slate-500" size={16} />
                          <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm" 
                            placeholder="••••••••••••"
                          />
                      </div>
                  </div>
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-colors font-mono uppercase text-sm">
                      Authenticate
                  </button>
              </form>
              <button onClick={() => setAuthMode('login')} className="w-full text-center mt-6 text-xs text-slate-600 hover:text-slate-400">
                  ← Return to Public Portal
              </button>
          </div>
      );
  }

  // -- UI: STUDENT / TEACHER / PARENT MODE --
  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_rgba(8,_112,_184,_0.15)] border border-white/60 relative flex flex-col max-h-[85vh] overflow-hidden transition-all duration-300">
      
      {legalType && <LegalModal type={legalType} onClose={() => setLegalType(null)} />}

      <div className="overflow-y-auto custom-scrollbar px-8 py-8 flex-1">
        
        {/* Mood/Status Header */}
        <div className="h-6 mb-2 flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
            {(isPwdFocused || isConfirmPwdFocused) ? (
                <motion.div
                    key="privacy"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-xs font-bold text-blue-600 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full"
                >
                    <ShieldCheck size={14} /> Family is looking away 🙈
                </motion.div>
            ) : null}
            </AnimatePresence>
        </div>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
                {authMode === 'signup' 
                    ? (step === 'role_selection' ? 'Who are you?' : `Join as ${selectedRole === 'parent' ? 'Parent' : selectedRole === 'student' ? 'Student' : 'Teacher'}`) 
                    : 'EduMaster Login'}
            </h2>
            {authMode === 'login' && <p className="text-xs text-slate-500 mt-1">Access your learning dashboard</p>}
        </div>

        {/* --- SIGNUP: STEP 1 - ROLE SELECTION --- */}
        {authMode === 'signup' && step === 'role_selection' && (
            <div className="space-y-3">
                <button 
                    onClick={() => handleStartSignup('student')}
                    className="w-full bg-white border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
                >
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">I am a Student</h3>
                        <p className="text-[10px] text-slate-500">Access courses and quizzes.</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleStartSignup('teacher')}
                    className="w-full bg-white border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50/50 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
                >
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">I am a Teacher</h3>
                        <p className="text-xs text-slate-500">Create courses and grade.</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleStartSignup('parent')}
                    className="w-full bg-white border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50/50 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
                >
                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Heart size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">I am a Parent</h3>
                        <p className="text-xs text-slate-500">Link to your child's profile.</p>
                    </div>
                </button>
            </div>
        )}

        {/* --- FORM STEP (Signup or Login) --- */}
        {(step === 'form' || authMode === 'login') && (
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {authMode === 'login' && (
                     <>
                        {/* Login Method Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                            <button type="button" onClick={() => setLoginMethod('email')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'email' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Email</button>
                            <button type="button" onClick={() => setLoginMethod('mobile')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'mobile' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Mobile + OTP</button>
                        </div>
                        
                        {/* Role Selector for Login */}
                        <div className="flex justify-center gap-4 mb-2 text-xs font-medium text-slate-500">
                             <label className="flex items-center gap-1 cursor-pointer">
                                 <input type="radio" name="loginRole" checked={selectedRole === 'student'} onChange={() => setSelectedRole('student')} className="accent-blue-600" /> Student
                             </label>
                             <label className="flex items-center gap-1 cursor-pointer">
                                 <input type="radio" name="loginRole" checked={selectedRole === 'teacher'} onChange={() => setSelectedRole('teacher')} className="accent-purple-600" /> Teacher
                             </label>
                             <label className="flex items-center gap-1 cursor-pointer">
                                 <input type="radio" name="loginRole" checked={selectedRole === 'parent'} onChange={() => setSelectedRole('parent')} className="accent-teal-600" /> Parent
                             </label>
                        </div>
                     </>
                )}

                <AnimatePresence>
                    {authMode === 'signup' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-4 overflow-hidden"
                        >
                            <InputField icon={<User size={18}/>} placeholder="Full Name" value={fullName} onChange={setFullName} />
                            
                            {selectedRole === 'student' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField icon={<School size={18}/>} placeholder="Class/Grade" value={studentClass} onChange={setStudentClass} />
                                    <InputField icon={<Book size={18}/>} placeholder="Language" value={language} onChange={setLanguage} />
                                </div>
                            )}

                            {selectedRole === 'teacher' && (
                                <div className="space-y-4">
                                     <InputField icon={<Briefcase size={18}/>} placeholder="Highest Qualification" value={qualification} onChange={setQualification} />
                                     <InputField icon={<Book size={18}/>} placeholder="Subject Expertise" value={subject} onChange={setSubject} />
                                </div>
                            )}

                            {selectedRole === 'parent' && (
                                <div className="space-y-4 bg-teal-50 p-4 rounded-xl border border-teal-100">
                                     <div className="flex items-start gap-2 text-[10px] text-teal-700 mb-1">
                                        <div className="mt-0.5"><Link size={12}/></div>
                                        <p>Enter your child's <strong>Enrollment Number</strong> (e.g. STU123456) to link accounts.</p>
                                     </div>
                                     <InputField icon={<User size={18}/>} placeholder="Child's Enrollment ID" value={childEnrollment} onChange={setChildEnrollment} />
                                </div>
                            )}

                            <InputField icon={<Mail size={18}/>} placeholder="Email Address" type="email" value={email} onChange={setEmail} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LOGIN INPUTS */}
                {authMode === 'login' && loginMethod === 'email' && (
                    <InputField icon={<AtSign size={18}/>} placeholder="Username or Email" value={username} onChange={setUsername} />
                )}

                {authMode === 'login' && loginMethod === 'mobile' && (
                    <InputField icon={<Smartphone size={18}/>} placeholder="Mobile Number (10 digits)" type="tel" value={mobile} onChange={setMobile} />
                )}

                {(authMode === 'signup' || (authMode === 'login' && loginMethod === 'email')) && (
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                        <Lock size={18} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                        onFocus={() => setIsPwdFocused(true)}
                        onBlur={() => setIsPwdFocused(false)}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder-slate-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                )}

                <AnimatePresence>
                    {authMode === 'signup' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setIsConfirmPwdFocused(true)}
                                    onBlur={() => setIsConfirmPwdFocused(false)}
                                    placeholder="Confirm Password"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm text-slate-700 placeholder-slate-400
                                        ${confirmPassword.length > 0 && !doPasswordsMatch ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500/50'}
                                    `}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Password Rules */}
                <AnimatePresence>
                    {(authMode === 'signup' || (authMode === 'login' && loginMethod === 'email' && password.length > 0 && !isPasswordStrong)) && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-y-1 gap-x-2"
                        >
                            <PasswordRule label="8+ chars" valid={pwdValid.length} />
                            <PasswordRule label="Upper (A-Z)" valid={pwdValid.upper} />
                            <PasswordRule label="Lower (a-z)" valid={pwdValid.lower} />
                            <PasswordRule label="Number (0-9)" valid={pwdValid.number} />
                            <PasswordRule label="Symbol ($@!)" valid={pwdValid.special} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {authMode === 'signup' && (
                     <button type="button" onClick={() => setStep('role_selection')} className="text-xs text-slate-400 hover:text-slate-600 w-full text-center">
                         Change Role
                     </button>
                )}

                <div className="h-12 flex items-end justify-center pt-2">
                    <AnimatePresence>
                        {(authMode === 'signup' ? isSignupValid : isLoginValid) && (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                type="submit"
                                className={`w-full text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform
                                    ${selectedRole === 'student' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 
                                      selectedRole === 'teacher' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 
                                      'bg-gradient-to-r from-teal-600 to-emerald-600'}
                                `}
                            >
                                {authMode === 'signup' 
                                    ? `Create ${selectedRole === 'student' ? 'Student' : selectedRole === 'teacher' ? 'Teacher' : 'Parent'} Account` 
                                    : loginMethod === 'mobile' ? 'Send OTP' : 'Login Securely'}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* SOCIAL LOGIN - Only show on Login mode */}
                {authMode === 'login' && (
                    <div className="pt-4 border-t border-slate-100">
                        <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4">Or continue with</div>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600">
                                <Chrome size={16} className="text-red-500" /> Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600">
                                <Facebook size={16} className="text-blue-600" /> Facebook
                            </button>
                        </div>
                    </div>
                )}

            </form>
        )}

        {/* Legal Links Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-6 text-[10px] text-slate-400 font-medium">
            <button onClick={() => setLegalType('privacy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setLegalType('terms')} className="hover:text-slate-600 transition-colors">Terms of Service</button>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-default">Compliance</span>
        </div>

        <div className="mt-2 text-center">
            <p className="text-sm text-slate-500 mb-2">
                {authMode === 'signup' ? "Already have an account?" : "Don't have an account?"}
                <button 
                    onClick={() => handleSwitchMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="ml-2 font-bold text-slate-700 hover:text-blue-600 hover:underline"
                >
                    {authMode === 'signup' ? 'Login' : 'Sign Up'}
                </button>
            </p>
            {/* INVISIBLE / SUBTLE ADMIN LOGIN TRIGGER */}
            <button 
                onClick={() => setAuthMode('admin_login')} 
                className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors uppercase font-bold tracking-widest mt-4"
            >
                Employee Portal
            </button>
        </div>

      </div>
    </div>
  );
};

const InputField = ({ icon, placeholder, value, onChange, type = "text", disabled = false }: any) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {icon}
        </div>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder-slate-400 disabled:opacity-50"
        />
    </div>
);

const PasswordRule = ({ label, valid }: { label: string, valid: boolean }) => (
    <div className={`flex items-center gap-1.5 text-[10px] transition-colors ${valid ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${valid ? 'bg-green-100 border-green-500' : 'bg-slate-100 border-slate-300'}`}>
            {valid && <Check size={8} />}
        </div>
        {label}
    </div>
);
