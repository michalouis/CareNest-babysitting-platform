import React, { useState } from "react";
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import '../../style.css';

import FileIcon from '@mui/icons-material/Description';

// translate data to greek
const translateMap = {
    school: 'Απολυτήριο Σχολείου',
    university: 'Πανεπιστήμιο',
    college: 'Κολέγιο',
    tei: 'ΤΕΙ',
    english: 'Αγγλικά',
    german: 'Γερμανικά',
    french: 'Γαλλικά',
    spanish: 'Ισπανικά',
    piano: 'Πιάνο',
    guitar: 'Κιθάρα',
    violin: 'Βιολί',
    flute: 'Φλάουτο'
};


// data common to parents/nannies
const renderCommonData = (userData) => (
    <>
        {/* Personal Data */}
        <h2>Προσωπικά Στοιχεία</h2>
        <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
            <TextField label="Όνομα" value={userData.firstName} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Επώνυμο" value={userData.lastName} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField
                label="Φύλο"
                value={
                    userData.gender === 'Male' ? 'Άντρας' :
                    userData.gender === 'Female' ? 'Γυναίκα' :
                    userData.gender === 'Other' ? 'Άλλο' :
                    ''
                }
                slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                fullWidth
                variant="outlined"
            />
            <TextField label="Ηλικία" value={userData.age} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Ρόλος" value={userData.role === 'parent' ? 'Γονέας' : 'Νταντά'} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="ΑΜΚΑ" value={userData.amka} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
        </Box>

        {/* Contact Data */}
        <h2>Στοιχεία Επικοινωνίας</h2>
        <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
            <TextField label="Διεύθυνση" value={userData.address} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Ταχυδρομικός Κώδικας" value={userData.postalCode} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Πόλη" value={userData.town} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Τηλέφωνο" value={userData.phoneNumber} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField label="Email" value={userData.email} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
        </Box>

        <h2>Σχετικά με μένα</h2>
        <TextField label="Σχετικά με μένα" value={userData.aboutMe} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" multiline rows={4} />
    </>
);

// data exclusive to parents (child data)
const renderParentData = (userData) => (
    <>
        <h2>Στοιχεία Παιδιού</h2>
        <Box sx={{ flexGrow: 1, display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 1.5, width: '100%' }}>
            <TextField label="Όνομα Παιδιού" value={userData.childName} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
            <TextField
                label="Φύλο Παιδιού"
                value={
                    userData.childGender === 'Male' ? 'Αγόρι' :
                    userData.childGender === 'Female' ? 'Κορίτσι' :
                    userData.childGender === 'Other' ? 'Άλλο' :
                    ''
                }
                slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
                fullWidth
                variant="outlined"
            />
            <TextField label="Ηλικιακή Ομάδα Παιδιού" value={userData.childAgeGroup} slotProps={{ input: { readOnly: true }, label: { shrink: true } }} fullWidth variant="outlined" />
        </Box>
    </>
);

// data exclusive to nannies (experience, degrees, certificates, recommendations, skills)
const renderNannyData = (userData) => (
    <>
        <h2>Εμπειρία</h2>
        <TextField
            label="Εμπειρία"
            value={`${userData.experience} μήνες`}
            slotProps={{ input: { readOnly: true }, label: { shrink: true } }}
            fullWidth
            variant="outlined"
        />

        <h2>Σπουδές</h2>
        {userData.degrees.map((degree, index) => (
            <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                    <strong>{index + 1}. {translateMap[degree.degreeLevel]}:</strong> {degree.degreeTitle}
                </p>
                <Button
                    variant="contained"
                    startIcon={<FileIcon />}
                    sx={{ backgroundColor: 'var(--clr-violet)', }}
                >
                    <p className="smaller-button-text">{degree.degreeFile}</p>
                </Button>
            </Box>
        ))}

        <h2>Πιστοποιητικά</h2>
        {userData.certificates.map((certificate, index) => (
            <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                    <strong>{index + 1}. {certificate.certificateTitle}: </strong>
                </p>
                <Button
                    variant="contained"
                    startIcon={<FileIcon />}
                    sx={{ backgroundColor: 'var(--clr-violet)', }}
                >
                    <p className="smaller-button-text">{certificate.certificateFile}</p>
                </Button>
            </Box>
        ))}

        <h2>Συστάσεις</h2>
        {userData.recommendations.map((recommendation, index) => (
            <Box key={index} sx={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <p style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                    <strong>{index + 1}. {recommendation.recommendationTitle}: </strong>
                </p>
                <Button
                    variant="contained"
                    startIcon={<FileIcon />}
                    sx={{ backgroundColor: 'var(--clr-violet)', }}
                >
                    <p className="smaller-button-text">{recommendation.recommendationFile}</p>
                </Button>
            </Box>
        ))}

        <h2>Δεξιότητες</h2>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' }}>
            {Object.entries(userData.languages).map(([language, value]) => (
                value && (
                    <Box
                        key={language}
                        sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'white',
                            padding: '1rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px'
                        }}
                    >
                        <p className="button-text">
                            {translateMap[language]}
                        </p>
                    </Box>
                )
            ))}
            {Object.entries(userData.music).map(([music, value]) => (
                value && (
                    <Box
                        key={music}
                        sx={{
                            backgroundColor: 'var(--clr-violet)',
                            color: 'white',
                            padding: '1rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px'
                        }}
                    >
                        <p className="button-text">
                            {translateMap[music]}
                        </p>
                    </Box>
                )
            ))}
        </Box>
    </>
);

// Profile component
function Profile() {
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
                    {/* Buttons: Edit profile, delete account */}
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

export default Profile;