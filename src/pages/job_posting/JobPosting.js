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
            navigate('/job-posting/edit-job-posting');
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
                navigate('/job-posting/edit-job-posting');
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
            <PageTitle title="CareNest - Αγγελία Εργασίας" />
            <Breadcrumbs />
            <h1 style={{ margin: '1rem' }}>Αγγελία Εργασίας</h1>
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
                        <p style={{ fontSize: '1.2rem', maxWidth: '1080px' }}>
                            <strong>Έχετε δημοσιεύσει την αγγελία σας με επιτυχία!</strong><br />
                            Μπορείτε να τη δείτε παρακάτω.
                        </p>
                        <ViewJobPosting jobPostingData={userData.jobPostingData} />
                    </>
                ) : (
                    <>
                    <p style={{ fontSize: '1.2rem', maxWidth: '1080px' }}>
                        <strong>Δημιουργήστε την αγγελία σας και βρείτε την ιδανική συνεργασία!</strong><br />
                        Δηλώστε τις προτιμήσεις και τη διαθεσιμότητά σας, ώστε να σας
                        βρουν οι κατάλληλες οικογένειες. Συμπληρώστε στοιχεία όπως τον
                        χρόνο απασχόλησης, την τοποθεσία εργασίας και το ηλικιακό γκρουπ
                        που προτιμάτε να φροντίζετε.
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
                        <p className="big-button-text">Δημιουργία Νέας Αγγελίας</p>
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
                        <p className="big-button-text">Προσωρινά Αποθηκευμένη Αγγελία</p>
                    </Button>

                    {/* Dialog for new posting button */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        >
                        <DialogTitle><strong>Προσοχή!</strong></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Υπάρχει ήδη αποθηκευμένη αγγελία. Αν δημιουργήσετε νέα αγγελία, <strong>η παλιά θα διαγραφεί.</strong>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                                <p className="button-text">Ακύρωση</p>
                            </Button>
                            <Button variant='contained' onClick={handleDialogClose} sx={{ backgroundColor: 'var(--clr-error)' }}>
                                <p className="button-text">Δημιουργία Νέας Αγγελίας</p>
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