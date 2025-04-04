import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { getDoc, doc, updateDoc, addDoc, collection, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import Loading from '../../layout/Loading';
import { FormNannyName, FormChildAgeGroup, FormEmploymentType, FormBabysittingPlace, FormDateRange, FormTimeTable, validate } from './ApplicationFields';
import VisualizeTimeTable from '../../components/VisualizeTimeTable';

// show last edit time in greek
const LastModification = ({ timestamp }) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <p><strong>Last Edited:</strong> {formattedDate} {formattedTime}</p>
    );
};

// Pass nannyId if making a new application, or applicationId if editing an existing application
function ApplicationForm({ userData, nannyId, applicationId }) {
    const [editMode, setEditMode] = useState(!!nannyId);
    const [nannyData, setNannyData] = useState(null);
    const [applicationData, setApplicationData] = useState({
        applicationId: '',
        nannyId: '',
        parentId: '',
        parentName: '',
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
                                parentName: `${userData.firstName} ${userData.lastName}`
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

    // save draft application
    const handleSave = async () => {
        // Validate application data
        const isValid = validate(applicationData, setErrors, setSnackbarMessage, setSnackbarSeverity);
        if (!isValid) return;

        setIsSaving(true);

        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    applicationData.applicationId = applicationData.applicationId || Date.now().toString(); // Use existing applicationId or generate a new one
                    applicationData.parentId = applicationData.parentId || user.uid;
                    applicationData.nannyId = applicationData.nannyId || nannyId;
                    applicationData.timestamp = new Date().toISOString();
                
                    const updatedApplications = userData.applications
                        ? [...userData.applications.filter(app => app.applicationId !== applicationData.applicationId), applicationData]
                        : [applicationData];
                
                    // update application data in Firebase
                    await updateDoc(userDocRef, { applications: updatedApplications });

                    // turn off edit mode, show success message and update local applicationData to reflect the changes
                    setEditMode(false); 
                    setSnackbarMessage('Your application has been successfully saved temporarily! You can find it in the "Applications" section. To finalize it, click Submit.');
                    setSnackbarSeverity('success');
                    window.scrollTo(0, 0);  // scroll to top of the page
                } else {
                    console.error('No such user:', user.uid);
                }
            }
        } catch (error) {
            console.error('Error saving application:', error);
            setSnackbarMessage('An error occurred while saving the application.');
            setSnackbarSeverity('error');
        } finally {
            setIsSaving(false);
        }
    };

    // Validate application data, show confirmation dialog and submit application
    const handleSubmit = async () => {
        const isValid = validate(applicationData, setErrors, setSnackbarMessage);
        if (!isValid) return;

        setOpenConfirmDialog(true);
    };

    // Submit application
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
                        timestamp: new Date().toISOString(),    // update timestamp to reflect the submission time
                    };

                    const updatedApplications = userData.applications.map(app => 
                        app.applicationId === applicationData.applicationId 
                            ? updatedApplicationData 
                            : app
                    );

                    // Create contract in Firebase
                    const contractData = { ...updatedApplicationData };
                    delete contractData.submitted; // Remove submitted field from contract data
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

                    // Update local applicationData to reflect the changes
                    setApplicationData(prevApplicationData => ({
                        ...prevApplicationData,
                        submitted: true,
                    }));

                    console.log('Submit:', updatedApplicationData);
                    setSnackbarMessage('Your application has been successfully submitted!');
                    setSnackbarSeverity('success');
                } else {
                    console.error('No such user:', user.uid);
                }
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setSnackbarMessage('An error occurred while submitting the application.');
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
            {/* Alerts based on application status */}
            {applicationData.submitted && (
                <Alert severity="success" sx={{ marginBottom: '1rem' }}>
                    You have successfully finalized your application. The contract you need to sign has been issued and can be found in the <Link to="/contracts" style={{ color: 'inherit' }}>'Contracts'</Link> section.
                </Alert>            
            )}
            {!editMode && !applicationData.submitted && (
                <Alert severity="warning" sx={{ marginBottom: '1rem' }}>
                    Your application has not been finalized. Click 'Submit' to issue the contract.
                </Alert>
            )}
            {/* Application form - get fields from ApplicationFields.js */}
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
                        Status: <span style={{ fontWeight: 'normal' }}>{editMode ? 'Editing' : 'Preview'}</span>
                    </h1>
                )}
                {!editMode && <LastModification timestamp={applicationData.timestamp} />}
                {!applicationData.submitted && (
                    <p style={{color: 'var(--clr-grey)'}}>All fields are mandatory.</p>
                )}
                <h2>Nanny's Name & Child's Age</h2>
                <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                    <Box>
                        <FormNannyName formData={applicationData} />
                    </Box>
                    <Box>
                        <FormChildAgeGroup formData={applicationData} />
                    </Box>
                </Box>
                <h2>Type of Employment & Place of Employment</h2>
                <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                    <Box>
                        <FormEmploymentType formData={applicationData} />
                    </Box>
                    <Box>
                        <FormBabysittingPlace formData={applicationData} />
                    </Box>
                </Box>
                <h2>Duration of Partnership</h2>
                <FormDateRange formData={applicationData} setFormData={setApplicationData} errors={errors} editMode={editMode} />
                <h2>Weekly Childcare Schedule</h2>
                {!applicationData.submitted ? (
                    <FormTimeTable formData={applicationData} setFormData={setApplicationData} nannyTimetable={nannyData.jobPostingData.timetable} editMode={editMode} errors={errors} />
                ) : (
                    <VisualizeTimeTable formData={applicationData} />   // If submitted, show finalized timetable (no check icons)
                )}
                {errors.timetable && (
                    <p style={{ color: 'var(--clr-error)', fontSize: '1.2rem' }}>
                        {errors.timetable}
                    </p>
                )}
                {/* Edit, Save, Submit Buttons - don't show them if application submitted */}
                {!applicationData.submitted && editMode && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            disabled={isSaving}
                        >
                            <p className='big-button-text'>Save Draft</p>
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
                            <p className='big-button-text'>Edit</p>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                            disabled={isSaving}
                        >
                            <p className='big-button-text'>Submit</p>
                        </Button>
                    </Box>
                )}
            </Box>
            {/* Snackbar and Confirmation Dialog */}
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
                <DialogTitle><strong>Warning!</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to submit your application? After submission, you will not be able to edit it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmSubmit} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Submit</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ApplicationForm;