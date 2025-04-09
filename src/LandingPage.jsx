import React, { useState } from 'react';
import './LandingPage.css';
import portifyLogo from './assets/Portify.png';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.psw.value;
    const repeatPassword = e.target['psw-repeat'].value;

    if (password !== repeatPassword) {
      alert('Passwords do not match');
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data?.user?.id || (await supabase.auth.getUser()).data.user?.id;

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      await supabase.from('profiles').insert([{
        id: userId,
        name: '',
        title: '',
        location: '',
        phone: '',
        email,
        bio: '',
        skills: [],
        profile_image_url: ''
      }]);
    }

    alert('Signup successful! Please check your email to confirm your account.');
    setShowSignup(false);
    navigate('/homepage');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.psw.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      setShowLogin(false);
      navigate('/homepage');
    }
  };

  return (
    <>
      <div className="user-buttons">
        <button className="button" onClick={() => setShowLogin(true)}>Log In</button>
        <button className="button" onClick={() => setShowSignup(true)}>Sign Up</button>
      </div>

      {showLogin && (
        <div className="modal">
          <form className="modal-content animate" onSubmit={handleLogin}>
            <span className="close" onClick={() => setShowLogin(false)}>&times;</span>
            <div className="container">
              <h2 className="font-auth">Log In</h2>
              <p>Please enter your credentials to log in.</p>
              <hr />
              <label><b>Email</b></label>
              <input type="text" placeholder="Enter Email" name="email" required />
              <label><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="psw" required />
              <label>
                <input type="checkbox" defaultChecked name="remember" /> Remember me
              </label>
              <div className="clearfix">
                <button type="button" className="cancelbutton" onClick={() => setShowLogin(false)}>Cancel</button>
                <button type="submit" className="loginbutton">Log In</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showSignup && (
        <div className="modal">
          <form className="modal-content animate" onSubmit={handleSignup}>
            <span className="close" onClick={() => setShowSignup(false)}>&times;</span>
            <div className="container">
              <h2 className="font-auth">Sign Up</h2>
              <p>Type in your email and create a password to make your account.</p>
              <hr />
              <label><b>Email</b></label>
              <input type="text" placeholder="Enter Email" name="email" required />
              <label><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="psw" required />
              <label><b>Repeat Password</b></label>
              <input type="password" placeholder="Repeat Password" name="psw-repeat" required />
              <label>
                <input type="checkbox" defaultChecked name="remember" /> Remember me
              </label>
              <div className="clearfix">
                <button type="button" className="cancelbutton" onClick={() => setShowSignup(false)}>Cancel</button>
                <button type="submit" className="signupbutton">Sign Up</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="container">
        <h1 className="landing-title">
          <img src={portifyLogo} alt="Portify Logo" />
        </h1>
        <p>
          Build your own portfolio <span style={{ fontWeight: 'bold', color: '#0052d4' }}>OR</span> discover and connect with freelancers on Portify!
        </p>

        <div className="header-line"></div>

        <button className="button" id="font-explore" onClick={() => navigate('/explore')}>
          Explore Freelancer Portfolios
        </button>

        <h2>How to Build Your Own Portfolio Website 😊</h2>
        <div className="steps">
          <div className="step">Step 1: Create an account or sign in to Portify.</div>
          <div className="step">Step 2: Choose your portfolio template or design your own.</div>
          <div className="step">Step 3: Customize your portfolio using fonts and colors.</div>
          <div className="step">Step 4: Host your site on the web.</div>
        </div>
      </div>
    </>
  );
}




