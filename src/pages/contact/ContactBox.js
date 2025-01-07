import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import '../../style.css';

function ContactBox() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Function to validate email (xxxx@xxxx.xxx)
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async () => {
        const newErrors = {};
        if (!name) newErrors.name = 'You have to fill the text field';
        if (!email) {
            newErrors.email = 'You have to fill the text field';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!message) newErrors.message = 'You have to fill the text field';

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                await addDoc(collection(FIREBASE_DB, 'messages'), {
                    name,
                    email,
                    message,
                    timestamp: new Date(),  // date it was sent
                });
                setOpen(true);
                setName('');
                setEmail('');
                setMessage('');
            } catch (error) {
                console.error('Error adding document: ', error);
            } finally {
                setLoading(false);
            }
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
                    position: 'relative',
                    overflow: 'hidden', // for loading bar
                }}
            >
                {/* Title and description */}
                <h1 style={{
                    color: 'var(--clr-purple-main)',
                    marginBottom: '1rem',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                }}>
                    Επικοινωνήστε μαζί μας
                </h1>
                <p style={{
                   marginBottom: '2rem',
                   textAlign: 'center',
                   fontSize: '1rem',
                }}>
                    Συμπληρώστε την παρακάτω φόρμα για να επικοινωνήσετε μαζί μας. Θα χαρούμε να σας βοηθήσουμε!
                </p>

                {/* Form */}
                <TextField
                    label="Όνομα"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                    error={!!errors.name}
                    helperText={errors.name}
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
                    sx={{ marginBottom: '1rem' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: 'var(--clr-purple-main)',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    }}
                    disabled={loading}
                >
                    <p className='button-text'>Αποστολή</p>
                </Button>

                {/* Success popup */}
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Send
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}

export default ContactBox;