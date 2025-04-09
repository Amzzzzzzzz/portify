import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';

export default function PortfolioViewer() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        setErrorMsg('Could not fetch portfolio.');
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [userId]);

  if (errorMsg) return <p>{errorMsg}</p>;
  if (!profile) return <p>Loading...</p>;

  const templateProps = {
    font: profile.font,
    color: profile.primary_colour,
    images: profile.project_images,
    profile
  };

  const templates = {
    template1: Template1,
    template2: Template2,
    template3: Template3,
    template4: Template4
  };

  const SelectedTemplate = templates[profile.template_id];

  return SelectedTemplate ? (
    <SelectedTemplate {...templateProps} />
  ) : (
    <p>This user hasn't published a portfolio yet.</p>
  );
}


  