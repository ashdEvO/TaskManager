import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move fetchDashboard outside useEffect
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.USER_DASHBOARD);
      setStats(res.data.statistics);
      setCharts(res.data.charts);
      setRecentTasks(res.data.recentTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {stats ? `Welcome, ${stats.name || ''}` : 'Welcome!'}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-6">Here's a quick overview of your tasks.</p>
        <button
          onClick={fetchDashboard}
          className="mb-4 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Total Tasks</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.completedTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Completed</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-yellow-500 dark:text-yellow-300">{stats?.pendingTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Pending</span>
              </div>
            </div>

            {/* Charts (simple bar representation) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Task Distribution</h3>
                {charts && (
                  <ul>
                    {Object.entries(charts.taskDistribution).map(([status, count]) => (
                      <li key={status} className="flex items-center gap-2 mb-1">
                        <span className="w-24 capitalize">{status.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex-1 bg-slate-200 dark:bg-gray-700 h-3 rounded">
                          <div
                            className="bg-blue-500 h-3 rounded"
                            style={{ width: `${Math.min(100, (count / (stats?.totalTasks || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Task Priorities</h3>
                {charts && (
                  <ul>
                    {Object.entries(charts.taskPriorityLevels).map(([priority, count]) => (
                      <li key={priority} className="flex items-center gap-2 mb-1">
                        <span className="w-24 capitalize">{priority}</span>
                        <div className="flex-1 bg-slate-200 dark:bg-gray-700 h-3 rounded">
                          <div
                            className="bg-green-500 h-3 rounded"
                            style={{ width: `${Math.min(100, (count / (stats?.totalTasks || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Recent Tasks Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">Recent Tasks</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Priority</th>
                      <th className="text-left py-2 px-2">Due Date</th>
                      <th className="text-left py-2 px-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => (
                      <tr key={task._id} className="border-b border-slate-200 dark:border-gray-700">
                        <td className="py-2 px-2">{task.title}</td>
                        <td className="py-2 px-2">{task.status}</td>
                        <td className="py-2 px-2">{task.priority}</td>
                        <td className="py-2 px-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                        <td className="py-2 px-2">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;