import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from "react-router-dom";
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      console.log('Navigating to dashboard...');
      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center mx-auto mt-12 md:mt-0">
        <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">Welcome back</h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 mb-6">Please enter your details to log in</p>
        {error && (
          <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-sm">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min. 8 characters"
            type="password"
          />
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-primary text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-slate-700 dark:text-slate-300">Not signed up? </span>
          <button
            className="text-primary dark:text-blue-400 font-semibold hover:underline ml-1"
            onClick={() => navigate('/signup')}
          >
            Sign up here
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;