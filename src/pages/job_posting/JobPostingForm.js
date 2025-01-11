import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, FormControlLabel, Checkbox, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { updateDoc, getDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
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
                    
                navigate('/job-posting');
            }
        } catch (error) {
            console.error('Error submitting job posting:', error);
            setSnackbarState('error');
            setSnackbarMessage('Υπήρξε σφάλμα κατά την υποβολή της αγγελίας σας.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!validate()) return;
    
        setLoading(true);
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
    
                if (userDocSnap.exists()) {
                    await updateDoc(userDocRef, { jobPostingData });
                } else {
                    await setDoc(userDocRef, { jobPostingData });
                }
    
                setEditMode(false);
                setSaved(true);
                window.scrollTo(0, 0);
                setSnackbarState('success');
                setSnackbarMessage('Η αγγελία σας αποθηκεύτηκε προσωρινά με επιτυχία! Για να την δημοσιεύστε πατήστε υποβολή.');
            }
        } catch (error) {
            console.error('Error updating job posting:', error);
        } finally {
            setLoading(false);
        }
    };

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
                if (jobPostingData.employmentType === 'full-time' && selectedTimes.length < 2) {
                    newErrors.timetable = true;
                } else if (jobPostingData.employmentType === 'part-time' && selectedTimes.length < 1) {
                    newErrors.timetable = true;
                }
            }
        });
    
        // Timetable error messages
        if (selectedDays < 5) {
            newErrors.timetable = true;
            setTimetableError('Πρέπει να διαλέξετε ώρες για  τουλάχιστον 5 μέρες');
        } else if (newErrors.timetable) {
            setTimetableError('Πρέπει στις μέρες που έχετε διαλέξει να βάλετε αρκετές ώρες για να καλύπτουν τους χρόνους απασχόλησης που έχετε επιλέξει');
        } else {
            setTimetableError('');
            setjobPostingData((prevData) => ({ ...prevData, timetable: newTimetable }));
        }
    
        // Other fields validation & snackbar error messages
        if (!jobPostingData.ageGroups.length) {
            newErrors.ageGroups = true;
            newSnackbarMessages.push('Ηλικιακές Ομάδες Παιδιών');
        }
        if (!jobPostingData.employmentType) {
            newErrors.employmentType = true;
            newSnackbarMessages.push('Χρόνος Απασχόλησης');
        }
        if (!jobPostingData.babysittingPlace) {
            newErrors.babysittingPlace = true;
            newSnackbarMessages.push('Χώρος Φύλαξης');
        }
        if (newErrors.timetable) {
            newSnackbarMessages.push('Χρονοδιάγραμμα Διαθεσιμότητας');
        }
    
        setErrorStates(newErrors);
        if (newSnackbarMessages.length > 0) {
            setSnackbarState('error');
            setSnackbarMessage(`Τα παρακάτω πεδία είναι λανθασμένα: ${newSnackbarMessages.join(', ')}`);
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
                {editMode ? 'Επεξεργασία' : 'Προεπισκόπηση'}
            </h1>
            <p style={{color: 'var(--clr-grey)'}}>Όλα τα πεδία είναι υποχρεωτικά.</p>

            {/* Age Groups */}
            <h2>Ηλικιακές Ομάδες Παιδιών</h2>
            <p style={{ fontSize: '1.15rem' }}>Ηλικιακές ομάδες παιδιών που νιώθετε άνετα να φροντίσετε</p>
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
                    label="1-2 χρονών"
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
                    label="3-6 χρονών"
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
                    label="7-12 χρονών"
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
                    label="13-16 χρονών"
                />
            </Box>

            {/* Employment Type */}
            <h2>Χρόνος Απασχόλησης</h2>
            <p style={{ fontSize: '1.15rem' }}>Ο χρόνος που απασχολείστε την ημέρα εργασίας σας</p>
            <TextField
                label="Χρόνος Απασχόλησης"
                name="employmentType"
                select
                value={jobPostingData.employmentType}
                onChange={(e) => setjobPostingData({ ...jobPostingData, employmentType: e.target.value })}
                onBlur={() => handleBlur('employmentType')}
                fullWidth
                error={errorStates.employmentType}
                helperText={errorStates.employmentType ? 'Το πεδίο είναι υποχρεωτικό' : ''}
                disabled={!editMode}
            >
                <MenuItem value="part-time">Μερική Απασχόληση (4 ώρες)</MenuItem>
                <MenuItem value="full-time">Πλήρης Απασχόληση (8 ώρες)</MenuItem>
            </TextField>

            {/* Babysitting Place */}
            <h2>Χώρος Φύλαξης</h2>
            <p style={{ fontSize: '1.15rem' }}>Ο χώρος που θέλετε να εργάζεστε</p>
            <TextField
                label="Χώρος Φύλαξης"
                name="babysittingPlace"
                select
                value={jobPostingData.babysittingPlace}
                onChange={(e) => setjobPostingData({ ...jobPostingData, babysittingPlace: e.target.value })}
                onBlur={() => handleBlur('babysittingPlace')}
                fullWidth
                error={errorStates.babysittingPlace}
                helperText={errorStates.babysittingPlace ? 'Το πεδίο είναι υποχρεωτικό' : ''}
                disabled={!editMode}
            >
                <MenuItem value="parents-home">Σπίτι Γονέα</MenuItem>
                <MenuItem value="nanny-home">Σπίτι Μου</MenuItem>
                <MenuItem value="both">Και στα δύο</MenuItem>
            </TextField>

            {/* Timetable */}
            <h2>Χρονοδιάγραμμα Διαθεσιμότητας</h2>
            <p style={{ fontSize: '1.15rem' }}>
                Διαλέξτε τα χρονικά διαστήματα και μέρες που είστε πρόθυμοι να δουλέψετε.
                Ο γονέας θα μπορεί να διαλέξει από αυτές τις ώρες/μέρες
                να σας προσλάβει για να φυλάξετε το παιδί του. (Πρέπει να διαλέξετε ώρες για 5 από τις μέρες της εβδομάδας)
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
                    <p className='big-button-text'>Προσωρινή Αποθήκευση</p>
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
                        <p className='big-button-text'>Επεξεργασία</p>
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
                        <p className='big-button-text'>Υποβολή</p>
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