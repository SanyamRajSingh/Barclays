import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interventions } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, ShieldAlert, RefreshCw, AlertCircle } from 'lucide-react';

const CustomerDetail = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [appliedInterventions, setAppliedInterventions] = useState([]);

    const fetchCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/customer/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error("Customer not found");
                throw new Error("Failed to fetch customer details");
            }
            const data = await response.json();
            setCustomer(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const handleApplyIntervention = () => {
        if (selectedIntervention) {
            const newAction = {
                ...selectedIntervention,
                date: new Date().toLocaleDateString(),
                status: 'Applied'
            };
            setAppliedInterventions([newAction, ...appliedInterventions]);
            setSelectedIntervention(null);
            alert(`Applied intervention: ${selectedIntervention.type}`);
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return 'text-red-600 bg-red-100 border-red-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'Low': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="animate-spin text-blue-500" size={32} />
                    <p className="text-slate-500">Loading customer details...</p>
                </div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="max-w-6xl mx-auto mt-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex-1">
                        <div className="flex items-center gap-2 font-bold mb-2">
                            <AlertCircle size={20} />
                            Error
                        </div>
                        {error || "Customer not found"}
                    </div>
                </div>
            </div>
        );
    }

    // Generate chart data from history array
    const chartData = customer.history ? customer.history.map((score, index) => ({
        day: `Day ${index + 1}`,
        score
    })) : [];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{customer.name}</h1>
                    <p className="text-slate-500 text-sm">ID: {customer.id}</p>
                </div>
                <div className={`ml-auto px-4 py-2 rounded-full border font-bold flex items-center gap-2 ${getRiskColor(customer.riskLevel)}`}>
                    <ShieldAlert size={18} />
                    {customer.riskLevel} Risk
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 text-sm">Stress Score</p>
                            <p className={`text-3xl font-bold mt-1 ${customer.stressScore > 75 ? 'text-red-600' : 'text-slate-800'}`}>
                                {customer.stressScore}/100
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 text-sm">Total Exposure</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{customer.totalExposure}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 text-sm">Active Loans</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{customer.loans}</p>
                        </div>
                    </div>

                    {/* Stress Trend Chart */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Stress Score Trend (7 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" hide />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Risk Contributing Factors</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">Late Repayment Frequency</span>
                                <span className="text-red-500 font-medium">High</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">Market Volatility Impact</span>
                                <span className="text-yellow-500 font-medium">Medium</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">Operational Cash Flow</span>
                                <span className="text-red-500 font-medium">Negative</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Intervention Engine */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <CheckCircle className="text-blue-500" />
                            Intervention Engine
                        </h3>

                        <div className="space-y-4 mb-8">
                            <label className="block text-sm font-medium text-slate-700">Recommended Actions</label>
                            <div className="space-y-2">
                                {interventions.map((intervention) => (
                                    <button
                                        key={intervention.id}
                                        onClick={() => setSelectedIntervention(intervention)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${selectedIntervention?.id === intervention.id
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-800">{intervention.type}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${intervention.effectiveness === 'High' ? 'bg-green-100 text-green-700' :
                                                intervention.effectiveness === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {intervention.effectiveness} Impact
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{intervention.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleApplyIntervention}
                            disabled={!selectedIntervention}
                            className={`w-full py-3 rounded-lg font-bold transition-colors ${selectedIntervention
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Apply Selected Action
                        </button>

                        {/* Action History */}
                        <div className="mt-8">
                            <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Action History</h4>
                            {appliedInterventions.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">No interventions applied yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {appliedInterventions.map((action, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <Clock size={16} className="mt-1 text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{action.type}</p>
                                                <p className="text-xs text-slate-500">{action.date} - {action.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
