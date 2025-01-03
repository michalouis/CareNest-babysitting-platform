import React from "react";
import Box from "@mui/material/Box";

function InfoBox(props) {
    return (
        <Box
            className='infobox'
            sx={{
                color: 'var(--clr-white)',
                bgcolor: 'var(--clr-purple-main)',
                boxShadow: 1,
                borderRadius: '1rem',
                width: { xs: '100%', sm: '50%', md: '10%' }, // Responsive width
                height: {xs: '100%', sm: '50%', md: '250px'},
                flexGrow: 1,
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
                padding: '0.5rem',
                margin: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {props.icon}
            <p style={{ marginTop: '1rem', wordWrap: 'break-word' }}>
                {props.text}
            </p>
        </Box>
    );
}

export default InfoBox;