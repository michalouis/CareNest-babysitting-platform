import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from '@mui/material';
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
                throw new Error('Υπάρχει ήδη λογαριασμός με αυτό το ΑΜΚΑ.');
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

            navigate('/create-profile'); // Navigate to the Createprofile page
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
    
        if (emailError || !email) hasError = true;
        if (passwordError || !password) hasError = true;
        if (repeatPasswordError || !repeatPassword || repeatPassword !== password) hasError = true;
        if (firstNameError || !firstName) hasError = true;
        if (lastNameError || !lastName) hasError = true;
        if (amkaError || !amka) hasError = true;
    
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
            <p className='description'>Συμπληρώστε τα στοιχεία για να εγγραφείτε στο σύστημα.</p>

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
                    Τύπος Λογαριασμού: <strong>{role === 'parent' ? 'Γονέας' : 'Νταντά'}</strong>
                </p>
                {/* First & Last Name */}
                <TextField
                    id="first-name-input"
                    label="Όνομα"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={handleFirstNameBlur}
                    error={firstNameError}
                    helperText={firstNameError ? 'Παρακαλώ εισάγετε ένα έγκυρο όνομα (μόνο γράμματα)' : ''}
                />

                <TextField
                    id="last-name-input"
                    label="Επίθετο"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={handleLastNameBlur}
                    error={lastNameError}
                    helperText={lastNameError ? 'Εισάγετε ένα έγκυρο επώνυμο (μόνο γράμματα)' : ''}
                />
                
                {/* AMKA */}
                <TextField
                    id="amka-input"
                    label="ΑΜΚΑ"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={amka}
                    onChange={(e) => setAmka(e.target.value)}
                    onBlur={handleAmkaBlur}
                    error={amkaError}
                    helperText={amkaError ? 'Εισάγετε ένα έγκυρο ΑΜΚΑ (11 αριθμοί)' : ''}
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
                    helperText={emailError ? 'Εισάγετε μια έγκυρη διεύθυνση mail' : ''}
                />

                {/* Password, Password Requirements & Password Repeat */}
                <TextField
                    id="password-input"
                    label="Κωδικός"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    error={passwordError}
                    helperText={passwordError ? 'Ο κωδικός πρέπει να πληρεί τις παρακάτω προϋθέσεις' : ''}
                />
                <p style={{ alignSelf: 'flex-start', margin: 0, textAlign: 'left' }}><b>Ο κωδικός πρέπει:</b></p>
                <ul style={{ alignSelf: 'flex-start', margin: 0, paddingLeft: '1.5rem', textAlign: 'left' }}>
                    <li style={{ color: passwordErrors.length ? 'red' : 'inherit' }}>Να περιέχει τουλάχιστον 8 χαρακτήρες.</li>
                    <li style={{ color: passwordErrors.number ? 'red' : 'inherit' }}>Να περιέχει τουλάχιστον ένα αριθμό.</li>
                    <li style={{ color: passwordErrors.letter ? 'red' : 'inherit' }}>Να περιέχει τουλάχιστον ένα γράμμα.</li>
                    <li style={{ color: passwordErrors.specialChar ? 'red' : 'inherit' }}>Να περιέχει τουλάχιστον ένα ειδικό χαρακτήρα (! @ # $ % _ -).</li>
                </ul>
                <TextField
                    id="repeat-password-input"
                    label="Επαναλάβετε τον κωδικό"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    onBlur={handleRepeatPasswordBlur}
                    error={repeatPasswordError}
                    helperText={repeatPasswordError ? 'Passwords do not match' : ''}
                />

                {/* Sumbit Button */}
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
                    <p className='big-button-text'>Εγγραφή</p>
                </Button>
                {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />} {/* Loading bar */}
            </Box>
            
            {/* Confirm Submit Dialog */}
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Είστε σίγουρος;</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουρος πως θέλετε να συνεχίσετε;<br />
                        <strong>Παρακαλώ ελέγξτε τα στοιχεία σας πριν τα υποβάλετε.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-error-main)' }}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirm} sx={{ backgroundColor: 'var(--clr-blue)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Υποβολή</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CreateAccount;