const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: SUPABASE_URL and SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const connectSupabase = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test connection by checking health
    const { data, error } = await supabase
      .from('admins')
      .select('count()')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist yet
      throw error;
    }

    console.log('✅ Supabase Connected Successfully');
    console.log(`📍 Supabase URL: ${supabaseUrl}`);
    return supabase;
  } catch (error) {
    console.error(`❌ Supabase Connection Error: ${error.message}`);
    console.error('💡 Please ensure:');
    console.error('   1. SUPABASE_URL is correct');
    console.error('   2. SUPABASE_KEY is valid');
    console.error('   3. Tables exist in Supabase (admins, interviews, questions)');
    throw error;
  }
};

module.exports = { supabase, connectSupabase };
