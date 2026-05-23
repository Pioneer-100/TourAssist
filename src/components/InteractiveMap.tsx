'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Experience } from '../data/mockExperiences';

interface InteractiveMapProps {
  experiences: Experience[];
  activeExperienceId: string | null;
  onSelectExperience: (id: string) => void;
  itinerary: Experience[];
  isScheduleMode: boolean;
  onToggleItinerary: (id: string) => void;
}

// Fallback coordinate dictionary in case database places lack coordinates
const coordinateFallback: Record<string, [number, number]> = {
  "The Lookout Café": [-17.9241, 25.8496],
  "Lookout Cafe": [-17.9241, 25.8496],
  "The Lookout Cafe": [-17.9241, 25.8496],
  "Chinotiba Township Tour": [-17.9355, 25.8280],
  "Chinotiba Township Guided Tour": [-17.9355, 25.8280],
  "Devil's Pool": [-17.9276, 25.8617],
  "The Boma - Dinner & Drum Show": [-17.9158, 25.8202],
  "The Boma": [-17.9158, 25.8202],
  "Siduli Hide": [-17.9175, 25.8215],
  "Victoria Falls Bridge": [-17.9284, 25.8573],
  "Dusty Road Township Experience": [-17.9325, 25.8295],
  "Secret Boiling Pot Hike": [-17.9288, 25.8565],
  "Zambezi River Sunset Cruise": [-17.9125, 25.8390],
  "Jafuta Village Guided Tour": [-17.9620, 25.8150]
};

function getCoordinates(experience: Experience): [number, number] | null {
  if (experience.latitude !== undefined && experience.longitude !== undefined && experience.latitude !== null && experience.longitude !== null) {
    return [experience.latitude, experience.longitude];
  }
  // Try fallback lookup
  const normalizedTitle = experience.title.trim();
  const fallback = coordinateFallback[normalizedTitle];
  if (fallback) return fallback;

  // Loose check
  for (const [key, value] of Object.entries(coordinateFallback)) {
    if (normalizedTitle.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedTitle.toLowerCase())) {
      return value;
    }
  }

  return null;
}

export default function InteractiveMap({
  experiences,
  activeExperienceId,
  onSelectExperience,
  itinerary,
  isScheduleMode,
  onToggleItinerary
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  // 1. Initialize map on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Victoria Falls
    const map = L.map(mapContainerRef.current, {
      center: [-17.926, 25.845],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;

    // CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Subtle scale control
    L.control.scale({ position: 'bottomright' }).addTo(map);

    // Dynamic Leaflet popup button binding
    map.on('popupopen', (e) => {
      const popupNode = e.popup.getElement();
      if (!popupNode) return;
      
      const btn = popupNode.querySelector('.popup-itinerary-btn');
      if (btn) {
        const experienceId = btn.getAttribute('data-id');
        if (experienceId) {
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            onToggleItinerary(experienceId);
            map.closePopup();
          });
        }
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onToggleItinerary]);

  // 2. Add / Update markers when experiences, activeExperienceId, itinerary, or isScheduleMode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const bounds: [number, number][] = [];

    experiences.forEach((exp, index) => {
      const coords = getCoordinates(exp);
      if (!coords) return;

      bounds.push(coords);

      const isActive = activeExperienceId === exp.id;
      const markerTypeClass = 
        exp.type === 'Hidden Gem' 
          ? 'marker-hidden-gem' 
          : exp.type === 'Local Favorite' 
            ? 'marker-local-favorite' 
            : 'marker-popular';

      const isInItin = itinerary.some(item => item.id === exp.id);

      // Render ordered numbers in Schedule Mode, emojis in default mode
      const markerHtml = isScheduleMode 
        ? `<div class="marker-number">${index + 1}</div>`
        : `${exp.type === 'Hidden Gem' ? '💎' : exp.type === 'Popular' ? '🔥' : '🛖'}`;

      const icon = L.divIcon({
        className: `custom-map-marker ${markerTypeClass} ${isActive ? 'active' : ''} ${isScheduleMode ? 'schedule-style' : ''}`,
        html: `
          <div class="marker-pulse"></div>
          <div class="marker-dot">
            ${markerHtml}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const popupHtml = `
        <div class="map-popup-content">
          <h4>${exp.title}</h4>
          <span class="experience-badge badge-${exp.type.toLowerCase().replace(/\s+/g, '-')}">
            ${exp.type}
          </span>
          <p>${exp.description.substring(0, 75)}...</p>
          <button class="popup-itinerary-btn ${isInItin ? 'added' : ''}" data-id="${exp.id}">
            ${isInItin ? '✓ In Itinerary' : '+ Add to Itinerary'}
          </button>
        </div>
      `;

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          offset: L.point(0, -10),
          className: 'custom-map-popup'
        });

      // Synchronize click events
      marker.on('click', () => {
        onSelectExperience(exp.id);
        
        // Smoothly scroll the card in the list
        setTimeout(() => {
          const card = document.getElementById(`experience-card-${exp.id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      });

      markersRef.current[exp.id] = marker;

      if (isActive) {
        marker.openPopup();
      }
    });

    // Auto-fit bounds if we have multiple locations and no active selection
    if (bounds.length > 0 && !activeExperienceId) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [experiences, activeExperienceId, itinerary, isScheduleMode, onSelectExperience]);

  // 3. Draw Route Polyline when Itinerary changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous line
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const latlngs = itinerary
      .map(exp => getCoordinates(exp))
      .filter((coords): coords is [number, number] => coords !== null);

    if (latlngs.length >= 2) {
      const routeLine = L.polyline(latlngs, {
        color: '#0ea5e9',
        weight: 4,
        dashArray: '10, 15',
        className: 'flowing-route-line' // CSS hook in globals.css for SVG flow animation
      }).addTo(map);

      routeLineRef.current = routeLine;
    }
  }, [itinerary]);

  // 4. Pan/Fly map and open popup when activeExperienceId changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeExperienceId) return;

    const marker = markersRef.current[activeExperienceId];
    if (marker) {
      const latlng = marker.getLatLng();
      
      // Update classes on all markers directly
      Object.entries(markersRef.current).forEach(([id, m]) => {
        const iconEl = m.getElement();
        if (iconEl) {
          if (id === activeExperienceId) {
            iconEl.classList.add('active');
          } else {
            iconEl.classList.remove('active');
          }
        }
      });

      map.flyTo(latlng, 15, {
        animate: true,
        duration: 1.2
      });
      
      marker.openPopup();
    }
  }, [activeExperienceId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Actual Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* Sleek Floating Map Controls overlay */}
      <div className="map-control-overlay">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Victoria Falls Map</span>
        {itinerary.length > 0 && (
          <span style={{ marginLeft: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.15)', color: 'var(--accent-secondary)' }}>
            🛤️ {itinerary.length} Stop Route Active
          </span>
        )}
      </div>
    </div>
  );
}
