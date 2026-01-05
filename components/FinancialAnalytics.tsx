import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, BarChart2, Activity } from 'lucide-react';
import { FinancialAnalyticsData } from '../types';

interface FinancialAnalyticsProps {
    data: FinancialAnalyticsData;
}

export const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({ data }) => {
    
    // Find max value for scaling chart
    const maxValue = Math.max(...data.monthlyRevenue, ...data.monthlyExpenses);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Revenue" 
                    value={`₹${(data.totalRevenue / 100000).toFixed(2)} Lakh`} 
                    icon={<DollarSign className="text-green-600" />} 
                    bg="bg-green-50" 
                    trend="+12% vs last year"
                />
                <StatCard 
                    label="Salary Expenses" 
                    value={`₹${(data.totalExpenses / 100000).toFixed(2)} Lakh`} 
                    icon={<CreditCard className="text-red-600" />} 
                    bg="bg-red-50" 
                    trend="Stable"
                />
                <StatCard 
                    label="Pending Fees" 
                    value={`₹${data.pendingFees.toLocaleString()}`} 
                    icon={<Activity className="text-orange-600" />} 
                    bg="bg-orange-50" 
                    trend={`${data.collectionRate}% Collection`}
                />
                <StatCard 
                    label="Net Profit" 
                    value={`₹${((data.totalRevenue - data.totalExpenses) / 100000).toFixed(2)} Lakh`} 
                    icon={<TrendingUp className="text-blue-600" />} 
                    bg="bg-blue-50" 
                    trend="Healthy"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <BarChart2 size={20} className="text-slate-500" /> Revenue vs Expenses (Yearly)
                        </h3>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Revenue</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Expenses</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {data.monthlyRevenue.map((rev, i) => {
                            const exp = data.monthlyExpenses[i];
                            const revHeight = (rev / maxValue) * 100;
                            const expHeight = (exp / maxValue) * 100;
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <div className="w-full flex gap-1 items-end h-full justify-center">
                                        <div 
                                            className="w-2 md:w-3 bg-green-500 rounded-t-sm transition-all duration-500 group-hover:bg-green-400"
                                            style={{ height: `${revHeight}%` }}
                                        ></div>
                                        <div 
                                            className="w-2 md:w-3 bg-red-400 rounded-t-sm transition-all duration-500 group-hover:bg-red-300"
                                            style={{ height: `${expHeight}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono hidden md:block">{months[i]}</span>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        Rev: ₹{rev}k | Exp: ₹{exp}k
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Collection Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-slate-500" /> Fee Collection Status
                    </h3>
                    
                    <div className="flex justify-center mb-8">
                        <div className="relative w-40 h-40 rounded-full border-[16px] border-slate-100"
                             style={{ background: `conic-gradient(#22c55e ${data.collectionRate}%, #f97316 0)` }}
                        >
                            <div className="absolute inset-0 m-4 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-slate-800">{data.collectionRate}%</span>
                                <span className="text-xs text-slate-500 font-bold uppercase">Collected</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Paid Invoices</span>
                            <span className="font-bold text-slate-800">1,240</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Pending</span>
                            <span className="font-bold text-slate-800">85</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Overdue</span>
                            <span className="font-bold text-red-600">12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, bg, trend }: any) => (
    <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between h-32 ${bg} border-opacity-50 border-slate-200 bg-opacity-30`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        </div>
        <p className="text-xs font-medium text-slate-600">{trend}</p>
    </div>
);