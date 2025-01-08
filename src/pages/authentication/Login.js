import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, TextField, Button, Snackbar, Alert, LinearProgress } from '@mui/material';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { isLoading } = AuthCheck( false, true );

    if (isLoading) {
        return <Loading />;
    }

    // Handle the login process
    const handleLogin = async () => {
        setLoading(true);
        try {               // Try to sign in with the provided email and password
            const res = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = res.user;

            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.profileCreated) {     // Check if account is completed
                    navigate('/');      // Navigate to the homepage
                } else {
                    navigate('/profile-creation'); // Navigate to the profile creation page
                }
            }
        } catch (error) {   // if an error occurs, log it and display an error message
            console.error('Error logging in:', error);
            setErrorMessage('Λάθος email ή κωδικός πρόσβασης');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="CareNest - Σύνδεση" />
            <Breadcrumbs />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '1rem',
                flexGrow: 1
            }}>
                {/* Title & switch to sign-up */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem'
                }}>
                    <h1 className="login-header">Σύνδεση στη Πλατοφορμα</h1>
                    <p className="login-text">
                        Δεν έχετε λογαριασμό; <Link to="/signup" className="signup-link">Κάντε εγγραφή</Link>
                    </p>
                </Box>

                {/* Description */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <p style={{ fontSize: '1.5rem', margin: '2rem 0', textAlign: 'center' }}>Συνδεθείτε στο λογαριασμό σας</p>
                </Box>

                {/* Login form: Email, Password, Submit Button */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <Box sx={{
                        width: { xs: '95%', sm: '85%', md: '70%', lg: '50%' },
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        backgroundColor: 'var(--clr-white)',
                        padding: '2rem 1rem',
                        borderRadius: '1rem',
                        boxShadow: '2',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <TextField
                            id="email-input"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ marginBottom: '1rem' }}
                        />
                        <TextField
                            id="password-input"
                            label="Κωδικός"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ marginBottom: '1rem' }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleLogin}
                            sx={{
                                fontSize: '1.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--clr-violet)',
                                '&:hover': {
                                    opacity: '0.8',
                                },
                            }}
                            disabled={loading}
                        >
                            <p className='big-button-text'>Σύνδεση</p>
                        </Button>
                        {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />} {/* Loading bar */}
                    </Box>
                </Box>

                {/* Error Snackbar */}
                <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
                    <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}

export default Login;