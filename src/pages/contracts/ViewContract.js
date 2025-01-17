import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import { FIREBASE_DB } from '../../firebase';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { FormDateRange, FormTimeTable } from '../applications/ApplicationFields';

function ViewContract() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const contractId = queryParams.get('contractId');
    const [contractData, setContractData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const translateMap = {
        Male: 'Άνδρας',
        Female: 'Γυναίκα',
        Other: 'Άλλο'
    };

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const contractDoc = await getDoc(doc(FIREBASE_DB, 'contracts', contractId));
                if (contractDoc.exists()) {
                    const contract = contractDoc.data();
                    setContractData(contract);

                    const parentDoc = await getDoc(doc(FIREBASE_DB, 'users', contract.parentId));
                    if (parentDoc.exists()) {
                        setParentData(parentDoc.data());
                    } else {
                        console.error('No such parent:', contract.parentId);
                    }

                    const nannyDoc = await getDoc(doc(FIREBASE_DB, 'users', contract.nannyId));
                    if (nannyDoc.exists()) {
                        setNannyData(nannyDoc.data());
                    } else {
                        console.error('No such nanny:', contract.nannyId);
                    }
                } else {
                    console.error('No such contract:', contractId);
                }
            } catch (error) {
                console.error('Error fetching contract data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (contractId) {
            fetchContractData();
        }
    }, [contractId]);

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Συμφωνητικού" />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Συμφωνητικού</h1>
            <Breadcrumbs showPopup={true} />
            {contractData && parentData && nannyData && (
                <>
                    <Box sx={{
                        width: '90%',
                        maxWidth: '1080px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--clr-white)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        boxShadow: '2',
                        margin: '1rem auto'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {contractData.signedDocParent ? (
                                    <CheckCircleIcon sx={{ color: 'green', fontSize: '2rem' }} />
                                ) : (
                                    <CancelIcon sx={{ color: 'red', fontSize: '2rem' }} />
                                )}
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Υπογεγραμμένο από Γονέα</p>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {contractData.signedDocNanny ? (
                                    <CheckCircleIcon sx={{ color: 'green', fontSize: '2rem' }} />
                                ) : (
                                    <CancelIcon sx={{ color: 'red', fontSize: '2rem' }} />
                                )}
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Υπογεγραμμένο από Νταντά</p>
                            </Box>
                        </Box>
                        
                    </Box>
                    <Box sx={{
                        width: '90%',
                        maxWidth: '1080px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        backgroundColor: 'var(--clr-white)',
                        padding: '2rem 1rem',
                        borderRadius: '1rem',
                        boxShadow: '2',
                        margin: '1rem auto'
                    }}>
                        <h2>Πληροφορίες Γονέα</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Όνομα Γονέα" value={parentData.firstName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Επώνυμο Γονέα" value={parentData.lastName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Φύλο Γονέα" value={translateMap[parentData.gender]} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Ηλικία Γονέα" value={parentData.age} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Διεύθυνση" value={parentData.address} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Ταχυδρομικός Κώδικας" value={parentData.postalCode} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Τηλέφωνο" value={parentData.phoneNumber} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Email" value={parentData.email} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                        </Box>
                        <h2>Πληροφορίες Νταντάς</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Όνομα Νταντάς" value={nannyData.firstName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Επώνυμο Νταντάς" value={nannyData.lastName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Φύλο Νταντάς" value={translateMap[nannyData.gender]} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Ηλικία Νταντάς" value={nannyData.age} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Διεύθυνση" value={nannyData.address} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Ταχυδρομικός Κώδικας" value={nannyData.postalCode} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Τηλέφωνο" value={nannyData.phoneNumber} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Email" value={nannyData.email} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                        </Box>
                        <h2>Πληροφορίες Παιδιού</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Όνομα Παιδιού" value={parentData.childName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <TextField label="Φύλο Παιδιού" value={translateMap[parentData.childGender]} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                        </Box>
                        <h2>Διάρκεια Συνεργασίας</h2>
                        <FormDateRange formData={contractData} setFormData={setContractData} errors={{}} editMode={false} />
                        <h2>Διαθεσιμότητα</h2>
                        <FormTimeTable formData={contractData} setFormData={setContractData} nannyTimetable={contractData.timetable} editMode={false} errors={{}} />
                    </Box>
                </>
            )}
        </>
    );
}

export default ViewContract;