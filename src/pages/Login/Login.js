import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { setUsername } = useContext(UserContext); // Utiliser le contexte pour mettre à jour le nom d'utilisateur
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful");

                localStorage.setItem('userId', data.userId); 
                localStorage.setItem('username', data.username);           
                setUsername(data.username);

                navigate('/profile'); // Redirection vers la page de profil
            } else {
                const data = await response.json();
                console.error("Login failed:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin} noValidate autoComplete="off">
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
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
