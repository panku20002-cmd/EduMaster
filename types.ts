

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin';

export enum EmojiMood {
  IDLE = 'idle',
  HAPPY = 'happy',
  SHY = 'shy',
  EXCITED = 'excited',
  CONFUSED = 'confused'
}

export type NotificationType = 'attendance' | 'academic' | 'finance' | 'security' | 'system' | 'general';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: string;
  priority: 'normal' | 'high';
}

// --- AI & ACADEMIC TYPES ---

export interface AIPrediction {
  studentId: string;
  studentName: string;
  overallScore: number;
  riskLevel: RiskLevel;
  attendanceTrend: 'up' | 'down' | 'stable';
  gradeTrend: 'up' | 'down' | 'stable';
  weakSubjects: string[];
  strengths: string[];
  lastUpdated: string;
}

export type StudentLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    subject: string;
    difficulty: StudentLevel;
}

export interface WeeklyQuiz {
    id: string;
    weekNumber: number;
    title: string;
    questions: QuizQuestion[];
    timeLimit: number;
    studentLevel: StudentLevel;
    status: 'pending' | 'completed';
    score?: number;
    completedAt?: string;
    feedback?: string;
}

export interface SolverMessage {
    id: string;
    sender: 'user' | 'ai';
    type: 'text' | 'image' | 'mixed';
    content: string;
    imageUrl?: string;
    timestamp: string;
    isTyping?: boolean;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  subject: string; 
  classLevel: string;
  type: 'Textbook' | 'Reference' | 'Notes' | 'Paper';
  fileUrl: string;
  coverUrl: string;
  status: 'active' | 'hidden' | 'pending_approval';
  addedBy: string;
  uploadDate: string;
  downloads: number;
  description?: string;
  isDownloadable: boolean;
  offlineEncrypted: boolean;
  tags?: string[];
  aiConfidence?: number;
  sourceUrl?: string;
  licenseType?: string;
}

// --- EXISTING TYPES ---

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  rating?: number;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  time: string;
  isLive: boolean;
}

export interface UserStats {
  coursesInProgress: number;
  completedLessons: number;
  hoursLearned: number;
  certificates: number;
}

export interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
  assignmentsToGrade: number;
  averageRating: number;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  pendingApprovals: number;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  schoolId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  type: 'security' | 'system' | 'user';
}

export interface PlatformSettings {
  registrationsOpen: boolean;
  requireTwoFactor: boolean;
  allowGuestAccess: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  teacherFeedback?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  timeLimit: string;
  status: 'completed' | 'pending';
  score?: number;
  dateTaken?: string;
}

export interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
}

export interface ParentStats {
  attendanceRate: number;
  avgGrade: string;
  upcomingDeadlines: number;
}

export interface AttendanceRecord {
  date: string;
  subject?: string;
  status: 'present' | 'absent' | 'late';
}

// --- FINANCE TYPES ---

export interface Invoice {
    id: string;
    invoiceNumber: string;
    month: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    breakdown: { subject: string; amount: number }[];
    paymentDate?: string;
    paymentMethod?: string;
    year?: number;
}

export interface SalarySlip {
    id: string;
    slipNumber: string;
    month: string;
    generatedDate: string;
    presentDays: number;
    dailyRate: number;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    status: 'pending' | 'paid';
    paymentDate?: string;
}

export interface FinancialConfig {
    gstEnabled: boolean;
    gstPercentage: number;
    gstin: string;
    billingAddress: string;
    invoicePrefix: string;
    remindersEnabled: boolean;
    reminderFrequencyDays: number;
}

export interface FinancialAnalyticsData {
    totalRevenue: number;
    totalExpenses: number;
    pendingFees: number;
    overdueFees: number;
    monthlyRevenue: number[];
    monthlyExpenses: number[];
    collectionRate: number;
}

// --- LIBRARY ANALYTICS ---

export interface LibraryAnalyticsData {
    totalBooks: number;
    totalDownloads: number;
    activeReaders: number;
    mostReadBooks: { id: string; title: string; count: number }[];
    subjectUsage: { subject: string; count: number }[];
    dailyActivity: number[];
}

// --- PRODUCTION CHECKLIST ---

export interface ChecklistItem {
    id: string;
    category: string;
    label: string;
    status: 'pass' | 'fail' | 'pending';
    isCritical: boolean;
}

// --- SECURITY & SESSIONS ---

export interface Session {
    id: string;
    device: string;
    browser: string;
    ip: string;
    lastActive: string;
    isCurrent: boolean;
    location: string;
}

export interface LoginHistoryItem {
    id: string;
    timestamp: string;
    device: string;
    ip: string;
    status: 'success' | 'suspicious' | 'failed';
    riskLevel: 'low' | 'medium' | 'high';
    riskReason?: string;
    location: string;
}

// --- DEVOPS & MONITORING ---

export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'critical';
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
    activeUsers: number;
    errorRate: number;
    lastBackup: string;
    apiVersion: string;
}

export interface FeatureFlag {
    id: string;
    key: string;
    label: string;
    isEnabled: boolean;
    description: string;
}

export interface BackupRecord {
    id: string;
    timestamp: string;
    size: string;
    status: 'success' | 'failed' | 'in_progress';
    type: 'automated' | 'manual';
}

export interface SystemMetric {
    timestamp: string;
    cpu: number;
    memory: number;
    latency: number;
    activeConnections: number;
    errorRate: number;
}

// --- FEEDBACK ---

export interface FeedbackTicket {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    type: 'bug' | 'feature' | 'general';
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'resolved';
    message: string;
    deviceInfo: string;
    timestamp: string;
}

// --- COST CONTROL ---

export interface CostMetric {
    category: string;
    cost: number;
    usageUnit: string;
    usageValue: number;
    trend: 'up' | 'down' | 'stable';
    limit: number;
}
