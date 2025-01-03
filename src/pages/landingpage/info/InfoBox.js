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
                width: '200px',
                widthmax: '100px',
                height: '300px',
                flexGrow: 1,
                justifyContent: 'center',
                alignContent: 'center',
            }}
        >
            <img className='infobox-image' src={props.imgSrc} alt={props.alt}/>
            <p>{props.text}</p>
        </Box>
    );
}

export default InfoBox;