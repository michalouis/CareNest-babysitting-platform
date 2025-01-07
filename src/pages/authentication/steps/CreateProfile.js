import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Tooltip, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import StepperComponent from '../StepperComponent';
import { useProfileExistsRedirect } from '../../../AuthChecks';

import LogoutIcon from '@mui/icons-material/Logout';

function CreateProfile() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        address: '',
        postalCode: '',
        town: '',
        phoneNumber: '',
        childName: '',
        childGender: '',
        childAgeGroup: '',
        aboutMe: '',
    });

    // error states for the form fields
    const [errorStates, setErrorStates] = useState({
        gender: false,
        age: false,
        address: false,
        postalCode: false,
        town: false,
        phoneNumber: false,
        childName: false,
        childGender: false,
        childAgeGroup: false,
        aboutMe: false,
    });

    // error messages for the form fields
    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    
    useProfileExistsRedirect(); // Redirect to the homepage if the profile has already been created

    // Get the user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    ///////////// VALIDATION /////////////

    const validate = () => {
        const newErrors = {};
        const newSnackbarMessages = [];
    
        if (!formData.gender || errorStates.gender) {
            setErrorStates((prevStates) => ({ ...prevStates, gender: true }));
            newErrors.gender = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Φύλο');
        }
        if (!formData.age || errorStates.age) {
            setErrorStates((prevStates) => ({ ...prevStates, age: true }));
            newErrors.age = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Ηλικία');
        }
        if (!formData.address || errorStates.address) {
            setErrorStates((prevStates) => ({ ...prevStates, address: true }));
            newErrors.address = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Διεύθυνση');
        }
        if (!formData.postalCode || errorStates.postalCode) {
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
            newErrors.postalCode = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Ταχυδρομικός Κώδικας');
        }
        if (!formData.town || errorStates.town) {
            setErrorStates((prevStates) => ({ ...prevStates, town: true }));
            newErrors.town = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Πόλη');
        }
        if (!formData.phoneNumber || errorStates.phoneNumber) {
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
            newErrors.phoneNumber = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Τηλέφωνο');
        }
        if (!formData.childName || errorStates.childName) {
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
            newErrors.childName = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Όνομα Παιδιού');
        }
        if (!formData.childGender || errorStates.childGender) {
            setErrorStates((prevStates) => ({ ...prevStates, childGender: true }));
            newErrors.childGender = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Φύλο Παιδιού');
        }
        if (!formData.childAgeGroup || errorStates.childAgeGroup) {
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: true }));
            newErrors.childAgeGroup = 'Το πεδίο είναι υποχρεωτικό';
            newSnackbarMessages.push('Ηλικιακή Ομάδα Παιδιού');
        }
        if (formData.aboutMe.length > 500 || errorStates.aboutMe) {
            setErrorStates((prevStates) => ({ ...prevStates, aboutMe: true }));
            newSnackbarMessages.push('Σχετικά με μένα');
        } 
    
        setErrors(newErrors);
        if (newSnackbarMessages.length > 0) {
            setSnackbarMessage(`Τα παρακάτω πεδία είναι λανθασμένα: ${newSnackbarMessages.join(', ')}`);
        }
        return Object.keys(newErrors).length === 0;
    };

    /////////////// FIREBASE ///////////////

    // Create the profile
    const handleProfileCreation = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
                    ...formData,
                    profileCreated: true,
                    partnershipActive: false,
                });
                navigate('/signup-complete'); // Navigate to the signup complete page
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        await signOut(FIREBASE_AUTH);
        navigate('/'); // Navigate to the landing page
    };

    /////////////// ERROR HANDLERS ///////////////

    const handleGenderBlur = () => {
        if (!formData.gender) {
            setErrors((prevErrors) => ({ ...prevErrors, gender: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, gender: true }));
        } else {
            setErrors((prevErrors) => {
                const { gender, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, gender: false }));
        }
    };
    
    const handleAgeBlur = () => {
        if (!formData.age) {
            setErrors((prevErrors) => ({ ...prevErrors, age: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, age: true }));
        } else {
            const age = parseInt(formData.age, 10);
            if (isNaN(age) || age < 18) {
                setErrors((prevErrors) => ({ ...prevErrors, age: 'Η ηλικία πρέπει να είναι άνω των 18' }));
                setErrorStates((prevStates) => ({ ...prevStates, age: true }));
            } else {
                setErrors((prevErrors) => {
                    const { age, ...rest } = prevErrors;
                    return rest;
                });
                setErrorStates((prevStates) => ({ ...prevStates, age: false }));
            }
        }
    };
    
    const handleAddressBlur = () => {
        if (!formData.address) {
            setErrors((prevErrors) => ({ ...prevErrors, address: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, address: true }));
        } else {
            setErrors((prevErrors) => {
                const { address, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, address: false }));
        }
    };
    
    const handlePostalCodeBlur = () => {
        if (!formData.postalCode) {
            setErrors((prevErrors) => ({ ...prevErrors, postalCode: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
            setErrors((prevErrors) => ({ ...prevErrors, postalCode: 'Ο ταχυδρομικός κώδικας πρέπει να αποτελείτε από 5 ψηφία' }));
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
        } else {
            setErrors((prevErrors) => {
                const { postalCode, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: false }));
        }
    };
    
    const handleTownBlur = () => {
        if (!formData.town) {
            setErrors((prevErrors) => ({ ...prevErrors, town: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, town: true }));
        } else {
            setErrors((prevErrors) => {
                const { town, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, town: false }));
        }
    };
    
    const handlePhoneNumberBlur = () => {
        if (!formData.phoneNumber) {
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Το τηλέφωνο πρέπει πρέπει να αποτελείτε από 10 ψηφία' }));
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
        } else {
            setErrors((prevErrors) => {
                const { phoneNumber, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: false }));
        }
    };
    
    const handleChildNameBlur = () => {
        if (!formData.childName) {
            setErrors((prevErrors) => ({ ...prevErrors, childName: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
        } else if (!/^[a-zA-Z\s]+$/.test(formData.childName)) {
            setErrors((prevErrors) => ({ ...prevErrors, childName: 'Το όνομα πρέπει να αποτελείται μόνο απο γράμματα' }));
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
        } else {
            setErrors((prevErrors) => {
                const { childName, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childName: false }));
        }
    };
    
    const handleChildGenderBlur = () => {
        if (!formData.childGender) {
            setErrors((prevErrors) => ({ ...prevErrors, childGender: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, childGender: true }));
        } else {
            setErrors((prevErrors) => {
                const { childGender, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childGender: false }));
        }
    };
    
    const handleChildAgeGroupBlur = () => {
        if (!formData.childAgeGroup) {
            setErrors((prevErrors) => ({ ...prevErrors, childAgeGroup: 'Το πεδίο είναι υποχρεωτικό' }));
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: true }));
        } else {
            setErrors((prevErrors) => {
                const { childAgeGroup, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: false }));
        }
    };
    
    const handleAboutMeBlur = () => {
        if (formData.aboutMe.length > 500) {
            setErrors((prevErrors) => ({ ...prevErrors, aboutMe: 'Το πεδίο δέχεται μέχρι 500 χαρακτήρες' }));
            setErrorStates((prevStates) => ({ ...prevStates, aboutMe: true }));
        } else {
            setErrors((prevErrors) => {
                const { aboutMe, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, aboutMe: false }));
        }
    };

    /////////////// DIALOG ///////////////

    // Open confirm dialog
    const handleConfirmDialogOpen = () => {
        if (validate()) {
            setOpenConfirmDialog(true);
        }
    };

    // Close confirm dialog
    const handleConfirmDialogClose = () => {
        setOpenConfirmDialog(false);
    };

    // Submit the form
    const handleConfirmSubmit = () => {
        setOpenConfirmDialog(false);
        handleProfileCreation();
    };

    return (
        <>
        <Box sx={{
            display: 'flex',
            alignItems: 'baseline',
            margin: '1rem',
        }}>
            <h1 className="login-header">Εγγραφή</h1>
        </Box>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1rem',
        }}>
            {/* Logout Box */}
            <Box sx={{
                width: 'auto',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '2rem',
                backgroundColor: 'var(--clr-white)',
                padding: '1rem', borderRadius: '1rem',
                boxShadow: '2', margin: '0 auto',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                <p style={{ fontSize: '1.1rem', textAlign: 'left' }}>
                    Για να περιηγηθείτε στον ιστότοπο πρέπει να ολοκληρώσετε το προφίλ σας.
                    Διαφορετικά μπορείτε να αποσυνδεθείτε.
                </p>
                <Button
                    variant="contained"
                    onClick={handleLogout}
                    sx={{
                        fontSize: '1rem',
                        padding: '0.5rem',
                        backgroundColor: 'var(--clr-error)',
                        alignSelf: 'flex-end',
                        '&:hover': {
                            opacity: '0.8',
                        },
                    }}
                    startIcon={<LogoutIcon style={{ fontSize: '30px' }} />}
                >
                    <p className='button-text'>Αποσύνδεση</p>
                </Button>
            </Box>

            {/* Stepper */}
            <Box sx={{ width: '100%', margin: '2rem' }}>
                <StepperComponent activeStep={3} />
            </Box>

            {/* Description */}
            <p className='description'>
                Συμπληρώστε τα προσωπικά σας στοιχεία για να δημιουργήστε
                το προφίλ σας και να ολοκληρώσετε την εγγραφή σας.
            </p>

            {/* Form */}
            <Box sx={{
                width: '80%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
                backgroundColor: 'var(--clr-white)',
                padding: '2rem 1rem',
                borderRadius: '1rem',
                boxShadow: '2',
                marginBottom: '2rem',
                justifyContent: 'space-around',
                position: 'relative'
            }}>
                <p style={{color: 'var(--clr-grey)'}}>Υποχρεωτικά πεδία: *</p>
                <h2>Προσωπικά Στοιχεία</h2>
                {/* First & Last Name, Amka, Role - can't be changed, tied to account */}
                <Tooltip title="This field can't be changed" arrow>
                    <TextField label="First Name" value={userData?.firstName || ''} InputProps={{ readOnly: true }} fullWidth disabled variant="filled" />
                </Tooltip>
                <Tooltip title="This field can't be changed" arrow>
                    <TextField label="Last Name" value={userData?.lastName || ''} InputProps={{ readOnly: true }} fullWidth disabled variant="filled" />
                </Tooltip>
                <Tooltip title="This field can't be changed" arrow>
                    <TextField label="AMKA" value={userData?.amka || ''} InputProps={{ readOnly: true }} fullWidth disabled variant="filled" />
                </Tooltip>
                <Tooltip title="This field can't be changed" arrow>
                    <TextField label="Role" value={userData?.role || ''} InputProps={{ readOnly: true }} fullWidth disabled variant="filled" />
                </Tooltip>

                {/* Gender - dropdown menu, 3 options */}
                <TextField
                    label="Φύλο*"
                    name="gender"
                    select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    onBlur={handleGenderBlur}
                    fullWidth
                    error={errorStates.gender}
                    helperText={errors.gender}
                    InputProps={{ style: { textAlign: 'left' } }}
                >
                    <MenuItem value="Male">Άντρας</MenuItem>
                    <MenuItem value="Female">Γυναίκα</MenuItem>
                    <MenuItem value="Other">Άλλο</MenuItem>
                </TextField>

                {/* Age */}
                <TextField
                    label="Ηλικία"
                    variant="outlined"
                    fullWidth
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    onBlur={handleAgeBlur}
                    error={errorStates.age}
                    helperText={errors.age}
                />
                                
                {/* Address, Postal Code, Town, Phone Number, Email(can't be changed) */}
                <h2>Διεύθυνση & Στοιχεία Επικοινωνίας</h2>
                <TextField
                    label="Διεύθυνση*"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    onBlur={handleAddressBlur}
                    fullWidth
                    error={errorStates.address}
                    helperText={errors.address}
                />
                <TextField
                    label="Ταχυδρομικός Κώδικας*"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    onBlur={handlePostalCodeBlur}
                    fullWidth
                    error={errorStates.postalCode}
                    helperText={errors.postalCode}
                />
                <TextField
                    label="Πόλη*"
                    name="town"
                    value={formData.town}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    onBlur={handleTownBlur}
                    fullWidth
                    error={errorStates.town}
                    helperText={errors.town}
                />
                <TextField
                    label="Τηλέφωνο*"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    onBlur={handlePhoneNumberBlur}
                    fullWidth
                    error={errorStates.phoneNumber}
                    helperText={errors.phoneNumber}
                />
                <Tooltip title="This field can't be changed"  arrow>
                    <TextField label="Email" value={userData?.email || ''} InputProps={{ readOnly: true }} fullWidth disabled variant="filled" />
                </Tooltip>

                {/* Name, Gender(dropdown), Age group(dropdown) */}
                <h2>Στοιχεία Παιδιού</h2>
                <TextField
                    label="Όνομα*"
                    name="childName"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    onBlur={handleChildNameBlur}
                    fullWidth
                    error={errorStates.childName}
                    helperText={errors.childName}
                />
                <TextField
                    label="Φύλο*"
                    name="childGender"
                    select
                    value={formData.childGender}
                    onChange={(e) => setFormData({ ...formData, childGender: e.target.value })}
                    onBlur={handleChildGenderBlur}
                    fullWidth
                    error={errorStates.childGender}
                    helperText={errors.childGender}
                    InputProps={{ style: { textAlign: 'left' } }}
                >
                    <MenuItem value="Male">Αγόρι</MenuItem>
                    <MenuItem value="Female">Κορίτσι</MenuItem>
                    <MenuItem value="Other">Άλλο</MenuItem>
                </TextField>
                <TextField
                    label="Ηλικιακή Ομάδα*"
                    name="childAgeGroup"
                    select
                    value={formData.childAgeGroup}
                    onChange={(e) => setFormData({ ...formData, childAgeGroup: e.target.value })}
                    onBlur={handleChildAgeGroupBlur}
                    fullWidth
                    error={errorStates.childAgeGroup}
                    helperText={errors.childAgeGroup}
                    InputProps={{ style: { textAlign: 'left' } }}
                >
                    <MenuItem value="<3">&lt;3 χρονών</MenuItem>
                    <MenuItem value="3-6">3-6 χρονών</MenuItem>
                    <MenuItem value="7-12">7-12 χρονών</MenuItem>
                    <MenuItem value="13-16">13-16 χρονών</MenuItem>
                </TextField>

                {/* About Me - multiline text field */}
                <h2>Σχετικά με μένα</h2>
                <TextField
                    label="Σχετικά με μένα"
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                    onBlur={handleAboutMeBlur}
                    multiline
                    rows={4}
                    fullWidth
                    error={errorStates.aboutMe}
                    helperText={
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: formData.aboutMe.length > 500 ? 'red' : 'inherit' }}>
                                {formData.aboutMe.length} / 500
                            </span>
                        </div>
                    }
                />
            
                {/* Submit Button */}
                <Button
                    variant="contained"
                    onClick={handleConfirmDialogOpen}
                    sx={{
                        alignSelf: 'center',
                        fontSize: '1.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: loading ? 'grey' : 'var(--clr-blue)',
                        '&:hover': {
                            opacity: '0.8',
                        },
                    }}
                    disabled={loading}
                >
                    <p className='big-button-text'>Υποβολή</p>
                </Button>
                {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />} {/* Loading bar */}
            </Box>


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

            {/* Confirm Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmDialogClose}
            >
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
                    <Button variant='contained' onClick={handleConfirmSubmit} sx={{ backgroundColor: 'var(--clr-blue)', '&:hover': { opacity: 0.8 } }} autoFocus>
                        <p className='button-text'>Υποβολή</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
        </>
    );
}

export default CreateProfile;