import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import GoogleMapsLoader from '../../components/GoogleMapsLoader';
import ConfirmationDialog from '../../components/ConfirmationDialog';

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
        dial_code: '',
        profile_picture_url: ''
    });
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [openDialog, setOpenDialog] = useState(false);

    const [initialUserData, setInitialUserData] = useState({}); // Pour stocker les données initiales
    const [isModified, setIsModified] = useState(false); // État pour suivre les modifications
    const [emailError, setEmailError] = useState(false);
    const [secondaryEmailError, setSecondaryEmailError] = useState(false);
    const [formError, setFormError] = useState('');

    // Cette fonction vérifie si l'état utilisateur a changé par rapport à l'état initial
    const checkIfModified = (updatedUser) => {
        const isModified = JSON.stringify(updatedUser) !== JSON.stringify(initialUserData);
        setIsModified(isModified);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
    
                        const cleanedData = {
                            ...data,
                            username: data.username || '',
                            email: data.email || '',
                            password: data.password || '',
                            birthday: convertToDateInputFormat(data.birthday) || '',
                            secondary_email: data.secondary_email || '',
                            first_name: data.first_name || '',
                            last_name: data.last_name || '',
                            postal_address: data.postal_address || '',
                            phone_number: formatPhoneNumber(data.phone_number || ''), // Formate le numéro de téléphone ici
                            dial_code: data.dial_code || '+33',
                            profile_picture_url: data.profile_picture_url || ''
                        };
    
                        setUser(cleanedData);
                        setInitialUserData(cleanedData); // Stocke les données initiales
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

        // Détermine si les données ont été modifiées
        setIsModified(JSON.stringify({ ...user, [name]: formattedValue }) !== JSON.stringify(initialUserData));
        
        if (name === 'email') {
            validateEmail(value);
        }
        if (name === 'secondary_email') {
            validateSecondaryEmail(value);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailRegex.test(email));
    };

    const validateSecondaryEmail = (email) => {
        if (email === '') {
            setSecondaryEmailError(false); // Pas d'erreur si le champ est vide
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setSecondaryEmailError(!emailRegex.test(email));
        }
    };

    const convertToDateInputFormat = (isoDate) => {
        if (!isoDate) return ''; // Retourner une chaîne vide si la date est nulle ou undefined
        return new Date(isoDate).toISOString().split('T')[0];
    };

    const handlePhoneChangeAndInput = (value, data) => {
        // Define formattedDialCode with the "+" sign
        const formattedDialCode = `+${data.dialCode}`;
    
        // Call handlePhoneChange with formattedDialCode
        handlePhoneChange(formattedDialCode, data);
    
        // Call handleInputChange with a synthetic event to simulate a text field change
        handleInputChange({
            target: {
                name: 'dial_code',
                value: formattedDialCode,
            }
        });
    };

    const handlePhoneChange = (formattedDialCode, data) => {
        setUser({ 
            ...user, 
            dial_code: formattedDialCode // Update dial_code with "+"
        });
    };

    const handlePhoneInputChange = (e) => {
        const { value } = e.target;
        
        // Formater le numéro de téléphone avec des espaces
        const formattedPhoneNumber = formatPhoneNumber(value);
        
        // Mettre à jour l'état avec le numéro de téléphone formaté
        setUser({ ...user, phone_number: formattedPhoneNumber });
    
        // Mettre à jour le statut modifié si nécessaire
        setIsModified(JSON.stringify({ ...user, phone_number: formattedPhoneNumber }) !== JSON.stringify(initialUserData));
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Retirer tout ce qui n'est pas un chiffre
        let cleaned = ('' + phoneNumber).replace(/\D/g, '');
        
        // Ajouter des espaces après chaque deux chiffres
        let formatted = cleaned.match(/.{1,2}/g)?.join(' ') || cleaned;
        
        return formatted;
    };

    const handleSave = async () => {
        // Nettoyer les espaces du numéro de téléphone juste avant l'envoi
        const cleanedPhoneNumber = user.phone_number.replace(/\s+/g, '');
    
        // Validation de la longueur du numéro de téléphone
        if (cleanedPhoneNumber.length !== 10 && cleanedPhoneNumber.length !== 0) {
            setFormError('Le numéro de téléphone doit contenir 10 chiffres.');
            return;
        }

        // Mettre à jour l'objet utilisateur avec le numéro de téléphone nettoyé
        const updatedUser = {
            ...user,
            phone_number: cleanedPhoneNumber,
        };

        // Vérifier qu'il n'y a pas d'erreurs de formulaire
        if (!emailError && !secondaryEmailError) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUser), // Utiliser updatedUser ici
                });

                if (response.ok) {
                    console.log("User data updated successfully");
                    setUsername(user.username);
                    setInitialUserData(updatedUser); // Met à jour les données initiales après la sauvegarde
                    setIsModified(false); // Réinitialise le statut de modification
                    setFormError(''); // Réinitialise le message d'erreur (cache le message)
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

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmUnsubscribe = () => {
        handleUnsubscribe();
        handleCloseDialog();
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
                        error={secondaryEmailError}
                        helperText={secondaryEmailError ? "Please enter a valid email address." : ""}
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
                    <GoogleMapsLoader
                        user={user}
                        setUser={(updatedUser) => {
                            setUser(updatedUser);
                            checkIfModified(updatedUser);
                        }}
                    />
                    <Box display="flex" alignItems="center" style={{ marginTop: '16px' }}>
                        <Box flex="1" style={{ maxWidth: '25%' }}>
                            <PhoneInput
                                country={user.dial_code || 'fr'}
                                value={user.dial_code}
                                onChange={handlePhoneChangeAndInput}
                                inputProps={{
                                    name: 'dial_code',
                                    readOnly: true,
                                }}
                                inputStyle={{ width: '100%' }}
                                onlyCountries={['fr']} // Liste des pays autorisés, modifiez selon vos besoins ['us', 'fr', 'de', 'it']
                            />
                        </Box>
                        <Box flex="2" style={{ maxWidth: '75%', marginLeft: '10px' }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Phone Number"
                            name="phone_number"
                            value={user.phone_number}
                            onChange={handlePhoneInputChange}
                            inputProps={{ maxLength: 14 }}
                            style={{ marginTop: 0, marginBottom: 0 }}
                            error={!!formError} // Indique une erreur visuelle si formError est défini
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

                    {isModified && ( // Affiche le bouton uniquement si le formulaire a été modifié
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}

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
                        onClick={handleOpenDialog}
                        style={{ marginTop: '20px' }}
                    >
                        Unsubscribe
                    </Button>
                </Box>
            </Paper>
            
            {/* Modal de confirmation */}
            <ConfirmationDialog
                open={openDialog}
                title="Confirm Unsubscribe"
                message="Are you sure you want to unsubscribe? This action cannot be undone."
                onConfirm={handleConfirmUnsubscribe}
                onClose={handleCloseDialog}
                context="unsubscribe"
            />
        </Container>
    );
};

export default Profile;