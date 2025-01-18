import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { FormDateRange, FormTimeTable, FormEmploymentType, FormBabysittingPlace } from '../applications/ApplicationFields';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

export default function ViewPartnership() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const partnershipId = queryParams.get('partnershipId');
    const [partnershipData, setPartnershipData] = useState(null);
    const [partnerData, setPartnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Συνεργασίας" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Συνεργασίας</h1>
            {userData && partnershipData && (
                <Box sx={{
                    width: '90%',
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: 'var(--clr-white)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    boxShadow: '2',
                    margin: '1rem auto',
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: '4rem',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                        }}>
                            <p style={{ fontSize: '1.3rem' }}><strong>Όνομα {userData.role === 'parent' ? 'Νταντάς' : 'Γονέα'}: </strong>{partnerData.firstName} {partnerData.lastName}</p>
                            <p style={{ fontSize: '1.3rem' }}><strong>Τηλέφωνο {userData.role === 'parent' ? 'Νταντάς' : 'Γονέα'}: </strong>{partnerData.phoneNumber}</p>
                            <p style={{ fontSize: '1.3rem' }}><strong>Email {userData.role === 'parent' ? 'Νταντάς' : 'Γονέα'}: </strong>{partnerData.email}</p>
                        </Box>
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
                                sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem' }}
                                onClick={() => navigate(`/search/view-profile?uid=${userData.role === 'parent' ? partnershipData.nannyId : partnershipData.parentId}`)}
                            >
                                <p className='small-button-text'>Προβολή Προφίλ</p>
                            </Button>
                            <Button variant="contained" startIcon={<MessageIcon />} sx={{ backgroundColor: 'var(--clr-blue)', padding: '0.5rem 1rem'}}>
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
                    <h2>Ώρες Φροντίδας Παιδιού</h2>
                    <FormTimeTable formData={partnershipData} setFormData={setPartnershipData} nannyTimetable={partnershipData.timetable} editMode={false} errors={{}} />
                </Box>
            )}
        </>
    );
}