import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xexjwrscjsmgvfljcotd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp3cnNjanNtZ3ZmbGpjb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2MTksImV4cCI6MjA5MzczMzYxOX0.OoRHFbXtJp9UuMeDfWG8LgQg6OTI7Yg6UkNfgKA1m-8';

const supabase = createClient(supabaseUrl, supabaseKey);

const places = [
  {
    name: 'The Lookout Café',
    category: 'Dining & Views',
    description: 'Perched 120m above the Zambezi River, offering spectacular views of the Batoka Gorge and Victoria Falls Bridge.',
    tags: ['view', 'relaxing', 'food', 'iconic'],
    label: 'popular',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9241,
    longitude: 25.8496
  },
  {
    name: 'Chinotiba Township Tour',
    category: 'Culture',
    description: 'Explore the oldest suburb in Victoria Falls. Meet locals, visit markets, and see the authentic side of life here.',
    tags: ['culture', 'local', 'history', 'authentic'],
    label: 'local favorite',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9355,
    longitude: 25.8280
  },
  {
    name: "Devil's Pool",
    category: 'Adventure',
    description: 'A natural infinity pool right on the edge of the falls. Accessible only during low water season for the ultimate thrill.',
    tags: ['adventure', 'thrill', 'unique', 'nature'],
    label: 'hidden gem',
    image_url: 'https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9276,
    longitude: 25.8617
  },
  {
    name: 'The Boma - Dinner & Drum Show',
    category: 'Experience',
    description: 'A feast of local cuisine accompanied by traditional drumming, dancing, and storytelling.',
    tags: ['food', 'culture', 'fun', 'family'],
    label: 'popular',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9158,
    longitude: 25.8202
  },
  {
    name: 'Siduli Hide',
    category: 'Wildlife',
    description: 'A camouflaged hide at the edge of a waterhole. Get incredibly close to elephants and other wildlife in silence.',
    tags: ['wildlife', 'nature', 'quiet', 'photography'],
    label: 'hidden gem',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9175,
    longitude: 25.8215
  },
  {
    name: 'Victoria Falls Bridge',
    category: 'History',
    description: 'The historic bridge connecting Zimbabwe and Zambia. Famous for bungee jumping and sunset walks.',
    tags: ['history', 'view', 'adventure', 'iconic'],
    label: 'popular',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9284,
    longitude: 25.8573
  },
  {
    name: 'Dusty Road Township Experience',
    category: 'Culture',
    description: 'A vibrant, traditional Zimbabwean dining experience set in the heart of the Chinotimba township. Enjoy authentic meals cooked over an open fire.',
    tags: ['food', 'culture', 'local', 'traditional', 'township'],
    label: 'local favorite',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9325,
    longitude: 25.8295
  },
  {
    name: 'Secret Boiling Pot Hike',
    category: 'Adventure',
    description: "A steep, rugged hike down into the gorge where the Zambezi River violently churns in the 'Boiling Pot' right below the bridge.",
    tags: ['nature', 'hike', 'adventure', 'view', 'active'],
    label: 'hidden gem',
    image_url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9288,
    longitude: 25.8565
  },
  {
    name: 'Zambezi River Sunset Cruise',
    category: 'Wildlife',
    description: 'A relaxing cruise on the upper Zambezi River. Spot hippos, crocodiles, and elephants as the sun sets over the water.',
    tags: ['wildlife', 'nature', 'relaxing', 'sunset', 'water'],
    label: 'popular',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9125,
    longitude: 25.8390
  },
  {
    name: 'Jafuta Village Guided Tour',
    category: 'Culture',
    description: 'An intimate guided tour of a traditional village. Learn about local customs, see traditional homes, and participate in cultural activities.',
    tags: ['culture', 'village', 'traditional', 'authentic', 'guided'],
    label: 'local favorite',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop',
    latitude: -17.9620,
    longitude: 25.8150
  }
];

console.log(`Seeding ${places.length} places into Supabase...`);

const { data, error } = await supabase
  .from('places')
  .insert(places)
  .select();

if (error) {
  console.error('❌ Seed failed:');
  console.error('  Code:', error.code);
  console.error('  Message:', error.message);
  console.error('  Details:', error.details);
  console.error('  Hint:', error.hint);
} else {
  console.log(`✅ Successfully seeded ${data.length} places!`);
  console.log('First entry:', data[0].name);
}
