import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/layouts/NavBar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch dashboard and all tasks
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN_DASHBOARD);
      setStats(res.data.statistics);
      setCharts(res.data.charts);
      // Fetch all tasks for the table
      const tasksRes = await axiosInstance.get(API_PATHS.USER_TASKS);
      setTasks(tasksRes.data.tasks || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axiosInstance.delete(API_PATHS.DELETE_TASK(id));
      setTasks(tasks => tasks.filter(t => t._id !== id && t.id !== id));
      fetchDashboard();
    } catch (err) {
      setError('Failed to delete task.');
    }
    setDeleting(null);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK(editTask._id), {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        dueDate: editTask.dueDate,
        todoChecklist: editTask.todoChecklist,
        attachments: editTask.attachments,
        assignedTo: editTask.assignedTo,
      });
      setEditTask(null);
      fetchDashboard();
    } catch (err) {
      setEditError('Failed to update task.');
    }
    setEditLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-0">
      <NavBar isAdmin={true} />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-6">Overview of your platform.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Total Tasks</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-yellow-500 dark:text-yellow-300">{stats?.pendingTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Pending</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.completedTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Completed</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.overdueTasks ?? '-'}</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1">Overdue</span>
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

            {/* Full Task Table with Edit/Delete */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-8">
              <h3 className="font-semibold mb-2">All Tasks</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Priority</th>
                      <th className="text-left py-2 px-2">Due Date</th>
                      <th className="text-left py-2 px-2">Assigned To</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id} className="border-b border-slate-200 dark:border-gray-700">
                        <td className="py-2 px-2">{task.title}</td>
                        <td className="py-2 px-2">{task.status}</td>
                        <td className="py-2 px-2">{task.priority}</td>
                        <td className="py-2 px-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                        <td className="py-2 px-2">{Array.isArray(task.assignedTo) ? task.assignedTo.map(u => u.name).join(', ') : (task.assignedTo?.name || '-')}</td>
                        <td className="py-2 px-2">
                          <button
                            className="px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition text-xs mr-2"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition text-xs"
                            onClick={() => handleDelete(task._id)}
                            disabled={deleting === task._id}
                          >
                            {deleting === task._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Task Modal */}
            {editTask && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setEditTask(null)}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4">Edit Task</h3>
                  {editError && <div className="mb-2 text-red-500">{editError}</div>}
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editTask.title}
                        onChange={handleEditChange}
                        className="w-full rounded border px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editTask.description}
                        onChange={handleEditChange}
                        className="w-full rounded border px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        name="priority"
                        value={editTask.priority}
                        onChange={handleEditChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={editTask.dueDate ? editTask.dueDate.split('T')[0] : ''}
                        onChange={handleEditChange}
                        className="w-full rounded border px-2 py-1"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition"
                      disabled={editLoading}
                    >
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;