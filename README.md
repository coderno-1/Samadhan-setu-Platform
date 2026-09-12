# Samadhan Setu

> AI-powered civic problem reporting, analysis, and solution platform.

Samadhan Setu is a MERN-based civic technology platform designed to
connect **citizens, AI analysis, universities, student teams, faculty
mentors, industry, and government administration** around real-world
civic problems.

The platform helps citizens report problems, uses an AI-assisted
workflow to categorize and prioritize them, detects duplicate reports,
and provides an administration workspace for reviewing and managing
problems.

## 🚀 Core Vision

``` text
Citizen
   ↓
Problem Submission
   ↓
AI Analysis
   ├── Category Detection
   ├── Priority Detection
   ├── Confidence Score
   └── Duplicate Detection
   ↓
Administration Review
   ↓
University / Domain Matching
   ↓
Student Team + Faculty Mentor
   ↓
Solution Development
   ↓
Industry / Startup Collaboration
   ↓
Testing & Implementation
   ↓
Government / Civic Outcome
```

## ✨ Current Features

### 👤 Citizen

-   User registration and login
-   Submit civic problems
-   Add category, priority, location, and photos
-   View submitted problems
-   Open individual problem details
-   Track problem status

### 🤖 AI-Assisted Analysis

-   Automatic category detection
-   Priority analysis
-   Confidence score
-   Duplicate problem detection
-   Existing problems can be re-analyzed
-   Duplicate reports are linked to the original problem

### 🛠️ Administration

-   Admin dashboard
-   Total problem statistics
-   Pending problem statistics
-   Projects-in-progress statistics
-   Review all submitted problems
-   View detailed problem information
-   Update problem status
-   Dedicated AI Analysis workspace
-   Re-analyze all existing problems

### 📊 Problem Lifecycle

Problems can move through:

``` text
Submitted
    ↓
Under Review
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
```

A problem can also be marked as:

``` text
Rejected
```

## 🧠 AI Analysis

The current prototype uses a local rule-based analysis engine so the
complete workflow can run without requiring an external AI API key.

The analyzer produces:

``` json
{
  "category": "Infrastructure",
  "priority": "medium",
  "confidence": 0.95,
  "isDuplicate": true,
  "duplicateOf": "existing-problem-id"
}
```

The architecture is intentionally separated so an external AI model can
be integrated later.

## 🏗️ Tech Stack

### Frontend

-   React
-   Vite
-   React Router
-   Tailwind CSS
-   Lucide React

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT authentication

### AI / Analysis

-   Local rule-based classification
-   Keyword-based category and priority analysis
-   Text similarity based duplicate detection

## 📁 Project Structure

``` text
SIH/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── AdminAIAnalysisPage.jsx
│   │   │   ├── AdminProblemsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProblemDetailsPage.jsx
│   │   │   ├── SubmitProblemPage.jsx
│   │   │   └── MyWorkspacePage.jsx
│   │   └── App.jsx
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   │   └── Problem.js
│   │   ├── routes/
│   │   │   └── problems.js
│   │   ├── services/
│   │   │   ├── problemAnalyzer.js
│   │   │   └── duplicateDetector.js
│   │   └── server.js
│   ├── .env
│   └── ...
│
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR_USERNAME/samadhan-setu-platform.git
cd samadhan-setu-platform
```

### 2. Install frontend dependencies

``` bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

``` bash
cd server
npm install
```

### 4. Configure environment variables

Create:

``` text
server/.env
```

Example:

``` env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/samadhan_setu
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Do not commit `.env` or real secrets to GitHub.

### 5. Start the backend

From the `server` directory:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### 6. Start the frontend

From the `client` directory:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

## 🔐 Authentication

The application uses JWT-based authentication.

Protected API requests use:

``` http
Authorization: Bearer <token>
```

Different roles can be used for the platform workflow, including:

-   Citizen
-   Student
-   Faculty
-   Industry
-   Admin

Administrative APIs are protected using role-based authorization.

## 🔌 Important API Endpoints

### Problems

``` http
POST /api/problems
GET  /api/problems/mine
GET  /api/problems/all
GET  /api/problems/admin/stats
GET  /api/problems/:id
PATCH /api/problems/:id/status
POST /api/problems/admin/reanalyze
```

### AI workflow

When a problem is submitted:

``` text
POST /api/problems
        ↓
Problem created
        ↓
AI analysis
        ↓
Duplicate detection
        ↓
aiAnalysis saved in MongoDB
```

Administrators can re-run the analysis for existing problems using:

``` http
POST /api/problems/admin/reanalyze
```

## 🗄️ Problem Data

A problem contains information such as:

-   Title
-   Description
-   Category
-   Location
-   Photos
-   Status
-   Priority
-   Submitted user
-   AI analysis
-   Creation and update timestamps

The AI analysis contains:

-   Detected category
-   Detected priority
-   Confidence
-   Duplicate flag
-   Reference to the original problem when a duplicate is detected

## 🎯 Roadmap

### Phase 1 --- Foundation

-   [x] Authentication
-   [x] Citizen problem submission
-   [x] Problem workspace
-   [x] Admin dashboard
-   [x] Problem review
-   [x] Problem status management

### Phase 2 --- AI Intelligence

-   [x] Category analysis
-   [x] Priority analysis
-   [x] Confidence score
-   [x] Duplicate detection
-   [x] Re-analysis workflow
-   [x] AI analysis dashboard

### Phase 3 --- Smart Routing

-   [ ] University/domain matching
-   [ ] Student team matching
-   [ ] Faculty mentor assignment
-   [ ] Routing recommendations

### Phase 4 --- Collaboration

-   [ ] Industry/startup collaboration
-   [ ] Project proposals
-   [ ] Mentorship
-   [ ] Resource/funding support

### Phase 5 --- Impact

-   [ ] Solution testing
-   [ ] Implementation tracking
-   [ ] Outcome measurement
-   [ ] Government/civic reporting

## 🏆 Smart India Hackathon

This project is being developed as an SIH-oriented civic technology
solution.

Repository:

``` text
samadhan-setu-platform
```

Project:

``` text
Samadhan Setu
```

## 🔒 Security Notes

-   Keep `.env` out of version control.
-   Never commit database credentials or JWT secrets.
-   Use a strong production `JWT_SECRET`.
-   Restrict administrative APIs with role-based authorization.
-   Validate and sanitize user-submitted data before production
    deployment.

## 📌 Development Status

**Current status:** Active development

The core MERN application, authentication, problem management,
administration workflow, AI-assisted analysis, and duplicate detection
are implemented. University/domain routing and the wider
citizen-to-university-to-industry solution lifecycle are planned next.

## 👨‍💻 Author

**Akhilesh**

B.Tech Computer Science & Engineering\
Government Engineering College, Buxar, Bihar

------------------------------------------------------------------------

Made for building practical civic solutions with technology. 🇮🇳
