
import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
    type: 'privacy' | 'terms';
    onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 capitalize">
                        {type === 'privacy' ? <Shield size={18} className="text-green-600"/> : <FileText size={18} className="text-blue-600"/>}
                        {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4">
                    {type === 'privacy' ? (
                        <>
                            <p><strong>1. Data Collection:</strong> We collect personal information (name, email, attendance) strictly for educational purposes and institutional requirements.</p>
                            <p><strong>2. Child Safety:</strong> Data related to minors is encrypted and accessible only to authorized guardians (via Enrollment ID linking) and verified educators.</p>
                            <p><strong>3. Data Sharing:</strong> We do not sell data to third parties. Data is shared with school administration only for academic record-keeping.</p>
                            <p><strong>4. Security:</strong> We use industry-standard encryption (AES-256) for data at rest and in transit. Payments are processed via secure PCI-DSS compliant gateways.</p>
                            <p><strong>5. Rights:</strong> You have the right to request a copy of your data or deletion of your account (subject to school retention policies).</p>
                        </>
                    ) : (
                        <>
                            <p><strong>1. Acceptance:</strong> By using EduMaster, you agree to these terms. Usage is monitored for security and performance.</p>
                            <p><strong>2. Code of Conduct:</strong> Users must maintain academic integrity. Plagiarism, harassment, or misuse of the platform is grounds for immediate suspension.</p>
                            <p><strong>3. Payments:</strong> Fees paid are processed immediately. Refunds are subject to the institution's specific policy.</p>
                            <p><strong>4. AI Features:</strong> AI Tutor and predictive analytics are support tools and may make mistakes. They should not replace professional guidance.</p>
                            <p><strong>5. Liability:</strong> EduMaster is a platform provider and is not responsible for the content uploaded by users or specific institutional policies.</p>
                        </>
                    )}
                    <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400">
                        Last Updated: October 27, 2023 • EduMaster Legal Team
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800">
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};
