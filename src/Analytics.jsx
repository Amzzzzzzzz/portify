import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Analytics.css';

export default function Analytics() {
  const [views, setViews] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id);

      if (!analyticsError && analytics) {
        setViews(analytics.length);
      }

      const { data: inbox, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (!messageError && inbox) {
        setMessages(inbox);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="analytics-page">
      <h1>📊 Portfolio Analytics</h1>

      <div className="analytics-section">
        <h2>Total Views:</h2>
        <p className="big-number">{views}</p>
      </div>

      <div className="analytics-section">
        <h2>Recent Messages:</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul className="messages-list">
            {messages.map((msg) => (
              <li key={msg.id} className="message-box">
                <p><strong>From:</strong> {msg.sender_name} ({msg.sender_email})</p>
                <p><strong>Message:</strong> {msg.message}</p>
                <p className="timestamp">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



