# Quick Start - Supabase Setup

## ⚠️ Important: Create Tables First!

Your Supabase project is connected but the database tables don't exist yet. You must create them before using the application.

## Step 1: Create Database Tables (5 minutes)

### Method A: Using Supabase SQL Editor (Easiest)

1. Go to: **https://app.supabase.com**
2. Log in with your credentials
3. Select project: **rnqpiqjnxlgkhxsjvimv**
4. Click **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy and paste the SQL below into the editor

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'interviewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50) DEFAULT 'Medium',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  answers JSONB DEFAULT '[]'::jsonb,
  score NUMERIC(3, 1),
  strengths TEXT[],
  weaknesses TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_email ON interviews(candidate_email);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON interviews(created_at DESC);

-- Insert sample questions
INSERT INTO questions (title, description, category, difficulty) 
VALUES
('Tell us about yourself', 'Please introduce yourself and share your background.', 'HR', 'Easy'),
('What are your strengths?', 'Describe your key strengths and how they make you a good fit.', 'Behavioral', 'Medium'),
('Explain REST API concepts', 'Explain the key concepts of REST API design and implementation.', 'Technical', 'Hard'),
('How do you handle pressure?', 'Describe a situation where you handled pressure effectively.', 'Behavioral', 'Medium'),
('What is your experience with databases?', 'Tell us about your experience with databases and SQL.', 'Technical', 'Medium')
ON CONFLICT DO NOTHING;

-- Insert default admin
INSERT INTO admins (name, email, password, role) 
VALUES ('Demo Admin', 'admin@demo.com', 'demo123', 'admin')
ON CONFLICT (email) DO NOTHING;
```

7. Click **Run** button (or press Ctrl+Enter)
8. ✅ You should see "Success" message

### Method B: Using pgAdmin or Command Line

Open your PostgreSQL client and run the SQL from `SUPABASE_SCHEMA.sql`

```bash
# Using psql command line
psql postgresql://postgres:Mirza@#120@db.rnqpiqjnxlgkhxsjvimv.supabase.co:5432/postgres < SUPABASE_SCHEMA.sql
```

## Step 2: Start the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Server running on port 5000
📍 API Base URL: http://localhost:5000/api
✅ Supabase Connected Successfully
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
Available at http://localhost:3000
```

## Step 3: Test the Application

1. Open http://localhost:3000 in your browser
2. Go to Admin Login: http://localhost:3000/admin/login
3. Use these credentials:
   - **Email**: admin@demo.com
   - **Password**: demo123

✅ You should now be logged in!

## Troubleshooting

### "Table does not exist" Error
- **Solution**: Run the SQL in Step 1 in the Supabase SQL Editor
- Verify tables were created by going to Tables section in Supabase dashboard

### "Could not connect to Supabase"
- **Solution**: Check that SUPABASE_URL and SUPABASE_KEY are correct in `.env`
- Verify your internet connection
- Check if Supabase project is active

### Backend crashes on startup
- **Solution**: Restart with `npm run dev`
- Check terminal for specific error messages
- Ensure tables exist before starting

### Login doesn't work
- **Solution**: Make sure you ran the INSERT statements for the default admin
- Verify the `admins` table has the `admin@demo.com` record

## Next: Add Your Own Data

Once working, you can:

1. **Create more questions**:
   - Go to Admin Panel after login
   - Add new questions for different categories

2. **Create interview sessions**:
   - Go to Interviews section
   - Create new interview sessions for candidates

3. **View reports**:
   - Complete interviews
   - View scoring and feedback reports

## Supabase Dashboard

Anytime you need to:
- View data
- Run SQL queries
- Check logs
- Manage users

Go to: **https://app.supabase.com**

Project: **rnqpiqjnxlgkhxsjvimv**

---

**Still having issues?** Check the main `SUPABASE_SETUP_GUIDE.md` for more detailed information.
