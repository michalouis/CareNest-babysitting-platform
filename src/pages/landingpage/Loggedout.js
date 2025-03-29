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
            <p className='big-button-text'>Sign Up</p>
        </Button>
    )
}

function LearnMoreButton({ to, text }) {
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

// Welcome's user, signup button, learn more buttons (scroll to learn more)
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
            <h2>A Safe Haven for Your Little Ones</h2>
            <p>
                The platform provided by gov.gr connects families with experienced nannies in
                your neighborhood. Whether you are looking for reliable childcare or searching for
                job opportunities, we are here to help you!
            </p>

            {/* Learn More Text */}
            <h1>Learn How It Works!</h1>
            <p>
                Discover how the CareNest platform can help you! Learn more about
                how you can connect your family with experienced nannies or find
                the ideal job opportunity in the field of care.
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
                <LearnMoreButton to="#info-parent" text="For Parents" />
                <LearnMoreButton to="#info-ntanta" text="For Nannies" />
            </Box>

            {/* Signup Text */}
            <h1>The care of our little friends starts here!</h1>
            <p>
                Signing up on the platform is easy and fast through TaxisNet and takes
                less than 10 minutes! Whether you are a parent or a nanny, gain access to our services
                immediately and securely.
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
    { icon: <LocalPoliceIcon style={{ fontSize: 50 }} />, text: 'Discover reliable nannies in your neighborhood, based on reviews and recommendations' },
    { icon: <PersonSearchIcon style={{ fontSize: 50 }} />, text: 'Find the ideal nanny for you through filters such as experience, location, and availability' },
    { icon: <ConnectWithoutContactIcon style={{ fontSize: 50 }} />, text: 'Book an appointment and meet the nanny before starting the collaboration, so you can feel comfortable and confident in your choice' },
    { icon: <DescriptionIcon style={{ fontSize: 50 }} />, text: 'Check the agreements and organize all your collaborations through the platform for greater security and transparency' }
];

// Information for Nannies
const infoNannies = [
    { icon: <BadgeIcon style={{ fontSize: 50 }} />, text: 'Create a complete profile, upload your degrees and certifications, and share your experiences to stand out and impress parents' },
    { icon: <ForumIcon style={{ fontSize: 50 }} />, text: 'Communicate with parents through the platform by sending messages and arrange a meeting to discuss your needs and expectations' },
    { icon: <AccessTimeIcon style={{ fontSize: 50 }} />, text: 'Enjoy the freedom to choose the schedule and hours that best fit your needs to work' },
    { icon: <LocalAtmIcon style={{ fontSize: 50 }} />, text: 'Enjoy immediate and secure payment via voucher at the end of each month' }
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
            <LearnMoreSection section="info-parent" title="As parents, you can:" info={infoParents} />
            <LearnMoreSection section="info-ntanta" title="As a nanny, you can:" info={infoNannies} />
            <ContactBox />
        </>
    );
}

export default Loggedout;