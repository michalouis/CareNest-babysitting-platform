import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { VisualizeTimeTable } from '../applications/ApplicationFields';
import '../../style.css';

import GroupIcon from '@mui/icons-material/Group';

export default function PartnershipActiveContent({ userData }) {
    const [partnershipData, setPartnershipData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPartnershipData = async () => {
        try {
          const partnershipId = userData.partnerships[userData.partnerships.length - 1];
          const partnershipDoc = await getDoc(doc(FIREBASE_DB, 'partnerships', partnershipId));
          if (partnershipDoc.exists()) {
            setPartnershipData(partnershipDoc.data());
          } else {
            console.error('No such partnership:', partnershipId);
          }
        } catch (error) {
          console.error('Error fetching partnership data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPartnershipData();
    }, [userData.partnerships]);
  
    if (loading) {
      return <CircularProgress />;
    }
  
    return (
      <>
        <Box
          className="welcome-box-parent"
          sx={{
            width: { xs: '100%', md: '30%' }, // Full width for small screens, 40% for medium and up
            margin: '0 1rem', // Center the Box
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
            <br />Δείτε με μια ματιά πότε είναι τα ραντεβού φροντίδας της εβδομάδας, ή δείτε περισσότερα για τη συνεργασία σας πατώντας 'Η ενεργή συνεργασία μου'.
          </p>
          <Button
            component={Link}
            // to="/partnerships/view-partnership"
            variant="contained"
            startIcon={<GroupIcon style={{ fontSize: '1.8rem'}} />}
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
            <p className='big-button-text'>Η ενεργή συνεργασία μου</p>
          </Button>
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '65%' }, // Full width for small screens, 50% for medium and up
            height: { xs: 'auto', md: '100%' }, // Auto height for small screens, full height for medium and up
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginTop: { xs: '1rem', md: '0' },
          }}
        >
          <VisualizeTimeTable formData={partnershipData} />
        </Box>
      </>
    );
  }