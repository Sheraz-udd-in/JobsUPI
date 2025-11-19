-- JobsUPI Database Schema for Supabase
-- This script creates all required tables for the application

-- 1. Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'interviewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50) DEFAULT 'Medium',
  expected_keywords TEXT[],
  evaluation_criteria TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  answers JSONB DEFAULT '[]',
  score NUMERIC(3, 1),
  strengths TEXT[],
  weaknesses TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes for better query performance
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_active ON questions(is_active);
CREATE INDEX idx_interviews_candidate_email ON interviews(candidate_email);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);

-- 5. Insert sample questions
INSERT INTO questions (title, description, category, difficulty) VALUES
('Tell us about yourself', 'Please introduce yourself and share your background.', 'HR', 'Easy'),
('What are your strengths?', 'Describe your key strengths and how they make you a good fit.', 'Behavioral', 'Medium'),
('Explain REST API concepts', 'Explain the key concepts of REST API design and implementation.', 'Technical', 'Hard'),
('How do you handle pressure?', 'Describe a situation where you handled pressure effectively.', 'Behavioral', 'Medium'),
('What is your experience with databases?', 'Tell us about your experience with databases and SQL.', 'Technical', 'Medium');

-- 6. Insert default admin user
INSERT INTO admins (name, email, password, role) VALUES
('Demo Admin', 'admin@demo.com', 'demo123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for demo purposes)
-- In production, you should implement proper authentication policies

-- Allow public read access to questions
CREATE POLICY "Allow public read access to questions"
ON questions FOR SELECT
USING (is_active = true);

-- Allow public insert/update interviews
CREATE POLICY "Allow public insert to interviews"
ON interviews FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read interviews"
ON interviews FOR SELECT
USING (true);

CREATE POLICY "Allow public update interviews"
ON interviews FOR UPDATE
USING (true);

-- Allow public read/create admins (for demo/registration)
CREATE POLICY "Allow public read admins"
ON admins FOR SELECT
USING (true);

CREATE POLICY "Allow public create admins"
ON admins FOR INSERT
WITH CHECK (true);
