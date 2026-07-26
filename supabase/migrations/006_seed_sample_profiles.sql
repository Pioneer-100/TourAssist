-- Migration: Seed sample profile rows for local/demo use
-- Run this manually in the Supabase SQL Editor after the matching auth.users rows exist.

-- Create sample profiles only for auth users that already exist with these emails.
INSERT INTO public.profiles (id, username, email, nationality, avatar_url)
SELECT
  au.id,
  'AvaExplorer',
  au.email,
  'United States',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Ava'
FROM auth.users AS au
WHERE au.email = 'sample-ava@tourassist.dev'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, username, email, nationality, avatar_url)
SELECT
  au.id,
  'KofiTraveler',
  au.email,
  'Ghana',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Kofi'
FROM auth.users AS au
WHERE au.email = 'sample-kofi@tourassist.dev'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, username, email, nationality, avatar_url)
SELECT
  au.id,
  'LinaWander',
  au.email,
  'Portugal',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lina'
FROM auth.users AS au
WHERE au.email = 'sample-lina@tourassist.dev'
ON CONFLICT (id) DO NOTHING;

-- Optional: create a sample booking for an existing user.
INSERT INTO public.bookings_and_queries (user_id, place_name, type, details, booking_date, status)
SELECT
  au.id,
  'Devil''s Pool',
  'booking',
  'I would like a guided adventure booking for two.',
  '2026-07-20',
  'pending'
FROM auth.users AS au
WHERE au.email = 'sample-ava@tourassist.dev'
ON CONFLICT DO NOTHING;
