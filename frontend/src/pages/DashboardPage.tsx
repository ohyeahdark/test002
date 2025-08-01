import { useState, useEffect } from 'react';
import { api } from '../api';

const StatCard = ({ title, value, percentage, icon, iconBg }: any) => (
    <div className="bg-surface p-4 rounded-xl shadow-soft flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-soft ${iconBg}`}>
            <i className={`fas ${icon} text-white`}></i>
        </div>
        <div className="flex-1">
            <p className="text-sm text-secondary font-bold">{title}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-xl font-bold text-heading">{value}</h4>
                <span className={`text-sm font-bold ${percentage.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{percentage}</span>
            </div>
        </div>
    </div>
);

export function DashboardPage() {
    const [employeeCount, setEmployeeCount] = useState(0);

    useEffect(() => {
        api.get('/employees').then(response => {
            setEmployeeCount(response.data.length);
        }).catch(console.error);
    }, []);

    const stats = [
        { title: "Today's Money", value: "$53,000", percentage: "+55%", icon: "fa-landmark", iconBg: "bg-gradient-to-br from-[#cb0c9f] to-[#9c27b0]" },
        { title: "Today's Users", value: employeeCount, icon: "fa-user", iconBg: "bg-gradient-to-br from-[#cb0c9f] to-[#9c27b0]" },
        { title: "New Clients", value: "+3,462", percentage: "-2%", icon: "fa-user-check", iconBg: "bg-gradient-to-br from-[#cb0c9f] to-[#9c27b0]" },
        { title: "Sales", value: "$103,430", percentage: "+5%", icon: "fa-shopping-cart", iconBg: "bg-gradient-to-br from-[#cb0c9f] to-[#9c27b0]" }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-surface rounded-xl shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-heading mb-4">Sales overview</h3>
                    <div className="h-72 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Biểu đồ doanh thu sẽ ở đây</p>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-heading mb-4">Active Users</h3>
                     <div className="h-72 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Biểu đồ người dùng sẽ ở đây</p>
                    </div>
                </div>
            </div>
        </div>
    );
}