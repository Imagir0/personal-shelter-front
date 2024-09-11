import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, context }) => {

    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const fileURL = URL.createObjectURL(file);
            setSelectedFile(fileURL); // Store the file URL for preview
        } else {
            setSelectedFile(null); // Reset if not an image
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
                        onClick={onConfirm} 
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
        setSelectedFile(null); // Clear the selected file when closing the dialog
        onClose(); // Call the original onClose function
    };

    return (
        <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={false}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>

                {context === 'upload-profile-picture' && (
                    <>
                        <input
                            type="file"
                            accept="image/jpeg"
                            onChange={handleFileChange}
                        />
                        {selectedFile && (
                            <div style={{ marginTop: '20px' }}>
                                <Typography variant="subtitle1">Image Preview:</Typography>
                                <img src={selectedFile} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                            </div>
                        )}
                    </>
                )}

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
