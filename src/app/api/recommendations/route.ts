import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mockExperiences } from '@/data/mockExperiences';

interface Place {
  id: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
  label: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

interface Experience {
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

function mapPlaceToExperience(place: Place): Experience {
  const typeMap = {
    'popular': 'Popular' as const,
    'hidden gem': 'Hidden Gem' as const,
    'local favorite': 'Local Favorite' as const
  };

  return {
    id: place.id.toString(),
    title: place.name,
    description: place.description,
    type: typeMap[place.label as keyof typeof typeMap] || 'Popular',
    matchReasoning: `This ${place.category.toLowerCase()} experience matches your interests in ${place.tags.slice(0, 2).join(' and ')}.`,
    imageUrl: place.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop',
    tags: place.tags,
    latitude: place.latitude ? Number(place.latitude) : undefined,
    longitude: place.longitude ? Number(place.longitude) : undefined
  };
}

function filterMockExperiences(query: string): Experience[] {
  if (!query) return mockExperiences;

  const queryWords = query.split(/\s+/).filter(word => word.length > 2);
  if (queryWords.length === 0) return mockExperiences;

  const scored = mockExperiences.map(exp => {
    let score = 0;
    const searchableText = `${exp.title} ${exp.description} ${exp.tags.join(' ')}`.toLowerCase();
    queryWords.forEach(word => {
      if (searchableText.includes(word)) {
        score += 1;
        if (exp.tags.some(tag => tag.toLowerCase().includes(word))) score += 2;
        if (exp.title.toLowerCase().includes(word)) score += 3;
      }
    });
    return { exp, score };
  });

  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.exp);

  return results.length > 0 ? results : mockExperiences;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Fetch all places from Supabase
    const { data: places, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error.code, error.message, error.details, error.hint);
      // Fall back to mock data when database is unavailable
      console.warn('Falling back to mock data due to database error');
      return NextResponse.json(filterMockExperiences(query));
    }

    // If DB returned 0 rows (e.g. RLS blocking reads), fall back to mock data
    if (!places || places.length === 0) {
      console.warn('No places found in database (possible RLS issue), falling back to mock data');
      return NextResponse.json(filterMockExperiences(query));
    }

    if (!query) {
      // Return all experiences if no query
      const experiences = places.map(mapPlaceToExperience);
      return NextResponse.json(experiences);
    }

    const queryWords = query.split(/\s+/).filter(word => word.length > 2);

    const scoredExperiences = (places as Place[]).map(place => {
      let score = 0;
      const searchableText = `${place.name} ${place.description} ${place.tags.join(' ')} ${place.category}`.toLowerCase();

      queryWords.forEach(word => {
        if (searchableText.includes(word)) {
          score += 1;
          // Boost for tag matches
          if (place.tags.some(tag => tag.toLowerCase().includes(word))) {
            score += 2;
          }
          // Boost for name matches
          if (place.name.toLowerCase().includes(word)) {
            score += 3;
          }
          // Boost for category matches
          if (place.category.toLowerCase().includes(word)) {
            score += 2;
          }
        }
      });

      return { place, score };
    });

    // Filter out zero-score results if there was a meaningful query,
    // otherwise just return all (fall back to default)
    let results = scoredExperiences
      .filter(item => queryWords.length === 0 || item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => mapPlaceToExperience(item.place));

    // If no results match, return a curated "best of" or all
    if (results.length === 0) {
      results = places.slice(0, 5).map(mapPlaceToExperience);
    }

    // Simulate a bit of "thinking" time for the intelligence layer
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(results);
  } catch (error) {
    console.error('API error:', error);
    // Even on unexpected errors, return mock data so the app still works
    const query = new URL(request.url).searchParams.get('q')?.toLowerCase() || '';
    return NextResponse.json(filterMockExperiences(query));
  }
}
