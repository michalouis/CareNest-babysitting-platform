import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../firebase';
import StepperComponent from '../StepperComponent';
import ProfileFormParent from './ProfileFormParent';
import ProfileFormNanny from './ProfileFormNanny';
import { useAuthCheck as AuthCheck } from '../../../AuthChecks';
import Loading from '../../../layout/Loading';
import PageTitle from '../../PageTitle';

import LogoutIcon from '@mui/icons-material/Logout';

function CreateProfile() {
    const navigate = useNavigate();
    // Handle Logout
    const handleLogout = async () => {
        await signOut(FIREBASE_AUTH);
        navigate('/'); // Navigate to the landing page
    };

    const { userData, isLoading } = AuthCheck( true, false, true );

    if (isLoading) {
        return <Loading />;
    }


    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Προφίλ" />
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
                        />
                    ) : (
                        <ProfileFormNanny
                            firstName={userData.firstName}
                            lastName={userData.lastName}
                            amka={userData.amka}
                            email={userData.email}
                        />
                    )
                )}
            </Box>
        </>
    );
}

export default CreateProfile;