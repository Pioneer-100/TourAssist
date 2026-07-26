import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xexjwrscjsmgvfljcotd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp3cnNjanNtZ3ZmbGpjb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2MTksImV4cCI6MjA5MzczMzYxOX0.OoRHFbXtJp9UuMeDfWG8LgQg6OTI7Yg6UkNfgKA1m-8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const sampleUsers = [
  {
    email: 'sample-ava@tourassist.dev',
    password: 'TourAssist123!',
    username: 'AvaExplorer',
    nationality: 'United States',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ava',
  },
  {
    email: 'sample-kofi@tourassist.dev',
    password: 'TourAssist123!',
    username: 'KofiTraveler',
    nationality: 'Ghana',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kofi',
  },
  {
    email: 'sample-lina@tourassist.dev',
    password: 'TourAssist123!',
    username: 'LinaWander',
    nationality: 'Portugal',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lina',
  },
];

console.log('Creating sample auth users and profile rows...');

for (const user of sampleUsers) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        username: user.username,
        nationality: user.nationality,
        avatar_url: user.avatar_url,
      },
    },
  });

  if (error) {
    const message = error.message || 'Unknown error';
    if (message.includes('already registered') || message.includes('already exists')) {
      console.log(`⚠️ ${user.email} already exists; continuing.`);
    } else {
      console.error(`❌ Failed for ${user.email}:`, message);
    }
  } else {
    console.log(`✅ Created ${user.email}`);
    if (data.user) {
      console.log(`   Auth user ID: ${data.user.id}`);
    }
  }
}

const emails = sampleUsers.map((user) => user.email);
const { data: profiles, error: profileError } = await supabase
  .from('profiles')
  .select('username, email, nationality, avatar_url')
  .in('email', emails);

if (profileError) {
  console.error('❌ Could not fetch created profiles:', profileError.message);
  process.exit(1);
}

console.log('Sample profiles now available:');
for (const profile of profiles || []) {
  console.log(`- ${profile.username} (${profile.email}) from ${profile.nationality}`);
}
