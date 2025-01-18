import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, Alert } from '@mui/material';
import { FormDateRange, VisualizeTimeTable } from '../applications/ApplicationFields';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc, updateDoc, addDoc, collection, arrayUnion } from 'firebase/firestore';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import { FIREBASE_DB } from '../../firebase';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

function ViewContract() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const contractId = queryParams.get('contractId');
    const [contractData, setContractData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setOpenConfirmDialog(true);
            event.target.value = '';
        }
    };

    const handleConfirmUpload = async () => {
        setOpenConfirmDialog(false);
        try {
            const userDocRef = doc(FIREBASE_DB, 'contracts', contractId);
            const updateData = userData.role === 'parent' 
                ? { signedDocParent: fileName } 
                : { signedDocNanny: fileName };
            await updateDoc(userDocRef, updateData);
            await createPartnership();
            window.location.reload();
        } catch (error) {
            console.error('Error updating contract:', error);
        }
    };

    const createPartnership = async () => {
        try {
            const contractDoc = await getDoc(doc(FIREBASE_DB, 'contracts', contractId));
            if (contractDoc.exists()) {
                const contractData = contractDoc.data();
    
                if (contractData.signedDocParent && contractData.signedDocNanny) {
                    const partnershipData = { ...contractData, timestamp: new Date().toISOString() };
                    const fromDate = new Date(contractData.fromDate.year, contractData.fromDate.month);
                    const toDate = new Date(contractData.toDate.year, contractData.toDate.month);
                    const payments = [];
                    const currentDate = new Date(fromDate);
    
                    while (currentDate <= toDate) {
                        payments.push(payments.length === 0 ? 'current' : 'upcoming');
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
    
                    partnershipData.payments = payments;
    
                    const partnershipDocRef = await addDoc(collection(FIREBASE_DB, 'partnerships'), partnershipData);
                    await updateDoc(partnershipDocRef, { partnershipId: partnershipDocRef.id, active: true });
    
                    const parentDocRef = doc(FIREBASE_DB, 'users', contractData.parentId);
                    const nannyDocRef = doc(FIREBASE_DB, 'users', contractData.nannyId);
    
                    await updateDoc(parentDocRef, {
                        partnerships: arrayUnion(partnershipDocRef.id),
                        partnershipActive: true
                    });
    
                    await updateDoc(nannyDocRef, {
                        partnerships: arrayUnion(partnershipDocRef.id),
                        partnershipActive: true
                    });
                }
            } else {
                console.error('No such contract:', contractId);
            }
        } catch (error) {
            console.error('Error creating partnership:', error);
        }
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    const userSignedDoc = userData.role === 'parent' ? contractData.signedDocParent : contractData.signedDocNanny;
    const partnerSignedDoc = userData.role === 'parent' ? contractData.signedDocNanny : contractData.signedDocParent;

    return (
        <>
            <PageTitle title="CareNest - Προβολή Συμφωνητικού" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Συμφωνητικού</h1>
            {contractData && parentData && nannyData && (
                <>
                    {!userSignedDoc && (
                        userData.partnershipActive ? (
                            <Alert severity="warning" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                                Έχετε ήδη μια ενεργή συνεργασία! Πρέπει να την τερματίσετε πριν υποβάλετε νέο συμφωνητικό.
                            </Alert>
                        ) : (
                            <Alert severity="warning" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                                Παρακαλώ υπογράψτε το συμφωνητικό σας για να ξεκινήσει η συνεργασία σας.
                            </Alert>
                        )
                    )}
                    {userSignedDoc && !partnerSignedDoc && (
                        <Alert severity="success" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                            Έχετε υποβάλει το υπογεγραμμένο συμφωνητικό με επιτυχία. Μόλις το υπογράψει και ο συνεργάτης σας θα ξεκινήσει η συνεργασία σας.
                        </Alert>
                    )}
                    {userSignedDoc && partnerSignedDoc && (
                        <Alert severity="success" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                            Τα συμφωνητικά έχουν υποβληθεί με επιτυχία. Μπορείτε να δείτε τη συνεργασία σας στην ενότητα 'Συνεργασίες'.
                        </Alert>
                    )}
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
                        <Divider sx={{ width: '90%', margin: '1rem' }} />
                        {(userData.role === 'parent' && !contractData.signedDocParent) || (userData.role === 'nanny' && !contractData.signedDocNanny) ? (
                            <>
                                <h3>1. Κατεβάστε το συμφωνητικό, διαβάστε το και υπογράψτε το.</h3>
                                <Button
                                    variant="contained"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<DownloadIcon />}
                                >
                                    <p className='button-text'>Συμφωνητικό</p>
                                </Button>
                                <h3 style={{marginTop: '1rem'}}>2. Ανεβάστε το υπογεγραμμένο συμφωνητικό.</h3>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<UploadIcon />}
                                    disabled={userData.partnershipActive}
                                >
                                    <p className='button-text'>Υποβολή υπογεγραμμένο συμφωνητικό</p>
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3>Μπορείτε να κατεβάσετε το υπογεγραμμένο συμφωνητικό σας εδώ.</h3>
                                <Button
                                    variant="contained"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<DownloadIcon />}
                                >
                                    <p className='button-text'>Υπογεγραμμένο Συμφωνητικό</p>
                                </Button>
                            </>
                        )}
                    </Box>
                    <h1 style={{ textAlign: 'center' }}>Προεπισκόπηση Συμφωνητικού</h1>
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
                        <h2>Ώρες Φροντίδας Παιδιού</h2>
                        <VisualizeTimeTable formData={contractData} />
                    </Box>
                </>
            )}
            <Dialog
                open={openConfirmDialog}
                onClose={() => {
                    setOpenConfirmDialog(false);
                    setFileName('');
                }}
            >
                <DialogTitle><strong>Επιβεβαίωση</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουροι πως θέλετε να ανεβάσετε το αρχείο <strong>{fileName}</strong>;
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmUpload} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Υποβολή</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ViewContract;