# 🚀 JobsUPI - Quick Start Guide

## Current Status ✅

- ✅ **Backend**: Running stably with demo mode
- ✅ **Frontend**: Running and compiled  
- ✅ **Interview System**: Fully functional with mock data
- ✅ **Database**: Falls back to demo mode automatically
- 🔧 **MongoDB**: Waiting for IP whitelist in Atlas

## Start the Application (2 Terminal Windows)

### Terminal 1: Backend Server
```bash
cd "c:\Users\Sheraz uddin\OneDrive\Documents\JobsUPI\backend"
npm run dev
```

**Expected Output:**
```
✅ Server running on port 5000
📍 API Base URL: http://localhost:5000/api
🏥 Health Check: http://localhost:5000/health
```

### Terminal 2: Frontend Application
```bash
cd "c:\Users\Sheraz uddin\OneDrive\Documents\JobsUPI\frontend"  
npm start
```

**Expected Output:**
```
webpack compiled with warnings
On Your Network: http://<YOUR_IP>:3000
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api

## Test the Interview Flow

### Option 1: Using Frontend (Recommended)
1. Open http://localhost:3000 in browser
2. Click "Get Started" or navigate to interview section
3. Enter candidate details:
   - Name: Any name
   - Email: any@email.com
   - Round: HR/Technical/Behavioral
4. Answer the 2 mock questions
5. See the results with score and feedback

### Option 2: Using cURL (Testing)

```bash
# 1. Create Interview
curl -X POST http://localhost:5000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com",
    "interviewRound": "HR",
    "questionsCount": 2
  }'

# Copy the returned _id (e.g., "mock_1")

# 2. Submit Answer to Question 1
curl -X PUT http://localhost:5000/api/interviews/mock_1/answer/0 \
  -H "Content-Type: application/json" \
  -d '{
    "candidateAnswer": "I have 5 years of software development experience in web technologies"
  }'

# 3. Submit Answer to Question 2
curl -X PUT http://localhost:5000/api/interviews/mock_1/answer/1 \
  -H "Content-Type: application/json" \
  -d '{
    "candidateAnswer": "My key strengths include teamwork, problem-solving, and technical expertise"
  }'

# 4. Complete Interview
curl -X PUT http://localhost:5000/api/interviews/mock_1/complete

# 5. Get Report
curl http://localhost:5000/api/interviews/mock_1/report
```

## Troubleshooting

### Backend won't start
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Try again
cd backend && npm run dev
```

### Frontend shows "Cannot find module"
```bash
cd frontend
npm install
npm start
```

### Cannot connect to backend from frontend
- Verify backend is running: `curl http://localhost:5000/health`
- Check browser console (F12) for CORS errors
- Ensure both on correct ports (frontend:3000, backend:5000)

### MongoDB errors but backend running
- ✅ **Expected behavior** - Using demo mode with mock data
- To enable real DB: Add IP to MongoDB Atlas Network Access

## What's Working Now

- ✅ Start new interviews
- ✅ Record candidate answers (text/audio URLs)
- ✅ Auto-calculate scores
- ✅ Generate reports with strengths/weaknesses
- ✅ View all interviews
- ✅ Admin question management (backend only)

## What's Next (To Complete)

- 🔄 JWT Authentication (protect admin routes)
- 🔄 Interview components (main UI flow)
- 🔄 Real audio processing
- 🔄 Advanced AI-based scoring

## Backend API Endpoints (All Working)

### Questions
- `GET /api/questions` → Get all questions
- `POST /api/questions` → Create question
- `PUT /api/questions/:id` → Update question
- `DELETE /api/questions/:id` → Delete question

### Interviews
- `POST /api/interviews` → Start interview
- `GET /api/interviews/:id` → Get interview details
- `PUT /api/interviews/:id/answer/:index` → Submit answer
- `PUT /api/interviews/:id/complete` → Finish interview
- `GET /api/interviews/:id/report` → Get results

### Other
- `GET /health` → Server status
- `GET /api/questions/category/:cat` → Questions by category

## Switching to MongoDB (Optional)

1. **Go to MongoDB Atlas** → Your Project
2. **Network Access** → Add your IP or 0.0.0.0/0
3. **Restart backend** → It will auto-connect

## Important Files

- `backend/server.js` - Express server setup
- `backend/config/database.js` - MongoDB connection
- `backend/controllers/interviewController.js` - Interview logic (with demo mode)
- `backend/.env` - Configuration (DB connection string, JWT secret)
- `frontend/src/App.jsx` - React app entry point
- `frontend/src/utils/api.js` - API client

## Git Repository

View changes: https://github.com/Sheraz-udd-in/JobsUPI

Latest commit includes:
- Rewritten backend with stability improvements
- Interview controller with full demo mode support
- Error handling and graceful degradation
- Comprehensive logging and debugging info

---

**Start both servers and go to http://localhost:3000 to see it working!** 🎉
