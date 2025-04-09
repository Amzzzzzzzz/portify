import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Creations from './Creations';
import Analytics from './Analytics';
import LandingPage from './LandingPage';
import ProfileEditor from './ProfileEditor';
import { ProfileProvider } from './context/ProfileContext';
import PortfolioViewer from './PortfolioViewer';
import SavedPortfolio from './SavedPortfolio';
import ExplorePortfolios from './ExplorePortfolios';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/homepage"
        element={
          <ProfileProvider>
            <Homepage />
          </ProfileProvider>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProfileProvider>
            <ProfileEditor />
          </ProfileProvider>
        }
      />
      <Route
        path="/creations"
        element={
          <ProfileProvider>
            <Creations />
          </ProfileProvider>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProfileProvider>
            <Analytics />
          </ProfileProvider>
        }
      />
      <Route
         path="/portfolio/:userId" 
      element={
      <PortfolioViewer />} />

      <Route
        path="/saved-portfolio"
        element={
      <ProfileProvider>
        <SavedPortfolio />
      </ProfileProvider>
    }
    />
    <Route path="/explore"
      element={
      <ExplorePortfolios />} />

    </Routes>
  );
}

export default App;




