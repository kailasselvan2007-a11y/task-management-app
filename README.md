# TaskFlow - Modern Full-Stack Task Management Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react)
![NodeJS](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_+_Mongoose-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT_+_bcrypt-000000?logo=jsonwebtokens)

TaskFlow is a modern, responsive, and beginner-friendly full-stack task management application designed for productivity, deadline tracking, and prioritization. It is built using the MERN stack architecture with JWT authentication, password hashing with bcrypt, full CRUD operations, and multi-criteria filtering.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Local Setup](#-installation--local-setup)
  - [Option A: Unified Full-Stack Run](#option-a-unified-full-stack-run-recommended)
  - [Option B: Independent Frontend & Backend](#option-b-independent-frontend--backend)
- [MongoDB Setup](#-mongodb-setup)
- [Database Models](#-database-models)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Sample Test Account & Seeding](#-sample-test-account--seeding)
- [Screenshots & UI Showcase](#-screenshots--ui-showcase)
- [Deployment Instructions](#-deployment-instructions)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Backend Deployment (Render / Railway)](#backend-deployment-render--railway)
  - [Database Deployment (MongoDB Atlas)](#database-deployment-mongodb-atlas)
- [Future Enhancements](#-future-enhancements)

---

## 🌟 Project Overview

TaskFlow enables individuals and teams to organize tasks efficiently. With secure user authentication, every user is isolated to their private workspace. The dashboard provides at-a-glance metrics (Total Tasks, Pending, In Progress, Completed, and High Priority counts), completion rate progress tracking, and instantaneous multi-criteria searching, status filtering, and priority tagging.

---

## 🚀 Key Features

### 1. User Authentication & Authorization
- **Secure Registration & Login**: Users register with name, email, and password.
- **Password Security**: Passwords hashed using `bcrypt` (10 salt rounds) before persistence.
- **JSON Web Tokens (JWT)**: Stateless authentication via Bearer tokens with 7-day expiration.
- **Protected Routes**: Middleware verifies tokens on all task and profile endpoints.
- **Data Isolation**: Users only have access to their own tasks (enforced at database query level).
- **Personalized Header & Profile**: Displays logged-in user details with profile editing.

### 2. Full Task CRUD Operations
- **Create**: Add tasks with title, description, status (`Pending`, `In Progress`, `Completed`), priority (`Low`, `Medium`, `High`), and due date.
- **Read**: View tasks in either a **Card Grid** or a compact **Table View**.
- **Update**: Modal editor to modify any task field.
- **Delete**: Confirmation dialog to prevent accidental deletion.
- **Quick Complete**: 1-click checkbox to toggle completion state with visual strikethrough.
- **Quick Status Changer**: Dropdown on each card to change status instantly.

### 3. Analytics Dashboard
- 5 Real-Time Summary Cards:
  - **Total Tasks**
  - **Pending Tasks**
  - **In Progress Tasks**
  - **Completed Tasks** (with animated progress bar)
  - **High Priority Tasks**
- Interactive Stats: Clicking a stat card filters the dashboard by that category!

### 4. Advanced Search & Filtering
- **Keyword Search**: Instant search across titles and descriptions.
- **Status Filter**: Filter by `All`, `Pending`, `In Progress`, or `Completed`.
- **Priority Filter**: Filter by `All`, `Low`, `Medium`, or `High`.
- **Sorting Options**: Sort by Due Date (soonest/furthest), Creation Date (newest/oldest), or Alphabetical.
- **Clear Filters Button**: Appears dynamically when active filters are engaged.

### 5. Responsive Design & UI
- Fully responsive across desktop, laptop, tablet, and mobile screens.
- Mobile drawer navigation with hamburger toggle and floating action button.
- Clean color-coded priority and status ribbons with overdue badges.
- Toast notifications for success, error, and warning feedback.
- Empty-state illustrations with actionable CTAs.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Fast, modular component architecture |
| **Styling** | Tailwind CSS v4, Modern UI | Clean responsive layout & typography |
| **Icons** | Lucide React | Modern feather-based SVG icons |
| **Backend** | Node.js, Express.js | High-performance RESTful API |
| **Database** | MongoDB with Mongoose | Relational schemas, validation, hooks |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless Bearer token authorization |
| **Security** | `bcryptjs`, CORS, Env vars | Password hashing, sanitized responses |

---

## 📁 Folder Structure

```
task-management-app/
│
├── frontend/                     # Standalone React + Vite Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.tsx        # Top navigation with user dropdown
│   │   │   ├── Sidebar.tsx       # Navigation drawer with live counts
│   │   │   ├── StatsOverview.tsx # 5 metric cards
│   │   │   ├── FilterBar.tsx     # Search, filter, and sort controls
│   │   │   ├── TaskCard.tsx      # Interactive task card
│   │   │   ├── TaskTable.tsx     # Compact tabular view
│   │   │   ├── TaskModal.tsx     # Create / Edit task dialog
│   │   │   ├── DeleteModal.tsx   # Delete confirmation modal
│   │   │   ├── Toast.tsx         # Notification alerts
│   │   │   └── EmptyState.tsx    # Zero-data guidance component
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # Main dashboard command center
│   │   │   ├── Login.tsx         # Login page with demo autofill
│   │   │   ├── Register.tsx      # Account creation page
│   │   │   └── Profile.tsx       # User profile & password settings
│   │   ├── services/
│   │   │   └── api.ts            # Centralized API fetch client
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Global authentication state
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces & types
│   │   ├── App.tsx               # Root view router & layout
│   │   ├── main.tsx              # React DOM entry point
│   │   └── index.css             # Tailwind imports & styles
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                      # Standalone Express REST API
│   ├── config/
│   │   └── db.ts                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.ts     # Register & Login controllers
│   │   ├── taskController.ts     # Task CRUD controllers
│   │   └── userController.ts     # Profile management controllers
│   ├── middleware/
│   │   ├── authMiddleware.ts     # JWT Bearer verification
│   │   └── errorMiddleware.ts    # 404 & global error handler
│   ├── models/
│   │   ├── User.ts               # Mongoose User schema & bcrypt hook
│   │   └── Task.ts               # Mongoose Task schema
│   ├── routes/
│   │   ├── authRoutes.ts         # /api/auth routes
│   │   ├── taskRoutes.ts         # /api/tasks routes
│   │   └── userRoutes.ts         # /api/users routes
│   ├── services/
│   │   └── storage.ts            # Data access & fallback store
│   ├── seed.ts                   # Database seeding script
│   ├── server.ts                 # Standalone Express server
│   ├── package.json
│   └── .env.example
│
├── server.ts                     # Root full-stack server (Dev & Prod)
├── package.json                  # Root dependencies & scripts
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignored files
└── README.md                     # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (and in `backend/.env`):

```bash
# MongoDB Connection String (Atlas URI or local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority

# Secret key for signing and verifying JWT tokens
JWT_SECRET=your_super_secret_jwt_key_here

# Port for Backend Server
PORT=5000
```

---

## 💻 Installation & Local Setup

### Option A: Unified Full-Stack Run (Recommended)

Run both the Express backend and React Vite frontend together:

```bash
# 1. Install root dependencies
npm install

# 2. Start the unified full-stack server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

### Option B: Independent Frontend & Backend

You can run the backend and frontend in separate terminals:

#### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
# Backend starts at http://localhost:5000
```

#### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 🍃 MongoDB Setup

1. **MongoDB Atlas (Cloud)**:
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Create a free Shared Cluster (M0).
   - Go to **Database Access** -> Add a database user with password.
   - Go to **Network Access** -> Add IP address `0.0.0.0/0` (Allow access from anywhere).
   - Click **Connect** -> Choose **Drivers** -> Copy the connection URI:
     `mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority`
   - Paste into `.env` as `MONGODB_URI`.

2. **Local MongoDB**:
   - If running MongoDB locally, set:
     `MONGODB_URI=mongodb://localhost:27017/taskflow`

3. **Zero-Config Fallback**:
   - If `MONGODB_URI` is omitted or database is unreachable, TaskFlow includes an embedded in-memory persistence fallback with full bcrypt hashing and JWT tokens, allowing zero-friction demonstrations and tests!

---

## 🗄️ Database Models

### 1. User Model (`backend/models/User.ts`)
```typescript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
}
```
*Note: Passwords are automatically hashed via bcrypt pre-save hook.*

### 2. Task Model (`backend/models/Task.ts`)
```typescript
{
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  dueDate: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 📡 API Endpoints Reference

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user with name, email, password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |

### Tasks (Protected - Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for user (supports `?search=`, `?status=`, `?priority=`, `?sort=`) |
| `GET` | `/api/tasks/:id` | Get single task details |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details / status / priority |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/seed` | Seed realistic sample tasks for the user |

### User Profile (Protected - Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get current user's profile |
| `PUT` | `/api/users/profile` | Update user name, email, or change password |

---

## 🧪 Sample Test Account & Seeding

For testing without manual registration:
- **Email**: `demo@taskflow.com`
- **Password**: `password123`

You can also click the **"Fill Demo"** button on the Login page, or click **"Load Sample Tasks"** in the sidebar to populate realistic tasks instantly.

To run the standalone database seed script:
```bash
npm run seed
```

---

## 📸 Screenshots & UI Showcase

*Placeholder for college report / portfolio screenshots:*
- `[Screenshot: Dashboard with 5 Stat Cards and Filter Bar]`
- `[Screenshot: Responsive Card Grid View & Table View]`
- `[Screenshot: Create / Edit Task Modal Dialog]`
- `[Screenshot: Delete Confirmation Modal]`
- `[Screenshot: User Profile & Password Update Screen]`
- `[Screenshot: Mobile Responsive Drawer Navigation]`

---

## 🚢 Deployment Instructions

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and configure:
   - **Root Directory**: `frontend` (or `./`)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://taskflow-api.onrender.com`)

### Backend Deployment (Render / Railway)
1. In Render, select **"New Web Service"**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend` (or `./`)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A long random secret string
   - `PORT`: `5000`

---

## 🔮 Future Enhancements

- **Real-Time Collaboration**: Multi-user shared boards via Socket.IO.
- **Task Attachments**: Upload and attach PDF/image files to tasks via Cloudinary.
- **Email Reminders**: Automatic notifications for tasks due within 24 hours.
- **Kanban Board**: Drag-and-drop columns for Pending, In Progress, and Completed.
- **Dark Mode**: System-aware dark theme toggle.

---

## 📄 License
This project is licensed under the MIT License - open for educational and personal use.
