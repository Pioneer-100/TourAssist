'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  // Nationality edits
  const [isEditing, setIsEditing] = useState(false);
  const [newNationality, setNewNationality] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    setIsLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings_and_queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error.message);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Exception loading bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchBookings();
      if (profile) {
        setNewNationality(profile.nationality);
      }
    }
  }, [isOpen, user, profile]);

  if (!isOpen || !user || !profile) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNationality.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nationality: newNationality.trim() })
        .eq('id', user.id);

      if (error) {
        alert('Failed to update nationality: ' + error.message);
      } else {
        await refreshProfile();
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Exception updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      onClose();
    }
  };

  return (
    <div className="profile-panel-overlay" onClick={onClose}>
      <div className="profile-panel-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Close Button */}
        <button className="profile-close-btn" onClick={onClose} aria-label="Close profile panel">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable content container */}
        <div className="profile-drawer-scroll-content">
          {/* Profile Card Header */}
          <div className="profile-header-card glass-panel">
            <div className="profile-avatar-wrapper">
              <img src={profile.avatar_url} alt={`${profile.username}'s avatar`} className="profile-avatar-large" />
              <span className="profile-status-glow"></span>
            </div>

            <h3 className="profile-title">{profile.username}</h3>
            <p className="profile-email">{profile.email}</p>

            <div className="profile-nationality-row">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="profile-nationality-form">
                  <input 
                    type="text" 
                    value={newNationality}
                    onChange={(e) => setNewNationality(e.target.value)}
                    disabled={isSaving}
                    placeholder="Enter Nationality"
                    required
                  />
                  <button type="submit" className="btn-save" disabled={isSaving}>✓</button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>✗</button>
                </form>
              ) : (
                <>
                  <span className="nationality-badge">🗺️ {profile.nationality}</span>
                  <button className="btn-edit" onClick={() => setIsEditing(true)} title="Change Nationality">
                    ✏️
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Bookings and Queries Section */}
          <div className="profile-bookings-section">
            <div className="bookings-section-header">
              <h4>My Bookings & Inquiries</h4>
              <button className="btn-refresh" onClick={fetchBookings} title="Reload list">
                🔄
              </button>
            </div>

            {isLoadingBookings ? (
              <div className="bookings-loading">Loading inquiries...</div>
            ) : bookings.length === 0 ? (
              <div className="bookings-empty-state">
                <p>You haven't contacted any assistants yet.</p>
                <span>Explore places and tap "Contact Assistant" to make a reservation or ask questions!</span>
              </div>
            ) : (
              <div className="bookings-list-scrollable">
                {bookings.map((item) => (
                  <div key={item.id} className="booking-card glass-panel">
                    <div className="booking-card-top">
                      <span className="booking-card-place">{item.place_name}</span>
                      <span className={`booking-status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="booking-card-meta">
                      <span className="booking-card-type">
                        {item.type === 'booking' ? '📅 Booking' : '💬 Inquiry'}
                      </span>
                      {item.booking_date && (
                        <span className="booking-card-date">Date: {item.booking_date}</span>
                      )}
                    </div>

                    <p className="booking-card-details">"{item.details}"</p>

                    {item.assistant_response ? (
                      <div className="booking-assistant-response">
                        <strong>💁 Assistant Reply:</strong>
                        <p>{item.assistant_response}</p>
                      </div>
                    ) : (
                      <div className="booking-assistant-waiting">
                        <span>⏳ Awaiting local guide response...</span>
                      </div>
                    )}

                    <div className="booking-card-date-footer">
                      Sent on {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="profile-drawer-footer">
          <button onClick={handleLogout} className="btn-logout">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
