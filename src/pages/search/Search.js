import React, { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormTown, FormChildAgeGroup, FormWorkTime, FormTimeTable, validateTimeTable } from './BabySittingFilters';
import { FormExperience, FormDegree, FormSkills, FormRating } from "./NannyFilters";

function Search() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filterData, setFilterData] = useState({
        town: '',
        childAgeGroup: '',
        workTime: '',
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
    const [errors, setErrors] = useState({
        town: { hasError: false, message: '' },
        childAgeGroup: { hasError: false, message: '' },
        workTime: { hasError: false, message: '' },
        timeTable: false,
        experience: { hasError: false, message: '' },
        degree: { hasError: false, message: '' },
    });

    if (isLoading) {
        return <Loading />;
    }

    const validate = () => {
        let pass = true;
        const newSnackbarMessages = [];
        let updatedErrors = { ...errors };

        if (!filterData.town || errors.town.hasError) {
            pass = false;
            updatedErrors = {
                ...updatedErrors,
                town: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            };
            setErrors(updatedErrors);
            newSnackbarMessages.push('Πόλη');
        }
        if (!filterData.childAgeGroup || errors.childAgeGroup.hasError) {
            pass = false;
            updatedErrors = {
                ...updatedErrors,
                childAgeGroup: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            };
            setErrors(updatedErrors);
            newSnackbarMessages.push('Ηλικιακή Ομάδα');
        }
        if (!filterData.workTime || errors.workTime.hasError) {
            pass = false;
            updatedErrors = {
                ...updatedErrors,
                workTime: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            };
            setErrors(updatedErrors);
            newSnackbarMessages.push('Ώρες Εργασίας');
        }
        const validationResult = validateTimeTable({ timeTable: filterData.timeTable, workTime: filterData.workTime });
        updatedErrors = {
            ...updatedErrors,
            timeTable: validationResult
        };
        setErrors(updatedErrors);
        if (validationResult.hasError) {
            pass = false;
            newSnackbarMessages.push('Χρονοδιάγραμμα');
        }
        if (!filterData.experience || errors.experience.hasError) {
            pass = false;
            updatedErrors = {
                ...updatedErrors,
                experience: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            };
            setErrors(updatedErrors);
            newSnackbarMessages.push('Εμπειρία');
        }
        if (!filterData.degree || errors.degree.hasError) {
            pass = false;
            updatedErrors = {
                ...updatedErrors,
                degree: { hasError: true, message: 'Το πεδίο είναι υποχρεωτικό' }
            };
            setErrors(updatedErrors);
            newSnackbarMessages.push('Σπουδές');
        }

        if (newSnackbarMessages.length > 0) {
            setSnackbarMessage(`Τα παρακάτω πεδία είναι λανθασμένα: ${newSnackbarMessages.join(', ')}`);
        } else {
            setSnackbarMessage('Όλα τα πεδία είναι σωστά συμπληρωμένα');
        }
        return pass;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        console.log('Search for babysitter filters:', filterData);
    };

    return (
        <>
            <PageTitle title="CareNest - Αναζήτηση Νταντάς" />
            <Breadcrumbs />
            <h1 style={{ margin: '1rem' }}>Αναζήτηση Νταντάς</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '1080px', alignSelf: 'center', }}>
                Add text later
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
                            <h2>Φίλτρα Φύλαξης</h2>
                            <FormTown formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormChildAgeGroup formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormWorkTime formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormTimeTable formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            
                            <h2>Φίλτρα Νταντάς</h2>
                            <FormExperience formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormDegree formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormSkills formData={filterData} setFormData={setFilterData} errors={errors} setErrors={setErrors}/>
                            <FormRating formData={filterData} setFormData={setFilterData}/>
                        </Box>

                        <Box sx={{
                            width: '260px',
                            borderRadius: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <Button
                                variant="contained"
                                // onClick={() => navigate('/profile/edit-profile')}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'var(--clr-violet)',
                                    '&:hover': { opacity: 0.8 },
                                    padding: '0.5rem 0'
                                }}
                            >
                                <p className="big-button-text">Αγαπημένα</p>
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'var(--clr-error)',
                                    '&:hover': { opacity: 0.8 },
                                    padding: '0.5rem 0'
                            }}>
                                <p className="big-button-text">Αναζήτηση</p>
                            </Button>
                        </Box>
                    </>
                )}
            </Box>

            {/* Error Snackbar */}
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
        </>
    );
}

export default Search;