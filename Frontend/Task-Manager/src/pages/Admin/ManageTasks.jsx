import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import NavBar from '../../components/layouts/NavBar';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In progress', value: 'In progress' },
  { label: 'Completed', value: 'Completed' },
];

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

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
  }, [deleting, editTask]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axiosInstance.delete(API_PATHS.DELETE_TASK(id));
      setTasks(tasks => tasks.filter(t => t._id !== id && t.id !== id));
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
    } catch (err) {
      setEditError('Failed to update task.');
    }
    setEditLoading(false);
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <NavBar isAdmin={true} />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Tasks</h2>
        <div className="flex gap-2 mb-4">
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
                  <th className="text-left py-2 px-2">Assigned To</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="border-b border-slate-200 dark:border-gray-700">
                    <td className="py-2 px-2 text-gray-800 dark:text-gray-200 font-medium">{task.title}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'Pending' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          : task.status === 'In progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="py-2 px-2 text-blue-600 dark:text-blue-400 font-medium">
                      {Array.isArray(task.assignedTo)
                        ? task.assignedTo.map(u => u.name).join(', ')
                        : (task.assignedTo?.name || '-')}
                    </td>
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
        )}

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
      </div>
    </div>
  );
};

export default ManageTasks;