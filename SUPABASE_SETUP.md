# Supabase Database Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `tour-assist-victoria-falls`
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Wait for the project to be created (this takes a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: The `anon public` key

## 3. Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to execute the migration

This will create the `places` table and populate it with Victoria Falls data.

## 5. Test the Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3001/discover?q=adventure`
3. The app should now load data from your Supabase database instead of mock data

## Database Schema

The `places` table includes:
- `id`: Auto-incrementing primary key
- `name`: Place name
- `category`: Type of experience (Dining & Views, Culture, Adventure, etc.)
- `description`: Detailed description
- `tags`: Array of searchable tags
- `label`: Popularity type (popular, hidden gem, local favorite)
- `image_url`: Image URL for the place
- `created_at`/`updated_at`: Timestamps

## Features

- **Full-text search** across name, description, tags, and category
- **Scoring algorithm** that boosts matches in tags, names, and categories
- **GIN index** on tags for fast array searching
- **Fallback results** when no matches are found

## Next Steps

You can now:
- Add more places through the Supabase dashboard
- Modify the search algorithm in the API route
- Add user authentication for personalized recommendations
- Implement real-time updates for new places