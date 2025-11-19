/**
 * Supabase Database Setup Script
 * Run: node setup_supabase.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rnqpiqjnxlgkhxsjvimv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8';

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log('\n📊 Setting up database...');

    // Insert sample questions
    console.log('   → Checking questions table...');
    try {
      const { data: existing } = await supabase
        .from('questions')
        .select('id')
        .limit(1);

      if (!existing || existing.length === 0) {
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

        if (qError) {
          console.log('   ⚠️  Could not insert questions:', qError.message);
        } else {
          console.log('   ✅ Sample questions inserted');
        }
      } else {
        console.log('   ✅ Questions table already has data');
      }
    } catch (e) {
      console.log('   ⚠️  Questions table issue:', e.message);
    }

    // Insert default admin
    console.log('   → Checking admins table...');
    try {
      const { data: existing } = await supabase
        .from('admins')
        .select('id')
        .eq('email', 'admin@demo.com');

      if (!existing || existing.length === 0) {
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

        if (aError) {
          console.log('   ⚠️  Could not insert admin:', aError.message);
        } else {
          console.log('   ✅ Default admin inserted');
        }
      } else {
        console.log('   ✅ Admin already exists');
      }
    } catch (e) {
      console.log('   ⚠️  Admins table issue:', e.message);
    }

    // Verify tables
    console.log('\n🔍 Verifying data...');
    
    try {
      const { data: questions, error: qe } = await supabase.from('questions').select('*');
      const { data: admins, error: ae } = await supabase.from('admins').select('*');
      const { data: interviews, error: ie } = await supabase.from('interviews').select('*');

      console.log('\n📋 Data status:');
      console.log(`   ✓ admins: ${admins ? admins.length : 0} records${ae ? ' (⚠️ ' + ae.message + ')' : ''}`);
      console.log(`   ✓ questions: ${questions ? questions.length : 0} records${qe ? ' (⚠️ ' + qe.message + ')' : ''}`);
      console.log(`   ✓ interviews: ${interviews ? interviews.length : 0} records${ie ? ' (⚠️ ' + ie.message + ')' : ''}`);
    } catch (e) {
      console.log('   ⚠️  Could not verify tables:', e.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database setup script completed!');
    console.log('='.repeat(50));
    console.log('\nNext steps:');
    console.log('  1. Go to https://app.supabase.com');
    console.log('  2. Run SUPABASE_SCHEMA.sql if tables don\'t exist');
    console.log('  3. Start the backend: npm run dev (in backend folder)');
    console.log('  4. Start the frontend: npm start (in frontend folder)');
    console.log('\nDefault test credentials:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: demo123');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
