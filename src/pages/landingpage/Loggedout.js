import React from 'react';
import { Box, Button } from '@mui/material';
import ContactBox from '../contact/ContactBox';
import { Link } from 'react-router-dom';
import '../../style.css';
import './landingPage.css';

import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import DescriptionIcon from '@mui/icons-material/Description';
import BadgeIcon from '@mui/icons-material/Badge';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

////////////////// WECLOME BOX //////////////////

function SignupButton() {
    return (
        <Button
            component={Link}
            to="/signup"
            variant='contained'
            sx={{
                marginTop: '1rem',
                minWidth: '150px',
                minHeight: '50px',
                bgcolor: 'var(--clr-violet)', // Background color
                color: 'var(--clr-white)', // Text color
                '&:hover': {
                    opacity: 0.8, // Make the button more transparent on hover
                },
            }}
        >
            <p className='big-button-text'>Εγγραφή</p>
        </Button>
    )
}

function LearnMoreButton({ to, text}) {
    return (
        <Button
            component="a"
            href={to}
            variant='outlined'
            sx={{
                display: 'flex',
                justifyContent: 'center',
                color: 'var(--clr-purple-main)',
                borderColor: 'var(--clr-purple-main)',
                '&:hover': {
                    bgcolor: 'var(--clr-purple-light)',
                    borderColor: 'var(--clr-purple-main)',
                },
                borderWidth: '2px',
            }}
        >
            <p className='button-text'>{text}</p>
        </Button>
    );
}

function WelcomeBox() {
    return (
        <Box className='welcome-box' sx={{
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            margin: '1rem',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px',
            boxShadow: 2,
        }}>
            {/* Welcome Text */}
            <img className="welcome-logo" src="logo1.png" alt="CareNest Logo" />
            <h2>Η φωλιά της φροντίδας</h2>
            <p>
                Η πλατφόρμα που παρέχει το gov.gr, συνδέει οικογένειες με έμπειρες νταντάδες στη
                γειτονιά σας. Είτε αναζητάτε αξιόπιστη φροντίδα παιδιών είτε ψάχνετε για ευκαιρίες
                εργασίας, είμαστε εδώ για να σας βοηθήσουμε!
            </p>

            {/* Learn More Text */}
            <h1>Μάθετε πως λειτουργεί!</h1>
            <p>
                Ανακαλύψτε πώς η πλατφόρμα CareNest μπορεί να σας βοηθήσει! Μάθετε περισσότερα για
                το πώς μπορείτε να συνδέσετε την οικογένειά σας με έμπειρες νταντάδες ή να βρείτε
                την ιδανική ευκαιρία εργασίας στον χώρο της φροντίδας.
            </p>
            <Box
                sx={{
                    marginTop: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    gap: 5,
                }}
            >
                <LearnMoreButton to="#info-parent" text="Για τους γονείς" />
                <LearnMoreButton to="#info-ntanta" text="Για τις νταντάδες" />
            </Box>

            {/* Signup Text */}
            <h1>Η φροντίδα των μικρών μας φίλων ξεκινάει εδώ!</h1>
            <p>
                Η εγγραφή σας στην πλατφόρμα γίνεται εύκολα και γρήγορα μέσω του TaxisNet και διαρκεί
                λιγότερο από 10 λεπτά! Είτε είστε γονέας είτε νταντά, αποκτήστε πρόσβαση στις υπηρεσίες
                μας άμεσα και με ασφάλεια.
            </p>
            <SignupButton />
            <img className="right-aligned-image" src="mom.png" alt="Nanny with kids" />
            <img className="left-aligned-image" src="mom2.png" alt="Nanny with kids" />
        </Box>
    );
}

////////////////// LEARN MORE BOXES //////////////////

// Information for Parents
const infoParents = [
    { icon: <LocalPoliceIcon style={{ fontSize: 50 }} />, text: 'Ανακαλύψτε αξιόπιστες νταντάδες στη γειτονιά σας, βασισμένες σε κριτικές και συστάσεις' },
    { icon: <PersonSearchIcon style={{ fontSize: 50 }} />, text: 'Βρείτε την ιδανική νταντά για εσάς μέσα από φίλτρα όπως εμπειρία, τοποθεσία και διαθεσιμότητα' },
    { icon: <ConnectWithoutContactIcon style={{ fontSize: 50 }} />, text: 'Κλείστε ένα ραντεβού και γνωριστείτε με τη νταντά πριν την έναρξη της συνεργασίας σας, για να νιώσετε άνετα και σίγουροι για την επιλογή σας' },
    { icon: <DescriptionIcon style={{ fontSize: 50 }} />, text: 'Ελέγξτε τα συμφωνητικά και οργανώστε όλες τις συνεργασίες σας μέσω της πλατφόρμας για μεγαλύτερη ασφάλεια και διαφάνεια' }
];

// Information for Nannies
const infoNannies = [
    { icon: <BadgeIcon style={{ fontSize: 50 }} />, text: 'Δημιουργήστε ένα πλήρες προφίλ, ανεβάστε τα πτυχία και τις πιστοποιήσεις σας, και μοιραστείτε τις εμπειρίες σας, για να ξεχωρίσετε και να εντυπωσιάσετε τους γονείς' },
    { icon: <ForumIcon style={{ fontSize: 50 }} />, text: 'Επικοινωνήστε με τους γονείς μέσω της πλατφόρμας με την αποστολή και κανονίστε ένα ραντεβού γνωριμίας για να συζητήσετε τις ανάγκες και τις προσδοκίες σας' },
    { icon: <AccessTimeIcon style={{ fontSize: 50 }} />, text: 'Απολαύστε την ελευθερία να επιλέξετε το πρόγραμμα και τις ώρες που ταιριάζουν καλύτερα στις ανάγκες σας για να δουλέψετε' },
    { icon: <LocalAtmIcon style={{ fontSize: 50 }} />, text: 'Απολαύστε άμεση και σίγουρη πληρωμή μέσω voucher στο τέλος κάθε μήνα' }
];

// Information Box Component
function InfoBox({ info }) {
    return (
        <Box
            className="infobox"
            sx={{
                color: 'var(--clr-white)',
                bgcolor: 'var(--clr-purple-main)',
                boxShadow: 1,
                borderRadius: '1rem',
                width: { xs: '100%', sm: '40%', md: '20%' }, // Responsive width
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1rem',
                margin: '1rem',
                wordWrap: 'break-word',
            }}
        >
            {info.icon}
            <p style={{ marginTop: '1rem', wordWrap: 'break-word', textAlign: 'center' }}>
                {info.text}
            </p>
        </Box>
    );
}

// Learn More Section Component
function LearnMoreSection({ section, title, info }) {
    return (
        <section id={section}>
            <Box
                className='info'
                sx={{
                    margin: '1rem',
                    bgcolor: 'var(--clr-white)',
                    border: '1px',
                    boxShadow: 2,
                    borderRadius: '1rem',
                }}
            >
                <h1>{title}</h1>
                <Box
                    className='infobox-container'
                    sx={{
                        display: 'flex',
                        padding: '1rem',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    {info.map((item, index) => (
                        <InfoBox key={index} info={item} />
                    ))}
                </Box>
            </Box>
        </section>
    );
}

////////////////// MAIN FUNCTION //////////////////

function Loggedout() {
    return (
        <>
            <WelcomeBox />
            <LearnMoreSection section="info-parent" title="Ως γονείς μπορείτε:" info={infoParents} />
            <LearnMoreSection section="info-ntanta" title="Ως νταντά μπορείτε:" info={infoNannies} />
            <ContactBox />
        </>
    );
}

export default Loggedout;