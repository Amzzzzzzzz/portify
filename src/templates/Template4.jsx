import React, { useContext } from 'react';
import './TemplateStyles.css';
import { ProfileContext } from '../context/ProfileContext';

export default function Template4({ font, color, images, profile: propProfile }) {
  const context = useContext(ProfileContext);
  const profile = propProfile || context?.profile || {};

  return (
    <div
      className="template4"
      style={{
        fontFamily: font,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="template4-header" style={{ backgroundColor: color }}>
        <div className="template4-left">
          <h1 style={{ color: 'white' }}>{profile.name}</h1>
          <p style={{ color: 'white' }}>{profile.title}</p>
        </div>
        <div className="template4-right">
          <h2 style={{ color }}>My Projects</h2>
          <div className="template4-gallery">
            {images.length > 0 ? (
              images.map((img, index) => {
                const src = img instanceof File ? URL.createObjectURL(img) : img;
                return (
                  <img
                    key={index}
                    src={src}
                    alt={`Project ${index + 1}`}
                    className="template4-image"
                  />
                );
              })
            ) : (
              <p className="placeholder-text">No project images uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      <section className="template4-about">
        <h2 style={{ color }}>About Me</h2>
        <p style={{ maxWidth: '600px', textAlign: 'center' }}>{profile.bio}</p>
      </section>
    </div>
  );
}







