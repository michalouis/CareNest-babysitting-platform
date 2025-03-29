import React, { useState } from 'react';
import { Box, TextField, MenuItem, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Snackbar, Alert, Divider, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../firebase';
import '../../../style.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Nanny Profile Creation Form
function ProfileFormNanny({ firstName, lastName, amka, email, userData }) {
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
        aboutMe: userData.aboutMe,
        experience: userData.experience,
        degrees: userData.degrees,
        certificates: userData.certificates,
        recommendations: userData.recommendations,
        languages: userData.languages,
        music: userData.music,
        profileCreated: userData.profileCreated,
        partnershipActive: userData.partnershipActive,
        score: userData.score,
        ratingsNum: userData.ratingsNum,
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
        aboutMe: '',
        experience: '',
        degrees: [],            // { degreeLevel: '', degreeTitle: '', degreeFile: '' }
        certificates: [],       // { certificateTitle: '', certificateFile: '' }
        recommendations: [],    // { recommendationTitle: '', recommendationFile: '' }
        languages: {      
            english: false,
            german: false,
            french: false,
            spanish: false,
        },
        music: {      
            piano: false,
            guitar: false,
            violin: false,
            flute: false,
        },
        profileCreated: false,
        partnershipActive: false,
        score: 5,
        ratingsNum: 5,
    });
    
    // error states for the form fields
    const [errorStates, setErrorStates] = useState({
        gender: false,
        age: false,
        address: false,
        postalCode: false,
        town: false,
        phoneNumber: false,
        aboutMe: false,
        experience: false,
        degrees: [],            // { error: false }          
        certificates: [],       // { error: false }
        recommendations: [],    // { error: false }
    });

    const towns = [
        "Athens", "Mesologgi", "Halkida", "Karpenisi", "Lamia", "Amfissa", "Tripoli", "Patra", "Pyrgos", "Korinthos",
        "Sparti", "Kalamata", "Zakynthos", "Kerkyra", "Argostoli", "Leykada", "Arta", "Prebeza", "Karditsa", "Larissa",
        "Bolos", "Trikala", "Grebena", "Drama", "Beroia", "Thessaloniki", "Kabala", "Kastoria", "Kilkis", "Kozani",
        "Edessa", "Katerini", "Serres", "Florina", "Polygyros", "Aleksandroypoli", "Ksanthi", "Komotini", "Rodos",
        "Ermoypoli", "Mytilini", "Samos", "Xios", "Hrakleio", "Agios Nikolaos", "Rethimno", "Hania", "Ioannina",
        "Hgoymenitsa", "Leivadia", "Nayplion"
    ];
    
    /////////////// DEGREES, CERTIFICATES, RECOMMENDATIONS ///////////////
    
    // ADD (up to 3)
    const addDegree = () => {
        if (formData.degrees.length < 3) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                degrees: [...prevFormData.degrees, { degreeLevel: '', degreeTitle: '', degreeFile: '' }],
            }));
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                degrees: [...prevErrorStates.degrees, { degreeFilled: false }],
            }));
        }
    };

    const addCertificate = () => {
        if (formData.certificates.length < 3) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                certificates: [...prevFormData.certificates, { certificateTitle: '', certificateFile: '' }],
            }));
        }
    };

    const addRecommendation = () => {
        if (formData.recommendations.length < 3) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                recommendations: [...prevFormData.recommendations, { recommendationTitle: '', recommendationFile: '' }],
            }));
        }
    };
    
    // REMOVE
    const removeDegree = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            degrees: prevFormData.degrees.filter((_, i) => i !== index),
        }));
        setErrorStates((prevErrorStates) => ({
            ...prevErrorStates,
            degrees: prevErrorStates.degrees.filter((_, i) => i !== index),
        }));
    };

    const removeCertificate = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            certificates: prevFormData.certificates.filter((_, i) => i !== index),
        }));
    };

    const removeRecommendation = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            recommendations: prevFormData.recommendations.filter((_, i) => i !== index),
        }));
    };
    
    // HANDLE CHANGE
    const handleDegreeChange = (index, field, value) => {
        // Map through the degrees array
        const newDegrees = formData.degrees.map((degree, i) => {
            // Check if the current index matches the specified index
            if (i === index) {
                // Return a new object with the updated field and value
                return { ...degree, [field]: value };
            }
            // Return the degree as is if the index does not match
            return degree;
        });
        // Update the formData state with the new degrees array
        setFormData((prevFormData) => ({ ...prevFormData, degrees: newDegrees }));
    };
    
    const handleCertificateChange = (index, field, value) => {
        // Map through the certificates array
        const newCertificates = formData.certificates.map((certificate, i) => {
            // Check if the current index matches the specified index
            if (i === index) {
                // Return a new object with the updated field and value
                return { ...certificate, [field]: value };
            }
            // Return the certificate as is if the index does not match
            return certificate;
        });
        // Update the formData state with the new certificates array
        setFormData((prevFormData) => ({ ...prevFormData, certificates: newCertificates }));
    };
    
    const handleRecommendationChange = (index, field, value) => {
        // Map through the recommendations array
        const newRecommendations = formData.recommendations.map((recommendation, i) => {
            // Check if the current index matches the specified index
            if (i === index) {
                // Return a new object with the updated field and value
                return { ...recommendation, [field]: value };
            }
            // Return the recommendation as is if the index does not match
            return recommendation;
        });
        // Update the formData state with the new recommendations array
        setFormData((prevFormData) => ({ ...prevFormData, recommendations: newRecommendations }));
    };
    
    // error messages for the form fields
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();

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
        if (!formData.experience || errorStates.experience) {
            setErrorStates((prevStates) => ({ ...prevStates, experience: true }));
            newErrors.experience = 'This field is required';
            newSnackbarMessages.push('Experience');
        }
    
        ///// Validate Degrees /////
        const newDegreeErrors = formData.degrees.map((degree) => {
            if (!degree.degreeLevel || !degree.degreeTitle || !degree.degreeFile) {   // if any of the fields is empty
                return { error: true };
            }
            return { error: false };
        });
    
        // Set degree errors
        setErrorStates((prevStates) => ({
            ...prevStates,
            degrees: newDegreeErrors,
        }));
    
        // Check if there are any degree errors
        const hasDegreeErrors = newDegreeErrors.some((degreeErrors) => degreeErrors.error);
    
        if (hasDegreeErrors) {
            newSnackbarMessages.push('Degrees');
        }

        ///// Validate Certificates /////
        const newCertificateErrors = formData.certificates.map((certificate) => {
            if (!certificate.certificateTitle || !certificate.certificateFile) {    // if any of the fields is empty
                return { error: true };
            }
            return { error: false };
        });
    
        // Set certificate errors
        setErrorStates((prevStates) => ({
            ...prevStates,
            certificates: newCertificateErrors,
        }));
    
        // Check if there are any certificate errors
        const hasCertificateErrors = newCertificateErrors.some((certificateErrors) => certificateErrors.error);
    
        if (hasCertificateErrors) {
            newSnackbarMessages.push('Certificates');
        }

        ///// Validate Recommendations /////
        const newRecommendationErrors = formData.recommendations.map((recommendation) => {
            if (!recommendation.recommendationTitle || !recommendation.recommendationFile) {    // if any of the fields is empty
                return { error: true };
            }
            return { error: false };
        });
    
        // Set recommendations errors
        setErrorStates((prevStates) => ({
            ...prevStates,
            recommendations: newRecommendationErrors,
        }));
    
        // Check if there are any recommendation errors
        const hasRecommendationErrors = newRecommendationErrors.some((recommendationErrors) => recommendationErrors.error);
    
        if (hasRecommendationErrors) {
            newSnackbarMessages.push('Recommendations');
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
                    score: (Math.random() * (4.99 - 2.01) + 2.01).toFixed(2),
                    ratingsNum: Math.floor(Math.random() * 16) + 5,
                    uid: user.uid,
                });
                if (userData) {
                    navigate('/profile'); // Navigate to the profile page if userData exists
                } else {
                    navigate('/signup-complete'); // Navigate to the signup complete page if userData does not exist
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
                navigate('/profile'); // Navigate to the profile page after update
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
        if (!formData.age) {    //check if field is empty
            setErrors((prevErrors) => ({ ...prevErrors, age: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, age: true }));
        } else {
            const age = parseInt(formData.age, 10);
            if (isNaN(age) || age < 18) {   //check if age is a number and above 18
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
    
    // Check if field is empty
    const handleExperienceBlur = () => {
        if (!formData.experience) {
            setErrors((prevErrors) => ({ ...prevErrors, experience: 'This field is required' }));
            setErrorStates((prevStates) => ({ ...prevStates, experience: true }));
        } else {
            setErrors((prevErrors) => {
                const { experience, ...rest } = prevErrors;
                return rest;
            });
            setErrorStates((prevStates) => ({ ...prevStates, experience: false }));
        }
    };

    // Skill Checkbox handler
    const handleToggleChange = (category, item) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [category]: {
                ...prevFormData[category],
                [item]: !prevFormData[category][item],
            },
        }));
    };
    
    // Check if field is empty & only contains letters
    const handleAboutMeBlur = () => {
        if (formData.aboutMe.length > 500) {
            setErrors((prevErrors) => ({ ...prevErrors, aboutMe: 'The field accepts up to 500 characters' }));
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
            position: 'relative',
            textAlign: 'left',
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
            {/* First & Last Name, Amka, Role - can't be changed, tied to account */}
            <h2>Personal Information</h2>
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
                <TextField label="Role" value="Nanny" slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
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

            {/* Address, Postal Code, Town, Phone Number, Email (can't be changed) */}
            <h2>Address & Contact Information</h2>
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
            <p style={{ fontSize: '1.15rem' }}>Select a city from the list in English.</p>
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
            <Tooltip title="This field can't be changed" arrow>
                <TextField label="Email" value={formData.email} slotProps={{ input: { readOnly: true } }} fullWidth disabled variant="filled" />
            </Tooltip>

            {/* dropdown months of experience */}
            <h2>Experience</h2>
            <p style={{ color: 'var(--clr-grey)' }}>Enter your experience as a nanny in months.</p>
            <TextField
                label="Experience*"
                name="experience"
                select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                onBlur={handleExperienceBlur}
                fullWidth
                error={errorStates.experience}
                helperText={errors.experience}
                slotProps={{ input: { style: { textAlign: 'left' } } }}
            >
                <MenuItem value="0-6">0-6 months</MenuItem>
                <MenuItem value="6-12">6-12 months</MenuItem>
                <MenuItem value="12-18">12-18 months</MenuItem>
                <MenuItem value="18-24">18-24 months</MenuItem>
                <MenuItem value="24-36">24-36 months</MenuItem>
                <MenuItem value="36+">36+ months</MenuItem>
            </TextField>

            {/* Use map to show degrees (degree level dropdown, degree title text, degree file upload) */}
            <h2>Education</h2>
            <p style={{ color: 'var(--clr-grey)' }}>Upload up to three degrees if you have completed any studies.</p>
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.degrees.map((degree, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3>{index + 1}.</h3>
                            <TextField
                                select
                                label="Degree Level"
                                name={`degreeLevel-${index}`}
                                value={degree.degreeLevel}
                                onChange={(e) => handleDegreeChange(index, 'degreeLevel', e.target.value)}
                                fullWidth
                                error={errorStates.degrees[index]?.error}
                                helperText={errorStates.degrees[index]?.error ? 'Fill in all fields or click "Delete Degree Field"' : ''}
                            >
                                <MenuItem value="school">High School Diploma</MenuItem>
                                <MenuItem value="college">College</MenuItem>
                                <MenuItem value="tei">TEI</MenuItem>
                                <MenuItem value="university">University</MenuItem>
                            </TextField>
                        </Box>
                        <TextField
                            label="Degree Title"
                            name={`degreeTitle-${index}`}
                            value={degree.degreeTitle}
                            onChange={(e) => handleDegreeChange(index, 'degreeTitle', e.target.value)}
                            fullWidth
                            error={errorStates.degrees[index]?.error}
                        />
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'baseline', gap: '1rem' }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: 'var(--clr-violet)',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                    width: 'fit-content',
                                }}
                                startIcon={<UploadIcon />}
                            >
                                <p className='button-text'>Upload Proof</p>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleDegreeChange(index, 'degreeFile', e.target.files[0].name)}
                                />
                            </Button>
                            {degree.degreeFile ? (
                                <p>{degree.degreeFile}</p>
                            ) : (
                                <p style={{ color: errorStates.degrees[index]?.error ? 'var(--clr-error)' : 'var(--clr-black)' }}>
                                    No document uploaded
                                </p>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => removeDegree(index)}
                            sx={{
                                width: 'fit-content',
                                backgroundColor: 'var(--clr-error)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            startIcon={<DeleteIcon />}
                        >
                            <p className='button-text'>Delete Degree Field</p>
                        </Button>
                        <Divider />
                    </Box>
                ))}
            </Box>
            {/* Button to add more degrees (up to 3) */}
            {formData.degrees.length < 3 && (
                <Button
                    variant="contained"
                    onClick={addDegree}
                    sx={{
                        backgroundColor: 'var(--clr-black)',
                        '&:hover': {
                            opacity: 0.8,
                        },
                        marginBottom: '1rem',
                    }}
                    startIcon={<AddIcon />}
                >
                    <p className='button-text'>Add Degree</p>
                </Button>
            )}

            {/* Certificates */}
            <h2>Certificates</h2>
            <p style={{ color: 'var(--clr-grey)' }}>You can upload up to 3 certificates (e.g., seminars, language proficiency certificates).</p>
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.certificates.map((certificate, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3>{index + 1}.</h3>
                            <TextField
                                label="Certificate Name"
                                name={`certificateTitle-${index}`}
                                value={certificate.certificateTitle}
                                onChange={(e) => handleCertificateChange(index, 'certificateTitle', e.target.value)}
                                fullWidth
                                error={errorStates.certificates[index]?.error}
                                helperText={errorStates.certificates[index]?.error ? 'Fill in all fields or click "Delete Certificate Field"' : ''}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'baseline', gap: '1rem' }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: 'var(--clr-violet)',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                    width: 'fit-content',
                                }}
                                startIcon={<UploadIcon />}
                            >
                                <p className='button-text'>Upload Proof</p>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleCertificateChange(index, 'certificateFile', e.target.files[0].name)}
                                />
                            </Button>
                            {certificate.certificateFile ? (
                                <p>{certificate.certificateFile}</p>
                            ) : (
                                <p style={{ color: errorStates.certificates[index]?.error ? 'var(--clr-error)' : 'var(--clr-black)' }}>
                                    No document uploaded
                                </p>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => removeCertificate(index)}
                            sx={{
                                width: 'fit-content',
                                backgroundColor: 'var(--clr-error)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            startIcon={<DeleteIcon />}
                        >
                            <p className='button-text'>Delete Certificate Field</p>
                        </Button>
                        <Divider />
                    </Box>
                ))}
            </Box>
            {/* Button to add more certificates (up to 3) */}
            {formData.certificates.length < 3 && (
                <Button
                    variant="contained"
                    onClick={addCertificate}
                    sx={{
                        backgroundColor: 'var(--clr-black)',
                        '&:hover': {
                            opacity: 0.8,
                        },
                        marginBottom: '1rem',
                    }}
                    startIcon={<AddIcon />}
                >
                    <p className='button-text'>Add Certificate</p>
                </Button>
            )}

            {/* The same as the degree, but no dropdown menu */}
            <h2>Recommendations</h2>
            <p style={{ color: 'var(--clr-grey)' }}>You can upload up to three recommendations.</p>
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.recommendations.map((recommendation, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3>{index + 1}.</h3>
                            <TextField
                                label="Recommendation Name"
                                name={`recommendationTitle-${index}`}
                                value={recommendation.recommendationTitle}
                                onChange={(e) => handleRecommendationChange(index, 'recommendationTitle', e.target.value)}
                                fullWidth
                                error={errorStates.recommendations[index]?.error}
                                helperText={errorStates.recommendations[index]?.error ? 'Fill in all fields or click "Delete Recommendation Field"' : ''}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'baseline', gap: '1rem' }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: 'var(--clr-violet)',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                    width: 'fit-content',
                                }}
                                startIcon={<UploadIcon />}
                            >
                                <p className='button-text'>Upload Proof</p>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleRecommendationChange(index, 'recommendationFile', e.target.files[0].name)}
                                />
                            </Button>
                            {recommendation.recommendationFile ? (
                                <p>{recommendation.recommendationFile}</p>
                            ) : (
                                <p style={{ color: errorStates.recommendations[index]?.error ? 'var(--clr-error)' : 'var(--clr-black)' }}>
                                    No document uploaded
                                </p>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => removeRecommendation(index)}
                            sx={{
                                width: 'fit-content',
                                backgroundColor: 'var(--clr-error)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            startIcon={<DeleteIcon />}
                        >
                            <p className='button-text'>Delete Recommendation Field</p>
                        </Button>
                        <Divider />
                    </Box>
                ))}
            </Box>
            {/* Button to add more recommendations (up to 3) */}
            {formData.recommendations.length < 3 && (
                <Button
                    variant="contained"
                    onClick={addRecommendation}
                    sx={{
                        backgroundColor: 'var(--clr-black)',
                        '&:hover': {
                            opacity: 0.8,
                        },
                        marginBottom: '1rem',
                    }}
                    startIcon={<AddIcon />}
                >
                    <p className='button-text'>Add Recommendation</p>
                </Button>
            )}

            {/* Languages, Music - checkboxes */}
            <h2>Skills</h2>
            <h3 style={{ fontWeight: '400' }}><u>Foreign Languages</u></h3>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.languages.english}
                            onChange={() => handleToggleChange('languages', 'english')}
                            name="english"
                        />
                    }
                    label="English"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.languages.german}
                            onChange={() => handleToggleChange('languages', 'german')}
                            name="german"
                        />
                    }
                    label="German"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.languages.french}
                            onChange={() => handleToggleChange('languages', 'french')}
                            name="french"
                        />
                    }
                    label="French"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.languages.spanish}
                            onChange={() => handleToggleChange('languages', 'spanish')}
                            name="spanish"
                        />
                    }
                    label="Spanish"
                />
            </Box>

            <h3 style={{ fontWeight: '400' }}><u>Musical Instruments</u></h3>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.music.piano}
                            onChange={() => handleToggleChange('music', 'piano')}
                            name="piano"
                        />
                    }
                    label="Piano"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.music.guitar}
                            onChange={() => handleToggleChange('music', 'guitar')}
                            name="guitar"
                        />
                    }
                    label="Guitar"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.music.violin}
                            onChange={() => handleToggleChange('music', 'violin')}
                            name="violin"
                        />
                    }
                    label="Violin"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.music.flute}
                            onChange={() => handleToggleChange('music', 'flute')}
                            name="flute"
                        />
                    }
                    label="Flute"
                />
            </Box>

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
                    <strong>Please review your details before submitting.</strong>
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

export default ProfileFormNanny;