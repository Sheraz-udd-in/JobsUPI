# Setup Instructions for JobsUPI - AI-Powered Video Interviewer Platform

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- Git

## Project Structure

```
JobsUPI/
├── backend/                 # Express.js server
│   ├── config/             # Database and config files
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication and custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/               # React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux slices and store
│   │   ├── styles/       # CSS files
│   │   ├── utils/        # API client and utilities
│   │   ├── App.jsx       # Main App component
│   │   └── index.jsx     # Entry point
│   └── package.json      # Frontend dependencies
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Copy `.env.example` to `.env` and update values:
```
MONGODB_URI=mongodb://localhost:27017/jobs-upi
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### 4. Start MongoDB
If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud):
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update MONGODB_URI in .env

### 5. Start the backend server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd ../frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Copy `.env.example` to `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the React development server
```bash
npm start
```

Application will open at `http://localhost:3000`

## Features Implementation

### Phase 1: Core Setup ✅
- ✅ Backend: Express server with MongoDB
- ✅ Frontend: React app with routing
- ✅ Authentication: Admin login/register

### Phase 2: Question Management ✅
- ✅ Admin CRUD operations for questions
- ✅ Question categorization (HR, Technical, Behavioral)
- ✅ Question filtering by category

### Phase 3: Interview System (In Progress)
- ⏳ Avatar display and animations
- ⏳ Voice playback for questions
- ⏳ Audio recording of responses
- ⏳ Real-time transcription

### Phase 4: Evaluation Engine (In Progress)
- ⏳ Keyword matching for scoring
- ⏳ Per-question scoring
- ⏳ Overall performance scoring
- ⏳ Strengths & weaknesses analysis
- ⏳ Final report generation

## API Endpoints

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `GET /api/questions/category/:category` - Get questions by category
- `POST /api/questions` - Create question (Admin)
- `PUT /api/questions/:id` - Update question (Admin)
- `DELETE /api/questions/:id` - Delete question (Admin)

### Interviews
- `POST /api/interviews` - Create interview session
- `GET /api/interviews/:id` - Get interview session
- `PUT /api/interviews/:id/answer/:questionIndex` - Submit answer
- `PUT /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/:id/report` - Get interview report
- `GET /api/interviews` - Get all interviews (Admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `GET /api/auth/me` - Get current admin (Protected)

## Development

### Adding a New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Import and add to Routes

### Adding a New Component
1. Create component in `frontend/src/components/`
2. Create corresponding CSS in `frontend/src/styles/`
3. Export and import where needed

### Adding Backend Routes
1. Create controller in `backend/controllers/`
2. Create route in `backend/routes/`
3. Import and use in `backend/server.js`

## Deployment

### Backend Deployment (Heroku)
```bash
cd backend
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## Troubleshooting

### Backend Issues
- **MongoDB connection error**: Ensure MongoDB is running or check connection string
- **Port already in use**: Change PORT in .env or kill process on port 5000

### Frontend Issues
- **API errors**: Ensure backend is running on port 5000
- **Module not found**: Run `npm install` again
- **CORS errors**: Check backend CORS configuration

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Ant Design, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Audio**: Web Audio API, MediaRecorder, Speech Recognition API
- **State Management**: Redux
- **Styling**: CSS3, Ant Design

## Team Contributions

- Backend Development
- Frontend Development
- UI/UX Design
- Testing & QA

## License

MIT

## Contact

For issues or questions, contact the development team.

---

**Last Updated**: November 19, 2025
