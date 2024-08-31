import React, { useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

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
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px' }}>
                {notification ? (
                    <Box textAlign="center">
                        <Typography variant="body1" color="success.main" gutterBottom>
                            {notification}
                        </Typography>
                        <Button
                            onClick={handleResetNotification}
                            variant="text"
                            color="primary"
                        >
                            Retour à la page de connexion
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Button
                            onClick={handleToggle}
                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '20px' }}
                        >
                            {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                        </Button>
                        {isRegistering ? (
                            <Register onRegisterSuccess={handleRegisterSuccess} />
                        ) : (
                            <Login />
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Auth;
