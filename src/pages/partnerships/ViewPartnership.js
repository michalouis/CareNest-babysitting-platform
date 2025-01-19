import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, useMediaQuery } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormDateRange, VisualizeTimeTable, FormEmploymentType, FormBabysittingPlace } from '../applications/ApplicationFields';
import PaymentsBox from './PaymentsBox';
import RatingBox from './RatingBox';

import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

export default function ViewPartnership() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const location = useLocation();
    const { id } = useParams();
    const partnershipId = id;
    const [partnershipData, setPartnershipData] = useState(null);
    const [partnerData, setPartnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:1450px)');

    useEffect(() => {
        const fetchPartnershipData = async () => {
            try {
                const partnershipDoc = await getDoc(doc(FIREBASE_DB, 'partnerships', partnershipId));
                if (partnershipDoc.exists()) {
                    const data = partnershipDoc.data();
                    setPartnershipData(data);

                    const partnerId = userData.role === 'parent' ? data.nannyId : data.parentId;
                    const partnerDoc = await getDoc(doc(FIREBASE_DB, 'users', partnerId));
                    if (partnerDoc.exists()) {
                        setPartnerData(partnerDoc.data());
                    } else {
                        console.error('No such partner:', partnerId);
                    }
                } else {
                    console.error('No such partnership:', partnershipId);
                }
            } catch (error) {
                console.error('Error fetching partnership data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (partnershipId && userData) {
            fetchPartnershipData();
        }
    }, [partnershipId, userData]);

    const finishPartnership = async () => {
        try {
            // Update partnership data
            await updateDoc(doc(FIREBASE_DB, 'partnerships', partnershipData.partnershipId), {
                active: false
            });
    
            // Update nanny data
            const nannyDocRef = doc(FIREBASE_DB, 'users', partnershipData.nannyId);
            const nannyDoc = await getDoc(nannyDocRef);
            if (nannyDoc.exists()) {
                await updateDoc(nannyDocRef, {
                    partnershipActive: false,
                });
            }
    
            // Update parent data
            const parentDocRef = doc(FIREBASE_DB, 'users', partnershipData.parentId);
            await updateDoc(parentDocRef, {
                partnershipActive: false,
            });
    
            window.location.reload();
        } catch (error) {
            console.error('Error updating partnership and user data:', error);
        }
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    let message = null;

    if (userData.role === 'parent') {
        if (partnershipData.payments.some(payment => payment === 'paid') && partnershipData.payments[partnershipData.payments.length - 1] !== 'verified') {
            message = { type: 'info', text: 'Μη ξεχάσετε στο τέλος κάθε μήνα να πληρώσετε τη νταντά.' };
        } else if (partnershipData.payments[partnershipData.payments.length - 1] === 'verified' && !partnershipData.rating) {
            message = { type: 'info', text: 'Έχετε πραγματοποιήσει όλες τις πληρωμές! Προσθέστε μια αξιολόγηση για να ολοκληρώσετε τη συνεργασία σας.' };
        } else if (!partnershipData.active) {
            message = { type: 'success', text: 'Η συνεργασία έχει ολοκληρωθεί! Μπορείτε να φτιάξετε νέα αίτηση για να την ανανεώστε σας πατώντας \'Ανανέωση Συνεργασίας\'.' };
        }
    } else if (userData.role === 'nanny') {
        if (partnershipData.payments.some(payment => payment === 'paid')) {
            message = { type: 'info', text: 'Ο γονέας έχει στείλει την ανταμοιβή σας! Παρακαλώ επιβεβαιώστε πως τη λάβατε.' };
        } else if (!partnershipData.active) {
            message = { type: 'success', text: 'Η συνεργασία έχει ολοκληρωθεί. Στην ενότητα \'Αξιολόγηση\' μπορείτε να δείτε τη κριτική που σας άφησε ο γονέας.' };
        }
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Συνεργασίας" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Συνεργασίας</h1>
            {userData && partnershipData && (
                <>
                    {message && (
                        <Alert severity={message.type} sx={{ alignSelf: 'center', width: 'fit-content', marginTop: '1rem' }}>
                            {message.text}
                        </Alert>
                    )}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        justifyContent: 'flex-start',
                        width: '100%-2rem',
                        margin: '1rem',
                        gap: '1rem',
                    }}>
                        <Box sx={{
                            height: 'auto',
                            maxWidth: '900px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            backgroundColor: 'var(--clr-white)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: '2',
                            gap: '1rem',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                                <h1 style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Κατάσταση Συνεργασίας:</h1>
                                <h2 style={{
                                    fontWeight: 'bold',
                                    padding: '0.3rem 0.7rem',
                                    backgroundColor: partnershipData.active ? 'var(--clr-darker-green)' : 'var(--clr-grey)',
                                    color: 'var(--clr-white)',
                                    borderRadius: '1rem',
                                    display: 'inline-block'
                                }}>
                                    {partnershipData.active ? 'Ενεργή' : 'Ολοκληρωμένη'}
                                </h2>
                            </Box>
                            {!partnershipData.active && userData.role === 'parent' && (
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem', alignSelf: 'center' }}
                                    startIcon={<AutorenewIcon />}
                                    onClick={() => navigate(`/applications/create-application/${partnershipData.nannyId}`)}
                                >
                                    <p className='button-text'>Ανανέωση Συνεργασίας</p>
                                </Button>
                            )}
                            <h2>Στοιχεία Συνεργάτη</h2> 
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '100%',
                                gap: '2rem',
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '0.5rem',
                                }}>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Όνομα: </strong>{partnerData.firstName} {partnerData.lastName}</p>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Τηλέφωνο: </strong>{partnerData.phoneNumber}</p>
                                    <p style={{ fontSize: '1.3rem' }}><strong>Email: </strong>{partnerData.email}</p>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonIcon />}
                                        sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }}
                                        onClick={() => navigate(`/search/view-profile/${userData.role === 'parent' ? partnershipData.nannyId : partnershipData.parentId}`)}
                                    >
                                        <p className='small-button-text'>Προβολή Προφίλ</p>
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        startIcon={<MessageIcon />}
                                        onClick={() => navigate('/messages')}
                                        sx={{
                                            backgroundColor: 'var(--clr-violet)',
                                            padding: '0.5rem 1rem'
                                    }}>
                                        <p className='small-button-text'>Αποστολή Μηνύματος</p>
                                    </Button>
                                </Box>
                            </Box>
                            <h2>Είδος Απασχόλησης & Χώρος Απασχόλησης</h2>
                            <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                                <FormEmploymentType formData={partnershipData} />
                                <FormBabysittingPlace formData={partnershipData} />
                            </Box>
                            <h2>Διάρκεια Συνεργασίας</h2>
                            <FormDateRange formData={partnershipData} setFormData={setPartnershipData} errors={{}} editMode={false} />
                            <h2>Εβδομαδιαίο Πρόγραμμα Φροντίδας Παιδιού</h2>
                            <VisualizeTimeTable formData={partnershipData} />
                        </Box>
                        <Box sx={{
                            width: { xs: '100%', md: 'auto' },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            flexGrowth: '1',
                        }}>
                            <PaymentsBox partnershipData={partnershipData} userData={userData} />
                            <RatingBox partnershipData={partnershipData} rating={partnershipData.rating} userData={userData} finishPartnership={finishPartnership} />
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}