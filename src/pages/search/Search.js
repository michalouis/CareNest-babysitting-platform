import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormTown, FormChildAgeGroup, FormWorkTime, FormBabysittingPlace, FormTimeTable, FormExperience, FormDegree, FormSkills, FormRating, FlattenTimetable, FlattenSkills, ValidateFilterData } from './Filters';

import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

// Snackbar for errors
function ErrorSnackbar({ snackbarMessage, setSnackbarMessage }) {
    return (
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
}

// Main component
function Search() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Filter data state
    const [filterData, setFilterData] = useState({
        town: '',
        childAgeGroup: '',
        workTime: '',
        babysittingPlace: '',
        timeTable: {
            '00:00-04:00': [],
            '04:00-08:00': [],
            '08:00-12:00': [],
            '12:00-16:00': [],
            '16:00-20:00': [],
            '20:00-00:00': []
        },
        experience: '',
        degree: '',
        languages: {      
            english: false,
            german: false,
            french: false,
            spanish: false,
        },
        music: {      
            piano: false,
            guitar: false,
            violin: false,
            flute: false,
        },
        rating: 0,
    });
    
    // Set the filter data to the user's data if it exists
    useEffect(() => {
        if (userData) {
            setFilterData(prevData => ({
                ...prevData,
                town: userData.town || '',
                childAgeGroup: userData.childAgeGroup || ''
            }));
        }
    }, [userData]);
    
    // Errors state
    const [errors, setErrors] = useState({
        town: { hasError: false, message: '' },
        childAgeGroup: { hasError: false, message: '' },
        workTime: { hasError: false, message: '' },
        babysittingPlace: { hasError: false, message: '' },
        timeTable: false,
        experience: { hasError: false, message: '' },
        degree: { hasError: false, message: '' },
    });

    const navigate = useNavigate();
    if (isLoading) {
        return <Loading />;
    }

    /////////////// TURN DATA INTO URL PARAMS & SUBMIT ///////////////

    // Handle the submit button
    const handleSubmit = async () => {
        if (!ValidateFilterData(filterData, errors, setErrors, setSnackbarMessage)) return;

        console.log('Search for babysitter filters:', filterData);

        const flatTimetable = FlattenTimetable(filterData.timeTable);
        const flatLanguages = FlattenSkills(filterData.languages, 'languages');
        const flatMusic = FlattenSkills(filterData.music, 'music');

        // Turn the filter data into URL parameters
        const queryParams = new URLSearchParams({
            ...filterData,
            ...flatTimetable,
            ...flatLanguages,
            ...flatMusic
        }).toString();
        navigate(`/search/results?${queryParams}`);
    };

    return (
        <>
            <PageTitle title="CareNest - Αναζήτηση Νταντάς" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Αναζήτηση Νταντάς</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '1080px', alignSelf: 'center', textAlign: 'center' }}>
                Χρησιμοποιήστε τα φίλτρα παρακάτω για να βρείτε τη νταντά που ταιριάζει στις ανάγκες σας.
                Επιλέξτε κριτήρια όπως την περιοχή, τις ημέρες και ώρες φύλαξης, καθώς και τα προσόντα και
                την εμπειρία της νταντάς. Προσαρμόστε την αναζήτησή σας για να δείτε τα καλύτερα αποτελέσματα!
            </p>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', lg: 'row' },
                justifyContent: 'space-between',
                gap: '1rem',
                margin: '1rem'
            }}>
                { userData && (
                    <>
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            backgroundColor: 'var(--clr-white)',
                            padding: '2rem 1rem',
                            borderRadius: '1rem',
                            boxShadow: '2',
                            marginBottom: '1rem',
                            justifyContent: 'space-around',
                            position: 'relative'
                        }}>
                            <p style={{color: 'var(--clr-grey)'}}>Υποχρεωτικά πεδία: *</p>
                            <h1>Φίλτρα Φύλαξης</h1>
                            <h3>Πόλη Αναζήτησης*</h3>
                            <FormTown formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Ηλικιακή Ομάδα Παιδιού*</h3>
                            <FormChildAgeGroup formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Χώρος Φύλαξης του Παιδιού*</h3>
                            <FormBabysittingPlace formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Διάρκεια Απασχόλησης της Νταντάς*</h3>
                            <FormWorkTime formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>
                                Χρονοδιάγραμμα Φύλαξης*: <span style={{ fontWeight: 'normal' }}>Καθορίστε τις ημέρες και ώρες που επιθυμείτε να γίνετε η φύλαξη του παιδιού σας.</span>
                            </h3>
                            <FormTimeTable formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            
                            <h1>Φίλτρα Νταντάς</h1>
                            <h3>Ελάχιστη εμπειρίας της νταντάς</h3>
                            <FormExperience formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Επίπεδο σπουδών της νταντάς</h3>
                            <FormDegree formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Δεξιότητες της Νταντάς</h3>
                            <FormSkills formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <h3>Έλάχιστος μέσος όρος αξιλογήσεων</h3>
                            <FormRating formData={filterData} setFormData={setFilterData}/>
                        </Box>

                        <Box sx={{
                            width: { xs: '100%', lg: '260px' },
                            borderRadius: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'var(--clr-violet)',
                                    '&:hover': { opacity: 0.8 },
                                    padding: '0.5rem 0',
                                    gap: '0.5rem'
                            }}>
                                <SearchIcon sx={{ fontSize: 35 }}/>
                                <p className="big-button-text">Αναζήτηση</p>
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/search/favorites')}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'var(--clr-error)',
                                    '&:hover': { opacity: 0.8 },
                                    padding: '0.5rem 0',
                                    gap: '0.5rem'
                                }}
                            >
                                <FavoriteIcon sx={{ fontSize: 30 }}/>
                                <p className="big-button-text">Αγαπημένα</p>
                            </Button>
                        </Box>
                    </>
                )}
            </Box>

            <ErrorSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
        </>
    );
}

export default Search;