
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env'); 

// Helper: Generate JWT
const generateToken = (id, role, schoolId) => {
  return jwt.sign({ id, role, schoolId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

const generateEnrollmentId = () => 'STU' + Math.floor(100000 + Math.random() * 900000).toString();
const generateTeacherId = () => 'TCH' + Math.floor(1000 + Math.random() * 9000).toString();

// --- AUTH HANDLERS ---

const signup = async (req, res) => {
  const { name, email, password, role, mobile, child_enrollment, school_id, ...profileData } = req.body;

  if (role === 'admin' || role === 'super_admin') return res.status(403).json({ message: 'Forbidden' });
  if (!['student', 'teacher', 'parent'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR mobile = $2', [email, mobile]);
    if (userExists.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    let childUserId = null;
    if (role === 'parent') {
        if (!child_enrollment) return res.status(400).json({ message: 'Child Enrollment Number required' });
        const childRes = await db.query("SELECT user_id, school_id FROM student_profiles WHERE enrollment_number = $1", [child_enrollment]);
        if (childRes.rows.length === 0) return res.status(404).json({ message: 'Student not found.' });
        childUserId = childRes.rows[0].user_id;
    }

    // Default School ID for demo if not provided
    const targetSchoolId = school_id || (role === 'parent' ? childUserId : 'DEFAULT_SCHOOL');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        // Include school_id in users table
        const newUser = await client.query(
          'INSERT INTO users (name, email, password_hash, role, mobile, school_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, school_id',
          [name, email, hashedPassword, role, mobile, targetSchoolId]
        );
        const userId = newUser.rows[0].id;

        if (role === 'student') {
            const enrollmentId = generateEnrollmentId();
            await client.query(
                'INSERT INTO student_profiles (user_id, class_grade, enrollment_number, school_id) VALUES ($1, $2, $3, $4)', 
                [userId, profileData.class_grade, enrollmentId, targetSchoolId]
            );
        } else if (role === 'teacher') {
            const teacherId = generateTeacherId();
            await client.query(
                'INSERT INTO teacher_profiles (user_id, teacher_id, qualification, subject_expertise, school_id) VALUES ($1, $2, $3, $4, $5)', 
                [userId, teacherId, profileData.qualification, profileData.subject, targetSchoolId]
            );
        } else if (role === 'parent') {
            await client.query('INSERT INTO parent_profiles (user_id, occupation) VALUES ($1, $2)', [userId, profileData.occupation]);
            await client.query("INSERT INTO student_parent_links (parent_id, student_id, relationship) VALUES ($1, $2, 'Guardian')", [userId, childUserId]);
        }

        await client.query('COMMIT');
        
        res.status(201).json({
          message: 'User registered successfully',
          token: generateToken(userId, role, targetSchoolId),
          user: newUser.rows[0]
        });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
        res.status(500).json({ message: 'Registration failed' });
    } finally {
        client.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password, device_info, ip_address } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    if (user.status === 'suspended') return res.status(403).json({ message: 'Account suspended. Contact School Admin.' });
    if (user.status === 'deletion_pending') {
        return res.status(403).json({ message: 'Account is scheduled for deletion. Please contact support to restore.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        // Log Failed Attempt
        await db.query(
            "INSERT INTO login_logs (user_id, ip_address, device_info, status, risk_level) VALUES ($1, $2, $3, 'failed', 'low')",
            [user.id, ip_address || 'unknown', device_info || 'unknown']
        );
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // --- SUSPICIOUS LOGIN DETECTION ---
    const previousLogins = await db.query(
        "SELECT ip_address FROM login_logs WHERE user_id = $1 AND status = 'success' ORDER BY created_at DESC LIMIT 5",
        [user.id]
    );

    let riskLevel = 'low';
    let riskReason = '';
    const ip = ip_address || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 1. New IP Detection (Simple)
    const knownIPs = previousLogins.rows.map(r => r.ip_address);
    if (knownIPs.length > 0 && !knownIPs.includes(ip)) {
        riskLevel = 'medium';
        riskReason = 'New Device/IP Detected';
    }

    // 2. Alert if Suspicious
    if (riskLevel === 'medium' || riskLevel === 'high') {
        await db.query(
            "INSERT INTO notifications (user_id, title, message, type, priority) VALUES ($1, 'Security Alert', $2, 'security', 'high')",
            [user.id, `New login detected from IP: ${ip}. If this wasn't you, change your password immediately.`]
        );
    }

    // Log Success
    await db.query(
        "INSERT INTO login_logs (user_id, ip_address, device_info, status, risk_level, risk_reason) VALUES ($1, $2, $3, 'success', $4, $5)",
        [user.id, ip, device_info || 'unknown', riskLevel, riskReason]
    );

    // Create Session
    await db.query(
        "INSERT INTO sessions (user_id, device_info, ip_address, is_active) VALUES ($1, $2, $3, TRUE)",
        [user.id, device_info, ip]
    );

    // Fetch Extra Data
    let extraData = {};
    if (user.role === 'student') {
        const profile = await db.query("SELECT enrollment_number FROM student_profiles WHERE user_id = $1", [user.id]);
        if (profile.rows.length > 0) extraData.unique_id = profile.rows[0].enrollment_number;
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user.id, user.role, user.school_id),
      user: { 
          id: user.id, 
          name: user.name, 
          role: user.role,
          schoolId: user.school_id,
          ...extraData
      },
      securityAlert: riskLevel !== 'low' ? { level: riskLevel, message: riskReason } : null
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ... (OTP Handlers remain same) ...
const generateOtp = async (req, res) => res.json({ message: 'OTP sent (Mock)' });
const loginOtp = async (req, res) => res.json({ message: 'OTP Login (Mock)' });

// --- SECURITY & DELETION HANDLERS ---

const getSessions = async (req, res) => {
    // Mock Data based on DB schema concept
    const mockSessions = [
        { id: '1', device: 'Chrome / Windows', ip: '192.168.1.1', lastActive: 'Now', isCurrent: true, location: 'Mumbai' },
        { id: '2', device: 'Safari / iPhone', ip: '10.0.0.1', lastActive: '2h ago', isCurrent: false, location: 'Delhi' }
    ];
    res.json(mockSessions);
};

const revokeSession = async (req, res) => {
    res.json({ message: 'Session revoked' });
};

// Secure Deletion Request
const requestDeletion = async (req, res) => {
    const { password, reason } = req.body;
    
    // 1. Verify Password for critical action
    const userRes = await db.query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
    const isMatch = await bcrypt.compare(password, userRes.rows[0].password_hash);
    
    if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password. Deletion request denied.' });
    }

    // 2. Schedule Deletion (30 Days Cooling Period)
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await db.query(
        "UPDATE users SET status = 'deletion_pending', deletion_scheduled_at = $1 WHERE id = $2",
        [deletionDate, req.user.id]
    );

    // 3. Log Request
    await db.query(
        "INSERT INTO deletion_requests (user_id, reason, status, scheduled_at) VALUES ($1, $2, 'pending', $3)",
        [req.user.id, reason, deletionDate]
    );

    // 4. Force Logout (Client should handle token removal)
    res.json({ 
        message: 'Account scheduled for deletion. You have 30 days to cancel.', 
        scheduledAt: deletionDate 
    });
};

const cancelDeletion = async (req, res) => {
    await db.query(
        "UPDATE users SET status = 'active', deletion_scheduled_at = NULL WHERE id = $1",
        [req.user.id]
    );
    res.json({ message: 'Account restored. Deletion cancelled.' });
};

module.exports = { signup, login, generateOtp, loginOtp, getSessions, revokeSession, requestDeletion, cancelDeletion };
