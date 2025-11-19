# Supabase Integration Setup Guide

## Overview
Your JobsUPI project has been successfully integrated with **Supabase** - a PostgreSQL-based backend-as-a-service platform.

## Credentials
- **Supabase Project URL**: https://rnqpiqjnxlgkhxsjvimv.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8
- **Database URL**: postgresql://postgres:Mirza@#120@db.rnqpiqjnxlgkhxsjvimv.supabase.co:5432/postgres

## Step 1: Create Tables in Supabase

### Option A: Using Supabase Dashboard (Recommended)
1. Go to https://app.supabase.com
2. Log in with your credentials
3. Select your project: `rnqpiqjnxlgkhxsjvimv`
4. Navigate to **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy the contents of `SUPABASE_SCHEMA.sql` file from this project
7. Paste into the SQL editor
8. Click **Run**

### Option B: Using SQL File (Alternative)
1. Download/view the `SUPABASE_SCHEMA.sql` file from the project root
2. Execute it in your PostgreSQL client

### Option C: Using Command Line
```bash
psql postgresql://postgres:Mirza@#120@db.rnqpiqjnxlgkhxsjvimv.supabase.co:5432/postgres < SUPABASE_SCHEMA.sql
```

## Step 2: Backend Configuration

The backend is already configured with Supabase. The `.env` file has been updated with:

```env
SUPABASE_URL=https://rnqpiqjnxlgkhxsjvimv.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8
```

## Step 3: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Server running on port 5000
📍 API Base URL: http://localhost:5000/api
🏥 Health Check: http://localhost:5000/health
🔄 Testing Supabase connection...
✅ Supabase Connected Successfully
```

## Step 4: Start Frontend

```bash
cd frontend
npm start
```

The frontend will start on port 3000 or the next available port.

## Database Schema

### Tables Created:

#### 1. **admins**
Stores admin/interviewer user accounts
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Admin name
- `email` (VARCHAR) - Unique email
- `password` (VARCHAR) - Password (consider hashing in production)
- `role` (VARCHAR) - 'admin' or 'interviewer'
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

#### 2. **questions**
Stores interview questions
- `id` (UUID) - Primary key
- `title` (VARCHAR) - Question title
- `description` (TEXT) - Question description
- `category` (VARCHAR) - 'HR', 'Technical', 'Behavioral', etc.
- `difficulty` (VARCHAR) - 'Easy', 'Medium', 'Hard'
- `expected_keywords` (TEXT[]) - Keywords expected in answer
- `evaluation_criteria` (TEXT) - How to evaluate answers
- `is_active` (BOOLEAN) - Whether question is active
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

#### 3. **interviews**
Stores interview sessions and responses
- `id` (UUID) - Primary key
- `candidate_name` (VARCHAR) - Candidate's full name
- `candidate_email` (VARCHAR) - Candidate's email
- `position` (VARCHAR) - Position applied for
- `years_of_experience` (INTEGER) - Candidate's experience
- `status` (VARCHAR) - 'in_progress' or 'completed'
- `answers` (JSONB) - Array of answer objects
- `score` (NUMERIC) - Overall interview score (0-10)
- `strengths` (TEXT[]) - Identified strengths
- `weaknesses` (TEXT[]) - Identified weaknesses
- `created_at` (TIMESTAMP) - Interview start time
- `completed_at` (TIMESTAMP) - Interview completion time
- `updated_at` (TIMESTAMP) - Last update time

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `GET /api/auth/me` - Get current admin (protected)

### Question Endpoints
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `GET /api/questions/category/:category` - Get questions by category
- `POST /api/questions` - Create question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Interview Endpoints
- `POST /api/interviews` - Create interview session
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id/answer/:questionIndex` - Submit answer
- `PUT /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/:id/report` - Get interview report

## Default Credentials

For testing, you can use:
- **Email**: admin@demo.com
- **Password**: demo123
- **Role**: admin

## Demo Mode Fallback

If Supabase connection fails, the backend automatically falls back to **demo mode** with in-memory storage. This allows the application to work even if the database is temporarily unavailable.

The app will show warnings:
```
⚠️  Supabase query failed, using demo mode
```

## Environment Variables

File: `.env`
```properties
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://rnqpiqjnxlgkhxsjvimv.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

## Files Modified

1. **backend/config/supabase.js** (NEW)
   - Supabase client initialization
   - Connection testing

2. **backend/server.js**
   - Changed from MongoDB to Supabase

3. **backend/.env**
   - Added Supabase credentials
   - Removed MongoDB URI

4. **backend/controllers/authController.js**
   - Updated to query Supabase admins table
   - Added demo mode fallback

5. **backend/controllers/questionController.js**
   - Updated to query Supabase questions table
   - Added demo mode fallback

6. **backend/controllers/interviewController.js**
   - Updated to query Supabase interviews table
   - Added demo mode fallback

## Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123"}'
```

### Test Question Retrieval
```bash
curl http://localhost:5000/api/questions
```

### Test Interview Creation
```bash
curl -X POST http://localhost:5000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{"candidateName":"John Doe","candidateEmail":"john@example.com","position":"Software Engineer"}'
```

## Troubleshooting

### Issue: "Missing Supabase credentials in .env file"
**Solution**: Ensure both `SUPABASE_URL` and `SUPABASE_KEY` are set in `.env`

### Issue: "Could not connect to Supabase"
**Solution**: 
- Verify credentials are correct
- Check internet connection
- Verify Supabase project is active
- Check firewall/network restrictions

### Issue: "Table does not exist"
**Solution**: Run the `SUPABASE_SCHEMA.sql` script in Supabase SQL Editor

### Issue: "Role-based access denied"
**Solution**: The RLS policies have been configured for demo purposes. In production, update the policies for proper authentication.

## Next Steps

1. ✅ Create database tables (use SUPABASE_SCHEMA.sql)
2. ✅ Configure backend with Supabase credentials
3. ✅ Start backend server
4. ✅ Start frontend server
5. Test all API endpoints
6. Build your interview application features

## Support

For issues with Supabase:
- Visit: https://app.supabase.com
- Documentation: https://supabase.com/docs
- SQL Query Editor available at: https://app.supabase.com/project/rnqpiqjnxlgkhxsjvimv/sql

For issues with the backend:
- Check `backend/config/supabase.js` for connection setup
- Review controller files for query patterns
- Check terminal output for error messages
