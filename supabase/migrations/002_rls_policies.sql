-- Fix: Add Row Level Security policies for the places table
-- The table has RLS enabled but no policies were defined,
-- so ALL queries (read and write) are blocked for the anon key.

-- Allow anyone to read places (public data)
CREATE POLICY "Allow public read access on places"
  ON places
  FOR SELECT
  USING (true);

-- Allow anyone to insert places (for seeding via anon key)
-- In production, you'd restrict this to authenticated/service role only
CREATE POLICY "Allow public insert access on places"
  ON places
  FOR INSERT
  WITH CHECK (true);

-- Re-seed the data (the table exists but is empty because
-- the original INSERT in 001_initial_schema.sql ran before RLS was enabled,
-- or RLS was enabled after the table was created via the Supabase dashboard)
INSERT INTO places (name, category, description, tags, label, image_url) VALUES
('The Lookout Café', 'Dining & Views', 'Perched 120m above the Zambezi River, offering spectacular views of the Batoka Gorge and Victoria Falls Bridge.', ARRAY['view', 'relaxing', 'food', 'iconic'], 'popular', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop'),
('Chinotiba Township Tour', 'Culture', 'Explore the oldest suburb in Victoria Falls. Meet locals, visit markets, and see the authentic side of life here.', ARRAY['culture', 'local', 'history', 'authentic'], 'local favorite', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop'),
('Devil''s Pool', 'Adventure', 'A natural infinity pool right on the edge of the falls. Accessible only during low water season for the ultimate thrill.', ARRAY['adventure', 'thrill', 'unique', 'nature'], 'hidden gem', 'https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?q=80&w=600&auto=format&fit=crop'),
('The Boma - Dinner & Drum Show', 'Experience', 'A feast of local cuisine accompanied by traditional drumming, dancing, and storytelling.', ARRAY['food', 'culture', 'fun', 'family'], 'popular', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop'),
('Siduli Hide', 'Wildlife', 'A camouflaged hide at the edge of a waterhole. Get incredibly close to elephants and other wildlife in silence.', ARRAY['wildlife', 'nature', 'quiet', 'photography'], 'hidden gem', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop'),
('Victoria Falls Bridge', 'History', 'The historic bridge connecting Zimbabwe and Zambia. Famous for bungee jumping and sunset walks.', ARRAY['history', 'view', 'adventure', 'iconic'], 'popular', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop'),
('Dusty Road Township Experience', 'Culture', 'A vibrant, traditional Zimbabwean dining experience set in the heart of the Chinotimba township. Enjoy authentic meals cooked over an open fire.', ARRAY['food', 'culture', 'local', 'traditional', 'township'], 'local favorite', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop'),
('Secret Boiling Pot Hike', 'Adventure', 'A steep, rugged hike down into the gorge where the Zambezi River violently churns in the ''Boiling Pot'' right below the bridge.', ARRAY['nature', 'hike', 'adventure', 'view', 'active'], 'hidden gem', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=600&auto=format&fit=crop'),
('Zambezi River Sunset Cruise', 'Wildlife', 'A relaxing cruise on the upper Zambezi River. Spot hippos, crocodiles, and elephants as the sun sets over the water.', ARRAY['wildlife', 'nature', 'relaxing', 'sunset', 'water'], 'popular', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop'),
('Jafuta Village Guided Tour', 'Culture', 'An intimate guided tour of a traditional village. Learn about local customs, see traditional homes, and participate in cultural activities.', ARRAY['culture', 'village', 'traditional', 'authentic', 'guided'], 'local favorite', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop')
ON CONFLICT DO NOTHING;
