import React from 'react';
import { Button, Autocomplete, TextField, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, FormControlLabel, Checkbox, Rating } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import '../../style.css';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
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
            town: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Πόλη');
    }
    if (!filterData.childAgeGroup || errors.childAgeGroup.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            childAgeGroup: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Ηλικιακή Ομάδα');
    }
    if (!filterData.workTime || errors.workTime.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            workTime: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Ώρες Εργασίας');
    }
    if (!filterData.babysittingPlace || errors.babysittingPlace.hasError) {
        pass = false;
        updatedErrors = {
            ...updatedErrors,
            babysittingPlace: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
        };
        setErrors(updatedErrors);
        newSnackbarMessages.push('Χώρος Φύλαξης');
    }
    const validationResult = validateTimeTable({ timeTable: filterData.timeTable, workTime: filterData.workTime });
    updatedErrors = {
        ...updatedErrors,
        timeTable: validationResult
    };
    setErrors(updatedErrors);
    if (validationResult.hasError) {
        pass = false;
        newSnackbarMessages.push('Χρονοδιάγραμμα');
    }

    if (newSnackbarMessages.length > 0) {
        setSnackbarMessage(`Τα παρακάτω πεδία είναι λανθασμένα: ${newSnackbarMessages.join(', ')}`);
    } else {
        setSnackbarMessage('');
    }
    return pass;
}

/////////////// FLATTEN FUNCTIONS ///////////////
///// (to pass the data as url parameters) /////

function FlattenTimetable(timetable) {
    const flatTimetable = {};
    Object.keys(timetable).forEach(day => {
        timetable[day].forEach(time => {
            flatTimetable[`timetable_${day}_${time}`] = true;
        });
    });
    return flatTimetable;
}

function FlattenSkills(obj, prefix) {
    const flatObject = {};
    Object.keys(obj).forEach(key => {
        flatObject[`${prefix}_${key}`] = obj[key];
    });
    return flatObject;
}

/////////////// FILTERS ///////////////

function FormTown({ formData, setFormData, errors, setErrors }) {
    const towns = [
        "Athens", "Mesologgi", "Halkida", "Karpenisi", "Lamia", "Amfissa", "Tripoli", "Patra", "Pyrgos", "Korinthos",
        "Sparti", "Kalamata", "Zakynthos", "Kerkyra", "Argostoli", "Leykada", "Arta", "Prebeza", "Karditsa", "Larissa",
        "Bolos", "Trikala", "Grebena", "Drama", "Beroia", "Thessaloniki", "Kabala", "Kastoria", "Kilkis", "Kozani",
        "Edessa", "Katerini", "Serres", "Florina", "Polygyros", "Aleksandroypoli", "Ksanthi", "Komotini", "Rodos",
        "Ermoypoli", "Mytilini", "Samos", "Xios", "Hrakleio", "Agios Nikolaos", "Rethimno", "Hania", "Ioannina",
        "Hgoymenitsa", "Leivadia", "Nayplion"
    ];

    // Check if field is empty
    const handleBlur = () => {
        if (!formData.town) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                town: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
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
                    label="Πόλη*"
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
                childAgeGroup: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
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
            label="Ηλικιακή Ομάδα*"
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
            InputProps={{ style: { textAlign: 'left' } }}
        >
            <MenuItem value="1-2">1-2 χρονών</MenuItem>
            <MenuItem value="3-6">3-6 χρονών</MenuItem>
            <MenuItem value="7-12">7-12 χρονών</MenuItem>
            <MenuItem value="13-16">13-16 χρονών</MenuItem>
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
            label="Χώρος Φύλαξης"
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
            InputProps={{ style: { textAlign: 'left' } }}
        >
            <MenuItem value="parents-home">Σπίτι Γονέα</MenuItem>
            <MenuItem value="nanny-home">Σπίτι Νταντάς</MenuItem>
            <MenuItem value="both">Και στα δύο</MenuItem>
        </TextField>
    );
}

function FormWorkTime({ formData, setFormData, errors, setErrors }) {
    const handleBlur = () => {
        if (!formData.workTime) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                workTime: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
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
            label="Ώρες Εργασίας*"
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
            <MenuItem value="part-time">4 ώρες (Μερική Απασχόληση)</MenuItem>
            <MenuItem value="full-time">8 ώρες (Πλήρης Απασχόληση)</MenuItem>
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
            if (workTime === 'full-time' && selectedTimes.length < 2) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            } else if (workTime === 'part-time' && selectedTimes.length < 1) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            }
        }
    });

    // Timetable error messages
    if (selectedDays < 5) {
        console.log('Error found: not enough days selected');
        invalid = true;
        errorMessage = 'Πρέπει να διαλέξετε ώρες για τουλάχιστον 5 μέρες';
    } else if (invalid) {
        console.log('Error found!!!!!!!!!!!');
        errorMessage = 'Πρέπει στις μέρες που έχετε διαλέξει να βάλετε αρκετές ώρες για να καλύπτουν τους χρόνους απασχόλησης που έχετε επιλέξει';
    }

    return { hasError: invalid, message: errorMessage };
};

function FormTimeTable({ formData, setFormData, errors }) {
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
                            {daysOfWeek.map((day) => (
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
                        {timePeriods.map((time) => (
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
                                {daysOfWeek.map((day) => (
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
                                            // disabled={!editMode}
                                        >
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {errors.timeTable.hasError && (
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
                label="Εμπειρία"
                select
                value={formData.experience}
                onChange={(e) => setFormData({
                    ...formData,
                    experience: e.target.value
                })}
                fullWidth
                InputProps={{ style: { textAlign: 'left' } }}
                >
                <MenuItem value="0-6">0-6 μήνες</MenuItem>
                <MenuItem value="6-12">6-12 μήνες</MenuItem>
                <MenuItem value="12-18">12-18 μήνες</MenuItem>
                <MenuItem value="18-24">18-24 μήνες</MenuItem>
                <MenuItem value="24-36">24-36 μήνες</MenuItem>
                <MenuItem value="36+">36+ μήνες</MenuItem>
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
                <p className='button-text'>Διαγραφή</p>
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
                label="Σπουδές"
                select
                value={formData.degree}
                onChange={(e) => setFormData({
                    ...formData,
                    degree: e.target.value
                })}
                fullWidth
                InputProps={{ style: { textAlign: 'left' } }}
            >
                <MenuItem value="school">Απολυτήριο Λυκείου</MenuItem>
                <MenuItem value="college">Κολλέγιο</MenuItem>
                <MenuItem value="tei">ΤΕΙ</MenuItem>
                <MenuItem value="university">Πανεπιστήμιο</MenuItem>
            </TextField>
            <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
                backgroundColor: 'var(--clr-error-main)',
                // color: 'var(--clr-white)',
                '&:hover': {
                    opacity: 0.8,
                },
            }} >
                <p className='button-text'>Διαγραφή</p>
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
            <p><u>Ξένες Γλώσσες</u></p>
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
            
            <p><u>Μουσική</u></p>
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
                <p className='button-text'>Διαγραφή</p>
                <ClearIcon />
            </Button>
        </Box>
    );
}

export { FormTown, FormChildAgeGroup, FormWorkTime, FormBabysittingPlace, FormTimeTable, FormExperience, FormDegree, FormSkills, FormRating, FlattenTimetable, FlattenSkills, ValidateFilterData };