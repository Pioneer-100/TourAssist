'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntentSearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <input 
        type="text" 
        placeholder="What do you want to experience? (e.g., local food, hidden views...)" 
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Find Experiences
      </button>
    </form>
  );
}
