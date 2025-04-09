// components/ContactModal.jsx
import React, { useState } from 'react';
import './ContactModal.css';

export default function ContactModal({ freelancer, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📨 Contact message:', {
      to: freelancer.email,
      ...form,
    });

    alert('Message sent!');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Contact {freelancer.name}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required />
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
