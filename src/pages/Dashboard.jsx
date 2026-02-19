import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    
    // State for data
    const [stats, setStats] = useState([]);
    const [highRiskCustomers, setHighRiskCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for the chart (still mock as per plan step 2, can be enhanced later)
    const chartData = [
        { name: 'Mon', score: 62 },
        { name: 'Tue', score: 64 },
        { name: 'Wed', score: 63 },
        { name: 'Thu', score: 66 },
        { name: 'Fri', score: 68 },
        { name: 'Sat', score: 70 },
        { name: 'Sun', score: 72 },
    ];

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/dashboard-stats');
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await response.json();
            setStats(data.stats);
            // Frontend expects specific structure, map if needed, but API provided it correctly
            setHighRiskCustomers(data.customers.slice(0, 5));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data. Ensure API is running.");
            
            // Fallback for demo if API fails
            setStats([
                { label: "Total Active Loans", value: "-", change: "-", status: "neutral" },
                { label: "High Risk Customers", value: "-", change: "-", status: "neutral" },
                { label: "Defaults Prevented", value: "-", change: "-", status: "neutral" },
                { label: "Est. Savings", value: "-", change: "-", status: "neutral" }
            ]);
            setHighRiskCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="animate-spin text-blue-500" size={32} />
                    <p className="text-slate-500">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
             <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <div className="flex items-center gap-2 font-bold mb-2">
                    <AlertCircle size={20} />
                    Error
                </div>
                {error}
                <button 
                    onClick={fetchData} 
                    className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm hover:bg-red-50"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Portfolio Stress Trend</h3>
                        <select className="text-sm border-slate-200 rounded-md text-slate-600 focus:ring-blue-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1E293B' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* High Risk Customers Table (Mini) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Critical Alerts</h3>
                        <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                    </div>
                    {highRiskCustomers.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No high risk customers found.</p>
                    ) : (
                        <div className="space-y-4">
                            {highRiskCustomers.map((customer) => (
                                <div key={customer.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-red-500">
                                            <AlertCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{customer.name}</p>
                                            <p className="text-xs text-red-600 font-medium">Stress Score: {customer.stressScore}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/customer/${customer.id}`}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-colors"
                                    >
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
