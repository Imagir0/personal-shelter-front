import React, { useState } from 'react';
import { Avatar, Button } from '@mui/material';

const ProfilePictureUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const imagePreview = URL.createObjectURL(file);
            setPreview(imagePreview); // Gérer l'aperçu de l'image
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('profile_picture', selectedImage);

        // Envoie la photo au serveur
        await fetch(`${process.env.REACT_APP_API_URL}/upload-profile-picture`, {
            method: 'POST',
            body: formData,
        });
    };

    return (
        <div>
            <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ marginBottom: '20px' }}
            />
            {preview && <Avatar src={preview} alt="Profile Preview" />}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Upload
            </Button>
        </div>
    );
};

export default ProfilePictureUpload;
