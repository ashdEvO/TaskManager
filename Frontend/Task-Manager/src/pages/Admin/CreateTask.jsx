import React, { useState, useEffect } from 'react';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import NavBar from '../../components/layouts/NavBar';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');
  const [checklist, setChecklist] = useState([{ text: '' }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState('Medium');

  const handleChecklistChange = (idx, value) => {
    setChecklist(cl => cl.map((item, i) => i === idx ? { ...item, text: value } : item));
  };

  const addChecklistItem = () => setChecklist(cl => [...cl, { text: '' }]);
  const removeChecklistItem = idx => setChecklist(cl => cl.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(
        API_PATHS.USER_TASKS,
        {
          title,
          description,
          dueDate: due,
          checklist,
          assignedTo,
          priority,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setTitle('');
      setDescription('');
      setDue('');
      setChecklist([{ text: '' }]);
      setAssignedTo([]);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create task. Please try again.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get(API_PATHS.USERS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <NavBar isAdmin={true} />
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h2>
        {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded px-3 py-2 text-sm">Task created successfully!</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            label="Title"
            placeholder="Task title"
            type="text"
          />
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded px-4 py-3 mt-2 border border-slate-200 dark:border-slate-700 outline-none resize-none min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Due Date</label>
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded px-4 py-3 mt-2 border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Checklist</label>
            <div className="space-y-2 mt-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.text}
                    onChange={e => handleChecklistChange(idx, e.target.value)}
                    placeholder={`Checklist item ${idx + 1}`}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white rounded px-3 py-2 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                  {checklist.length > 1 && (
                    <button type="button" onClick={() => removeChecklistItem(idx)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addChecklistItem} className="mt-2 px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700 text-sm">+ Add Item</button>
            </div>
          </div>
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Assigned To</label>
            <select
              multiple
              value={assignedTo}
              onChange={e => setAssignedTo(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded px-4 py-3 mt-2 border border-slate-200 dark:border-slate-700 outline-none"
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full rounded border px-2 py-1 mt-1"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;