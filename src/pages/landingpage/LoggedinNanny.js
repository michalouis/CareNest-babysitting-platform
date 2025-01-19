import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../style.css';
import PartnershipActiveContent from './PartnershipActiveContent';

import MessageIcon from '@mui/icons-material/Message';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';

function NoJobPostingContent({ userData }) {
  return (
    <>
      <Box
        className="welcome-box-parent"
        sx={{
          width: { xs: '100%', md: '40%' }, // Full width for small screens, 40% for medium and up
          margin: '0 auto', // Center the Box
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Left-align the elements
          textAlign: { xs: 'center', md: 'left' }, // Center text for small screens, left-align for medium and up
        }}
      >
        <h1>
          Καλησπέρα, <br />{userData.firstName}!
        </h1>
        <p style={{ fontWeight: 'bold', fontSize: 'x-large' }}>
          <br />Δεν έχετε φτιάξει ακόμα την Αγγελία Εργασίας σας!
        </p>
        <p style={{ fontSize: 'larger' }}>
          <br />Φτιάξτε τώρα την αγγελία σας, για να την δουν οι γονείς και σας προσεγγίσουν.
        </p>
        <Button
          component={Link}
          to="/job-posting"
          variant="contained"
          startIcon={<WorkIcon style={{ fontSize: '1.8rem'}} />}
          sx={{
            fontSize: '1.25rem',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--clr-violet)',
            alignSelf: { xs: 'center', md: 'flex-start' }, // Center button for small screens, left-align for medium and up
            color: 'var(--clr-white)',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <p className='big-button-text'>Αγγελία Εργασίας</p>
        </Button>
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '50%' }, // Full width for small screens, 50% for medium and up
          height: { xs: 'auto', md: '100%' }, // Auto height for small screens, full height for medium and up
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginTop: { xs: '1rem', md: '0' },
        }}
      >
        <img
          src="job-posting.jpg"
          alt="Job posting"
          style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
        />
      </Box>
    </>
  );
}

function JobPostingContent({ userData }) {
  return (
    <>
      <Box
        className="welcome-box-parent"
        sx={{
          width: { xs: '100%', md: '40%' }, // Full width for small screens, 40% for medium and up
          margin: '0 auto', // Center the Box
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Left-align the elements
          textAlign: { xs: 'center', md: 'left' }, // Center text for small screens, left-align for medium and up
        }}
      >
        <h1>
          Καλησπέρα, <br />{userData.firstName}!
        </h1>
        <p style={{ fontSize: 'larger' }}>
          <br />Ελέγχετε τακτικά τα μηνύματα και τα ραντεβού γνωριμίας που λαμβάνετε από τους γονείς για αυξήσετε τις πιθανότητες εύρεσης εργασίας.
        </p>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button
            startIcon={<EventIcon style={{ fontSize: '1.8rem'}} />}
            component={Link}
            to="/meetings"
            variant="contained"
            sx={{
                fontSize: '1.25rem',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--clr-violet)',
                alignSelf: { xs: 'center', md: 'flex-start' }, // Center button for small screens, left-align for medium and up
                color: 'var(--clr-white)',
                '&:hover': {
                opacity: 0.8,
                },
            }}
            >
            <p className='button-text'>Ραντεβού Γνωριμίας</p>
            </Button>
            <Button
            startIcon={<MessageIcon style={{ fontSize: '1.8rem'}} />}
            component={Link}
            to="/messages"
            variant="contained"
            sx={{
                fontSize: '1.25rem',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--clr-blue-light)',
                alignSelf: { xs: 'center', md: 'flex-start' }, // Center button for small screens, left-align for medium and up
                color: 'var(--clr-white)',
                '&:hover': {
                opacity: 0.8,
                },
            }}
            >
            <p className='button-text'>Μηνύματα</p>
            </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '50%' }, // Full width for small screens, 50% for medium and up
          height: { xs: 'auto', md: '100%' }, // Auto height for small screens, full height for medium and up
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginTop: { xs: '1rem', md: '0' },
        }}
      >
        <img
          src="check-calendar.png"
          alt="Check Calendar"
          style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
        />
      </Box>
    </>
  );
}

function LoggedinNanny({ userData }) {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--clr-white)',
        padding: '1rem',
        margin: '1rem',
        width: '100% - 2rem',
        height: '100%',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and up
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 2,
        textAlign: 'center',
      }}
    >
      {userData.partnershipActive ? (
            <PartnershipActiveContent userData={userData} />
        ) : userData.jobPosted ? (
            <JobPostingContent userData={userData} />
        ) : (
            <NoJobPostingContent userData={userData} />
      )}
    </Box>
  );
}

export default LoggedinNanny;