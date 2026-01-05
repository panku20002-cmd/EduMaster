
import React from 'react';
import { Download, Printer, Shield } from 'lucide-react';
import { Invoice, SalarySlip, FinancialConfig } from '../types';

interface InvoiceTemplateProps {
    data: Invoice | SalarySlip;
    type: 'fee' | 'salary';
    config: FinancialConfig;
    user: { name: string; id: string; role: string; address?: string };
    onClose: () => void;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data, type, config, user, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    // Type Guards
    const isFee = (d: any): d is Invoice => type === 'fee';
    const isSalary = (d: any): d is SalarySlip => type === 'salary';

    const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '-';

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* Screen Only Header */}
                <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center print:hidden">
                    <h3 className="font-bold text-slate-800">
                        {type === 'fee' ? 'Tax Invoice Details' : 'Salary Slip'}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">
                            <Printer size={16} /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">
                            Close
                        </button>
                    </div>
                </div>

                {/* Printable Area */}
                <div className="p-8 print:p-0 bg-white text-slate-800 font-sans" id="printable-area">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-2xl print:bg-black">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">EduMaster LMS</h1>
                                <p className="text-xs text-slate-500 font-medium">Excellence in Education</p>
                            </div>
                        </div>
                        <div className="text-right text-sm">
                            <p className="font-bold text-slate-900">{config.billingAddress}</p>
                            {config.gstEnabled && <p className="text-slate-600">GSTIN: <span className="font-mono font-bold">{config.gstin}</span></p>}
                            <p className="text-slate-500">support@edumaster.com</p>
                        </div>
                    </div>

                    {/* Invoice/Slip Info */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-sm text-slate-600">ID: {user.id}</p>
                            <p className="text-sm text-slate-600 capitalize">{user.role}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900 mb-1">
                                {type === 'fee' ? 'INVOICE' : 'PAYSLIP'}
                            </p>
                            <p className="text-sm text-slate-600"># {isFee(data) ? data.invoiceNumber : data.slipNumber}</p>
                            <p className="text-sm text-slate-600">Date: {formatDate(isSalary(data) ? data.generatedDate : new Date().toISOString())}</p>
                            <div className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold uppercase border 
                                ${data.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} print:border-black print:text-black print:bg-white`}
                            >
                                {data.status}
                            </div>
                        </div>
                    </div>

                    {/* Content Table */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="bg-slate-50 border-y border-slate-200 text-left text-xs uppercase font-bold text-slate-500">
                                <th className="py-3 px-4">Description</th>
                                {type === 'salary' && <th className="py-3 px-4 text-center">Days/Rate</th>}
                                <th className="py-3 px-4 text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isFee(data) && data.breakdown.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100">
                                    <td className="py-3 px-4 font-medium text-slate-700">{item.subject} Fee - {data.month}</td>
                                    <td className="py-3 px-4 text-right">{item.amount.toLocaleString()}</td>
                                </tr>
                            ))}

                            {isSalary(data) && (
                                <>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-3 px-4 font-medium text-slate-700">Base Salary - {data.month}</td>
                                        <td className="py-3 px-4 text-center">{data.presentDays} Days @ ₹{data.dailyRate}/day</td>
                                        <td className="py-3 px-4 text-right">{data.grossSalary.toLocaleString()}</td>
                                    </tr>
                                    {data.deductions > 0 && (
                                        <tr className="border-b border-slate-100 text-red-600">
                                            <td className="py-3 px-4 font-medium">Deductions (Absence/Tax)</td>
                                            <td className="py-3 px-4 text-center">-</td>
                                            <td className="py-3 px-4 text-right">- {data.deductions.toLocaleString()}</td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            {isFee(data) && (
                                <>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Subtotal</span>
                                        <span>₹{data.amount.toLocaleString()}</span>
                                    </div>
                                    {config.gstEnabled && (
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>GST ({config.gstPercentage}%)</span>
                                            <span>₹{data.taxAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-800 pt-2 mt-2">
                                        <span>Total Payable</span>
                                        <span>₹{data.totalAmount.toLocaleString()}</span>
                                    </div>
                                </>
                            )}

                            {isSalary(data) && (
                                <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-800 pt-2 mt-2">
                                    <span>Net Salary</span>
                                    <span>₹{data.netSalary.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
                        <p>This is a system-generated invoice. No signature required.</p>
                        <p className="mt-1">Thank you for being part of EduMaster.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};
