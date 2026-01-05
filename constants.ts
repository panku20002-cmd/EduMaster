
import { Course, LiveClass, UserStats, TeacherStats, AdminStats, AdminUserRecord, AuditLog, PlatformSettings, Assignment, Quiz, Certificate, ParentStats, AttendanceRecord, LibraryBook } from "./types";

export const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 200,
  damping: 15
};

export const MOCK_STATS: UserStats = {
    coursesInProgress: 4,
    completedLessons: 42,
    hoursLearned: 120,
    certificates: 2
};

export const MOCK_COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Advanced Mathematics',
        instructor: 'Dr. Sarah Miller',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
        category: 'Science',
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        rating: 4.8
    },
    {
        id: 'c2',
        title: 'Physics: Mechanics & Waves',
        instructor: 'Prof. Gupta',
        thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400',
        category: 'Science',
        progress: 30,
        totalLessons: 18,
        completedLessons: 6,
        rating: 4.9
    },
    {
        id: 'c3',
        title: 'Organic Chemistry',
        instructor: 'Dr. R. Singh',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
        category: 'Science',
        progress: 0,
        totalLessons: 20,
        completedLessons: 0,
        rating: 4.7
    },
    {
        id: 'c4',
        title: 'Introduction to Python',
        instructor: 'Ms. A. Sharma',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=400',
        category: 'Coding',
        progress: 100,
        totalLessons: 12,
        completedLessons: 12,
        rating: 4.9
    }
];

export const MOCK_SCHEDULE: LiveClass[] = [
    { id: 'l1', title: 'Calculus Doubt Session', instructor: 'Dr. Sarah Miller', subject: 'Math', time: '10:00 AM', isLive: true },
    { id: 'l2', title: 'Physics Lab Prep', instructor: 'Prof. Gupta', subject: 'Physics', time: '02:00 PM', isLive: false }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: 'a1', title: 'Calculus Problem Set 3', subject: 'Math', dueDate: 'Oct 25, 2023', status: 'pending' },
    { id: 'a2', title: 'Physics Lab Report', subject: 'Physics', dueDate: 'Oct 28, 2023', status: 'pending' },
    { id: 'a3', title: 'Chemistry Equation Balancing', subject: 'Chemistry', dueDate: 'Oct 20, 2023', status: 'submitted' },
    { id: 'a4', title: 'Python Basic Syntax', subject: 'Coding', dueDate: 'Oct 15, 2023', status: 'graded', grade: 'A', teacherFeedback: 'Excellent work!' }
];

export const MOCK_QUIZZES: Quiz[] = [
    { id: 'q1', title: 'Thermodynamics Test', subject: 'Physics', questions: 20, timeLimit: '45 mins', status: 'pending' },
    { id: 'q2', title: 'Integration Basics', subject: 'Math', questions: 15, timeLimit: '30 mins', status: 'completed', score: 85, dateTaken: 'Oct 22' },
    { id: 'q3', title: 'Organic Compounds', subject: 'Chemistry', questions: 25, timeLimit: '60 mins', status: 'completed', score: 92, dateTaken: 'Oct 18' }
];

export const MOCK_CERTIFICATES: Certificate[] = [
    { id: 'cert1', courseName: 'Introduction to Python', issueDate: 'Oct 15, 2023' },
    { id: 'cert2', courseName: 'Basic Algebra', issueDate: 'Sep 10, 2023' }
];

export const MOCK_ANNOUNCEMENTS = [
    { id: 'ann1', title: 'Exam Schedule Released', message: 'Mid-term exams start from Nov 15. Check the schedule tab.', date: 'Today', sender: 'Admin', type: 'urgent' },
    { id: 'ann2', title: 'Science Fair Registration', message: 'Register for the annual science fair by Oct 30.', date: 'Yesterday', sender: 'Principal', type: 'info' }
];

export const MOCK_TEACHER_STATS: TeacherStats = {
    totalStudents: 120,
    activeCourses: 4,
    assignmentsToGrade: 15,
    averageRating: 4.8
};

export const MOCK_ENROLLED_STUDENTS = [
    { id: 's1', name: 'Alex Sharma', progress: 65 },
    { id: 's2', name: 'Rohan Das', progress: 40 },
    { id: 's3', name: 'Priya Singh', progress: 85 }
];

export const MOCK_ADMIN_STATS: AdminStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    activeCourses: 140,
    pendingApprovals: 12
};

export const MOCK_USERS: AdminUserRecord[] = [
    { id: 'u1', name: 'John Doe', role: 'teacher', email: 'john@edu.com', status: 'active', joinedDate: '2023-01-10' },
    { id: 'u2', name: 'Jane Smith', role: 'student', email: 'jane@edu.com', status: 'active', joinedDate: '2023-02-15' },
    { id: 'u3', name: 'Bob Wilson', role: 'parent', email: 'bob@edu.com', status: 'pending', joinedDate: '2023-10-25' }
];

export const MOCK_LOGS: AuditLog[] = [
    { id: 'log1', timestamp: '2023-10-26 10:00:01', admin: 'Super Admin', action: 'Approved Course', target: 'Intro to AI', type: 'system' },
    { id: 'log2', timestamp: '2023-10-26 09:45:22', admin: 'Super Admin', action: 'Suspended User', target: 'User #992', type: 'security' },
    { id: 'log3', timestamp: '2023-10-26 09:12:05', admin: 'Manager', action: 'Updated Settings', target: 'GST Rate', type: 'system' }
];

export const MOCK_SETTINGS: PlatformSettings = {
    registrationsOpen: true,
    requireTwoFactor: true,
    allowGuestAccess: false
};

export const MOCK_PARENT_STATS: ParentStats = {
    attendanceRate: 94,
    avgGrade: 'A-',
    upcomingDeadlines: 2
};

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { date: '2023-10-26', subject: 'Physics', status: 'present' },
    { date: '2023-10-26', subject: 'Math', status: 'present' },
    { date: '2023-10-25', subject: 'Chemistry', status: 'absent' },
    { date: '2023-10-25', subject: 'English', status: 'present' },
    { date: '2023-10-24', subject: 'Physics', status: 'present' },
];

export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'b1',
    title: 'Concepts of Physics Vol. 1',
    author: 'H.C. Verma',
    subject: 'Physics',
    classLevel: 'Class 11',
    type: 'Textbook',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/71Hx8-5G4aL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-01-15',
    downloads: 1240,
    description: 'Essential physics textbook covering mechanics, waves, and optics.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b2',
    title: 'Organic Chemistry Principles',
    author: 'Morrison & Boyd',
    subject: 'Chemistry',
    classLevel: 'Class 12',
    type: 'Reference',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/51y8+7tB0QL._SX342_SY445_.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-02-10',
    downloads: 850,
    description: 'Comprehensive guide to organic chemistry reactions and mechanisms.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b3',
    title: 'Calculus Made Easy',
    author: 'Silvanus P. Thompson',
    subject: 'Math',
    classLevel: 'Class 12',
    type: 'Reference',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/51fRceY50nL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-03-05',
    downloads: 2100,
    description: 'A beginner-friendly introduction to differential and integral calculus.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b4',
    title: 'History of Modern India',
    author: 'Bipan Chandra',
    subject: 'History',
    classLevel: 'Class 10',
    type: 'Textbook',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/91+t0Di0EqL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-01-20',
    downloads: 560,
    description: 'Detailed account of Indian history from the 18th century to independence.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b5',
    title: 'Physics Lab Manual',
    author: 'NCERT',
    subject: 'Physics',
    classLevel: 'Class 12',
    type: 'Notes',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/71Yy3r6jVXL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-04-12',
    downloads: 3400,
    description: 'Official lab manual for practical experiments.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b6',
    title: 'Computer Science with Python',
    author: 'Sumita Arora',
    subject: 'Coding',
    classLevel: 'Class 11',
    type: 'Textbook',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/71s8-3W5JQL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-05-30',
    downloads: 980,
    description: 'Textbook for Python programming covering basics to data structures.',
    isDownloadable: true,
    offlineEncrypted: true
  },
  {
    id: 'b7',
    title: 'Previous Year Papers (2015-2023)',
    author: 'Board Exam',
    subject: 'Math',
    classLevel: 'Class 10',
    type: 'Paper',
    fileUrl: '#',
    coverUrl: 'https://m.media-amazon.com/images/I/61+M35-3cWL.jpg',
    status: 'active',
    addedBy: 'Admin',
    uploadDate: '2023-09-01',
    downloads: 5200,
    description: 'Collection of past 8 years mathematics board exam papers.',
    isDownloadable: true,
    offlineEncrypted: true
  }
];
