-- Migration: Production readiness hardening for TourAssist
-- Improves schema safety, RLS behavior, and maintainability for the core tables.

-- 1. Shared trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Harden the places table
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.places
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

ALTER TABLE public.places
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN label SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'places_latitude_check'
  ) THEN
    ALTER TABLE public.places
      ADD CONSTRAINT places_latitude_check CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'places_longitude_check'
  ) THEN
    ALTER TABLE public.places
      ADD CONSTRAINT places_longitude_check CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180));
  END IF;
END $$;

DROP TRIGGER IF EXISTS set_places_updated_at ON public.places;
CREATE TRIGGER set_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_places_name ON public.places (name);

-- 3. Harden the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.profiles
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_email_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_email_check CHECK (email IS NULL OR email ~* '^[^@]+@[^@]+\.[^@]+$');
  END IF;
END $$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- 4. Harden the bookings_and_queries table
ALTER TABLE public.bookings_and_queries ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bookings_and_queries
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.bookings_and_queries
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings_and_queries;
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings_and_queries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings_and_queries (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings_and_queries (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings_and_queries (created_at DESC);

-- 5. Replace overly-permissive RLS policies with safer ones

-- Places: public read, authenticated write access only
DROP POLICY IF EXISTS "Allow public read access on places" ON public.places;
CREATE POLICY "Allow public read access on places"
  ON public.places
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access on places" ON public.places;
CREATE POLICY "Allow authenticated users to insert places"
  ON public.places
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update places" ON public.places;
CREATE POLICY "Allow authenticated users to update places"
  ON public.places
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete places" ON public.places;
CREATE POLICY "Allow authenticated users to delete places"
  ON public.places
  FOR DELETE
  TO authenticated
  USING (true);

-- Profiles: users can only access their own profile
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Bookings and queries: users can only access their own records
DROP POLICY IF EXISTS "Allow users to select own bookings and queries" ON public.bookings_and_queries;
CREATE POLICY "Users can view own bookings and queries"
  ON public.bookings_and_queries
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert own bookings and queries" ON public.bookings_and_queries;
CREATE POLICY "Users can insert own bookings and queries"
  ON public.bookings_and_queries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to update own bookings and queries" ON public.bookings_and_queries;
CREATE POLICY "Users can update own bookings and queries"
  ON public.bookings_and_queries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to delete own bookings and queries" ON public.bookings_and_queries;
CREATE POLICY "Users can delete own bookings and queries"
  ON public.bookings_and_queries
  FOR DELETE
  USING (auth.uid() = user_id);
