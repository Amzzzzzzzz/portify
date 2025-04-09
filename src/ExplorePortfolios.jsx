// ExplorePortfolios.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Explore.css';
import ContactModal from './components/ContactModal';

export default function ExplorePortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublished = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_published', true);
  
      if (!error) {
        console.log("Fetched portfolios:", data);
        setPortfolios(data);
      } else {
        console.error("❌ Error fetching published portfolios:", error.message);
      }
    };
  
    fetchPublished();
  }, []);
  

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill out all fields.');
      return;
    }

    const { error } = await supabase.from('messages').insert([{
      recipient_id: selectedProfile.id,
      sender_name: form.name,
      sender_email: form.email,
      message: form.message,
    }]);

    if (error) {
      alert('Error sending message.');
    } else {
      alert('Message sent!');
      setForm({ name: '', email: '', message: '' });
      setSelectedProfile(null);
    }
  };

  return (
    <div className="explore-page">
      <h1>Explore Published Portfolios</h1>
      <div className="portfolio-grid">
        {portfolios.map((p) => (
          <div key={p.id} className="portfolio-card">
            <img
                src={p.profile_image_url}
                alt="avatar"
                className="avatar"
                />
            <h3>{p.name}</h3>
            <p>{p.title}</p>
            <div className="actions">
              <button onClick={() => navigate(`/portfolio/${p.id}`)}>View Portfolio</button>
              <button onClick={() => setSelectedProfile(p)}>Contact</button>
            </div>
          </div>
        ))}
      </div>

      {selectedProfile && (
        <div className="contact-modal">
          <div className="modal-content">
            <h2>Contact {selectedProfile.name}</h2>
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={sendMessage}>Send</button>
              <button onClick={() => setSelectedProfile(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
