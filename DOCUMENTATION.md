# JobsUPI - AI-Powered Video Interviewer Platform
## Complete Project Documentation

---

## 📋 Table of Contents
1. Overview
2. Features
3. Architecture
4. Installation & Setup
5. API Documentation
6. Component Structure
7. Future Enhancements

---

## 🎯 Overview

**JobsUPI** is a comprehensive MERN (MongoDB, Express, React, Node.js) stack application that simulates a mock interview environment. It features:

- Virtual interviewer avatar that reads questions aloud
- Real-time audio recording and transcription
- Intelligent AI-powered evaluation system
- Admin panel for question management
- Detailed performance reports

### Core Objective
Build a mock interview system where:
- A virtual interviewer avatar asks questions aloud
- The system listens to candidate responses
- Automatic AI evaluation provides feedback
- No dependency on paid external tools

---

## ✨ Key Features

### 1. Interviewer Avatar (2D/3D)
- Interactive SVG-based avatar with multiple expressions
- Animation states: neutral, listening, speaking
- Professional appearance for interview setting

### 2. Voice Question Delivery
- Text-to-Speech (Web Speech API)
- Question playback with adjustable rate and pitch
- Visual feedback during playback

### 3. Candidate Audio Response Capture
- MediaRecorder API for audio capture
- Real-time transcription via Speech Recognition API
- Audio playback before submission

### 4. Automated Evaluation Engine
- Keyword matching algorithm
- Per-question scoring (0-10)
- Overall performance scoring
- Strengths and weaknesses analysis

### 5. Admin Panel
- Create, update, delete questions
- Categorize rounds (HR, Technical, Behavioral)
- Set difficulty levels
- Define evaluation criteria

### 6. Candidate Experience
- Start interview flow
- Avatar greeting
- Question reading and recording
- Instant evaluation report

---

## 🏗️ Architecture

### Backend Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── interviewController.js   # Interview sessions
│   └── questionController.js    # Question management
├── models/
│   ├── Admin.js             # Admin schema
│   ├── InterviewSession.js  # Interview data
│   └── Question.js          # Question schema
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── interviews.js        # Interview endpoints
│   └── questions.js         # Question endpoints
├── middleware/
│   └── auth.js              # JWT authentication
└── server.js                # Express app
```

### Frontend Structure
```
frontend/src/
├── components/
│   ├── AudioRecorder.jsx        # Recording component
│   ├── Header.jsx               # Navigation header
│   ├── InterviewerAvatar.jsx    # Avatar display
│   └── QuestionForm.jsx         # Question form
├── pages/
│   ├── AdminLogin.jsx           # Admin login
│   ├── AdminRegister.jsx        # Admin registration
│   ├── AdminPanel.jsx           # Question management
│   └── Home.jsx                 # Landing page
├── redux/
│   ├── authSlice.js             # Auth state
│   ├── interviewSlice.js        # Interview state
│   └── store.js                 # Redux store
├── styles/
│   └── *.css                    # Component styles
├── utils/
│   └── api.js                   # API client
├── App.jsx                      # Main app
└── index.jsx                    # Entry point
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/Sheraz-udd-in/JobsUPI.git
   cd JobsUPI
   ```

2. **Backend installation**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Start server**
   ```bash
   npm start
   # Development: npm run dev
   ```

### Frontend Setup

1. **Frontend installation**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Ensure REACT_APP_API_URL points to backend
   ```

3. **Start React app**
   ```bash
   npm start
   ```

---

## 📡 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin"
}
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions
```

#### Get Questions by Category
```http
GET /api/questions/category/HR?limit=5
```

#### Create Question (Protected)
```http
POST /api/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tell me about yourself",
  "description": "Describe your background and experience",
  "category": "HR",
  "difficulty": "Easy",
  "expectedKeywords": ["experience", "skills", "background"],
  "evaluationCriteria": "Clarity of communication and relevance"
}
```

#### Update Question (Protected)
```http
PUT /api/questions/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Question (Protected)
```http
DELETE /api/questions/{id}
Authorization: Bearer {token}
```

### Interview Endpoints

#### Create Interview Session
```http
POST /api/interviews
Content-Type: application/json

{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "interviewRound": "HR",
  "questionIds": ["id1", "id2", "id3"]
}
```

#### Submit Answer
```http
PUT /api/interviews/{sessionId}/answer/{questionIndex}
Content-Type: application/json

{
  "candidateAnswer": "My response...",
  "audioUrl": "blob:...",
  "score": 8
}
```

#### Complete Interview
```http
PUT /api/interviews/{sessionId}/complete
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "session_id",
    "candidateName": "John Doe",
    "overallScore": 7.5,
    "strengths": ["Good communication"],
    "weaknesses": ["Could be more concise"],
    "status": "Completed",
    "duration": 600
  }
}
```

#### Get Interview Report
```http
GET /api/interviews/{sessionId}/report
```

---

## 🎨 Component Details

### AudioRecorder
- Records microphone input
- Real-time speech transcription
- Audio playback preview
- Submit button for answers

### InterviewerAvatar
- SVG-based avatar
- Expression animations
- Text-to-speech playback
- Question display

### QuestionForm
- Admin form for adding questions
- Category selection
- Difficulty level selection
- Keyword and criteria input

### Header
- Navigation menu
- Admin dropdown
- Login/Logout functionality

---

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes for admin features
- CORS configuration
- Environment variable protection

---

## 📊 Database Schema

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin | Moderator),
  isActive: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

### Question Model
```javascript
{
  title: String,
  description: String,
  category: String (HR | Technical | Behavioral),
  difficulty: String (Easy | Medium | Hard),
  expectedKeywords: [String],
  evaluationCriteria: String,
  isActive: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

### InterviewSession Model
```javascript
{
  candidateName: String,
  candidateEmail: String,
  interviewRound: String,
  questions: [{
    questionId: ObjectId,
    questionText: String,
    candidateAnswer: String,
    audioUrl: String,
    score: Number (0-10),
    feedback: String
  }],
  overallScore: Number,
  strengths: [String],
  weaknesses: [String],
  status: String (Pending | In Progress | Completed),
  startTime: Date,
  endTime: Date,
  duration: Number (seconds),
  timestamps: { createdAt, updatedAt }
}
```

---

## 🎯 Development Workflow

### Adding a New Feature

1. **Backend**
   - Create/update model in `models/`
   - Create controller in `controllers/`
   - Add routes in `routes/`
   - Update `server.js` if adding new route

2. **Frontend**
   - Create component in `components/` or `pages/`
   - Add Redux slice if needed in `redux/`
   - Add CSS in `styles/`
   - Add route in `App.jsx`

### Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build/ folder to Vercel/Netlify
```

---

## 🔮 Future Enhancements

### Phase 4 & Beyond
- [ ] Advanced lip-sync animation
- [ ] Real-time transcription overlay
- [ ] Webcam attention tracking
- [ ] Emotion detection
- [ ] Performance leaderboard
- [ ] Email notifications
- [ ] Interview analytics dashboard
- [ ] Video interview recording
- [ ] Interview scheduling
- [ ] Candidate feedback system
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/jobs-upi
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env
- Verify firewall settings

**CORS Errors**
- Backend and frontend URLs must match
- Check CORS configuration in server.js

**API Not Responding**
- Verify backend is running on port 5000
- Check network tab in browser DevTools
- Verify request headers

---

## 📞 Support

For issues or questions:
1. Check GitHub issues
2. Review documentation
3. Contact development team

---

## 📄 License

MIT License - Feel free to use this project!

---

**Last Updated**: November 19, 2025
**Project Status**: ✅ Initial Setup Complete | ⏳ Core Features in Progress
