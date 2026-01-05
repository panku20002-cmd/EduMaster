import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, CheckCircle, XCircle, Scan, ShieldCheck, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    onVerify: (data: { method: string, lat?: number, long?: number }) => void;
    onCancel: () => void;
}

export const AttendanceVerification: React.FC<Props> = ({ onVerify, onCancel }) => {
    const [step, setStep] = useState<'select' | 'camera' | 'location' | 'verifying' | 'success'>('select');
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState('');

    // --- CAMERA LOGIC ---
    const startCamera = async () => {
        try {
            setStep('camera');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            // Mock scanning process
            setTimeout(() => {
                stopCamera();
                setStep('location'); // Move to location check automatically for security
            }, 3000);
        } catch (err) {
            setError("Camera access denied. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
        }
    };

    // --- LOCATION LOGIC ---
    const checkLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return;
        }
        setStep('verifying');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock Success
                setTimeout(() => {
                    setStep('success');
                    setTimeout(() => {
                        onVerify({ 
                            method: 'biometric_geo', 
                            lat: position.coords.latitude, 
                            long: position.coords.longitude 
                        });
                    }, 1000);
                }, 1500);
            },
            (err) => {
                setError("Location access denied. Attendance requires location verification.");
                setStep('select');
            }
        );
    };

    // Clean up
    useEffect(() => {
        return () => stopCamera();
    }, []);

    // Trigger location check
    useEffect(() => {
        if (step === 'location') {
            checkLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    // --- RENDER ---
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} />
                        <span className="font-bold">Identity Verification</span>
                    </div>
                    {step === 'select' && (
                        <button onClick={onCancel} className="text-white/80 hover:text-white"><XCircle size={20}/></button>
                    )}
                </div>

                <div className="p-6 text-center">
                    {step === 'select' && (
                        <div className="space-y-4">
                            <p className="text-slate-600 mb-6">To prevent proxy attendance, please verify your identity.</p>
                            
                            <button onClick={startCamera} className="w-full flex items-center justify-between p-4 border border-indigo-100 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-full text-indigo-600 shadow-sm"><Scan size={24}/></div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800">Face Scan</p>
                                        <p className="text-xs text-slate-500">Use your camera</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-indigo-300 group-hover:text-indigo-600" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 border border-slate-100 bg-slate-50 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-full text-slate-400 shadow-sm"><Smartphone size={24}/></div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-400">Trusted Device</p>
                                        <p className="text-xs text-slate-400">Not registered</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {step === 'camera' && (
                        <div className="relative overflow-hidden rounded-xl bg-black aspect-[3/4] mb-4">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-xl"></div>
                            
                            {/* Scanning Animation */}
                            <motion.div 
                                className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]"
                                animate={{ top: ["10%", "90%", "10%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-mono">Scanning Face...</span>
                            </div>
                        </div>
                    )}

                    {step === 'location' && (
                        <div className="py-8">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <MapPin size={40} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Verifying Location</h3>
                            <p className="text-slate-500 text-sm mb-6">Ensuring you are within the allowed geofence area...</p>
                        </div>
                    )}

                    {step === 'verifying' && (
                        <div className="py-8">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600 font-bold">Processing Verification...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Verified!</h3>
                            <p className="text-slate-500 text-sm">Attendance marked successfully.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <XCircle size={16} /> {error}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Helper component import fix
const ChevronRight = ({size, className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);