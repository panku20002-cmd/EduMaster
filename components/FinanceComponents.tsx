import React, { useState } from 'react';
import { 
    DollarSign, CreditCard, Download, Calendar, CheckCircle, 
    AlertCircle, TrendingUp, Users, Calculator, Briefcase, FileText, Settings, Bell, Save
} from 'lucide-react';
import { Invoice, SalarySlip, UserRole, FinancialConfig, FinancialAnalyticsData } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { FinancialAnalytics } from './FinancialAnalytics';
import { InvoiceTemplate } from './InvoiceTemplate';

// --- MOCK DATA ---
const MOCK_CONFIG: FinancialConfig = {
    gstEnabled: true,
    gstPercentage: 18,
    gstin: '29ABCDE1234F1Z5',
    billingAddress: 'EduMate Campus, Tech Park, Bangalore - 560100',
    invoicePrefix: 'INV-2023-',
    remindersEnabled: true,
    reminderFrequencyDays: 3
};

const MOCK_ANALYTICS: FinancialAnalyticsData = {
    totalRevenue: 4500000,
    totalExpenses: 2800000,
    pendingFees: 320000,
    overdueFees: 45000,
    monthlyRevenue: [380, 420, 400, 450, 410, 390, 460, 480, 470, 450, 490, 520], // in thousands
    monthlyExpenses: [280, 280, 285, 290, 290, 295, 295, 300, 300, 310, 310, 320],
    collectionRate: 88
};

const MOCK_INVOICES: Invoice[] = [
    { id: 'INV001', invoiceNumber: 'INV-2023-001', month: 'October', amount: 4500, taxAmount: 810, totalAmount: 5310, dueDate: '2023-10-05', status: 'pending', breakdown: [{subject: 'Math', amount: 1500}, {subject: 'Science', amount: 1500}, {subject: 'English', amount: 1500}] },
    { id: 'INV002', invoiceNumber: 'INV-2023-002', month: 'September', amount: 4500, taxAmount: 810, totalAmount: 5310, dueDate: '2023-09-05', status: 'paid', breakdown: [{subject: 'Math', amount: 1500}, {subject: 'Science', amount: 1500}, {subject: 'English', amount: 1500}], paymentDate: '2023-09-04', paymentMethod: 'upi' },
];

const MOCK_SALARIES: SalarySlip[] = [
    { id: 'SAL001', slipNumber: 'SAL-OCT-001', month: 'October', generatedDate: '2023-10-01', presentDays: 24, dailyRate: 2000, grossSalary: 48000, deductions: 0, netSalary: 48000, status: 'paid', paymentDate: '2023-10-02' },
];

// ----------------------------------------------------------------------
// 1. STUDENT / PARENT FEE VIEW
// ----------------------------------------------------------------------

export const StudentFeesPanel: React.FC<{ studentName: string }> = ({ studentName }) => {
    const [invoices, setInvoices] = useState(MOCK_INVOICES);
    const [paymentModal, setPaymentModal] = useState<{show: boolean, amount: number, id: string}>({show: false, amount: 0, id: ''});
    const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

    const initiatePayment = (inv: Invoice) => {
        setPaymentModal({ show: true, amount: inv.totalAmount, id: inv.id });
    };

    const handlePaymentSuccess = (method: string) => {
        setInvoices(prev => prev.map(inv => 
            inv.id === paymentModal.id ? { ...inv, status: 'paid', paymentDate: new Date().toLocaleDateString(), paymentMethod: method } : inv
        ));
        setPaymentModal({ show: false, amount: 0, id: '' });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="text-teal-600" /> Fee Management
            </h2>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col">
                    <span className="text-xs font-bold text-orange-600 uppercase">Total Due</span>
                    <span className="text-2xl font-bold text-slate-800">
                        ₹{invoices.filter(i => i.status !== 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
                {invoices.map(inv => (
                    <div key={inv.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{inv.month} Fee</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold
                                    ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                                `}>{inv.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 font-mono">Invoice: {inv.invoiceNumber} • Due: {inv.dueDate}</p>
                            <div className="flex gap-2">
                                {inv.breakdown.map((b, i) => (
                                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600">
                                        {b.subject}: ₹{b.amount}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xl font-bold text-slate-800">₹{inv.totalAmount.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400">Inc. Taxes</p>
                            </div>

                            <button onClick={() => setViewInvoice(inv)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="View Invoice">
                                <FileText size={20} />
                            </button>

                            {inv.status !== 'paid' ? (
                                <button 
                                    onClick={() => initiatePayment(inv)}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg flex items-center gap-2 text-xs cursor-default opacity-70">
                                    <CheckCircle size={14} className="text-green-600" /> Paid
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {paymentModal.show && (
                <PaymentGateway 
                    amount={paymentModal.amount} 
                    description={`School Fee Payment`}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setPaymentModal({show: false, amount: 0, id: ''})} 
                />
            )}

            {viewInvoice && (
                <InvoiceTemplate 
                    data={viewInvoice} 
                    type="fee" 
                    config={MOCK_CONFIG} 
                    user={{ name: studentName, id: 'STU839210', role: 'student' }}
                    onClose={() => setViewInvoice(null)} 
                />
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// 2. TEACHER SALARY VIEW
// ----------------------------------------------------------------------

export const TeacherSalaryPanel: React.FC = () => {
    const [viewSlip, setViewSlip] = useState<SalarySlip | null>(null);

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> Salary Management
                    </h2>
                    <p className="text-sm text-slate-500">Calculated based on automated attendance records.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Month</th>
                            <th className="px-6 py-4">Attendance</th>
                            <th className="px-6 py-4">Net Salary</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_SALARIES.map(slip => (
                            <tr key={slip.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-800">{slip.month}</td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-green-600">{slip.presentDays} Days</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">₹{slip.netSalary.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                        {slip.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setViewSlip(slip)}
                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 ml-auto"
                                    >
                                        <FileText size={14} /> View Slip
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {viewSlip && (
                <InvoiceTemplate 
                    data={viewSlip} 
                    type="salary" 
                    config={MOCK_CONFIG} 
                    user={{ name: "Prof. Gupta", id: 'TCH8291', role: 'teacher' }}
                    onClose={() => setViewSlip(null)} 
                />
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. ADMIN FINANCE PANEL
// ----------------------------------------------------------------------

export const AdminFinancePanel: React.FC = () => {
    const [config, setConfig] = useState(MOCK_CONFIG);
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveConfig = () => {
        setIsEditing(false);
        // Call API to save config
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="text-red-600" /> Financial Command Center
            </h2>

            {/* Analytics Dashboard */}
            <FinancialAnalytics data={MOCK_ANALYTICS} />

            {/* Config Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* GST & Billing Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Settings size={18} /> Invoice & GST Configuration
                        </h3>
                        <button onClick={() => isEditing ? handleSaveConfig() : setIsEditing(true)} className="text-xs font-bold text-blue-600 hover:underline">
                            {isEditing ? 'Save Changes' : 'Edit Settings'}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <span className="text-sm text-slate-600">Enable GST</span>
                            {isEditing ? (
                                <input type="checkbox" checked={config.gstEnabled} onChange={e => setConfig({...config, gstEnabled: e.target.checked})} />
                            ) : (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${config.gstEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{config.gstEnabled ? 'Active' : 'Disabled'}</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <span className="text-sm text-slate-600">GST Percentage</span>
                            {isEditing ? (
                                <input type="number" className="w-16 border rounded px-1" value={config.gstPercentage} onChange={e => setConfig({...config, gstPercentage: Number(e.target.value)})} />
                            ) : (
                                <span className="font-bold text-slate-800">{config.gstPercentage}%</span>
                            )}
                        </div>
                        <div>
                            <span className="text-sm text-slate-600 block mb-1">Billing Address</span>
                            {isEditing ? (
                                <textarea className="w-full border rounded p-2 text-xs" value={config.billingAddress} onChange={e => setConfig({...config, billingAddress: e.target.value})} />
                            ) : (
                                <p className="text-xs text-slate-500">{config.billingAddress}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Automation & Reminders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bell size={18} /> Auto-Reminders
                    </h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Fee Payment Reminders</p>
                                <p className="text-xs text-slate-500">Auto-email parents 3 days before due date</p>
                            </div>
                            <input type="checkbox" checked={config.remindersEnabled} disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Salary Processed Alert</p>
                                <p className="text-xs text-slate-500">Notify teachers when salary is approved</p>
                            </div>
                            <input type="checkbox" checked={true} disabled />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fee Structure Control (Existing) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign size={18} /> Student Fee Structure (Base Rates)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Mathematics', 'Science', 'English', 'History'].map(sub => (
                        <div key={sub} className="p-3 bg-slate-50 rounded border border-slate-100">
                            <span className="text-xs text-slate-500 block">{sub}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-slate-800">₹</span>
                                <input type="number" className="w-full bg-transparent font-bold text-slate-800 outline-none" defaultValue={1500} disabled={!isEditing} />
                            </div>
                        </div>
                    ))}
                </div>
                {isEditing && (
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleSaveConfig} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded font-bold text-sm hover:bg-slate-700">
                            <Save size={16} /> Save New Rates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};