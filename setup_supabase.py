#!/usr/bin/env python3
"""
Supabase Database Setup Script
This script creates all necessary tables in your Supabase PostgreSQL database
"""

import psycopg2
from psycopg2 import sql
import sys

# Database connection details
DB_HOST = "db.rnqpiqjnxlgkhxsjvimv.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "Mirza@#120"
DB_PORT = 5432

# SQL Schema
SQL_SCHEMA = """
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
  answers JSONB DEFAULT '[]'::jsonb,
  score NUMERIC(3, 1),
  strengths TEXT[],
  weaknesses TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_email ON interviews(candidate_email);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON interviews(created_at DESC);

-- 5. Insert sample questions
INSERT INTO questions (title, description, category, difficulty) 
VALUES
('Tell us about yourself', 'Please introduce yourself and share your background.', 'HR', 'Easy'),
('What are your strengths?', 'Describe your key strengths and how they make you a good fit.', 'Behavioral', 'Medium'),
('Explain REST API concepts', 'Explain the key concepts of REST API design and implementation.', 'Technical', 'Hard'),
('How do you handle pressure?', 'Describe a situation where you handled pressure effectively.', 'Behavioral', 'Medium'),
('What is your experience with databases?', 'Tell us about your experience with databases and SQL.', 'Technical', 'Medium')
ON CONFLICT DO NOTHING;

-- 6. Insert default admin
INSERT INTO admins (name, email, password, role) 
VALUES ('Demo Admin', 'admin@demo.com', 'demo123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 7. Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
CREATE POLICY "Allow public read access to questions" ON questions
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert to interviews" ON interviews
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read interviews" ON interviews
FOR SELECT USING (true);

CREATE POLICY "Allow public update interviews" ON interviews
FOR UPDATE USING (true);

CREATE POLICY "Allow public read admins" ON admins
FOR SELECT USING (true);

CREATE POLICY "Allow public create admins" ON admins
FOR INSERT WITH CHECK (true);
"""

def setup_database():
    """Connect to Supabase and create all tables"""
    try:
        print("🔄 Connecting to Supabase PostgreSQL...")
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            sslmode='require'
        )
        
        cursor = conn.cursor()
        print("✅ Connected successfully!")
        
        print("\n📊 Creating database schema...")
        cursor.execute(SQL_SCHEMA)
        conn.commit()
        print("✅ Schema created successfully!")
        
        # Verify tables
        print("\n🔍 Verifying tables...")
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        
        print("\n📋 Tables created:")
        for table in tables:
            print(f"   ✓ {table[0]}")
        
        # Count records
        print("\n📈 Record counts:")
        for table_name in ['admins', 'questions', 'interviews']:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"   {table_name}: {count} records")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*50)
        print("✅ Database setup completed successfully!")
        print("="*50)
        print("\nYou can now:")
        print("  1. Start the backend: npm run dev (in backend folder)")
        print("  2. Start the frontend: npm start (in frontend folder)")
        print("\nDefault credentials for testing:")
        print("  Email: admin@demo.com")
        print("  Password: demo123")
        
        return True
        
    except psycopg2.Error as e:
        print(f"\n❌ Database Error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
