import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, IconButton, Radio, RadioGroup, FormControl } from '@mui/material';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// DateRangeDialog: Dialog to select a date range
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
            setError('All fields for the "From" date must be filled or none should be filled.');
            return false;
        }

        if (toDateFilled && (!localToDate.day || !toMonthFilled || !localToDate.year)) {
            setError('All fields for the "To" date must be filled or none should be filled.');
            return false;
        }

        // check if values are out of bounds
        if ((localFromDate.day < 1 && fromDateFilled) || (localToDate.day < 1 && toDateFilled)) {
            setError('Days must be greater than 0.');
            return false;
        }

        if ((localFromDate.day > 31 && fromDateFilled) || (localToDate.day > 31  && toDateFilled)) {
            setError('Days must be less than 32.');
            return false;
        }

        if ((localFromDate.year < 2000 && fromDateFilled) || (localToDate.year < 2000 && toDateFilled)) {
            setError('Years must be greater than 2000.');
            return false;
        }

        // Check if from date is older than to date
        if (fromDateFilled && toDateFilled) {
            const fromDateObj = new Date(localFromDate.year, localFromDate.month, localFromDate.day);
            const toDateObj = new Date(localToDate.year, localToDate.month, localToDate.day);

            if (fromDateObj > toDateObj) {
                setError('The "From" date must be earlier than the "To" date.');
                return false;
            }
        }

        setError('');
        return true;
    };

    // Save the date range
    const handleSave = () => {
        if (validateFields()) {
            onDateRangeChange(localFromDate, localToDate);  // Update the actual date range
            setLocalFromDate({ day: '', month: '', year: '' }); // Reset the local date range
            setLocalToDate({ day: '', month: '', year: '' });   // Reset the local date range
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
        // Date Range Dialog
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><strong>Select Date Range</strong></DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <p style={{ color: 'var(--clr-error)' }}>{error}</p>} {/* Error message */}
                    <p><strong>From:</strong></p>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <TextField
                            label="Day"
                            type="text"
                            value={localFromDate.day}
                            onChange={(e) => setLocalFromDate({ ...localFromDate, day: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Month"
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
                            label="Year"
                            type="text"
                            value={localFromDate.year}
                            onChange={(e) => setLocalFromDate({ ...localFromDate, year: e.target.value })}
                            fullWidth
                        />
                        <IconButton onClick={handleClearFromDate}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                    <p><strong>To:</strong></p>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <TextField
                            label="Day"
                            type="text"
                            value={localToDate.day}
                            onChange={(e) => setLocalToDate({ ...localToDate, day: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Month"
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
                            label="Year"
                            type="text"
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
                    <p className='button-text'>Cancel</p>
                </Button>
                <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: 'var(--clr-blue)' }}>
                    <p className='button-text'>Save</p>
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// FilterBox: Component found in Application, Contracts, and Partnerships pages to filter results
function FilterBox({ filters, setFilters, checkboxOptions }) {
    const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);

    // Handle the change of the checkboxes
    const handleCheckboxChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.checked
        });
    };

    // Handle the change of the date range
    const handleDateRangeChange = (newFromDate, newToDate) => {
        setFilters({
            ...filters,
            fromDate: newFromDate,
            toDate: newToDate
        });
    };

    // Handle the change of the sort order
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
                <h2>Filters</h2>
            </Box>
            <Divider sx={{ width: '80%' }} />

            {/* CheckBoxes */}
            <h3>Status</h3>
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

            {/* Sort */}
            <h3>Sort by</h3>
            <FormControl component="fieldset">
                <RadioGroup
                    name="sortOrder"
                    value={filters.newerFirst ? 'newer' : 'older'}
                    onChange={handleSortOrderChange}
                >
                    <FormControlLabel value="newer" control={<Radio />} label="Newest First" />
                    <FormControlLabel value="older" control={<Radio />} label="Oldest First" />
                </RadioGroup>
            </FormControl>

            {/* Date Range */}
            <h3>Date Range</h3>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '0.5rem' }}>
                <h4>
                    From: {filters.fromDate.day && filters.fromDate.month !== '' && filters.fromDate.year ? 
                        `${filters.fromDate.day} ${months[filters.fromDate.month]} ${filters.fromDate.year}` : '-'}
                </h4>
                <h4>
                    To: {filters.toDate.day && filters.toDate.month !== '' && filters.toDate.year ? 
                        `${filters.toDate.day} ${months[filters.toDate.month]} ${filters.toDate.year}` : '-'}
                </h4>
            </Box>

            {/* Button to open date range dialog */}
            <Button
                variant="contained"
                startIcon={<CalendarMonthIcon />}
                sx={{
                    backgroundColor: 'var(--clr-blue)'
                }}
                onClick={() => setDateRangeDialogOpen(true)}
            >
                <p className="small-button-text">Edit</p>
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