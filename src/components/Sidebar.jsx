// components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import portifyLogo from '../assets/Portify.png';
import './Sidebar.css';
import { supabase } from '../supabaseClient';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <aside className="sidebar">
      <img src={portifyLogo} alt="Portify Logo" className="sidebar-logo" />
      <nav className="nav-links">
        <Link to="/homepage">My Profile</Link>
        <Link to="/creations">Creations</Link>
        <Link to="/analytics">Analytics</Link>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </nav>
    </aside>
  );
}
