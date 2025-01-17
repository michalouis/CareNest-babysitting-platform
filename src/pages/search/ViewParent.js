import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { renderCommonData, renderParentData } from '../profile/Profile';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';

// Render the profile picture
const renderProfilePicture = (userData) => (
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
    </Box>
);

export default function ViewParent() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'nanny');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const parentId = queryParams.get('uid');
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch parent data
    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const parentDoc = await getDoc(doc(FIREBASE_DB, 'users', parentId));
                if (parentDoc.exists()) {
                    setParentData(parentDoc.data());
                } else {
                    console.error('No such parent:', parentId);
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, [parentId]);

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Γονέα" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Γονέα</h1>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                justifyContent: 'space-between',
                gap: '1rem',
                margin: '1rem'
            }}>
                {/* ProfilePic */}
                <Box sx={{
                    width: '260px',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center'
                }}>
                    {parentData && renderProfilePicture(parentData)}
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            backgroundColor: 'var(--clr-blue-light)',
                            '&:hover': { opacity: 0.8 },
                            padding: '0.5rem 0'
                        }}
                        // onClick={() => navigate(`/messages?recipientId=${parentId}`)}
                        startIcon={<MessageIcon />}
                    >
                        <p className="button-text">Μήνυμα</p>
                    </Button>
                </Box>
                {/* Parent Info */}
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
                        {renderCommonData(parentData)}
                        {renderParentData(parentData)}
                    </Box>
                </Box>
            </Box>
        </>
    );
}