import React from 'react';
import { Box, Button, TextField, MenuItem, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

function ViewJobPosting({ jobPostingData }) {
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
            {/* Age Groups */}
            <h2>Ηλικιακές Ομάδες Παιδιών</h2>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
                {jobPostingData.ageGroups.map((ageGroup) => (
                    <Box
                        key={ageGroup}
                        sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'white',
                            padding: '1rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px'
                        }}
                    >
                        <p className="button-text">
                            {ageGroup === '1-2' ? '1-2 χρονών' :
                            ageGroup === '3-6' ? '3-6 χρονών' :
                            ageGroup === '7-12' ? '7-12 χρονών' :
                            ageGroup === '13-16' ? '13-16 χρονών' :
                            ''}
                        </p>
                    </Box>
                ))}
            </Box>

            {/* Employment Type */}
            <h2>Χρόνος Απασχόλησης</h2>
            <TextField
                label="Χρόνος Απασχόλησης"
                name="employmentType"
                value={
                    jobPostingData.employmentType === 'part-time' ? 'Μερική Απασχόληση (4 ώρες)' :
                    jobPostingData.employmentType === 'full-time' ? 'Πλήρης Απασχόληση (8 ώρες)' :
                    ''
                }
                fullWidth
            ></TextField>

            {/* Babysitting Place */}
            <h2>Χώρος Φύλαξης</h2>
            <TextField
                label="Χώρος Φύλαξης"
                name="babysittingPlace"
                value={
                    jobPostingData.babysittingPlace === 'parents-home' ? 'Σπίτι Γονέα' :
                    jobPostingData.babysittingPlace === 'nanny-home' ? 'Σπίτι Νταντάς' :
                    jobPostingData.babysittingPlace === 'both' ? 'Και στα δύο' :
                    ''
                }
                fullWidth
            ></TextField>

            {/* Timetable */}
            <h2>Χρονοδιάγραμμα Διαθεσιμότητας</h2>
            <TableContainer component={Paper} sx={{ margin: '1rem 0', borderRadius: '1rem', boxShadow: '3', backgroundColor: "#fafafa" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {timePeriods.map((time) => (
                                <TableCell key={time} align="center" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '1.2rem' }}>{time}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysOfWeek.map((day) => (
                            <TableRow key={day}>
                                <TableCell component="th" scope="row" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '1.25rem', width: '5px' }}>{day}</TableCell>
                                {timePeriods.map((time) => (
                                    <TableCell key={time} align="center" sx={{ padding: '5px' }}>
                                        <Button
                                            sx={{
                                                backgroundColor: jobPostingData.timetable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                                width: '100px',
                                                height: '40px',
                                                borderRadius: '0.5rem',
                                                margin: '1px',
                                            }}
                                            disabled
                                        >
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ViewJobPosting;