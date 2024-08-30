import React, { useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { Link } from 'react-router-dom';

const Auth = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [notification, setNotification] = useState('');

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    const handleRegisterSuccess = () => {
        setNotification("Un mail vient de vous être envoyé à l'adresse renseignée");
    };

    const handleResetNotification = () => {
        setNotification(''); // Réinitialiser le message de notification
        setIsRegistering(false); // Afficher le formulaire de connexion
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>

            {notification ? (
                <div>
                    <p style={{ color: 'green' }}>{notification}</p>
                    <button onClick={handleResetNotification} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Retour à la page de connexion
                    </button>
                </div>
            ) : (
                <>
                    <button onClick={handleToggle} style={{ marginBottom: '20px' }}>
                        {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                    </button>
                    {isRegistering ? <Register onRegisterSuccess={handleRegisterSuccess} /> : <Login />}
                </>
            )}
        </div>
    );
};

export default Auth;
