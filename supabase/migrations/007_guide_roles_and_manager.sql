-- Migration: Add roles to profiles, manager to places, and update bookings RLS

-- 1. Create role enum and add to profiles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('tourist', 'guide', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'tourist';

-- 2. Add manager_id to places
ALTER TABLE public.places
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Update bookings_and_queries RLS to allow managers to view/update

CREATE POLICY "Allow managers to view bookings for their places"
    ON public.bookings_and_queries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.places 
            WHERE places.name = bookings_and_queries.place_name 
            AND places.manager_id = auth.uid()
        )
    );

CREATE POLICY "Allow managers to update bookings for their places"
    ON public.bookings_and_queries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.places 
            WHERE places.name = bookings_and_queries.place_name 
            AND places.manager_id = auth.uid()
        )
    );
