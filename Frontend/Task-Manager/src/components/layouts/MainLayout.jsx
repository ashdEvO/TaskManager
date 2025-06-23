import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';

const navLinks = [
  { to: '/user/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/user/tasks', label: 'My Tasks', icon: <FaTasks /> },
  { to: '/user/create-task', label: 'Create Task', icon: <FaPlus /> },
  { to: '/user/profile', label: 'Profile', icon: <FaUser /> },
];

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col py-8 px-4 justify-between">
        <div>
          <div className="mb-10 text-2xl font-bold text-primary dark:text-blue-400 text-center">Task Manager</div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors
                      ${location.pathname.startsWith(link.to)
                        ? 'bg-primary text-white dark:bg-blue-600'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mt-8 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 