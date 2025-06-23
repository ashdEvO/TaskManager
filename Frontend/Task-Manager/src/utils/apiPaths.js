export const API_BASE = 'http://localhost:8000';

export const API_PATHS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  UPDATE_PROFILE: '/api/auth/profile',
  UPLOAD_IMAGE: '/api/auth/upload-image',

  // Users (admin)
  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`,

  // Tasks
  USER_DASHBOARD: '/api/tasks/user-dashboard-data',
  ADMIN_DASHBOARD: '/api/tasks/dashboard-data',
  USER_TASKS: '/api/tasks',
  TASK_BY_ID: (id) => `/api/tasks/${id}`,
  CREATE_TASK: '/api/tasks',
  UPDATE_TASK: (id) => `/api/tasks/${id}`,
  DELETE_TASK: (id) => `/api/tasks/${id}`,
  UPDATE_TASK_STATUS: (id) => `/api/tasks/${id}/status`,
  UPDATE_TASK_CHECKLIST: (id) => `/api/tasks/${id}/todo`,

  // Reports (admin)
  EXPORT_TASKS_REPORT: '/api/reports/export/tasks',
  EXPORT_USERS_REPORT: '/api/reports/export/users',
};
