'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface BookingQuery {
  id: string;
  user_id: string;
  place_name: string;
  type: string;
  details: string;
  booking_date: string | null;
  status: 'pending' | 'confirmed' | 'answered';
  assistant_response: string | null;
  created_at: string;
  profiles?: {
    username: string;
    email: string;
    avatar_url: string;
  };
}

export default function GuideDashboard() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<BookingQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

  const fetchLeads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings_and_queries')
        .select(`
          *,
          profiles (
            username,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error.message);
      } else {
        // RLS will ensure guides only see their managed places' bookings
        // (plus their own bookings as a tourist, so we filter out their own just in case)
        const managed = (data || []).filter(d => d.user_id !== user.id);
        setItems(managed);
      }
    } catch (err) {
      console.error('Exception loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeads();

      // Subscribe to real-time changes
      const channel = supabase
        .channel('guide-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings_and_queries',
          },
          (payload) => {
            console.log('Realtime update received:', payload);
            fetchLeads(); // Simple approach: refetch on any change to ensure relation data
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleReply = async (id: string, currentType: string) => {
    const text = replyText[id]?.trim();
    if (!text) return;
    
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    
    // Determine new status. Bookings get confirmed, queries get answered.
    const newStatus = currentType === 'booking' ? 'confirmed' : 'answered';

    try {
      const { error } = await supabase
        .from('bookings_and_queries')
        .update({
          assistant_response: text,
          status: newStatus,
        })
        .eq('id', id);

      if (error) {
        alert('Failed to send reply: ' + error.message);
      } else {
        // Clear draft on success (realtime subscription will update the list)
        setReplyText((prev) => ({ ...prev, [id]: '' }));
      }
    } catch (err) {
      console.error('Reply exception:', err);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading your dashboard...</div>;
  }

  const pending = items.filter((i) => i.status === 'pending');
  const handled = items.filter((i) => i.status !== 'pending');

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Guide Dashboard</h1>
          <p className="text-gray-400">Manage inquiries and bookings for your experiences.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <img src={profile?.avatar_url} alt="Guide Avatar" className="w-8 h-8 rounded-full border border-sky-500/30" />
          <span className="text-sm font-semibold">{profile?.username}</span>
          <span className="bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-md ml-2 border border-sky-500/30">Verified Guide</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTION REQUIRED COLUMN */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            Action Required ({pending.length})
          </h2>
          
          {pending.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
              You are all caught up!
            </div>
          ) : (
            pending.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                      New {item.type}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{item.place_name}</h3>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 p-3 bg-black/20 rounded-lg border border-white/5">
                  <img src={item.profiles?.avatar_url} alt="User" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{item.profiles?.username}</div>
                    <div className="text-xs text-gray-400">{item.profiles?.email}</div>
                  </div>
                </div>

                {item.booking_date && (
                  <div className="text-sm mb-2 text-sky-300">
                    <span className="mr-2">📅</span> Requested Date: {item.booking_date}
                  </div>
                )}
                
                <p className="text-sm text-gray-300 italic mb-4 bg-white/5 p-3 rounded-md border-l-2 border-amber-500">
                  "{item.details}"
                </p>

                <div className="mt-4">
                  <label className="block text-xs font-semibold mb-1 text-gray-400">Your Response</label>
                  <textarea
                    value={replyText[item.id] || ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder={item.type === 'booking' ? "Confirm the booking and add any arrival instructions..." : "Answer their question..."}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 transition-colors mb-3"
                    rows={3}
                  />
                  <button
                    onClick={() => handleReply(item.id, item.type)}
                    disabled={isSubmitting[item.id] || !replyText[item.id]?.trim()}
                    className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    {isSubmitting[item.id] ? 'Sending...' : item.type === 'booking' ? 'Confirm Booking' : 'Send Answer'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* HANDLED COLUMN */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Completed ({handled.length})
          </h2>
          
          <div className="space-y-4 opacity-75">
            {handled.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-500">
                No past requests.
              </div>
            ) : (
              handled.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                        {item.status}
                      </span>
                      <h3 className="text-base font-bold mt-2 text-gray-300">{item.place_name}</h3>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">Traveler: {item.profiles?.username}</div>

                  <p className="text-xs text-gray-500 italic mb-3">"{item.details}"</p>
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">Your Reply:</span>
                    <p className="text-sm text-gray-300">{item.assistant_response}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
