import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, RadioGroup, FormControlLabel, Radio, Box, MenuItem } from '@mui/material';
import { addDoc, updateDoc, doc, collection, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// hour and minutes choices
const hours = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '15', '30', '45'];

// Component to create a meeting
function MakeMeetingDialog({ open, onClose, nannyId, parentFirstName, parentLastName, nannyFirstName, nannyLastName }) {
    // State variables for the form fields
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [meetingType, setMeetingType] = useState('');
    const [address, setAddress] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State variables for the form field errors
    const [dayError, setDayError] = useState(false);
    const [monthError, setMonthError] = useState(false);
    const [yearError, setYearError] = useState(false);
    const [hourError, setHourError] = useState(false);
    const [minuteError, setMinuteError] = useState(false);
    const [meetingTypeError, setMeetingTypeError] = useState(false);
    const [addressError, setAddressError] = useState(false);

    const navigate = useNavigate();

    // Function to validate the form fields
    const validateFields = () => {
        let isValid = true;

        // get current date to check if the selected date is in the past
        const selectedDate = new Date(year, month, day, hour, minute);
        const currentDate = new Date();

        // check if the selected day is valid
        if (!day || day < 1 || day > 31) {
            setDayError(true);
            isValid = false;
        } else {
            setDayError(false);
        }

        if (month === '' || month === null || month === undefined) {    // month is 0-indexed
            setMonthError(true);
            isValid = false;
        } else {
            setMonthError(false);
        }

        // check if year if valid
        if (!year || year < currentYear || year < 2025) {
            setYearError(true);
            isValid = false;
        } else {
            setYearError(false);
        }

        // check if the selected date is in the past
        if (selectedDate < currentDate) {
            setDayError(true);
            setMonthError(true);
            setYearError(true);
            isValid = false;
        }

        if (!hour) {
            setHourError(true);
            isValid = false;
        } else {
            setHourError(false);
        }

        if (!minute) {
            setMinuteError(true);
            isValid = false;
        } else {
            setMinuteError(false);
        }

        if (!meetingType) {
            setMeetingTypeError(true);
            isValid = false;
        } else {
            setMeetingTypeError(false);
        }

        if (meetingType === 'in-person' && !address) {
            setAddressError(true);
            isValid = false;
        } else {
            setAddressError(false);
        }

        return isValid;
    };

    // Function to handle the form submission
    const handleConfirmSubmit = async () => {
        if (!validateFields()) {
            return;
        }

        setIsSubmitting(true);

        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
            console.error('No user is currently logged in.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Combine day, month, hour, and minute into a single DateTime object
            const dateTime = { year, month, day, hour, minute };

            // Add the meeting to the meetings collection
            const meetingDocRef = await addDoc(collection(FIREBASE_DB, 'meetings'), {
                parentId: user.uid,
                parentFirstName: parentFirstName,
                parentLastName: parentLastName,
                nannyFirstName: nannyFirstName,
                nannyLastName: nannyLastName,
                nannyId: nannyId,
                dateTime: dateTime,
                meetingType: meetingType,
                address: meetingType === 'in-person' ? address : '',
                meetingState: 'pending',
                timestamp: serverTimestamp()
            });

            // Update the meeting document with the meetingId
            await updateDoc(meetingDocRef, {
                meetingId: meetingDocRef.id
            });

            // Update the meetings array for both the parent and the nanny
            const parentDocRef = doc(FIREBASE_DB, 'users', user.uid);
            const nannyDocRef = doc(FIREBASE_DB, 'users', nannyId);

            await updateDoc(parentDocRef, {
                meetings: arrayUnion(meetingDocRef.id)
            });

            await updateDoc(nannyDocRef, {
                meetings: arrayUnion(meetingDocRef.id)
            });

            console.log('Meeting created successfully:', meetingDocRef.id);

            // Navigate to the view meeting page with the meetingId as a parameter
            navigate(`/CareNest-babysitting-platform/meetings/view-meeting/${meetingDocRef.id}`);
        } catch (error) {
            console.error('Error creating meeting:', error);
        } finally {
            setIsSubmitting(false);
            setConfirmDialogOpen(false);
            onClose();
        }
    };

    // Dialog open and close functions

    const handleOpenConfirmDialog = () => {
        if (validateFields()) {
            setConfirmDialogOpen(true);
        }
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    return (
        <>
            {/* Main dialog for creating a new meeting */}
            <Dialog open={open} onClose={onClose}>
                <DialogTitle><strong>Create Introduction Meeting</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: '1rem' }}>
                        Create an introduction meeting to get in touch with the nanny you want to take care of your child! <br />
                        <strong>Attention! For the meeting to be considered approved, the nanny must accept it after submission.</strong>
                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Date */}
                        <p><strong>Select a date for the meeting:</strong></p>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <TextField
                                label="Day"
                                type="text"
                                value={day}
                                onChange={(e) => { const value = e.target.value; setDay(value); if (value) {setDayError(false); setMonthError(false); setYearError(false);}; }}
                                fullWidth
                                error={dayError}
                                helperText={dayError ? 'Please enter a valid date' : ''}
                            />
                            <TextField
                                label="Month"
                                value={month}
                                onChange={(e) => { const value = e.target.value; setMonth(value); if (value) setMonthError(false); }}
                                select
                                fullWidth
                                error={monthError}
                                helperText={monthError ? 'Please enter a valid date' : ''}
                                >
                                {months.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Year"	
                                type="text"
                                value={year}
                                onChange={(e) => { const value = e.target.value; setYear(value); if (value) setYearError(false); }}
                                fullWidth
                                error={yearError}
                                helperText={yearError ? 'Please enter a valid date' : ''}
                            />
                        </Box>
                        {/* Time */}
                        <p><strong>Select a time for the meeting:</strong></p>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <TextField
                                label="Hour"
                                value={hour}
                                onChange={(e) => { const value = e.target.value; setHour(value); if (value) setHourError(false); }}
                                select
                                fullWidth
                                error={hourError}
                                helperText={hourError ? 'This field is required' : ''}
                            >
                                {hours.map((hour) => (
                                    <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Minutes"
                                value={minute}
                                onChange={(e) => { const value = e.target.value; setMinute(value); if (value) setMinuteError(false); }}
                                select
                                fullWidth
                                error={minuteError}
                                helperText={minuteError ? 'This field is required' : ''}
                            >
                                {minutes.map((minute) => (
                                    <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        {/* Meeting Type */}
                        <p style={{ color: meetingTypeError ? 'var(--clr-error)' : 'var(--clr-black)' }}><strong>Select the type of meeting:</strong></p>
                        <RadioGroup
                            value={meetingType}
                            onChange={(e) => { const value = e.target.value; setMeetingType(value); if (value) setMeetingTypeError(false); }}
                        >
                            <FormControlLabel value="online" control={<Radio />} label="Online" />
                            <FormControlLabel value="in-person" control={<Radio />} label="In-person" />
                        </RadioGroup>
                        {meetingType === 'in-person' && (
                            <TextField
                                label="Meeting Address"
                                value={address}
                                onChange={(e) => { const value = e.target.value; setAddress(value); if (value) setAddressError(false); }}
                                fullWidth
                                error={addressError}
                                helperText={addressError ? 'This field is required' : ''}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} sx={{ color: 'var(--clr-black)' }} disabled={confirmDialogOpen}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant="contained" onClick={handleOpenConfirmDialog} sx={{ backgroundColor: 'var(--clr-violet)' }} disabled={confirmDialogOpen}>
                        <p className='button-text'>Create</p>
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Second dialog to confirm the meeting creation */}
            <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
                <DialogTitle><strong>Confirm Meeting Creation</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to create this meeting?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} sx={{ color: 'var(--clr-black)' }} disabled={isSubmitting}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant="contained" onClick={handleConfirmSubmit} sx={{ backgroundColor: 'var(--clr-violet)' }} disabled={isSubmitting}>
                        <p className='button-text'>Confirm</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MakeMeetingDialog;