import React from 'react';
import Box from '@mui/material/Box';
import Header from './components/Header';
import './LandingPage.css';     

function LandingPage() {
    return (
        <>
            <Header />
            <div className="landing-page-box">
                <img className="landing-page-logo" src="logo1.png" alt="CareNest Logo" />
                <h2>Η φωλιά της φροντίδας</h2>
                <p>Η πλατφόρμα που παρέχει το gov.gr, συνδέει οικογένειες με έμπειρες νταντάδες στη γειτονιά σας. Είτε αναζητάτε αξιόπιστη φροντίδα παιδιών είτε ψάχνετε για ευκαιρίες εργασίας, είμαστε εδώ για να σας βοηθήσουμε!</p>
            </div>
            {/* <Box
                sx={{
                    bgcolor: '#FFFFFF', // White background
                    padding: 2,
                    minWidth: '300px', // Minimum width
                    maxWidth: '1280px', // Maximum width
                    minHeight: '100px', // Minimum height
                    maxHeight: '150px', // Maximum height
                    marginTop: 4, // Add some top margin
                    textAlign: 'center', // Center the text
                    borderRadius: '16px', // Rounded corners
                    marginLeft: 2, // Align to the left side of the screen
                    display: 'flex', // Use flexbox
                    flexDirection: 'column', // Arrange children in a column
                    justifyContent: 'center', // Center children vertically
                }}
            >
                <h1 style={{ marginBottom: '8px' }}>CareNest: Η φωλιά της φροντίδας</h1>
                <p style={{ marginTop: '0' }}>Η πλατφόρμα που παρέχει το gov.gr, συνδέει οικογένειες με έμπειρες νταντάδες στη γειτονιά σας. Είτε αναζητάτε αξιόπιστη φροντίδα παιδιών είτε ψάχνετε για ευκαιρίες εργασίας, είμαστε εδώ για να σας βοηθήσουμε!</p>
            </Box> */}
        </>
    );
}

export default LandingPage;