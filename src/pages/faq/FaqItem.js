import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FaqItem(props) {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className='faq-question'>
                <p>{props.question}</p>
            </AccordionSummary>
            <AccordionDetails className='faq-answer'>
                <p>{props.answer}</p>
            </AccordionDetails>
        </Accordion>
    );
}

export default FaqItem;