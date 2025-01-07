import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function WelcomeBox({ firstName }) {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--clr-white)',
        padding: '1rem',
        margin: '1rem',
        width: 'calc(100% - 2rem)',
        height: '100%', // 200px = height of header + footer
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and up
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: 2,
        textAlign: 'center',
      }}
    >
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
				Καλησπέρα, <br />{firstName}!
			</h1>
			<p style={{ fontWeight: 'bold', fontSize: 'x-large' }}>
				<br />Δεν έχετε βρει ακόμα νταντά!
			</p>
			<p style={{ fontSize: 'larger' }}>
				<br />Αναζητήστε το κατάλληλο άτομο που θα φροντίσει με αγάπη και ασφάλεια το παιδί σας.
			</p>
			<Button
				component={Link}
				to="/search"
				variant="contained"
				sx={{
					fontSize: '1.25rem',
					marginTop: '1rem',
					padding: '0.75rem 1.5rem',
					backgroundColor: 'var(--clr-purple-main)',
					alignSelf: { xs: 'center', md: 'flex-start' }, // Center button for small screens, left-align for medium and up
					color: 'var(--clr-white)',
					'&:hover': {
					opacity: 0.8,
					},
			}}>
				Αναζήτηση Νταντάς
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
		}}>
			<img
			src="find_nanny.jpg"
			alt="Find Nanny"
			style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
			/>
		</Box>
    </Box>
  );
}

function LoggedinParent({ firstName }) {
  return (
    <Box>
      <WelcomeBox firstName={firstName} />
    </Box>
  );
}

export default LoggedinParent;