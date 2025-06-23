# Task Manager Application

## High-Level Overview

### Backend (Node.js/Express)
- **Frameworks/Libraries:** Express, Mongoose, JWT, Multer, ExcelJS, bcryptjs
- **Main Features:**
  - User authentication (JWT-based)
  - Admin/user roles
  - Task CRUD (admin), task assignment, checklist, status updates
  - User and admin dashboards
  - Reports export (Excel)
- **Key Components:**
  - `server.js`: Main server entry, route setup
  - `controllers/`: Business logic for auth, tasks, users, reports
  - `models/`: Mongoose schemas for User and Task
  - `routes/`: API endpoints for auth, users, tasks, reports
  - `middlewares/`: Auth and file upload middleware

### Frontend (React + Vite)
- **Frameworks/Libraries:** React, React Router, Axios, Tailwind CSS, Recharts
- **Main Features:**
  - Login/Signup, profile management
  - Admin and user dashboards
  - Task creation, assignment, checklist, and status management
  - User management (admin)
  - Reports export (admin)
- **Key Components:**
  - `src/pages/`: Main pages (Admin/User/Auth)
  - `src/components/`: UI components (NavBar, Inputs, Layouts)
  - `src/utils/`: API paths, Axios instance, helpers

---

## Environment Setup

### Backend
1. **Install dependencies:**
   ```bash
   cd ./expressJS
   npm install
   ```
2. **Create a `.env` file** in `./expressJS/` with:
   ```env
   PORT=8000
   MONGO_URI=mongo_connection_string_should_be_pasted_here
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ADMIN_INVITE_TOKEN=your_admin_invite_token
   ```
3. **Start the backend server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend
1. **Install dependencies:**
   ```bash
   cd ./Frontend/Task-Manager
   npm install
   ```
2. **(Optional) Create a `.env` file** if you want to override the API base URL (default is `http://localhost:8000`).
3. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

---

## Environment Variables Used

### Backend
- `PORT`: Port for the Express server (default: 8000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `CLIENT_URL`: Allowed CORS origin (frontend URL)
- `ADMIN_INVITE_TOKEN`: Token to allow admin registration

### Frontend
- (Optional) You can use Vite's `.env` files to set `VITE_API_BASE` if you want to override the API base URL.

---

## Testing Instructions

### Backend
- Use Postman/cURL to test API endpoints (see below for examples)
- Run the backend and ensure MongoDB is running
- Check logs for errors

### Frontend
- Run the frontend dev server and navigate to `http://localhost:5173`
- Use the UI to test login, signup, task creation, assignment, etc.

---

## Sample API Usage (cURL/Postman)

### Auth
- **Register:**
  ```bash
  curl -X POST http://localhost:8000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
  ```
- **Login:**
  ```bash
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@example.com","password":"password123"}'
  ```

### Users (Admin)
- **Get all users:**
  ```bash
  curl -X GET http://localhost:8000/api/users \
    -H "Authorization: Bearer <admin_token>"
  ```
- **Get user by ID:**
  ```bash
  curl -X GET http://localhost:8000/api/users/<user_id> \
    -H "Authorization: Bearer <token>"
  ```

### Tasks
- **Create task (Admin):**
  ```bash
  curl -X POST http://localhost:8000/api/tasks \
    -H "Authorization: Bearer <admin_token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Task","description":"Desc","dueDate":"2024-12-31","assignedTo":["<user_id>"],"priority":"Medium"}'
  ```
- **Get all tasks:**
  ```bash
  curl -X GET http://localhost:8000/api/tasks \
    -H "Authorization: Bearer <token>"
  ```
- **Update task:**
  ```bash
  curl -X PUT http://localhost:8000/api/tasks/<task_id> \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Task"}'
  ```
- **Delete task (Admin):**
  ```bash
  curl -X DELETE http://localhost:8000/api/tasks/<task_id> \
    -H "Authorization: Bearer <admin_token>"
  ```

### Reports (Admin)
- **Export tasks report:**
  ```bash
  curl -X GET http://localhost:8000/api/reports/export/tasks \
    -H "Authorization: Bearer <admin_token>" \
    -o tasks_report.xlsx
  ```
- **Export users report:**
  ```bash
  curl -X GET http://localhost:8000/api/reports/export/users \
    -H "Authorization: Bearer <admin_token>" \
    -o users_report.xlsx
  ```

---

## Notes
- Make sure MongoDB is running locally or update `MONGO_URI` for your environment.
- Use the admin invite token to register the first admin user.
- All protected endpoints require a valid JWT token in the `Authorization` header.
- For file uploads (profile image), use multipart/form-data with the `/api/auth/upload-image` endpoint. 
