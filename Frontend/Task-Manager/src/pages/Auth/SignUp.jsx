import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Upload image if present
      let profileImageUrl = undefined;
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        const uploadRes = await axiosInstance.post(API_PATHS.UPLOAD_IMAGE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        profileImageUrl = uploadRes.data.imageUrl;
      }
      await axiosInstance.post(API_PATHS.REGISTER, {
        name,
        email,
        password,
        adminInviteToken: adminInviteToken || undefined,
        profileImageUrl,
      });
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Sign up failed. Please try again.'
      );
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center mx-auto mt-12 md:mt-0">
        <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">Create your account</h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 mb-6">Sign up to get started with Task Manager</p>
        {error && (
          <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-sm">{error}</div>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            value={name}
            onChange={({ target }) => setName(target.value)}
            label="Full Name"
            placeholder="Jane Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="jane@example.com"
            type="email"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min. 8 characters"
            type="password"
          />
          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
          />
          <Input
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            label="Admin Invite Token (optional)"
            placeholder="Enter admin invite token if you have one"
            type="text"
          />
          <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600 mt-2"
            />
            {profileImage && (
              <div className="mt-2 flex items-center gap-2">
                <img src={URL.createObjectURL(profileImage)} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{profileImage.name}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-700 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="text-primary dark:text-blue-400 hover:underline">Log in</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;