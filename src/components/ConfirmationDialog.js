import React, { useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import ProfilePictureUpload from './ProfilePictureUpload';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, context }) => {

    const userId = localStorage.getItem('userId');
    const uploadRef = useRef(); // Crée une référence pour le composant ProfilePictureUpload

    const handleUploadClick = async () => {
        if (uploadRef.current) {
            await uploadRef.current.uploadImage(); // Appelle la méthode d'upload de ProfilePictureUpload
            onConfirm(); // Fermer la modal ou autre action après l'upload
        }
    };

    const renderContent = () => {
        switch(context) {
            case 'unsubscribe':
                return (
                    <DialogContentText>{message}</DialogContentText>
                );
            case 'upload-profile-picture':
                return (
                     <ProfilePictureUpload ref={uploadRef} userId={userId} />
                );
            default:
                return (
                    <DialogContentText>{message}</DialogContentText>
                );
        }
    };

    const renderButton = () => {
        switch(context) {
            case 'unsubscribe':
                return (
                    <Button 
                        onClick={onConfirm} 
                        color="error" 
                        variant="contained" 
                        startIcon={<DeleteIcon />}  // Icône pour "unsubscribe"
                    >
                        Delete
                    </Button>
                );
            case 'validate':
                return (
                    <Button 
                        onClick={onConfirm} 
                        color="primary" 
                        variant="contained" 
                        endIcon={<SendIcon />}  // Icône pour "validate"
                    >
                        Confirm
                    </Button>
                );
            case 'upload-profile-picture':
                return (
                    <Button 
                        onClick={handleUploadClick} 
                        color="primary" 
                        variant="contained" 
                        startIcon={<UploadIcon />}  // Icône pour "upload"
                    >
                        Upload
                    </Button>
                );
            default:
                return (
                    <Button 
                        onClick={onConfirm} 
                        color="primary" 
                        variant="contained"
                    >
                        Confirm
                    </Button>
                );
        }
    };
    
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={false}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                {renderButton()}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
