'use client';

import React, { useState, useEffect } from 'react';
import { Experience } from '../data/mockExperiences';

interface ExperienceDetailDrawerProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  isInItinerary: boolean;
  onToggleItinerary: () => void;
}

interface DetailInfo {
  images: string[];
  rating: number;
  totalReviews: number;
  priceLevel: string;
  hours: string;
  phone: string;
  email: string;
  coordinates: string;
  proTip: string;
  reviews: {
    author: string;
    location: string;
    date: string;
    rating: number;
    text: string;
  }[];
}

// Highly detailed mock data specific to each Victoria Falls experience ID
const richDetailsDB: Record<string, DetailInfo> = {
  "1": {
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop"
    ],
    rating: 4.9,
    totalReviews: 243,
    priceLevel: "$$ (Moderate)",
    hours: "12:00 PM - 09:30 PM (Daily)",
    phone: "+263 77 234 5678",
    email: "info@dustyroad.co.zw",
    coordinates: "-17.9325, 25.8295",
    proTip: "Make a reservation at least 24 hours in advance! It gets busy, especially for their famous traditional dinner drum sessions.",
    reviews: [
      {
        author: "Sarah T.",
        location: "London, UK",
        date: "May 2026",
        rating: 5,
        text: "The most authentic cultural meal I've ever had. Cooking over open coals and chatting with local hosts in Chinotimba was unforgettable. Try the traditional sadza and mathatha!"
      },
      {
        author: "Tendai M.",
        location: "Harare, Zim",
        date: "April 2026",
        rating: 5,
        text: "Amazing township vibes. The decor is incredibly creative, using recycled art everywhere. Music was wonderful, food was fresh and delicious."
      }
    ]
  },
  "2": {
    images: [
      "https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop"
    ],
    rating: 4.8,
    totalReviews: 112,
    priceLevel: "Free ($)",
    hours: "06:00 AM - 05:00 PM (Best in daylight)",
    phone: "Local Parks Authority",
    email: "info@zimparks.org.zw",
    coordinates: "-17.9288, 25.8565",
    proTip: "Wear sturdy hiking boots with excellent grip, bring plenty of water, and avoid the steep trail during heavy rains!",
    reviews: [
      {
        author: "Jake K.",
        location: "Colorado, USA",
        date: "May 2026",
        rating: 5,
        text: "Wow! An intense scramble down the canyon. Hearing the roaring falls right from the bottom of the gorge is jaw-dropping. Highly recommend a local guide."
      },
      {
        author: "Anya R.",
        location: "Berlin, Germany",
        date: "March 2026",
        rating: 4.8,
        text: "The ascent back up is grueling, but standing right next to the churning waters of the Boiling Pot is worth every drop of sweat!"
      }
    ]
  },
  "3": {
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=600&auto=format&fit=crop"
    ],
    rating: 4.7,
    totalReviews: 512,
    priceLevel: "$$$ (Premium)",
    hours: "10:00 AM - 10:00 PM (Daily)",
    phone: "+263 13 42013",
    email: "reservations@lookout.wildhorizons.co.zw",
    coordinates: "-17.9241, 25.8496",
    proTip: "Ask to sit on the lower deck for the absolute best photos, and look out for rare gorge-nesting Taita falcons!",
    reviews: [
      {
        author: "David L.",
        location: "Sydney, Aus",
        date: "May 2026",
        rating: 5,
        text: "Sitting on the edge of Batoka Gorge watching zipliners jump off the cliffs while drinking local craft beer was breathtaking. The burger was great too!"
      },
      {
        author: "Elena P.",
        location: "Madrid, Spain",
        date: "Feb 2026",
        rating: 4.5,
        text: "Unbelievable views of the Victoria Falls bridge. Food was delicious and cocktails were very refreshing. Definitely worth the price for the view alone."
      }
    ]
  },
  "4": {
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop"
    ],
    rating: 4.9,
    totalReviews: 870,
    priceLevel: "$$$ (Premium)",
    hours: "04:00 PM - 06:30 PM (Varies seasonally)",
    phone: "+263 77 999 8888",
    email: "cruises@zambeziexplorer.com",
    coordinates: "-17.9125, 25.8390",
    proTip: "Bring a windbreaker or light jacket as it gets surprisingly cool and breezy on the river as soon as the sun goes below the tree line!",
    reviews: [
      {
        author: "Michael B.",
        location: "Toronto, CA",
        date: "May 2026",
        rating: 5,
        text: "An incredible sunset. We saw three elephant herds crossing the river, and countless hippos popping their heads up. Open bar and high-end appetizers were excellent."
      },
      {
        author: "Claire W.",
        location: "Paris, France",
        date: "Jan 2026",
        rating: 5,
        text: "A serene, peaceful trip. The orange and violet sunset colors reflecting off the calm Zambezi are etched in my memory forever."
      }
    ]
  },
  "5": {
    images: [
      "https://images.unsplash.com/photo-1542640244-7e672d6cb466?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526253038957-bce54e05968e?q=80&w=600&auto=format&fit=crop"
    ],
    rating: 4.8,
    totalReviews: 98,
    priceLevel: "$$ (Moderate)",
    hours: "09:00 AM - 05:00 PM (Appointments preferred)",
    phone: "+263 13 44675",
    email: "jafutatrust@villageconnect.org",
    coordinates: "-17.9620, 25.8150",
    proTip: "Buy some of the beautiful hand-woven grass baskets directly from the villagers; the proceeds directly fund their clean water well and primary school supplies!",
    reviews: [
      {
        author: "Lukas H.",
        location: "Vienna, Austria",
        date: "May 2026",
        rating: 5,
        text: "Unlike commercial village tours, this felt like an honest conversation with village elders. Learning about traditional medicine and sustainable community farming was inspiring."
      },
      {
        author: "Chloe N.",
        location: "Cape Town, SA",
        date: "April 2026",
        rating: 4.6,
        text: "Incredible hospitality. The local children taught us a traditional hand game. Extremely respectful and highly educational."
      }
    ]
  }
};

// Generic fallback info in case experience is from Supabase DB and has a new ID
const getFallbackDetails = (exp: Experience): DetailInfo => ({
  images: [
    exp.imageUrl,
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214222541-d510753a4707?q=80&w=600&auto=format&fit=crop"
  ],
  rating: 4.7,
  totalReviews: 45,
  priceLevel: "$$ (Moderate)",
  hours: "08:00 AM - 05:00 PM (Daily)",
  phone: "+263 13 40000",
  email: "info@victoriafalls-tourism.com",
  coordinates: exp.latitude && exp.longitude ? `${exp.latitude.toFixed(4)}, ${exp.longitude.toFixed(4)}` : "Unavailable",
  proTip: "Check local weather forecasts before visiting, and make sure to capture panoramic landscape photos!",
  reviews: [
    {
      author: "Adelia P.",
      location: "Johannesburg, SA",
      date: "May 2026",
      rating: 5,
      text: "A truly marvelous place. Full of natural energy and beauty. A highlight of my trip to the region!"
    },
    {
      author: "John D.",
      location: "New York, USA",
      date: "Feb 2026",
      rating: 4.5,
      text: "Very beautiful and engaging experience. Seamless to locate and very interesting local history."
    }
  ]
});

export default function ExperienceDetailDrawer({
  experience,
  isOpen,
  onClose,
  isInItinerary,
  onToggleItinerary
}: ExperienceDetailDrawerProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reset image carousel index when experience changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [experience]);

  if (!experience) return null;

  // Retrieve rich info or construct generic fallback
  const details = richDetailsDB[experience.id] || getFallbackDetails(experience);

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % details.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + details.images.length) % details.images.length);
  };

  return (
    <>
      {/* Immersive Glassmorphic Panel Backdrop Overlay */}
      <div 
        className={`drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* The Detail Drawer Panel itself */}
      <div className={`detail-drawer glass-panel ${isOpen ? 'open' : ''}`}>
        
        {/* Carousel / Close floating bar */}
        <div className="drawer-hero-wrapper">
          <button className="drawer-close-btn" onClick={onClose} title="Close Panel">
            ✕
          </button>
          
          <div className="drawer-carousel">
            <img 
              src={details.images[activeImageIdx]} 
              alt={experience.title} 
              className="drawer-carousel-img"
            />
            <div className="carousel-gradient-overlay" />
            
            {/* Carousel navigation controls */}
            {details.images.length > 1 && (
              <>
                <button className="carousel-nav-btn prev" onClick={handlePrevImage}>
                  ‹
                </button>
                <button className="carousel-nav-btn next" onClick={handleNextImage}>
                  ›
                </button>
                
                {/* Dots */}
                <div className="carousel-dots">
                  {details.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`carousel-dot ${activeImageIdx === i ? 'active' : ''}`}
                      onClick={() => setActiveImageIdx(i)}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="drawer-hero-text">
              <span className={`experience-badge badge-${experience.type.toLowerCase().replace(/\s+/g, '-')}`}>
                {experience.type === 'Hidden Gem' && '💎 '}
                {experience.type === 'Popular' && '🔥 '}
                {experience.type === 'Local Favorite' && '🛖 '}
                {experience.type}
              </span>
              <h2>{experience.title}</h2>
            </div>
          </div>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="drawer-body">
          
          {/* Action Row */}
          <div className="drawer-actions-row">
            <button 
              onClick={onToggleItinerary}
              className={`drawer-action-btn ${isInItinerary ? 'added' : 'primary'}`}
            >
              {isInItinerary ? (
                <>✓ In Itinerary</>
              ) : (
                <>+ Add to Itinerary</>
              )}
            </button>
          </div>

          {/* Quick Info Capsule Grid */}
          <div className="info-capsule-grid">
            <div className="info-capsule">
              <span className="capsule-icon">⏱️</span>
              <div className="capsule-details">
                <span className="label">Hours</span>
                <span className="val">{details.hours}</span>
              </div>
            </div>

            <div className="info-capsule">
              <span className="capsule-icon">🏷️</span>
              <div className="capsule-details">
                <span className="label">Price</span>
                <span className="val">{details.priceLevel}</span>
              </div>
            </div>

            <div className="info-capsule">
              <span className="capsule-icon">📞</span>
              <div className="capsule-details">
                <span className="label">Contact</span>
                <span className="val">{details.phone}</span>
              </div>
            </div>

            <div className="info-capsule">
              <span className="capsule-icon">📍</span>
              <div className="capsule-details">
                <span className="label">Coordinates</span>
                <span className="val">{details.coordinates}</span>
              </div>
            </div>
          </div>

          {/* AI Match reasoning highlighted */}
          <div className="ai-insight-box">
            <div className="ai-insight-title">
              <span className="ai-icon">✨</span>
              <h4>AI Matching Insight</h4>
            </div>
            <p className="ai-reason-text">"{experience.matchReasoning}"</p>
          </div>

          {/* Overview text */}
          <div className="section-block">
            <h3>Overview</h3>
            <p className="overview-text">{experience.description}</p>
          </div>

          {/* Highlighted Pro-Tip */}
          <div className="pro-tip-box">
            <div className="tip-header">
              <span>💡</span>
              <h4>TRAVELER PRO-TIP</h4>
            </div>
            <p className="tip-text">{details.proTip}</p>
          </div>

          {/* Reviews List */}
          <div className="section-block" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3>Traveler Reviews</h3>
              <div className="rating-summary">
                <span className="stars">★ ★ ★ ★ ★</span>
                <span className="score">{details.rating}</span>
                <span className="count">({details.totalReviews})</span>
              </div>
            </div>
            
            <div className="drawer-reviews-list">
              {details.reviews.map((rev, index) => (
                <div key={index} className="drawer-review-card">
                  <div className="review-meta">
                    <div>
                      <span className="review-author">{rev.author}</span>
                      <span className="review-location">{rev.location}</span>
                    </div>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-stars">
                    {"★".repeat(Math.floor(rev.rating))}
                    {"☆".repeat(5 - Math.floor(rev.rating))}
                  </div>
                  <p className="review-text">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
