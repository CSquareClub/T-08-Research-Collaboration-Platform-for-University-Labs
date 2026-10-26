<h1 align="center">
  🔬 ResearchHub
</h1>

<p align="center">
  <strong>A Research Collaboration Platform for University Labs</strong><br/>
  Connecting students, faculty, and principal investigators to discover, manage, and collaborate on research projects.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Cloudinary-File_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Seeding the Database](#seeding-the-database)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Pages & Routes](#-pages--routes)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧪 About the Project

**ResearchHub** is a full-stack MERN web platform that centralises university research collaboration. It enables:

- **Students** to discover open research projects that match their skills and send collaboration requests.
- **Faculty & Principal Investigators (PIs)** to create and manage projects, review applications, track milestones, and share publications.
- **Administrators** to oversee departmental activity, manage user roles, and monitor platform health.

The platform provides advanced project search, role-based access control (RBAC), dataset versioning with cloud file storage, real-time notifications via WebSockets, and Google OAuth integration.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password registration & login with JWT. Google OAuth ("Sign in with Google") supported. |
| 👥 **Role-Based Access Control** | Four roles: `Student`, `Faculty`, `PI`, `Admin` — each with distinct permissions. |
| 📋 **Project Registry** | Faculty/PIs create and manage research projects with domain, required skills, team size, and status. |
| 🔍 **Advanced Search** | Full-text search with filters by domain, skills, department, and status using MongoDB text indexes. |
| 🤝 **Collaboration Requests** | Students send join requests with a message; project owners accept or reject via a dedicated requests page. |
| 📊 **Milestone Tracker** | Projects include embedded milestones (title, deadline, 0–100% progress, approval status). |
| 📁 **Dataset Library** | Upload datasets (CSV, PDF, images) to Cloudinary with public/private access and version history. |
| 📚 **Publication Records** | Record research publications with DOI, authors, PDF link, and project associations. |
| 🔔 **Real-Time Notifications** | Socket.IO-powered live notifications for collaboration events (new requests, acceptances, etc.). |
| 🛡️ **Security** | Helmet headers, rate limiting (100 req/15 min), bcrypt password hashing, and input validation via `express-validator`. |
| ☁️ **Cloud Storage** | Cloudinary integration via `multer-storage-cloudinary` for profile photos and dataset files. |

---

## 🛠 Tech Stack

### Frontend (Client)

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **Socket.IO Client 4** | Real-time WebSocket communication |
| **@react-oauth/google** | Google OAuth sign-in |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Backend (Server)

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 9** | Database & ODM |
| **Socket.IO 4** | Real-time WebSocket server |
| **jsonwebtoken** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary + Multer** | Cloud file storage & upload handling |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Input validation & sanitization |
| **passport-google-oauth20** | Google OAuth strategy |
| **dotenv** | Environment variable management |
| **nodemon** | Dev server auto-restart |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│              React SPA (Vite) + Socket.IO Client                 │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────▼─────────────────────────────────────────┐
│                   Express API Server (Node.js)                   │
│   Routes → Controllers → Mongoose Models → MongoDB Atlas         │
│   Socket.IO Server   │   Cloudinary SDK   │   JWT Middleware     │
└──────────┬─────────────────────┬────────────────────┬────────────┘
           │                     │                    │
    ┌──────▼──────┐    ┌─────────▼────────┐  ┌───────▼──────────┐
    │  MongoDB    │    │   Cloudinary     │  │  Google OAuth    │
    │  Atlas      │    │  (File Storage)  │  │  (Identity)      │
    └─────────────┘    └──────────────────┘  └──────────────────┘
```

**Request Flow:**
1. Client makes HTTP requests to `VITE_API_URL` with `Authorization: Bearer <JWT>`.
2. Express routes pass through JWT middleware → role-check middleware → controllers.
3. Controllers interact with Mongoose models and return JSON responses.
4. Socket.IO emits real-time events to connected clients (each user joins a room by `userId`).

---

## 📁 Project Structure

```
T-08-Research-Collaboration-Platform-for-University-Labs/
├── docs/
│   ├── API_DOCUMENTATION.md        # Full API endpoint reference
│   └── DATABASE_SCHEMA.md          # MongoDB collection schemas
├── src/
│   ├── client/                     # React frontend (Vite)
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   └── src/
│   │       ├── main.jsx            # App entry point
│   │       ├── App.jsx             # Router & layout
│   │       ├── index.css           # Global styles
│   │       ├── components/
│   │       │   ├── Navbar.jsx      # Top navigation bar
│   │       │   └── ProjectCard.jsx # Reusable project card component
│   │       ├── context/
│   │       │   └── AuthContext.jsx # Global auth state (token, user)
│   │       ├── pages/
│   │       │   ├── Login.jsx       # Login page
│   │       │   ├── Register.jsx    # Registration page
│   │       │   ├── Dashboard.jsx   # Role-specific home dashboard
│   │       │   ├── Projects.jsx    # Project listing & search
│   │       │   ├── ProjectDetail.jsx # Project detail, milestones, requests
│   │       │   ├── CreateProject.jsx # New project form (Faculty/PI)
│   │       │   ├── Profile.jsx     # User profile editor
│   │       │   ├── Requests.jsx    # Sent & received collab requests
│   │       │   ├── Datasets.jsx    # Dataset library & upload
│   │       │   └── Publications.jsx # Publication records
│   │       └── utils/              # Shared utility helpers
│   │
│   └── server/                     # Node.js + Express backend
│       ├── server.js               # App entry point, Socket.IO setup
│       ├── seed.js                 # Database seeding script
│       ├── .env.example            # Environment variable template
│       ├── package.json
│       ├── middleware/
│       │   └── auth.js             # JWT verification & role-check middleware
│       ├── models/
│       │   ├── User.js
│       │   ├── Project.js
│       │   ├── CollaborationRequest.js
│       │   ├── Dataset.js
│       │   └── Publication.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── users.controller.js
│       │   ├── projects.controller.js
│       │   ├── collaboration.controller.js
│       │   ├── datasets.controller.js
│       │   └── publications.controller.js
│       └── routes/
│           ├── auth.routes.js
│           ├── users.routes.js
│           ├── projects.routes.js
│           ├── collaboration.routes.js
│           ├── datasets.routes.js
│           └── publications.routes.js
├── tests/                          # Test suite (to be populated)
├── PRD.md                          # Full Product Requirements Document
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** `v18+` — [Download](https://nodejs.org/)
- **npm** `v9+` (comes with Node.js)
- **MongoDB** — Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) or a local instance
- **Cloudinary Account** — [Sign up free](https://cloudinary.com/) for file storage

---

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/Pratik-kr21/T-08-Research-Collaboration-Platform-for-University-Labs.git
cd T-08-Research-Collaboration-Platform-for-University-Labs
```

**2. Install server dependencies:**

```bash
cd src/server
npm install
```

**3. Install client dependencies:**

```bash
cd ../client
npm install
```

---

### Environment Variables

**Backend** — copy the example file and fill in your values:

```bash
cp src/server/.env.example src/server/.env
```

`src/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/researchhub
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend** — create `src/client/.env` (Vite requires the `VITE_` prefix):

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files to version control.** They are already covered by `.gitignore`.

---

### Running the App

Open **two terminals** — one for the server, one for the client.

**Terminal 1 — Start the backend:**

```bash
cd src/server
npm run dev       # nodemon auto-reloads on file changes
```

The API will be available at `http://localhost:5000`.

**Terminal 2 — Start the frontend:**

```bash
cd src/client
npm run dev       # Vite dev server with HMR
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

---

### Seeding the Database

To populate MongoDB with sample data for development and testing:

```bash
cd src/server
npm run seed
```

This runs `seed.js` and inserts demo users, projects, datasets, and publications.

---

## 📡 API Reference

Full documentation is in [`docs/API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md).

All requests (except public routes) require:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register with name, email, password, role |
| `POST` | `/api/auth/login` | Public | Login — returns `{ token }` |
| `POST` | `/api/auth/google` | Public | Google OAuth sign-in |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/me` | Auth | Get own profile |
| `PUT` | `/api/users/me` | Auth | Update profile, skills, photo |
| `GET` | `/api/users/:id` | Auth | View another user's profile |
| `PUT` | `/api/users/:id/role` | Admin | Change a user's role |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Auth | List / search projects |
| `POST` | `/api/projects` | Faculty/PI | Create a new project |
| `GET` | `/api/projects/:id` | Auth | Get project details |
| `PUT` | `/api/projects/:id` | Owner | Update project |
| `DELETE` | `/api/projects/:id` | Owner/Admin | Delete project |
| `POST` | `/api/projects/:id/milestones` | Owner | Add a milestone |
| `PUT` | `/api/projects/:id/milestones/:mid` | Auth | Update milestone progress |

**Search Query Parameters** (for `GET /api/projects`):

| Param | Example | Description |
|---|---|---|
| `q` | `?q=machine+learning` | Full-text keyword search |
| `domain` | `?domain=AI` | Filter by research domain |
| `skills` | `?skills=Python,React` | Filter by required skills |
| `status` | `?status=Open` | Filter by status (`Open`, `Ongoing`, `Closed`, `Completed`) |

### Collaboration Requests

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/collaboration-requests` | Auth | List sent & received requests |
| `POST` | `/api/collaboration-requests` | Auth | Send a join request |
| `PUT` | `/api/collaboration-requests/:id` | Auth | Accept or reject a request |

### Datasets & Publications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/datasets` | Auth | List datasets |
| `POST` | `/api/datasets` | Auth | Upload a dataset (multipart/form-data) |
| `PUT` | `/api/datasets/:id` | Owner | Update details or add a new version |
| `GET` | `/api/publications` | Auth | List publications |
| `POST` | `/api/publications` | Auth | Add a publication record |

---

## 🗄 Database Schema

Full schema documentation is in [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md).

### Collections Overview

| Collection | Key Fields |
|---|---|
| **Users** | `name`, `email`, `role`, `department`, `skills[]`, `interests[]`, `profilePicUrl` |
| **Projects** | `title`, `abstract`, `domain`, `status`, `requiredSkills[]`, `owner`, `collaborators[]`, `milestones[]` |
| **CollaborationRequests** | `fromUser`, `toUser`, `projectId`, `status` (Pending / Accepted / Rejected), `message` |
| **Datasets** | `title`, `owner`, `fileUrl`, `access` (public / private), `versions[]` |
| **Publications** | `title`, `doi`, `authors[]`, `publicationDate`, `pdfUrl`, `projectId` |

### Milestone Sub-Schema (embedded in Projects)

```json
{
  "title": "Literature Review",
  "deadline": "2026-09-01",
  "progress": 30,
  "approved": false
}
```

---

## 🔑 User Roles & Permissions

| Permission | Student | Faculty | PI | Admin |
|---|:---:|:---:|:---:|:---:|
| View projects & profiles | ✅ | ✅ | ✅ | ✅ |
| Send collaboration request | ✅ | ✅ | ✅ | ✅ |
| Upload datasets | ✅ | ✅ | ✅ | ✅ |
| Add publications | ❌ | ✅ | ✅ | ✅ |
| Create projects | ❌ | ✅ | ✅ | ✅ |
| Edit / delete own project | ❌ | ✅ | ✅ | ✅ |
| Accept / reject requests | ❌ | ✅ | ✅ | ✅ |
| Approve milestones | ❌ | ✅ | ✅ | ✅ |
| Change any user's role | ❌ | ❌ | ❌ | ✅ |
| Delete any project | ❌ | ❌ | ❌ | ✅ |

---

## 🗺 Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Role-based dashboard | Auth |
| `/projects` | Browse & search all projects | Auth |
| `/projects/new` | Create a new project | Auth (Faculty / PI) |
| `/projects/:id` | Project detail, milestones, requests | Auth |
| `/profile` | View & edit own profile | Auth |
| `/requests` | Manage sent & received collaboration requests | Auth |
| `/datasets` | Dataset library & upload | Auth |
| `/publications` | Publication records | Auth |

All authenticated routes redirect unauthenticated users to `/login`.

---

## 🤝 Contributing

We welcome contributions! Please read the [CUSoC Contributor's Guidelines](./CUSoC%20Contributor's%20Guidelines.pdf) before getting started.

**Steps to contribute:**

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** with a clear, conventional message:
   ```bash
   git commit -m "feat: add skill-based project matching"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch.

Please ensure your code:
- Follows the existing code style.
- Does **not** commit any `.env` or secret files.
- Passes the linter: `npm run lint` (inside `src/client`).

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the CUSoC Research Community
</p>
