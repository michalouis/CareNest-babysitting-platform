import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

function validate(formData, setErrors, setSnackbarMessage, setSnackbarSeverity) {
    const newErrors = {};
    const newSnackbarMessages = [];

    const fromMonthFilled = formData.fromDate.month !== '';
    const toMonthFilled = formData.toDate.month !== '';

    if (!fromMonthFilled || !formData.fromDate.year || formData.fromDate.year < 2025) {
        setSnackbarSeverity('error');
        newErrors.fromDate = 'Βάλτε μια έγκυρη ημερομηνία.';
        newSnackbarMessages.push('Από Μήνας/Έτος');
    }
    if (!toMonthFilled || !formData.toDate.year || formData.toDate.year < 2025) {
        setSnackbarSeverity('error');
        newErrors.toDate = 'Βάλτε μια έγκυρη ημερομηνία.';
        newSnackbarMessages.push('Μέχρι Μήνας/Έτος');
    }

    // Check if "from" date is earlier than "to" date
    if (formData.fromDate.year && formData.toDate.year) {
        const fromDate = new Date(formData.fromDate.year, formData.fromDate.month);
        const toDate = new Date(formData.toDate.year, formData.toDate.month);
        if (fromDate > toDate) {
            setSnackbarSeverity('error');
            newErrors.fromDate = 'Η ημερομηνία "Από" πρέπει να είναι πιο παλιά από την ημερομηνία "Μέχρι".';
            newErrors.toDate = 'Η ημερομηνία "Από" πρέπει να είναι πιο παλιά από την ημερομηνία "Μέχρι".';
            newSnackbarMessages.push('Ημερομηνία "Από" και "Μέχρι"');
        }
    }

    // Timetable validation
    let selectedDays = 0;
    let timetableError = false;
    daysOfWeek.forEach((day) => {
        const selectedTimes = timePeriods.filter((time) => formData.timetable[day]?.includes(time));
        if (selectedTimes.length > 0) {
            selectedDays++;
            if (formData.employmentType === 'part-time' && selectedTimes.length !== 1) {
                timetableError = true;
            } else if (formData.employmentType === 'full-time' && selectedTimes.length !== 2) {
                timetableError = true;
            }
        }
    });

    if (selectedDays !== 5) {
        setSnackbarSeverity('error');
        newErrors.timetable = 'Πρέπει να διαλέξετε ώρες για τουλάχιστον 5 μέρες';
        newSnackbarMessages.push('Χρονοδιάγραμμα');
    } else if (timetableError) {
        setSnackbarSeverity('error');
        newErrors.timetable = 'Για μερική απασχόληση μπορείτε να διαλέξετε 4 ώρες ανά ημέρα και για πλήρη απασχόληση 8 ώρες ανά ημέρα.';
        newSnackbarMessages.push('Χρονοδιάγραμμα');
    }

    setErrors(newErrors);

    if (newSnackbarMessages.length > 0) {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Τα παρακάτω πεδία είναι λανθασμένα: ${newSnackbarMessages.join(', ')}`);
    } else {
        setSnackbarMessage('');
    }

    return Object.keys(newErrors).length === 0;
}

function FormNannyName({ formData }) {
    return (
        <TextField
            variant="filled"
            label="Όνομα Νταντάς"
            value={formData.nannyName}
            fullWidth
            InputProps={{ readOnly: true }}
            disabled={true}
        />
    );
}

function FormChildAgeGroup({ formData }) {
    return (
        <TextField
            variant="filled"
            label="Ηλικιακή Ομάδα Παιδιού"
            value={`${formData.childAgeGroup} χρονών`}
            fullWidth
            InputProps={{ readOnly: true }}
            disabled={true}
        />
    );
}

function FormEmploymentType({ formData }) {
    const employmentTypeText = formData.employmentType === 'part-time' 
        ? 'Μερική Απασχόληση (4 ώρες)' 
        : 'Πλήρης Απασχόληση (8 ώρες)';

    return (
        <TextField
            variant="filled"
            label="Απασχόληση Νταντάς"
            value={employmentTypeText}
            fullWidth
            InputProps={{ readOnly: true }}
            disabled={true}
        />
    );
}

function FormBabysittingPlace({ formData }) {
    const babysittingPlaceText = formData.babysittingPlace === 'parents-home'
        ? 'Σπίτι Γονέα'
        : formData.babysittingPlace === 'nanny-home'
        ? 'Σπίτι Νταντάς'
        : 'Σπίτι Γονέα & Νταντάς';

    return (
        <TextField
            variant="filled"
            label="Χώρος Φύλαξης"
            value={babysittingPlaceText}
            fullWidth
            InputProps={{ readOnly: true }}
            disabled={true}
        />
    );
}

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
            <h3>Από</h3>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Μήνας"
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
                    label="Έτος"
                    type="text"
                    value={formData.fromDate.year}
                    onChange={(e) => handleDateChange('fromDate', 'year', e.target.value)}
                    fullWidth
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                    disabled={!editMode}
                />
            </Box>
            <h3>Mέχρι</h3>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Μήνας"
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
                    label="Έτος"
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

function FormTimeTable({ formData, setFormData, nannyTimetable, editMode, errors }) {
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

function VisualizeTimeTable({ formData }) {
    return (
        <TableContainer
            component={Paper}
            sx={{
                margin: '1rem 0',
                borderRadius: '1rem',
                boxShadow: '3',
                backgroundColor: "#fafafa",
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
                                            backgroundColor: formData.timetable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                            '&:hover': {
                                                backgroundColor: formData.timetable[day]?.includes(time) ? 'var(--clr-dark-green)' : 'var(--clr-dark-grey)',
                                            },
                                            width: '100px',
                                            height: '40px',
                                            borderRadius: '0.5rem',
                                            margin: '1px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        disabled
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable, VisualizeTimeTable, validate };