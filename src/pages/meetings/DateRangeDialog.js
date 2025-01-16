import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, IconButton } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

function DateRangeDialog({ open, onClose, fromDate, toDate, onDateRangeChange }) {
    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [error, setError] = useState('');

    // Reset localFromDate and localToDate when the dialog is opened
    useEffect(() => {
        setLocalFromDate(fromDate);
        setLocalToDate(toDate);
        setError('');
    }, [open, fromDate, toDate]);

    // Validate the fields of the date range
    const validateFields = () => {
        // Check if all fields are filled
        const fromMonthFilled = localFromDate.month !== '';
        const toMonthFilled = localToDate.month !== '';

        const fromDateFilled = localFromDate.day || fromMonthFilled || localFromDate.year;
        const toDateFilled = localToDate.day || toMonthFilled || localToDate.year;

        if (fromDateFilled && (!localFromDate.day || !fromMonthFilled || !localFromDate.year)) {
            setError('Όλα τα πεδία της ημερομηνίας "Από" πρέπει να είναι συμπληρωμένα ή να μη συμπληρωθεί κανένα.');
            return false;
        }

        if (toDateFilled && (!localToDate.day || !toMonthFilled || !localToDate.year)) {
            setError('Όλα τα πεδία της ημερομηνίας "Μέχρι" πρέπει να είναι συμπληρωμένα ή να μη συμπληρωθεί κανένα.');
            return false;
        }

        // Check if from date is older than to date
        if (fromDateFilled && toDateFilled) {
            const fromDateObj = new Date(localFromDate.year, localFromDate.month, localFromDate.day);
            const toDateObj = new Date(localToDate.year, localToDate.month, localToDate.day);

            if (fromDateObj > toDateObj) {
                setError('Η ημερομηνία "Από" πρέπει να είναι πιο παλιά από την ημερομηνία "Μέχρι".');
                return false;
            }
        }

        setError('');
        return true;
    };

    // Save the date range
    const handleSave = () => {
        if (validateFields()) {
            onDateRangeChange(localFromDate, localToDate);
            setLocalFromDate({ day: '', month: '', year: '' });
            setLocalToDate({ day: '', month: '', year: '' });
            onClose();
        }
    };

    // Clear the fields of the date range
    const handleClearFromDate = () => {
        setLocalFromDate({ day: '', month: '', year: '' });
    };

    const handleClearToDate = () => {
        setLocalToDate({ day: '', month: '', year: '' });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><strong>Επιλογή Χρονικού Εύρους</strong></DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <p style={{ color: 'var(--clr-error)' }}>{error}</p>}
                    <p><strong>Από:</strong></p>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <TextField
                            label="Ημέρα"
                            type="number"
                            inputProps={{ min: 1, max: 31 }}
                            value={localFromDate.day}
                            onChange={(e) => setLocalFromDate({ ...localFromDate, day: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Μήνας"
                            value={localFromDate.month}
                            onChange={(e) => setLocalFromDate({ ...localFromDate, month: e.target.value })}
                            select
                            fullWidth
                        >
                            {months.map((month, index) => (
                                <MenuItem key={index} value={index}>{month}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Χρονιά"
                            type="number"
                            inputProps={{ min: 2025, max: 2035 }}
                            value={localFromDate.year}
                            onChange={(e) => setLocalFromDate({ ...localFromDate, year: e.target.value })}
                            fullWidth
                        />
                        <IconButton onClick={handleClearFromDate}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                    <p><strong>Μέχρι:</strong></p>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <TextField
                            label="Ημέρα"
                            type="number"
                            inputProps={{ min: 1, max: 31 }}
                            value={localToDate.day}
                            onChange={(e) => setLocalToDate({ ...localToDate, day: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Μήνας"
                            value={localToDate.month}
                            onChange={(e) => setLocalToDate({ ...localToDate, month: e.target.value })}
                            select
                            fullWidth
                        >
                            {months.map((month, index) => (
                                <MenuItem key={index} value={index}>{month}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Χρονιά"
                            type="number"
                            inputProps={{ min: 2025, max: 2035 }}
                            value={localToDate.year}
                            onChange={(e) => setLocalToDate({ ...localToDate, year: e.target.value })}
                            fullWidth
                        />
                        <IconButton onClick={handleClearToDate}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: 'var(--clr-black)' }}>
                    <p className='button-text'>Ακύρωση</p>
                </Button>
                <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: 'var(--clr-blue)' }}>
                    <p className='button-text'>Αποθήκευση</p>
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DateRangeDialog;