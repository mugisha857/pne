import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../api/api';
import { useAuth } from '../App';

export default function Layout() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-xl tracking-wide">🏢 DAB Enterprise</span>
            </div>
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/sales" className={linkClass}>Sales</NavLink>
              <NavLink to="/stockstatus" className={linkClass}>Stock Status</NavLink>
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors">
                  Reports ▾
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 hidden group-hover:block">
                  <NavLink to="/reports/sales" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Daily Sales Report</NavLink>
                  <NavLink to="/reports/stock" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Stock Status Report</NavLink>
                </div>
              </div>
              <span className="text-blue-200 text-sm ml-2">👤 {user?.username}</span>
              <button onClick={handleLogout} className="ml-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors">
                Logout
              </button>
            </div>
            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
            <NavLink to="/sales" className={linkClass} onClick={() => setMenuOpen(false)}>Sales</NavLink>
            <NavLink to="/stockstatus" className={linkClass} onClick={() => setMenuOpen(false)}>Stock Status</NavLink>
            <NavLink to="/reports/sales" className={linkClass} onClick={() => setMenuOpen(false)}>Daily Sales Report</NavLink>
            <NavLink to="/reports/stock" className={linkClass} onClick={() => setMenuOpen(false)}>Stock Status Report</NavLink>
            <button onClick={handleLogout} className="text-left px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium">Logout</button>
          </div>
        )}
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-blue-800 text-blue-200 text-center text-xs py-3">
        © 2026 DAB Enterprise Ltd – Business Web Solution
      </footer>
    </div>
  );
}
