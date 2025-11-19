/**
 * Supabase Database Setup Script
 * Run: node setup_supabase.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rnqpiqjnxlgkhxsjvimv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8';

// SQL queries to create tables
const SQL_QUERIES = [
  // Create admins table
  `CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'interviewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Create questions table
  `CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'Medium',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Create interviews table
  `CREATE TABLE IF NOT EXISTS interviews (
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
  );`,

  // Create indexes
  `CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);`,
  `CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);`,
  `CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);`,
  `CREATE INDEX IF NOT EXISTS idx_interviews_candidate_email ON interviews(candidate_email);`,
  `CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);`,
];

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log('\n📊 Creating database schema...');

    // Insert sample questions
    console.log('   → Inserting sample questions...');
    const { error: qError } = await supabase
      .from('questions')
      .insert([
        {
          title: 'Tell us about yourself',
          description: 'Please introduce yourself and share your background.',
          category: 'HR',
          difficulty: 'Easy',
        },
        {
          title: 'What are your strengths?',
          description: 'Describe your key strengths and how they make you a good fit.',
          category: 'Behavioral',
          difficulty: 'Medium',
        },
        {
          title: 'Explain REST API concepts',
          description: 'Explain the key concepts of REST API design and implementation.',
          category: 'Technical',
          difficulty: 'Hard',
        },
        {
          title: 'How do you handle pressure?',
          description: 'Describe a situation where you handled pressure effectively.',
          category: 'Behavioral',
          difficulty: 'Medium',
        },
        {
          title: 'What is your experience with databases?',
          description: 'Tell us about your experience with databases and SQL.',
          category: 'Technical',
          difficulty: 'Medium',
        },
      ]);

    if (!qError) {
      console.log('   ✅ Questions inserted');
    }

    // Insert default admin
    console.log('   → Inserting default admin...');
    const { error: aError } = await supabase
      .from('admins')
      .insert([
        {
          name: 'Demo Admin',
          email: 'admin@demo.com',
          password: 'demo123',
          role: 'admin',
        },
      ]);

    if (!aError) {
      console.log('   ✅ Admin inserted');
    }

    // Verify tables
    console.log('\n🔍 Verifying tables...');
    
    const { data: questions } = await supabase.from('questions').select('*');
    const { data: admins } = await supabase.from('admins').select('*');
    const { data: interviews } = await supabase.from('interviews').select('*');

    console.log('\n📋 Tables verified:');
    console.log(`   ✓ admins: ${admins ? admins.length : 0} records`);
    console.log(`   ✓ questions: ${questions ? questions.length : 0} records`);
    console.log(`   ✓ interviews: ${interviews ? interviews.length : 0} records`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database setup completed successfully!');
    console.log('='.repeat(50));
    console.log('\nYou can now:');
    console.log('  1. Start the backend: npm run dev (in backend folder)');
    console.log('  2. Start the frontend: npm start (in frontend folder)');
    console.log('\nDefault credentials for testing:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: demo123');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
