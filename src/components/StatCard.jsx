import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ label, value, change, status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'positive': return 'text-green-500 bg-green-50';
            case 'negative': return 'text-red-500 bg-red-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    const getIcon = () => {
        switch (status) {
            case 'positive': return <ArrowUpRight size={16} />;
            case 'negative': return <ArrowUpRight size={16} />; // Usually 'negative' change like higher risk is also arrow up
            default: return <Minus size={16} />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-4 flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    {getIcon()}
                    <span>{change}</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
