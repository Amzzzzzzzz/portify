import React, { useContext, useEffect } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import profilePic from './assets/profile-placeholder.jpg';
import Sidebar from './components/Sidebar';
import { ProfileContext } from './context/ProfileContext';
import { supabase } from './supabaseClient';

export default function Homepage() {
  const navigate = useNavigate();
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/');
    };
    checkSession();
  }, []);

  if (!profile) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  return (
    <div className="homepage-wrapper">
      <Sidebar />
      <main className="profile-page">
        <div className="profile-header">
          <img
            className="profile-pic"
            src={profile.profile_image_url || profilePic}
            alt="Profile"
          />
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="job-title">{profile.title}</p>
            <p className="location">{profile.location}</p>
          </div>
        </div>

        <div className="contact-details">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
        </div>

        <section className="bio">
          <h2>About Me</h2>
          <p>{profile.bio}</p>
        </section>

        <section className="skills-section">
          <h2>Skills</h2>
          <ul className="skills-list">
            {profile.skills.map((skill, i) => (
              <li key={i} className="skill">{skill}</li>
            ))}
          </ul>
        </section>

        <div style={{ marginTop: '2rem' }}>
          <button className="edit-button" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <button className="save-button" onClick={() => navigate('/saved-portfolio')}>
            View Saved Portfolio
          </button>
        </div>
      </main>
    </div>
  );
}











