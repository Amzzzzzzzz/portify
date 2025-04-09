import React, { useContext, useState, useEffect } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import profilePic from './assets/profile-placeholder.jpg';
import Sidebar from './components/Sidebar';
import { ProfileContext } from './context/ProfileContext';
import { supabase } from './supabaseClient';

export default function ProfileEditor() {
  const navigate = useNavigate();
  const { profile, setProfile } = useContext(ProfileContext);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);

        await supabase.from('analytics').insert([
          {
            user_id: data.id,
            event_type: 'view',
            timestamp: new Date(),
          },
        ]);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      const skill = newSkill.trim();
      if (skill && !profile.skills.includes(skill)) {
        setProfile(prev => ({
          ...prev,
          skills: [...prev.skills, skill],
        }));
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Session missing. Please log in again.');
      return;
    }

    let imageUrl = profile.profile_image_url || '';

    if (profile.profileImage instanceof File) {
      const fileExt = profile.profileImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profile.profileImage, { upsert: true });

      if (uploadError) {
        alert('Failed to upload image.');
        return;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const updatedProfile = {
      id: user.id,
      name: profile.name,
      title: profile.title,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      skills: profile.skills,
      profile_image_url: imageUrl
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updatedProfile, { onConflict: ['id'] });

    if (error) {
      alert('Failed to save profile.');
    } else {
      alert('Profile saved successfully!');
      navigate('/homepage');
    }
  };

  return (
    <div className="homepage-wrapper">
      <Sidebar />
      <main className="profile-page">
        <div className="profile-header">
          <div className="profile-pic-container">
            {profile.profileImage ? (
              <>
                <img className="profile-pic" src={URL.createObjectURL(profile.profileImage)} alt="Profile" />
                <button className="remove-image" onClick={() => handleChange('profileImage', null)}>×</button>
              </>
            ) : profile.profile_image_url ? (
              <>
                <img className="profile-pic" src={profile.profile_image_url} alt="Profile from Supabase" />
                <button className="remove-image" onClick={() => handleChange('profileImage', null)}>×</button>
              </>
            ) : (
              <img className="profile-pic" src={profilePic} alt="Placeholder" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange('profileImage', e.target.files[0])}
              className="upload-input"
            />
          </div>

          <div className="profile-info">
            <input type="text" className="profile-name-input" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} />
            <input type="text" className="job-title-input" value={profile.title} onChange={(e) => handleChange('title', e.target.value)} />
            <input type="text" className="location-input" value={profile.location} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
        </div>

        <div className="contact-details">
          <input type="text" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input type="text" value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>

        <section className="bio">
          <h2>About Me</h2>
          <textarea value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} />
        </section>

        <section className="skills-section">
          <h2>Skills</h2>
          <ul className="skills-list">
            {profile.skills.map((skill, i) => (
              <li key={i} className="skill">
                {skill}
                <button className="remove-skill" onClick={() => handleRemoveSkill(i)}>×</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
          />
        </section>

        <div style={{ marginTop: '2rem' }}>
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        </div>
      </main>
    </div>
  );
}





