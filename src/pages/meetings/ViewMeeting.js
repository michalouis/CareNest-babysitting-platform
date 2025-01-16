import React, { useState, useEffect } from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { Box, Button, Alert } from '@mui/material';

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
    const queryParams = new URLSearchParams(location.search);
    const meetingId = queryParams.get('meetingId');
    const [meetingData, setMeetingData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                
                {userData.role === 'parent' && meetingData.meetingState === 'pending' && (
                    <>
                        <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                            Tο ραντεβού σας βρίσκεται σε αναμονή, μέχρι να εγκριθεί από τη νταντά. <br />
                            Αν δεν έχετε έρθει σε επαφή με τη νταντά, μπορείτε να την επικοινωνήσετε μέσω του συστήματος μηνυμάτων.
                        </Alert>
                    </>
                )}

                {userData.role === 'nanny' && meetingData.meetingState === 'pending' && (
                    <Alert severity="warning" sx={{ margin: '0.5rem 1rem', maxWidth: 'fit-content' }}>
                        Παρακαλώ αποδεχθείτε ή απορίψτε το ραντεβού που σας έστειλε ο γονέας. <br />
                        Πληροφορίες για αυτόν μπορείτε να βρείτε παρακάτω.
                    </Alert>
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
                            : meetingData.meetingState === 'accepted' ? 'var(--clr-brat-green)' : 'var(--clr-error-main)',
                            color: 'var(--clr-white)',
                            borderRadius: '1rem',
                            display: 'inline-block',
                            alignSelf: 'center',
                        }}>
                            {meetingData.meetingState === 'pending' ? 'Σε αναμονή' 
                                : meetingData.meetingState === 'accepted' ? 'Εγκρίθηκε' 
                                : 'Αππορίφθηκε'}
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
                                sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem'}}
                                disabled={meetingData.meetingState !== 'accepted'}
                            >
                                Σύνδεση στην Συνάντηση
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<NavigationIcon />}
                                sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem' }}
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
                            sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem'}}
                            disabled={meetingData.meetingState !== 'accepted'}
                        >
                            <p className='small-button-text'>Προσθήκη στο Ημερολόγιο</p>
                        </Button>
                    </Box>
                    <h1 style={{ margin: '1rem 0'}}>Πληροφορίες Νταντάς</h1>
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
                                <p style={{ fontSize: '1.3rem' }}><strong>Τηλέφωνο Νταντάς: </strong>{nannyData.phoneNumber}</p>
                                <p style={{ fontSize: '1.3rem' }}><strong>Email Νταντάς: </strong>{nannyData.email}</p>
                            </Box>
                        )}
                        {parentData && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}>
                                <p style={{ fontSize: '1.3rem' }}><strong>Όνομα Γονέα: </strong>{parentData.firstName} {parentData.lastName}</p>
                                <p style={{ fontSize: '1.3rem' }}><strong>Τηλέφωνο Γονέα: </strong>{parentData.phoneNumber}</p>
                                <p style={{ fontSize: '1.3rem' }}><strong>Email Γονέα: </strong>{parentData.email}</p>
                            </Box>
                        )}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '1rem',
                        }}>
                            <Button variant="contained" startIcon={<PersonIcon />} sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem'}}>
                                <p className='small-button-text'>Προβολή Προφίλ</p>
                            </Button>
                            <Button variant="contained" startIcon={<MessageIcon />} sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem'}}>
                                <p className='small-button-text'>Αποστολή Μηνύματος</p>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </>
        )}
        </>
    );
}