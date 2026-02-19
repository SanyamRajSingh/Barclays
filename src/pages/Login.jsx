import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">CATALYST</h1>
                    <p className="text-slate-500 mt-2">Proactive Risk Management Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="admin@catalyst.com"
                                defaultValue="risk.officer@barclays.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="••••••••"
                                defaultValue="securepassword"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all transform active:scale-95 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    <p>© 2026 Cosmic Codex. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
