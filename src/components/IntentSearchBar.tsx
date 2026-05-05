import React from 'react';
import Link from 'next/link';

export default function IntentSearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <div className="search-bar" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <input 
        type="text" 
        placeholder="What do you want to experience? (e.g., local food, hidden views...)" 
        autoFocus={autoFocus}
      />
      <Link href="/discover" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Find Experiences
      </Link>
    </div>
  );
}
