
import { UserRole } from '../types';

const SESSION_KEY = 'EDU_MASTER_SESSION';

// --- SECURITY CONFIGURATION ---
// In a real app, these would be environment variables or validated via backend API.
// For this frontend demo, we use specific hardcoded credentials to prevent generic access.
const ADMIN_CONFIG = {
  username: 'ADMIN-MASTER',
  // Simple Base64 of 'SecurePass2024!' to avoid plain text in code
  // This simulates a hash check.
  passwordHash: 'U2VjdXJlUGFzczIwMjQh' 
};

export const validateAdminLogin = (username: string, plainPass: string): boolean => {
  if (!username || !plainPass) return false;
  
  // 1. Verify Username
  if (username !== ADMIN_CONFIG.username) return false;

  // 2. Verify Password (Mock Hash Check)
  // In production, send plainPass to server and compare bcrypt hash
  const inputHash = btoa(plainPass);
  return inputHash === ADMIN_CONFIG.passwordHash;
};

export const saveSession = (role: UserRole) => {
  const session = {
    role,
    timestamp: Date.now(),
    isAuthenticated: true
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): UserRole | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored);
    
    // Auto-logout after 24 hours
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (Date.now() - session.timestamp > ONE_DAY) {
      clearSession();
      return null;
    }
    
    return session.role as UserRole;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
