# ResearchHub: Presentation Deck
## Chandigarh University Season of Code (CUSoC) Evaluation

**Project ID:** T-08  
**Project Title:** Research Collaboration Platform for University Labs  
**Presented By:** Pratik Kumar & Team  
**Evaluation Session:** Project Evaluation  
**Department:** Computer Science & Engineering, Chandigarh University  

---

<!-- SLIDE 1: TITLE SLIDE -->
# Slide 1: Title Slide
### 🔬 ResearchHub
**A Research Collaboration Platform for University Labs**
- *Connecting students, faculty, and Principal Investigators to discover, manage, and collaborate on cutting-edge research.*
- **Track:** 24CSI-305 (Industrial Summer Training) / 25UCI-203 (Social Internship)
- **Program:** Chandigarh University Season of Code (CUSoC) — C Square Club

---

<!-- SLIDE 2: THE PROBLEM -->
# Slide 2: The Problem Statement
### What Problem Are We Solving?
- **Siloed Lab Workflows:** Ongoing projects within university departments are invisible to motivated students.
- **Recruitment Friction:** Faculty members struggle to identify students with exact skill tags (e.g., PyTorch, ROS, React).
- **Unverifiable Progress:** Deadlines and milestones slip because project updates happen via disjointed emails and chats.
- **Lost Research Data:** Datasets and preprint publications lack centralized versioning and accessibility controls.

> *"Research progress slows down when communication is fragmented."*

---

<!-- SLIDE 3: OUR SOLUTION -->
# Slide 3: The ResearchHub Solution
### A Centralized Ecosystem for University Research
1. **Intelligent Registry:** Fast discovery with domain filters and MongoDB full-text search.
2. **Role-Based Workflows:** Distinct interfaces and capabilities for Students, Faculty, PIs, and Administrators.
3. **Interactive Milestone Tracker:** Embedded milestones with progress sliders and formal owner approvals.
4. **Instant WebSocket Alerts:** Socket.IO push notifications on collaboration requests without page reloads.
5. **Secure Cloud Datasets:** Multi-format file uploads powered by Cloudinary with version histories.

---

<!-- SLIDE 4: ARCHITECTURE & TECH STACK -->
# Slide 4: Technology Stack & System Architecture
### Modern, Scalable, Production-Ready MERN
- **Frontend:** React 19, Vite 8, React Router DOM 7, Tailwind CSS 4, Lucide Icons, Hot Toast.
- **Backend:** Node.js, Express.js 5, Socket.IO 4, Mongoose 9.
- **Database:** MongoDB Atlas with Compound Inverted Text Search Indexing (`$text`).
- **File Storage:** Cloudinary Cloud CDN via `multer-storage-cloudinary`.
- **Deployment:** Vercel Services multi-service architecture (same-domain execution).

---

<!-- SLIDE 5: PROJECT DISCOVERY -->
# Slide 5: Intelligent Project Discovery
### Finding the Right Team in Seconds
- **Search Engine:** Real-time keyword search across project titles and abstracts using MongoDB text indices.
- **Multi-Filter Matrix:** Filter simultaneously by:
  - **Domain:** AI, Machine Learning, Robotics, Cybersecurity, IoT, Blockchain.
  - **Status:** Open, Ongoing, Closed, Completed.
  - **Skills:** Match required tags (e.g., Python, PyTorch, React, Docker).
- **Responsive Card UI:** Interactive cards showing active member counts, owner details, and team capacity.

---

<!-- SLIDE 6: COLLABORATION PIPELINE -->
# Slide 6: Real-Time Collaboration Pipeline
### From Discovery to Active Team Member
1. **Request Submission:** Student submits a structured collaboration request and pitch message.
2. **Instant Push Notification:** Socket.IO transmits a real-time event to the project lead's personal room (`socket.join(user._id)`).
3. **Lead Review:** Owner inspects student profile, department, and verified skill set.
4. **Atomic Acceptance:** On acceptance, the student is automatically appended to the project's collaborators list in MongoDB.

---

<!-- SLIDE 7: MILESTONE TRACKING -->
# Slide 7: Milestone Tracking & Accountability
### Transparent Research Execution
- **Embedded Milestones:** Milestones live within the Project schema for atomic updates.
- **Interactive Progress Slider:** Collaborators and leads slide progress from 0% to 100%.
- **Lead Verification:** Only project owners hold authorization to mark milestones as **Approved** (`badge-success`).
- **Deadlines:** Clear due dates with countdown indicators.

---

<!-- SLIDE 8: DATASET & PUBLICATION REPOSITORY -->
# Slide 8: Datasets & Publication Records
### Open Science & Reproducibility
- **Dataset Library:**
  - Direct upload of CSV, PDF, JSON, images, and ZIP files to Cloudinary.
  - Public vs. Private access flags.
  - Zenodo-style version tracking with historical version logs.
- **Publication Records:**
  - Catalog journal articles and conference papers with Digital Object Identifiers (DOI).
  - Track co-authors, publication dates, and links to parent projects.

---

<!-- SLIDE 9: DEPLOYMENT ARCHITECTURE -->
# Slide 9: Multi-Service Cloud Deployment
### Unified Vercel Services Topology
- **Unified Domain:** Both the React frontend and Express backend deploy from the same repository under one Vercel project.
- **Zero CORS Latency:** Browser makes relative `/api/...` calls on the same origin.
- **Serverless Resilience:** Database connection caching (`readyState >= 1`) eliminates cold-start connection timeouts.
- **Zero Configuration:** Automated builds via `vercel.json` routing.

---

<!-- SLIDE 10: QUALITY ASSURANCE & TESTING -->
# Slide 10: Quality Assurance & Automated Testing
### 100% Test Pass Rate
- **Automated Integration Suite:** Built with native Node.js test runner (`tests/api.test.js`).
- **17 Test Cases:**
  - Health & status checks.
  - Input boundary validation (missing fields, malformed emails, short passwords).
  - Security & route protection (401 Unauthorized verification).
  - End-to-End user registration, authentication, and data retrieval flows.
- **Defect Resolution Log:** Formal tracking of solved bugs (Navbar routing, array safety, DNS resolution).

---

<!-- SLIDE 11: DEMO WALKTHROUGH -->
# Slide 11: 5-Minute Live Evaluation Demo Flow
1. **Faculty View (Window 1):** Log in as PI ➔ Create "Deep Learning for Medical Image Segmentation" with milestones.
2. **Student View (Window 2 - Incognito):** Search "Medical Image" ➔ Filter by "Machine Learning" ➔ Submit Collaboration Request.
3. **Real-Time Notification:** Show instant toast alert pop up in Faculty Window 1 without browser reload.
4. **Accept & Track:** Faculty accepts request ➔ Student added to team ➔ Adjust Milestone Progress slider to 75%.
5. **Data Sharing:** Upload sample research dataset to Cloudinary.

---

<!-- SLIDE 12: CONCLUSION & FUTURE VISION -->
# Slide 12: Conclusion & Future Roadmap
### What's Next for ResearchHub?
- **AI Skill Matcher:** Automated match scores using Google Gemini API to recommend ideal projects to students.
- **Institutional Single Sign-On:** SAML 2.0 / Shibboleth integration for university credentials.
- **Direct Messaging:** Real-time encrypted team chat channels.

---

## 🎓 Thank You!
**Questions & Technical Discussion**  
*CUSoC Project T-08 — Chandigarh University Season of Code*  
GitHub: [Pratik-kr21/T-08-Research-Collaboration-Platform-for-University-Labs](https://github.com/Pratik-kr21/T-08-Research-Collaboration-Platform-for-University-Labs)
