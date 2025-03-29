import React from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

// Job Posting For view only
function ViewJobPosting({ jobPostingData }) {
    return (
        <Box sx={{
            flexGrow: 1,
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            backgroundColor: 'var(--clr-white)',
            padding: '2rem 1rem',
            borderRadius: '1rem',
            boxShadow: '2',
        }}>
            {/* Age Groups */}
            <h2>Age Groups</h2>
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
                            {ageGroup === '1-2' ? '1-2 years old' :
                            ageGroup === '3-6' ? '3-6 years old' :
                            ageGroup === '7-12' ? '7-12 years old' :
                            ageGroup === '13-16' ? '13-16 years old' :
                            ''}
                        </p>
                    </Box>
                ))}
            </Box>

            {/* Employment Type */}
            <h2>Employment Type</h2>
            <TextField
                label="Employment Type"
                name="employmentType"
                value={
                    jobPostingData.employmentType === 'part-time' ? 'Part-time (4 hours)' :
                    jobPostingData.employmentType === 'full-time' ? 'Full-time (8 hours)' :
                    ''
                }
                fullWidth
            />

            {/* Babysitting Place */}
            <h2>Babysitting Place</h2>
            <TextField
                label="Babysitting Place"
                name="babysittingPlace"
                value={
                    jobPostingData.babysittingPlace === 'parents-home' ? 'Parent\'s Home' :
                    jobPostingData.babysittingPlace === 'nanny-home' ? 'Nanny\'s Home' :
                    jobPostingData.babysittingPlace === 'both' ? 'Parent\'s & Nanny\'s Home' :
                    ''
                }
                fullWidth
            />

            {/* Timetable */}
            <h2>Availability Timetable</h2>
            <TableContainer component={Paper} sx={{ margin: '1rem 0', borderRadius: '1rem', boxShadow: '3', backgroundColor: "#fafafa" }}>
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