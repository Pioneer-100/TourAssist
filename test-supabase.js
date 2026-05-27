const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xexjwrscjsmgvfljcotd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp3cnNjanNtZ3ZmbGpjb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2MTksImV4cCI6MjA5MzczMzYxOX0.OoRHFbXtJp9UuMeDfWG8LgQg6OTI7Yg6UkNfgKA1m-8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Connecting to Supabase...");
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(5);
    if (error) {
      console.error("Error querying profiles:", error);
    } else {
      console.log("Profiles queried successfully:", data);
    }
  } catch (err) {
    console.error("Exception querying profiles:", err);
  }
}

test();
