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

// turn the timetable back to normal
const parseTimetable = (params) => {
    // Initialize an empty object to store the parsed timetable
    const timetable = {};

    // Iterate over each key in the params object
    Object.keys(params).forEach(key => {
        // Check if the key starts with 'timetable_'
        if (key.startsWith('timetable_')) {
            // Split the key into parts to extract the day and time
            const parts = key.split('_');
            const day = parts[1];
            const time = parts[2];
            
            // If the day is not already in the timetable, initialize it with an empty array
            if (!timetable[day]) {
                timetable[day] = [];
            }
            
            // Push the time into the array for the corresponding day
            timetable[day].push(time);
        }
    });

    // Return the parsed timetable object
    return timetable;
};

// turn the skills back to normal
const parseSkills = (params, prefix) => {
    // Initialize an empty object to store the parsed skills
    const skills = {};

    // Iterate over each key in the params object
    Object.keys(params).forEach(key => {
        // Check if the key starts with the given prefix
        if (key.startsWith(prefix)) {
            // Split the key to extract the skill name
            const skill = key.split('_')[1];
            
            // Set the skill in the skills object with a boolean value based on the params value
            skills[skill] = params[key] === 'true';
        }
    });

    // Return the parsed skills object
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

    // Handle the new search submit
    const handleNewSearchSubmit = () => {
        // Validate the filter data
        if (!ValidateFilterData(newFilterData, errors, setErrors, setSnackbarMessage)) return;

        // Flatten the timetable, languages, and music data
        const flatTimetable = FlattenTimetable(newFilterData.timeTable);
        const flatLanguages = FlattenSkills(newFilterData.languages, 'languages');
        const flatMusic = FlattenSkills(newFilterData.music, 'music');

        // Create the query parameters
        const queryParams = new URLSearchParams({
            ...newFilterData,
            ...flatTimetable,
            ...flatLanguages,
            ...flatMusic
        }).toString();
        window.location.href = `/search/results?${queryParams}`;    // Redirect to the results page
    };

    if (isLoading) {
        return <Loading />;
    }

    const renderDialog = () => (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
            <DialogTitle><p className='button-text'>Babysitter Search</p></DialogTitle>
            <DialogContent>
                {/* Filters from Filters.js */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{color: 'var(--clr-grey)'}}>Required fields: *</p>
                    <h1>Babysitting Filters</h1>
                    <h3>Search Town*</h3>
                    <FormTown formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Child Age Group*</h3>
                    <FormChildAgeGroup formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Child Care Location*</h3>
                    <FormWorkTime formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>Babysitter Working Hours*</h3>
                    <FormBabysittingPlace formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />
                    <h3>
                        Babysitting Schedule*: <span style={{ fontWeight: 'normal' }}>Set the days and hours you want the child care to take place.</span>
                    </h3>
                    <FormTimeTable formData={newFilterData} setFormData={setNewFilterData} errors={errors} setErrors={setErrors} />

                    <h1>Babysitter Filters</h1>
                    <h3>Minimum Babysitter Experience</h3>
                    <FormExperience formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Babysitter Education Level</h3>
                    <FormDegree formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Babysitter Skills</h3>
                    <FormSkills formData={newFilterData} setFormData={setNewFilterData} />
                    <h3>Minimum Average Rating</h3>
                    <FormRating formData={newFilterData} setFormData={setNewFilterData} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} sx={{ color: 'var(--clr-black)' }}>
                    <p className='button-text'>Cancel</p>
                </Button>
                <Button variant="contained" onClick={handleNewSearchSubmit} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                    <p className='button-text'>Search</p>
                </Button>
            </DialogActions>
        </Dialog>
    );    

    /////////////// END NEW SEARCH ///////////////

    return (
        <>
            <PageTitle title="CareNest - Search Results" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Search Results</h1>
            <Box sx={{ margin: '1rem' }}>
                <Box sx={{
                    width: 'auto',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: '0.5rem',
                    alignItems: 'center',
                }}>
                    {/* Opens new search dialog box */}
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
                        <p className="big-button-text">New Search</p>
                    </Button>
                    {/* Go to favorites button */}
                    <Button
                        variant="contained"
                        onClick={() => navigate('/CareNest-babysitting-platform/search/favorites')}
                        sx={{
                            backgroundColor: 'var(--clr-error)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 1rem',
                            gap: '0.5rem',
                        }}
                    >
                        <FavoriteIcon sx={{ fontSize: 30 }} />
                        <p className="big-button-text">Favorites</p>
                    </Button>
                </Box>
            </Box>
            {renderDialog()}    {/* New Search Dialog box */}
            <ResultsContainer filterData={filterData} />    {/* Results Container: Shows results in pages */}
            <ErrorSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
        </>
    );
}

export default Results;