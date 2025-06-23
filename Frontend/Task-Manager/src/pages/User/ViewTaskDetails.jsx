import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [savingChecklist, setSavingChecklist] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.TASK_BY_ID(id));
        setTask(res.data);
        setChecklist(res.data.todoChecklist || []);
        setError(null);
      } catch (err) {
        setError('Failed to load task details.');
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const handleChecklistChange = (idx) => {
    setChecklist(cl => cl.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item));
  };

  const handleSaveChecklist = async () => {
    setSavingChecklist(true);
    setSuccess(null);
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_CHECKLIST(id), { todoChecklist: checklist });
      setSuccess('Checklist updated!');
    } catch (err) {
      setError('Failed to update checklist.');
    }
    setSavingChecklist(false);
  };

  const handleStatusChange = async (newStatus) => {
    setSavingStatus(true);
    setSuccess(null);
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_STATUS(id), { status: newStatus });
      setTask(prev => ({ ...prev, status: newStatus }));
      setSuccess('Status updated!');
    } catch (err) {
      setError('Failed to update status.');
    }
    setSavingStatus(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Details</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : task ? (
          <>
            <div className="mb-4">
              <div className="font-semibold">Title:</div>
              <div>{task.title}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold">Description:</div>
              <div>{task.description}</div>
            </div>
            <div className="mb-4 flex gap-4">
              <div>
                <div className="font-semibold">Status:</div>
                <div>{task.status}</div>
              </div>
              <div>
                <div className="font-semibold">Priority:</div>
                <div>{task.priority}</div>
              </div>
              <div>
                <div className="font-semibold">Due Date:</div>
                <div>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Checklist:</div>
              {checklist.length === 0 ? (
                <div className="text-slate-500">No checklist items.</div>
              ) : (
                <ul className="mb-2">
                  {checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={!!item.completed}
                        onChange={() => handleChecklistChange(idx)}
                        className="accent-primary"
                      />
                      <span className={item.completed ? 'line-through text-slate-500' : ''}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleSaveChecklist}
                className="px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition text-xs"
                disabled={savingChecklist}
              >
                {savingChecklist ? 'Saving...' : 'Save Checklist'}
              </button>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Update Status:</div>
              <div className="flex gap-2">
                {['Pending', 'In progress', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition-colors
                      ${task.status === status
                        ? 'bg-primary text-white border-primary dark:bg-blue-600 dark:border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 dark:bg-gray-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
                    disabled={savingStatus || task.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ViewTaskDetails;