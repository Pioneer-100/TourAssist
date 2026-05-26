'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ExperienceCard from '../../components/ExperienceCard';
import ExperienceDetailDrawer from '../../components/ExperienceDetailDrawer';
import { Experience } from '../../data/mockExperiences';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AuthModal from '../../components/AuthModal';
import UserProfilePanel from '../../components/UserProfilePanel';
import { useAuth, AuthContextProvider } from '../../context/AuthContext';


// Load map on the client-side only to prevent Next.js SSR build errors (window is not defined)
const InteractiveMap = dynamic(() => import('../../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="map-placeholder">
      <div className="map-grid"></div>
      <div className="map-overlay-label">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem' }} className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <h3>Loading Interactive Map...</h3>
        <span>Patience is a virtue, mapping Victoria Falls...</span>
      </div>
    </div>
  )
});

// Semantic AI sorting categorizer based on tags, title, and description
function getTimeSlot(exp: Experience): 'Morning' | 'Afternoon' | 'Evening' {
  const title = exp.title.toLowerCase();
  const desc = exp.description.toLowerCase();
  const tags = exp.tags.map(t => t.toLowerCase());

  // 1. Evening: Dinner, sunsets, cruises, cultural night shows
  if (
    tags.includes('sunset') || 
    tags.includes('dinner') || 
    tags.includes('sunset cruise') ||
    title.includes('sunset') || 
    title.includes('boma') || 
    desc.includes('sunset') || 
    desc.includes('dinner')
  ) {
    return 'Evening';
  }

  // 2. Morning: Active hikes, safari hides, early exploration, high energy adventure
  if (
    tags.includes('hike') || 
    tags.includes('adventure') || 
    tags.includes('active') || 
    tags.includes('wildlife') || 
    tags.includes('nature') || 
    tags.includes('photography') || 
    title.includes('hike') || 
    title.includes('pool') || 
    title.includes('hide') ||
    desc.includes('hike')
  ) {
    return 'Morning';
  }

  // 3. Afternoon: Gorge views, cafes, local town tours, history, museums
  return 'Afternoon';
}

function DiscoverContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Advanced States
  const [itinerary, setItinerary] = useState<Experience[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isScheduleMode, setIsScheduleMode] = useState<boolean>(false);

  // Floating Itinerary Drawer visibility states
  const [isItineraryOpen, setIsItineraryOpen] = useState<boolean>(false);
  const [showItineraryPreview, setShowItineraryPreview] = useState<boolean>(false);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Experience Detail Drawer state
  const [selectedDetailExperience, setSelectedDetailExperience] = useState<Experience | null>(null);

  // Auth & Profile Panel states
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);


  // Cleanup preview timer on unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setActiveExperienceId(null);
      try {
        const response = await fetch(`/api/recommendations?q=${encodeURIComponent(query || '')}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setExperiences(data);
          // Set the first recommendation as active by default
          if (data.length > 0) {
            setActiveExperienceId(data[0].id);
          }
        } else {
          setExperiences([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [query]);

  // Reset filter, itinerary, and drawer states when query changes
  useEffect(() => {
    setActiveFilter('All');
    setItinerary([]);
    setIsScheduleMode(false);
    setIsItineraryOpen(false);
    setShowItineraryPreview(false);
    setSelectedDetailExperience(null);
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }
  }, [query]);

  // Itinerary Toggle Action
  const handleToggleItinerary = (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    if (!experience) return;

    const exists = itinerary.some(item => item.id === id);
    if (exists) {
      setItinerary(prev => {
        const next = prev.filter(item => item.id !== id);
        if (next.length === 0) {
          setIsItineraryOpen(false);
          setShowItineraryPreview(false);
          if (previewTimerRef.current) {
            clearTimeout(previewTimerRef.current);
          }
        }
        return next;
      });
    } else {
      setItinerary(prev => [...prev, experience]);
      
      // Trigger temporary 5-second preview
      setShowItineraryPreview(true);
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      previewTimerRef.current = setTimeout(() => {
        setShowItineraryPreview(false);
      }, 5000);
    }
  };

  // 1. Live Filter Chips mapping
  const filteredExperiences = experiences.filter(exp => {
    if (activeFilter === 'All') return true;
    return exp.type === activeFilter;
  });

  // 2. AI Scheduling sort (Morning -> Afternoon -> Evening)
  const processedExperiences = isScheduleMode 
    ? [...filteredExperiences].sort((a, b) => {
        const slotValues = { 'Morning': 1, 'Afternoon': 2, 'Evening': 3 };
        return slotValues[getTimeSlot(a)] - slotValues[getTimeSlot(b)];
      })
    : filteredExperiences;

  const filterChips = ['All', 'Hidden Gem', 'Local Favorite', 'Popular'];

  // Tracking headers for schedule timeline
  let lastSlot: 'Morning' | 'Afternoon' | 'Evening' | null = null;

  return (
    <div className="discover-page">
      <img src="/assets/disc_bg.jpg" alt="" className="hero-bg" style={{ position: 'fixed', filter: 'brightness(0.35) blur(2px)', transform: 'scale(1.02)' }} />
      <div className="hero-overlay" style={{ position: 'fixed', opacity: 0.5 }}></div>
      
      {/* Floating Search Icon */}
      <Link href="/" className="floating-search-btn" title="Back to Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </Link>

      {/* Floating Pill Navbar */}
      <header className="discover-navbar">
          <div className="header-inner">
              <Link href="/" className="brand">TourAssist</Link>
              <nav>
                  <ul>
                      <li><a href="/#how-it-works">How It Works</a></li>
                      <li><a href="/#features">Features</a></li>
                      <li><a href="/#vision">Vision</a></li>
                  </ul>
              </nav>
              <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => {
                    if (itinerary.length > 0) {
                      setIsItineraryOpen(prev => !prev);
                      setShowItineraryPreview(false);
                      if (previewTimerRef.current) {
                        clearTimeout(previewTimerRef.current);
                      }
                    } else {
                      alert("Your itinerary is empty! Add some stops from the recommendations or the map first.");
                    }
                  }}
                  className={`btn ${isItineraryOpen ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
                >
                  {isItineraryOpen ? 'Close Itinerary' : `My Itinerary (${itinerary.length})`}
                </button>

                {user && profile ? (
                  <button 
                    onClick={() => setIsProfilePanelOpen(true)}
                    className="nav-avatar-pill"
                    title={`Logged in as ${profile.username}. View Profile Dashboard.`}
                  >
                    <img src={profile.avatar_url} alt="" className="nav-avatar-img" />
                    <span className="nav-avatar-username">{profile.username}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn btn-secondary nav-signin-pill-btn"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
                  >
                    Sign In
                  </button>
                )}
              </div>

          </div>
      </header>

      {/* Main Discover Layout */}
      <div className="discover-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1>Your Personalized Discoveries</h1>
          {query && <p className="query-text">Showing results for: <strong>"{query}"</strong></p>}
        </div>

        {/* Premium Scheduler Toggle */}
        <button 
          onClick={() => setIsScheduleMode(!isScheduleMode)}
          className={`schedule-toggle-btn ${isScheduleMode ? 'active' : ''}`}
          style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {isScheduleMode ? (
            <>⏱️ Timeline View Active</>
          ) : (
            <>⚡ Generate Smart Day-Plan</>
          )}
        </button>
      </div>

      <div className="discover-layout">
        
        {/* Left Pane: Experience Cards */}
        <div className="discover-sidebar">
          
          {/* Active Filter Chips */}
          <div className="filter-bar">
            {filterChips.map(chip => (
              <button 
                key={chip}
                className={`filter-chip ${activeFilter === chip ? 'active' : ''}`}
                onClick={() => setActiveFilter(chip)}
              >
                {chip === 'All' ? 'All Matches' : `${chip}s`}
              </button>
            ))}
          </div>

          <div className="discover-results-header glass-panel">
            <div className="radar-scanner">
              <div className="radar-dot"></div>
              <div className="radar-ring"></div>
            </div>
            {loading ? (
              <p className="radar-status animate-pulse">AI Agent analyzing Victoria Falls for best matches...</p>
            ) : (
              <p className="radar-status">AI Intelligence matched <strong>{processedExperiences.length}</strong> premium experiences for you.</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            {loading ? (
              // Simple skeleton loaders
              [1, 2, 3].map(i => (
                <div key={i} className="glass-panel" style={{ height: '300px', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="shimmer" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}></div>
                </div>
              ))
            ) : (
              processedExperiences.map(experience => {
                const currentSlot = getTimeSlot(experience);
                const showHeader = isScheduleMode && currentSlot !== lastSlot;
                lastSlot = currentSlot;

                const timeSlotDisplay = currentSlot === 'Morning' 
                  ? '🌅 MORNING' 
                  : currentSlot === 'Afternoon' 
                    ? '☀️ AFTERNOON' 
                    : '🌆 EVENING';

                return (
                  <React.Fragment key={experience.id}>
                    {showHeader && (
                      <div className="schedule-timeline-header">
                        <div className="timeline-dot"></div>
                        <h3>
                          {currentSlot === 'Morning' && '🌅 Morning Activity'}
                          {currentSlot === 'Afternoon' && '☀️ Afternoon Exploration'}
                          {currentSlot === 'Evening' && '🌆 Evening Experience'}
                        </h3>
                      </div>
                    )}
                    
                    <ExperienceCard 
                      experience={experience} 
                      isActive={activeExperienceId === experience.id}
                      isInItinerary={itinerary.some(item => item.id === experience.id)}
                      timeSlotLabel={isScheduleMode ? timeSlotDisplay : undefined}
                      onClick={() => {
                        setActiveExperienceId(experience.id);
                        setSelectedDetailExperience(experience);
                      }}
                      onMouseEnter={() => setActiveExperienceId(experience.id)}
                      onToggleItinerary={() => handleToggleItinerary(experience.id)}
                    />
                  </React.Fragment>
                );
              })
            )}
            
            {!loading && processedExperiences.length === 0 && (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3>No perfect matches found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try refining your intent or adjusting your filter selection.</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveFilter('All')}>
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Interactive Leaflet Map */}
        <div className="discover-map-pane" style={{ position: 'relative' }}>
          <InteractiveMap 
            experiences={processedExperiences}
            activeExperienceId={activeExperienceId}
            onSelectExperience={setActiveExperienceId}
            itinerary={itinerary}
            isScheduleMode={isScheduleMode}
            onToggleItinerary={handleToggleItinerary}
            onViewDetails={(id) => {
              const exp = experiences.find(item => item.id === id);
              if (exp) {
                setSelectedDetailExperience(exp);
              }
            }}
          />

          {/* Floating Route Drawer Panel */}
          {(isItineraryOpen || showItineraryPreview) && itinerary.length > 0 && (
            <div className="itinerary-drawer glass-panel animate-fade-in">
              <div className="itinerary-drawer-header">
                <div>
                  <h3>🛤️ Custom Itinerary</h3>
                  <span>{itinerary.length} stops mapped</span>
                </div>
                <button 
                  onClick={() => {
                    setItinerary([]);
                    setIsItineraryOpen(false);
                    setShowItineraryPreview(false);
                    if (previewTimerRef.current) {
                      clearTimeout(previewTimerRef.current);
                    }
                  }} 
                  className="drawer-clear-btn"
                  title="Clear All Stops"
                >
                  Clear Route
                </button>
              </div>

              <div className="itinerary-drawer-list">
                {itinerary.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="itinerary-drawer-item"
                    onClick={() => setActiveExperienceId(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="drawer-item-index">{index + 1}</div>
                    <div className="drawer-item-details">
                      <h4>{item.title}</h4>
                      <span>{item.type}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItinerary(item.id);
                      }} 
                      className="drawer-item-remove"
                      title="Remove Stop"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="itinerary-drawer-footer">
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('✨ Custom Route Link copied to Clipboard! Share this exact itinerary with your friends.');
                  }}
                >
                  Share My Route Link
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>

      {/* Immersive Place Detail Drawer */}
      <ExperienceDetailDrawer 
        experience={selectedDetailExperience}
        isOpen={selectedDetailExperience !== null}
        onClose={() => setSelectedDetailExperience(null)}
        isInItinerary={selectedDetailExperience ? itinerary.some(item => item.id === selectedDetailExperience.id) : false}
        onToggleItinerary={() => {
          if (selectedDetailExperience) {
            handleToggleItinerary(selectedDetailExperience.id);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Authentication and Dashboard Overlays */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <UserProfilePanel 
        isOpen={isProfilePanelOpen} 
        onClose={() => setIsProfilePanelOpen(false)} 
      />
    </div>

  );
}

export default function DiscoverPage() {
  return (
    <AuthContextProvider>
      <Suspense fallback={<div className="discover-page"><div className="discover-header"><h1>Loading Discoveries...</h1></div></div>}>
        <DiscoverContent />
      </Suspense>
    </AuthContextProvider>
  );
}

