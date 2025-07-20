import React from 'react';
import { Button, Autocomplete, TextField, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, FormControlLabel, Checkbox, Rating } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import '../../style.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

/////////////// VALIDATION ///////////////

// Validate the filter data and return true if all fields are correct
function ValidateFilterData(filterData, errors, setErrors, setSnackbarMessage) {
    let pass = true;
    const newSnackbarMessages = [];
    let updatedErrors = { ...errors };

    if (!filterData.town || errors.town.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            town: { hasError: true, message: 'This field is required' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('City');
    }
    if (!filterData.childAgeGroup || errors.childAgeGroup.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            childAgeGroup: { hasError: true, message: 'This field is required' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Age Group');
    }
    if (!filterData.workTime || errors.workTime.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            workTime: { hasError: true, message: 'This field is required' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Work Hours');
    }
    if (!filterData.babysittingPlace || errors.babysittingPlace.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            babysittingPlace: { hasError: true, message: 'This field is required' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Childcare Location');
    }    
    const validationResult = validateTimeTable({ timeTable: filterData.timeTable, workTime: filterData.workTime });
    updatedErrors = {
        ...updatedErrors,
        timeTable: validationResult
    };
    setErrors(updatedErrors);
    if (validationResult.hasError) {
        pass = false;
        newSnackbarMessages.push('Timetable');
    }

    if (newSnackbarMessages.length > 0) {
        setSnackbarMessage(`The following fields are incorrect: ${newSnackbarMessages.join(', ')}`);
    } else {
        setSnackbarMessage('');
    }
    return pass;
}

/////////////// FLATTEN FUNCTIONS ///////////////
///// (to pass the data as url parameters) /////

// Function to flatten the timetable object into a single-level object
function FlattenTimetable(timetable) {
    // Initialize an empty object to store the flattened timetable
    const flatTimetable = {};
    // Iterate over each day in the timetable
    Object.keys(timetable).forEach(day => {
        // Iterate over each time period for the current day
        timetable[day].forEach(time => {
            // Create a key in the format 'timetable_day_time' and set its value to true
            flatTimetable[`timetable_${day}_${time}`] = true;
        });
    });
    // Return the flattened timetable object
    return flatTimetable;
}

// Function to flatten the skills object with a given prefix
function FlattenSkills(obj, prefix) {
    // Initialize an empty object to store the flattened skills
    const flatObject = {};
    // Iterate over each key in the skills object
    Object.keys(obj).forEach(key => {
        // Create a new key in the format 'prefix_key' and set its value to the original value
        flatObject[`${prefix}_${key}`] = obj[key];
    });
    // Return the flattened skills object
    return flatObject;
}

/////////////// FILTERS ///////////////

function FormTown({ formData, setFormData, errors, setErrors }) {
    const towns = [
        "Athens", "Patra", "Thessaloniki"
    ];

    // Check if field is empty
    const handleBlur = () => {
        if (!formData.town) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                town: { hasError: true, message: 'Field is mandatory' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                town: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <Autocomplete
            options={towns}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
                setFormData({ ...formData, town: newValue });
                handleBlur();
            }}
            fullWidth
            value={formData.town || null}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Town*"
                    error={errors.town.hasError}
                    helperText={errors.town.message}
                />
            )}
            onBlur={handleBlur}
        />
    );
}

function FormChildAgeGroup({ formData, setFormData, errors, setErrors }) {
    // Check if field is empty
    const handleBlur = () => {
        if (!formData.childAgeGroup) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                childAgeGroup: { hasError: true, message: 'Field is mandatory' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                childAgeGroup: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <TextField
            label="Child's Age Group*"
            select
            value={formData.childAgeGroup}
            onChange={(e) => setFormData({
                ...formData,
                childAgeGroup: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.childAgeGroup.hasError}
            helperText={errors.childAgeGroup.message}
            slotProps={{ input: { style: { textAlign: 'left' } } }}
        >
            <MenuItem value="1-2">1-2 years old</MenuItem>
            <MenuItem value="3-6">3-6 years old</MenuItem>
            <MenuItem value="7-12">7-12 years old</MenuItem>
            <MenuItem value="13-16">13-16 years old</MenuItem>
        </TextField>
    );
}

function FormBabysittingPlace({ formData, setFormData, errors, setErrors }) {
    const handleBlur = () => {
        if (!formData.babysittingPlace) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                babysittingPlace: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                babysittingPlace: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <TextField
            label="Childcare Location"
            name="babysittingPlace"
            select
            value={formData.babysittingPlace}
            onChange={(e) => setFormData({
                ...formData,
                babysittingPlace: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.babysittingPlace.hasError}
            helperText={errors.babysittingPlace.message}
            slotProps={{ input: { style: { textAlign: 'left' } } }}
        >
            <MenuItem value="parents-home">Parent's House</MenuItem>
            <MenuItem value="nanny-home">Nanny's House</MenuItem>
            <MenuItem value="both">Parent's & Nanny's House</MenuItem>
        </TextField>
    );
}

function FormWorkTime({ formData, setFormData, errors, setErrors }) {
    const handleBlur = () => {
        if (!formData.workTime) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                workTime: { hasError: true, message: 'Field is mandatory' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                workTime: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <TextField
            label="Work Hours*"
            select
            value={formData.workTime}
            onChange={(e) => setFormData({
                ...formData,
                workTime: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.workTime.hasError}
            helperText={errors.workTime.message}
        >
            <MenuItem value="part-time">4 hours (Part Time)</MenuItem>
            <MenuItem value="full-time">8 hours (Full Time)</MenuItem>
        </TextField>
    );
}



const validateTimeTable = ({ timeTable, workTime }) => {
    let invalid = false;
    let errorMessage = '';
    let selectedDays = 0;

    console.log('Checking timetable....');
    // Timetable validation
    daysOfWeek.forEach((day) => {
        const selectedTimes = timePeriods.filter((time) => timeTable[day]?.includes(time));
        if (selectedTimes.length > 0) {
            selectedDays++;
            if (workTime === 'part-time' && selectedTimes.length !== 1) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            } else if (workTime === 'full-time' && selectedTimes.length !== 2) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            }
        }
    });

    // Timetable error messages
    if (selectedDays !== 5) {
        invalid = true;
        errorMessage = 'You must select hours for exactly 5 days.';
    } else if (invalid) {
        errorMessage = 'For part-time work, you can select 4 hours per day, and for full-time work, 8 hours per day.';
    }

    return { hasError: invalid, message: errorMessage };
};

// Timetable (cells are buttons, can be clicked to select/deselect)
function FormTimeTable({ formData, setFormData, errors }) {
    // Handle cell click
    const handleCellClick = (day, time) => {
        setFormData((prevFormData) => {
            const newTimetable = { ...prevFormData.timeTable };
            if (!newTimetable[day]) {
                newTimetable[day] = [];
            }
            if (newTimetable[day].includes(time)) {
                newTimetable[day] = newTimetable[day].filter((t) => t !== time);
            } else {
                newTimetable[day].push(time);
            }
            return { ...prevFormData, timeTable: newTimetable };
        });
    };

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    margin: '1rem 0',
                    borderRadius: '1rem',
                    boxShadow: '3',
                    backgroundColor: "#fafafa",
                    border: errors.timeTable.hasError ? '2px solid var(--clr-error)' : '',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {daysOfWeek.map((day) => (  // Render the days of the week
                                <TableCell
                                    key={day}
                                    align="center"
                                    sx={{ 
                                        padding: '5px',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem' 
                                }}>
                                    {day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timePeriods.map((time) => (    // Render the time periods + 7 cells for each day
                            <TableRow key={time}>
                                <TableCell 
                                    component="th"
                                    scope="row" 
                                    sx={{ 
                                        padding: '5px', 
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem', 
                                        width: '5px'
                                    }}>
                                        {time}
                                    </TableCell>
                                {daysOfWeek.map((day) => (  // green color selected, grey color unselected
                                    <TableCell key={day} align="center" sx={{ padding: '5px' }}>
                                        <Button
                                            sx={{
                                                backgroundColor: formData.timeTable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                                '&:hover': {
                                                    backgroundColor: formData.timeTable[day]?.includes(time) ? 'var(--clr-dark-green)' : 'var(--clr-dark-grey)',
                                                },
                                                width: '100px',
                                                height: '40px',
                                                borderRadius: '0.5rem',
                                                margin: '1px',
                                            }}
                                            onClick={() => handleCellClick(day, time)}
                                        >
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {errors.timeTable.hasError && ( // make border red if there is error
                <p style={{ color: 'var(--clr-error)', fontSize: '1.2rem'}}>
                    {errors.timeTable.message}
                </p>
            )}
        </>
    );
}

function FormExperience({ formData, setFormData }) {
    const handleDelete = () => {
        setFormData({
            ...formData,
            experience: ''
        });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <TextField
                label="Experience"
                select
                value={formData.experience}
                onChange={(e) => setFormData({
                    ...formData,
                    experience: e.target.value
                })}
                fullWidth
                slotProps={{ input: { style: { textAlign: 'left' } } }}
                >
                <MenuItem value="0-6">0-6 months</MenuItem>
                <MenuItem value="6-12">6-12 months</MenuItem>
                <MenuItem value="12-18">12-18 months</MenuItem>
                <MenuItem value="18-24">18-24 months</MenuItem>
                <MenuItem value="24-36">24-36 months</MenuItem>
                <MenuItem value="36+">36+ months</MenuItem>
            </TextField>
            <Button
                variant="contained"
                onClick={handleDelete}
                sx={{
                    backgroundColor: 'var(--clr-error-main)',
                    color: 'var(--clr-white)',
                    '&:hover': {
                        opacity: 0.8,
                    },
                }}
            >
                <p className='button-text'>Delete</p>
                <ClearIcon />
            </Button>
        </Box>
    );
}

function FormDegree({ formData, setFormData }) {
    const handleDelete = () => {
        setFormData({
            ...formData,
            degree: ''
        });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <TextField
                label="Degrees"
                select
                value={formData.degree}
                onChange={(e) => setFormData({
                    ...formData,
                    degree: e.target.value
                })}
                fullWidth
                slotProps={{ input: { style: { textAlign: 'left' } } }}
            >
                <MenuItem value="school">High School Diploma</MenuItem>
                <MenuItem value="college">College</MenuItem>
                <MenuItem value="tei">TEI</MenuItem>
                <MenuItem value="university">University</MenuItem>
            </TextField>
            <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
                backgroundColor: 'var(--clr-error-main)',
                '&:hover': {
                    opacity: 0.8,
                },
            }} >
                <p className='button-text'>Delete</p>
                <ClearIcon />
            </Button>
        </Box>
    );
}

function FormSkills({ formData, setFormData }) {
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
            <p><u>Foreign Languages</u></p>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.english}
                        onChange={() => handleToggleChange('languages', 'english')}
                        name="english"
                    />}
                    label="English"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.german}
                        onChange={() => handleToggleChange('languages', 'german')}
                        name="german"
                    />}
                    label="German"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.french}
                        onChange={() => handleToggleChange('languages', 'french')}
                        name="french"
                    />}
                    label="French"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.languages.spanish}
                        onChange={() => handleToggleChange('languages', 'spanish')}
                        name="spanish"
                    />}
                    label="Spanish"
                />
            </Box>
            
            <p><u>Music</u></p>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.piano}
                        onChange={() => handleToggleChange('music', 'piano')}
                        name="piano"
                    />}
                    label="Piano"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.guitar}
                        onChange={() => handleToggleChange('music', 'guitar')}
                        name="guitar"
                    />}
                    label="Guitar"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.violin}
                        onChange={() => handleToggleChange('music', 'violin')}
                        name="violin"
                    />}
                    label="Violin"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.music.flute}
                        onChange={() => handleToggleChange('music', 'flute')}
                        name="flute"
                    />}
                    label="Flute"
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

    const handleDelete = () => {
        setFormData({
            ...formData,
            rating: 0
        });
    };

    return (
        <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Rating
                precision={0.5}
                size="large"
                value={formData.rating || 0}
                onChange={handleRatingChange}
                sx={{ fontSize: '3.5rem' }}
            />
            <Button
                variant="contained"
                onClick={handleDelete}
                sx={{
                    backgroundColor: 'var(--clr-error-main)',
                    color: 'var(--clr-white)',
                    '&:hover': {
                        opacity: 0.8,
                    },
                    height: '80%'
                }}
            >
                <p className='button-text'>Delete</p>
                <ClearIcon />
            </Button>
        </Box>
    );
}

export { FormTown, FormChildAgeGroup, FormWorkTime, FormBabysittingPlace, FormTimeTable, FormExperience, FormDegree, FormSkills, FormRating, FlattenTimetable, FlattenSkills, ValidateFilterData };