import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable, validate } from './ApplicationFields';

function EditApplication() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const nannyId = queryParams.get('uid');
    const [nannyData, setNannyData] = useState(null);
    const [formData, setFormData] = useState({
        nannyName: '',
        childAgeGroup: '',
        employmentType: '',
        babysittingPlace: '',
        fromDate: { month: '', year: '' },
        toDate: { month: '', year: '' },
        timetable: {}
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchNannyData = async () => {
            try {
                const nannyDoc = await getDoc(doc(FIREBASE_DB, 'users', nannyId));
                if (nannyDoc.exists()) {
                    const data = nannyDoc.data();
                    setNannyData(data);
                    setFormData({
                        nannyName: `${data.firstName} ${data.lastName}`,
                        childAgeGroup: userData.childAgeGroup,
                        employmentType: data.jobPostingData.employmentType,
                        babysittingPlace: data.jobPostingData.babysittingPlace,
                        fromDate: { month: '', year: '' },
                        toDate: { month: '', year: '' },
                        timetable: {}
                    });
                } else {
                    console.error('No such nanny:', nannyId);
                }
            } catch (error) {
                console.error('Error fetching nanny data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (nannyId && userData) {
            fetchNannyData();
        }
    }, [nannyId, userData]);

    const handleSave = () => {
        const isValid = validate(formData, setErrors, setSnackbarMessage);
        if (!isValid) return;
        console.log('Temporary Save:', formData);
        setEditMode(false);
        window.scrollTo(0, 0);
    };

    const handleSubmit = () => {
        const isValid = validate(formData, setErrors, setSnackbarMessage);
        if (!isValid) return;
        console.log('Submit:', formData);
        window.scrollTo(0, 0);
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Αίτησης" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Δημιουργία Αίτησης</h1>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                margin: '1rem'
            }}>
                <Box sx={{
                    width: '90%',
                    maxWidth: '1080px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    backgroundColor: 'var(--clr-white)',
                    padding: '2rem 1rem',
                    borderRadius: '1rem',
                    boxShadow: '2',
                }}>
                    <h2>Όνομα Νταντάς & Ηλικία Παιδιού</h2>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormNannyName formData={formData} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormChildAgeGroup formData={formData} />
                        </Grid>
                    </Grid>

                    <h2>Είδος Απασχόλησης & Χώρος Απασχόλησης</h2>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormEmploymentType formData={formData} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormBabysittingPlace formData={formData} />
                        </Grid>
                    </Grid>
                    
                    <h2>Διάρκεια Συνεργασίας</h2>
                    <p>Επιλέξτε το χρονικό διάστημα που επιθυμείτε να συνεργαστείτε με τη νταντά.</p>
                    <FormDateRange formData={formData} setFormData={setFormData} errors={errors} editMode={editMode} />

                    <h2>Διαθεσιμότητα</h2>
                    <FormTimeTable formData={formData} setFormData={setFormData} nannyTimetable={nannyData?.jobPostingData?.timetable || {}} editMode={editMode} />

                    {editMode ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            >
                                <p className='big-button-text'>Προσωρινή Αποθήκευση</p>
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%' }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setEditMode(true);
                                    window.scrollTo(0, 0);
                                }}
                                sx={{ backgroundColor: 'var(--clr-blue-lighter)', '&:hover': { opacity: 0.8 } }}
                            >
                                <p className='big-button-text'>Επεξεργασία</p>
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            >
                                <p className='big-button-text'>Υποβολή</p>
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
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

export default EditApplication;