import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Avatar, Typography } from '@mui/material';

const ProfilePictureUpload = forwardRef((props, ref) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const Image = event.target.files[0];
        if (Image) {
            setSelectedImage(Image);
            const imagePreview = URL.createObjectURL(Image);
            setPreview(imagePreview);
        }
    };

    useImperativeHandle(ref, () => ({
        getSelectedImage() {
            return selectedImage;
        },
        async uploadImage() {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('profile_picture', selectedImage);

                // Envoie l'image au serveur
                await fetch(`${process.env.REACT_APP_API_URL}/upload-profile-picture`, {
                    method: 'POST',
                    body: formData,
                });
            }
        }
    }));

    return (
        <div>
            <input
                type="file"
                accept="image/jpeg"
                onChange={handleImageChange}
            />
            {selectedImage && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="subtitle1">Image Preview:</Typography>
                    {preview && <Avatar src={preview} style={{ maxWidth: '100%', maxHeight: '300px' }}/>}
                </div>
            )}
        </div>
    );
});

export default ProfilePictureUpload;
