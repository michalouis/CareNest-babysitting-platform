import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import '../../style.css';
import { ProfileOverview, renderCommonData, renderParentData, renderNannyData } from '../../components/ProfileComponents';

// Profile component
export function Profile() {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { userData, isLoading } = AuthCheck( true, false, false, '' );  // Get user data, redirect to login page if not logged in
    
    if (isLoading) {
        return <Loading />;
    }

    // Dialog box for account deletion
    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    // Delete user account
    const handleDeleteAccount = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            try {
                // Re-authenticate the user
                const credential = EmailAuthProvider.credential(user.email, prompt('Please enter your password to confirm:'));
                await reauthenticateWithCredential(user, credential);

                // Delete job posting document from Firestore
                if (userData.role === 'nanny' && userData.jobPosted) {
                    console.log('Deleting job posting document...');
                    await deleteDoc(doc(FIREBASE_DB, 'jobPostings', user.uid));
                }

                // Delete user document from Firestore
                await deleteDoc(doc(FIREBASE_DB, 'users', user.uid));

                // Delete user account
                await deleteUser(user);
                navigate('/'); // Navigate to home or login page after deletion
            } catch (error) {
                console.error('Error deleting user account:', error);
            }
        }
    };

    return (
        <>
        {userData && (
                <>
                <PageTitle title="CareNest - Προφίλ" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Προφίλ Χρήστη</h1>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: { sm: 'wrap', md: 'nowrap' },
                    justifyContent: 'space-between',
                    gap: '1rem',
                    margin: '1rem'
                }}>
                    {/* ProfilePhto + Buttons: Edit profile, delete account */}
                    <Box sx={{
                        width: '260px',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}>
                        {ProfileOverview(userData)}    {/* Profile picture */}
                        <Button
                            variant="contained"
                            sx={{
                                width: '100%',
                                backgroundColor: 'var(--clr-violet)',
                                '&:hover': { opacity: 0.8 },
                                padding: '0.5rem 0'
                            }}
                            onClick={() => navigate('/profile/edit-profile')}
                        >
                            <p className="button-text">Επεξεργασία</p>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleDeleteDialogOpen}
                            sx={{
                                width: '100%',
                                backgroundColor: 'var(--clr-error)',
                                '&:hover': { opacity: 0.8 },
                                padding: '0.5rem 0'
                        }}>
                            <p className="button-text">Διαγραφή Λογαριασμού</p>
                        </Button>
                    </Box>

                    {/* User Data */}
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
                        {renderCommonData(userData)}    {/* Common data for parents/nannies */}
                        {userData.role === 'parent' ? renderParentData(userData) : renderNannyData(userData)}   {/* Parent/Nanny specific data */}
                    </Box>
                </Box>

                {/* Dialog box for account deletion */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                >
                    <DialogTitle><strong>Επιβεβαίωση Διαγραφής Λογαριασμού</strong></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας;<br />
                            <strong>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.</strong>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} sx={{ color: 'var(--clr-black)' }}>
                            <p className='button-text'>Ακύρωση</p>
                        </Button>
                        <Button onClick={handleDeleteAccount} sx={{ backgroundColor: 'var(--clr-error-main)', color: 'var(--clr-white)' }}>
                            <p className='button-text'>Διαγραφή</p>
                        </Button>
                    </DialogActions>
                </Dialog>
                </>
            )}
        </>
    );
}