import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        birthday: '',
        secondary_email: '',
        first_name: '',
        last_name: '',
        postal_address: '',
        phone_number: '',
        dialCode: '',
        profile_picture_url: ''
    });
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    
    const [emailError, setEmailError] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        const defaultDialCode = 'fr'; // Vous pouvez choisir l'indicatif par défaut que vous préférez
                        setUser({
                            ...data,
                            dialCode: data.dialCode || defaultDialCode
                        });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Capitaliser la première lettre pour "first_name" et "last_name"
        const formattedValue = (name === 'first_name' || name === 'last_name') 
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : value;

        setUser({ ...user, [name]: formattedValue });

        if (name === 'email') {
            validateEmail(value);
        }
    };

    const handlePhoneChange = (value, data) => {
        // `data` contient l'indicatif sélectionné
        setUser({ 
            ...user, 
            dialCode: data.dialCode // Met à jour l'indicatif
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailRegex.test(email));
    };

    const handleSave = async () => {
        if (!emailError) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    console.log("User data updated successfully");
                    setUsername(user.username);
                } else {
                    console.error("Failed to update user data:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating user data:", error);
            }
        } else {
            setFormError('Please correct the errors before saving.');
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/unsubscribe/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Unsubscribe successful");
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                setUsername(''); 
                navigate('/'); 
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
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                        error={emailError}
                        helperText={emailError ? "Please enter a valid email address." : ""}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Birthday"
                        name="birthday"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={user.birthday}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Secondary Email"
                        name="secondary_email"
                        type="email"
                        value={user.secondary_email}
                        onChange={handleInputChange}
                        error={emailError}
                        helperText={emailError ? "Please enter a valid email address." : ""}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="first_name"
                        value={user.first_name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Postal Address"
                        name="postal_address"
                        value={user.postal_address}
                        onChange={handleInputChange}
                    />
                    <Box display="flex" alignItems="center" style={{ marginTop: '16px' }}>
                        <Box flex="1" style={{ maxWidth: '25%' }}>
                            <PhoneInput
                                country={user.indicatif || 'fr'}
                                value={user.indicatif}
                                onChange={handlePhoneChange}
                                inputProps={{
                                    name: 'phone_number',
                                    required: true,
                                    autoFocus: true,
                                    readOnly: true,
                                }}
                                inputStyle={{ width: '100%' }}
                            />
                        </Box>
                        <Box flex="2" style={{ maxWidth: '75%', marginLeft: '10px' }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Phone Number"
                                name="phone_number"
                                value={user.phone_number}
                                onChange={handleInputChange}
                                style={{ marginTop: 0, marginBottom: 0 }} // Assure que le champ de texte ne rajoute pas de marges
                            />
                        </Box>
                    </Box>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Profile Picture URL"
                        name="profile_picture_url"
                        value={user.profile_picture_url}
                        onChange={handleInputChange}
                    />

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </Box>

                    {formError && (
                        <Typography color="error" style={{ marginTop: '10px' }}>
                            {formError}
                        </Typography>
                    )}
                </form>

                <Box mt={4}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleUnsubscribe}
                        style={{ marginTop: '20px' }}
                    >
                        Unsubscribe
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
