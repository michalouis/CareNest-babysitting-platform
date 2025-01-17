import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, IconButton, Radio, RadioGroup, FormControl, FormLabel } from '@mui/material';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

function FilterBox({ filters, setFilters, checkboxOptions }) {
    const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);

    const handleCheckboxChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.checked
        });
    };

    const handleDateRangeChange = (newFromDate, newToDate) => {
        setFilters({
            ...filters,
            fromDate: newFromDate,
            toDate: newToDate
        });
    };

    const handleSortOrderChange = (event) => {
        setFilters({
            ...filters,
            newerFirst: event.target.value === 'newer'
        });
    };

    return (
        <Box sx={{
            width: '320px',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center',
            backgroundColor: 'var(--clr-white)',
            height: '100%',
            padding: '1rem',
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FilterAltIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                <h2>Φίλτρα</h2>
            </Box>
            <Divider sx={{ width: '80%' }} />
            <h3>Κατάσταση</h3>
            <FormGroup>
                {checkboxOptions.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={filters[option.value]}
                                onChange={handleCheckboxChange}
                                name={option.value}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>
            <h3>Ταξινόμηση κατά</h3>
            <FormControl component="fieldset">
                <RadioGroup
                    name="sortOrder"
                    value={filters.newerFirst ? 'newer' : 'older'}
                    onChange={handleSortOrderChange}
                >
                    <FormControlLabel value="newer" control={<Radio />} label="Νεότερα πρώτα" />
                    <FormControlLabel value="older" control={<Radio />} label="Παλαιότερα πρώτα" />
                </RadioGroup>
            </FormControl>
            <h3>Χρονικό Εύρος</h3>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '0.5rem' }}>
                <h4>
                    Από: {filters.fromDate.day && filters.fromDate.month !== '' && filters.fromDate.year ?
                        `${filters.fromDate.day} ${months[filters.fromDate.month]} ${filters.fromDate.year}` : '-'}
                </h4>
                <h4>
                    Μέχρι: {filters.toDate.day && filters.toDate.month !== '' && filters.toDate.year ?
                        `${filters.toDate.day} ${months[filters.toDate.month]} ${filters.toDate.year}` : '-'}
                </h4>
            </Box>
            <Button
                variant="contained"
                startIcon={<CalendarMonthIcon />}
                sx={{
                    backgroundColor: 'var(--clr-blue)'
                }}
                onClick={() => setDateRangeDialogOpen(true)}
            >
                <p className="small-button-text">Επεξεργασία</p>
            </Button>
            <DateRangeDialog
                open={dateRangeDialogOpen}
                onClose={() => setDateRangeDialogOpen(false)}
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                onDateRangeChange={handleDateRangeChange}
            />
        </Box>
    );
}

export default FilterBox;