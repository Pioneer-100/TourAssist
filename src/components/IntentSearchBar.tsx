'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function IntentSearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // Check support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      
      // Immediately submit the accumulated query on manual stop
      const finalQuery = transcriptRef.current || query;
      if (finalQuery.trim()) {
        router.push(`/discover?q=${encodeURIComponent(finalQuery.trim())}`);
      }
      return;
    }

    // Reset transcription ref
    transcriptRef.current = '';
    setQuery('');

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let accumulated = '';
      for (let i = 0; i < event.results.length; ++i) {
        accumulated += event.results[i][0].transcript;
      }
      setQuery(accumulated);
      transcriptRef.current = accumulated;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };


  return (
    <form onSubmit={handleSearch} className="search-bar" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <input 
        type="text" 
        placeholder={isListening ? "Listening... Speak your dream trip experience now..." : "What do you want to experience? (e.g., local food, hidden views...)"}
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {micSupported && (
        <button
          type="button"
          onClick={toggleListening}
          className={`search-bar-mic ${isListening ? 'listening' : ''}`}
          title={isListening ? "Stop listening" : "Explain experience via Voice Input"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem' }}>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      )}
      <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Find Experiences
      </button>
    </form>
  );
}

