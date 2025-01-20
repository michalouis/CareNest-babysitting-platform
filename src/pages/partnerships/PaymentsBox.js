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

// Messages for the different payment statuses for parents
const paymentStatusMessagesParent = {
    upcoming: 'Ολοκληρώστε πρώτα τη πληρωμή του προηγούμενου μήνα.',
    current: 'Όταν ολοκληρωθεί ο μήνας πατήστε πληρωμή για να στείλετε την ανταμοιβή στη νταντά σας.',
    paid: 'Η πληρωμή στάλθηκε με επιτυχία! Παρακαλώ περιμένετε την επιβεβαίωση της νταντάς.',
    verified: 'Ολοκληρωμένη - Η πληρωμή επιβεβαιώθηκε από τη νταντά.',
};

// Messages for the different payment statuses for nannies
const paymentStatusMessagesNanny = {
    upcoming: 'Αναμένεται η ολοκλήρωση της πληρωμής του προηγούμενου μήνα.',
    current: 'Η πληρωμή σας θα εμφανιστεί εδώ όταν σας σταλεί από τον γονιό.',
    paid: 'Επιβεβαιώστε την πληρωμή που λάβατε από τον γονιό.',
    verified: 'Ολοκληρωμένη! - Η πληρωμή έχει ολοκληρωθεί.',
};

const getMonthYearString = (date) => {
    return (
        <>
            {months[date.getMonth()]} <br /> {date.getFullYear()}
        </>
    );
};

// Function to generate the payment boxes for a partnership (for parents)
const generatePaymentBoxesParent = (partnershipData, handlePaymentConfirm) => {
    const fromDate = new Date(partnershipData.fromDate.year, partnershipData.fromDate.month);
    const paymentBoxes = [];
    const currentDate = new Date(fromDate);

    // for each month in the partnership, generate a payment box (date, status, pay/verify button)
    for (let i = 0; i < partnershipData.payments.length; i++) {
        // Get the payment status message for each payment
        const paymentStatus = paymentStatusMessagesParent[partnershipData.payments[i]] || 'Ολοκληρώστε τη πληρωμή του προηγούμενου μήνα';

        paymentBoxes.push(
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
                    <p style={{ fontSize: '1.2rem', width: '25%', fontWeight: 'bold', wordWrap: 'break-word' }}>{getMonthYearString(currentDate)}</p>   { /* Display the month and year of the payment */ }
                    <p style={{ fontSize: '1.2rem', width: '55%' }}>{paymentStatus}</p>  { /* Display the payment status message */ }
                    { /* Display the payment/verification button */ }
                    <Button
                        variant="contained" 
                        sx={{
                            backgroundColor: partnershipData.payments[i] === 'current' ? 'var(--clr-blue-light)' : 'var(--clr-violet)',
                            padding: '0.5rem 1rem'
                        }} 
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

// Function to generate the payment boxes for a partnership (for nannies)
const generatePaymentBoxesNanny = (partnershipData, handlePaymentVerification) => {
    const fromDate = new Date(partnershipData.fromDate.year, partnershipData.fromDate.month);
    const paymentBoxes = [];
    const currentDate = new Date(fromDate);

    // for each month in the partnership, generate a payment box (date, status, pay/verify button)
    for (let i = 0; i < partnershipData.payments.length; i++) {
        // Get the payment status message for each payment
        const paymentStatus = paymentStatusMessagesNanny[partnershipData.payments[i]] || 'Ολοκληρώστε τη πληρωμή του προηγούμενου μήνα';

        paymentBoxes.push(
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
                    <p style={{ fontSize: '1.2rem', width: '25%', fontWeight: 'bold', wordWrap: 'break-word' }}>{getMonthYearString(currentDate)}</p>   { /* Display the month and year of the payment */ }
                    <p style={{ fontSize: '1.2rem', width: '55%' }}>{paymentStatus}</p> { /* Display the payment status message */ }
                    { /* Display the payment/verification button */ }
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
                        onClick={() => handlePaymentVerification(i)}
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

// Component that displays the payments for a partnership
const PaymentsBox = ({ partnershipData, userData }) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null);

    const handlePaymentConfirm = (index) => {
        setSelectedPaymentIndex(index);
        setConfirmDialogOpen(true);
    };

    const handlePaymentVerification = (index) => {
        setSelectedPaymentIndex(index);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setSelectedPaymentIndex(null);
    };

    // Function to handle the payment confirmation
    const handleConfirmPayment = async () => {
        if (selectedPaymentIndex !== null) {
            const updatedPayments = [...partnershipData.payments];
            updatedPayments[selectedPaymentIndex] = 'paid';

            try { 
                // Update the payments array in the partnership document
                await updateDoc(doc(FIREBASE_DB, 'partnerships', partnershipData.partnershipId), {
                    payments: updatedPayments
                });
                window.location.reload();
            } catch (error) {
                console.error('Error updating payment status:', error);
            }
        }
    };

    // Function to handle the payment verification (for nannies)
    const handleConfirmVerification = async () => {
        if (selectedPaymentIndex !== null) {
            const updatedPayments = [...partnershipData.payments];
            updatedPayments[selectedPaymentIndex] = 'verified';
            if (updatedPayments[selectedPaymentIndex + 1] === 'upcoming') {
                updatedPayments[selectedPaymentIndex + 1] = 'current';
            }

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
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '2',
        }}>
            <h1>Πληρωμές</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '2rem', gap: '1rem', maxHeight: '800px', overflowY: 'auto' }}>
                {userData.role === 'parent' ? generatePaymentBoxesParent(partnershipData, handlePaymentConfirm) : generatePaymentBoxesNanny(partnershipData, handlePaymentVerification)}
            </Box>

            {/* Confirm Dialog */}
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle><strong>Επιβεβαίωση Πληρωμής</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {userData.role === 'parent' 
                            ? 'Είστε σίγουροι πως θέλετε να στείλετε την πληρωμή για αυτόν τον μήνα;'
                            : 'Είστε σίγουροι πως θέλετε να επιβεβαιώσετε την πληρωμή για αυτόν τον μήνα;'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} sx={{ color: 'var(--clr-black)'}}>
                        <p className='button-text'>Ακύρωση</p>
                    </Button>
                    <Button variant='contained' onClick={userData.role === 'parent' ? handleConfirmPayment : handleConfirmVerification} sx={{ backgroundColor: 'var(--clr-blue-light)' }}>
                        <p className='button-text'>Επιβεβαίωση</p>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentsBox;