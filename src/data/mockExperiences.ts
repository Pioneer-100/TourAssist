export interface Experience {
  id: string;
  title: string;
  description: string;
  type: 'Hidden Gem' | 'Popular' | 'Local Favorite';
  matchReasoning: string;
  imageUrl: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

export const mockExperiences: Experience[] = [
  {
    id: "1",
    title: "Dusty Road Township Experience",
    description: "A vibrant, traditional Zimbabwean dining experience set in the heart of the Chinotimba township. Enjoy authentic meals cooked over an open fire.",
    type: "Local Favorite",
    matchReasoning: "You asked for 'local food' and 'authentic culture'. This is the best traditional dining experience away from the tourist traps.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    tags: ["food", "culture", "local", "traditional", "township"],
    latitude: -17.9325,
    longitude: 25.8295
  },
  {
    id: "2",
    title: "Secret Boiling Pot Hike",
    description: "A steep, rugged hike down into the gorge where the Zambezi River violently churns in the 'Boiling Pot' right below the bridge.",
    type: "Hidden Gem",
    matchReasoning: "You mentioned 'hidden views' and 'adventure'. This trail is rarely crowded and offers an intense, close-up view of the gorge.",
    imageUrl: "https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?q=80&w=600&auto=format&fit=crop",
    tags: ["nature", "hike", "adventure", "view", "active"],
    latitude: -17.9288,
    longitude: 25.8565
  },
  {
    id: "3",
    title: "Lookout Cafe",
    description: "Suspended on the edge of the Batoka Gorge, this cafe offers spectacular views of the Victoria Falls bridge and the river below.",
    type: "Popular",
    matchReasoning: "It's well-known, but matches your desire for 'scenic views while eating'. The gorge view here is unparalleled.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    tags: ["view", "food", "scenic", "relaxing"],
    latitude: -17.9241,
    longitude: 25.8496
  },
  {
    id: "4",
    title: "Zambezi River Sunset Cruise",
    description: "A relaxing cruise on the upper Zambezi River. Spot hippos, crocodiles, and elephants as the sun sets over the water.",
    type: "Popular",
    matchReasoning: "You asked for 'relaxing wildlife viewing'. This is the quintessential relaxing wildlife experience in Victoria Falls.",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop",
    tags: ["wildlife", "nature", "relaxing", "sunset", "water"],
    latitude: -17.9125,
    longitude: 25.8390
  },
  {
    id: "5",
    title: "Jafuta Village Guided Tour",
    description: "A private, respectful tour of a local village just outside the town, focusing on the daily lives and culture of the Ndebele people.",
    type: "Hidden Gem",
    matchReasoning: "You expressed interest in 'authentic culture'. This village tour is much more intimate and less commercialized than others.",
    imageUrl: "https://images.unsplash.com/photo-1542640244-7e672d6cb466?q=80&w=600&auto=format&fit=crop",
    tags: ["culture", "local", "traditional", "educational"],
    latitude: -17.9620,
    longitude: 25.8150
  }
];
