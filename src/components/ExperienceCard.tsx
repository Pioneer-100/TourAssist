import React from 'react';
import { Experience } from '../data/mockExperiences';

const badgeClass: Record<Experience['type'], string> = {
  'Hidden Gem': 'badge-hidden-gem',
  'Popular': 'badge-popular',
  'Local Favorite': 'badge-local-favorite',
};

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="experience-card glass-panel">
      <div className="experience-card-image">
        <img src={experience.imageUrl} alt={experience.title} />
        <span className={`experience-badge ${badgeClass[experience.type]}`}>
          {experience.type === 'Hidden Gem' && '💎 '}
          {experience.type === 'Popular' && '🔥 '}
          {experience.type === 'Local Favorite' && '🛖 '}
          {experience.type}
        </span>
      </div>

      <div className="experience-card-body">
        <h3>{experience.title}</h3>
        <p>{experience.description}</p>
        <div className="match-reasoning">
          <p><strong>Why it matches: </strong>{experience.matchReasoning}</p>
        </div>
      </div>
    </div>
  );
}
