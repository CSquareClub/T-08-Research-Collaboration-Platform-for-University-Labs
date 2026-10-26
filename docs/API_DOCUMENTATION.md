# API Documentation

All APIs use JSON and standard HTTP verbs. Authentication via JWT (Bearer token) in `Authorization` header.

## Authentication Endpoints

| Method | Endpoint              | Auth   | Description                                            |
|--------|-----------------------|--------|--------------------------------------------------------|
| POST   | `/api/auth/register`  | Public | Register new user (body: name, email, password, role). |
| POST   | `/api/auth/login`     | Public | Login (body: email, password). Returns `{ token }`.    |
| POST   | `/api/auth/google`    | Public | Google OAuth callback (returns JWT).                   |

## User Profile Endpoints

| Method | Endpoint              | Auth   | Description                                            |
|--------|-----------------------|--------|--------------------------------------------------------|
| GET    | `/api/users/me`       | Auth   | Get current user profile.                              |
| PUT    | `/api/users/me`       | Auth   | Update current profile (skills, interests, photo).     |
| PUT    | `/api/users/:id/role` | Admin  | Change user role (admin only).                         |
| GET    | `/api/users/:id`      | Auth   | Get user profile (anyone or admin viewing).            |

## Project Registry Endpoints

| Method | Endpoint                            | Auth       | Description                                                 |
|--------|-------------------------------------|------------|-------------------------------------------------------------|
| GET    | `/api/projects`                     | Auth       | List/search projects (query params: q, domain, skills).     |
| POST   | `/api/projects`                     | Faculty/PI | Create a project.                                           |
| GET    | `/api/projects/:id`                 | Auth       | Get project details.                                        |
| PUT    | `/api/projects/:id`                 | Owner      | Update project (owner only).                                |
| DELETE | `/api/projects/:id`                 | Owner/Admin| Delete project.                                             |
| POST   | `/api/projects/:id/milestones`      | Owner      | Add milestone to project.                                   |
| PUT    | `/api/projects/:id/milestones/:mid` | Auth       | Update milestone progress or approval (by team or owner).   |

## Collaboration Endpoints

| Method | Endpoint                    | Auth | Description                                                |
|--------|-----------------------------|------|------------------------------------------------------------|
| GET    | `/api/collab-requests`      | Auth | List current user’s sent/received requests.                |
| POST   | `/api/collab-requests`      | Auth | Send collaboration request (body: projectId, message).     |
| PUT    | `/api/collab-requests/:id`  | Auth | Update request status (accept/reject by project owner).    |

## Datasets & Publications

| Method | Endpoint              | Auth | Description                                                |
|--------|-----------------------|------|------------------------------------------------------------|
| GET    | `/api/datasets`       | Auth | List datasets (filter by project, owner, public/private).  |
| POST   | `/api/datasets`       | Auth | Upload new dataset (multipart form, description, access).  |
| PUT    | `/api/datasets/:id`   | Owner| Update dataset details or upload new version.              |
| GET    | `/api/publications`   | Auth | List publications (filter by project/author).              |
| POST   | `/api/publications`   | Auth | Add a publication (title, doi, pdfUrl, projectId).         |
