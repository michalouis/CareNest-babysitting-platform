import React, { useState } from 'react';
import { Box, TextField, MenuItem, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Snackbar, Alert, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../firebase';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

// Parent Profile Creation Form
function ProfileFormParent({ firstName, lastName, amka, email, userData }) {
    // if userData is passed function is used for editing profile,
    // else for creating profile
    const [formData, setFormData] = useState(userData ? {
        profilePhoto: userData.profilePhoto,
        firstName: userData.firstName,
        lastName: userData.lastName,
        amka: userData.amka,
        email: userData.email,
        gender: userData.gender,
        age: userData.age,
        address: userData.address,
        postalCode: userData.postalCode,
        town: userData.town,
        phoneNumber: userData.phoneNumber,
        childName: userData.childName,
        childGender: userData.childGender,
        childAgeGroup: userData.childAgeGroup,
        aboutMe: userData.aboutMe,
    } : {
        profilePhoto: '',
        firstName: firstName,
        lastName: lastName,
        amka: amka,
        email: email,
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
    const [loading, setLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();

    const towns = [
        "Athens", "Mesologgi", "Halkida", "Karpenisi", "Lamia", "Amfissa", "Tripoli", "Patra", "Pyrgos", "Korinthos",
        "Sparti", "Kalamata", "Zakynthos", "Kerkyra", "Argostoli", "Leykada", "Arta", "Prebeza", "Karditsa", "Larissa",
        "Bolos", "Trikala", "Grebena", "Drama", "Beroia", "Thessaloniki", "Kabala", "Kastoria", "Kilkis", "Kozani",
        "Edessa", "Katerini", "Serres", "Florina", "Polygyros", "Aleksandroypoli", "Ksanthi", "Komotini", "Rodos",
        "Ermoypoli", "Mytilini", "Samos", "Xios", "Hrakleio", "Agios Nikolaos", "Rethimno", "Hania", "Ioannina",
        "Hgoymenitsa", "Leivadia", "Nayplion"
    ];

    ///////////// VALIDATION /////////////

    // Validate the form - for each field, check if it's empty or invalid
    // If invalid fields, show a snackbar message with the invalid fields
    // If all fields are valid, return true
    const validate = () => {
        const newErrors = {};
        const newSnackbarMessages = [];
    
        if (!formData.gender || errorStates.gender) {
            setErrorStates((prevStates) => ({ ...prevStates, gender: true }));
            newErrors.gender = 'This field is required';
            newSnackbarMessages.push('Gender');
        }
        if (!formData.age || errorStates.age) {
            setErrorStates((prevStates) => ({ ...prevStates, age: true }));
            newErrors.age = 'This field is required';
            newSnackbarMessages.push('Age');
        }
        if (!formData.address || errorStates.address) {
            setErrorStates((prevStates) => ({ ...prevStates, address: true }));
            newErrors.address = 'This field is required';
            newSnackbarMessages.push('Address');
        }
        if (!formData.postalCode || errorStates.postalCode) {
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
            newErrors.postalCode = 'This field is required';
            newSnackbarMessages.push('Postal Code');
        }
        if (!formData.town || errorStates.town) {
            setErrorStates((prevStates) => ({ ...prevStates, town: true }));
            newErrors.town = 'This field is required';
            newSnackbarMessages.push('Town');
        }
        if (!formData.phoneNumber || errorStates.phoneNumber) {
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
            newErrors.phoneNumber = 'This field is required';
            newSnackbarMessages.push('Phone Number');
        }
        if (!formData.childName || errorStates.childName) {
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
            newErrors.childName = 'This field is required';
            newSnackbarMessages.push('Child Name');
        }
        if (!formData.childGender || errorStates.childGender) {
            setErrorStates((prevStates) => ({ ...prevStates, childGender: true }));
            newErrors.childGender = 'This field is required';
            newSnackbarMessages.push('Child Gender');
        }
        if (!formData.childAgeGroup || errorStates.childAgeGroup) {
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: true }));
            newErrors.childAgeGroup = 'This field is required';
            newSnackbarMessages.push('Child Age Group');
        }
        if (formData.aboutMe.length > 500 || errorStates.aboutMe) {
            setErrorStates((prevStates) => ({ ...prevStates, aboutMe: true }));
            newSnackbarMessages.push('About Me');
        }
    
        setErrors(newErrors);
        if (newSnackbarMessages.length > 0) {
            setSnackbarMessage(`The following fields are incorrect: ${newSnackbarMessages.join(', ')}`);
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
                    favorites: [],
                    uid: user.uid,
                });
                if (userData) {
                    navigate('/CareNest-babysitting-platform/profile'); // Navigate to the profile page if userData exists
                } else {
                    navigate('/CareNest-babysitting-platform/signup-complete'); // Navigate to the signup complete page if userData does not exist
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update the profile
    const handleProfileUpdate = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
                    ...formData,
                });
                navigate('/CareNest-babysitting-platform/profile'); // Navigate to the profile page after update
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    /////////////// ERROR HANDLERS ///////////////

    // Check if field is empty
    const handleGenderBlur = () => {
        if (!formData.gender) {     // if the field is empty
            setErrors((prevErrors) => ({ ...prevErrors, gender: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, gender: true }));
        } else {        // if the field is not empty, remove error message & set error state to false
            setErrors((prevErrors) => {
                const { gender, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, gender: false }));
        }
    };

    // Check if field is empty & age is a number above 18 
    const handleAgeBlur = () => {
        if (!formData.age) {    // check if field is empty
            setErrors((prevErrors) => ({ ...prevErrors, age: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, age: true }));
        } else {
            const age = parseInt(formData.age, 10);
            if (isNaN(age) || age < 18) {   // check if age is a number and above 18
                setErrors((prevErrors) => ({ ...prevErrors, age: 'Age must be above 18' }));
                setErrorStates((prevStates) => ({ ...prevStates, age: true }));
            } else {    // field is valid
                setErrors((prevErrors) => {
                    const { age, ...rest } = prevErrors;
                    return rest;
                });
                setErrorStates((prevStates) => ({ ...prevStates, age: false }));
            }
        }
    };

    // Check if field is empty
    const handleAddressBlur = () => {
        if (!formData.address) {
            setErrors((prevErrors) => ({ ...prevErrors, address: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, address: true }));
        } else {
            setErrors((prevErrors) => {
                const { address, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, address: false }));
        }
    };

    // Check if field is empty & postal code is a 5-digit number
    const handlePostalCodeBlur = () => {
        if (!formData.postalCode) {
            setErrors((prevErrors) => ({ ...prevErrors, postalCode: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
            setErrors((prevErrors) => ({ ...prevErrors, postalCode: 'Postal code must be 5 digits' }));
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: true }));
        } else {
            setErrors((prevErrors) => {
                const { postalCode, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, postalCode: false }));
        }
    };

    // Check if field is empty
    const handleTownBlur = () => {
        if (!formData.town) {
            setErrors((prevErrors) => ({ ...prevErrors, town: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, town: true }));
        } else {
            setErrors((prevErrors) => {
                const { town, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, town: false }));
        }
    };

    // Check if field is empty & phone number is a 10-digit number
    const handlePhoneNumberBlur = () => {
        if (!formData.phoneNumber) {
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Phone number must be 10 digits' }));
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: true }));
        } else {
            setErrors((prevErrors) => {
                const { phoneNumber, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, phoneNumber: false }));
        }
    };

    // Check if field is empty & only contains letters
    const handleChildNameBlur = () => {
        if (!formData.childName) {
            setErrors((prevErrors) => ({ ...prevErrors, childName: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
        } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏ]+$/.test(formData.childName)) {
            setErrors((prevErrors) => ({ ...prevErrors, childName: 'The name must contain only letters' }));
            setErrorStates((prevStates) => ({ ...prevStates, childName: true }));
        } else {
            setErrors((prevErrors) => {
                const { childName, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childName: false }));
        }
    };

    // Check if field is empty
    const handleChildGenderBlur = () => {
        if (!formData.childGender) {
            setErrors((prevErrors) => ({ ...prevErrors, childGender: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, childGender: true }));
        } else {
            setErrors((prevErrors) => {
                const { childGender, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childGender: false }));
        }
    };
    
    // Check if field is empty
    const handleChildAgeGroupBlur = () => {
        if (!formData.childAgeGroup) {
            setErrors((prevErrors) => ({ ...prevErrors, childAgeGroup: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: true }));
        } else {
            setErrors((prevErrors) => {
                const { childAgeGroup, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, childAgeGroup: false }));
        }
    };

    // Check if field is empty & only contains letters
    const handleAboutMeBlur = () => {
        if (formData.aboutMe.length > 500) {
            setErrors((prevErrors) => ({ ...prevErrors, aboutMe: 'This field accepts up to 500 characters' }));
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
        if (formData.profileCreated) {
            handleProfileUpdate();
        } else {
            handleProfileCreation();
        }
    };

    return (
        <>
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
            <p style={{color: 'var(--clr-grey)'}}>Mandatory Fields: *</p>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center', 
                gap: '1rem' 
            }}>
                <AccountCircleIcon style={{ fontSize: 100 }} />
                <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: 'var(--clr-violet)' }}
                    startIcon={<UploadIcon />}
                >
                    <p className='button-text'>Upload Photo</p>
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files[0].name })}
                    />
                </Button>
                {formData.profilePhoto ? (
                    <p>{formData.profilePhoto}</p>
                ) : (
                    <p>No photo is uploaded</p>
                )}
            </Box>
            <Button
                variant="contained"
                sx={{ backgroundColor: 'var(--clr-error)' }}
                startIcon={<DeleteIcon />}
                onClick={() => setFormData({ ...formData, profilePhoto: '' })}
            >
                <p className='button-text'>Delete Photo</p>
            </Button>
            <h2>Personal Details</h2>
            {/* First & Last Name, Amka, Role - can't be changed, tied to account */}
            <Tooltip title="This field can't be changed" arrow>
                <TextField label="First Name" value={formData.firstName} slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>
            <Tooltip title="This field can't be changed" arrow>
                <TextField label="Last Name" value={formData.lastName} slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>
            <Tooltip title="This field can't be changed" arrow>
                <TextField label="AMKA" value={formData.amka} slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>
            <Tooltip title="This field can't be changed" arrow>
                <TextField label="Role" value="Parent" slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>

            {/* Gender - dropdown menu, 3 options */}
            <TextField
                label="Gender*"
                name="gender"
                select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                onBlur={handleGenderBlur}
                fullWidth
                error={errorStates.gender}
                helperText={errors.gender}
                slotProps={{ input: { style: { textAlign: 'left' } } }}
            >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {/* Age */}
            <TextField
                label="Age"
                variant="outlined"
                fullWidth
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                onBlur={handleAgeBlur}
                error={errorStates.age}
                helperText={errors.age}
            />
                            
            {/* Address, Postal Code, Town, Phone Number, Email(can't be changed) */}
            <h2>Address & Contact Info</h2>
            <TextField
                label="Address*"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onBlur={handleAddressBlur}
                fullWidth
                error={errorStates.address}
                helperText={errors.address}
            />
            <TextField
                label="Postal Code*"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                onBlur={handlePostalCodeBlur}
                fullWidth
                error={errorStates.postalCode}
                helperText={errors.postalCode}
            />
            <p style={{ fontSize: '1.15rem' }}>Pick one of the following cities</p>
            <Autocomplete
                options={towns}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => {
                    setFormData({ ...formData, town: newValue });
                    handleTownBlur();
                }}
                fullWidth
                value={formData.town || null}
                renderInput={(params) => (          // for error
                    <TextField
                        {...params}
                        label="Town*"
                        error={errorStates.town}
                        helperText={errors.town}
                    />
                )}
                onBlur={handleTownBlur}
            />
            <TextField
                label="Phone Number*"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                onBlur={handlePhoneNumberBlur}
                fullWidth
                error={errorStates.phoneNumber}
                helperText={errors.phoneNumber}
            />
            <Tooltip title="This field can't be changed"  arrow>
                <TextField label="Email" value={formData.email} slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>

            {/* Name, Gender(dropdown), Age group(dropdown) */}
            <h2>Child Details</h2>
            <TextField
                label="Child Name*"
                name="childName"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                onBlur={handleChildNameBlur}
                fullWidth
                error={errorStates.childName}
                helperText={errors.childName}
            />
            <TextField
                label="Child Gender*"
                name="childGender"
                select
                value={formData.childGender}
                onChange={(e) => setFormData({ ...formData, childGender: e.target.value })}
                onBlur={handleChildGenderBlur}
                fullWidth
                error={errorStates.childGender}
                helperText={errors.childGender}
                slotProps={{ input: { style: { textAlign: 'left' } } }}
            >
                <MenuItem value="Male">Boy</MenuItem>
                <MenuItem value="Female">Girl</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
                label="Child's Age Group*"
                name="childAgeGroup"
                select
                value={formData.childAgeGroup}
                onChange={(e) => setFormData({ ...formData, childAgeGroup: e.target.value })}
                onBlur={handleChildAgeGroupBlur}
                fullWidth
                error={errorStates.childAgeGroup}
                helperText={errors.childAgeGroup}
                slotProps={{ input: { style: { textAlign: 'left' } } }}
            >
                <MenuItem value="1-2">1-2 years old</MenuItem>
                <MenuItem value="3-6">3-6 years old</MenuItem>
                <MenuItem value="7-12">7-12 years old</MenuItem>
                <MenuItem value="13-16">13-16 years old</MenuItem>
            </TextField>

            {/* About Me - multiline text field */}
            <h2>About Me</h2>
            <TextField
                label="About Me"
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
                        <span style={{ color: formData.aboutMe.length > 500 ? 'var(--clr-error)' : 'var(--clr-black)' }}>
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
                    backgroundColor: loading ? 'grey' : 'var(--clr-violet)',
                    '&:hover': {
                        opacity: '0.8',
                    },
                }}
                disabled={loading}
            >
                <p className='big-button-text'>Submit</p>
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
                <Button variant='contained' onClick={handleConfirmSubmit} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }} >
                    <p className='button-text'>Submit</p>
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default ProfileFormParent;