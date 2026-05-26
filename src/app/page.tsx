'use client';

import React, { useState } from 'react';
import IntentSearchBar from '../components/IntentSearchBar';
import Link from 'next/link';
import AuthModal from '../components/AuthModal';
import UserProfilePanel from '../components/UserProfilePanel';
import { useAuth, AuthContextProvider } from '../context/AuthContext';

function HomeContent() {
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  return (
    <>
      {/* Floating Pill Navigation Navbar */}
      <header className="discover-navbar">
          <div className="header-inner">
              <Link href="/" className="brand">TourAssist</Link>
              <nav>
                  <ul>
                      <li><a href="#how-it-works">How It Works</a></li>
                      <li><a href="#features">Features</a></li>
                      <li><a href="#vision">Vision</a></li>
                  </ul>
              </nav>
              <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                  <>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="btn btn-secondary nav-signin-pill-btn"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
                    >
                      Sign In
                    </button>
                    <a href="#how-it-works" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}>
                      Get Started
                    </a>
                  </>
                )}
              </div>

          </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
          <img src="/assets/hero_bg.png" alt="Majestic aerial view of Victoria Falls at sunset" className="hero-bg landing-hero-bg" />
          <div className="hero-overlay landing-hero-overlay"></div>
          <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ fontSize: '4.8rem', fontWeight: 800, letterSpacing: '-2px', textShadow: '0 10px 40px rgba(0,0,0,0.5)', lineHeight: 1.15 }}>
                Experience-First <br/>
                <span className="text-gradient" style={{ display: 'inline-block', position: 'relative' }}>Victoria Falls</span>
              </h1>
              <p style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                Discover authentic places, hidden gems, and meaningful experiences tailored to your personal intent. Don't just visit—experience.
              </p>
              
              <IntentSearchBar />
          </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
          <div className="section-header">
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-1px' }}>How It Works</h2>
              <p style={{ marginTop: '0.5rem' }}>
                The platform acts as an intelligent experience-matching assistant, prioritizing authenticity and personal meaning over generic itineraries.
              </p>
          </div>
          <div className="steps-grid">
              <div className="step-card glass-panel">
                  <div className="step-icon">1</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Describe Intent</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Tell us what you want to feel or experience, rather than just where you want to go.
                  </p>
              </div>
              <div className="step-card glass-panel">
                  <div className="step-icon">2</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Intelligent Matching</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Our engine matches your intent with experience-tagged places and activities.
                  </p>
              </div>
              <div className="step-card glass-panel">
                  <div className="step-icon">3</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Discover Treasures</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Get a tailored list of recommendations, including hidden gems and local favorites.
                  </p>
              </div>
          </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
          <div className="features-container">
              <div className="features-content">
                  <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15 }}>
                    Built for Authenticity, <br/>
                    <span className="text-gradient">Designed for Discovery</span>
                  </h2>
                  <ul className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                          <div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>Free-text input</h4>
                              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Natural language processing to understand your unique travel goals.</p>
                          </div>
                      </li>
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>Maps Integration</h4>
                              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Location-aware discovery using efficient and lightweight mapping APIs.</p>
                          </div>
                      </li>
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          </div>
                          <div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>Balanced Discovery</h4>
                              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>A smart mix of popular highlights and undiscovered local favorites.</p>
                          </div>
                      </li>
                  </ul>
              </div>
              <div className="features-image">
                  <img 
                    src="/assets/app_mockup.png" 
                    alt="TourAssist App Interface Preview showing modern UI with hidden gem recommendations" 
                    style={{ filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.6))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem' }} 
                  />
              </div>
          </div>
      </section>

      {/* Vision/Footer */}
      <footer id="vision">
          <div className="footer-inner">
              <div className="footer-brand">
                  <h2 className="brand">TourAssist</h2>
                  <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>
                    We're on a mission to democratize tourism by highlighting the authentic, culturally rich, and niche experiences of Victoria Falls.
                  </p>
              </div>
              <div className="footer-links">
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Our Vision</h4>
                  <p style={{ fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    "Long-term, we aim to be the trusted digital guide for Victoria Falls, promoting equitable tourism development while maximizing visitor satisfaction."
                  </p>
                  
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-primary)', marginTop: '2.5rem', fontWeight: 800 }}>
                    Stay Updated
                  </h4>
                  <div className="newsletter" style={{ marginTop: '0.75rem' }}>
                      <input type="email" placeholder="Email Address" aria-label="Email Address" />
                      <button className="btn btn-primary">Join</button>
                  </div>
              </div>
          </div>
          <div className="footer-bottom">
              &copy; {new Date().getFullYear()} TourAssist. Designed for discovery in Victoria Falls.
          </div>
      </footer>
      {/* Auth Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UserProfilePanel isOpen={isProfilePanelOpen} onClose={() => setIsProfilePanelOpen(false)} />
    </>
  );
}

export default function Home() {
  return (
    <AuthContextProvider>
      <HomeContent />
    </AuthContextProvider>
  );
}

