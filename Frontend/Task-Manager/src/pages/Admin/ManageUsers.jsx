import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import NavBar from '../../components/layouts/NavBar';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.USERS);
        setUsers(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load users.');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleViewDetails = async (userId) => {
    setSelectedUser(userId);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const res = await axiosInstance.get(API_PATHS.USER_BY_ID(userId));
      setUserDetails(res.data);
    } catch (err) {
      setDetailsError('Failed to load user details.');
    }
    setDetailsLoading(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setDetailsError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <NavBar isAdmin={true} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Users</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Email</th>
                  <th className="text-left py-2 px-2">Pending</th>
                  <th className="text-left py-2 px-2">In Progress</th>
                  <th className="text-left py-2 px-2">Completed</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-200 dark:border-gray-700">
                    <td className="py-2 px-2 text-gray-800 dark:text-gray-200 font-medium">{user.name}</td>
                    <td className="py-2 px-2 text-blue-600 dark:text-blue-400">{user.email}</td>
                    <td className="py-2 px-2 text-center text-orange-600 dark:text-orange-400 font-semibold">{user.pendingTasks ?? '-'}</td>
                    <td className="py-2 px-2 text-center text-blue-600 dark:text-blue-400 font-semibold">{user.inProgressTasks ?? '-'}</td>
                    <td className="py-2 px-2 text-center text-green-600 dark:text-green-400 font-semibold">{user.completedTasks ?? '-'}</td>
                    <td className="py-2 px-2">
                      <button
                        className="px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition text-xs"
                        onClick={() => handleViewDetails(user._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              {detailsLoading ? (
                <div>Loading...</div>
              ) : detailsError ? (
                <div className="text-red-500 mb-2">{detailsError}</div>
              ) : userDetails ? (
                <div>
                  <h3 className="text-xl font-bold mb-2">{userDetails.name}</h3>
                  <p className="mb-1"><span className="font-semibold">Email:</span> {userDetails.email}</p>
                  <p className="mb-1"><span className="font-semibold">Role:</span> {userDetails.role}</p>
                  {/* Add more user details here if needed */}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;