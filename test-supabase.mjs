import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xexjwrscjsmgvfljcotd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp3cnNjanNtZ3ZmbGpjb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2MTksImV4cCI6MjA5MzczMzYxOX0.OoRHFbXtJp9UuMeDfWG8LgQg6OTI7Yg6UkNfgKA1m-8';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing Supabase connection...');

const { data, error } = await supabase
  .from('places')
  .select('*')
  .limit(3);

if (error) {
  console.error('❌ Supabase error:');
  console.error('  Code:', error.code);
  console.error('  Message:', error.message);
  console.error('  Details:', error.details);
  console.error('  Hint:', error.hint);
} else {
  console.log('✅ Connection successful!');
  console.log('Rows returned:', data.length);
  console.log('Sample:', JSON.stringify(data[0], null, 2));
}
