import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

// Component to visualize the hours chosen by the parent - used in Applications, Contracts, Partnerships, and LandingPage(when partnership active) 
export default function VisualizeTimeTable({ formData }) {
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
                {/* Days of the week */}
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
                {/* For each time period, render the time period and 7 blocks (one for each day of the week)*/}
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
                                    {/* If time period selected green, else grey */}
                                    <Button
                                        sx={{
                                            backgroundColor: formData.timetable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
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