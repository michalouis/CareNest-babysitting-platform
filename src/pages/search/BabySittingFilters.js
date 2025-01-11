import React from 'react';
import { Button, Autocomplete, TextField, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Divider } from '@mui/material';

const daysOfWeek = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
const timePeriods = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-00:00'];

function FormTown({ formData, setFormData, errors, setErrors }) {
    const towns = [
        "Athens", "Mesologgi", "Halkida", "Karpenisi", "Lamia", "Amfissa", "Tripoli", "Patra", "Pyrgos", "Korinthos",
        "Sparti", "Kalamata", "Zakynthos", "Kerkyra", "Argostoli", "Leykada", "Arta", "Prebeza", "Karditsa", "Larissa",
        "Bolos", "Trikala", "Grebena", "Drama", "Beroia", "Thessaloniki", "Kabala", "Kastoria", "Kilkis", "Kozani",
        "Edessa", "Katerini", "Serres", "Florina", "Polygyros", "Aleksandroypoli", "Ksanthi", "Komotini", "Rodos",
        "Ermoypoli", "Mytilini", "Samos", "Xios", "Hrakleio", "Agios Nikolaos", "Rethimno", "Hania", "Ioannina",
        "Hgoymenitsa", "Leivadia", "Nayplion"
    ];

    // Check if field is empty
    const handleBlur = () => {
        if (!formData.town) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                town: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                town: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <Autocomplete
            options={towns}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
                setFormData({ ...formData, town: newValue });
                handleBlur();
            }}
            fullWidth
            value={formData.town || null}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Πόλη*"
                    error={errors.town.hasError}
                    helperText={errors.town.message}
                />
            )}
            onBlur={handleBlur}
        />
    );
}

function FormChildAgeGroup({ formData, setFormData, errors, setErrors }) {
    // Check if field is empty
    const handleBlur = () => {
        if (!formData.childAgeGroup) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                childAgeGroup: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                childAgeGroup: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <TextField
            label="Ηλικιακή Ομάδα"
            select
            value={formData.childAgeGroup}
            onChange={(e) => setFormData({
                ...formData,
                childAgeGroup: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.childAgeGroup.hasError}
            helperText={errors.childAgeGroup.message}
            InputProps={{ style: { textAlign: 'left' } }}
        >
            <MenuItem value="1-2">1-2 χρονών</MenuItem>
            <MenuItem value="3-6">3-6 χρονών</MenuItem>
            <MenuItem value="7-12">7-12 χρονών</MenuItem>
            <MenuItem value="13-16">13-16 χρονών</MenuItem>
        </TextField>
    );
}

function FormWorkTime({ formData, setFormData, errors, setErrors }) {
    const handleBlur = () => {
        if (!formData.workTime) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                workTime: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                workTime: { hasError: false, message: '' }
            }));
        }
    };

    return (
        <TextField
            label="Ώρες Εργασίας"
            select
            value={formData.workTime}
            onChange={(e) => setFormData({
                ...formData,
                workTime: e.target.value
            })}
            onBlur={handleBlur}
            fullWidth
            error={errors.workTime.hasError}
            helperText={errors.workTime.message}
        >
            <MenuItem value="part-time">4 ώρες (Μερική Απασχόληση)</MenuItem>
            <MenuItem value="full-time">8 ώρες (Πλήρης Απασχόληση)</MenuItem>
        </TextField>
    );
}

const validateTimeTable = ({ timeTable, workTime }) => {
    let invalid = false;
    let errorMessage = '';
    let selectedDays = 0;

    console.log('Checking timetable....');
    // Timetable validation
    daysOfWeek.forEach((day) => {
        const selectedTimes = timePeriods.filter((time) => timeTable[day]?.includes(time));
        if (selectedTimes.length > 0) {
            selectedDays++;
            if (workTime === 'full-time' && selectedTimes.length < 2) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            } else if (workTime === 'part-time' && selectedTimes.length < 1) {
                console.log('Error found: not enough hours for each day');
                invalid = true;
            }
        }
    });

    // Timetable error messages
    if (selectedDays < 5) {
        console.log('Error found: not enough days selected');
        invalid = true;
        errorMessage = 'Πρέπει να διαλέξετε ώρες για τουλάχιστον 5 μέρες';
    } else if (invalid) {
        console.log('Error found!!!!!!!!!!!');
        errorMessage = 'Πρέπει στις μέρες που έχετε διαλέξει να βάλετε αρκετές ώρες για να καλύπτουν τους χρόνους απασχόλησης που έχετε επιλέξει';
    }

    return { hasError: invalid, message: errorMessage };
};

function FormTimeTable({ formData, setFormData, errors, setErrors }) {
    const handleCellClick = (day, time) => {
        setFormData((prevFormData) => {
            const newTimetable = { ...prevFormData.timeTable };
            if (!newTimetable[day]) {
                newTimetable[day] = [];
            }
            if (newTimetable[day].includes(time)) {
                newTimetable[day] = newTimetable[day].filter((t) => t !== time);
            } else {
                newTimetable[day].push(time);
            }
            return { ...prevFormData, timeTable: newTimetable };
        });
    };

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    margin: '1rem 0',
                    borderRadius: '1rem',
                    boxShadow: '3',
                    backgroundColor: "#fafafa",
                    border: errors.timeTable.hasError ? '2px solid var(--clr-error)' : '',
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
                                                backgroundColor: formData.timeTable[day]?.includes(time) ? 'var(--clr-brat-green)' : 'var(--clr-grey)',
                                                '&:hover': {
                                                    backgroundColor: formData.timeTable[day]?.includes(time) ? 'var(--clr-dark-green)' : 'var(--clr-dark-grey)',
                                                },
                                                width: '100px',
                                                height: '40px',
                                                borderRadius: '0.5rem',
                                                margin: '1px',
                                            }}
                                            onClick={() => handleCellClick(day, time)}
                                            // disabled={!editMode}
                                        >
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {errors.timeTable.hasError && (
                <p style={{ color: 'var(--clr-error)', fontSize: '1.2rem'}}>
                    {errors.timeTable.message}
                </p>
            )}
        </>
    );
}

export { FormTown, FormChildAgeGroup, FormWorkTime, FormTimeTable, validateTimeTable };