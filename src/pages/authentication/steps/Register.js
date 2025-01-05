import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatPasswordError, setRepeatPasswordError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        letter: false,
        specialChar: false,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDialogOpen = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirm = () => {
        setConfirmDialogOpen(false);
        setSnackbarOpen(true);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Repeat Password:', repeatPassword);
        navigate('/createprofile'); // Navigate to the Createprofile page
    };

    const handleSubmit = () => {
        let hasError = false;

        const emailInput = document.getElementById('email-input');
        if (!emailInput.checkValidity()) {
            setEmailError(true);
            hasError = true;
        } else {
            setEmailError(false);
        }

        if (!password) {
            setPasswordError(true);
            hasError = true;
        } else {
            const lengthError = password.length < 8;
            const numberError = !/\d/.test(password);
            const letterError = !/[a-zA-Z]/.test(password);
            const specialCharError = !/[!@#$%^&*]/.test(password);

            setPasswordErrors({
                length: lengthError,
                number: numberError,
                letter: letterError,
                specialChar: specialCharError,
            });

            if (lengthError || numberError || letterError || specialCharError) {
                setPasswordError(true);
                hasError = true;
            } else {
                setPasswordError(false);
            }
        }

        if (!repeatPassword) {
            setRepeatPasswordError(true);
            hasError = true;
        } else if (repeatPassword !== password) {
            setRepeatPasswordError(true);
            hasError = true;
        } else {
            setRepeatPasswordError(false);
        }

        if (!hasError) {
            handleConfirmDialogOpen();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEmailBlur = () => {
        const emailInput = document.getElementById('email-input');
        if (!emailInput.checkValidity()) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handlePasswordBlur = () => {
        const lengthError = password.length < 8;
        const numberError = !/\d/.test(password);
        const letterError = !/[a-zA-Z]/.test(password);
        const specialCharError = !/[!@#$%^&*]/.test(password);

        setPasswordErrors({
            length: lengthError,
            number: numberError,
            letter: letterError,
            specialChar: specialCharError,
        });

        setPasswordError(lengthError || numberError || letterError || specialCharError);
    };

    const handleRepeatPasswordBlur = () => {
        if (repeatPassword !== password) {
            setRepeatPasswordError(true);
        } else {
            setRepeatPasswordError(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Create an account</p>
            <Box sx={{ width: { xs: '95%', sm: '85%', md: '70%', lg: '50%' }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--clr-white)', padding: '1rem', borderRadius: '1rem', boxShadow: '2' }}>
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
                    helperText={passwordError ? 'Password must meet the requirements below' : ''}
                />
                <ul style={{ alignSelf: 'flex-start', margin: 0, paddingLeft: '1.5rem', textAlign: 'left' }}>
                    <li style={{ color: passwordErrors.length ? 'red' : 'inherit' }}>Password must be at least 8 characters.</li>
                    <li style={{ color: passwordErrors.number ? 'red' : 'inherit' }}>Password must contain at least one number.</li>
                    <li style={{ color: passwordErrors.letter ? 'red' : 'inherit' }}>Password must contain at least one letter.</li>
                    <li style={{ color: passwordErrors.specialChar ? 'red' : 'inherit' }}>Password must contain at least one special character (! @ # $ % _ -).</li>
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
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        fontSize: '1.5rem',
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--clr-blue)',
                        color: 'var(--clr-white)',
                        '&:hover': {
                            backgroundColor: 'var(--clr-blue)',
                        },
                    }}
                >
                    Εγγραφή
                </Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Submit successful!
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Terms and Conditions</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to submit the form?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Register;