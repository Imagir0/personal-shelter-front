import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css';

const HomePage = () => {

  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login'); // Redirige vers la page Login
  };
  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirige vers la page Register
  };
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/`)
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>{message}</h1>
        <p>Your personal space to manage and protect your files.</p>
      </header>
        <button onClick={handleRegisterRedirect}>
          Register
        </button>
    </div>
  );
}

export default HomePage;
