import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mockExperiences, Experience } from '@/data/mockExperiences';

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

// Synonyms and category expansion map for advanced local semantic parsing (the offline fallback engine)
const synonymMatrix: Record<string, string[]> = {
  "quiet": ["hidden gem", "nature", "peaceful", "crowd-free", "secluded", "relaxing", "traditional"],
  "peaceful": ["hidden gem", "relaxing", "nature", "sunset", "traditional", "scenic"],
  "crowd-free": ["hidden gem", "traditional", "village", "educational"],
  "secluded": ["hidden gem", "hike", "nature"],
  "isolated": ["hidden gem", "hike", "village"],
  "sadza": ["food", "culture", "local", "traditional", "township"],
  "snacks": ["food", "cafe", "traditional", "township"],
  "meal": ["food", "traditional", "township", "cafe"],
  "dining": ["food", "traditional", "township", "cafe"],
  "lunch": ["food", "traditional", "township", "cafe"],
  "dinner": ["food", "traditional", "township", "boma"],
  "active": ["hike", "adventure", "active", "wildlife", "hikes"],
  "energy": ["hike", "adventure", "active", "wildlife"],
  "hike": ["hike", "active", "adventure", "nature"],
  "hikes": ["hike", "active", "adventure", "nature"],
  "scramble": ["hike", "active", "adventure", "nature"],
  "wildlife": ["wildlife", "safari", "nature", "cruise", "hippos", "elephants"],
  "animals": ["wildlife", "safari", "nature", "cruise"],
  "sunset": ["sunset", "evening", "cruise", "boma", "water", "sunset cruise"],
  "drinks": ["sunset", "cruise", "cafe", "food", "relaxing"],
  "beer": ["sunset", "cruise", "cafe", "food"],
  "culture": ["culture", "local", "traditional", "village", "township", "educational"],
  "history": ["culture", "local", "traditional", "village", "educational"]
};

// Map database places table format to the Discover experience format
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

// Curates a highly specific, context-aware statement using search keywords and matched tags
function curatePersonalFallbackStatement(exp: Experience, queryWords: string[]): string {
  const matchingKeyWords = queryWords.filter(word => 
    exp.title.toLowerCase().includes(word) ||
    exp.description.toLowerCase().includes(word) ||
    exp.tags.some(tag => tag.toLowerCase().includes(word))
  );

  const matchedKeywordsString = matchingKeyWords.slice(0, 3).join(', ');

  if (exp.type === 'Hidden Gem') {
    return `This Hidden Gem is highly recommended for your query. It offers a crowd-free, intimate atmosphere matching your interest in "${matchedKeywordsString || exp.tags.slice(0, 2).join(', ')}" beautifully.`;
  } else if (exp.type === 'Local Favorite') {
    return `This Local Favorite fits your vibe perfectly. It highlights authentic Victoria Falls hospitality and local culture related to your interest in "${matchedKeywordsString || exp.tags[0]}".`;
  } else {
    return `An absolute must-see popular highlight matching your interest in "${matchedKeywordsString || exp.tags.slice(0, 2).join(' and ')}". Unparalleled views and premium traveler ratings make it a perfect fit.`;
  }
}

// Fallback advanced local semantic matching engine
function runLocalSemanticFilter(places: Place[], query: string): Experience[] {
  const experiences = places.map(mapPlaceToExperience);
  if (!query) return experiences;

  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  if (queryWords.length === 0) return experiences;

  // Perform synonym expansions
  const expandedQueryTokens = new Set<string>();
  queryWords.forEach(word => {
    expandedQueryTokens.add(word);
    const synonyms = synonymMatrix[word];
    if (synonyms) {
      synonyms.forEach(syn => expandedQueryTokens.add(syn));
    }
  });

  const scored = experiences.map(exp => {
    let score = 0;
    const searchableText = `${exp.title} ${exp.description} ${exp.tags.join(' ')}`.toLowerCase();

    expandedQueryTokens.forEach(token => {
      if (searchableText.includes(token)) {
        score += 1;
        // Boost for tags
        if (exp.tags.some(tag => tag.toLowerCase().includes(token))) score += 2;
        // Boost for title
        if (exp.title.toLowerCase().includes(token)) score += 3;
      }
    });

    // Semantic category boosting
    if (query.includes('quiet') || query.includes('crowd') || query.includes('peaceful') || query.includes('secluded')) {
      if (exp.type === 'Hidden Gem') score += 4;
      if (exp.type === 'Local Favorite') score += 2;
    }
    if (query.includes('local') || query.includes('culture') || query.includes('authentic') || query.includes('tradition')) {
      if (exp.type === 'Local Favorite') score += 4;
    }

    return { exp, score };
  });

  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => {
      // Overwrite static reasoning with a customized statement
      item.exp.matchReasoning = curatePersonalFallbackStatement(item.exp, queryWords);
      return item.exp;
    });

  // curating fallback when no records match
  return results.length > 0 ? results : experiences.slice(0, 5).map(exp => {
    exp.matchReasoning = "Curated based on general Victoria Falls best highlights and scenery.";
    return exp;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const cleanQuery = query.trim().toLowerCase();

    // 1. Fetch available places from Supabase database
    const { data: places, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    // Format fallback DB places in case Supabase is completely empty
    let databasePlaces: Place[] = [];
    if (error || !places || places.length === 0) {
      console.warn('Supabase DB unavailable or empty, using structured mock places database');
      databasePlaces = mockExperiences.map((exp, idx) => ({
        id: Number(exp.id),
        name: exp.title,
        category: exp.type === 'Hidden Gem' ? 'Adventure' : exp.type === 'Local Favorite' ? 'Culture' : 'Scenic Dining',
        description: exp.description,
        tags: exp.tags,
        label: exp.type.toLowerCase(),
        latitude: exp.latitude,
        longitude: exp.longitude
      }));
    } else {
      databasePlaces = places as Place[];
    }

    // 2. Check if Google Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(`\n--- 🤖 [TourAssist AI Diagnostic] ---`);
    console.log(`🔑 Key Loaded: ${apiKey ? `YES (ends in ...${apiKey.substring(apiKey.length - 4)})` : "❌ NO (Server needs a restart to load new .env.local variables!)"}`);
    console.log(`📝 Search Intent Query: "${cleanQuery}" (length: ${cleanQuery.length} chars)`);

    if (apiKey && cleanQuery.length > 2) {
      console.log('🛰️ Connecting to Google Gemini API (gemini-flash-latest) for semantic intent mapping...');

      // Structure experiences into a compact, light JSON for Gemini
      const placesForPrompt = databasePlaces.map(p => ({
        id: p.id.toString(),
        title: p.name,
        category: p.category,
        description: p.description,
        tags: p.tags,
        label: p.label
      }));

      const geminiPrompt = `
You are a highly intelligent, premium AI travel recommendation agent for Victoria Falls, Zimbabwe.
The traveler has entered the following search query expressing their exact desires, vibe, mood, and context:
"${query}"

Here is the list of available experiences from our database:
${JSON.stringify(placesForPrompt, null, 2)}

Your task is to:
1. Analyze the user's query semantically (e.g., if they ask for "sunset snacks without crowds", understand they want evening relaxation with food but in a quiet/less-visited "Hidden Gem" or "Local Favorite" spot rather than a crowded "Popular" spot).
2. Select the 3 to 5 experiences from the list that best match this intent.
3. For each selected experience, write a completely customized, highly personalized "matchReasoning" statement. The statement must directly reference specific details or vibes from the user's query and explain precisely why this place is a perfect fit for their active search.
4. Return a valid JSON array of objects representing the matched experiences in ranked order of relevance. Each object MUST have the following structure:
{
  "id": "string representing the experience ID",
  "matchReasoning": "string with your highly personalized, context-aware explanation"
}

Format the response strictly as a JSON array of these objects. Do not wrap it in markdown block tags, and do not add any other text outside the JSON array.
`;

      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout to prevent cold-start aborts

        const res = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: geminiPrompt }]
            }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const resData = await res.json();
          const responseText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          console.log(`✅ AI MATCH SUCCESS: Gemini responded successfully. Content length: ${responseText?.length || 0} chars.`);
          
          if (responseText) {
            const parsedMatches: { id: string; matchReasoning: string }[] = JSON.parse(responseText.trim());
            console.log(`📌 Matches Extracted: [${parsedMatches.map(m => m.id).join(', ')}]`);
            
            if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
              const matchedExperiences = parsedMatches.map(match => {
                const place = databasePlaces.find(p => p.id.toString() === match.id);
                if (place) {
                  const exp = mapPlaceToExperience(place);
                  exp.matchReasoning = match.matchReasoning;
                  return exp;
                }
                return null;
              }).filter((e): e is Experience => e !== null);

              if (matchedExperiences.length > 0) {
                console.log(`✨ Delivered ${matchedExperiences.length} semantically-parsed matches. Rerouting layout.`);
                console.log(`-----------------------------------------\n`);
                return NextResponse.json(matchedExperiences);
              }
            }
          }
        } else {
          const errBody = await res.json();
          console.warn(`❌ AI ERROR (Status ${res.status}):`, JSON.stringify(errBody));
        }
      } catch (err: any) {
        console.warn(`❌ AI CONNECTION FAILED (Aborted/Timeout/Network):`, err.message || err);
      }
    } else {
      console.log(`💡 Bypassing Gemini: ${!apiKey ? "API Key not configured" : "Query too short (<= 2 chars)"}.`);
    }
    console.log(`🔄 Engaging local synonym semantic fallback processor...`);
    console.log(`-----------------------------------------\n`);

    // 3. Fallback / Standard mode: Execute advanced local semantic classifier
    console.log('Running Advanced Local Semantic engine for query:', query);
    const matchedExperiences = runLocalSemanticFilter(databasePlaces, cleanQuery);

    // Simulate thinking delay to preserve premium AI radar scanning feel
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(matchedExperiences);
  } catch (error) {
    console.error('API critical error:', error);
    // Absolute fallback to mock experiences
    const query = new URL(request.url).searchParams.get('q')?.toLowerCase() || '';
    const databasePlaces = mockExperiences.map((exp) => ({
      id: Number(exp.id),
      name: exp.title,
      category: exp.type === 'Hidden Gem' ? 'Adventure' : 'Scenic',
      description: exp.description,
      tags: exp.tags,
      label: exp.type.toLowerCase(),
      latitude: exp.latitude,
      longitude: exp.longitude
    }));
    return NextResponse.json(runLocalSemanticFilter(databasePlaces, query));
  }
}
