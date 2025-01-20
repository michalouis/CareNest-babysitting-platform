import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PartnershipActiveContent from './PartnershipActiveContent';
import '../../style.css';

import SearchIcon from '@mui/icons-material/Search';

// LandingPage for parents when they have no active partnership (show search button to find a nanny)
function NoNannyContent({ userData }) {
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
				{/* text */}
				<h1>
					Καλησπέρα, <br />{userData.firstName}!
				</h1>
				<p style={{ fontWeight: 'bold', fontSize: 'x-large' }}>
					<br />Δεν έχετε βρει ακόμα νταντά!
				</p>
				<p style={{ fontSize: 'larger' }}>
					<br />Αναζητήστε το κατάλληλο άτομο που θα φροντίσει με αγάπη και ασφάλεια το παιδί σας.
				</p>
				{/* Search Nanny button */}
				<Button
					component={Link}
					to="/search"
					variant="contained"
					startIcon={<SearchIcon style={{ fontSize: '1.8rem'}} />}
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
				}}>
					<p className='big-button-text'>Αναζήτηση Νταντάς</p>
				</Button>
			</Box>
			{/* Hero image */}
			<Box
				sx={{
				width: { xs: '100%', md: '50%' }, // Full width for small screens, 50% for medium and up
				height: { xs: 'auto', md: '100%' }, // Auto height for small screens, full height for medium and up
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'flex-end',
				marginTop: { xs: '1rem', md: '0' },
			}}>
				<img
				src="find_nanny.jpg"
				alt="Find Nanny"
				style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
				/>
			</Box>
		</>
	);
}

function LoggedinParent({ userData }) {
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
      {!userData.partnershipActive ? (
        <NoNannyContent userData={userData} />
      ) : (
        <PartnershipActiveContent userData={userData} />
      )}
    </Box>
  );
}

export default LoggedinParent;