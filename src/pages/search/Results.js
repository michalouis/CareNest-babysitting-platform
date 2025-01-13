import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormTown, FormChildAgeGroup, FormWorkTime, FormTimeTable, FormExperience, FormDegree, FormSkills, FormRating } from './Filters';
import { FlattenTimetable, FlattenSkills, ValidateFilterData } from './Filters';
import { ResultsContainer } from './ResultsComponents';

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
    const navigate = useNavigate();
    
    // Get filter data from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialFilterData = Object.fromEntries(queryParams.entries());
    initialFilterData.timeTable = parseTimetable(initialFilterData);
    initialFilterData.languages = parseSkills(initialFilterData, 'languages');
    initialFilterData.music = parseSkills(initialFilterData, 'music');

    // Ensure all required properties are initialized
    const [filterData, setFilterData] = useState({
        town: initialFilterData.town || '',
        childAgeGroup: initialFilterData.childAgeGroup || '',
        workTime: initialFilterData.workTime || '',
        timeTable: initialFilterData.timeTable || {},
        languages: initialFilterData.languages || {},
        music: initialFilterData.music || {},
        experience: initialFilterData.experience || '',
        degree: initialFilterData.degree || '',
        rating: initialFilterData.rating || 0,
    });

    /////////// NEW SEARCH ///////////

    const [newFilterData, setNewFilterData] = useState(null);   // changed filter data stored here

    // Errors state
    const [errors, setErrors] = useState({
        town: { hasError: false, message: '' },
        childAgeGroup: { hasError: false, message: '' },
        workTime: { hasError: false, message: '' },
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

    
    const renderDialog = () => (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
            <DialogTitle><p className='button-text'>Αναζήτηση Νταντάς</p></DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormTown formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <FormChildAgeGroup formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <FormWorkTime formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <FormTimeTable formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <FormExperience formData={newFilterData} setFormData={setNewFilterData} />
                    <FormDegree formData={newFilterData} setFormData={setNewFilterData} />
                    <FormSkills formData={newFilterData} setFormData={setNewFilterData} />
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
            {/* <div>
                <h2>Filter Data:</h2>
                <p>Town: {filterData.town}</p>
                <p>Child Age Group: {filterData.childAgeGroup}</p>
                <p>Work Time: {filterData.workTime}</p>
                <h3>Timetable:</h3>
                {Object.keys(filterData.timeTable).map(day => (
                    <div key={day}>
                        <strong>{day}:</strong> {filterData.timeTable[day].join(', ')}
                    </div>
                ))}
                <p>Experience: {filterData.experience}</p>
                <p>Degree: {filterData.degree}</p>
                <h3>Languages:</h3>
                <p>English: {filterData.languages.english ? 'Yes' : 'No'}</p>
                <p>German: {filterData.languages.german ? 'Yes' : 'No'}</p>
                <p>French: {filterData.languages.french ? 'Yes' : 'No'}</p>
                <p>Spanish: {filterData.languages.spanish ? 'Yes' : 'No'}</p>
                <h3>Music Skills:</h3>
                <p>Piano: {filterData.music.piano ? 'Yes' : 'No'}</p>
                <p>Guitar: {filterData.music.guitar ? 'Yes' : 'No'}</p>
                <p>Violin: {filterData.music.violin ? 'Yes' : 'No'}</p>
                <p>Flute: {filterData.music.flute ? 'Yes' : 'No'}</p>
                <h3>Rating:</h3>
                <p>{filterData.rating}</p>
            </div> */}
            {renderDialog()}
            <ResultsContainer filterData={filterData} />
            <ErrorSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
        </>
    );
}

export default Results;