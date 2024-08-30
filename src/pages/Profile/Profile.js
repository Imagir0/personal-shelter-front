import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Assurez-vous que userId est stocké et récupéré correctement

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                    } else {
                        console.error('Failed to fetch user data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.error('User ID is undefined.');
            }
        };

        fetchUserData();
    }, [userId]);

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/unsubscribe/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Unsubscribe successful");
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                setUsername(''); // Réinitialiser l'état local du nom d'utilisateur
                navigate('/'); // Rediriger vers la page d'accueil
            } else {
                console.error("Failed to unsubscribe:", response.statusText);
            }
        } catch (error) {
            console.error("Error during unsubscribe:", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={handleUnsubscribe} style={{ background: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
                Unsubscribe
            </button>
        </div>
    );
};

export default Profile;
