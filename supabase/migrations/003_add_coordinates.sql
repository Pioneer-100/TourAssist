-- Migration: Add coordinates (latitude and longitude) to the places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE places ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Update the existing Victoria Falls places with coordinates
UPDATE places SET latitude = -17.9241, longitude = 25.8496 WHERE name = 'The Lookout Café';
UPDATE places SET latitude = -17.9355, longitude = 25.8280 WHERE name = 'Chinotiba Township Tour';
UPDATE places SET latitude = -17.9276, longitude = 25.8617 WHERE name = 'Devil''s Pool';
UPDATE places SET latitude = -17.9158, longitude = 25.8202 WHERE name = 'The Boma - Dinner & Drum Show';
UPDATE places SET latitude = -17.9175, longitude = 25.8215 WHERE name = 'Siduli Hide';
UPDATE places SET latitude = -17.9284, longitude = 25.8573 WHERE name = 'Victoria Falls Bridge';
UPDATE places SET latitude = -17.9325, longitude = 25.8295 WHERE name = 'Dusty Road Township Experience';
UPDATE places SET latitude = -17.9288, longitude = 25.8565 WHERE name = 'Secret Boiling Pot Hike';
UPDATE places SET latitude = -17.9125, longitude = 25.8390 WHERE name = 'Zambezi River Sunset Cruise';
UPDATE places SET latitude = -17.9620, longitude = 25.8150 WHERE name = 'Jafuta Village Guided Tour';
