import IntentSearchBar from '../components/IntentSearchBar';

export default function Home() {
  return (
    <>
      {/* Header */}
      <header>
          <div className="header-inner">
              <div className="brand">TourAssist</div>
              <nav>
                  <ul>
                      <li><a href="#how-it-works">How It Works</a></li>
                      <li><a href="#features">Features</a></li>
                      <li><a href="#vision">Vision</a></li>
                  </ul>
              </nav>
              <button className="btn btn-primary">Get Started</button>
          </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
          <img src="/assets/hero_bg.png" alt="Majestic aerial view of Victoria Falls at sunset" className="hero-bg" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
              <h1>Experience-First <br/><span className="text-gradient">Victoria Falls</span></h1>
              <p>Discover authentic places, hidden gems, and meaningful experiences tailored to your personal intent. Don't just visit—experience.</p>
              
              <IntentSearchBar />
          </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
          <div className="section-header">
              <h2>How It Works</h2>
              <p>The platform acts as an intelligent experience-matching assistant, prioritizing authenticity and personal meaning over generic itineraries.</p>
          </div>
          <div className="steps-grid">
              <div className="step-card glass-panel">
                  <div className="step-icon">1</div>
                  <h3>Describe Intent</h3>
                  <p>Tell us what you want to feel or experience, rather than just where you want to go.</p>
              </div>
              <div className="step-card glass-panel">
                  <div className="step-icon">2</div>
                  <h3>Intelligent Matching</h3>
                  <p>Our engine matches your intent with experience-tagged places and activities.</p>
              </div>
              <div className="step-card glass-panel">
                  <div className="step-icon">3</div>
                  <h3>Discover Treasures</h3>
                  <p>Get a tailored list of recommendations, including hidden gems and local favorites.</p>
              </div>
          </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
          <div className="features-container">
              <div className="features-content">
                  <h2>Built for Authenticity, <br/><span className="text-gradient">Designed for Discovery</span></h2>
                  <ul className="feature-list">
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                          <div>
                              <h4>Free-text input</h4>
                              <p>Natural language processing to understand your unique travel goals.</p>
                          </div>
                      </li>
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <div>
                              <h4>Maps Integration</h4>
                              <p>Location-aware discovery using efficient and lightweight mapping APIs.</p>
                          </div>
                      </li>
                      <li className="feature-item">
                          <div className="feature-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          </div>
                          <div>
                              <h4>Balanced Discovery</h4>
                              <p>A smart mix of popular highlights and undiscovered local favorites.</p>
                          </div>
                      </li>
                  </ul>
              </div>
              <div className="features-image">
                  <img src="/assets/app_mockup.png" alt="TourAssist App Interface Preview showing modern UI with hidden gem recommendations" />
              </div>
          </div>
      </section>

      {/* Vision/Footer */}
      <footer id="vision">
          <div className="footer-inner">
              <div className="footer-brand">
                  <h2 className="brand">TourAssist</h2>
                  <p>We're on a mission to democratize tourism by highlighting the authentic, culturally rich, and niche experiences of Victoria Falls.</p>
              </div>
              <div className="footer-links">
                  <h4>Our Vision</h4>
                  <p>"Long-term, we aim to be the trusted digital guide for Victoria Falls, promoting equitable tourism development while maximizing visitor satisfaction."</p>
                  
                  <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-primary)', marginTop: '2rem' }}>Stay Updated</h4>
                  <div className="newsletter">
                      <input type="email" placeholder="Email Address" aria-label="Email Address" />
                      <button className="btn btn-primary">Join</button>
                  </div>
              </div>
          </div>
          <div className="footer-bottom">
              &copy; 2026 TourAssist. Designed for discovery in Victoria Falls.
          </div>
      </footer>
    </>
  );
}
