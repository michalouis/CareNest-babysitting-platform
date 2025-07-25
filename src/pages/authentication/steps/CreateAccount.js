import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function CreateAccount({ role }) {
    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [amka, setAmka] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Error states
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatPasswordError, setRepeatPasswordError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [amkaError, setAmkaError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        letter: false,
        specialChar: false,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Open confirm dialog
    const handleConfirmDialogOpen = () => {
        setConfirmDialogOpen(true);
    };

    // Close confirm dialog
    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    // Try to create user, then store user data in the database. 
    // If AMKA is not unique, throw an error.
    const handleConfirm = async () => {
        setConfirmDialogOpen(false);
        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = res.user;

            // Check if AMKA is unique
            const amkaDoc = await getDoc(doc(FIREBASE_DB, 'users', amka));
            if (amkaDoc.exists()) {
                throw new Error('Account with this AMKA already exists.');
            }

            // Store user data in the database
            const userData = {
                email,
                firstName,
                lastName,
                amka,
                role,
                profileCreated: false,
            };

            if (role === 'nanny') {
                userData.jobPosted = false;
            }

            await setDoc(doc(FIREBASE_DB, 'users', user.uid), userData);

            navigate('/CareNest-babysitting-platform/create-profile'); // Navigate to the Createprofile page
        } catch (error) {
            console.error('Error creating user:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle the form submission (check for errors or empty fields), then open confirm dialog
    const handleSubmit = () => {
        let hasError = false;
        const newSnackbarMessages = [];
    
        if (firstNameError || !firstName) {
            hasError = true;
            newSnackbarMessages.push('First Name');
        }
        if (lastNameError || !lastName) {
            hasError = true;
            newSnackbarMessages.push('Last Name');
        if (amkaError || !amka) {
            hasError = true;
            newSnackbarMessages.push('AMKA');
        }
        if (emailError || !email) {
            hasError = true;
            newSnackbarMessages.push('Email');
        }
        if (passwordError || !password) {
            hasError = true;
            newSnackbarMessages.push('Password');
        }
        if (repeatPasswordError || !repeatPassword || repeatPassword !== password) {
            hasError = true;
            newSnackbarMessages.push('Repeat Password');
        }
        }
    
        if (newSnackbarMessages.length > 0) {
            setSnackbarMessage(`The following fields are incorrect: ${newSnackbarMessages.join(', ')}`);
        }
        if (!hasError) {
            handleConfirmDialogOpen();
        }
    };

    // Handle the first name blur event
    const handleFirstNameBlur = () => {
        if (!firstName || !/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏ]+$/.test(firstName)) {   // Check for only letters
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
    };
    
    // Handle the last name blur event
    const handleLastNameBlur = () => {
        if (!lastName || !/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏ]+$/.test(lastName)) {     // Check for only letters
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }
    };
    
    // Handle the AMKA blur event
    const handleAmkaBlur = () => {
        if (!amka || !/^\d{11}$/.test(amka)) {  // Check for 11 digits
            setAmkaError(true);
        } else {
            setAmkaError(false);
        }
    };

    // Handle the email blur event
    const handleEmailBlur = () => {
        const emailInput = document.getElementById('email-input');
        if (!emailInput.checkValidity()) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    // Handle the password blur event
    const handlePasswordBlur = () => {
        const lengthError = password.length < 8;                // Check for at least 8 characters
        const numberError = !/\d/.test(password);               // Check for at least one number
        const letterError = !/[a-zA-Z]/.test(password);         // Check for at least one letter
        const specialCharError = !/[!@#$%^&*]/.test(password);  // Check for at least one special character

        setPasswordErrors({
            length: lengthError,
            number: numberError,
            letter: letterError,
            specialChar: specialCharError,
        });

        setPasswordError(lengthError || numberError || letterError || specialCharError);
    };

    // Handle the repeat password blur event
    const handleRepeatPasswordBlur = () => {
        if (repeatPassword !== password) {
            setRepeatPasswordError(true);
        } else {
            setRepeatPasswordError(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <p className='description'>Fill in the details to finish your registration.</p>

            {/* Form */}
            <Box sx={{
                width: { xs: '95%', sm: '85%', md: '70%', lg: '50%' },
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--clr-white)',
                padding: '2rem 1rem',
                borderRadius: '1rem',
                boxShadow: '2',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <p style={{color: 'var(--clr-grey)'}}>
                    Account Type: <strong>{role === 'parent' ? 'Parent' : 'Nanny'}</strong>
                </p>
                {/* First & Last Name */}
                <TextField
                    id="first-name-input"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={handleFirstNameBlur}
                    error={firstNameError}
                    helperText={firstNameError ? 'Please enter a valid name (letters only)' : ''}
                />
    
                <TextField
                    id="last-name-input"
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={handleLastNameBlur}
                    error={lastNameError}
                    helperText={lastNameError ? 'Please enter a valid last name (letters only)' : ''}
                />
                
                {/* AMKA */}
                <TextField
                    id="amka-input"
                    label="AMKA"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={amka}
                    onChange={(e) => setAmka(e.target.value)}
                    onBlur={handleAmkaBlur}
                    error={amkaError}
                    helperText={amkaError ? 'Please enter a valid AMKA (11 digits)' : ''}
                />
                    
                {/* Email */}
                <TextField
                    id="email-input"
                    label="Email"
                    type="email"
                    variant="outlined"
                    bgColor="var(--clr-white)"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    error={emailError}
                    helperText={emailError ? 'Please enter a valid email address' : ''}
                />
    
                {/* Password, Password Requirements & Password Repeat */}
                <TextField
                    id="password-input"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    error={passwordError}
                    helperText={passwordError ? 'The password must meet the following requirements' : ''}
                />
                <p style={{ alignSelf: 'flex-start', margin: 0, textAlign: 'left' }}><b>Password must:</b></p>
                <ul style={{ alignSelf: 'flex-start', margin: 0, paddingLeft: '1.5rem', textAlign: 'left' }}>
                    <li style={{ color: passwordErrors.length ? 'var(--clr-error)' : 'var(--clr-black)' }}>Be at least 8 characters long.</li>
                    <li style={{ color: passwordErrors.number ? 'var(--clr-error)' : 'var(--clr-black)' }}>Contain at least one number.</li>
                    <li style={{ color: passwordErrors.letter ? 'var(--clr-error)' : 'var(--clr-black)' }}>Contain at least one letter.</li>
                    <li style={{ color: passwordErrors.specialChar ? 'var(--clr-error)' : 'var(--clr-black)' }}>Contain at least one special character (! @ # $ % _ -).</li>
                </ul>
                <TextField
                    id="repeat-password-input"
                    label="Repeat Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    onBlur={handleRepeatPasswordBlur}
                    error={repeatPasswordError}
                    helperText={repeatPasswordError ? 'Passwords do not match' : ''}
                />

                {/* Submit Button */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--clr-blue)',
                        '&:hover': {
                            opacity: '0.8',
                        },
                    }}
                    disabled={loading}
                >
                    <p className='big-button-text'>Sign up</p>
                </Button>
                {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />} {/* Loading bar */}
            </Box>
            
            {/* Confirm Submit Dialog */}
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Are you sure?</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to proceed?<br />
                        <strong>Please check your details before submitting.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirm} sx={{ backgroundColor: 'var(--clr-blue)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Submit</p>
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ marginRight: '0.5rem' }}
            >
                <Alert onClose={() => setSnackbarMessage('')} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );    
}

export default CreateAccount;