
/**
 * Global App Configuration
 * Single source of truth for environment variables and global constants.
 */

interface AppConfig {
    API_BASE_URL: string;
    ENV: 'development' | 'production' | 'test';
    TIMEOUT: number;
    FEATURES: {
        ENABLE_ANALYTICS: boolean;
        ENABLE_DARK_MODE: boolean;
    }
}

// Helper to get env variable safely (works with Vite)
// @ts-ignore
const getEnv = (key: string, fallback: string): string => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        return import.meta.env[key] || fallback;
    }
    return fallback;
};

export const CONFIG: AppConfig = {
    // Default to localhost for dev, but allows override via .env
    API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:5000'),
    
    // @ts-ignore
    ENV: (getEnv('MODE', 'development') as 'development' | 'production'),
    
    TIMEOUT: 15000, // 15 seconds request timeout

    FEATURES: {
        ENABLE_ANALYTICS: true,
        ENABLE_DARK_MODE: false
    }
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${CONFIG.API_BASE_URL}/api/auth/login`,
        SIGNUP: `${CONFIG.API_BASE_URL}/api/auth/signup`,
        OTP_GEN: `${CONFIG.API_BASE_URL}/api/auth/generate-otp`,
        OTP_LOGIN: `${CONFIG.API_BASE_URL}/api/auth/login-otp`
    },
    ATTENDANCE: {
        MARK: `${CONFIG.API_BASE_URL}/api/attendance/mark`,
        STATUS: `${CONFIG.API_BASE_URL}/api/attendance/status`
    },
    // Add other endpoints as needed
};
