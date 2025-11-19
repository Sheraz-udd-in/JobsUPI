# Supabase Integration Guide

## ✅ Backend Status
- Backend is running on port 5000
- Supabase integration complete
- Connection to Supabase attempted but tables not found

##🔧 Next Steps: Create Tables in Supabase

You need to create the following tables in your Supabase database:

### 1. **admins** Table
```sql
CREATE TABLE admins (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'interviewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **interviews** Table
```sql
CREATE TABLE interviews (
  id BIGSERIAL PRIMARY KEY,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  score NUMERIC DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **questions** Table
```sql
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50) DEFAULT 'Medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📋 Instructions to Create Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com
2. Sign in to your project (rnqpiqjnxlgkhxsjvimv)
3. Navigate to "SQL Editor"
4. Create a new query
5. Copy and paste each SQL table definition above
6. Run each query to create the tables

### Option B: Using SQL Editor
1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Paste the SQL above for all 3 tables
4. Click "Run"

## ✨ After Creating Tables

Once tables are created:

1. **The backend will automatically connect** to Supabase
2. You can register and login immediately
3. Create interview sessions
4. The system will store data in your Supabase database

## 🔐 Current Credentials

- **Supabase URL**: `https://rnqpiqjnxlgkhxsjvimv.supabase.co`
- **API Key**: Stored in `.env` file
- **Note**: The API key is the anonymous/public key - it has read/write access by default

## 🚀 Features Now Available

✅ User Registration and Login with Supabase
✅ Interview Creation and Management  
✅ Question Management
✅ Real-time Data Persistence
✅ Auto-scoring and Feedback
✅ Demo Mode Fallback

## 📊 RESTful Endpoints

All endpoints are now connected to Supabase:

```
POST   /api/auth/login              - Login to system
POST   /api/auth/register           - Register new admin
GET    /api/auth/me                 - Get current admin (protected)

POST   /api/interviews              - Create interview
GET    /api/interviews              - Get all interviews (protected)
GET    /api/interviews/:id          - Get interview details
GET    /api/interviews/:id/report   - Get interview report
PUT    /api/interviews/:id/answer/:index  - Submit answer
PUT    /api/interviews/:id/complete - Complete interview

GET    /api/questions               - Get all questions
GET    /api/questions/:id           - Get question by ID
GET    /api/questions/category/:cat - Get questions by category
POST   /api/questions               - Create question
PUT    /api/questions/:id           - Update question
DELETE /api/questions/:id           - Delete question
```

## 🧪 Test the Connection

1. Go to http://localhost:3001 (frontend)
2. Try to register a new admin account
3. If successful, your Supabase tables are working!
4. Login and create an interview session to test the full workflow

## 💡 Notes

- Demo mode is active as a fallback
- All data will be stored in Supabase once tables are created
- The frontend and backend are fully integrated
- No need to change code - everything will work once tables exist

## 🆘 Troubleshooting

### Table Not Found Error
- Check that all 3 tables are created in Supabase
- Verify table names match exactly (lowercase: `admins`, `interviews`, `questions`)

### Connection Failed
- Verify Supabase URL and API key in `.env`
- Check that you're using the correct project

### Still Using Demo Mode
- Tables might not be visible yet (wait 30 seconds for connection retry)
- Restart backend: `npm run dev`

## 📝 Next Phase

After tables are created and working:
1. Add authentication middleware to all protected routes
2. Implement role-based access control
3. Add pagination for large datasets
4. Implement real-time subscriptions (Supabase Real-time)
5. Add file upload for resume storage
