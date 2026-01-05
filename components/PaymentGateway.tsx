import React, { useState } from 'react';
import { CreditCard, Smartphone, Globe, CheckCircle, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentGatewayProps {
    amount: number;
    description: string;
    onSuccess: (method: string) => void;
    onCancel: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, description, onSuccess, onCancel }) => {
    const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

    const handlePay = () => {
        setStep('processing');
        setProcessing(true);
        // Simulate Network Delay
        setTimeout(() => {
            setProcessing(false);
            setStep('success');
            setTimeout(() => {
                onSuccess(method);
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Lock size={16} className="text-green-400" />
                        <span className="font-bold text-sm">Secure Payment Gateway</span>
                    </div>
                    {step === 'select' && (
                        <button onClick={onCancel}><X size={20} className="text-slate-400 hover:text-white" /></button>
                    )}
                </div>

                <div className="p-6">
                    {step === 'select' && (
                        <>
                            <div className="mb-6 text-center border-b border-slate-100 pb-4">
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Payable (Inc. GST)</p>
                                <p className="text-3xl font-bold text-slate-800">₹{amount.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 mt-1">{description}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-xs font-bold text-slate-400 uppercase">Select Payment Method</p>
                                
                                <button 
                                    onClick={() => setMethod('card')}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-blue-600">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">Credit / Debit Card</p>
                                        <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setMethod('upi')}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${method === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-green-600">
                                        <Smartphone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">UPI / Wallets</p>
                                        <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setMethod('netbanking')}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${method === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-purple-600">
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">Net Banking</p>
                                        <p className="text-[10px] text-slate-500">All Major Banks</p>
                                    </div>
                                </button>
                            </div>

                            <button 
                                onClick={handlePay}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                Pay Now
                            </button>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="font-bold text-lg text-slate-800">Processing Payment...</h3>
                            <p className="text-sm text-slate-500 mt-2">Do not close this window.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 text-center">
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle size={40} className="text-green-600" />
                            </motion.div>
                            <h3 className="font-bold text-xl text-slate-800">Payment Successful!</h3>
                            <p className="text-sm text-slate-500 mt-2">Transaction ID: TXN{Date.now()}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};