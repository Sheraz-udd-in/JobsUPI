# AI-Powered Video Interviewer Platform

A mock interview system where a virtual interviewer avatar asks questions aloud, listens to candidate responses, and provides automatic AI-driven evaluation — all without relying on paid external tools.

## Core Features

1. **Interviewer Avatar (2D/3D)**
   - Display a simple avatar (image, animation, or minimal gesture simulation)
   - Avatar should look like it is conducting the interview

2. **Voice Question Delivery**
   - System speaks out/reads each interview question to the candidate
   - Teams are free to pick any offline/open-source/browser capabilities

3. **Candidate Audio Response Capture**
   - Capture and store microphone input
   - Convert to text (if teams choose) for analysis

4. **Automated Evaluation Engine**
   - Per-question score
   - Overall score
   - Strengths & weaknesses
   - Missing keywords/concepts
   - Final summary report

5. **Lightweight Admin Panel**
   - Add/edit/delete interview questions
   - Categorize rounds (HR, Technical, Behavioral)
   - Choose number of questions per session

6. **Candidate Experience**
   - Click "Start Interview"
   - Avatar greets candidate
   - Avatar reads questions
   - System records answers
   - Generates a final evaluation report

## Tech Stack

- **Frontend:** React + Redux
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Audio:** Web Audio API + MediaRecorder
- **Speech:** Web Speech API / Text-to-Speech
- **AI Evaluation:** Basic NLP with keyword matching

## Project Structure

```
JobsUPI/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` file in backend:
```
MONGODB_URI=mongodb://localhost:27017/jobs-upi
PORT=5000
JWT_SECRET=your_secret_key
```

## Features Implementation

### Phase 1: Core Setup
- Backend: Express server, MongoDB connection
- Frontend: React app with routing

### Phase 2: Question Management
- Admin CRUD operations
- Question categories

### Phase 3: Interview System
- Avatar display
- Voice playback
- Audio recording

### Phase 4: Evaluation
- Scoring logic
- Report generation

## License

MIT
