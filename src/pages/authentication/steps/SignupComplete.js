import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import { Box, Button } from '@mui/material';
import { useLoginRequiredRedirect } from '../../../AuthChecks';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../../../style.css';

function SignupComplete() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useLoginRequiredRedirect();

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

    const renderButton = (buttonText, navigateTo) => {
        return (
            <Button
                variant="contained"
                onClick={() => navigate(navigateTo)}
                sx={{
                    fontSize: '1.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--clr-violet)',
                    width: '100%',
                    '&:hover': {
                        opacity: 0.8,
                    },
                }}
            >
                <p className='big-button-text'>{buttonText}</p>
            </Button>
        );
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%-2rem',
            margin: '1rem 0',
            height: 'calc(100vh - 180px - 2rem)', // 180px = height of header + footer
        }}>
            {/* Text */}
            <h1 style={{ marginBottom: '1rem' }}>
                Συγχαρητήρια! Ολοκληρώσατε την εγγραφή σας στη πλατφόρμα.
            </h1>

            { userData && (
                <>
                <h2>
                    {userData.role === 'parent' ? (
                        'Μπορείτε να ξεκινήστε την εύρεση νταντάς τώρα.'
                    ) : (
                        'Μπορείτε να ξεκινήστε να φτιάχνετε την αγγελία σας.'
                    )}
                </h2>
            
                {/* Buttons */}
                <Box sx={{
                    marginTop: '2rem',
                    width: '100%',
                    maxWidth: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {renderButton(
                        userData.role === 'parent' ? 'Αναζήτηση Νταντάς' : 'Συνεργασίες',
                        userData.role === 'parent' ? '/search' : '/partnerships'
                    )}
                    {renderButton('Αρχική Σελίδα', '/')}
                </Box>
                </>
            )}
        </Box>
    );
}

export default SignupComplete;