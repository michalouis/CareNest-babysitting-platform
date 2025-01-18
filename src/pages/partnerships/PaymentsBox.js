import React, { useState } from 'react';
import { Box, Button, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

const paymentStatusMessagesParent = {
    upcoming: 'Ολοκληρώστε πρώτα τη πληρωμή του προηγούμενου μήνα.',
    current: 'Όταν ολοκληρωθεί ο μήνας πατήστε πληρωμή για να στείλετε την ανταμοιβή στη νταντά σας.',
    paid: 'Η πληρωμή στάλθηκε με επιτυχία! Παρακαλώ περιμένετε την επιβεβαίωση της νταντάς.',
    verified: 'Ολοκληρωμένη - Η πληρωμή επιβεβαιώθηκε από τη νταντά.',
};

const paymentStatusMessagesNanny = {
    upcoming: 'Αναμένεται η ολοκλήρωση της πληρωμής του προηγούμενου μήνα.',
    current: 'Η πληρωμή σας θα εμφανιστεί εδώ όταν σας σταλεί από τον γονιό.',
    paid: 'Επιβεβαιώστε την πληρωμή που λάβατε από τον γονιό.',
    verified: 'Ολοκληρωμένη! - Η πληρωμή έχει ολοκληρωθεί.',
};

const getMonthYearString = (date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const generatePaymentBoxesParent = (partnershipData, handlePaymentConfirm) => {
    const fromDate = new Date(partnershipData.fromDate.year, partnershipData.fromDate.month - 1);
    const paymentBoxes = [];
    const currentDate = new Date(fromDate);

    for (let i = 0; i < partnershipData.payments.length; i++) {
        const paymentStatus = paymentStatusMessagesParent[partnershipData.payments[i]] || 'Ολοκληρώστε τη πληρωμή του προηγούμενου μήνα';

        paymentBoxes.push(
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                    <p style={{ fontSize: '1.3rem', width: '20%', fontWeight: 'bold' }}>{getMonthYearString(currentDate)}</p>
                    <p style={{ fontSize: '1.3rem', width: '60%' }}>{paymentStatus}</p>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }} 
                        disabled={partnershipData.payments[i] === 'upcoming'}
                        startIcon={partnershipData.payments[i] === 'current' || partnershipData.payments[i] === 'upcoming' ? <EuroSymbolIcon /> : <ReceiptIcon />}
                        onClick={partnershipData.payments[i] === 'current' ? () => handlePaymentConfirm(i) : null}
                    >
                        <p className='button-text'>
                            {partnershipData.payments[i] === 'current' || partnershipData.payments[i] === 'upcoming' ? 'Πληρωμή' : 'Απόδειξη'}
                        </p>
                    </Button>
                </Box>
                {i < partnershipData.payments.length - 1 && <Divider sx={{ width: '100%', backgroundColor: 'var(--clr-black)', borderBottomWidth: 2 }} />}
            </>
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return paymentBoxes;
};

const generatePaymentBoxesNanny = (partnershipData) => {
    const fromDate = new Date(partnershipData.fromDate.year, partnershipData.fromDate.month - 1);
    const paymentBoxes = [];
    const currentDate = new Date(fromDate);

    for (let i = 0; i < partnershipData.payments.length; i++) {
        const paymentStatus = paymentStatusMessagesNanny[partnershipData.payments[i]] || 'Ολοκληρώστε τη πληρωμή του προηγούμενου μήνα';

        paymentBoxes.push(
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                    <p style={{ fontSize: '1.3rem', width: '20%', fontWeight: 'bold' }}>{getMonthYearString(currentDate)}</p>
                    <p style={{ fontSize: '1.3rem', width: '60%' }}>{paymentStatus}</p>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }} 
                        disabled={partnershipData.payments[i] === 'upcoming' || partnershipData.payments[i] === 'current'}
                        startIcon={<PaymentsIcon />}
                    >
                        <p className='button-text'>Voucher</p>
                    </Button>
                </Box>
                {partnershipData.payments[i] === 'paid' && (
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: 'var(--clr-blue-light)', padding: '0.5rem 1rem', width: 'fit-content', alignSelf: 'flex-end' }}
                    >
                        <p className='small-button-text'>Επιβεβαίωση Πληρωμής</p>
                    </Button>
                )}
                {i < partnershipData.payments.length - 1 && <Divider sx={{ width: '100%', backgroundColor: 'var(--clr-black)', borderBottomWidth: 2 }} />}
            </>
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return paymentBoxes;
};

const PaymentsBox = ({ partnershipData, userData }) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null);

    const handlePaymentConfirm = (index) => {
        setSelectedPaymentIndex(index);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setSelectedPaymentIndex(null);
    };

    const handleConfirmPayment = async () => {
        if (selectedPaymentIndex !== null) {
            const updatedPayments = [...partnershipData.payments];
            updatedPayments[selectedPaymentIndex] = 'paid';

            try {
                await updateDoc(doc(FIREBASE_DB, 'partnerships', partnershipData.partnershipId), {
                    payments: updatedPayments
                });
                window.location.reload();
            } catch (error) {
                console.error('Error updating payment status:', error);
            }
        }
    };

    return (
        <Box sx={{
            width: '90%',
            maxWidth: '900px',
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
            <h1>Πληρωμές</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '2rem', gap: '1rem' }}>
                {userData.role === 'parent' ? generatePaymentBoxesParent(partnershipData, handlePaymentConfirm) : generatePaymentBoxesNanny(partnershipData)}
            </Box>
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Επιβεβαίωση Πληρωμής</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Είστε σίγουροι πως θέλετε να στείλετε την πληρωμή για αυτόν τον μήνα;
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-black)'}}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={handleConfirmPayment} sx={{ backgroundColor: 'var(--clr-violet)' }}>
                        <p className='button-text'>Επιβεβαίωση</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentsBox;