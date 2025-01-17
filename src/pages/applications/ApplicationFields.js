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

function FormDateRange({ formData, setFormData, errors }) {
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
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Από Μήνα"
                    select
                    value={formData.fromDate.month}
                    onChange={(e) => handleDateChange('fromDate', 'month', e.target.value)}
                    fullWidth
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                >
                    {months.map((month, index) => (
                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Από Έτος"
                    type="number"
                    value={formData.fromDate.year}
                    onChange={(e) => handleDateChange('fromDate', 'year', e.target.value)}
                    fullWidth
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <TextField
                    label="Μέχρι Μήνα"
                    select
                    value={formData.toDate.month}
                    onChange={(e) => handleDateChange('toDate', 'month', e.target.value)}
                    fullWidth
                    error={!!errors.toDate}
                    helperText={errors.toDate}
                >
                    {months.map((month, index) => (
                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Μέχρι Έτος"
                    type="number"
                    value={formData.toDate.year}
                    onChange={(e) => handleDateChange('toDate', 'year', e.target.value)}
                    fullWidth
                    error={!!errors.toDate}
                    helperText={errors.toDate}
                />
            </Box>
        </>
    );
}

function FormTimeTable({ formData, setFormData, nannyTimetable }) {
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
                                        disabled={!nannyTimetable[day]?.includes(time)}
                                    >
                                        {nannyTimetable[day]?.includes(time) ? (
                                            formData.timetable[day]?.includes(time) ? <CheckIcon /> : null
                                        ) : (
                                            <ClearIcon />
                                        )}
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

export { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable };