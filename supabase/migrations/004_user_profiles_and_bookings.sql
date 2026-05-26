-- Migration: Create profiles and bookings_and_queries tables, triggers, and RLS policies

-- 1. Create profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email TEXT,
    nationality TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create bookings_and_queries table
CREATE TABLE IF NOT EXISTS public.bookings_and_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('booking', 'query')),
    details TEXT NOT NULL,
    booking_date DATE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'answered')) DEFAULT 'pending',
    assistant_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on bookings
ALTER TABLE public.bookings_and_queries ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Profiles
CREATE POLICY "Allow public read access on profiles"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Create RLS Policies for Bookings and Queries
CREATE POLICY "Allow users to select own bookings and queries"
    ON public.bookings_and_queries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert own bookings and queries"
    ON public.bookings_and_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Automatic Profile Provisioning Trigger on User Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email, nationality, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'nationality', 'International'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id::text)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
