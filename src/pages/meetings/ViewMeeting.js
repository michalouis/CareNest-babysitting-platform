import React, { useState, useEffect } from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { Box, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

import NavigationIcon from '@mui/icons-material/Navigation';
import VideocamIcon from '@mui/icons-material/Videocam';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

export default function ViewMeeting() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const meetingId = queryParams.get('meetingId');
    const [meetingData, setMeetingData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        const fetchMeetingData = async () => {
            try {
                const meetingDoc = await getDoc(doc(FIREBASE_DB, 'meetings', meetingId));
                if (meetingDoc.exists()) {
                    const data = meetingDoc.data();
                    setMeetingData(data);

                    // Fetch user data based on role
                    const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userData.role === 'parent' ? data.nannyId : data.parentId));
                    if (userDoc.exists()) {
                        if (userData.role === 'parent') {
                            setNannyData(userDoc.data());
                        } else {
                            setParentData(userDoc.data());
                        }
                    } else {
                        console.error('No such user:', userData.role === 'parent' ? data.nannyId : data.parentId);
                    }
                } else {
                    console.error('No such meeting:', meetingId);
                }
            } catch (error) {
                console.error('Error fetching meeting data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (meetingId && userData) {
            fetchMeetingData();
        }
    }, [meetingId, userData]);

    const handleAccept = () => {
        setActionType('accept');
        setDialogOpen(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirm = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(FIREBASE_DB, 'meetings', meetingId), {
                meetingState: actionType === 'accept' ? 'accepted' : 'rejected'
            });
            setMeetingData(prevData => ({ ...prevData, meetingState: actionType === 'accept' ? 'accepted' : 'rejected' }));
        } catch (error) {
            console.error(`Error ${actionType === 'accept' ? 'accepting' : 'rejecting'} meeting:`, error);
        } finally {
            setLoading(false);
            handleDialogClose();
        }
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - Προβολή Ραντεβού" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Προβολή Ραντεβού</h1>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {userData.role === 'parent' && meetingData.meetingState === 'pending' && (
                        <>
                            <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                                Tο ραντεβού σας βρίσκεται σε αναμονή, μέχρι να εγκριθεί από τη νταντά.
                            </Alert>
                        </>
                    )}

                    {userData.role === 'nanny' && meetingData.meetingState === 'pending' && (
                        <>
                        <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                            Παρακαλώ αποδεχθείτε ή απορίψτε το ραντεβού που σας έστειλε ο γονέας. <br />
                            Πληροφορίες για αυτόν μπορείτε να βρείτε παρακάτω.
                        </Alert>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', margin: '1rem' }}>
                            <Button variant="contained" sx={{ backgroundColor: "var(--clr-darker-green)" }} onClick={handleAccept}>
                                <p className='big-button-text'>Αποδοχή</p>
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: "var(--clr-error-main)" }} onClick={handleReject}>
                                <p className='big-button-text'>Απόρριψη</p>
                            </Button>
                        </Box>
                        </>
                    )}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        margin: '1rem',
                        padding: '1rem',
                        width: 'fit-content',
                        borderRadius: '1rem',
                        backgroundColor: 'var(--clr-white)',
                        boxShadow: '3',
                        gap: '0.5rem',
                    }}>
                        <p style={{ fontSize: '2.2rem', lineHeight: '2.5rem', alignItems: 'center' }}>
                            <strong>Κατάσταση Ραντεβού: </strong>
                            <span style={{
                                fontWeight: 'bold',
                                padding: '0.3rem 0.7rem',
                                backgroundColor: meetingData.meetingState === 'pending' ? 'var(--clr-orange)'
                                : meetingData.meetingState === 'accepted' ? 'var(--clr-darker-green)' : 'var(--clr-error-main)',
                                color: 'var(--clr-white)',
                                borderRadius: '1rem',
                                display: 'inline-block',
                                alignSelf: 'center',
                            }}>
                                {meetingData.meetingState === 'pending' ? 'Σε αναμονή' 
                                    : meetingData.meetingState === 'accepted' ? 'Εγκρίθηκε' 
                                    : 'Απορρίφθηκε'}
                            </span>
                        </p>
                        <h1 style={{ margin: '1rem 0'}}>Τύπος Ραντεβού</h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '2rem',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Τύπος Ραντεβού: </strong>{meetingData.meetingType === 'online' ? 'Διαδυκτιακό' : 'Δια ζώσης'}
                                </p>
                                {meetingData.meetingType == 'in-person' && <p style={{ fontSize: '1.3rem' }}><strong>Διεύθυνση Συνάντησης: </strong>{meetingData.address}</p>}
                            </Box>
                            {meetingData.meetingType === 'online' ? (
                                <Button
                                    variant="contained"
                                    startIcon={<VideocamIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem'}}
                                    disabled={meetingData.meetingState !== 'accepted'}
                                >
                                    <p className='small-button-text'>Σύνδεση στην Συνάντηση</p>
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<NavigationIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }}
                                    disabled={meetingData.meetingState !== 'accepted'}
                                >
                                    <p className='small-button-text'>Άνοιγμα διεύθυνσης στο χάρτη</p>
                                </Button>
                            )}
                        </Box>
                        <h1 style={{ margin: '1rem 0'}}>Ημερομηνία και Ώρα</h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '2rem',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Ημερομηνία: </strong>{meetingData.dateTime.day} {months[meetingData.dateTime.month]} {meetingData.dateTime.year}
                                </p>
                                <p style={{ fontSize: '1.3rem' }}>
                                    <strong>Ώρα: </strong>{meetingData.dateTime.hour}:{meetingData.dateTime.minute}
                                </p>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<EventIcon />}
                                sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem'}}
                                disabled={meetingData.meetingState !== 'accepted'}
                            >
                                <p className='small-button-text'>Προσθήκη στο Ημερολόγιο</p>
                            </Button>
                        </Box>
                        <h1 style={{ margin: '1rem 0' }}>
                            {userData.role === 'parent' ? 'Πληροφορίες Νταντάς' : 'Πληροφορίες Γονέα'}
                        </h1>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '4rem',
                        }}>
                            {nannyData && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Όνομα Νταντάς: </strong>{nannyData.firstName} {nannyData.lastName}</p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Τηλέφωνο Νταντάς: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            nannyData.phoneNumber
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Απαιτείται έγκριση ραντεβού</span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Email Νταντάς: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            nannyData.email
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Απαιτείται έγκριση ραντεβού</span>
                                        )}
                                    </p>
                                </Box>
                            )}
                            {parentData && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Όνομα Γονέα: </strong>{parentData.firstName} {parentData.lastName}</p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Τηλέφωνο Γονέα: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            parentData.phoneNumber
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Απαιτείται έγκριση ραντεβού</span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '1.3rem' }}>
                                        <strong>Email Γονέα: </strong>
                                        {meetingData.meetingState === 'accepted' ? (
                                            parentData.email
                                        ) : (
                                            <span style={{ color: 'var(--clr-orange)' }}>Απαιτείται έγκριση ραντεβού</span>
                                        )}
                                    </p>
                                </Box>
                            )}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: '1rem',
                            }}>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonIcon />}
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }}
                                    onClick={() => navigate(`/search/view-profile?uid=${userData.role === 'parent' ? meetingData.nannyId : meetingData.parentId}`)}
                                >
                                    <p className='small-button-text'>Προβολή Προφίλ</p>
                                </Button>
                                <Button variant="contained" startIcon={<MessageIcon />} sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem'}}>
                                    <p className='small-button-text'>Αποστολή Μηνύματος</p>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle><strong>Προσοχή!</strong></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Είστε σίγουροι ότι θέλετε να {actionType === 'accept' ? 'αποδεχθείτε' : 'απορρίψετε'} αυτό το ραντεβού;
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} sx={{ color: 'var(--clr-black)' }}>
                            <p className='button-text'>Ακύρωση</p>
                        </Button>
                        <Button variant="contained" onClick={handleDialogConfirm} sx={{ backgroundColor: actionType === 'accept' ? 'var(--clr-darker-green)' : 'var(--clr-error-main)' }}>
                            <p className='button-text'>{actionType === 'accept' ? 'Αποδοχή' : 'Απόρριψη'}</p>
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )}
        </>
    );
}