import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc, addDoc, collection, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import Loading from '../../layout/Loading';
import { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable, validate } from './ApplicationFields';

const LastModification = ({ timestamp }) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('el-GR', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

    return (
        <p><strong>Τελευταία τροποποίηση:</strong> {formattedDate} {formattedTime}</p>
    );
};

function ApplicationForm({ userData, nannyId, applicationId }) {
    const [editMode, setEditMode] = useState(!!nannyId);
    const navigate = useNavigate();
    const [nannyData, setNannyData] = useState(null);
    const [applicationData, setApplicationData] = useState({
        applicationId: '',
        nannyId: '',
        parentId: '',
        timestamp: '',
        nannyName: '',
        childAgeGroup: '',
        employmentType: '',
        babysittingPlace: '',
        fromDate: { month: '', year: '' },
        toDate: { month: '', year: '' },
        submitted: false,
        timetable: {}
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [isSaving, setIsSaving] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let fetchedNannyId = nannyId;

                // Fetch user data to get application data if applicationId is provided
                if (applicationId) {
                    const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const application = userData.applications.find(app => app.applicationId === applicationId);
                        if (application) {
                            setApplicationData(application);
                            fetchedNannyId = application.nannyId;
                        } else {
                            console.error('No such application:', applicationId);
                        }
                    } else {
                        console.error('No such user:', userData.uid);
                    }
                }

                // Fetch nanny data
                if (fetchedNannyId) {
                    const nannyDoc = await getDoc(doc(FIREBASE_DB, 'users', fetchedNannyId));
                    if (nannyDoc.exists()) {
                        const data = nannyDoc.data();
                        setNannyData(data);
                        if (nannyId) { // Check if nannyId argument was given
                            setApplicationData((prevApplicationData) => ({
                                ...prevApplicationData,
                                nannyName: `${data.firstName} ${data.lastName}`,
                                employmentType: data.jobPostingData.employmentType,
                                babysittingPlace: data.jobPostingData.babysittingPlace,
                                childAgeGroup: userData.childAgeGroup,
                            }));
                        }
                    } else {
                        console.error('No such nanny:', fetchedNannyId);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchData();
        }
    }, [nannyId, applicationId, userData]);

    const handleSave = async () => {
        const isValid = validate(applicationData, setErrors, setSnackbarMessage, setSnackbarSeverity);
        if (!isValid) return;

        setIsSaving(true);

        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                console.log('Application Data:', applicationData);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    applicationData.applicationId = applicationData.applicationId || Date.now().toString(); // Use existing applicationId or generate a new one
                    applicationData.parentId = applicationData.parentId || user.uid;
                    applicationData.nannyId = applicationData.nannyId || nannyId;
                    applicationData.timestamp = new Date().toISOString();
                
                    const updatedApplications = userData.applications
                        ? [...userData.applications.filter(app => app.applicationId !== applicationData.applicationId), applicationData]
                        : [applicationData];
                
                    await updateDoc(userDocRef, { applications: updatedApplications });
                    console.log('Temporary Save:', applicationData);
                    setEditMode(false);
                    setSnackbarMessage('Η αίτηση σας αποθηκεύτηκε προσωρινά με επιτυχία! Μπορείτε να τη βρείτε στην ενότητα \'Αιτήσεις\'. Για να την οριστικοποιήστε πατήστε υποβολή.');
                    setSnackbarSeverity('success');
                    window.scrollTo(0, 0);
                } else {
                    console.error('No such user:', user.uid);
                }
            }
        } catch (error) {
            console.error('Error saving application:', error);
            setSnackbarMessage('Υπήρξε σφάλμα κατά την αποθήκευση της αίτησης.');
            setSnackbarSeverity('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        const isValid = validate(applicationData, setErrors, setSnackbarMessage);
        if (!isValid) return;

        setOpenConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setOpenConfirmDialog(false);
        setIsSaving(true);

        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const updatedApplicationData = {
                        ...applicationData,
                        submitted: true,
                        timestamp: new Date().toISOString(),
                    };

                    const updatedApplications = userData.applications.map(app => 
                        app.applicationId === applicationData.applicationId 
                            ? updatedApplicationData 
                            : app
                    );

                    // Create contract in Firebase
                    const contractData = { ...updatedApplicationData };
                    const contractDocRef = await addDoc(collection(FIREBASE_DB, 'contracts'), contractData);

                    // Update contract with contractId
                    await updateDoc(contractDocRef, { contractId: contractDocRef.id });

                    // Update application with contractId
                    updatedApplicationData.contractId = contractDocRef.id;
                    const finalUpdatedApplications = updatedApplications.map(app => 
                        app.applicationId === applicationData.applicationId 
                            ? updatedApplicationData 
                            : app
                    );

                    await updateDoc(userDocRef, { applications: finalUpdatedApplications });

                    // Add contract ID to parent's and nanny's data
                    await updateDoc(userDocRef, { contracts: arrayUnion(contractDocRef.id) });
                    const nannyDocRef = doc(FIREBASE_DB, 'users', applicationData.nannyId);
                    await updateDoc(nannyDocRef, { contracts: arrayUnion(contractDocRef.id) });

                    // Update local applicationData with contractId
                    setApplicationData(prevApplicationData => ({
                        ...prevApplicationData,
                        contractId: contractDocRef.id,
                    }));

                    console.log('Submit:', updatedApplicationData);
                    setSnackbarMessage('Η αίτηση σας υποβλήθηκε με επιτυχία!');
                    setSnackbarSeverity('success');
                } else {
                    console.error('No such user:', user.uid);
                }
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setSnackbarMessage('Υπήρξε σφάλμα κατά την υποβολή της αίτησης.');
            setSnackbarSeverity('error');
        } finally {
            setIsSaving(false);
        }

        window.scrollTo(0, 0);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {applicationData.submitted && (
                <Alert severity="success" sx={{ marginBottom: '1rem' }}>
                    Οριστικοποιήσατε την αίτηση σας με επιτυχία. Το συμφωνητικό που πρέπει να υπογράψετε έχει εκδοθεί και βρίσκεται στην ενότητα “Συμφωνητικά”.
                </Alert>
            )}
            {!editMode && !applicationData.submitted && (
                <Alert severity="warning" sx={{ marginBottom: '1rem' }}>
                    Η αίτηση σας δεν έχει οριστικοποιηθεί πατήστε 'Υποβολή' για να εκδοθεί το συφμωνητικό της.
                </Alert>
            )} 
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
                {!applicationData.submitted && (
                    <h1 style={{ alignSelf: 'center' }}>
                        {editMode ? 'Επεξεργασία' : 'Προεπισκόπηση'}
                    </h1>
                )}
                {!editMode && <LastModification timestamp={applicationData.timestamp} />}
                {!applicationData.submitted && (
                    <p style={{color: 'var(--clr-grey)'}}>Όλα τα πεδία είναι υποχρεωτικά.</p>
                )}
                <h2>Όνομα Νταντάς & Ηλικία Παιδιού</h2>
                <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                    <Box>
                        <FormNannyName formData={applicationData} />
                    </Box>
                    <Box>
                        <FormChildAgeGroup formData={applicationData} />
                    </Box>
                </Box>
                <h2>Είδος Απασχόλησης & Χώρος Απασχόλησης</h2>
                <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                    <Box>
                        <FormEmploymentType formData={applicationData} />
                    </Box>
                    <Box>
                        <FormBabysittingPlace formData={applicationData} />
                    </Box>
                </Box>
                <h2>Διάρκεια Συνεργασίας</h2>
                <p>Επιλέξτε το χρονικό διάστημα που επιθυμείτε να συνεργαστείτε με τη νταντά.</p>
                <FormDateRange formData={applicationData} setFormData={setApplicationData} errors={errors} editMode={editMode} />
                <h2>Διαθεσιμότητα</h2>
                <FormTimeTable formData={applicationData} setFormData={setApplicationData} nannyTimetable={nannyData.jobPostingData.timetable} editMode={editMode} errors={errors} />
                {errors.timetable && (
                    <p style={{ color: 'var(--clr-error)', fontSize: '1.2rem' }}>
                        {errors.timetable}
                    </p>
                )}
                {!applicationData.submitted && editMode && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            disabled={isSaving}
                        >
                            <p className='big-button-text'>Προσωρινή Αποθήκευση</p>
                        </Button>
                    </Box>
                )}
                {!applicationData.submitted && !editMode && (
                    <Box sx={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%' }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setEditMode(true);
                                window.scrollTo(0, 0);
                            }}
                            sx={{ backgroundColor: 'var(--clr-blue-lighter)', '&:hover': { opacity: 0.8 } }}
                            disabled={isSaving}
                        >
                            <p className='big-button-text'>Επεξεργασία</p>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            disabled={isSaving}
                        >
                            <p className='big-button-text'>Υποβολή</p>
                        </Button>
                    </Box>
                )}
            </Box>
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ marginRight: '0.5rem' }}
            >
                <Alert onClose={() => setSnackbarMessage('')} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle><strong>Προσοχή!</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουροι πως θέλετε να υποβάλετε την αίτηση σας; Μετά την υποβολή, δεν θα μπορείτε να την επεξεργαστείτε.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmSubmit} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Υποβολή</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ApplicationForm;