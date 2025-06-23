import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ isAdmin }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow mb-6 p-4 flex gap-6 items-center">
      {isAdmin ? (
        <>
          <Link to="/admin/dashboard" className="font-bold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100">Dashboard</Link>
          <Link to="/admin/users" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">Manage Users</Link>
          <Link to="/admin/tasks" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">Manage Tasks</Link>
          <Link to="/admin/create-task" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">Create Task</Link>
          <Link to="/admin/reports" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">Reports</Link>
        </>
      ) : (
        <>
          <Link to="/user/dashboard" className="font-bold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100">Dashboard</Link>
          <Link to="/user/tasks" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">My Tasks</Link>
          <Link to="/user/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">Profile</Link>
        </>
      )}
      <button onClick={handleLogout} className="ml-auto px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition text-xs">Logout</button>
    </nav>
  );
};

export default NavBar;
