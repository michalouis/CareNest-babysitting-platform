import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import FaqItem from '../../faq/FaqItem';

const faqItems = [
    { question: "Question 1", answer: "Answer 1" },
    { question: "Question 2", answer: "Answer 2" },
    { question: "Question 3", answer: "Answer 3" },
    { question: "Question 4", answer: "Answer 4" }
];

function Information({ onInfoRead, showError }) {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
        onInfoRead(event.target.checked);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '80%', maxWidth: '1000px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Insert text here.</p>
                {faqItems.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleCheckboxChange} sx={{ color: showError && !checked ? 'var(--clr-error)' : 'var(--clr-black)' }} />}
                    label="I have read and understood the information"
                    sx={{ marginTop: '2rem', color: showError && !checked ? 'var(--clr-error)' : 'var(--clr-black)' }}
                />
            </Box>
        </Box>
    );
}

export default Information;