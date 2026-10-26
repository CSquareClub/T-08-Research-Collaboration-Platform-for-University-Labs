# System Architecture & Technical Specifications

**Project:** ResearchHub (CUSoC T-08)  
**Document:** Architecture Design & Technical Specifications  
**Version:** 1.0  

---

## 1. High-Level Architectural Diagram

ResearchHub follows a modern 3-tier architecture with decoupled presentation and application layers, enhanced with real-time bidirectional WebSocket event channels and cloud-backed file storage:

```mermaid
graph TD
    subgraph Client ["Client Presentation Tier (React 19 SPA)"]
        UI["React UI (Vite 8 + Tailwind 4)"]
        State["Auth Context & Local State"]
        Router["React Router DOM 7"]
        WSClient["Socket.IO Client (ws)"]
        HTTPClient["Axios HTTP Client"]
    end

    subgraph Gateway ["Vercel Services Layer"]
        VercelGateway["Same-Domain Gateway / Reverse Proxy"]
    end

    subgraph Server ["Application Server Tier (Node.js + Express 5)"]
        ExpressApp["Express Application Server"]
        RateLimiter["Rate Limiter (100 req/15m)"]
        AuthMiddleware["JWT Authentication Middleware"]
        Controllers["Controllers (Auth, Projects, Collab, Datasets, Pubs)"]
        WSServer["Socket.IO Server (Room Routing)"]
        MulterCloudinary["Multer Storage Cloudinary"]
    end

    subgraph Persistence ["Data & Storage Tier"]
        MongoAtlas[("MongoDB Atlas Cloud Database")]
        CloudinaryCDN[("Cloudinary Media Storage")]
    end

    UI --> Router
    UI --> State
    State --> HTTPClient
    UI --> WSClient

    HTTPClient -->|HTTPS /api/*| VercelGateway
    WSClient -->|WebSocket| WSServer
    VercelGateway --> RateLimiter
    RateLimiter --> ExpressApp
    ExpressApp --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> MulterCloudinary
    Controllers -->|Mongoose 9 ODM| MongoAtlas
    MulterCloudinary -->|Direct Upload| CloudinaryCDN
    Controllers -.->|Push Notification| WSServer
```

---

## 2. Authentication & Authorization Sequence

ResearchHub implements stateless authentication using JSON Web Tokens (JWT) with bcrypt-salted password hashing:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant API as Express API Server
    participant DB as MongoDB Atlas

    User->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email })
    DB-->>API: User Record with passwordHash
    API->>API: bcrypt.compare(password, passwordHash)
    alt Password Invalid
        API-->>User: 400 Bad Request ("Invalid credentials")
    else Password Valid
        API->>API: jwt.sign({ user: { id, role } }, JWT_SECRET, { expiresIn: '5h' })
        API-->>User: 200 OK { token, user: { id, name, role } }
    end

    Note over User: Token stored in localStorage

    User->>API: GET /api/projects [Authorization: Bearer <token>]
    API->>API: jwt.verify(token, JWT_SECRET)
    API->>DB: Project.find(query).populate('owner')
    DB-->>API: Filtered Projects Array
    API-->>User: 200 OK [ { project1 }, { project2 } ]
```

---

## 3. Real-Time Collaboration Request Event Flow

When students request to join a project, Socket.IO emits a notification event directly to the personal room of the project lead:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Browser
    participant Server as Express & Socket.IO Server
    participant DB as MongoDB Atlas
    actor Faculty as Faculty Lead Browser

    Faculty->>Server: socket.emit('join', facultyId)
    Note over Server: Faculty joins personal socket room: facultyId

    Student->>Server: POST /api/collaboration-requests { projectId, message }
    Server->>DB: Project.findById(projectId)
    DB-->>Server: Project document (with owner: facultyId)
    Server->>DB: CollaborationRequest.save({ from: studentId, to: facultyId, ... })
    DB-->>Server: Saved Request

    Server->>Faculty: req.io.to(facultyId).emit('notification', { message, projectId })
    Note over Faculty: Real-time toast alert appears instantly without reload!

    Faculty->>Server: PUT /api/collaboration-requests/:id { status: 'Accepted' }
    Server->>DB: Update CollaborationRequest status to 'Accepted'
    Server->>DB: Project.collaborators.push(studentId)
    Server-->>Faculty: 200 OK (Student added to team)
```

---

## 4. Collaboration Request State Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Student Submits Request with Pitch Message
    Pending --> Accepted: Project Lead Approves Request
    Pending --> Rejected: Project Lead Declines Request
    Accepted --> CollaboratorAdded: Student ID added to project.collaborators
    CollaboratorAdded --> [*]
    Rejected --> [*]
```

---

## 5. Dataset Versioning & Upload Flow

```mermaid
graph LR
    Client["Client File Picker (CSV, PDF, etc.)"] -->|multipart/form-data| Multer["Multer + Cloudinary Storage"]
    Multer -->|Stream to Cloud| Cloudinary["Cloudinary CDN"]
    Cloudinary -->|Secure File URL| Controller["Dataset Controller"]
    Controller -->|Append to versions array| Mongo[("MongoDB Dataset Document")]
    Mongo -->|Return Metadata| Client
```

---

## 6. Role-Based Access Control Hierarchy

```mermaid
graph TD
    Admin["Admin"] -->|Supervisor| PI["Principal Investigator (PI)"]
    Admin -->|Supervisor| Faculty["Faculty Lead"]
    PI -->|Project Lead| Student["Student Collaborator"]
    Faculty -->|Project Lead| Student

    style Admin fill:#ef4444,color:#fff,stroke:#b91c1c
    style PI fill:#8b5cf6,color:#fff,stroke:#6d28d9
    style Faculty fill:#3b82f6,color:#fff,stroke:#1d4ed8
    style Student fill:#10b981,color:#fff,stroke:#047857
```
