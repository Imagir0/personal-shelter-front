import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';
import Navbar from './components/Navbar'; // Importation du composant Navbar
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
