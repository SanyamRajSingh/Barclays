import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Bell } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Customers', path: '/customers' }, // Placeholder for customer list if needed
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400 tracking-wider">CATALYST</h1>
                <p className="text-xs text-slate-400 mt-1">Proactive Risk Management</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg w-full transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
            <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
            <div className="flex items-center gap-6">
                <button className="relative text-slate-500 hover:text-slate-700">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        JD
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-slate-700">John Doe</p>
                        <p className="text-xs text-slate-500">Risk Manager</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Layout = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Sidebar />
            <Header />
            <main className="pl-64 pt-16 min-h-screen">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
