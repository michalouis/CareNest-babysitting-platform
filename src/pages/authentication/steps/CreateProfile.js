import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import StepperComponent from '../StepperComponent';
import { useProfileExistsRedirect } from '../../../AuthChecks';
import ProfileFormParent from './ProfileFormParent';

import LogoutIcon from '@mui/icons-material/Logout';

function CreateProfile() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useProfileExistsRedirect(); // Redirect to the homepage if the profile has already been created

    // Get the user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Handle Logout
    const handleLogout = async () => {
        await signOut(FIREBASE_AUTH);
        navigate('/'); // Navigate to the landing page
    };

    return (
        <>
        <Box sx={{
            display: 'flex',
            alignItems: 'baseline',
            margin: '1rem',
        }}>
            <h1 className="login-header">Εγγραφή</h1>
        </Box>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1rem',
        }}>
            {/* Logout Box */}
            <Box sx={{
                width: 'auto',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '2rem',
                backgroundColor: 'var(--clr-white)',
                padding: '1rem', borderRadius: '1rem',
                boxShadow: '2', margin: '0 auto',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                <p style={{ fontSize: '1.1rem', textAlign: 'left' }}>
                    Για να περιηγηθείτε στον ιστότοπο πρέπει να ολοκληρώσετε το προφίλ σας.
                    Διαφορετικά μπορείτε να αποσυνδεθείτε.
                </p>
                <Button
                    variant="contained"
                    onClick={handleLogout}
                    sx={{
                        fontSize: '1rem',
                        padding: '0.5rem',
                        backgroundColor: 'var(--clr-error)',
                        alignSelf: 'flex-end',
                        '&:hover': {
                            opacity: '0.8',
                        },
                    }}
                    startIcon={<LogoutIcon style={{ fontSize: '30px' }} />}
                >
                    <p className='button-text'>Αποσύνδεση</p>
                </Button>
            </Box>

            {/* Stepper */}
            <Box sx={{ width: '100%', margin: '2rem' }}>
                <StepperComponent activeStep={3} />
            </Box>

            {/* Description */}
            <p className='description'>
                Συμπληρώστε τα προσωπικά σας στοιχεία για να δημιουργήστε
                το προφίλ σας και να ολοκληρώσετε την εγγραφή σας.
            </p>

            {userData && (
                userData.role === 'parent' ? (
                    <ProfileFormParent
                        firstName={userData.firstName}
                        lastName={userData.lastName}
                        amka={userData.amka}
                        email={userData.email}
                        role={userData.role}
                    />
                ) : (
                    // Add code for other roles later
                    <div>υπό κατασκευή 👷</div>
                )
            )}
        </Box>
        </>
    );
}

export default CreateProfile;