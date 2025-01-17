import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable } from './ApplicationFields';

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

    const validate = () => {
        const newErrors = {};
        if (!formData.fromDate.month || !formData.fromDate.year) {
            newErrors.fromDate = 'Το πεδίο είναι υποχρεωτικό';
        }
        if (!formData.toDate.month || !formData.toDate.year) {
            newErrors.toDate = 'Το πεδίο είναι υποχρεωτικό';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        console.log(formData);
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Επεξεργασία Αίτησης" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Επεξεργασία Αίτησης</h1>
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
                    <FormDateRange formData={formData} setFormData={setFormData} errors={errors} />

                    <h2>Διαθεσιμότητα</h2>
                    <FormTimeTable formData={formData} setFormData={setFormData} nannyTimetable={nannyData?.jobPostingData?.timetable || {}} />

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                    >
                        Υποβολή
                    </Button>
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