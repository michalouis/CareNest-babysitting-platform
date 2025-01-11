import React from 'react';
import { Box, TextField, MenuItem, FormControlLabel, Checkbox, Rating } from '@mui/material';

function FormExperience({ formData, setFormData, errors, setErrors }) {
    // Check if field is empty
    const handleBlur = () => {
        if (!formData.experience) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                experience: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                experience: { hasError: false, message: '' }
            }));
        }
    };
    
    return (
        <TextField
            label="Εμπειρία*"
            select
            value={formData.experience}
            onChange={(e) => setFormData({
                ...formData,
                experience: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.experience.hasError}
            helperText={errors.experience.message}
            InputProps={{ style: { textAlign: 'left' } }}
        >
            <MenuItem value="0-6months">0-6 μήνες</MenuItem>
            <MenuItem value="6-12months">6-12 μήνες</MenuItem>
            <MenuItem value="12-18months">12-18 μήνες</MenuItem>
            <MenuItem value="18-24months">18-24 μήνες</MenuItem>
            <MenuItem value="24-36months">24-36 μήνες</MenuItem>
            <MenuItem value="36+months">36+ μήνες</MenuItem>
        </TextField>
    );
}

function FormDegree({ formData, setFormData, errors, setErrors }) {
    // Check if field is empty
    const handleBlur = () => {
        if (!formData.degree) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                degree: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                degree: { hasError: false, message: '' }
            }));
        }
    };
    
    return (
        <TextField
            label="Σπουδές*"
            select
            value={formData.degree}
            onChange={(e) => setFormData({
                ...formData,
                degree: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.degree.hasError}
            helperText={errors.degree.message}
            InputProps={{ style: { textAlign: 'left' } }}
        >
            <MenuItem value="school">Απολυτήριο Λυκείου</MenuItem>
            <MenuItem value="college">Κολλέγιο</MenuItem>
            <MenuItem value="tei">ΤΕΙ</MenuItem>
            <MenuItem value="university">Πανεπιστήμιο</MenuItem>
        </TextField>
    );
}

function FormSkills({ formData, setFormData, errors, setErrors }) {
    const handleToggleChange = (category, item) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [category]: {
                ...prevFormData[category],
                [item]: !prevFormData[category][item],
            },
        }));
    };

    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Ξένες Γλώσσες</h3>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.english}
                        onChange={() => handleToggleChange('languages', 'english')}
                        name="english"
                        />}
                        label="Αγγλικά"
                        />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.german}
                        onChange={() => handleToggleChange('languages', 'german')}
                        name="german"
                        />}
                        label="Γερμανικά"
                        />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.french}
                        onChange={() => handleToggleChange('languages', 'french')}
                        name="french"
                        />}
                        label="Γαλλικά"
                        />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.spanish}
                        onChange={() => handleToggleChange('languages', 'spanish')}
                        name="spanish"
                    />}
                    label="Ισπανικά"
                />
            </Box>
            
            <h3>Μουσική</h3>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.piano}
                        onChange={() => handleToggleChange('music', 'piano')}
                        name="piano"
                    />}
                    label="Πιάνο"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.guitar}
                        onChange={() => handleToggleChange('music', 'guitar')}
                        name="guitar"
                    />}
                    label="Κιθάρα"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.violin}
                        onChange={() => handleToggleChange('music', 'violin')}
                        name="violin"
                    />}
                    label="Βιολί"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.flute}
                        onChange={() => handleToggleChange('music', 'flute')}
                        name="flute"
                    />}
                    label="Φλάουτο"
                />
            </Box>
        </Box>
    );
}

function FormRating({ formData, setFormData }) {
    const handleRatingChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            rating: newValue,
        }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Rating
                precision={0.5}
                size="large"
                value={formData.rating || 0}
                onChange={handleRatingChange}
                sx={{ fontSize: '3.5rem' }}
            />
        </Box>
    );
}

export { FormExperience, FormDegree, FormSkills, FormRating };