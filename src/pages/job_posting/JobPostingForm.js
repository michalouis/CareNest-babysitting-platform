import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, FormControlLabel, Checkbox, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { updateDoc, getDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

function JobPostingForm({ userData, setSaved }) {
    const [editMode, setEditMode] = useState(!userData.jobPostingData);   // if job posting data doesn't exist, start in edit mode
    const [timetableError, setTimetableError] = useState('');   // error message for timetable
    const [loading, setLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarState, setSnackbarState] = useState('error');
    const navigate = useNavigate();

    // form data
    const [jobPostingData, setjobPostingData] = useState(userData.jobPostingData || {
        ageGroups: [],
        employmentType: '',
        babysittingPlace: '',
        timetable: {},
    });

    // error states
    const [errorStates, setErrorStates] = useState({
        ageGroups: false,
        employmentType: false,
        babysittingPlace: false,
        timetable: false,
    });

    ///////////////  HANDLES FOR FIELDS & ERRORS ///////////////

    const handleCheckboxChange = (field, value) => {
        setjobPostingData((prevjobPostingData) => ({
            ...prevjobPostingData,
            [field]: prevjobPostingData[field].includes(value)
                ? prevjobPostingData[field].filter((item) => item !== value)
                : [...prevjobPostingData[field], value],
        }));
        setErrorStates((prevStates) => ({ ...prevStates, [field]: false }));
    };

    const handleBlur = (field) => {
        if (!jobPostingData[field]) {
            setErrorStates((prevStates) => ({ ...prevStates, [field]: true }));
        } else {
            setErrorStates((prevStates) => ({ ...prevStates, [field]: false }));
        }
    };

    /////////////// TIMETABLE ///////////////

    const handleCellClick = (day, time) => {
        setjobPostingData((prevjobPostingData) => {
            const newTimetable = { ...prevjobPostingData.timetable };
            if (!newTimetable[day]) {
                newTimetable[day] = [];
            }
            if (newTimetable[day].includes(time)) {
                newTimetable[day] = newTimetable[day].filter((t) => t !== time);
            } else {
                newTimetable[day].push(time);
            }
            return { ...prevjobPostingData, timetable: newTimetable };
        });
    };

    ///////////////  VALIDATE & SUBMIT ///////////////

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
    
                // Update jobPosted in userData
                await updateDoc(userDocRef, {
                    jobPosted: true,
                });

                // Create a new job posting document in the jobPostings collection with the document ID set to the user's UID
                const jobPostingDocRef = doc(FIREBASE_DB, 'jobPostings', user.uid);
                await setDoc(jobPostingDocRef, {
                    ...jobPostingData,
                });
                    
                navigate('/CareNest-babysitting-platform/job-posting');   // redirect to job posting page, after submitting job posting
            }
        } catch (error) {
            console.error('Error submitting job posting:', error);
            setSnackbarState('error');
            setSnackbarMessage('There was an error submitting your job posting.');
        } finally {
            setLoading(false);
        }
    };

    // save draft of job posting
    const handleSave = async () => {
        if (!validate()) return;
    
        setLoading(true);
        try {
            // save to user data
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
    
                if (userDocSnap.exists()) {
                    await updateDoc(userDocRef, { jobPostingData });
                } else {
                    await setDoc(userDocRef, { jobPostingData });
                }
    
                // show success message, turn off edit mode, and scroll to top
                setEditMode(false);
                setSaved(true);
                window.scrollTo(0, 0);
                setSnackbarState('success');
                setSnackbarMessage('Your job posting has been successfully saved temporarily! To publish it, press submit.');
            }
        } catch (error) {
            console.error('Error updating job posting:', error);
        } finally {
            setLoading(false);
        }
    };

    // Validate timetable
    const validate = () => {
        const newErrors = {};
        const newSnackbarMessages = [];
        let selectedDays = 0;
        const newTimetable = {};
    
        // Timetable validation
        daysOfWeek.forEach((day) => {
            const selectedTimes = timePeriods.filter((time) => jobPostingData.timetable[day]?.includes(time));
            if (selectedTimes.length > 0) {
                selectedDays++;
                newTimetable[day] = selectedTimes;
                if (jobPostingData.employmentType === 'full-time' && selectedTimes.length < 2) {    // must select 2 time periods for full-time
                    newErrors.timetable = true;
                } else if (jobPostingData.employmentType === 'part-time' && selectedTimes.length < 1) {   // must select 1 time period for part-time
                    newErrors.timetable = true;
                }
            }
        });
    
        // Timetable error messages
        if (selectedDays < 5) { // must select hours for at least 5 days
            newErrors.timetable = true;
            setTimetableError('You must select hours for at least 5 days');
        } else if (newErrors.timetable) {
            setTimetableError('On the days you have selected, you must assign enough hours to cover the employment duration you chose');
        } else {
            setTimetableError('');
            setjobPostingData((prevData) => ({ ...prevData, timetable: newTimetable }));
        }
    
        // Other fields validation & snackbar error messages
        if (!jobPostingData.ageGroups.length) {
            newErrors.ageGroups = true;
            newSnackbarMessages.push('Care Age Groups');
        }
        if (!jobPostingData.employmentType) {
            newErrors.employmentType = true;
            newSnackbarMessages.push('Employment Type');
        }
        if (!jobPostingData.babysittingPlace) {
            newErrors.babysittingPlace = true;
            newSnackbarMessages.push('Babysitting Location');
        }
        if (newErrors.timetable) {
            newSnackbarMessages.push('Availability Schedule');
        }
    
        setErrorStates(newErrors);
        if (newSnackbarMessages.length > 0) {
            setSnackbarState('error');
            setSnackbarMessage(`The following fields are incorrect: ${newSnackbarMessages.join(', ')}`);
        } else {
            setSnackbarMessage('');
        }
        return Object.keys(newErrors).length === 0;
    };

    return (
        <Box sx={{
            width: '90%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            backgroundColor: 'var(--clr-white)',
            padding: '2rem 1rem',
            borderRadius: '1rem',
            boxShadow: '2',
            margin: '2rem',
        }}>
            <h1 style={{ alignSelf: 'center' }}>
                Status: <span style={{ fontWeight: 'normal' }}>{editMode ? 'Editing' : 'Preview'}</span>
            </h1>
            <p style={{ color: 'var(--clr-grey)' }}>All fields are required.</p>

            {/* Age Groups */}
            <h2>Age Groups for Care</h2>
            <p style={{ fontSize: '1.15rem' }}>Age groups of children you feel comfortable caring for.</p>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={jobPostingData.ageGroups.includes('1-2')}
                            onChange={() => handleCheckboxChange('ageGroups', '1-2')}
                            name="1-2"
                            sx={{ color: errorStates.ageGroups ? 'var(--clr-error)' : 'var(--clr-black)' }}
                            disabled={!editMode}
                        />
                    }
                    label="1-2 years old"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={jobPostingData.ageGroups.includes('3-6')}
                            onChange={() => handleCheckboxChange('ageGroups', '3-6')}
                            name="3-6"
                            sx={{ color: errorStates.ageGroups ? 'var(--clr-error)' : 'var(--clr-black)' }}
                            disabled={!editMode}
                        />
                    }
                    label="3-6 years old"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={jobPostingData.ageGroups.includes('7-12')}
                            onChange={() => handleCheckboxChange('ageGroups', '7-12')}
                            name="7-12"
                            sx={{ color: errorStates.ageGroups ? 'var(--clr-error)' : 'var(--clr-black)' }}
                            disabled={!editMode}
                        />
                    }
                    label="7-12 years old"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={jobPostingData.ageGroups.includes('13-16')}
                            onChange={() => handleCheckboxChange('ageGroups', '13-16')}
                            name="13-16"
                            sx={{ color: errorStates.ageGroups ? 'var(--clr-error)' : 'var(--clr-black)' }}
                            disabled={!editMode}
                        />
                    }
                    label="13-16 years old"
                />
            </Box>

            {/* Employment Type */}
            <h2>Employment Type</h2>
            <p style={{ fontSize: '1.15rem' }}>The number of hours you work per day.</p>
            <TextField
                label="Employment Type"
                name="employmentType"
                select
                value={jobPostingData.employmentType}
                onChange={(e) => setjobPostingData({ ...jobPostingData, employmentType: e.target.value })}
                onBlur={() => handleBlur('employmentType')}
                fullWidth
                error={errorStates.employmentType}
                helperText={errorStates.employmentType ? 'This field is required' : ''}
                disabled={!editMode}
            >
                <MenuItem value="part-time">Part-Time (4 hours)</MenuItem>
                <MenuItem value="full-time">Full-Time (8 hours)</MenuItem>
            </TextField>

            {/* Babysitting Place */}
            <h2>Work Location</h2>
            <p style={{ fontSize: '1.15rem' }}>Where you prefer to work.</p>
            <TextField
                label="Work Location"
                name="babysittingPlace"
                select
                value={jobPostingData.babysittingPlace}
                onChange={(e) => setjobPostingData({ ...jobPostingData, babysittingPlace: e.target.value })}
                onBlur={() => handleBlur('babysittingPlace')}
                fullWidth
                error={errorStates.babysittingPlace}
                helperText={errorStates.babysittingPlace ? 'This field is required' : ''}
                disabled={!editMode}
            >
                <MenuItem value="parents-home">Parent's Home</MenuItem>
                <MenuItem value="nanny-home">Nanny's Home</MenuItem>
                <MenuItem value="both">Both Locations</MenuItem>
            </TextField>

            {/* Timetable */}
            <h2>Availability Schedule</h2>
            <p style={{ fontSize: '1.15rem' }}>
                Select the time slots and days you are available to work.
                The parent will be able to choose from these hours/days
                to hire you for childcare. (You must select hours for at least 5 days of the week.)
            </p>
            <TableContainer
                component={Paper}
                sx={{
                    margin: '1rem 0',
                    borderRadius: '1rem',
                    boxShadow: '3',
                    backgroundColor: "#fafafa",
                    border: errorStates.timetable ? '2px solid var(--clr-error)' : '',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {daysOfWeek.map((day) => (
                                <TableCell key={day} align="center" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '1.2rem' }}>{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timePeriods.map((time) => (
                            <TableRow key={time}>
                                <TableCell component="th" scope="row" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '1.25rem', width: '5px' }}>{time}</TableCell>
                                {daysOfWeek.map((day) => (
                                    <TableCell key={day} align="center" sx={{ padding: '5px' }}>
                                        <Button
                                            sx={{
                                                backgroundColor: jobPostingData.timetable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                                '&:hover': {
                                                    backgroundColor: jobPostingData.timetable[day]?.includes(time) ? 'var(--clr-dark-green)' : 'var(--clr-dark-grey)',
                                                },
                                                width: '100px',
                                                height: '40px',
                                                borderRadius: '0.5rem',
                                                margin: '1px',
                                            }}
                                            onClick={() => handleCellClick(day, time)}
                                            disabled={!editMode}
                                        >
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {timetableError && <p style={{ color: 'var(--clr-error)' }}>{timetableError}</p>}

            {/* Save draft, edit and submit buttons */}
            {editMode ? (
                <Button
                    variant="contained"
                    onClick={handleSave}
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
                    <p className='big-button-text'>Save Draft</p>
                </Button>
            ) : (
                <Box sx={{ display: 'flex', gap: '2rem', alignSelf: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setEditMode(true);
                            setSaved(false);
                            window.scrollTo(0, 0);
                        }}
                        sx={{
                            alignSelf: 'center',
                            fontSize: '1.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--clr-blue-lighter)',
                            '&:hover': {
                                opacity: '0.8',
                            },
                        }}
                    >
                        <p className='big-button-text'>Edit</p>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            alignSelf: 'center',
                            fontSize: '1.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--clr-violet)',
                            '&:hover': {
                                opacity: '0.8',
                            },
                        }}
                    >
                        <p className='big-button-text'>Submit</p>
                    </Button>
                </Box>
            )}
        
            {/* Snackbar */}
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ marginRight: '0.5rem' }}
            >
                <Alert onClose={() => setSnackbarMessage('')} severity={snackbarState === 'error' ? "error" : "success"}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default JobPostingForm;