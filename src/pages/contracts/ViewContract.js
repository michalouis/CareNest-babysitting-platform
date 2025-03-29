import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, Alert } from '@mui/material';
import { FormDateRange } from '../applications/ApplicationFields';
import VisualizeTimeTable from '../../components/VisualizeTimeTable';
import { Link, useParams } from 'react-router-dom';
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
    const { id } = useParams(); // Get contract ID from URL
    const contractId = id;
    const [contractData, setContractData] = useState(null);
    const [parentData, setParentData] = useState(null);
    const [nannyData, setNannyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const translateMap = {
        Male: 'Male',
        Female: 'Female',
        Other: 'Other'
    };

    // Fetch contract data
    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const contractDoc = await getDoc(doc(FIREBASE_DB, 'contracts', contractId));
                if (contractDoc.exists()) {
                    const contract = contractDoc.data();
                    setContractData(contract);

                    // Fetch parent and nanny data
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

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setOpenConfirmDialog(true);
            event.target.value = '';
        }
    };

    // Handle confirm upload
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

    // Create partnership
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
    
                    // Create payment schedule
                    while (currentDate <= toDate) {
                        payments.push(payments.length === 0 ? 'current' : 'upcoming');
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
    
                    partnershipData.payments = payments;
    
                    // Add partnership to database
                    const partnershipDocRef = await addDoc(collection(FIREBASE_DB, 'partnerships'), partnershipData);
                    await updateDoc(partnershipDocRef, { partnershipId: partnershipDocRef.id, active: true });
                    
                    // Update parent & nanny to include partnershipId
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
            <PageTitle title="CareNest - View Contract" />
            <Breadcrumbs />
            <h1 style={{ marginLeft: '1rem' }}>View Contract</h1>
            {contractData && parentData && nannyData && (
                <>
                    {/* Alerts based on contract status */}
                    {!userSignedDoc && (
                        userData.partnershipActive ? (
                            <Alert severity="warning" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                                You already have an active partnership! You must terminate it before submitting a new agreement.
                            </Alert>
                        ) : (
                            <Alert severity="warning" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                                Please sign your agreement to begin your partnership.
                            </Alert>
                        )
                    )}
                    {userSignedDoc && !partnerSignedDoc && (
                        <Alert severity="success" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                            You have successfully submitted the signed agreement. Once your partner signs it, your partnership will begin.
                        </Alert>
                    )}
                    {userSignedDoc && partnerSignedDoc && (
                        <Alert severity="success" sx={{ marginTop: '1rem', alignSelf: 'center', width: 'fit-content' }}>
                            The agreements have been successfully submitted. You can view your partnership in the <Link to="/partnerships" style={{ color: 'inherit' }}>'Partnerships'</Link> section.
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
                        {/* Display contract status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {contractData.signedDocParent ? (
                                    <CheckCircleIcon sx={{ color: 'green', fontSize: '2rem' }} />
                                ) : (
                                    <CancelIcon sx={{ color: 'var(--clr-error)', fontSize: '2rem' }} />
                                )}
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Signed by Parent</p>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {contractData.signedDocNanny ? (
                                    <CheckCircleIcon sx={{ color: 'green', fontSize: '2rem' }} />
                                ) : (
                                    <CancelIcon sx={{ color: 'var(--clr-error)', fontSize: '2rem' }} />
                                )}
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Signed by Nanny</p>
                            </Box>
                        </Box>
                        <Divider sx={{ width: '90%', margin: '1rem' }} />
                        {/* Download & Upload Contract buttons */}
                        {(userData.role === 'parent' && !contractData.signedDocParent) || (userData.role === 'nanny' && !contractData.signedDocNanny) ? (
                            <>
                                <h3>1. Download the contract, read it, and sign it.</h3>
                                <Button
                                    variant="contained"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<DownloadIcon />}
                                >
                                    <p className='button-text'>Contract</p>
                                </Button>
                                <h3 style={{marginTop: '1rem'}}>2. Upload the signed contract.</h3>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<UploadIcon />}
                                    disabled={userData.partnershipActive}
                                >
                                    <p className='button-text'>Submit signed contract</p>
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </>
                        ) : (   // If both users have signed the contract, show download signed contract button
                            <>
                                <h3>You can download your signed agreement here.</h3>
                                <Button
                                    variant="contained"
                                    sx={{ marginTop: '1rem', backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}
                                    startIcon={<DownloadIcon />}
                                >
                                    <p className='button-text'>Signed Contract</p>
                                </Button>
                            </>
                        )}
                    </Box>
                    {/* Contract Preview */}
                    <h1 style={{ textAlign: 'center' }}>Contract Preview</h1>
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
                        <h2>Parent Information</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Parent's First Name" value={parentData.firstName} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Parent's Last Name" value={parentData.lastName} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Parent's Gender" value={translateMap[parentData.gender]} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Parent's Age" value={parentData.age} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Address" value={parentData.address} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Postal Code" value={parentData.postalCode} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Phone Number" value={parentData.phoneNumber} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Email" value={parentData.email} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                        </Box>
                        <h2>Nanny Information</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Nanny's First Name" value={nannyData.firstName} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Nanny's Last Name" value={nannyData.lastName} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Nanny's Gender" value={translateMap[nannyData.gender]} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Nanny's Age" value={nannyData.age} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Address" value={nannyData.address} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Postal Code" value={nannyData.postalCode} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Phone Number" value={nannyData.phoneNumber} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Email" value={nannyData.email} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                        </Box>
                        <h2>Child Information</h2>
                        <Box sx={{ display: 'grid', gridAutoRows: '1fr', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, width: '100%' }}>
                            <TextField label="Child's First Name" value={parentData.childName} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                            <TextField label="Child's Gender" value={translateMap[parentData.childGender]} fullWidth variant="filled" slotProps={{ input: { readOnly: true } }} />
                        </Box>
                        <h2>Partnership Duration</h2>
                        <FormDateRange formData={contractData} setFormData={setContractData} errors={{}} editMode={false} />
                        <h2>Weekly Child Care Schedule</h2>
                        <VisualizeTimeTable formData={contractData} />
                    </Box>
                </>
            )}
            {/* Confirm Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => {
                    setOpenConfirmDialog(false);
                    setFileName('');
                }}
            >
                <DialogTitle><strong>Confirmation</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Are you sure you want to upload the file <strong>{fileName}</strong>;
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} sx={{ color: 'var(--clr-black)' }}>
                        <p className='button-text'>Cancel</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmUpload} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }}>
                        <p className='button-text'>Submit</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ViewContract;