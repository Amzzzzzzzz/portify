import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('⚠️ Auth session missing or user not found!');
        navigate('/');
        return;
      }

      console.log('✅ Fetching profile for user ID:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error.message);
      } else {
        console.log('✅ Profile loaded:', data);
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // While loading, block rendering
  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}


