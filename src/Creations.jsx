import React, { useState, useContext, useEffect } from 'react';
import './Creations.css';
import Sidebar from './components/Sidebar';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';
import { ProfileContext } from './context/ProfileContext';
import { supabase } from './supabaseClient';

export default function Creations() {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [mainColour, setMainColour] = useState('#0052d4');
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [images, setImages] = useState([]);
  const { profile, setProfile } = useContext(ProfileContext);

  useEffect(() => {
    if (profile?.project_images?.length) {
      setImages(profile.project_images);
    }
  
    if (profile?.template_id) {
      setSelectedTemplate(profile.template_id);
    }
  
    if (profile?.font) {
      setFontFamily(profile.font);
    }
  
    if (profile?.primary_color) {
      setMainColour(profile.primary_colour);
    }
  }, [profile]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    const uploadedUrls = [];

    for (const file of files) {
      const filePath = `${profile.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, file);

      if (uploadError) {
        console.error('Upload failed:', uploadError.message);
        alert('One or more images failed to upload.');
        return;
      }

      const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    setImages(uploadedUrls);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const renderTemplate = () => {
    const props = { font: fontFamily, color: mainColour, images, profile };
    switch (selectedTemplate) {
      case 'template1': return <Template1 {...props} />;
      case 'template2': return <Template2 {...props} />;
      case 'template3': return <Template3 {...props} />;
      case 'template4': return <Template4 {...props} />;
      default: return null;
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      alert('Session expired. Please log in again.');
      return;
    }

    const update = {
      id: user.id,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      project_images: images,
      template_id: selectedTemplate,
      font: fontFamily,
      primary_colour: mainColour,
      is_published: profile.is_published || false,
    };

    const { error: updateError } = await supabase.from('profiles').upsert(update, { onConflict: ['id'] });

    if (updateError) {
      console.error('Save error:', updateError.message);
      alert('Failed to save portfolio.');
    } else {
      alert('Portfolio saved successfully!');
    }
  };

  return (
    <div className="creations-wrapper">
      <Sidebar />
      <main className="creations-page">
        <h1 className="creations-title">Create Your Portfolio</h1>

        <div className="editable-fields">
          <input
            type="text"
            placeholder="Your Name"
            value={profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Title"
            value={profile.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
          />
          <textarea
            placeholder="About You"
            value={profile.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
          />
        </div>

        <div className="controls">
          <div className="control-group">
            <label>Choose Template:</label>
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
              <option value="template3">Template 3</option>
              <option value="template4">Template 4</option>
            </select>
          </div>

          <div className="control-group">
            <label>Pick Font:</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
            </select>
          </div>

          <div className="control-group">
            <label>Pick Color:</label>
            <input type="color" value={mainColour} onChange={(e) => setMainColour(e.target.value)} />
          </div>

          <div className="control-group">
            <label>Upload Project Images:</label>
            <label className="file-upload">
              Upload Images
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            </label>

            <small>(Max 10 images)</small>
          </div>
        </div>

        {images.length > 0 && (
          <div className="image-preview-row">
            {images.map((url, index) => (
              <div key={index} className="image-preview-box">
                <img src={url} alt={`upload-${index}`} />
                <button className="remove-button" onClick={() => handleRemoveImage(index)}>×</button>
              </div>
            ))}
          </div>
        )}

        <div className="save-button-wrapper">
          <button className="save-button" onClick={handleSave}>
            Save Portfolio
          </button>
        </div>

        <div className="publish-toggle">
          <label>
            <input
              type="checkbox"
              checked={profile.is_published || false}
              onChange={async (e) => {
                const updated = {
                  ...profile,
                  is_published: e.target.checked,
                };
                setProfile(updated);

                const { error } = await supabase
                  .from('profiles')
                  .update({ is_published: e.target.checked })
                  .eq('id', profile.id);

                if (error) {
                  alert('Error updating publish status.');
                }
              }}
            />
            Publish this portfolio
          </label>
        </div>


        <div className="preview">
          <h2>Live Preview</h2>
          {renderTemplate()}
        </div>
      </main>
    </div>
  );
}









