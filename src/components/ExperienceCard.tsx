import React from 'react';
import { Experience } from '../data/mockExperiences';

const badgeClass: Record<Experience['type'], string> = {
  'Hidden Gem': 'badge-hidden-gem',
  'Popular': 'badge-popular',
  'Local Favorite': 'badge-local-favorite',
};

export default function ExperienceCard({ 
  experience,
  isActive,
  isInItinerary,
  timeSlotLabel,
  onClick,
  onMouseEnter,
  onToggleItinerary
}: { 
  experience: Experience;
  isActive?: boolean;
  isInItinerary?: boolean;
  timeSlotLabel?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onToggleItinerary?: (e: React.MouseEvent) => void;
}) {
  return (
    <div 
      id={`experience-card-${experience.id}`}
      className={`experience-card glass-panel ${isActive ? 'active-card' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className="experience-card-image">
        <img src={experience.imageUrl} alt={experience.title} />
        
        {/* Place Type Badge */}
        <span className={`experience-badge ${badgeClass[experience.type]}`}>
          {experience.type === 'Hidden Gem' && '💎 '}
          {experience.type === 'Popular' && '🔥 '}
          {experience.type === 'Local Favorite' && '🛖 '}
          {experience.type}
        </span>

        {/* Dynamic Timeline Slot Badge */}
        {timeSlotLabel && (
          <span className="timeslot-badge">
            {timeSlotLabel}
          </span>
        )}
      </div>

      <div className="experience-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>{experience.title}</h3>
          
          {/* Sleek Itinerary Action Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleItinerary?.(e);
            }}
            className={`card-itinerary-btn ${isInItinerary ? 'added' : ''}`}
            title={isInItinerary ? 'Remove from Itinerary' : 'Add to Itinerary'}
          >
            {isInItinerary ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            )}
          </button>
        </div>

        <p>{experience.description}</p>
        <div className="match-reasoning">
          <p><strong>Why it matches: </strong>{experience.matchReasoning}</p>
        </div>
      </div>
    </div>
  );
}
