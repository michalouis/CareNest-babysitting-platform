import React from 'react';
import { Box, Button, TextField, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Validate Application Fields and show error messages
function validate(formData, setErrors, setSnackbarMessage, setSnackbarSeverity) {
    const newErrors = {};
    const newSnackbarMessages = [];

    // Check if dates are filled and valid
    const fromMonthFilled = formData.fromDate.month !== '';
    const toMonthFilled = formData.toDate.month !== '';

    if (!fromMonthFilled || !formData.fromDate.year || formData.fromDate.year < 2025) {
        setSnackbarSeverity('error');
        newErrors.fromDate = 'Enter a valid date.';
        newSnackbarMessages.push('From Month/Year');
    }
    if (!toMonthFilled || !formData.toDate.year || formData.toDate.year < 2025) {
        setSnackbarSeverity('error');
        newErrors.toDate = 'Enter a valid date.';
        newSnackbarMessages.push('To Month/Year');
    }

    // Check if "from" date is earlier than "to" date
    if (formData.fromDate.year && formData.toDate.year) {
        const fromDate = new Date(formData.fromDate.year, formData.fromDate.month);
        const toDate = new Date(formData.toDate.year, formData.toDate.month);
        if (fromDate > toDate) {
            setSnackbarSeverity('error');
            newErrors.fromDate = 'The "From" date must be earlier than the "To" date.';
            newErrors.toDate = 'The "From" date must be earlier than the "To" date.';
            newSnackbarMessages.push('"From" and "To" date');
        }
    }

    // Timetable validation
    let selectedDays = 0;
    let timetableError = false;
    daysOfWeek.forEach((day) => {
        const selectedTimes = timePeriods.filter((time) => formData.timetable[day]?.includes(time));
        if (selectedTimes.length > 0) {
            selectedDays++;
            if (formData.employmentType === 'part-time' && selectedTimes.length !== 1) {    // Part-time: 4 hours per day (1 time period)
                timetableError = true;
            } else if (formData.employmentType === 'full-time' && selectedTimes.length !== 2) {   // Full-time: 8 hours per day (2 time periods)
                timetableError = true;
            }
        }
    });

    if (selectedDays !== 5) {   // User must pick 5 days
        setSnackbarSeverity('error');
        newErrors.timetable = 'You must select hours for at least 5 days.';
        newSnackbarMessages.push('Timetable');
    } else if (timetableError) {
        setSnackbarSeverity('error');
        newErrors.timetable = 'For part-time work, you can select 4 hours per day, and for full-time work, 8 hours per day.';
        newSnackbarMessages.push('Timetable');
    }
    
    setErrors(newErrors);
    
    if (newSnackbarMessages.length > 0) {
        setSnackbarSeverity('error');
        setSnackbarMessage(`The following fields are incorrect: ${newSnackbarMessages.join(', ')}`);
    } else {
        setSnackbarMessage('');
    }    

    return Object.keys(newErrors).length === 0;
}

////// Application Fields //////

// Display Nanny's Name (cannot be edited, fetched from userData)
function FormNannyName({ formData }) {
    return (
        <TextField
            variant="filled"
            label="Nanny's Name"
            value={formData.nannyName}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            disabled={true}
        />
    );
}

// Display Child's Age Group (cannot be edited, fetched from userData)
function FormChildAgeGroup({ formData }) {
    return (
        <TextField
            variant="filled"
            label="Child's Age Group"
            value={`${formData.childAgeGroup} χρονών`}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            disabled={true}
        />
    );
}

// Display Employment Type (cannot be edited, fetched from nanny's job posting)
function FormEmploymentType({ formData }) {
    const employmentTypeText = formData.employmentType === 'part-time' 
        ? 'Part Time (4 hours)' 
        : 'Full Time (8 hours)';

    return (
        <TextField
            variant="filled"
            label="Employment Type"
            value={employmentTypeText}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            disabled={true}
        />
    );
}

// Display Babysitting Place (cannot be edited, fetched from nanny's job posting)
function FormBabysittingPlace({ formData }) {
    const babysittingPlaceText = formData.babysittingPlace === 'parents-home'
        ? 'Parent\'s Home'
        : formData.babysittingPlace === 'nanny-home'
        ? 'Naany\'s Home'
        : 'Parent\'s or Nanny\'s Home';

    return (
        <TextField
            variant="filled"
            label="Babysitting Place"
            value={babysittingPlaceText}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            disabled={true}
        />
    );
}

// Date Range (from - to) fields
// Month - dropdown, Year - textfield
function FormDateRange({ formData, setFormData, errors, editMode }) {
    const handleDateChange = (field, type, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: {
                ...prevFormData[field],
                [type]: value
            }
        }));
    };

    return (
        <>
            <h3>From</h3>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Month"
                    select
                    value={formData.fromDate.month}
                    onChange={(e) => handleDateChange('fromDate', 'month', e.target.value)}
                    fullWidth
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                    disabled={!editMode}
                >
                    {months.map((month, index) => (
                        <MenuItem key={index} value={index}>{month}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Year"
                    type="text"
                    value={formData.fromDate.year}
                    onChange={(e) => handleDateChange('fromDate', 'year', e.target.value)}
                    fullWidth
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                    disabled={!editMode}
                />
            </Box>
            <h3>To</h3>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Month"
                    select
                    value={formData.toDate.month}
                    onChange={(e) => handleDateChange('toDate', 'month', e.target.value)}
                    fullWidth
                    error={!!errors.toDate}
                    helperText={errors.toDate}
                    disabled={!editMode}
                >
                    {months.map((month, index) => (
                        <MenuItem key={index} value={index}>{month}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Year"
                    type="text"
                    value={formData.toDate.year}
                    onChange={(e) => handleDateChange('toDate', 'year', e.target.value)}
                    fullWidth
                    error={!!errors.toDate}
                    helperText={errors.toDate}
                    disabled={!editMode}
                />
            </Box>
        </>
    );
}

// Timetable (cells are buttons, can be clicked to select/deselect)
function FormTimeTable({ formData, setFormData, nannyTimetable, editMode, errors }) {
    // Handle cell click
    const handleCellClick = (day, time) => {
        setFormData((prevFormData) => {
            const newTimetable = { ...prevFormData.timetable };
            if (!newTimetable[day]) {
                newTimetable[day] = [];
            }
            if (newTimetable[day].includes(time)) {
                newTimetable[day] = newTimetable[day].filter((t) => t !== time);
            } else {
                newTimetable[day].push(time);
            }
            return { ...prevFormData, timetable: newTimetable };
        });
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                margin: '1rem 0',
                borderRadius: '1rem',
                boxShadow: '3',
                backgroundColor: "#fafafa",
                border: errors.timetable ? '2px solid var(--clr-error)' : '',
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {daysOfWeek.map((day) => (  // Display days of the week
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
                    {timePeriods.map((time) => (    // Display time periods + buttons
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
                                // If time period not available make it grey
                                // If time period available by nanny and user make it green
                                // If time period selected by paretn add a check on it
                                <TableCell key={day} align="center" sx={{ padding: '5px' }}>
                                    <Button
                                            sx={{
                                            backgroundColor: nannyTimetable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                            '&:hover': {
                                                backgroundColor: nannyTimetable[day]?.includes(time) ? 'var(--clr-dark-green)' : 'var(--clr-dark-grey)',
                                            },
                                            width: '100px',
                                            height: '40px',
                                            borderRadius: '0.5rem',
                                            margin: '1px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onClick={() => handleCellClick(day, time)}
                                        disabled={!nannyTimetable[day]?.includes(time) || !editMode}
                                    >
                                        {nannyTimetable[day]?.includes(time) &&
                                        formData.timetable[day]?.includes(time) &&
                                        <CheckIcon sx={{ color: 'black', fontSize: '2.5rem' }}/>}
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable, validate };