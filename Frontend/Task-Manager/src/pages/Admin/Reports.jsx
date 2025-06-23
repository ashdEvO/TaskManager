import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import NavBar from '../../components/layouts/NavBar';

const Reports = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async (type) => {
    setLoading(true);
    setMessage(null);
    try {
      const url = type === 'tasks' ? API_PATHS.EXPORT_TASKS_REPORT : API_PATHS.EXPORT_USERS_REPORT;
      const res = await axiosInstance.get(url, {
        responseType: 'blob',
      });
      // Create a link to download the file
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type}-report.${res.headers['content-type'].includes('csv') ? 'csv' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage(`Exported ${type} report successfully!`);
    } catch (err) {
      setMessage('Failed to export report.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <NavBar isAdmin={true} />
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300">Export all tasks or users as Excel files for reporting and analysis.</p>
        {message && <div className="mb-4 text-blue-600 dark:text-blue-400">{message}</div>}
        <div className="flex gap-4">
          <button
            onClick={() => handleExport('tasks')}
            className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Tasks'}
          </button>
          <button
            onClick={() => handleExport('users')}
            className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Users'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports; 