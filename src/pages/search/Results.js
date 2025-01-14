import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormTown, FormChildAgeGroup, FormWorkTime, FormTimeTable, FormExperience, FormDegree, FormSkills, FormRating, FormBabysittingPlace } from './Filters';
import { FlattenTimetable, FlattenSkills, ValidateFilterData } from './Filters';
import { ResultsContainer } from './ResultsComponents';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

/////////////// PARSE FUNCTIONS ///////////////

const parseTimetable = (params) => {
    const timetable = {};
    Object.keys(params).forEach(key => {
        if (key.startsWith('timetable_')) {
            const [_, day, time] = key.split('_');
            if (!timetable[day]) {
                timetable[day] = [];
            }
            timetable[day].push(time);
        }
    });
    return timetable;
};

const parseSkills = (params, prefix) => {
    const skills = {};
    Object.keys(params).forEach(key => {
        if (key.startsWith(prefix)) {
            const skill = key.split('_')[1];
            skills[skill] = params[key] === 'true';
        }
    });
    return skills;
};

// Snackbar for errors
const ErrorSnackbar = ({ snackbarMessage, setSnackbarMessage }) => (
    <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ marginRight: '0.5rem' }}
    >
        <Alert onClose={() => setSnackbarMessage('')} severity="error">
            {snackbarMessage}
        </Alert>
    </Snackbar>
);

function Results() {
    const { isLoading } = AuthCheck(true, false, false, 'parent');
    const navigate = useNavigate();
    
    // Get filter data from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialFilterData = Object.fromEntries(queryParams.entries());
    initialFilterData.timeTable = parseTimetable(initialFilterData);
    initialFilterData.languages = parseSkills(initialFilterData, 'languages');
    initialFilterData.music = parseSkills(initialFilterData, 'music');

    // Ensure all required properties are initialized
    const filterData = {
        town: initialFilterData.town || '',
        childAgeGroup: initialFilterData.childAgeGroup || '',
        workTime: initialFilterData.workTime || '',
        babysittingPlace: initialFilterData.babysittingPlace || '',
        timeTable: initialFilterData.timeTable || {},
        languages: {
            english: initialFilterData.languages?.english || false,
            german: initialFilterData.languages?.german || false,
            french: initialFilterData.languages?.french || false,
            spanish: initialFilterData.languages?.spanish || false,
        },
        music: {
            piano: initialFilterData.music?.piano || false,
            guitar: initialFilterData.music?.guitar || false,
            violin: initialFilterData.music?.violin || false,
            flute: initialFilterData.music?.flute || false,
        },
        experience: initialFilterData.experience || '',
        degree: initialFilterData.degree || '',
        rating: initialFilterData.rating || 0,
    };

    /////////// NEW SEARCH ///////////

    const [newFilterData, setNewFilterData] = useState(null);   // changed filter data stored here

    // Errors state
    const [errors, setErrors] = useState({
        town: { hasError: false, message: '' },
        childAgeGroup: { hasError: false, message: '' },
        workTime: { hasError: false, message: '' },
        babysittingPlace: { hasError: false, message: '' },
        timeTable: { hasError: false, message: '' },
        experience: { hasError: false, message: '' },
        degree: { hasError: false, message: '' },
    });

    const [snackbarMessage, setSnackbarMessage] = useState(''); // Error Message
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setNewFilterData(structuredClone(filterData));
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleNewSearchSubmit = () => {
        if (!ValidateFilterData(newFilterData, errors, setErrors, setSnackbarMessage)) return;

        const flatTimetable = FlattenTimetable(newFilterData.timeTable);
        const flatLanguages = FlattenSkills(newFilterData.languages, 'languages');
        const flatMusic = FlattenSkills(newFilterData.music, 'music');

        const queryParams = new URLSearchParams({
            ...newFilterData,
            ...flatTimetable,
            ...flatLanguages,
            ...flatMusic
        }).toString();
        window.location.href = `/search/results?${queryParams}`;
    };

    if (isLoading) {
        return <Loading />;
    }

    const renderDialog = () => (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
            <DialogTitle><p className='button-text'>Αναζήτηση Νταντάς</p></DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{color: 'var(--clr-grey)'}}>Υποχρεωτικά πεδία: *</p>
                    <h1>Φίλτρα Φύλαξης</h1>
                    <h3>Πόλη Αναζήτησης*</h3>
                    <FormTown formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Ηλικιακή Ομάδα Παιδιού*</h3>
                    <FormChildAgeGroup formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Χώρος Φύλαξης του Παιδιού*</h3>
                    <FormWorkTime formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Διάρκεια Απασχόλησης της Νταντάς*</h3>
                    <FormBabysittingPlace formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>
                        Χρονοδιάγραμμα Φύλαξης*: <span style={{ fontWeight: 'normal' }}>Καθορίστε τις ημέρες και ώρες που επιθυμείτε να γίνετε η φύλαξη του παιδιού σας.</span>
                    </h3>
                    <FormTimeTable formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />

                    <h1>Φίλτρα Νταντάς</h1>
                    <h3>Ελάχιστη εμπειρίας της νταντάς</h3>
                    <FormExperience formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Επίπεδο σπουδών της νταντάς</h3>
                    <FormDegree formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Δεξιότητες της Νταντάς</h3>
                    <FormSkills formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Έλάχιστος μέσος όρος αξιλογήσεων</h3>
                    <FormRating formData={newFilterData} setFormData={setNewFilterData} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} sx={{ color: 'var(--clr-black)' }}>
                    <p className='button-text'>Ακύρωση</p>
                </Button>
                <Button variant="contained" onClick={handleNewSearchSubmit} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                    <p className='button-text'>Αναζήτηση</p>
                </Button>
            </DialogActions>
        </Dialog>
    );

    /////////////// END NEW SEARCH ///////////////

    return (
        <>
            <PageTitle title="CareNest - Αποτελέσματα Αναζήτησης" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αποτελέσματα Αναζήτησης</h1>
            <Box sx={{ margin: '1rem' }}>
                <Box sx={{
                    width: 'auto',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: '0.5rem',
                    alignItems: 'center',
                }}>
                    <Button
                        variant="contained"
                        onClick={handleOpenDialog}
                        sx={{
                            backgroundColor: 'var(--clr-violet)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 1rem',
                            gap: '0.5rem',
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 35 }} />
                        <p className="big-button-text">Νέα Αναζήτηση</p>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/search/favorites')}
                        sx={{
                            backgroundColor: 'var(--clr-error)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 1rem',
                            gap: '0.5rem'
                        }}
                    >
                        <FavoriteIcon sx={{ fontSize: 30 }} />
                        <p className="big-button-text">Αγαπημένα</p>
                    </Button>
                </Box>
            </Box>
            {renderDialog()}
            <ResultsContainer filterData={filterData} />
            <ErrorSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
        </>
    );
}

export default Results;