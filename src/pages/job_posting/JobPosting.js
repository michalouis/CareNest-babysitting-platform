import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, getDoc, deleteField } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import ViewJobPosting from "./ViewJobPosting";

import '../../style.css'

function JobPosting() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'nanny');
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    // Function to handle the click of the "New Posting" button
    const handleNewPostingClick = () => {
        if (userData && userData.jobPostingData) {
            setOpenDialog(true);
        } else if (userData && !userData.jobPostingData) {
            navigate('/CareNest-babysitting-platform/job-posting/edit-job-posting');
        }
    };

    // Handle old posting deletion
    const handleDialogClose = async () => {
        setOpenDialog(false);
        try {
            const user = FIREBASE_AUTH.currentUser;
            const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, {
                    jobPostingData: deleteField()
                });
                navigate('/CareNest-babysitting-platform/job-posting/edit-job-posting');
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
            <PageTitle title="CareNest - Job Posting" />
            <Breadcrumbs />
            <h1 style={{ margin: '1rem' }}>Job Posting</h1>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: '1rem 1rem',
            }}>
                {userData && userData.jobPosted ? (
                    <>
                        <p style={{ fontSize: '1.2rem', maxWidth: '1080px', marginBottom: '1rem' }}>
                            <strong>You have successfully posted your job listing!</strong><br />
                            You can view it below.
                        </p>
                        <ViewJobPosting jobPostingData={userData.jobPostingData} />
                    </>
                ) : (
                    <>
                    <p style={{ fontSize: '1.2rem', maxWidth: '1080px' }}>
                        <strong>Create your job listing and find the perfect match!</strong><br />
                        Set your preferences and availability so the right families can find you. Fill in details such as employment time, work location, and the age group you prefer to care for.
                    </p>
    
                    {/* New Posting */}
                    <Button
                        variant="contained"
                        sx={{
                            width: '450px',
                            marginTop: '4rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--clr-violet)',
                        }}
                        onClick={handleNewPostingClick}
                    >
                        <p className="big-button-text">Create New Listing</p>
                    </Button>
    
                    {/* Open saved posting */}
                    <Button
                        variant="contained"
                        sx={{
                            width: '450px',
                            marginTop: '1.5rem',
                            padding: '0.5rem 1rem',
                        }}
                        disabled={userData && !userData.jobPostingData}
                        onClick={() => navigate('/job-posting/edit-job-posting')}
                    >
                        <p className="big-button-text">Save Draft</p>
                    </Button>

                    {/* Dialog for new posting button */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        >
                        <DialogTitle><strong>Warning!</strong></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                There is already a saved draft listing. If you create a new listing, <strong>the old one will be deleted.</strong>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                                <p className="button-text">Cancel</p>
                            </Button>
                            <Button variant='contained' onClick={handleDialogClose} sx={{ backgroundColor: 'var(--clr-error)' }}>
                                <p className="button-text">Create New Listing</p>
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
                )}
            </Box>
            </>
        )}
        </>
    );    
}

export default JobPosting;