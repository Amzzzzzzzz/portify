import React, { useContext } from 'react';
import './TemplateStyles.css';
import { ProfileContext } from '../context/ProfileContext';

export default function Template3({ font, color, images, profile: propProfile }) {
  const context = useContext(ProfileContext);
  const profile = propProfile || context?.profile || {};

  return (
    <div className="template3" style={{ fontFamily: font }}>
      <div className="template3-header" style={{ backgroundColor: color }}>
        <h1 className="template-name">{profile.name}</h1>
        <p>{profile.title}</p>
      </div>

      <div className="template3-body">
        <section className="template3-bio">
          <h2 style={{ color }}>About Me</h2>
          <p>{profile.bio}</p>
        </section>

        <section className="template3-projects">
          <h2>Projects</h2>
          <div className="template3-gallery">
            {images.length > 0 ? (
              images.map((image, index) => {
                const src = image instanceof File ? URL.createObjectURL(image) : image;
                return (
                  <img
                    key={index}
                    src={src}
                    alt={`Project ${index + 1}`}
                    className="template3-image"
                  />
                );
              })
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}



