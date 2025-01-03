import React from 'react';
import Box from '@mui/material/Box';
import InfoBox from './InfoBox';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import DescriptionIcon from '@mui/icons-material/Description';
import BadgeIcon from '@mui/icons-material/Badge';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import '../../../style.css';

function Info() {
    return (
        <div className='info'>
            <section id='info-parent'>
                <Box
                    sx={{
                        margin: '1rem',
                        bgcolor: 'var(--clr-white)',
                        border: '1px',
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
                        <InfoBox icon={<LocalPoliceIcon style={{ fontSize: 50 }} />} text={'Ανακαλύψτε αξιόπιστες νταντάδες στη γειτονιά σας, βασισμένες σε κριτικές και συστάσεις'} />
                        <InfoBox icon={<PersonSearchIcon style={{ fontSize: 50 }} />} text={'Βρείτε την ιδανική νταντά για εσάς μέσα από φίλτρα όπως εμπειρία, τοποθεσία και διαθεσιμότητα'} />
                        <InfoBox icon={<ConnectWithoutContactIcon style={{ fontSize: 50 }} />} text={'Κλείστε ένα ραντεβού και γνωριστείτε με τη νταντά πριν την έναρξη της συνεργασίας σας, για να νιώσετε άνετα και σίγουροι για την επιλογή σας'} />
                        <InfoBox icon={<DescriptionIcon style={{ fontSize: 50 }} />} text={'Ελέγξτε τα συμφωνητικά και οργανώστε όλες τις συνεργασίες σας μέσω της πλατφόρμας για μεγαλύτερη ασφάλεια και διαφάνεια'} />
                    </Box>
                </Box>
            </section>
            <section id='info-ntanta'>
                <Box
                    sx={{
                        margin: '1rem',
                        bgcolor: 'var(--clr-white)',
                        border: '1px',
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
                        <InfoBox icon={<BadgeIcon style={{ fontSize: 50 }} />} text={'Δημιουργήστε ένα πλήρες προφίλ, ανεβάστε τα πτυχία και τις πιστοποιήσεις σας, και μοιραστείτε τις εμπειρίες σας, για να ξεχωρίσετε και να εντυπωσιάσετε τους γονείς'} />
                        <InfoBox icon={<ForumIcon style={{ fontSize: 50 }} />} text={'Επικοινωνήστε με τους γονείς μέσω της πλατφόρμας με την αποστολή και κανονίστε ένα ραντεβού γνωριμίας για να συζητήσετε τις ανάγκες και τις προσδοκίες σας'} />
                        <InfoBox icon={<AccessTimeIcon style={{ fontSize: 50 }} />} text={'Απολαύστε την ελευθερία να επιλέξετε το πρόγραμμα και τις ώρες που ταιριάζουν καλύτερα στις ανάγκες σας για να δουλέψετε'} />
                        <InfoBox icon={<LocalAtmIcon style={{ fontSize: 50 }} />} text={'Απολαύστε άμεση και σίγουρη πληρωμή μέσω voucher στο τέλος κάθε μήνα'} />
                    </Box>
                </Box>
            </section>
        </div>
    );
}

export default Info;