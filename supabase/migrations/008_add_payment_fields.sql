-- Migration: Add payment tracking fields to bookings_and_queries
ALTER TABLE public.bookings_and_queries 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

ALTER TABLE public.bookings_and_queries 
ADD COLUMN IF NOT EXISTS amount_cents INT DEFAULT 5000; -- Default $50 USD deposit

ALTER TABLE public.bookings_and_queries 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
