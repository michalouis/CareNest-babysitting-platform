import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import './contact.css';

function ContactBox() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'You have to fill the text field';
        if (!email) {
            newErrors.email = 'You have to fill the text field';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!message) newErrors.message = 'You have to fill the text field';

        if (Object.keys(newErrors).length === 0) {
            setOpen(true);
            setName('');
            setEmail('');
            setMessage('');
        } else {
            setErrors(newErrors);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (errors.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        if (errors.message) {
            setErrors((prevErrors) => ({ ...prevErrors, message: '' }));
        }
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'var(--clr-white)',
                    padding: '2rem',
                    margin: '1rem',
                    borderRadius: '1rem',
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1 className="Box-title">Επικοινωνήστε μαζί μας</h1>
                <p className="contact-description">
                    Συμπληρώστε την παρακάτω φόρμα για να επικοινωνήσετε μαζί μας. Θα χαρούμε να σας βοηθήσουμε!
                </p>
                <TextField
                    label="Όνομα"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Μήνυμα"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={message}
                    onChange={handleMessageChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '1rem' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: 'var(--clr-purple-main)',
                        color: 'var(--clr-white)',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    }}
                >
                    Αποστολή
                </Button>
                <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Send
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}

export default ContactBox;