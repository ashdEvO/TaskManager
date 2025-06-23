import React, { useState, useEffect } from 'react';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.PROFILE);
        setName(res.data.name);
        setEmail(res.data.email);
        setProfileImage(res.data.profileImageUrl || '');
        setError(null);
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      let profileImageUrl = profileImage;
      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        const uploadRes = await axiosInstance.post(API_PATHS.UPLOAD_IMAGE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        profileImageUrl = uploadRes.data.imageUrl;
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (profileImageUrl) formData.append('profileImageUrl', profileImageUrl);
      await axiosInstance.put(API_PATHS.UPDATE_PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setPassword('');
      setNewImage(null);
      setProfileImage(profileImageUrl);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Profile</h2>
        {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded px-3 py-2 text-sm">Profile updated successfully!</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={newImage ? URL.createObjectURL(newImage) : profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
              />
            </label>
          </div>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            label="Full Name"
            placeholder="Jane Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            label="Email Address"
            placeholder="jane@example.com"
            type="email"
          />
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            label="New Password (leave blank to keep current)"
            placeholder="Min. 8 characters"
            type="password"
          />
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;