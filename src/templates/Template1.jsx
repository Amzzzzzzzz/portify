import React, { useContext } from 'react';
import './TemplateStyles.css';
import { ProfileContext } from '../context/ProfileContext';

export default function Template1({ font, color, images, profile: propProfile }) {
  const context = useContext(ProfileContext);
  const profile = propProfile || context?.profile || {};

  return (
    <div className="template1" style={{ fontFamily: font, color: color }}>
      <header className="template1-header" style={{ backgroundColor: color }}>
        <h1 className="template-name">{profile.name}</h1>
        <p>{profile.title}</p>
      </header>

      <section className="template1-about">
        <h2>About Me</h2>
        <p>{profile.bio}</p>
      </section>

      <section className="template1-projects">
        <h2>Projects</h2>
        <div className="template1-gallery">
          {images.length > 0 ? (
            images.map((image, index) => {
              const src = image instanceof File ? URL.createObjectURL(image) : image;
              return (
                <img
                  key={index}
                  src={src}
                  alt={`Project ${index + 1}`}
                  className="template1-image"
                />
              );
            })
          ) : (
            <p>No images uploaded.</p>
          )}
        </div>
      </section>
    </div>
  );
}



