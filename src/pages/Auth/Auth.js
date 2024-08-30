import React, { useState } from 'react';
import Login from '../Login/Login'; // Assurez-vous que le chemin est correct
import Register from '../Register/Register'; // Assurez-vous que le chemin est correct

const Auth = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <button onClick={handleToggle} style={{ marginBottom: '20px' }}>
                {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
            </button>
            {isRegistering ? <Register /> : <Login />}
        </div>
    );
};

export default Auth;
