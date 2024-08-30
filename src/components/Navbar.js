import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { username, setUsername } = useContext(UserContext);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setUsername(''); // Réinitialise le nom d'utilisateur dans le contexte
        navigate('/login'); // Redirige vers la page de connexion
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Rediriger vers la page de profil
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff' }}>
            {/* Texte cliquable pour revenir à la page d'accueil */}
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
                Personal-Shelter
            </Link>

            {/* Menu utilisateur */}
            {username ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                        onClick={handleProfileClick}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                    >
                        Bienvenue {username}
                    </span>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
