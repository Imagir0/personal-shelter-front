import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, context }) => {

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

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                {renderButton()}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
