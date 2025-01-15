import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { renderCommonData, renderNannyData } from '../profile/Profile';
import ViewJobPosting from '../job_posting/ViewJobPosting';
import MakeMeetingDialog from '../meetings/MakeMeetingDialog';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GradeIcon from '@mui/icons-material/Grade';
import MessageIcon from '@mui/icons-material/Message';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Render the profile picture  & score
const renderProfileScore = (userData) => (
    <Box sx={{
        display: 'flex', 
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'var(--clr-white)',
        padding: '1rem',
        borderRadius: '1rem',
        boxShadow: '2',
    }}>
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
        }}>
            <AccountCircleIcon style={{ fontSize: '7rem' }} />
        </Box>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--clr-gold)',
        }}>
            <GradeIcon sx={{ fontSize: '2.5rem', marginRight: '0.5rem' }} />
            <p className='big-button-text-gold'>{userData.score}</p>
        </Box>
    </Box>
);

export default function ViewPost() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const nannyId = queryParams.get('uid');
    const [nannyData, setNannyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Fetch nanny data
    useEffect(() => {
        const fetchNannyData = async () => {
            try {
                const nannyDoc = await getDoc(doc(FIREBASE_DB, 'users', nannyId));
                if (nannyDoc.exists()) {
                    setNannyData(nannyDoc.data());
                } else {
                    console.error('No such nanny:', nannyId);
                }
            } catch (error) {
                console.error('Error fetching nanny data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNannyData();
    }, [nannyId]);

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Νταντάς" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Νταντάς</h1>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                justifyContent: 'space-between',
                gap: '1rem',
                margin: '1rem'
            }}>
                {/* ProfilePic, Score & Buttons */}
                <Box sx={{
                    width: '260px',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center'
                }}>
                    {nannyData && renderProfileScore(nannyData)}
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            backgroundColor: 'var(--clr-blue-light)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 0'
                        }}
                        // onClick={() => navigate('/profile/edit-profile')}
                        startIcon={<MessageIcon />}
                    >
                        <p className="button-text">Μήνυμα</p>
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            backgroundColor: 'var(--clr-magenta)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 0'
                        }}
                        startIcon={<EventIcon />}
                        onClick={() => setDialogOpen(true)}
                    >
                        <p className="button-text">Ραντεβού Γνωριμίας</p>
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            backgroundColor: 'var(--clr-violet)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 0'
                        }}
                        // onClick={() => navigate('/profile/edit-profile')}
                        startIcon={<AssignmentIcon />}
                    >
                        <p className="button-text">Αίτηση Ενδιαφέροντος</p>
                    </Button>
                </Box>
                {/* Nanny Info */}
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '1rem',
                    justifyContent: 'space-around',
                    position: 'relative'
                }}>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        width: '100%',
                        backgroundColor: 'var(--clr-white)',
                        padding: '2rem 1rem',
                        borderRadius: '1rem',
                        boxShadow: '2',
                        marginBottom: '1rem',
                    }}>
                        {renderCommonData(nannyData)}
                        {renderNannyData(nannyData)}
                    </Box>
                    <h1>Αγγελία Νταντάς</h1>
                    <ViewJobPosting jobPostingData={nannyData.jobPostingData} />
                </Box>
            </Box>

            {/* For setting up a meeting - look MakeMeetingDialog.js */}
            <MakeMeetingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                nannyId={nannyId}
            />
        </>
    );
}