// SavedPortfolio.jsx
import React, { useContext } from 'react';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';
import { ProfileContext } from './context/ProfileContext';

export default function SavedPortfolio() {
  const { profile } = useContext(ProfileContext);

  if (!profile || !profile.template_id) {
    return <p>You haven't saved a portfolio yet.</p>;
  }

  const templateProps = {
    font: profile.font,
    color: profile.primary_colour,
    images: profile.project_images,
    profile
  };

  const TemplateMap = {
    template1: Template1,
    template2: Template2,
    template3: Template3,
    template4: Template4,
  };

  const SelectedTemplate = TemplateMap[profile.template_id];

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Your Saved Portfolio
      </h1>
      {SelectedTemplate ? <SelectedTemplate {...templateProps} /> : <p>Template not found.</p>}
    </div>
  );
}
