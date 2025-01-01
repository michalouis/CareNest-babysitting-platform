import React from 'react';
import Box from '@mui/material/Box';
import InfoBox from './InfoBox';
import '../../style.css';

function Info() {
    return (
        <div className='info'>
            <section id='info-parent'>
                <Box
                    sx={{
                        margin: '1rem',
                        bgcolor: 'var(--clr-white)',
                        border: '1px solid #DEC9E9',
                        boxShadow: 2,
                        borderRadius: '1rem',
                    }}
                >
                    <h1>Ως γονείς μπορείτε:</h1>
                    <Box
                        className='infobox-container'
                        sx={{
                            display: 'flex',
                            margin: '1rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <InfoBox imgSrc={'shield.png'} alt={'shield'} text={'Ανακαλύψτε αξιόπιστες νταντάδες στη γειτονιά σας, βασισμένες σε κριτικές και συστάσεις'} />
                        <InfoBox imgSrc={'magnifying-glass.png'} alt={'magnifying glass'} text={'Βρείτε την ιδανική νταντά για εσάς μέσα από φίλτρα όπως εμπειρία, τοποθεσία και διαθεσιμότητα'} />
                        <InfoBox imgSrc={'meeting.png'} alt={'two people talking'} text={'Κλείστε ένα ραντεβού και γνωριστείτε με τη νταντά πριν την έναρξη της συνεργασίας σας, για να νιώσετε άνετα και σίγουροι για την επιλογή σας'} />
                        <InfoBox imgSrc={'file.png'} alt={'files'} text={'Ελέγξτε τα συμφωνητικά και οργανώστε όλες τις συνεργασίες σας μέσω της πλατφόρμας για μεγαλύτερη ασφάλεια και διαφάνεια'} />
                    </Box>
                </Box>
            </section>
            <section id='info-ntanta'>
            <Box
                sx={{
                    margin: '1rem',
                    bgcolor: 'var(--clr-white)',
                    border: '1px solid #DEC9E9',
                    boxShadow: 2,
                    borderRadius: '1rem',
                }}
            >
                <h1>Ως νταντά μπορείτε:</h1>
                <Box
                    className='infobox-container'
                    sx={{
                        display: 'flex',
                        margin: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <InfoBox imgSrc={'profile-edit.png'} alt={'profile and pen'} text={'Δημιουργήστε ένα πλήρες προφίλ, ανεβάστε τα πτυχία και τις πιστοποιήσεις σας, και μοιραστείτε τις εμπειρίες σας, για να ξεχωρίσετε και να εντυπωσιάσετε τους γονείς'} />
                    <InfoBox imgSrc={'chatting.png'} alt={'message bubbles'} text={'Επικοινωνήστε με τους γονείς μέσω της πλατφόρμας με την αποστολή και κανονίστε ένα ραντεβού γνωριμίας για να συζητήσετε τις ανάγκες και τις προσδοκίες σας'} />
                    <InfoBox imgSrc={'time-management.png'} alt={'hand and clock'} text={'Απολαύστε την ελευθερία να επιλέξετε το πρόγραμμα και τις ώρες που ταιριάζουν καλύτερα στις ανάγκες σας για να δουλέψετε'} />
                    <InfoBox imgSrc={'money.png'} alt={'money'} text={'Απολαύστε άμεση και σίγουρη πληρωμή μέσω voucher στο τέλος κάθε μήνα'} />
                </Box>
            </Box>
        </section>
    </div>
    );
}

export default Info;