import React from 'react';
import IntentSearchBar from '../../components/IntentSearchBar';
import ExperienceCard from '../../components/ExperienceCard';
import { mockExperiences } from '../../data/mockExperiences';
import Link from 'next/link';

export default function DiscoverPage() {
  return (
    <div className="discover-page">
      {/* Header */}
      <header>
          <div className="header-inner">
              <Link href="/" className="brand">TourAssist</Link>
              <nav>
                  <ul>
                      <li><a href="/#how-it-works">How It Works</a></li>
                      <li><a href="/#features">Features</a></li>
                      <li><a href="/#vision">Vision</a></li>
                  </ul>
              </nav>
              <button className="btn btn-primary">My Itinerary (0)</button>
          </div>
      </header>

      {/* Main Discover Layout */}
      <div className="discover-header">
        <h1>Your Personalized Discoveries</h1>
        <IntentSearchBar />
      </div>

      <div className="discover-layout">
        
        {/* Left Pane: Experience Cards */}
        <div className="discover-sidebar">
          
          <div className="filter-bar">
            <button className="filter-chip active">All</button>
            <button className="filter-chip">Hidden Gems</button>
            <button className="filter-chip">Local Favorites</button>
            <button className="filter-chip">Popular</button>
          </div>

          <div className="discover-results-header">
            <p>We found <strong>{mockExperiences.length}</strong> experiences matching your intent.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockExperiences.map(experience => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>

        {/* Right Pane: Map Placeholder */}
        <div className="discover-map-pane">
          <div className="map-placeholder">
            <div className="map-grid"></div>
            
            <div className="map-overlay-label">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <h3>Interactive Map Mode</h3>
              <span>Map integration coming soon.</span>
            </div>

            {/* Decorative Pins */}
            <div className="map-pins">
              <div className="map-pin-dot" style={{ top: '30%', left: '40%', borderColor: '#a855f7' }}></div>
              <div className="map-pin-dot" style={{ top: '60%', left: '70%', borderColor: '#10b981' }}></div>
              <div className="map-pin-dot" style={{ top: '45%', left: '55%', borderColor: '#38bdf8' }}></div>
              <div className="map-pin-dot" style={{ top: '75%', left: '35%', borderColor: '#10b981' }}></div>
              <div className="map-pin-dot" style={{ top: '25%', left: '65%', borderColor: '#38bdf8' }}></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
