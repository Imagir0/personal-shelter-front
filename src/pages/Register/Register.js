import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const Register = ({ onRegisterSuccess }) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        birthday: '',
        secondary_email: '',
        first_name: '',
        last_name: '',
        postal_address: '',
        phone_number: '',
        profile_picture_url: ''
    });
    const [isRegistered, setIsRegistered] = useState(false); // Pour contrôler l'affichage du formulaire

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                console.log("Registration successful");
                setIsRegistered(true); // Cacher le formulaire et afficher le message de succès
                onRegisterSuccess(); // Appeler la fonction parent pour afficher le message de succès
            } else {
                const data = await response.json();
                console.error("Registration failed:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (isRegistered) {
        return null; // Ne plus afficher le formulaire après l'inscription réussie
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister} noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <Box mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Register
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;
