const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xexjwrscjsmgvfljcotd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp3cnNjanNtZ3ZmbGpjb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2MTksImV4cCI6MjA5MzczMzYxOX0.OoRHFbXtJp9UuMeDfWG8LgQg6OTI7Yg6UkNfgKA1m-8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log("Attempting sign-in with dummy credentials...");
  try {
    const start = Date.now();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistentuser@gmail.com',
      password: 'somepassword123'
    });
    const duration = Date.now() - start;
    console.log(`Auth result received in ${duration}ms:`);
    if (error) {
      console.log("Error received (EXPECTED):", error.message);
    } else {
      console.log("Success received:", data);
    }
  } catch (err) {
    console.error("Auth threw exception:", err);
  }
}

testAuth();
