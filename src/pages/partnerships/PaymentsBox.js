import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ReceiptIcon from '@mui/icons-material/Receipt';

const months = [
    'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
    'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'
];

const paymentStatusMessages = {
    upcoming: 'Ολοκληρώστε πρώτα τη πληρωμή του προηγούμενου μήνα.',
    current: 'Όταν ολοκληρωθεί ο μήνας πατήστε πληρωμή για να στείλετε την ανταμοιβή στη νταντά σας.',
    paid: 'Η πληρωμή στάλθηκε με επιτυχία! Παρακαλώ περιμένετε την επιβεβαίωση της νταντάς.',
    verified: 'Ολοκληρωμένη - Η πληρωμή επιβεβαιώθηκε από τη νταντά.',
};

const getMonthYearString = (date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const PaymentsBox = ({ partnershipData }) => {
    const generatePaymentBoxes = () => {
        const fromDate = new Date(partnershipData.fromDate.year, partnershipData.fromDate.month - 1);
        const toDate = new Date(partnershipData.toDate.year, partnershipData.toDate.month - 1);
        const paymentBoxes = [];
        const currentDate = new Date(fromDate);

        for (let i = 0; i < partnershipData.payments.length; i++) {
            const paymentStatus = paymentStatusMessages[partnershipData.payments[i]] || 'Ολοκληρώστε τη πληρωμή του προηγούμενου μήνα';

            paymentBoxes.push(
                <React.Fragment key={i}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                        <p style={{ fontSize: '1.3rem', width: '20%', fontWeight: 'bold' }}>{getMonthYearString(currentDate)}</p>
                        <p style={{ fontSize: '1.3rem', width: '60%' }}>{paymentStatus}</p>
                        <Button 
                            variant="contained" 
                            sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem' }} 
                            disabled={partnershipData.payments[i] === 'upcoming'}
                            startIcon={partnershipData.payments[i] === 'current' || partnershipData.payments[i] === 'upcoming' ? <EuroSymbolIcon /> : <ReceiptIcon />}
                        >
                            <p className='small-button-text'>
                                {partnershipData.payments[i] === 'current' || partnershipData.payments[i] === 'upcoming' ? 'Πληρωμή' : 'Απόδειξη'}
                            </p>
                        </Button>
                    </Box>
                    {i < partnershipData.payments.length - 1 && <Divider sx={{ width: '100%', backgroundColor: 'var(--clr-black)', borderBottomWidth: 2 }} />}
                </React.Fragment>
            );
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return paymentBoxes;
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
                {generatePaymentBoxes()}
            </Box>
        </Box>
    );
};

export default PaymentsBox;