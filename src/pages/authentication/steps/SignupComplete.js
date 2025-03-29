import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../../AuthChecks';
import Loading from '../../../layout/Loading';
import PageTitle from '../../../PageTitle';

import '../../../style.css';

// This page is displayed after the user completes the signup process (has buttons to guide user what to do next)
function SignupComplete() {
    const navigate = useNavigate();

    const { userData, isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

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
        <>
            <PageTitle title="CareNest - Sign up Complete!" />
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
                    Congratulations! You have successfully completed your registration on the platform.
                </h1>

                { userData && (
                    <>
                    <h2>
                        {userData.role === 'parent' ? (
                            'You can begin your search for a nanny now.'
                        ) : (
                            'You can start creating your job listing now.'
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
                            userData.role === 'parent' ? 'Search for a Nanny' : 'Create Job Listing',
                            userData.role === 'parent' ? '/search' : '/job-posting'
                        )}
                        {renderButton('Home Page', '/')}
                    </Box>
                    </>
                )}
            </Box>
        </>
    );
}

export default SignupComplete;