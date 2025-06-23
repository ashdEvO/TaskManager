import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Link } from 'react-router-dom';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In progress', value: 'In progress' },
  { label: 'Completed', value: 'Completed' },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.USER_TASKS);
        setTasks(res.data.tasks || []);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks.');
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
                  ${filter === f.value
                    ? 'bg-primary text-white border-primary dark:bg-blue-600 dark:border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 dark:bg-gray-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2">Title</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Priority</th>
                  <th className="text-left py-2 px-2">Due Date</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="border-b border-slate-200 dark:border-gray-700">
                    <td className="py-2 px-2">{task.title}</td>
                    <td className="py-2 px-2">{task.status}</td>
                    <td className="py-2 px-2">{task.priority}</td>
                    <td className="py-2 px-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="py-2 px-2">
                      <Link
                        to={`/user/task-details/${task._id}`}
                        className="px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition text-xs"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;